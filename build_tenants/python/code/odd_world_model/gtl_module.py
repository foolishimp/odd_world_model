# Implements: REQ-ODD-WORLD-MODEL-ODD-CARRIER-002
# Implements: REQ-ODD-WORLD-MODEL-ODD-CARRIER-003
# Implements: REQ-ODD-WORLD-MODEL-ODD-CARRIER-004
# Implements: REQ-ODD-WORLD-MODEL-ODD-CARRIER-006
"""Published GTL module for the first live odd_world_model carrier subset."""

from __future__ import annotations

from pathlib import Path

from gtl.algebra import compose
from gtl.function_model import EnvRef, GraphFunction, RefinementBoundary
from gtl.graph import Attrs, Graph, GraphVector, Node
from gtl.module_model import Module
from gtl.operator_model import Evaluator, F_D, F_P, Operator
from gtl.work_model import ContractRef, Job, Role

from .fd_contracts import fd_binding, fd_contract
from .function_catalog import FUNCTION_CATALOG


def _asset_node(
    name: str,
    schema: str,
    *,
    kind: str,
    required_contexts: tuple[str, ...] = (),
    output_contract_refs: tuple[str, ...] = (),
) -> Node:
    return Node(
        name,
        schema=schema,
        asset_surface={
            "kind": kind,
            "required_contexts": required_contexts,
            "output_contract_refs": output_contract_refs,
        },
    )


_source_observation_surface = _asset_node(
    "source_observation_surface",
    schema="odd.asset.source_observation_surface",
    kind="source_observation_surface",
    output_contract_refs=("source_observation_surface_present",),
)
_trace_surface = _asset_node(
    "trace_surface",
    schema="odd.asset.trace_surface",
    kind="trace_surface",
    required_contexts=("source_observation_surface",),
    output_contract_refs=("trace_surface_present",),
)
_assurance_surface = _asset_node(
    "assurance_surface",
    schema="odd.asset.assurance_surface",
    kind="assurance_surface",
    required_contexts=("source_observation_surface", "trace_surface"),
    output_contract_refs=("assurance_surface_present",),
)
_attribute_ledger_surface = _asset_node(
    "attribute_ledger_surface",
    schema="odd.asset.attribute_ledger_surface",
    kind="attribute_ledger_surface",
    required_contexts=("source_observation_surface", "trace_surface", "assurance_surface"),
    output_contract_refs=("attribute_ledger_surface_present",),
)
_markov_object_cut_surface = _asset_node(
    "markov_object_cut_surface",
    schema="odd.asset.markov_object_cut_surface",
    kind="markov_object_cut_surface",
    required_contexts=("source_observation_surface", "trace_surface", "assurance_surface", "attribute_ledger_surface"),
    output_contract_refs=("markov_object_cut_surface_present",),
)
_published_domain_artifact_surface = _asset_node(
    "published_domain_artifact_surface",
    schema="odd.asset.published_domain_artifact_surface",
    kind="published_domain_artifact_surface",
    required_contexts=("source_observation_surface", "trace_surface", "assurance_surface", "attribute_ledger_surface", "markov_object_cut_surface"),
    output_contract_refs=("published_domain_artifact_surface_present",),
)
_composed_world_model_surface = _asset_node(
    "composed_world_model_surface",
    schema="odd.asset.composed_world_model_surface",
    kind="composed_world_model_surface",
    required_contexts=("published_domain_artifact_surface",),
    output_contract_refs=("composed_world_model_surface_present",),
)
_query_projection_surface = _asset_node(
    "query_projection_surface",
    schema="odd.asset.query_projection_surface",
    kind="query_projection_surface",
    required_contexts=("published_domain_artifact_surface", "composed_world_model_surface"),
    output_contract_refs=("query_projection_surface_present",),
)
_mapping_analysis_surface = _asset_node(
    "mapping_analysis_surface",
    schema="odd.asset.mapping_analysis_surface",
    kind="mapping_analysis_surface",
    required_contexts=("published_domain_artifact_surface", "composed_world_model_surface"),
    output_contract_refs=("mapping_analysis_surface_present",),
)
_mapping_record_surface = _asset_node(
    "mapping_record_surface",
    schema="odd.asset.mapping_record_surface",
    kind="mapping_record_surface",
    required_contexts=("published_domain_artifact_surface", "composed_world_model_surface", "mapping_analysis_surface"),
    output_contract_refs=("mapping_record_surface_present",),
)
_mapping_report_surface = _asset_node(
    "mapping_report_surface",
    schema="odd.asset.mapping_report_surface",
    kind="mapping_report_surface",
    required_contexts=(
        "published_domain_artifact_surface",
        "composed_world_model_surface",
        "mapping_analysis_surface",
        "mapping_record_surface",
    ),
    output_contract_refs=("mapping_report_surface_present",),
)

