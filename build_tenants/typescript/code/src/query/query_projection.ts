import { sha256Digest } from "../domain/canonical.ts";
import { exactRefKey, requireText } from "../domain/exact_refs.ts";
import {
  assertReplayDerivedAdmissionWitness,
  assertPublishedSemanticCutAuthority,
  exactRefForAdmissionWitness,
  exactRefForAttestation,
  exactRefForPublishedCut,
  exactSnapshotRefsForAttestation,
  type AbgAdmissionWitness,
  type PublishedSemanticCut
} from "../domain/semantic_publication.ts";
import {
  assertContextProjectionMatchesBasis
} from "../context/context_memory.ts";
import type {
  BoundedMeshCut,
  ContextBasis,
  ContextProjection,
  ExactRef,
  MeshClosureRule,
  SemanticLink,
  SemanticRelationRole,
  Sha256Digest
} from "../domain/semantic_memory.ts";
import { createBoundedMeshCut } from "../mesh/semantic_mesh.ts";
import {
  validateSemanticCutAttestation,
  type SemanticCutAttestation,
  type SnapshotBinding
} from "../storage/physical_cut_store.ts";

export interface WorldModelQueryProjection {
  readonly schema_kind: "odd_world_model.query_projection";
  readonly schema_version: "v1";
  readonly query_ref: string;
  readonly query_contract_ref: string;
  readonly query_contract_version: string;
  readonly semantic_cut: ExactRef;
  readonly physical_admission_witness: ExactRef;
  readonly context_basis: ExactRef;
  readonly context_projection: ExactRef;
  readonly exact_snapshots: readonly SnapshotBinding[];
  readonly result: {
    readonly interaction_goal: string;
    readonly root_refs: readonly ExactRef[];
    readonly traversed_semantic_cut_refs: readonly ExactRef[];
    readonly traversed_semantic_link_refs: readonly ExactRef[];
    readonly semantic_cut_count: number;
    readonly semantic_link_count: number;
    readonly included_ref_count: number;
    readonly omitted_ref_count: number;
    readonly fidelity: string;
    readonly declared_losses: readonly string[];
  };
  readonly projected_at: string;
  readonly query_digest: Sha256Digest;
}

export interface WorldModelQueryContract {
  readonly contract_ref: string;
  readonly version: string;
  readonly scope_ref: string;
  readonly selection_policy_ref: string;
  readonly root_refs: readonly ExactRef[];
  readonly relation_selectors: readonly SemanticRelationRole[];
  readonly closure_rule: MeshClosureRule;
}

export function assertWorldModelQueryProjectionDigest(projection: WorldModelQueryProjection): void {
  const { query_digest: recorded, ...digestInput } = projection;
  const expected = sha256Digest(digestInput);
  if (recorded !== expected) throw new Error(`query projection digest mismatch: expected ${expected}`);
}

