"""PyIceberg implementation of the admitted physical-cut effect."""

from __future__ import annotations

import hashlib
import fcntl
import json
import os
from pathlib import Path
from typing import Any
from urllib.parse import unquote, urlparse

import pyarrow as pa
from pyiceberg.catalog.sql import SqlCatalog
from pyiceberg.expressions import And, EqualTo
from pyiceberg.schema import Schema
from pyiceberg.table import Table
from pyiceberg.table.snapshots import Snapshot
from pyiceberg.types import LongType, NestedField, StringType

from .canonical import canonical_json, sha256_digest
from .config import StorageConfig
from .duckdb_proof import DuckDbExactSnapshotVerifier
from .models import (
    PhysicalEffectObservation,
    PhysicalCutWriteRequest,
    PhysicalCutWriteSuccess,
    SemanticCutAttestation,
    SnapshotBinding,
    SnapshotEffectObservation,
    attestation_digest_for,
    utc_now,
)
from .physical_envelope import stored_payload_digest

PHYSICAL_ARROW_SCHEMA = pa.schema(
    [
        pa.field("write_request_id", pa.string(), nullable=False),
        pa.field("request_digest", pa.string(), nullable=False),
        pa.field("admission_ref", pa.string(), nullable=False),
        pa.field("semantic_cut_ref", pa.string(), nullable=False),
        pa.field("semantic_cut_digest", pa.string(), nullable=False),
        pa.field("record_ordinal", pa.int64(), nullable=False),
        pa.field("record_id", pa.string(), nullable=False),
        pa.field("record_kind", pa.string(), nullable=False),
        pa.field("payload_json", pa.string(), nullable=False),
        pa.field("payload_sha256", pa.string(), nullable=False),
        pa.field("admitted_at", pa.string(), nullable=False),
    ]
)

PHYSICAL_ICEBERG_SCHEMA = Schema(
    NestedField(1, "write_request_id", StringType(), required=True),
    NestedField(2, "request_digest", StringType(), required=True),
    NestedField(3, "admission_ref", StringType(), required=True),
    NestedField(4, "semantic_cut_ref", StringType(), required=True),
    NestedField(5, "semantic_cut_digest", StringType(), required=True),
    NestedField(6, "record_ordinal", LongType(), required=True),
    NestedField(7, "record_id", StringType(), required=True),
    NestedField(8, "record_kind", StringType(), required=True),
    NestedField(9, "payload_json", StringType(), required=True),
    NestedField(10, "payload_sha256", StringType(), required=True),
    NestedField(11, "admitted_at", StringType(), required=True),
)
PHYSICAL_SCHEMA_FINGERPRINT = sha256_digest(
    PHYSICAL_ICEBERG_SCHEMA.model_dump(mode="json")
)


class StorageEffectError(RuntimeError):
    def __init__(
        self,
        gap_type: str,
        message: str,
        *,
        retryable: bool,
        evidence_refs: tuple[str, ...] = (),
        details: dict[str, Any] | None = None,
        completed_snapshots: tuple[SnapshotBinding, ...] = (),
        effect_observation: PhysicalEffectObservation | None = None,
    ) -> None:
        super().__init__(message)
        self.gap_type = gap_type
        self.retryable = retryable
        self.evidence_refs = evidence_refs
        self.details = details
        self.completed_snapshots = completed_snapshots
        self.effect_observation = effect_observation


