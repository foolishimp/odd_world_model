# Implements: REQ-ODD-WORLD-MODEL-ODD-CARRIER-002
# Implements: REQ-ODD-WORLD-MODEL-ODD-CARRIER-003
"""Named function catalog for the retained odd_world_model GTL carrier subset."""

from __future__ import annotations

from .domain_model import ExecutiveProgramEntry, FunctionCatalogEntry


FUNCTION_CATALOG: tuple[FunctionCatalogEntry, ...] = (
    FunctionCatalogEntry(
        name="trace_source_observations",
        intent="Derive the trace surface from the retained source-observation surface.",
        inputs=("source_observation_surface",),
        outputs=("trace_surface",),
        backing_graph_function="trace_source_observations",
    ),
    FunctionCatalogEntry(
        name="assure_attribute_claims",
        intent="Derive the assurance surface from traced source observations.",
        inputs=("source_observation_surface", "trace_surface"),
        outputs=("assurance_surface",),
        backing_graph_function="assure_attribute_claims",
    ),
    FunctionCatalogEntry(
        name="materialize_attribute_ledger",
        intent="Materialize the attribute-ledger surface from traced and assured claim surfaces.",
        inputs=("source_observation_surface", "trace_surface", "assurance_surface"),
        outputs=("attribute_ledger_surface",),
        backing_graph_function="materialize_attribute_ledger",
    ),
    FunctionCatalogEntry(
        name="project_markov_object_cut",
        intent="Project immutable Markov object cuts from the retained attribute-ledger surface.",
        inputs=("source_observation_surface", "trace_surface", "assurance_surface", "attribute_ledger_surface"),
        outputs=("markov_object_cut_surface",),
        backing_graph_function="project_markov_object_cut",
    ),
    FunctionCatalogEntry(
        name="publish_domain_artifact",
        intent="Publish the retained bounded domain artifact from source, ledger, and object-cut surfaces.",
        inputs=("source_observation_surface", "trace_surface", "assurance_surface", "attribute_ledger_surface", "markov_object_cut_surface"),
        outputs=("published_domain_artifact_surface",),
        backing_graph_function="publish_domain_artifact",
    ),
    FunctionCatalogEntry(
        name="compose_world_model",
        intent="Compose a higher-order world-model surface by reference-preserving composition over published domain artifacts.",
        inputs=("published_domain_artifact_surface",),
        outputs=("composed_world_model_surface",),
        backing_graph_function="compose_world_model",
    ),
    FunctionCatalogEntry(
        name="project_query_surface",
        intent="Project the current query/report surface over retained published assets and constructive history.",
        inputs=("published_domain_artifact_surface", "composed_world_model_surface"),
        outputs=("query_projection_surface",),
        backing_graph_function="project_query_surface",
    ),
    FunctionCatalogEntry(
        name="analyze_domain_mapping",
        intent="Analyze correspondence over retained published domains and composed world models.",
        inputs=("published_domain_artifact_surface", "composed_world_model_surface"),
        outputs=("mapping_analysis_surface",),
        backing_graph_function="analyze_domain_mapping",
    ),
    FunctionCatalogEntry(
        name="publish_mapping_record",
        intent="Publish the durable mapping record from the retained mapping-analysis surface.",
        inputs=("published_domain_artifact_surface", "composed_world_model_surface", "mapping_analysis_surface"),
        outputs=("mapping_record_surface",),
        backing_graph_function="publish_mapping_record",
    ),
    FunctionCatalogEntry(
        name="project_mapping_report",
        intent="Project the human mapping report from the retained mapping record and analysis surfaces.",
        inputs=(
            "published_domain_artifact_surface",
            "composed_world_model_surface",
            "mapping_analysis_surface",
            "mapping_record_surface",
        ),
        outputs=("mapping_report_surface",),
        backing_graph_function="project_mapping_report",
    ),
    FunctionCatalogEntry(
        name="build_attribute_ledger_domain_artifact",
        intent="Public executive carrier for the retained source-to-published-domain-artifact build line.",
        inputs=("source_observation_surface",),
        outputs=("published_domain_artifact_surface",),
        backing_graph_function="build_attribute_ledger_domain_artifact",
    ),
    FunctionCatalogEntry(
        name="build_and_query_world_model",
        intent="Public executive carrier for the retained build, composition, and current query-projection line.",
        inputs=("source_observation_surface",),
        outputs=("query_projection_surface",),
        backing_graph_function="build_and_query_world_model",
    ),
    FunctionCatalogEntry(
        name="build_mapping_assets",
        intent="Public executive carrier for retained governed mapping over published domains.",
        inputs=("published_domain_artifact_surface",),
        outputs=("mapping_report_surface",),
        backing_graph_function="build_mapping_assets",
    ),
)


PROGRAM_CATALOG: tuple[ExecutiveProgramEntry, ...] = (
    ExecutiveProgramEntry(
        name="build_attribute_ledger_domain_artifact",
        intent="Build the retained domain artifact from source observation through attribute ledger and object-cut publication.",
        steps=(
            "trace_source_observations",
            "assure_attribute_claims",
            "materialize_attribute_ledger",
            "project_markov_object_cut",
            "publish_domain_artifact",
        ),
        outputs=("published_domain_artifact_surface",),
    ),
    ExecutiveProgramEntry(
        name="build_and_query_world_model",
        intent="Build, compose, and project the current odd_world_model query surface from the retained source observation line.",
        steps=(
            "trace_source_observations",
            "assure_attribute_claims",
            "materialize_attribute_ledger",
            "project_markov_object_cut",
            "publish_domain_artifact",
            "compose_world_model",
            "project_query_surface",
        ),
        outputs=("query_projection_surface",),
    ),
    ExecutiveProgramEntry(
        name="build_mapping_assets",
        intent="Compose the retained world-model line and publish governed mapping assets over the published domains.",
        steps=(
            "compose_world_model",
            "analyze_domain_mapping",
            "publish_mapping_record",
            "project_mapping_report",
        ),
        outputs=("mapping_report_surface",),
    ),
)

ACTIVE_PROGRAM_NAMES: tuple[str, ...] = (
    "build_and_query_world_model",
)


def active_programs() -> tuple[ExecutiveProgramEntry, ...]:
    return tuple(entry for entry in PROGRAM_CATALOG if entry.name in ACTIVE_PROGRAM_NAMES)


def program_by_name(name: str) -> ExecutiveProgramEntry:
    for entry in PROGRAM_CATALOG:
        if entry.name == name:
            return entry
    raise ValueError(f"Unknown executive program {name!r}")
