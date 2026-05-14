import path from "node:path";
import type { FpmlLegObservation, FpmlTradeObservation } from "../adapters/fpml_confirmation.ts";
import { parseFpmlTrade } from "../adapters/fpml_confirmation.ts";
import type { JsonObject, JsonValue, SandboxBuilderConfig } from "../domain/types.ts";
import {
  PUBLISHED_AT,
  asObject,
  asString,
  readJsonObject,
  relativeTo,
  writeJson
} from "./common.ts";

interface FpmlSourceConfig {
  workspaceRoot: string;
  exampleName: string;
  artifactSlug: string;
  sourceXmlRelative: string;
  examplesIndexRelative: string;
  sourceAuthorityRelative: string;
  sourceNotesRelative?: string;
  sourceXmlPath: string;
  observation: FpmlTradeObservation;
}

function rootObjectId(): string {
  return "odd_world_model.world_model_object.fpml_confirmation.trade_record.trade_fpml_001";
}

function productObjectId(): string {
  return "odd_world_model.world_model_object.fpml_confirmation.commodity_swap_source.product_fpml_001";
}

function legObjectId(legKind: string, index: number): string {
  const legKey = legKind === "fixedLeg" ? "fixed_leg" : legKind === "floatingLeg" ? "floating_leg" : "other_leg";
  return `odd_world_model.world_model_object.fpml_confirmation.commodity_swap_leg.${legKey}_${String(index).padStart(2, "0")}`;
}

function dateTime(value: string | null | undefined): string | null {
  return value ? `${value}T00:00:00Z` : null;
}

function sourceRef(exampleName: string, relativePath: string): string {
  return `input://examples/${exampleName}/sources/${relativePath}`;
}

function reviewRef(relativePath: string): string {
  return `review://${relativePath}`;
}

function tradeTraceRef(claimKey: string): string {
  return reviewRef(`traces/source_trade_record/${claimKey}.json`);
}

function tradeAssuranceRef(claimKey: string): string {
  return reviewRef(`assurance/source_trade_record/${claimKey}.json`);
}

function tradeLedgerRef(claimKey: string): string {
  return `ledger://source_trade_record/${claimKey}.json`;
}

function dataRelative(config: FpmlSourceConfig, relativePath: string): string {
  return `data/${relativePath.split("sources/data/", 2).at(-1) ?? relativePath}`;
}

function sourceEvidenceRefs(config: FpmlSourceConfig): string[] {
  const refs = [
    sourceRef(config.exampleName, dataRelative(config, config.sourceXmlRelative)),
    sourceRef(config.exampleName, dataRelative(config, config.examplesIndexRelative)),
    sourceRef(config.exampleName, `uri_ledger/${path.basename(config.sourceAuthorityRelative)}`),
    reviewRef("source_observation.json")
  ];
  if (config.sourceNotesRelative) {
    refs.push(sourceRef(config.exampleName, `uri_ledger/${path.basename(config.sourceNotesRelative)}`));
  }
  return refs;
}

function claimSpecs(observation: FpmlTradeObservation): Array<{ claim_key: string; claim_kind: string; value: JsonValue; locator: string; summary: string }> {
  return [
    {
      claim_key: "trade_identifier",
      claim_kind: "identity",
      value: observation.trade_id,
      locator: "trade.tradeHeader.partyTradeIdentifier[0].tradeId",
      summary: "Trade identifier observed from the official FpML trade header."
    },
    {
      claim_key: "trade_date",
      claim_kind: "state",
      value: observation.trade_date,
      locator: "trade.tradeHeader.tradeDate",
      summary: "Trade date observed from the official FpML trade header."
    },
    {
      claim_key: "product_surface_ref",
      claim_kind: "attribute",
      value: productObjectId(),
      locator: "trade.commoditySwap",
      summary: "Product surface linkage observed from the official commoditySwap branch."
    }
  ];
}

