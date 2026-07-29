import { createHash } from "node:crypto";
import { access, mkdir, readFile, realpath, stat } from "node:fs/promises";
import path from "node:path";
import {
  PythonPhysicalCutStore,
  assertCandidateMarkovObjectCutDigest,
  checkSemanticProposal,
  createAcceptedSemanticCut,
  createBoundedMeshCut,
  createContextBasis,
  createContextInvocationRecord,
  createPublishedSemanticCut,
  createSemanticProposal,
  createSemanticPublicationCandidate,
  createSourceObservation,
  decideSemanticAcceptance,
  deriveAbgAdmissionWitness,
  exactEvidenceRef,
  exactInputBinding,
  exactRefForAcceptanceDecision,
  exactRefForAdmissionWitness,
  exactRefForAttestation,
  exactRefForCheckReport,
  exactRefForPhysicalObservation,
  exactRefForPublicationCandidate,
  exactRefForPublishedCut,
  exactRefForSemanticProposal,
  exactRefForSourceObservation,
  projectWorldModelQuery,
  renderContextProjection,
  runWorldModelPublicStart,
  sha256Digest,
  validateSemanticCutAttestation,
  type AbgAdmissionWitness,
  type AcceptedSemanticCut,
  type CandidateMarkovObjectCut,
  type DeterministicPayloadCheck,
  type ExactRef,
  type PhysicalCutWritePlan,
  type PhysicalEffectObservation,
  type PublishedSemanticCut,
  type SemanticPublicationCandidate,
  type WorldModelPublicStartProof
} from "../../code/src/index.ts";
import type { JsonObject } from "../../code/src/domain/types.ts";
import type { PublicGraphFunctionHandle } from "../../code/src/gtl/graph_functions.ts";
import {
  createExampleMarkovObjects,
  examplePayload,
  prepareExample
} from "./example_catalog.ts";
import {
  assertDeploymentManifest,
  assertSandboxBuildRequest,
  createSandboxBuildSuccess,
  directoryContentDigest,
  type SandboxArtifactBundle,
  type SandboxBuildRequest,
  type SandboxBuildSuccess,
  type WorldModelDeploymentManifest
} from "./protocol.ts";

interface PublishedFlow {
  readonly proposal: ReturnType<typeof createSemanticProposal>;
  readonly proposalAdmission: AbgAdmissionWitness;
  readonly checkReport: ReturnType<typeof checkSemanticProposal>;
  readonly acceptanceDecision: ReturnType<typeof decideSemanticAcceptance>;
  readonly acceptanceAdmission: AbgAdmissionWitness;
  readonly acceptedCut: AcceptedSemanticCut;
  readonly publicationCandidate: SemanticPublicationCandidate;
  readonly publicationAdmission: AbgAdmissionWitness;
  readonly publishedCut: PublishedSemanticCut;
  readonly attestation: Parameters<typeof exactRefForAttestation>[0];
  readonly effectObservation: PhysicalEffectObservation;
  readonly physicalAdmission: AbgAdmissionWitness;
  readonly runtimeProofs: readonly WorldModelPublicStartProof[];
}

interface CarrierProof {
  readonly proof: WorldModelPublicStartProof;
  readonly admission: AbgAdmissionWitness;
}

function asJsonObject(value: unknown): JsonObject {
  return JSON.parse(JSON.stringify(value)) as JsonObject;
}

function sha256Bytes(bytes: Buffer): `sha256:${string}` {
  return `sha256:${createHash("sha256").update(bytes).digest("hex")}`;
}

