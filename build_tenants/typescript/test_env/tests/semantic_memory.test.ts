// Candidate contract evidence only; resolved Markov evidence and native F_P authorship remain open.
// Candidate evidence: REQ-ODD-WORLD-MODEL-CONTEXT-MEMORY-002..006
// Candidate evidence: REQ-ODD-WORLD-MODEL-MESH-CAP-003..010
import assert from "node:assert/strict";
import test from "node:test";
import {
  assertBoundedMeshCutClosure,
  assertAdmissionWitnessDigest,
  assertContextProjectionDigest,
  assertContextProjectionMatchesBasis,
  assertReplayDerivedAdmissionWitness,
  assertSemanticLinkCatalog,
  assertSemanticLinkDigest,
  calculateAffectedClosure,
  canonicalJson,
  checkSemanticProposal,
  createAcceptedSemanticCut,
  createBoundedMeshCut,
  createCandidateMarkovObjectCut,
  createContextInvocationRecord,
  createComposedWorldModel,
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
  exactRefForPublishedCut,
  exactRefForSemanticLink,
  exactRefForSemanticLinkProposal,
  exactRefForSemanticProposal,
  exactRefForSourceObservation,
  runWorldModelPublicStart,
  publishSemanticLink,
  sha256Digest
} from "../../code/src/index.ts";
import type { JsonObject } from "../../code/src/domain/types.ts";
import {
  admissionWitnessFixture,
  contextFixture,
  exactFixture,
  fixtureAt,
  publishedCutFixture
} from "./support/semantic_fixtures.ts";

test("candidate Markov-object cut retains direction, null peer, treatment, boundary, and inconclusive status", () => {
  const cut = createCandidateMarkovObjectCut({
    schema_kind: "odd_world_model.candidate_markov_object_cut",
    schema_version: "v1",
    object_ref: "markov-object://fixture/trade-state/v1",
    object_identity: "trade-state",
    identity_direction: {
      source_state_refs: ["state://trade/proposed"],
      target_state_refs: ["state://trade/confirmed"],
      projection_ref: "projection://fixture/trade-state/v1"
    },
    projection_support_refs: ["evidence://fixture/projection/v1"],
    distributed_ledger_evidence_refs: ["ledger-entry://fixture/trade/1"],
    candidate_basis: exactFixture("basis://fixture/candidate"),
    null_peer_basis: exactFixture("basis://fixture/null-peer"),
    held_out_treatment_verification: {
      treatment_ref: "treatment://fixture/confirm-trade/v1",
      corpus_ref: "corpus://fixture/held-out/v1",
      result: "inconclusive",
      evidence_refs: ["evidence://fixture/held-out-result/v1"]
    },
    boundary: {
      included_refs: ["field://trade/id", "field://trade/status"],
      excluded_refs: ["field://trade/commentary"],
      rationale: "the object boundary contains state needed for the declared transition"
    },
    publication_classification: "candidate",
    source_observation: exactFixture("source-observation://fixture/trade"),
    authority_ref: "authority://fixture/wm",
    created_at: fixtureAt
  });
  assert.equal(cut.publication_classification, "candidate");
  assert.equal(cut.held_out_treatment_verification.result, "inconclusive");
  assert.throws(() => createCandidateMarkovObjectCut({
    ...cut,
    held_out_treatment_verification: {
      ...cut.held_out_treatment_verification,
      result: "passed"
    },
    cut_digest: undefined
  } as never), /cannot self-assert/);
  assert.match(cut.cut_digest, /^sha256:[0-9a-f]{64}$/);
  assert.throws(() => createCandidateMarkovObjectCut({
    ...cut,
    candidate_basis: cut.null_peer_basis,
    cut_digest: undefined
  } as never), /candidate and null-peer basis/);
});

