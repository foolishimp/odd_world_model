import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import type { Ajv } from "ajv";
import { Ajv2020 } from "ajv/dist/2020.js";
import type { FormatsPlugin } from "ajv-formats";
import * as addFormatsModule from "ajv-formats";

export async function loadCommonSchemaValidator(schemaRoot: string): Promise<Ajv> {
  const ajv = new Ajv2020({ allErrors: true, strict: true });
  const addFormats = addFormatsModule.default as unknown as FormatsPlugin;
  addFormats(ajv);
  const names = (await readdir(schemaRoot)).filter((name) => name.endsWith(".schema.json")).sort();
  for (const name of names) {
    const schema = JSON.parse(await readFile(path.join(schemaRoot, name), "utf8")) as Record<string, unknown>;
    ajv.addSchema(schema);
  }
  return ajv;
}
