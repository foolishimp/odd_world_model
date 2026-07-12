import path from "node:path";
import type { JsonObject, JsonValue } from "../../code/src/domain/types.ts";
import {
  PUBLISHED_AT,
  asObject,
  asString,
  camel,
  claimKind,
  jsonArrayOfStrings,
  readJsonObject,
  relativeTo,
  scalarClaims,
  slug,
  writeJson
} from "./common.ts";

const META_KEYS = new Set(["source_id", "published_by", "bounded_context", "summary", "evidence_refs"]);

interface SeedObject {
  key: string;
  fileName: string;
  objectKind: string;
  objectId: string;
  identityAlias: string;
  payload: JsonObject;
  locatorPrefix: string;
  parentObjectRef?: string;
}

interface DomainSeedConfig {
  workspaceRoot: string;
  exampleName: string;
  artifactSlug: string;
  sourceManifestPath: string;
  sourceManifestRelative: string;
  sourceManifest: JsonObject;
  boundedContext: string;
  publishedBy: string;
  summary: string;
  primarySectionKey: string;
  primarySectionPayload: JsonObject;
  rootObject: SeedObject;
  childObjects: SeedObject[];
}

function allObjects(config: DomainSeedConfig): SeedObject[] {
  return [config.rootObject, ...config.childObjects];
}

function firstScalarIdentifier(record: JsonObject): [string, string] {
  for (const [key, value] of Object.entries(record)) {
    if (key.endsWith("_id") && typeof value === "string" && value.length > 0) {
      return [key, value];
    }
  }
  return ["synthetic_id", "seed_001"];
}

function buildRootObject(sectionKey: string, payload: JsonObject, boundedContext: string): SeedObject {
  const [, identifier] = firstScalarIdentifier(payload);
  const objectKind = camel(sectionKey);
  const objectKey = slug(identifier);
  return {
    key: objectKey,
    fileName: `${objectKey}.json`,
    objectKind,
    objectId: `odd_world_model.markov_object.${slug(boundedContext)}.${slug(objectKind)}.${objectKey}`,
    identityAlias: `${sectionKey}:${identifier}`,
    payload,
    locatorPrefix: sectionKey
  };
}

function buildChildObjects(rootObject: SeedObject, payload: JsonObject, boundedContext: string): SeedObject[] {
  const children: SeedObject[] = [];
  for (const [key, value] of Object.entries(payload)) {
    if (!Array.isArray(value)) continue;
    value.forEach((entry, index) => {
      if (!entry || typeof entry !== "object" || Array.isArray(entry)) return;
      const childPayload = entry as JsonObject;
      const [, identifier] = firstScalarIdentifier(childPayload);
      const kindCandidate = typeof childPayload.product_kind === "string" ? childPayload.product_kind : camel(key.replace(/s$/, ""));
      const objectKey = slug(identifier);
      children.push({
        key: objectKey,
        fileName: `${objectKey}.json`,
        objectKind: camel(kindCandidate),
        objectId: `odd_world_model.markov_object.${slug(boundedContext)}.${slug(kindCandidate)}.${objectKey}`,
        identityAlias: `${key}[${index}]:${identifier}`,
        payload: childPayload,
        locatorPrefix: `${key}[${index}]`,
        parentObjectRef: rootObject.objectId
      });
    });
  }
  return children;
}

