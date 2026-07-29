import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import {
  mkdir,
  readFile,
  readdir,
  rm,
  stat,
  writeFile
} from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";
import { sha256Digest } from "../../code/src/index.ts";
import type { JsonObject } from "../../code/src/domain/types.ts";
import {
  assertDeploymentManifest,
  createSandboxBuildRequest,
  type SandboxBuildFailure,
  type SandboxBuildResponse,
  type SandboxBuildSuccess,
  type WorldModelDeploymentManifest
} from "../installed/protocol.ts";
import { deployDevelopmentProduct } from "./deploy.ts";

const thisFile = fileURLToPath(import.meta.url);
const tenantRoot = path.resolve(path.dirname(thisFile), "../..");
const repositoryRoot = path.resolve(tenantRoot, "../..");
const examplesRoot = path.join(repositoryRoot, "examples");

const SUPPORTED_EXAMPLES = Object.freeze([
  "trade_source_model",
  "trade_representation_model",
  "banking_product_model",
  "apra_liquidity_model"
] as const);

type SupportedExample = (typeof SUPPORTED_EXAMPLES)[number];

export interface RunExampleSandboxesOptions {
  readonly deploymentManifestPath?: string;
  readonly exampleNames?: readonly string[];
  readonly observedAt?: string;
  readonly cutName?: string;
  readonly outputRoot?: string;
}

export interface ExampleSandboxRunSummary {
  readonly example_name: string;
  readonly instance_ref: string;
  readonly instance_root: string;
  readonly instance_digest: string;
  readonly candidate_markov_object_count: number;
  readonly runtime_event_count: number;
  readonly gap_types: readonly string[];
}

function asJsonObject(value: unknown): JsonObject {
  return JSON.parse(JSON.stringify(value)) as JsonObject;
}

function compactTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  if (Number.isNaN(date.valueOf())) throw new Error("observedAt must be a timestamp");
  return date.toISOString().replace(/[-:]/gu, "").replace(/\.\d{3}Z$/u, "Z");
}

function pathSlug(value: string): string {
  return value.replace(/[^A-Za-z0-9._-]+/gu, "-");
}

async function writeJson(filePath: string, value: unknown): Promise<void> {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

async function writeText(filePath: string, value: string): Promise<void> {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, value.endsWith("\n") ? value : `${value}\n`, "utf8");
}

async function writeBytes(filePath: string, value: Uint8Array): Promise<void> {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, value);
}

