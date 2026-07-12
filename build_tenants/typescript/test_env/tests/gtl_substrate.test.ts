// Candidate contract evidence: ODD-CARRIER-001,003,004,006..009,011.
// Native payload execution, plugin resolution, and GLC downstream carriage remain open.
import assert from "node:assert/strict";
import test from "node:test";
import {
  DEFERRED_GRAPH_FUNCTION_HANDLES,
  EXACT_PROVING_PRODUCTS,
  PRIVATE_GRAPH_FUNCTION_HANDLES,
  PUBLIC_GRAPH_FUNCTION_HANDLES,
  WORLD_MODEL_GRAPH_FUNCTION_CATALOG,
  WORLD_MODEL_RUNTIME_DECLARATIONS,
  assertExactProductBinding,
  assertWorldModelConformance,
  privateGraphFunctions,
  publicGraphFunctions,
  runWorldModelPublicStartProbe,
  worldModelModule
} from "../../code/src/index.ts";

test("exact ABIogenesis and odd_glc release products are compatibility-bound", () => {
  const evidence = assertExactProductBinding();
  assert.equal(evidence.compatibility_status, "compatible");
  assert.equal(evidence.abiogenesis_version, "4.6.0-rc.3");
  assert.equal(evidence.abiogenesis_tarball_sha256, EXACT_PROVING_PRODUCTS.abiogenesis.tarball_sha256);
  assert.equal(evidence.odd_glc_version, "0.1.0");
  assert.equal(evidence.odd_glc_tarball_sha256, EXACT_PROVING_PRODUCTS.odd_glc.tarball_sha256);
});

test("the prime catalog publishes seven public functions and keeps refinements private", () => {
  assert.deepEqual(publicGraphFunctions.map((entry) => entry.name), PUBLIC_GRAPH_FUNCTION_HANDLES);
  assert.deepEqual(privateGraphFunctions.map((entry) => entry.name), PRIVATE_GRAPH_FUNCTION_HANDLES);
  assert.deepEqual(worldModelModule.graphFunctions.map((entry) => entry.name), PUBLIC_GRAPH_FUNCTION_HANDLES);
  assert.equal(worldModelModule.graphFunctions[0]?.template.graph?.vectors.length, 5);
  assert.deepEqual(
    worldModelModule.graphFunctions[0]?.template.graph?.vectors.map((vector) =>
      vector.name.replace(/\.edge$/u, "")
    ),
    PRIVATE_GRAPH_FUNCTION_HANDLES
  );
  assert.equal(WORLD_MODEL_RUNTIME_DECLARATIONS.length, 7);
  assert.equal(
    WORLD_MODEL_GRAPH_FUNCTION_CATALOG
      .filter((entry) => entry.availability !== "deferred")
      .every((entry) => entry.execution_mode === "reference_digest_bridge"),
    true
  );
  assert.equal(
    WORLD_MODEL_GRAPH_FUNCTION_CATALOG.find((entry) =>
      entry.handle === DEFERRED_GRAPH_FUNCTION_HANDLES[0]
    )?.availability,
    "deferred"
  );
  assert.equal(
    WORLD_MODEL_RUNTIME_DECLARATIONS.some((entry) =>
      entry.graphFunctionRef.includes("map-domains")
    ),
    false
  );
});

test("the exact rc.3 GTL compiler admits the complete declared reference-slice inventory", () => {
  const report = assertWorldModelConformance();
  assert.equal(report.passed, true);
  assert.equal(report.issueCount, 0);
  assert.deepEqual(report.coverage, {
    catalogGraphFunctionCount: 7,
    publishedGraphFunctionCount: 7,
    graphVectorCount: 11,
    targetCarrierContractCount: 11,
    edgeClosureContractCount: 11,
    overlayCount: 1,
    publicStartTargetCount: 7,
    promptAssetCount: 1,
    pluginContractCount: 1,
    sourceIdentitySurfaceCount: 1
  });
  assert.match(report.reportRef, /^abg:\/\/gtl-program-conformance-report\/sha256:/u);
});

