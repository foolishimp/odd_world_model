import { readFile } from "node:fs/promises";

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

function attr(source: string, name: string): string {
  const match = source.match(new RegExp(`${name}="([^"]*)"`));
  return match?.[1] ?? "";
}

function firstBlock(source: string, tag: string): string {
  const match = source.match(new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)</${tag}>`));
  return match?.[1] ?? "";
}

function firstOpenTag(source: string, tag: string): string {
  const match = source.match(new RegExp(`<${tag}\\b[^>]*>`));
  return match?.[0] ?? "";
}

function firstText(source: string, tag: string): string | null {
  const match = source.match(new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)</${tag}>`));
  const value = match?.[1]?.trim();
  return value ? value : null;
}

function allBlocks(source: string, tag: string): Array<{ openTag: string; body: string }> {
  const blocks: Array<{ openTag: string; body: string }> = [];
  const regex = new RegExp(`(<${tag}\\b[^>]*>)([\\s\\S]*?)</${tag}>`, "g");
  let match: RegExpExecArray | null;
  while ((match = regex.exec(source)) !== null) {
    blocks.push({ openTag: match[1] ?? "", body: match[2] ?? "" });
  }
  return blocks;
}

function allOpenTags(source: string, tag: string): string[] {
  const tags: string[] = [];
  const regex = new RegExp(`<${tag}\\b[^>]*>`, "g");
  let match: RegExpExecArray | null;
  while ((match = regex.exec(source)) !== null) {
    tags.push(match[0] ?? "");
  }
  return tags;
}

function firstHref(source: string, tag: string): string {
  return attr(firstOpenTag(source, tag), "href");
}

function extractLeg(body: string, legKind: string, index: number): FpmlLegObservation {
  const openTag = firstOpenTag(`<${legKind}>${body}</${legKind}>`, legKind);
  const pricingDates = firstBlock(body, "pricingDates");
  return {
    leg_id: attr(openTag, "id") || `${legKind.toLowerCase()}_${String(index).padStart(2, "0")}`,
    leg_kind: legKind,
    payer_party_ref: firstHref(body, "payerPartyReference"),
    receiver_party_ref: firstHref(body, "receiverPartyReference"),
    quantity: firstText(firstBlock(body, "notionalQuantity"), "quantity"),
    quantity_unit: firstText(firstBlock(body, "notionalQuantity"), "quantityUnit"),
    quantity_frequency: firstText(firstBlock(body, "notionalQuantity"), "quantityFrequency"),
    total_notional_quantity: firstText(body, "totalNotionalQuantity"),
    fixed_price: firstText(firstBlock(body, "fixedPrice"), "price"),
    price_currency: firstText(firstBlock(body, "fixedPrice"), "priceCurrency"),
    price_unit: firstText(firstBlock(body, "fixedPrice"), "priceUnit"),
    commodity_instrument_id: firstText(firstBlock(body, "commodity"), "instrumentId"),
    calculation_schedule_ref: firstHref(body, "calculationPeriodsScheduleReference") || firstHref(pricingDates, "calculationPeriodsScheduleReference")
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
  const rootOpenTag = firstOpenTag(xml, "dataDocument");
  const tradeOpenTag = firstOpenTag(xml, "trade");
  const trade = firstBlock(xml, "trade");
  if (!trade) {
    throw new Error(`${filePath}: missing trade element`);
  }
  const tradeHeader = firstBlock(trade, "tradeHeader");
  if (!tradeHeader) {
    throw new Error(`${filePath}: missing tradeHeader`);
  }
  const tradeIdentifiers = allBlocks(tradeHeader, "partyTradeIdentifier")
    .map((block) => firstText(block.body, "tradeId"))
    .filter((value): value is string => typeof value === "string" && value.length > 0);
  const commoditySwapOpenTag = firstOpenTag(trade, "commoditySwap");
  const commoditySwap = firstBlock(trade, "commoditySwap");
  if (!commoditySwap) {
    throw new Error(`${filePath}: missing commoditySwap`);
  }
  const legs = [
    ...allBlocks(commoditySwap, "fixedLeg").map((block, index) => extractLeg(block.body, "fixedLeg", index + 1)),
    ...allBlocks(commoditySwap, "floatingLeg").map((block, index) => extractLeg(block.body, "floatingLeg", index + 1 + allBlocks(commoditySwap, "fixedLeg").length))
  ];
  const partyRefs = unique([
    ...allOpenTags(commoditySwap, "payerPartyReference").map((tag) => attr(tag, "href")),
    ...allOpenTags(commoditySwap, "receiverPartyReference").map((tag) => attr(tag, "href"))
  ]);
  const parties = allBlocks(xml, "party").map((block) => {
    const xmlId = attr(block.openTag, "id");
    const partyId = firstText(block.body, "partyId") || xmlId;
    return {
      xml_id: xmlId,
      party_id: partyId,
      party_name: firstText(block.body, "partyName") || partyId
    };
  });
  const documentation = firstBlock(trade, "documentation");
  const masterAgreement = firstBlock(documentation, "masterAgreement");
  return {
    source_standard: "FpML",
    source_view: "confirmation",
    fpml_version: attr(rootOpenTag, "fpmlVersion"),
    trade_xml_id: attr(tradeOpenTag, "id"),
    trade_id: tradeIdentifiers[0] ?? "",
    trade_identifiers: tradeIdentifiers,
    trade_date: firstText(tradeHeader, "tradeDate") ?? "",
    product: {
      product_xml_id: attr(commoditySwapOpenTag, "id"),
      product_type: firstText(commoditySwap, "productType") ?? "",
      product_id: firstText(commoditySwap, "productId") ?? "",
      asset_class: firstText(commoditySwap, "primaryAssetClass") ?? firstText(commoditySwap, "assetClass") ?? "",
      effective_date: firstText(firstBlock(commoditySwap, "effectiveDate"), "unadjustedDate") ?? firstText(commoditySwap, "effectiveDate") ?? "",
      termination_date: firstText(firstBlock(commoditySwap, "terminationDate"), "unadjustedDate") ?? firstText(commoditySwap, "terminationDate") ?? "",
      legs,
      leg_count: legs.length
    },
    party_refs: partyRefs,
    parties,
    agreement: {
      type: firstText(masterAgreement, "masterAgreementType"),
      date: firstText(masterAgreement, "masterAgreementDate"),
      version: firstText(masterAgreement, "masterAgreementVersion")
    }
  };
}
