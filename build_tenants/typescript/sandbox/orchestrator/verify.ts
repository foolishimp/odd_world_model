import { createHash } from "node:crypto";
import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { gunzipSync } from "node:zlib";
import { sha256Digest } from "../../code/src/index.ts";
import {
  assertDeploymentManifest,
  type WorldModelDeploymentManifest
} from "../installed/protocol.ts";

const thisFile = fileURLToPath(import.meta.url);

interface ArtifactManifestEntry {
  readonly relative_path: string;
  readonly byte_length: number;
  readonly sha256: string;
}

interface ArtifactManifest {
  readonly schema_kind: string;
  readonly schema_version: string;
  readonly entries: readonly ArtifactManifestEntry[];
  readonly manifest_digest: string;
}

interface InstancePrime {
  readonly schema_kind: string;
  readonly schema_version: string;
  readonly instance_ref: string;
  readonly example_name: string;
  readonly product_binding: {
    readonly ref: string;
    readonly digest: string;
  };
  readonly source_inventory: {
    readonly ref: string;
    readonly digest: string;
  };
  readonly artifact_manifest: {
    readonly path: string;
    readonly digest: string;
  };
  readonly instance_digest: string;
}

export interface InstanceCutInspection {
  readonly schema_kind: "odd_world_model.instance_cut_inspection";
  readonly schema_version: "v1";
  readonly instance_ref: string;
  readonly integrity_state: "intact";
  readonly source_state: "exact" | "not_checked";
  readonly artifact_count: number;
  readonly runtime_event_count: number;
  readonly product_deployment_ref: string;
  readonly source_inventory_ref: string;
}

function bytesDigest(bytes: Uint8Array): string {
  return `sha256:${createHash("sha256").update(bytes).digest("hex")}`;
}

async function readJson<T>(filePath: string): Promise<T> {
  return JSON.parse(await readFile(filePath, "utf8")) as T;
}

