# Implements: REQ-ODD-WORLD-MODEL-BUILD-CAP-001
# Implements: REQ-ODD-WORLD-MODEL-BUILD-CAP-002
# Implements: REQ-ODD-WORLD-MODEL-BUILD-CAP-003
# Implements: REQ-ODD-WORLD-MODEL-BUILD-CAP-006
# Implements: REQ-ODD-WORLD-MODEL-BUILD-CONSTRAINT-002
# Implements: REQ-ODD-WORLD-MODEL-BUILD-CONSTRAINT-003
# Implements: REQ-ODD-WORLD-MODEL-WORLD-OBJECT-004
# Implements: REQ-ODD-WORLD-MODEL-WORLD-OBJECT-009
# Implements: REQ-ODD-WORLD-MODEL-WORLD-OBJECT-010
# Implements: REQ-ODD-WORLD-MODEL-WORLD-OBJECT-011
# Implements: REQ-ODD-WORLD-MODEL-WORLD-OBJECT-012
"""Build a bounded trade domain artifact from an FpML source sample."""

from __future__ import annotations

import json
import shutil
from pathlib import Path
from typing import Any

from odd_world_model.adapters.fpml_confirmation import parse_fpml_trade
from odd_world_model.examples_layout import (
    APRA_LIQUIDITY_MODEL,
    TRADE_REPRESENTATION_MODEL,
    trade_representation_sandbox_root,
    trade_source_data_root,
    trade_source_sandbox_root,
    trade_source_uri_ledger_root,
    relative_path,
    example_relative_input_ref,
    example_relative_review_ref,
)
from odd_world_model.world_model.materialize import attribute_ledger_entry, assurance_record, trace_record


PUBLISHED_AT = "2026-04-15T00:00:00Z"
OFFICIAL_SAMPLE_RELATIVE_PATH = Path("authority") / "com-ex28-gas-swap-daily-delivery-prices-option-last.xml"
OFFICIAL_EXAMPLES_INDEX_RELATIVE_PATH = Path("authority") / "fpml-5-12-examples.html"
OFFICIAL_SAMPLE_INPUT_REF = example_relative_input_ref(
    "trade_source_model", Path("data") / OFFICIAL_SAMPLE_RELATIVE_PATH
)
OFFICIAL_EXAMPLES_INDEX_REF = example_relative_input_ref(
    "trade_source_model", Path("data") / OFFICIAL_EXAMPLES_INDEX_RELATIVE_PATH
)
TRADE_SOURCE_AUTHORITY_REF = example_relative_input_ref(
    "trade_source_model", Path("uri_ledger") / "source_authority.md"
)
TRADE_REPRESENTATION_REVIEW_REF = example_relative_review_ref(
    TRADE_REPRESENTATION_MODEL, "parsed_trade_observation.json"
)


def review_root() -> Path:
    return trade_representation_sandbox_root() / "review"


def published_catalog_root() -> Path:
    return trade_representation_sandbox_root() / "published"


def source_domain_root() -> Path:
    return trade_source_sandbox_root() / "published" / "fpml_confirmation_source_domain"


def published_root() -> Path:
    return published_catalog_root() / "trade_representation_domain"


def _remove_tree(root: Path) -> None:
    shutil.rmtree(root, ignore_errors=True)


def _reset_generated_output() -> None:
    generated_paths = (
        review_root() / "parsed_trade_observation.json",
        review_root() / "traces" / "trade_contract_state",
        review_root() / "assurance" / "trade_contract_state",
        source_domain_root(),
        published_root(),
    )
    for path in generated_paths:
        if not path.exists():
            continue
        if path.is_dir():
            _remove_tree(path)
        else:
            path.unlink()


