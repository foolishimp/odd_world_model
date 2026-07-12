import {
  checkSemanticProposal,
  createAcceptedSemanticCut,
  createBoundedMeshCut,
  createContextBasis,
  createPublishedSemanticCut,
  createSemanticProposal,
  createSemanticPublicationCandidate,
  createSemanticLinkProposal,
  createSourceObservation,
  decideSemanticAcceptance,
  deriveAbgAdmissionWitness,
  exactEvidenceRef,
  exactInputBinding,
  exactRefForAcceptanceDecision,
  exactRefForAttestation,
  exactRefForCheckReport,
  exactRefForPhysicalObservation,
  exactRefForPublicationCandidate,
  exactRefForPublishedCut,
  exactRefForSemanticProposal,
  exactRefForSemanticLinkProposal,
  exactRefForSourceObservation,
  renderContextProjection,
  runWorldModelPublicStart,
  publishSemanticLink,
  sha256Digest,
  type AbgAdmissionWitness,
  type AcceptedSemanticCut,
  type BoundedMeshCut,
  type ContextBasis,
  type ContextDependencyCatalog,
  type ContextProjection,
  type ExactRef,
  type PhysicalEffectObservation,
  type PublishedSemanticCut,
  type SemanticCutAttestation,
  type SemanticLink
} from "../../../code/src/index.ts";

export const fixtureAt = "2026-07-12T00:00:00Z";

export function exactFixture(ref: string, version = "v1"): ExactRef {
  return Object.freeze({ ref, version, digest: sha256Digest({ ref, version }) });
}

export function admissionWitnessFixture(
  witnessRef: string,
  admissionKind: AbgAdmissionWitness["admission_kind"],
  subjects: readonly ExactRef[],
  targetHandle: Parameters<typeof runWorldModelPublicStart>[0]["targetHandle"] = (
    admissionKind === "model_invocation"
      ? "odd_world_model.interpret_context"
      : admissionKind === "context_projection"
        ? "odd_world_model.project_context"
        : admissionKind === "physical_effect"
          ? "odd_world_model.query_world_model"
          : "odd_world_model.publish_domain_model"
  )
): AbgAdmissionWitness {
  const proof = runWorldModelPublicStart({
    targetHandle,
    until: "converged",
    runRefSuffix: `fixture-${sha256Digest({ witnessRef, subjects }).slice(-16)}`,
    inputBindings: subjects.map((subject) => exactInputBinding(subject, "fixture_evidence")),
    evidenceRefs: subjects.map(exactEvidenceRef)
  });
  return deriveAbgAdmissionWitness({
    witnessRef,
    admissionKind,
    subjects,
    proof,
    requireProbabilisticOrigin: admissionKind === "model_invocation"
  });
}

export interface AcceptedCutFixtureBundle {
  readonly acceptedCut: AcceptedSemanticCut;
  readonly acceptanceAdmission: AbgAdmissionWitness;
}

const acceptedCutFixtures = new Map<string, AcceptedCutFixtureBundle>();

export function acceptedCutFixtureBundle(
  semanticCutRef: string,
  role: AcceptedSemanticCut["cut_role"] = "source_domain"
): AcceptedCutFixtureBundle {
  const cacheKey = `${semanticCutRef}\u0000${role}`;
  const cached = acceptedCutFixtures.get(cacheKey);
  if (cached !== undefined) return cached;
  const source = createSourceObservation({
    schema_kind: "odd_world_model.source_observation",
    schema_version: "v1",
    observation_ref: `${semanticCutRef}/source-observation`,
    source: exactFixture(`source://${semanticCutRef}`),
    source_kind: "fixture",
    authority_ref: "authority://fixture/source",
    evidence_refs: [`evidence://${semanticCutRef}`],
    observed_at: fixtureAt
  });
  const proposal = createSemanticProposal({
    schema_kind: "odd_world_model.semantic_proposal",
    schema_version: "v1",
    proposal_ref: `${semanticCutRef}/proposal`,
    source_observation: exactRefForSourceObservation(source),
    proposed_by: "model://fixture/semantic-constructor/v1",
    payload_schema_ref: "schema://fixture/semantic-cut/v1",
    payload: { semantic_cut_ref: semanticCutRef, fixture: true },
    epistemic_status: "candidate",
    created_at: fixtureAt
  });
  const proposalAdmission = admissionWitnessFixture(
    `${semanticCutRef}/proposal-admission`,
    "proposal_evidence",
    [exactRefForSemanticProposal(proposal)]
  );
  const checkReport = checkSemanticProposal({
    checkRef: `${semanticCutRef}/deterministic-check`,
    proposal,
    sourceObservation: source,
    payloadChecks: [{ contractRef: "check-contract://fixture/semantic-cut/v1", validate: () => [] }],
    checkedAt: fixtureAt
  });
  const decision = decideSemanticAcceptance({
    decisionRef: `${semanticCutRef}/acceptance-decision`,
    proposal,
    checkReport,
    proposalAdmission,
    authorityRef: "authority://fixture/wm",
    disposition: "accepted",
    rationale: "fixture deterministic checks passed",
    decidedAt: fixtureAt
  });
  const acceptanceAdmission = admissionWitnessFixture(
    `${semanticCutRef}/acceptance-admission`,
    "acceptance_evidence",
    [exactRefForCheckReport(checkReport), exactRefForAcceptanceDecision(decision)]
  );
  const acceptedCut = createAcceptedSemanticCut({
    proposal,
    checkReport,
    proposalAdmission,
    acceptanceDecision: decision,
    acceptanceAdmission,
    cut: {
      semanticCutRef,
      cutRole: role,
      cutVersion: "v1",
      governingRefs: ["specification/PRODUCT.md"],
      sourceRefs: [`source://${semanticCutRef}`],
      authorityRefs: ["authority://fixture/wm"],
      dependencyIdentities: ["product://abiogenesis/4.6.0-rc.3"],
      temporalCoordinates: { observed_at: fixtureAt, accepted_at: fixtureAt },
      fidelity: "exact_payload",
      losses: [],
      exclusions: [],
      acceptedAt: fixtureAt
    }
  });
  const bundle = Object.freeze({ acceptedCut, acceptanceAdmission });
  acceptedCutFixtures.set(cacheKey, bundle);
  return bundle;
}

