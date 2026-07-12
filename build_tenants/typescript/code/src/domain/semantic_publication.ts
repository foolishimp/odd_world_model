import { isSha256Digest, sha256Digest } from "./canonical.ts";
import {
  assertExactRef,
  assertUniqueExactRefs,
  assertUniqueStrings,
  exactRefKey,
  requireText
} from "./exact_refs.ts";
import type {
  ExactRef,
  Fidelity,
  Sha256Digest,
  TypedGap
} from "./semantic_memory.ts";
import type { JsonObject } from "./types.ts";
import type {
  PhysicalEffectObservation,
  SemanticCutAttestation
} from "../storage/physical_cut_store.ts";
import {
  validatePhysicalEffectObservation,
  validateSemanticCutAttestation
} from "../storage/physical_cut_store.ts";
import {
  assertProducedWorldModelPublicStartProof,
  type WorldModelPublicStartProof
} from "../substrate_binding/public_start.ts";
import type {
  StartInputAssetBinding
} from "../substrate_binding/rc3_api.ts";

export type AdmissionKind =
  | "proposal_evidence"
  | "acceptance_evidence"
  | "physical_effect"
  | "context_projection"
  | "model_invocation"
  | "published_cut";

export interface SourceObservation {
  readonly schema_kind: "odd_world_model.source_observation";
  readonly schema_version: "v1";
  readonly observation_ref: string;
  readonly source: ExactRef;
  readonly source_kind: string;
  readonly authority_ref: string;
  readonly evidence_refs: readonly string[];
  readonly observed_at: string;
  readonly observation_digest: Sha256Digest;
}

export interface SemanticProposal {
  readonly schema_kind: "odd_world_model.semantic_proposal";
  readonly schema_version: "v1";
  readonly proposal_ref: string;
  readonly source_observation: ExactRef;
  readonly proposed_by: string;
  readonly payload_schema_ref: string;
  readonly payload: JsonObject;
  readonly payload_digest: Sha256Digest;
  readonly epistemic_status: "candidate";
  readonly created_at: string;
  readonly proposal_digest: Sha256Digest;
}

export interface DeterministicCheckReport {
  readonly schema_kind: "odd_world_model.deterministic_check_report";
  readonly schema_version: "v1";
  readonly check_ref: string;
  readonly proposal: ExactRef;
  readonly check_contract_refs: readonly string[];
  readonly status: "passed" | "failed";
  readonly issues: readonly TypedGap[];
  readonly checked_at: string;
  readonly check_digest: Sha256Digest;
}

export interface DeterministicPayloadCheck {
  readonly contractRef: string;
  readonly validate: (payload: JsonObject) => readonly TypedGap[];
}

export interface AbgAdmissionWitness {
  readonly schema_kind: "odd_world_model.abg_admission_witness";
  readonly schema_version: "v1";
  readonly witness_ref: string;
  readonly admission_kind: AdmissionKind;
  readonly status: "admitted";
  readonly subjects: readonly ExactRef[];
  readonly target_handle: string;
  readonly selected_graph_function_ref: string;
  readonly graph_call_refs: readonly string[];
  readonly evidence_refs: readonly string[];
  readonly evidence_event_refs: readonly string[];
  readonly vector_closed_event_refs: readonly string[];
  readonly terminal_event_ref: string;
  readonly runtime_event_refs: readonly string[];
  readonly admitted_at: string;
  readonly witness_digest: Sha256Digest;
}

export type WmAcceptanceDisposition = "accepted" | "rejected" | "human_gate_required";

export interface WmAcceptanceDecision {
  readonly schema_kind: "odd_world_model.wm_acceptance_decision";
  readonly schema_version: "v1";
  readonly decision_ref: string;
  readonly proposal: ExactRef;
  readonly deterministic_check: ExactRef;
  readonly proposal_admission: ExactRef;
  readonly authority_ref: string;
  readonly disposition: WmAcceptanceDisposition;
  readonly rationale: string;
  readonly gaps: readonly TypedGap[];
  readonly decided_at: string;
  readonly decision_digest: Sha256Digest;
}

export interface AcceptedSemanticCut {
  readonly schema_kind: "odd_world_model.accepted_semantic_cut";
  readonly schema_version: "v1";
  readonly semantic_cut_ref: string;
  readonly cut_role: "source_domain" | "domain_artifact" | "common_model" | "composed_world_model";
  readonly cut_version: string;
  readonly epistemic_status: "candidate";
  readonly proposal: ExactRef;
  readonly source_observation: ExactRef;
  readonly deterministic_check: ExactRef;
  readonly proposal_admission: ExactRef;
  readonly acceptance_decision: ExactRef;
  readonly acceptance_admission: ExactRef;
  readonly semantic_payload_digest: Sha256Digest;
  readonly governing_refs: readonly string[];
  readonly source_refs: readonly string[];
  readonly authority_refs: readonly string[];
  readonly dependency_identities: readonly string[];
  readonly temporal_coordinates: Readonly<Record<string, string>>;
  readonly fidelity: Fidelity;
  readonly losses: readonly string[];
  readonly exclusions: readonly string[];
  readonly gaps: readonly TypedGap[];
  readonly accepted_at: string;
  readonly accepted_cut_digest: Sha256Digest;
}

export interface SemanticPublicationCandidate {
  readonly schema_kind: "odd_world_model.semantic_publication_candidate";
  readonly schema_version: "v1";
  readonly publication_candidate_ref: string;
  readonly semantic_cut_ref: string;
  readonly cut_role: AcceptedSemanticCut["cut_role"];
  readonly cut_version: string;
  readonly publication_status: "ready_for_publication";
  readonly epistemic_status: "candidate";
  readonly source_observation: ExactRef;
  readonly accepted_semantic_cut: ExactRef;
  readonly semantic_cut_attestation: ExactRef;
  readonly physical_effect_observation: ExactRef;
  readonly physical_admission_witness: ExactRef;
  readonly snapshot_refs: readonly ExactRef[];
  readonly semantic_payload_digest: Sha256Digest;
  readonly governing_refs: readonly string[];
  readonly source_refs: readonly string[];
  readonly authority_refs: readonly string[];
  readonly dependency_identities: readonly string[];
  readonly temporal_coordinates: Readonly<Record<string, string>>;
  readonly fidelity: Fidelity;
  readonly losses: readonly string[];
  readonly exclusions: readonly string[];
  readonly gaps: readonly TypedGap[];
  readonly publication_candidate_digest: Sha256Digest;
}