test("self-digested admission and publication objects cannot acquire runtime authority", () => {
  const fixture = contextFixture();
  const output = exactFixture("proposal://fixture/forged-output");
  const admitted = admissionWitnessFixture(
    "admission-witness://fixture/authentic-output",
    "model_invocation",
    [
      { ref: fixture.basis.basis_ref, digest: fixture.basis.basis_digest },
      { ref: fixture.projection.projection_ref, digest: fixture.projection.projection_digest },
      output
    ]
  );
  const forgedWitness = { ...admitted };
  assert.doesNotThrow(() => assertAdmissionWitnessDigest(forgedWitness));
  assert.throws(
    () => assertReplayDerivedAdmissionWitness(forgedWitness),
    /not derived from an authentic ABG public-start proof/
  );
  const forgedPublishedCut = { ...fixture.publications[0]! };
  assert.throws(
    () => exactRefForPublishedCut(forgedPublishedCut),
    /not produced by the governed publication constructor/
  );
});

test("semantic links require published endpoints and mesh cuts derive finite closure from roots", () => {
  const fixture = contextFixture();
  assert.equal(fixture.link.relation_role, "references");
  assert.deepEqual(
    fixture.basis.semantic_cut_refs.map((item) => item.ref),
    ["semantic-cut://fixture/source", "semantic-cut://fixture/target"]
  );
  assert.deepEqual(
    calculateAffectedClosure(
      fixture.mesh,
      fixture.publications,
      [fixture.link],
      ["semantic-cut://fixture/source"]
    ),
    ["semantic-cut://fixture/source", "semantic-cut://fixture/target"]
  );
  assert.throws(() => calculateAffectedClosure(
    fixture.mesh,
    fixture.publications,
    [{ ...fixture.link, authority_ref: "authority://fixture/tampered" }],
    ["semantic-cut://fixture/source"]
  ), /semantic link digest mismatch/);
  const { mesh_cut_digest: _meshCutDigest, ...meshWithoutDigest } = fixture.mesh;
  const incompleteMeshInput = {
    ...meshWithoutDigest,
    node_refs: fixture.mesh.root_refs,
    link_refs: [],
    common_model_refs: []
  };
  const incompleteMesh = {
    ...incompleteMeshInput,
    mesh_cut_digest: sha256Digest(incompleteMeshInput)
  };
  assert.throws(
    () => assertBoundedMeshCutClosure(incompleteMesh, fixture.publications, [fixture.link]),
    /differs from its declared catalog-relative closure/
  );
});

