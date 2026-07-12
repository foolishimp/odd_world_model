import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import * as publicApi from "../../code/src/index.ts";

const testDir = path.dirname(fileURLToPath(import.meta.url));
const tenantRoot = path.resolve(testDir, "../..");

async function exists(filePath: string): Promise<boolean> {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

test("the package exposes one GTL/ABG product path and quarantines the filesystem constructor", async () => {
  const packageJson = JSON.parse(await readFile(path.join(tenantRoot, "package.json"), "utf8")) as {
    readonly bin?: unknown;
    readonly scripts?: Readonly<Record<string, string>>;
  };
  assert.equal(packageJson.bin, undefined);
  assert.equal(packageJson.scripts?.examples, undefined);
  assert.equal("runExamples" in publicApi, false);
  assert.equal("buildDomainInputSeed" in publicApi, false);
  assert.equal("buildFpmlSourceSeed" in publicApi, false);
  assert.equal(await exists(path.join(tenantRoot, "code/src/cli/main.ts")), false);
  assert.equal(await exists(path.join(tenantRoot, "code/src/sandbox/run_examples.ts")), false);
  assert.equal(await exists(path.join(tenantRoot, "historical/filesystem_runner/README.md")), true);
  const proofGenerator = await readFile(
    path.join(tenantRoot, "code/src/proof/generate_full_build_proof.ts"),
    "utf8"
  );
  assert.equal(proofGenerator.includes("example_runner.test.ts"), false);
  assert.equal(proofGenerator.includes("requirementId.includes"), false);
});