export interface PublishedSemanticCut {
  readonly schema_kind: "odd_world_model.published_semantic_cut";
  readonly schema_version: "v1";
  readonly semantic_cut_ref: string;
  readonly cut_role: AcceptedSemanticCut["cut_role"];
  readonly cut_version: string;
  readonly publication_status: "published";
  readonly epistemic_status: "candidate";
  readonly source_observation: ExactRef;
  readonly publication_candidate: ExactRef;
  readonly publication_admission_witness: ExactRef;
  readonly accepted_semantic_cut: ExactRef;
  readonly semantic_cut_attestation: ExactRef;
  readonly physical_effect_observation: ExactRef;
  readonly physical_admission_witness: ExactRef;
  readonly snapshot_refs: readonly ExactRef[];
  readonly semantic_payload_digest: Sha256Digest;
  readonly governing_refs: readonly string[];
  readonly source_refs: readonly string[];
  readonly authority_refs: readonly string[];
  readonly dependency_identities: readonly string[];
  readonly temporal_coordinates: Readonly<Record<string, string>>;
  readonly fidelity: Fidelity;
  readonly losses: readonly string[];
  readonly exclusions: readonly string[];
  readonly gaps: readonly TypedGap[];
  readonly published_at: string;
  readonly publication_digest: Sha256Digest;
}

const replayDerivedAdmissionWitnesses = new WeakSet<AbgAdmissionWitness>();
const attributedAcceptanceDecisions = new WeakSet<WmAcceptanceDecision>();
const constructedAcceptedSemanticCuts = new WeakSet<AcceptedSemanticCut>();
const constructedPublicationCandidates = new WeakSet<SemanticPublicationCandidate>();
const constructedPublishedSemanticCuts = new WeakSet<PublishedSemanticCut>();

type Digestless<T, K extends keyof T> = Omit<T, K>;

function assertTimestamp(value: string, label: string): void {
  requireText(value, label);
  if (Number.isNaN(Date.parse(value))) throw new Error(`${label} must be a timestamp`);
}

function assertTypedGaps(gaps: readonly TypedGap[], label: string): void {
  gaps.forEach((gap, index) => {
    requireText(gap.gap_type, `${label}[${index}].gap_type`);
    requireText(gap.message, `${label}[${index}].message`);
    assertUniqueStrings(gap.evidence_refs, `${label}[${index}].evidence_refs`);
  });
}

export function assertSourceObservationDigest(observation: SourceObservation): void {
  assertExactRef(observation.source, "source observation source");
  requireText(observation.observation_ref, "source observation ref");
  requireText(observation.source_kind, "source observation kind");
  requireText(observation.authority_ref, "source observation authority");
  assertUniqueStrings(observation.evidence_refs, "source observation evidence_refs");
  assertTimestamp(observation.observed_at, "source observation observed_at");
  const { observation_digest: recorded, ...digestInput } = observation;
  const expected = sha256Digest(digestInput);
  if (recorded !== expected) throw new Error(`source observation digest mismatch: expected ${expected}`);
}

export function assertCheckReportDigest(report: DeterministicCheckReport): void {
  requireText(report.check_ref, "check report ref");
  assertExactRef(report.proposal, "check report proposal");
  assertUniqueStrings(report.check_contract_refs, "check report contract refs");
  if (report.check_contract_refs.length === 0) throw new Error("check report requires a contract ref");
  assertTypedGaps(report.issues, "check report issues");
  if ((report.status === "passed") !== (report.issues.length === 0)) {
    throw new Error("check report status does not match its issue set");
  }
  assertTimestamp(report.checked_at, "check report checked_at");
  const { check_digest: recorded, ...digestInput } = report;
  const expected = sha256Digest(digestInput);
  if (recorded !== expected) throw new Error(`check report digest mismatch: expected ${expected}`);
}

export function assertAcceptanceDecisionDigest(decision: WmAcceptanceDecision): void {
  requireText(decision.decision_ref, "acceptance decision ref");
  assertExactRef(decision.proposal, "acceptance decision proposal");
  assertExactRef(decision.deterministic_check, "acceptance decision deterministic_check");
  assertExactRef(decision.proposal_admission, "acceptance decision proposal_admission");
  requireText(decision.authority_ref, "acceptance decision authority");
  requireText(decision.rationale, "acceptance decision rationale");
  assertTypedGaps(decision.gaps, "acceptance decision gaps");
  if ((decision.disposition === "accepted") !== (decision.gaps.length === 0)) {
    throw new Error("acceptance decision disposition does not match its gap set");
  }
  assertTimestamp(decision.decided_at, "acceptance decision decided_at");
  const { decision_digest: recorded, ...digestInput } = decision;
  const expected = sha256Digest(digestInput);
  if (recorded !== expected) throw new Error(`acceptance decision digest mismatch: expected ${expected}`);
}