async function filesUnder(root: string, relative = ""): Promise<string[]> {
  const entries = await readdir(path.join(root, relative), { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries.sort((left, right) => left.name.localeCompare(right.name))) {
    const child = path.join(relative, entry.name);
    if (entry.isDirectory()) files.push(...await filesUnder(root, child));
    else if (entry.isFile()) files.push(child);
  }
  return files;
}

async function artifactManifest(instanceRoot: string): Promise<Record<string, unknown>> {
  const entries: Array<Record<string, unknown>> = [];
  for (const relativePath of await filesUnder(instanceRoot)) {
    if (relativePath === "wm-instance.json" || relativePath === "proof/artifact-manifest.json") continue;
    const bytes = await readFile(path.join(instanceRoot, relativePath));
    entries.push({
      relative_path: relativePath.split(path.sep).join("/"),
      byte_length: bytes.byteLength,
      sha256: `sha256:${createHash("sha256").update(bytes).digest("hex")}`
    });
  }
  const input = {
    schema_kind: "odd_world_model.instance_artifact_manifest",
    schema_version: "v1",
    entries
  };
  return Object.freeze({ ...input, manifest_digest: sha256Digest(input) });
}

async function loadManifest(manifestPath: string): Promise<WorldModelDeploymentManifest> {
  const manifest = JSON.parse(await readFile(manifestPath, "utf8")) as WorldModelDeploymentManifest;
  assertDeploymentManifest(manifest);
  return manifest;
}

function runWorker(input: {
  readonly deploymentRoot: string;
  readonly entrypoint: string;
  readonly request: ReturnType<typeof createSandboxBuildRequest>;
}): Promise<SandboxBuildResponse> {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [input.entrypoint], {
      cwd: input.deploymentRoot,
      env: { ...process.env },
      stdio: ["pipe", "pipe", "pipe"]
    });
    const stdout: Buffer[] = [];
    const stderr: Buffer[] = [];
    let stdoutLength = 0;
    let stderrLength = 0;
    const maxBytes = 64 * 1024 * 1024;
    child.stdout.on("data", (chunk: Buffer) => {
      stdoutLength += chunk.byteLength;
      if (stdoutLength > maxBytes) child.kill();
      else stdout.push(chunk);
    });
    child.stderr.on("data", (chunk: Buffer) => {
      stderrLength += chunk.byteLength;
      if (stderrLength > maxBytes) child.kill();
      else stderr.push(chunk);
    });
    child.on("error", reject);
    child.on("close", (code) => {
      const output = Buffer.concat(stdout).toString("utf8");
      const errorOutput = Buffer.concat(stderr).toString("utf8").trim();
      const lines = output.split(/\r?\n/u).filter((line) => line.length > 0);
      if (lines.length !== 1) {
        reject(new Error(`installed worker emitted ${lines.length} JSON lines${errorOutput ? `: ${errorOutput}` : ""}`));
        return;
      }
      let response: SandboxBuildResponse;
      try {
        response = JSON.parse(lines[0]!) as SandboxBuildResponse;
      } catch (error: unknown) {
        reject(new Error(`installed worker emitted invalid JSON: ${error instanceof Error ? error.message : String(error)}`));
        return;
      }
      if (code === 0 && response.status === "built") resolve(response);
      else if (code === 2 && response.status === "failed") resolve(response);
      else reject(new Error(`installed worker exit/status mismatch: exit=${String(code)} status=${response.status}${errorOutput ? ` stderr=${errorOutput}` : ""}`));
    });
    child.stdin.end(`${JSON.stringify(input.request)}\n`);
  });
}

function assertBuildResult(
  result: SandboxBuildSuccess,
  manifest: WorldModelDeploymentManifest,
  instanceRef: string,
  exampleName: string
): void {
  if (result.instance_ref !== instanceRef || result.example_name !== exampleName) {
    throw new Error("installed worker retargeted the sandbox identity");
  }
  if (
    result.deployment_ref !== manifest.deployment_ref ||
    result.deployment_manifest_digest !== manifest.manifest_digest
  ) {
    throw new Error("installed worker returned evidence from a different deployment");
  }
  const { result_digest: recorded, ...digestInput } = result;
  const expected = sha256Digest(digestInput);
  if (recorded !== expected) throw new Error(`installed worker result digest mismatch: expected ${expected}`);
  if (result.artifacts.runtime_events.length === 0 || result.artifacts.admission_witnesses.length === 0) {
    throw new Error("installed worker returned no runtime or admission evidence");
  }
  if (result.artifacts.candidate_markov_objects.length === 0) {
    throw new Error("installed worker returned no candidate Markov objects");
  }
}

async function oldFragmentObjectCount(exampleName: string, cutName: string): Promise<number | null> {
  const sandboxRoot = path.join(examplesRoot, exampleName, "sandbox", cutName, "published");
  try {
    const domains = await readdir(sandboxRoot, { withFileTypes: true });
    for (const domain of domains) {
      if (!domain.isDirectory() || domain.name === "world_model") continue;
      const fragment = JSON.parse(
        await readFile(path.join(sandboxRoot, domain.name, "fragment.json"), "utf8")
      ) as { objects?: unknown };
      return Array.isArray(fragment.objects) ? fragment.objects.length : null;
    }
    return null;
  } catch (error: unknown) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw error;
  }
}

