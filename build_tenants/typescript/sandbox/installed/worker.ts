#!/usr/bin/env node

import { buildReferenceSandbox } from "./reference_builder.ts";
import { fileURLToPath } from "node:url";
import {
  protocolFailure,
  type SandboxBuildRequest,
  type SandboxBuildResponse
} from "./protocol.ts";

async function readOneLine(): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) chunks.push(Buffer.from(chunk));
  const input = Buffer.concat(chunks).toString("utf8");
  const lines = input.split(/\r?\n/u).filter((line) => line.length > 0);
  if (lines.length !== 1) throw new Error("sandbox worker expects exactly one JSON request line");
  return lines[0]!;
}

async function main(): Promise<void> {
  let instanceRef: string | null = null;
  let response: SandboxBuildResponse;
  try {
    const request = JSON.parse(await readOneLine()) as SandboxBuildRequest;
    instanceRef = typeof request.instance_ref === "string" ? request.instance_ref : null;
    response = await buildReferenceSandbox(request, fileURLToPath(import.meta.url));
  } catch (error: unknown) {
    response = protocolFailure(error, instanceRef);
    process.exitCode = 2;
  }
  process.stdout.write(`${JSON.stringify(response)}\n`);
}

await main();