export function assertAcceptedSemanticCutDigest(cut: AcceptedSemanticCut): void {
  requireText(cut.semantic_cut_ref, "accepted cut ref");
  requireText(cut.cut_version, "accepted cut version");
  assertExactRef(cut.proposal, "accepted cut proposal");
  assertExactRef(cut.source_observation, "accepted cut source_observation");
  assertExactRef(cut.deterministic_check, "accepted cut deterministic_check");
  assertExactRef(cut.proposal_admission, "accepted cut proposal_admission");
  assertExactRef(cut.acceptance_decision, "accepted cut acceptance_decision");
  assertExactRef(cut.acceptance_admission, "accepted cut acceptance_admission");
  if (!isSha256Digest(cut.semantic_payload_digest)) {
    throw new Error("accepted cut semantic_payload_digest is not sha256");
  }
  for (const [label, refs] of Object.entries({
    governing_refs: cut.governing_refs,
    source_refs: cut.source_refs,
    authority_refs: cut.authority_refs,
    dependency_identities: cut.dependency_identities,
    losses: cut.losses,
    exclusions: cut.exclusions
  })) assertUniqueStrings(refs, `accepted cut ${label}`);
  if (Object.keys(cut.temporal_coordinates).length === 0) {
    throw new Error("accepted cut requires temporal coordinates");
  }
  if (cut.fidelity !== "lossy_projection" && cut.losses.length > 0) {
    throw new Error("accepted cut losses require lossy projection fidelity");
  }
  assertTypedGaps(cut.gaps, "accepted cut gaps");
  assertTimestamp(cut.accepted_at, "accepted cut accepted_at");
  const { accepted_cut_digest: recorded, ...digestInput } = cut;
  const expected = sha256Digest(digestInput);
  if (recorded !== expected) throw new Error(`accepted cut digest mismatch: expected ${expected}`);
}

export function exactRefForSourceObservation(observation: SourceObservation): ExactRef {
  assertSourceObservationDigest(observation);
  return Object.freeze({ ref: observation.observation_ref, digest: observation.observation_digest });
}

export function exactRefForSemanticProposal(proposal: SemanticProposal): ExactRef {
  assertSemanticProposalDigest(proposal);
  return Object.freeze({ ref: proposal.proposal_ref, digest: proposal.proposal_digest });
}

export function exactRefForCheckReport(report: DeterministicCheckReport): ExactRef {
  assertCheckReportDigest(report);
  return Object.freeze({ ref: report.check_ref, digest: report.check_digest });
}

export function exactRefForAdmissionWitness(witness: AbgAdmissionWitness): ExactRef {
  assertReplayDerivedAdmissionWitness(witness);
  return Object.freeze({ ref: witness.witness_ref, digest: witness.witness_digest });
}

export function exactRefForAcceptanceDecision(decision: WmAcceptanceDecision): ExactRef {
  assertAttributedAcceptanceDecision(decision);
  return Object.freeze({ ref: decision.decision_ref, digest: decision.decision_digest });
}

export function exactRefForAcceptedCut(cut: AcceptedSemanticCut): ExactRef {
  assertAcceptedSemanticCutAuthority(cut);
  return Object.freeze({ ref: cut.semantic_cut_ref, digest: cut.accepted_cut_digest, version: cut.cut_version });
}

export function exactRefForPublicationCandidate(candidate: SemanticPublicationCandidate): ExactRef {
  assertPublicationCandidateAuthority(candidate);
  return Object.freeze({
    ref: candidate.publication_candidate_ref,
    digest: candidate.publication_candidate_digest,
    version: candidate.cut_version
  });
}

export function assertPublicationCandidateDigest(candidate: SemanticPublicationCandidate): void {
  requireText(candidate.publication_candidate_ref, "publication candidate ref");
  requireText(candidate.semantic_cut_ref, "publication candidate semantic cut ref");
  requireText(candidate.cut_version, "publication candidate cut version");
  assertExactRef(candidate.source_observation, "publication candidate source_observation");
  assertExactRef(candidate.accepted_semantic_cut, "publication candidate accepted_semantic_cut");
  assertExactRef(candidate.semantic_cut_attestation, "publication candidate attestation");
  assertExactRef(candidate.physical_effect_observation, "publication candidate physical observation");
  assertExactRef(candidate.physical_admission_witness, "publication candidate physical admission");
  assertUniqueExactRefs(candidate.snapshot_refs, "publication candidate snapshot_refs");
  if (candidate.snapshot_refs.length === 0) throw new Error("publication candidate requires snapshots");
  if (!isSha256Digest(candidate.semantic_payload_digest)) {
    throw new Error("publication candidate semantic_payload_digest is not sha256");
  }
  const { publication_candidate_digest: recorded, ...digestInput } = candidate;
  const expected = sha256Digest(digestInput);
  if (recorded !== expected) throw new Error(`publication candidate digest mismatch: expected ${expected}`);
}

export function exactRefForPublishedCut(cut: PublishedSemanticCut): ExactRef {
  assertPublishedSemanticCutAuthority(cut);
  return Object.freeze({ ref: cut.semantic_cut_ref, digest: cut.publication_digest, version: cut.cut_version });
}

export function assertPublishedSemanticCutDigest(cut: PublishedSemanticCut): void {
  requireText(cut.semantic_cut_ref, "published cut ref");
  requireText(cut.cut_version, "published cut version");
  assertExactRef(cut.source_observation, "published cut source_observation");
  assertExactRef(cut.publication_candidate, "published cut publication_candidate");
  assertExactRef(cut.publication_admission_witness, "published cut publication_admission_witness");
  assertExactRef(cut.accepted_semantic_cut, "published cut accepted_semantic_cut");
  assertExactRef(cut.semantic_cut_attestation, "published cut semantic_cut_attestation");
  assertExactRef(cut.physical_effect_observation, "published cut physical_effect_observation");
  assertExactRef(cut.physical_admission_witness, "published cut physical_admission_witness");
  assertUniqueExactRefs(cut.snapshot_refs, "published cut snapshot_refs");
  if (cut.snapshot_refs.length === 0) throw new Error("published cut requires snapshots");
  if (!isSha256Digest(cut.semantic_payload_digest)) {
    throw new Error("published cut semantic_payload_digest is not sha256");
  }
  assertTimestamp(cut.published_at, "published cut published_at");
  const { publication_digest: recorded, ...digestInput } = cut;
  const expected = sha256Digest(digestInput);
  if (recorded !== expected) throw new Error(`published semantic cut digest mismatch: expected ${expected}`);
}