def _write_json(path: Path, payload: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8") as handle:
        json.dump(payload, handle, indent=2)
        handle.write("\n")


def _source_xml_path() -> Path:
    return trade_source_data_root() / OFFICIAL_SAMPLE_RELATIVE_PATH


def _source_examples_index_path() -> Path:
    return trade_source_data_root() / OFFICIAL_EXAMPLES_INDEX_RELATIVE_PATH


def _source_authority_path() -> Path:
    return trade_source_uri_ledger_root() / "source_authority.md"


def _observation() -> dict[str, Any]:
    return parse_fpml_trade(_source_xml_path())


def _party_object_id(xml_id: str) -> str:
    return f"odd_world_model.world_model_object.trade_representation.party_profile.{xml_id}"


def _trade_markov_object_id() -> str:
    return "odd_world_model.markov_object.trade_representation.trade_contract_state.trade_fpml_001"


def _source_trade_object_id() -> str:
    return "odd_world_model.world_model_object.fpml_confirmation.trade_record.trade_fpml_001"


def _product_object_id() -> str:
    return "odd_world_model.world_model_object.trade_representation.commodity_swap_product.product_fpml_001"


def _source_product_object_id() -> str:
    return "odd_world_model.world_model_object.fpml_confirmation.commodity_swap_source.product_fpml_001"


def _agreement_object_id() -> str:
    return "odd_world_model.world_model_object.trade_representation.master_agreement_reference.trade_fpml_001"


def _source_leg_key(leg_kind: str, index: int) -> str:
    if leg_kind == "fixedLeg":
        return f"fixed_leg_{index:02d}"
    if leg_kind == "floatingLeg":
        return f"floating_leg_{index:02d}"
    return f"other_leg_{index:02d}"


def _source_leg_object_id(leg_kind: str, index: int) -> str:
    return (
        "odd_world_model.world_model_object.fpml_confirmation.commodity_swap_leg."
        f"{_source_leg_key(leg_kind, index)}"
    )


def _source_leg_file_name(leg_kind: str, index: int) -> str:
    return f"{_source_leg_key(leg_kind, index)}.json"


def _treatment_id() -> str:
    return "odd_world_model.treatment.trade_representation.to_apra_liquidity.candidate.v1"


def _trade_trace_id(claim_key: str) -> str:
    return f"odd_world_model.trace.trade_representation.trade_contract_state.trade_fpml_001.{claim_key}.v1"


def _trade_assurance_id(claim_key: str) -> str:
    return f"odd_world_model.assurance.trade_representation.trade_contract_state.trade_fpml_001.{claim_key}.v1"


def _trade_ledger_entry_id(claim_key: str) -> str:
    return f"odd_world_model.attribute_ledger.trade_representation.trade_contract_state.trade_fpml_001.{claim_key}.v1"


def _trade_trace_path(claim_key: str) -> Path:
    return Path("traces") / "trade_contract_state" / f"{claim_key}.json"


def _trade_assurance_path(claim_key: str) -> Path:
    return Path("assurance") / "trade_contract_state" / f"{claim_key}.json"


def _trade_ledger_path(claim_key: str) -> Path:
    return Path("attribute_ledger") / "trade_contract_state" / f"{claim_key}.json"


def _trade_trace_ref(claim_key: str) -> str:
    return f"review://traces/trade_contract_state/{claim_key}.json"


def _trade_assurance_ref(claim_key: str) -> str:
    return f"review://assurance/trade_contract_state/{claim_key}.json"


def _trade_ledger_ref(claim_key: str) -> str:
    return f"ledger://trade_contract_state/{claim_key}.json"


def _date_time(value: str | None) -> str | None:
    if not value:
        return None
    return f"{value}T00:00:00Z"


def _trade_claim_specs(observation: dict[str, Any]) -> list[dict[str, Any]]:
    party_a, party_b = observation["parties"][:2]
    return [
        {
            "claim_key": "trade_identifier",
            "claim_kind": "observed",
            "value": observation["trade_id"],
            "locator": "trade/tradeHeader/partyTradeIdentifier[1]/tradeId",
            "source_ref": OFFICIAL_SAMPLE_INPUT_REF,
            "source_kind": "document",
            "effective_time": _date_time(observation["trade_date"]),
            "authority_basis": [
                "document:fpml_confirmation_trade_identifier",
                "parser:fpml_confirmation_adapter",
            ],
            "summary": "Trade identifier traced from the official FpML confirmation-view trade header.",
        },
        {
            "claim_key": "trade_date",
            "claim_kind": "observed",
            "value": observation["trade_date"],
            "locator": "trade/tradeHeader/tradeDate",
            "source_ref": OFFICIAL_SAMPLE_INPUT_REF,
            "source_kind": "document",
            "effective_time": _date_time(observation["trade_date"]),
            "authority_basis": [
                "document:fpml_confirmation_trade_date",
                "parser:fpml_confirmation_adapter",
            ],
            "summary": "Trade date traced from the official FpML confirmation-view trade header.",
        },
        {
            "claim_key": "product_reference",
            "claim_kind": "derived",
            "value": _product_object_id(),
            "locator": "trade/commoditySwap",
            "source_ref": "review://parsed_trade_observation.json",
            "source_kind": "derived_observation",
            "effective_time": _date_time(observation["product"]["effective_date"]),
            "authority_basis": [
                "document:fpml_commodity_swap_structure",
                "derivation:product_object_alignment",
            ],
            "summary": "Product reference aligned from the parsed official commoditySwap structure.",
            "qualifiers": {
                "source_product_id": observation["product"]["product_id"],
                "source_product_type": observation["product"]["product_type"],
                "leg_count": str(observation["product"]["leg_count"]),
            },
        },
        {
            "claim_key": "party_a_reference",
            "claim_kind": "derived",
            "value": _party_object_id(party_a["xml_id"]),
            "locator": "trade/commoditySwap/*Leg/*PartyReference[href=partyA]",
            "source_ref": "review://parsed_trade_observation.json",
            "source_kind": "derived_observation",
            "authority_basis": [
                "document:fpml_party_reference",
                "derivation:party_profile_alignment",
            ],
            "summary": "First party reference aligned from commodity-swap leg party references and party elements.",
            "qualifiers": {
                "party_id": party_a["party_id"],
                "party_name": party_a["party_name"],
            },
        },
        {
            "claim_key": "party_b_reference",
            "claim_kind": "derived",
            "value": _party_object_id(party_b["xml_id"]),
            "locator": "trade/commoditySwap/*Leg/*PartyReference[href=partyB]",
            "source_ref": "review://parsed_trade_observation.json",
            "source_kind": "derived_observation",
            "authority_basis": [
                "document:fpml_party_reference",
                "derivation:party_profile_alignment",
            ],
            "summary": "Second party reference aligned from commodity-swap leg party references and party elements.",
            "qualifiers": {
                "party_id": party_b["party_id"],
                "party_name": party_b["party_name"],
            },
        },
        {
            "claim_key": "master_agreement_reference",
            "claim_kind": "derived",
            "value": _agreement_object_id(),
            "locator": "trade/documentation/masterAgreement",
            "source_ref": "review://parsed_trade_observation.json",
            "source_kind": "derived_observation",
            "effective_time": _date_time(observation["agreement"]["date"]),
            "authority_basis": [
                "document:fpml_documentation_master_agreement",
                "derivation:agreement_reference_alignment",
            ],
            "summary": "Master agreement reference aligned from official FpML documentation.",
            "qualifiers": {
                "agreement_type": observation["agreement"]["type"],
                "agreement_version": observation["agreement"]["version"],
            },
        },
    ]


def _trade_fragment(observation: dict[str, Any]) -> dict[str, Any]:
    trade_domain_root = published_root()
    trade_review_path = review_root() / "parsed_trade_observation.json"
    source_fragment_path = source_domain_root() / "fragment.json"
    source_authority_path = _source_authority_path()
    source_xml_path = _source_xml_path()
    source_examples_index_path = _source_examples_index_path()
    return {
        "schema_kind": "odd_world_model.world_fragment",
        "schema_version": "v1",
        "fragment_id": "odd_world_model.fragment.trade_representation.fpml_commodity_swap.v1",
        "bounded_context": "trade_representation.fpml_confirmation.commodity_swap",
        "published_at": PUBLISHED_AT,
        "published_by": "odd_world_model.project.trade_representation_model",
        "summary": "Published trade-representation fragment built in the versioned trade-representation sandbox from the retained trade-source model authority.",
        "objects": [
            "objects/trade_contract_state.json",
            "objects/commodity_swap_product.json",
            "objects/party_a_profile.json",
            "objects/party_b_profile.json",
            "objects/master_agreement_reference.json"
        ],
        "attribute_ledger_entries": [
            str(_trade_ledger_path(spec["claim_key"]))
            for spec in _trade_claim_specs(observation)
        ],
        "reference_artifacts": [],
        "treatments": [
            "treatments/trade_to_apra_liquidity_candidate.json"
        ],
        "edges": [
            "edges/covariance/trade_to_product.json",
            "edges/adjoints/trade_to_product.json"
        ],
        "projections": [
            "projections/trade_table.json",
            "projections/trade_api_contract.json",
            "projections/trade_schema_contract.json"
        ],
        "evidence_manifests": [
            "evidence/manifests/fpml_trade_manifest.json"
        ],
        "links": [
            relative_path(trade_domain_root, trade_review_path),
            relative_path(trade_domain_root, source_fragment_path),
            relative_path(trade_domain_root, source_authority_path),
            relative_path(trade_domain_root, source_xml_path),
            relative_path(trade_domain_root, source_examples_index_path),
        ]
    }


def _trade_objects(observation: dict[str, Any]) -> list[tuple[str, dict[str, Any]]]:
    party_a, party_b = observation["parties"][:2]
    evidence_refs = [
        OFFICIAL_SAMPLE_INPUT_REF,
        OFFICIAL_EXAMPLES_INDEX_REF,
        TRADE_SOURCE_AUTHORITY_REF,
        "review://parsed_trade_observation.json"
    ]
    trade_object_id = _trade_markov_object_id()
    product_object_id = _product_object_id()
    agreement_object_id = _agreement_object_id()
    party_a_id = _party_object_id(party_a["xml_id"])
    party_b_id = _party_object_id(party_b["xml_id"])
    objects: list[tuple[str, dict[str, Any]]] = [
        (
            "trade_contract_state.json",
            {
                "schema_kind": "odd_world_model.markov_object",
                "schema_version": "v1",
                "object_id": trade_object_id,
                "object_kind": "TradeContractState",
                "bounded_context": "trade_representation.fpml_confirmation.commodity_swap",
                "semantic_role": "Trade contract state materialized from a bounded FpML confirmation-view commodity swap representation.",
                "identity": {
                    "authority_basis": "FpML confirmation-view trade representation",
                    "aliases": [
                        alias
                        for alias in [
                            f"trade_id:{observation['trade_id']}" if observation["trade_id"] else "",
                            f"trade_xml_id:{observation['trade_xml_id']}" if observation["trade_xml_id"] else "",
                        ]
                        if alias
                    ]
                },
                "boundary": {
                    "internal_claim": "Trade identifier, trade date, product linkage, party relationship, and documentation references are internal to the trade contract state.",
                    "external_claim": "Regulatory liquidity treatment and downstream reporting consequences are external to the local trade object.",
                    "adjacent_objects": [
                        product_object_id,
                        party_a_id,
                        party_b_id,
                        agreement_object_id
                    ],
                    "adjacent_domains": [
                        "apra_liquidity.reporting"
                    ]
                },
                "blanket": {
                    "ingress_surfaces": [
                        "fpml_confirmation_document"
                    ],
                    "egress_surfaces": [
                        "trade_world_fragment_publication",
                        "apra_liquidity_candidate_treatment"
                    ],
                    "observable_surfaces": [
                        OFFICIAL_SAMPLE_RELATIVE_PATH.name,
                        "parsed_trade_observation.json"
                    ],
                    "control_surfaces": [
                        "confirm_trade",
                        "amend_trade",
                        "terminate_trade"
                    ],
                    "adjacent_objects": [
                        product_object_id,
                        party_a_id,
                        party_b_id,
                        agreement_object_id
                    ],
                    "adjacent_domains": [
                        "apra_liquidity.reporting"
                    ],
                    "internal_claim": "The trade contract state is the local semantic unit represented by the bounded FpML trade package.",
                    "external_claim": "Regulatory and treasury interpretations are downstream treatments over the trade object."
                },
                "state": {
                    "lifecycle_state": "confirmed",
                    "state_summary": "Trade is represented in confirmation view and suitable for downstream interpretation.",
                    "effective_time": _date_time(observation["product"]["effective_date"]),
                    "observation_time": PUBLISHED_AT,
                    "ambiguity_status": "medium"
                },
                "constraints": {
                    "invariants": [
                        "trade_must_have_trade_identifier",
                        "trade_must_have_product_representation",
                        "trade_must_have_two_parties"
                    ],
                    "policies": [
                        "fpml_confirmation_trade_policy"
                    ],
                    "valid_transitions": [
                        "confirm",
                        "amend",
                        "terminate"
                    ]
                },
                "evidence": {
                    "refs": evidence_refs,
                    "summary": "Trade contract state recovered from bounded FpML confirmation-view XML plus inspection notes."
                },
                "materialization": {
                    "projection_summary": "Immutable trade object cut projected from the attribute ledger over trade identity and topology claims.",
                    "attribute_ledger_entry_refs": [
                        _trade_ledger_ref(spec["claim_key"])
                        for spec in _trade_claim_specs(observation)
                    ],
                    "assurance_record_refs": [
                        _trade_assurance_ref(spec["claim_key"])
                        for spec in _trade_claim_specs(observation)
                    ],
                    "trace_record_refs": [
                        _trade_trace_ref(spec["claim_key"])
                        for spec in _trade_claim_specs(observation)
                    ]
                },
                "cross_domain": {
                    "treatment_refs": [
                        _treatment_id()
                    ],
                    "covariance_edge_refs": [
                        "odd_world_model.covariance.trade_representation.trade_contract_to_product.v1"
                    ],
                    "adjoint_mapping_refs": [
                        "odd_world_model.adjoint.trade_representation.trade_contract_to_product.v1"
                    ],
                    "loss_notes": [
                        "Downstream regulatory views may collapse detailed product semantics into classification surfaces."
                    ]
                },
                "composition": {
                    "fragment_id": "odd_world_model.fragment.trade_representation.fpml_commodity_swap.v1",
                    "parent_object_refs": [],
                    "child_object_refs": [
                        product_object_id,
                        party_a_id,
                        party_b_id,
                        agreement_object_id
                    ]
                }
            }
        ),
        (
            "commodity_swap_product.json",
            {
                "schema_kind": "odd_world_model.world_model_object",
                "schema_version": "v1",
                "object_id": product_object_id,
                "object_kind": "CommoditySwapProductRepresentation",
                "bounded_context": "trade_representation.fpml_confirmation.commodity_swap",
                "semantic_role": "Commodity swap product surface recovered from the FpML trade.",
                "identity": {
                    "authority_basis": "FpML commoditySwap product representation",
                    "aliases": [
                        alias
                        for alias in [
                            f"product_id:{observation['product']['product_id']}" if observation["product"]["product_id"] else "",
                            f"product_type:{observation['product']['product_type']}" if observation["product"]["product_type"] else "",
                            f"leg_count:{observation['product']['leg_count']}",
                        ]
                        if alias
                    ]
                },
                "boundary": {
                    "internal_claim": "Product type, asset class, and key dates are internal to the commodity swap product surface for this bounded world-model domain.",
                    "external_claim": "Trade state and party obligations remain adjacent but external.",
                    "adjacent_objects": [trade_object_id],
                    "adjacent_domains": []
                },
                "state": {
                    "lifecycle_state": "active",
                    "state_summary": "Commodity swap product is active over the effective to termination date range.",
                    "effective_time": _date_time(observation["product"]["effective_date"]),
                    "observation_time": "2026-04-15T00:00:00Z",
                    "ambiguity_status": "low"
                },
                "constraints": {
                    "invariants": [
                        "product_must_have_product_type",
                        "product_must_have_asset_class"
                    ],
                    "policies": [
                        "fpml_product_representation_policy"
                    ],
                    "valid_transitions": [
                        "amend_terms",
                        "terminate"
                    ]
                },
                "evidence": {
                    "refs": evidence_refs,
                    "summary": "Product surface recovered from the commoditySwap structure."
                },
                "cross_domain": {
                    "treatment_refs": [],
                    "covariance_edge_refs": [
                        "odd_world_model.covariance.trade_representation.trade_contract_to_product.v1"
                    ],
                    "adjoint_mapping_refs": [
                        "odd_world_model.adjoint.trade_representation.trade_contract_to_product.v1"
                    ],
                    "loss_notes": []
                },
                "composition": {
                    "fragment_id": "odd_world_model.fragment.trade_representation.fpml_commodity_swap.v1",
                    "parent_object_refs": [
                        trade_object_id
                    ],
                    "child_object_refs": []
                }
            }
        ),
        (
            "party_a_profile.json",
            {
                "schema_kind": "odd_world_model.world_model_object",
                "schema_version": "v1",
                "object_id": party_a_id,
                "object_kind": "TradePartyProfile",
                "bounded_context": "trade_representation.fpml_confirmation.commodity_swap",
                "semantic_role": "First party surface recovered from the bounded FpML trade package.",
                "identity": {
                    "authority_basis": "FpML party representation",
                    "aliases": [
                        f"party_xml_id:{party_a['xml_id']}",
                        f"party_id:{party_a['party_id']}",
                        party_a["party_name"]
                    ]
                },
                "boundary": {
                    "internal_claim": "Local party identity and naming are internal to this party profile object.",
                    "external_claim": "Regulatory counterparty bucketing is external to the local party profile.",
                    "adjacent_objects": [
                        trade_object_id
                    ],
                    "adjacent_domains": [
                        "apra_liquidity.reporting"
                    ]
                },
                "state": {
                    "lifecycle_state": "known",
                    "state_summary": "First party profile is present in the bounded FpML trade package.",
                    "observation_time": "2026-04-15T00:00:00Z",
                    "ambiguity_status": "medium"
                },
                "evidence": {
                    "refs": evidence_refs,
                    "summary": "First party profile recovered from party elements and party references."
                },
                "cross_domain": {
                    "treatment_refs": [
                        _treatment_id()
                    ],
                    "covariance_edge_refs": [],
                    "adjoint_mapping_refs": [],
                    "loss_notes": [
                        "Local party identity may be reduced to a counterparty bucket downstream."
                    ]
                },
                "composition": {
                    "fragment_id": "odd_world_model.fragment.trade_representation.fpml_commodity_swap.v1",
                    "parent_object_refs": [
                        trade_object_id
                    ],
                    "child_object_refs": []
                }
            }
        ),
        (
            "party_b_profile.json",
            {
                "schema_kind": "odd_world_model.world_model_object",
                "schema_version": "v1",
                "object_id": party_b_id,
                "object_kind": "TradePartyProfile",
                "bounded_context": "trade_representation.fpml_confirmation.commodity_swap",
                "semantic_role": "Second party surface recovered from the bounded FpML trade package.",
                "identity": {
                    "authority_basis": "FpML party representation",
                    "aliases": [
                        f"party_xml_id:{party_b['xml_id']}",
                        f"party_id:{party_b['party_id']}",
                        party_b["party_name"]
                    ]
                },
                "boundary": {
                    "internal_claim": "Local party identity and naming are internal to this party profile object.",
                    "external_claim": "Regulatory counterparty bucketing is external to the local party profile.",
                    "adjacent_objects": [
                        trade_object_id
                    ],
                    "adjacent_domains": [
                        "apra_liquidity.reporting"
                    ]
                },
                "state": {
                    "lifecycle_state": "known",
                    "state_summary": "Second party profile is present in the bounded FpML trade package.",
                    "observation_time": "2026-04-15T00:00:00Z",
                    "ambiguity_status": "medium"
                },
                "evidence": {
                    "refs": evidence_refs,
                    "summary": "Second party profile recovered from party elements and party references."
                },
                "cross_domain": {
                    "treatment_refs": [
                        _treatment_id()
                    ],
                    "covariance_edge_refs": [],
                    "adjoint_mapping_refs": [],
                    "loss_notes": [
                        "Local party identity may be reduced to a counterparty bucket downstream."
                    ]
                },
                "composition": {
                    "fragment_id": "odd_world_model.fragment.trade_representation.fpml_commodity_swap.v1",
                    "parent_object_refs": [
                        trade_object_id
                    ],
                    "child_object_refs": []
                }
            }
        ),
        (
            "master_agreement_reference.json",
            {
                "schema_kind": "odd_world_model.world_model_object",
                "schema_version": "v1",
                "object_id": agreement_object_id,
                "object_kind": "MasterAgreementReference",
                "bounded_context": "trade_representation.fpml_confirmation.commodity_swap",
                "semantic_role": "Master-agreement surface recovered from FpML documentation.",
                "identity": {
                    "authority_basis": "FpML documentation masterAgreement representation",
                    "aliases": [
                        f"master_agreement_type:{observation['agreement']['type']}",
                        f"master_agreement_version:{observation['agreement']['version']}"
                    ]
                },
                "boundary": {
                    "internal_claim": "Agreement type, date, and version are internal to this agreement reference surface.",
                    "external_claim": "Full legal agreement semantics remain external to the bounded representation.",
                    "adjacent_objects": [
                        trade_object_id
                    ],
                    "adjacent_domains": [
                        "apra_liquidity.reporting"
                    ]
                },
                "state": {
                    "lifecycle_state": "referenced",
                    "state_summary": "Agreement reference is present but only partially deepened from the documentation surface.",
                    "effective_time": _date_time(observation["agreement"]["date"]),
                    "observation_time": "2026-04-15T00:00:00Z",
                    "ambiguity_status": "medium"
                },
                "evidence": {
                    "refs": evidence_refs,
                    "summary": "Agreement reference recovered from documentation/masterAgreement."
                },
                "cross_domain": {
                    "treatment_refs": [
                        _treatment_id()
                    ],
                    "covariance_edge_refs": [],
                    "adjoint_mapping_refs": [],
                    "loss_notes": [
                        "Bounded FpML documentation does not capture the full legal agreement semantics."
                    ]
                },
                "composition": {
                    "fragment_id": "odd_world_model.fragment.trade_representation.fpml_commodity_swap.v1",
                    "parent_object_refs": [
                        trade_object_id
                    ],
                    "child_object_refs": []
                }
            }
        )
    ]

    return objects


def _source_fragment(observation: dict[str, Any]) -> dict[str, Any]:
    source_root = source_domain_root()
    source_authority_path = _source_authority_path()
    source_xml_path = _source_xml_path()
    source_examples_index_path = _source_examples_index_path()
    trade_review_path = review_root() / "parsed_trade_observation.json"
    trade_fragment_path = published_root() / "fragment.json"
    leg_files = [
        f"objects/{_source_leg_file_name(leg['leg_kind'], index)}"
        for index, leg in enumerate(observation["product"]["legs"], start=1)
    ]
    return {
        "schema_kind": "odd_world_model.world_fragment",
        "schema_version": "v1",
        "fragment_id": "odd_world_model.fragment.fpml_confirmation_source.commodity_swap.v1",
        "bounded_context": "fpml_confirmation_source.commodity_swap",
        "published_at": PUBLISHED_AT,
        "published_by": "odd_world_model.project.trade_source_model",
        "summary": "Published trade-source fragment built in the versioned trade-source sandbox over the retained official FpML confirmation authority.",
        "objects": [
            "objects/source_trade_record.json",
            "objects/source_commodity_swap_surface.json",
            *leg_files,
        ],
        "attribute_ledger_entries": [],
        "reference_artifacts": [],
        "treatments": [],
        "edges": [],
        "projections": [],
        "evidence_manifests": [
            "evidence/manifests/fpml_source_manifest.json",
        ],
        "links": [
            relative_path(source_root, trade_review_path),
            relative_path(source_root, trade_fragment_path),
            relative_path(source_root, source_authority_path),
            relative_path(source_root, source_xml_path),
            relative_path(source_root, source_examples_index_path),
        ],
    }


def _source_objects(observation: dict[str, Any]) -> list[tuple[str, dict[str, Any]]]:
    evidence_refs = [
        OFFICIAL_SAMPLE_INPUT_REF,
        OFFICIAL_EXAMPLES_INDEX_REF,
        TRADE_SOURCE_AUTHORITY_REF,
        TRADE_REPRESENTATION_REVIEW_REF,
    ]
    source_trade_id = _source_trade_object_id()
    source_product_id = _source_product_object_id()
    source_leg_ids = [
        _source_leg_object_id(leg["leg_kind"], index)
        for index, leg in enumerate(observation["product"]["legs"], start=1)
    ]
    objects: list[tuple[str, dict[str, Any]]] = [
        (
            "source_trade_record.json",
            {
                "schema_kind": "odd_world_model.world_model_object",
                "schema_version": "v1",
                "object_id": source_trade_id,
                "object_kind": "FpmlConfirmationTradeRecord",
                "bounded_context": "fpml_confirmation_source.commodity_swap",
                "semantic_role": "Official FpML confirmation-view trade record preserved as the published source-truth domain.",
                "identity": {
                    "authority_basis": "Official FpML confirmation example",
                    "aliases": [
                        alias
                        for alias in [
                            f"trade_id:{observation['trade_id']}" if observation["trade_id"] else "",
                            f"trade_xml_id:{observation['trade_xml_id']}" if observation["trade_xml_id"] else "",
                        ]
                        if alias
                    ],
                },
                "boundary": {
                    "internal_claim": "Trade-header identifiers, trade date, and the direct commoditySwap attachment are internal to this source record.",
                    "external_claim": "Interpreted world-model semantics remain external to the source FpML record domain.",
                    "adjacent_objects": [source_product_id],
                    "adjacent_domains": ["trade_representation.fpml_confirmation"],
                },
                "state": {
                    "lifecycle_state": "captured",
                    "state_summary": "Official FpML confirmation-view trade record captured as the source domain truth.",
                    "effective_time": _date_time(observation["trade_date"]),
                    "observation_time": PUBLISHED_AT,
                    "ambiguity_status": "low",
                },
                "evidence": {
                    "refs": evidence_refs,
                    "summary": "Trade record preserved directly from the official FpML source.",
                },
                "cross_domain": {
                    "treatment_refs": [],
                    "covariance_edge_refs": [],
                    "adjoint_mapping_refs": [],
                    "loss_notes": [],
                },
                "composition": {
                    "fragment_id": "odd_world_model.fragment.fpml_confirmation_source.commodity_swap.v1",
                    "parent_object_refs": [],
                    "child_object_refs": [source_product_id],
                },
            },
        ),
        (
            "source_commodity_swap_surface.json",
            {
                "schema_kind": "odd_world_model.world_model_object",
                "schema_version": "v1",
                "object_id": source_product_id,
                "object_kind": "FpmlCommoditySwapSourceSurface",
                "bounded_context": "fpml_confirmation_source.commodity_swap",
                "semantic_role": "Official commoditySwap source surface preserved with bounded leg structure.",
                "identity": {
                    "authority_basis": "Official FpML commoditySwap source representation",
                    "aliases": [
                        alias
                        for alias in [
                            f"product_id:{observation['product']['product_id']}" if observation["product"]["product_id"] else "",
                            f"product_type:{observation['product']['product_type']}" if observation["product"]["product_type"] else "",
                            f"asset_class:{observation['product']['asset_class']}" if observation["product"]["asset_class"] else "",
                            f"leg_count:{observation['product']['leg_count']}",
                        ]
                        if alias
                    ],
                },
                "boundary": {
                    "internal_claim": "Official product type, asset class, dates, and direct leg structure are internal to this source product surface.",
                    "external_claim": "Downstream normalized trade semantics remain external to the source product surface.",
                    "adjacent_objects": [source_trade_id, *source_leg_ids],
                    "adjacent_domains": ["trade_representation.fpml_confirmation"],
                },
                "state": {
                    "lifecycle_state": "captured",
                    "state_summary": "Official commoditySwap source surface captured with bounded fixed/floating legs.",
                    "effective_time": _date_time(observation["product"]["effective_date"]),
                    "observation_time": PUBLISHED_AT,
                    "ambiguity_status": "low",
                },
                "constraints": {
                    "invariants": [
                        "source_product_must_preserve_official_leg_structure",
                    ],
                    "policies": [
                        "fpml_source_product_capture_policy",
                    ],
                    "valid_transitions": [
                        "supersede_with_new_source_cut",
                    ],
                },
                "evidence": {
                    "refs": evidence_refs,
                    "summary": "CommoditySwap source surface preserved directly from the official FpML example.",
                },
                "cross_domain": {
                    "treatment_refs": [],
                    "covariance_edge_refs": [],
                    "adjoint_mapping_refs": [],
                    "loss_notes": [],
                },
                "composition": {
                    "fragment_id": "odd_world_model.fragment.fpml_confirmation_source.commodity_swap.v1",
                    "parent_object_refs": [source_trade_id],
                    "child_object_refs": source_leg_ids,
                },
            },
        ),
    ]

    for index, leg in enumerate(observation["product"]["legs"], start=1):
        leg_object_id = _source_leg_object_id(leg["leg_kind"], index)
        quantity_summary = (
            f"{leg['quantity']} {leg['quantity_unit']}".strip()
            if leg["quantity"] or leg["quantity_unit"]
            else "bounded notional quantity"
        )
        objects.append(
            (
                _source_leg_file_name(leg["leg_kind"], index),
                {
                    "schema_kind": "odd_world_model.world_model_object",
                    "schema_version": "v1",
                    "object_id": leg_object_id,
                    "object_kind": "FpmlCommoditySwapLegSourceSurface",
                    "bounded_context": "fpml_confirmation_source.commodity_swap",
                    "semantic_role": f"Official {leg['leg_kind']} preserved as a direct source-domain surface.",
                    "identity": {
                        "authority_basis": "Official FpML commoditySwap leg source representation",
                        "aliases": [
                            alias
                            for alias in [
                                f"leg_id:{leg['leg_id']}" if leg["leg_id"] else "",
                                f"leg_kind:{leg['leg_kind']}" if leg["leg_kind"] else "",
                                f"payer:{leg['payer_party_ref']}" if leg["payer_party_ref"] else "",
                                f"receiver:{leg['receiver_party_ref']}" if leg["receiver_party_ref"] else "",
                                f"commodity:{leg['commodity_instrument_id']}" if leg["commodity_instrument_id"] else "",
                            ]
                            if alias
                        ],
                    },
                    "boundary": {
                        "internal_claim": "Direction, quantity, price shape, and commodity reference are internal to this official source leg surface.",
                        "external_claim": "Normalized trade semantics remain external to the source leg surface.",
                        "adjacent_objects": [source_product_id],
                        "adjacent_domains": ["trade_representation.fpml_confirmation"],
                    },
                    "state": {
                        "lifecycle_state": "captured",
                        "state_summary": f"Official {leg['leg_kind']} captured with {quantity_summary}.",
                        "effective_time": _date_time(observation["product"]["effective_date"]),
                        "observation_time": PUBLISHED_AT,
                        "ambiguity_status": "low",
                    },
                    "constraints": {
                        "invariants": [
                            "source_leg_must_preserve_official_direction",
                            "source_leg_must_preserve_official_notional_shape",
                        ],
                        "policies": [
                            "fpml_source_leg_capture_policy",
                        ],
                        "valid_transitions": [
                            "supersede_with_new_source_cut",
                        ],
                    },
                    "evidence": {
                        "refs": evidence_refs,
                        "summary": f"{leg['leg_kind']} preserved directly from the official FpML example.",
                    },
                    "cross_domain": {
                        "treatment_refs": [],
                        "covariance_edge_refs": [],
                        "adjoint_mapping_refs": [],
                        "loss_notes": [],
                    },
                    "composition": {
                        "fragment_id": "odd_world_model.fragment.fpml_confirmation_source.commodity_swap.v1",
                        "parent_object_refs": [source_product_id],
                        "child_object_refs": [],
                    },
                },
            )
        )

    return objects


def _source_manifest() -> tuple[str, dict[str, Any]]:
    return (
        "fpml_source_manifest.json",
        {
            "schema_kind": "odd_world_model.evidence_manifest",
            "schema_version": "v1",
            "manifest_id": "odd_world_model.evidence.fpml_confirmation_source.commodity_swap.v1",
            "summary": "Evidence manifest for the official FpML confirmation-view source domain.",
            "refs": [
                OFFICIAL_SAMPLE_INPUT_REF,
                OFFICIAL_EXAMPLES_INDEX_REF,
                TRADE_SOURCE_AUTHORITY_REF,
                TRADE_REPRESENTATION_REVIEW_REF,
            ],
        },
    )


def _trade_treatment() -> tuple[str, dict[str, Any]]:
    return (
        "trade_to_apra_liquidity_candidate.json",
        {
            "schema_kind": "odd_world_model.treatment_surface",
            "schema_version": "v1",
            "treatment_id": _treatment_id(),
            "source_object_refs": [
                _trade_markov_object_id(),
                _product_object_id(),
                _agreement_object_id()
            ],
            "target_domain": "odd_world_model.domain.apra_liquidity.reporting.sandbox.v1",
            "preserved_structure": [
                "trade_identifier",
                "party_identity",
                "master_agreement_reference",
                "trade_lifecycle_state"
            ],
            "changed_meaning": [
                "Trade representation is reinterpreted as a regulatory liquidity position rather than a confirmation-view trade object."
            ],
            "loss_notes": [
                "Detailed commodity economics may not survive in full across the regulatory treatment boundary."
            ],
            "surplus_notes": [
                "Target domain introduces reporting and bucket semantics not present in the source trade representation."
            ]
        }
    )


def _trade_edges() -> list[tuple[Path, dict[str, Any]]]:
    return [
        (
            Path("covariance") / "trade_to_product.json",
            {
                "schema_kind": "odd_world_model.covariance_edge",
                "schema_version": "v1",
                "edge_id": "odd_world_model.covariance.trade_representation.trade_contract_to_product.v1",
                "source_object_ref": _trade_markov_object_id(),
                "target_object_ref": _product_object_id(),
                "relationship_kind": "decomposition",
                "ambiguity_notes": [
                    "Product representation could later be split into richer economic-leg objects."
                ]
            }
        ),
        (
            Path("adjoints") / "trade_to_product.json",
            {
                "schema_kind": "odd_world_model.adjoint_mapping",
                "schema_version": "v1",
                "mapping_id": "odd_world_model.adjoint.trade_representation.trade_contract_to_product.v1",
                "forward_treatment_ref": _treatment_id(),
                "source_domain": "odd_world_model.domain.trade_representation.fpml_confirmation.v1",
                "target_domain": "odd_world_model.domain.trade_representation.fpml_confirmation.v1",
                "interpret_back_summary": "The commodity swap product surface can be interpreted back as one bounded component of the trade contract state carried by the FpML representation.",
                "preserved_structure": [
                    "product_type",
                    "product_id",
                    "asset_class",
                    "effective_date",
                    "termination_date"
                ],
                "loss_notes": [],
                "surplus_notes": []
            }
        )
    ]


def _trade_trace_records(observation: dict[str, Any]) -> list[tuple[Path, dict[str, Any]]]:
    records: list[tuple[Path, dict[str, Any]]] = []
    for spec in _trade_claim_specs(observation):
        payload = trace_record(
            trace_id=_trade_trace_id(spec["claim_key"]),
            object_ref=_trade_markov_object_id(),
            claim_key=spec["claim_key"],
            source_ref=spec["source_ref"],
            source_kind=spec["source_kind"],
            locator=spec["locator"],
            observed_at=PUBLISHED_AT,
            observed_value=spec["value"],
            observation_kind=spec["claim_kind"],
            effective_time=spec.get("effective_time"),
            summary=spec["summary"],
        )
        records.append((_trade_trace_path(spec["claim_key"]), payload))
    return records


def _trade_assurance_records(observation: dict[str, Any]) -> list[tuple[Path, dict[str, Any]]]:
    records: list[tuple[Path, dict[str, Any]]] = []
    for spec in _trade_claim_specs(observation):
        payload = assurance_record(
            assurance_id=_trade_assurance_id(spec["claim_key"]),
            object_ref=_trade_markov_object_id(),
            claim_key=spec["claim_key"],
            claim_kind=spec["claim_kind"],
            accepted_value=spec["value"],
            trace_record_refs=[_trade_trace_ref(spec["claim_key"])],
            authority_basis=spec["authority_basis"],
            accepted_at=PUBLISHED_AT,
            summary=spec["summary"],
        )
        records.append((_trade_assurance_path(spec["claim_key"]), payload))
    return records


def _trade_attribute_ledger_entries(observation: dict[str, Any]) -> list[tuple[Path, dict[str, Any]]]:
    records: list[tuple[Path, dict[str, Any]]] = []
    for spec in _trade_claim_specs(observation):
        payload = attribute_ledger_entry(
            entry_id=_trade_ledger_entry_id(spec["claim_key"]),
            object_ref=_trade_markov_object_id(),
            claim_key=spec["claim_key"],
            claim_kind=spec["claim_kind"],
            value=spec["value"],
            qualifiers=spec.get("qualifiers"),
            trace_record_refs=[_trade_trace_ref(spec["claim_key"])],
            assurance_record_refs=[_trade_assurance_ref(spec["claim_key"])],
            effective_time=spec.get("effective_time"),
            observed_at=PUBLISHED_AT,
            published_at=PUBLISHED_AT,
            summary=spec["summary"],
        )
        records.append((_trade_ledger_path(spec["claim_key"]), payload))
    return records


def _trade_projections() -> list[tuple[str, dict[str, Any]]]:
    source_refs = [
        _trade_markov_object_id(),
        _product_object_id(),
        _agreement_object_id()
    ]
    return [
        (
            "trade_table.json",
            {
                "schema_kind": "odd_world_model.projection_spec",
                "schema_version": "v1",
                "projection_id": "odd_world_model.projection.trade_representation.table.v1",
                "projection_kind": "table",
                "source_refs": source_refs,
                "output_summary": "Tabular projection over the FpML-derived trade fragment."
            }
        ),
        (
            "trade_api_contract.json",
            {
                "schema_kind": "odd_world_model.projection_spec",
                "schema_version": "v1",
                "projection_id": "odd_world_model.projection.trade_representation.api_contract.v1",
                "projection_kind": "api_contract",
                "source_refs": source_refs,
                "output_summary": "API contract projection for the FpML-derived trade domain artifact."
            }
        ),
        (
            "trade_schema_contract.json",
            {
                "schema_kind": "odd_world_model.projection_spec",
                "schema_version": "v1",
                "projection_id": "odd_world_model.projection.trade_representation.schema_contract.v1",
                "projection_kind": "schema_contract",
                "source_refs": source_refs,
                "output_summary": "Schema contract projection for the FpML-derived trade domain artifact."
            }
        )
    ]


def _trade_manifest() -> tuple[str, dict[str, Any]]:
    return (
        "fpml_trade_manifest.json",
        {
            "schema_kind": "odd_world_model.evidence_manifest",
            "schema_version": "v1",
            "manifest_id": "odd_world_model.evidence.trade_representation.fpml_trade_manifest.v1",
            "summary": "Evidence manifest for the bounded FpML trade ingestion lane.",
            "refs": [
                OFFICIAL_SAMPLE_INPUT_REF,
                OFFICIAL_EXAMPLES_INDEX_REF,
                TRADE_SOURCE_AUTHORITY_REF,
                "review://parsed_trade_observation.json"
            ]
        }
    )


def materialize_source_observation_surface(*, reset: bool = False) -> dict[str, Any]:
    if reset:
        _reset_generated_output()
    observation = _observation()
    _write_json(review_root() / "parsed_trade_observation.json", observation)
    return observation


def materialize_trace_surface(*, reset: bool = False) -> dict[str, Any]:
    observation = materialize_source_observation_surface(reset=reset)
    for relative_path, payload in _trade_trace_records(observation):
        _write_json(review_root() / relative_path, payload)
    return observation


def materialize_assurance_surface(*, reset: bool = False) -> dict[str, Any]:
    observation = materialize_trace_surface(reset=reset)
    for relative_path, payload in _trade_assurance_records(observation):
        _write_json(review_root() / relative_path, payload)
    return observation


def materialize_source_domain_artifact(*, reset: bool = False) -> dict[str, Any]:
    observation = materialize_source_observation_surface(reset=reset)
    _write_json(source_domain_root() / "fragment.json", _source_fragment(observation))
    for file_name, payload in _source_objects(observation):
        _write_json(source_domain_root() / "objects" / file_name, payload)
    manifest_name, manifest_payload = _source_manifest()
    _write_json(source_domain_root() / "evidence" / "manifests" / manifest_name, manifest_payload)
    return observation


def materialize_trade_domain_artifact(*, reset: bool = False) -> dict[str, Any]:
    materialize_source_domain_artifact(reset=reset)
    observation = materialize_assurance_surface(reset=False)
    _write_json(published_root() / "fragment.json", _trade_fragment(observation))
    for file_name, payload in _trade_objects(observation):
        _write_json(published_root() / "objects" / file_name, payload)
    for relative_path, payload in _trade_attribute_ledger_entries(observation):
        _write_json(published_root() / relative_path, payload)
    treatment_name, treatment_payload = _trade_treatment()
    _write_json(published_root() / "treatments" / treatment_name, treatment_payload)
    for relative_path, payload in _trade_edges():
        _write_json(published_root() / "edges" / relative_path, payload)
    for file_name, payload in _trade_projections():
        _write_json(published_root() / "projections" / file_name, payload)
    manifest_name, manifest_payload = _trade_manifest()
    _write_json(published_root() / "evidence" / "manifests" / manifest_name, manifest_payload)
    return observation


def build() -> None:
    materialize_trade_domain_artifact(reset=True)


def main() -> int:
    build()
    print(trade_representation_sandbox_root())
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
