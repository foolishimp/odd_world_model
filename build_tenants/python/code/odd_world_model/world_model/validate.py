# Implements: REQ-ODD-WORLD-MODEL-BUILD-VERIFY-001
# Implements: REQ-ODD-WORLD-MODEL-BUILD-VERIFY-002
"""Deterministic validation for the common JSON carrier."""

from __future__ import annotations

import argparse
import json
from dataclasses import dataclass
from pathlib import Path
from typing import Any

from odd_world_model.world_model.registry import SCHEMA_FILE_NAMES, schemas_root


@dataclass(frozen=True)
class ValidationResult:
    path: Path
    schema_kind: str
    valid: bool
    message: str


def _load_json(path: Path) -> dict[str, Any]:
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def _require_keys(document: dict[str, Any], keys: list[str], path: Path) -> None:
    missing = [key for key in keys if key not in document]
    if missing:
        raise ValueError(f"{path}: missing required keys: {', '.join(missing)}")


def _validate_schema_kind(document: dict[str, Any], path: Path) -> str:
    _require_keys(document, ["schema_kind", "schema_version"], path)
    schema_kind = document["schema_kind"]
    if schema_kind not in SCHEMA_FILE_NAMES:
        raise ValueError(f"{path}: unsupported schema_kind '{schema_kind}'")
    if document["schema_version"] != "v1":
        raise ValueError(f"{path}: unsupported schema_version '{document['schema_version']}'")
    return schema_kind


def _validate_fragment_paths(fragment_path: Path, document: dict[str, Any]) -> None:
    fragment_root = fragment_path.parent
    for field in ("objects", "attribute_ledger_entries", "reference_artifacts", "treatments", "edges", "projections", "evidence_manifests"):
        refs = document.get(field, [])
        if not isinstance(refs, list):
            raise ValueError(f"{fragment_path}: field '{field}' must be a list")
        for ref in refs:
            ref_path = fragment_root / ref
            if not ref_path.exists():
                raise ValueError(f"{fragment_path}: referenced path does not exist: {ref}")


def validate_document(path: Path) -> ValidationResult:
    document = _load_json(path)
    schema_kind = _validate_schema_kind(document, path)

    if schema_kind == "odd_world_model.world_fragment":
        _require_keys(
            document,
            [
                "fragment_id",
                "bounded_context",
                "published_at",
                "objects",
                "reference_artifacts",
                "treatments",
                "edges",
                "projections",
                "evidence_manifests",
            ],
            path,
        )
        _validate_fragment_paths(path, document)
    elif schema_kind in {"odd_world_model.world_model_object", "odd_world_model.markov_object"}:
        _require_keys(
            document,
            ["object_id", "object_kind", "bounded_context", "identity", "boundary", "state", "evidence", "cross_domain", "composition"],
            path,
        )
        if schema_kind == "odd_world_model.markov_object":
            _require_keys(document, ["blanket"], path)
    elif schema_kind == "odd_world_model.trace_record":
        _require_keys(
            document,
            ["trace_id", "source_ref", "source_kind", "claim_key", "locator", "observed_at", "observed_value"],
            path,
        )
    elif schema_kind == "odd_world_model.assurance_record":
        _require_keys(
            document,
            ["assurance_id", "object_ref", "claim_key", "claim_kind", "accepted_value", "trace_record_refs", "authority_basis", "accepted_at"],
            path,
        )
    elif schema_kind == "odd_world_model.attribute_ledger_entry":
        _require_keys(
            document,
            ["entry_id", "object_ref", "claim_key", "claim_kind", "value", "trace_record_refs", "assurance_record_refs", "published_at"],
            path,
        )
    elif schema_kind == "odd_world_model.treatment_surface":
        _require_keys(document, ["treatment_id", "source_object_refs", "target_domain"], path)
    elif schema_kind == "odd_world_model.covariance_edge":
        _require_keys(document, ["edge_id", "source_object_ref", "target_object_ref", "relationship_kind"], path)
    elif schema_kind == "odd_world_model.adjoint_mapping":
        _require_keys(document, ["mapping_id", "forward_treatment_ref", "source_domain", "target_domain", "interpret_back_summary"], path)
    elif schema_kind == "odd_world_model.temporal_reference_artifact":
        _require_keys(
            document,
            ["artifact_id", "artifact_kind", "bounded_context", "identity", "effective_period", "values", "evidence", "usage", "composition"],
            path,
        )
    elif schema_kind == "odd_world_model.projection_spec":
        _require_keys(document, ["projection_id", "projection_kind", "source_refs"], path)
    elif schema_kind == "odd_world_model.evidence_manifest":
        _require_keys(document, ["manifest_id", "refs"], path)

    return ValidationResult(path=path, schema_kind=schema_kind, valid=True, message="ok")


def validate_tree(root: Path) -> list[ValidationResult]:
    results: list[ValidationResult] = []
    for path in sorted(root.rglob("*.json")):
        if path.name.endswith(".schema.json"):
            continue
        result = validate_document(path)
        results.append(result)
    return results


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Validate odd_world_model world-model carrier JSON files.")
    parser.add_argument("path", nargs="?", default=str(schemas_root().parent / "examples"), help="Path to a fragment root or example tree.")
    return parser


def main() -> int:
    parser = build_parser()
    args = parser.parse_args()
    root = Path(args.path).resolve()
    if not root.exists():
        raise SystemExit(f"path does not exist: {root}")
    results = validate_tree(root)
    for result in results:
        print(json.dumps({
            "path": str(result.path),
            "schema_kind": result.schema_kind,
            "valid": result.valid,
            "message": result.message,
        }))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