export function assertReplayDerivedAdmissionWitness(witness: AbgAdmissionWitness): void {
  assertAdmissionWitnessDigest(witness);
  if (!replayDerivedAdmissionWitnesses.has(witness)) {
    throw new Error("admission witness is structurally valid but was not derived from an authentic ABG public-start proof");
  }
}

function assertAttributedAcceptanceDecision(decision: WmAcceptanceDecision): void {
  assertAcceptanceDecisionDigest(decision);
  if (!attributedAcceptanceDecisions.has(decision)) {
    throw new Error("acceptance decision was not produced by the attributed WM authority boundary");
  }
}

export function assertAcceptedSemanticCutAuthority(cut: AcceptedSemanticCut): void {
  assertAcceptedSemanticCutDigest(cut);
  if (!constructedAcceptedSemanticCuts.has(cut)) {
    throw new Error("accepted semantic cut was not produced by the governed acceptance constructor");
  }
}

function assertPublicationCandidateAuthority(candidate: SemanticPublicationCandidate): void {
  assertPublicationCandidateDigest(candidate);
  if (!constructedPublicationCandidates.has(candidate)) {
    throw new Error("publication candidate was not produced from governed semantic and physical evidence");
  }
}

export function assertPublishedSemanticCutAuthority(cut: PublishedSemanticCut): void {
  assertPublishedSemanticCutDigest(cut);
  if (!constructedPublishedSemanticCuts.has(cut)) {
    throw new Error("published semantic cut was not produced by the governed publication constructor");
  }
}

export function exactRefForAttestation(attestation: SemanticCutAttestation): ExactRef {
  validateSemanticCutAttestation(attestation);
  return Object.freeze({ ref: attestation.attestation_id, digest: attestation.attestation_digest });
}

export function exactRefForPhysicalObservation(observation: PhysicalEffectObservation): ExactRef {
  validatePhysicalEffectObservation(observation);
  if (observation.subject_attestation_id === undefined) {
    throw new Error("physical observation has no exact attestation subject");
  }
  return Object.freeze({
    ref: `physical-effect-observation:${observation.subject_attestation_id}:${observation.observed_at}`,
    digest: sha256Digest(observation)
  });
}

export function exactSnapshotRefsForAttestation(
  attestation: SemanticCutAttestation
): readonly ExactRef[] {
  validateSemanticCutAttestation(attestation);
  return Object.freeze(attestation.snapshots.map((snapshot) => Object.freeze({
    ref: `iceberg-snapshot://${snapshot.table_identifier}/${snapshot.snapshot_id}`,
    digest: snapshot.payload_digest,
    version: snapshot.metadata_location
  })));
}

export function exactEvidenceRef(subject: ExactRef): string {
  assertExactRef(subject, "subject");
  const version = subject.version === undefined ? "" : `&version=${encodeURIComponent(subject.version)}`;
  return `evidence://odd_world_model/exact/v1?ref=${encodeURIComponent(subject.ref)}&digest=${encodeURIComponent(subject.digest)}${version}`;
}

export function exactInputBinding(subject: ExactRef, assetType: string): StartInputAssetBinding {
  requireText(assetType, "assetType");
  return Object.freeze({
    assetRef: subject.ref,
    assetType,
    uri: exactEvidenceRef(subject)
  });
}

export function createSourceObservation(
  input: Digestless<SourceObservation, "observation_digest">
): SourceObservation {
  requireText(input.observation_ref, "observation_ref");
  assertExactRef(input.source, "source");
  requireText(input.source_kind, "source_kind");
  requireText(input.authority_ref, "authority_ref");
  assertUniqueStrings(input.evidence_refs, "evidence_refs");
  assertTimestamp(input.observed_at, "observed_at");
  return Object.freeze({ ...input, observation_digest: sha256Digest(input) });
}

export function createSemanticProposal(input: Omit<SemanticProposal, "payload_digest" | "proposal_digest">): SemanticProposal {
  requireText(input.proposal_ref, "proposal_ref");
  assertExactRef(input.source_observation, "source_observation");
  requireText(input.proposed_by, "proposed_by");
  requireText(input.payload_schema_ref, "payload_schema_ref");
  assertTimestamp(input.created_at, "created_at");
  if (input.epistemic_status !== "candidate") throw new Error("semantic proposals must remain candidate");
  const withPayloadDigest = Object.freeze({ ...input, payload_digest: sha256Digest(input.payload) });
  return Object.freeze({ ...withPayloadDigest, proposal_digest: sha256Digest(withPayloadDigest) });
}

export function assertSemanticProposalDigest(proposal: SemanticProposal): void {
  if (proposal.payload_digest !== sha256Digest(proposal.payload)) {
    throw new Error("semantic proposal payload_digest mismatch");
  }
  const { proposal_digest: recorded, ...digestInput } = proposal;
  const expected = sha256Digest(digestInput);
  if (recorded !== expected) throw new Error(`semantic proposal digest mismatch: expected ${expected}`);
}

