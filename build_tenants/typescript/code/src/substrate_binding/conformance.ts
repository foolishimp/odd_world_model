import { sha256Digest } from "../domain/canonical.ts";
import {
  GTL_PROGRAM_BIND_ADMISSION_STRENGTH_COMPATIBILITY_REF,
  GTL_PROGRAM_T153_FEATURE_KINDS,
  GTL_PROGRAM_T153_FEATURE_OWNER_CLASSIFICATIONS,
  constructEnginePluginContract,
  formatGtlProgramConformanceIssues,
  materializeGraphFunction,
  resolveAbgFnCompositionSelection,
  type GtlProgramConformanceInput,
  type GtlProgramConformanceReport,
  type GtlProgramEdgeClosureRow,
  type GtlProgramEvaluatorDeclarationRow,
  type GtlProgramFeatureCoverageManifest,
  type GtlProgramJobBindingRow,
  type GtlProgramOperatorDeclarationRow,
  type GtlProgramOverlayRow,
  type GtlProgramPublicStartRow,
  type GtlProgramRoleBindingRow,
  type GtlProgramRuleDeclarationRow,
  type GtlProgramTargetCarrierRow,
  type GtlProgramTraversalBindConservationRow,
  type Graph,
  type GraphFunction,
  type GraphVector,
  type Regime,
  type Role,
  type Job,
  typecheckGtlProgram
} from "./rc3_api.ts";
import { EXACT_PROVING_PRODUCTS, assertExactProductBinding } from "./exact_products.ts";
import {
  PUBLIC_GRAPH_FUNCTION_HANDLES,
  publicGraphFunctions
} from "../gtl/graph_functions.ts";
import {
  WORLD_MODEL_MODULE_REF,
  WORLD_MODEL_OVERLAY_REF,
  worldModelModule
} from "../gtl/module.ts";

interface TraversalInventoryRow {
  readonly graphFunction: GraphFunction;
  readonly graph: Graph;
  readonly vector: GraphVector;
  readonly vectorIndex: number;
  readonly job: Job;
}

const OBLIGATION_DELTA_FAMILIES = Object.freeze([
  "realized",
  "refined",
  "downstream_deferred",
  "blocked",
  "reentered",
  "repriced",
  "no_close_preserved",
  "terminal_projected"
] as const);

const PRESENT_FEATURES = new Set<string>([
  "graph_structure_interface",
  "graph_algebra_edge",
  "graph_algebra_compose",
  "operator_declarations",
  "evaluator_declarations",
  "rule_declarations",
  "f_star_compute_composition",
  "hook_boundaries",
  "target_carrier_contract_law",
  "edge_closure_contract_law",
  "prompt_typed_asset_law",
  "selection_refinement_synthesis_subwork",
  "module_publication",
  "public_start_binding",
  "job_binding",
  "role_binding",
  "active_source_identity"
]);