export function projectWorldModelQuery(input: {
  readonly queryRef: string;
  readonly queryContract: WorldModelQueryContract;
  readonly basis: ContextBasis;
  readonly projection: ContextProjection;
  readonly basisMeshCut: BoundedMeshCut;
  readonly publishedCuts: readonly PublishedSemanticCut[];
  readonly semanticLinks: readonly SemanticLink[];
  readonly publishedCut: PublishedSemanticCut;
  readonly physicalAdmission: AbgAdmissionWitness;
  readonly attestation: SemanticCutAttestation;
  readonly projectedAt: string;
}): WorldModelQueryProjection {
  requireText(input.queryRef, "queryRef");
  requireText(input.queryContract.contract_ref, "queryContract.contract_ref");
  requireText(input.queryContract.version, "queryContract.version");
  requireText(input.queryContract.scope_ref, "queryContract.scope_ref");
  requireText(input.queryContract.selection_policy_ref, "queryContract.selection_policy_ref");
  requireText(input.projectedAt, "projectedAt");
  if (Number.isNaN(Date.parse(input.projectedAt))) throw new Error("projectedAt must be a timestamp");
  assertContextProjectionMatchesBasis(input.projection, input.basis);
  if (
    input.basis.mesh_cut.ref !== input.basisMeshCut.mesh_cut_ref ||
    input.basis.mesh_cut.digest !== input.basisMeshCut.mesh_cut_digest
  ) {
    throw new Error("query basis does not identify the supplied exact mesh cut");
  }
  const queryMesh = createBoundedMeshCut({
    schema_kind: "odd_world_model.bounded_mesh_cut",
    schema_version: "v1",
    mesh_cut_ref: `query-mesh:${input.queryRef}`,
    interaction_goal: input.basis.interaction_goal,
    scope_ref: input.queryContract.scope_ref,
    selection_policy_ref: input.queryContract.selection_policy_ref,
    root_refs: input.queryContract.root_refs,
    relation_selectors: input.queryContract.relation_selectors,
    closure_rule: input.queryContract.closure_rule,
    excluded_refs: [],
    resolved_at: input.projectedAt
  }, input.publishedCuts, input.semanticLinks);
  const basisCutKeys = new Set(input.basis.semantic_cut_refs.map(exactRefKey));
  const basisLinkKeys = new Set(input.basis.semantic_link_refs.map(exactRefKey));
  if (queryMesh.node_refs.some((ref) => !basisCutKeys.has(exactRefKey(ref))) ||
      queryMesh.link_refs.some((ref) => !basisLinkKeys.has(exactRefKey(ref)))) {
    throw new Error("query traversal exceeds the exact admitted context basis");
  }
  validateSemanticCutAttestation(input.attestation);
  assertPublishedSemanticCutAuthority(input.publishedCut);
  assertReplayDerivedAdmissionWitness(input.physicalAdmission);
  if (input.physicalAdmission.admission_kind !== "physical_effect") {
    throw new Error("query requires physical-effect admission");
  }
  if (exactRefKey(input.publishedCut.semantic_cut_attestation) !== exactRefKey(exactRefForAttestation(input.attestation))) {
    throw new Error("published cut does not identify the exact attestation");
  }
  if (
    exactRefKey(input.publishedCut.physical_admission_witness) !==
    exactRefKey(exactRefForAdmissionWitness(input.physicalAdmission))
  ) {
    throw new Error("published cut does not identify the exact physical admission witness");
  }
  const publishedRef = exactRefForPublishedCut(input.publishedCut);
  if (!input.basis.semantic_cut_refs.some((candidate) => exactRefKey(candidate) === exactRefKey(publishedRef))) {
    throw new Error("context basis does not include the exact published semantic cut");
  }
  const attestedSnapshotRefs = exactSnapshotRefsForAttestation(input.attestation);
  if (
    attestedSnapshotRefs.length !== input.publishedCut.snapshot_refs.length ||
    attestedSnapshotRefs.some((snapshotRef) => !input.publishedCut.snapshot_refs.some(
      (candidate) => exactRefKey(candidate) === exactRefKey(snapshotRef)
    ))
  ) {
    throw new Error("published cut snapshot closure differs from its exact attestation");
  }
  for (const snapshotRef of input.publishedCut.snapshot_refs) {
    if (!input.basis.physical_snapshot_refs.some((candidate) => exactRefKey(candidate) === exactRefKey(snapshotRef))) {
      throw new Error(`context basis does not include physical snapshot ${snapshotRef.ref}`);
    }
  }
  if (
    input.projection.context_basis.ref !== input.basis.basis_ref ||
    input.projection.context_basis.digest !== input.basis.basis_digest
  ) {
    throw new Error("query projection does not identify the supplied exact context basis");
  }
  if (input.projection.projection_contract_ref !== input.basis.projection_contract_ref) {
    throw new Error("query projection uses a different projection contract");
  }
  const projectionInput = {
    schema_kind: "odd_world_model.query_projection" as const,
    schema_version: "v1" as const,
    query_ref: input.queryRef,
    query_contract_ref: input.queryContract.contract_ref,
    query_contract_version: input.queryContract.version,
    semantic_cut: publishedRef,
    physical_admission_witness: exactRefForAdmissionWitness(input.physicalAdmission),
    context_basis: { ref: input.basis.basis_ref, digest: input.basis.basis_digest },
    context_projection: {
      ref: input.projection.projection_ref,
      digest: input.projection.projection_digest
    },
    exact_snapshots: input.attestation.snapshots,
    result: {
      interaction_goal: input.basis.interaction_goal,
      root_refs: input.queryContract.root_refs,
      traversed_semantic_cut_refs: queryMesh.node_refs,
      traversed_semantic_link_refs: queryMesh.link_refs,
      semantic_cut_count: queryMesh.node_refs.length,
      semantic_link_count: queryMesh.link_refs.length,
      included_ref_count: input.projection.included_refs.length,
      omitted_ref_count: input.projection.omitted_refs.length,
      fidelity: input.projection.fidelity,
      declared_losses: input.projection.losses
    },
    projected_at: input.projectedAt
  };
  return Object.freeze({ ...projectionInput, query_digest: sha256Digest(projectionInput) });
}
