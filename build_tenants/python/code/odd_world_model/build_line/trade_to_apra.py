# Implements: REQ-ODD-WORLD-MODEL-BUILD-CAP-004
# Implements: REQ-ODD-WORLD-MODEL-BUILD-CAP-005
# Implements: REQ-ODD-WORLD-MODEL-BUILD-CONSTRAINT-003
# Implements: REQ-ODD-WORLD-MODEL-BUILD-CONSTRAINT-004
# Implements: REQ-ODD-WORLD-MODEL-BUILD-CONSTRAINT-005
# Implements: REQ-ODD-WORLD-MODEL-WORLD-OBJECT-003
# Implements: REQ-ODD-WORLD-MODEL-WORLD-OBJECT-005
# Implements: REQ-ODD-WORLD-MODEL-WORLD-OBJECT-006
# Implements: REQ-ODD-WORLD-MODEL-WORLD-OBJECT-008
"""Build the first trade-to-APRA steel-thread corpus."""

from __future__ import annotations

import json
import shutil
from pathlib import Path
from typing import Any

from odd_world_model.build_line.fpml_trade_domain import (
    OFFICIAL_SAMPLE_INPUT_REF,
    build as build_fpml_trade_domain,
    materialize_trade_domain_artifact as materialize_fpml_trade_domain_artifact,
    source_domain_root as fpml_source_domain_root,
)
from odd_world_model.build_line.fpml_trade_domain import example_root as fpml_example_root
from odd_world_model.world_model.materialize import attribute_ledger_entry, assurance_record, trace_record
from odd_world_model.world_model.registry import examples_root


PUBLISHED_AT = "2026-04-15T00:00:00Z"
OBSERVED_AT = "2026-04-15T00:10:00Z"


def sandbox_root() -> Path:
    return examples_root() / "sandbox_trade_to_apra_mvp"


def inputs_root() -> Path:
    return sandbox_root() / "inputs"


def published_root() -> Path:
    return sandbox_root() / "published"


def review_root() -> Path:
    return sandbox_root() / "review"


def stitching_root() -> Path:
    return sandbox_root() / "stitching_candidates"


def _trade_domain_root() -> Path:
    return published_root() / "trade_representation_domain"


def _trade_source_domain_root() -> Path:
    return published_root() / "fpml_confirmation_source_domain"


def _apra_domain_root() -> Path:
    return published_root() / "apra_liquidity_domain"


def _source_trade_root() -> Path:
    return fpml_example_root() / "published" / "trade_representation_domain"


def _source_trade_source_domain_root() -> Path:
    return fpml_source_domain_root()


def _source_trade_review_root() -> Path:
    return fpml_example_root() / "review"


def _source_trade_review_path() -> Path:
    return _source_trade_review_root() / "parsed_trade_observation.json"


