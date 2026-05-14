"""Standalone source-domain build line over retained FpML confirmation authority."""

from __future__ import annotations

import json
from pathlib import Path
import shutil
from typing import Any

from odd_world_model.adapters.fpml_confirmation import parse_fpml_trade
from odd_world_model.sandbox_config import load_sandbox_config


PUBLISHED_AT = "2026-04-20T00:00:00Z"


def _read_config(workspace_root: Path) -> dict[str, Any]:
    config = load_sandbox_config(workspace_root)
    if config is None:
        raise ValueError(f"missing sandbox builder config for {workspace_root}")
    domain = config.get("domain", {})
    if not isinstance(domain, dict):
        raise ValueError("sandbox builder config must contain an object at 'domain'")
    return domain


def _domain_value(domain: dict[str, Any], key: str) -> str:
    value = domain.get(key)
    if not isinstance(value, str) or not value:
        raise ValueError(f"sandbox builder domain.{key} must be a non-empty string")
    return value


def _path(workspace_root: Path, relative: str) -> Path:
    return (workspace_root / relative).resolve()


def _write_json(path: Path, payload: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")


def _relative_to_workspace(workspace_root: Path, path: Path) -> str:
    return path.resolve().relative_to(workspace_root.resolve()).as_posix()


def _date_time(value: str | None) -> str | None:
    if not value:
        return None
    return f"{value}T00:00:00Z"


def _source_ref(example_name: str, relative_path: str) -> str:
    return f"input://examples/{example_name}/sources/{relative_path}"


def _review_ref(relative_path: str) -> str:
    return f"review://{relative_path}"


def _root_object_id() -> str:
    return "odd_world_model.world_model_object.fpml_confirmation.trade_record.trade_fpml_001"


def _product_object_id() -> str:
    return "odd_world_model.world_model_object.fpml_confirmation.commodity_swap_source.product_fpml_001"


def _leg_object_id(leg_kind: str, index: int) -> str:
    leg_key = "fixed_leg" if leg_kind == "fixedLeg" else "floating_leg" if leg_kind == "floatingLeg" else "other_leg"
    return f"odd_world_model.world_model_object.fpml_confirmation.commodity_swap_leg.{leg_key}_{index:02d}"


def _trade_trace_ref(claim_key: str) -> str:
    return _review_ref(f"traces/source_trade_record/{claim_key}.json")


def _trade_assurance_ref(claim_key: str) -> str:
    return _review_ref(f"assurance/source_trade_record/{claim_key}.json")


def _trade_ledger_ref(claim_key: str) -> str:
    return f"ledger://source_trade_record/{claim_key}.json"


def _trade_trace_path(claim_key: str) -> Path:
    return Path("source_trade_record") / f"{claim_key}.json"


def _trade_assurance_path(claim_key: str) -> Path:
    return Path("source_trade_record") / f"{claim_key}.json"


def _trade_ledger_path(claim_key: str) -> Path:
    return Path("source_trade_record") / f"{claim_key}.json"


def _claim_specs(observation: dict[str, Any]) -> list[dict[str, Any]]:
    return [
        {
            "claim_key": "trade_identifier",
            "claim_kind": "identity",
            "value": observation["trade_id"],
            "locator": "trade.tradeHeader.partyTradeIdentifier[0].tradeId",
            "summary": "Trade identifier observed from the official FpML trade header.",
        },
        {
            "claim_key": "trade_date",
            "claim_kind": "state",
            "value": observation["trade_date"],
            "locator": "trade.tradeHeader.tradeDate",
            "summary": "Trade date observed from the official FpML trade header.",
        },
        {
            "claim_key": "product_surface_ref",
            "claim_kind": "attribute",
            "value": _product_object_id(),
            "locator": "trade.commoditySwap",
            "summary": "Product surface linkage observed from the official commoditySwap branch.",
        },
    ]


def load_fpml_source_config(workspace_root: Path) -> dict[str, Any]:
    domain = _read_config(workspace_root)
    example_name = _domain_value(domain, "example_name")
    artifact_slug = _domain_value(domain, "artifact_slug")
    source_xml_relative = _domain_value(domain, "source_xml")
    examples_index_relative = _domain_value(domain, "examples_index")
    source_authority_relative = _domain_value(domain, "source_authority")
    source_notes_relative = domain.get("source_notes")

    source_xml_path = _path(workspace_root, source_xml_relative)
    examples_index_path = _path(workspace_root, examples_index_relative)
    source_authority_path = _path(workspace_root, source_authority_relative)
    source_notes_path = (
        _path(workspace_root, source_notes_relative)
        if isinstance(source_notes_relative, str) and source_notes_relative
        else None
    )
    observation = parse_fpml_trade(source_xml_path)

    return {
        "workspace_root": workspace_root,
        "example_name": example_name,
        "artifact_slug": artifact_slug,
        "source_xml_relative": source_xml_relative,
        "source_xml_path": source_xml_path,
        "examples_index_relative": examples_index_relative,
        "examples_index_path": examples_index_path,
        "source_authority_relative": source_authority_relative,
        "source_authority_path": source_authority_path,
        "source_notes_relative": source_notes_relative if isinstance(source_notes_relative, str) and source_notes_relative else None,
        "source_notes_path": source_notes_path,
        "observation": observation,
        "review_root": workspace_root / "review",
        "source_observation_path": workspace_root / "review" / "source_observation.json",
        "traces_root": workspace_root / "review" / "traces",
        "assurance_root": workspace_root / "review" / "assurance",
        "published_root": workspace_root / "published" / artifact_slug,
        "attribute_ledger_root": workspace_root / "published" / artifact_slug / "attribute_ledger",
        "objects_root": workspace_root / "published" / artifact_slug / "objects",
        "projections_root": workspace_root / "published" / artifact_slug / "projections",
        "evidence_root": workspace_root / "published" / artifact_slug / "evidence" / "manifests",
        "fragment_path": workspace_root / "published" / artifact_slug / "fragment.json",
        "world_model_root": workspace_root / "published" / "world_model",
        "world_model_summary_path": workspace_root / "published" / "world_model" / "composed_world_model.json",
        "query_root": workspace_root / "query",
        "query_summary_path": workspace_root / "query" / "world_model_query_summary.json",
        "mapping_analysis_path": workspace_root / "mapping" / "analysis" / "domain_mapping_analysis.json",
        "mapping_record_path": workspace_root / "mapping" / "records" / "domain_mapping_record.json",
        "mapping_report_path": workspace_root / "mapping" / "reports" / "domain_mapping_report.md",
    }


def configured_asset_paths(workspace_root: Path) -> tuple[tuple[str, str, str], ...]:
    config = load_fpml_source_config(workspace_root)
    return (
        ("intent_surface", "intent_surface", "specification/INTENT.md"),
        ("product_surface", "product_surface", "specification/PRODUCT.md"),
        (
            "odd_method_carrier_requirements_surface",
            "published_domain_artifact_surface",
            "specification/requirements/50-odd-method-gtl-carrier.md",
        ),
        (
            "attribute_ledger_build_line_surface",
            "published_domain_artifact_surface",
            "@package/assets/design/ATTRIBUTE_LEDGER_BUILD_LINE.md",
        ),
        (
            "odd_gtl_attribute_ledger_carrier_surface",
            "published_domain_artifact_surface",
            "@package/assets/design/ODD_GTL_ATTRIBUTE_LEDGER_CARRIER.md",
        ),
        ("source_observation_surface", "source_observation_surface", _relative_to_workspace(workspace_root, config["source_observation_path"])),
        ("trace_surface", "trace_surface", _relative_to_workspace(workspace_root, config["traces_root"])),
        ("assurance_surface", "assurance_surface", _relative_to_workspace(workspace_root, config["assurance_root"])),
        ("attribute_ledger_surface", "attribute_ledger_surface", _relative_to_workspace(workspace_root, config["attribute_ledger_root"])),
        ("markov_object_cut_surface", "markov_object_cut_surface", _relative_to_workspace(workspace_root, config["objects_root"] / "source_trade_record.json")),
        ("published_domain_artifact_surface", "published_domain_artifact_surface", _relative_to_workspace(workspace_root, config["fragment_path"])),
        ("composed_world_model_surface", "composed_world_model_surface", _relative_to_workspace(workspace_root, config["world_model_root"])),
        ("query_projection_surface", "query_projection_surface", _relative_to_workspace(workspace_root, config["query_summary_path"])),
        ("mapping_analysis_surface", "mapping_analysis_surface", _relative_to_workspace(workspace_root, config["mapping_analysis_path"])),
        ("mapping_record_surface", "mapping_record_surface", _relative_to_workspace(workspace_root, config["mapping_record_path"])),
        ("mapping_report_surface", "mapping_report_surface", _relative_to_workspace(workspace_root, config["mapping_report_path"])),
    )


def _reset_output(config: dict[str, Any]) -> None:
    for root in (config["review_root"], config["published_root"], config["world_model_root"], config["query_root"]):
        if root.exists():
            shutil.rmtree(root)


def _source_evidence_refs(config: dict[str, Any]) -> list[str]:
    refs = [
        _source_ref(config["example_name"], f"data/{config['source_xml_relative'].split('sources/data/', 1)[-1]}"),
        _source_ref(config["example_name"], f"data/{config['examples_index_relative'].split('sources/data/', 1)[-1]}"),
        _source_ref(config["example_name"], f"uri_ledger/{Path(config['source_authority_relative']).name}"),
        _review_ref("source_observation.json"),
    ]
    source_notes_relative = config["source_notes_relative"]
    if source_notes_relative:
        refs.append(_source_ref(config["example_name"], f"uri_ledger/{Path(source_notes_relative).name}"))
    return refs


def _trace_payload(config: dict[str, Any], claim: dict[str, Any]) -> dict[str, Any]:
    return {
        "schema_kind": "odd_world_model.trace_record",
        "schema_version": "v1",
        "trace_id": f"odd_world_model.trace.fpml_confirmation_source.trade_record.{claim['claim_key']}.v1",
        "source_ref": _source_ref(config["example_name"], f"data/{config['source_xml_relative'].split('sources/data/', 1)[-1]}"),
        "source_kind": "fpml_confirmation_xml",
        "claim_key": claim["claim_key"],
        "locator": claim["locator"],
        "observed_at": PUBLISHED_AT,
        "observed_value": claim["value"],
        "summary": claim["summary"],
    }


def _assurance_payload(claim: dict[str, Any]) -> dict[str, Any]:
    return {
        "schema_kind": "odd_world_model.assurance_record",
        "schema_version": "v1",
        "assurance_id": f"odd_world_model.assurance.fpml_confirmation_source.trade_record.{claim['claim_key']}.v1",
        "object_ref": _root_object_id(),
        "claim_key": claim["claim_key"],
        "claim_kind": claim["claim_kind"],
        "accepted_value": claim["value"],
        "trace_record_refs": [_trade_trace_ref(claim["claim_key"])],
        "authority_basis": [
            "document:fpml_confirmation_source",
            f"parser:fpml_confirmation.{claim['claim_key']}",
        ],
        "accepted_at": PUBLISHED_AT,
    }


def _ledger_payload(claim: dict[str, Any]) -> dict[str, Any]:
    return {
        "schema_kind": "odd_world_model.attribute_ledger_entry",
        "schema_version": "v1",
        "entry_id": f"odd_world_model.attribute_ledger.fpml_confirmation_source.trade_record.{claim['claim_key']}.v1",
        "object_ref": _root_object_id(),
        "claim_key": claim["claim_key"],
        "claim_kind": claim["claim_kind"],
        "value": claim["value"],
        "trace_record_refs": [_trade_trace_ref(claim["claim_key"])],
        "assurance_record_refs": [_trade_assurance_ref(claim["claim_key"])],
        "published_at": PUBLISHED_AT,
    }


def _source_fragment(config: dict[str, Any]) -> dict[str, Any]:
    observation = config["observation"]
    leg_files = [
        f"objects/{'fixed_leg' if leg['leg_kind'] == 'fixedLeg' else 'floating_leg' if leg['leg_kind'] == 'floatingLeg' else 'other_leg'}_{index:02d}.json"
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
        "attribute_ledger_entries": [
            "attribute_ledger/source_trade_record/trade_identifier.json",
            "attribute_ledger/source_trade_record/trade_date.json",
            "attribute_ledger/source_trade_record/product_surface_ref.json",
        ],
        "reference_artifacts": [],
        "treatments": [],
        "edges": [],
        "projections": [
            "projections/domain_summary.json",
        ],
        "evidence_manifests": [
            "evidence/manifests/fpml_source_manifest.json",
        ],
        "links": [
            "../../sources/uri_ledger/source_authority.md",
            "../../sources/data/authority/com-ex28-gas-swap-daily-delivery-prices-option-last.xml",
            "../../sources/data/authority/fpml-5-12-examples.html",
            "../../review/source_observation.json",
        ],
    }


def _source_objects(config: dict[str, Any]) -> list[tuple[str, dict[str, Any]]]:
    observation = config["observation"]
    evidence_refs = _source_evidence_refs(config)
    source_trade_id = _root_object_id()
    source_product_id = _product_object_id()
    source_leg_ids = [
        _leg_object_id(leg["leg_kind"], index)
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
                    "aliases": [alias for alias in [f"trade_id:{observation['trade_id']}", f"trade_xml_id:{observation['trade_xml_id']}"] if alias],
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
                            f"product_id:{observation['product']['product_id']}",
                            f"product_type:{observation['product']['product_type']}",
                            f"asset_class:{observation['product']['asset_class']}",
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
                    "invariants": ["source_product_must_preserve_official_leg_structure"],
                    "policies": ["fpml_source_product_capture_policy"],
                    "valid_transitions": ["supersede_with_new_source_cut"],
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
        leg_file_name = f"{'fixed_leg' if leg['leg_kind'] == 'fixedLeg' else 'floating_leg' if leg['leg_kind'] == 'floatingLeg' else 'other_leg'}_{index:02d}.json"
        leg_object_id = _leg_object_id(leg["leg_kind"], index)
        quantity_summary = f"{leg['quantity']} {leg['quantity_unit']}".strip() if leg["quantity"] or leg["quantity_unit"] else "bounded notional quantity"
        objects.append(
            (
                leg_file_name,
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
                                f"leg_id:{leg['leg_id']}",
                                f"leg_kind:{leg['leg_kind']}",
                                f"payer:{leg['payer_party_ref']}",
                                f"receiver:{leg['receiver_party_ref']}",
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
                        "policies": ["fpml_source_leg_capture_policy"],
                        "valid_transitions": ["supersede_with_new_source_cut"],
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


def _source_manifest(config: dict[str, Any]) -> dict[str, Any]:
    return {
        "schema_kind": "odd_world_model.evidence_manifest",
        "schema_version": "v1",
        "manifest_id": "odd_world_model.evidence.fpml_confirmation_source.commodity_swap.v1",
        "summary": "Evidence manifest for the official FpML confirmation-view source domain.",
        "refs": _source_evidence_refs(config),
    }


def _projection_payload() -> dict[str, Any]:
    return {
        "schema_kind": "odd_world_model.projection_spec",
        "schema_version": "v1",
        "projection_id": "odd_world_model.projection.fpml_confirmation_source.summary.v1",
        "projection_kind": "domain_summary",
        "source_refs": ["odd_world_model.fragment.fpml_confirmation_source.commodity_swap.v1"],
        "summary": "Summary projection for the standalone FpML confirmation source domain.",
    }


def _world_model_payload() -> dict[str, Any]:
    return {
        "world_model_id": "odd_world_model.world_model.fpml_confirmation_source.commodity_swap.v1",
        "fragments": ["odd_world_model.fragment.fpml_confirmation_source.commodity_swap.v1"],
        "bounded_contexts": ["fpml_confirmation_source.commodity_swap"],
        "summary": "Single-domain world-model composition for the retained FpML confirmation source.",
    }


def _query_payload() -> dict[str, Any]:
    return {
        "query_id": "odd_world_model.query.fpml_confirmation_source.commodity_swap.v1",
        "lane": "filesystem_first",
        "fragment_ref": "odd_world_model.fragment.fpml_confirmation_source.commodity_swap.v1",
        "question": "What did the configured sandbox publish for the retained FpML confirmation source?",
        "answer": "The sandbox published the retained official FpML confirmation trade record, product surface, and bounded leg surfaces as a local source-truth domain.",
        "objects": [
            _root_object_id(),
            _product_object_id(),
        ],
        "source_refs": [
            "input://examples/trade_source_model/sources/data/authority/com-ex28-gas-swap-daily-delivery-prices-option-last.xml",
            "input://examples/trade_source_model/sources/data/authority/fpml-5-12-examples.html",
        ],
        "world_model_ref": "published/world_model/composed_world_model.json",
    }


def build_to_stage(workspace_root: Path, *, stage: str, reset: bool = True) -> None:
    config = load_fpml_source_config(workspace_root)
    if reset:
        _reset_output(config)

    observation = config["observation"]
    _write_json(config["source_observation_path"], observation)
    if stage == "source_observation_surface":
        return

    for claim in _claim_specs(observation):
        _write_json(config["traces_root"] / _trade_trace_path(claim["claim_key"]), _trace_payload(config, claim))
    if stage == "trace_surface":
        return

    for claim in _claim_specs(observation):
        _write_json(config["assurance_root"] / _trade_assurance_path(claim["claim_key"]), _assurance_payload(claim))
    if stage == "assurance_surface":
        return

    for claim in _claim_specs(observation):
        _write_json(config["attribute_ledger_root"] / _trade_ledger_path(claim["claim_key"]), _ledger_payload(claim))
    if stage == "attribute_ledger_surface":
        return

    for file_name, payload in _source_objects(config):
        _write_json(config["objects_root"] / file_name, payload)
    if stage == "markov_object_cut_surface":
        return

    _write_json(config["projections_root"] / "domain_summary.json", _projection_payload())
    _write_json(config["evidence_root"] / "fpml_source_manifest.json", _source_manifest(config))
    _write_json(config["fragment_path"], _source_fragment(config))
    if stage == "published_domain_artifact_surface":
        return

    _write_json(config["world_model_summary_path"], _world_model_payload())
    if stage == "composed_world_model_surface":
        return

    if stage == "query_projection_surface":
        _write_json(config["query_summary_path"], _query_payload())
        return

    raise ValueError(f"Unsupported stage {stage!r}")


def materialize_source_observation_surface(*, workspace_root: str | Path = ".", reset: bool = True) -> None:
    build_to_stage(Path(workspace_root).resolve(), stage="source_observation_surface", reset=reset)


def materialize_trace_surface(*, workspace_root: str | Path = ".", reset: bool = True) -> None:
    build_to_stage(Path(workspace_root).resolve(), stage="trace_surface", reset=reset)


def materialize_assurance_surface(*, workspace_root: str | Path = ".", reset: bool = True) -> None:
    build_to_stage(Path(workspace_root).resolve(), stage="assurance_surface", reset=reset)


def materialize_attribute_ledger_surface(*, workspace_root: str | Path = ".", reset: bool = True) -> None:
    build_to_stage(Path(workspace_root).resolve(), stage="attribute_ledger_surface", reset=reset)


def materialize_markov_object_cut_surface(*, workspace_root: str | Path = ".", reset: bool = True) -> None:
    build_to_stage(Path(workspace_root).resolve(), stage="markov_object_cut_surface", reset=reset)


def materialize_published_domain_artifact_surface(*, workspace_root: str | Path = ".", reset: bool = True) -> None:
    build_to_stage(Path(workspace_root).resolve(), stage="published_domain_artifact_surface", reset=reset)


def materialize_composed_world_model_surface(*, workspace_root: str | Path = ".", reset: bool = True) -> None:
    build_to_stage(Path(workspace_root).resolve(), stage="composed_world_model_surface", reset=reset)


def materialize_query_projection_surface(*, workspace_root: str | Path = ".", reset: bool = True) -> None:
    build_to_stage(Path(workspace_root).resolve(), stage="query_projection_surface", reset=reset)
