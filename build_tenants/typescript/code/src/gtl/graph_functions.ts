import {
  admitGraphFunctionDeclarations,
  compose,
  constructAbgFnCompositionDeclarations,
  constructEnvRef,
  constructGraph,
  constructGraphFunction,
  constructGraphVector,
  constructTemplateRef,
  emptyGraphFunctionDeclarations,
  emptySerializedAttrs,
  graphVectorDeclarations,
  type GraphFunction,
  type Node,
  type Regime,
  type SerializedAttrs
} from "../substrate_binding/rc3_api.ts";
import {
  domainPublicationAssets,
  publicFunctionAssets,
  sharedEnvironmentNodes
} from "./assets.ts";
import { graphFunctionHandlePath } from "./identifiers.ts";

export const PUBLIC_GRAPH_FUNCTION_HANDLES = Object.freeze([
  "odd_world_model.publish_domain_model",
  "odd_world_model.publish_semantic_links",
  "odd_world_model.compose_world_model",
  "odd_world_model.resolve_mesh_cut",
  "odd_world_model.project_context",
  "odd_world_model.interpret_context",
  "odd_world_model.query_world_model"
] as const);

export const PRIVATE_GRAPH_FUNCTION_HANDLES = Object.freeze([
  "odd_world_model.internal.observe_source_evidence",
  "odd_world_model.internal.construct_domain_semantics",
  "odd_world_model.internal.admit_domain_claims",
  "odd_world_model.internal.project_domain_cut",
  "odd_world_model.internal.materialize_attested_cut"
] as const);

export const DEFERRED_GRAPH_FUNCTION_HANDLES = Object.freeze([
  "odd_world_model.map_domains"
] as const);

export type PublicGraphFunctionHandle = (typeof PUBLIC_GRAPH_FUNCTION_HANDLES)[number];
export type PrivateGraphFunctionHandle = (typeof PRIVATE_GRAPH_FUNCTION_HANDLES)[number];

const COMPUTE_REGIMES_BY_HANDLE = new Map<string, readonly Regime[]>([
  [PUBLIC_GRAPH_FUNCTION_HANDLES[0], Object.freeze(["F_D", "F_P", "F_H"])],
  [PUBLIC_GRAPH_FUNCTION_HANDLES[1], Object.freeze(["F_D", "F_P", "F_H"])],
  [PUBLIC_GRAPH_FUNCTION_HANDLES[2], Object.freeze(["F_D", "F_P", "F_H"])],
  [PUBLIC_GRAPH_FUNCTION_HANDLES[3], Object.freeze(["F_D", "F_P"])],
  [PUBLIC_GRAPH_FUNCTION_HANDLES[4], Object.freeze(["F_D"])],
  [PUBLIC_GRAPH_FUNCTION_HANDLES[5], Object.freeze(["F_P", "F_D"])],
  [PUBLIC_GRAPH_FUNCTION_HANDLES[6], Object.freeze(["F_D"])],
  [PRIVATE_GRAPH_FUNCTION_HANDLES[0], Object.freeze(["F_D"])],
  [PRIVATE_GRAPH_FUNCTION_HANDLES[1], Object.freeze(["F_P", "F_D"])],
  [PRIVATE_GRAPH_FUNCTION_HANDLES[2], Object.freeze(["F_D", "F_H"])],
  [PRIVATE_GRAPH_FUNCTION_HANDLES[3], Object.freeze(["F_D"])],
  [PRIVATE_GRAPH_FUNCTION_HANDLES[4], Object.freeze(["F_D"])],
  [DEFERRED_GRAPH_FUNCTION_HANDLES[0], Object.freeze(["F_P", "F_D", "F_H"])]
]);

export function computeRegimesForHandle(handle: string): readonly Regime[] {
  const regimes = COMPUTE_REGIMES_BY_HANDLE.get(handle);
  if (regimes === undefined) throw new Error(`compute regimes are not declared for ${handle}`);
  return regimes;
}

function scalarEntry(key: string, value: string) {
  return Object.freeze({
    key,
    value: Object.freeze({ kind: "scalar" as const, value })
  });
}