export async function loadDomainSeedConfig(workspaceRoot: string): Promise<DomainSeedConfig> {
  const config = await readJsonObject(path.join(workspaceRoot, ".ai-workspace", "context", "world_builder_config.json"));
  const domain = asObject(config.domain, "sandbox builder config domain");
  const exampleName = asString(domain.example_name, "domain.example_name");
  const artifactSlug = asString(domain.artifact_slug, "domain.artifact_slug");
  const sourceManifestRelative = asString(domain.source_manifest, "domain.source_manifest");
  const sourceManifestPath = path.resolve(workspaceRoot, sourceManifestRelative);
  const sourceManifest = await readJsonObject(sourceManifestPath);
  const boundedContext = asString(sourceManifest.bounded_context, "domain source manifest bounded_context");
  const publishedBy = asString(sourceManifest.published_by, "domain source manifest published_by");
  const summary = asString(sourceManifest.summary, "domain source manifest summary");
  const payloadKeys = Object.keys(sourceManifest).filter((key) => !META_KEYS.has(key));
  if (payloadKeys.length === 0) {
    throw new Error("domain source manifest must provide at least one payload section");
  }
  const primarySectionKey = payloadKeys[0] as string;
  const primarySectionPayload = asObject(sourceManifest[primarySectionKey], `domain source manifest ${primarySectionKey}`);
  const rootObject = buildRootObject(primarySectionKey, primarySectionPayload, boundedContext);
  return {
    workspaceRoot,
    exampleName,
    artifactSlug,
    sourceManifestPath,
    sourceManifestRelative,
    sourceManifest,
    boundedContext,
    publishedBy,
    summary,
    primarySectionKey,
    primarySectionPayload,
    rootObject,
    childObjects: buildChildObjects(rootObject, primarySectionPayload, boundedContext)
  };
}

function reviewRoot(config: DomainSeedConfig): string {
  return path.join(config.workspaceRoot, "review");
}

function publishedRoot(config: DomainSeedConfig): string {
  return path.join(config.workspaceRoot, "published", config.artifactSlug);
}

function fragmentId(config: DomainSeedConfig): string {
  return `odd_world_model.fragment.${slug(config.boundedContext)}.v1`;
}

function sourceObservationPath(config: DomainSeedConfig): string {
  return path.join(reviewRoot(config), "source_observation.json");
}

function sourceRef(config: DomainSeedConfig): string {
  const refs = jsonArrayOfStrings(config.sourceManifest.evidence_refs);
  return refs.find((entry) => entry.endsWith("domain_input.json")) ?? refs[0] ?? `input://${config.sourceManifestRelative}`;
}

function tracePath(config: DomainSeedConfig, obj: SeedObject, claimKey: string): string {
  return path.join(reviewRoot(config), "traces", obj.key, `${claimKey}.json`);
}

function assurancePath(config: DomainSeedConfig, obj: SeedObject, claimKey: string): string {
  return path.join(reviewRoot(config), "assurance", obj.key, `${claimKey}.json`);
}

function ledgerPath(config: DomainSeedConfig, obj: SeedObject, claimKey: string): string {
  return path.join(publishedRoot(config), "attribute_ledger", obj.key, `${claimKey}.json`);
}

function reviewRef(kind: "traces" | "assurance", obj: SeedObject, claimKey: string): string {
  return `review://${kind}/${obj.key}/${claimKey}.json`;
}

function ledgerRef(obj: SeedObject, claimKey: string): string {
  return `ledger://${obj.key}/${claimKey}.json`;
}

function tracePayload(config: DomainSeedConfig, obj: SeedObject, claimKey: string, value: JsonValue): JsonObject {
  return {
    schema_kind: "odd_world_model.trace_record",
    schema_version: "v1",
    trace_id: `odd_world_model.trace.${slug(config.boundedContext)}.${obj.key}.${claimKey}.v1`,
    source_ref: sourceRef(config),
    source_kind: "domain_input_json",
    claim_key: claimKey,
    locator: `${obj.locatorPrefix}.${claimKey}`,
    observed_at: PUBLISHED_AT,
    observed_value: value,
    summary: `Observed ${claimKey} for ${obj.objectKind} from retained domain_input source.`
  };
}

function assurancePayload(config: DomainSeedConfig, obj: SeedObject, claimKey: string, value: JsonValue): JsonObject {
  return {
    schema_kind: "odd_world_model.assurance_record",
    schema_version: "v1",
    assurance_id: `odd_world_model.assurance.${slug(config.boundedContext)}.${obj.key}.${claimKey}.v1`,
    object_ref: obj.objectId,
    claim_key: claimKey,
    claim_kind: claimKind(claimKey),
    accepted_value: value,
    trace_record_refs: [reviewRef("traces", obj, claimKey)],
    authority_basis: [`source:${String(config.sourceManifest.source_id ?? config.exampleName)}`, `builder:domain_input_seed.${claimKey}`],
    accepted_at: PUBLISHED_AT
  };
}

