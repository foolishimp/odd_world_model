import { spawn } from "node:child_process";
import {
  decodeVerifyResult,
  decodeWriteResult,
  encodeStorageRequest,
  buildPhysicalCutWriteRequest,
  type PhysicalCutStore,
  type PhysicalCutVerifyRequest,
  type PhysicalCutVerifyResult,
  type PhysicalCutWritePlan,
  type PhysicalCutWriteResult
} from "./physical_cut_store.ts";

export interface PythonPhysicalCutStoreOptions {
  readonly pythonExecutable: string;
  readonly moduleRoot: string;
  readonly environment: Readonly<Record<string, string>>;
  readonly moduleName?: string;
}

export class PythonPhysicalCutStore implements PhysicalCutStore {
  readonly #pythonExecutable: string;
  readonly #moduleRoot: string;
  readonly #environment: Readonly<Record<string, string>>;
  readonly #moduleName: string;

  constructor(options: PythonPhysicalCutStoreOptions) {
    if (options.pythonExecutable.length === 0) throw new Error("pythonExecutable must not be empty");
    if (options.moduleRoot.length === 0) throw new Error("moduleRoot must not be empty");
    this.#pythonExecutable = options.pythonExecutable;
    this.#moduleRoot = options.moduleRoot;
    this.#environment = Object.freeze({ ...options.environment });
    this.#moduleName = options.moduleName ?? "odd_world_model_storage";
  }

  async writeCut(plan: PhysicalCutWritePlan): Promise<PhysicalCutWriteResult> {
    const request = buildPhysicalCutWriteRequest(plan);
    return decodeWriteResult(await this.#invoke(encodeStorageRequest(request)), request);
  }

  async verifyCut(request: PhysicalCutVerifyRequest): Promise<PhysicalCutVerifyResult> {
    return decodeVerifyResult(await this.#invoke(encodeStorageRequest(request)), request);
  }

  async #invoke(input: string): Promise<string> {
    return await new Promise<string>((resolve, reject) => {
      const child = spawn(this.#pythonExecutable, ["-m", this.#moduleName], {
        cwd: this.#moduleRoot,
        env: { ...process.env, ...this.#environment },
        stdio: ["pipe", "pipe", "pipe"]
      });
      let stdout = "";
      let stderr = "";
      child.stdout.setEncoding("utf8");
      child.stderr.setEncoding("utf8");
      child.stdout.on("data", (chunk: string) => { stdout += chunk; });
      child.stderr.on("data", (chunk: string) => { stderr += chunk; });
      child.on("error", reject);
      child.on("close", (code) => {
        if (stderr.length > 0) {
          reject(new Error(`physical cut store wrote stderr: ${stderr.trim()}`));
          return;
        }
        if (code !== 0 && code !== 2) {
          reject(new Error(`physical cut store exited ${code} without a protocol result`));
          return;
        }
        const lines = stdout.trimEnd().split("\n");
        if (lines.length !== 1 || lines[0] === undefined || lines[0].length === 0) {
          reject(new Error("physical cut store must return exactly one non-empty JSON line"));
          return;
        }
        resolve(lines[0]);
      });
      child.stdin.end(input);
    });
  }
}
