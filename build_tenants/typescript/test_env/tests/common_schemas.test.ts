import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import {
  checkSemanticProposal,
  computeRegimesForHandle,
  candidateMarkovObjectPayloadCheck,
  createAcceptedSemanticCut,
  createCandidateMarkovObjectCut,
  createSemanticProposal,
  createSourceObservation,
  decideSemanticAcceptance,
  exactRefForAcceptanceDecision,
  exactRefForCheckReport,
  exactRefForSemanticProposal,
  exactRefForSourceObservation
} from "../../code/src/index.ts";
import {
  domainPublicationAssets,
  environmentAssets,
  publicFunctionAssets
} from "../../code/src/gtl/assets.ts";
import { loadCommonSchemaValidator } from "./support/common_schema_validator.ts";
import {
  admissionWitnessFixture,
  contextFixture,
  exactFixture,
  fixtureAt,
  publishedCutFixture
} from "./support/semantic_fixtures.ts";

const testDir = path.dirname(fileURLToPath(import.meta.url));
const tenantRoot = path.resolve(testDir, "../..");
const repoRoot = path.resolve(tenantRoot, "../..");
const schemaRoot = path.resolve(tenantRoot, "../common/schemas");

test("every common JSON schema compiles under strict Draft 2020-12", async () => {
  const ajv = await loadCommonSchemaValidator(schemaRoot);
  const names = (await readdir(schemaRoot)).filter((name) => name.endsWith(".schema.json"));
  for (const name of names) {
    assert.ok(ajv.getSchema(`odd_world_model.${name}`), `schema identity is missing for ${name}`);
  }
});

test("every current GTL asset resolves to a workspace schema and no symbolic WM contract remains", async () => {
  const assets = [
    ...Object.values(environmentAssets),
    ...Object.values(domainPublicationAssets),
    publicFunctionAssets.semanticLinks.request,
    publicFunctionAssets.semanticLinks.outcome,
    publicFunctionAssets.composition.request,
    publicFunctionAssets.composition.outcome,
    publicFunctionAssets.mesh.request,
    publicFunctionAssets.mesh.outcome,
    publicFunctionAssets.contextProjection.request,
    publicFunctionAssets.contextProjection.outcome,
    publicFunctionAssets.interpretation.request,
    publicFunctionAssets.interpretation.outcome,
    publicFunctionAssets.query.request,
    publicFunctionAssets.query.outcome
  ];
  for (const asset of assets) {
    const ref = asset.schema.ref;
    assert.equal(ref.startsWith("contract://odd_world_model/"), false, `${asset.name} has an unresolved contract`);
    assert.equal(ref.startsWith("workspace://"), true, `${asset.name} is not workspace-resolvable`);
    const [relativePath, fragment] = ref.slice("workspace://".length).split("#");
    assert.ok(relativePath);
    const schema = JSON.parse(await readFile(path.resolve(repoRoot, relativePath), "utf8")) as {
      readonly $defs?: Readonly<Record<string, unknown>>;
    };
    if (fragment !== undefined) {
      const match = /^\/\$defs\/([^/]+)$/.exec(fragment);
      assert.ok(match, `${asset.name} has an unsupported JSON pointer`);
      assert.ok(schema.$defs?.[match[1]!], `${asset.name} points to a missing schema definition`);
    }
  }
});