function stringListEntry(key: string, value: readonly string[]) {
  return Object.freeze({
    key,
    value: Object.freeze({ kind: "string_list" as const, value: Object.freeze([...value]) })
  });
}

function compositionDeclarations(input: {
  readonly scopeRef: string;
  readonly regime: Regime;
  readonly source: readonly Node[];
  readonly target: Node;
  readonly vectorRef: string;
}): SerializedAttrs {
  const transformAuthority = input.regime === "F_P" ? "judgment" : "evidence";
  return constructAbgFnCompositionDeclarations({
    contractRef: `abg.fn_composition://${input.scopeRef}`,
    hookRef: `hook://${input.scopeRef}/compute`,
    regimes: [
      {
        bindingRef: `regime-binding://${input.scopeRef}/transform/${input.regime.toLowerCase()}`,
        stageRole: "transform",
        regime: input.regime,
        role: "construct",
        order: 0,
        authority: transformAuthority,
        inputCarrierRefs: input.source.map((node) => node.name),
        outputCarrierRefs: [input.target.name],
        evidenceRefs: [`proof://odd_world_model/${input.scopeRef}/transform`]
      },
      {
        bindingRef: `regime-binding://${input.scopeRef}/evaluate/${input.regime.toLowerCase()}`,
        stageRole: "evaluate",
        regime: input.regime,
        role: "validate",
        order: 1,
        authority: input.regime === "F_P" ? "judgment" : "closure",
        inputCarrierRefs: [input.target.name],
        outputCarrierRefs: [input.target.name],
        evidenceRefs: [`proof://odd_world_model/${input.scopeRef}/evaluate/${input.regime.toLowerCase()}`]
      },
      {
        bindingRef: `regime-binding://${input.scopeRef}/consequence/fd`,
        stageRole: "consequence",
        regime: "F_D",
        role: "observe",
        order: 2,
        authority: "evidence",
        inputCarrierRefs: [input.target.name],
        outputCarrierRefs: [input.target.name],
        evidenceRefs: [`proof://odd_world_model/${input.scopeRef}/consequence`]
      }
    ],
    standardsContextRefs: [
      "standard://specification_methodology/ODD_METHOD",
      "standard://specification_methodology/WORLD_MODEL_METHOD"
    ],
    policyContextRefs: ["policy://odd_world_model/authority-and-admission/v1"],
    carrierContextRefs: input.source.map((node) => node.schema.ref).concat(input.target.schema.ref),
    assuranceContextRefs: ["assurance://odd_world_model/typed-closure/v1"],
    closureContractRef: `closure-contract://${input.scopeRef}/v1`,
    hostGraphVectorRef: input.vectorRef,
    hostSourceNodeRefs: input.source.map((node) => node.id),
    hostTargetNodeRef: input.target.id,
    hostTargetSchemaRef: input.target.schema.ref,
    owningDeclarationRef: `declaration://${input.scopeRef}/compute/v1`
  });
}