async function loadDeploymentManifest(
  filePath: string,
  executingEntrypoint: string
): Promise<WorldModelDeploymentManifest> {
  const value = JSON.parse(await readFile(filePath, "utf8")) as WorldModelDeploymentManifest;
  assertDeploymentManifest(value);
  const deploymentRoot = path.dirname(filePath);
  for (const artifact of [value.package_artifact, value.storage_artifact]) {
    const artifactPath = path.resolve(deploymentRoot, artifact.relative_path);
    if (!artifactPath.startsWith(`${deploymentRoot}${path.sep}`)) {
      throw new Error(`deployment artifact escapes install root: ${artifact.relative_path}`);
    }
    const bytes = await readFile(artifactPath);
    if (bytes.byteLength !== artifact.byte_length || sha256Bytes(bytes) !== artifact.sha256) {
      throw new Error(`deployment artifact does not match manifest: ${artifact.relative_path}`);
    }
  }
  const storagePython = path.resolve(deploymentRoot, value.storage_python);
  if (!storagePython.startsWith(`${deploymentRoot}${path.sep}`)) {
    throw new Error("storage Python escapes deployment root");
  }
  await access(storagePython);
  const installedProductRoot = path.join(deploymentRoot, "product");
  const installedStoragePackage = path.resolve(deploymentRoot, value.installed_storage_package_path);
  if (!installedStoragePackage.startsWith(`${deploymentRoot}${path.sep}`)) {
    throw new Error("installed storage package escapes deployment root");
  }
  const installedPackage = JSON.parse(
    await readFile(path.join(installedProductRoot, "package.json"), "utf8")
  ) as { name?: unknown; version?: unknown };
  if (installedPackage.name !== "@odd-world-model/typescript-tenant" || installedPackage.version !== value.product_version) {
    throw new Error("installed product package identity differs from the deployment manifest");
  }
  const [actualEntrypoint, declaredEntrypoint] = await Promise.all([
    realpath(executingEntrypoint),
    realpath(path.resolve(deploymentRoot, value.installed_entrypoint))
  ]);
  if (actualEntrypoint !== declaredEntrypoint) {
    throw new Error("executing worker is not the deployment manifest entrypoint");
  }
  const [productDigest, storagePackageDigest] = await Promise.all([
    directoryContentDigest(installedProductRoot),
    directoryContentDigest(installedStoragePackage)
  ]);
  if (
    productDigest !== value.installed_product_digest ||
    storagePackageDigest !== value.installed_storage_package_digest
  ) {
    throw new Error("installed product content differs from the deployment manifest");
  }
  return value;
}

function exactDependencyIdentities(manifest: WorldModelDeploymentManifest): string[] {
  return manifest.dependencies.map((dependency) => {
    const digest = dependency.artifact_sha256 === null ? "digest-not-published" : dependency.artifact_sha256;
    return `${dependency.package_name}@${dependency.version}#${digest}`;
  });
}

function examplePayloadCheck(exampleName: string, sourceObservationRef: ExactRef): DeterministicPayloadCheck {
  return Object.freeze({
    contractRef: `sandbox-contract://odd_world_model/${exampleName}/semantic-payload/v1`,
    validate: (payload: JsonObject) => {
      if (payload.schema_kind !== "odd_world_model.example_semantic_payload") {
        throw new Error("example payload has the wrong schema kind");
      }
      if (payload.example_name !== exampleName) throw new Error("example payload identity changed");
      if (!Array.isArray(payload.candidate_markov_objects) || payload.candidate_markov_objects.length === 0) {
        throw new Error("example payload requires candidate Markov objects");
      }
      const objectRefs = new Set<string>();
      for (const value of payload.candidate_markov_objects) {
        const candidate = value as unknown as CandidateMarkovObjectCut;
        assertCandidateMarkovObjectCutDigest(candidate);
        if (candidate.publication_classification !== "candidate") {
          throw new Error("sandbox Markov objects must remain candidate-class");
        }
        if (
          candidate.source_observation.ref !== sourceObservationRef.ref ||
          candidate.source_observation.digest !== sourceObservationRef.digest
        ) {
          throw new Error(`candidate ${candidate.object_ref} changed its source observation`);
        }
        if (objectRefs.has(candidate.object_ref)) throw new Error(`duplicate candidate object ${candidate.object_ref}`);
        objectRefs.add(candidate.object_ref);
      }
      return Object.freeze([]);
    }
  });
}

