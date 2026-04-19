# Implements: REQ-ODD-WORLD-MODEL-BUILD-CAP-001
# Implements: REQ-ODD-WORLD-MODEL-BUILD-CAP-002
# Implements: REQ-ODD-WORLD-MODEL-BUILD-CONSTRAINT-001
"""Local constructor for the retained odd_world_model GTL carrier slice."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from .build_line.fpml_trade_domain import materialize_source_observation_surface
from .build_line.trade_to_apra import (
    materialize_assurance_surface,
    materialize_attribute_ledger_surface,
    materialize_composed_world_model_surface,
    materialize_markov_object_cut_surface,
    materialize_published_domain_artifact_surface,
    materialize_trace_surface,
)
from .mapping.trade_to_apra import build_analysis as build_trade_to_apra_mapping_analysis
from .mapping.trade_to_apra import build_record as build_trade_to_apra_mapping_record
from .mapping.trade_to_apra import build_report as build_trade_to_apra_mapping_report
from .query.trade_to_apra import build as build_trade_to_apra_query
from .workspace_assets import assess_generated_asset_contract


def _read_json(path: Path, *, label: str) -> dict[str, Any]:
    try:
        raw = json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        raise ValueError(f"{label} is not valid JSON: {exc}") from exc
    if not isinstance(raw, dict):
        raise ValueError(f"{label} must contain a JSON object")
    return raw


def _run_retained_build(target_asset: str) -> None:
    if target_asset == "source_observation_surface":
        materialize_source_observation_surface(reset=True)
        return
    if target_asset == "trace_surface":
        materialize_trace_surface(reset=True)
        return
    if target_asset == "assurance_surface":
        materialize_assurance_surface(reset=True)
        return
    if target_asset == "attribute_ledger_surface":
        materialize_attribute_ledger_surface(reset=True)
        return
    if target_asset == "markov_object_cut_surface":
        materialize_markov_object_cut_surface(reset=True)
        return
    if target_asset == "published_domain_artifact_surface":
        materialize_published_domain_artifact_surface(reset=True)
        return
    if target_asset == "composed_world_model_surface":
        materialize_composed_world_model_surface(reset=True)
        return
    if target_asset == "query_projection_surface":
        build_trade_to_apra_query()
        return
    if target_asset == "mapping_analysis_surface":
        build_trade_to_apra_mapping_analysis(reset=True)
        return
    if target_asset == "mapping_record_surface":
        build_trade_to_apra_mapping_record(reset=True)
        return
    if target_asset == "mapping_report_surface":
        build_trade_to_apra_mapping_report(reset=True)
        return
    raise ValueError(f"Unsupported target_asset {target_asset!r}")


def construct_manifest(manifest_path: str | Path, *, workspace_root: str | Path = ".") -> dict[str, Any]:
    workspace = Path(workspace_root).resolve()
    manifest_file = Path(manifest_path).resolve()
    manifest = _read_json(manifest_file, label=f"manifest file {manifest_file}")

    target_asset = manifest.get("target_asset")
    result_path = manifest.get("result_path")
    failing_evaluators = manifest.get("failing_evaluators", [])
    if not isinstance(target_asset, str) or not target_asset:
        raise ValueError("manifest must provide target_asset")
    if not isinstance(result_path, str) or not result_path:
        raise ValueError("manifest must provide result_path")
    if not isinstance(failing_evaluators, list) or not failing_evaluators:
        raise ValueError("manifest must provide failing_evaluators")

    _run_retained_build(target_asset)

    attestation = assess_generated_asset_contract(workspace, target_asset)
    if not attestation["contract_satisfied"]:
        raise RuntimeError(
            f"constructed asset {target_asset!r} failed its generated-asset contract: {attestation}"
        )

    assessment_evaluators = [
        evaluator["name"]
        for evaluator in failing_evaluators
        if isinstance(evaluator, dict) and isinstance(evaluator.get("name"), str) and evaluator["name"]
    ]
    if not assessment_evaluators:
        raise ValueError("manifest failing_evaluators must include evaluator names")

    evidence = (
        f"Rebuilt retained odd_world_model steel thread and satisfied generated-asset contract "
        f"for {target_asset}"
    )
    payload = {
        "edge": manifest["edge"],
        "actor": "odd_world_model_constructor",
        "attestation": attestation,
        "assessments": [
            {
                "evaluator": evaluator_name,
                "result": "pass",
                "evidence": evidence,
            }
            for evaluator_name in assessment_evaluators
        ],
    }

    result_file = Path(result_path)
    result_file.parent.mkdir(parents=True, exist_ok=True)
    result_file.write_text(json.dumps(payload, indent=2), encoding="utf-8")

    return {
        "status": "constructed",
        "manifest_path": str(manifest_file),
        "target_asset": target_asset,
        "result_path": str(result_file),
        "actor": payload["actor"],
        "attestation": attestation,
    }
