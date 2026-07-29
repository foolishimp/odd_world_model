import assert from "node:assert/strict";
import { mkdtemp, readFile, realpath, rm, stat } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { gunzipSync } from "node:zlib";
import { deployDevelopmentProduct } from "../orchestrator/deploy.ts";
import { runExampleSandboxes } from "../orchestrator/run.ts";
import { inspectInstanceCut } from "../orchestrator/verify.ts";

const testRoot = path.dirname(fileURLToPath(import.meta.url));

async function readJson(filePath: string): Promise<Record<string, unknown>> {
  return JSON.parse(await readFile(filePath, "utf8")) as Record<string, unknown>;
}

test("an exact installed development product builds immutable side-by-side instances for every retained example", { timeout: 120_000 }, async (t) => {
  const runtimeRoot = await mkdtemp(path.join(os.tmpdir(), "odd-wm-versioned-sandbox-test-"));
  t.after(async () => rm(runtimeRoot, { recursive: true, force: true }));
  const deployment = await deployDevelopmentProduct({
    deploymentsRoot: path.join(runtimeRoot, "deployments"),
    reuse: false,
    createdAt: "2026-07-12T00:00:00Z"
  });
  const manifestPath = path.join(deployment.root, "deployment-manifest.json");
  const outputRoot = path.join(runtimeRoot, "instances");
  const run = await runExampleSandboxes({
    deploymentManifestPath: manifestPath,
    outputRoot,
    observedAt: "2026-07-12T00:01:00Z",
    cutName: "20260712T000100Z_installed-development.TS"
  });
  assert.equal(run.results.length, 4);
  assert.deepEqual(
    run.results.map((result) => [result.example_name, result.candidate_markov_object_count]),
    [
      ["trade_source_model", 1],
      ["trade_representation_model", 1],
      ["banking_product_model", 5],
      ["apra_liquidity_model", 1]
    ]
  );
  const canonicalDeploymentRoot = await realpath(deployment.root);
  const canonicalSourceRoot = await realpath(path.resolve(testRoot, "../../../.."));
  const installedEntrypoint = await realpath(path.join(deployment.root, deployment.manifest.installed_entrypoint));
  assert.ok(installedEntrypoint.startsWith(`${canonicalDeploymentRoot}${path.sep}`));
  assert.equal(installedEntrypoint.startsWith(`${canonicalSourceRoot}${path.sep}`), false);
  const installedPackage = await readJson(path.join(deployment.root, "product", "package.json"));
  const installedDependencies = installedPackage.dependencies as Record<string, string>;
  assert.equal(Object.values(installedDependencies).some((value) => value.startsWith("file:")), false);

  for (const result of run.results) {
    assert.equal(result.runtime_event_count, 708);
    assert.deepEqual(result.gap_types, [
      "native_graph_payload_execution_not_realized",
      "calibrated_fp_authorship_not_proven",
      "semantic_state_projection_not_replay_native"
    ]);
    const prime = await readJson(path.join(result.instance_root, "wm-instance.json"));
    assert.equal(prime.schema_kind, "odd_world_model.instance_cut");
    assert.equal(prime.instance_digest, result.instance_digest);
    const productBinding = prime.product_binding as Record<string, unknown>;
    assert.equal(productBinding.ref, deployment.manifest.deployment_ref);
    assert.equal(productBinding.digest, deployment.manifest.manifest_digest);
    const candidates = JSON.parse(
      await readFile(path.join(result.instance_root, "semantic", "candidate-markov-objects.json"), "utf8")
    ) as Array<Record<string, unknown>>;
    assert.equal(candidates.length, result.candidate_markov_object_count);
    assert.ok(candidates.every((candidate) => candidate.publication_classification === "candidate"));
    assert.ok(candidates.every((candidate) => {
      const verification = candidate.held_out_treatment_verification as Record<string, unknown>;
      return verification.result === "inconclusive";
    }));
    const eventLines = gunzipSync(
      await readFile(path.join(result.instance_root, "evidence", "runtime-events.jsonl.gz"))
    ).toString("utf8")
      .trim()
      .split("\n")
      .map((line) => JSON.parse(line) as Record<string, unknown>);
    assert.equal(eventLines.length, result.runtime_event_count);
    assert.ok(eventLines.every((event) => typeof event.eventId === "string"));
    assert.equal(eventLines.some((event) => event.event === "fp_step_completed"), false);
    assert.ok((await stat(path.join(result.instance_root, "physical", "runtime", "catalog.db"))).size > 0);
    const verification = await readJson(path.join(result.instance_root, "proof", "verification.json"));
    assert.equal(verification.release_authority, "not_claimed");
    assert.equal(verification.native_carrier_closure, "not_claimed");
    const checks = verification.checks as Array<Record<string, unknown>>;
    assert.ok(checks.every((check) => check.evidence_state === "observed"));
    assert.equal(checks.some((check) => check.status === "passed"), false);
    assert.ok(checks.every((check) => typeof check.evidence_ref !== "string" || check.evidence_ref.length > 0));
    const artifactManifest = await readJson(path.join(result.instance_root, "proof", "artifact-manifest.json"));
    const artifactEntries = artifactManifest.entries as Array<Record<string, unknown>>;
    assert.ok(artifactEntries.some((entry) => entry.relative_path === "evidence/runtime-events.jsonl.gz"));
    assert.ok(artifactEntries.some((entry) => entry.relative_path === "physical/runtime/catalog.db"));
    assert.equal(artifactEntries.some((entry) => entry.relative_path === "wm-instance.json"), false);
    const inspection = await inspectInstanceCut(
      result.instance_root,
      path.join(canonicalSourceRoot, "examples", result.example_name, "sources")
    );
    assert.equal(inspection.integrity_state, "intact");
    assert.equal(inspection.source_state, "exact");
    assert.equal(inspection.runtime_event_count, result.runtime_event_count);
  }

  const firstPrimePath = path.join(run.results[0]!.instance_root, "wm-instance.json");
  const firstPrimeBefore = await readFile(firstPrimePath, "utf8");
  await assert.rejects(
    runExampleSandboxes({
      deploymentManifestPath: manifestPath,
      outputRoot,
      observedAt: "2026-07-12T00:01:00Z",
      cutName: run.cut_name
    }),
    /cannot be overwritten/
  );
  assert.equal(await readFile(firstPrimePath, "utf8"), firstPrimeBefore);
});
