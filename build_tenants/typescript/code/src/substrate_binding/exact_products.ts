import {
  ABIOGENESIS_SUBSTRATE_PROVENANCE,
  interpretStartupRegistryState,
  ODD_GLC_LIFECYCLE_PROGRAM_OVERLAY,
  ODD_GLC_STARTUP_BINDING
} from "@odd-glc/route-one-typescript";

export const EXACT_PROVING_PRODUCTS = Object.freeze({
  abiogenesis: Object.freeze({
    package_name: "@abiogenesis/typescript-tenant",
    package_version: "4.6.0-rc.3",
    release_tag: "v4.6.0-rc.3",
    source_commit: "5213301cdbfd35952badf19c27519caa9e7e6968",
    snapshot_commit: "f4f081f66ef8d3ce0c737ddb9d7530176711279a",
    tarball_sha256: "9cffb372c0dfc00983a5d0e882efbc3d0c3ac937a56f313000f35a4473358113"
  }),
  odd_glc: Object.freeze({
    package_name: "@odd-glc/route-one-typescript",
    package_version: "0.1.0",
    tarball_sha256: "7e548f92ecd6b4442f9c9f1feb46dd2edd7e9610a7dae8706482fc65d80fa578"
  })
});

export const WORLD_MODEL_GLC_BINDING = Object.freeze({
  startup_config_ref: ODD_GLC_STARTUP_BINDING.configRef,
  lifecycle_overlay_ref: ODD_GLC_LIFECYCLE_PROGRAM_OVERLAY.overlayRef,
  lifecycle_graph_ref: ODD_GLC_LIFECYCLE_PROGRAM_OVERLAY.graphRef,
  policy_refs: Object.freeze([...ODD_GLC_STARTUP_BINDING.policyRefs]),
  plugin_refs: Object.freeze([...ODD_GLC_STARTUP_BINDING.pluginRefs]),
  forbidden_authority: Object.freeze([
    ...ODD_GLC_LIFECYCLE_PROGRAM_OVERLAY.forbiddenAuthority
  ])
});

export interface ExactProductBindingEvidence {
  readonly kind: "odd_world_model.exact_product_binding_evidence";
  readonly abiogenesis_package: string;
  readonly abiogenesis_version: string;
  readonly abiogenesis_tarball_sha256: string;
  readonly odd_glc_package: string;
  readonly odd_glc_version: string;
  readonly odd_glc_tarball_sha256: string;
  readonly odd_glc_startup_config_ref: string;
  readonly odd_glc_lifecycle_overlay_ref: string;
  readonly compatibility_status: "compatible";
}

export function assertExactProductBinding(): ExactProductBindingEvidence {
  const consumed = ABIOGENESIS_SUBSTRATE_PROVENANCE.substrate;
  const expected = EXACT_PROVING_PRODUCTS.abiogenesis;
  if (
    consumed.packageName !== expected.package_name ||
    consumed.packageVersion !== expected.package_version ||
    consumed.releaseTag !== expected.release_tag ||
    consumed.sourceCommit !== expected.source_commit ||
    consumed.snapshotCommit !== expected.snapshot_commit ||
    consumed.tarballSha256 !== expected.tarball_sha256
  ) {
    throw new Error("odd_glc consumed substrate does not match the exact WM proving product");
  }
  if (
    ODD_GLC_STARTUP_BINDING.version !== EXACT_PROVING_PRODUCTS.odd_glc.package_version ||
    ODD_GLC_STARTUP_BINDING.productNamespace !== "odd_glc"
  ) {
    throw new Error("odd_glc startup binding does not match the exact WM proving product");
  }
  return Object.freeze({
    kind: "odd_world_model.exact_product_binding_evidence",
    abiogenesis_package: expected.package_name,
    abiogenesis_version: expected.package_version,
    abiogenesis_tarball_sha256: expected.tarball_sha256,
    odd_glc_package: EXACT_PROVING_PRODUCTS.odd_glc.package_name,
    odd_glc_version: EXACT_PROVING_PRODUCTS.odd_glc.package_version,
    odd_glc_tarball_sha256: EXACT_PROVING_PRODUCTS.odd_glc.tarball_sha256,
    odd_glc_startup_config_ref: WORLD_MODEL_GLC_BINDING.startup_config_ref,
    odd_glc_lifecycle_overlay_ref: WORLD_MODEL_GLC_BINDING.lifecycle_overlay_ref,
    compatibility_status: "compatible"
  });
}

export function interpretWorldModelStartupRegistry(input: {
  readonly startOutput: unknown;
  readonly runtimeEvents: readonly unknown[];
}) {
  return interpretStartupRegistryState({
    proof: { startOutput: input.startOutput },
    runtimeEvents: input.runtimeEvents,
    liveArtifacts: []
  });
}
