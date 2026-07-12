from __future__ import annotations

import copy
import json
import os
import subprocess
import sys
import tempfile
import unittest
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from unittest.mock import patch

import pyarrow as pa
from pyiceberg.table import Table

from odd_world_model_storage.canonical import canonical_json, sha256_digest
from odd_world_model_storage.cli import handle_input
from odd_world_model_storage.config import StorageConfig
from odd_world_model_storage.duckdb_proof import (
    EXPECTED_DUCKDB_VERSION,
    EXPECTED_ICEBERG_EXTENSION_VERSION,
)
from odd_world_model_storage.models import (
    PhysicalCutWriteRequest,
    SemanticCutAttestation,
    attestation_digest_for,
    request_digest_for,
)
from odd_world_model_storage.service import dispatch
from odd_world_model_storage.store import (
    PHYSICAL_ARROW_SCHEMA,
    PyIcebergPhysicalCutStore,
    StorageEffectError,
)


def write_payload(
    request_id: str = "write:cut-001",
    cut_ref: str = "semantic-cut:trade:v1",
    *,
    table_names: tuple[str, ...] = ("wm.object_cuts", "wm.semantic_links"),
    value: str = "accepted",
) -> dict[str, object]:
    payload: dict[str, object] = {
        "schema_kind": "odd_world_model.physical_cut_write_request",
        "schema_version": "v1",
        "operation": "write_cut",
        "write_request_id": request_id,
        "admission_ref": f"abg-admission:{request_id}",
        "storage_profile_ref": "local-pyiceberg-v1",
        "semantic_cut": {
            "semantic_cut_ref": cut_ref,
            "semantic_cut_digest": sha256_digest({"cut_ref": cut_ref, "value": value}),
            "cut_role": "source_domain",
            "cut_version": "v1",
            "governing_refs": ["specification/PRODUCT.md"],
            "source_refs": ["source:fixture"],
            "authority_refs": ["authority:test"],
            "graph_invocation_ref": "graph-invocation:test",
            "abg_event_refs": ["abg-event:test"],
            "dependency_identities": ["pyiceberg:0.11.1"],
            "temporal_coordinates": {"observed_at": "2026-07-12T00:00:00Z"},
            "fidelity": "exact_payload",
            "losses": [],
            "exclusions": [],
            "gap_refs": [],
        },
        "tables": [
            {
                "table_identifier": table_name,
                "records": [
                    {
                        "record_id": f"{request_id}:{index}",
                        "record_kind": table_name.rsplit(".", 1)[1],
                        "payload": {"cut_ref": cut_ref, "value": value, "index": index},
                    }
                ],
            }
            for index, table_name in enumerate(table_names)
        ],
        "admitted_at": "2026-07-12T00:00:00Z",
    }
    payload["request_digest"] = request_digest_for(payload)
    return payload


class CanonicalJsonTests(unittest.TestCase):
    def test_digest_is_key_order_independent_and_rejects_non_finite_numbers(self) -> None:
        self.assertEqual(
            sha256_digest({"b": [2, {"z": True}], "a": 1}),
            sha256_digest({"a": 1, "b": [2, {"z": True}]}),
        )
        with self.assertRaises(ValueError):
            canonical_json({"not_finite": float("nan")})

    def test_local_config_rejects_non_local_catalog_and_warehouse_schemes(self) -> None:
        with self.assertRaisesRegex(ValueError, "sqlite catalog"):
            StorageConfig("bad", "https://catalog", "file:///warehouse", Path("/tmp/receipts"))
        with self.assertRaisesRegex(ValueError, "file warehouse"):
            StorageConfig("bad", "sqlite:////tmp/catalog.db", "s3://warehouse", Path("/tmp/receipts"))

    def test_request_digest_is_over_the_received_payload_before_defaults_are_injected(self) -> None:
        payload = write_payload(request_id="write:omitted-optionals-001")
        payload["semantic_cut"].pop("temporal_coordinates")
        payload["semantic_cut"].pop("graph_invocation_ref")
        payload["request_digest"] = request_digest_for(payload)

        request = PhysicalCutWriteRequest.model_validate(payload)

        self.assertEqual(request.request_digest, payload["request_digest"])
        self.assertEqual(request.semantic_cut.temporal_coordinates, {})
        self.assertIsNone(request.semantic_cut.graph_invocation_ref)

    def test_uppercase_digest_is_rejected_without_case_mutating_echo(self) -> None:
        payload = write_payload(request_id="write:uppercase-digest-001")
        digest = str(payload["request_digest"])
        payload["request_digest"] = f"sha256:{digest[7:].upper()}"

        with tempfile.TemporaryDirectory(prefix="odd-wm-uppercase-") as root:
            result = dispatch(payload, StorageConfig.local(Path(root)))

        self.assertEqual(result["effect_status"], "failed")
        self.assertEqual(result["gap"]["gap_type"], "invalid_write_request")
        self.assertNotIn("request_digest", result)