export function checkSemanticProposal(input: {
  readonly checkRef: string;
  readonly proposal: SemanticProposal;
  readonly sourceObservation: SourceObservation;
  readonly payloadChecks: readonly DeterministicPayloadCheck[];
  readonly checkedAt: string;
  readonly additionalIssues?: readonly TypedGap[];
}): DeterministicCheckReport {
  requireText(input.checkRef, "checkRef");
  assertTimestamp(input.checkedAt, "checkedAt");
  if (input.payloadChecks.length === 0) throw new Error("payloadChecks must not be empty");
  const checkContractRefs = input.payloadChecks.map((check) => check.contractRef);
  assertUniqueStrings(checkContractRefs, "payloadChecks contract refs");
  assertSemanticProposalDigest(input.proposal);
  const sourceRef = exactRefForSourceObservation(input.sourceObservation);
  if (exactRefKey(input.proposal.source_observation) !== exactRefKey(sourceRef)) {
    throw new Error("semantic proposal does not identify the exact source observation");
  }
  const checkIssues = input.payloadChecks.flatMap((check) => {
    requireText(check.contractRef, "payload check contractRef");
    try {
      return [...check.validate(input.proposal.payload)];
    } catch (error: unknown) {
      return [{
        gap_type: "deterministic_payload_check_failed",
        message: error instanceof Error ? error.message : String(error),
        retryable: false,
        evidence_refs: [input.proposal.proposal_ref, check.contractRef]
      } satisfies TypedGap];
    }
  });
  const issues = Object.freeze([...checkIssues, ...(input.additionalIssues ?? [])]);
  assertTypedGaps(issues, "additionalIssues");
  const reportInput = {
    schema_kind: "odd_world_model.deterministic_check_report" as const,
    schema_version: "v1" as const,
    check_ref: input.checkRef,
    proposal: exactRefForSemanticProposal(input.proposal),
    check_contract_refs: Object.freeze(checkContractRefs),
    status: issues.length === 0 ? "passed" as const : "failed" as const,
    issues,
    checked_at: input.checkedAt
  };
  return Object.freeze({ ...reportInput, check_digest: sha256Digest(reportInput) });
}

type RuntimeRecord = Readonly<Record<string, unknown>>;

function runtimeRecord(event: unknown): RuntimeRecord {
  if (event === null || typeof event !== "object" || Array.isArray(event)) {
    throw new Error("runtime event must be an object");
  }
  return event as RuntimeRecord;
}

function runtimeString(event: unknown, field: string): string | null {
  const value = runtimeRecord(event)[field];
  return typeof value === "string" ? value : null;
}

function runtimeStrings(event: unknown, field: string): readonly string[] {
  const value = runtimeRecord(event)[field];
  return Array.isArray(value) && value.every((item) => typeof item === "string") ? value : [];
}

function eventRef(event: unknown): string {
  const ref = runtimeString(event, "eventId") ?? runtimeString(event, "eventRef");
  if (ref === null) throw new Error("runtime event has no exact event reference");
  return ref;
}

export function deriveAbgAdmissionWitness(input: {
  readonly witnessRef: string;
  readonly admissionKind: AdmissionKind;
  readonly subjects: readonly ExactRef[];
  readonly proof: WorldModelPublicStartProof;
  readonly requireProbabilisticOrigin?: boolean;
}): AbgAdmissionWitness {
  requireText(input.witnessRef, "witnessRef");
  assertProducedWorldModelPublicStartProof(input.proof);
  if (input.proof.start_intent.until !== "converged") {
    throw new Error("admission witness requires a converged ABG run");
  }
  if (input.subjects.length === 0) throw new Error("admission witness subjects must not be empty");
  assertUniqueExactRefs(input.subjects, "subjects");
  const evidenceRefs = Object.freeze(input.subjects.map(exactEvidenceRef));
  for (const [index, subject] of input.subjects.entries()) {
    if (!input.proof.bound_evidence_refs.includes(evidenceRefs[index]!)) {
      throw new Error(`ABG run did not bind evidence for ${subject.ref}`);
    }
    const binding = input.proof.start_intent.inputBindings?.find((candidate) => (
      candidate.assetRef === subject.ref && candidate.uri === evidenceRefs[index]
    ));
    if (binding === undefined) throw new Error(`ABG run did not bind exact input ${subject.ref}`);
  }

  const selectedEvents = input.proof.runtime_events.filter((event) => event.kind === "graph_function_selected");
  const selected = selectedEvents[0];
  if (selected === undefined) throw new Error("ABG run did not select a GraphFunction");
  const selectedGraphFunctionRef = runtimeString(selected, "selectedGraphFunctionRef");
  if (selectedGraphFunctionRef === null) throw new Error("selected GraphFunction has no exact ref");
  const graphCallEvents = input.proof.runtime_events.filter((event) => event.kind === "graph_call_opened");
  const graphCallRefs = Object.freeze([...new Set(graphCallEvents.map((event) => {
    const ref = runtimeString(event, "graphCallId");
    if (ref === null) throw new Error("graph_call_opened event has no graphCallId");
    return ref;
  }))]);
  if (graphCallRefs.length === 0) throw new Error("ABG run opened no graph call");

  const evidenceEvents = input.proof.runtime_events.filter((event) => {
    if (event.kind === "evidence_admitted") {
      return evidenceRefs.includes(runtimeString(event, "evidenceRef") ?? "");
    }
    if (event.kind === "fd_authority_outcome_admitted") {
      return runtimeString(event, "status") === "accepted" &&
        runtimeStrings(event, "evidenceRefs").some((ref) => evidenceRefs.includes(ref));
    }
    return false;
  });
  for (const evidence of evidenceRefs) {
    const admitted = evidenceEvents.some((event) => (
      runtimeString(event, "evidenceRef") === evidence || runtimeStrings(event, "evidenceRefs").includes(evidence)
    ));
    if (!admitted) throw new Error(`ABG replay did not admit ${evidence}`);
  }
  if (input.requireProbabilisticOrigin === true) {
    const actorResult = input.proof.runtime_events.find((event) => event.kind === "actor_result_artifact_observed");
    if (actorResult === undefined) throw new Error("admission has no F_P actor result artifact");
    const excerpt = runtimeString(actorResult, "artifactContentExcerpt") ?? "";
    if (!evidenceRefs.every((evidence) => excerpt.includes(evidence))) {
      throw new Error("F_P actor result does not carry every exact candidate evidence ref");
    }
  }
  const closedEvents = input.proof.runtime_events.filter((event) => event.kind === "vector_closed");
  if (closedEvents.length === 0) throw new Error("ABG replay has no closed vector");
  const terminal = [...input.proof.runtime_events].reverse().find((event) => event.kind === "terminal_reached");
  if (terminal === undefined || runtimeString(terminal, "terminalKind") !== "converged") {
    throw new Error("ABG replay did not reach a converged terminal");
  }
  const evidenceEventRefs = Object.freeze([...new Set(evidenceEvents.map(eventRef))]);
  const vectorClosedEventRefs = Object.freeze([...new Set(closedEvents.map(eventRef))]);
  const runtimeEventRefs = Object.freeze([
    eventRef(selected),
    ...graphCallEvents.map(eventRef),
    ...evidenceEventRefs,
    ...vectorClosedEventRefs,
    eventRef(terminal)
  ].filter((ref, index, all) => all.indexOf(ref) === index));
  const admittedAt = runtimeString(terminal, "eventTime");
  if (admittedAt === null) throw new Error("terminal event has no admitted time");
  const witnessInput = {
    schema_kind: "odd_world_model.abg_admission_witness" as const,
    schema_version: "v1" as const,
    witness_ref: input.witnessRef,
    admission_kind: input.admissionKind,
    status: "admitted" as const,
    subjects: Object.freeze([...input.subjects]),
    target_handle: input.proof.target_handle,
    selected_graph_function_ref: selectedGraphFunctionRef,
    graph_call_refs: graphCallRefs,
    evidence_refs: evidenceRefs,
    evidence_event_refs: evidenceEventRefs,
    vector_closed_event_refs: vectorClosedEventRefs,
    terminal_event_ref: eventRef(terminal),
    runtime_event_refs: runtimeEventRefs,
    admitted_at: admittedAt
  };
  const witness = Object.freeze({ ...witnessInput, witness_digest: sha256Digest(witnessInput) });
  replayDerivedAdmissionWitnesses.add(witness);
  return witness;
}