test("mesh supersession selects the admitted successor and limits affected closure", () => {
  const fixture = contextFixture();
  const source = fixture.publications[0]!;
  const priorTarget = fixture.publications[1]!;
  const successorTarget = publishedCutFixture("semantic-cut://fixture/target-v2", "domain_artifact");
  const successorLinkRef = "semantic-link://fixture/source-to-target/v2";
  const supersededProposal = createSemanticLinkProposal({
    schema_kind: "odd_world_model.semantic_link_proposal",
    schema_version: "v1",
    link_ref: fixture.link.link_ref,
    source_cut: exactRefForPublishedCut(source),
    target_cut: exactRefForPublishedCut(priorTarget),
    relation_role: "references",
    treatment_ref: fixture.link.treatment_ref,
    authority_ref: fixture.link.authority_ref,
    provenance_refs: [...fixture.link.provenance_refs, exactRefForPublishedCut(successorTarget).ref],
    dependency_direction: "source_to_target",
    fidelity: "lossless_projection",
    losses: [],
    validity: { valid_from: fixtureAt, valid_to: "2026-07-12T00:01:00Z" },
    supersession_status: "superseded",
    superseded_by_link_ref: successorLinkRef
  }, [source, priorTarget, successorTarget]);
  const successorProposal = createSemanticLinkProposal({
    schema_kind: "odd_world_model.semantic_link_proposal",
    schema_version: "v1",
    link_ref: successorLinkRef,
    source_cut: exactRefForPublishedCut(source),
    target_cut: exactRefForPublishedCut(successorTarget),
    relation_role: "references",
    treatment_ref: fixture.link.treatment_ref,
    authority_ref: fixture.link.authority_ref,
    provenance_refs: [fixture.link.link_ref, exactRefForPublishedCut(successorTarget).ref],
    dependency_direction: "source_to_target",
    fidelity: "lossless_projection",
    losses: [],
    validity: { valid_from: "2026-07-12T00:01:00Z" },
    supersession_status: "active"
  }, [source, priorTarget, successorTarget]);
  const admission = admissionWitnessFixture(
    "admission-witness://fixture/source-to-target/v2",
    "published_cut",
    [exactRefForSemanticLinkProposal(supersededProposal), exactRefForSemanticLinkProposal(successorProposal)],
    "odd_world_model.publish_semantic_links"
  );
  const supersededLink = publishSemanticLink({
    proposal: supersededProposal,
    publicationAdmission: admission,
    publishedAt: "2026-07-12T00:01:00Z"
  });
  const successorLink = publishSemanticLink({
    proposal: successorProposal,
    publicationAdmission: admission,
    publishedAt: "2026-07-12T00:01:00Z"
  });
  assert.doesNotThrow(() => assertSemanticLinkCatalog([supersededLink, successorLink]));
  assert.throws(
    () => assertSemanticLinkCatalog([supersededLink]),
    /unresolved successor/
  );
  const currentMesh = createBoundedMeshCut({
    schema_kind: "odd_world_model.bounded_mesh_cut",
    schema_version: "v1",
    mesh_cut_ref: "mesh-cut://fixture/context/v2",
    interaction_goal: "resolve only the current target publication",
    scope_ref: "scope://fixture/context",
    selection_policy_ref: "selection-policy://fixture/context/v2",
    root_refs: [exactRefForPublishedCut(source)],
    relation_selectors: ["references"],
    closure_rule: "outbound_dependency_closure",
    excluded_refs: [],
    unresolved_gaps: [{
      gap_type: "semantic_reconciliation_required",
      message: "the superseding target remains subject to downstream reconciliation",
      retryable: false,
      evidence_refs: [priorTarget.semantic_cut_ref, successorTarget.semantic_cut_ref]
    }],
    resolved_at: "2026-07-12T00:01:00Z"
  }, [source, priorTarget, successorTarget], [supersededLink, successorLink]);
  assert.deepEqual(currentMesh.node_refs, [
    exactRefForPublishedCut(source),
    exactRefForPublishedCut(successorTarget)
  ].sort((left, right) => left.ref.localeCompare(right.ref)));
  assert.deepEqual(currentMesh.link_refs, [exactRefForSemanticLink(successorLink)]);
  assert.equal(currentMesh.unresolved_gaps[0]?.gap_type, "semantic_reconciliation_required");
  assert.deepEqual(
    calculateAffectedClosure(
      currentMesh,
      [source, priorTarget, successorTarget],
      [supersededLink, successorLink],
      [source.semantic_cut_ref]
    ),
    [source.semantic_cut_ref, successorTarget.semantic_cut_ref].sort()
  );
});