_ROLE_CONSTRUCTOR = Role("odd_world_model_constructor")
_builder = Operator(
    name="odd_world_model_python_builder",
    regime=F_P,
    binding="odd_world_model.python_tenant",
    tags=("odd_method", "python_tenant"),
)

def _fd_evaluator(name: str) -> Evaluator:
    contract = fd_contract(name)
    return Evaluator(
        name=contract.evaluator_name,
        regime=F_D,
        description=contract.description,
        binding=fd_binding(name),
    )


_trace_fd = _fd_evaluator("odd_world_model_fd_trace_surface")
_assurance_fd = _fd_evaluator("odd_world_model_fd_assurance_surface")
_attribute_ledger_fd = _fd_evaluator("odd_world_model_fd_attribute_ledger_surface")
_markov_object_cut_fd = _fd_evaluator("odd_world_model_fd_markov_object_cut_surface")
_published_domain_artifact_fd = _fd_evaluator("odd_world_model_fd_published_domain_artifact_surface")
_composed_world_model_fd = _fd_evaluator("odd_world_model_fd_composed_world_model_surface")
_query_projection_fd = _fd_evaluator("odd_world_model_fd_query_projection_surface")
_mapping_analysis_fd = _fd_evaluator("odd_world_model_fd_mapping_analysis_surface")
_mapping_record_fd = _fd_evaluator("odd_world_model_fd_mapping_record_surface")
_mapping_report_fd = _fd_evaluator("odd_world_model_fd_mapping_report_surface")
_constructor_fp = Evaluator(
    name="odd_world_model_fp_semantic_constructor",
    regime=F_P,
    description="Primary constructive evaluator for the retained odd_world_model GTL carrier.",
)


def _leaf_graph_function(
    *,
    name: str,
    intent: str,
    source: Node | tuple[Node, ...],
    target: Node,
    requires: tuple[Node, ...],
    provides: tuple[Node, ...],
    carries: tuple[Node, ...],
    evaluators: tuple[Evaluator, ...],
    function_kind: str = "carrier",
) -> GraphFunction:
    inputs = source if isinstance(source, tuple) else (source,)
    effective_carries = tuple(dict.fromkeys((*carries, *provides)))
    vector = GraphVector(
        name=name,
        source=source,
        target=target,
        evaluators=evaluators,
        operators=(_builder,),
        declarations=Attrs(
            entries=(
                ("function_kind", function_kind),
                ("selection_visible", False),
            )
        ),
        tags=("odd_world_model", "odd_method"),
    )
    graph = Graph(
        name=name,
        inputs=inputs,
        outputs=(target,),
        nodes=tuple((*inputs, target)),
        vectors=(vector,),
        tags=("odd_world_model", "odd_method"),
    )
    return GraphFunction.from_graph(
        name=name,
        graph=graph,
        environment=EnvRef(requires=requires, provides=provides, carries=effective_carries),
        declarations=Attrs(
            entries=(
                ("function_kind", function_kind),
                ("selection_visible", False),
            )
        ),
        tags=("odd_world_model", "odd_method"),
    )


