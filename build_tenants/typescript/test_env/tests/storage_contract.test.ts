// Candidate evidence: REQ-ODD-WORLD-MODEL-BUILD-CONSTRAINT-001..006
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import {
  buildPhysicalCutWriteRequest,
  decodeProtocolError,
  decodeVerifyResult,
  decodeWriteResult,
  encodeStorageRequest,
  PythonPhysicalCutStore,
  sha256Digest,
  validateSemanticCutAttestation,
  type PhysicalCutWritePlan
} from "../../code/src/index.ts";
import { loadCommonSchemaValidator } from "./support/common_schema_validator.ts";
import {
  acceptedCutFixtureBundle,
  admissionWitnessFixture
} from "./support/semantic_fixtures.ts";

const testDir = path.dirname(fileURLToPath(import.meta.url));
const tenantRoot = path.resolve(testDir, "../..");
const storageTenant = path.resolve(tenantRoot, "../storage/python");
const storagePython = path.join(storageTenant, ".venv/bin/python");
const schemaRoot = path.resolve(tenantRoot, "../common/schemas");

function plan(interactionGoal = "prove the cross-language effect boundary"): PhysicalCutWritePlan {
  const { acceptedCut, acceptanceAdmission } = acceptedCutFixtureBundle(
    "semantic-cut:typescript-contract:v1"
  );
  return {
    write_request_id: "write:typescript-contract-001",
    storage_profile_ref: "local-pyiceberg-v1",
    accepted_cut: acceptedCut,
    acceptance_admission: acceptanceAdmission,
    tables: [
      {
        table_identifier: "wm.context_bases",
        records: [
          {
            record_id: "context-basis:typescript-contract",
            record_kind: "context_basis",
            payload: {
              basis_ref: "context-basis:typescript-contract",
              interaction_goal: interactionGoal
            }
          }
        ]
      }
    ]
  };
}

function request() {
  return buildPhysicalCutWriteRequest(plan());
}

function storageEnvironment(runtimeRoot: string, catalogName: string) {
  return {
    OWM_ICEBERG_CATALOG_NAME: catalogName,
    OWM_ICEBERG_CATALOG_URI: `sqlite:///${path.join(runtimeRoot, "catalog.db")}`,
    OWM_ICEBERG_WAREHOUSE_URI: `file://${path.join(runtimeRoot, "warehouse")}`,
    OWM_STORAGE_RECEIPT_ROOT: path.join(runtimeRoot, "receipts"),
    OWM_STORAGE_PROFILE_REF: "local-pyiceberg-v1"
  };
}

test("physical request fields are derived from accepted state and table identifiers fail closed", () => {
  const first = request();
  const second = request();
  assert.equal(first.request_digest, second.request_digest);
  assert.equal(first.admission_ref, plan().acceptance_admission.witness_ref);
  assert.equal(first.semantic_cut.semantic_cut_digest, plan().accepted_cut.accepted_cut_digest);
  assert.throws(() => buildPhysicalCutWriteRequest({
    ...plan(),
    tables: [{ ...plan().tables[0]!, table_identifier: "../../warehouse" }]
  }), /invalid table identifier/);
  assert.throws(() => buildPhysicalCutWriteRequest({
    ...plan(),
    acceptance_admission: admissionWitnessFixture(
      "admission-witness://typescript-contract/wrong",
      "acceptance_evidence",
      [{ ref: "wm-acceptance://wrong", digest: sha256Digest("wrong") }]
    )
  }), /does not identify the supplied acceptance admission/);
  assert.throws(() => buildPhysicalCutWriteRequest({
    ...plan(),
    accepted_cut: {
      ...plan().accepted_cut,
      source_refs: ["source://tampered-after-acceptance"]
    }
  }), /accepted cut digest mismatch/);
});

