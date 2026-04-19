# Implements: REQ-ODD-WORLD-MODEL-MAPPING-CAP-001
# Implements: REQ-ODD-WORLD-MODEL-MAPPING-CAP-002
# Implements: REQ-ODD-WORLD-MODEL-MAPPING-CAP-003
# Implements: REQ-ODD-WORLD-MODEL-MAPPING-CAP-004
# Implements: REQ-ODD-WORLD-MODEL-MAPPING-CAP-005
# Implements: REQ-ODD-WORLD-MODEL-MAPPING-CAP-006
# Implements: REQ-ODD-WORLD-MODEL-MAPPING-CAP-007
# Implements: REQ-ODD-WORLD-MODEL-MAPPING-CONSTRAINT-001
# Implements: REQ-ODD-WORLD-MODEL-MAPPING-CONSTRAINT-002
# Implements: REQ-ODD-WORLD-MODEL-MAPPING-CONSTRAINT-003
# Implements: REQ-ODD-WORLD-MODEL-MAPPING-CONSTRAINT-004
# Implements: REQ-ODD-WORLD-MODEL-MAPPING-CONSTRAINT-005
# Implements: REQ-ODD-WORLD-MODEL-MAPPING-CONSTRAINT-006
"""Governed mapping line over the retained trade-to-APRA published domains."""

from __future__ import annotations

import json
import shutil
from pathlib import Path
from typing import Any

from odd_world_model.build_line.trade_to_apra import materialize_composed_world_model_surface, sandbox_root
from odd_world_model.world_model.load import load_json


def mapping_root() -> Path:
    return sandbox_root() / "mapping"


def analysis_path() -> Path:
    return mapping_root() / "analysis" / "trade_to_apra_mapping_analysis.json"


def record_path() -> Path:
    return mapping_root() / "records" / "trade_to_apra_mapping_record.json"


def report_path() -> Path:
    return mapping_root() / "reports" / "trade_to_apra_mapping_report.md"


def published_root() -> Path:
    return sandbox_root() / "published"


def _artifact_roots() -> dict[str, Path]:
    return {
        "trade": published_root() / "trade_representation_domain",
        "apra": published_root() / "apra_liquidity_domain",
    }