async function writeInstanceProjection(input: {
  readonly instanceRoot: string;
  readonly sourceRoot: string;
  readonly request: ReturnType<typeof createSandboxBuildRequest>;
  readonly manifest: WorldModelDeploymentManifest;
  readonly result: SandboxBuildSuccess;
}): Promise<ExampleSandboxRunSummary> {
  const { artifacts } = input.result;
  const artifactIndex = {
    source_observation: {
      path: "semantic/source-observation.json",
      semantic_digest: sha256Digest(artifacts.source_observation)
    },
    candidate_markov_objects: {
      path: "semantic/candidate-markov-objects.json",
      semantic_digest: sha256Digest(artifacts.candidate_markov_objects)
    },
    published_semantic_cut: {
      path: "semantic/published-semantic-cut.json",
      semantic_digest: sha256Digest(artifacts.published_semantic_cut)
    },
    bounded_mesh_cut: {
      path: "mesh/bounded-mesh-cut.json",
      semantic_digest: sha256Digest(artifacts.bounded_mesh_cut)
    },
    context_basis: {
      path: "context/context-basis.json",
      semantic_digest: sha256Digest(artifacts.context_basis)
    },
    context_projection: {
      path: "context/context-projection.json",
      semantic_digest: sha256Digest(artifacts.context_projection)
    },
    world_model_query: {
      path: "query/world-model-query.json",
      semantic_digest: sha256Digest(artifacts.world_model_query)
    },
    runtime_events: {
      path: "evidence/runtime-events.jsonl.gz",
      semantic_digest: sha256Digest(artifacts.runtime_events)
    }
  };
  const verification = {
    schema_kind: "odd_world_model.sandbox_verification",
    schema_version: "v1",
    instance_ref: input.result.instance_ref,
    status: "reference_instance_built_with_declared_gaps",
    checks: [
      { check: "installed_subprocess_boundary", evidence_state: "observed", evidence_ref: input.manifest.deployment_ref },
      { check: "exact_source_inventory", evidence_state: "observed", evidence_ref: input.result.source_inventory_ref },
      { check: "abg_runtime_events_present", evidence_state: "observed", evidence_count: artifacts.runtime_events.length },
      { check: "admission_witnesses_present", evidence_state: "observed", evidence_count: artifacts.admission_witnesses.length },
      { check: "physical_snapshot_reproduced", evidence_state: "observed", evidence_ref: String(artifacts.physical_effect_observation.subject_attestation_id ?? "") },
      { check: "candidate_markov_status_preserved", evidence_state: "observed", evidence_count: artifacts.candidate_markov_objects.length }
    ],
    release_authority: "not_claimed",
    native_carrier_closure: "not_claimed",
    gaps: input.result.gaps,
    result_digest: input.result.result_digest
  };
  const [pythonObjectCount, priorTypeScriptObjectCount] = await Promise.all([
    oldFragmentObjectCount(input.result.example_name, "20260419T000000Z_v1"),
    oldFragmentObjectCount(input.result.example_name, "20260515T000000Z_v1.TS")
  ]);
  const comparison = {
    schema_kind: "odd_world_model.reference_comparison",
    schema_version: "v1",
    current_instance_ref: input.result.instance_ref,
    retained_references: [
      {
        cut: "20260419T000000Z_v1",
        classification: "historical_python_reference",
        exact_product_binding_available: false,
        object_count: pythonObjectCount
      },
      {
        cut: "20260515T000000Z_v1.TS",
        classification: "historical_typescript_filesystem_projection",
        exact_product_binding_available: false,
        object_count: priorTypeScriptObjectCount
      }
    ],
    current_candidate_markov_object_count: artifacts.candidate_markov_objects.length,
    source_equivalence_status: "not_provable_from_historical_manifests",
    comparison_basis: "current exact source inventory plus historical output readback",
    declared_deltas: [
      "current cut binds an exact installed development product and dependency digests",
      "current runtime events are preserved from ABG rather than minted by the sandbox orchestrator",
      "current Markov objects remain candidate-class with inconclusive treatment verification",
      "historical object counts are descriptive and do not establish semantic equivalence"
    ]
  };
  const builderConfig = {
    configuration_version: "v2",
    workspace_kind: "versioned_world_model_instance",
    product_binding: { ref: input.manifest.deployment_ref, digest: input.manifest.manifest_digest },
    domain: {
      example_name: input.result.example_name,
      source_root: "../../sources",
      source_inventory: {
        ref: input.result.source_inventory_ref,
        digest: input.result.source_inventory_digest
      }
    },
    execution: {
      protocol_version: input.result.protocol_version,
      mode: input.result.execution_mode
    }
  };
  const bootloader = [
    "<!-- ODD_WORLD_MODEL_SANDBOX_START -->",
    "# odd_world_model Versioned Instance Cut",
    "",
    "This directory is an immutable world-model instance projection over the retained sibling source corpus.",
    "It is not the odd_world_model source project, released product, or runtime authority.",
    "",
    `- instance: \`${input.result.instance_ref}\``,
    `- product: \`${input.manifest.product_version}\` (${input.manifest.deployment_class})`,
    `- source inventory: \`${input.result.source_inventory_digest}\``,
    "- prime manifest: `wm-instance.json`",
    "- product binding: `install/product-binding.json`",
    "- verification: `proof/verification.json`",
    "",
    "Treat `../../sources/` as retained source authority and this directory as a derived, digest-bound cut.",
    "<!-- ODD_WORLD_MODEL_SANDBOX_END -->",
    ""
  ].join("\n");

  const eventText = `${artifacts.runtime_events.map((event) => JSON.stringify(event)).join("\n")}\n`;
  const eventKindCounts = Object.fromEntries(
    [...new Set(artifacts.runtime_events.map((event) => String(event.kind ?? "unknown")))]
      .sort()
      .map((kind) => [kind, artifacts.runtime_events.filter((event) => String(event.kind ?? "unknown") === kind).length])
  );
  const compressedEvents = gzipSync(Buffer.from(eventText, "utf8"), { level: 9 });
  const eventSummary = {
    schema_kind: "odd_world_model.runtime_event_archive_summary",
    schema_version: "v1",
    event_count: artifacts.runtime_events.length,
    event_kind_counts: eventKindCounts,
    encoding: "gzip",
    archive_path: "runtime-events.jsonl.gz",
    uncompressed_sha256: `sha256:${createHash("sha256").update(eventText).digest("hex")}`,
    compressed_sha256: `sha256:${createHash("sha256").update(compressedEvents).digest("hex")}`
  };

  await Promise.all([
    writeJson(path.join(input.instanceRoot, "install", "product-binding.json"), input.manifest),
    writeJson(path.join(input.instanceRoot, "input", "source-inventory.json"), artifacts.source_inventory),
    writeJson(path.join(input.instanceRoot, "semantic", "source-observation.json"), artifacts.source_observation),
    writeJson(path.join(input.instanceRoot, "semantic", "candidate-markov-objects.json"), artifacts.candidate_markov_objects),
    writeJson(path.join(input.instanceRoot, "semantic", "semantic-proposal.json"), artifacts.semantic_proposal),
    writeJson(path.join(input.instanceRoot, "semantic", "deterministic-check.json"), artifacts.deterministic_check),
    writeJson(path.join(input.instanceRoot, "semantic", "acceptance-decision.json"), artifacts.acceptance_decision),
    writeJson(path.join(input.instanceRoot, "semantic", "accepted-semantic-cut.json"), artifacts.accepted_semantic_cut),
    writeJson(path.join(input.instanceRoot, "semantic", "semantic-publication-candidate.json"), artifacts.semantic_publication_candidate),
    writeJson(path.join(input.instanceRoot, "semantic", "published-semantic-cut.json"), artifacts.published_semantic_cut),
    writeJson(path.join(input.instanceRoot, "physical", "semantic-cut-attestation.json"), artifacts.semantic_cut_attestation),
    writeJson(path.join(input.instanceRoot, "physical", "physical-effect-observation.json"), artifacts.physical_effect_observation),
    writeJson(path.join(input.instanceRoot, "mesh", "bounded-mesh-cut.json"), artifacts.bounded_mesh_cut),
    writeJson(path.join(input.instanceRoot, "context", "context-basis.json"), artifacts.context_basis),
    writeJson(path.join(input.instanceRoot, "context", "context-projection.json"), artifacts.context_projection),
    writeJson(path.join(input.instanceRoot, "context", "context-invocation.json"), artifacts.context_invocation),
    writeJson(path.join(input.instanceRoot, "query", "world-model-query.json"), artifacts.world_model_query),
    writeJson(path.join(input.instanceRoot, "evidence", "admission-witnesses.json"), artifacts.admission_witnesses),
    writeBytes(path.join(input.instanceRoot, "evidence", "runtime-events.jsonl.gz"), compressedEvents),
    writeJson(path.join(input.instanceRoot, "evidence", "runtime-event-summary.json"), eventSummary),
    writeJson(path.join(input.instanceRoot, "proof", "verification.json"), verification),
    writeJson(path.join(input.instanceRoot, "comparison", "reference-comparison.json"), comparison),
    writeJson(path.join(input.instanceRoot, ".ai-workspace", "context", "world_builder_config.json"), builderConfig),
    writeText(path.join(input.instanceRoot, "AGENTS.md"), bootloader),
    writeText(path.join(input.instanceRoot, "CLAUDE.md"), bootloader)
  ]);
  const fileManifest = await artifactManifest(input.instanceRoot);
  await writeJson(path.join(input.instanceRoot, "proof", "artifact-manifest.json"), fileManifest);
  const primeInput = {
    schema_kind: "odd_world_model.instance_cut",
    schema_version: "v1",
    instance_ref: input.result.instance_ref,
    example_name: input.result.example_name,
    interaction_goal: `build and inspect ${input.result.example_name} with exact odd_world_model deployment ${input.manifest.product_version}`,
    product_binding: {
      ref: input.manifest.deployment_ref,
      digest: input.manifest.manifest_digest,
      product_version: input.manifest.product_version,
      deployment_class: input.manifest.deployment_class
    },
    source_inventory: {
      ref: input.result.source_inventory_ref,
      digest: input.result.source_inventory_digest
    },
    artifact_manifest: {
      path: "proof/artifact-manifest.json",
      digest: fileManifest.manifest_digest
    },
    execution_mode: input.result.execution_mode,
    artifact_index: artifactIndex,
    gap_types: input.result.gaps.map((gap) => gap.gap_type),
    created_at: input.result.built_at
  };
  const prime = Object.freeze({ ...primeInput, instance_digest: sha256Digest(primeInput) });
  await writeJson(path.join(input.instanceRoot, "wm-instance.json"), prime);
  return Object.freeze({
    example_name: input.result.example_name,
    instance_ref: prime.instance_ref,
    instance_root: input.instanceRoot,
    instance_digest: prime.instance_digest,
    candidate_markov_object_count: artifacts.candidate_markov_objects.length,
    runtime_event_count: artifacts.runtime_events.length,
    gap_types: Object.freeze(input.result.gaps.map((gap) => gap.gap_type))
  });
}

