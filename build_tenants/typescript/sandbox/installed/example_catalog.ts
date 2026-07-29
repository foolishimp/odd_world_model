import { createHash } from "node:crypto";
import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import {
  createCandidateMarkovObjectCut,
  exactRefForSourceObservation,
  parseFpmlTrade,
  sha256Digest,
  type CandidateMarkovObjectCut,
  type ExactRef,
  type SourceObservation
} from "../../code/src/index.ts";
import type { JsonObject, JsonValue } from "../../code/src/domain/types.ts";
import type { SourceInventory, SourceInventoryEntry } from "./protocol.ts";

interface CandidateEntity {
  readonly identity: string;
  readonly object_kind: string;
  readonly value: JsonObject;
}

export interface PreparedExample {
  readonly example_name: string;
  readonly source_kind: string;
  readonly authority_ref: string;
  readonly inventory: SourceInventory;
  readonly source_ref: ExactRef;
  readonly evidence_refs: readonly string[];
  readonly semantic_payload: JsonObject;
  readonly candidate_entities: readonly CandidateEntity[];
  readonly fidelity: "lossy_projection";
  readonly losses: readonly string[];
  readonly exclusions: readonly string[];
}

function asJsonObject(value: unknown, label: string): JsonObject {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${label} must be a JSON object`);
  }
  return JSON.parse(JSON.stringify(value)) as JsonObject;
}

async function readJsonObject(filePath: string): Promise<JsonObject> {
  return asJsonObject(JSON.parse(await readFile(filePath, "utf8")), filePath);
}

function mediaType(filePath: string): string {
  switch (path.extname(filePath).toLowerCase()) {
    case ".json": return "application/json";
    case ".jsonld": return "application/ld+json";
    case ".xml": return "application/xml";
    case ".html": return "text/html";
    case ".md": return "text/markdown";
    case ".pdf": return "application/pdf";
    default: return "application/octet-stream";
  }
}

async function sourceFiles(root: string, relative = ""): Promise<string[]> {
  const directory = path.join(root, relative);
  const entries = await readdir(directory, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries.sort((left, right) => left.name.localeCompare(right.name))) {
    const child = path.join(relative, entry.name);
    if (entry.isDirectory()) files.push(...await sourceFiles(root, child));
    else if (entry.isFile()) files.push(child);
  }
  return files;
}

async function buildInventory(exampleName: string, sourceRoot: string): Promise<SourceInventory> {
  const relativePaths = await sourceFiles(sourceRoot);
  if (relativePaths.length === 0) throw new Error(`${exampleName} source corpus is empty`);
  const entries: SourceInventoryEntry[] = [];
  for (const relativePath of relativePaths) {
    const filePath = path.join(sourceRoot, relativePath);
    const [bytes, fileStat] = await Promise.all([readFile(filePath), stat(filePath)]);
    entries.push(Object.freeze({
      relative_path: relativePath.split(path.sep).join("/"),
      media_type: mediaType(filePath),
      byte_length: fileStat.size,
      sha256: `sha256:${createHash("sha256").update(bytes).digest("hex")}`
    }));
  }
  const inventoryInput = {
    schema_kind: "odd_world_model.source_inventory" as const,
    schema_version: "v1" as const,
    inventory_ref: `source-inventory://odd_world_model/${exampleName}/v1`,
    example_name: exampleName,
    entries: Object.freeze(entries)
  };
  return Object.freeze({ ...inventoryInput, inventory_digest: sha256Digest(inventoryInput) });
}

function entity(identity: unknown, objectKind: string, value: unknown, label: string): CandidateEntity {
  if (typeof identity !== "string" || identity.length === 0) {
    throw new Error(`${label} has no stable identity`);
  }
  return Object.freeze({ identity, object_kind: objectKind, value: asJsonObject(value, label) });
}

function readRequiredObject(parent: JsonObject, key: string, label: string): JsonObject {
  const value = parent[key];
  return asJsonObject(value, `${label}.${key}`);
}

function readRequiredText(parent: JsonObject, key: string, label: string): string {
  const value = parent[key];
  if (typeof value !== "string" || value.length === 0) throw new Error(`${label}.${key} must be text`);
  return value;
}

function readObjectArray(parent: JsonObject, key: string, label: string): JsonObject[] {
  const value = parent[key];
  if (!Array.isArray(value)) throw new Error(`${label}.${key} must be an array`);
  return value.map((item, index) => asJsonObject(item, `${label}.${key}[${index}]`));
}