def _write_json(path: Path, payload: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8") as handle:
        json.dump(payload, handle, indent=2)
        handle.write("\n")


def _write_text(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")


def _reset_outputs() -> None:
    shutil.rmtree(mapping_root(), ignore_errors=True)


def _bundle() -> dict[str, Any]:
    materialize_composed_world_model_surface(reset=True)
    roots = _artifact_roots()
    trade_root = roots["trade"]
    apra_root = roots["apra"]
    return {
        "roots": roots,
        "trade_fragment": load_json(trade_root / "fragment.json"),
        "trade_object": load_json(trade_root / "objects" / "trade_contract_state.json"),
        "trade_ledger": {
            path.stem: load_json(path)
            for path in sorted((trade_root / "attribute_ledger" / "trade_contract_state").glob("*.json"))
        },
        "apra_fragment": load_json(apra_root / "fragment.json"),
        "apra_object": load_json(apra_root / "objects" / "reporting_position.json"),
        "apra_ledger": {
            path.stem: load_json(path)
            for path in sorted((apra_root / "attribute_ledger" / "reporting_position").glob("*.json"))
        },
        "treatment": load_json(trade_root / "treatments" / "trade_to_apra_liquidity_candidate.json"),
        "covariance": load_json(sandbox_root() / "stitching_candidates" / "trade_to_apra_covariance_candidate.json"),
        "adjoint": load_json(sandbox_root() / "stitching_candidates" / "trade_to_apra_adjoint_candidate.json"),
    }


def _mapping_entry(
    *,
    mapping_id: str,
    source_entry: dict[str, Any],
    target_entry: dict[str, Any],
    category: str,
    confidence_band: str,
    rationale: list[str],
    evidence_basis: list[str],
    ambiguity_notes: list[str] | None = None,
    declared_loss: list[str] | None = None,
) -> dict[str, Any]:
    return {
        "mapping_id": mapping_id,
        "source_object_ref": source_entry["object_ref"],
        "source_attribute_ref": source_entry["entry_id"],
        "source_claim_key": source_entry["claim_key"],
        "target_object_ref": target_entry["object_ref"],
        "target_attribute_ref": target_entry["entry_id"],
        "target_claim_key": target_entry["claim_key"],
        "category": category,
        "directionality": "source_to_target",
        "confidence_band": confidence_band,
        "confidence_rationale": rationale,
        "evidence_basis": evidence_basis,
        "ambiguity_notes": list(ambiguity_notes or ()),
        "declared_loss": list(declared_loss or ()),
    }


def build_analysis(*, reset: bool = True) -> dict[str, Any]:
    if reset:
        _reset_outputs()

    bundle = _bundle()
    trade_ledger = bundle["trade_ledger"]
    apra_ledger = bundle["apra_ledger"]

    selected_mappings = [
        _mapping_entry(
            mapping_id="odd_world_model.mapping.trade_to_apra.party_a_to_counterparty_bucket.v1",
            source_entry=trade_ledger["party_a_reference"],
            target_entry=apra_ledger["counterparty_bucket"],
            category="treatment_projection",
            confidence_band="strong",
            rationale=[
                "shared counterparty identity appears in the source and target qualifiers",
                "target trace explicitly references imported trade counterparty evidence",
                "target claim is a regulatory classification over the imported party reference",
            ],
            evidence_basis=[
                bundle["treatment"]["treatment_id"],
                bundle["covariance"]["edge_id"],
                trade_ledger["party_a_reference"]["entry_id"],
                apra_ledger["counterparty_bucket"]["entry_id"],
            ],
            ambiguity_notes=[
                "The retained slice does not yet model counterparty-side role selection generically across both trade parties."
            ],
        ),
        _mapping_entry(
            mapping_id="odd_world_model.mapping.trade_to_apra.master_agreement_to_agreement_treatment_basis.v1",
            source_entry=trade_ledger["master_agreement_reference"],
            target_entry=apra_ledger["agreement_treatment_basis"],
            category="treatment_projection",
            confidence_band="strong",
            rationale=[
                "shared agreement type qualifiers support the correspondence",
                "target claim composes APRA treatment guidance over imported agreement evidence",
                "adjoint support declares interpret-back over the agreement surface",
            ],
            evidence_basis=[
                bundle["treatment"]["treatment_id"],
                bundle["adjoint"]["mapping_id"],
                trade_ledger["master_agreement_reference"]["entry_id"],
                apra_ledger["agreement_treatment_basis"]["entry_id"],
            ],
        ),
        _mapping_entry(
            mapping_id="odd_world_model.mapping.trade_to_apra.product_to_liquidity_bucket.v1",
            source_entry=trade_ledger["product_reference"],
            target_entry=apra_ledger["liquidity_bucket"],
            category="derived_mapping",
            confidence_band="moderate",
            rationale=[
                "target claim is derived from imported product type and APRA liquidity guidance",
                "semantic correspondence is through classification, not direct identity",
                "source product economics are narrowed into a regulatory liquidity bucket",
            ],
            evidence_basis=[
                bundle["treatment"]["treatment_id"],
                bundle["adjoint"]["mapping_id"],
                trade_ledger["product_reference"]["entry_id"],
                apra_ledger["liquidity_bucket"]["entry_id"],
            ],
            ambiguity_notes=[
                "Detailed commodity economics do not survive intact across the regulatory treatment boundary."
            ],
            declared_loss=bundle["adjoint"]["loss_notes"],
        ),
    ]

    mapped_source_keys = {entry["source_claim_key"] for entry in selected_mappings}
    mapped_target_keys = {entry["target_claim_key"] for entry in selected_mappings}

    analysis = {
        "schema_kind": "odd_world_model.mapping_analysis",
        "schema_version": "v1",
        "analysis_id": "odd_world_model.mapping_analysis.trade_representation.to_apra_liquidity.trade_fpml_001.v1",
        "source_fragment_ref": bundle["trade_fragment"]["fragment_id"],
        "target_fragment_ref": bundle["apra_fragment"]["fragment_id"],
        "source_domain_ref": bundle["trade_fragment"]["bounded_context"],
        "target_domain_ref": bundle["apra_fragment"]["bounded_context"],
        "object_pairings": [
            {
                "pairing_id": "odd_world_model.mapping_pair.trade_to_apra.primary_object_pair.v1",
                "source_object_ref": bundle["trade_object"]["object_id"],
                "target_object_ref": bundle["apra_object"]["object_id"],
                "category": "treatment_projection",
                "confidence_band": "strong",
                "rationale": [
                    "published treatment explicitly reinterprets the trade object as a regulatory reporting position",
                    "published covariance and adjoint surfaces bind the object pair directly",
                    "target object evidence declares imported trade artifact dependence",
                ],
                "supporting_refs": [
                    bundle["treatment"]["treatment_id"],
                    bundle["covariance"]["edge_id"],
                    bundle["adjoint"]["mapping_id"],
                ],
            }
        ],
        "source_attribute_inventory": [
            {
                "entry_id": entry["entry_id"],
                "claim_key": entry["claim_key"],
                "summary": entry["summary"],
            }
            for entry in trade_ledger.values()
        ],
        "target_attribute_inventory": [
            {
                "entry_id": entry["entry_id"],
                "claim_key": entry["claim_key"],
                "summary": entry["summary"],
            }
            for entry in apra_ledger.values()
        ],
        "selected_attribute_mappings": selected_mappings,
        "unassigned_source_attributes": [
            {
                "entry_id": entry["entry_id"],
                "claim_key": entry["claim_key"],
                "summary": entry["summary"],
                "reason": "No explicit retained target attribute currently materializes this source semantic in the bounded APRA slice.",
            }
            for key, entry in trade_ledger.items()
            if key not in mapped_source_keys
        ],
        "unassigned_target_attributes": [
            {
                "entry_id": entry["entry_id"],
                "claim_key": entry["claim_key"],
                "summary": entry["summary"],
                "reason": "No retained source attribute currently maps to this target reporting semantic in the bounded trade slice.",
            }
            for key, entry in apra_ledger.items()
            if key not in mapped_target_keys
        ],
        "supporting_refs": {
            "treatment_ref": bundle["treatment"]["treatment_id"],
            "covariance_ref": bundle["covariance"]["edge_id"],
            "adjoint_ref": bundle["adjoint"]["mapping_id"],
        },
    }

    _write_json(analysis_path(), analysis)
    return analysis


def build_record(*, reset: bool = True) -> dict[str, Any]:
    analysis = build_analysis(reset=reset) if reset or not analysis_path().exists() else load_json(analysis_path())

    record = {
        "schema_kind": "odd_world_model.mapping_record",
        "schema_version": "v1",
        "mapping_record_id": "odd_world_model.mapping_record.trade_representation.to_apra_liquidity.trade_fpml_001.v1",
        "analysis_ref": "mapping://analysis/trade_to_apra_mapping_analysis.json",
        "source_fragment_ref": analysis["source_fragment_ref"],
        "target_fragment_ref": analysis["target_fragment_ref"],
        "source_domain_ref": analysis["source_domain_ref"],
        "target_domain_ref": analysis["target_domain_ref"],
        "object_pairings": analysis["object_pairings"],
        "attribute_mappings": analysis["selected_attribute_mappings"],
        "category_breakdown": {
            category: sum(
                1 for mapping in analysis["selected_attribute_mappings"] if mapping["category"] == category
            )
            for category in sorted({mapping["category"] for mapping in analysis["selected_attribute_mappings"]})
        },
        "confidence_breakdown": {
            band: sum(
                1 for mapping in analysis["selected_attribute_mappings"] if mapping["confidence_band"] == band
            )
            for band in sorted({mapping["confidence_band"] for mapping in analysis["selected_attribute_mappings"]})
        },
        "unassigned_source_attributes": analysis["unassigned_source_attributes"],
        "unassigned_target_attributes": analysis["unassigned_target_attributes"],
        "supporting_refs": analysis["supporting_refs"],
        "lineage": {
            "governing_published_domains": [
                analysis["source_fragment_ref"],
                analysis["target_fragment_ref"],
            ],
            "supporting_semantic_refs": [
                analysis["supporting_refs"]["treatment_ref"],
                analysis["supporting_refs"]["covariance_ref"],
                analysis["supporting_refs"]["adjoint_ref"],
            ],
        },
    }

    _write_json(record_path(), record)
    return record


def _report(record: dict[str, Any]) -> str:
    object_pair = record["object_pairings"][0]
    attribute_lines = []
    for mapping in record["attribute_mappings"]:
        reasons = "\n".join(f"  - {item}" for item in mapping["confidence_rationale"])
        ambiguity = "\n".join(f"  - {item}" for item in mapping["ambiguity_notes"]) or "  - none declared"
        loss = "\n".join(f"  - {item}" for item in mapping["declared_loss"]) or "  - none declared"
        attribute_lines.append(
            "\n".join(
                (
                    f"- `{mapping['source_claim_key']}` -> `{mapping['target_claim_key']}`",
                    f"  - category: `{mapping['category']}`",
                    f"  - confidence: `{mapping['confidence_band']}`",
                    "  - reasons:",
                    reasons,
                    "  - ambiguity:",
                    ambiguity,
                    "  - declared loss:",
                    loss,
                )
            )
        )

    source_unassigned = "\n".join(
        f"- `{entry['claim_key']}` — {entry['reason']}" for entry in record["unassigned_source_attributes"]
    )
    target_unassigned = "\n".join(
        f"- `{entry['claim_key']}` — {entry['reason']}" for entry in record["unassigned_target_attributes"]
    )

    return f"""# Trade To APRA Mapping Report

## Scope

- source fragment: `{record["source_fragment_ref"]}`
- target fragment: `{record["target_fragment_ref"]}`
- durable mapping record: `{record["mapping_record_id"]}`

## Object Pairing Basis

- source object: `{object_pair["source_object_ref"]}`
- target object: `{object_pair["target_object_ref"]}`
- category: `{object_pair["category"]}`
- confidence: `{object_pair["confidence_band"]}`

Supporting refs:
{chr(10).join(f"- `{item}`" for item in object_pair["supporting_refs"])}

Rationale:
{chr(10).join(f"- {item}" for item in object_pair["rationale"])}

## Attribute Mappings

{chr(10).join(attribute_lines)}

## Category Breakdown

{chr(10).join(f"- `{category}`: {count}" for category, count in record["category_breakdown"].items())}

## Confidence Breakdown

{chr(10).join(f"- `{band}`: {count}" for band, count in record["confidence_breakdown"].items())}

## Unassigned Source Attributes

{source_unassigned}

## Unassigned Target Attributes

{target_unassigned}

## Governing Semantic Refs

{chr(10).join(f"- `{item}`" for item in record["lineage"]["supporting_semantic_refs"])}
"""


def build_report(*, reset: bool = True) -> dict[str, Any]:
    record = build_record(reset=reset) if reset or not record_path().exists() else load_json(record_path())
    _write_text(report_path(), _report(record))
    return {
        "report_path": str(report_path()),
        "mapping_record_id": record["mapping_record_id"],
        "source_fragment_ref": record["source_fragment_ref"],
        "target_fragment_ref": record["target_fragment_ref"],
    }


def build() -> dict[str, Any]:
    analysis = build_analysis(reset=True)
    record = build_record(reset=False)
    report = build_report(reset=False)
    return {
        "analysis_id": analysis["analysis_id"],
        "mapping_record_id": record["mapping_record_id"],
        "report_path": report["report_path"],
    }


def main() -> int:
    payload = build()
    print(json.dumps(payload, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