async function filesUnder(root: string, relative = ""): Promise<string[]> {
  const entries = await readdir(path.join(root, relative), { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries.sort((left, right) => left.name.localeCompare(right.name))) {
    const child = path.join(relative, entry.name);
    if (entry.isDirectory()) files.push(...await filesUnder(root, child));
    else if (entry.isFile()) files.push(child.split(path.sep).join("/"));
  }
  return files;
}

function assertObjectDigest<T extends object>(value: T, digestKey: keyof T, label: string): void {
  const recorded = value[digestKey];
  const digestInput = { ...value };
  delete digestInput[digestKey];
  const expected = sha256Digest(digestInput);
  if (recorded !== expected) throw new Error(`${label} digest mismatch: expected ${expected}`);
}

export async function inspectInstanceCut(
  instanceRoot: string,
  sourceRoot?: string
): Promise<InstanceCutInspection> {
  const canonicalRoot = path.resolve(instanceRoot);
  const prime = await readJson<InstancePrime>(path.join(canonicalRoot, "wm-instance.json"));
  if (prime.schema_kind !== "odd_world_model.instance_cut" || prime.schema_version !== "v1") {
    throw new Error("unsupported instance prime schema");
  }
  assertObjectDigest(prime, "instance_digest", "instance prime");
  if (prime.artifact_manifest.path !== "proof/artifact-manifest.json") {
    throw new Error("instance prime points at an unsupported artifact manifest path");
  }
  const artifactManifest = await readJson<ArtifactManifest>(
    path.join(canonicalRoot, prime.artifact_manifest.path)
  );
  if (artifactManifest.schema_kind !== "odd_world_model.instance_artifact_manifest") {
    throw new Error("unsupported instance artifact manifest");
  }
  assertObjectDigest(artifactManifest, "manifest_digest", "artifact manifest");
  if (artifactManifest.manifest_digest !== prime.artifact_manifest.digest) {
    throw new Error("instance prime does not bind the exact artifact manifest");
  }
  const declaredPaths = artifactManifest.entries.map((entry) => entry.relative_path);
  if (new Set(declaredPaths).size !== declaredPaths.length) throw new Error("artifact manifest paths are not unique");
  const actualPaths = (await filesUnder(canonicalRoot)).filter(
    (relative) => relative !== "wm-instance.json" && relative !== "proof/artifact-manifest.json"
  );
  if (JSON.stringify([...declaredPaths].sort()) !== JSON.stringify([...actualPaths].sort())) {
    throw new Error("instance artifact file set differs from the prime-bound manifest");
  }
  for (const entry of artifactManifest.entries) {
    const filePath = path.resolve(canonicalRoot, entry.relative_path);
    if (!filePath.startsWith(`${canonicalRoot}${path.sep}`)) throw new Error(`artifact path escapes instance: ${entry.relative_path}`);
    const [bytes, fileStat] = await Promise.all([readFile(filePath), stat(filePath)]);
    if (fileStat.size !== entry.byte_length || bytesDigest(bytes) !== entry.sha256) {
      throw new Error(`artifact bytes changed: ${entry.relative_path}`);
    }
  }

  const productBinding = await readJson<WorldModelDeploymentManifest>(
    path.join(canonicalRoot, "install", "product-binding.json")
  );
  assertDeploymentManifest(productBinding);
  if (
    productBinding.deployment_ref !== prime.product_binding.ref ||
    productBinding.manifest_digest !== prime.product_binding.digest
  ) {
    throw new Error("instance prime and installed product binding differ");
  }
  const sourceInventory = await readJson<Record<string, unknown>>(
    path.join(canonicalRoot, "input", "source-inventory.json")
  );
  assertObjectDigest(sourceInventory, "inventory_digest", "source inventory");
  if (
    sourceInventory.inventory_ref !== prime.source_inventory.ref ||
    sourceInventory.inventory_digest !== prime.source_inventory.digest
  ) {
    throw new Error("instance prime and source inventory differ");
  }
  if (sourceRoot !== undefined) {
    const entries = sourceInventory.entries;
    if (!Array.isArray(entries)) throw new Error("source inventory entries are missing");
    for (const value of entries) {
      const entry = value as unknown as ArtifactManifestEntry;
      const filePath = path.resolve(sourceRoot, entry.relative_path);
      const canonicalSourceRoot = path.resolve(sourceRoot);
      if (!filePath.startsWith(`${canonicalSourceRoot}${path.sep}`)) {
        throw new Error(`source inventory path escapes source root: ${entry.relative_path}`);
      }
      const bytes = await readFile(filePath);
      if (bytes.byteLength !== entry.byte_length || bytesDigest(bytes) !== entry.sha256) {
        throw new Error(`retained source changed: ${entry.relative_path}`);
      }
    }
  }
  const compressedEvents = await readFile(path.join(canonicalRoot, "evidence", "runtime-events.jsonl.gz"));
  const eventSummary = await readJson<Record<string, unknown>>(
    path.join(canonicalRoot, "evidence", "runtime-event-summary.json")
  );
  const eventText = gunzipSync(compressedEvents).toString("utf8");
  if (
    eventSummary.compressed_sha256 !== bytesDigest(compressedEvents) ||
    eventSummary.uncompressed_sha256 !== bytesDigest(Buffer.from(eventText, "utf8"))
  ) {
    throw new Error("runtime event archive differs from its summary");
  }
  const eventCount = eventText.trim().length === 0 ? 0 : eventText.trim().split("\n").length;
  if (eventSummary.event_count !== eventCount) throw new Error("runtime event count differs from its summary");
  return Object.freeze({
    schema_kind: "odd_world_model.instance_cut_inspection",
    schema_version: "v1",
    instance_ref: prime.instance_ref,
    integrity_state: "intact",
    source_state: sourceRoot === undefined ? "not_checked" : "exact",
    artifact_count: artifactManifest.entries.length,
    runtime_event_count: eventCount,
    product_deployment_ref: productBinding.deployment_ref,
    source_inventory_ref: String(sourceInventory.inventory_ref)
  });
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  let instanceRoot: string | undefined;
  let sourceRoot: string | undefined;
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index]!;
    if (arg === "--instance") instanceRoot = args[++index];
    else if (arg === "--source-root") sourceRoot = args[++index];
    else throw new Error(`unknown verification argument ${arg}`);
  }
  if (instanceRoot === undefined) throw new Error("--instance is required");
  const inspection = await inspectInstanceCut(
    path.resolve(process.env.INIT_CWD ?? process.cwd(), instanceRoot),
    sourceRoot === undefined ? undefined : path.resolve(process.env.INIT_CWD ?? process.cwd(), sourceRoot)
  );
  process.stdout.write(`${JSON.stringify(inspection, null, 2)}\n`);
}

if (path.resolve(process.argv[1] ?? "") === thisFile) await main();
