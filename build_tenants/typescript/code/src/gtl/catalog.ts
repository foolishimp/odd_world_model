import { sha256Digest } from "../domain/canonical.ts";
import {
  constructGtlLibraryEntryDeclaration,
  constructProductRegistryStartupConfig,
  type GtlLibraryEntryDeclaration
} from "../substrate_binding/rc3_api.ts";
import {
  EXACT_PROVING_PRODUCTS,
  WORLD_MODEL_GLC_BINDING,
  assertExactProductBinding
} from "../substrate_binding/exact_products.ts";
import {
  DEFERRED_GRAPH_FUNCTION_HANDLES,
  PRIVATE_GRAPH_FUNCTION_HANDLES,
  PUBLIC_GRAPH_FUNCTION_HANDLES,
  computeRegimesForHandle,
  privateGraphFunctions,
  publicGraphFunctions
} from "./graph_functions.ts";
import { WORLD_MODEL_MODULE_REF, WORLD_MODEL_OVERLAY_REF } from "./module.ts";
import { graphFunctionHandlePath } from "./identifiers.ts";

export const WORLD_MODEL_GTL_CATALOG_VERSION = "0.1.0-proving.1";

export type GraphFunctionCatalogVisibility = "public" | "private";
export type GraphFunctionCatalogAvailability = "runnable" | "refinement_only" | "deferred";
export type GraphFunctionExecutionMode = "reference_digest_bridge" | "deferred";

export interface WorldModelGraphFunctionCatalogEntry {
  readonly handle: string;
  readonly visibility: GraphFunctionCatalogVisibility;
  readonly availability: GraphFunctionCatalogAvailability;
  readonly execution_mode: GraphFunctionExecutionMode;
  readonly graph_function_ref: string | null;
  readonly input_asset_refs: readonly string[];
  readonly output_asset_refs: readonly string[];
  readonly compute_regimes: readonly ("F_D" | "F_P" | "F_H")[];
  readonly refinement_of: string | null;
  readonly module_ref: string | null;
  readonly runtime_entry_ref: string | null;
}

function runtimeEntryRef(handle: string): string {
  return `registry-entry://odd_world_model/${graphFunctionHandlePath(handle)}/v1`;
}

function catalogEntryForPublic(index: number): WorldModelGraphFunctionCatalogEntry {
  const graphFunction = publicGraphFunctions[index];
  const handle = PUBLIC_GRAPH_FUNCTION_HANDLES[index];
  if (graphFunction === undefined || handle === undefined) {
    throw new Error(`missing public catalog entry ${index}`);
  }
  const computeRegimes = computeRegimesForHandle(handle);
  return Object.freeze({
    handle,
    visibility: "public",
    availability: "runnable",
    execution_mode: "reference_digest_bridge",
    graph_function_ref: graphFunction.id,
    input_asset_refs: Object.freeze(graphFunction.inputs.map((node) => node.id)),
    output_asset_refs: Object.freeze(graphFunction.outputs.map((node) => node.id)),
    compute_regimes: Object.freeze([...computeRegimes]),
    refinement_of: null,
    module_ref: WORLD_MODEL_MODULE_REF,
    runtime_entry_ref: runtimeEntryRef(handle)
  });
}

function catalogEntryForPrivate(index: number): WorldModelGraphFunctionCatalogEntry {
  const graphFunction = privateGraphFunctions[index];
  const handle = PRIVATE_GRAPH_FUNCTION_HANDLES[index];
  if (graphFunction === undefined || handle === undefined) {
    throw new Error(`missing private catalog entry ${index}`);
  }
  const computeRegimes = computeRegimesForHandle(handle);
  return Object.freeze({
    handle,
    visibility: "private",
    availability: "refinement_only",
    execution_mode: "reference_digest_bridge",
    graph_function_ref: graphFunction.id,
    input_asset_refs: Object.freeze(graphFunction.inputs.map((node) => node.id)),
    output_asset_refs: Object.freeze(graphFunction.outputs.map((node) => node.id)),
    compute_regimes: Object.freeze([...computeRegimes]),
    refinement_of: PUBLIC_GRAPH_FUNCTION_HANDLES[0],
    module_ref: WORLD_MODEL_MODULE_REF,
    runtime_entry_ref: null
  });
}

