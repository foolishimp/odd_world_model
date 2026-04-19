# Implements: REQ-ODD-WORLD-MODEL-BUILD-VERIFY-003
# Implements: REQ-ODD-WORLD-MODEL-WORLD-OBJECT-006
"""Generate conventional and covariant proof outputs from the sandbox corpus."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from odd_world_model.build_line.fpml_trade_domain import OFFICIAL_SAMPLE_INPUT_REF
from odd_world_model.build_line.trade_to_apra import build as build_trade_to_apra_sandbox
from odd_world_model.build_line.trade_to_apra import sandbox_root


def proof_root() -> Path:
    return sandbox_root() / "proof"


def published_root() -> Path:
    return sandbox_root() / "published"


def stitching_root() -> Path:
    return sandbox_root() / "stitching_candidates"


def _load_json(path: Path) -> dict[str, Any]:
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def _write_json(path: Path, payload: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8") as handle:
        json.dump(payload, handle, indent=2)
        handle.write("\n")


def _write_text(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8") as handle:
        handle.write(content)


def _bundle() -> dict[str, Any]:
    build_trade_to_apra_sandbox()
    trade_fragment = _load_json(published_root() / "trade_representation_domain" / "fragment.json")
    trade_object = _load_json(published_root() / "trade_representation_domain" / "objects" / "trade_contract_state.json")
    trade_product = _load_json(published_root() / "trade_representation_domain" / "objects" / "commodity_swap_product.json")
    trade_agreement = _load_json(published_root() / "trade_representation_domain" / "objects" / "master_agreement_reference.json")
    apra_fragment = _load_json(published_root() / "apra_liquidity_domain" / "fragment.json")
    apra_object = _load_json(published_root() / "apra_liquidity_domain" / "objects" / "reporting_position.json")
    apra_bucket = _load_json(published_root() / "apra_liquidity_domain" / "objects" / "counterparty_bucket.json")
    apra_agreement = _load_json(published_root() / "apra_liquidity_domain" / "objects" / "agreement_treatment_basis.json")
    treatment = _load_json(published_root() / "trade_representation_domain" / "treatments" / "trade_to_apra_liquidity_candidate.json")
    covariance = _load_json(stitching_root() / "trade_to_apra_covariance_candidate.json")
    adjoint = _load_json(stitching_root() / "trade_to_apra_adjoint_candidate.json")
    return {
        "trade_fragment": trade_fragment,
        "trade_object": trade_object,
        "trade_product": trade_product,
        "trade_agreement": trade_agreement,
        "apra_fragment": apra_fragment,
        "apra_object": apra_object,
        "apra_bucket": apra_bucket,
        "apra_agreement": apra_agreement,
        "treatment": treatment,
        "covariance": covariance,
        "adjoint": adjoint,
    }


def _mapping_document(bundle: dict[str, Any]) -> str:
    trade_object = bundle["trade_object"]
    trade_product = bundle["trade_product"]
    trade_agreement = bundle["trade_agreement"]
    apra_object = bundle["apra_object"]
    apra_bucket = bundle["apra_bucket"]
    apra_agreement = bundle["apra_agreement"]
    treatment = bundle["treatment"]
    adjoint = bundle["adjoint"]
    covariance = bundle["covariance"]
    preserved = "\n".join(f"- `{item}`" for item in treatment["preserved_structure"])
    changed = "\n".join(f"- {item}" for item in treatment["changed_meaning"])
    loss = "\n".join(f"- {item}" for item in adjoint["loss_notes"])
    surplus = "\n".join(f"- {item}" for item in adjoint["surplus_notes"])
    return f"""# Trade To APRA Mapping Document

## Scope

- Source fragment: `{bundle["trade_fragment"]["fragment_id"]}`
- Target fragment: `{bundle["apra_fragment"]["fragment_id"]}`
- Treatment: `{treatment["treatment_id"]}`
- Covariance edge: `{covariance["edge_id"]}`
- Adjoint mapping: `{adjoint["mapping_id"]}`

## Object Mapping

- `{trade_object["object_id"]}` -> `{apra_object["object_id"]}`
- `{trade_product["object_id"]}` -> `{apra_object["object_id"]}`
- `{trade_agreement["object_id"]}` -> `{apra_agreement["object_id"]}`
- `{trade_object["object_id"]}` -> `{apra_bucket["object_id"]}` via counterparty and reporting treatment

## Preserved Structure

{preserved}

## Changed Meaning

{changed}

## Declared Loss

{loss}

## Target-Native Surplus

{surplus}

## Interpret-Back Summary

{adjoint["interpret_back_summary"]}

## Traceability

- Source evidence: `{OFFICIAL_SAMPLE_INPUT_REF}`
- Target evidence: `input://apra_liquidity/authority_claims.json`
- Review surface: `review://fpml_trade_representation_standard/parsed_trade_observation.json`
"""


def _dbt_sql(bundle: dict[str, Any]) -> str:
    trade_object = bundle["trade_object"]
    apra_object = bundle["apra_object"]
    treatment = bundle["treatment"]
    preserved_comment = ", ".join(treatment["preserved_structure"])
    return f"""-- Generated from the governed odd_world_model semantic kernel.
-- Source object: {trade_object["object_id"]}
-- Target object: {apra_object["object_id"]}
-- Preserved structure: {preserved_comment}

with source_trade as (
    select
        trade_id,
        trade_date,
        product_id,
        counterparty_id,
        agreement_id
    from {{{{ ref('fpml_trade_representation') }}}}
)

