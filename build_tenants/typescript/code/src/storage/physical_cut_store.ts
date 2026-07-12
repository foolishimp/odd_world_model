import { canonicalJson, isSha256Digest, sha256Digest } from "../domain/canonical.ts";
import { exactRefKey } from "../domain/exact_refs.ts";
import {
  assertAcceptedSemanticCutAuthority,
  assertReplayDerivedAdmissionWitness,
  exactRefForAdmissionWitness,
  type AbgAdmissionWitness,
  type AcceptedSemanticCut
} from "../domain/semantic_publication.ts";
import type { Fidelity, Sha256Digest, TypedGap } from "../domain/semantic_memory.ts";
import type { JsonObject } from "../domain/types.ts";

export interface PhysicalRecord {
  readonly record_id: string;
  readonly record_kind: string;
  readonly payload: JsonObject;
}

export interface PhysicalTableWrite {
  readonly table_identifier: string;
  readonly records: readonly PhysicalRecord[];
}

export interface SemanticCutWrite {
  readonly semantic_cut_ref: string;
  readonly semantic_cut_digest: Sha256Digest;
  readonly cut_role: string;
  readonly cut_version: string;
  readonly governing_refs: readonly string[];
  readonly source_refs: readonly string[];
  readonly authority_refs: readonly string[];
  readonly graph_invocation_ref?: string;
  readonly abg_event_refs: readonly string[];
  readonly dependency_identities: readonly string[];
  readonly temporal_coordinates?: Readonly<Record<string, string>>;
  readonly fidelity: Fidelity;
  readonly losses: readonly string[];
  readonly exclusions: readonly string[];
  readonly gap_refs: readonly string[];
}

export interface PhysicalCutWriteRequest {
  readonly schema_kind: "odd_world_model.physical_cut_write_request";
  readonly schema_version: "v1";
  readonly operation: "write_cut";
  readonly write_request_id: string;
  readonly request_digest: Sha256Digest;
  readonly admission_ref: string;
  readonly storage_profile_ref: string;
  readonly semantic_cut: SemanticCutWrite;
  readonly tables: readonly PhysicalTableWrite[];
  readonly admitted_at: string;
}

export interface PhysicalCutWritePlan {
  readonly write_request_id: string;
  readonly storage_profile_ref: string;
  readonly accepted_cut: AcceptedSemanticCut;
  readonly acceptance_admission: AbgAdmissionWitness;
  readonly tables: readonly PhysicalTableWrite[];
}

export interface SnapshotBinding {
  readonly table_identifier: string;
  readonly snapshot_id: string;
  readonly metadata_location: string;
  readonly schema_fingerprint: Sha256Digest;
  readonly payload_digest: Sha256Digest;
  readonly record_count: number;
}

export interface SemanticCutAttestation {
  readonly schema_kind: "odd_world_model.semantic_cut_attestation";
  readonly schema_version: "v1";
  readonly attestation_id: string;
  readonly write_request_id: string;
  readonly request_digest: Sha256Digest;
  readonly semantic_cut_ref: string;
  readonly semantic_cut_digest: Sha256Digest;
  readonly cut_role: string;
  readonly cut_version: string;
  readonly snapshots: readonly SnapshotBinding[];
  readonly governing_refs: readonly string[];
  readonly source_refs: readonly string[];
  readonly authority_refs: readonly string[];
  readonly graph_invocation_ref?: string;
  readonly abg_event_refs: readonly string[];
  readonly dependency_identities: readonly string[];
  readonly temporal_coordinates?: Readonly<Record<string, string>>;
  readonly fidelity: Fidelity;
  readonly losses: readonly string[];
  readonly exclusions: readonly string[];
  readonly gap_refs: readonly string[];
  readonly created_at: string;
  readonly attestation_digest: Sha256Digest;
}

export interface SnapshotEffectObservation {
  readonly table_identifier: string;
  readonly snapshot_id: string;
  readonly status: "reproduced" | "failed";
  readonly message?: string;
}

export interface PhysicalEffectObservation {
  readonly schema_kind: "odd_world_model.physical_effect_observation";
  readonly schema_version: "v1";
  readonly observation_status: "reproduced" | "failed";
  readonly observed_at: string;
  readonly observer_identity: string;
  readonly subject_attestation_id?: string;
  readonly subject_attestation_digest?: Sha256Digest;
  readonly snapshot_observations: readonly SnapshotEffectObservation[];
}