test("link construction rejects non-published endpoints and open relation vocabulary", () => {
  const fixture = contextFixture();
  const source = fixture.publications[0]!;
  const {
    link_digest: _linkDigest,
    publication_status: _publicationStatus,
    proposal: _proposal,
    publication_admission: _publicationAdmission,
    abg_event_refs: _abgEventRefs,
    published_at: _publishedAt,
    schema_kind: _schemaKind,
    ...linkTerms
  } = fixture.link;
  const validLinkInput = {
    ...linkTerms,
    schema_kind: "odd_world_model.semantic_link_proposal" as const
  };
  assert.throws(() => createSemanticLinkProposal({
    schema_kind: "odd_world_model.semantic_link_proposal",
    schema_version: "v1",
    link_ref: "semantic-link://fixture/invalid-endpoint",
    source_cut: { ref: source.semantic_cut_ref, digest: sha256Digest("wrong"), version: source.cut_version },
    target_cut: exactFixture("semantic-cut://fixture/missing"),
    relation_role: "references",
    treatment_ref: "treatment://fixture/reference/v1",
    authority_ref: "authority://fixture/wm",
    provenance_refs: ["evidence://fixture/link/v1"],
    dependency_direction: "source_to_target",
    fidelity: "lossless_projection",
    losses: [],
    validity: { valid_from: fixtureAt },
    supersession_status: "active"
  }, fixture.publications), /not an exact published semantic cut/);
  assert.throws(() => createSemanticLinkProposal({
    schema_kind: "odd_world_model.semantic_link_proposal",
    schema_version: "v1",
    link_ref: "semantic-link://fixture/open-role",
    source_cut: fixture.basis.semantic_cut_refs[0]!,
    target_cut: fixture.basis.semantic_cut_refs[1]!,
    relation_role: "same_label" as never,
    treatment_ref: "treatment://fixture/reference/v1",
    authority_ref: "authority://fixture/wm",
    provenance_refs: ["evidence://fixture/link/v1"],
    dependency_direction: "source_to_target",
    fidelity: "lossless_projection",
    losses: [],
    validity: { valid_from: fixtureAt },
    supersession_status: "active"
  }, fixture.publications), /unsupported relation role/);
  assert.throws(() => createSemanticLinkProposal({
    ...validLinkInput,
    supersession_status: "superseded"
  }, fixture.publications), /must identify its superseding link/);
  assert.throws(() => createSemanticLinkProposal({
    ...validLinkInput,
    superseded_by_link_ref: "semantic-link://fixture/newer"
  }, fixture.publications), /active link cannot identify/);
  assert.throws(() => createBoundedMeshCut({
    schema_kind: "odd_world_model.bounded_mesh_cut",
    schema_version: "v1",
    mesh_cut_ref: "mesh-cut://fixture/open-selector",
    interaction_goal: "reject an undeclared relation selector",
    scope_ref: "scope://fixture/open-selector",
    selection_policy_ref: "selection-policy://fixture/open-selector/v1",
    root_refs: [fixture.basis.semantic_cut_refs[0]!],
    relation_selectors: ["same_label" as never],
    closure_rule: "outbound_dependency_closure",
    excluded_refs: [],
    resolved_at: fixtureAt
  }, fixture.publications, [fixture.link]), /unsupported relation selector/);
});

test("rehashed invalid links and disconnected compositions fail closed", () => {
  const fixture = contextFixture();
  const { link_digest: _linkDigest, ...linkInput } = fixture.link;
  const invalidLinkInput = { ...linkInput, relation_role: "same_label" as never };
  const invalidLink = { ...invalidLinkInput, link_digest: sha256Digest(invalidLinkInput) };
  assert.throws(() => assertSemanticLinkDigest(invalidLink), /unsupported relation role/);

  const disconnected = publishedCutFixture("semantic-cut://fixture/disconnected", "domain_artifact");
  assert.throws(() => createComposedWorldModel({
    schema_kind: "odd_world_model.composed_world_model",
    schema_version: "v1",
    world_model_ref: "world-model://fixture/disconnected",
    composition_intent: "reject an unrelated component",
    component_cut_refs: [...fixture.publications, disconnected].map(exactRefForPublishedCut),
    semantic_link_refs: fixture.mesh.link_refs,
    common_model_refs: [],
    authority_boundary_refs: ["authority://fixture/wm"],
    fidelity: "lossless_projection",
    losses: [],
    unresolved_gaps: [],
    composed_at: fixtureAt
  }, [...fixture.publications, disconnected], [fixture.link]), /disconnected component cuts/);
});