function featureRequirementRefs(featureKind: string): readonly string[] {
  switch (featureKind) {
    case "graph_structure_interface":
      return ["REQ-L-GTL3-GRAPH", "REQ-L-GTL3-GRAPHVECTOR", "REQ-L-GTL3-GRAPHFUNCTION"];
    case "graph_algebra_edge":
    case "graph_algebra_identity":
    case "graph_algebra_same_object":
      return ["REQ-L-GTL3-LAWS"];
    case "graph_algebra_compose":
      return ["REQ-L-GTL3-COMPOSE"];
    case "graph_algebra_substitute":
      return ["REQ-L-GTL3-SUBSTITUTE"];
    case "graph_algebra_recurse":
      return ["REQ-L-GTL3-RECURSE"];
    case "graph_algebra_fan_out":
    case "graph_algebra_fan_in":
    case "graph_algebra_gate":
    case "graph_algebra_promote":
      return ["REQ-L-GTL3-HOF"];
    case "operator_declarations":
      return ["REQ-L-GTL3-OPERATOR"];
    case "evaluator_declarations":
      return ["REQ-L-GTL3-EVALUATOR"];
    case "rule_declarations":
      return ["REQ-L-GTL3-RULE"];
    case "f_star_compute_composition":
      return ["REQ-L-GTL3-COMPUTE-NOTATION", "REQ-R-ABG3-FN-COMPOSITION"];
    case "hook_boundaries":
      return ["REQ-L-GTL3-HOOKS"];
    case "target_carrier_contract_law":
      return ["REQ-L-GTL3-GRAPHVECTOR", "REQ-L-GTL3-CONTRACT-LAW-API"];
    case "edge_closure_contract_law":
      return ["REQ-R-ABG3-ASSURANCE", "REQ-R-ABG3-INTERPRET"];
    case "prompt_typed_asset_law":
      return ["REQ-L-GTL3-ASSET-SURFACE"];
    case "selection_refinement_synthesis_subwork":
      return ["REQ-L-GTL3-SELECTION-BOUNDARY", "REQ-L-GTL3-SYNTHESIS", "REQ-L-GTL3-SUBWORK"];
    case "module_publication":
      return ["REQ-L-GTL3-MODULE"];
    case "public_start_binding":
      return ["REQ-L-GTL3-JOB", "REQ-R-ABG3-RUN"];
    case "job_binding":
      return ["REQ-L-GTL3-JOB"];
    case "role_binding":
      return ["REQ-L-GTL3-ROLE"];
    case "external_tool_gates":
      return ["REQ-L-GTL3-HOOKS", "REQ-R-ABG3-TRANSPORT"];
    case "active_source_identity":
      return ["REQ-L-GTL3-IDENTITY"];
    default:
      throw new Error(`unknown rc.3 conformance feature ${featureKind}`);
  }
}

function featureCoverageManifest(): GtlProgramFeatureCoverageManifest {
  return {
    kind: "gtl_program_feature_coverage_manifest",
    manifestRef: "feature-coverage://odd_world_model/context-memory/v1",
    t153RequirementRef: "REQ-L-GTL3-CONTRACT-LAW-API",
    rows: GTL_PROGRAM_T153_FEATURE_KINDS.map((featureKind) => {
      const disposition = PRESENT_FEATURES.has(featureKind) ? "present" : "not_used";
      return {
        featureKind,
        disposition,
        ownerClassification: GTL_PROGRAM_T153_FEATURE_OWNER_CLASSIFICATIONS[featureKind],
        requirementRefs: featureRequirementRefs(featureKind),
        evidenceRefs: disposition === "present"
          ? [`proof://odd_world_model/rc3-conformance/feature/${featureKind}`]
          : [],
        reasonRefs: disposition === "not_used"
          ? [`reason://odd_world_model/first-slice/not-used/${featureKind}`]
          : []
      };
    })
  };
}

function jobFor(graphFunction: GraphFunction): Job {
  const job = worldModelModule.jobs.find((candidate) =>
    candidate.contracts.some((contract) => contract.targetId === graphFunction.id)
  );
  if (job === undefined) throw new Error(`no job publishes ${graphFunction.name}`);
  return job;
}

function traversalInventory(): readonly TraversalInventoryRow[] {
  return publicGraphFunctions.flatMap((graphFunction) => {
    const graph = materializeGraphFunction(graphFunction);
    const job = jobFor(graphFunction);
    return graph.vectors.map((vector, vectorIndex) => ({
      graphFunction,
      graph,
      vector,
      vectorIndex,
      job
    }));
  });
}

function edgeRef(row: TraversalInventoryRow): string {
  return `${row.graphFunction.name}/${row.vector.name}`;
}

function vectorHostRef(row: TraversalInventoryRow): string {
  return `${row.graphFunction.name}/${row.graph.name}/${row.vector.name}#${row.graphFunction.id}:${row.graph.id}:${row.vector.id}`;
}