GF_TRACE_SOURCE_OBSERVATIONS = _leaf_graph_function(
    name="trace_source_observations",
    intent="Derive the trace surface from the retained source-observation surface.",
    source=_source_observation_surface,
    target=_trace_surface,
    requires=(_source_observation_surface,),
    provides=(_trace_surface,),
    carries=(_source_observation_surface,),
    evaluators=(_trace_fd, _constructor_fp),
)
GF_ASSURE_ATTRIBUTE_CLAIMS = _leaf_graph_function(
    name="assure_attribute_claims",
    intent="Derive the assurance surface from source observations and trace records.",
    source=(_source_observation_surface, _trace_surface),
    target=_assurance_surface,
    requires=(_source_observation_surface, _trace_surface),
    provides=(_assurance_surface,),
    carries=(_source_observation_surface, _trace_surface),
    evaluators=(_assurance_fd, _constructor_fp),
)
GF_MATERIALIZE_ATTRIBUTE_LEDGER = _leaf_graph_function(
    name="materialize_attribute_ledger",
    intent="Materialize the attribute ledger from source, trace, and assurance surfaces.",
    source=(_source_observation_surface, _trace_surface, _assurance_surface),
    target=_attribute_ledger_surface,
    requires=(_source_observation_surface, _trace_surface, _assurance_surface),
    provides=(_attribute_ledger_surface,),
    carries=(_source_observation_surface, _trace_surface, _assurance_surface),
    evaluators=(_attribute_ledger_fd, _constructor_fp),
)
GF_PROJECT_MARKOV_OBJECT_CUT = _leaf_graph_function(
    name="project_markov_object_cut",
    intent="Project immutable Markov object cuts from the retained attribute ledger.",
    source=(_source_observation_surface, _trace_surface, _assurance_surface, _attribute_ledger_surface),
    target=_markov_object_cut_surface,
    requires=(_source_observation_surface, _trace_surface, _assurance_surface, _attribute_ledger_surface),
    provides=(_markov_object_cut_surface,),
    carries=(_source_observation_surface, _trace_surface, _assurance_surface, _attribute_ledger_surface),
    evaluators=(_markov_object_cut_fd, _constructor_fp),
)
GF_PUBLISH_DOMAIN_ARTIFACT = _leaf_graph_function(
    name="publish_domain_artifact",
    intent="Publish the retained bounded domain artifact from source, ledger, and object-cut surfaces.",
    source=(
        _source_observation_surface,
        _trace_surface,
        _assurance_surface,
        _attribute_ledger_surface,
        _markov_object_cut_surface,
    ),
    target=_published_domain_artifact_surface,
    requires=(
        _source_observation_surface,
        _trace_surface,
        _assurance_surface,
        _attribute_ledger_surface,
        _markov_object_cut_surface,
    ),
    provides=(_published_domain_artifact_surface,),
    carries=(
        _source_observation_surface,
        _trace_surface,
        _assurance_surface,
        _attribute_ledger_surface,
        _markov_object_cut_surface,
    ),
    evaluators=(_published_domain_artifact_fd, _constructor_fp),
)
GF_COMPOSE_WORLD_MODEL = _leaf_graph_function(
    name="compose_world_model",
    intent="Compose a higher-order world-model surface from retained published domain artifacts.",
    source=_published_domain_artifact_surface,
    target=_composed_world_model_surface,
    requires=(_published_domain_artifact_surface,),
    provides=(_composed_world_model_surface,),
    carries=(_published_domain_artifact_surface,),
    evaluators=(_composed_world_model_fd, _constructor_fp),
)
GF_PROJECT_QUERY_SURFACE = _leaf_graph_function(
    name="project_query_surface",
    intent="Project the current query/report surface from published artifacts and composed world models.",
    source=(_published_domain_artifact_surface, _composed_world_model_surface),
    target=_query_projection_surface,
    requires=(_published_domain_artifact_surface, _composed_world_model_surface),
    provides=(_query_projection_surface,),
    carries=(_published_domain_artifact_surface, _composed_world_model_surface),
    evaluators=(_query_projection_fd, _constructor_fp),
)
GF_ANALYZE_DOMAIN_MAPPING = _leaf_graph_function(
    name="analyze_domain_mapping",
    intent="Analyze retained correspondence over published domains and composed world models.",
    source=(_published_domain_artifact_surface, _composed_world_model_surface),
    target=_mapping_analysis_surface,
    requires=(_published_domain_artifact_surface, _composed_world_model_surface),
    provides=(_mapping_analysis_surface,),
    carries=(_published_domain_artifact_surface, _composed_world_model_surface),
    evaluators=(_mapping_analysis_fd, _constructor_fp),
)
GF_PUBLISH_MAPPING_RECORD = _leaf_graph_function(
    name="publish_mapping_record",
    intent="Publish the retained durable mapping record from mapping analysis over published domains.",
    source=(_published_domain_artifact_surface, _composed_world_model_surface, _mapping_analysis_surface),
    target=_mapping_record_surface,
    requires=(_published_domain_artifact_surface, _composed_world_model_surface, _mapping_analysis_surface),
    provides=(_mapping_record_surface,),
    carries=(_published_domain_artifact_surface, _composed_world_model_surface, _mapping_analysis_surface),
    evaluators=(_mapping_record_fd, _constructor_fp),
)
GF_PROJECT_MAPPING_REPORT = _leaf_graph_function(
    name="project_mapping_report",
    intent="Project the retained human mapping report from mapping record and analysis surfaces.",
    source=(
        _published_domain_artifact_surface,
        _composed_world_model_surface,
        _mapping_analysis_surface,
        _mapping_record_surface,
    ),
    target=_mapping_report_surface,
    requires=(
        _published_domain_artifact_surface,
        _composed_world_model_surface,
        _mapping_analysis_surface,
        _mapping_record_surface,
    ),
    provides=(_mapping_report_surface,),
    carries=(
        _published_domain_artifact_surface,
        _composed_world_model_surface,
        _mapping_analysis_surface,
        _mapping_record_surface,
    ),
    evaluators=(_mapping_report_fd, _constructor_fp),
)