test("context renderer accounts for exact content, truncation, loss, and stale dependencies", () => {
  const fixture = contextFixture(2);
  assert.equal(fixture.basis.truncation.applied, true);
  assert.equal(fixture.basis.truncation.omitted_count, 1);
  assert.equal(fixture.projection.fidelity, "lossy_projection");
  assert.deepEqual(fixture.projection.losses, ["context_window_truncation"]);
  assert.equal(fixture.projection.included_refs.length, 2);
  assert.equal(fixture.projection.omitted_refs.length, 1);
  const rendered = JSON.parse(fixture.projection.content) as {
    items: readonly unknown[];
    basis_dependencies: Record<string, unknown>;
  };
  assert.equal(rendered.items.length, 2);
  assert.equal(sha256Digest(fixture.projection.content), fixture.projection.content_digest);
  const concealedDisclosureContent = canonicalJson({
    ...rendered,
    losses: []
  });
  const {
    projection_digest: _recordedProjectionDigest,
    ...projectionWithoutDigest
  } = fixture.projection;
  const concealedDisclosureProjection = {
    ...projectionWithoutDigest,
    content: concealedDisclosureContent,
    content_digest: sha256Digest(concealedDisclosureContent)
  };
  assert.throws(() => assertContextProjectionDigest({
    ...concealedDisclosureProjection,
    projection_digest: sha256Digest(concealedDisclosureProjection)
  }), /content disclosure differs from projection metadata/);
  const falseBasisContent = canonicalJson({
    ...rendered,
    basis_dependencies: {
      ...rendered.basis_dependencies,
      source_authority_refs: ["authority://fixture/false-source"]
    }
  });
  const falseBasisProjectionInput = {
    ...projectionWithoutDigest,
    content: falseBasisContent,
    content_digest: sha256Digest(falseBasisContent)
  };
  const falseBasisProjection = {
    ...falseBasisProjectionInput,
    projection_digest: sha256Digest(falseBasisProjectionInput)
  };
  assert.doesNotThrow(() => assertContextProjectionDigest(falseBasisProjection));
  assert.throws(
    () => assertContextProjectionMatchesBasis(falseBasisProjection, fixture.basis),
    /rendered basis differs from its exact basis/
  );
  assert.equal(detectContextStaleness(fixture.basis, fixture.catalog), null);
  const missingLink = detectContextStaleness(fixture.basis, {
    ...fixture.catalog,
    semanticLinks: []
  });
  assert.equal(missingLink?.gap_type, "stale_context_basis");
  const changedContract = detectContextStaleness(fixture.basis, {
    ...fixture.catalog,
    projectionContracts: [{ ref: fixture.basis.projection_contract_ref, version: "v2" }]
  });
  assert.equal(changedContract?.details?.projection_contract_changed, true);
});

test("context invocation requires replay admission for the exact output and a fresh basis", () => {
  const fixture = contextFixture();
  const output = {
    ref: "proposal://fixture/model-output",
    digest: sha256Digest("fixture model output")
  } as const;
  const admission = admissionWitnessFixture(
    "admission-witness://fixture/model-output",
    "model_invocation",
    [
      { ref: fixture.basis.basis_ref, digest: fixture.basis.basis_digest },
      { ref: fixture.projection.projection_ref, digest: fixture.projection.projection_digest },
      output
    ]
  );
  const record = createContextInvocationRecord({
    schema_kind: "odd_world_model.context_invocation_record",
    schema_version: "v1",
    invocation_ref: "context-invocation://fixture/1",
    context_basis: { ref: fixture.basis.basis_ref, digest: fixture.basis.basis_digest },
    context_projection: { ref: fixture.projection.projection_ref, digest: fixture.projection.projection_digest },
    model_identity: "model://fixture/interpreter/v1",
    model_role: "F_P",
    invoked_at: "2026-07-12T00:00:01Z",
    completed_at: "2026-07-12T00:00:02Z",
    output_digest: output.digest,
    output_proposal_ref: output.ref
  }, fixture.basis, fixture.projection, admission, fixture.catalog);
  assert.equal(record.admission_status, "admitted");
  assert.equal(record.freshness_status, "fresh");
  assert.deepEqual(record.abg_event_refs, admission.runtime_event_refs);
  const wrongAdmission = admissionWitnessFixture(
    "admission-witness://fixture/wrong-output",
    "model_invocation",
    [{ ref: "proposal://fixture/other-output", digest: sha256Digest("other output") }]
  );
  assert.throws(() => createContextInvocationRecord({
    ...record,
    abg_event_refs: undefined,
    admission: undefined,
    admission_status: undefined,
    freshness_status: undefined,
    invocation_digest: undefined
  } as never, fixture.basis, fixture.projection, wrongAdmission, fixture.catalog), /does not identify/);
  assert.throws(() => createContextInvocationRecord({
    ...record,
    abg_event_refs: undefined,
    admission: undefined,
    admission_status: undefined,
    freshness_status: undefined,
    invocation_digest: undefined
  } as never, fixture.basis, fixture.projection, admission, {
    ...fixture.catalog,
    semanticLinks: []
  }), /stale context basis/);
});

