# Validates: REQ-ODD-DOMAIN-MAPPING-CAP-001
# Validates: REQ-ODD-DOMAIN-MAPPING-CAP-002
# Validates: REQ-ODD-DOMAIN-MAPPING-CAP-003
# Validates: REQ-ODD-DOMAIN-MAPPING-CAP-004
# Validates: REQ-ODD-DOMAIN-MAPPING-CAP-005
# Validates: REQ-ODD-DOMAIN-MAPPING-CAP-006
# Validates: REQ-ODD-DOMAIN-MAPPING-CAP-007
# Validates: REQ-ODD-DOMAIN-MAPPING-CONSTRAINT-001
# Validates: REQ-ODD-DOMAIN-MAPPING-CONSTRAINT-002
# Validates: REQ-ODD-DOMAIN-MAPPING-CONSTRAINT-003
# Validates: REQ-ODD-DOMAIN-MAPPING-CONSTRAINT-004
# Validates: REQ-ODD-DOMAIN-MAPPING-CONSTRAINT-005
# Validates: REQ-ODD-DOMAIN-MAPPING-CONSTRAINT-006
from __future__ import annotations

import json
from pathlib import Path

from odd_domain.constructor import construct_manifest
from odd_domain.mapping.trade_to_apra import analysis_path, build, record_path, report_path
from odd_domain.world_model.load import load_json


def test_mapping_line_materializes_governed_analysis_record_and_report() -> None:
    build()

    analysis = load_json(analysis_path())
    record = load_json(record_path())
    report = report_path().read_text(encoding="utf-8")

    assert analysis["schema_kind"] == "odd_domain.mapping_analysis"
    assert record["schema_kind"] == "odd_domain.mapping_record"
    assert record["mapping_record_id"].startswith("odd_domain.")
    assert analysis["source_fragment_ref"] == record["source_fragment_ref"]
    assert analysis["target_fragment_ref"] == record["target_fragment_ref"]

    assert {entry["source_claim_key"] for entry in record["attribute_mappings"]} == {
        "party_a_reference",
        "master_agreement_reference",
        "product_reference",
    }
    assert record["category_breakdown"] == {
        "derived_mapping": 1,
        "treatment_projection": 2,
    }
    assert record["confidence_breakdown"] == {
        "moderate": 1,
        "strong": 2,
    }
    assert {entry["claim_key"] for entry in record["unassigned_source_attributes"]} == {
        "party_b_reference",
        "trade_date",
        "trade_identifier",
    }
    assert {entry["claim_key"] for entry in record["unassigned_target_attributes"]} == {
        "reporting_lifecycle_state",
    }

    assert "Trade To APRA Mapping Report" in report
    assert "`party_a_reference` -> `counterparty_bucket`" in report
    assert "`product_reference` -> `liquidity_bucket`" in report


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
                    {"name": "odd_domain_fd_mapping_report_surface"},
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
