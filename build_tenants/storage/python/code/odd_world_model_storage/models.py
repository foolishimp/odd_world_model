"""Versioned protocol models for the physical-cut effect boundary."""

from __future__ import annotations

from datetime import datetime, timezone
from typing import Any, Literal

from pydantic import BaseModel, ConfigDict, Field, field_validator, model_validator

from .canonical import SHA256_DIGEST_PATTERN, sha256_digest

TABLE_IDENTIFIER_PATTERN = r"^[a-z][a-z0-9_]*\.[a-z][a-z0-9_]*$"


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="milliseconds").replace("+00:00", "Z")


class StrictModel(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)


class TypedGap(StrictModel):
    gap_type: str = Field(min_length=1)
    message: str = Field(min_length=1)
    retryable: bool
    evidence_refs: tuple[str, ...] = ()
    details: dict[str, Any] | None = None


class SemanticCutWrite(StrictModel):
    semantic_cut_ref: str = Field(min_length=1)
    semantic_cut_digest: str = Field(pattern=SHA256_DIGEST_PATTERN)
    cut_role: str = Field(min_length=1)
    cut_version: str = Field(min_length=1)
    governing_refs: tuple[str, ...]
    source_refs: tuple[str, ...]
    authority_refs: tuple[str, ...]
    graph_invocation_ref: str | None = None
    abg_event_refs: tuple[str, ...]
    dependency_identities: tuple[str, ...]
    temporal_coordinates: dict[str, str] = Field(default_factory=dict)
    fidelity: Literal["exact_payload", "lossless_projection", "lossy_projection"]
    losses: tuple[str, ...]
    exclusions: tuple[str, ...]
    gap_refs: tuple[str, ...]

    @field_validator(
        "governing_refs",
        "source_refs",
        "authority_refs",
        "abg_event_refs",
        "dependency_identities",
        "losses",
        "exclusions",
        "gap_refs",
    )
    @classmethod
    def unique_refs(cls, value: tuple[str, ...]) -> tuple[str, ...]:
        if any(not item for item in value):
            raise ValueError("references must be non-empty")
        if len(value) != len(set(value)):
            raise ValueError("references must be unique")
        return value


class PhysicalRecord(StrictModel):
    record_id: str = Field(min_length=1)
    record_kind: str = Field(min_length=1)
    payload: dict[str, Any]


class TableWrite(StrictModel):
    table_identifier: str = Field(pattern=TABLE_IDENTIFIER_PATTERN)
    records: tuple[PhysicalRecord, ...] = Field(min_length=1)

    @model_validator(mode="after")
    def record_ids_are_unique(self) -> "TableWrite":
        ids = [record.record_id for record in self.records]
        if len(ids) != len(set(ids)):
            raise ValueError("record_id must be unique within a table write")
        return self


class PhysicalCutWriteRequest(StrictModel):
    schema_kind: Literal["odd_world_model.physical_cut_write_request"]
    schema_version: Literal["v1"]
    operation: Literal["write_cut"]
    write_request_id: str = Field(min_length=1)
    request_digest: str = Field(pattern=SHA256_DIGEST_PATTERN)
    admission_ref: str = Field(min_length=1)
    storage_profile_ref: str = Field(min_length=1)
    semantic_cut: SemanticCutWrite
    tables: tuple[TableWrite, ...] = Field(min_length=1)
    admitted_at: str = Field(min_length=1)

    @model_validator(mode="before")
    @classmethod
    def digest_matches_received_payload(cls, value: Any) -> Any:
        if isinstance(value, dict):
            expected = request_digest_for(value)
            if value.get("request_digest") != expected:
                raise ValueError(f"request_digest mismatch: expected {expected}")
        return value

    @model_validator(mode="after")
    def table_set_is_closed(self) -> "PhysicalCutWriteRequest":
        identifiers = [table.table_identifier for table in self.tables]
        if len(identifiers) != len(set(identifiers)):
            raise ValueError("table_identifier must be unique within a write request")
        return self