export async function loadFpmlSourceConfig(workspaceRoot: string): Promise<FpmlSourceConfig> {
  const config = await readJsonObject(path.join(workspaceRoot, ".ai-workspace", "context", "world_builder_config.json")) as SandboxBuilderConfig;
  const domain = asObject(config.domain as JsonValue, "sandbox builder config domain");
  const exampleName = asString(domain.example_name, "domain.example_name");
  const artifactSlug = asString(domain.artifact_slug, "domain.artifact_slug");
  const sourceXmlRelative = asString(domain.source_xml, "domain.source_xml");
  const examplesIndexRelative = asString(domain.examples_index, "domain.examples_index");
  const sourceAuthorityRelative = asString(domain.source_authority, "domain.source_authority");
  const sourceNotesRelative = typeof domain.source_notes === "string" && domain.source_notes.length > 0 ? domain.source_notes : undefined;
  const sourceXmlPath = path.resolve(workspaceRoot, sourceXmlRelative);
  return {
    workspaceRoot,
    exampleName,
    artifactSlug,
    sourceXmlRelative,
    examplesIndexRelative,
    sourceAuthorityRelative,
    sourceNotesRelative,
    sourceXmlPath,
    observation: await parseFpmlTrade(sourceXmlPath)
  };
}

function publishedRoot(config: FpmlSourceConfig): string {
  return path.join(config.workspaceRoot, "published", config.artifactSlug);
}

function tracePayload(config: FpmlSourceConfig, claim: ReturnType<typeof claimSpecs>[number]): JsonObject {
  return {
    schema_kind: "odd_world_model.trace_record",
    schema_version: "v1",
    trace_id: `odd_world_model.trace.fpml_confirmation_source.trade_record.${claim.claim_key}.v1`,
    source_ref: sourceRef(config.exampleName, dataRelative(config, config.sourceXmlRelative)),
    source_kind: "fpml_confirmation_xml",
    claim_key: claim.claim_key,
    locator: claim.locator,
    observed_at: PUBLISHED_AT,
    observed_value: claim.value,
    summary: claim.summary
  };
}

function assurancePayload(claim: ReturnType<typeof claimSpecs>[number]): JsonObject {
  return {
    schema_kind: "odd_world_model.assurance_record",
    schema_version: "v1",
    assurance_id: `odd_world_model.assurance.fpml_confirmation_source.trade_record.${claim.claim_key}.v1`,
    object_ref: rootObjectId(),
    claim_key: claim.claim_key,
    claim_kind: claim.claim_kind,
    accepted_value: claim.value,
    trace_record_refs: [tradeTraceRef(claim.claim_key)],
    authority_basis: ["document:fpml_confirmation_source", `parser:fpml_confirmation.${claim.claim_key}`],
    accepted_at: PUBLISHED_AT
  };
}

function ledgerPayload(claim: ReturnType<typeof claimSpecs>[number]): JsonObject {
  return {
    schema_kind: "odd_world_model.attribute_ledger_entry",
    schema_version: "v1",
    entry_id: `odd_world_model.attribute_ledger.fpml_confirmation_source.trade_record.${claim.claim_key}.v1`,
    object_ref: rootObjectId(),
    claim_key: claim.claim_key,
    claim_kind: claim.claim_kind,
    value: claim.value,
    trace_record_refs: [tradeTraceRef(claim.claim_key)],
    assurance_record_refs: [tradeAssuranceRef(claim.claim_key)],
    published_at: PUBLISHED_AT
  };
}

function legFileName(leg: FpmlLegObservation, index: number): string {
  const legKey = leg.leg_kind === "fixedLeg" ? "fixed_leg" : leg.leg_kind === "floatingLeg" ? "floating_leg" : "other_leg";
  return `${legKey}_${String(index).padStart(2, "0")}.json`;
}