function targetCarrier(row: TraversalInventoryRow): GtlProgramTargetCarrierRow {
  const ref = edgeRef(row);
  const target = row.vector.target;
  const contractRef = `gtl://target-carrier-contract/odd_world_model/${encodeURIComponent(ref)}/v1`;
  return {
    edgeRef: ref,
    graphVectorRef: row.vector.name,
    graphFunctionId: row.graphFunction.id,
    graphId: row.graph.id,
    graphVectorId: row.vector.id,
    targetAssetType: target.name,
    targetCarrierContractRef: contractRef,
    targetCarrierContractDigest: sha256Digest({
      edge_ref: ref,
      target_asset_type: target.name,
      schema_ref: target.schema.ref,
      contract_ref: contractRef
    }),
    targetCarrierTemplateRef: `gtl://target-carrier-template/odd_world_model/${target.name}/v1`,
    outputSurfaceRef: `asset-type://odd_world_model/${target.name}`,
    outputCarrierFamilyRef: "gtl://target-carrier-family/odd_world_model/typed-asset/v1",
    outputCarrierKind: `odd_world_model.${target.assetSurface.kind}`,
    envelopeContractRef: "gtl://target-carrier-envelope/odd_world_model/typed-asset/v1",
    nestedPayloadPath: "payload",
    requiredFieldRefs: ["kind", "targetAssetType", "edgeRef", "contractRef", "contractDigest", "payload"],
    optionalFieldRefs: ["summary", "evidenceRefs", "gapRefs"],
    fixedProtocolFieldRefs: ["kind", "targetAssetType", "edgeRef", "contractRef", "contractDigest"],
    workerFillableFieldRefs: ["payload", "summary", "evidenceRefs", "gapRefs"],
    literalDomainRefs: [
      `kind:odd_world_model.${target.assetSurface.kind}`,
      `targetAssetType:${target.name}`,
      `edgeRef:${ref}`,
      `contractRef:${contractRef}`
    ],
    enumDomainRefs: [],
    schemaRef: target.schema.ref,
    admissionRef: `admission://odd_world_model/target-carrier/${encodeURIComponent(ref)}/v1`,
    payloadLedgerBindingRef: `payload-ledger://odd_world_model/${encodeURIComponent(ref)}/v1`,
    edgeAssuranceBindingRef: `edge-assurance://odd_world_model/${encodeURIComponent(ref)}/v1`,
    handoffProjectionRef: `handoff-projection://odd_world_model/${encodeURIComponent(ref)}/v1`,
    constructionTemplateRef: `construction-template://odd_world_model/${encodeURIComponent(ref)}/v1`,
    replayDigestPolicyRef: "replay-digest://odd_world_model/rfc8785-sha256/v1",
    materializationPolicyRef: `materialization://odd_world_model/${target.assetSurface.kind}/v1`,
    closurePreconditionRef: `closure-precondition://odd_world_model/${encodeURIComponent(ref)}/target-admitted/v1`
  };
}

function edgeClosure(row: TraversalInventoryRow): GtlProgramEdgeClosureRow {
  return {
    edgeRef: edgeRef(row),
    graphFunctionId: row.graphFunction.id,
    graphId: row.graph.id,
    graphVectorId: row.vector.id,
    targetAssetType: row.vector.target.name
  };
}

function operatorRows(inventory: readonly TraversalInventoryRow[]): readonly GtlProgramOperatorDeclarationRow[] {
  return inventory.flatMap((row) => row.vector.operators.map((operator) => ({
    operatorRef: `operator://${encodeURIComponent(row.vector.id)}/${operator.name}`,
    name: operator.name,
    regime: operator.regime,
    binding: operator.binding,
    hostKind: "graph_vector" as const,
    hostRef: vectorHostRef(row),
    tagRefs: operator.tags,
    evidenceRefs: [`proof://odd_world_model/rc3-conformance/operator/${operator.name}`]
  })));
}

function evaluatorRows(inventory: readonly TraversalInventoryRow[]): readonly GtlProgramEvaluatorDeclarationRow[] {
  return inventory.flatMap((row) => row.vector.evaluators.map((evaluator) => ({
    evaluatorRef: `evaluator://${encodeURIComponent(row.vector.id)}/${evaluator.name}`,
    name: evaluator.name,
    regime: evaluator.regime,
    description: evaluator.description,
    binding: evaluator.binding,
    consumedFieldRefs: evaluator.consumedFieldRefs,
    hostKind: "graph_vector" as const,
    hostRef: vectorHostRef(row),
    tagRefs: evaluator.tags,
    evidenceRefs: [`proof://odd_world_model/rc3-conformance/evaluator/${evaluator.name}`]
  })));
}