class SnapshotBinding(StrictModel):
    table_identifier: str = Field(pattern=TABLE_IDENTIFIER_PATTERN)
    snapshot_id: str = Field(pattern=r"^[0-9]+$")
    metadata_location: str = Field(min_length=1)
    schema_fingerprint: str = Field(pattern=SHA256_DIGEST_PATTERN)
    payload_digest: str = Field(pattern=SHA256_DIGEST_PATTERN)
    record_count: int = Field(ge=1)


class SemanticCutAttestation(StrictModel):
    schema_kind: Literal["odd_world_model.semantic_cut_attestation"]
    schema_version: Literal["v1"]
    attestation_id: str = Field(min_length=1)
    write_request_id: str = Field(min_length=1)
    request_digest: str = Field(pattern=SHA256_DIGEST_PATTERN)
    semantic_cut_ref: str = Field(min_length=1)
    semantic_cut_digest: str = Field(pattern=SHA256_DIGEST_PATTERN)
    cut_role: str = Field(min_length=1)
    cut_version: str = Field(min_length=1)
    snapshots: tuple[SnapshotBinding, ...] = Field(min_length=1)
    governing_refs: tuple[str, ...]
    source_refs: tuple[str, ...]
    authority_refs: tuple[str, ...]
    graph_invocation_ref: str | None = None
    abg_event_refs: tuple[str, ...]
    dependency_identities: tuple[str, ...]
    temporal_coordinates: dict[str, str] = Field(default_factory=dict)
    fidelity: Literal["exact_payload", "lossless_projection", "lossy_projection"]
    losses: tuple[str, ...]
    exclusions: tuple[str, ...]
    gap_refs: tuple[str, ...]
    created_at: str = Field(min_length=1)
    attestation_digest: str = Field(pattern=SHA256_DIGEST_PATTERN)

    @model_validator(mode="before")
    @classmethod
    def digest_matches_received_payload(cls, value: Any) -> Any:
        if isinstance(value, dict):
            expected = attestation_digest_for(value)
            if value.get("attestation_digest") != expected:
                raise ValueError(f"attestation_digest mismatch: expected {expected}")
        return value

    @model_validator(mode="after")
    def snapshot_set_is_closed(self) -> "SemanticCutAttestation":
        identifiers = [snapshot.table_identifier for snapshot in self.snapshots]
        if len(identifiers) != len(set(identifiers)):
            raise ValueError("attestation snapshots must have unique table identifiers")
        return self


class SnapshotEffectObservation(StrictModel):
    table_identifier: str = Field(pattern=TABLE_IDENTIFIER_PATTERN)
    snapshot_id: str = Field(pattern=r"^[0-9]+$")
    status: Literal["reproduced", "failed"]
    message: str | None = None


class PhysicalEffectObservation(StrictModel):
    schema_kind: Literal["odd_world_model.physical_effect_observation"] = (
        "odd_world_model.physical_effect_observation"
    )
    schema_version: Literal["v1"] = "v1"
    observation_status: Literal["reproduced", "failed"]
    observed_at: str = Field(min_length=1)
    observer_identity: str = Field(min_length=1)
    subject_attestation_id: str | None = Field(default=None, min_length=1)
    subject_attestation_digest: str | None = Field(
        default=None, pattern=SHA256_DIGEST_PATTERN
    )
    snapshot_observations: tuple[SnapshotEffectObservation, ...]

    @model_validator(mode="after")
    def status_matches_observations(self) -> "PhysicalEffectObservation":
        statuses = [item.status for item in self.snapshot_observations]
        has_subject = (
            self.subject_attestation_id is not None
            and self.subject_attestation_digest is not None
        )
        if (self.subject_attestation_id is None) != (self.subject_attestation_digest is None):
            raise ValueError("effect observation subject identity must be complete")
        if statuses and not has_subject:
            raise ValueError("snapshot observations require exact attestation subject identity")
        if self.observation_status == "reproduced":
            if not statuses or any(status != "reproduced" for status in statuses):
                raise ValueError("reproduced observation requires reproduced snapshot evidence")
        elif statuses and "failed" not in statuses:
            raise ValueError("failed observation must contain a failed snapshot when non-empty")
        return self


