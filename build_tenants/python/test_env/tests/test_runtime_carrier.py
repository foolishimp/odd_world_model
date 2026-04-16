# Validates: REQ-ODD-DOMAIN-ODD-CARRIER-001
# Validates: REQ-ODD-DOMAIN-ODD-CARRIER-002
# Validates: REQ-ODD-DOMAIN-ODD-CARRIER-003
# Validates: REQ-ODD-DOMAIN-ODD-CARRIER-004
# Validates: REQ-ODD-DOMAIN-ODD-CARRIER-005
# Validates: REQ-ODD-DOMAIN-ODD-CARRIER-006
# Validates: REQ-ODD-DOMAIN-BUILD-CONSTRAINT-001
# Validates: REQ-ODD-DOMAIN-BUILD-VERIFY-004
from __future__ import annotations

from pathlib import Path

from odd_domain.function_catalog import active_programs, program_by_name
from odd_domain.query.domain import query_domain
from odd_domain.query_contract import query_domain_contract
from odd_domain.workspace_assets import bootstrap_assets, bootstrap_bindings


WORKSPACE_ROOT = Path(__file__).resolve().parents[4]


def test_query_domain_projection_exposes_governed_contract_and_assets() -> None:
    payload = query_domain(workspace_root=str(WORKSPACE_ROOT))

    assert payload["query_contract"] == query_domain_contract()
    assert payload["workspace_root"] == str(WORKSPACE_ROOT.resolve())

    asset_ids = {asset["asset_id"] for asset in payload["assets"]}
    assert {
        "intent_surface",
        "product_surface",
        "source_observation_surface",
        "trace_surface",
        "query_projection_surface",
        "mapping_record_surface",
    }.issubset(asset_ids)

    asset_type_names = {asset_type["name"] for asset_type in payload["asset_types"]}
    assert "mapping_record_surface" in asset_type_names


def test_active_executive_program_matches_retained_build_and_query_line() -> None:
    (program,) = active_programs()

    assert program.name == "build_and_query_world_model"
    assert program.outputs == ("query_projection_surface",)
    assert program.steps == (
        "trace_source_observations",
        "assure_attribute_claims",
        "materialize_attribute_ledger",
        "project_markov_object_cut",
        "publish_domain_artifact",
        "compose_world_model",
        "project_query_surface",
    )


def test_mapping_program_is_published_in_the_function_catalog() -> None:
    program = program_by_name("build_mapping_assets")

    assert program.outputs == ("mapping_report_surface",)
    assert program.steps == (
        "compose_world_model",
        "analyze_domain_mapping",
        "publish_mapping_record",
        "project_mapping_report",
    )


def test_bootstrap_assets_and_bindings_cover_runtime_nodes() -> None:
    assets = bootstrap_assets(WORKSPACE_ROOT)
    bindings = bootstrap_bindings(WORKSPACE_ROOT)

    assert len(assets) >= 8
    assert {asset.asset_id for asset in assets} >= {
        "intent_surface",
        "product_surface",
        "source_observation_surface",
        "published_domain_artifact_surface",
    }
    assert {binding.node for binding in bindings} == {
        "source_observation_surface",
        "trace_surface",
        "assurance_surface",
        "attribute_ledger_surface",
        "markov_object_cut_surface",
        "published_domain_artifact_surface",
        "composed_world_model_surface",
        "query_projection_surface",
        "mapping_analysis_surface",
        "mapping_record_surface",
        "mapping_report_surface",
    }