function ruleRows(inventory: readonly TraversalInventoryRow[]): readonly GtlProgramRuleDeclarationRow[] {
  return inventory.flatMap((row) => row.vector.rule === null ? [] : [{
    ruleRef: `rule://${encodeURIComponent(row.vector.id)}/${row.vector.rule.name}`,
    name: row.vector.rule.name,
    ruleKind: row.vector.rule.kind,
    configDigest: sha256Digest(row.vector.rule.config),
    hostKind: "graph_vector" as const,
    hostRef: vectorHostRef(row),
    tagRefs: row.vector.rule.tags,
    evidenceRefs: [`proof://odd_world_model/rc3-conformance/rule/${row.vector.rule.name}`]
  }]);
}

const contextInterpretationPlugin = constructEnginePluginContract({
  ref: "plugin://odd_world_model/context-interpretation/v1",
  pluginKind: "fp_dispatch",
  driverRequirement: "sync_compatible",
  authority: "effect_plugin",
  inputCarrier: "EnginePluginInput",
  outputCarrier: "ContextInterpretationOutcome",
  computeStageRole: "transform",
  computeMeans: "F_P",
  computeStagePurpose: "candidate_construction"
});

function stagePurpose(stageRole: string) {
  switch (stageRole) {
    case "transform": return "candidate_construction" as const;
    case "evaluate": return "candidate_evaluation" as const;
    case "consequence": return "consequence_projection" as const;
    default: return "external_human_callout" as const;
  }
}