select
    trade_id as trade_identifier,
    case
        when counterparty_id is not null then 'financial_institution'
        else 'unclassified'
    end as counterparty_bucket,
    'master_agreement_reviewed' as agreement_assessment,
    'contractual_outflow_assessment' as liquidity_bucket,
    'draft_classified' as reporting_lifecycle_state
from source_trade
"""


def _covariant_transform(bundle: dict[str, Any]) -> dict[str, Any]:
    trade_object = bundle["trade_object"]
    apra_object = bundle["apra_object"]
    treatment = bundle["treatment"]
    covariance = bundle["covariance"]
    adjoint = bundle["adjoint"]
    return {
        "transform_id": "data_mapper.covariant_transform.trade_to_apra_liquidity.v1",
        "transform_kind": "covariant_transform",
        "source_domain": adjoint["source_domain"],
        "target_domain": adjoint["target_domain"],
        "source_object_ref": trade_object["object_id"],
        "target_object_ref": apra_object["object_id"],
        "treatment_ref": treatment["treatment_id"],
        "covariance_edge_ref": covariance["edge_id"],
        "adjoint_mapping_ref": adjoint["mapping_id"],
        "relationship_kind": covariance["relationship_kind"],
        "preserved_structure": adjoint["preserved_structure"],
        "loss_notes": adjoint["loss_notes"],
        "surplus_notes": adjoint["surplus_notes"],
        "event_stream": [
            {
                "event_kind": "source_state_observed",
                "object_ref": trade_object["object_id"],
                "state": trade_object["state"]["lifecycle_state"],
            },
            {
                "event_kind": "cross_domain_treatment_applied",
                "treatment_ref": treatment["treatment_id"],
                "changed_meaning": treatment["changed_meaning"],
            },
            {
                "event_kind": "target_state_emitted",
                "object_ref": apra_object["object_id"],
                "state": apra_object["state"]["lifecycle_state"],
            },
        ],
        "traceability": {
            "source_evidence_refs": trade_object["evidence"]["refs"],
            "target_evidence_refs": apra_object["evidence"]["refs"],
        },
    }


def _comparison_report(bundle: dict[str, Any], covariant_path: Path, mapping_doc_path: Path, dbt_path: Path) -> str:
    treatment = bundle["treatment"]
    covariance = bundle["covariance"]
    adjoint = bundle["adjoint"]
    return f"""# Trade To APRA Proof Comparison

## Outputs

- Conventional mapping document: `{mapping_doc_path.relative_to(sandbox_root())}`
- Conventional dbt model: `{dbt_path.relative_to(sandbox_root())}`
- Covariant transform: `{covariant_path.relative_to(sandbox_root())}`

## Shared Governing Semantics

- Treatment: `{treatment["treatment_id"]}`
- Covariance edge: `{covariance["edge_id"]}`
- Adjoint mapping: `{adjoint["mapping_id"]}`

## Semantic Continuity

- Both output classes derive from the same source Markov object and target Markov object.
- Both output classes carry the same preserved structure set.
- Both output classes are anchored to the same cross-domain treatment and interpret-back semantics.

## Declared Loss

{chr(10).join(f"- {item}" for item in adjoint["loss_notes"])}

## Drift Visibility

- Conventional outputs show the intended structural mapping and SQL realization.
- The covariant transform keeps the covariance edge and adjoint reference explicit.
- If the cross-domain relationship changes, the covariant path has named semantic control points to inspect: treatment, covariance, and adjoint.
- The conventional path remains useful for incumbent delivery, but semantic drift is easier to hide there unless the governed model is reviewed first.
"""


def _proof_summary(bundle: dict[str, Any], outputs: dict[str, Path]) -> dict[str, Any]:
    return {
        "proof_id": "odd_world_model.proof.trade_to_apra.v1",
        "source_fragment_ref": bundle["trade_fragment"]["fragment_id"],
        "target_fragment_ref": bundle["apra_fragment"]["fragment_id"],
        "treatment_ref": bundle["treatment"]["treatment_id"],
        "covariance_edge_ref": bundle["covariance"]["edge_id"],
        "adjoint_mapping_ref": bundle["adjoint"]["mapping_id"],
        "outputs": {key: str(path.relative_to(sandbox_root())) for key, path in outputs.items()},
    }


def build() -> None:
    bundle = _bundle()
    mapping_doc_path = proof_root() / "conventional" / "trade_to_apra_mapping_document.md"
    dbt_path = proof_root() / "conventional" / "trade_to_apra_liquidity.sql"
    covariant_path = proof_root() / "covariant" / "trade_to_apra_covariant_transform.json"
    comparison_path = proof_root() / "comparison" / "trade_to_apra_comparison.md"
    summary_path = proof_root() / "proof_summary.json"

    _write_text(mapping_doc_path, _mapping_document(bundle))
    _write_text(dbt_path, _dbt_sql(bundle))
    _write_json(covariant_path, _covariant_transform(bundle))
    _write_text(comparison_path, _comparison_report(bundle, covariant_path, mapping_doc_path, dbt_path))
    _write_json(
        summary_path,
        _proof_summary(
            bundle,
            {
                "mapping_document": mapping_doc_path,
                "dbt_model": dbt_path,
                "covariant_transform": covariant_path,
                "comparison_report": comparison_path,
            },
        ),
    )


def main() -> int:
    build()
    print(proof_root())
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
