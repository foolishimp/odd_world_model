"""Protocol dispatch over the bounded physical-cut store."""

from __future__ import annotations

from typing import Any

from pydantic import ValidationError

from .canonical import is_sha256_digest
from .config import StorageConfig
from .models import (
    PhysicalEffectObservation,
    PhysicalCutVerifyRequest,
    PhysicalCutVerifyResult,
    PhysicalCutWriteFailure,
    PhysicalCutWriteRequest,
    ProtocolErrorResult,
    TypedGap,
    utc_now,
)
from .store import PyIcebergPhysicalCutStore, StorageEffectError


def _request_digest(payload: dict[str, Any]) -> str | None:
    value = payload.get("request_digest")
    return value if is_sha256_digest(value) else None


def _gap_from_error(error: StorageEffectError) -> TypedGap:
    return TypedGap(
        gap_type=error.gap_type,
        message=str(error),
        retryable=error.retryable,
        evidence_refs=error.evidence_refs,
        details=error.details,
    )


def _failed_observation(error: StorageEffectError | None = None) -> PhysicalEffectObservation:
    if error is not None and error.effect_observation is not None:
        return error.effect_observation
    return PhysicalEffectObservation(
        observation_status="failed",
        observed_at=utc_now(),
        observer_identity="odd-world-model-storage/0.1.0:protocol",
        snapshot_observations=(),
    )


def protocol_error(gap_type: str, message: str, *, correlation_id: str | None = None) -> dict[str, Any]:
    return ProtocolErrorResult(
        correlation_id=correlation_id,
        completed_at=utc_now(),
        gap=TypedGap(
            gap_type=gap_type,
            message=message,
            retryable=False,
            evidence_refs=(),
        ),
    ).model_dump(mode="json", exclude_none=True)


def operation_failure(payload: dict[str, Any], gap_type: str, message: str) -> dict[str, Any]:
    operation = payload.get("operation")
    gap = TypedGap(
        gap_type=gap_type,
        message=message,
        retryable=False,
        evidence_refs=(),
    )
    if operation == "write_cut":
        return PhysicalCutWriteFailure(
            write_request_id=str(payload.get("write_request_id", "")),
            request_digest=_request_digest(payload),
            completed_at=utc_now(),
            gap=gap,
        ).model_dump(mode="json", exclude_none=True)
    if operation == "verify_cut":
        verification_id = str(payload.get("verification_request_id", "")) or "unidentified"
        return PhysicalCutVerifyResult(
            verification_request_id=verification_id,
            effect_observation=_failed_observation(),
            gap=gap,
        ).model_dump(mode="json", exclude_none=True)
    return protocol_error(
        gap_type,
        message,
        correlation_id=str(
            payload.get("write_request_id") or payload.get("verification_request_id") or ""
        ),
    )


def dispatch(payload: dict[str, Any], config: StorageConfig) -> dict[str, Any]:
    operation = payload.get("operation")
    if operation == "write_cut":
        try:
            request = PhysicalCutWriteRequest.model_validate(payload)
            store = PyIcebergPhysicalCutStore(config)
            result = store.write_cut(request)
            return result.model_dump(mode="json", exclude_none=True)
        except ValidationError as exc:
            return PhysicalCutWriteFailure(
                write_request_id=str(payload.get("write_request_id", "")),
                request_digest=_request_digest(payload),
                completed_at=utc_now(),
                gap=TypedGap(
                    gap_type="invalid_write_request",
                    message=str(exc),
                    retryable=False,
                    evidence_refs=(),
                ),
            ).model_dump(mode="json", exclude_none=True)
        except StorageEffectError as exc:
            return PhysicalCutWriteFailure(
                write_request_id=str(payload.get("write_request_id", "")),
                request_digest=_request_digest(payload),
                completed_at=utc_now(),
                gap=_gap_from_error(exc),
                completed_snapshots=exc.completed_snapshots,
                effect_observation=exc.effect_observation,
            ).model_dump(mode="json", exclude_none=True)
        except Exception as exc:
            return operation_failure(payload, "storage_adapter_failure", str(exc))
    if operation == "verify_cut":
        verification_id = str(payload.get("verification_request_id", "")) or "unidentified"
        try:
            request = PhysicalCutVerifyRequest.model_validate(payload)
            store = PyIcebergPhysicalCutStore(config)
            if request.storage_profile_ref != config.storage_profile_ref:
                raise StorageEffectError(
                    "storage_profile_mismatch",
                    f"request profile {request.storage_profile_ref!r} is not configured",
                    retryable=False,
                )
            effect_observation = store.observe_attestation_effect(request.attestation)
            return PhysicalCutVerifyResult(
                verification_request_id=request.verification_request_id,
                effect_observation=effect_observation,
            ).model_dump(mode="json", exclude_none=True)
        except (ValidationError, StorageEffectError) as exc:
            if isinstance(exc, StorageEffectError):
                gap = _gap_from_error(exc)
                effect_observation = _failed_observation(exc)
            else:
                gap = TypedGap(
                    gap_type="invalid_verify_request",
                    message=str(exc),
                    retryable=False,
                    evidence_refs=(),
                )
                effect_observation = _failed_observation()
            return PhysicalCutVerifyResult(
                verification_request_id=verification_id,
                effect_observation=effect_observation,
                gap=gap,
            ).model_dump(mode="json", exclude_none=True)
        except Exception as exc:
            return operation_failure(payload, "storage_adapter_failure", str(exc))
    return protocol_error(
        "unsupported_operation",
        "operation must be write_cut or verify_cut",
        correlation_id=str(payload.get("write_request_id") or payload.get("verification_request_id") or ""),
    )