function stageRows(row: TraversalInventoryRow) {
  const selection = resolveAbgFnCompositionSelection({
    vector: row.vector,
    graphFunction: row.graphFunction,
    job: row.job,
    roles: row.job.roles,
    module: worldModelModule
  });
  const contract = selection.contract;
  const stageBindingRefs = contract.regimes.map((binding) =>
    `stage-binding://odd_world_model/${encodeURIComponent(row.vector.id)}/${binding.stageRole}`
  );
  const computeStages = contract.regimes.map((binding, index) => {
    const predecessor = index === 0 ? [] : [stageBindingRefs[index - 1]!];
    const pluginContractRefs = binding.regime === "F_P" ? [contextInterpretationPlugin.ref] : [];
    const hookRefs = binding.regime === "F_P" ? [contract.hookRef] : [];
    return {
      stageBindingRef: stageBindingRefs[index]!,
      compositionRef: contract.contractRef,
      compositionDigest: contract.contractDigest,
      stageRole: binding.stageRole,
      stageNotationRef: `${binding.stageRole}.C`,
      stagePurpose: stagePurpose(binding.stageRole),
      computeMeans: binding.regime,
      inputCarrierRefs: binding.inputCarrierRefs,
      outputCarrierRefs: binding.outputCarrierRefs,
      predecessorStageBindingRefs: predecessor,
      pluginContractRefs,
      hookRefs,
      regimeDispositions: (["F_D", "F_P", "F_H"] as const).map((regime) => ({
        regime,
        disposition: regime === binding.regime ? "participates" as const : "not_used" as const,
        selectedRegimeBindingRefs: regime === binding.regime ? [binding.bindingRef] : [],
        reasonRefs: regime === binding.regime ? [] : [`reason://odd_world_model/${regime}/not-used/${encodeURIComponent(row.vector.id)}/${binding.stageRole}`],
        evidenceRefs: regime === binding.regime ? [`proof://odd_world_model/${encodeURIComponent(row.vector.id)}/${binding.stageRole}/${regime}`] : []
      })),
      mayWriteLedgers: false as const,
      mayEmitRuntimeEvents: false as const,
      maySelectTraversal: false as const,
      mayCloseTraversal: false as const,
      mayOwnIterationLoop: false as const,
      evidenceRefs: [`proof://odd_world_model/rc3-conformance/stage/${encodeURIComponent(row.vector.id)}/${binding.stageRole}`]
    };
  });
  const resultInterfaces = contract.regimes.map((binding, index) => ({
    resultInterfaceRef: `result-interface://odd_world_model/${encodeURIComponent(row.vector.id)}/${binding.stageRole}/v1`,
    stageBindingRef: stageBindingRefs[index]!,
    compositionRef: contract.contractRef,
    compositionDigest: contract.contractDigest,
    stageRole: binding.stageRole,
    computeMeans: binding.regime,
    resultEnvelopeContractRef: `result-envelope://odd_world_model/${binding.stageRole}/v1`,
    resultCarrierKind: binding.outputCarrierRefs[0] ?? row.vector.target.name,
    outputCarrierRefs: binding.outputCarrierRefs,
    producedCarrierRefs: binding.outputCarrierRefs.map((carrier) =>
      `carrier://odd_world_model/${encodeURIComponent(row.vector.id)}/${binding.stageRole}/${encodeURIComponent(carrier)}`
    ),
    requiredIdentityFieldRefs: [
      "compositionRef",
      "compositionDigest",
      "compositionSelectionRef",
      "stageRole",
      "computeMeans",
      "outputCarrierRefs",
      "evidenceRefs"
    ],
    selectorAuthorityRefs: [`gtl://plugin-result-interface/odd_world_model/${encodeURIComponent(row.vector.id)}/${binding.stageRole}/v1`],
    evidenceRefs: [`proof://odd_world_model/rc3-conformance/result-interface/${encodeURIComponent(row.vector.id)}/${binding.stageRole}`],
    mayWriteLedgers: false as const,
    mayEmitRuntimeEvents: false as const,
    maySelectTraversal: false as const,
    mayCloseTraversal: false as const,
    mayOwnIterationLoop: false as const
  }));
  return {
    composition: {
      compositionRef: contract.contractRef,
      compositionDigest: contract.contractDigest,
      hostKind: "graph_vector" as const,
      hostRef: vectorHostRef(row),
      declarationSourceKind: "graph_vector_declaration" as const,
      declarationSourceRef: row.vector.id,
      notationRefs: [
        `fn<${row.vector.source.map((node) => node.name).join("+")},${row.vector.target.name}>.C`,
        "transform.C",
        "evaluate.C",
        "consequence.C"
      ],
      regimeBindingRefs: contract.regimes.map((binding) => binding.bindingRef),
      stageBindingRefs,
      closureContractRef: contract.closureContractRef,
      evidenceRefs: [`proof://odd_world_model/rc3-conformance/composition/${encodeURIComponent(row.vector.id)}`]
    },
    computeStages,
    resultInterfaces,
    hook: {
      hookRef: contract.hookRef,
      hookKey: "abg.fn_composition",
      hostKind: "graph_vector" as const,
      hostRef: vectorHostRef(row),
      declarationSourceKind: "graph_vector_declaration" as const,
      declarationRef: row.vector.id,
      precedenceRank: 1,
      concernRefs: ["transform", "evaluate", "consequence", "typed_closure"],
      pluginContractRefs: contract.regimes.some((binding) => binding.regime === "F_P")
        ? [contextInterpretationPlugin.ref]
        : [],
      evidenceRefs: [`proof://odd_world_model/rc3-conformance/hook/${encodeURIComponent(row.vector.id)}`]
    },
    stageBindingRefs
  };
}

function jobBindings(): readonly GtlProgramJobBindingRow[] {
  return worldModelModule.jobs.map((job) => ({
    jobRef: job.name,
    contractTargetRefs: job.contracts.map((contract) => {
      const graphFunction = publicGraphFunctions.find((candidate) => candidate.id === contract.targetId);
      if (graphFunction === undefined) throw new Error(`job ${job.name} targets an unknown GraphFunction`);
      return graphFunction.name;
    }),
    roleRefs: job.roles.map((role) => role.name),
    policyHookRefs: [],
    publicCallableGraphFunctionRefs: job.contracts.map((contract) => {
      const graphFunction = publicGraphFunctions.find((candidate) => candidate.id === contract.targetId);
      if (graphFunction === undefined) throw new Error(`job ${job.name} targets an unknown GraphFunction`);
      return graphFunction.name;
    }),
    evidenceRefs: [`proof://odd_world_model/rc3-conformance/job/${encodeURIComponent(job.name)}`]
  }));
}

