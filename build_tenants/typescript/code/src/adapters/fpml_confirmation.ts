import { readFile } from "node:fs/promises";
import { XMLParser } from "fast-xml-parser";
import { SyntaxValidator } from "fast-xml-validator";
import type { DeterministicPayloadCheck } from "../domain/semantic_publication.ts";
import type { TypedGap } from "../domain/semantic_memory.ts";
import type { JsonObject } from "../domain/types.ts";

export interface FpmlLegObservation {
  leg_id: string;
  leg_kind: string;
  payer_party_ref: string;
  receiver_party_ref: string;
  quantity: string | null;
  quantity_unit: string | null;
  quantity_frequency: string | null;
  total_notional_quantity: string | null;
  fixed_price: string | null;
  price_currency: string | null;
  price_unit: string | null;
  commodity_instrument_id: string | null;
  calculation_schedule_ref: string;
}

export interface FpmlTradeObservation {
  source_standard: "FpML";
  source_view: "confirmation";
  fpml_version: string;
  trade_xml_id: string;
  trade_id: string;
  trade_identifiers: string[];
  trade_date: string;
  product: {
    product_xml_id: string;
    product_type: string;
    product_id: string;
    asset_class: string;
    effective_date: string;
    termination_date: string;
    legs: FpmlLegObservation[];
    leg_count: number;
  };
  party_refs: string[];
  parties: Array<{ xml_id: string; party_id: string; party_name: string }>;
  agreement: {
    type: string | null;
    date: string | null;
    version: string | null;
  };
}

export const fpmlTradeObservationPayloadCheck: DeterministicPayloadCheck = Object.freeze({
  contractRef: "workspace://build_tenants/common/schemas/fpml_trade_observation.schema.json",
  validate: (payload: JsonObject): readonly TypedGap[] => {
    const candidate = payload as unknown as Partial<FpmlTradeObservation>;
    if (candidate.source_standard !== "FpML" || candidate.source_view !== "confirmation") {
      throw new Error("FpML observation must declare the FpML confirmation source view");
    }
    if (typeof candidate.fpml_version !== "string" || candidate.fpml_version.length === 0) {
      throw new Error("FpML observation has no version");
    }
    if (typeof candidate.trade_id !== "string" || candidate.trade_id.length === 0) {
      throw new Error("FpML observation has no trade identity");
    }
    if (typeof candidate.trade_date !== "string" || candidate.trade_date.length === 0) {
      throw new Error("FpML observation has no trade date");
    }
    const product = candidate.product;
    if (product === undefined || !Array.isArray(product.legs) || product.legs.length === 0) {
      throw new Error("FpML observation has no product legs");
    }
    if (product.leg_count !== product.legs.length) {
      throw new Error("FpML observation leg_count does not match its legs");
    }
    return Object.freeze([]);
  }
});

type XmlRecord = Record<string, unknown>;

const repeatedFpmlElements = new Set([
  "partyTradeIdentifier",
  "party",
  "fixedLeg",
  "floatingLeg"
]);

const fpmlParser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  removeNSPrefix: true,
  parseTagValue: false,
  parseAttributeValue: false,
  trimValues: true,
  processEntities: true,
  isArray: (tagName) => repeatedFpmlElements.has(tagName)
});