function makeGraphFunction(input: {
  readonly handle: string;
  readonly source: readonly Node[];
  readonly target: Node;
  readonly regime: Regime;
  readonly effectRefs: readonly string[];
  readonly tags: readonly string[];
  readonly graphFunctionDeclarations?: ReturnType<typeof admitGraphFunctionDeclarations>;
  readonly graphFunctionComposition?: boolean;
}): GraphFunction {
  if (!computeRegimesForHandle(input.handle).includes(input.regime)) {
    throw new Error(`primary regime ${input.regime} is not declared for ${input.handle}`);
  }
  const functionSlug = graphFunctionHandlePath(input.handle);
  const vectorName = `${input.handle}.edge`;
  const vectorRef = `graph-vector://odd_world_model/${functionSlug}/v1`;
  const declarationAttrs = compositionDeclarations({
    scopeRef: `odd_world_model/${functionSlug}`,
    regime: input.regime,
    source: input.source,
    target: input.target,
    vectorRef
  });
  const vectorDeclarationEntries = input.regime === "F_D"
    ? declarationAttrs.entries
    : Object.freeze([
        ...declarationAttrs.entries,
        scalarEntry("abg.runtime_regime", input.regime)
      ]);
  const rule = Object.freeze({
    name: `${input.handle}.closure`,
    kind: "typed_closure",
    config: emptySerializedAttrs(),
    tags: Object.freeze(["odd_world_model", "closure"])
  });
  const vector = constructGraphVector({
    id: vectorRef,
    name: vectorName,
    source: input.source,
    target: input.target,
    operators: [
      Object.freeze({
        name: `${input.handle}.construct`,
        regime: input.regime,
        binding: `binding://odd_world_model/${functionSlug}/construct/v1`,
        tags: Object.freeze(["odd_world_model", input.regime.toLowerCase()])
      })
    ],
    evaluators: [
      Object.freeze({
        name: `${input.handle}.validate`,
        regime: "F_D",
        description: `Validate the typed ${input.target.name} closure contract`,
        binding: `binding://odd_world_model/${functionSlug}/validate/v1`,
        consumedFieldRefs: Object.freeze([input.target.schema.ref]),
        tags: Object.freeze(["odd_world_model", "f_d", "closure"])
      })
    ],
    contexts: [],
    rule,
    allowsSubwork: input.regime === "F_P",
    declarations: graphVectorDeclarations(vectorDeclarationEntries),
    tags: ["odd_world_model", ...input.tags]
  });
  const graph = constructGraph({
    id: `graph://odd_world_model/${functionSlug}/v1`,
    name: `${input.handle}.graph`,
    inputs: input.source,
    outputs: [input.target],
    nodes: [...input.source, input.target],
    vectors: [vector],
    contexts: [],
    rules: [rule],
    effects: input.effectRefs,
    tags: ["odd_world_model", ...input.tags]
  });
  return constructGraphFunction({
    id: `graph-function://odd_world_model/${functionSlug}/v1`,
    name: input.handle,
    environment: constructEnvRef({
      requires: input.source,
      provides: [input.target],
      carries: [...input.source, ...sharedEnvironmentNodes, input.target]
    }),
    inputs: input.source,
    outputs: [input.target],
    template: constructTemplateRef({
      kind: "inline_graph",
      ref: `template://odd_world_model/${functionSlug}/v1`,
      graph,
      version: null
    }),
    effects: input.effectRefs,
    declarations: input.graphFunctionDeclarations ?? (
      input.graphFunctionComposition === false
        ? emptyGraphFunctionDeclarations()
        : admitGraphFunctionDeclarations(declarationAttrs)
    ),
    tags: ["odd_world_model", ...input.tags]
  });
}

export const privateGraphFunctions = Object.freeze([
  makeGraphFunction({
    handle: PRIVATE_GRAPH_FUNCTION_HANDLES[0],
    source: [domainPublicationAssets.request],
    target: domainPublicationAssets.observed,
    regime: "F_D",
    graphFunctionComposition: false,
    effectRefs: ["effect://odd_world_model/source-observation/v1"],
    tags: ["private", "domain_publication_refinement"]
  }),
  makeGraphFunction({
    handle: PRIVATE_GRAPH_FUNCTION_HANDLES[1],
    source: [domainPublicationAssets.observed],
    target: domainPublicationAssets.proposed,
    regime: "F_P",
    graphFunctionComposition: false,
    effectRefs: ["effect://odd_world_model/semantic-proposal/v1"],
    tags: ["private", "domain_publication_refinement"]
  }),
  makeGraphFunction({
    handle: PRIVATE_GRAPH_FUNCTION_HANDLES[2],
    source: [domainPublicationAssets.proposed],
    target: domainPublicationAssets.admitted,
    regime: "F_D",
    graphFunctionComposition: false,
    effectRefs: ["effect://odd_world_model/claim-admission/v1"],
    tags: ["private", "domain_publication_refinement"]
  }),
  makeGraphFunction({
    handle: PRIVATE_GRAPH_FUNCTION_HANDLES[3],
    source: [domainPublicationAssets.admitted],
    target: domainPublicationAssets.projected,
    regime: "F_D",
    graphFunctionComposition: false,
    effectRefs: ["effect://odd_world_model/domain-cut-projection/v1"],
    tags: ["private", "domain_publication_refinement"]
  }),
  makeGraphFunction({
    handle: PRIVATE_GRAPH_FUNCTION_HANDLES[4],
    source: [domainPublicationAssets.projected],
    target: domainPublicationAssets.outcome,
    regime: "F_D",
    graphFunctionComposition: false,
    effectRefs: ["effect://odd_world_model/physical-cut-store/v1"],
    tags: ["private", "domain_publication_refinement"]
  })
]);

