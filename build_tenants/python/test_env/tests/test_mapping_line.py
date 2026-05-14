# Validates: REQ-ODD-WORLD-MODEL-MAPPING-CAP-001
# Validates: REQ-ODD-WORLD-MODEL-MAPPING-CAP-002
# Validates: REQ-ODD-WORLD-MODEL-MAPPING-CAP-003
# Validates: REQ-ODD-WORLD-MODEL-MAPPING-CAP-004
# Validates: REQ-ODD-WORLD-MODEL-MAPPING-CAP-005
# Validates: REQ-ODD-WORLD-MODEL-MAPPING-CAP-006
# Validates: REQ-ODD-WORLD-MODEL-MAPPING-CAP-007
# Validates: REQ-ODD-WORLD-MODEL-MAPPING-CAP-008
# Validates: REQ-ODD-WORLD-MODEL-MAPPING-CAP-009
# Validates: REQ-ODD-WORLD-MODEL-MAPPING-CAP-010
# Validates: REQ-ODD-WORLD-MODEL-MAPPING-CONSTRAINT-001
# Validates: REQ-ODD-WORLD-MODEL-MAPPING-CONSTRAINT-002
# Validates: REQ-ODD-WORLD-MODEL-MAPPING-CONSTRAINT-003
# Validates: REQ-ODD-WORLD-MODEL-MAPPING-CONSTRAINT-004
# Validates: REQ-ODD-WORLD-MODEL-MAPPING-CONSTRAINT-005
# Validates: REQ-ODD-WORLD-MODEL-MAPPING-CONSTRAINT-006
# Validates: REQ-ODD-WORLD-MODEL-MAPPING-CONSTRAINT-007
# Validates: REQ-ODD-WORLD-MODEL-MAPPING-CONSTRAINT-008
from __future__ import annotations

import json
from pathlib import Path

from odd_world_model.constructor import construct_manifest
from odd_world_model.mapping.four_domain_topology import analysis_path, build, record_path, report_path
from odd_world_model.world_model.load import load_json


def test_mapping_line_materializes_topology_aware_analysis_record_and_report() -> None:
    build()

    analysis = load_json(analysis_path())
    record = load_json(record_path())
    report = report_path().read_text(encoding="utf-8")

    assert analysis["schema_kind"] == "odd_world_model.mapping_analysis"
    assert record["schema_kind"] == "odd_world_model.mapping_record"
    assert record["mapping_record_id"].startswith("odd_world_model.")
    assert len(analysis["domains_in_scope"]) == 4
    assert "boundary adjacency and composition" in analysis["matcher_signals"]
    assert "treatment, covariance, and adjoint support" in analysis["matcher_signals"]
    assert {domain["example_name"] for domain in analysis["domains_in_scope"]} == {
        "trade_source_model",
        "trade_representation_model",
        "apra_liquidity_model",
        "banking_product_model",
    }

    object_mapping_ids = {entry["mapping_id"] for entry in record["object_mappings"]}
    assert any("trade_source_model.to.trade_representation_model" in item for item in object_mapping_ids)
    assert any("trade_representation_model.to.apra_liquidity_model" in item for item in object_mapping_ids)

    concept_ids = {entry["concept_id"] for entry in record["higher_order_concepts"]}
    assert "odd_world_model.concept.four_domain.financial_product_surface.v1" in concept_ids
    assert "odd_world_model.concept.four_domain.trade_lifecycle_surface.v1" in concept_ids

    product_concept = next(
        entry
        for entry in record["higher_order_concepts"]
        if entry["concept_id"] == "odd_world_model.concept.four_domain.financial_product_surface.v1"
    )
    assert len(product_concept["domain_refs"]) == 4
    assert "shared topology-aware concept tags across published domains" in product_concept["inference_basis"]

    boundary_kinds = {entry["boundary_kind"] for entry in record["boundary_candidates"]}
    assert {"hierarchical", "intersectional"}.issubset(boundary_kinds)
    product_boundary = next(
        entry
        for entry in record["boundary_candidates"]
        if entry["boundary_id"] == "odd_world_model.boundary_candidate.four_domain.financial_product_surface.v1"
    )
    assert product_boundary["parent_boundary_refs"] == [
        "odd_world_model.boundary_candidate.four_domain.financial_instrument_envelope.v1"
    ]
    assert product_boundary["overlap_boundary_refs"]
    assert "mapping_mode" in record

    assert "Four-Domain Topology Mapping Report" in report
    assert "Higher-Order Concepts" in report
    assert "Boundary Candidates" in report


def test_constructor_can_materialize_mapping_report_surface(tmp_path: Path) -> None:
    manifest_path = tmp_path / "mapping_manifest.json"
    result_path = tmp_path / "mapping_result.json"
    manifest_path.write_text(
        json.dumps(
            {
                "edge": "project_mapping_report",
                "target_asset": "mapping_report_surface",
                "result_path": str(result_path),
                "failing_evaluators": [
                    {"name": "odd_world_model_fd_mapping_report_surface"},
                ],
            },
            indent=2,
        ),
        encoding="utf-8",
    )

    result = construct_manifest(manifest_path, workspace_root=".")

    assert result["status"] == "constructed"
    assert result["target_asset"] == "mapping_report_surface"
    assert result_path.exists()
    assert report_path().exists()