function ledgerPayload(config: DomainSeedConfig, obj: SeedObject, claimKey: string, value: JsonValue): JsonObject {
  return {
    schema_kind: "odd_world_model.attribute_ledger_entry",
    schema_version: "v1",
    entry_id: `odd_world_model.attribute_ledger.${slug(config.boundedContext)}.${obj.key}.${claimKey}.v1`,
    object_ref: obj.objectId,
    claim_key: claimKey,
    claim_kind: claimKind(claimKey),
    value,
    trace_record_refs: [reviewRef("traces", obj, claimKey)],
    assurance_record_refs: [reviewRef("assurance", obj, claimKey)],
    published_at: PUBLISHED_AT
  };
}

function objectPayload(config: DomainSeedConfig, obj: SeedObject): JsonObject {
  const claims = scalarClaims(obj.payload);
  const childRefs = config.childObjects.filter((child) => child.parentObjectRef === obj.objectId).map((child) => child.objectId);
  const lifecycleValue = obj.payload.lifecycle_state;
  const lifecycleState = typeof lifecycleValue === "string" && lifecycleValue.length > 0 ? lifecycleValue : "observed";
  return {
    schema_kind: "odd_world_model.markov_object",
    schema_version: "v1",
    object_id: obj.objectId,
    object_kind: obj.objectKind,
    bounded_context: config.boundedContext,
    semantic_role: `${obj.objectKind} recovered from retained domain_input evidence for ${config.exampleName}.`,
    identity: {
      authority_basis: String(config.sourceManifest.source_id ?? config.exampleName),
      aliases: [obj.identityAlias]
    },
    boundary: {
      internal_claim: `${obj.objectKind} claims are bounded to the local ${config.boundedContext} publication cut.`,
      external_claim: "Cross-domain mappings, treatments, and external projections remain downstream work.",
      adjacent_objects: childRefs,
      adjacent_domains: []
    },
    blanket: {
      ingress_surfaces: [path.basename(config.sourceManifestPath)],
      egress_surfaces: [`${config.artifactSlug}_publication`],
      observable_surfaces: [path.basename(sourceObservationPath(config))],
      control_surfaces: ["inspect_source", "publish_domain_artifact"],
      adjacent_objects: childRefs,
      adjacent_domains: [],
      internal_claim: `${obj.objectKind} is a local semantic object for the configured sandbox source corpus.`,
      external_claim: "Further world-model stitching is not implied by the local single-domain publication cut."
    },
    state: {
      lifecycle_state: lifecycleState,
      state_summary: `${obj.objectKind} published from retained sandbox source evidence.`,
      effective_time: PUBLISHED_AT,
      observation_time: PUBLISHED_AT,
      ambiguity_status: "bounded"
    },
    constraints: {
      invariants: [`${obj.key}_identity_present`],
      policies: [`${config.exampleName}_publication_policy`],
      valid_transitions: ["review", "republish"]
    },
    evidence: {
      refs: jsonArrayOfStrings(config.sourceManifest.evidence_refs).length > 0 ? jsonArrayOfStrings(config.sourceManifest.evidence_refs) : [sourceRef(config)],
      summary: config.summary
    },
    materialization: {
      projection_summary: `Immutable object cut projected from the attribute ledger for ${obj.objectKind}.`,
      attribute_ledger_entry_refs: claims.map(([claimKey]) => ledgerRef(obj, claimKey)),
      assurance_record_refs: claims.map(([claimKey]) => reviewRef("assurance", obj, claimKey)),
      trace_record_refs: claims.map(([claimKey]) => reviewRef("traces", obj, claimKey))
    },
    cross_domain: {
      treatment_refs: [],
      covariance_edge_refs: [],
      adjoint_mapping_refs: [],
      loss_notes: []
    },
    composition: {
      fragment_id: fragmentId(config),
      parent_object_refs: obj.parentObjectRef ? [obj.parentObjectRef] : [],
      child_object_refs: childRefs
    }
  };
}