async function buildOne(input: {
  readonly exampleName: SupportedExample;
  readonly instanceRoot: string;
  readonly deploymentRoot: string;
  readonly deploymentManifestPath: string;
  readonly manifest: WorldModelDeploymentManifest;
  readonly observedAt: string;
}): Promise<ExampleSandboxRunSummary> {
  const sourceRoot = path.join(examplesRoot, input.exampleName, "sources");
  if (!(await stat(sourceRoot)).isDirectory()) throw new Error(`${input.exampleName} has no source corpus`);
  await mkdir(path.dirname(input.instanceRoot), { recursive: true });
  try {
    await mkdir(input.instanceRoot);
  } catch (error: unknown) {
    if ((error as NodeJS.ErrnoException).code === "EEXIST") {
      throw new Error(`sandbox instance already exists and cannot be overwritten: ${input.instanceRoot}`);
    }
    throw error;
  }
  const instanceRef = `wm-instance://odd_world_model/${input.exampleName}/${path.basename(input.instanceRoot)}`;
  const request = createSandboxBuildRequest({
    schema_kind: "odd_world_model.sandbox_build_request",
    schema_version: "v1",
    protocol_version: "v1",
    instance_ref: instanceRef,
    example_name: input.exampleName,
    source_root: sourceRoot,
    instance_root: input.instanceRoot,
    deployment_manifest_path: input.deploymentManifestPath,
    observed_at: input.observedAt
  });
  try {
    const response = await runWorker({
      deploymentRoot: input.deploymentRoot,
      entrypoint: path.join(input.deploymentRoot, input.manifest.installed_entrypoint),
      request
    });
    if (response.status === "failed") {
      const failure = response as SandboxBuildFailure;
      throw new Error(`${failure.gap.gap_type}: ${failure.gap.message}`);
    }
    assertBuildResult(response, input.manifest, instanceRef, input.exampleName);
    return await writeInstanceProjection({
      instanceRoot: input.instanceRoot,
      sourceRoot,
      request,
      manifest: input.manifest,
      result: response
    });
  } catch (error: unknown) {
    await rm(input.instanceRoot, { recursive: true, force: true });
    throw error;
  }
}