export const WORLD_MODEL_GRAPH_FUNCTION_CATALOG = Object.freeze([
  ...publicGraphFunctions.map((_, index) => catalogEntryForPublic(index)),
  ...privateGraphFunctions.map((_, index) => catalogEntryForPrivate(index)),
  Object.freeze({
    handle: DEFERRED_GRAPH_FUNCTION_HANDLES[0],
    visibility: "public" as const,
    availability: "deferred" as const,
    execution_mode: "deferred" as const,
    graph_function_ref: null,
    input_asset_refs: Object.freeze([]),
    output_asset_refs: Object.freeze([]),
    compute_regimes: computeRegimesForHandle(DEFERRED_GRAPH_FUNCTION_HANDLES[0]),
    refinement_of: null,
    module_ref: null,
    runtime_entry_ref: null
  })
]);

export const WORLD_MODEL_GRAPH_FUNCTION_CATALOG_DIGEST = sha256Digest({
  schema_kind: "odd_world_model.gtl_graph_function_catalog",
  schema_version: "v1",
  catalog_version: WORLD_MODEL_GTL_CATALOG_VERSION,
  entries: WORLD_MODEL_GRAPH_FUNCTION_CATALOG
});

function declarationForPublic(index: number): GtlLibraryEntryDeclaration {
  const graphFunction = publicGraphFunctions[index];
  const catalogEntry = WORLD_MODEL_GRAPH_FUNCTION_CATALOG[index];
  if (
    graphFunction === undefined ||
    catalogEntry === undefined ||
    catalogEntry.runtime_entry_ref === null
  ) {
    throw new Error(`missing runnable graph-function declaration ${index}`);
  }
  const functionSlug = graphFunctionHandlePath(graphFunction.name);
  return constructGtlLibraryEntryDeclaration({
    declarationRef: `gtl-declaration://odd_world_model/${functionSlug}/v1`,
    entryRef: catalogEntry.runtime_entry_ref,
    libraryScope: "product",
    entryKind: "graph_function",
    namespace: "odd_world_model",
    ownerRef: "product://odd_world_model",
    version: WORLD_MODEL_GTL_CATALOG_VERSION,
    graphFunctionRef: graphFunction.id,
    interfaceRef: `interface://odd_world_model/${functionSlug}/v1`,
    sourceContractRef: graphFunction.inputs[0]?.schema.ref ?? "contract://odd_world_model/no-input/v1",
    targetContractRef: graphFunction.outputs[0]?.schema.ref ?? "contract://odd_world_model/no-output/v1",
    contextRefs: [
      "context://odd_world_model/product/v1",
      "context://odd_world_model/authority/v1",
      "context://odd_world_model/temporal/v1",
      "context://odd_world_model/lineage/v1"
    ],
    authorityRefs: [
      "authority://odd_world_model/product/v1",
      "authority://abiogenesis/runtime/v1"
    ],
    overlayRefs: [WORLD_MODEL_OVERLAY_REF, WORLD_MODEL_GLC_BINDING.lifecycle_overlay_ref],
    provenanceRefs: [
      `package:${EXACT_PROVING_PRODUCTS.abiogenesis.package_name}@${EXACT_PROVING_PRODUCTS.abiogenesis.package_version}#sha256:${EXACT_PROVING_PRODUCTS.abiogenesis.tarball_sha256}`,
      `package:${EXACT_PROVING_PRODUCTS.odd_glc.package_name}@${EXACT_PROVING_PRODUCTS.odd_glc.package_version}#sha256:${EXACT_PROVING_PRODUCTS.odd_glc.tarball_sha256}`,
      "build_tenants/common/design/adrs/ADR-WM-004-gtl-graph-function-catalog.md"
    ],
    readinessRefs: ["readiness://odd_world_model/first-slice-contract-prototype/v1"],
    proofRefs: [
      `proof://odd_world_model/${functionSlug}/component/v1`,
      "proof://odd_world_model/rc3-conformance/v1"
    ],
    policyRefs: [
      "policy://odd_world_model/authority-and-admission/v1",
      ...WORLD_MODEL_GLC_BINDING.policy_refs
    ],
    declarationSourceRefs: [WORLD_MODEL_MODULE_REF]
  });
}