function carrierProof(input: {
  readonly handle: PublicGraphFunctionHandle;
  readonly suffix: string;
  readonly subjects: readonly ExactRef[];
  readonly admissionKind: AbgAdmissionWitness["admission_kind"];
  readonly requireProbabilisticOrigin?: boolean;
}): CarrierProof {
  const proof = runWorldModelPublicStart({
    targetHandle: input.handle,
    until: "converged",
    runRefSuffix: input.suffix,
    inputBindings: input.subjects.map((subject) => exactInputBinding(subject, "sandbox_exact_carrier")),
    evidenceRefs: input.subjects.map(exactEvidenceRef)
  });
  if (proof.outcome.kind !== "converged") throw new Error(`${input.handle} did not converge`);
  const admission = deriveAbgAdmissionWitness({
    witnessRef: `admission-witness://odd_world_model/sandbox/${input.suffix}`,
    admissionKind: input.admissionKind,
    subjects: input.subjects,
    proof,
    ...(input.requireProbabilisticOrigin === undefined
      ? {}
      : { requireProbabilisticOrigin: input.requireProbabilisticOrigin })
  });
  return Object.freeze({ proof, admission });
}

async function publishExample(input: {
  readonly request: SandboxBuildRequest;
  readonly manifest: WorldModelDeploymentManifest;
  readonly sourceObservation: ReturnType<typeof createSourceObservation>;
  readonly payload: JsonObject;
  readonly authorityRef: string;
  readonly fidelity: "lossy_projection";
  readonly losses: readonly string[];
  readonly exclusions: readonly string[];
  readonly storagePython: string;
}): Promise<PublishedFlow> {
  const slug = input.request.example_name;
  const proposal = createSemanticProposal({
    schema_kind: "odd_world_model.semantic_proposal",
    schema_version: "v1",
    proposal_ref: `semantic-proposal://odd_world_model/sandbox/${slug}/v1`,
    source_observation: exactRefForSourceObservation(input.sourceObservation),
    proposed_by: `fixture-capability://odd_world_model/${slug}/retained-example-descriptor/v1`,
    payload_schema_ref: `sandbox-contract://odd_world_model/${slug}/semantic-payload/v1`,
    payload: input.payload,
    epistemic_status: "candidate",
    created_at: input.request.observed_at
  });
  const proposalRef = exactRefForSemanticProposal(proposal);
  const sourceRef = exactRefForSourceObservation(input.sourceObservation);
  const proposalCarrier = carrierProof({
    handle: "odd_world_model.publish_domain_model",
    suffix: `${slug}-proposal-v1`,
    subjects: [sourceRef, proposalRef],
    admissionKind: "proposal_evidence",
    requireProbabilisticOrigin: true
  });
  const checkReport = checkSemanticProposal({
    checkRef: `deterministic-check://odd_world_model/sandbox/${slug}/v1`,
    proposal,
    sourceObservation: input.sourceObservation,
    payloadChecks: [examplePayloadCheck(slug, sourceRef)],
    checkedAt: input.request.observed_at
  });
  const acceptanceDecision = decideSemanticAcceptance({
    decisionRef: `wm-acceptance://odd_world_model/sandbox/${slug}/v1`,
    proposal,
    checkReport,
    proposalAdmission: proposalCarrier.admission,
    authorityRef: input.authorityRef,
    disposition: "accepted",
    rationale: "the retained example descriptor, exact source inventory, candidate status, and deterministic payload contract passed",
    decidedAt: input.request.observed_at
  });
  const checkRef = exactRefForCheckReport(checkReport);
  const decisionRef = exactRefForAcceptanceDecision(acceptanceDecision);
  const acceptanceCarrier = carrierProof({
    handle: "odd_world_model.publish_domain_model",
    suffix: `${slug}-acceptance-v1`,
    subjects: [checkRef, decisionRef],
    admissionKind: "acceptance_evidence",
    requireProbabilisticOrigin: true
  });
  const acceptedCut = createAcceptedSemanticCut({
    proposal,
    checkReport,
    proposalAdmission: proposalCarrier.admission,
    acceptanceDecision,
    acceptanceAdmission: acceptanceCarrier.admission,
    cut: {
      semanticCutRef: `semantic-cut://odd_world_model/sandbox/${slug}/v1`,
      cutRole: "domain_artifact",
      cutVersion: "v1",
      governingRefs: [
        "specification/PRODUCT.md",
        "specification/requirements/40-domain-build-verification.md",
        "build_tenants/common/design/adrs/ADR-WM-006-versioned-installed-product-example-sandboxes.md"
      ],
      sourceRefs: [input.sourceObservation.source.ref],
      authorityRefs: [input.authorityRef],
      dependencyIdentities: exactDependencyIdentities(input.manifest),
      temporalCoordinates: {
        observed_at: input.sourceObservation.observed_at,
        accepted_at: input.request.observed_at
      },
      fidelity: input.fidelity,
      losses: [...input.losses],
      exclusions: [...input.exclusions],
      acceptedAt: input.request.observed_at
    }
  });

  const physicalRoot = path.join(input.request.instance_root, "physical", "runtime");
  await mkdir(physicalRoot, { recursive: true });
  const deploymentRoot = path.dirname(input.request.deployment_manifest_path);
  const store = new PythonPhysicalCutStore({
    pythonExecutable: input.storagePython,
    moduleRoot: deploymentRoot,
    environment: {
      OWM_ICEBERG_CATALOG_NAME: `odd_world_model_${slug}`,
      OWM_ICEBERG_CATALOG_URI: `sqlite:///${path.join(physicalRoot, "catalog.db")}`,
      OWM_ICEBERG_WAREHOUSE_URI: `file://${path.join(physicalRoot, "warehouse")}`,
      OWM_STORAGE_RECEIPT_ROOT: path.join(physicalRoot, "receipts"),
      OWM_STORAGE_PROFILE_REF: "local-pyiceberg-v1"
    }
  });
  const writePlan: PhysicalCutWritePlan = {
    write_request_id: `write://odd_world_model/sandbox/${slug}/v1`,
    storage_profile_ref: "local-pyiceberg-v1",
    accepted_cut: acceptedCut,
    acceptance_admission: acceptanceCarrier.admission,
    tables: [{
      table_identifier: "wm.semantic_publications",
      records: [
        {
          record_id: proposal.proposal_ref,
          record_kind: "semantic_proposal",
          payload: asJsonObject(proposal)
        },
        {
          record_id: acceptedCut.semantic_cut_ref,
          record_kind: "accepted_semantic_cut",
          payload: asJsonObject(acceptedCut)
        }
      ]
    }]
  };
  const writeResult = await store.writeCut(writePlan);
  if (writeResult.effect_status === "failed") throw new Error(writeResult.gap.message);
  validateSemanticCutAttestation(writeResult.attestation);
  if (writeResult.effect_observation.observation_status !== "reproduced") {
    throw new Error("physical effect was not independently reproduced");
  }
  const physicalSubjects = [
    exactRefForAttestation(writeResult.attestation),
    exactRefForPhysicalObservation(writeResult.effect_observation)
  ];
  const physicalCarrier = carrierProof({
    handle: "odd_world_model.query_world_model",
    suffix: `${slug}-physical-v1`,
    subjects: physicalSubjects,
    admissionKind: "physical_effect"
  });
  const publicationCandidate = createSemanticPublicationCandidate({
    acceptedCut,
    attestation: writeResult.attestation,
    effectObservation: writeResult.effect_observation,
    physicalAdmission: physicalCarrier.admission
  });
  const candidateRef = exactRefForPublicationCandidate(publicationCandidate);
  const publicationCarrier = carrierProof({
    handle: "odd_world_model.publish_domain_model",
    suffix: `${slug}-publication-v1`,
    subjects: [candidateRef],
    admissionKind: "published_cut",
    requireProbabilisticOrigin: true
  });
  const publishedCut = createPublishedSemanticCut({
    candidate: publicationCandidate,
    publicationAdmission: publicationCarrier.admission,
    publishedAt: input.request.observed_at
  });
  return Object.freeze({
    proposal,
    proposalAdmission: proposalCarrier.admission,
    checkReport,
    acceptanceDecision,
    acceptanceAdmission: acceptanceCarrier.admission,
    acceptedCut,
    publicationCandidate,
    publicationAdmission: publicationCarrier.admission,
    publishedCut,
    attestation: writeResult.attestation,
    effectObservation: writeResult.effect_observation,
    physicalAdmission: physicalCarrier.admission,
    runtimeProofs: Object.freeze([
      proposalCarrier.proof,
      acceptanceCarrier.proof,
      physicalCarrier.proof,
      publicationCarrier.proof
    ])
  });
}

