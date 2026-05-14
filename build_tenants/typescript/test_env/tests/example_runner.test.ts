import { cp, mkdtemp, readFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";
import test from "node:test";
import { parseFpmlTrade, runExamples } from "../../code/src/index.ts";

const testDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(testDir, "../../../..");

async function tempWorkspace(): Promise<string> {
  const root = await mkdtemp(path.join(os.tmpdir(), "odd-world-model-ts-"));
  for (const exampleName of ["apra_liquidity_model", "banking_product_model", "trade_representation_model", "trade_source_model"]) {
    await cp(
      path.join(repoRoot, "examples", exampleName, "sources"),
      path.join(root, "examples", exampleName, "sources"),
      { recursive: true }
    );
  }
  return root;
}

test("FpML parser recovers retained source trade identity and legs", async () => {
  const observation = await parseFpmlTrade(
    path.join(repoRoot, "examples", "trade_source_model", "sources", "data", "authority", "com-ex28-gas-swap-daily-delivery-prices-option-last.xml")
  );

  assert.equal(observation.fpml_version, "5-12");
  assert.equal(observation.trade_id, "1234");
  assert.equal(observation.trade_date, "2006-06-01");
  assert.deepEqual(observation.party_refs, ["partyA", "partyB"]);
  assert.equal(observation.product.legs.length, 2);
  assert.equal(observation.product.legs[0]?.leg_kind, "fixedLeg");
  assert.equal(observation.product.legs[1]?.leg_kind, "floatingLeg");
});

test("example runner emits TypeScript sandbox cuts for every retained example source corpus", async () => {
  const workspace = await tempWorkspace();
  const result = await runExamples(workspace, { runId: "20260515T000000Z_v1.TS" });

  assert.equal(result.results.length, 4);
  assert.deepEqual(
    result.results.map((entry) => entry.exampleName),
    ["apra_liquidity_model", "banking_product_model", "trade_representation_model", "trade_source_model"]
  );
  for (const entry of result.results) {
    assert.equal(entry.status, "ok");
    assert.equal(entry.completedEdges.length, 7);
    const fragment = JSON.parse(await readFile(path.join(entry.sandboxRoot, entry.keyOutputs.fragment), "utf8"));
    const querySummary = JSON.parse(await readFile(path.join(entry.sandboxRoot, entry.keyOutputs.querySummary), "utf8"));
    assert.equal(fragment.schema_kind, "odd_world_model.world_fragment");
    assert.ok(fragment.objects.length > 0);
    assert.equal(querySummary.lane, "filesystem_first");
  }
});
