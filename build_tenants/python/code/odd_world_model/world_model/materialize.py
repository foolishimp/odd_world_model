# Implements: REQ-ODD-WORLD-MODEL-BUILD-CONSTRAINT-002
# Implements: REQ-ODD-WORLD-MODEL-WORLD-OBJECT-001
# Implements: REQ-ODD-WORLD-MODEL-WORLD-OBJECT-002
# Implements: REQ-ODD-WORLD-MODEL-WORLD-OBJECT-009
# Implements: REQ-ODD-WORLD-MODEL-WORLD-OBJECT-010
# Implements: REQ-ODD-WORLD-MODEL-WORLD-OBJECT-011
# Implements: REQ-ODD-WORLD-MODEL-WORLD-OBJECT-012
"""Deterministic F_D-style materialization helpers for the world-model build line."""

from __future__ import annotations

from typing import Any


def trace_record(
    *,
    trace_id: str,
    source_ref: str,
    source_kind: str,
    claim_key: str,
    locator: str,
    observed_at: str,
    observed_value: Any,
    object_ref: str | None = None,
    observation_kind: str = "observed",
    effective_time: str | None = None,
    summary: str | None = None,
) -> dict[str, Any]:
    payload: dict[str, Any] = {
        "schema_kind": "odd_world_model.trace_record",
        "schema_version": "v1",
        "trace_id": trace_id,
        "source_ref": source_ref,
        "source_kind": source_kind,
        "claim_key": claim_key,
        "locator": locator,
        "observation_kind": observation_kind,
        "observed_at": observed_at,
        "observed_value": observed_value,
    }
    if object_ref:
        payload["object_ref"] = object_ref
    if effective_time:
        payload["effective_time"] = effective_time
    if summary:
        payload["summary"] = summary
    return payload


def assurance_record(
    *,
    assurance_id: str,
    object_ref: str,
    claim_key: str,
    claim_kind: str,
    accepted_value: Any,
    trace_record_refs: list[str],
    authority_basis: list[str],
    accepted_at: str,
    ambiguity_notes: list[str] | None = None,
    summary: str | None = None,
) -> dict[str, Any]:
    payload: dict[str, Any] = {
        "schema_kind": "odd_world_model.assurance_record",
        "schema_version": "v1",
        "assurance_id": assurance_id,
        "object_ref": object_ref,
        "claim_key": claim_key,
        "claim_kind": claim_kind,
        "accepted_value": accepted_value,
        "trace_record_refs": trace_record_refs,
        "authority_basis": authority_basis,
        "accepted_at": accepted_at,
    }
    if ambiguity_notes:
        payload["ambiguity_notes"] = ambiguity_notes
    if summary:
        payload["summary"] = summary
    return payload


def attribute_ledger_entry(
    *,
    entry_id: str,
    object_ref: str,
    claim_key: str,
    claim_kind: str,
    value: Any,
    trace_record_refs: list[str],
    assurance_record_refs: list[str],
    published_at: str,
    qualifiers: dict[str, Any] | None = None,
    effective_time: str | None = None,
    observed_at: str | None = None,
    supersedes_entry_ref: str | None = None,
    summary: str | None = None,
) -> dict[str, Any]:
    payload: dict[str, Any] = {
        "schema_kind": "odd_world_model.attribute_ledger_entry",
        "schema_version": "v1",
        "entry_id": entry_id,
        "object_ref": object_ref,
        "claim_key": claim_key,
        "claim_kind": claim_kind,
        "value": value,
        "trace_record_refs": trace_record_refs,
        "assurance_record_refs": assurance_record_refs,
        "published_at": published_at,
    }
    if qualifiers:
        payload["qualifiers"] = qualifiers
    if effective_time:
        payload["effective_time"] = effective_time
    if observed_at:
        payload["observed_at"] = observed_at
    if supersedes_entry_ref:
        payload["supersedes_entry_ref"] = supersedes_entry_ref
    if summary:
        payload["summary"] = summary
    return payload