export async function buildReferenceSandbox(
  request: SandboxBuildRequest,
  executingEntrypoint: string
): Promise<SandboxBuildSuccess> {
  assertSandboxBuildRequest(request);
  const [sourceStat, instanceStat, sourceRoot, instanceRoot] = await Promise.all([
    stat(request.source_root),
    stat(request.instance_root),
    realpath(request.source_root),
    realpath(request.instance_root)
  ]);
  if (!sourceStat.isDirectory() || !instanceStat.isDirectory()) {
    throw new Error("source_root and instance_root must be existing directories");
  }
  if (
    instanceRoot === sourceRoot ||
    instanceRoot.startsWith(`${sourceRoot}${path.sep}`) ||
    sourceRoot.startsWith(`${instanceRoot}${path.sep}`)
  ) {
    throw new Error("source and instance roots must be disjoint");
  }
  const manifest = await loadDeploymentManifest(request.deployment_manifest_path, executingEntrypoint);
  const deploymentRoot = path.dirname(request.deployment_manifest_path);
  const canonicalDeploymentRoot = await realpath(deploymentRoot);
  if (
    instanceRoot === canonicalDeploymentRoot ||
    instanceRoot.startsWith(`${canonicalDeploymentRoot}${path.sep}`) ||
    canonicalDeploymentRoot.startsWith(`${instanceRoot}${path.sep}`)
  ) {
    throw new Error("deployment and instance roots must be disjoint");
  }
  const storagePython = path.resolve(deploymentRoot, manifest.storage_python);
  const prepared = await prepareExample(request.example_name, request.source_root);
  const sourceObservation = createSourceObservation({
    schema_kind: "odd_world_model.source_observation",
    schema_version: "v1",
    observation_ref: `source-observation://odd_world_model/sandbox/${request.example_name}/v1`,
    source: prepared.source_ref,
    source_kind: prepared.source_kind,
    authority_ref: prepared.authority_ref,
    evidence_refs: [...prepared.evidence_refs],
    observed_at: request.observed_at
  });
  const markovObjects = createExampleMarkovObjects(prepared, sourceObservation, request.observed_at);
  const payload = examplePayload(prepared, markovObjects);
  const flow = await publishExample({
    request,
    manifest,
    sourceObservation,
    payload,
    authorityRef: prepared.authority_ref,
    fidelity: prepared.fidelity,
    losses: prepared.losses,
    exclusions: prepared.exclusions,
    storagePython
  });
  const publishedRef = exactRefForPublishedCut(flow.publishedCut);
  const mesh = createBoundedMeshCut({
    schema_kind: "odd_world_model.bounded_mesh_cut",
    schema_version: "v1",
    mesh_cut_ref: `mesh-cut://odd_world_model/sandbox/${request.example_name}/v1`,
    interaction_goal: `inspect the ${request.example_name} world-model instance built by ${manifest.product_version}`,
    scope_ref: `mesh-scope://odd_world_model/sandbox/${request.example_name}/v1`,
    selection_policy_ref: "selection-policy://odd_world_model/sandbox/roots-only/v1",
    root_refs: [publishedRef],
    relation_selectors: ["references"],
    closure_rule: "roots_only",
    excluded_refs: [],
    resolved_at: request.observed_at
  }, [flow.publishedCut], []);
  const meshRef: ExactRef = { ref: mesh.mesh_cut_ref, digest: mesh.mesh_cut_digest };
  const meshCarrier = carrierProof({
    handle: "odd_world_model.resolve_mesh_cut",
    suffix: `${request.example_name}-mesh-v1`,
    subjects: [meshRef],
    admissionKind: "published_cut"
  });
  const basis = createContextBasis({
    schema_kind: "odd_world_model.context_basis",
    schema_version: "v1",
    basis_ref: `context-basis://odd_world_model/sandbox/${request.example_name}/v1`,
    projection_contract_ref: "projection-contract://odd_world_model/sandbox/canonical-semantic-cut/v1",
    projection_contract_version: "v1",
    temporal_coordinates: {
      source_observed_at: sourceObservation.observed_at,
      context_as_of: request.observed_at
    },
    source_authority_refs: [prepared.authority_ref],
    semantic_authority_refs: [prepared.authority_ref, flow.publicationAdmission.witness_ref],
    resolved_at: request.observed_at,
    freshness_policy_ref: "freshness-policy://odd_world_model/exact-dependency-digest/v1",
    freshness_evaluated_at: request.observed_at,
    declared_losses: [...prepared.losses],
    truncation_limit_ref: "context-window://odd_world_model/sandbox/32-items",
    truncation_max_items: 32
  }, mesh, [flow.publishedCut], []);
  const projection = renderContextProjection({
    projectionRef: `context-projection://odd_world_model/sandbox/${request.example_name}/v1`,
    basis,
    rendererRef: "renderer://odd_world_model/context-projection/canonical-json/v1",
    items: [{ exact_ref: publishedRef, content: payload }],
    createdAt: request.observed_at
  });
  const projectionRef: ExactRef = {
    ref: projection.projection_ref,
    digest: projection.projection_digest
  };
  const basisRef: ExactRef = { ref: basis.basis_ref, digest: basis.basis_digest };
  const contextCarrier = carrierProof({
    handle: "odd_world_model.project_context",
    suffix: `${request.example_name}-context-v1`,
    subjects: [basisRef, projectionRef],
    admissionKind: "context_projection"
  });
  const modelOutput: ExactRef = {
    ref: `proposal://odd_world_model/sandbox/${request.example_name}/interpretation/v1`,
    digest: sha256Digest({
      example_name: request.example_name,
      candidate_object_refs: markovObjects.map((candidate) => candidate.object_ref),
      context_basis: basisRef,
      conclusion: "reference transport completed; semantic authorship remains fixture-calibrated"
    })
  };
  const invocationCarrier = carrierProof({
    handle: "odd_world_model.interpret_context",
    suffix: `${request.example_name}-interpretation-v1`,
    subjects: [basisRef, projectionRef, modelOutput],
    admissionKind: "model_invocation",
    requireProbabilisticOrigin: true
  });
  const contextCatalog = {
    catalogRef: `context-dependency-catalog://odd_world_model/sandbox/${request.example_name}/v1`,
    meshCut: mesh,
    publishedCuts: [flow.publishedCut],
    semanticLinks: [],
    projectionContracts: [{
      ref: basis.projection_contract_ref,
      version: basis.projection_contract_version
    }]
  } as const;
  const invocation = createContextInvocationRecord({
    schema_kind: "odd_world_model.context_invocation_record",
    schema_version: "v1",
    invocation_ref: `context-invocation://odd_world_model/sandbox/${request.example_name}/v1`,
    context_basis: basisRef,
    context_projection: projectionRef,
    model_identity: "model-capability://odd_world_model/reference-sandbox-interpreter/v1",
    model_role: "F_P",
    invoked_at: request.observed_at,
    completed_at: request.observed_at,
    output_digest: modelOutput.digest,
    output_proposal_ref: modelOutput.ref
  }, basis, projection, invocationCarrier.admission, contextCatalog);
  const queryCarrier = carrierProof({
    handle: "odd_world_model.query_world_model",
    suffix: `${request.example_name}-query-v1`,
    subjects: [publishedRef, basisRef, projectionRef],
    admissionKind: "published_cut"
  });
  const query = projectWorldModelQuery({
    queryRef: `query://odd_world_model/sandbox/${request.example_name}/v1`,
    queryContract: {
      contract_ref: "query-contract://odd_world_model/sandbox/instance-summary/v1",
      version: "v1",
      scope_ref: `query-scope://odd_world_model/sandbox/${request.example_name}/v1`,
      selection_policy_ref: "selection-policy://odd_world_model/sandbox/roots-only/v1",
      root_refs: [publishedRef],
      relation_selectors: ["references"],
      closure_rule: "roots_only"
    },
    basis,
    projection,
    basisMeshCut: mesh,
    publishedCuts: [flow.publishedCut],
    semanticLinks: [],
    publishedCut: flow.publishedCut,
    physicalAdmission: flow.physicalAdmission,
    attestation: flow.attestation,
    projectedAt: request.observed_at
  });
  const admissions = Object.freeze([
    flow.proposalAdmission,
    flow.acceptanceAdmission,
    flow.physicalAdmission,
    flow.publicationAdmission,
    meshCarrier.admission,
    contextCarrier.admission,
    invocationCarrier.admission,
    queryCarrier.admission
  ]);
  const runtimeProofs = [
    ...flow.runtimeProofs,
    meshCarrier.proof,
    contextCarrier.proof,
    invocationCarrier.proof,
    queryCarrier.proof
  ];
  const runtimeEvents = runtimeProofs.flatMap((proof) => proof.runtime_events.map(asJsonObject));
  const artifacts: SandboxArtifactBundle = Object.freeze({
    source_inventory: asJsonObject(prepared.inventory),
    source_observation: asJsonObject(sourceObservation),
    candidate_markov_objects: Object.freeze(markovObjects.map(asJsonObject)),
    semantic_proposal: asJsonObject(flow.proposal),
    deterministic_check: asJsonObject(flow.checkReport),
    acceptance_decision: asJsonObject(flow.acceptanceDecision),
    accepted_semantic_cut: asJsonObject(flow.acceptedCut),
    semantic_publication_candidate: asJsonObject(flow.publicationCandidate),
    published_semantic_cut: asJsonObject(flow.publishedCut),
    semantic_cut_attestation: asJsonObject(flow.attestation),
    physical_effect_observation: asJsonObject(flow.effectObservation),
    bounded_mesh_cut: asJsonObject(mesh),
    context_basis: asJsonObject(basis),
    context_projection: asJsonObject(projection),
    context_invocation: asJsonObject(invocation),
    world_model_query: asJsonObject(query),
    admission_witnesses: Object.freeze(admissions.map(asJsonObject)),
    runtime_events: Object.freeze(runtimeEvents)
  });
  return createSandboxBuildSuccess({
    schema_kind: "odd_world_model.sandbox_build_result",
    schema_version: "v1",
    protocol_version: "v1",
    status: "built",
    instance_ref: request.instance_ref,
    example_name: request.example_name,
    deployment_ref: manifest.deployment_ref,
    deployment_manifest_digest: manifest.manifest_digest,
    source_inventory_ref: prepared.inventory.inventory_ref,
    source_inventory_digest: prepared.inventory.inventory_digest,
    execution_mode: "installed_rc3_reference_kernel",
    artifacts,
    gaps: Object.freeze([
      {
        gap_type: "native_graph_payload_execution_not_realized",
        message: "the installed rc.3 GraphFunctions carry exact refs but the sandbox reference kernel executes the WM semantic transforms",
        retryable: false,
        evidence_refs: [manifest.deployment_ref]
      },
      {
        gap_type: "calibrated_fp_authorship_not_proven",
        message: "candidate semantics are supplied by the retained example descriptor rather than authored by a production F_P model",
        retryable: false,
        evidence_refs: [prepared.inventory.inventory_ref]
      },
      {
        gap_type: "semantic_state_projection_not_replay_native",
        message: "accepted and published WM states are local projections over replay-derived witnesses in the rc.3 reference bridge",
        retryable: false,
        evidence_refs: admissions.map((admission) => admission.witness_ref)
      }
    ]),
    built_at: request.observed_at
  });
}