export function assertAdmissionWitnessDigest(witness: AbgAdmissionWitness): void {
  requireText(witness.witness_ref, "admission witness ref");
  assertUniqueExactRefs(witness.subjects, "admission witness subjects");
  if (witness.subjects.length === 0) throw new Error("admission witness requires subjects");
  requireText(witness.target_handle, "admission witness target handle");
  requireText(witness.selected_graph_function_ref, "admission witness selected GraphFunction");
  assertUniqueStrings(witness.graph_call_refs, "admission witness graph_call_refs");
  assertUniqueStrings(witness.evidence_refs, "admission witness evidence_refs");
  assertUniqueStrings(witness.evidence_event_refs, "admission witness evidence_event_refs");
  assertUniqueStrings(witness.vector_closed_event_refs, "admission witness vector_closed_event_refs");
  assertUniqueStrings(witness.runtime_event_refs, "admission witness runtime_event_refs");
  if (witness.graph_call_refs.length === 0 || witness.evidence_event_refs.length === 0 ||
      witness.vector_closed_event_refs.length === 0) {
    throw new Error("admission witness requires graph-call, evidence, and vector-closure events");
  }
  const expectedEvidenceRefs = witness.subjects.map(exactEvidenceRef);
  if (expectedEvidenceRefs.some((ref) => !witness.evidence_refs.includes(ref)) ||
      witness.evidence_refs.length !== expectedEvidenceRefs.length) {
    throw new Error("admission witness evidence refs do not exactly match its subjects");
  }
  for (const eventRefValue of [
    ...witness.evidence_event_refs,
    ...witness.vector_closed_event_refs,
    witness.terminal_event_ref
  ]) {
    if (!witness.runtime_event_refs.includes(eventRefValue)) {
      throw new Error(`admission witness runtime closure omits ${eventRefValue}`);
    }
  }
  assertTimestamp(witness.admitted_at, "admission witness admitted_at");
  const { witness_digest: recorded, ...digestInput } = witness;
  const expected = sha256Digest(digestInput);
  if (recorded !== expected) throw new Error(`admission witness digest mismatch: expected ${expected}`);
}

export function decideSemanticAcceptance(input: {
  readonly decisionRef: string;
  readonly proposal: SemanticProposal;
  readonly checkReport: DeterministicCheckReport;
  readonly proposalAdmission: AbgAdmissionWitness;
  readonly authorityRef: string;
  readonly disposition: WmAcceptanceDisposition;
  readonly rationale: string;
  readonly gaps?: readonly TypedGap[];
  readonly decidedAt: string;
}): WmAcceptanceDecision {
  requireText(input.decisionRef, "decisionRef");
  requireText(input.authorityRef, "authorityRef");
  requireText(input.rationale, "rationale");
  assertTimestamp(input.decidedAt, "decidedAt");
  assertSemanticProposalDigest(input.proposal);
  assertReplayDerivedAdmissionWitness(input.proposalAdmission);
  if (input.proposalAdmission.admission_kind !== "proposal_evidence") {
    throw new Error("semantic acceptance requires proposal-evidence admission");
  }
  const proposalRef = exactRefForSemanticProposal(input.proposal);
  if (!input.proposalAdmission.subjects.some((subject) => exactRefKey(subject) === exactRefKey(proposalRef))) {
    throw new Error("proposal admission does not identify the exact semantic proposal");
  }
  if (exactRefKey(input.checkReport.proposal) !== exactRefKey(proposalRef)) {
    throw new Error("deterministic check does not identify the exact semantic proposal");
  }
  const gaps = Object.freeze([...(input.gaps ?? [])]);
  assertTypedGaps(gaps, "gaps");
  if (input.disposition === "accepted" && (input.checkReport.status !== "passed" || gaps.length > 0)) {
    throw new Error("accepted semantic decision requires passed checks and no gaps");
  }
  if (input.disposition !== "accepted" && gaps.length === 0) {
    throw new Error("non-accepted semantic decision requires at least one typed gap");
  }
  const decisionInput = {
    schema_kind: "odd_world_model.wm_acceptance_decision" as const,
    schema_version: "v1" as const,
    decision_ref: input.decisionRef,
    proposal: proposalRef,
    deterministic_check: exactRefForCheckReport(input.checkReport),
    proposal_admission: exactRefForAdmissionWitness(input.proposalAdmission),
    authority_ref: input.authorityRef,
    disposition: input.disposition,
    rationale: input.rationale,
    gaps,
    decided_at: input.decidedAt
  };
  const decision = Object.freeze({ ...decisionInput, decision_digest: sha256Digest(decisionInput) });
  attributedAcceptanceDecisions.add(decision);
  return decision;
}