function xmlRecord(value: unknown, label: string): XmlRecord {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${label} must be an XML element`);
  }
  return value as XmlRecord;
}

function optionalXmlRecord(value: unknown): XmlRecord | null {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? value as XmlRecord
    : null;
}

function xmlRecords(value: unknown, label: string): readonly XmlRecord[] {
  if (value === undefined) return [];
  const values = Array.isArray(value) ? value : [value];
  return values.map((item, index) => xmlRecord(item, `${label}[${index}]`));
}

function xmlText(value: unknown): string | null {
  if (typeof value === "string") return value.length > 0 ? value : null;
  const record = optionalXmlRecord(value);
  const text = record?.["#text"];
  return typeof text === "string" && text.length > 0 ? text : null;
}

function xmlAttribute(value: unknown, name: string): string {
  const attribute = optionalXmlRecord(value)?.[`@_${name}`];
  return typeof attribute === "string" ? attribute : "";
}

function xmlHref(value: unknown): string {
  return xmlAttribute(value, "href");
}

function nestedRecord(parent: XmlRecord | null, name: string): XmlRecord | null {
  return optionalXmlRecord(parent?.[name]);
}

function extractLeg(leg: XmlRecord, legKind: string, index: number): FpmlLegObservation {
  const notional = nestedRecord(leg, "notionalQuantity");
  const fixedPrice = nestedRecord(leg, "fixedPrice");
  const commodity = nestedRecord(leg, "commodity");
  const calculation = nestedRecord(leg, "calculation");
  const pricingDates = nestedRecord(calculation, "pricingDates");
  return {
    leg_id: xmlAttribute(leg, "id") || `${legKind.toLowerCase()}_${String(index).padStart(2, "0")}`,
    leg_kind: legKind,
    payer_party_ref: xmlHref(leg.payerPartyReference),
    receiver_party_ref: xmlHref(leg.receiverPartyReference),
    quantity: xmlText(notional?.quantity),
    quantity_unit: xmlText(notional?.quantityUnit),
    quantity_frequency: xmlText(notional?.quantityFrequency),
    total_notional_quantity: xmlText(leg.totalNotionalQuantity),
    fixed_price: xmlText(fixedPrice?.price),
    price_currency: xmlText(fixedPrice?.priceCurrency),
    price_unit: xmlText(fixedPrice?.priceUnit),
    commodity_instrument_id: xmlText(commodity?.instrumentId),
    calculation_schedule_ref: xmlHref(leg.calculationPeriodsScheduleReference) ||
      xmlHref(pricingDates?.calculationPeriodsScheduleReference)
  };
}

function unique(values: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const value of values) {
    if (value && !seen.has(value)) {
      seen.add(value);
      result.push(value);
    }
  }
  return result;
}

export async function parseFpmlTrade(filePath: string): Promise<FpmlTradeObservation> {
  const xml = await readFile(filePath, "utf8");
  let syntax: ReturnType<typeof SyntaxValidator.validate>;
  try {
    syntax = SyntaxValidator.validate(xml, {
      docType: { maxEntityCount: 0, maxEntitySize: 0 }
    });
  } catch (error: unknown) {
    throw new Error(`${filePath}: malformed XML: ${error instanceof Error ? error.message : String(error)}`);
  }
  if (syntax !== true) {
    throw new Error(
      `${filePath}: malformed XML at ${syntax.err.line}:${syntax.err.col}: ${syntax.err.msg}`
    );
  }
  const parsed = fpmlParser.parse(xml) as unknown;
  const document = xmlRecord(xmlRecord(parsed, filePath).dataDocument, `${filePath}: dataDocument`);
  const trade = xmlRecord(document.trade, `${filePath}: trade`);
  const tradeHeader = xmlRecord(trade.tradeHeader, `${filePath}: tradeHeader`);
  const tradeIdentifiers = xmlRecords(
    tradeHeader.partyTradeIdentifier,
    `${filePath}: partyTradeIdentifier`
  )
    .map((identifier) => xmlText(identifier.tradeId))
    .filter((value): value is string => typeof value === "string" && value.length > 0);
  const commoditySwap = xmlRecord(trade.commoditySwap, `${filePath}: commoditySwap`);
  const fixedLegs = xmlRecords(commoditySwap.fixedLeg, `${filePath}: fixedLeg`);
  const floatingLegs = xmlRecords(commoditySwap.floatingLeg, `${filePath}: floatingLeg`);
  const legs = [
    ...fixedLegs.map((leg, index) => extractLeg(leg, "fixedLeg", index + 1)),
    ...floatingLegs.map((leg, index) => extractLeg(leg, "floatingLeg", index + 1 + fixedLegs.length))
  ];
  const partyRefs = unique(legs.flatMap((leg) => [leg.payer_party_ref, leg.receiver_party_ref]));
  const parties = xmlRecords(document.party, `${filePath}: party`).map((party) => {
    const xmlId = xmlAttribute(party, "id");
    const partyId = xmlText(party.partyId) || xmlId;
    return {
      xml_id: xmlId,
      party_id: partyId,
      party_name: xmlText(party.partyName) || partyId
    };
  });
  const masterAgreement = nestedRecord(nestedRecord(trade, "documentation"), "masterAgreement");
  const effectiveDate = nestedRecord(commoditySwap, "effectiveDate");
  const terminationDate = nestedRecord(commoditySwap, "terminationDate");
  return {
    source_standard: "FpML",
    source_view: "confirmation",
    fpml_version: xmlAttribute(document, "fpmlVersion"),
    trade_xml_id: xmlAttribute(trade, "id"),
    trade_id: tradeIdentifiers[0] ?? "",
    trade_identifiers: tradeIdentifiers,
    trade_date: xmlText(tradeHeader.tradeDate) ?? "",
    product: {
      product_xml_id: xmlAttribute(commoditySwap, "id"),
      product_type: xmlText(commoditySwap.productType) ?? "",
      product_id: xmlText(commoditySwap.productId) ?? "",
      asset_class: xmlText(commoditySwap.primaryAssetClass) ?? xmlText(commoditySwap.assetClass) ?? "",
      effective_date: xmlText(nestedRecord(effectiveDate, "adjustableDate")?.unadjustedDate) ??
        xmlText(effectiveDate?.unadjustedDate) ?? xmlText(commoditySwap.effectiveDate) ?? "",
      termination_date: xmlText(nestedRecord(terminationDate, "adjustableDate")?.unadjustedDate) ??
        xmlText(terminationDate?.unadjustedDate) ?? xmlText(commoditySwap.terminationDate) ?? "",
      legs,
      leg_count: legs.length
    },
    party_refs: partyRefs,
    parties,
    agreement: {
      type: xmlText(masterAgreement?.masterAgreementType),
      date: xmlText(masterAgreement?.masterAgreementDate),
      version: xmlText(masterAgreement?.masterAgreementVersion)
    }
  };
}