function roleBindings(): readonly GtlProgramRoleBindingRow[] {
  return worldModelModule.roles.map((role: Role) => ({
    roleRef: role.name,
    capabilityRefs: [`capability://odd_world_model/${role.name.replace(/^odd_world_model\./, "")}/v1`],
    policyHookRefs: [],
    evidenceRefs: [`proof://odd_world_model/rc3-conformance/role/${encodeURIComponent(role.name)}`]
  }));
}

function publicStarts(): readonly GtlProgramPublicStartRow[] {
  return PUBLIC_GRAPH_FUNCTION_HANDLES.map((handle) => ({
    name: handle,
    graphFunctionRef: handle,
    overlayRefs: [WORLD_MODEL_OVERLAY_REF],
    defaultForOverlayRefs: []
  }));
}

function overlay(inventory: readonly TraversalInventoryRow[]): GtlProgramOverlayRow {
  return {
    overlayRef: WORLD_MODEL_OVERLAY_REF,
    graphFunctionRefs: publicGraphFunctions.map((graphFunction) => graphFunction.name),
    graphVectorRefs: inventory.map((row) => row.vector.name),
    publicStartTargets: [...PUBLIC_GRAPH_FUNCTION_HANDLES],
    defaultStartTarget: PUBLIC_GRAPH_FUNCTION_HANDLES[0]
  };
}

function traversalConservation(
  row: TraversalInventoryRow,
  carrier: GtlProgramTargetCarrierRow,
  stageBindingRefs: readonly string[]
): GtlProgramTraversalBindConservationRow {
  const ref = edgeRef(row);
  return {
    conservationRef: `bind-conservation://odd_world_model/${encodeURIComponent(ref)}/v1`,
    graphFunctionRef: row.graphFunction.name,
    graphRef: row.graph.name,
    graphVectorRef: row.vector.name,
    graphFunctionId: row.graphFunction.id,
    graphId: row.graph.id,
    graphVectorId: row.vector.id,
    intentLineageRefs: [
      "INT-ODD-WORLD-MODEL-001",
      `lineage://odd_world_model/${encodeURIComponent(ref)}/intent/v1`
    ],
    targetCarrierBindingRefs: [carrier.targetCarrierContractRef],
    materializationBindingRefs: [carrier.materializationPolicyRef],
    carriedObligationRefs: [`obligation://odd_world_model/${encodeURIComponent(ref)}/typed-output/v1`],
    residualPressureRefs: [`pressure://odd_world_model/${encodeURIComponent(ref)}/typed-gap/v1`],
    stagedAuthorityRefs: stageBindingRefs,
    admissionStrengthRefs: [GTL_PROGRAM_BIND_ADMISSION_STRENGTH_COMPATIBILITY_REF],
    downstreamTerminalPressureRefs: [`terminal-pressure://odd_world_model/${encodeURIComponent(ref)}/v1`],
    allowedObligationDeltaFamilies: OBLIGATION_DELTA_FAMILIES,
    evidenceRefs: [`proof://odd_world_model/rc3-conformance/conservation/${encodeURIComponent(ref)}`]
  };
}

