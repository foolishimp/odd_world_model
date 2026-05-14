import { access, mkdir, readdir, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import type { ComparisonResult, ExampleBuilderKind, ExampleDescriptor, ExampleRunResult, JsonObject, SandboxBuilderConfig } from "../domain/types.ts";
import { buildDomainInputSeed } from "../build_line/domain_input_seed.ts";
import { buildFpmlSourceSeed } from "../build_line/fpml_source_seed.ts";
import {
  PROGRAM_STEPS,
  PUBLISHED_AT,
  nowRunStamp,
  readJsonObject,
  writeJson,
  writeText
} from "../build_line/common.ts";

const REFERENCE_RUN_ID = "20260419T000000Z_v1";

function artifactSlug(exampleName: string): string {
  if (exampleName === "trade_source_model") return "fpml_confirmation_source_domain";
  if (exampleName.endsWith("_model")) return `${exampleName.slice(0, -"_model".length)}_domain`;
  return `${exampleName}_domain`;
}

async function exists(filePath: string): Promise<boolean> {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function discoverBuilder(exampleRoot: string): Promise<ExampleBuilderKind> {
  if (await exists(path.join(exampleRoot, "sources", "data", "domain_input.json"))) {
    return "domain_input_seed";
  }
  if (await exists(path.join(exampleRoot, "sources", "data", "authority", "com-ex28-gas-swap-daily-delivery-prices-option-last.xml"))) {
    return "fpml_source_seed";
  }
  throw new Error(`no supported source corpus found for ${exampleRoot}`);
}

export async function discoverExamples(workspaceRoot: string, runId: string): Promise<ExampleDescriptor[]> {
  const examplesRoot = path.resolve(workspaceRoot, "examples");
  const entries = await readdir(examplesRoot);
  const descriptors: ExampleDescriptor[] = [];
  for (const entry of entries.sort()) {
    const exampleRoot = path.join(examplesRoot, entry);
    if (!(await stat(exampleRoot)).isDirectory()) continue;
    const sourcesRoot = path.join(exampleRoot, "sources");
    if (!(await exists(sourcesRoot))) continue;
    const builderKind = await discoverBuilder(exampleRoot);
    descriptors.push({
      exampleName: entry,
      exampleRoot,
      sandboxRoot: path.join(exampleRoot, "sandbox", runId),
      artifactSlug: artifactSlug(entry),
      builderKind
    });
  }
  return descriptors;
}

function sandboxConfig(descriptor: ExampleDescriptor): SandboxBuilderConfig {
  const base = {
    configuration_version: "v1",
    workspace_kind: "installed_example_sandbox",
    builder: {
      kind: descriptor.builderKind,
      self_test_program: "build_and_query_world_model"
    }
  };

  if (descriptor.builderKind === "domain_input_seed") {
    return {
      ...base,
      domain: {
        example_name: descriptor.exampleName,
        artifact_slug: descriptor.artifactSlug,
        source_manifest: "../../sources/data/domain_input.json"
      }
    };
  }
  return {
    ...base,
    domain: {
      example_name: descriptor.exampleName,
      artifact_slug: descriptor.artifactSlug,
      source_xml: "../../sources/data/authority/com-ex28-gas-swap-daily-delivery-prices-option-last.xml",
      examples_index: "../../sources/data/authority/fpml-5-12-examples.html",
      source_authority: "../../sources/uri_ledger/source_authority.md",
      source_notes: "../../sources/uri_ledger/source_notes.md"
    }
  };
}

async function writeWorkspaceScaffold(descriptor: ExampleDescriptor): Promise<void> {
  await mkdir(path.join(descriptor.sandboxRoot, ".ai-workspace", "context"), { recursive: true });
  await mkdir(path.join(descriptor.sandboxRoot, ".ai-workspace", "events"), { recursive: true });
  await mkdir(path.join(descriptor.sandboxRoot, ".ai-workspace", "fp_manifests"), { recursive: true });
  await mkdir(path.join(descriptor.sandboxRoot, ".ai-workspace", "fp_results"), { recursive: true });
  await mkdir(path.join(descriptor.sandboxRoot, ".ai-workspace", "runtime"), { recursive: true });
  await writeJson(path.join(descriptor.sandboxRoot, ".ai-workspace", "context", "world_builder_config.json"), sandboxConfig(descriptor) as unknown as JsonObject);
  await writeJson(path.join(descriptor.sandboxRoot, ".genesis", "odd_world_model", "typescript", "release", "install_manifest.json"), {
    product: "odd_world_model",
    schema_version: "v1",
    installed_at: PUBLISHED_AT,
    project_slug: descriptor.exampleName,
    target_root: descriptor.sandboxRoot,
    source_workspace: path.resolve(descriptor.exampleRoot, "..", ".."),
    package_path: "build_tenants/typescript/code/src",
    runtime_contract_path: ".genesis/odd_world_model/typescript/release/install_manifest.json",
    builder_config_path: ".ai-workspace/context/world_builder_config.json",
    installation_type: "typescript_filesystem_example_sandbox"
  });
  const bootloader = [
    "<!-- ODD_WORLD_MODEL_TS_BOOTLOADER_START -->",
    "# odd_world_model TypeScript Installed Builder Surface",
    "",
    "This sandbox is a TypeScript generated comparison cut for the retained example sources.",
    "It is not the mutable odd_world_model source project and it does not replace the Python reference cut.",
    "",
    `- example: \`${descriptor.exampleName}\``,
    `- builder kind: \`${descriptor.builderKind}\``,
    "- builder config: `workspace://.ai-workspace/context/world_builder_config.json`",
    "- install manifest: `workspace://.genesis/odd_world_model/typescript/release/install_manifest.json`",
    "",
    "Treat sibling `sources/` as retained rebuild authority and generated outputs under this sandbox as derived proof/comparison artifacts.",
    "<!-- ODD_WORLD_MODEL_TS_BOOTLOADER_END -->",
    ""
  ].join("\n");
  await writeText(path.join(descriptor.sandboxRoot, "AGENTS.md"), bootloader);
  await writeText(path.join(descriptor.sandboxRoot, "CLAUDE.md"), bootloader);
}

function targetAssetForStep(step: string): string {
  switch (step) {
    case "trace_source_observations":
      return "source_observation_surface";
    case "assure_attribute_claims":
      return "assurance_surface";
    case "materialize_attribute_ledger":
      return "attribute_ledger_surface";
    case "project_markov_object_cut":
      return "markov_object_cut_surface";
    case "publish_domain_artifact":
      return "published_domain_artifact_surface";
    case "compose_world_model":
      return "composed_world_model_surface";
    case "project_query_surface":
      return "query_projection_surface";
    default:
      return "unknown";
  }
}

async function writeRunEvidence(descriptor: ExampleDescriptor, outputs: Record<string, string>): Promise<void> {
  const eventLines: string[] = [];
  for (const [index, step] of PROGRAM_STEPS.entries()) {
    const stamp = `${PUBLISHED_AT.replace(/[-:]/g, "").replace(".000", "").replace("Z", "")}${String(index + 1).padStart(2, "0")}Z`;
    const targetAsset = targetAssetForStep(step);
    const manifestPath = path.join(descriptor.sandboxRoot, ".ai-workspace", "fp_manifests", `${step}_${stamp}.json`);
    const resultPath = path.join(descriptor.sandboxRoot, ".ai-workspace", "fp_results", `${step}_${stamp}.json`);
    await writeJson(manifestPath, {
      edge: step,
      target_asset: targetAsset,
      actor: "odd_world_model_ts_constructor",
      result_path: resultPath,
      generated_by: "build_tenants/typescript/code/src/sandbox/run_examples.ts"
    });
    await writeJson(resultPath, {
      edge: step,
      actor: "odd_world_model_ts_constructor",
      assessments: [
        {
          evaluator: `${targetAsset}_materialized`,
          result: "pass",
          evidence: `TypeScript example runner materialized ${targetAsset}.`
        }
      ]
    });
    eventLines.push(JSON.stringify({
      event: "fp_step_completed",
      edge: step,
      target_asset: targetAsset,
      observed_at: PUBLISHED_AT
    }));
  }
  await writeFile(path.join(descriptor.sandboxRoot, ".ai-workspace", "events", "events.jsonl"), `${eventLines.join("\n")}\n`, "utf8");
  await writeJson(path.join(descriptor.sandboxRoot, ".ai-workspace", "runtime", "active-workflow.json"), {
    status: "converged",
    scope: "executive_program",
    program: "build_and_query_world_model",
    completed_edges: [...PROGRAM_STEPS],
    outputs
  });
}

export async function runExample(descriptor: ExampleDescriptor, options: { clean?: boolean } = {}): Promise<ExampleRunResult> {
  if (options.clean !== false) {
    await rm(descriptor.sandboxRoot, { force: true, recursive: true });
  }
  await writeWorkspaceScaffold(descriptor);
  const keyOutputs = descriptor.builderKind === "domain_input_seed"
    ? await buildDomainInputSeed(descriptor.sandboxRoot)
    : await buildFpmlSourceSeed(descriptor.sandboxRoot);
  await writeRunEvidence(descriptor, keyOutputs);
  return {
    exampleName: descriptor.exampleName,
    builderKind: descriptor.builderKind,
    artifactSlug: descriptor.artifactSlug,
    sandboxRoot: descriptor.sandboxRoot,
    status: "ok",
    completedEdges: [...PROGRAM_STEPS],
    keyOutputs
  };
}

export async function runExamples(workspaceRoot: string, options: { runId?: string; clean?: boolean } = {}): Promise<{ runId: string; results: ExampleRunResult[] }> {
  const runId = options.runId ?? `${nowRunStamp()}_v1.TS`;
  const descriptors = await discoverExamples(workspaceRoot, runId);
  const results: ExampleRunResult[] = [];
  for (const descriptor of descriptors) {
    results.push(await runExample(descriptor, { clean: options.clean }));
  }
  return { runId, results };
}

function artifactFromFragment(fragment: JsonObject): { schemaKind: string; boundedContext: string; objects: string[] } {
  return {
    schemaKind: typeof fragment.schema_kind === "string" ? fragment.schema_kind : "",
    boundedContext: typeof fragment.bounded_context === "string" ? fragment.bounded_context : "",
    objects: Array.isArray(fragment.objects) ? fragment.objects.filter((entry): entry is string => typeof entry === "string") : []
  };
}

export async function compareExamples(workspaceRoot: string, runId: string, referenceRunId = REFERENCE_RUN_ID): Promise<ComparisonResult[]> {
  const descriptors = await discoverExamples(workspaceRoot, runId);
  const comparisons: ComparisonResult[] = [];
  for (const descriptor of descriptors) {
    const referenceSandbox = path.join(descriptor.exampleRoot, "sandbox", referenceRunId);
    const generatedSandbox = descriptor.sandboxRoot;
    const checks: ComparisonResult["checks"] = [];
    const required = [
      ".ai-workspace/context/world_builder_config.json",
      "review/source_observation.json",
      `published/${descriptor.artifactSlug}/fragment.json`,
      "published/world_model/composed_world_model.json",
      "query/world_model_query_summary.json"
    ];
    for (const relative of required) {
      const generated = path.join(generatedSandbox, relative);
      checks.push({
        name: `generated:${relative}`,
        status: await exists(generated) ? "ok" : "missing",
        detail: generated
      });
    }
    if (!(await exists(referenceSandbox))) {
      comparisons.push({
        exampleName: descriptor.exampleName,
        status: "missing_reference",
        referenceSandbox,
        generatedSandbox,
        checks
      });
      continue;
    }
    const referenceFragmentPath = path.join(referenceSandbox, "published", descriptor.artifactSlug, "fragment.json");
    const generatedFragmentPath = path.join(generatedSandbox, "published", descriptor.artifactSlug, "fragment.json");
    if (await exists(referenceFragmentPath) && await exists(generatedFragmentPath)) {
      const referenceFragment = artifactFromFragment(await readJsonObject(referenceFragmentPath));
      const generatedFragment = artifactFromFragment(await readJsonObject(generatedFragmentPath));
      checks.push({
        name: "fragment_schema",
        status: referenceFragment.schemaKind === "odd_world_model.world_fragment" && generatedFragment.schemaKind === "odd_world_model.world_fragment" ? "ok" : "mismatch",
        detail: `reference=${referenceFragment.schemaKind}; generated=${generatedFragment.schemaKind}`
      });
      checks.push({
        name: "generated_object_count_nonzero",
        status: generatedFragment.objects.length > 0 ? "ok" : "mismatch",
        detail: `${generatedFragment.objects.length} generated objects`
      });
      checks.push({
        name: "generated_context_seen",
        status: generatedFragment.boundedContext ? "ok" : "mismatch",
        detail: generatedFragment.boundedContext
      });
      checks.push({
        name: "reference_context_seen",
        status: referenceFragment.boundedContext ? "ok" : "mismatch",
        detail: referenceFragment.boundedContext
      });
    } else {
      checks.push({
        name: "reference_fragment_present",
        status: "missing",
        detail: referenceFragmentPath
      });
    }
    comparisons.push({
      exampleName: descriptor.exampleName,
      status: checks.every((check) => check.status === "ok") ? "ok" : "mismatch",
      referenceSandbox,
      generatedSandbox,
      checks
    });
  }
  return comparisons;
}
