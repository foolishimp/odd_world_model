import { isSha256Digest } from "./canonical.ts";
import type { ExactRef } from "./semantic_memory.ts";

export function requireText(value: string, label: string): void {
  if (value.length === 0) throw new Error(`${label} must be non-empty`);
}

export function exactRefKey(value: ExactRef): string {
  return `${value.ref}\u0000${value.digest}\u0000${value.version ?? ""}`;
}

export function assertExactRef(value: ExactRef, label: string): void {
  requireText(value.ref, `${label}.ref`);
  if (!isSha256Digest(value.digest)) throw new Error(`${label}.digest is not sha256`);
  if (value.version !== undefined) requireText(value.version, `${label}.version`);
}

export function assertUniqueExactRefs(values: readonly ExactRef[], label: string): void {
  const seen = new Set<string>();
  values.forEach((value, index) => {
    assertExactRef(value, `${label}[${index}]`);
    if (seen.has(value.ref)) throw new Error(`${label} repeats ref ${value.ref}`);
    seen.add(value.ref);
  });
}

export function normalizeExactRefs(values: readonly ExactRef[], label: string): readonly ExactRef[] {
  const byRef = new Map<string, ExactRef>();
  values.forEach((value, index) => {
    assertExactRef(value, `${label}[${index}]`);
    const existing = byRef.get(value.ref);
    if (existing !== undefined && exactRefKey(existing) !== exactRefKey(value)) {
      throw new Error(`${label} gives ${value.ref} more than one exact identity`);
    }
    if (existing === undefined) byRef.set(value.ref, value);
  });
  return Object.freeze([...byRef.values()]);
}

export function assertUniqueStrings(values: readonly string[], label: string): void {
  const seen = new Set<string>();
  values.forEach((value, index) => {
    requireText(value, `${label}[${index}]`);
    if (seen.has(value)) throw new Error(`${label} repeats ${value}`);
    seen.add(value);
  });
}