export interface PhysicalCutWriteSuccess {
  readonly schema_kind: "odd_world_model.physical_cut_write_result";
  readonly schema_version: "v1";
  readonly operation: "write_cut";
  readonly effect_status: "written" | "idempotent";
  readonly write_request_id: string;
  readonly request_digest: Sha256Digest;
  readonly completed_at: string;
  readonly attestation: SemanticCutAttestation;
  readonly effect_observation: PhysicalEffectObservation;
}

export interface PhysicalCutWriteFailure {
  readonly schema_kind: "odd_world_model.physical_cut_write_result";
  readonly schema_version: "v1";
  readonly operation: "write_cut";
  readonly effect_status: "failed";
  readonly write_request_id: string;
  readonly request_digest?: Sha256Digest;
  readonly completed_at: string;
  readonly gap: TypedGap;
  readonly completed_snapshots: readonly SnapshotBinding[];
  readonly effect_observation?: PhysicalEffectObservation;
}

export type PhysicalCutWriteResult = PhysicalCutWriteSuccess | PhysicalCutWriteFailure;

export interface PhysicalCutVerifyRequest {
  readonly schema_kind: "odd_world_model.physical_cut_verify_request";
  readonly schema_version: "v1";
  readonly operation: "verify_cut";
  readonly verification_request_id: string;
  readonly storage_profile_ref: string;
  readonly attestation: SemanticCutAttestation;
}

export interface PhysicalCutVerifyResult {
  readonly schema_kind: "odd_world_model.physical_cut_verify_result";
  readonly schema_version: "v1";
  readonly operation: "verify_cut";
  readonly verification_request_id: string;
  readonly effect_observation: PhysicalEffectObservation;
  readonly gap?: TypedGap;
}

export interface PhysicalCutProtocolError {
  readonly schema_kind: "odd_world_model.physical_cut_protocol_error";
  readonly schema_version: "v1";
  readonly operation: "protocol";
  readonly effect_status: "failed";
  readonly correlation_id?: string;
  readonly completed_at: string;
  readonly gap: TypedGap;
}

export interface PhysicalCutStore {
  writeCut(plan: PhysicalCutWritePlan): Promise<PhysicalCutWriteResult>;
  verifyCut(request: PhysicalCutVerifyRequest): Promise<PhysicalCutVerifyResult>;
}

const tableIdentifier = /^[a-z][a-z0-9_]*\.[a-z][a-z0-9_]*$/;
const rfc3339Timestamp = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/;
type UnknownRecord = Record<string, unknown>;

