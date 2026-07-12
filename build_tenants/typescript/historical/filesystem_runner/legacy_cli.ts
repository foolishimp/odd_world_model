// Historical comparison entry point. It is not packaged, tested, or product-authoritative.
import { compareExamples, runExamples } from "./run_examples.ts";

function takeValue(args: string[], name: string, defaultValue?: string): string | undefined {
  const index = args.indexOf(name);
  if (index === -1) return defaultValue;
  const value = args[index + 1];
  if (!value) {
    throw new Error(`${name} requires a value`);
  }
  return value;
}

function hasFlag(args: string[], name: string): boolean {
  return args.includes(name);
}

async function main(argv: string[]): Promise<number> {
  const [command, ...args] = argv;
  const workspace = takeValue(args, "--workspace", ".") ?? ".";
  if (command === "run-examples") {
    const runId = takeValue(args, "--run-id");
    const clean = !hasFlag(args, "--no-clean");
    const payload = await runExamples(workspace, runId === undefined ? { clean } : { runId, clean });
    console.log(JSON.stringify({ status: "ok", command, ...payload }, null, 2));
    return 0;
  }
  if (command === "compare-examples") {
    const runId = takeValue(args, "--run-id");
    if (!runId) {
      throw new Error("compare-examples requires --run-id");
    }
    const referenceRunId = takeValue(args, "--reference-run-id", "20260419T000000Z_v1") ?? "20260419T000000Z_v1";
    const comparisons = await compareExamples(workspace, runId, referenceRunId);
    const status = comparisons.every((comparison) => comparison.status === "ok") ? "ok" : "mismatch";
    console.log(JSON.stringify({ status, command, runId, referenceRunId, comparisons }, null, 2));
    return status === "ok" ? 0 : 1;
  }
  console.error("historical reference only: <run-examples|compare-examples> [--workspace .] [--run-id RUN]");
  return 2;
}

main(process.argv.slice(2)).then(
  (code) => {
    process.exitCode = code;
  },
  (error: unknown) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
);