for (const handle of PUBLIC_GRAPH_FUNCTION_HANDLES) {
  test(`public ABIogenesis start admits and selects ${handle}`, () => {
    const proof = runWorldModelPublicStartProbe(handle);
    assert.equal(proof.outcome.kind, "advanced");
    assert.equal(proof.event_kinds.filter((kind) => kind === "registry_entry_admitted").length, 7);
    assert.equal(proof.event_kinds.includes("graph_function_selected"), true);
    assert.equal(proof.event_kinds.includes("graph_call_opened"), true);
    assert.equal(proof.event_kinds.includes("vector_closed"), true);
    assert.equal(proof.registry_interpretation.status, "accepted");
    if (proof.registry_interpretation.status !== "accepted") assert.fail("GLC rejected ABG startup truth");
    const selected = publicGraphFunctions.find((entry) => entry.name === handle);
    assert.ok(selected);
    assert.equal(proof.registry_interpretation.value.readiness, "graph_function_selected");
    assert.deepEqual(proof.registry_interpretation.value.selectedGraphFunctionRefs, [selected.id]);
    assert.equal(proof.registry_interpretation.value.registryEntryCount, 7);
  });
}

test("interpret_context carries deterministic F_P transport evidence while ABG owns closure", () => {
  const proof = runWorldModelPublicStartProbe("odd_world_model.interpret_context");
  const planned = proof.runtime_events.find((event) => event.kind === "vector_traversal_planned");
  assert.ok(planned);
  if (planned.kind !== "vector_traversal_planned") assert.fail("missing traversal plan");
  assert.equal(planned.regime, "F_P");
  assert.equal(planned.regimeSource, "graph_vector_declaration");
  assert.equal(
    proof.event_kinds.filter((kind) => kind === "fp_dispatch_requested").length,
    1
  );
  assert.equal(proof.event_kinds.includes("actor_result_artifact_observed"), true);
  const pressure = proof.runtime_events.find(
    (event) => event.kind === "executive_pressure_fact_projected"
  );
  assert.ok(pressure);
  if (pressure.kind !== "executive_pressure_fact_projected") {
    assert.fail("missing composition-attributed evaluation pressure");
  }
  const pressureFact = pressure.executivePressureFact;
  assert.equal(typeof pressureFact, "object");
  assert.notEqual(pressureFact, null);
  assert.equal(
    (pressureFact as Record<string, unknown>)["selectedCompositionRef"],
    "abg.fn_composition://odd_world_model/interpret-context"
  );
  assert.deepEqual(
    proof.runtime_events
      .filter((event) => event.kind === "c_call_fibre_selected")
      .map((event) => event.regime),
    ["F_P", "F_P", "F_D"]
  );
  assert.equal(proof.outcome.kind, "advanced");
  assert.equal(proof.event_kinds.includes("vector_closed"), true);
});

test("a repeated public start preserves the canonical event-kind and target-selection projection", () => {
  const first = runWorldModelPublicStartProbe("odd_world_model.resolve_mesh_cut");
  const replay = runWorldModelPublicStartProbe("odd_world_model.resolve_mesh_cut");
  assert.deepEqual(replay.event_kinds, first.event_kinds);
  assert.equal(replay.outcome.kind, first.outcome.kind);
  assert.equal(first.registry_interpretation.status, "accepted");
  assert.equal(replay.registry_interpretation.status, "accepted");
  if (first.registry_interpretation.status !== "accepted" || replay.registry_interpretation.status !== "accepted") {
    assert.fail("GLC rejected repeated ABG startup truth");
  }
  assert.deepEqual(
    replay.registry_interpretation.value.selectedGraphFunctionRefs,
    first.registry_interpretation.value.selectedGraphFunctionRefs
  );
  assert.deepEqual(
    replay.registry_interpretation.value.graphFunctionEntryRefs,
    first.registry_interpretation.value.graphFunctionEntryRefs
  );
});
