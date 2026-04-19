# Validates: REQ-ODD-WORLD-MODEL-BUILD-CAP-005
# Validates: REQ-ODD-WORLD-MODEL-BUILD-CONSTRAINT-005
# Validates: REQ-ODD-WORLD-MODEL-BUILD-VERIFY-001
# Validates: REQ-ODD-WORLD-MODEL-BUILD-VERIFY-002
# Validates: REQ-ODD-WORLD-MODEL-BUILD-VERIFY-003
# Validates: REQ-ODD-WORLD-MODEL-WORLD-OBJECT-005
# Validates: REQ-ODD-WORLD-MODEL-WORLD-OBJECT-006
from __future__ import annotations

from odd_world_model.proof.trade_to_apra import build as build_proof
from odd_world_model.proof.trade_to_apra import proof_root
from odd_world_model.query.trade_to_apra import build as build_query
from odd_world_model.query.trade_to_apra import query_root
from odd_world_model.world_model.load import load_json


def test_query_projection_supports_reverse_recoverability() -> None:
    build_query()

    summary = load_json(query_root() / "trade_to_apra_query_summary.json")
    explainability = summary["explainability"]
    first_trace = explainability["path"]["trace_records"][0]

    assert summary["lane"] == "filesystem_first"
    assert explainability["path"]["ledger_entry_ref"]
    assert explainability["path"]["assurance_record_ref"]
    assert explainability["path"]["trace_records"]
    assert first_trace["trace_record_ref"]
    assert first_trace["source_ref"]
    assert explainability["authority_basis"]


def test_proof_outputs_share_governed_semantic_basis() -> None:
    build_proof()

    summary = load_json(proof_root() / "proof_summary.json")
    outputs = summary["outputs"]

    assert summary["treatment_ref"].startswith("odd_world_model.")
    assert summary["covariance_edge_ref"].startswith("odd_world_model.")
    assert summary["adjoint_mapping_ref"].startswith("odd_world_model.")
    assert set(outputs) == {
        "mapping_document",
        "dbt_model",
        "covariant_transform",
        "comparison_report",
    }
