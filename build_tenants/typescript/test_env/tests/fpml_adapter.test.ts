import assert from "node:assert/strict";
import { mkdtemp, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { parseFpmlTrade } from "../../code/src/index.ts";

const testDir = path.dirname(fileURLToPath(import.meta.url));
const tenantRoot = path.resolve(testDir, "../..");

test("FpML adapter parses the retained namespaced corpus with string-preserving XML semantics", async () => {
  const observation = await parseFpmlTrade(path.resolve(
    tenantRoot,
    "../../examples/trade_source_model/sources/data/authority/com-ex28-gas-swap-daily-delivery-prices-option-last.xml"
  ));
  assert.equal(observation.fpml_version, "5-12");
  assert.equal(observation.trade_id, "1234");
  assert.equal(observation.trade_date, "2006-06-01");
  assert.equal(observation.product.leg_count, 2);
  assert.equal(observation.product.legs[0]?.fixed_price, "6.295");
  assert.equal(observation.product.legs[1]?.commodity_instrument_id, "NATURAL GAS-HENRY HUB-NYMEX");
  assert.deepEqual(observation.party_refs, ["partyA", "partyB"]);
});

test("FpML adapter rejects malformed XML before semantic extraction", async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), "odd-wm-malformed-fpml-"));
  const filePath = path.join(directory, "malformed.xml");
  await writeFile(filePath, "<dataDocument><trade></dataDocument>", "utf8");
  await assert.rejects(parseFpmlTrade(filePath), /malformed XML/);
});