async function prepareFpml(sourceRoot: string): Promise<{
  semanticPayload: JsonObject;
  entities: readonly CandidateEntity[];
  sourceKind: string;
  authorityRef: string;
  losses: readonly string[];
  exclusions: readonly string[];
}> {
  const xmlPath = path.join(
    sourceRoot,
    "data/authority/com-ex28-gas-swap-daily-delivery-prices-option-last.xml"
  );
  const fpml = await parseFpmlTrade(xmlPath);
  return {
    semanticPayload: asJsonObject({
      schema_kind: "odd_world_model.example_domain_payload",
      schema_version: "v1",
      example_name: "trade_source_model",
      source_standard: "FpML",
      interpreted_source: fpml
    }, "FpML semantic payload"),
    entities: Object.freeze([
      entity(fpml.trade_id, "fpml_trade", fpml, "FpML trade")
    ]),
    sourceKind: "fpml_confirmation_corpus",
    authorityRef: "authority://fpml/official-example-corpus",
    losses: Object.freeze([
      "FpML syntax, example-index content, and non-economic documentation are inventoried but not copied into the interpreted trade payload"
    ]),
    exclusions: Object.freeze(["source-evidence://trade_source_model/uninterpreted-documentation"])
  };
}

async function prepareDomainInput(exampleName: string, sourceRoot: string): Promise<{
  semanticPayload: JsonObject;
  entities: readonly CandidateEntity[];
  sourceKind: string;
  authorityRef: string;
  losses: readonly string[];
  exclusions: readonly string[];
}> {
  const domainInput = await readJsonObject(path.join(sourceRoot, "data/domain_input.json"));
  if (exampleName === "trade_representation_model") {
    const trade = readRequiredObject(domainInput, "trade", exampleName);
    const schema = await readJsonObject(path.join(sourceRoot, "data/schema_snapshot.json"));
    return {
      semanticPayload: asJsonObject({
        schema_kind: "odd_world_model.example_domain_payload",
        schema_version: "v1",
        example_name: exampleName,
        domain_input: domainInput,
        schema_snapshot: schema
      }, `${exampleName} payload`),
      entities: Object.freeze([
        entity(readRequiredText(trade, "trade_id", "trade"), "trade_representation", trade, "trade")
      ]),
      sourceKind: "json_domain_seed",
      authorityRef: "authority://odd_world_model/trade-representation-example/v1",
      losses: Object.freeze([
        "authority notes are inventoried but not semantically interpreted by the deterministic example adapter"
      ]),
      exclusions: Object.freeze(["source-evidence://trade_representation_model/authority-notes"])
    };
  }
  if (exampleName === "banking_product_model") {
    const catalog = readRequiredObject(domainInput, "banking_product_catalog", exampleName);
    const products = readObjectArray(catalog, "products", "banking_product_catalog");
    const supporting = {
      schema_snapshot: await readJsonObject(path.join(sourceRoot, "data/schema_snapshot.json")),
      fibo_category_snapshot: await readJsonObject(path.join(sourceRoot, "data/fibo_category_snapshot.json")),
      jsonld_example: await readJsonObject(path.join(sourceRoot, "code/fibo_credit_card_markup_example.jsonld"))
    };
    return {
      semanticPayload: asJsonObject({
        schema_kind: "odd_world_model.example_domain_payload",
        schema_version: "v1",
        example_name: exampleName,
        domain_input: domainInput,
        ...supporting
      }, `${exampleName} payload`),
      entities: Object.freeze([
        entity(readRequiredText(catalog, "catalog_id", "banking_product_catalog"), "banking_product_catalog", catalog, "banking_product_catalog"),
        ...products.map((product) => entity(
          readRequiredText(product, "product_id", "banking product"),
          "banking_product",
          product,
          "banking product"
        ))
      ]),
      sourceKind: "json_domain_and_fibo_evidence",
      authorityRef: "authority://odd_world_model/banking-product-example/v1",
      losses: Object.freeze([
        "retained FIBO HTML pages and authority notes are inventoried but not fully interpreted into the candidate object cuts"
      ]),
      exclusions: Object.freeze(["source-evidence://banking_product_model/uninterpreted-html"])
    };
  }
  if (exampleName === "apra_liquidity_model") {
    const position = readRequiredObject(domainInput, "reporting_position", exampleName);
    const authorityClaims = await readJsonObject(path.join(sourceRoot, "data/authority_claims.json"));
    const requirements = await readJsonObject(path.join(sourceRoot, "data/requirements_snapshot.json"));
    return {
      semanticPayload: asJsonObject({
        schema_kind: "odd_world_model.example_domain_payload",
        schema_version: "v1",
        example_name: exampleName,
        domain_input: domainInput,
        authority_claims: authorityClaims,
        requirements_snapshot: requirements
      }, `${exampleName} payload`),
      entities: Object.freeze([
        entity(readRequiredText(position, "position_id", "reporting_position"), "apra_liquidity_position", position, "reporting_position")
      ]),
      sourceKind: "json_domain_and_regulatory_evidence",
      authorityRef: "authority://odd_world_model/apra-liquidity-example/v1",
      losses: Object.freeze([
        "official APRA HTML and PDF sources are inventoried while this deterministic adapter consumes only the bounded retained claims and requirement snapshot"
      ]),
      exclusions: Object.freeze(["source-evidence://apra_liquidity_model/uninterpreted-primary-documents"])
    };
  }
  throw new Error(`unsupported example ${exampleName}`);
}