function sourceFragment(config: FpmlSourceConfig): JsonObject {
  return {
    schema_kind: "odd_world_model.world_fragment",
    schema_version: "v1",
    fragment_id: "odd_world_model.fragment.fpml_confirmation_source.commodity_swap.v1",
    bounded_context: "fpml_confirmation_source.commodity_swap",
    published_at: PUBLISHED_AT,
    published_by: "odd_world_model.project.trade_source_model",
    summary: "Published trade-source fragment built in the versioned trade-source sandbox over the retained official FpML confirmation authority.",
    objects: [
      "objects/source_trade_record.json",
      "objects/source_commodity_swap_surface.json",
      ...config.observation.product.legs.map((leg, index) => `objects/${legFileName(leg, index + 1)}`)
    ],
    attribute_ledger_entries: [
      "attribute_ledger/source_trade_record/trade_identifier.json",
      "attribute_ledger/source_trade_record/trade_date.json",
      "attribute_ledger/source_trade_record/product_surface_ref.json"
    ],
    reference_artifacts: [],
    treatments: [],
    edges: [],
    projections: ["projections/domain_summary.json"],
    evidence_manifests: ["evidence/manifests/fpml_source_manifest.json"],
    links: [
      "../../sources/uri_ledger/source_authority.md",
      "../../sources/data/authority/com-ex28-gas-swap-daily-delivery-prices-option-last.xml",
      "../../sources/data/authority/fpml-5-12-examples.html",
      "../../review/source_observation.json"
    ]
  };
}