export function buildWorldModelConformanceInput(): GtlProgramConformanceInput {
  assertExactProductBinding();
  const inventory = traversalInventory();
  const targetCarrierContracts = inventory.map(targetCarrier);
  const stageInventory = inventory.map(stageRows);
  const starts = publicStarts();
  return {
    subjectRef: "product://odd_world_model/typescript/context-memory/v1",
    abiPackageVersion: EXACT_PROVING_PRODUCTS.abiogenesis.package_version,
    expectedCoverage: {
      catalogGraphFunctionCount: publicGraphFunctions.length,
      publishedGraphFunctionCount: publicGraphFunctions.length,
      graphVectorCount: inventory.length,
      targetCarrierContractCount: targetCarrierContracts.length,
      edgeClosureContractCount: inventory.length,
      overlayCount: 1,
      publicStartTargetCount: starts.length,
      promptAssetCount: 1,
      pluginContractCount: 1,
      sourceIdentitySurfaceCount: 1
    },
    featureCoverageManifest: featureCoverageManifest(),
    catalogGraphFunctionRefs: publicGraphFunctions.map((graphFunction) => graphFunction.name),
    modules: [worldModelModule],
    targetCarrierContracts,
    edgeClosureContracts: inventory.map(edgeClosure),
    overlays: [overlay(inventory)],
    publicStartTargets: starts,
    promptAssets: [
      {
        surfaceRef: "prompt://odd_world_model/context-projection/v1",
        assetSurface: publicGraphFunctions[4]!.outputs[0]!.assetSurface,
        gtlNode: publicGraphFunctions[4]!.outputs[0]!,
        renderedViewDigest: sha256Digest({
          renderer_ref: "renderer://odd_world_model/context-projection/canonical-json/v1",
          projection_contract_ref: "contract://odd_world_model/context-projection/v1"
        }),
        currentAbgFoldRefs: [
          "package:@abiogenesis/typescript-tenant@4.6.0-rc.3#abg/m03/iteration_state_action/deriveIterationOutcomeFromRows"
        ],
        evidenceRefs: ["proof://odd_world_model/context-projection/prompt-asset/v1"]
      }
    ],
    pluginContracts: [contextInterpretationPlugin],
    pluginResultInterfaces: stageInventory.flatMap((entry) => entry.resultInterfaces),
    sourceIdentitySurfaces: [
      {
        surfaceRef: "build_tenants/typescript/DEPENDENCY_RESOLUTION.md",
        text: "Current exact truth: @abiogenesis/typescript-tenant 4.6.0-rc.3 and ABG 4.6.0-rc.3.",
        evidenceRefs: ["build_tenants/typescript/package-lock.json"]
      }
    ],
    operatorDeclarations: operatorRows(inventory),
    evaluatorDeclarations: evaluatorRows(inventory),
    ruleDeclarations: ruleRows(inventory),
    computeCompositions: stageInventory.map((entry) => entry.composition),
    computeStageBindings: stageInventory.flatMap((entry) => entry.computeStages),
    hookBoundaries: stageInventory.map((entry) => entry.hook),
    selectionBoundaries: [
      {
        boundaryRef: "odd_world_model.publish_domain_model.refinement",
        boundaryKind: "refinement_boundary",
        hostRef: WORLD_MODEL_MODULE_REF,
        inputContractRefs: publicGraphFunctions[0]!.inputs.map((node) => node.name),
        outputContractRefs: publicGraphFunctions[0]!.outputs.map((node) => node.name),
        candidateRefs: [],
        evidenceRefs: ["build_tenants/common/design/adrs/ADR-WM-004-gtl-graph-function-catalog.md"]
      }
    ],
    jobBindings: jobBindings(),
    roleBindings: roleBindings(),
    runtimeBindings: starts.map((publicStart) => ({
      bindingRef: `runtime-binding://odd_world_model/${encodeURIComponent(publicStart.name)}/abg-start/v1`,
      runtimeBindingKind: "abg_public_callable_start",
      moduleRef: WORLD_MODEL_MODULE_REF,
      publicStartRef: publicStart.name,
      commandRef: "abiogenesis-ts start",
      pluginContractRefs: publicStart.name === "odd_world_model.interpret_context"
        ? [contextInterpretationPlugin.ref]
        : [],
      stageBindingRefs: stageInventory
        .filter((_, index) => inventory[index]?.graphFunction.name === publicStart.graphFunctionRef)
        .flatMap((entry) => entry.stageBindingRefs),
      consumesPluginsThroughAbg: true,
      forbidsProductLocalIteration: true,
      evidenceRefs: [`proof://odd_world_model/rc3-public-start/${encodeURIComponent(publicStart.name)}/v1`]
    })),
    traversalBindConservation: inventory.map((row, index) => {
      const carrier = targetCarrierContracts[index];
      const stages = stageInventory[index];
      if (carrier === undefined || stages === undefined) throw new Error("conformance inventory lost vector alignment");
      return traversalConservation(row, carrier, stages.stageBindingRefs);
    })
  };
}

export function runWorldModelConformance(): GtlProgramConformanceReport {
  return typecheckGtlProgram(buildWorldModelConformanceInput());
}

export function assertWorldModelConformance(): GtlProgramConformanceReport {
  const report = runWorldModelConformance();
  if (!report.passed) {
    throw new Error(formatGtlProgramConformanceIssues(report.issues));
  }
  return report;
}