class PyIcebergPhysicalCutStore:
    """Deterministic effect adapter; it carries no semantic admission authority."""

    def __init__(self, config: StorageConfig) -> None:
        self.config = config
        self._catalog: SqlCatalog | None = None
        self._duckdb: DuckDbExactSnapshotVerifier | None = None
        config.receipt_root.mkdir(parents=True, exist_ok=True)

    @property
    def catalog(self) -> SqlCatalog:
        if self._catalog is None:
            self._catalog = SqlCatalog(
                self.config.catalog_name,
                uri=self.config.catalog_uri,
                warehouse=self.config.warehouse_uri,
            )
        return self._catalog

    @property
    def duckdb(self) -> DuckDbExactSnapshotVerifier:
        if self._duckdb is None:
            self._duckdb = DuckDbExactSnapshotVerifier(
                allow_extension_install=self.config.duckdb_allow_extension_install
            )
        return self._duckdb

    def write_cut(self, request: PhysicalCutWriteRequest) -> PhysicalCutWriteSuccess:
        self._require_profile(request.storage_profile_ref)
        with self._request_lock(request.write_request_id):
            return self._write_cut_locked(request)

    def _write_cut_locked(
        self, request: PhysicalCutWriteRequest
    ) -> PhysicalCutWriteSuccess:
        receipt = self._read_receipt(request.write_request_id)
        if receipt is not None:
            if receipt.request_digest != request.request_digest:
                raise StorageEffectError(
                    "idempotency_conflict",
                    "write_request_id already exists with a different request digest",
                    retryable=False,
                    evidence_refs=(receipt.attestation.attestation_id,),
                )
            effect_observation = self.observe_attestation_effect(receipt.attestation)
            return PhysicalCutWriteSuccess.model_validate(
                {
                    **receipt.model_dump(mode="json"),
                    "effect_status": "idempotent",
                    "completed_at": utc_now(),
                    "effect_observation": effect_observation.model_dump(mode="json"),
                }
            )

        completed: list[SnapshotBinding] = []
        try:
            for table_write in request.tables:
                binding = self._write_table(request, table_write.table_identifier)
                completed.append(binding)
        except StorageEffectError as exc:
            raise StorageEffectError(
                exc.gap_type,
                str(exc),
                retryable=exc.retryable,
                evidence_refs=exc.evidence_refs,
                details=exc.details,
                completed_snapshots=tuple(completed) + exc.completed_snapshots,
                effect_observation=exc.effect_observation,
            ) from exc
        except Exception as exc:
            raise StorageEffectError(
                "physical_write_failed",
                str(exc),
                retryable=True,
                completed_snapshots=tuple(completed),
            ) from exc

        now = utc_now()
        semantic = request.semantic_cut
        attestation_payload: dict[str, Any] = {
            "schema_kind": "odd_world_model.semantic_cut_attestation",
            "schema_version": "v1",
            "attestation_id": f"attestation:{request.write_request_id}",
            "write_request_id": request.write_request_id,
            "request_digest": request.request_digest,
            "semantic_cut_ref": semantic.semantic_cut_ref,
            "semantic_cut_digest": semantic.semantic_cut_digest,
            "cut_role": semantic.cut_role,
            "cut_version": semantic.cut_version,
            "snapshots": [binding.model_dump(mode="json") for binding in completed],
            "governing_refs": list(semantic.governing_refs),
            "source_refs": list(semantic.source_refs),
            "authority_refs": list(semantic.authority_refs),
            "abg_event_refs": list(semantic.abg_event_refs),
            "dependency_identities": list(semantic.dependency_identities),
            "temporal_coordinates": semantic.temporal_coordinates,
            "fidelity": semantic.fidelity,
            "losses": list(semantic.losses),
            "exclusions": list(semantic.exclusions),
            "gap_refs": list(semantic.gap_refs),
            "created_at": now,
        }
        if semantic.graph_invocation_ref is not None:
            attestation_payload["graph_invocation_ref"] = semantic.graph_invocation_ref
        attestation_payload["attestation_digest"] = attestation_digest_for(attestation_payload)
        attestation = SemanticCutAttestation.model_validate(attestation_payload)
        effect_observation = self.observe_attestation_effect(attestation)

        result = PhysicalCutWriteSuccess(
            schema_kind="odd_world_model.physical_cut_write_result",
            schema_version="v1",
            operation="write_cut",
            effect_status="written",
            write_request_id=request.write_request_id,
            request_digest=request.request_digest,
            completed_at=now,
            attestation=attestation,
            effect_observation=effect_observation,
        )
        self._write_receipt(result)
        return result

    def observe_attestation_effect(
        self, attestation: SemanticCutAttestation
    ) -> PhysicalEffectObservation:
        results: list[SnapshotEffectObservation] = []
        failures: list[str] = []
        for binding in attestation.snapshots:
            try:
                table = self.catalog.load_table(binding.table_identifier)
                snapshot = self._snapshot(table, binding.snapshot_id)
                self._require_snapshot_identity(
                    snapshot,
                    write_request_id=attestation.write_request_id,
                    semantic_cut_ref=attestation.semantic_cut_ref,
                    request_digest=attestation.request_digest,
                )
                actual_schema_fingerprint = self._require_physical_schema(table, snapshot)
                if binding.schema_fingerprint != actual_schema_fingerprint:
                    raise StorageEffectError(
                        "schema_fingerprint_mismatch",
                        f"recorded schema fingerprint does not match snapshot schema for "
                        f"{binding.table_identifier}",
                        retryable=False,
                        details={
                            "recorded": binding.schema_fingerprint,
                            "actual": actual_schema_fingerprint,
                        },
                    )
                self._require_metadata_location(
                    table, binding.metadata_location, binding.snapshot_id
                )
                rows = self._request_rows_at_snapshot(
                    table,
                    int(binding.snapshot_id),
                    attestation.write_request_id,
                    attestation.semantic_cut_ref,
                )
                payload_digest = stored_payload_digest(rows)
                if len(rows) != binding.record_count or payload_digest != binding.payload_digest:
                    raise StorageEffectError(
                        "snapshot_payload_mismatch",
                        f"snapshot payload does not match attestation for {binding.table_identifier}",
                        retryable=False,
                    )
                duckdb_proof = self.duckdb.verify_snapshot(
                    binding,
                    write_request_id=attestation.write_request_id,
                    semantic_cut_ref=attestation.semantic_cut_ref,
                )
                results.append(
                    SnapshotEffectObservation(
                        table_identifier=binding.table_identifier,
                        snapshot_id=binding.snapshot_id,
                        status="reproduced",
                        message=(
                            "PyIceberg and DuckDB reproduced the exact snapshot "
                            f"(duckdb={duckdb_proof.runtime_identity.engine_version}, "
                            "iceberg_extension="
                            f"{duckdb_proof.runtime_identity.extension_version})"
                        ),
                    )
                )
            except Exception as exc:
                failures.append(str(exc))
                results.append(
                    SnapshotEffectObservation(
                        table_identifier=binding.table_identifier,
                        snapshot_id=binding.snapshot_id,
                        status="failed",
                        message=str(exc),
                    )
                )
        observation = PhysicalEffectObservation(
            observation_status="failed" if failures else "reproduced",
            observed_at=utc_now(),
            observer_identity="odd-world-model-storage/0.1.0:pyiceberg+duckdb",
            subject_attestation_id=attestation.attestation_id,
            subject_attestation_digest=attestation.attestation_digest,
            snapshot_observations=tuple(results),
        )
        if failures:
            raise StorageEffectError(
                "physical_effect_observation_failed",
                "; ".join(failures),
                retryable=False,
                evidence_refs=tuple(
                    f"iceberg-snapshot://{item.table_identifier}/{item.snapshot_id}"
                    for item in attestation.snapshots
                ),
                completed_snapshots=attestation.snapshots,
                effect_observation=observation,
            )
        return observation

    def _write_table(
        self, request: PhysicalCutWriteRequest, table_identifier: str
    ) -> SnapshotBinding:
        table_write = next(
            table for table in request.tables if table.table_identifier == table_identifier
        )
        namespace = table_identifier.rsplit(".", 1)[0]
        self.catalog.create_namespace_if_not_exists(namespace)
        table = self.catalog.create_table_if_not_exists(
            table_identifier,
            schema=PHYSICAL_ICEBERG_SCHEMA,
        )
        self._require_physical_schema(table)

        expected_rows = self._physical_rows(request, table_identifier)
        expected_digest = stored_payload_digest(expected_rows)
        recovered = self._recover_matching_snapshot(
            table,
            request.write_request_id,
            request.semantic_cut.semantic_cut_ref,
            request.request_digest,
            expected_digest,
            len(expected_rows),
        )
        if recovered is not None:
            return recovered

        table.append(
            pa.Table.from_pylist(expected_rows, schema=PHYSICAL_ARROW_SCHEMA),
            snapshot_properties={
                "write_request_id": request.write_request_id,
                "semantic_cut_ref": request.semantic_cut.semantic_cut_ref,
                "request_digest": request.request_digest,
            },
        )
        snapshot = table.current_snapshot()
        if snapshot is None:
            raise StorageEffectError(
                "snapshot_missing_after_write",
                f"no current snapshot after append to {table_identifier}",
                retryable=True,
            )
        self._require_snapshot_identity(
            snapshot,
            write_request_id=request.write_request_id,
            semantic_cut_ref=request.semantic_cut.semantic_cut_ref,
            request_digest=request.request_digest,
        )
        binding = self._binding(
            table,
            str(snapshot.snapshot_id),
            expected_digest,
            len(expected_rows),
        )
        self._verify_binding_payload(request, binding)
        return binding

    def _recover_matching_snapshot(
        self,
        table: Table,
        write_request_id: str,
        semantic_cut_ref: str,
        request_digest: str,
        expected_digest: str,
        expected_count: int,
    ) -> SnapshotBinding | None:
        for snapshot in sorted(
            table.snapshots(), key=lambda item: item.sequence_number or 0, reverse=True
        ):
            summary = snapshot.summary
            if summary is None or summary.get("write_request_id") != write_request_id:
                continue
            if (
                summary.get("semantic_cut_ref") != semantic_cut_ref
                or summary.get("request_digest") != request_digest
            ):
                raise StorageEffectError(
                    "idempotency_payload_conflict",
                    f"snapshot identity for {write_request_id} differs in {table.name()}",
                    retryable=False,
                )
            rows = self._request_rows_at_snapshot(
                table, snapshot.snapshot_id, write_request_id, semantic_cut_ref
            )
            actual_digest = stored_payload_digest(rows)
            if len(rows) != expected_count or actual_digest != expected_digest:
                raise StorageEffectError(
                    "idempotency_payload_conflict",
                    f"stored rows for {write_request_id} differ in {table.name()}",
                    retryable=False,
                )
            return self._binding(
                table,
                str(snapshot.snapshot_id),
                expected_digest,
                expected_count,
            )
        return None

    def _verify_binding_payload(
        self, request: PhysicalCutWriteRequest, binding: SnapshotBinding
    ) -> None:
        table = self.catalog.load_table(binding.table_identifier)
        rows = self._request_rows_at_snapshot(
            table,
            int(binding.snapshot_id),
            request.write_request_id,
            request.semantic_cut.semantic_cut_ref,
        )
        if len(rows) != binding.record_count or stored_payload_digest(rows) != binding.payload_digest:
            raise StorageEffectError(
                "write_readback_mismatch",
                f"exact snapshot readback failed for {binding.table_identifier}",
                retryable=True,
                completed_snapshots=(binding,),
            )

    def _physical_rows(
        self, request: PhysicalCutWriteRequest, table_identifier: str
    ) -> list[dict[str, Any]]:
        table_write = next(
            table for table in request.tables if table.table_identifier == table_identifier
        )
        rows: list[dict[str, Any]] = []
        for ordinal, record in enumerate(table_write.records):
            payload_json = canonical_json(record.payload)
            rows.append(
                {
                    "write_request_id": request.write_request_id,
                    "request_digest": request.request_digest,
                    "admission_ref": request.admission_ref,
                    "semantic_cut_ref": request.semantic_cut.semantic_cut_ref,
                    "semantic_cut_digest": request.semantic_cut.semantic_cut_digest,
                    "record_ordinal": ordinal,
                    "record_id": record.record_id,
                    "record_kind": record.record_kind,
                    "payload_json": payload_json,
                    "payload_sha256": sha256_digest(record.payload),
                    "admitted_at": request.admitted_at,
                }
            )
        return rows

    @staticmethod
    def _request_rows_at_snapshot(
        table: Table,
        snapshot_id: int,
        write_request_id: str,
        semantic_cut_ref: str,
    ) -> list[dict[str, Any]]:
        arrow = table.scan(
            row_filter=And(
                EqualTo("write_request_id", write_request_id),
                EqualTo("semantic_cut_ref", semantic_cut_ref),
            ),
            snapshot_id=snapshot_id,
        ).to_arrow()
        return sorted(arrow.to_pylist(), key=lambda row: int(row["record_ordinal"]))

    def _binding(
        self, table: Table, snapshot_id: str, payload_digest: str, record_count: int
    ) -> SnapshotBinding:
        snapshot = self._snapshot(table, snapshot_id)
        schema_fingerprint = self._require_physical_schema(table, snapshot)
        return SnapshotBinding(
            table_identifier=".".join(table.name()),
            snapshot_id=snapshot_id,
            metadata_location=self._metadata_location_for_snapshot(table, snapshot_id),
            schema_fingerprint=schema_fingerprint,
            payload_digest=payload_digest,
            record_count=record_count,
        )

    @staticmethod
    def _require_physical_schema(table: Table, snapshot: Snapshot | None = None) -> str:
        if snapshot is None or snapshot.schema_id is None:
            schema = table.schema()
        else:
            schema = table.schemas().get(snapshot.schema_id)
            if schema is None:
                raise StorageEffectError(
                    "snapshot_schema_missing",
                    f"schema {snapshot.schema_id} is unavailable for snapshot {snapshot.snapshot_id}",
                    retryable=False,
                )
        actual = sha256_digest(schema.model_dump(mode="json"))
        if actual != PHYSICAL_SCHEMA_FINGERPRINT:
            raise StorageEffectError(
                "physical_schema_mismatch",
                f"table {'.'.join(table.name())} does not use the v1 physical record envelope",
                retryable=False,
                details={"expected": PHYSICAL_SCHEMA_FINGERPRINT, "actual": actual},
            )
        return actual

    @staticmethod
    def _snapshot(table: Table, snapshot_id: str) -> Snapshot:
        snapshot = next(
            (item for item in table.snapshots() if str(item.snapshot_id) == snapshot_id),
            None,
        )
        if snapshot is None:
            raise StorageEffectError(
                "snapshot_not_found",
                f"snapshot {snapshot_id} is not present for {'.'.join(table.name())}",
                retryable=False,
            )
        return snapshot

    @staticmethod
    def _require_snapshot_identity(
        snapshot: Snapshot,
        *,
        write_request_id: str,
        semantic_cut_ref: str,
        request_digest: str,
    ) -> None:
        expected = {
            "write_request_id": write_request_id,
            "semantic_cut_ref": semantic_cut_ref,
            "request_digest": request_digest,
        }
        summary = snapshot.summary
        actual = {key: summary.get(key) if summary is not None else None for key in expected}
        if actual != expected:
            raise StorageEffectError(
                "snapshot_identity_mismatch",
                f"snapshot {snapshot.snapshot_id} does not carry the admitted request identity",
                retryable=False,
                details={"expected": expected, "actual": actual},
            )

    def _require_profile(self, profile_ref: str) -> None:
        if profile_ref != self.config.storage_profile_ref:
            raise StorageEffectError(
                "storage_profile_mismatch",
                f"request profile {profile_ref!r} is not configured",
                retryable=False,
            )

    @staticmethod
    def _read_metadata(metadata_location: str) -> dict[str, Any]:
        parsed = urlparse(metadata_location)
        if parsed.scheme != "file":
            raise StorageEffectError(
                "metadata_location_unsupported",
                f"v1 requires a local file metadata location: {metadata_location}",
                retryable=False,
            )
        path = Path(unquote(parsed.path))
        if not path.is_file():
            raise StorageEffectError(
                "metadata_location_missing",
                f"attested metadata file is missing: {metadata_location}",
                retryable=False,
            )
        try:
            value = json.loads(path.read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError) as exc:
            raise StorageEffectError(
                "metadata_location_invalid",
                f"attested metadata file is unreadable: {metadata_location}",
                retryable=False,
            ) from exc
        if not isinstance(value, dict):
            raise StorageEffectError(
                "metadata_location_invalid",
                f"attested metadata is not an object: {metadata_location}",
                retryable=False,
            )
        return value

    @staticmethod
    def _metadata_locations(table: Table) -> tuple[str, ...]:
        return tuple(
            dict.fromkeys(
                [
                    table.metadata_location,
                    *(entry.metadata_file for entry in reversed(table.metadata.metadata_log)),
                ]
            )
        )

    @classmethod
    def _require_metadata_location(
        cls, table: Table, metadata_location: str, snapshot_id: str
    ) -> None:
        if metadata_location not in cls._metadata_locations(table):
            raise StorageEffectError(
                "metadata_location_not_catalogued",
                f"metadata location is not retained by {'.'.join(table.name())}: "
                f"{metadata_location}",
                retryable=False,
            )
        metadata = cls._read_metadata(metadata_location)
        if str(metadata.get("current-snapshot-id")) != snapshot_id:
            raise StorageEffectError(
                "metadata_snapshot_mismatch",
                f"metadata location does not pin snapshot {snapshot_id}: {metadata_location}",
                retryable=False,
            )
        if str(metadata.get("table-uuid")) != str(table.metadata.table_uuid):
            raise StorageEffectError(
                "metadata_table_mismatch",
                f"metadata location does not belong to {'.'.join(table.name())}",
                retryable=False,
            )

    @classmethod
    def _metadata_location_for_snapshot(cls, table: Table, snapshot_id: str) -> str:
        for location in cls._metadata_locations(table):
            metadata = cls._read_metadata(location)
            if (
                str(metadata.get("current-snapshot-id")) == snapshot_id
                and str(metadata.get("table-uuid")) == str(table.metadata.table_uuid)
            ):
                return location
        raise StorageEffectError(
            "snapshot_metadata_not_found",
            f"no exact metadata location is retained for snapshot {snapshot_id} in "
            f"{'.'.join(table.name())}",
            retryable=False,
        )

    def _receipt_path(self, write_request_id: str) -> Path:
        safe_name = hashlib.sha256(write_request_id.encode("utf-8")).hexdigest()
        return self.config.receipt_root / f"{safe_name}.json"

    class _RequestLock:
        def __init__(self, path: Path) -> None:
            self.path = path
            self.descriptor: int | None = None

        def __enter__(self) -> None:
            self.descriptor = os.open(self.path, os.O_CREAT | os.O_RDWR, 0o600)
            fcntl.flock(self.descriptor, fcntl.LOCK_EX)

        def __exit__(self, exc_type: object, exc: object, traceback: object) -> None:
            if self.descriptor is None:
                return
            fcntl.flock(self.descriptor, fcntl.LOCK_UN)
            os.close(self.descriptor)
            self.descriptor = None

    def _request_lock(self, write_request_id: str) -> _RequestLock:
        return self._RequestLock(self._receipt_path(write_request_id).with_suffix(".lock"))

    def _read_receipt(self, write_request_id: str) -> PhysicalCutWriteSuccess | None:
        path = self._receipt_path(write_request_id)
        if not path.exists():
            return None
        try:
            return PhysicalCutWriteSuccess.model_validate_json(path.read_text(encoding="utf-8"))
        except Exception as exc:
            raise StorageEffectError(
                "receipt_invalid",
                f"stored effect receipt is invalid for {write_request_id}: {exc}",
                retryable=False,
            ) from exc

    def _write_receipt(self, result: PhysicalCutWriteSuccess) -> None:
        path = self._receipt_path(result.write_request_id)
        temporary = path.with_suffix(f".{os.getpid()}.tmp")
        temporary.write_text(
            canonical_json(result.model_dump(mode="json", exclude_none=True)) + "\n",
            encoding="utf-8",
        )
        os.replace(temporary, path)
