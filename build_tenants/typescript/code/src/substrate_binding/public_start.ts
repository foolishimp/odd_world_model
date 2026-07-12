import {
  admitExecutionBasis,
  admitStartIntent,
  assertCanonicalRuntimeEvent,
  assertCanonicalRuntimeEventSequence,
  constructDefaultInstructionAssemblyStartupForBasis,
  constructFpDispatchOutcome,
  defaultFdEvaluatorPlugin,
  defaultFpDispatchPlugin,
  defaultFpEvaluatorPlugin,
  start,
  type PublicStartContext,
  type PublicStartOutcome,
  type RuntimeEvent,
  type StartInputAssetBinding,
  type StartIntent,
  type StartUntil
} from "./rc3_api.ts";
import {
  assertExactProductBinding,
  interpretWorldModelStartupRegistry
} from "./exact_products.ts";
import {
  PUBLIC_GRAPH_FUNCTION_HANDLES,
  type PublicGraphFunctionHandle
} from "../gtl/graph_functions.ts";
import { WORLD_MODEL_RUNTIME_REGISTRY_STARTUP } from "../gtl/catalog.ts";
import { WORLD_MODEL_RUNTIME_DECLARATIONS } from "../gtl/catalog.ts";
import { worldModelModule } from "../gtl/module.ts";

export interface WorldModelPublicStartProof {
  readonly kind: "odd_world_model.public_start_proof";
  readonly target_handle: PublicGraphFunctionHandle;
  readonly start_intent: StartIntent;
  readonly bound_evidence_refs: readonly string[];
  readonly outcome: PublicStartOutcome;
  readonly runtime_events: readonly RuntimeEvent[];
  readonly event_kinds: readonly string[];
  readonly registry_interpretation: ReturnType<typeof interpretWorldModelStartupRegistry>;
}

export interface WorldModelPublicStartRequest {
  readonly targetHandle: PublicGraphFunctionHandle;
  readonly until?: StartUntil;
  readonly workspaceRoot?: string;
  readonly runRefSuffix?: string;
  readonly inputBindings?: readonly StartInputAssetBinding[];
  readonly evidenceRefs?: readonly string[];
}

const producedPublicStartProofs = new WeakSet<WorldModelPublicStartProof>();

export function assertProducedWorldModelPublicStartProof(
  proof: WorldModelPublicStartProof
): void {
  if (!producedPublicStartProofs.has(proof)) {
    throw new Error("public-start proof was not produced by the selected ABIogenesis runtime adapter");
  }
}

function uniqueNonEmpty(values: readonly string[], label: string): readonly string[] {
  if (values.some((value) => value.length === 0)) throw new Error(`${label} contains an empty ref`);
  if (new Set(values).size !== values.length) throw new Error(`${label} must be unique`);
  return Object.freeze([...values]);
}

function makeWorldModelFpDispatchPlugin(boundEvidenceRefs: readonly string[]) {
  return Object.freeze({
    contract: defaultFpDispatchPlugin.contract,
    dispatch: (input: Parameters<typeof defaultFpDispatchPlugin.dispatch>[0]) => {
    const assessmentIds = input.expectedAssessmentIds.length > 0
      ? input.expectedAssessmentIds
      : ["odd_world_model.proof.runtime_fulfilled"];
    const assessmentEvidenceRefs = boundEvidenceRefs.length > 0
      ? boundEvidenceRefs
      : Object.freeze([`transport-evidence://odd_world_model/${input.edge}/v1`]);
    return constructFpDispatchOutcome({
      status: "dispatched",
      resultRef: input.actorInvocationRef?.resultRef ?? `result://odd_world_model/${input.vectorIndex}`,
      attachedResultArtifact: Object.freeze({
        edge: input.expectedEdge ?? input.edge,
        actor: "odd_world_model.rc3_reference_bridge",
        fulfillment_assessments: Object.freeze(assessmentIds.map((assessmentId) => Object.freeze({
          id: assessmentId,
          evaluator: assessmentId,
          fulfillment_status: "fulfilled",
          fulfillment_detail: "candidate evidence returned for ABG evaluation and admission",
          blocking_reasons: Object.freeze([]),
          evidence_refs: assessmentEvidenceRefs
        }))),
        selected_worker_id: "worker://odd_world_model/rc3-reference-bridge/v1",
        selected_backend: "backend://odd_world_model/rc3-reference-bridge/v1",
        role_id: "role://odd_world_model/context-interpreter/v1",
        assignment_source: "policy_resolution",
        resolved_runtime_ref: "runtime://abiogenesis/4.6.0-rc.3"
      }),
      evidenceRefs: [
        input.sourceProjectionRef,
        "transport-evidence://odd_world_model/rc3-reference-bridge/v1",
        ...boundEvidenceRefs
      ]
    });
    }
  });
}

function makeWorldModelFdEvaluatorPlugin(boundEvidenceRefs: readonly string[]) {
  return Object.freeze({
    contract: defaultFdEvaluatorPlugin.contract,
    evaluate: (input: Parameters<typeof defaultFdEvaluatorPlugin.evaluate>[0]) => {
      const outcome = defaultFdEvaluatorPlugin.evaluate(input);
      if (outcome instanceof Promise) {
        throw new Error("the pinned rc.3 default F_D evaluator unexpectedly became asynchronous");
      }
      return Object.freeze({
        ...outcome,
        evidenceRefs: uniqueNonEmpty([...outcome.evidenceRefs, ...boundEvidenceRefs], "F_D evidence refs")
      });
    }
  });
}

