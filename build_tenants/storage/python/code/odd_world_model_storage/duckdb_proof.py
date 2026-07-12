"""Exact historical Iceberg snapshot proof through DuckDB."""

from __future__ import annotations

import hashlib
from dataclasses import dataclass
from pathlib import Path
from typing import Any

import duckdb

from .models import SnapshotBinding
from .physical_envelope import stored_payload_digest

EXPECTED_DUCKDB_VERSION = "1.4.5"
EXPECTED_ICEBERG_EXTENSION_VERSION = "2f229463"

PHYSICAL_COLUMNS = (
    "write_request_id",
    "request_digest",
    "admission_ref",
    "semantic_cut_ref",
    "semantic_cut_digest",
    "record_ordinal",
    "record_id",
    "record_kind",
    "payload_json",
    "payload_sha256",
    "admitted_at",
)


class DuckDbProofError(RuntimeError):
    pass


@dataclass(frozen=True)
class DuckDbRuntimeIdentity:
    engine_version: str
    extension_version: str
    extension_sha256: str
    installed_from: str


@dataclass(frozen=True)
class DuckDbSnapshotProof:
    table_identifier: str
    snapshot_id: str
    record_count: int
    payload_digest: str
    runtime_identity: DuckDbRuntimeIdentity


class DuckDbExactSnapshotVerifier:
    """Read only the attested metadata file and snapshot ID."""

    def __init__(self, *, allow_extension_install: bool = False) -> None:
        self.connection = duckdb.connect(database=":memory:")
        try:
            self.connection.load_extension("iceberg")
        except duckdb.Error:
            if not allow_extension_install:
                raise DuckDbProofError(
                    "the exact DuckDB Iceberg extension is not installed"
                ) from None
            self.connection.install_extension("iceberg")
            self.connection.load_extension("iceberg")
        self.runtime_identity = self._runtime_identity()
        unsafe_guessing = self.connection.execute(
            "select current_setting('unsafe_enable_version_guessing')"
        ).fetchone()
        if unsafe_guessing != (False,):
            raise DuckDbProofError("unsafe Iceberg metadata-version guessing is enabled")

    def verify_snapshot(
        self,
        binding: SnapshotBinding,
        *,
        write_request_id: str,
        semantic_cut_ref: str,
    ) -> DuckDbSnapshotProof:
        rows = self.connection.execute(
            f"""
            select {", ".join(PHYSICAL_COLUMNS)}
            from iceberg_scan(?, snapshot_from_id = ?)
            where write_request_id = ? and semantic_cut_ref = ?
            order by record_ordinal
            """,
            [
                binding.metadata_location,
                int(binding.snapshot_id),
                write_request_id,
                semantic_cut_ref,
            ],
        ).fetchall()
        physical_rows: list[dict[str, Any]] = [
            dict(zip(PHYSICAL_COLUMNS, row, strict=True)) for row in rows
        ]
        payload_digest = stored_payload_digest(physical_rows)
        if (
            len(physical_rows) != binding.record_count
            or payload_digest != binding.payload_digest
        ):
            raise DuckDbProofError(
                f"DuckDB exact snapshot payload mismatch for {binding.table_identifier}"
            )
        return DuckDbSnapshotProof(
            table_identifier=binding.table_identifier,
            snapshot_id=binding.snapshot_id,
            record_count=len(physical_rows),
            payload_digest=payload_digest,
            runtime_identity=self.runtime_identity,
        )

    def _runtime_identity(self) -> DuckDbRuntimeIdentity:
        row = self.connection.execute(
            """
            select extension_version, install_path, installed_from
            from duckdb_extensions()
            where extension_name = 'iceberg' and loaded
            """
        ).fetchone()
        if row is None:
            raise DuckDbProofError("DuckDB Iceberg extension did not load")
        extension_version, install_path, installed_from = row
        engine_version = duckdb.__version__
        if engine_version != EXPECTED_DUCKDB_VERSION:
            raise DuckDbProofError(
                f"DuckDB version mismatch: expected {EXPECTED_DUCKDB_VERSION}, got {engine_version}"
            )
        if extension_version != EXPECTED_ICEBERG_EXTENSION_VERSION:
            raise DuckDbProofError(
                "DuckDB Iceberg extension version mismatch: "
                f"expected {EXPECTED_ICEBERG_EXTENSION_VERSION}, got {extension_version}"
            )
        extension_path = Path(str(install_path))
        if not extension_path.is_file():
            raise DuckDbProofError("DuckDB Iceberg extension binary is not addressable")
        extension_sha256 = hashlib.sha256(extension_path.read_bytes()).hexdigest()
        return DuckDbRuntimeIdentity(
            engine_version=engine_version,
            extension_version=str(extension_version),
            extension_sha256=extension_sha256,
            installed_from=str(installed_from),
        )