const composedDomainPublication = compose(
  privateGraphFunctions[0]!,
  privateGraphFunctions[1]!,
  privateGraphFunctions[2]!,
  privateGraphFunctions[3]!,
  privateGraphFunctions[4]!
);

const domainPublicationDeclarations = admitGraphFunctionDeclarations({
  entries: [
    stringListEntry(
      "odd_world_model.refinement_graph_function_refs",
      PRIVATE_GRAPH_FUNCTION_HANDLES
    ),
    scalarEntry(
      "odd_world_model.refinement_boundary_ref",
      "refinement-boundary://odd_world_model/publish-domain-model/v1"
    ),
    scalarEntry(
      "odd_world_model.foldback_contract_ref",
      "foldback-contract://odd_world_model/publish-domain-model/v1"
    )
  ]
});

const publishDomainModel = constructGraphFunction({
  id: "graph-function://odd_world_model/publish-domain-model/v1",
  name: PUBLIC_GRAPH_FUNCTION_HANDLES[0],
  environment: composedDomainPublication.environment,
  inputs: composedDomainPublication.inputs,
  outputs: composedDomainPublication.outputs,
  template: composedDomainPublication.template,
  effects: composedDomainPublication.effects,
  declarations: domainPublicationDeclarations,
  tags: ["odd_world_model", "public", "composed", "domain_publication"]
});

export const publicGraphFunctions = Object.freeze([
  publishDomainModel,
  makeGraphFunction({
    handle: PUBLIC_GRAPH_FUNCTION_HANDLES[1],
    source: [publicFunctionAssets.semanticLinks.request],
    target: publicFunctionAssets.semanticLinks.outcome,
    regime: "F_D",
    effectRefs: ["effect://odd_world_model/semantic-link-publication/v1"],
    tags: ["public", "semantic_link_publication"]
  }),
  makeGraphFunction({
    handle: PUBLIC_GRAPH_FUNCTION_HANDLES[2],
    source: [publicFunctionAssets.composition.request],
    target: publicFunctionAssets.composition.outcome,
    regime: "F_D",
    effectRefs: ["effect://odd_world_model/world-model-composition/v1"],
    tags: ["public", "composition"]
  }),
  makeGraphFunction({
    handle: PUBLIC_GRAPH_FUNCTION_HANDLES[3],
    source: [publicFunctionAssets.mesh.request],
    target: publicFunctionAssets.mesh.outcome,
    regime: "F_D",
    effectRefs: ["effect://odd_world_model/mesh-resolution/v1"],
    tags: ["public", "mesh"]
  }),
  makeGraphFunction({
    handle: PUBLIC_GRAPH_FUNCTION_HANDLES[4],
    source: [publicFunctionAssets.contextProjection.request],
    target: publicFunctionAssets.contextProjection.outcome,
    regime: "F_D",
    effectRefs: ["effect://odd_world_model/context-projection/v1"],
    tags: ["public", "context"]
  }),
  makeGraphFunction({
    handle: PUBLIC_GRAPH_FUNCTION_HANDLES[5],
    source: [publicFunctionAssets.interpretation.request],
    target: publicFunctionAssets.interpretation.outcome,
    regime: "F_P",
    effectRefs: ["effect://odd_world_model/governed-model-invocation/v1"],
    tags: ["public", "context", "probabilistic"]
  }),
  makeGraphFunction({
    handle: PUBLIC_GRAPH_FUNCTION_HANDLES[6],
    source: [publicFunctionAssets.query.request],
    target: publicFunctionAssets.query.outcome,
    regime: "F_D",
    effectRefs: ["effect://odd_world_model/query-projection/v1"],
    tags: ["public", "query", "read_only"]
  })
]);

export const graphFunctionByHandle = new Map<string, GraphFunction>([
  ...publicGraphFunctions.map((graphFunction) => [graphFunction.name, graphFunction] as const),
  ...privateGraphFunctions.map((graphFunction) => [graphFunction.name, graphFunction] as const)
]);