const publishedCutFixtures = new Map<string, PublishedSemanticCut>();

export function publishedCutFixture(
  semanticCutRef: string,
  role: PublishedSemanticCut["cut_role"] = "domain_artifact"
): PublishedSemanticCut {
  const cacheKey = `${semanticCutRef}\u0000${role}`;
  const cached = publishedCutFixtures.get(cacheKey);
  if (cached !== undefined) return cached;
  const { acceptedCut, acceptanceAdmission } = acceptedCutFixtureBundle(semanticCutRef, role);
  const snapshotIdentity = sha256Digest({ semanticCutRef, snapshot: 1 }).slice("sha256:".length, 31);
  const snapshot = Object.freeze({
    table_identifier: "wm.fixture_cuts",
    snapshot_id: BigInt(`0x${snapshotIdentity}`).toString(),
    metadata_location: `file:///fixture/${encodeURIComponent(semanticCutRef)}/metadata.json`,
    schema_fingerprint: sha256Digest("fixture physical schema"),
    payload_digest: acceptedCut.semantic_payload_digest,
    record_count: 1
  });
  const attestationInput = {
    schema_kind: "odd_world_model.semantic_cut_attestation" as const,
    schema_version: "v1" as const,
    attestation_id: `${semanticCutRef}/attestation`,
    write_request_id: `write:${sha256Digest(semanticCutRef).slice(-16)}`,
    request_digest: sha256Digest({ semanticCutRef, accepted: acceptedCut.accepted_cut_digest }),
    semantic_cut_ref: semanticCutRef,
    semantic_cut_digest: acceptedCut.accepted_cut_digest,
    cut_role: role,
    cut_version: "v1",
    snapshots: [snapshot],
    governing_refs: acceptedCut.governing_refs,
    source_refs: acceptedCut.source_refs,
    authority_refs: acceptedCut.authority_refs,
    abg_event_refs: acceptanceAdmission.runtime_event_refs,
    dependency_identities: acceptedCut.dependency_identities,
    temporal_coordinates: acceptedCut.temporal_coordinates,
    fidelity: acceptedCut.fidelity,
    losses: acceptedCut.losses,
    exclusions: acceptedCut.exclusions,
    gap_refs: [],
    created_at: fixtureAt
  };
  const attestation: SemanticCutAttestation = Object.freeze({
    ...attestationInput,
    attestation_digest: sha256Digest(attestationInput)
  });
  const effectObservation: PhysicalEffectObservation = Object.freeze({
    schema_kind: "odd_world_model.physical_effect_observation",
    schema_version: "v1",
    observation_status: "reproduced",
    observed_at: fixtureAt,
    observer_identity: "observer://fixture/pyiceberg-duckdb/v1",
    subject_attestation_id: attestation.attestation_id,
    subject_attestation_digest: attestation.attestation_digest,
    snapshot_observations: Object.freeze([{
      table_identifier: snapshot.table_identifier,
      snapshot_id: snapshot.snapshot_id,
      status: "reproduced" as const
    }])
  });
  const physicalAdmission = admissionWitnessFixture(
    `${semanticCutRef}/physical-admission`,
    "physical_effect",
    [exactRefForAttestation(attestation), exactRefForPhysicalObservation(effectObservation)]
  );
  const candidate = createSemanticPublicationCandidate({
    acceptedCut,
    attestation,
    effectObservation,
    physicalAdmission
  });
  const publicationAdmission = admissionWitnessFixture(
    `${semanticCutRef}/publication-admission`,
    "published_cut",
    [exactRefForPublicationCandidate(candidate)]
  );
  const publishedCut = createPublishedSemanticCut({ candidate, publicationAdmission, publishedAt: fixtureAt });
  publishedCutFixtures.set(cacheKey, publishedCut);
  return publishedCut;
}