export interface AcceptedSemanticCutInput {
  readonly semanticCutRef: string;
  readonly cutRole: AcceptedSemanticCut["cut_role"];
  readonly cutVersion: string;
  readonly governingRefs: readonly string[];
  readonly sourceRefs: readonly string[];
  readonly authorityRefs: readonly string[];
  readonly dependencyIdentities: readonly string[];
  readonly temporalCoordinates: Readonly<Record<string, string>>;
  readonly fidelity: Fidelity;
  readonly losses: readonly string[];
  readonly exclusions: readonly string[];
  readonly gaps?: readonly TypedGap[];
  readonly acceptedAt: string;
}

export function createAcceptedSemanticCut(input: {
  readonly proposal: SemanticProposal;
  readonly checkReport: DeterministicCheckReport;
  readonly proposalAdmission: AbgAdmissionWitness;
  readonly acceptanceDecision: WmAcceptanceDecision;
  readonly acceptanceAdmission: AbgAdmissionWitness;
  readonly cut: AcceptedSemanticCutInput;
}): AcceptedSemanticCut {
  assertSemanticProposalDigest(input.proposal);
  assertCheckReportDigest(input.checkReport);
  assertReplayDerivedAdmissionWitness(input.proposalAdmission);
  assertAttributedAcceptanceDecision(input.acceptanceDecision);
  if (input.acceptanceDecision.disposition !== "accepted") {
    throw new Error("only an accepted WM decision can create an accepted semantic cut");
  }
  if (input.checkReport.status !== "passed" || input.checkReport.issues.length > 0) {
    throw new Error("accepted semantic cut requires a passed deterministic check");
  }
  const proposalRef = exactRefForSemanticProposal(input.proposal);
  if (!input.proposalAdmission.subjects.some((subject) => exactRefKey(subject) === exactRefKey(proposalRef))) {
    throw new Error("accepted semantic cut requires admission of the exact proposal");
  }
  if (exactRefKey(input.acceptanceDecision.proposal) !== exactRefKey(proposalRef)) {
    throw new Error("acceptance decision does not identify the exact proposal");
  }
  if (exactRefKey(input.acceptanceDecision.deterministic_check) !== exactRefKey(exactRefForCheckReport(input.checkReport))) {
    throw new Error("acceptance decision does not identify the exact check report");
  }
  if (exactRefKey(input.acceptanceDecision.proposal_admission) !== exactRefKey(exactRefForAdmissionWitness(input.proposalAdmission))) {
    throw new Error("acceptance decision does not identify the exact admission witness");
  }
  assertReplayDerivedAdmissionWitness(input.acceptanceAdmission);
  if (input.acceptanceAdmission.admission_kind !== "acceptance_evidence") {
    throw new Error("accepted cut requires acceptance-evidence admission");
  }
  const decisionRef = exactRefForAcceptanceDecision(input.acceptanceDecision);
  for (const required of [decisionRef, exactRefForCheckReport(input.checkReport)]) {
    if (!input.acceptanceAdmission.subjects.some((subject) => exactRefKey(subject) === exactRefKey(required))) {
      throw new Error(`acceptance admission does not identify ${required.ref}`);
    }
  }
  requireText(input.cut.semanticCutRef, "semanticCutRef");
  requireText(input.cut.cutVersion, "cutVersion");
  assertTimestamp(input.cut.acceptedAt, "acceptedAt");
  for (const [label, refs] of Object.entries({
    governingRefs: input.cut.governingRefs,
    sourceRefs: input.cut.sourceRefs,
    authorityRefs: input.cut.authorityRefs,
    dependencyIdentities: input.cut.dependencyIdentities,
    losses: input.cut.losses,
    exclusions: input.cut.exclusions
  })) assertUniqueStrings(refs, label);
  if (!input.cut.authorityRefs.includes(input.acceptanceDecision.authority_ref)) {
    throw new Error("accepted cut must retain the accepting WM authority");
  }
  if (Object.keys(input.cut.temporalCoordinates).length === 0) {
    throw new Error("accepted cut requires temporal coordinates");
  }
  const gaps = Object.freeze([...(input.cut.gaps ?? [])]);
  assertTypedGaps(gaps, "gaps");
  const acceptedInput = {
    schema_kind: "odd_world_model.accepted_semantic_cut" as const,
    schema_version: "v1" as const,
    semantic_cut_ref: input.cut.semanticCutRef,
    cut_role: input.cut.cutRole,
    cut_version: input.cut.cutVersion,
    epistemic_status: "candidate" as const,
    proposal: proposalRef,
    source_observation: input.proposal.source_observation,
    deterministic_check: exactRefForCheckReport(input.checkReport),
    proposal_admission: exactRefForAdmissionWitness(input.proposalAdmission),
    acceptance_decision: decisionRef,
    acceptance_admission: exactRefForAdmissionWitness(input.acceptanceAdmission),
    semantic_payload_digest: input.proposal.payload_digest,
    governing_refs: Object.freeze([...input.cut.governingRefs]),
    source_refs: Object.freeze([...input.cut.sourceRefs]),
    authority_refs: Object.freeze([...input.cut.authorityRefs]),
    dependency_identities: Object.freeze([...input.cut.dependencyIdentities]),
    temporal_coordinates: Object.freeze({ ...input.cut.temporalCoordinates }),
    fidelity: input.cut.fidelity,
    losses: Object.freeze([...input.cut.losses]),
    exclusions: Object.freeze([...input.cut.exclusions]),
    gaps,
    accepted_at: input.cut.acceptedAt
  };
  const acceptedCut = Object.freeze({ ...acceptedInput, accepted_cut_digest: sha256Digest(acceptedInput) });
  constructedAcceptedSemanticCuts.add(acceptedCut);
  return acceptedCut;
}

