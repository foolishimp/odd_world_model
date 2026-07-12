import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import type { JsonObject, JsonValue } from "../../code/src/domain/types.ts";

export const PUBLISHED_AT = "2026-04-20T00:00:00Z";

export const PROGRAM_STEPS = [
  "trace_source_observations",
  "assure_attribute_claims",
  "materialize_attribute_ledger",
  "project_markov_object_cut",
  "publish_domain_artifact",
  "compose_world_model",
  "project_query_surface"
] as const;

export type ProgramStep = (typeof PROGRAM_STEPS)[number];

export async function readJsonObject(filePath: string): Promise<JsonObject> {
  const raw = JSON.parse(await readFile(filePath, "utf8"));
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    throw new Error(`${filePath} must contain a JSON object`);
  }
  return raw as JsonObject;
}

export async function writeJson(filePath: string, payload: JsonObject): Promise<void> {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
}

export async function writeText(filePath: string, payload: string): Promise<void> {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, payload, "utf8");
}

export async function removeIfExists(filePath: string): Promise<void> {
  await rm(filePath, { force: true, recursive: true });
}

export function slug(value: string): string {
  const normalized = value.replace(/[^a-zA-Z0-9]+/g, "_").replace(/^_+|_+$/g, "").toLowerCase();
  return normalized || "value";
}

export function camel(value: string): string {
  const parts = value.split(/[^a-zA-Z0-9]+/).filter(Boolean);
  return parts.map((part) => `${part.slice(0, 1).toUpperCase()}${part.slice(1)}`).join("") || "DomainObject";
}

export function claimKind(key: string): "identity" | "state" | "attribute" {
  if (key.endsWith("_id")) return "identity";
  if (key.endsWith("_state")) return "state";
  return "attribute";
}

export function scalarClaims(payload: JsonObject): Array<[string, JsonValue]> {
  const claims: Array<[string, JsonValue]> = [];
  for (const [key, value] of Object.entries(payload)) {
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
      claims.push([key, value]);
    }
  }
  return claims;
}

export function relativeTo(fromRoot: string, targetPath: string): string {
  return path.relative(path.resolve(fromRoot), path.resolve(targetPath)).split(path.sep).join("/");
}

export function asString(value: JsonValue | undefined, label: string): string {
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`${label} must be a non-empty string`);
  }
  return value;
}

export function asObject(value: JsonValue | undefined, label: string): JsonObject {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${label} must be a JSON object`);
  }
  return value as JsonObject;
}

export function jsonArrayOfStrings(value: JsonValue | undefined): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((entry): entry is string => typeof entry === "string" && entry.length > 0);
}

export function nowRunStamp(): string {
  return new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}