function fragmentPayload(config: DomainSeedConfig): JsonObject {
  const ledgerEntries: string[] = [];
  for (const obj of allObjects(config)) {
    for (const [claimKey] of scalarClaims(obj.payload)) {
      ledgerEntries.push(`attribute_ledger/${obj.key}/${claimKey}.json`);
    }
  }
  return {
    schema_kind: "odd_world_model.world_fragment",
    schema_version: "v1",
    fragment_id: fragmentId(config),
    bounded_context: config.boundedContext,
    published_at: PUBLISHED_AT,
    published_by: config.publishedBy,
    summary: config.summary,
    objects: allObjects(config).map((obj) => `objects/${obj.fileName}`),
    attribute_ledger_entries: ledgerEntries,
    reference_artifacts: [],
    treatments: [],
    edges: [],
    projections: ["projections/domain_summary.json"],
    evidence_manifests: ["evidence/manifests/domain_source_manifest.json"],
    links: [config.sourceManifestRelative]
  };
}

export async function buildDomainInputSeed(workspaceRoot: string): Promise<Record<string, string>> {
  const config = await loadDomainSeedConfig(path.resolve(workspaceRoot));

  await writeJson(sourceObservationPath(config), {
    source_id: String(config.sourceManifest.source_id ?? config.exampleName),
    bounded_context: config.boundedContext,
    summary: config.summary,
    source_manifest: config.sourceManifestRelative,
    observed_payload: config.primarySectionPayload,
    evidence_refs: jsonArrayOfStrings(config.sourceManifest.evidence_refs)
  });

  for (const obj of allObjects(config)) {
    for (const [claimKey, value] of scalarClaims(obj.payload)) {
      await writeJson(tracePath(config, obj, claimKey), tracePayload(config, obj, claimKey, value));
      await writeJson(assurancePath(config, obj, claimKey), assurancePayload(config, obj, claimKey, value));
      await writeJson(ledgerPath(config, obj, claimKey), ledgerPayload(config, obj, claimKey, value));
    }
    await writeJson(path.join(publishedRoot(config), "objects", obj.fileName), objectPayload(config, obj));
  }

  await writeJson(path.join(publishedRoot(config), "projections", "domain_summary.json"), {
    schema_kind: "odd_world_model.projection_spec",
    schema_version: "v1",
    projection_id: `odd_world_model.projection.${slug(config.boundedContext)}.summary.v1`,
    projection_kind: "domain_summary",
    source_refs: [fragmentId(config)],
    summary: config.summary
  });
  await writeJson(path.join(publishedRoot(config), "evidence", "manifests", "domain_source_manifest.json"), {
    schema_kind: "odd_world_model.evidence_manifest",
    schema_version: "v1",
    manifest_id: `odd_world_model.evidence.${slug(config.boundedContext)}.v1`,
    refs: jsonArrayOfStrings(config.sourceManifest.evidence_refs).length > 0 ? jsonArrayOfStrings(config.sourceManifest.evidence_refs) : [sourceRef(config)]
  });
  await writeJson(path.join(publishedRoot(config), "fragment.json"), fragmentPayload(config));
  await writeJson(path.join(config.workspaceRoot, "published", "world_model", "composed_world_model.json"), {
    world_model_id: `odd_world_model.world_model.${slug(config.boundedContext)}.v1`,
    fragments: [fragmentId(config)],
    bounded_contexts: [config.boundedContext],
    summary: `Single-domain composed world model for ${config.exampleName}.`
  });
  await writeJson(path.join(config.workspaceRoot, "query", "world_model_query_summary.json"), {
    query_id: `odd_world_model.query.${slug(config.boundedContext)}.v1`,
    lane: "filesystem_first",
    fragment_ref: fragmentId(config),
    question: `What did the configured sandbox publish for ${config.boundedContext}?`,
    answer: config.summary,
    objects: allObjects(config).map((obj) => obj.objectId),
    source_manifest: config.sourceManifestRelative,
    world_model_ref: "published/world_model/composed_world_model.json"
  });

  return {
    sourceObservation: relativeTo(config.workspaceRoot, sourceObservationPath(config)),
    fragment: relativeTo(config.workspaceRoot, path.join(publishedRoot(config), "fragment.json")),
    worldModel: "published/world_model/composed_world_model.json",
    querySummary: "query/world_model_query_summary.json"
  };
}