function sourceObjects(config: FpmlSourceConfig): Array<[string, JsonObject]> {
  const observation = config.observation;
  const evidenceRefs = sourceEvidenceRefs(config);
  const sourceTradeId = rootObjectId();
  const sourceProductId = productObjectId();
  const sourceLegIds = observation.product.legs.map((leg, index) => legObjectId(leg.leg_kind, index + 1));
  const objects: Array<[string, JsonObject]> = [
    [
      "source_trade_record.json",
      {
        schema_kind: "odd_world_model.world_model_object",
        schema_version: "v1",
        object_id: sourceTradeId,
        object_kind: "FpmlConfirmationTradeRecord",
        bounded_context: "fpml_confirmation_source.commodity_swap",
        semantic_role: "Official FpML confirmation-view trade record preserved as the published source-truth domain.",
        identity: {
          authority_basis: "Official FpML confirmation example",
          aliases: [`trade_id:${observation.trade_id}`, `trade_xml_id:${observation.trade_xml_id}`].filter((value) => !value.endsWith(":"))
        },
        boundary: {
          internal_claim: "Trade-header identifiers, trade date, and the direct commoditySwap attachment are internal to this source record.",
          external_claim: "Interpreted world-model semantics remain external to the source FpML record domain.",
          adjacent_objects: [sourceProductId],
          adjacent_domains: ["trade_representation.fpml_confirmation"]
        },
        state: {
          lifecycle_state: "captured",
          state_summary: "Official FpML confirmation-view trade record captured as the source domain truth.",
          effective_time: dateTime(observation.trade_date),
          observation_time: PUBLISHED_AT,
          ambiguity_status: "low"
        },
        evidence: {
          refs: evidenceRefs,
          summary: "Trade record preserved directly from the official FpML source."
        },
        cross_domain: {
          treatment_refs: [],
          covariance_edge_refs: [],
          adjoint_mapping_refs: [],
          loss_notes: []
        },
        composition: {
          fragment_id: "odd_world_model.fragment.fpml_confirmation_source.commodity_swap.v1",
          parent_object_refs: [],
          child_object_refs: [sourceProductId]
        }
      }
    ],
    [
      "source_commodity_swap_surface.json",
      {
        schema_kind: "odd_world_model.world_model_object",
        schema_version: "v1",
        object_id: sourceProductId,
        object_kind: "FpmlCommoditySwapSourceSurface",
        bounded_context: "fpml_confirmation_source.commodity_swap",
        semantic_role: "Official commoditySwap source surface preserved with bounded leg structure.",
        identity: {
          authority_basis: "Official FpML commoditySwap source representation",
          aliases: [
            `product_id:${observation.product.product_id}`,
            `product_type:${observation.product.product_type}`,
            `asset_class:${observation.product.asset_class}`,
            `leg_count:${observation.product.leg_count}`
          ].filter((value) => !value.endsWith(":"))
        },
        boundary: {
          internal_claim: "Official product type, asset class, dates, and direct leg structure are internal to this source product surface.",
          external_claim: "Downstream normalized trade semantics remain external to the source product surface.",
          adjacent_objects: [sourceTradeId, ...sourceLegIds],
          adjacent_domains: ["trade_representation.fpml_confirmation"]
        },
        state: {
          lifecycle_state: "captured",
          state_summary: "Official commoditySwap source surface captured with bounded fixed/floating legs.",
          effective_time: dateTime(observation.product.effective_date),
          observation_time: PUBLISHED_AT,
          ambiguity_status: "low"
        },
        constraints: {
          invariants: ["source_product_must_preserve_official_leg_structure"],
          policies: ["fpml_source_product_capture_policy"],
          valid_transitions: ["supersede_with_new_source_cut"]
        },
        evidence: {
          refs: evidenceRefs,
          summary: "CommoditySwap source surface preserved directly from the official FpML example."
        },
        cross_domain: {
          treatment_refs: [],
          covariance_edge_refs: [],
          adjoint_mapping_refs: [],
          loss_notes: []
        },
        composition: {
          fragment_id: "odd_world_model.fragment.fpml_confirmation_source.commodity_swap.v1",
          parent_object_refs: [sourceTradeId],
          child_object_refs: sourceLegIds
        }
      }
    ]
  ];

  observation.product.legs.forEach((leg, index) => {
    const legObject = legObjectId(leg.leg_kind, index + 1);
    const quantitySummary = leg.quantity || leg.quantity_unit ? `${leg.quantity ?? ""} ${leg.quantity_unit ?? ""}`.trim() : "bounded notional quantity";
    objects.push([
      legFileName(leg, index + 1),
      {
        schema_kind: "odd_world_model.world_model_object",
        schema_version: "v1",
        object_id: legObject,
        object_kind: "FpmlCommoditySwapLegSourceSurface",
        bounded_context: "fpml_confirmation_source.commodity_swap",
        semantic_role: `Official ${leg.leg_kind} preserved as a direct source-domain surface.`,
        identity: {
          authority_basis: "Official FpML commoditySwap leg source representation",
          aliases: [
            `leg_id:${leg.leg_id}`,
            `leg_kind:${leg.leg_kind}`,
            `payer:${leg.payer_party_ref}`,
            `receiver:${leg.receiver_party_ref}`,
            leg.commodity_instrument_id ? `commodity:${leg.commodity_instrument_id}` : ""
          ].filter(Boolean)
        },
        boundary: {
          internal_claim: "Direction, quantity, price shape, and commodity reference are internal to this official source leg surface.",
          external_claim: "Normalized trade semantics remain external to the source leg surface.",
          adjacent_objects: [sourceProductId],
          adjacent_domains: ["trade_representation.fpml_confirmation"]
        },
        state: {
          lifecycle_state: "captured",
          state_summary: `Official ${leg.leg_kind} captured with ${quantitySummary}.`,
          effective_time: dateTime(observation.product.effective_date),
          observation_time: PUBLISHED_AT,
          ambiguity_status: "low"
        },
        constraints: {
          invariants: ["source_leg_must_preserve_official_direction", "source_leg_must_preserve_official_notional_shape"],
          policies: ["fpml_source_leg_capture_policy"],
          valid_transitions: ["supersede_with_new_source_cut"]
        },
        evidence: {
          refs: evidenceRefs,
          summary: `${leg.leg_kind} preserved directly from the official FpML example.`
        },
        cross_domain: {
          treatment_refs: [],
          covariance_edge_refs: [],
          adjoint_mapping_refs: [],
          loss_notes: []
        },
        composition: {
          fragment_id: "odd_world_model.fragment.fpml_confirmation_source.commodity_swap.v1",
          parent_object_refs: [sourceProductId],
          child_object_refs: []
        }
      }
    ]);
  });
  return objects;
}