test("converged public GraphFunction run yields replay-derived proposal admission and attributed acceptance", () => {
  const source = createSourceObservation({
    schema_kind: "odd_world_model.source_observation",
    schema_version: "v1",
    observation_ref: "source-observation://fixture/fpml/1",
    source: exactFixture("source://fixture/fpml/confirmation.xml"),
    source_kind: "fpml_confirmation",
    authority_ref: "authority://fixture/source-system",
    evidence_refs: ["evidence://fixture/fpml/confirmation.xml"],
    observed_at: fixtureAt
  });
  const proposal = createSemanticProposal({
    schema_kind: "odd_world_model.semantic_proposal",
    schema_version: "v1",
    proposal_ref: "semantic-proposal://fixture/fpml/1",
    source_observation: exactRefForSourceObservation(source),
    proposed_by: "model://fixture/semantic-constructor/v1",
    payload_schema_ref: "workspace://build_tenants/common/schemas/candidate_markov_object_cut.schema.json",
    payload: { trade_id: "T-001", status: "candidate" } as JsonObject,
    epistemic_status: "candidate",
    created_at: fixtureAt
  });
  const proposalRef = exactRefForSemanticProposal(proposal);
  const sourceRef = exactRefForSourceObservation(source);
  const proof = runWorldModelPublicStart({
    targetHandle: "odd_world_model.publish_domain_model",
    until: "converged",
    runRefSuffix: "semantic-memory-admission-v1",
    inputBindings: [
      exactInputBinding(sourceRef, "observed_source_evidence"),
      exactInputBinding(proposalRef, "constructed_domain_semantics")
    ],
    evidenceRefs: [exactEvidenceRef(sourceRef), exactEvidenceRef(proposalRef)]
  });
  const witness = deriveAbgAdmissionWitness({
    witnessRef: "admission-witness://fixture/fpml-proposal/1",
    admissionKind: "proposal_evidence",
    subjects: [sourceRef, proposalRef],
    proof,
    requireProbabilisticOrigin: true
  });
  assert.equal(proof.outcome.kind, "converged");
  assert.equal(witness.vector_closed_event_refs.length, 5);
  assert.equal(witness.evidence_refs.includes(exactEvidenceRef(proposalRef)), true);
  const check = checkSemanticProposal({
    checkRef: "check://fixture/fpml-proposal/1",
    proposal,
    sourceObservation: source,
    payloadChecks: [{
      contractRef: "schema://fixture/trade-candidate/v1",
      validate: (payload) => {
        if (payload.trade_id !== "T-001" || payload.status !== "candidate") {
          throw new Error("trade candidate payload is invalid");
        }
        return [];
      }
    }],
    checkedAt: "2026-07-12T00:00:03Z"
  });
  const decision = decideSemanticAcceptance({
    decisionRef: "wm-acceptance://fixture/fpml-proposal/1",
    proposal,
    checkReport: check,
    proposalAdmission: witness,
    authorityRef: "authority://fixture/wm",
    disposition: "accepted",
    rationale: "exact source, candidate status, and closed contract passed",
    decidedAt: "2026-07-12T00:00:04Z"
  });
  const decisionRef = exactRefForAcceptanceDecision(decision);
  const checkRef = exactRefForCheckReport(check);
  const acceptanceProof = runWorldModelPublicStart({
    targetHandle: "odd_world_model.publish_domain_model",
    until: "converged",
    runRefSuffix: "semantic-memory-acceptance-v1",
    inputBindings: [
      exactInputBinding(checkRef, "deterministic_check_report"),
      exactInputBinding(decisionRef, "wm_acceptance_decision")
    ],
    evidenceRefs: [exactEvidenceRef(checkRef), exactEvidenceRef(decisionRef)]
  });
  const acceptanceAdmission = deriveAbgAdmissionWitness({
    witnessRef: "admission-witness://fixture/fpml-acceptance/1",
    admissionKind: "acceptance_evidence",
    subjects: [checkRef, decisionRef],
    proof: acceptanceProof,
    requireProbabilisticOrigin: true
  });
  const accepted = createAcceptedSemanticCut({
    proposal,
    checkReport: check,
    proposalAdmission: witness,
    acceptanceDecision: decision,
    acceptanceAdmission,
    cut: {
      semanticCutRef: "semantic-cut://fixture/fpml-domain/v1",
      cutRole: "domain_artifact",
      cutVersion: "v1",
      governingRefs: ["requirement://fixture/semantic-admission"],
      sourceRefs: [source.source.ref],
      authorityRefs: ["authority://fixture/wm"],
      dependencyIdentities: ["product://abiogenesis/4.6.0-rc.3"],
      temporalCoordinates: { observed_at: fixtureAt, accepted_at: "2026-07-12T00:00:04Z" },
      fidelity: "lossless_projection",
      losses: [],
      exclusions: [],
      acceptedAt: "2026-07-12T00:00:04Z"
    }
  });
  assert.equal(accepted.epistemic_status, "candidate");
  assert.equal(accepted.acceptance_decision.digest, decision.decision_digest);
  assert.throws(() => exactRefForSourceObservation({
    ...source,
    authority_ref: "authority://fixture/tampered-source"
  }), /source observation digest mismatch/);
  assert.throws(() => decideSemanticAcceptance({
    decisionRef: "wm-acceptance://fixture/fpml-proposal/tampered-check",
    proposal,
    checkReport: { ...check, checked_at: "2026-07-12T00:00:07Z" },
    proposalAdmission: witness,
    authorityRef: "authority://fixture/wm",
    disposition: "accepted",
    rationale: "tampered check must fail before acceptance",
    decidedAt: "2026-07-12T00:00:08Z"
  }), /check report digest mismatch/);
  const failedCheck = checkSemanticProposal({
    checkRef: "check://fixture/fpml-proposal/invalid",
    proposal,
    sourceObservation: source,
    payloadChecks: [{
      contractRef: "schema://fixture/reject-all/v1",
      validate: () => { throw new Error("fixture payload rejection"); }
    }],
    checkedAt: "2026-07-12T00:00:05Z"
  });
  assert.equal(failedCheck.status, "failed");
  assert.equal(failedCheck.issues[0]?.gap_type, "deterministic_payload_check_failed");
  assert.throws(() => decideSemanticAcceptance({
    decisionRef: "wm-acceptance://fixture/fpml-proposal/invalid",
    proposal,
    checkReport: failedCheck,
    proposalAdmission: witness,
    authorityRef: "authority://fixture/wm",
    disposition: "accepted",
    rationale: "this must not be accepted",
    decidedAt: "2026-07-12T00:00:06Z"
  }), /requires passed checks/);
  assert.throws(() => deriveAbgAdmissionWitness({
    witnessRef: "admission-witness://fixture/tampered",
    admissionKind: "proposal_evidence",
    subjects: [exactFixture("semantic-proposal://fixture/tampered")],
    proof,
    requireProbabilisticOrigin: true
  }), /did not bind evidence/);
});