def _load_json(path: Path) -> dict[str, Any]:
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def _write_json(path: Path, payload: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8") as handle:
        json.dump(payload, handle, indent=2)
        handle.write("\n")


def _remove_tree(root: Path) -> None:
    shutil.rmtree(root, ignore_errors=True)


def _reset_generated_output() -> None:
    for root in (review_root(), published_root(), stitching_root()):
        if root.exists():
            _remove_tree(root)


def _apra_input() -> dict[str, Any]:
    return _load_json(inputs_root() / "apra_liquidity" / "domain_input.json")


def _apra_authority_claims_input() -> dict[str, Any]:
    return _load_json(inputs_root() / "apra_liquidity" / "authority_claims.json")


def _source_trade_bundle(*, reset_source: bool = True) -> dict[str, Any]:
    if reset_source:
        materialize_fpml_trade_domain_artifact(reset=True)
    else:
        build_fpml_trade_domain()
    root = _source_trade_root()
    fragment = _load_json(root / "fragment.json")
    observation = _load_json(_source_trade_review_path())
    objects_by_file = {
        path.name: _load_json(path)
        for path in sorted((root / "objects").glob("*.json"))
    }

    trade_object = objects_by_file["trade_contract_state.json"]
    product_object = objects_by_file["commodity_swap_product.json"]
    agreement_object = objects_by_file["master_agreement_reference.json"]
    party_objects = [
        objects_by_file["party_a_profile.json"],
        objects_by_file["party_b_profile.json"],
    ]

    return {
        "root": root,
        "review_root": _source_trade_review_root(),
        "fragment": fragment,
        "observation": observation,
        "trade_object": trade_object,
        "product_object": product_object,
        "agreement_object": agreement_object,
        "party_objects": party_objects,
    }


def _copy_trade_domain(bundle: dict[str, Any]) -> None:
    source_root = bundle["root"]
    source_review_root = bundle["review_root"]
    source_source_domain_root = _source_trade_source_domain_root()
    for path in sorted(source_review_root.rglob("*.json")):
        relative = path.relative_to(source_review_root)
        _write_json(review_root() / relative, _load_json(path))
    for path in sorted(source_source_domain_root.rglob("*.json")):
        relative = path.relative_to(source_source_domain_root)
        _write_json(_trade_source_domain_root() / relative, _load_json(path))
    fragment = dict(bundle["fragment"])
    fragment["summary"] = (
        "Sandbox trade-representation domain fragment imported from the bounded "
        "FpML real-standard ingestion lane."
    )
    fragment["links"] = sorted(
        set(
            fragment.get("links", [])
            + [
                "../apra_liquidity_domain/fragment.json",
                "../../stitching_candidates/trade_to_apra_covariance_candidate.json",
                "../../stitching_candidates/trade_to_apra_adjoint_candidate.json",
            ]
        )
    )
    _write_json(_trade_domain_root() / "fragment.json", fragment)

    trade_object_id = bundle["trade_object"]["object_id"]
    party_object_ids = [party["object_id"] for party in bundle["party_objects"]]
    agreement_object_id = bundle["agreement_object"]["object_id"]

    for path in sorted(source_root.rglob("*.json")):
        relative = path.relative_to(source_root)
        if relative == Path("fragment.json"):
            continue
        payload = _load_json(path)

        if relative.parts[:1] == ("objects",):
            object_id = payload.get("object_id")
            cross_domain = payload.setdefault("cross_domain", {})
            boundary = payload.setdefault("boundary", {})

            if object_id == trade_object_id:
                cross_domain["covariance_edge_refs"] = sorted(
                    set(
                        cross_domain.get("covariance_edge_refs", [])
                        + ["odd_world_model.covariance.trade_representation.to_apra_liquidity.trade_fpml_001.v1"]
                    )
                )
                cross_domain["adjoint_mapping_refs"] = sorted(
                    set(
                        cross_domain.get("adjoint_mapping_refs", [])
                        + ["odd_world_model.adjoint.trade_representation.to_apra_liquidity.trade_fpml_001.v1"]
                    )
                )
                boundary["adjacent_domains"] = sorted(
                    set(boundary.get("adjacent_domains", []) + ["odd_world_model.domain.apra_liquidity.reporting.sandbox.v1"])
                )
                blanket = payload.setdefault("blanket", {})
                blanket["adjacent_domains"] = sorted(
                    set(blanket.get("adjacent_domains", []) + ["odd_world_model.domain.apra_liquidity.reporting.sandbox.v1"])
                )
            elif object_id in party_object_ids or object_id == agreement_object_id:
                cross_domain["covariance_edge_refs"] = sorted(
                    set(
                        cross_domain.get("covariance_edge_refs", [])
                        + ["odd_world_model.covariance.trade_representation.to_apra_liquidity.trade_fpml_001.v1"]
                    )
                )
                cross_domain["adjoint_mapping_refs"] = sorted(
                    set(
                        cross_domain.get("adjoint_mapping_refs", [])
                        + ["odd_world_model.adjoint.trade_representation.to_apra_liquidity.trade_fpml_001.v1"]
                    )
                )
                boundary["adjacent_domains"] = sorted(
                    set(boundary.get("adjacent_domains", []) + ["odd_world_model.domain.apra_liquidity.reporting.sandbox.v1"])
                )

        _write_json(_trade_domain_root() / relative, payload)


def _apra_ids(apra_input: dict[str, Any]) -> dict[str, str]:
    position = apra_input["reporting_position"]
    return {
        "fragment_id": "odd_world_model.fragment.apra_liquidity.reporting.sandbox.v1",
        "domain_id": "odd_world_model.domain.apra_liquidity.reporting.sandbox.v1",
        "reporting_position_id": (
            f"odd_world_model.markov_object.apra_liquidity.reporting_position.{position['position_id']}"
        ),
        "counterparty_bucket_id": (
            f"odd_world_model.world_model_object.apra_liquidity.counterparty_bucket.{position['counterparty_bucket']}"
        ),
        "agreement_basis_id": (
            "odd_world_model.world_model_object.apra_liquidity.agreement_treatment_basis."
            f"{position['agreement_assessment']}"
        ),
        "treatment_id": "odd_world_model.treatment.apra_liquidity.reporting_position.classification.v1",
        "local_covariance_id": (
            "odd_world_model.covariance.apra_liquidity.reporting_position.to_counterparty_bucket.v1"
        ),
        "local_adjoint_id": (
            "odd_world_model.adjoint.apra_liquidity.reporting_position.to_counterparty_bucket.v1"
        ),
        "cross_covariance_id": (
            "odd_world_model.covariance.trade_representation.to_apra_liquidity.trade_fpml_001.v1"
        ),
        "cross_adjoint_id": (
            "odd_world_model.adjoint.trade_representation.to_apra_liquidity.trade_fpml_001.v1"
        ),
    }


def _apra_trace_id(position_id: str, claim_key: str, source_label: str) -> str:
    return f"odd_world_model.trace.apra_liquidity.reporting_position.{position_id}.{claim_key}.{source_label}.v1"


def _apra_assurance_id(position_id: str, claim_key: str) -> str:
    return f"odd_world_model.assurance.apra_liquidity.reporting_position.{position_id}.{claim_key}.v1"


def _apra_ledger_entry_id(position_id: str, claim_key: str) -> str:
    return f"odd_world_model.attribute_ledger.apra_liquidity.reporting_position.{position_id}.{claim_key}.v1"


def _apra_trace_path(claim_key: str, source_label: str) -> Path:
    return Path("apra_liquidity") / "traces" / "reporting_position" / claim_key / f"{source_label}.json"


def _apra_assurance_path(claim_key: str) -> Path:
    return Path("apra_liquidity") / "assurance" / "reporting_position" / f"{claim_key}.json"


def _apra_ledger_path(claim_key: str) -> Path:
    return Path("attribute_ledger") / "reporting_position" / f"{claim_key}.json"


def _apra_trace_ref(claim_key: str, source_label: str) -> str:
    return f"review://apra_liquidity/traces/reporting_position/{claim_key}/{source_label}.json"


def _apra_assurance_ref(claim_key: str) -> str:
    return f"review://apra_liquidity/assurance/reporting_position/{claim_key}.json"


def _apra_ledger_ref(claim_key: str) -> str:
    return f"ledger://reporting_position/{claim_key}.json"


def _apra_claim_specs(
    apra_input: dict[str, Any],
    ids: dict[str, str],
    bundle: dict[str, Any],
    authority_claims: dict[str, Any],
) -> list[dict[str, Any]]:
    position = apra_input["reporting_position"]
    trade_observation = bundle["observation"]
    authority_claim_map = {
        claim["claim_id"]: claim
        for claim in authority_claims["claims"]
    }
    counterparty_authority = authority_claim_map["counterparty_bucket_financial_institution"]
    liquidity_authority = authority_claim_map["liquidity_bucket_contractual_outflow"]
    agreement_authority = authority_claim_map["agreement_treatment_basis_contractual_review"]
    primary_counterparty = trade_observation["parties"][0]
    agreement = trade_observation["agreement"]
    product = trade_observation["product"]
    return [
        {
            "claim_key": "counterparty_bucket",
            "claim_kind": "classified",
            "value": ids["counterparty_bucket_id"],
            "authority_basis": [
                "official:ars_210_0.financial_institution_counterparty_category",
                "official:apra_liquidity_faq.q25.reporting_classification_examples",
                "trade:parsed_trade_observation.primary_counterparty",
                "interpretation:bounded_apra_counterparty_classification_from_imported_trade",
            ],
            "summary": "Counterparty bucket classified from official APRA reporting definitions and imported trade counterparty evidence.",
            "qualifiers": {
                "bucket_code": position["counterparty_bucket"],
                "counterparty_name": primary_counterparty["party_name"],
                "counterparty_id": primary_counterparty["party_id"],
            },
            "sources": [
                {
                    "label": "authority_claim",
                    "source_ref": "input://apra_liquidity/authority_claims.json",
                    "source_kind": "document_review",
                    "locator": f"claims.{counterparty_authority['claim_id']}",
                    "observed_value": counterparty_authority["value_code"],
                    "summary": counterparty_authority["summary"],
                },
                {
                    "label": "trade_counterparty",
                    "source_ref": "review://parsed_trade_observation.json",
                    "source_kind": "data",
                    "locator": "parties[0]",
                    "observed_value": {
                        "party_id": primary_counterparty["party_id"],
                        "party_name": primary_counterparty["party_name"],
                    },
                    "summary": "Imported trade counterparty evidence for the bounded APRA classification.",
                },
            ],
        },
        {
            "claim_key": "agreement_treatment_basis",
            "claim_kind": "composed",
            "value": ids["agreement_basis_id"],
            "authority_basis": [
                "official:ars_210_0.guarantees_and_committed_facilities_definitions",
                "trade:parsed_trade_observation.agreement",
                "interpretation:reviewed_master_agreement_as_contractual_treatment_basis",
            ],
            "summary": "Agreement treatment basis composed from official APRA contractual-treatment guidance and imported master-agreement evidence.",
            "qualifiers": {
                "agreement_assessment": position["agreement_assessment"],
                "master_agreement_type": agreement["type"],
                "master_agreement_version": agreement["version"],
                "master_agreement_date": agreement["date"],
            },
            "sources": [
                {
                    "label": "authority_claim",
                    "source_ref": "input://apra_liquidity/authority_claims.json",
                    "source_kind": "document_review",
                    "locator": f"claims.{agreement_authority['claim_id']}",
                    "observed_value": agreement_authority["value_code"],
                    "summary": agreement_authority["summary"],
                },
                {
                    "label": "trade_agreement",
                    "source_ref": "review://parsed_trade_observation.json",
                    "source_kind": "data",
                    "locator": "agreement",
                    "observed_value": agreement,
                    "summary": "Imported trade agreement reference used to ground the reviewed master-agreement treatment basis.",
                },
            ],
        },
        {
            "claim_key": "liquidity_bucket",
            "claim_kind": "composed",
            "value": position["liquidity_bucket"],
            "authority_basis": [
                "official:ars_210_0.derivative_collateral_outflow_reporting",
                "official:apra_liquidity_faq.q24.derivative_collateral_outflow_guidance",
                "trade:parsed_trade_observation.product",
                "interpretation:bounded_derivative_liquidity_outflow_bucket",
            ],
            "summary": "Liquidity bucket composed from official APRA liquidity outflow guidance and imported derivative trade evidence.",
            "qualifiers": {
                "product_type": product["product_type"],
                "asset_class": product["asset_class"],
                "liquidity_bucket": position["liquidity_bucket"],
            },
            "sources": [
                {
                    "label": "authority_claim",
                    "source_ref": "input://apra_liquidity/authority_claims.json",
                    "source_kind": "document_review",
                    "locator": f"claims.{liquidity_authority['claim_id']}",
                    "observed_value": liquidity_authority["value_code"],
                    "summary": liquidity_authority["summary"],
                },
                {
                    "label": "trade_product",
                    "source_ref": "review://parsed_trade_observation.json",
                    "source_kind": "data",
                    "locator": "product",
                    "observed_value": product,
                    "summary": "Imported derivative-product evidence used to bound the liquidity outflow assessment.",
                },
            ],
        },
        {
            "claim_key": "reporting_lifecycle_state",
            "claim_kind": "projected",
            "value": position["lifecycle_state"],
            "authority_basis": [
                "project:apra_liquidity_domain_build_state",
            ],
            "summary": "Lifecycle state projected from the current retained APRA-liquidity domain-build state.",
            "sources": [
                {
                    "label": "domain_input",
                    "source_ref": "input://apra_liquidity/domain_input.json",
                    "source_kind": "data",
                    "locator": "reporting_position.lifecycle_state",
                    "observed_value": position["lifecycle_state"],
                    "summary": "Current bounded reporting-position lifecycle carried in the retained domain input.",
                },
            ],
        },
    ]


def _apra_fragment(
    apra_input: dict[str, Any],
    ids: dict[str, str],
    claim_specs: list[dict[str, Any]],
) -> dict[str, Any]:
    return {
        "schema_kind": "odd_world_model.world_fragment",
        "schema_version": "v1",
        "fragment_id": ids["fragment_id"],
        "bounded_context": apra_input["bounded_context"],
        "published_at": PUBLISHED_AT,
        "published_by": "odd_world_model.project.sandbox_trade_to_apra_mvp",
        "summary": "Bounded APRA-liquidity fragment grounded in official APRA authority claims and composed against the imported FpML trade artifact.",
        "objects": [
            "objects/reporting_position.json",
            "objects/counterparty_bucket.json",
            "objects/agreement_treatment_basis.json",
        ],
        "attribute_ledger_entries": [
            str(_apra_ledger_path(spec["claim_key"]))
            for spec in claim_specs
        ],
        "reference_artifacts": [
            "reference_artifacts/apra_counterparty_bucket_reference_set_v1.json"
        ],
        "treatments": [
            "treatments/reporting_position_classification.json"
        ],
        "edges": [
            "edges/covariance/reporting_position_to_counterparty_bucket.json",
            "edges/adjoints/reporting_position_to_counterparty_bucket.json",
        ],
        "projections": [
            "projections/apra_liquidity_table.json",
            "projections/apra_liquidity_api_contract.json",
            "projections/apra_liquidity_schema_contract.json",
        ],
        "evidence_manifests": [
            "evidence/manifests/apra_liquidity_manifest.json"
        ],
        "links": [
            "../trade_representation_domain/fragment.json",
            "../../stitching_candidates/trade_to_apra_covariance_candidate.json",
            "../../stitching_candidates/trade_to_apra_adjoint_candidate.json",
        ],
    }


def _apra_objects(
    apra_input: dict[str, Any],
    ids: dict[str, str],
    bundle: dict[str, Any],
    claim_specs: list[dict[str, Any]],
) -> list[tuple[str, dict[str, Any]]]:
    position = apra_input["reporting_position"]
    trade_object = bundle["trade_object"]
    product_object = bundle["product_object"]
    agreement_object = bundle["agreement_object"]
    party_objects = bundle["party_objects"]
    evidence_refs = list(
        dict.fromkeys(
            apra_input["evidence_refs"]
            + [
                "input://apra_liquidity/authority_claims.json",
                OFFICIAL_SAMPLE_INPUT_REF,
                "review://parsed_trade_observation.json",
            ]
        )
    )
    return [
        (
            "reporting_position.json",
            {
                "schema_kind": "odd_world_model.markov_object",
                "schema_version": "v1",
                "object_id": ids["reporting_position_id"],
                "object_kind": "ApraLiquidityReportingPosition",
                "bounded_context": apra_input["bounded_context"],
                "semantic_role": "Regulatory reporting position composed against the imported FpML trade artifact.",
                "identity": {
                    "authority_basis": "bounded APRA liquidity interpretation over official APRA source claims and imported trade evidence",
                    "aliases": [
                        f"position_id:{position['position_id']}",
                        f"reporting_regime:{position['reporting_regime']}",
                    ],
                },
                "boundary": {
                    "internal_claim": "Counterparty bucket, agreement treatment basis, liquidity bucket, and reporting position lifecycle are internal to this regulatory object.",
                    "external_claim": "Detailed FpML trade economics and local trade confirmation semantics remain outside the reporting position.",
                    "adjacent_objects": [
                        ids["counterparty_bucket_id"],
                        ids["agreement_basis_id"],
                        trade_object["object_id"],
                        product_object["object_id"],
                    ],
                    "adjacent_domains": [
                        "odd_world_model.domain.trade_representation.fpml_confirmation.v1"
                    ],
                },
                "blanket": {
                    "ingress_surfaces": [
                        "apra_liquidity_input",
                        "fpml_trade_artifact",
                    ],
                    "egress_surfaces": [
                        "apra_reporting_publication"
                    ],
                    "observable_surfaces": [
                        "apra_liquidity/domain_input.json",
                        "apra_liquidity/authority_claims.json",
                        "apra_liquidity/requirements_snapshot.json",
                        "parsed_trade_observation.json",
                    ],
                    "control_surfaces": [
                        "classify_counterparty",
                        "review_agreement_treatment",
                        "assign_liquidity_bucket",
                    ],
                    "adjacent_objects": [
                        ids["counterparty_bucket_id"],
                        ids["agreement_basis_id"],
                        trade_object["object_id"],
                    ],
                    "adjacent_domains": [
                        "odd_world_model.domain.trade_representation.fpml_confirmation.v1"
                    ],
                    "internal_claim": "This object bounds the APRA-liquidity reporting interpretation over the imported trade artifact.",
                    "external_claim": "The upstream trade artifact remains an external evidence and treatment source.",
                },
                "state": {
                    "lifecycle_state": position["lifecycle_state"],
                    "state_summary": "Regulatory reporting position is classified enough for bounded APRA inspection and remains intentionally narrow.",
                    "effective_time": PUBLISHED_AT,
                    "observation_time": OBSERVED_AT,
                    "ambiguity_status": "high",
                },
                "constraints": {
                    "invariants": [
                        "reporting_position_must_have_counterparty_bucket",
                        "reporting_position_must_have_agreement_treatment_basis",
                        "reporting_position_must_have_liquidity_bucket",
                    ],
                    "policies": [
                        "bounded_apra_liquidity_policy"
                    ],
                    "valid_transitions": [
                        "classify",
                        "reclassify",
                        "submit",
                    ],
                },
                "evidence": {
                    "refs": evidence_refs,
                    "summary": "Built from official APRA authority claims, bounded APRA input, and the imported FpML trade artifact.",
                },
                "materialization": {
                    "projection_summary": "Immutable reporting-position object cut projected from the APRA attribute ledger over document-traced and composed regulatory claims.",
                    "attribute_ledger_entry_refs": [
                        _apra_ledger_ref(spec["claim_key"])
                        for spec in claim_specs
                    ],
                    "assurance_record_refs": [
                        _apra_assurance_ref(spec["claim_key"])
                        for spec in claim_specs
                    ],
                    "trace_record_refs": [
                        _apra_trace_ref(spec["claim_key"], source["label"])
                        for spec in claim_specs
                        for source in spec["sources"]
                    ],
                },
                "cross_domain": {
                    "treatment_refs": [
                        ids["treatment_id"],
                        "odd_world_model.treatment.trade_representation.to_apra_liquidity.candidate.v1",
                    ],
                    "covariance_edge_refs": [
                        ids["local_covariance_id"],
                        ids["cross_covariance_id"],
                    ],
                    "adjoint_mapping_refs": [
                        ids["local_adjoint_id"],
                        ids["cross_adjoint_id"],
                    ],
                    "loss_notes": [
                        "Regulatory reporting position does not preserve full upstream commodity trade semantics.",
                    ],
                },
                "composition": {
                    "fragment_id": ids["fragment_id"],
                    "parent_object_refs": [],
                    "child_object_refs": [
                        ids["counterparty_bucket_id"],
                        ids["agreement_basis_id"],
                    ],
                },
            },
        ),
        (
            "counterparty_bucket.json",
            {
                "schema_kind": "odd_world_model.world_model_object",
                "schema_version": "v1",
                "object_id": ids["counterparty_bucket_id"],
                "object_kind": "ApraCounterpartyBucket",
                "bounded_context": apra_input["bounded_context"],
                "semantic_role": "Regulatory counterparty bucket derived from the imported trade-party surfaces.",
                "identity": {
                    "authority_basis": "official APRA counterparty classification applied to imported trade evidence",
                    "aliases": [
                        position["counterparty_bucket"]
                    ],
                },
                "boundary": {
                    "internal_claim": "Counterparty bucket assignment is internal to the APRA-liquidity interpretation.",
                    "external_claim": "The original trade party identifiers and names remain external to the bucket.",
                    "adjacent_objects": [
                        ids["reporting_position_id"],
                        party_objects[0]["object_id"],
                        party_objects[1]["object_id"],
                    ],
                    "adjacent_domains": [
                        "odd_world_model.domain.trade_representation.fpml_confirmation.v1"
                    ],
                },
                "state": {
                    "lifecycle_state": "classified",
                    "state_summary": "Counterparty bucket is assigned for the bounded reporting position.",
                    "effective_time": "2026-04-15T00:00:00Z",
                    "observation_time": "2026-04-15T00:10:00Z",
                    "ambiguity_status": "medium",
                },
                "evidence": {
                    "refs": evidence_refs,
                    "summary": "Counterparty bucket derived from APRA authority claims and upstream party evidence.",
                },
                "cross_domain": {
                    "treatment_refs": [
                        ids["treatment_id"],
                        "odd_world_model.treatment.trade_representation.to_apra_liquidity.candidate.v1",
                    ],
                    "covariance_edge_refs": [
                        ids["local_covariance_id"],
                        ids["cross_covariance_id"],
                    ],
                    "adjoint_mapping_refs": [
                        ids["local_adjoint_id"],
                        ids["cross_adjoint_id"],
                    ],
                    "loss_notes": [
                        "Bucketing abstracts away the locally identified trade parties.",
                    ],
                },
                "composition": {
                    "fragment_id": ids["fragment_id"],
                    "parent_object_refs": [
                        ids["reporting_position_id"]
                    ],
                    "child_object_refs": [],
                },
            },
        ),
        (
            "agreement_treatment_basis.json",
            {
                "schema_kind": "odd_world_model.world_model_object",
                "schema_version": "v1",
                "object_id": ids["agreement_basis_id"],
                "object_kind": "ApraAgreementTreatmentBasis",
                "bounded_context": apra_input["bounded_context"],
                "semantic_role": "Regulatory agreement treatment basis composed against the imported master-agreement reference.",
                "identity": {
                    "authority_basis": "official APRA contractual-treatment guidance composed with imported master-agreement evidence",
                    "aliases": [
                        position["agreement_assessment"]
                    ],
                },
                "boundary": {
                    "internal_claim": "Agreement treatment basis is internal to the APRA-liquidity interpretation.",
                    "external_claim": "Detailed legal documentation and FpML master-agreement reference remain external.",
                    "adjacent_objects": [
                        ids["reporting_position_id"],
                        agreement_object["object_id"],
                    ],
                    "adjacent_domains": [
                        "odd_world_model.domain.trade_representation.fpml_confirmation.v1"
                    ],
                },
                "state": {
                    "lifecycle_state": "reviewed",
                    "state_summary": "Agreement basis is classified enough for sandbox inspection.",
                    "effective_time": "2026-04-15T00:00:00Z",
                    "observation_time": "2026-04-15T00:10:00Z",
                    "ambiguity_status": "high",
                },
                "evidence": {
                    "refs": evidence_refs,
                    "summary": "Agreement treatment basis derived from APRA authority claims and upstream agreement evidence.",
                },
                "cross_domain": {
                    "treatment_refs": [
                        ids["treatment_id"],
                        "odd_world_model.treatment.trade_representation.to_apra_liquidity.candidate.v1",
                    ],
                    "covariance_edge_refs": [
                        ids["cross_covariance_id"]
                    ],
                    "adjoint_mapping_refs": [
                        ids["cross_adjoint_id"]
                    ],
                    "loss_notes": [
                        "Regulatory agreement treatment basis does not preserve the full legal semantics of the source agreement.",
                    ],
                },
                "composition": {
                    "fragment_id": ids["fragment_id"],
                    "parent_object_refs": [
                        ids["reporting_position_id"]
                    ],
                    "child_object_refs": [],
                },
            },
        ),
    ]


def _apra_trace_records(
    apra_input: dict[str, Any],
    ids: dict[str, str],
    claim_specs: list[dict[str, Any]],
) -> list[tuple[Path, dict[str, Any]]]:
    position_id = apra_input["reporting_position"]["position_id"]
    records: list[tuple[Path, dict[str, Any]]] = []
    for spec in claim_specs:
        for source in spec["sources"]:
            payload = trace_record(
                trace_id=_apra_trace_id(position_id, spec["claim_key"], source["label"]),
                object_ref=ids["reporting_position_id"],
                claim_key=spec["claim_key"],
                source_ref=source["source_ref"],
                source_kind=source["source_kind"],
                locator=source["locator"],
                observed_at=OBSERVED_AT,
                observed_value=source["observed_value"],
                observation_kind=spec["claim_kind"],
                summary=source["summary"],
            )
            records.append((_apra_trace_path(spec["claim_key"], source["label"]), payload))
    return records


def _apra_assurance_records(
    apra_input: dict[str, Any],
    ids: dict[str, str],
    claim_specs: list[dict[str, Any]],
) -> list[tuple[Path, dict[str, Any]]]:
    position_id = apra_input["reporting_position"]["position_id"]
    records: list[tuple[Path, dict[str, Any]]] = []
    for spec in claim_specs:
        payload = assurance_record(
            assurance_id=_apra_assurance_id(position_id, spec["claim_key"]),
            object_ref=ids["reporting_position_id"],
            claim_key=spec["claim_key"],
            claim_kind=spec["claim_kind"],
            accepted_value=spec["value"],
            trace_record_refs=[
                _apra_trace_ref(spec["claim_key"], source["label"])
                for source in spec["sources"]
            ],
            authority_basis=spec["authority_basis"],
            accepted_at=OBSERVED_AT,
            summary=spec["summary"],
        )
        records.append((_apra_assurance_path(spec["claim_key"]), payload))
    return records


def _apra_attribute_ledger_entries(
    apra_input: dict[str, Any],
    ids: dict[str, str],
    claim_specs: list[dict[str, Any]],
) -> list[tuple[Path, dict[str, Any]]]:
    position_id = apra_input["reporting_position"]["position_id"]
    records: list[tuple[Path, dict[str, Any]]] = []
    for spec in claim_specs:
        payload = attribute_ledger_entry(
            entry_id=_apra_ledger_entry_id(position_id, spec["claim_key"]),
            object_ref=ids["reporting_position_id"],
            claim_key=spec["claim_key"],
            claim_kind=spec["claim_kind"],
            value=spec["value"],
            qualifiers=spec.get("qualifiers"),
            trace_record_refs=[
                _apra_trace_ref(spec["claim_key"], source["label"])
                for source in spec["sources"]
            ],
            assurance_record_refs=[_apra_assurance_ref(spec["claim_key"])],
            observed_at=OBSERVED_AT,
            published_at=PUBLISHED_AT,
            summary=spec["summary"],
        )
        records.append((_apra_ledger_path(spec["claim_key"]), payload))
    return records


def _apra_treatments(ids: dict[str, str]) -> list[tuple[str, dict[str, Any]]]:
    return [
        (
            "reporting_position_classification.json",
            {
                "schema_kind": "odd_world_model.treatment_surface",
                "schema_version": "v1",
                "treatment_id": ids["treatment_id"],
                "source_object_refs": [
                    ids["reporting_position_id"]
                ],
                "target_domain": ids["domain_id"],
                "preserved_structure": [
                    "counterparty_bucket",
                    "agreement_assessment",
                    "liquidity_bucket",
                ],
                "changed_meaning": [
                    "Source evidence is rendered as a regulatory reporting position rather than a trade confirmation object."
                ],
                "loss_notes": [
                    "Upstream trade and product semantics are narrowed into regulatory reporting semantics."
                ],
                "surplus_notes": [
                    "APRA-liquidity view adds reporting-bucket semantics."
                ],
            },
        )
    ]


def _apra_edges(ids: dict[str, str]) -> list[tuple[Path, dict[str, Any]]]:
    return [
        (
            Path("covariance") / "reporting_position_to_counterparty_bucket.json",
            {
                "schema_kind": "odd_world_model.covariance_edge",
                "schema_version": "v1",
                "edge_id": ids["local_covariance_id"],
                "source_object_ref": ids["reporting_position_id"],
                "target_object_ref": ids["counterparty_bucket_id"],
                "relationship_kind": "decomposition",
                "ambiguity_notes": [
                    "Counterparty bucketing may later depend on richer regulatory classification rules."
                ],
            },
        ),
        (
            Path("adjoints") / "reporting_position_to_counterparty_bucket.json",
            {
                "schema_kind": "odd_world_model.adjoint_mapping",
                "schema_version": "v1",
                "mapping_id": ids["local_adjoint_id"],
                "forward_treatment_ref": ids["treatment_id"],
                "source_domain": ids["domain_id"],
                "target_domain": ids["domain_id"],
                "interpret_back_summary": "The counterparty bucket can be interpreted back as one governed component of the APRA reporting position.",
                "preserved_structure": [
                    "counterparty_bucket"
                ],
                "loss_notes": [],
                "surplus_notes": [],
            },
        ),
    ]


def _apra_projections(ids: dict[str, str]) -> list[tuple[str, dict[str, Any]]]:
    source_refs = [
        ids["reporting_position_id"],
        ids["counterparty_bucket_id"],
        ids["agreement_basis_id"],
    ]
    return [
        (
            "apra_liquidity_table.json",
            {
                "schema_kind": "odd_world_model.projection_spec",
                "schema_version": "v1",
                "projection_id": "odd_world_model.projection.apra_liquidity.table.v1",
                "projection_kind": "table",
                "source_refs": source_refs,
                "output_summary": "Tabular projection over the bounded APRA-liquidity fragment.",
            },
        ),
        (
            "apra_liquidity_api_contract.json",
            {
                "schema_kind": "odd_world_model.projection_spec",
                "schema_version": "v1",
                "projection_id": "odd_world_model.projection.apra_liquidity.api_contract.v1",
                "projection_kind": "api_contract",
                "source_refs": source_refs,
                "output_summary": "API contract projection over the bounded APRA-liquidity fragment.",
            },
        ),
        (
            "apra_liquidity_schema_contract.json",
            {
                "schema_kind": "odd_world_model.projection_spec",
                "schema_version": "v1",
                "projection_id": "odd_world_model.projection.apra_liquidity.schema_contract.v1",
                "projection_kind": "schema_contract",
                "source_refs": source_refs,
                "output_summary": "Schema contract projection over the bounded APRA-liquidity fragment.",
            },
        ),
    ]


def _apra_manifest(apra_input: dict[str, Any]) -> tuple[str, dict[str, Any]]:
    return (
        "apra_liquidity_manifest.json",
        {
            "schema_kind": "odd_world_model.evidence_manifest",
            "schema_version": "v1",
            "manifest_id": "odd_world_model.evidence.apra_liquidity.reporting.sandbox.v1",
            "summary": "Evidence manifest for the bounded APRA-liquidity fragment grounded in official APRA authority claims and composed against the FpML trade artifact.",
            "refs": list(
                dict.fromkeys(
                    apra_input["evidence_refs"]
                    + [
                        "input://apra_liquidity/authority_claims.json",
                        OFFICIAL_SAMPLE_INPUT_REF,
                        "review://parsed_trade_observation.json",
                    ]
                )
            ),
        },
    )


def _apra_reference_artifacts(ids: dict[str, str]) -> list[tuple[str, dict[str, Any]]]:
    return [
        (
            "apra_counterparty_bucket_reference_set_v1.json",
            {
                "schema_kind": "odd_world_model.temporal_reference_artifact",
                "schema_version": "v1",
                "artifact_id": "odd_world_model.reference_artifact.apra_liquidity.counterparty_bucket_set.v1",
                "artifact_kind": "classification_set",
                "bounded_context": "sandbox.apra_liquidity.reference_data",
                "semantic_role": "Sandbox APRA-liquidity counterparty bucket reference set used by the reporting position.",
                "identity": {
                    "authority_basis": "bounded APRA-liquidity reference semantics",
                    "aliases": [
                        "apra_counterparty_bucket_set_v1"
                    ],
                },
                "effective_period": {
                    "effective_from": "2026-01-01T00:00:00Z"
                },
                "values": [
                    {
                        "value_code": "financial_institution",
                        "value_label": "Financial Institution",
                        "value_meaning": "Counterparty bucket used when the reporting position treats the counterparty as a financial institution.",
                        "effective_from": "2026-01-01T00:00:00Z",
                        "status": "active"
                    },
                    {
                        "value_code": "non_financial_corporate",
                        "value_label": "Non-Financial Corporate",
                        "value_meaning": "Counterparty bucket used when the reporting position treats the counterparty as a non-financial corporate.",
                        "effective_from": "2026-01-01T00:00:00Z",
                        "status": "active"
                    },
                    {
                        "value_code": "sovereign_public_sector",
                        "value_label": "Sovereign Or Public Sector",
                        "value_meaning": "Counterparty bucket used when the reporting position treats the counterparty as sovereign or public sector.",
                        "effective_from": "2026-01-01T00:00:00Z",
                        "status": "active"
                    }
                ],
                "supersession": {},
                "evidence": {
                    "refs": [
                        "input://apra_liquidity/source_authority.md",
                        "input://apra_liquidity/authority_claims.json",
                        "input://apra_liquidity/requirements_snapshot.json",
                        "input://apra_liquidity/source_notes.md"
                    ],
                    "summary": "Governed temporal reference artifact for the bounded APRA counterparty bucket values grounded in official APRA authority claims."
                },
                "usage": {
                    "object_refs": [
                        ids["counterparty_bucket_id"],
                        ids["reporting_position_id"]
                    ],
                    "attribute_refs": [
                        "odd_world_model.attribute.apra_liquidity.reporting_position.counterparty_bucket"
                    ],
                    "treatment_refs": [
                        ids["treatment_id"],
                        "odd_world_model.treatment.trade_representation.to_apra_liquidity.candidate.v1"
                    ]
                },
                "composition": {
                    "fragment_id": ids["fragment_id"],
                    "parent_object_refs": [],
                    "child_object_refs": []
                }
            }
        )
    ]


def _stitching_candidates(ids: dict[str, str], bundle: dict[str, Any]) -> list[tuple[str, dict[str, Any]]]:
    trade_object = bundle["trade_object"]
    return [
        (
            "trade_to_apra_covariance_candidate.json",
            {
                "schema_kind": "odd_world_model.covariance_edge",
                "schema_version": "v1",
                "edge_id": ids["cross_covariance_id"],
                "source_object_ref": trade_object["object_id"],
                "target_object_ref": ids["reporting_position_id"],
                "relationship_kind": "partial_correspondence",
                "ambiguity_notes": [
                    "The APRA reporting position captures only the liquidity-relevant slice of the imported trade artifact.",
                    "Counterparty and agreement treatments remain sparse and should be deepened before this edge is promoted to stronger correspondence.",
                ],
            },
        ),
        (
            "trade_to_apra_adjoint_candidate.json",
            {
                "schema_kind": "odd_world_model.adjoint_mapping",
                "schema_version": "v1",
                "mapping_id": ids["cross_adjoint_id"],
                "forward_treatment_ref": "odd_world_model.treatment.trade_representation.to_apra_liquidity.candidate.v1",
                "source_domain": "odd_world_model.domain.trade_representation.fpml_confirmation.v1",
                "target_domain": ids["domain_id"],
                "interpret_back_summary": "The APRA-liquidity reporting position can be interpreted back as a liquidity-focused treatment over the imported FpML trade, party, and agreement surfaces, with loss of detailed product nuance.",
                "preserved_structure": [
                    "trade_identifier",
                    "party_identity",
                    "master_agreement_reference",
                    "trade_lifecycle_state",
                ],
                "loss_notes": [
                    "Detailed commodity product semantics do not survive intact into the APRA-liquidity reporting view."
                ],
                "surplus_notes": [
                    "The target adds reporting-position, bucket, and regulatory-classification semantics."
                ],
            },
        ),
    ]


def materialize_trade_domain_import(*, reset: bool = False) -> dict[str, Any]:
    if reset:
        _reset_generated_output()
    bundle = _source_trade_bundle(reset_source=True)
    _copy_trade_domain(bundle)
    return bundle


def materialize_trace_surface(*, reset: bool = False) -> dict[str, Any]:
    return materialize_trade_domain_import(reset=reset)


def materialize_assurance_surface(*, reset: bool = False) -> dict[str, Any]:
    return materialize_trade_domain_import(reset=reset)


def materialize_attribute_ledger_surface(*, reset: bool = False) -> dict[str, Any]:
    return materialize_trade_domain_import(reset=reset)


def materialize_markov_object_cut_surface(*, reset: bool = False) -> dict[str, Any]:
    return materialize_trade_domain_import(reset=reset)


def materialize_published_domain_artifact_surface(*, reset: bool = False) -> dict[str, Any]:
    return materialize_trade_domain_import(reset=reset)


def materialize_composed_world_model_surface(*, reset: bool = False) -> dict[str, Any]:
    bundle = materialize_trade_domain_import(reset=reset)
    apra_input = _apra_input()
    authority_claims = _apra_authority_claims_input()
    ids = _apra_ids(apra_input)
    claim_specs = _apra_claim_specs(apra_input, ids, bundle, authority_claims)

    _write_json(_apra_domain_root() / "fragment.json", _apra_fragment(apra_input, ids, claim_specs))
    for relative_path, payload in _apra_trace_records(apra_input, ids, claim_specs):
        _write_json(review_root() / relative_path, payload)
    for relative_path, payload in _apra_assurance_records(apra_input, ids, claim_specs):
        _write_json(review_root() / relative_path, payload)
    for file_name, payload in _apra_objects(apra_input, ids, bundle, claim_specs):
        _write_json(_apra_domain_root() / "objects" / file_name, payload)
    for relative_path, payload in _apra_attribute_ledger_entries(apra_input, ids, claim_specs):
        _write_json(_apra_domain_root() / relative_path, payload)
    for file_name, payload in _apra_treatments(ids):
        _write_json(_apra_domain_root() / "treatments" / file_name, payload)
    for relative_path, payload in _apra_edges(ids):
        _write_json(_apra_domain_root() / "edges" / relative_path, payload)
    for file_name, payload in _apra_projections(ids):
        _write_json(_apra_domain_root() / "projections" / file_name, payload)
    manifest_name, manifest_payload = _apra_manifest(apra_input)
    _write_json(_apra_domain_root() / "evidence" / "manifests" / manifest_name, manifest_payload)
    for file_name, payload in _apra_reference_artifacts(ids):
        _write_json(_apra_domain_root() / "reference_artifacts" / file_name, payload)

    for file_name, payload in _stitching_candidates(ids, bundle):
        _write_json(stitching_root() / file_name, payload)
    return {
        "bundle": bundle,
        "apra_input": apra_input,
        "authority_claims": authority_claims,
        "ids": ids,
    }


def build() -> None:
    materialize_composed_world_model_surface(reset=True)


def main() -> int:
    build()
    print(sandbox_root())
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