export function runWorldModelPublicStart(
  request: WorldModelPublicStartRequest
): WorldModelPublicStartProof {
  const targetHandle = request.targetHandle;
  if (!PUBLIC_GRAPH_FUNCTION_HANDLES.includes(targetHandle)) {
    throw new Error(`unknown public GraphFunction handle ${targetHandle}`);
  }
  const boundEvidenceRefs = uniqueNonEmpty(request.evidenceRefs ?? [], "evidenceRefs");
  const inputBindings = Object.freeze([...(request.inputBindings ?? [])]);
  const until = request.until ?? "first_traversal";
  const workspaceRoot = request.workspaceRoot ?? "/workspace/odd_world_model/rc3-probe";
  const runRefSuffix = request.runRefSuffix ?? "v1";
  assertExactProductBinding();
  const runtimeEvents: RuntimeEvent[] = [];
  const startIntent = admitStartIntent({
    scope: {
      kind: "workspace",
      workspaceRoot,
      moduleName: worldModelModule.name
    },
    target: { kind: "graph_function", handle: targetHandle },
    until,
    inputBindings
  });
  const runtimeIdentity: PublicStartContext["runtimeIdentity"] = {
    workerId: "worker://odd_world_model/rc3-probe/v1",
    backendId: "backend://abiogenesis/typescript/v4.6.0-rc.3",
    buildId: "build://odd_world_model/typescript/0.1.0-proving.1",
    resolvedRuntimeRef: "runtime://abiogenesis/4.6.0-rc.3"
  };
  const resolvedPolicy: PublicStartContext["resolvedPolicy"] = {
    resolvedPolicyBundleRef: "policy-bundle://odd_world_model/rc3-probe/v1",
    defaultRegime: "F_D",
    dispatchRef: "dispatch://odd_world_model/rc3-probe/v1",
    approvalSubjectRef: null
  };
  const basis = admitExecutionBasis({
    startIntent,
    module: worldModelModule,
    runtimeIdentity,
    resolvedPolicy,
    runId: `run://odd_world_model/${targetHandle}/rc3-probe/${runRefSuffix}`,
    workKey: `work://odd_world_model/${targetHandle}/rc3-probe/${runRefSuffix}`
  });
  const runtimeDeclaration = WORLD_MODEL_RUNTIME_DECLARATIONS.find(
    (declaration) => declaration.graphFunctionRef === basis.graphFunction.id
  );
  if (runtimeDeclaration === undefined) {
    throw new Error(`missing runtime declaration for ${targetHandle}`);
  }
  const instructionAssemblyStartup = constructDefaultInstructionAssemblyStartupForBasis(basis, {
    prefix: `odd-world-model-${targetHandle.replace(/^odd_world_model\./u, "").replace(/_/gu, "-")}`,
    namespace: runtimeDeclaration.namespace,
    ownerRef: runtimeDeclaration.ownerRef,
    version: runtimeDeclaration.version,
    registryEntryRef: runtimeDeclaration.entryRef,
    declarationRef: runtimeDeclaration.declarationRef,
    interfaceRef: runtimeDeclaration.interfaceRef,
    sourceContractRef: runtimeDeclaration.sourceContractRef,
    targetContractRef: runtimeDeclaration.targetContractRef,
    contextRefs: runtimeDeclaration.contextRefs,
    authorityRefs: runtimeDeclaration.authorityRefs,
    overlayRefs: runtimeDeclaration.overlayRefs,
    provenanceRefs: runtimeDeclaration.provenanceRefs,
    readinessRefs: runtimeDeclaration.readinessRefs,
    proofRefs: runtimeDeclaration.proofRefs,
    policyRefs: runtimeDeclaration.policyRefs,
    declarationSourceRefs: runtimeDeclaration.declarationSourceRefs,
    pluginRefs: ["plugin://odd_world_model/rc3-reference-bridge/v1"],
    configSourceRefs: ["build_tenants/typescript/code/src/substrate_binding/public_start.ts"]
  }).instructionAssemblyStartup;
  const context: PublicStartContext = {
    module: worldModelModule,
    runtimeIdentity,
    resolvedPolicy,
    runtimeRegistryStartup: WORLD_MODEL_RUNTIME_REGISTRY_STARTUP,
    instructionAssemblyStartup,
    runtimeEvents: [],
    runId: `run://odd_world_model/${targetHandle}/rc3-probe/${runRefSuffix}`,
    workKey: `work://odd_world_model/${targetHandle}/rc3-probe/${runRefSuffix}`
  };
  const outcome = start(
    {
      ...startIntent,
      fh_mode: "direct",
      root_mode: until === "converged" ? "supervised" : "direct"
    },
    context,
    (event) => {
      assertCanonicalRuntimeEvent(event);
      runtimeEvents.push(event);
    },
    {
      fdEvaluator: makeWorldModelFdEvaluatorPlugin(boundEvidenceRefs),
      fpDispatch: makeWorldModelFpDispatchPlugin(boundEvidenceRefs),
      fpEvaluator: defaultFpEvaluatorPlugin
    }
  );
  assertCanonicalRuntimeEventSequence(runtimeEvents);
  const proof = Object.freeze({
    kind: "odd_world_model.public_start_proof",
    target_handle: targetHandle,
    start_intent: startIntent,
    bound_evidence_refs: boundEvidenceRefs,
    outcome,
    runtime_events: Object.freeze([...runtimeEvents]),
    event_kinds: Object.freeze(runtimeEvents.map((event) => event.kind)),
    registry_interpretation: interpretWorldModelStartupRegistry({
      startOutput: outcome,
      runtimeEvents
    })
  });
  producedPublicStartProofs.add(proof);
  return proof;
}

export function runWorldModelPublicStartProbe(
  targetHandle: PublicGraphFunctionHandle
): WorldModelPublicStartProof {
  return runWorldModelPublicStart({ targetHandle });
}