class StorageEffectTests(unittest.TestCase):
    def setUp(self) -> None:
        self.temporary = tempfile.TemporaryDirectory(prefix="odd-wm-storage-")
        self.root = Path(self.temporary.name)
        self.config = StorageConfig.local(self.root)

    def tearDown(self) -> None:
        self.temporary.cleanup()

    def test_multi_table_write_returns_reproduced_snapshot_observation(self) -> None:
        result = dispatch(write_payload(), self.config)

        self.assertEqual(result["effect_status"], "written")
        attestation = result["attestation"]
        self.assertEqual(len(attestation["snapshots"]), 2)
        self.assertEqual(
            {item["table_identifier"] for item in attestation["snapshots"]},
            {"wm.object_cuts", "wm.semantic_links"},
        )
        self.assertTrue(attestation["attestation_digest"].startswith("sha256:"))
        self.assertNotIn("verification", attestation)
        self.assertEqual(result["effect_observation"]["observation_status"], "reproduced")
        self.assertEqual(
            result["effect_observation"]["subject_attestation_digest"],
            attestation["attestation_digest"],
        )
        self.assertTrue(
            all(
                item["status"] == "reproduced"
                for item in result["effect_observation"]["snapshot_observations"]
            )
        )

        verify = dispatch(
            {
                "schema_kind": "odd_world_model.physical_cut_verify_request",
                "schema_version": "v1",
                "operation": "verify_cut",
                "verification_request_id": "verify:cut-001",
                "storage_profile_ref": "local-pyiceberg-v1",
                "attestation": attestation,
            },
            self.config,
        )
        self.assertEqual(verify["effect_observation"]["observation_status"], "reproduced")
        self.assertTrue(
            all(
                item["status"] == "reproduced"
                for item in verify["effect_observation"]["snapshot_observations"]
            )
        )
        self.assertTrue(
            all(
                "DuckDB reproduced the exact snapshot" in item["message"]
                for item in verify["effect_observation"]["snapshot_observations"]
            )
        )

    def test_attestation_digest_accepts_schema_optional_fields_as_received(self) -> None:
        result = dispatch(
            write_payload(
                request_id="write:attestation-optionals-001",
                table_names=("wm.object_cuts",),
            ),
            self.config,
        )
        payload = copy.deepcopy(result["attestation"])
        payload.pop("graph_invocation_ref")
        payload.pop("temporal_coordinates")
        payload["attestation_digest"] = attestation_digest_for(payload)

        attestation = SemanticCutAttestation.model_validate(payload)

        self.assertIsNone(attestation.graph_invocation_ref)
        self.assertEqual(attestation.temporal_coordinates, {})

    def test_duckdb_runtime_identity_is_exact_and_addressable(self) -> None:
        identity = PyIcebergPhysicalCutStore(self.config).duckdb.runtime_identity

        self.assertEqual(identity.engine_version, EXPECTED_DUCKDB_VERSION)
        self.assertEqual(identity.extension_version, EXPECTED_ICEBERG_EXTENSION_VERSION)
        self.assertRegex(identity.extension_sha256, r"^[0-9a-f]{64}$")
        self.assertEqual(identity.installed_from, "core")

    def test_repeated_identical_request_is_idempotent(self) -> None:
        payload = write_payload()
        first = dispatch(payload, self.config)
        second = dispatch(payload, self.config)

        self.assertEqual(first["effect_status"], "written")
        self.assertEqual(second["effect_status"], "idempotent")
        self.assertEqual(first["attestation"], second["attestation"])

    def test_concurrent_identical_process_requests_are_serialized_by_identity(self) -> None:
        payload_line = canonical_json(
            write_payload(request_id="write:concurrent-idempotency-001")
        ) + "\n"
        env = dict(os.environ)
        env.update(self.config.as_env())

        def invoke() -> subprocess.CompletedProcess[str]:
            return subprocess.run(
                [sys.executable, "-m", "odd_world_model_storage"],
                input=payload_line,
                text=True,
                capture_output=True,
                env=env,
                check=False,
            )

        with ThreadPoolExecutor(max_workers=2) as executor:
            completed = list(executor.map(lambda _: invoke(), range(2)))

        self.assertTrue(all(result.returncode == 0 for result in completed))
        self.assertTrue(all(result.stderr == "" for result in completed))
        responses = [json.loads(result.stdout) for result in completed]
        self.assertEqual(
            sorted(response["effect_status"] for response in responses),
            ["idempotent", "written"],
        )
        self.assertEqual(responses[0]["attestation"], responses[1]["attestation"])

    def test_reused_request_id_with_changed_content_fails_closed(self) -> None:
        first_payload = write_payload()
        self.assertEqual(dispatch(first_payload, self.config)["effect_status"], "written")

        changed = copy.deepcopy(first_payload)
        changed["tables"][0]["records"][0]["payload"]["value"] = "changed"
        changed["request_digest"] = request_digest_for(changed)
        result = dispatch(changed, self.config)

        self.assertEqual(result["effect_status"], "failed")
        self.assertEqual(result["gap"]["gap_type"], "idempotency_conflict")
        self.assertFalse(result["gap"]["retryable"])

    def test_receipt_loss_cannot_recover_a_changed_admission_envelope(self) -> None:
        original = write_payload(request_id="write:receipt-loss-001")
        self.assertEqual(dispatch(original, self.config)["effect_status"], "written")
        receipts = list(self.config.receipt_root.glob("*.json"))
        self.assertEqual(len(receipts), 1)
        receipts[0].unlink()

        changed = copy.deepcopy(original)
        changed["admission_ref"] = "abg-admission:changed"
        changed["request_digest"] = request_digest_for(changed)
        result = dispatch(changed, self.config)

        self.assertEqual(result["effect_status"], "failed")
        self.assertEqual(result["gap"]["gap_type"], "idempotency_payload_conflict")
        self.assertFalse(result["gap"]["retryable"])

    def test_exact_historical_snapshot_verifies_after_later_commit(self) -> None:
        first = dispatch(
            write_payload(
                request_id="write:history-001",
                cut_ref="semantic-cut:history:v1",
                table_names=("wm.object_cuts",),
                value="first",
            ),
            self.config,
        )
        second = dispatch(
            write_payload(
                request_id="write:history-002",
                cut_ref="semantic-cut:history:v2",
                table_names=("wm.object_cuts",),
                value="second",
            ),
            self.config,
        )
        self.assertNotEqual(
            first["attestation"]["snapshots"][0]["snapshot_id"],
            second["attestation"]["snapshots"][0]["snapshot_id"],
        )

        verify = dispatch(
            {
                "schema_kind": "odd_world_model.physical_cut_verify_request",
                "schema_version": "v1",
                "operation": "verify_cut",
                "verification_request_id": "verify:history-001",
                "storage_profile_ref": "local-pyiceberg-v1",
                "attestation": first["attestation"],
            },
            self.config,
        )
        self.assertEqual(verify["effect_observation"]["observation_status"], "reproduced")
        self.assertIn(
            "DuckDB reproduced the exact snapshot",
            verify["effect_observation"]["snapshot_observations"][0]["message"],
        )

    def test_interleaved_commit_cannot_retarget_the_written_snapshot_binding(self) -> None:
        own = PhysicalCutWriteRequest.model_validate(
            write_payload(
                request_id="write:interleaved-own-001",
                cut_ref="semantic-cut:interleaved:own",
                table_names=("wm.object_cuts",),
                value="own",
            )
        )
        concurrent = PhysicalCutWriteRequest.model_validate(
            write_payload(
                request_id="write:interleaved-concurrent-001",
                cut_ref="semantic-cut:interleaved:concurrent",
                table_names=("wm.object_cuts",),
                value="concurrent",
            )
        )
        store = PyIcebergPhysicalCutStore(self.config)
        original_append = Table.append
        observed: dict[str, str] = {}

        def interleaved_append(
            table: Table,
            frame: pa.Table,
            snapshot_properties: dict[str, str] | None = None,
            branch: str | None = "main",
        ) -> None:
            properties = snapshot_properties or {}
            original_append(table, frame, properties, branch)
            if properties.get("write_request_id") != own.write_request_id:
                return
            current = table.current_snapshot()
            self.assertIsNotNone(current)
            observed["own"] = str(current.snapshot_id)
            other_table = store.catalog.load_table("wm.object_cuts")
            other_rows = store._physical_rows(concurrent, "wm.object_cuts")
            original_append(
                other_table,
                pa.Table.from_pylist(other_rows, schema=PHYSICAL_ARROW_SCHEMA),
                {
                    "write_request_id": concurrent.write_request_id,
                    "semantic_cut_ref": concurrent.semantic_cut.semantic_cut_ref,
                    "request_digest": concurrent.request_digest,
                },
                branch,
            )
            concurrent_snapshot = other_table.current_snapshot()
            self.assertIsNotNone(concurrent_snapshot)
            observed["concurrent"] = str(concurrent_snapshot.snapshot_id)

        with patch.object(Table, "append", new=interleaved_append):
            binding = store._write_table(own, "wm.object_cuts")

        self.assertEqual(binding.snapshot_id, observed["own"])
        self.assertNotEqual(binding.snapshot_id, observed["concurrent"])
        metadata = store._read_metadata(binding.metadata_location)
        self.assertEqual(str(metadata["current-snapshot-id"]), binding.snapshot_id)

    def test_recovery_does_not_scan_rows_for_unrelated_snapshot_summaries(self) -> None:
        dispatch(
            write_payload(
                request_id="write:summary-filter-001",
                table_names=("wm.object_cuts",),
            ),
            self.config,
        )
        store = PyIcebergPhysicalCutStore(self.config)
        table = store.catalog.load_table("wm.object_cuts")

        with patch.object(
            store,
            "_request_rows_at_snapshot",
            wraps=store._request_rows_at_snapshot,
        ) as row_scan:
            recovered = store._recover_matching_snapshot(
                table,
                "write:not-present",
                "semantic-cut:not-present",
                sha256_digest({"request": "not-present"}),
                sha256_digest([]),
                1,
            )

        self.assertIsNone(recovered)
        row_scan.assert_not_called()

    def test_recorded_schema_fingerprint_is_checked_against_the_snapshot(self) -> None:
        result = dispatch(
            write_payload(
                request_id="write:schema-fingerprint-001",
                table_names=("wm.object_cuts",),
            ),
            self.config,
        )
        attestation = copy.deepcopy(result["attestation"])
        attestation["snapshots"][0]["schema_fingerprint"] = sha256_digest(
            {"schema": "wrong"}
        )
        attestation["attestation_digest"] = attestation_digest_for(attestation)

        verify = dispatch(
            {
                "schema_kind": "odd_world_model.physical_cut_verify_request",
                "schema_version": "v1",
                "operation": "verify_cut",
                "verification_request_id": "verify:schema-fingerprint-001",
                "storage_profile_ref": "local-pyiceberg-v1",
                "attestation": attestation,
            },
            self.config,
        )

        self.assertEqual(verify["effect_observation"]["observation_status"], "failed")
        self.assertEqual(verify["gap"]["gap_type"], "physical_effect_observation_failed")
        self.assertIn("recorded schema fingerprint", verify["gap"]["message"])

    def test_attested_metadata_location_must_belong_to_the_named_catalog_table(self) -> None:
        result = dispatch(
            write_payload(request_id="write:metadata-table-binding-001"),
            self.config,
        )
        attestation = copy.deepcopy(result["attestation"])
        attestation["snapshots"][0]["metadata_location"] = attestation["snapshots"][1][
            "metadata_location"
        ]
        attestation["attestation_digest"] = attestation_digest_for(attestation)

        verify = dispatch(
            {
                "schema_kind": "odd_world_model.physical_cut_verify_request",
                "schema_version": "v1",
                "operation": "verify_cut",
                "verification_request_id": "verify:metadata-table-binding-001",
                "storage_profile_ref": "local-pyiceberg-v1",
                "attestation": attestation,
            },
            self.config,
        )

        self.assertEqual(verify["effect_observation"]["observation_status"], "failed")
        self.assertIn("metadata location is not retained", verify["gap"]["message"])

    def test_second_table_failure_reports_completed_physical_snapshot(self) -> None:
        request = PhysicalCutWriteRequest.model_validate(write_payload())
        store = PyIcebergPhysicalCutStore(self.config)
        original = store._write_table
        calls = 0

        def fail_second(current_request: PhysicalCutWriteRequest, table_identifier: str):
            nonlocal calls
            calls += 1
            if calls == 2:
                raise StorageEffectError(
                    "injected_second_table_failure",
                    "forced test failure",
                    retryable=True,
                )
            return original(current_request, table_identifier)

        with patch.object(store, "_write_table", side_effect=fail_second):
            with self.assertRaises(StorageEffectError) as raised:
                store.write_cut(request)

        self.assertEqual(raised.exception.gap_type, "injected_second_table_failure")
        self.assertEqual(len(raised.exception.completed_snapshots), 1)
        self.assertEqual(
            raised.exception.completed_snapshots[0].table_identifier,
            "wm.object_cuts",
        )

    def test_cli_rejects_malformed_and_multiple_requests_before_configuration(self) -> None:
        malformed = handle_input("{not-json}\n")
        multiple = handle_input("{}\n{}\n")

        self.assertEqual(malformed["gap"]["gap_type"], "malformed_json")
        self.assertEqual(multiple["gap"]["gap_type"], "invalid_request_count")
        self.assertEqual(malformed["operation"], "protocol")

    def test_configuration_failure_preserves_the_operation_typed_result(self) -> None:
        with patch.object(StorageConfig, "from_env", side_effect=RuntimeError("injected config")):
            result = handle_input(canonical_json(write_payload()) + "\n")

        self.assertEqual(result["operation"], "write_cut")
        self.assertEqual(result["effect_status"], "failed")
        self.assertEqual(result["gap"]["gap_type"], "storage_configuration_invalid")

    def test_store_construction_failure_is_an_operation_typed_result(self) -> None:
        with patch(
            "odd_world_model_storage.service.PyIcebergPhysicalCutStore",
            side_effect=RuntimeError("injected constructor failure"),
        ):
            result = handle_input(
                canonical_json(write_payload(request_id="write:constructor-failure-001")) + "\n",
                self.config,
            )

        self.assertEqual(result["operation"], "write_cut")
        self.assertEqual(result["effect_status"], "failed")
        self.assertEqual(result["gap"]["gap_type"], "storage_adapter_failure")

    def test_duckdb_construction_failure_reports_completed_snapshots_without_attestation(self) -> None:
        with patch(
            "odd_world_model_storage.store.DuckDbExactSnapshotVerifier",
            side_effect=RuntimeError("injected DuckDB constructor failure"),
        ):
            result = dispatch(
                write_payload(request_id="write:duckdb-constructor-failure-001"),
                self.config,
            )

        self.assertEqual(result["operation"], "write_cut")
        self.assertEqual(result["effect_status"], "failed")
        self.assertEqual(result["gap"]["gap_type"], "physical_effect_observation_failed")
        self.assertEqual(len(result["completed_snapshots"]), 2)
        self.assertNotIn("attestation", result)
        self.assertEqual(result["effect_observation"]["observation_status"], "failed")

    def test_module_cli_writes_exactly_one_json_response_line(self) -> None:
        env = dict(os.environ)
        env.update(self.config.as_env())
        completed = subprocess.run(
            [sys.executable, "-m", "odd_world_model_storage"],
            input=canonical_json(write_payload(request_id="write:cli-001")) + "\n",
            text=True,
            capture_output=True,
            env=env,
            check=False,
        )

        self.assertEqual(completed.returncode, 0, completed.stderr)
        self.assertEqual(completed.stderr, "")
        lines = completed.stdout.splitlines()
        self.assertEqual(len(lines), 1)
        self.assertEqual(json.loads(lines[0])["effect_status"], "written")


if __name__ == "__main__":
    unittest.main()