export async function runExampleSandboxes(
  options: RunExampleSandboxesOptions = {}
): Promise<{
  readonly deployment_manifest_path: string;
  readonly product_version: string;
  readonly cut_name: string;
  readonly results: readonly ExampleSandboxRunSummary[];
}> {
  let deploymentManifestPath = options.deploymentManifestPath;
  if (deploymentManifestPath === undefined) {
    const deployment = await deployDevelopmentProduct();
    deploymentManifestPath = path.join(deployment.root, "deployment-manifest.json");
  }
  deploymentManifestPath = path.resolve(
    process.env.INIT_CWD ?? process.cwd(),
    deploymentManifestPath
  );
  const deploymentRoot = path.dirname(deploymentManifestPath);
  const manifest = await loadManifest(deploymentManifestPath);
  const observedAt = options.observedAt ?? new Date().toISOString();
  const cutName = options.cutName ?? `${compactTimestamp(observedAt)}_${pathSlug(manifest.product_version)}.TS`;
  const requested = options.exampleNames ?? SUPPORTED_EXAMPLES;
  const examples = requested.map((name) => {
    if (!SUPPORTED_EXAMPLES.includes(name as SupportedExample)) throw new Error(`unsupported example ${name}`);
    return name as SupportedExample;
  });
  if (new Set(examples).size !== examples.length) throw new Error("example selection contains duplicates");
  const results: ExampleSandboxRunSummary[] = [];
  for (const exampleName of examples) {
    const instanceRoot = options.outputRoot === undefined
      ? path.join(examplesRoot, exampleName, "sandbox", cutName)
      : path.join(path.resolve(options.outputRoot), exampleName, "sandbox", cutName);
    results.push(await buildOne({
      exampleName,
      instanceRoot,
      deploymentRoot,
      deploymentManifestPath,
      manifest,
      observedAt
    }));
  }
  return Object.freeze({
    deployment_manifest_path: deploymentManifestPath,
    product_version: manifest.product_version,
    cut_name: cutName,
    results: Object.freeze(results)
  });
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const exampleNames: string[] = [];
  let deploymentManifestPath: string | undefined;
  let observedAt: string | undefined;
  let cutName: string | undefined;
  let outputRoot: string | undefined;
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index]!;
    if (arg === "--deployment") deploymentManifestPath = args[++index];
    else if (arg === "--example") exampleNames.push(args[++index]!);
    else if (arg === "--observed-at") observedAt = args[++index];
    else if (arg === "--cut-name") cutName = args[++index];
    else if (arg === "--output-root") outputRoot = args[++index];
    else throw new Error(`unknown sandbox argument ${arg}`);
  }
  const result = await runExampleSandboxes({
    ...(deploymentManifestPath === undefined ? {} : { deploymentManifestPath }),
    ...(exampleNames.length === 0 ? {} : { exampleNames }),
    ...(observedAt === undefined ? {} : { observedAt }),
    ...(cutName === undefined ? {} : { cutName }),
    ...(outputRoot === undefined ? {} : { outputRoot })
  });
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
}

if (path.resolve(process.argv[1] ?? "") === thisFile) await main();