export function createSemanticPublicationCandidate(input: {
  readonly acceptedCut: AcceptedSemanticCut;
  readonly attestation: SemanticCutAttestation;
  readonly effectObservation: PhysicalEffectObservation;
  readonly physicalAdmission: AbgAdmissionWitness;
}): SemanticPublicationCandidate {
  assertAcceptedSemanticCutAuthority(input.acceptedCut);
  validateSemanticCutAttestation(input.attestation);
  validatePhysicalEffectObservation(input.effectObservation);
  assertReplayDerivedAdmissionWitness(input.physicalAdmission);
  if (input.attestation.semantic_cut_ref !== input.acceptedCut.semantic_cut_ref ||
      input.attestation.semantic_cut_digest !== input.acceptedCut.accepted_cut_digest) {
    throw new Error("attestation does not bind the exact accepted semantic cut");
  }
  if (input.effectObservation.observation_status !== "reproduced" ||
      input.effectObservation.subject_attestation_id !== input.attestation.attestation_id ||
      input.effectObservation.subject_attestation_digest !== input.attestation.attestation_digest) {
    throw new Error("physical observation does not reproduce the exact attestation");
  }
  if (input.physicalAdmission.admission_kind !== "physical_effect") {
    throw new Error("publication requires physical-effect admission");
  }
  const requiredSubjects = [
    exactRefForAttestation(input.attestation),
    exactRefForPhysicalObservation(input.effectObservation)
  ];
  for (const required of requiredSubjects) {
    if (!input.physicalAdmission.subjects.some((subject) => exactRefKey(subject) === exactRefKey(required))) {
      throw new Error(`physical admission does not identify ${required.ref}`);
    }
  }
  const snapshotRefs = exactSnapshotRefsForAttestation(input.attestation);
  const candidateInput = {
    schema_kind: "odd_world_model.semantic_publication_candidate" as const,
    schema_version: "v1" as const,
    publication_candidate_ref: `publication-candidate:${input.acceptedCut.semantic_cut_ref}`,
    semantic_cut_ref: input.acceptedCut.semantic_cut_ref,
    cut_role: input.acceptedCut.cut_role,
    cut_version: input.acceptedCut.cut_version,
    publication_status: "ready_for_publication" as const,
    epistemic_status: input.acceptedCut.epistemic_status,
    source_observation: input.acceptedCut.source_observation,
    accepted_semantic_cut: exactRefForAcceptedCut(input.acceptedCut),
    semantic_cut_attestation: exactRefForAttestation(input.attestation),
    physical_effect_observation: exactRefForPhysicalObservation(input.effectObservation),
    physical_admission_witness: exactRefForAdmissionWitness(input.physicalAdmission),
    snapshot_refs: snapshotRefs,
    semantic_payload_digest: input.acceptedCut.semantic_payload_digest,
    governing_refs: input.acceptedCut.governing_refs,
    source_refs: input.acceptedCut.source_refs,
    authority_refs: input.acceptedCut.authority_refs,
    dependency_identities: input.acceptedCut.dependency_identities,
    temporal_coordinates: input.acceptedCut.temporal_coordinates,
    fidelity: input.acceptedCut.fidelity,
    losses: input.acceptedCut.losses,
    exclusions: input.acceptedCut.exclusions,
    gaps: input.acceptedCut.gaps
  };
  const candidate = Object.freeze({
    ...candidateInput,
    publication_candidate_digest: sha256Digest(candidateInput)
  });
  constructedPublicationCandidates.add(candidate);
  return candidate;
}

export function createPublishedSemanticCut(input: {
  readonly candidate: SemanticPublicationCandidate;
  readonly publicationAdmission: AbgAdmissionWitness;
  readonly publishedAt: string;
}): PublishedSemanticCut {
  assertPublicationCandidateAuthority(input.candidate);
  assertReplayDerivedAdmissionWitness(input.publicationAdmission);
  assertTimestamp(input.publishedAt, "publishedAt");
  if (input.publicationAdmission.admission_kind !== "published_cut") {
    throw new Error("publication requires a published-cut admission witness");
  }
  const candidateRef = exactRefForPublicationCandidate(input.candidate);
  if (!input.publicationAdmission.subjects.some((subject) => exactRefKey(subject) === exactRefKey(candidateRef))) {
    throw new Error("publication admission does not identify the exact publication candidate");
  }
  const publicationInput = {
    schema_kind: "odd_world_model.published_semantic_cut" as const,
    schema_version: "v1" as const,
    semantic_cut_ref: input.candidate.semantic_cut_ref,
    cut_role: input.candidate.cut_role,
    cut_version: input.candidate.cut_version,
    publication_status: "published" as const,
    epistemic_status: input.candidate.epistemic_status,
    source_observation: input.candidate.source_observation,
    publication_candidate: candidateRef,
    publication_admission_witness: exactRefForAdmissionWitness(input.publicationAdmission),
    accepted_semantic_cut: input.candidate.accepted_semantic_cut,
    semantic_cut_attestation: input.candidate.semantic_cut_attestation,
    physical_effect_observation: input.candidate.physical_effect_observation,
    physical_admission_witness: input.candidate.physical_admission_witness,
    snapshot_refs: input.candidate.snapshot_refs,
    semantic_payload_digest: input.candidate.semantic_payload_digest,
    governing_refs: input.candidate.governing_refs,
    source_refs: input.candidate.source_refs,
    authority_refs: input.candidate.authority_refs,
    dependency_identities: input.candidate.dependency_identities,
    temporal_coordinates: input.candidate.temporal_coordinates,
    fidelity: input.candidate.fidelity,
    losses: input.candidate.losses,
    exclusions: input.candidate.exclusions,
    gaps: input.candidate.gaps,
    published_at: input.publishedAt
  };
  const publishedCut = Object.freeze({ ...publicationInput, publication_digest: sha256Digest(publicationInput) });
  constructedPublishedSemanticCuts.add(publishedCut);
  return publishedCut;
}