test("TypeScript request is accepted by Python and exact physical readback remains assurance-neutral", async () => {
  const ajv = await loadCommonSchemaValidator(schemaRoot);
  const writeRequest = request();
  const validateRequest = ajv.getSchema("odd_world_model.physical_cut_write_request.schema.json");
  assert.ok(validateRequest);
  assert.equal(validateRequest(writeRequest), true, JSON.stringify(validateRequest.errors));
  const runtimeRoot = mkdtempSync(path.join(os.tmpdir(), "odd-wm-ts-python-contract-"));
  const storageEnv = { ...process.env, ...storageEnvironment(runtimeRoot, "odd_world_model_contract_test") };
  const completed = spawnSync(storagePython, ["-m", "odd_world_model_storage"], {
    cwd: storageTenant,
    input: encodeStorageRequest(writeRequest),
    encoding: "utf8",
    env: storageEnv
  });
  assert.equal(completed.status, 0, completed.stderr);
  assert.equal(completed.stderr, "");
  const writeResponseLine = completed.stdout.trimEnd();
  const result = decodeWriteResult(writeResponseLine, writeRequest);
  assert.throws(() => decodeWriteResult(writeResponseLine, {
    ...writeRequest,
    write_request_id: "write:different-request"
  }), /does not correlate/);
  const validateResult = ajv.getSchema("odd_world_model.physical_cut_write_result.schema.json");
  assert.ok(validateResult);
  assert.equal(validateResult(result), true, JSON.stringify(validateResult.errors));
  if (result.effect_status === "failed") assert.fail(result.gap.message);
  validateSemanticCutAttestation(result.attestation);
  assert.equal("verification" in result.attestation, false);
  assert.equal(result.effect_observation.observation_status, "reproduced");
  assert.equal(result.effect_observation.subject_attestation_digest, result.attestation.attestation_digest);

  const verifyRequest = {
    schema_kind: "odd_world_model.physical_cut_verify_request" as const,
    schema_version: "v1" as const,
    operation: "verify_cut" as const,
    verification_request_id: "verify:typescript-contract-001",
    storage_profile_ref: "local-pyiceberg-v1",
    attestation: result.attestation
  };
  const verifyCompleted = spawnSync(storagePython, ["-m", "odd_world_model_storage"], {
    cwd: storageTenant,
    input: encodeStorageRequest(verifyRequest),
    encoding: "utf8",
    env: storageEnv
  });
  assert.equal(verifyCompleted.status, 0, verifyCompleted.stderr);
  const verifyResponseLine = verifyCompleted.stdout.trimEnd();
  assert.equal(decodeVerifyResult(verifyResponseLine, verifyRequest).effect_observation.observation_status, "reproduced");
  assert.throws(() => decodeVerifyResult(verifyResponseLine, {
    ...verifyRequest,
    verification_request_id: "verify:different-request"
  }), /does not correlate/);
  assert.throws(() => decodeVerifyResult(verifyResponseLine, {
    ...verifyRequest,
    attestation: {
      ...verifyRequest.attestation,
      attestation_id: "attestation:different-request"
    }
  }), /different attestation/);
});

test("Python verifies a digest over the received shape when optional protocol fields are omitted", () => {
  const original = request();
  const { request_digest: ignoredDigest, ...requestInput } = original;
  const {
    graph_invocation_ref: ignoredGraphInvocation,
    temporal_coordinates: ignoredTemporalCoordinates,
    ...semanticCut
  } = original.semantic_cut;
  void ignoredDigest;
  void ignoredGraphInvocation;
  void ignoredTemporalCoordinates;
  const omittedInput = {
    ...requestInput,
    write_request_id: "write:typescript-omitted-optionals-001",
    semantic_cut: {
      ...semanticCut,
      semantic_cut_ref: "semantic-cut:typescript-omitted-optionals:v1",
      semantic_cut_digest: sha256Digest({ cut: "typescript-omitted-optionals", version: "v1" })
    }
  };
  const omitted = { ...omittedInput, request_digest: sha256Digest(omittedInput) };
  const runtimeRoot = mkdtempSync(path.join(os.tmpdir(), "odd-wm-ts-omitted-optionals-"));
  const completed = spawnSync(storagePython, ["-m", "odd_world_model_storage"], {
    cwd: storageTenant,
    input: encodeStorageRequest(omitted),
    encoding: "utf8",
    env: { ...process.env, ...storageEnvironment(runtimeRoot, "odd_world_model_omitted_optionals_test") }
  });
  assert.equal(completed.status, 0, completed.stderr);
  const result = decodeWriteResult(completed.stdout.trimEnd());
  assert.equal(result.effect_status, "written");
  assert.equal(result.request_digest, omitted.request_digest);
});

