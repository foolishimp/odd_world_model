import { createHash } from "node:crypto";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { isSha256Digest, sha256Digest } from "../../code/src/domain/canonical.ts";
import type { JsonObject } from "../../code/src/domain/types.ts";
import type { Sha256Digest, TypedGap } from "../../code/src/domain/semantic_memory.ts";

export const SANDBOX_PROTOCOL_VERSION = "v1" as const;

export interface DeploymentArtifact {
  readonly relative_path: string;
  readonly sha256: Sha256Digest;
  readonly byte_length: number;
}

export interface DeploymentDependency {
  readonly package_name: string;
  readonly version: string;
  readonly artifact_sha256: Sha256Digest | null;
}

export interface WorldModelDeploymentManifest {
  readonly schema_kind: "odd_world_model.deployment_manifest";
  readonly schema_version: "v1";
  readonly deployment_ref: string;
  readonly deployment_class: "development_cut" | "released_product";
  readonly product_name: "odd_world_model";
  readonly product_version: string;
  readonly source_ref: string;
  readonly source_state: "clean" | "dirty";
  readonly package_artifact: DeploymentArtifact;
  readonly storage_artifact: DeploymentArtifact;
  readonly artifact_base_locator: string;
  readonly installed_product_digest: Sha256Digest;
  readonly installed_storage_package_digest: Sha256Digest;
  readonly installed_entrypoint: string;
  readonly storage_python: string;
  readonly installed_storage_package_path: string;
  readonly protocol_version: typeof SANDBOX_PROTOCOL_VERSION;
  readonly dependencies: readonly DeploymentDependency[];
  readonly capabilities: Readonly<{
    native_graph_payload_execution: boolean;
    calibrated_fp_authorship: boolean;
    replay_native_semantic_projection: boolean;
    reference_kernel: boolean;
  }>;
  readonly created_at: string;
  readonly manifest_digest: Sha256Digest;
}

export interface SandboxBuildRequest {
  readonly schema_kind: "odd_world_model.sandbox_build_request";
  readonly schema_version: "v1";
  readonly protocol_version: typeof SANDBOX_PROTOCOL_VERSION;
  readonly instance_ref: string;
  readonly example_name: string;
  readonly source_root: string;
  readonly instance_root: string;
  readonly deployment_manifest_path: string;
  readonly observed_at: string;
  readonly request_digest: Sha256Digest;
}

export interface SourceInventoryEntry {
  readonly relative_path: string;
  readonly media_type: string;
  readonly byte_length: number;
  readonly sha256: Sha256Digest;
}

export interface SourceInventory {
  readonly schema_kind: "odd_world_model.source_inventory";
  readonly schema_version: "v1";
  readonly inventory_ref: string;
  readonly example_name: string;
  readonly entries: readonly SourceInventoryEntry[];
  readonly inventory_digest: Sha256Digest;
}

export interface SandboxArtifactBundle {
  readonly source_inventory: JsonObject;
  readonly source_observation: JsonObject;
  readonly candidate_markov_objects: readonly JsonObject[];
  readonly semantic_proposal: JsonObject;
  readonly deterministic_check: JsonObject;
  readonly acceptance_decision: JsonObject;
  readonly accepted_semantic_cut: JsonObject;
  readonly semantic_publication_candidate: JsonObject;
  readonly published_semantic_cut: JsonObject;
  readonly semantic_cut_attestation: JsonObject;
  readonly physical_effect_observation: JsonObject;
  readonly bounded_mesh_cut: JsonObject;
  readonly context_basis: JsonObject;
  readonly context_projection: JsonObject;
  readonly context_invocation: JsonObject;
  readonly world_model_query: JsonObject;
  readonly admission_witnesses: readonly JsonObject[];
  readonly runtime_events: readonly JsonObject[];
}

export interface SandboxBuildSuccess {
  readonly schema_kind: "odd_world_model.sandbox_build_result";
  readonly schema_version: "v1";
  readonly protocol_version: typeof SANDBOX_PROTOCOL_VERSION;
  readonly status: "built";
  readonly instance_ref: string;
  readonly example_name: string;
  readonly deployment_ref: string;
  readonly deployment_manifest_digest: Sha256Digest;
  readonly source_inventory_ref: string;
  readonly source_inventory_digest: Sha256Digest;
  readonly execution_mode: "installed_rc3_reference_kernel";
  readonly artifacts: SandboxArtifactBundle;
  readonly gaps: readonly TypedGap[];
  readonly built_at: string;
  readonly result_digest: Sha256Digest;
}

export interface SandboxBuildFailure {
  readonly schema_kind: "odd_world_model.sandbox_build_failure";
  readonly schema_version: "v1";
  readonly protocol_version: typeof SANDBOX_PROTOCOL_VERSION;
  readonly status: "failed";
  readonly instance_ref: string | null;
  readonly gap: TypedGap;
}

export type SandboxBuildResponse = SandboxBuildSuccess | SandboxBuildFailure;

function requireText(value: unknown, label: string): asserts value is string {
  if (typeof value !== "string" || value.length === 0) throw new Error(`${label} must be non-empty text`);
}

function requireTimestamp(value: string, label: string): void {
  if (Number.isNaN(Date.parse(value))) throw new Error(`${label} must be a timestamp`);
}

function requireAbsolutePath(value: string, label: string): void {
  requireText(value, label);
  if (!value.startsWith("/")) throw new Error(`${label} must be an absolute path`);
}