export async function prepareExample(exampleName: string, sourceRoot: string): Promise<PreparedExample> {
  const inventory = await buildInventory(exampleName, sourceRoot);
  const prepared = exampleName === "trade_source_model"
    ? await prepareFpml(sourceRoot)
    : await prepareDomainInput(exampleName, sourceRoot);
  const sourceRef: ExactRef = Object.freeze({
    ref: `source-corpus://odd_world_model/${exampleName}/v1`,
    digest: inventory.inventory_digest,
    version: "v1"
  });
  return Object.freeze({
    example_name: exampleName,
    source_kind: prepared.sourceKind,
    authority_ref: prepared.authorityRef,
    inventory,
    source_ref: sourceRef,
    evidence_refs: Object.freeze(inventory.entries.map((entry) => `source-file://${exampleName}/${entry.relative_path}#${entry.sha256}`)),
    semantic_payload: prepared.semanticPayload,
    candidate_entities: prepared.entities,
    fidelity: "lossy_projection",
    losses: prepared.losses,
    exclusions: prepared.exclusions
  });
}

function fieldRefs(exampleName: string, entityInput: CandidateEntity): string[] {
  return Object.keys(entityInput.value)
    .sort()
    .map((field) => `source-field://${exampleName}/${entityInput.identity}/${field}`);
}

export function createExampleMarkovObjects(
  prepared: PreparedExample,
  sourceObservation: SourceObservation,
  createdAt: string
): readonly CandidateMarkovObjectCut[] {
  const sourceObservationRef = exactRefForSourceObservation(sourceObservation);
  return Object.freeze(prepared.candidate_entities.map((candidate) => {
    const fields = fieldRefs(prepared.example_name, candidate);
    return createCandidateMarkovObjectCut({
      schema_kind: "odd_world_model.candidate_markov_object_cut",
      schema_version: "v1",
      object_ref: `markov-object://odd_world_model/${prepared.example_name}/${candidate.identity}/v1`,
      object_identity: candidate.identity,
      identity_direction: {
        source_state_refs: [`source-state://${prepared.example_name}/${candidate.identity}/observed`],
        target_state_refs: [`world-object://${prepared.example_name}/${candidate.identity}/candidate`],
        projection_ref: `projection://odd_world_model/${prepared.example_name}/${candidate.object_kind}/v1`
      },
      projection_support_refs: fields,
      distributed_ledger_evidence_refs: fields.map((ref) => `ledger-entry:${ref}`),
      candidate_basis: {
        ref: `candidate-basis://odd_world_model/${prepared.example_name}/${candidate.identity}/v1`,
        digest: sha256Digest(candidate.value)
      },
      null_peer_basis: {
        ref: `null-peer-basis://odd_world_model/${prepared.example_name}/${candidate.identity}/v1`,
        digest: sha256Digest({ example_name: prepared.example_name, identity: candidate.identity, value: null })
      },
      held_out_treatment_verification: {
        treatment_ref: `treatment://odd_world_model/${prepared.example_name}/${candidate.object_kind}/v1`,
        corpus_ref: prepared.inventory.inventory_ref,
        result: "inconclusive",
        evidence_refs: [prepared.source_ref.ref, candidate.identity]
      },
      boundary: {
        included_refs: fields,
        excluded_refs: [...prepared.exclusions],
        rationale: `the retained ${prepared.example_name} descriptor selects the explicit ${candidate.object_kind} fields and declares unprocessed source evidence as loss`
      },
      publication_classification: "candidate",
      source_observation: sourceObservationRef,
      authority_ref: prepared.authority_ref,
      created_at: createdAt
    });
  }));
}

export function examplePayload(
  prepared: PreparedExample,
  candidates: readonly CandidateMarkovObjectCut[]
): JsonObject {
  return asJsonObject({
    schema_kind: "odd_world_model.example_semantic_payload",
    schema_version: "v1",
    example_name: prepared.example_name,
    source_inventory: {
      ref: prepared.inventory.inventory_ref,
      digest: prepared.inventory.inventory_digest
    },
    domain_payload: prepared.semantic_payload,
    candidate_markov_objects: candidates as unknown as JsonValue
  }, `${prepared.example_name} example payload`);
}