test("response decoder rejects framing, malformed failures, and tampered attestations", () => {
  assert.throws(() => decodeWriteResult("{}\n{}"), /one JSON line/);
  const runtimeRoot = mkdtempSync(path.join(os.tmpdir(), "odd-wm-ts-tamper-"));
  const completed = spawnSync(storagePython, ["-m", "odd_world_model_storage"], {
    cwd: storageTenant,
    input: encodeStorageRequest(request()),
    encoding: "utf8",
    env: { ...process.env, ...storageEnvironment(runtimeRoot, "odd_world_model_tamper_test") }
  });
  const parsed = JSON.parse(completed.stdout) as Record<string, any>;
  parsed.attestation.snapshots[0].snapshot_id = "1";
  assert.throws(() => decodeWriteResult(JSON.stringify(parsed)), /attestation_digest mismatch/);
  const failure = {
    schema_kind: "odd_world_model.physical_cut_write_result",
    schema_version: "v1",
    operation: "write_cut",
    effect_status: "failed",
    write_request_id: "write:malformed-failure",
    completed_at: "2026-07-12T00:00:00Z",
    completed_snapshots: []
  };
  assert.throws(() => decodeWriteResult(JSON.stringify(failure)), /gap is required/);
  assert.throws(() => decodeProtocolError(JSON.stringify({
    schema_kind: "odd_world_model.physical_cut_protocol_error",
    schema_version: "v1",
    operation: "protocol",
    effect_status: "failed",
    completed_at: "2026-07-12T00:00:00Z",
    gap: {
      gap_type: "malformed",
      message: "wrong retryability type",
      retryable: "false",
      evidence_refs: []
    }
  })), /retryable must be boolean/);
});

test("Python adapter carries typed configuration and idempotency failures across exit code 2", async () => {
  const invalidStore = new PythonPhysicalCutStore({
    pythonExecutable: storagePython,
    moduleRoot: storageTenant,
    environment: {
      OWM_ICEBERG_CATALOG_NAME: "",
      OWM_ICEBERG_CATALOG_URI: "",
      OWM_ICEBERG_WAREHOUSE_URI: "",
      OWM_STORAGE_RECEIPT_ROOT: ""
    }
  });
  const configurationFailure = await invalidStore.writeCut(plan());
  assert.equal(configurationFailure.effect_status, "failed");
  assert.equal(configurationFailure.gap.gap_type, "storage_configuration_invalid");

  const runtimeRoot = mkdtempSync(path.join(os.tmpdir(), "odd-wm-ts-idempotency-conflict-"));
  const store = new PythonPhysicalCutStore({
    pythonExecutable: storagePython,
    moduleRoot: storageTenant,
    environment: storageEnvironment(runtimeRoot, "odd_world_model_idempotency_conflict_test")
  });
  const initialPlan = plan();
  const changedPlan = plan("changed after the first effect");
  const first = await store.writeCut(initialPlan);
  const conflict = await store.writeCut(changedPlan);
  assert.equal(first.effect_status, "written");
  assert.notEqual(
    buildPhysicalCutWriteRequest(changedPlan).request_digest,
    buildPhysicalCutWriteRequest(initialPlan).request_digest
  );
  assert.equal(conflict.effect_status, "failed");
  assert.equal(conflict.gap.gap_type, "idempotency_conflict");
});
