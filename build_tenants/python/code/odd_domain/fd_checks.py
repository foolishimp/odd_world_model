# Implements: REQ-ODD-DOMAIN-BUILD-VERIFY-001
# Implements: REQ-ODD-DOMAIN-BUILD-VERIFY-002
# Implements: REQ-ODD-DOMAIN-BUILD-VERIFY-004
"""Deterministic checks for the retained odd_domain carrier slice."""

from __future__ import annotations

import argparse
import json
from dataclasses import dataclass
from pathlib import Path

from .fd_contracts import FD_EVALUATOR_CONTRACTS_BY_CLI_NAME
from .workspace_assets import assess_generated_asset_contract


@dataclass(frozen=True)
class CheckRule:
    required_assets: tuple[str, ...] = ()


CHECK_RULES: dict[str, CheckRule] = {
    FD_EVALUATOR_CONTRACTS_BY_CLI_NAME["source-observation-surface-present"].cli_name: CheckRule(
        required_assets=("source_observation_surface",),
    ),
    FD_EVALUATOR_CONTRACTS_BY_CLI_NAME["trace-surface-present"].cli_name: CheckRule(
        required_assets=("source_observation_surface", "trace_surface"),
    ),
    FD_EVALUATOR_CONTRACTS_BY_CLI_NAME["assurance-surface-present"].cli_name: CheckRule(
        required_assets=("source_observation_surface", "trace_surface", "assurance_surface"),
    ),
    FD_EVALUATOR_CONTRACTS_BY_CLI_NAME["attribute-ledger-surface-present"].cli_name: CheckRule(
        required_assets=("source_observation_surface", "trace_surface", "assurance_surface", "attribute_ledger_surface"),
    ),
    FD_EVALUATOR_CONTRACTS_BY_CLI_NAME["markov-object-cut-surface-present"].cli_name: CheckRule(
        required_assets=(
            "source_observation_surface",
            "trace_surface",
            "assurance_surface",
            "attribute_ledger_surface",
            "markov_object_cut_surface",
        ),
    ),
    FD_EVALUATOR_CONTRACTS_BY_CLI_NAME["published-domain-artifact-surface-present"].cli_name: CheckRule(
        required_assets=(
            "source_observation_surface",
            "trace_surface",
            "assurance_surface",
            "attribute_ledger_surface",
            "markov_object_cut_surface",
            "published_domain_artifact_surface",
        ),
    ),
    FD_EVALUATOR_CONTRACTS_BY_CLI_NAME["composed-world-model-surface-present"].cli_name: CheckRule(
        required_assets=("published_domain_artifact_surface", "composed_world_model_surface"),
    ),
    FD_EVALUATOR_CONTRACTS_BY_CLI_NAME["query-projection-surface-present"].cli_name: CheckRule(
        required_assets=("published_domain_artifact_surface", "composed_world_model_surface", "query_projection_surface"),
    ),
    FD_EVALUATOR_CONTRACTS_BY_CLI_NAME["mapping-analysis-surface-present"].cli_name: CheckRule(
        required_assets=("published_domain_artifact_surface", "composed_world_model_surface", "mapping_analysis_surface"),
    ),
    FD_EVALUATOR_CONTRACTS_BY_CLI_NAME["mapping-record-surface-present"].cli_name: CheckRule(
        required_assets=(
            "published_domain_artifact_surface",
            "composed_world_model_surface",
            "mapping_analysis_surface",
            "mapping_record_surface",
        ),
    ),
    FD_EVALUATOR_CONTRACTS_BY_CLI_NAME["mapping-report-surface-present"].cli_name: CheckRule(
        required_assets=(
            "published_domain_artifact_surface",
            "composed_world_model_surface",
            "mapping_analysis_surface",
            "mapping_record_surface",
            "mapping_report_surface",
        ),
    ),
}


def _check_detail(check_name: str, workspace_root: Path) -> dict[str, object]:
    assessments = [
        assess_generated_asset_contract(workspace_root, asset_id)
        for asset_id in CHECK_RULES[check_name].required_assets
    ]
    return {
        "check": check_name,
        "workspace_root": str(workspace_root),
        "asset_assessments": assessments,
    }


def _run_check(check_name: str, workspace_root: Path) -> int:
    detail = _check_detail(check_name, workspace_root)
    return 0 if all(entry["contract_satisfied"] for entry in detail["asset_assessments"]) else 1


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(prog="odd_domain.fd_checks")
    parser.add_argument("check", choices=tuple(CHECK_RULES))
    parser.add_argument("--workspace", default=".")
    parser.add_argument("--json", action="store_true")
    args = parser.parse_args(argv)

    workspace_root = Path(args.workspace).resolve()
    exit_code = _run_check(args.check, workspace_root)

    if args.json or exit_code != 0:
        print(json.dumps(_check_detail(args.check, workspace_root), indent=2))

    return exit_code


if __name__ == "__main__":
    raise SystemExit(main())
