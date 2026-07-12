import { createHash } from "node:crypto";
import { lstat, mkdir, readFile, readdir, readlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { spawnSync } from "node:child_process";
import {
  PUBLIC_GRAPH_FUNCTION_HANDLES,
  assertExactProductBinding,
  runWorldModelConformance,
  runWorldModelPublicStart,
  sha256Digest,
  worldModelCatalogProjection
} from "../index.ts";

const DEFAULT_PROOF_ROOT = path.resolve(
  "test_env/proof/20260712T000000Z_full-build-v1"
);

function fileSha256(value: string | Uint8Array): string {
  return `sha256:${createHash("sha256").update(value).digest("hex")}`;
}

async function writeJson(filePath: string, value: unknown): Promise<void> {
  await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function runVerification(
  command: string,
  args: readonly string[],
  cwd: string,
  environment: Readonly<Record<string, string>> = {}
) {
  const completed = spawnSync(command, args, {
    cwd,
    encoding: "utf8",
    env: { ...process.env, ...environment }
  });
  const record = {
    command: [command, ...args].join(" "),
    cwd,
    status: completed.status,
    signal: completed.signal,
    stdout: completed.stdout,
    stderr: completed.stderr
  };
  if (completed.status !== 0) {
    throw new Error(`verification command failed: ${record.command}\n${completed.stdout}\n${completed.stderr}`);
  }
  return record;
}

function gitValue(args: readonly string[], cwd: string): string {
  const completed = spawnSync("git", args, { cwd, encoding: "utf8" });
  if (completed.status !== 0) throw new Error(`git ${args.join(" ")} failed: ${completed.stderr}`);
  return completed.stdout.trimEnd();
}

async function developmentSourceInventory(repoRoot: string, proofRoot: string) {
  const completed = spawnSync(
    "git",
    ["status", "--porcelain=v1", "-z", "--untracked-files=all"],
    { cwd: repoRoot, encoding: "utf8" }
  );
  if (completed.status !== 0) throw new Error(`git status failed: ${completed.stderr}`);
  const chunks = completed.stdout.split("\0").filter((item) => item.length > 0);
  const proofPrefix = `${path.relative(repoRoot, proofRoot)}${path.sep}`;
  const entries: Array<{
    status: string;
    path: string;
    original_path: string | null;
    content_identity: string;
  }> = [];
  let excludedProofPathCount = 0;
  for (let index = 0; index < chunks.length; index += 1) {
    const record = chunks[index]!;
    const status = record.slice(0, 2);
    const relativePath = record.slice(3);
    const hasOriginalPath = status.includes("R") || status.includes("C");
    const originalPath = hasOriginalPath ? chunks[++index] ?? null : null;
    if (relativePath.startsWith(proofPrefix)) {
      excludedProofPathCount += 1;
      continue;
    }
    const absolutePath = path.join(repoRoot, relativePath);
    let contentIdentity: string;
    try {
      const stat = await lstat(absolutePath);
      if (stat.isSymbolicLink()) {
        contentIdentity = fileSha256(`symlink:${await readlink(absolutePath)}`);
      } else if (stat.isFile()) {
        contentIdentity = fileSha256(await readFile(absolutePath));
      } else {
        contentIdentity = `filesystem-kind:${stat.mode}`;
      }
    } catch (error: unknown) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
      contentIdentity = "absent";
    }
    entries.push({ status, path: relativePath, original_path: originalPath, content_identity: contentIdentity });
  }
  entries.sort((left, right) => left.path.localeCompare(right.path));
  return {
    schema_kind: "odd_world_model.development_source_inventory",
    schema_version: "v1",
    head_commit: gitValue(["rev-parse", "HEAD"], repoRoot),
    dirty: entries.length > 0 || excludedProofPathCount > 0,
    all_dirty_path_count: entries.length + excludedProofPathCount,
    source_path_count: entries.length,
    excluded_proof_path_count: excludedProofPathCount,
    proof_path_exclusion: proofPrefix,
    entries,
    source_inventory_digest: sha256Digest(entries)
  };
}

interface RequirementDisposition {
  readonly status: string;
  readonly review_disposition: string;
  readonly evidence_refs: readonly string[];
}

function requirementIds(stem: string, numbers: readonly number[]): readonly string[] {
  return numbers.map((number) => `${stem}-${String(number).padStart(3, "0")}`);
}

const semanticEvidence = Object.freeze([
  "build_tenants/typescript/design/90-admitted-semantic-steel-thread-design.md",
  "build_tenants/typescript/design/95-rc3-reference-bridge-as-built-review.md",
  "build_tenants/typescript/test_env/tests/semantic_memory.test.ts",
  "build_tenants/typescript/test_env/tests/full_steel_thread.test.ts",
  "verification.json"
]);
const substrateEvidence = Object.freeze([
  "build_tenants/common/design/GTL_GRAPH_FUNCTION_CONTRACTS.md",
  "build_tenants/typescript/design/90-admitted-semantic-steel-thread-design.md",
  "build_tenants/typescript/design/95-rc3-reference-bridge-as-built-review.md",
  "build_tenants/typescript/test_env/tests/gtl_substrate.test.ts",
  "build_tenants/typescript/test_env/tests/full_steel_thread.test.ts",
  "gtl-conformance-report.json",
  "events.jsonl",
  "replay-events.jsonl"
]);
const storageEvidence = Object.freeze([
  "build_tenants/storage/python/design/IMPLEMENTATION_DESIGN.md",
  "build_tenants/typescript/test_env/tests/storage_contract.test.ts",
  "build_tenants/typescript/test_env/tests/full_steel_thread.test.ts",
  "verification.json"
]);

const explicitRequirementDispositions = new Map<string, RequirementDisposition>();

function recordCandidateEvidence(ids: readonly string[], evidenceRefs: readonly string[]): void {
  for (const id of ids) {
    explicitRequirementDispositions.set(id, {
      status: "candidate_evidence",
      review_disposition: "specific_witness_present_no_requirement_closure_claimed",
      evidence_refs: evidenceRefs
    });
  }
}

function recordSpecificCandidateEvidence(
  id: string,
  reviewDisposition: string,
  evidenceRefs: readonly string[]
): void {
  explicitRequirementDispositions.set(id, {
    status: "candidate_evidence",
    review_disposition: reviewDisposition,
    evidence_refs: evidenceRefs
  });
}

recordCandidateEvidence(requirementIds("REQ-ODD-WORLD-MODEL-CONTEXT-MEMORY", [1, 2, 3, 4, 5, 6]), semanticEvidence);
recordCandidateEvidence(requirementIds("REQ-ODD-WORLD-MODEL-CONTEXT-MEMORY-CONSTRAINT", [1, 2, 3, 4, 5, 6]), semanticEvidence);
recordCandidateEvidence(requirementIds("REQ-ODD-WORLD-MODEL-MESH-CAP", [1, 2, 3, 4, 7, 8, 9, 10]), semanticEvidence);
recordCandidateEvidence(requirementIds("REQ-ODD-WORLD-MODEL-MESH-CONSTRAINT", [1, 2, 3, 5, 7, 8, 9, 10, 11]), semanticEvidence);
recordCandidateEvidence(requirementIds("REQ-ODD-WORLD-MODEL-ODD-CARRIER", [1, 3, 4, 6, 7, 8, 9, 11]), substrateEvidence);
recordCandidateEvidence(requirementIds("REQ-ODD-WORLD-MODEL-BUILD-CONSTRAINT", [1, 4, 5, 6]), [...semanticEvidence, ...storageEvidence]);
recordCandidateEvidence(requirementIds("REQ-ODD-WORLD-MODEL-BUILD-CAP", [3, 4, 5, 7]), semanticEvidence);
recordCandidateEvidence(requirementIds("REQ-ODD-WORLD-MODEL-WORLD-OBJECT", [1, 4, 7, 13]), semanticEvidence);

recordSpecificCandidateEvidence(
  "REQ-ODD-WORLD-MODEL-BUILD-CAP-004",
  "connected_composition_over_exact_published_cuts_and_admitted_semantic_links_is_witnessed",
  [
    "build_tenants/typescript/code/src/domain/world_model_composition.ts",
    "build_tenants/typescript/test_env/tests/semantic_memory.test.ts",
    "build_tenants/typescript/test_env/tests/full_steel_thread.test.ts"
  ]
);
recordSpecificCandidateEvidence(
  "REQ-ODD-WORLD-MODEL-BUILD-CAP-005",
  "bounded_query_contract_traverses_exact_admitted_nodes_and_links_and_returns_the_traversed_vectors",
  [
    "build_tenants/typescript/code/src/query/query_projection.ts",
    "build_tenants/typescript/test_env/tests/full_steel_thread.test.ts"
  ]
);
recordSpecificCandidateEvidence(
  "REQ-ODD-WORLD-MODEL-CONTEXT-MEMORY-006",
  "freshness_is_derived_from_a_validated_current_dependency_catalog_and_bound_into_the_invocation_record",
  [
    "build_tenants/typescript/code/src/context/context_memory.ts",
    "build_tenants/typescript/test_env/tests/semantic_memory.test.ts"
  ]
);
recordSpecificCandidateEvidence(
  "REQ-ODD-WORLD-MODEL-MESH-CAP-008",
  "semantic_link_proposal_requires_replay_admission_before_the_durable_published_link_can_enter_mesh_or_composition",
  [
    "build_tenants/typescript/code/src/domain/semantic_link_resolution.ts",
    "build_tenants/typescript/test_env/tests/semantic_memory.test.ts"
  ]
);

for (const [id, disposition] of [
  [
    "REQ-ODD-WORLD-MODEL-ODD-CARRIER-002",
    "native_WM_payload_execution_by_the_selected_GraphFunction_is_not_yet_realized"
  ],
  [
    "REQ-ODD-WORLD-MODEL-CONTEXT-MEMORY-CONSTRAINT-004",
    "known_loss_truncation_exclusion_and_gap_disclosure_is_proven_but_unknown_or_unmeasured_fidelity_has_no_declared_contract_value"
  ],
  [
    "REQ-ODD-WORLD-MODEL-ODD-CARRIER-005",
    "live_carrier_transports_exact_refs_but_does_not_yet_execute_the_WM_semantic_kernel"
  ],
  [
    "REQ-ODD-WORLD-MODEL-ODD-CARRIER-010",
    "reference_plugins_are_injected_by_the_proving_adapter_not_resolved_as_production_WM_capabilities"
  ],
  [
    "REQ-ODD-WORLD-MODEL-ODD-CARRIER-012",
    "the_pinned_GLC_line_supplies_startup_and_lifecycle_overlay_evidence_not_the_successor_downstream_program_carrier"
  ],
  [
    "REQ-ODD-WORLD-MODEL-BUILD-CAP-001",
    "the_current_slice_has_source_check_acceptance_and_publication_but_not_the_required_assurance_and_attribute_ledger_chain"
  ],
  [
    "REQ-ODD-WORLD-MODEL-BUILD-CAP-002",
    "traced_observation_exists_but_the_separate_assurance_surface_is_not_realized"
  ],
  [
    "REQ-ODD-WORLD-MODEL-BUILD-CAP-006",
    "bounded_iterative_saturation_and_its_gap_carrying_termination_contract_are_not_realized"
  ],
  [
    "REQ-ODD-WORLD-MODEL-BUILD-CONSTRAINT-002",
    "no_append_only_attribute_ledger_is_the_immediate_source_of_the_candidate_object_cut"
  ],
  [
    "REQ-ODD-WORLD-MODEL-BUILD-CONSTRAINT-003",
    "immutable_objects_exist_but_published_cut_and_link_supersession_are_not_proven"
  ],
  [
    "REQ-ODD-WORLD-MODEL-BUILD-VERIFY-001",
    "source_check_and_cut_surfaces_exist_but_assurance_and_attribute_ledger_review_surfaces_are_missing"
  ],
  [
    "REQ-ODD-WORLD-MODEL-BUILD-VERIFY-002",
    "reverse_recoverability_stops_before_resolved_attribute_ledger_and_assurance_evidence"
  ],
  [
    "REQ-ODD-WORLD-MODEL-BUILD-VERIFY-003",
    "the_integrated_slice_is_semantic_plumbing_not_the_full_source_to_attribute_ledger_to_object_chain"
  ],
  [
    "REQ-ODD-WORLD-MODEL-BUILD-VERIFY-007",
    "candidate_Markov_object_shape_is_exercised_but_supporting_ledger_and_held_out_treatment_evidence_are_not_resolved"
  ],
  [
    "REQ-ODD-WORLD-MODEL-BUILD-VERIFY-009",
    "the_rc3_bridge_re_carries_a_preconstructed_candidate_and_does_not_prove_calibrated_F_P_semantic_authorship"
  ],
  [
    "REQ-ODD-WORLD-MODEL-MESH-CAP-005",
    "no_two_domain_fixture_adopts_one_published_common_model_by_exact_reference"
  ],
  [
    "REQ-ODD-WORLD-MODEL-MESH-CAP-006",
    "incremental_addition_and_supersession_are_not_proven_over_a_retained_mesh"
  ],
  [
    "REQ-ODD-WORLD-MODEL-MESH-CONSTRAINT-004",
    "published_node_and_link_supersession_disclosure_has_no_integrated_witness"
  ],
  [
    "REQ-ODD-WORLD-MODEL-MESH-CONSTRAINT-006",
    "common_model_reuse_is_declared_but_has_no_integrated_adoption_witness"
  ],
  [
    "REQ-ODD-WORLD-MODEL-WORLD-OBJECT-002",
    "identity_direction_shape_exists_but_held_out_treatment_and_distributed_evidence_are_unresolved_refs"
  ],
  [
    "REQ-ODD-WORLD-MODEL-WORLD-OBJECT-005",
    "the_slice_has_one_treatment_link_but_no_covariance_and_adjoint_trace_chain"
  ],
  [
    "REQ-ODD-WORLD-MODEL-WORLD-OBJECT-009",
    "attribute_level_sourceability_cannot_close_without_attribute_ledger_and_assurance_records"
  ],
  [
    "REQ-ODD-WORLD-MODEL-WORLD-OBJECT-010",
    "qualified_multi_surface_attribute_authority_is_not_exercised"
  ],
  [
    "REQ-ODD-WORLD-MODEL-WORLD-OBJECT-011",
    "append_only_attribute_ledger_materialization_is_not_realized"
  ],
  [
    "REQ-ODD-WORLD-MODEL-WORLD-OBJECT-012",
    "candidate_cut_shape_is_immutable_but_ledger_projection_and_explicit_supersession_are_not_realized"
  ]
] as const) {
  explicitRequirementDispositions.set(id, {
    status: "open",
    review_disposition: disposition,
    evidence_refs: [
      "build_tenants/typescript/design/90-admitted-semantic-steel-thread-design.md",
      "build_tenants/typescript/design/95-rc3-reference-bridge-as-built-review.md",
      "build_tenants/typescript/code/src/substrate_binding/public_start.ts",
      "build_tenants/typescript/test_env/tests/full_steel_thread.test.ts"
    ]
  });
}

for (const [id, reviewDisposition] of [
  [
    "REQ-ODD-WORLD-MODEL-BUILD-CONSTRAINT-003",
    "immutable_v1_and_v2_publications_are_joined_by_an_admitted_cut_supersession_link_without_editing_v1"
  ],
  [
    "REQ-ODD-WORLD-MODEL-MESH-CAP-005",
    "source_and_interpreted_domains_adopt_one_exact_published_common_model_through_admitted_links"
  ],
  [
    "REQ-ODD-WORLD-MODEL-MESH-CAP-006",
    "retained_v1_and_v2_meshes_prove_incremental_supersession_and_dependency_local_affected_closure"
  ],
  [
    "REQ-ODD-WORLD-MODEL-MESH-CONSTRAINT-004",
    "published_cut_and_link_supersession_are_explicit_admitted_relations_with_closed_validity_and_resolvable_successors"
  ],
  [
    "REQ-ODD-WORLD-MODEL-MESH-CONSTRAINT-006",
    "the_common_model_is_an_exact_published_common_model_role_and_not_an_ambient_default"
  ]
] as const) {
  recordSpecificCandidateEvidence(id, reviewDisposition, [
    "build_tenants/typescript/code/src/domain/semantic_link_resolution.ts",
    "build_tenants/typescript/code/src/mesh/semantic_mesh.ts",
    "build_tenants/typescript/test_env/tests/semantic_memory.test.ts",
    "build_tenants/typescript/test_env/tests/full_steel_thread.test.ts",
    "reference-semantic-slice.json",
    "verification.json"
  ]);
}

explicitRequirementDispositions.set("REQ-ODD-WORLD-MODEL-BUILD-VERIFY-008", {
  status: "not_applicable",
  review_disposition: "no_established_markov_object_claimed",
  evidence_refs: [
    "build_tenants/common/schemas/candidate_markov_object_cut.schema.json",
    "build_tenants/typescript/test_env/tests/semantic_memory.test.ts"
  ]
});

for (const id of [
  ...requirementIds("REQ-ODD-WORLD-MODEL-MAPPING-CAP", [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
  ...requirementIds("REQ-ODD-WORLD-MODEL-MAPPING-CONSTRAINT", [1, 2, 3, 4, 5, 6, 7, 8])
]) {
  explicitRequirementDispositions.set(id, {
    status: "deferred",
    review_disposition: "deferred_by_accepted_ADR_WM_004",
    evidence_refs: [
      "build_tenants/common/design/adrs/ADR-WM-004-gtl-graph-function-catalog.md",
      "build_tenants/common/design/MULTI_DOMAIN_MAPPING_LINE.md"
    ]
  });
}

for (const id of requirementIds("REQ-ODD-WORLD-MODEL-RELEASE", [1, 2, 3, 4, 5, 6, 7, 8])) {
  explicitRequirementDispositions.set(id, {
    status: "open",
    review_disposition: "immutable_release_and_install_proof_required",
    evidence_refs: [
      "specification/requirements/95-release-installation-governance.md",
      "build_tenants/common/design/INSTALLER_CONVERGENCE_LINE.md"
    ]
  });
}

function classifyRequirement(requirementId: string): RequirementDisposition {
  return explicitRequirementDispositions.get(requirementId) ?? {
    status: "open",
    review_disposition: "reviewed_no_specific_current_slice_witness_present",
    evidence_refs: []
  };
}

async function requirementProofCandidates(repoRoot: string) {
  const requirementsRoot = path.join(repoRoot, "specification/requirements");
  const names = (await readdir(requirementsRoot)).filter((name) => name.endsWith(".md")).sort();
  const rows: Array<{
    requirement_id: string;
    source_ref: string;
    status: string;
    review_disposition: string;
    evidence_refs: readonly string[];
  }> = [];
  for (const name of names) {
    const sourceRef = `specification/requirements/${name}`;
    const text = await readFile(path.join(requirementsRoot, name), "utf8");
    for (const match of text.matchAll(/^### (REQ-[A-Z0-9-]+)/gmu)) {
      const requirementId = match[1];
      if (requirementId === undefined) continue;
      rows.push({ requirement_id: requirementId, source_ref: sourceRef, ...classifyRequirement(requirementId) });
    }
  }
  rows.sort((left, right) => left.requirement_id.localeCompare(right.requirement_id));
  const duplicateIds = rows
    .filter((row, index) => rows.findIndex((candidate) => candidate.requirement_id === row.requirement_id) !== index)
    .map((row) => row.requirement_id);
  if (duplicateIds.length > 0) throw new Error(`duplicate requirement ids: ${duplicateIds.join(", ")}`);
  const statusCounts = Object.fromEntries(
    [...new Set(rows.map((row) => row.status))]
      .sort()
      .map((status) => [status, rows.filter((row) => row.status === status).length])
  );
  return {
    schema_kind: "odd_world_model.requirement_proof_candidate_ledger",
    schema_version: "v1",
    closure_authority: "not_claimed",
    requirement_count: rows.length,
    status_counts: statusCounts,
    rows
  };
}

async function main(): Promise<void> {
  const tenantRoot = process.cwd();
  const repoRoot = path.resolve(tenantRoot, "../..");
  const storageRoot = path.resolve(tenantRoot, "../storage/python");
  const outputRoot = path.resolve(process.argv[2] ?? DEFAULT_PROOF_ROOT);
  await mkdir(outputRoot, { recursive: true });
  const referenceSlicePath = path.join(outputRoot, "reference-semantic-slice.json");
  const tenantPackage = JSON.parse(await readFile(path.join(tenantRoot, "package.json"), "utf8")) as {
    dependencies?: Readonly<Record<string, string>>;
  };
  if (
    tenantPackage.dependencies?.["fast-xml-parser"] !== "5.10.0" ||
    tenantPackage.dependencies?.["fast-xml-validator"] !== "1.2.0"
  ) {
    throw new Error("FpML parser dependencies do not match the reviewed exact resolution");
  }

  const duckdbIdentityVerification = runVerification(
    path.join(storageRoot, ".venv/bin/python"),
    ["test_env/proof_runtime_identity.py"],
    storageRoot
  );
  const verification = [
    runVerification("npm", ["run", "typecheck"], tenantRoot),
    runVerification("npm", ["test"], tenantRoot, {
      OWM_REFERENCE_SLICE_PROOF_PATH: referenceSlicePath
    }),
    runVerification(
      path.join(storageRoot, ".venv/bin/python"),
      ["-m", "unittest", "discover", "-s", "test_env/tests", "-v"],
      storageRoot
    ),
    runVerification(
      path.join(storageRoot, ".venv/bin/python"),
      ["-m", "compileall", "-q", "code", "test_env/tests"],
      storageRoot
    ),
    runVerification(path.join(storageRoot, ".venv/bin/python"), ["-m", "pip", "check"], storageRoot),
    duckdbIdentityVerification
  ];
  await writeJson(path.join(outputRoot, "verification.json"), verification);
  const referenceSlice = JSON.parse(await readFile(referenceSlicePath, "utf8")) as Record<string, unknown>;
  const recordedReferenceDigest = referenceSlice.evidence_digest;
  const referenceDigestInput = { ...referenceSlice };
  delete referenceDigestInput.evidence_digest;
  if (
    recordedReferenceDigest !== sha256Digest(referenceDigestInput) ||
    referenceSlice.execution_mode !== "local_semantic_kernel_with_rc3_reference_digest_bridge"
  ) {
    throw new Error("reference semantic slice evidence failed digest or execution-mode validation");
  }
  const persistedEventRefs = new Set<string>();
  const persistedWitnesses: Array<{ witness_ref: string; runtime_event_refs: readonly string[] }> = [];
  const visitReferenceEvidence = (value: unknown): void => {
    if (Array.isArray(value)) {
      value.forEach(visitReferenceEvidence);
      return;
    }
    if (value === null || typeof value !== "object") return;
    const record = value as Record<string, unknown>;
    const eventIdentity = typeof record.eventId === "string"
      ? record.eventId
      : typeof record.eventRef === "string" ? record.eventRef : null;
    if (eventIdentity !== null) persistedEventRefs.add(eventIdentity);
    if (record.schema_kind === "odd_world_model.abg_admission_witness") {
      if (
        typeof record.witness_ref !== "string" ||
        !Array.isArray(record.runtime_event_refs) ||
        !record.runtime_event_refs.every((item) => typeof item === "string")
      ) {
        throw new Error("reference semantic slice contains a malformed admission witness");
      }
      persistedWitnesses.push({
        witness_ref: record.witness_ref,
        runtime_event_refs: record.runtime_event_refs as readonly string[]
      });
    }
    Object.values(record).forEach(visitReferenceEvidence);
  };
  visitReferenceEvidence(referenceSlice);
  const unresolvedWitnessEvents = persistedWitnesses.flatMap((witness) =>
    witness.runtime_event_refs
      .filter((eventRef) => !persistedEventRefs.has(eventRef))
      .map((eventRef) => `${witness.witness_ref} -> ${eventRef}`)
  );
  if (persistedWitnesses.length === 0 || unresolvedWitnessEvents.length > 0) {
    throw new Error(
      `reference semantic slice witness closure failed: ${unresolvedWitnessEvents.join(", ")}`
    );
  }
  const duckdbRuntimeIdentity = JSON.parse(duckdbIdentityVerification.stdout) as unknown;
  await writeJson(
    path.join(outputRoot, "duckdb-runtime-identity.json"),
    duckdbRuntimeIdentity
  );

  const exactProductBinding = assertExactProductBinding();
  const catalog = worldModelCatalogProjection();
  const conformance = runWorldModelConformance();
  if (!conformance.passed) throw new Error("cannot persist a failed GTL conformance report");
  await writeJson(path.join(outputRoot, "exact-product-binding.json"), exactProductBinding);
  await writeJson(path.join(outputRoot, "gtl-catalog.json"), catalog);
  await writeJson(path.join(outputRoot, "gtl-conformance-report.json"), conformance);
  const requirementLedger = await requirementProofCandidates(repoRoot);
  await writeJson(path.join(outputRoot, "requirement-proof-candidates.json"), requirementLedger);

  const firstRuns = PUBLIC_GRAPH_FUNCTION_HANDLES.map((handle) =>
    runWorldModelPublicStart({ targetHandle: handle, until: "converged", runRefSuffix: "proof-first-v1" })
  );
  const replayRuns = PUBLIC_GRAPH_FUNCTION_HANDLES.map((handle) =>
    runWorldModelPublicStart({ targetHandle: handle, until: "converged", runRefSuffix: "proof-replay-v1" })
  );
  const rawEvents = firstRuns.flatMap((proof) =>
    proof.runtime_events.map((event) => ({ target_handle: proof.target_handle, event }))
  );
  const replayEvents = replayRuns.flatMap((proof) =>
    proof.runtime_events.map((event) => ({ target_handle: proof.target_handle, event }))
  );
  const rawEventText = `${rawEvents.map((entry) => JSON.stringify(entry)).join("\n")}\n`;
  const replayEventText = `${replayEvents.map((entry) => JSON.stringify(entry)).join("\n")}\n`;
  await writeFile(path.join(outputRoot, "events.jsonl"), rawEventText, "utf8");
  await writeFile(path.join(outputRoot, "replay-events.jsonl"), replayEventText, "utf8");

  const publicStartSummary = firstRuns.map((first, index) => {
    const replay = replayRuns[index];
    if (replay === undefined || replay.target_handle !== first.target_handle) {
      throw new Error("public-start replay inventory lost target alignment");
    }
    const firstGlc = first.registry_interpretation;
    const replayGlc = replay.registry_interpretation;
    if (firstGlc.status !== "accepted" || replayGlc.status !== "accepted") {
      throw new Error(`GLC rejected startup truth for ${first.target_handle}`);
    }
    if (first.outcome.kind !== "converged" || replay.outcome.kind !== "converged") {
      throw new Error(`public start did not converge for ${first.target_handle}`);
    }
    const eventKindDigest = sha256Digest(first.event_kinds);
    const replayEventKindDigest = sha256Digest(replay.event_kinds);
    if (eventKindDigest !== replayEventKindDigest) {
      throw new Error(`event-kind replay drift for ${first.target_handle}`);
    }
    if (
      JSON.stringify(firstGlc.value.selectedGraphFunctionRefs) !==
      JSON.stringify(replayGlc.value.selectedGraphFunctionRefs)
    ) {
      throw new Error(`target-selection replay drift for ${first.target_handle}`);
    }
    const plannedRegimes = first.runtime_events
      .filter((event) => event.kind === "vector_traversal_planned")
      .map((event) => event.regime);
    const fpDispatchRequestedCount = first.event_kinds
      .filter((kind) => kind === "fp_dispatch_requested").length;
    const selectedCompositionRefs = first.runtime_events
      .filter((event) => event.kind === "executive_pressure_fact_projected")
      .map((event) => {
        const fact = event.executivePressureFact;
        if (typeof fact !== "object" || fact === null) return null;
        const selected = (fact as Record<string, unknown>)["selectedCompositionRef"];
        return typeof selected === "string" ? selected : null;
      })
      .filter((ref): ref is string => ref !== null);
    if (
      first.target_handle === "odd_world_model.interpret_context" &&
      (
        plannedRegimes[0] !== "F_P" ||
        fpDispatchRequestedCount !== 1 ||
        !selectedCompositionRefs.includes(
          "abg.fn_composition://odd_world_model/interpret-context"
        )
      )
    ) {
      throw new Error("interpret_context did not exercise its declared F_P boundary");
    }
    return {
      target_handle: first.target_handle,
      first_outcome: first.outcome.kind,
      replay_outcome: replay.outcome.kind,
      event_count: first.runtime_events.length,
      replay_event_count: replay.runtime_events.length,
      event_kind_digest: eventKindDigest,
      replay_event_kind_digest: replayEventKindDigest,
      event_kind_replay_equal: true,
      registry_entry_count: firstGlc.value.registryEntryCount,
      readiness: firstGlc.value.readiness,
      selected_graph_function_refs: firstGlc.value.selectedGraphFunctionRefs,
      graph_call_count: firstGlc.value.graphCallIds.length,
      vector_closed_count: firstGlc.value.vectorClosedRefs.length,
      planned_regimes: plannedRegimes,
      fp_dispatch_requested_count: fpDispatchRequestedCount,
      selected_composition_refs: selectedCompositionRefs,
      deterministic_attached_result_count: first.event_kinds
        .filter((kind) => kind === "actor_result_artifact_observed").length
    };
  });
  await writeJson(path.join(outputRoot, "public-start-summary.json"), publicStartSummary);
  const sourceInventory = await developmentSourceInventory(repoRoot, outputRoot);
  await writeJson(path.join(outputRoot, "development-source-inventory.json"), sourceInventory);

  const proofFiles = [
    "verification.json",
    "duckdb-runtime-identity.json",
    "exact-product-binding.json",
    "gtl-catalog.json",
    "gtl-conformance-report.json",
    "requirement-proof-candidates.json",
    "events.jsonl",
    "replay-events.jsonl",
    "public-start-summary.json",
    "reference-semantic-slice.json",
    "development-source-inventory.json"
  ];
  const fileDigests: Record<string, string> = {};
  for (const name of proofFiles) {
    fileDigests[name] = fileSha256(await readFile(path.join(outputRoot, name)));
  }
  const manifest = {
    schema_kind: "odd_world_model.full_build_proof_manifest",
    schema_version: "v1",
    proof_id: "proof://odd_world_model/full-build/20260712T000000Z/v1",
    generated_at: new Date().toISOString(),
    claim_scope: "development_exact_substrate_reference_bridge_and_integrated_semantic_contract_slice",
    release_authority: "not_claimed",
    source_state: {
      head_commit: sourceInventory.head_commit,
      dirty: sourceInventory.dirty,
      dirty_path_count: sourceInventory.all_dirty_path_count,
      source_path_count: sourceInventory.source_path_count,
      excluded_proof_path_count: sourceInventory.excluded_proof_path_count,
      source_inventory_digest: sourceInventory.source_inventory_digest
    },
    exact_product_binding: exactProductBinding,
    catalog_digest: catalog.catalog_digest,
    conformance_report_ref: conformance.reportRef,
    conformance_inventory_digest: conformance.inventoryDigest,
    conformance_issue_count: conformance.issueCount,
    requirement_count: requirementLedger.requirement_count,
    requirement_status_counts: requirementLedger.status_counts,
    public_target_count: publicStartSummary.length,
    event_count: rawEvents.length,
    replay_event_count: replayEvents.length,
    event_log_sha256: fileDigests["events.jsonl"],
    replay_event_log_sha256: fileDigests["replay-events.jsonl"],
    replay_projection: "event-kind sequence and exact target selection equal for every public handle",
    duckdb_exact_snapshot_proof: duckdbRuntimeIdentity,
    source_adapter_dependencies: {
      fast_xml_parser: tenantPackage.dependencies["fast-xml-parser"],
      fast_xml_validator: tenantPackage.dependencies["fast-xml-validator"]
    },
    fp_dispatch_proof: {
      target_handle: "odd_world_model.interpret_context",
      mode: "deterministic_reference_and_digest_bridge",
      production_model_provider_claimed: false,
      fp_dispatch_requested_count: publicStartSummary.find(
        (row) => row.target_handle === "odd_world_model.interpret_context"
      )?.fp_dispatch_requested_count ?? 0
    },
    semantic_execution_status: "WM contracts execute in the local deterministic kernel; selected rc.3 GraphFunctions carry exact refs and admission evidence but do not execute those payload transforms",
    integrated_storage_proof: "verification.json runs the reference-bound semantic contract thread plus PyIceberg and DuckDB exact-snapshot observations",
    reference_semantic_slice: {
      evidence_ref: referenceSlice.evidence_ref,
      evidence_digest: recordedReferenceDigest,
      execution_mode: referenceSlice.execution_mode,
      admission_witness_count: persistedWitnesses.length,
      persisted_runtime_event_ref_count: persistedEventRefs.size,
      unresolved_witness_event_count: unresolvedWitnessEvents.length
    },
    files: fileDigests,
    exclusions: [
      "immutable release cut",
      "committed clean-source proof",
      "production catalog or object-store topology",
      "production LLM or model-provider integration",
      "native execution of WM payload transforms by the selected GraphFunctions",
      "calibrated F_P authorship of the semantic proposal",
      "deferred odd_world_model.map_domains executable publication",
      "claim that generic rc.3 target-carrier payload is the inline WM semantic payload",
      "final requirement ratification or release closure"
    ]
  };
  await writeJson(path.join(outputRoot, "proof-manifest.json"), manifest);
  process.stdout.write(`${JSON.stringify({ outputRoot, manifest }, null, 2)}\n`);
}

await main();
