// Candidate contract evidence for context memory, mesh, and physical publication.
// This reference slice does not close the full ledger, Markov-evidence, or F_P-authorship proof laws.
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import {
  PythonPhysicalCutStore,
  assertSemanticLinkCatalog,
  calculateAffectedClosure,
  checkSemanticProposal,
  candidateMarkovObjectPayloadCheck,
  createAcceptedSemanticCut,
  createBoundedMeshCut,
  createCandidateMarkovObjectCut,
  createComposedWorldModel,
  createContextBasis,
  createContextInvocationRecord,
  createPublishedSemanticCut,
  createSemanticPublicationCandidate,
  createSemanticLinkProposal,
  createSemanticProposal,
  createSourceObservation,
  decideSemanticAcceptance,
  deriveAbgAdmissionWitness,
  detectContextStaleness,
  exactEvidenceRef,
  exactInputBinding,
  exactRefForAcceptanceDecision,
  exactRefForCheckReport,
  exactRefForAttestation,
  exactRefForPhysicalObservation,
  exactRefForPublicationCandidate,
  exactRefForPublishedCut,
  exactRefForSemanticProposal,
  exactRefForSemanticLink,
  exactRefForSemanticLinkProposal,
  exactRefForSourceObservation,
  fpmlTradeObservationPayloadCheck,
  parseFpmlTrade,
  publishSemanticLink,
  projectWorldModelQuery,
  renderContextProjection,
  runWorldModelPublicStart,
  sha256Digest,
  validateSemanticCutAttestation,
  type AcceptedSemanticCut,
  type AbgAdmissionWitness,
  type DeterministicCheckReport,
  type DeterministicPayloadCheck,
  type ExactRef,
  type PhysicalEffectObservation,
  type PhysicalCutWritePlan,
  type PublishedSemanticCut,
  type SemanticProposal,
  type SemanticLink,
  type SemanticLinkProposal,
  type SemanticPublicationCandidate,
  type SourceObservation,
  type WmAcceptanceDecision,
  type WorldModelPublicStartProof
} from "../../code/src/index.ts";
import type { JsonObject } from "../../code/src/domain/types.ts";
import type { PublicGraphFunctionHandle } from "../../code/src/gtl/graph_functions.ts";
import { loadCommonSchemaValidator } from "./support/common_schema_validator.ts";

const testDir = path.dirname(fileURLToPath(import.meta.url));
const tenantRoot = path.resolve(testDir, "../..");
const storageTenant = path.resolve(tenantRoot, "../storage/python");
const storagePython = path.join(storageTenant, ".venv/bin/python");
const schemaRoot = path.resolve(tenantRoot, "../common/schemas");
const at = "2026-07-12T00:00:00Z";
const revisedAt = "2026-07-12T00:05:00Z";

function jsonObject(value: unknown): JsonObject {
  return JSON.parse(JSON.stringify(value)) as JsonObject;
}