def _executive_graph_function(*, name: str, intent: str, functions: tuple[GraphFunction, ...]) -> GraphFunction:
    executive = compose(*functions)
    return GraphFunction.from_graph(
        name=name,
        graph=executive.materialize(),
        environment=executive.environment,
        declarations=Attrs(
            entries=(
                ("intent", intent),
                ("function_kind", "executive"),
            )
        ),
        tags=("odd_world_model", "odd_method", "executive"),
    )


GF_BUILD_ATTRIBUTE_LEDGER_DOMAIN_ARTIFACT = _executive_graph_function(
    name="build_attribute_ledger_domain_artifact",
    intent="Public executive carrier for the retained source-to-published-domain-artifact build line.",
    functions=(
        GF_TRACE_SOURCE_OBSERVATIONS,
        GF_ASSURE_ATTRIBUTE_CLAIMS,
        GF_MATERIALIZE_ATTRIBUTE_LEDGER,
        GF_PROJECT_MARKOV_OBJECT_CUT,
        GF_PUBLISH_DOMAIN_ARTIFACT,
    ),
)
GF_BUILD_AND_QUERY_WORLD_MODEL = _executive_graph_function(
    name="build_and_query_world_model",
    intent="Public executive carrier for the retained build, composition, and query-projection line.",
    functions=(
        GF_TRACE_SOURCE_OBSERVATIONS,
        GF_ASSURE_ATTRIBUTE_CLAIMS,
        GF_MATERIALIZE_ATTRIBUTE_LEDGER,
        GF_PROJECT_MARKOV_OBJECT_CUT,
        GF_PUBLISH_DOMAIN_ARTIFACT,
        GF_COMPOSE_WORLD_MODEL,
        GF_PROJECT_QUERY_SURFACE,
    ),
)
GF_BUILD_MAPPING_ASSETS = _executive_graph_function(
    name="build_mapping_assets",
    intent="Public executive carrier for retained governed mapping over published domains.",
    functions=(
        GF_COMPOSE_WORLD_MODEL,
        GF_ANALYZE_DOMAIN_MAPPING,
        GF_PUBLISH_MAPPING_RECORD,
        GF_PROJECT_MAPPING_REPORT,
    ),
)


