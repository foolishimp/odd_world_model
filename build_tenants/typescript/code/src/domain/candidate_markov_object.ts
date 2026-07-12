import { sha256Digest } from "./canonical.ts";
import {
  assertExactRef,
  assertUniqueStrings,
  exactRefKey,
  requireText
} from "./exact_refs.ts";
import type { ExactRef, Sha256Digest, TypedGap } from "./semantic_memory.ts";
import type { JsonObject } from "./types.ts";
import type { DeterministicPayloadCheck } from "./semantic_publication.ts";

export interface CandidateMarkovObjectCut {
  readonly schema_kind: "odd_world_model.candidate_markov_object_cut";
  readonly schema_version: "v1";
  readonly object_ref: string;
  readonly object_identity: string;
  readonly identity_direction: {
    readonly source_state_refs: readonly string[];
    readonly target_state_refs: readonly string[];
    readonly projection_ref: string;
  };
  readonly projection_support_refs: readonly string[];
  readonly distributed_ledger_evidence_refs: readonly string[];
  readonly candidate_basis: ExactRef;
  readonly null_peer_basis: ExactRef;
  readonly held_out_treatment_verification: {
    readonly treatment_ref: string;
    readonly corpus_ref: string;
    readonly result: "inconclusive";
    readonly evidence_refs: readonly string[];
  };
  readonly boundary: {
    readonly included_refs: readonly string[];
    readonly excluded_refs: readonly string[];
    readonly rationale: string;
  };
  readonly publication_classification: "candidate";
  readonly source_observation: ExactRef;
  readonly authority_ref: string;
  readonly created_at: string;
  readonly cut_digest: Sha256Digest;
}

export type CandidateMarkovObjectCutInput = Omit<CandidateMarkovObjectCut, "cut_digest">;

function requireRefs(values: readonly string[], label: string, allowEmpty = false): void {
  assertUniqueStrings(values, label);
  if (!allowEmpty && values.length === 0) throw new Error(`${label} must not be empty`);
}

export function createCandidateMarkovObjectCut(
  input: CandidateMarkovObjectCutInput
): CandidateMarkovObjectCut {
  requireText(input.object_ref, "object_ref");
  requireText(input.object_identity, "object_identity");
  requireRefs(input.identity_direction.source_state_refs, "identity_direction.source_state_refs");
  requireRefs(input.identity_direction.target_state_refs, "identity_direction.target_state_refs");
  requireText(input.identity_direction.projection_ref, "identity_direction.projection_ref");
  requireRefs(input.projection_support_refs, "projection_support_refs");
  requireRefs(input.distributed_ledger_evidence_refs, "distributed_ledger_evidence_refs");
  assertExactRef(input.candidate_basis, "candidate_basis");
  assertExactRef(input.null_peer_basis, "null_peer_basis");
  if (exactRefKey(input.candidate_basis) === exactRefKey(input.null_peer_basis)) {
    throw new Error("candidate and null-peer basis must remain distinct");
  }
  requireText(input.held_out_treatment_verification.treatment_ref, "held_out_treatment_verification.treatment_ref");
  requireText(input.held_out_treatment_verification.corpus_ref, "held_out_treatment_verification.corpus_ref");
  requireRefs(input.held_out_treatment_verification.evidence_refs, "held_out_treatment_verification.evidence_refs");
  if (input.held_out_treatment_verification.result !== "inconclusive") {
    throw new Error("candidate v1 cannot self-assert a held-out treatment result");
  }
  requireRefs(input.boundary.included_refs, "boundary.included_refs");
  requireRefs(input.boundary.excluded_refs, "boundary.excluded_refs", true);
  requireText(input.boundary.rationale, "boundary.rationale");
  if (input.publication_classification !== "candidate") {
    throw new Error("this constructor cannot promote a Markov object to established");
  }
  assertExactRef(input.source_observation, "source_observation");
  requireText(input.authority_ref, "authority_ref");
  if (Number.isNaN(Date.parse(input.created_at))) throw new Error("created_at must be a timestamp");
  return Object.freeze({ ...input, cut_digest: sha256Digest(input) });
}

export function assertCandidateMarkovObjectCutDigest(cut: CandidateMarkovObjectCut): void {
  const { cut_digest: recorded, ...digestInput } = cut;
  const expected = sha256Digest(digestInput);
  if (recorded !== expected) throw new Error(`candidate Markov-object digest mismatch: expected ${expected}`);
}

export const candidateMarkovObjectPayloadCheck: DeterministicPayloadCheck = Object.freeze({
  contractRef: "workspace://build_tenants/common/schemas/candidate_markov_object_cut.schema.json",
  validate: (payload: JsonObject): readonly TypedGap[] => {
    const candidate = payload as unknown as CandidateMarkovObjectCut;
    const { cut_digest: recorded, ...candidateInput } = candidate;
    const rebuilt = createCandidateMarkovObjectCut(candidateInput);
    if (recorded !== rebuilt.cut_digest) throw new Error("candidate Markov-object payload digest mismatch");
    return Object.freeze([]);
  }
});