test("public GTL request and outcome carriers implement the accepted contract tuples", async () => {
  const ajv = await loadCommonSchemaValidator(schemaRoot);
  const ref = (name: string) => exactFixture(`asset://schema/${name}`);
  const requestCases = [
    ["domain_publication_request", {
      request_ref: "request://schema/domain-publication",
      source_scope: ref("source-scope"),
      source_evidence_set: [ref("source-evidence")],
      source_kind: "fpml_confirmation",
      source_authority_policy_ref: "policy://schema/source-authority/v1",
      semantic_construction_policy_ref: "policy://schema/semantic-construction/v1",
      publication_policy_ref: "policy://schema/publication/v1"
    }],
    ["semantic_link_publication_request", {
      request_ref: "request://schema/link-publication",
      endpoint_cuts: [ref("source-cut"), ref("target-cut")],
      semantic_link_proposal_set: ref("link-proposals"),
      relation_contract_ref: "contract://schema/relation/v1",
      treatment_contract_ref: "contract://schema/treatment/v1",
      link_authority_policy_ref: "policy://schema/link-authority/v1"
    }],
    ["world_model_composition_request", {
      request_ref: "request://schema/composition",
      component_cuts: [ref("component-a"), ref("component-b")],
      admitted_semantic_links: [ref("published-link")],
      composition_intent: "join the exact components through admitted relations",
      composition_policy_ref: "policy://schema/composition/v1"
    }],
    ["mesh_resolution_request", {
      request_ref: "request://schema/mesh",
      interaction_goal: "resolve exact context",
      root_refs: [ref("mesh-root")],
      scope_ref: "scope://schema/mesh/v1",
      relation_selectors: ["references"],
      closure_rule: "outbound_dependency_closure",
      selection_policy_ref: "policy://schema/selection/v1",
      admitted_semantic_links: [ref("published-link")]
    }],
    ["context_projection_request", {
      request_ref: "request://schema/context",
      mesh_cut: ref("mesh-cut"),
      projection_contract: ref("projection-contract"),
      context_window_policy_ref: "policy://schema/context-window/v1",
      freshness_policy_ref: "policy://schema/freshness/v1",
      exact_dependency_refs: [ref("context-dependency")]
    }],
    ["context_interpretation_request", {
      request_ref: "request://schema/interpretation",
      context_basis: ref("context-basis"),
      context_projection: ref("context-projection"),
      model_capability_binding: ref("model-capability"),
      invocation_policy_ref: "policy://schema/invocation/v1",
      expected_output_contract_ref: "contract://schema/model-output/v1"
    }],
    ["world_model_query_request", {
      request_ref: "request://schema/query",
      context_basis: ref("query-context-basis"),
      query_contract_ref: "contract://schema/query/v1",
      query_contract_version: "v1",
      projection_policy_ref: "policy://schema/query-projection/v1"
    }]
  ] as const;
  for (const [name, value] of requestCases) {
    const validate = ajv.getSchema(`odd_world_model.graph_function_contracts.schema.json#/$defs/${name}`);
    assert.ok(validate, `missing request validator ${name}`);
    assert.equal(validate(value), true, `${name}: ${JSON.stringify(validate.errors)}`);
  }

  const outcomeCases = [
    ["domain_publication_outcome", ["published_domain_artifact", "semantic_cut_attestation", "domain_publication_evidence"]],
    ["semantic_link_publication_outcome", ["published_semantic_link_set", "semantic_cut_attestation", "link_publication_evidence"]],
    ["world_model_composition_outcome", ["composed_world_model", "semantic_cut_attestation", "composition_evidence"]],
    ["mesh_resolution_outcome", ["bounded_mesh_cut", "dependency_closure_projection", "mesh_resolution_evidence"]],
    ["context_projection_outcome", ["context_basis", "context_projection", "context_freshness_witness"]],
    ["context_interpretation_outcome", ["context_invocation_record", "proposed_semantic_result", "output_admission_report"]],
    ["world_model_query_outcome", ["query_projection", "query_proof_evidence"]]
  ] as const;
  for (const [name, fields] of outcomeCases) {
    const value = Object.fromEntries([
      ...fields.map((field) => [field, ref(`${name}/${field}`)]),
      ["typed_gaps", []]
    ]);
    const validate = ajv.getSchema(`odd_world_model.graph_function_outcomes.schema.json#/$defs/${name}`);
    assert.ok(validate, `missing outcome validator ${name}`);
    assert.equal(validate(value), true, `${name}: ${JSON.stringify(validate.errors)}`);
  }

  assert.deepEqual(computeRegimesForHandle("odd_world_model.publish_semantic_links"), ["F_D", "F_P", "F_H"]);
  assert.deepEqual(computeRegimesForHandle("odd_world_model.compose_world_model"), ["F_D", "F_P", "F_H"]);
  assert.deepEqual(computeRegimesForHandle("odd_world_model.resolve_mesh_cut"), ["F_D", "F_P"]);
});

