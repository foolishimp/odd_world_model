export type Sha256Digest = `sha256:${string}`;
export type Fidelity = "exact_payload" | "lossless_projection" | "lossy_projection";
export type SemanticRelationRole =
  | "references"
  | "composes"
  | "treatment"
  | "covariance"
  | "adjoint"
  | "supersedes";
export type MeshClosureRule =
  | "roots_only"
  | "outbound_dependency_closure"
  | "bidirectional_dependency_closure";

export interface ExactRef {
  readonly ref: string;
  readonly digest: Sha256Digest;
  readonly version?: string;
}

export interface TypedGap {
  readonly gap_type: string;
  readonly message: string;
  readonly retryable: boolean;
  readonly evidence_refs: readonly string[];
  readonly details?: Readonly<Record<string, unknown>>;
}

export interface SemanticLinkProposal {
  readonly schema_kind: "odd_world_model.semantic_link_proposal";
  readonly schema_version: "v1";
  readonly link_ref: string;
  readonly source_cut: ExactRef;
  readonly target_cut: ExactRef;
  readonly relation_role: SemanticRelationRole;
  readonly treatment_ref: string;
  readonly authority_ref: string;
  readonly provenance_refs: readonly string[];
  readonly dependency_direction: "source_to_target" | "target_to_source" | "bidirectional";
  readonly fidelity: Fidelity;
  readonly losses: readonly string[];
  readonly validity: {
    readonly valid_from: string;
    readonly valid_to?: string;
  };
  readonly supersession_status: "active" | "superseded";
  readonly superseded_by_link_ref?: string;
  readonly epistemic_status: "candidate";
  readonly proposal_digest: Sha256Digest;
}

export type SemanticLinkProposalInput = Omit<
  SemanticLinkProposal,
  "epistemic_status" | "proposal_digest"
>;

export interface SemanticLink extends Omit<
  SemanticLinkProposal,
  "schema_kind" | "epistemic_status" | "proposal_digest"
> {
  readonly schema_kind: "odd_world_model.semantic_link";
  readonly publication_status: "published";
  readonly proposal: ExactRef;
  readonly publication_admission: ExactRef;
  readonly abg_event_refs: readonly string[];
  readonly published_at: string;
  readonly link_digest: Sha256Digest;
}

export interface BoundedMeshCut {
  readonly schema_kind: "odd_world_model.bounded_mesh_cut";
  readonly schema_version: "v1";
  readonly mesh_cut_ref: string;
  readonly interaction_goal: string;
  readonly scope_ref: string;
  readonly selection_policy_ref: string;
  readonly root_refs: readonly ExactRef[];
  readonly relation_selectors: readonly SemanticRelationRole[];
  readonly closure_rule: MeshClosureRule;
  readonly node_refs: readonly ExactRef[];
  readonly link_refs: readonly ExactRef[];
  readonly common_model_refs: readonly ExactRef[];
  readonly excluded_refs: readonly ExactRef[];
  readonly unresolved_gaps: readonly TypedGap[];
  readonly resolved_at: string;
  readonly mesh_cut_digest: Sha256Digest;
}

export type BoundedMeshCutInput = Omit<
  BoundedMeshCut,
  "node_refs" | "link_refs" | "common_model_refs" | "unresolved_gaps" | "mesh_cut_digest"
> & {
  readonly unresolved_gaps?: readonly TypedGap[];
};

export interface ContextBasis {
  readonly schema_kind: "odd_world_model.context_basis";
  readonly schema_version: "v1";
  readonly basis_ref: string;
  readonly interaction_goal: string;
  readonly mesh_cut: ExactRef;
  readonly semantic_cut_refs: readonly ExactRef[];
  readonly semantic_link_refs: readonly ExactRef[];
  readonly source_observation_refs: readonly ExactRef[];
  readonly physical_snapshot_refs: readonly ExactRef[];
  readonly projection_contract_ref: string;
  readonly projection_contract_version: string;
  readonly selection_policy_ref: string;
  readonly temporal_coordinates: Readonly<Record<string, string>>;
  readonly source_authority_refs: readonly string[];
  readonly semantic_authority_refs: readonly string[];
  readonly freshness: {
    readonly status: "fresh";
    readonly policy_ref: string;
    readonly evaluated_at: string;
    readonly dependency_digest: Sha256Digest;
  };
  readonly fidelity: Fidelity;
  readonly losses: readonly string[];
  readonly exclusions: readonly OmittedContextRef[];
  readonly truncation: {
    readonly applied: boolean;
    readonly limit_ref: string;
    readonly omitted_count: number;
  };
  readonly unresolved_gaps: readonly TypedGap[];
  readonly resolved_at: string;
  readonly basis_digest: Sha256Digest;
}

export type ContextBasisInput = Omit<
  ContextBasis,
  | "interaction_goal"
  | "mesh_cut"
  | "semantic_cut_refs"
  | "semantic_link_refs"
  | "source_observation_refs"
  | "physical_snapshot_refs"
  | "selection_policy_ref"
  | "freshness"
  | "fidelity"
  | "losses"
  | "exclusions"
  | "truncation"
  | "unresolved_gaps"
  | "basis_digest"
> & {
  readonly freshness_policy_ref: string;
  readonly freshness_evaluated_at: string;
  readonly declared_losses: readonly string[];
  readonly exclusion_reasons?: Readonly<Record<string, string>>;
  readonly truncation_limit_ref: string;
  readonly truncation_max_items: number;
};

export interface OmittedContextRef {
  readonly exact_ref: ExactRef;
  readonly reason: string;
}

export interface ContextProjection {
  readonly schema_kind: "odd_world_model.context_projection";
  readonly schema_version: "v1";
  readonly projection_ref: string;
  readonly context_basis: ExactRef;
  readonly projection_contract_ref: string;
  readonly renderer_ref: string;
  readonly representation_kind: "canonical_json";
  readonly content: string;
  readonly content_digest: Sha256Digest;
  readonly included_refs: readonly ExactRef[];
  readonly omitted_refs: readonly OmittedContextRef[];
  readonly exclusions: readonly OmittedContextRef[];
  readonly fidelity: Fidelity;
  readonly losses: readonly string[];
  readonly truncation: ContextBasis["truncation"];
  readonly unresolved_gaps: readonly TypedGap[];
  readonly created_at: string;
  readonly projection_digest: Sha256Digest;
}

export type ContextProjectionInput = never;

export interface ContextInvocationRecord {
  readonly schema_kind: "odd_world_model.context_invocation_record";
  readonly schema_version: "v1";
  readonly invocation_ref: string;
  readonly context_basis: ExactRef;
  readonly context_projection: ExactRef;
  readonly model_identity: string;
  readonly model_role: "F_P";
  readonly invoked_at: string;
  readonly completed_at: string;
  readonly output_digest: Sha256Digest;
  readonly output_proposal_ref: string;
  readonly abg_event_refs: readonly string[];
  readonly admission: ExactRef;
  readonly freshness_catalog: ExactRef;
  readonly admission_status: "admitted";
  readonly freshness_status: "fresh";
  readonly invocation_digest: Sha256Digest;
}

export type ContextInvocationRecordInput = Omit<
  ContextInvocationRecord,
  | "abg_event_refs"
  | "admission"
  | "freshness_catalog"
  | "admission_status"
  | "freshness_status"
  | "invocation_digest"
>;