export async function buildFpmlSourceSeed(workspaceRoot: string): Promise<Record<string, string>> {
  const config = await loadFpmlSourceConfig(path.resolve(workspaceRoot));
  const reviewRoot = path.join(config.workspaceRoot, "review");
  const root = publishedRoot(config);

  await writeJson(path.join(reviewRoot, "source_observation.json"), config.observation as unknown as JsonObject);
  for (const claim of claimSpecs(config.observation)) {
    await writeJson(path.join(reviewRoot, "traces", "source_trade_record", `${claim.claim_key}.json`), tracePayload(config, claim));
    await writeJson(path.join(reviewRoot, "assurance", "source_trade_record", `${claim.claim_key}.json`), assurancePayload(claim));
    await writeJson(path.join(root, "attribute_ledger", "source_trade_record", `${claim.claim_key}.json`), ledgerPayload(claim));
  }
  for (const [fileName, payload] of sourceObjects(config)) {
    await writeJson(path.join(root, "objects", fileName), payload);
  }
  await writeJson(path.join(root, "projections", "domain_summary.json"), {
    schema_kind: "odd_world_model.projection_spec",
    schema_version: "v1",
    projection_id: "odd_world_model.projection.fpml_confirmation_source.summary.v1",
    projection_kind: "domain_summary",
    source_refs: ["odd_world_model.fragment.fpml_confirmation_source.commodity_swap.v1"],
    summary: "Summary projection for the standalone FpML confirmation source domain."
  });
  await writeJson(path.join(root, "evidence", "manifests", "fpml_source_manifest.json"), {
    schema_kind: "odd_world_model.evidence_manifest",
    schema_version: "v1",
    manifest_id: "odd_world_model.evidence.fpml_confirmation_source.commodity_swap.v1",
    summary: "Evidence manifest for the official FpML confirmation-view source domain.",
    refs: sourceEvidenceRefs(config)
  });
  await writeJson(path.join(root, "fragment.json"), sourceFragment(config));
  await writeJson(path.join(config.workspaceRoot, "published", "world_model", "composed_world_model.json"), {
    world_model_id: "odd_world_model.world_model.fpml_confirmation_source.commodity_swap.v1",
    fragments: ["odd_world_model.fragment.fpml_confirmation_source.commodity_swap.v1"],
    bounded_contexts: ["fpml_confirmation_source.commodity_swap"],
    summary: "Single-domain world-model composition for the retained FpML confirmation source."
  });
  await writeJson(path.join(config.workspaceRoot, "query", "world_model_query_summary.json"), {
    query_id: "odd_world_model.query.fpml_confirmation_source.commodity_swap.v1",
    lane: "filesystem_first",
    fragment_ref: "odd_world_model.fragment.fpml_confirmation_source.commodity_swap.v1",
    question: "What did the configured sandbox publish for the retained FpML confirmation source?",
    answer: "The sandbox published the retained official FpML confirmation trade record, product surface, and bounded leg surfaces as a local source-truth domain.",
    objects: [rootObjectId(), productObjectId()],
    source_refs: [
      "input://examples/trade_source_model/sources/data/authority/com-ex28-gas-swap-daily-delivery-prices-option-last.xml",
      "input://examples/trade_source_model/sources/data/authority/fpml-5-12-examples.html"
    ],
    world_model_ref: "published/world_model/composed_world_model.json"
  });

  return {
    sourceObservation: relativeTo(config.workspaceRoot, path.join(reviewRoot, "source_observation.json")),
    fragment: relativeTo(config.workspaceRoot, path.join(root, "fragment.json")),
    worldModel: "published/world_model/composed_world_model.json",
    querySummary: "query/world_model_query_summary.json"
  };
}