LEAF_GRAPH_FUNCTIONS = (
    GF_TRACE_SOURCE_OBSERVATIONS,
    GF_ASSURE_ATTRIBUTE_CLAIMS,
    GF_MATERIALIZE_ATTRIBUTE_LEDGER,
    GF_PROJECT_MARKOV_OBJECT_CUT,
    GF_PUBLISH_DOMAIN_ARTIFACT,
    GF_COMPOSE_WORLD_MODEL,
    GF_PROJECT_QUERY_SURFACE,
    GF_ANALYZE_DOMAIN_MAPPING,
    GF_PUBLISH_MAPPING_RECORD,
    GF_PROJECT_MAPPING_REPORT,
)
EXECUTIVE_GRAPH_FUNCTIONS = (
    GF_BUILD_AND_QUERY_WORLD_MODEL,
    GF_BUILD_MAPPING_ASSETS,
)


def _job(name: str, graph_function: GraphFunction) -> Job:
    return Job(
        name=name,
        contracts=(ContractRef(kind="graph_function", target_id=graph_function.id),),
        roles=(_ROLE_CONSTRUCTOR,),
        tags=("odd_world_model", "odd_method"),
    )


def _module_workspace_root() -> Path:
    return Path(__file__).resolve().parents[5]


def _build_module(workspace_root: Path) -> Module:
    graph_functions = (*EXECUTIVE_GRAPH_FUNCTIONS, *LEAF_GRAPH_FUNCTIONS)
    refinement_vectors_by_name = {}
    for function in graph_functions:
        graph = function.template.graph
        if graph is None:
            continue
        for vector in graph.vectors:
            refinement_vectors_by_name.setdefault(vector.name, vector)

    return Module(
        name="odd_world_model",
        graphs=tuple(
            function.template.graph
            for function in graph_functions
            if function.template.graph is not None
        ),
        graph_functions=tuple(graph_functions),
        refinement_boundaries=tuple(
            RefinementBoundary(
                name=vector.name,
                inputs=vector.source if isinstance(vector.source, tuple) else (vector.source,),
                outputs=(vector.target,),
                hints=Attrs(entries=(("terminal", True),)),
            )
            for vector in refinement_vectors_by_name.values()
        ),
        jobs=(
            _job("build_and_query_world_model_job", GF_BUILD_AND_QUERY_WORLD_MODEL),
            _job("build_mapping_assets_job", GF_BUILD_MAPPING_ASSETS),
        ),
        roles=(_ROLE_CONSTRUCTOR,),
        operators=(_builder,),
        evaluators=(
            _trace_fd,
            _assurance_fd,
            _attribute_ledger_fd,
            _markov_object_cut_fd,
            _published_domain_artifact_fd,
            _composed_world_model_fd,
            _query_projection_fd,
            _mapping_analysis_fd,
            _mapping_record_fd,
            _mapping_report_fd,
            _constructor_fp,
        ),
        metadata=Attrs(
            entries=(
                (
                    "requirements",
                    (
                        "REQ-ODD-WORLD-MODEL-ODD-CARRIER-001",
                        "REQ-ODD-WORLD-MODEL-ODD-CARRIER-002",
                        "REQ-ODD-WORLD-MODEL-ODD-CARRIER-003",
                        "REQ-ODD-WORLD-MODEL-ODD-CARRIER-004",
                        "REQ-ODD-WORLD-MODEL-ODD-CARRIER-005",
                        "REQ-ODD-WORLD-MODEL-ODD-CARRIER-006",
                    ),
                ),
                ("function_catalog", tuple(entry.to_dict() for entry in FUNCTION_CATALOG)),
                ("executive_graph_function", GF_BUILD_AND_QUERY_WORLD_MODEL.name),
                ("executive_graph_functions", tuple(function.name for function in EXECUTIVE_GRAPH_FUNCTIONS)),
                ("library_graph_functions", tuple(function.name for function in LEAF_GRAPH_FUNCTIONS)),
                ("domain_package", "odd_world_model"),
                ("workspace_root", str(workspace_root)),
            )
        ),
    )


MODULE = _build_module(_module_workspace_root())


def module(workspace_root: Path | str | None = None) -> Module:
    if workspace_root is None:
        return MODULE
    return _build_module(Path(workspace_root).resolve())