interface PublishedFlow {
  readonly proposal: SemanticProposal;
  readonly proposalAdmission: AbgAdmissionWitness;
  readonly checkReport: DeterministicCheckReport;
  readonly acceptanceDecision: WmAcceptanceDecision;
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

interface AdmittedCarrier {
  readonly admission: AbgAdmissionWitness;
  readonly proof: WorldModelPublicStartProof;
}

interface PublishedLinkBatch {
  readonly links: readonly SemanticLink[];
  readonly carrier: AdmittedCarrier;
}

function runtimeEventIdentity(event: unknown): string | null {
  if (event === null || typeof event !== "object" || Array.isArray(event)) return null;
  const record = event as Record<string, unknown>;
  return typeof record.eventId === "string"
    ? record.eventId
    : typeof record.eventRef === "string" ? record.eventRef : null;
}

function persistedRuntimeClosure(
  admission: AbgAdmissionWitness,
  proof: WorldModelPublicStartProof
) {
  const required = new Set(admission.runtime_event_refs);
  const events = proof.runtime_events.filter((event) => {
    const eventRef = runtimeEventIdentity(event);
    return eventRef !== null && required.has(eventRef);
  });
  const persisted = new Set(events.map(runtimeEventIdentity).filter((ref): ref is string => ref !== null));
  const missing = admission.runtime_event_refs.filter((eventRef) => !persisted.has(eventRef));
  if (missing.length > 0) {
    throw new Error(`runtime proof for ${admission.witness_ref} lacks ${missing.join(", ")}`);
  }
  return Object.freeze({
    witness_ref: admission.witness_ref,
    target_handle: proof.target_handle,
    event_count: events.length,
    events: Object.freeze(events)
  });
}

function persistedPublishedFlow(flow: PublishedFlow) {
  const { runtimeProofs: _runtimeProofs, ...evidence } = flow;
  return evidence;
}

async function publishThroughAbgAndStorage(input: {
  readonly slug: string;
  readonly sourceObservation: SourceObservation;
  readonly payloadCheck: DeterministicPayloadCheck;
  readonly payload: JsonObject;
  readonly cutRole: AcceptedSemanticCut["cut_role"];
  readonly store: PythonPhysicalCutStore;
  readonly occurredAt?: string;
}): Promise<PublishedFlow> {
  const occurredAt = input.occurredAt ?? at;
  const proposal = createSemanticProposal({
    schema_kind: "odd_world_model.semantic_proposal",
    schema_version: "v1",
    proposal_ref: `semantic-proposal://odd_world_model/${input.slug}/v1`,
    source_observation: exactRefForSourceObservation(input.sourceObservation),
    proposed_by: "model-capability://odd_world_model/semantic-constructor/fixture-v1",
    payload_schema_ref: input.payloadCheck.contractRef,
    payload: input.payload,
    epistemic_status: "candidate",
    created_at: occurredAt
  });
  const proposalRef = exactRefForSemanticProposal(proposal);
  const sourceObservationRef = exactRefForSourceObservation(input.sourceObservation);
  const semanticSubjects = [sourceObservationRef, proposalRef];
  const publicationProof = runWorldModelPublicStart({
    targetHandle: "odd_world_model.publish_domain_model",
    until: "converged",
    runRefSuffix: `${input.slug}-semantic-publication-v1`,
    inputBindings: [
      exactInputBinding(sourceObservationRef, "observed_source_evidence"),
      exactInputBinding(proposalRef, "constructed_domain_semantics")
    ],
    evidenceRefs: semanticSubjects.map(exactEvidenceRef)
  });
  const proposalAdmission = deriveAbgAdmissionWitness({
    witnessRef: `admission-witness://odd_world_model/${input.slug}/proposal/v1`,
    admissionKind: "proposal_evidence",
    subjects: semanticSubjects,
    proof: publicationProof,
    requireProbabilisticOrigin: true
  });
  assert.equal(publicationProof.outcome.kind, "converged");
  assert.equal(proposalAdmission.vector_closed_event_refs.length, 5);
  const check = checkSemanticProposal({
    checkRef: `deterministic-check://odd_world_model/${input.slug}/v1`,
    proposal,
    sourceObservation: input.sourceObservation,
    payloadChecks: [input.payloadCheck],
    checkedAt: occurredAt
  });
  const decision = decideSemanticAcceptance({
    decisionRef: `wm-acceptance://odd_world_model/${input.slug}/v1`,
    proposal,
    checkReport: check,
    proposalAdmission,
    authorityRef: "authority://odd_world_model/trade-semantics/v1",
    disposition: "accepted",
    rationale: "the exact source, candidate-only classification, and payload contract passed",
    decidedAt: occurredAt
  });
  const decisionRef = exactRefForAcceptanceDecision(decision);
  const checkRef = exactRefForCheckReport(check);
  const acceptanceSubjects = [checkRef, decisionRef];
  const acceptanceProof = runWorldModelPublicStart({
    targetHandle: "odd_world_model.publish_domain_model",
    until: "converged",
    runRefSuffix: `${input.slug}-acceptance-admission-v1`,
    inputBindings: [
      exactInputBinding(checkRef, "deterministic_check_report"),
      exactInputBinding(decisionRef, "wm_acceptance_decision")
    ],
    evidenceRefs: acceptanceSubjects.map(exactEvidenceRef)
  });
  const acceptanceAdmission = deriveAbgAdmissionWitness({
    witnessRef: `admission-witness://odd_world_model/${input.slug}/acceptance/v1`,
    admissionKind: "acceptance_evidence",
    subjects: acceptanceSubjects,
    proof: acceptanceProof,
    requireProbabilisticOrigin: true
  });
  const acceptedCut = createAcceptedSemanticCut({
    proposal,
    checkReport: check,
    proposalAdmission,
    acceptanceDecision: decision,
    acceptanceAdmission,
    cut: {
      semanticCutRef: `semantic-cut://odd_world_model/${input.slug}/v1`,
      cutRole: input.cutRole,
      cutVersion: "v1",
      governingRefs: [
        "specification/PRODUCT.md",
        "specification/requirements/40-domain-build-verification.md"
      ],
      sourceRefs: [input.sourceObservation.source.ref],
      authorityRefs: ["authority://odd_world_model/trade-semantics/v1"],
      dependencyIdentities: [
        "@abiogenesis/typescript-tenant@4.6.0-rc.3",
        "@odd-glc/route-one-typescript@0.1.0",
        "fast-xml-parser@5.10.0",
        "fast-xml-validator@1.2.0",
        "pyiceberg@0.11.1"
      ],
      temporalCoordinates: { observed_at: input.sourceObservation.observed_at, accepted_at: occurredAt },
      fidelity: "lossless_projection",
      losses: [],
      exclusions: [],
      acceptedAt: occurredAt
    }
  });
  const writePlan: PhysicalCutWritePlan = {
    write_request_id: `write://odd_world_model/${input.slug}/v1`,
    storage_profile_ref: "local-pyiceberg-v1",
    accepted_cut: acceptedCut,
    acceptance_admission: acceptanceAdmission,
    tables: [
      {
        table_identifier: "wm.semantic_publications",
        records: [
          {
            record_id: proposal.proposal_ref,
            record_kind: "semantic_proposal",
            payload: jsonObject(proposal)
          },
          {
            record_id: acceptedCut.semantic_cut_ref,
            record_kind: "accepted_semantic_cut",
            payload: jsonObject(acceptedCut)
          }
        ]
      }
    ]
  };
  const writeResult = await input.store.writeCut(writePlan);
  if (writeResult.effect_status === "failed") assert.fail(writeResult.gap.message);
  validateSemanticCutAttestation(writeResult.attestation);
  assert.equal(writeResult.effect_observation.observation_status, "reproduced");
  const physicalSubjects = [
    exactRefForAttestation(writeResult.attestation),
    exactRefForPhysicalObservation(writeResult.effect_observation)
  ];
  const physicalProof = runWorldModelPublicStart({
    targetHandle: "odd_world_model.query_world_model",
    until: "converged",
    runRefSuffix: `${input.slug}-physical-admission-v1`,
    inputBindings: physicalSubjects.map((subject) => exactInputBinding(subject, "physical_effect_evidence")),
    evidenceRefs: physicalSubjects.map(exactEvidenceRef)
  });
  const physicalAdmission = deriveAbgAdmissionWitness({
    witnessRef: `admission-witness://odd_world_model/${input.slug}/physical-effect/v1`,
    admissionKind: "physical_effect",
    subjects: physicalSubjects,
    proof: physicalProof
  });
  const publicationCandidate = createSemanticPublicationCandidate({
    acceptedCut,
    attestation: writeResult.attestation,
    effectObservation: writeResult.effect_observation,
    physicalAdmission
  });
  const publicationCandidateRef = exactRefForPublicationCandidate(publicationCandidate);
  const finalPublicationProof = runWorldModelPublicStart({
    targetHandle: "odd_world_model.publish_domain_model",
    until: "converged",
    runRefSuffix: `${input.slug}-final-publication-v1`,
    inputBindings: [exactInputBinding(publicationCandidateRef, "semantic_publication_candidate")],
    evidenceRefs: [exactEvidenceRef(publicationCandidateRef)]
  });
  const publicationAdmission = deriveAbgAdmissionWitness({
    witnessRef: `admission-witness://odd_world_model/${input.slug}/publication/v1`,
    admissionKind: "published_cut",
    subjects: [publicationCandidateRef],
    proof: finalPublicationProof,
    requireProbabilisticOrigin: true
  });
  const publishedCut = createPublishedSemanticCut({
    candidate: publicationCandidate,
    publicationAdmission,
    publishedAt: occurredAt
  });
  return {
    proposal,
    proposalAdmission,
    checkReport: check,
    acceptanceDecision: decision,
    acceptanceAdmission,
    acceptedCut,
    publicationCandidate,
    publicationAdmission,
    publishedCut,
    attestation: writeResult.attestation,
    effectObservation: writeResult.effect_observation,
    physicalAdmission,
    runtimeProofs: Object.freeze([
      publicationProof,
      acceptanceProof,
      physicalProof,
      finalPublicationProof
    ])
  };
}

function admitDeterministicCarrier(input: {
  readonly handle: PublicGraphFunctionHandle;
  readonly slug: string;
  readonly subjects: readonly ExactRef[];
  readonly admissionKind: AbgAdmissionWitness["admission_kind"];
}): AdmittedCarrier {
  const proof = runWorldModelPublicStart({
    targetHandle: input.handle,
    until: "converged",
    runRefSuffix: `${input.slug}-v1`,
    inputBindings: input.subjects.map((subject) => exactInputBinding(subject, "wm_exact_carrier")),
    evidenceRefs: input.subjects.map(exactEvidenceRef)
  });
  assert.equal(proof.outcome.kind, "converged");
  const admission = deriveAbgAdmissionWitness({
    witnessRef: `admission-witness://odd_world_model/${input.slug}/v1`,
    admissionKind: input.admissionKind,
    subjects: input.subjects,
    proof
  });
  return Object.freeze({ admission, proof });
}

function publishLinkBatch(input: {
  readonly slug: string;
  readonly proposals: readonly SemanticLinkProposal[];
  readonly publishedAt: string;
}): PublishedLinkBatch {
  const carrier = admitDeterministicCarrier({
    handle: "odd_world_model.publish_semantic_links",
    slug: input.slug,
    subjects: input.proposals.map(exactRefForSemanticLinkProposal),
    admissionKind: "published_cut"
  });
  const links = Object.freeze(input.proposals.map((proposal) => publishSemanticLink({
    proposal,
    publicationAdmission: carrier.admission,
    publishedAt: input.publishedAt
  })));
  assertSemanticLinkCatalog(links);
  return Object.freeze({ links, carrier });
}

test("reference slice binds FpML semantics to ABG admissions before WM acceptance, physical publication, context, and query", async () => {
  const fpmlSourcePath = path.resolve(
    tenantRoot,
    "../../examples/trade_source_model/sources/data/authority/com-ex28-gas-swap-daily-delivery-prices-option-last.xml"
  );
  const fpml = await parseFpmlTrade(fpmlSourcePath);
  assert.ok(fpml.trade_id.length > 0);
  assert.ok(fpml.product.leg_count > 0);
  const source: ExactRef = {
    ref: "source://odd_world_model/fpml/com-ex28.xml",
    digest: `sha256:${createHash("sha256").update(readFileSync(fpmlSourcePath)).digest("hex")}`,
    version: fpml.fpml_version
  };
  const sourceObservation = createSourceObservation({
    schema_kind: "odd_world_model.source_observation",
    schema_version: "v1",
    observation_ref: "source-observation://odd_world_model/fpml/com-ex28/v1",
    source,
    source_kind: "fpml_confirmation",
    authority_ref: "authority://fpml/official-example-corpus",
    evidence_refs: [fpmlSourcePath],
    observed_at: at
  });
  const candidateMarkov = createCandidateMarkovObjectCut({
    schema_kind: "odd_world_model.candidate_markov_object_cut",
    schema_version: "v1",
    object_ref: `markov-object://odd_world_model/trade/${fpml.trade_id}/v1`,
    object_identity: fpml.trade_id,
    identity_direction: {
      source_state_refs: [`fpml-trade://${fpml.trade_id}/confirmation`],
      target_state_refs: [`wm-trade://${fpml.trade_id}/interpreted`],
      projection_ref: "projection://odd_world_model/fpml-to-trade-state/v1"
    },
    projection_support_refs: fpml.product.legs.map((leg) => `fpml-leg://${leg.leg_id}`),
    distributed_ledger_evidence_refs: [
      `ledger-entry://odd_world_model/${fpml.trade_id}/trade-id`,
      `ledger-entry://odd_world_model/${fpml.trade_id}/trade-date`
    ],
    candidate_basis: {
      ref: `candidate-basis://odd_world_model/${fpml.trade_id}/interpreted`,
      digest: sha256Digest(fpml)
    },
    null_peer_basis: {
      ref: `null-peer-basis://odd_world_model/${fpml.trade_id}/uninterpreted`,
      digest: sha256Digest({ trade_id: fpml.trade_id, interpretation: null })
    },
    held_out_treatment_verification: {
      treatment_ref: "treatment://odd_world_model/fpml-confirmation-interpretation/v1",
      corpus_ref: "corpus://odd_world_model/fpml-held-out/com-ex28/v1",
      result: "inconclusive",
      evidence_refs: [source.ref, `trade-id://${fpml.trade_id}`]
    },
    boundary: {
      included_refs: ["fpml://tradeHeader", "fpml://commoditySwap", "fpml://party"],
      excluded_refs: ["fpml://documentation/non-economic-commentary"],
      rationale: "the first slice retains identity, economics, parties, and lifecycle dates"
    },
    publication_classification: "candidate",
    source_observation: exactRefForSourceObservation(sourceObservation),
    authority_ref: "authority://odd_world_model/trade-semantics/v1",
    created_at: at
  });
  const { cut_digest: _candidateDigest, ...candidateInput } = candidateMarkov;
  const commonModelCandidate = createCandidateMarkovObjectCut({
    ...candidateInput,
    object_ref: "markov-object://odd_world_model/common/trade-lifecycle/v1",
    object_identity: "common-trade-lifecycle",
    identity_direction: {
      source_state_refs: ["common-trade://observed"],
      target_state_refs: ["common-trade://interpreted"],
      projection_ref: "projection://odd_world_model/common-trade-lifecycle/v1"
    },
    candidate_basis: {
      ref: "candidate-basis://odd_world_model/common-trade-lifecycle/v1",
      digest: sha256Digest({ fpml_version: fpml.fpml_version, lifecycle: "trade" })
    },
    null_peer_basis: {
      ref: "null-peer-basis://odd_world_model/common-trade-lifecycle/v1",
      digest: sha256Digest({ lifecycle: null })
    },
    boundary: {
      included_refs: ["common://trade/identity", "common://trade/lifecycle-state"],
      excluded_refs: ["common://trade/product-specific-economics"],
      rationale: "the common model carries reusable trade identity and lifecycle semantics only"
    }
  });
  const revisedCandidateMarkov = createCandidateMarkovObjectCut({
    ...candidateInput,
    object_ref: `markov-object://odd_world_model/trade/${fpml.trade_id}/v2`,
    identity_direction: {
      ...candidateMarkov.identity_direction,
      projection_ref: "projection://odd_world_model/fpml-to-trade-state/v2"
    },
    candidate_basis: {
      ref: `candidate-basis://odd_world_model/${fpml.trade_id}/interpreted/v2`,
      digest: sha256Digest({ fpml, revision: 2 })
    },
    boundary: {
      ...candidateMarkov.boundary,
      included_refs: [...candidateMarkov.boundary.included_refs, "fpml://businessUnit"],
      rationale: "the superseding cut adds the source business-unit boundary without editing v1"
    },
    created_at: revisedAt
  });

  const runtimeRoot = mkdtempSync(path.join(os.tmpdir(), "odd-wm-admitted-steel-thread-"));
  const store = new PythonPhysicalCutStore({
    pythonExecutable: storagePython,
    moduleRoot: storageTenant,
    environment: {
      OWM_ICEBERG_CATALOG_NAME: "odd_world_model_admitted_steel_thread",
      OWM_ICEBERG_CATALOG_URI: `sqlite:///${path.join(runtimeRoot, "catalog.db")}`,
      OWM_ICEBERG_WAREHOUSE_URI: `file://${path.join(runtimeRoot, "warehouse")}`,
      OWM_STORAGE_RECEIPT_ROOT: path.join(runtimeRoot, "receipts"),
      OWM_STORAGE_PROFILE_REF: "local-pyiceberg-v1"
    }
  });
  const sourceFlow = await publishThroughAbgAndStorage({
    slug: "fpml-source-domain",
    sourceObservation,
    payloadCheck: fpmlTradeObservationPayloadCheck,
    payload: jsonObject(fpml),
    cutRole: "source_domain",
    store
  });
  const representationFlow = await publishThroughAbgAndStorage({
    slug: "fpml-trade-representation",
    sourceObservation,
    payloadCheck: candidateMarkovObjectPayloadCheck,
    payload: jsonObject(candidateMarkov),
    cutRole: "domain_artifact",
    store
  });
  const commonModelFlow = await publishThroughAbgAndStorage({
    slug: "common-trade-lifecycle-model",
    sourceObservation,
    payloadCheck: candidateMarkovObjectPayloadCheck,
    payload: jsonObject(commonModelCandidate),
    cutRole: "common_model",
    store
  });
  const revisedRepresentationFlow = await publishThroughAbgAndStorage({
    slug: "fpml-trade-representation-v2",
    sourceObservation,
    payloadCheck: candidateMarkovObjectPayloadCheck,
    payload: jsonObject(revisedCandidateMarkov),
    cutRole: "domain_artifact",
    store,
    occurredAt: revisedAt
  });
  const publications = [sourceFlow.publishedCut, representationFlow.publishedCut] as const;
  const semanticLinkProposal = createSemanticLinkProposal({
    schema_kind: "odd_world_model.semantic_link_proposal",
    schema_version: "v1",
    link_ref: "semantic-link://odd_world_model/fpml-to-trade-representation/v1",
    source_cut: exactRefForPublishedCut(sourceFlow.publishedCut),
    target_cut: exactRefForPublishedCut(representationFlow.publishedCut),
    relation_role: "treatment",
    treatment_ref: candidateMarkov.held_out_treatment_verification.treatment_ref,
    authority_ref: "authority://odd_world_model/trade-semantics/v1",
    provenance_refs: [candidateMarkov.cut_digest, sourceFlow.proposalAdmission.witness_ref],
    dependency_direction: "source_to_target",
    fidelity: "lossy_projection",
    losses: ["FpML syntax and non-economic documentation are not copied into the trade-state projection"],
    validity: { valid_from: at },
    supersession_status: "active"
  }, publications);
  const semanticLinkProposalRef = exactRefForSemanticLinkProposal(semanticLinkProposal);
  const linkCarrier = admitDeterministicCarrier({
    handle: "odd_world_model.publish_semantic_links",
    slug: "fpml-link-publication",
    subjects: [semanticLinkProposalRef],
    admissionKind: "published_cut"
  });
  const linkAdmission = linkCarrier.admission;
  const semanticLink = publishSemanticLink({
    proposal: semanticLinkProposal,
    publicationAdmission: linkAdmission,
    publishedAt: at
  });
  const semanticLinkRef = exactRefForSemanticLink(semanticLink);
  const composed = createComposedWorldModel({
    schema_kind: "odd_world_model.composed_world_model",
    schema_version: "v1",
    world_model_ref: "world-model://odd_world_model/fpml-trade-context/v1",
    composition_intent: "retain exact FpML source and interpreted trade semantics",
    component_cut_refs: publications.map(exactRefForPublishedCut),
    semantic_link_refs: [semanticLinkRef],
    common_model_refs: [],
    authority_boundary_refs: [
      sourceObservation.authority_ref,
      "authority://odd_world_model/trade-semantics/v1"
    ],
    fidelity: "lossy_projection",
    losses: semanticLink.losses,
    unresolved_gaps: [],
    composed_at: at
  }, publications, [semanticLink]);
  assert.throws(() => createComposedWorldModel({
    ...composed,
    component_cut_refs: [
      exactRefForPublishedCut(sourceFlow.publishedCut),
      { ref: "semantic-cut://odd_world_model/unpublished", digest: sha256Digest("unpublished") }
    ],
    world_model_digest: undefined
  } as never, publications, [semanticLink]), /not an exact published cut/);
  const compositionCarrier = admitDeterministicCarrier({
    handle: "odd_world_model.compose_world_model",
    slug: "fpml-trade-composition",
    subjects: [{ ref: composed.world_model_ref, digest: composed.world_model_digest }],
    admissionKind: "published_cut"
  });
  const mesh = createBoundedMeshCut({
    schema_kind: "odd_world_model.bounded_mesh_cut",
    schema_version: "v1",
    mesh_cut_ref: "mesh-cut://odd_world_model/fpml-trade-context/v1",
    interaction_goal: "explain the exact FpML source-to-trade interpretation",
    scope_ref: "mesh-scope://odd_world_model/fpml-trade/v1",
    selection_policy_ref: "selection-policy://odd_world_model/minimum-sufficient-context/v1",
    root_refs: [exactRefForPublishedCut(sourceFlow.publishedCut)],
    relation_selectors: ["treatment"],
    closure_rule: "outbound_dependency_closure",
    excluded_refs: [],
    resolved_at: at
  }, publications, [semanticLink]);
  const meshCarrier = admitDeterministicCarrier({
    handle: "odd_world_model.resolve_mesh_cut",
    slug: "fpml-trade-mesh",
    subjects: [{ ref: mesh.mesh_cut_ref, digest: mesh.mesh_cut_digest }],
    admissionKind: "published_cut"
  });
  assert.deepEqual(mesh.node_refs, publications.map(exactRefForPublishedCut).sort((a, b) => a.ref.localeCompare(b.ref)));

  const sourceCutRef = exactRefForPublishedCut(sourceFlow.publishedCut);
  const priorRepresentationRef = exactRefForPublishedCut(representationFlow.publishedCut);
  const revisedRepresentationRef = exactRefForPublishedCut(revisedRepresentationFlow.publishedCut);
  const commonModelRef = exactRefForPublishedCut(commonModelFlow.publishedCut);
  const retainedPublications = [
    sourceFlow.publishedCut,
    representationFlow.publishedCut,
    revisedRepresentationFlow.publishedCut,
    commonModelFlow.publishedCut
  ] as const;
  const commonSourceLinkRef = "semantic-link://odd_world_model/common-trade-to-fpml-source/v1";
  const commonRepresentationLinkRef = "semantic-link://odd_world_model/common-trade-to-representation/v1";
  const initialCommonLinks = publishLinkBatch({
    slug: "common-model-adoption-v1",
    publishedAt: at,
    proposals: [
      createSemanticLinkProposal({
        schema_kind: "odd_world_model.semantic_link_proposal",
        schema_version: "v1",
        link_ref: commonSourceLinkRef,
        source_cut: commonModelRef,
        target_cut: sourceCutRef,
        relation_role: "references",
        treatment_ref: "treatment://odd_world_model/adopt-common-trade-model/v1",
        authority_ref: "authority://odd_world_model/trade-semantics/v1",
        provenance_refs: [commonModelFlow.publicationAdmission.witness_ref, sourceFlow.publicationAdmission.witness_ref],
        dependency_direction: "source_to_target",
        fidelity: "lossless_projection",
        losses: [],
        validity: { valid_from: at },
        supersession_status: "active"
      }, retainedPublications),
      createSemanticLinkProposal({
        schema_kind: "odd_world_model.semantic_link_proposal",
        schema_version: "v1",
        link_ref: commonRepresentationLinkRef,
        source_cut: commonModelRef,
        target_cut: priorRepresentationRef,
        relation_role: "references",
        treatment_ref: "treatment://odd_world_model/adopt-common-trade-model/v1",
        authority_ref: "authority://odd_world_model/trade-semantics/v1",
        provenance_refs: [commonModelFlow.publicationAdmission.witness_ref, representationFlow.publicationAdmission.witness_ref],
        dependency_direction: "source_to_target",
        fidelity: "lossless_projection",
        losses: [],
        validity: { valid_from: at },
        supersession_status: "active"
      }, retainedPublications)
    ]
  });
  const commonSourceLink = initialCommonLinks.links[0]!;
  const commonRepresentationLink = initialCommonLinks.links[1]!;
  const retainedMeshV1Links = [semanticLink, commonSourceLink, commonRepresentationLink] as const;
  const retainedMeshV1 = createBoundedMeshCut({
    schema_kind: "odd_world_model.bounded_mesh_cut",
    schema_version: "v1",
    mesh_cut_ref: "mesh-cut://odd_world_model/retained-fpml-trade/v1",
    interaction_goal: "resolve the FpML trade through one explicitly adopted common model",
    scope_ref: "mesh-scope://odd_world_model/retained-fpml-trade/v1",
    selection_policy_ref: "selection-policy://odd_world_model/retained-current-links/v1",
    root_refs: [sourceCutRef, commonModelRef],
    relation_selectors: ["treatment", "references"],
    closure_rule: "outbound_dependency_closure",
    excluded_refs: [],
    resolved_at: at
  }, retainedPublications, retainedMeshV1Links);
  const retainedMeshV1Carrier = admitDeterministicCarrier({
    handle: "odd_world_model.resolve_mesh_cut",
    slug: "retained-fpml-trade-mesh-v1",
    subjects: [{ ref: retainedMeshV1.mesh_cut_ref, digest: retainedMeshV1.mesh_cut_digest }],
    admissionKind: "published_cut"
  });
  assert.deepEqual(retainedMeshV1.common_model_refs, [commonModelRef]);
  assert.deepEqual(
    calculateAffectedClosure(retainedMeshV1, retainedPublications, retainedMeshV1Links, [sourceCutRef.ref]),
    [sourceCutRef.ref, priorRepresentationRef.ref].sort()
  );

  const revisedTreatmentLinkRef = "semantic-link://odd_world_model/fpml-to-trade-representation/v2";
  const revisedCommonRepresentationLinkRef = "semantic-link://odd_world_model/common-trade-to-representation/v2";
  const supersessionBatch = publishLinkBatch({
    slug: "retained-fpml-trade-supersession-v2",
    publishedAt: revisedAt,
    proposals: [
      createSemanticLinkProposal({
        schema_kind: "odd_world_model.semantic_link_proposal",
        schema_version: "v1",
        link_ref: semanticLink.link_ref,
        source_cut: sourceCutRef,
        target_cut: priorRepresentationRef,
        relation_role: semanticLink.relation_role,
        treatment_ref: semanticLink.treatment_ref,
        authority_ref: semanticLink.authority_ref,
        provenance_refs: [...semanticLink.provenance_refs, revisedRepresentationRef.ref],
        dependency_direction: semanticLink.dependency_direction,
        fidelity: semanticLink.fidelity,
        losses: semanticLink.losses,
        validity: { valid_from: at, valid_to: revisedAt },
        supersession_status: "superseded",
        superseded_by_link_ref: revisedTreatmentLinkRef
      }, retainedPublications),
      createSemanticLinkProposal({
        schema_kind: "odd_world_model.semantic_link_proposal",
        schema_version: "v1",
        link_ref: revisedTreatmentLinkRef,
        source_cut: sourceCutRef,
        target_cut: revisedRepresentationRef,
        relation_role: "treatment",
        treatment_ref: "treatment://odd_world_model/fpml-confirmation-interpretation/v2",
        authority_ref: "authority://odd_world_model/trade-semantics/v1",
        provenance_refs: [revisedCandidateMarkov.cut_digest, revisedRepresentationFlow.publicationAdmission.witness_ref],
        dependency_direction: "source_to_target",
        fidelity: "lossy_projection",
        losses: ["FpML syntax and non-economic documentation are not copied into the trade-state projection"],
        validity: { valid_from: revisedAt },
        supersession_status: "active"
      }, retainedPublications),
      createSemanticLinkProposal({
        schema_kind: "odd_world_model.semantic_link_proposal",
        schema_version: "v1",
        link_ref: commonRepresentationLink.link_ref,
        source_cut: commonModelRef,
        target_cut: priorRepresentationRef,
        relation_role: "references",
        treatment_ref: commonRepresentationLink.treatment_ref,
        authority_ref: commonRepresentationLink.authority_ref,
        provenance_refs: [...commonRepresentationLink.provenance_refs, revisedRepresentationRef.ref],
        dependency_direction: "source_to_target",
        fidelity: "lossless_projection",
        losses: [],
        validity: { valid_from: at, valid_to: revisedAt },
        supersession_status: "superseded",
        superseded_by_link_ref: revisedCommonRepresentationLinkRef
      }, retainedPublications),
      createSemanticLinkProposal({
        schema_kind: "odd_world_model.semantic_link_proposal",
        schema_version: "v1",
        link_ref: revisedCommonRepresentationLinkRef,
        source_cut: commonModelRef,
        target_cut: revisedRepresentationRef,
        relation_role: "references",
        treatment_ref: "treatment://odd_world_model/adopt-common-trade-model/v1",
        authority_ref: "authority://odd_world_model/trade-semantics/v1",
        provenance_refs: [commonModelFlow.publicationAdmission.witness_ref, revisedRepresentationFlow.publicationAdmission.witness_ref],
        dependency_direction: "source_to_target",
        fidelity: "lossless_projection",
        losses: [],
        validity: { valid_from: revisedAt },
        supersession_status: "active"
      }, retainedPublications),
      createSemanticLinkProposal({
        schema_kind: "odd_world_model.semantic_link_proposal",
        schema_version: "v1",
        link_ref: "semantic-link://odd_world_model/trade-representation-v2-supersedes-v1",
        source_cut: revisedRepresentationRef,
        target_cut: priorRepresentationRef,
        relation_role: "supersedes",
        treatment_ref: "treatment://odd_world_model/semantic-cut-supersession/v1",
        authority_ref: "authority://odd_world_model/trade-semantics/v1",
        provenance_refs: [representationFlow.publicationAdmission.witness_ref, revisedRepresentationFlow.publicationAdmission.witness_ref],
        dependency_direction: "source_to_target",
        fidelity: "exact_payload",
        losses: [],
        validity: { valid_from: revisedAt },
        supersession_status: "active"
      }, retainedPublications)
    ]
  });
  const supersededTreatmentLink = supersessionBatch.links[0]!;
  const revisedTreatmentLink = supersessionBatch.links[1]!;
  const supersededCommonRepresentationLink = supersessionBatch.links[2]!;
  const revisedCommonRepresentationLink = supersessionBatch.links[3]!;
  const cutSupersessionLink = supersessionBatch.links[4]!;
  const retainedMeshV2Links = [
    supersededTreatmentLink,
    revisedTreatmentLink,
    supersededCommonRepresentationLink,
    revisedCommonRepresentationLink,
    commonSourceLink,
    cutSupersessionLink
  ] as const;
  assertSemanticLinkCatalog(retainedMeshV2Links);
  assert.throws(
    () => assertSemanticLinkCatalog(retainedMeshV2Links.filter((link) => link.link_ref !== revisedTreatmentLinkRef)),
    /unresolved successor/
  );
  const reconciliationGap = {
    gap_type: "semantic_reconciliation_required",
    message: "the superseding representation adds a business-unit boundary requiring downstream review",
    retryable: false,
    evidence_refs: [priorRepresentationRef.ref, revisedRepresentationRef.ref]
  } as const;
  const retainedMeshV2 = createBoundedMeshCut({
    schema_kind: "odd_world_model.bounded_mesh_cut",
    schema_version: "v1",
    mesh_cut_ref: "mesh-cut://odd_world_model/retained-fpml-trade/v2",
    interaction_goal: "resolve the current FpML trade without rebuilding unchanged common truth",
    scope_ref: "mesh-scope://odd_world_model/retained-fpml-trade/v2",
    selection_policy_ref: "selection-policy://odd_world_model/retained-current-links/v1",
    root_refs: [sourceCutRef, commonModelRef],
    relation_selectors: ["treatment", "references"],
    closure_rule: "outbound_dependency_closure",
    excluded_refs: [],
    unresolved_gaps: [reconciliationGap],
    resolved_at: revisedAt
  }, retainedPublications, retainedMeshV2Links);
  const retainedMeshV2Carrier = admitDeterministicCarrier({
    handle: "odd_world_model.resolve_mesh_cut",
    slug: "retained-fpml-trade-mesh-v2",
    subjects: [{ ref: retainedMeshV2.mesh_cut_ref, digest: retainedMeshV2.mesh_cut_digest }],
    admissionKind: "published_cut"
  });
  const affectedBySourceSupersession = calculateAffectedClosure(
    retainedMeshV2,
    retainedPublications,
    retainedMeshV2Links,
    [sourceCutRef.ref]
  );
  assert.deepEqual(affectedBySourceSupersession, [sourceCutRef.ref, revisedRepresentationRef.ref].sort());
  assert.equal(affectedBySourceSupersession.includes(commonModelRef.ref), false);
  assert.deepEqual(retainedMeshV2.common_model_refs, [commonModelRef]);
  assert.ok(retainedMeshV1.link_refs.some((ref) => ref.ref === commonSourceLinkRef));
  assert.ok(retainedMeshV2.link_refs.some((ref) => ref.ref === commonSourceLinkRef));
  assert.equal(retainedMeshV2.node_refs.some((ref) => ref.ref === priorRepresentationRef.ref), false);
  assert.equal(retainedMeshV2.node_refs.some((ref) => ref.ref === revisedRepresentationRef.ref), true);
  assert.equal(retainedMeshV2.link_refs.some((ref) => ref.ref === semanticLink.link_ref), false);
  assert.equal(retainedMeshV2.link_refs.some((ref) => ref.ref === cutSupersessionLink.link_ref), false);
  assert.equal(retainedMeshV2.unresolved_gaps[0]?.gap_type, reconciliationGap.gap_type);

  const basis = createContextBasis({
    schema_kind: "odd_world_model.context_basis",
    schema_version: "v1",
    basis_ref: "context-basis://odd_world_model/fpml-trade/v1",
    projection_contract_ref: "projection-contract://odd_world_model/exact-trade-context/v1",
    projection_contract_version: "v1",
    temporal_coordinates: { source_observed_at: sourceObservation.observed_at, context_as_of: at },
    source_authority_refs: [sourceObservation.authority_ref],
    semantic_authority_refs: [
      "authority://odd_world_model/trade-semantics/v1",
      linkAdmission.witness_ref
    ],
    resolved_at: at,
    freshness_policy_ref: "freshness-policy://odd_world_model/exact-dependency-digest/v1",
    freshness_evaluated_at: at,
    declared_losses: semanticLink.losses,
    truncation_limit_ref: "context-window://odd_world_model/first-slice/8-items",
    truncation_max_items: 8
  }, mesh, publications, [semanticLink]);
  const projection = renderContextProjection({
    projectionRef: "context-projection://odd_world_model/fpml-trade/v1",
    basis,
    rendererRef: "renderer://odd_world_model/context-projection/canonical-json/v1",
    items: [
      { exact_ref: exactRefForPublishedCut(sourceFlow.publishedCut), content: jsonObject(fpml) },
      { exact_ref: exactRefForPublishedCut(representationFlow.publishedCut), content: jsonObject(candidateMarkov) },
      { exact_ref: semanticLinkRef, content: jsonObject(semanticLink) }
    ],
    createdAt: at
  });
  const contextCarrier = admitDeterministicCarrier({
    handle: "odd_world_model.project_context",
    slug: "fpml-trade-context-projection",
    subjects: [
      { ref: basis.basis_ref, digest: basis.basis_digest },
      { ref: projection.projection_ref, digest: projection.projection_digest }
    ],
    admissionKind: "context_projection"
  });
  const contextAdmission = contextCarrier.admission;
  assert.equal(contextAdmission.status, "admitted");

  const output: ExactRef = {
    ref: "proposal://odd_world_model/fpml-trade-interpretation/v1",
    digest: sha256Digest({ conclusion: "source and interpreted semantics remain distinct and linked" })
  };
  const invocationSubjects = [
    { ref: basis.basis_ref, digest: basis.basis_digest },
    { ref: projection.projection_ref, digest: projection.projection_digest },
    output
  ];
  const invocationProof = runWorldModelPublicStart({
    targetHandle: "odd_world_model.interpret_context",
    until: "converged",
    runRefSuffix: "fpml-trade-context-interpretation-v1",
    inputBindings: invocationSubjects.map((subject) => exactInputBinding(subject, "context_invocation_carrier")),
    evidenceRefs: invocationSubjects.map(exactEvidenceRef)
  });
  const invocationAdmission = deriveAbgAdmissionWitness({
    witnessRef: "admission-witness://odd_world_model/fpml-trade-invocation/v1",
    admissionKind: "model_invocation",
    subjects: invocationSubjects,
    proof: invocationProof,
    requireProbabilisticOrigin: true
  });
  const currentCatalog = {
    catalogRef: "context-dependency-catalog://odd_world_model/fpml-trade/current/v1",
    meshCut: mesh,
    publishedCuts: publications,
    semanticLinks: [semanticLink],
    projectionContracts: [{
      ref: basis.projection_contract_ref,
      version: basis.projection_contract_version
    }]
  } as const;
  const invocation = createContextInvocationRecord({
    schema_kind: "odd_world_model.context_invocation_record",
    schema_version: "v1",
    invocation_ref: "context-invocation://odd_world_model/fpml-trade/v1",
    context_basis: { ref: basis.basis_ref, digest: basis.basis_digest },
    context_projection: { ref: projection.projection_ref, digest: projection.projection_digest },
    model_identity: "model-capability://odd_world_model/test-interpreter/v1",
    model_role: "F_P",
    invoked_at: at,
    completed_at: at,
    output_digest: output.digest,
    output_proposal_ref: output.ref
  }, basis, projection, invocationAdmission, currentCatalog);
  assert.equal(invocation.admission_status, "admitted");

  const queryCarrier = admitDeterministicCarrier({
    handle: "odd_world_model.query_world_model",
    slug: "fpml-trade-query",
    subjects: [
      exactRefForPublishedCut(representationFlow.publishedCut),
      { ref: basis.basis_ref, digest: basis.basis_digest },
      { ref: projection.projection_ref, digest: projection.projection_digest }
    ],
    admissionKind: "published_cut"
  });
  const queryAdmission = queryCarrier.admission;
  assert.equal(queryAdmission.status, "admitted");
  const queryContract = {
    contract_ref: "query-contract://odd_world_model/context-proof-summary/v1",
    version: "v1",
    scope_ref: "query-scope://odd_world_model/fpml-trade/v1",
    selection_policy_ref: "selection-policy://odd_world_model/query-context/v1",
    root_refs: [exactRefForPublishedCut(sourceFlow.publishedCut)],
    relation_selectors: ["treatment"],
    closure_rule: "outbound_dependency_closure"
  } as const;
  const query = projectWorldModelQuery({
    queryRef: "query://odd_world_model/fpml-trade/v1",
    queryContract,
    basis,
    projection,
    basisMeshCut: mesh,
    publishedCuts: publications,
    semanticLinks: [semanticLink],
    publishedCut: representationFlow.publishedCut,
    physicalAdmission: representationFlow.physicalAdmission,
    attestation: representationFlow.attestation,
    projectedAt: at
  });
  assert.equal(query.semantic_cut.digest, representationFlow.publishedCut.publication_digest);
  assert.equal(query.physical_admission_witness.digest, representationFlow.physicalAdmission.witness_digest);
  assert.deepEqual(query.exact_snapshots, representationFlow.attestation.snapshots);
  assert.equal(query.result.semantic_cut_count, 2);
  assert.equal(query.result.semantic_link_count, 1);
  assert.deepEqual(query.result.traversed_semantic_cut_refs, mesh.node_refs);
  assert.deepEqual(query.result.traversed_semantic_link_refs, mesh.link_refs);
  assert.equal(query.result.included_ref_count, 3);
  assert.equal(query.result.omitted_ref_count, 0);

  const representationSnapshots = new Set(
    representationFlow.publishedCut.snapshot_refs.map((ref) => `${ref.ref}\u0000${ref.digest}`)
  );
  const { basis_digest: _basisDigest, ...basisWithoutDigest } = basis;
  const incompletePhysicalSnapshotRefs = basis.physical_snapshot_refs.filter(
    (ref) => !representationSnapshots.has(`${ref.ref}\u0000${ref.digest}`)
  );
  const incompleteBasisInput = {
    ...basisWithoutDigest,
    physical_snapshot_refs: incompletePhysicalSnapshotRefs,
    freshness: {
      ...basis.freshness,
      dependency_digest: sha256Digest({
        mesh_cut: basis.mesh_cut,
        semantic_cut_refs: basis.semantic_cut_refs,
        semantic_link_refs: basis.semantic_link_refs,
        source_observation_refs: basis.source_observation_refs,
        physical_snapshot_refs: incompletePhysicalSnapshotRefs,
        projection_contract_ref: basis.projection_contract_ref,
        projection_contract_version: basis.projection_contract_version
      })
    }
  };
  const incompleteBasis = {
    ...incompleteBasisInput,
    basis_digest: sha256Digest(incompleteBasisInput)
  };
  const incompleteProjection = renderContextProjection({
    projectionRef: "context-projection://odd_world_model/fpml-trade/incomplete-physical-basis/v1",
    basis: incompleteBasis,
    rendererRef: "renderer://odd_world_model/context-projection/canonical-json/v1",
    items: [
      { exact_ref: exactRefForPublishedCut(sourceFlow.publishedCut), content: jsonObject(fpml) },
      { exact_ref: exactRefForPublishedCut(representationFlow.publishedCut), content: jsonObject(candidateMarkov) },
      { exact_ref: semanticLinkRef, content: jsonObject(semanticLink) }
    ],
    createdAt: at
  });
  assert.throws(() => projectWorldModelQuery({
    queryRef: "query://odd_world_model/missing-physical-basis/v1",
    queryContract,
    basis: incompleteBasis,
    projection: incompleteProjection,
    basisMeshCut: mesh,
    publishedCuts: publications,
    semanticLinks: [semanticLink],
    publishedCut: representationFlow.publishedCut,
    physicalAdmission: representationFlow.physicalAdmission,
    attestation: representationFlow.attestation,
    projectedAt: at
  }), /does not include physical snapshot/);

  const stale = detectContextStaleness(basis, {
    ...currentCatalog,
    semanticLinks: []
  });
  assert.equal(stale?.gap_type, "stale_context_basis");
  const sourceStale = detectContextStaleness(basis, {
    ...currentCatalog,
    publishedCuts: [representationFlow.publishedCut]
  });
  assert.equal(sourceStale?.gap_type, "stale_context_basis");
  assert.throws(() => projectWorldModelQuery({
    queryRef: "query://odd_world_model/tampered/v1",
    queryContract,
    basis,
    projection,
    basisMeshCut: mesh,
    publishedCuts: publications,
    semanticLinks: [semanticLink],
    publishedCut: representationFlow.publishedCut,
    physicalAdmission: sourceFlow.physicalAdmission,
    attestation: representationFlow.attestation,
    projectedAt: at
  }), /physical admission witness/);

  const verification = await store.verifyCut({
    schema_kind: "odd_world_model.physical_cut_verify_request",
    schema_version: "v1",
    operation: "verify_cut",
    verification_request_id: "verify://odd_world_model/fpml-trade-representation/v1",
    storage_profile_ref: "local-pyiceberg-v1",
    attestation: representationFlow.attestation
  });
  assert.equal(verification.effect_observation.observation_status, "reproduced");
  const ajv = await loadCommonSchemaValidator(schemaRoot);
  for (const [schemaName, value] of [
    ["fpml_trade_observation.schema.json", fpml],
    ["candidate_markov_object_cut.schema.json", candidateMarkov],
    ["candidate_markov_object_cut.schema.json", commonModelCandidate],
    ["candidate_markov_object_cut.schema.json", revisedCandidateMarkov],
    ["semantic_publication_candidate.schema.json", sourceFlow.publicationCandidate],
    ["semantic_publication_candidate.schema.json", representationFlow.publicationCandidate],
    ["semantic_publication_candidate.schema.json", commonModelFlow.publicationCandidate],
    ["semantic_publication_candidate.schema.json", revisedRepresentationFlow.publicationCandidate],
    ["published_semantic_cut.schema.json", sourceFlow.publishedCut],
    ["published_semantic_cut.schema.json", representationFlow.publishedCut],
    ["published_semantic_cut.schema.json", commonModelFlow.publishedCut],
    ["published_semantic_cut.schema.json", revisedRepresentationFlow.publishedCut],
    ["semantic_link.schema.json", semanticLink],
    ...initialCommonLinks.links.map((link) => ["semantic_link.schema.json", link] as const),
    ...supersessionBatch.links.map((link) => ["semantic_link.schema.json", link] as const),
    ["composed_world_model.schema.json", composed],
    ["bounded_mesh_cut.schema.json", mesh],
    ["bounded_mesh_cut.schema.json", retainedMeshV1],
    ["bounded_mesh_cut.schema.json", retainedMeshV2],
    ["context_basis.schema.json", basis],
    ["context_projection.schema.json", projection],
    ["context_invocation_record.schema.json", invocation],
    ["query_projection.schema.json", query]
  ] as const) {
    const validate = ajv.getSchema(`odd_world_model.${schemaName}`);
    assert.ok(validate);
    assert.equal(validate(value), true, `${schemaName}: ${JSON.stringify(validate.errors)}`);
  }
  const proofPath = process.env.OWM_REFERENCE_SLICE_PROOF_PATH;
  if (proofPath !== undefined) {
    const runtimeEventClosures = [
      persistedRuntimeClosure(sourceFlow.proposalAdmission, sourceFlow.runtimeProofs[0]!),
      persistedRuntimeClosure(sourceFlow.acceptanceAdmission, sourceFlow.runtimeProofs[1]!),
      persistedRuntimeClosure(sourceFlow.physicalAdmission, sourceFlow.runtimeProofs[2]!),
      persistedRuntimeClosure(sourceFlow.publicationAdmission, sourceFlow.runtimeProofs[3]!),
      persistedRuntimeClosure(representationFlow.proposalAdmission, representationFlow.runtimeProofs[0]!),
      persistedRuntimeClosure(representationFlow.acceptanceAdmission, representationFlow.runtimeProofs[1]!),
      persistedRuntimeClosure(representationFlow.physicalAdmission, representationFlow.runtimeProofs[2]!),
      persistedRuntimeClosure(representationFlow.publicationAdmission, representationFlow.runtimeProofs[3]!),
      persistedRuntimeClosure(commonModelFlow.proposalAdmission, commonModelFlow.runtimeProofs[0]!),
      persistedRuntimeClosure(commonModelFlow.acceptanceAdmission, commonModelFlow.runtimeProofs[1]!),
      persistedRuntimeClosure(commonModelFlow.physicalAdmission, commonModelFlow.runtimeProofs[2]!),
      persistedRuntimeClosure(commonModelFlow.publicationAdmission, commonModelFlow.runtimeProofs[3]!),
      persistedRuntimeClosure(revisedRepresentationFlow.proposalAdmission, revisedRepresentationFlow.runtimeProofs[0]!),
      persistedRuntimeClosure(revisedRepresentationFlow.acceptanceAdmission, revisedRepresentationFlow.runtimeProofs[1]!),
      persistedRuntimeClosure(revisedRepresentationFlow.physicalAdmission, revisedRepresentationFlow.runtimeProofs[2]!),
      persistedRuntimeClosure(revisedRepresentationFlow.publicationAdmission, revisedRepresentationFlow.runtimeProofs[3]!),
      persistedRuntimeClosure(linkCarrier.admission, linkCarrier.proof),
      persistedRuntimeClosure(initialCommonLinks.carrier.admission, initialCommonLinks.carrier.proof),
      persistedRuntimeClosure(supersessionBatch.carrier.admission, supersessionBatch.carrier.proof),
      persistedRuntimeClosure(compositionCarrier.admission, compositionCarrier.proof),
      persistedRuntimeClosure(meshCarrier.admission, meshCarrier.proof),
      persistedRuntimeClosure(retainedMeshV1Carrier.admission, retainedMeshV1Carrier.proof),
      persistedRuntimeClosure(retainedMeshV2Carrier.admission, retainedMeshV2Carrier.proof),
      persistedRuntimeClosure(contextCarrier.admission, contextCarrier.proof),
      persistedRuntimeClosure(invocationAdmission, invocationProof),
      persistedRuntimeClosure(queryCarrier.admission, queryCarrier.proof)
    ];
    const artifactInput = {
      schema_kind: "odd_world_model.reference_semantic_slice_evidence",
      schema_version: "v1",
      evidence_ref: "proof://odd_world_model/reference-semantic-slice/20260712/v1",
      recorded_at: at,
      execution_mode: "local_semantic_kernel_with_rc3_reference_digest_bridge",
      source: {
        exact_ref: source,
        observation: sourceObservation,
        fpml_observation: fpml
      },
      candidate_markov_object: candidateMarkov,
      publication_flows: {
        source_domain: persistedPublishedFlow(sourceFlow),
        interpreted_domain: persistedPublishedFlow(representationFlow),
        common_model: persistedPublishedFlow(commonModelFlow),
        superseding_interpreted_domain: persistedPublishedFlow(revisedRepresentationFlow)
      },
      semantic_link: {
        value: semanticLink,
        admission: linkCarrier.admission
      },
      composition: {
        value: composed,
        admission: compositionCarrier.admission
      },
      mesh: {
        value: mesh,
        admission: meshCarrier.admission
      },
      mesh_supersession: {
        initial: {
          value: retainedMeshV1,
          admission: retainedMeshV1Carrier.admission,
          links: retainedMeshV1Links
        },
        current: {
          value: retainedMeshV2,
          admission: retainedMeshV2Carrier.admission,
          links: retainedMeshV2Links
        },
        cut_supersession_link: cutSupersessionLink,
        link_publication_admissions: {
          common_model_adoption: initialCommonLinks.carrier.admission,
          supersession: supersessionBatch.carrier.admission
        },
        common_model_ref: commonModelRef,
        affected_cut_refs: affectedBySourceSupersession,
        unaffected_exact_refs: [commonModelRef, exactRefForSemanticLink(commonSourceLink)],
        reconciliation_gap: reconciliationGap
      },
      context: {
        basis,
        projection,
        admission: contextCarrier.admission,
        stale_cut_gap: stale,
        stale_source_gap: sourceStale
      },
      invocation: {
        value: invocation,
        admission: invocationAdmission
      },
      query: {
        value: query,
        admission: queryCarrier.admission
      },
      runtime_event_closures: runtimeEventClosures,
      physical_verification: verification,
      negative_evidence: {
        missing_physical_snapshot_rejected: true,
        mismatched_physical_admission_rejected: true,
        unpublished_composition_component_rejected: true,
        unresolved_link_successor_rejected: true
      },
      limitations: [
        "semantic proposal is preconstructed by the local reference kernel",
        "rc.3 GraphFunctions carry exact refs but do not execute WM payload transforms",
        "candidate Markov-object held-out treatment result remains inconclusive",
        "attribute-ledger and assurance-record chains are not realized",
        "no product release or requirement closure is claimed"
      ]
    };
    const artifact = {
      ...artifactInput,
      evidence_digest: sha256Digest(artifactInput)
    };
    writeFileSync(proofPath, `${JSON.stringify(artifact, null, 2)}\n`, "utf8");
  }
});
