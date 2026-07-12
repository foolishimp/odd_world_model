import { createHash } from "node:crypto";
import { canonicalizeEx } from "json-canonicalize";

function assertCanonicalJsonValue(value: unknown, path = "$"): void {
  if (value === null || typeof value === "string" || typeof value === "boolean") return;
  if (typeof value === "number") {
    if (!Number.isFinite(value)) throw new Error(`${path} contains a non-finite number`);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      if (item === undefined) throw new Error(`${path}[${index}] is undefined`);
      assertCanonicalJsonValue(item, `${path}[${index}]`);
    });
    return;
  }
  if (typeof value === "object") {
    for (const [key, item] of Object.entries(value)) {
      if (item === undefined) throw new Error(`${path}.${key} is undefined`);
      assertCanonicalJsonValue(item, `${path}.${key}`);
    }
    return;
  }
  throw new Error(`${path} is not an I-JSON value`);
}

export function canonicalJson(value: unknown): string {
  assertCanonicalJsonValue(value);
  return canonicalizeEx(value, {
    allowCircular: false,
    filterUndefined: false,
    undefinedInArrayToNull: false
  });
}

export function sha256Digest(value: unknown): `sha256:${string}` {
  return `sha256:${createHash("sha256").update(canonicalJson(value), "utf8").digest("hex")}`;
}

export function isSha256Digest(value: string): value is `sha256:${string}` {
  return /^sha256:[0-9a-f]{64}$/.test(value);
}