export async function directoryContentDigest(root: string): Promise<Sha256Digest> {
  const entries: Array<{
    readonly relative_path: string;
    readonly byte_length: number;
    readonly sha256: Sha256Digest;
  }> = [];
  async function walk(relative = ""): Promise<void> {
    const children = await readdir(path.join(root, relative), { withFileTypes: true });
    for (const child of children.sort((left, right) => left.name.localeCompare(right.name))) {
      const childRelative = path.join(relative, child.name);
      if (child.isDirectory()) await walk(childRelative);
      else if (child.isFile()) {
        const bytes = await readFile(path.join(root, childRelative));
        entries.push(Object.freeze({
          relative_path: childRelative.split(path.sep).join("/"),
          byte_length: bytes.byteLength,
          sha256: `sha256:${createHash("sha256").update(bytes).digest("hex")}`
        }));
      } else {
        throw new Error(`installed content contains unsupported filesystem entry ${childRelative}`);
      }
    }
  }
  await walk();
  return sha256Digest(entries);
}

export function createSandboxBuildRequest(
  input: Omit<SandboxBuildRequest, "request_digest">
): SandboxBuildRequest {
  assertSandboxBuildRequest({ ...input, request_digest: sha256Digest(input) });
  return Object.freeze({ ...input, request_digest: sha256Digest(input) });
}

export function assertSandboxBuildRequest(value: SandboxBuildRequest): void {
  if (value.schema_kind !== "odd_world_model.sandbox_build_request" || value.schema_version !== "v1") {
    throw new Error("unsupported sandbox build request schema");
  }
  if (value.protocol_version !== SANDBOX_PROTOCOL_VERSION) {
    throw new Error(`unsupported sandbox protocol ${String(value.protocol_version)}`);
  }
  requireText(value.instance_ref, "instance_ref");
  requireText(value.example_name, "example_name");
  requireAbsolutePath(value.source_root, "source_root");
  requireAbsolutePath(value.instance_root, "instance_root");
  requireAbsolutePath(value.deployment_manifest_path, "deployment_manifest_path");
  requireTimestamp(value.observed_at, "observed_at");
  const { request_digest: recorded, ...digestInput } = value;
  const expected = sha256Digest(digestInput);
  if (recorded !== expected) throw new Error(`sandbox request digest mismatch: expected ${expected}`);
}

export function createDeploymentManifest(
  input: Omit<WorldModelDeploymentManifest, "manifest_digest">
): WorldModelDeploymentManifest {
  const manifest = Object.freeze({ ...input, manifest_digest: sha256Digest(input) });
  assertDeploymentManifest(manifest);
  return manifest;
}

export function assertDeploymentManifest(value: WorldModelDeploymentManifest): void {
  if (value.schema_kind !== "odd_world_model.deployment_manifest" || value.schema_version !== "v1") {
    throw new Error("unsupported deployment manifest schema");
  }
  if (value.protocol_version !== SANDBOX_PROTOCOL_VERSION) {
    throw new Error(`unsupported deployed sandbox protocol ${String(value.protocol_version)}`);
  }
  requireText(value.deployment_ref, "deployment_ref");
  requireText(value.product_version, "product_version");
  requireText(value.source_ref, "source_ref");
  requireText(value.artifact_base_locator, "artifact_base_locator");
  requireText(value.installed_entrypoint, "installed_entrypoint");
  requireText(value.storage_python, "storage_python");
  requireText(value.installed_storage_package_path, "installed_storage_package_path");
  requireTimestamp(value.created_at, "created_at");
  for (const artifact of [value.package_artifact, value.storage_artifact]) {
    requireText(artifact.relative_path, "deployment artifact path");
    if (!isSha256Digest(artifact.sha256)) throw new Error("deployment artifact digest must be sha256");
    if (!Number.isSafeInteger(artifact.byte_length) || artifact.byte_length < 1) {
      throw new Error("deployment artifact byte length must be positive");
    }
  }
  if (!isSha256Digest(value.installed_product_digest) || !isSha256Digest(value.installed_storage_package_digest)) {
    throw new Error("installed product digests must be sha256");
  }
  for (const dependency of value.dependencies) {
    requireText(dependency.package_name, "dependency package name");
    requireText(dependency.version, "dependency version");
    if (dependency.artifact_sha256 !== null && !isSha256Digest(dependency.artifact_sha256)) {
      throw new Error(`dependency ${dependency.package_name} digest must be sha256 or null`);
    }
  }
  const { manifest_digest: recorded, ...digestInput } = value;
  const expected = sha256Digest(digestInput);
  if (recorded !== expected) throw new Error(`deployment manifest digest mismatch: expected ${expected}`);
}

export function createSandboxBuildSuccess(
  input: Omit<SandboxBuildSuccess, "result_digest">
): SandboxBuildSuccess {
  return Object.freeze({ ...input, result_digest: sha256Digest(input) });
}

export function protocolFailure(error: unknown, instanceRef: string | null): SandboxBuildFailure {
  return Object.freeze({
    schema_kind: "odd_world_model.sandbox_build_failure",
    schema_version: "v1",
    protocol_version: SANDBOX_PROTOCOL_VERSION,
    status: "failed",
    instance_ref: instanceRef,
    gap: Object.freeze({
      gap_type: "sandbox_build_failed",
      message: error instanceof Error ? error.message : String(error),
      retryable: false,
      evidence_refs: Object.freeze([])
    })
  });
}