function requireRecord(value: unknown, label: string): UnknownRecord {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${label} must be an object`);
  }
  return value as UnknownRecord;
}

function requireExactKeys(
  value: UnknownRecord,
  required: readonly string[],
  optional: readonly string[],
  label: string
): void {
  const allowed = new Set([...required, ...optional]);
  for (const key of required) {
    if (!(key in value)) throw new Error(`${label}.${key} is required`);
  }
  for (const key of Object.keys(value)) {
    if (!allowed.has(key)) throw new Error(`${label}.${key} is not supported`);
  }
}

function requireString(value: unknown, label: string, allowEmpty = false): string {
  if (typeof value !== "string" || (!allowEmpty && value.length === 0)) {
    throw new Error(`${label} must be ${allowEmpty ? "a string" : "a non-empty string"}`);
  }
  return value;
}

function requireDigest(value: unknown, label: string): Sha256Digest {
  if (typeof value !== "string" || !isSha256Digest(value)) {
    throw new Error(`${label} must be a lowercase sha256 digest`);
  }
  return value;
}

function requireTimestamp(value: unknown, label: string): string {
  const timestamp = requireString(value, label);
  if (!rfc3339Timestamp.test(timestamp) || Number.isNaN(Date.parse(timestamp))) {
    throw new Error(`${label} must be an RFC 3339 timestamp`);
  }
  return timestamp;
}

function requireStringArray(value: unknown, label: string): readonly string[] {
  if (!Array.isArray(value)) throw new Error(`${label} must be an array`);
  const strings = value.map((item, index) => requireString(item, `${label}[${index}]`));
  requireUnique(strings, label);
  return strings;
}

function requireStringMap(value: unknown, label: string): void {
  const record = requireRecord(value, label);
  for (const [key, item] of Object.entries(record)) {
    requireString(key, `${label} key`);
    requireString(item, `${label}.${key}`);
  }
}

function validateTypedGap(value: unknown, label: string): TypedGap {
  const gap = requireRecord(value, label);
  requireExactKeys(gap, ["gap_type", "message", "retryable", "evidence_refs"], ["details"], label);
  requireString(gap.gap_type, `${label}.gap_type`);
  requireString(gap.message, `${label}.message`);
  if (typeof gap.retryable !== "boolean") throw new Error(`${label}.retryable must be boolean`);
  requireStringArray(gap.evidence_refs, `${label}.evidence_refs`);
  if (gap.details !== undefined) requireRecord(gap.details, `${label}.details`);
  return gap as unknown as TypedGap;
}

function validateSnapshotBinding(value: unknown, label: string): SnapshotBinding {
  const snapshot = requireRecord(value, label);
  requireExactKeys(
    snapshot,
    [
      "table_identifier",
      "snapshot_id",
      "metadata_location",
      "schema_fingerprint",
      "payload_digest",
      "record_count"
    ],
    [],
    label
  );
  const identifier = requireString(snapshot.table_identifier, `${label}.table_identifier`);
  if (!tableIdentifier.test(identifier)) throw new Error(`${label}.table_identifier is invalid`);
  const snapshotId = requireString(snapshot.snapshot_id, `${label}.snapshot_id`);
  if (!/^[0-9]+$/.test(snapshotId)) throw new Error(`${label}.snapshot_id must be a decimal string`);
  requireString(snapshot.metadata_location, `${label}.metadata_location`);
  requireDigest(snapshot.schema_fingerprint, `${label}.schema_fingerprint`);
  requireDigest(snapshot.payload_digest, `${label}.payload_digest`);
  if (!Number.isSafeInteger(snapshot.record_count) || Number(snapshot.record_count) < 1) {
    throw new Error(`${label}.record_count must be a positive safe integer`);
  }
  return snapshot as unknown as SnapshotBinding;
}

function validateSnapshotBindings(value: unknown, label: string, allowEmpty: boolean): readonly SnapshotBinding[] {
  if (!Array.isArray(value) || (!allowEmpty && value.length === 0)) {
    throw new Error(`${label} must be ${allowEmpty ? "an array" : "a non-empty array"}`);
  }
  const snapshots = value.map((item, index) => validateSnapshotBinding(item, `${label}[${index}]`));
  requireUnique(snapshots.map((item) => item.table_identifier), `${label} table identifiers`);
  return snapshots;
}

function requireUnique(values: readonly string[], label: string): void {
  if (new Set(values).size !== values.length) throw new Error(`${label} must be unique`);
  if (values.some((value) => value.length === 0)) throw new Error(`${label} must be non-empty`);
}

export function buildPhysicalCutWriteRequest(
  plan: PhysicalCutWritePlan
): PhysicalCutWriteRequest {
  requireString(plan.write_request_id, "write_request_id");
  requireString(plan.storage_profile_ref, "storage_profile_ref");
  assertAcceptedSemanticCutAuthority(plan.accepted_cut);
  assertReplayDerivedAdmissionWitness(plan.acceptance_admission);
  if (plan.acceptance_admission.admission_kind !== "acceptance_evidence") {
    throw new Error("physical write requires acceptance-evidence admission");
  }
  if (
    exactRefKey(exactRefForAdmissionWitness(plan.acceptance_admission)) !==
    exactRefKey(plan.accepted_cut.acceptance_admission)
  ) {
    throw new Error("accepted cut does not identify the supplied acceptance admission");
  }
  const graphInvocationRef = plan.acceptance_admission.graph_call_refs[0];
  if (graphInvocationRef === undefined) throw new Error("acceptance admission has no graph call ref");
  if (plan.tables.length === 0) throw new Error("tables must not be empty");
  requireUnique(plan.tables.map((table) => table.table_identifier), "table identifiers");
  for (const table of plan.tables) {
    if (!tableIdentifier.test(table.table_identifier)) {
      throw new Error(`invalid table identifier ${table.table_identifier}`);
    }
    if (table.records.length === 0) throw new Error(`${table.table_identifier} has no records`);
    requireUnique(table.records.map((record) => record.record_id), `${table.table_identifier} record ids`);
  }
  const semanticCut: SemanticCutWrite = {
    semantic_cut_ref: plan.accepted_cut.semantic_cut_ref,
    semantic_cut_digest: plan.accepted_cut.accepted_cut_digest,
    cut_role: plan.accepted_cut.cut_role,
    cut_version: plan.accepted_cut.cut_version,
    governing_refs: plan.accepted_cut.governing_refs,
    source_refs: plan.accepted_cut.source_refs,
    authority_refs: plan.accepted_cut.authority_refs,
    graph_invocation_ref: graphInvocationRef,
    abg_event_refs: plan.acceptance_admission.runtime_event_refs,
    dependency_identities: plan.accepted_cut.dependency_identities,
    temporal_coordinates: plan.accepted_cut.temporal_coordinates,
    fidelity: plan.accepted_cut.fidelity,
    losses: plan.accepted_cut.losses,
    exclusions: plan.accepted_cut.exclusions,
    gap_refs: plan.accepted_cut.gaps.map((gap) => `typed-gap:${sha256Digest(gap)}`)
  };
  const requestInput = {
    schema_kind: "odd_world_model.physical_cut_write_request" as const,
    schema_version: "v1" as const,
    operation: "write_cut" as const,
    write_request_id: plan.write_request_id,
    admission_ref: plan.acceptance_admission.witness_ref,
    storage_profile_ref: plan.storage_profile_ref,
    semantic_cut: semanticCut,
    tables: plan.tables,
    admitted_at: plan.accepted_cut.accepted_at
  };
  return { ...requestInput, request_digest: sha256Digest(requestInput) };
}

export function validateSemanticCutAttestation(
  attestation: unknown
): asserts attestation is SemanticCutAttestation {
  const value = requireRecord(attestation, "attestation");
  const required = [
    "schema_kind", "schema_version", "attestation_id", "write_request_id", "request_digest",
    "semantic_cut_ref", "semantic_cut_digest", "cut_role", "cut_version", "snapshots",
    "governing_refs", "source_refs", "authority_refs", "abg_event_refs", "dependency_identities",
    "fidelity", "losses", "exclusions", "gap_refs", "created_at", "attestation_digest"
  ];
  requireExactKeys(value, required, ["graph_invocation_ref", "temporal_coordinates"], "attestation");
  if (value.schema_kind !== "odd_world_model.semantic_cut_attestation" || value.schema_version !== "v1") {
    throw new Error("attestation is not a v1 semantic cut attestation");
  }
  for (const key of [
    "attestation_id", "write_request_id", "semantic_cut_ref", "cut_role", "cut_version"
  ]) requireString(value[key], `attestation.${key}`);
  requireTimestamp(value.created_at, "attestation.created_at");
  requireDigest(value.request_digest, "attestation.request_digest");
  requireDigest(value.semantic_cut_digest, "attestation.semantic_cut_digest");
  validateSnapshotBindings(value.snapshots, "attestation.snapshots", false);
  for (const key of [
    "governing_refs", "source_refs", "authority_refs", "abg_event_refs", "dependency_identities",
    "losses", "exclusions", "gap_refs"
  ]) requireStringArray(value[key], `attestation.${key}`);
  if (!["exact_payload", "lossless_projection", "lossy_projection"].includes(String(value.fidelity))) {
    throw new Error("attestation.fidelity is invalid");
  }
  if (value.graph_invocation_ref !== undefined) {
    requireString(value.graph_invocation_ref, "attestation.graph_invocation_ref");
  }
  if (value.temporal_coordinates !== undefined) {
    requireStringMap(value.temporal_coordinates, "attestation.temporal_coordinates");
  }
  requireDigest(value.attestation_digest, "attestation.attestation_digest");
  const digestInput = { ...value };
  delete digestInput.attestation_digest;
  const expected = sha256Digest(digestInput);
  if (value.attestation_digest !== expected) {
    throw new Error(`attestation_digest mismatch: expected ${expected}`);
  }
}

export function validatePhysicalEffectObservation(
  observation: unknown
): asserts observation is PhysicalEffectObservation {
  const value = requireRecord(observation, "effect observation");
  requireExactKeys(
    value,
    [
      "schema_kind",
      "schema_version",
      "observation_status",
      "observed_at",
      "observer_identity",
      "snapshot_observations"
    ],
    ["subject_attestation_id", "subject_attestation_digest"],
    "effect observation"
  );
  if (
    value.schema_kind !== "odd_world_model.physical_effect_observation" ||
    value.schema_version !== "v1" ||
    (value.observation_status !== "reproduced" && value.observation_status !== "failed")
  ) throw new Error("effect observation is not a v1 physical effect observation");
  requireTimestamp(value.observed_at, "effect observation.observed_at");
  requireString(value.observer_identity, "effect observation.observer_identity");
  const hasSubjectId = value.subject_attestation_id !== undefined;
  const hasSubjectDigest = value.subject_attestation_digest !== undefined;
  if (hasSubjectId !== hasSubjectDigest) {
    throw new Error("effect observation subject identity must be complete");
  }
  if (hasSubjectId) {
    requireString(value.subject_attestation_id, "effect observation.subject_attestation_id");
    requireDigest(value.subject_attestation_digest, "effect observation.subject_attestation_digest");
  }
  if (!Array.isArray(value.snapshot_observations)) {
    throw new Error("effect observation.snapshot_observations must be an array");
  }
  const identities: string[] = [];
  const statuses: string[] = [];
  for (const [index, item] of value.snapshot_observations.entries()) {
    const result = requireRecord(item, `effect observation.snapshot_observations[${index}]`);
    requireExactKeys(
      result,
      ["table_identifier", "snapshot_id", "status"],
      ["message"],
      `effect observation.snapshot_observations[${index}]`
    );
    const identifier = requireString(
      result.table_identifier,
      `effect observation.snapshot_observations[${index}].table_identifier`
    );
    if (!tableIdentifier.test(identifier)) throw new Error("effect observation table_identifier is invalid");
    const snapshotId = requireString(
      result.snapshot_id,
      `effect observation.snapshot_observations[${index}].snapshot_id`
    );
    if (!/^[0-9]+$/.test(snapshotId)) throw new Error("effect observation snapshot_id must be decimal");
    if (result.status !== "reproduced" && result.status !== "failed") {
      throw new Error("effect observation snapshot status is invalid");
    }
    if (result.message !== undefined) {
      requireString(result.message, `effect observation.snapshot_observations[${index}].message`, true);
    }
    identities.push(`${identifier}\u0000${snapshotId}`);
    statuses.push(result.status);
  }
  requireUnique(identities, "effect observation snapshot identities");
  if (statuses.length > 0 && !hasSubjectId) {
    throw new Error("snapshot observations require exact attestation subject identity");
  }
  if (
    value.observation_status === "reproduced" &&
    (statuses.length === 0 || statuses.some((status) => status !== "reproduced"))
  ) throw new Error("reproduced effect observation requires reproduced snapshot observations");
  if (
    value.observation_status === "failed" &&
    statuses.length > 0 &&
    !statuses.includes("failed")
  ) throw new Error("failed effect observation must contain a failed snapshot when non-empty");
}

function requireObservationClosesAttestation(
  observation: PhysicalEffectObservation,
  attestation: SemanticCutAttestation
): void {
  if (observation.observation_status !== "reproduced") {
    throw new Error("successful write requires reproduced physical-effect observation");
  }
  if (
    observation.subject_attestation_id !== attestation.attestation_id ||
    observation.subject_attestation_digest !== attestation.attestation_digest
  ) throw new Error("physical-effect observation identifies a different attestation");
  const attested = new Set(
    attestation.snapshots.map((item) => `${item.table_identifier}\u0000${item.snapshot_id}`)
  );
  const observed = new Set(
    observation.snapshot_observations.map((item) => `${item.table_identifier}\u0000${item.snapshot_id}`)
  );
  if (
    attested.size !== observed.size ||
    [...attested].some((identity) => !observed.has(identity))
  ) throw new Error("physical-effect observation does not close the attested snapshots");
}

export function encodeStorageRequest(
  request: PhysicalCutWriteRequest | PhysicalCutVerifyRequest
): string {
  return `${canonicalJson(request)}\n`;
}

export function decodeWriteResult(
  line: string,
  expectedRequest?: PhysicalCutWriteRequest
): PhysicalCutWriteResult {
  const value = parseStorageResponse(line);
  if (
    value.schema_kind !== "odd_world_model.physical_cut_write_result" ||
    value.schema_version !== "v1" ||
    value.operation !== "write_cut"
  ) {
    throw new Error("storage response is not a v1 physical write result");
  }
  if (value.effect_status === "written" || value.effect_status === "idempotent") {
    requireExactKeys(
      value,
      ["schema_kind", "schema_version", "operation", "effect_status", "write_request_id", "request_digest", "completed_at", "attestation", "effect_observation"],
      [],
      "write result"
    );
    requireString(value.write_request_id, "write result.write_request_id");
    requireDigest(value.request_digest, "write result.request_digest");
    requireTimestamp(value.completed_at, "write result.completed_at");
    validateSemanticCutAttestation(value.attestation);
    validatePhysicalEffectObservation(value.effect_observation);
    requireObservationClosesAttestation(value.effect_observation, value.attestation);
    if (
      value.write_request_id !== value.attestation.write_request_id ||
      value.request_digest !== value.attestation.request_digest
    ) throw new Error("write result and attestation identify different requests");
    const result = value as unknown as PhysicalCutWriteSuccess;
    if (expectedRequest !== undefined && (
      result.write_request_id !== expectedRequest.write_request_id ||
      result.request_digest !== expectedRequest.request_digest
    )) {
      throw new Error("write result does not correlate to the exact request");
    }
    return result;
  }
  if (value.effect_status === "failed") {
    requireExactKeys(
      value,
      ["schema_kind", "schema_version", "operation", "effect_status", "write_request_id", "completed_at", "gap", "completed_snapshots"],
      ["request_digest", "effect_observation"],
      "write failure"
    );
    requireString(value.write_request_id, "write failure.write_request_id", true);
    if (value.request_digest !== undefined) requireDigest(value.request_digest, "write failure.request_digest");
    requireTimestamp(value.completed_at, "write failure.completed_at");
    validateTypedGap(value.gap, "write failure.gap");
    validateSnapshotBindings(value.completed_snapshots, "write failure.completed_snapshots", true);
    if (value.effect_observation !== undefined) {
      validatePhysicalEffectObservation(value.effect_observation);
      if (value.effect_observation.observation_status !== "failed") {
        throw new Error("write failure effect observation must be failed");
      }
    }
    const result = value as unknown as PhysicalCutWriteFailure;
    if (expectedRequest !== undefined && (
      result.write_request_id !== expectedRequest.write_request_id ||
      (result.request_digest !== undefined && result.request_digest !== expectedRequest.request_digest)
    )) {
      throw new Error("write failure does not correlate to the exact request");
    }
    return result;
  }
  throw new Error("storage response has an unsupported effect status");
}

export function decodeVerifyResult(
  line: string,
  expectedRequest?: PhysicalCutVerifyRequest
): PhysicalCutVerifyResult {
  const value = parseStorageResponse(line);
  if (
    value.schema_kind !== "odd_world_model.physical_cut_verify_result" ||
    value.schema_version !== "v1" ||
    value.operation !== "verify_cut"
  ) {
    throw new Error("storage response is not a v1 physical verify result");
  }
  requireExactKeys(
    value,
    ["schema_kind", "schema_version", "operation", "verification_request_id", "effect_observation"],
    ["gap"],
    "verify result"
  );
  requireString(value.verification_request_id, "verify result.verification_request_id");
  validatePhysicalEffectObservation(value.effect_observation);
  if (value.effect_observation.observation_status === "failed") {
    if (value.gap === undefined) throw new Error("failed verify result requires a typed gap");
    validateTypedGap(value.gap, "verify result.gap");
  } else {
    if (value.gap !== undefined) throw new Error("reproduced result must not include a gap");
  }
  const result = value as unknown as PhysicalCutVerifyResult;
  if (expectedRequest !== undefined) {
    if (result.verification_request_id !== expectedRequest.verification_request_id) {
      throw new Error("verify result does not correlate to the exact request");
    }
    if (result.effect_observation.observation_status === "reproduced" && (
      result.effect_observation.subject_attestation_id !== expectedRequest.attestation.attestation_id ||
      result.effect_observation.subject_attestation_digest !== expectedRequest.attestation.attestation_digest
    )) {
      throw new Error("verify result observes a different attestation than the request");
    }
  }
  return result;
}

export function decodeProtocolError(line: string): PhysicalCutProtocolError {
  const value = parseStorageResponse(line);
  if (
    value.schema_kind !== "odd_world_model.physical_cut_protocol_error" ||
    value.schema_version !== "v1" ||
    value.operation !== "protocol" ||
    value.effect_status !== "failed"
  ) {
    throw new Error("storage response is not a v1 protocol error");
  }
  requireExactKeys(
    value,
    ["schema_kind", "schema_version", "operation", "effect_status", "completed_at", "gap"],
    ["correlation_id"],
    "protocol error"
  );
  requireTimestamp(value.completed_at, "protocol error.completed_at");
  if (value.correlation_id !== undefined) requireString(value.correlation_id, "protocol error.correlation_id", true);
  validateTypedGap(value.gap, "protocol error.gap");
  return value as unknown as PhysicalCutProtocolError;
}

function parseStorageResponse(line: string): UnknownRecord {
  if (line.includes("\n")) throw new Error("storage response must be one JSON line without embedded framing");
  const value: unknown = JSON.parse(line);
  return requireRecord(value, "storage response");
}