export interface ContextFixture {
  readonly publications: readonly PublishedSemanticCut[];
  readonly link: SemanticLink;
  readonly mesh: BoundedMeshCut;
  readonly basis: ContextBasis;
  readonly projection: ContextProjection;
  readonly catalog: ContextDependencyCatalog;
}

export function contextFixture(maxIncludedItems = 3): ContextFixture {
  const source = publishedCutFixture("semantic-cut://fixture/source", "source_domain");
  const target = publishedCutFixture("semantic-cut://fixture/target", "domain_artifact");
  const publications = Object.freeze([source, target]);
  const linkProposal = createSemanticLinkProposal({
    schema_kind: "odd_world_model.semantic_link_proposal",
    schema_version: "v1",
    link_ref: "semantic-link://fixture/source-to-target",
    source_cut: exactRefForPublishedCut(source),
    target_cut: exactRefForPublishedCut(target),
    relation_role: "references",
    treatment_ref: "treatment://fixture/reference/v1",
    authority_ref: "authority://fixture/wm",
    provenance_refs: ["evidence://fixture/link/v1"],
    dependency_direction: "source_to_target",
    fidelity: "lossless_projection",
    losses: [],
    validity: { valid_from: fixtureAt },
    supersession_status: "active"
  }, publications);
  const linkAdmission = admissionWitnessFixture(
    "admission-witness://fixture/source-to-target",
    "published_cut",
    [exactRefForSemanticLinkProposal(linkProposal)],
    "odd_world_model.publish_semantic_links"
  );
  const link = publishSemanticLink({ proposal: linkProposal, publicationAdmission: linkAdmission, publishedAt: fixtureAt });
  const mesh = createBoundedMeshCut({
    schema_kind: "odd_world_model.bounded_mesh_cut",
    schema_version: "v1",
    mesh_cut_ref: "mesh-cut://fixture/context",
    interaction_goal: "interpret the exact source and target relationship",
    scope_ref: "scope://fixture/context",
    selection_policy_ref: "selection-policy://fixture/context/v1",
    root_refs: [exactRefForPublishedCut(source)],
    relation_selectors: ["references"],
    closure_rule: "outbound_dependency_closure",
    excluded_refs: [],
    resolved_at: fixtureAt
  }, publications, [link]);
  const basis = createContextBasis({
    schema_kind: "odd_world_model.context_basis",
    schema_version: "v1",
    basis_ref: "context-basis://fixture/v1",
    projection_contract_ref: "projection-contract://fixture/context/v1",
    projection_contract_version: "v1",
    temporal_coordinates: { observed_at: fixtureAt, as_of: fixtureAt },
    source_authority_refs: ["authority://fixture/source"],
    semantic_authority_refs: ["authority://fixture/wm"],
    resolved_at: fixtureAt,
    freshness_policy_ref: "freshness-policy://fixture/v1",
    freshness_evaluated_at: fixtureAt,
    declared_losses: [],
    truncation_limit_ref: `context-window://fixture/${maxIncludedItems}`,
    truncation_max_items: maxIncludedItems
  }, mesh, publications, [link]);
  const allRefs = [...basis.semantic_cut_refs, ...basis.semantic_link_refs];
  const projection = renderContextProjection({
    projectionRef: "context-projection://fixture/v1",
    basis,
    rendererRef: "renderer://odd_world_model/context-projection/canonical-json/v1",
    items: allRefs.map((exactRef) => ({
      exact_ref: exactRef,
      content: { ref: exactRef.ref, digest: exactRef.digest }
    })),
    createdAt: fixtureAt
  });
  const catalog = Object.freeze({
    catalogRef: "context-dependency-catalog://fixture/current/v1",
    meshCut: mesh,
    publishedCuts: publications,
    semanticLinks: [link],
    projectionContracts: [{
      ref: basis.projection_contract_ref,
      version: basis.projection_contract_version
    }]
  });
  return Object.freeze({ publications, link, mesh, basis, projection, catalog });
}
