# Implements: REQ-ODD-WORLD-MODEL-BUILD-CONSTRAINT-001
# Implements: REQ-ODD-WORLD-MODEL-BUILD-VERIFY-001
"""Deterministic evaluator contracts for the retained odd_world_model carrier slice."""

from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class FdEvaluatorContract:
    evaluator_name: str
    cli_name: str
    description: str


FD_EVALUATOR_CONTRACTS: dict[str, FdEvaluatorContract] = {
    "odd_world_model_fd_source_observation": FdEvaluatorContract(
        evaluator_name="odd_world_model_fd_source_observation",
        cli_name="source-observation-surface-present",
        description="The retained source-observation surface is present for the current workspace.",
    ),
    "odd_world_model_fd_trace_surface": FdEvaluatorContract(
        evaluator_name="odd_world_model_fd_trace_surface",
        cli_name="trace-surface-present",
        description="The retained trace surface is present and materially grounded in source observation.",
    ),
    "odd_world_model_fd_assurance_surface": FdEvaluatorContract(
        evaluator_name="odd_world_model_fd_assurance_surface",
        cli_name="assurance-surface-present",
        description="The retained assurance surface is present over the current source and trace surfaces.",
    ),
    "odd_world_model_fd_attribute_ledger_surface": FdEvaluatorContract(
        evaluator_name="odd_world_model_fd_attribute_ledger_surface",
        cli_name="attribute-ledger-surface-present",
        description="The retained attribute-ledger surface is present over the current source, trace, and assurance surfaces.",
    ),
    "odd_world_model_fd_markov_object_cut_surface": FdEvaluatorContract(
        evaluator_name="odd_world_model_fd_markov_object_cut_surface",
        cli_name="markov-object-cut-surface-present",
        description="The retained Markov object-cut surface is present over the current attributed ledger state.",
    ),
    "odd_world_model_fd_published_domain_artifact_surface": FdEvaluatorContract(
        evaluator_name="odd_world_model_fd_published_domain_artifact_surface",
        cli_name="published-domain-artifact-surface-present",
        description="The retained published domain artifact surface is present for the current build line.",
    ),
    "odd_world_model_fd_composed_world_model_surface": FdEvaluatorContract(
        evaluator_name="odd_world_model_fd_composed_world_model_surface",
        cli_name="composed-world-model-surface-present",
        description="The retained composed world-model surface is present over published domain artifacts.",
    ),
    "odd_world_model_fd_query_projection_surface": FdEvaluatorContract(
        evaluator_name="odd_world_model_fd_query_projection_surface",
        cli_name="query-projection-surface-present",
        description="The retained query projection surface is present over the current constructive history.",
    ),
    "odd_world_model_fd_mapping_analysis_surface": FdEvaluatorContract(
        evaluator_name="odd_world_model_fd_mapping_analysis_surface",
        cli_name="mapping-analysis-surface-present",
        description="The retained mapping-analysis surface is present over the current published-domain correspondence line.",
    ),
    "odd_world_model_fd_mapping_record_surface": FdEvaluatorContract(
        evaluator_name="odd_world_model_fd_mapping_record_surface",
        cli_name="mapping-record-surface-present",
        description="The retained durable mapping-record surface is present over the current published-domain correspondence line.",
    ),
    "odd_world_model_fd_mapping_report_surface": FdEvaluatorContract(
        evaluator_name="odd_world_model_fd_mapping_report_surface",
        cli_name="mapping-report-surface-present",
        description="The retained mapping-report projection is present over the current governed mapping record.",
    ),
}

FD_EVALUATOR_CONTRACTS_BY_CLI_NAME: dict[str, FdEvaluatorContract] = {
    contract.cli_name: contract for contract in FD_EVALUATOR_CONTRACTS.values()
}


def fd_contract(evaluator_name: str) -> FdEvaluatorContract:
    return FD_EVALUATOR_CONTRACTS[evaluator_name]


def fd_contract_from_cli(cli_name: str) -> FdEvaluatorContract:
    return FD_EVALUATOR_CONTRACTS_BY_CLI_NAME[cli_name]


def fd_cli_name(evaluator_name: str) -> str:
    return fd_contract(evaluator_name).cli_name


def fd_binding(evaluator_name: str) -> str:
    return f"exec://python -m odd_world_model.fd_checks {fd_cli_name(evaluator_name)} --workspace ."