class PhysicalCutWriteSuccess(StrictModel):
    schema_kind: Literal["odd_world_model.physical_cut_write_result"]
    schema_version: Literal["v1"]
    operation: Literal["write_cut"]
    effect_status: Literal["written", "idempotent"]
    write_request_id: str
    request_digest: str = Field(pattern=SHA256_DIGEST_PATTERN)
    completed_at: str
    attestation: SemanticCutAttestation
    effect_observation: PhysicalEffectObservation

    @model_validator(mode="after")
    def observation_closes_attested_snapshots(self) -> "PhysicalCutWriteSuccess":
        if self.effect_observation.observation_status != "reproduced":
            raise ValueError("successful write requires reproduced physical-effect observation")
        if (
            self.effect_observation.subject_attestation_id != self.attestation.attestation_id
            or self.effect_observation.subject_attestation_digest
            != self.attestation.attestation_digest
        ):
            raise ValueError("physical-effect observation identifies a different attestation")
        attested = {
            (snapshot.table_identifier, snapshot.snapshot_id)
            for snapshot in self.attestation.snapshots
        }
        observed = {
            (item.table_identifier, item.snapshot_id)
            for item in self.effect_observation.snapshot_observations
        }
        if observed != attested:
            raise ValueError("physical-effect observation does not close the attested snapshots")
        return self


class PhysicalCutWriteFailure(StrictModel):
    schema_kind: Literal["odd_world_model.physical_cut_write_result"] = (
        "odd_world_model.physical_cut_write_result"
    )
    schema_version: Literal["v1"] = "v1"
    operation: Literal["write_cut"] = "write_cut"
    effect_status: Literal["failed"] = "failed"
    write_request_id: str = ""
    request_digest: str | None = None
    completed_at: str
    gap: TypedGap
    completed_snapshots: tuple[SnapshotBinding, ...] = ()
    effect_observation: PhysicalEffectObservation | None = None


class PhysicalCutVerifyRequest(StrictModel):
    schema_kind: Literal["odd_world_model.physical_cut_verify_request"]
    schema_version: Literal["v1"]
    operation: Literal["verify_cut"]
    verification_request_id: str = Field(min_length=1)
    storage_profile_ref: str = Field(min_length=1)
    attestation: SemanticCutAttestation


class PhysicalCutVerifyResult(StrictModel):
    schema_kind: Literal["odd_world_model.physical_cut_verify_result"] = (
        "odd_world_model.physical_cut_verify_result"
    )
    schema_version: Literal["v1"] = "v1"
    operation: Literal["verify_cut"] = "verify_cut"
    verification_request_id: str
    effect_observation: PhysicalEffectObservation
    gap: TypedGap | None = None

    @model_validator(mode="after")
    def gap_matches_observation(self) -> "PhysicalCutVerifyResult":
        if self.effect_observation.observation_status == "failed" and self.gap is None:
            raise ValueError("failed observation requires a typed gap")
        if self.effect_observation.observation_status == "reproduced" and self.gap is not None:
            raise ValueError("reproduced observation cannot carry a failure gap")
        return self


class ProtocolErrorResult(StrictModel):
    schema_kind: Literal["odd_world_model.physical_cut_protocol_error"] = (
        "odd_world_model.physical_cut_protocol_error"
    )
    schema_version: Literal["v1"] = "v1"
    operation: Literal["protocol"] = "protocol"
    effect_status: Literal["failed"] = "failed"
    correlation_id: str | None = None
    completed_at: str
    gap: TypedGap


def request_digest_for(payload: dict[str, Any]) -> str:
    digest_input = dict(payload)
    digest_input.pop("request_digest", None)
    return sha256_digest(digest_input)


def attestation_digest_for(payload: dict[str, Any]) -> str:
    digest_input = dict(payload)
    digest_input.pop("attestation_digest", None)
    return sha256_digest(digest_input)
