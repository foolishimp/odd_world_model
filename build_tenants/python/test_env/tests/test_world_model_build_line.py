# Validates: REQ-ODD-WORLD-MODEL-BUILD-CAP-001
# Validates: REQ-ODD-WORLD-MODEL-BUILD-CAP-002
# Validates: REQ-ODD-WORLD-MODEL-BUILD-CAP-003
# Validates: REQ-ODD-WORLD-MODEL-BUILD-CAP-004
# Validates: REQ-ODD-WORLD-MODEL-BUILD-CAP-006
# Validates: REQ-ODD-WORLD-MODEL-BUILD-CONSTRAINT-002
# Validates: REQ-ODD-WORLD-MODEL-BUILD-CONSTRAINT-003
# Validates: REQ-ODD-WORLD-MODEL-BUILD-CONSTRAINT-004
# Validates: REQ-ODD-WORLD-MODEL-WORLD-OBJECT-001
# Validates: REQ-ODD-WORLD-MODEL-WORLD-OBJECT-002
# Validates: REQ-ODD-WORLD-MODEL-WORLD-OBJECT-003
# Validates: REQ-ODD-WORLD-MODEL-WORLD-OBJECT-004
# Validates: REQ-ODD-WORLD-MODEL-WORLD-OBJECT-007
# Validates: REQ-ODD-WORLD-MODEL-WORLD-OBJECT-008
# Validates: REQ-ODD-WORLD-MODEL-WORLD-OBJECT-009
# Validates: REQ-ODD-WORLD-MODEL-WORLD-OBJECT-010
# Validates: REQ-ODD-WORLD-MODEL-WORLD-OBJECT-011
# Validates: REQ-ODD-WORLD-MODEL-WORLD-OBJECT-012
from __future__ import annotations

from odd_world_model.build_line.fpml_trade_domain import (
    build as build_trade_domain,
    published_root as trade_published_root,
    review_root as trade_review_root,
)
from odd_world_model.build_line.trade_to_apra import (
    build as build_trade_to_apra,
    published_root as sandbox_published_root,
)
from odd_world_model.world_model.load import load_json
from odd_world_model.world_model.validate import validate_tree


def test_trade_domain_build_materializes_trace_assurance_ledger_and_object_cuts() -> None:
    build_trade_domain()

    results = validate_tree(trade_published_root())
    assert results
    assert all(result.valid for result in results)

    trade_object = load_json(trade_published_root() / "objects" / "trade_contract_state.json")
    assert trade_object["object_id"].startswith("odd_world_model.")
    assert trade_object["blanket"]["adjacent_domains"] == ["apra_liquidity.reporting"]
    assert trade_object["materialization"]["attribute_ledger_entry_refs"]
    assert trade_object["materialization"]["assurance_record_refs"]
    assert trade_object["materialization"]["trace_record_refs"]

    assert (trade_review_root() / "traces").exists()
    assert (trade_review_root() / "assurance").exists()


def test_trade_to_apra_build_preserves_composition_and_reference_semantics() -> None:
    build_trade_to_apra()

    results = validate_tree(sandbox_published_root())
    assert results
    assert all(result.valid for result in results)

    apra_root = sandbox_published_root() / "apra_liquidity_domain"
    reporting_position = load_json(apra_root / "objects" / "reporting_position.json")
    reference_artifact = load_json(
        apra_root / "reference_artifacts" / "apra_counterparty_bucket_reference_set_v1.json"
    )

    assert reporting_position["object_id"].startswith("odd_world_model.")
    assert reporting_position["cross_domain"]["treatment_refs"]
    assert reporting_position["cross_domain"]["covariance_edge_refs"]
    assert reporting_position["cross_domain"]["adjoint_mapping_refs"]
    assert reporting_position["materialization"]["attribute_ledger_entry_refs"]
    assert reporting_position["materialization"]["trace_record_refs"]
    assert reference_artifact["artifact_id"].startswith("odd_world_model.")
    assert reference_artifact["effective_period"]["effective_from"]