test("current publication, mesh, context, and Markov carriers satisfy shared schemas", async () => {
  const ajv = await loadCommonSchemaValidator(schemaRoot);
  const source = createSourceObservation({
    schema_kind: "odd_world_model.source_observation",
    schema_version: "v1",
    observation_ref: "source-observation://schema/fpml/1",
    source: exactFixture("source://schema/fpml/confirmation.xml"),
    source_kind: "fpml_confirmation",
    authority_ref: "authority://schema/source",
    evidence_refs: ["evidence://schema/fpml/confirmation.xml"],
    observed_at: fixtureAt
  });
  const candidateMarkov = createCandidateMarkovObjectCut({
    schema_kind: "odd_world_model.candidate_markov_object_cut",
    schema_version: "v1",
    object_ref: "markov-object://schema/trade/v1",
    object_identity: "trade",
    identity_direction: {
      source_state_refs: ["state://trade/new"],
      target_state_refs: ["state://trade/confirmed"],
      projection_ref: "projection://schema/trade/v1"
    },
    projection_support_refs: ["evidence://schema/projection/v1"],
    distributed_ledger_evidence_refs: ["ledger-entry://schema/trade/1"],
    candidate_basis: exactFixture("basis://schema/candidate"),
    null_peer_basis: exactFixture("basis://schema/null-peer"),
    held_out_treatment_verification: {
      treatment_ref: "treatment://schema/confirm/v1",
      corpus_ref: "corpus://schema/held-out/v1",
      result: "inconclusive",
      evidence_refs: ["evidence://schema/held-out/v1"]
    },
    boundary: {
      included_refs: ["field://trade/id"],
      excluded_refs: [],
      rationale: "schema fixture boundary"
    },
    publication_classification: "candidate",
    source_observation: exactRefForSourceObservation(source),
    authority_ref: "authority://schema/wm",
    created_at: fixtureAt
  });
  const proposal = createSemanticProposal({
    schema_kind: "odd_world_model.semantic_proposal",
    schema_version: "v1",
    proposal_ref: "semantic-proposal://schema/fpml/1",
    source_observation: exactRefForSourceObservation(source),
    proposed_by: "model://schema/constructor/v1",
    payload_schema_ref: "workspace://build_tenants/common/schemas/candidate_markov_object_cut.schema.json",
    payload: JSON.parse(JSON.stringify(candidateMarkov)),
    epistemic_status: "candidate",
    created_at: fixtureAt
  });
  const check = checkSemanticProposal({
    checkRef: "check://schema/proposal/1",
    proposal,
    sourceObservation: source,
    payloadChecks: [candidateMarkovObjectPayloadCheck],
    checkedAt: fixtureAt
  });
  const admission = admissionWitnessFixture(
    "admission-witness://schema/proposal/1",
    "proposal_evidence",
    [exactRefForSemanticProposal(proposal)]
  );
  const decision = decideSemanticAcceptance({
    decisionRef: "wm-acceptance://schema/proposal/1",
    proposal,
    checkReport: check,
    proposalAdmission: admission,
    authorityRef: "authority://schema/wm",
    disposition: "accepted",
    rationale: "schema fixture passed deterministic checks",
    decidedAt: fixtureAt
  });
  const acceptanceAdmission = admissionWitnessFixture(
    "admission-witness://schema/acceptance/1",
    "acceptance_evidence",
    [exactRefForCheckReport(check), exactRefForAcceptanceDecision(decision)]
  );
  const accepted = createAcceptedSemanticCut({
    proposal,
    checkReport: check,
    proposalAdmission: admission,
    acceptanceDecision: decision,
    acceptanceAdmission,
    cut: {
      semanticCutRef: "semantic-cut://schema/fpml/v1",
      cutRole: "domain_artifact",
      cutVersion: "v1",
      governingRefs: ["requirement://schema/semantic-publication"],
      sourceRefs: [source.source.ref],
      authorityRefs: ["authority://schema/wm"],
      dependencyIdentities: ["product://abiogenesis/4.6.0-rc.3"],
      temporalCoordinates: { accepted_at: fixtureAt },
      fidelity: "lossless_projection",
      losses: [],
      exclusions: [],
      acceptedAt: fixtureAt
    }
  });
  const context = contextFixture(2);
  const fixtures = [
    ["source_observation.schema.json", source],
    ["candidate_markov_object_cut.schema.json", candidateMarkov],
    ["semantic_proposal.schema.json", proposal],
    ["deterministic_check_report.schema.json", check],
    ["abg_admission_witness.schema.json", admission],
    ["wm_acceptance_decision.schema.json", decision],
    ["accepted_semantic_cut.schema.json", accepted],
    ["published_semantic_cut.schema.json", publishedCutFixture("semantic-cut://schema/published")],
    ["semantic_link.schema.json", context.link],
    ["bounded_mesh_cut.schema.json", context.mesh],
    ["context_basis.schema.json", context.basis],
    ["context_projection.schema.json", context.projection]
  ] as const;
  for (const [schemaName, fixture] of fixtures) {
    const validate = ajv.getSchema(`odd_world_model.${schemaName}`);
    assert.ok(validate);
    assert.equal(validate(fixture), true, `${schemaName}: ${JSON.stringify(validate.errors)}`);
  }
});

test("context schemas reject dishonest fidelity and truncation declarations", async () => {
  const ajv = await loadCommonSchemaValidator(schemaRoot);
  const context = contextFixture(2);
  const validateBasis = ajv.getSchema("odd_world_model.context_basis.schema.json");
  const validateProjection = ajv.getSchema("odd_world_model.context_projection.schema.json");
  assert.ok(validateBasis);
  assert.ok(validateProjection);
  assert.equal(validateBasis({ ...context.basis, fidelity: "exact_payload" }), false);
  assert.equal(validateProjection({
    ...context.projection,
    losses: [],
    fidelity: "lossy_projection"
  }), false);
});