assertExactProductBinding();

export const WORLD_MODEL_RUNTIME_DECLARATIONS = Object.freeze(
  publicGraphFunctions.map((_, index) => declarationForPublic(index))
);

export const WORLD_MODEL_PRODUCT_STARTUP_CONFIG = constructProductRegistryStartupConfig({
  configRef: "product-registry-startup://odd_world_model/context-memory/v1",
  productNamespace: "odd_world_model",
  ownerRef: "product://odd_world_model",
  version: WORLD_MODEL_GTL_CATALOG_VERSION,
  enabledLibraryRefs: [
    WORLD_MODEL_MODULE_REF,
    ...WORLD_MODEL_RUNTIME_DECLARATIONS.flatMap((declaration) => [
      declaration.entryRef,
      declaration.declarationRef
    ])
  ],
  overlayRefs: [WORLD_MODEL_OVERLAY_REF, WORLD_MODEL_GLC_BINDING.lifecycle_overlay_ref],
  pluginRefs: ["plugin://odd_world_model/context-interpretation/v1"],
  readinessRefs: [
    "readiness://odd_world_model/first-slice-contract-prototype/v1",
    "readiness://odd_world_model/abiogenesis-4.6.0-rc.3-bound/v1"
  ],
  proofRefs: [
    "proof://odd_world_model/rc3-conformance/v1",
    "proof://odd_world_model/semantic-contract-steel-thread/v1"
  ],
  policyRefs: [
    "policy://odd_world_model/authority-and-admission/v1",
    ...WORLD_MODEL_GLC_BINDING.policy_refs
  ],
  configSourceRefs: [
    "build_tenants/common/design/adrs/ADR-WM-004-gtl-graph-function-catalog.md",
    "build_tenants/typescript/DEPENDENCY_RESOLUTION.md",
    WORLD_MODEL_GLC_BINDING.startup_config_ref
  ]
});

export const WORLD_MODEL_RUNTIME_REGISTRY_STARTUP = Object.freeze({
  systemDeclarations: Object.freeze([]),
  productStartupConfig: WORLD_MODEL_PRODUCT_STARTUP_CONFIG,
  productDeclarations: WORLD_MODEL_RUNTIME_DECLARATIONS,
  causationEventRefs: Object.freeze(["decision://F_H/2026-07-12/full-build"]),
  correlationId: "correlation://odd_world_model/runtime-registry-startup/v1"
});

export function worldModelCatalogProjection() {
  return Object.freeze({
    schema_kind: "odd_world_model.gtl_graph_function_catalog",
    schema_version: "v1",
    catalog_version: WORLD_MODEL_GTL_CATALOG_VERSION,
    catalog_digest: WORLD_MODEL_GRAPH_FUNCTION_CATALOG_DIGEST,
    exact_product_binding: assertExactProductBinding(),
    module_ref: WORLD_MODEL_MODULE_REF,
    overlay_refs: Object.freeze([
      WORLD_MODEL_OVERLAY_REF,
      WORLD_MODEL_GLC_BINDING.lifecycle_overlay_ref
    ]),
    entries: WORLD_MODEL_GRAPH_FUNCTION_CATALOG
  });
}
