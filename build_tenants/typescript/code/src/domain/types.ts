export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonObject | JsonValue[];
export type JsonObject = { [key: string]: JsonValue };

export type ExampleBuilderKind = "domain_input_seed" | "fpml_source_seed";

export interface SandboxBuilderConfig {
  configuration_version: "v1";
  workspace_kind: "installed_example_sandbox";
  builder: {
    kind: ExampleBuilderKind;
    self_test_program: "build_and_query_world_model";
  };
  domain: Record<string, JsonValue>;
}

export interface ExampleDescriptor {
  exampleName: string;
  exampleRoot: string;
  sandboxRoot: string;
  artifactSlug: string;
  builderKind: ExampleBuilderKind;
}

export interface ExampleRunResult {
  exampleName: string;
  builderKind: ExampleBuilderKind;
  artifactSlug: string;
  sandboxRoot: string;
  status: "ok";
  completedEdges: string[];
  keyOutputs: Record<string, string>;
}

export interface ComparisonResult {
  exampleName: string;
  status: "ok" | "missing_reference" | "mismatch";
  referenceSandbox: string;
  generatedSandbox: string;
  checks: Array<{
    name: string;
    status: "ok" | "missing" | "mismatch";
    detail: string;
  }>;
}
