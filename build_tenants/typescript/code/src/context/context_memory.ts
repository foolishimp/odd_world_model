import { canonicalJson, isSha256Digest, sha256Digest } from "../domain/canonical.ts";
import {
  assertUniqueExactRefs,
  assertUniqueStrings,
  exactRefKey,
  normalizeExactRefs,
  requireText
} from "../domain/exact_refs.ts";
import {
  assertReplayDerivedAdmissionWitness,
  assertPublishedSemanticCutAuthority,
  exactRefForPublishedCut,
  type AbgAdmissionWitness,
  type PublishedSemanticCut
} from "../domain/semantic_publication.ts";
import type {
  BoundedMeshCut,
  ContextBasis,
  ContextBasisInput,
  ContextInvocationRecord,
  ContextInvocationRecordInput,
  ContextProjection,
  ExactRef,
  OmittedContextRef,
  SemanticLink,
  TypedGap
} from "../domain/semantic_memory.ts";
import type { JsonValue } from "../domain/types.ts";
import {
  assertPublishedSemanticLinkAuthority,
  exactRefForSemanticLink
} from "../domain/semantic_link_resolution.ts";
import { assertBoundedMeshCutClosure } from "../mesh/semantic_mesh.ts";

export interface ContextRenderItem {
  readonly exact_ref: ExactRef;
  readonly content: JsonValue;
}

export interface ContextCurrentState {
  readonly meshCutRef: ExactRef;
  readonly semanticCutRefs: readonly ExactRef[];
  readonly semanticLinkRefs: readonly ExactRef[];
  readonly sourceObservationRefs: readonly ExactRef[];
  readonly physicalSnapshotRefs: readonly ExactRef[];
  readonly projectionContractRef: string;
  readonly projectionContractVersion: string;
}

export interface ContextDependencyCatalog {
  readonly catalogRef: string;
  readonly meshCut: BoundedMeshCut;
  readonly publishedCuts: readonly PublishedSemanticCut[];
  readonly semanticLinks: readonly SemanticLink[];
  readonly projectionContracts: readonly Readonly<{
    ref: string;
    version: string;
  }>[];
}

interface ResolvedContextCurrentState {
  readonly state: ContextCurrentState;
  readonly catalog: ExactRef;
}

function requireTimestamp(value: string, label: string): void {
  requireText(value, label);
  if (Number.isNaN(Date.parse(value))) throw new Error(`${label} must be a timestamp`);
}

function exactPublicationCatalog(publishedCuts: readonly PublishedSemanticCut[]): Map<string, ExactRef> {
  const catalog = new Map<string, ExactRef>();
  for (const cut of publishedCuts) {
    assertPublishedSemanticCutAuthority(cut);
    if (catalog.has(cut.semantic_cut_ref)) throw new Error(`published cut catalog repeats ${cut.semantic_cut_ref}`);
    catalog.set(cut.semantic_cut_ref, exactRefForPublishedCut(cut));
  }
  return catalog;
}

function exactLinkCatalog(links: readonly SemanticLink[]): Map<string, ExactRef> {
  const catalog = new Map<string, ExactRef>();
  for (const link of links) {
    assertPublishedSemanticLinkAuthority(link);
    if (catalog.has(link.link_ref)) throw new Error(`semantic link catalog repeats ${link.link_ref}`);
    catalog.set(link.link_ref, exactRefForSemanticLink(link));
  }
  return catalog;
}

function dependencyDigest(input: ContextCurrentState): `sha256:${string}` {
  return sha256Digest({
    mesh_cut: input.meshCutRef,
    semantic_cut_refs: input.semanticCutRefs,
    semantic_link_refs: input.semanticLinkRefs,
    source_observation_refs: input.sourceObservationRefs,
    physical_snapshot_refs: input.physicalSnapshotRefs,
    projection_contract_ref: input.projectionContractRef,
    projection_contract_version: input.projectionContractVersion
  });
}

export function resolveContextCurrentState(
  basis: ContextBasis,
  catalog: ContextDependencyCatalog
): ResolvedContextCurrentState {
  assertContextBasisDigest(basis);
  requireText(catalog.catalogRef, "context dependency catalog ref");
  assertBoundedMeshCutClosure(catalog.meshCut, catalog.publishedCuts, catalog.semanticLinks);
  const publications = new Map<string, PublishedSemanticCut>();
  for (const cut of catalog.publishedCuts) {
    assertPublishedSemanticCutAuthority(cut);
    if (publications.has(cut.semantic_cut_ref)) {
      throw new Error(`context dependency catalog repeats ${cut.semantic_cut_ref}`);
    }
    publications.set(cut.semantic_cut_ref, cut);
  }
  for (const link of catalog.semanticLinks) assertPublishedSemanticLinkAuthority(link);
  const projectionContracts = new Map<string, string>();
  for (const contract of catalog.projectionContracts) {
    requireText(contract.ref, "projection contract ref");
    requireText(contract.version, "projection contract version");
    if (projectionContracts.has(contract.ref)) {
      throw new Error(`context dependency catalog repeats projection contract ${contract.ref}`);
    }
    projectionContracts.set(contract.ref, contract.version);
  }
  const projectionContractVersion = projectionContracts.get(basis.projection_contract_ref);
  if (projectionContractVersion === undefined) {
    throw new Error(`current projection contract ${basis.projection_contract_ref} is unresolved`);
  }
  const state: ContextCurrentState = {
    meshCutRef: { ref: catalog.meshCut.mesh_cut_ref, digest: catalog.meshCut.mesh_cut_digest },
    semanticCutRefs: catalog.meshCut.node_refs,
    semanticLinkRefs: catalog.meshCut.link_refs,
    sourceObservationRefs: normalizeExactRefs(catalog.meshCut.node_refs.map((node) => {
      const cut = publications.get(node.ref);
      if (cut === undefined || exactRefKey(exactRefForPublishedCut(cut)) !== exactRefKey(node)) {
        throw new Error(`current mesh node ${node.ref} is not an exact published cut`);
      }
      return cut.source_observation;
    }), "current source-observation closure"),
    physicalSnapshotRefs: normalizeExactRefs(catalog.meshCut.node_refs.flatMap((node) => {
      const cut = publications.get(node.ref);
      if (cut === undefined || exactRefKey(exactRefForPublishedCut(cut)) !== exactRefKey(node)) {
        throw new Error(`current mesh node ${node.ref} is not an exact published cut`);
      }
      return cut.snapshot_refs;
    }), "current physical snapshot closure"),
    projectionContractRef: basis.projection_contract_ref,
    projectionContractVersion
  };
  const catalogDigest = sha256Digest({
    mesh_cut: state.meshCutRef,
    semantic_cut_refs: state.semanticCutRefs,
    semantic_link_refs: state.semanticLinkRefs,
    projection_contracts: [...projectionContracts.entries()].sort(([left], [right]) => left.localeCompare(right))
  });
  return Object.freeze({
    state: Object.freeze(state),
    catalog: Object.freeze({ ref: catalog.catalogRef, digest: catalogDigest })
  });
}

export function assertContextBasisDigest(basis: ContextBasis): void {
  requireText(basis.basis_ref, "context basis ref");
  requireText(basis.interaction_goal, "context basis interaction goal");
  assertUniqueExactRefs([basis.mesh_cut], "context basis mesh_cut");
  assertUniqueExactRefs(basis.semantic_cut_refs, "context basis semantic_cut_refs");
  assertUniqueExactRefs(basis.semantic_link_refs, "context basis semantic_link_refs");
  assertUniqueExactRefs(basis.source_observation_refs, "context basis source_observation_refs");
  assertUniqueExactRefs(basis.physical_snapshot_refs, "context basis physical_snapshot_refs");
  assertUniqueStrings(basis.losses, "context basis losses");
  assertUniqueExactRefs(
    basis.exclusions.map((item) => item.exact_ref),
    "context basis exclusions"
  );
  for (const exclusion of basis.exclusions) requireText(exclusion.reason, "context basis exclusion reason");
  requireText(basis.projection_contract_ref, "context basis projection contract");
  requireText(basis.projection_contract_version, "context basis projection contract version");
  requireText(basis.selection_policy_ref, "context basis selection policy");
  assertUniqueStrings(basis.source_authority_refs, "context basis source_authority_refs");
  assertUniqueStrings(basis.semantic_authority_refs, "context basis semantic_authority_refs");
  if (basis.source_authority_refs.length === 0 || basis.semantic_authority_refs.length === 0) {
    throw new Error("context basis requires source and semantic authorities");
  }
  if (Object.keys(basis.temporal_coordinates).length === 0) {
    throw new Error("context basis requires temporal coordinates");
  }
  requireTimestamp(basis.freshness.evaluated_at, "context basis freshness evaluated_at");
  if (!isSha256Digest(basis.freshness.dependency_digest)) {
    throw new Error("context basis freshness dependency_digest is not sha256");
  }
  const expectedDependencyDigest = dependencyDigest({
    meshCutRef: basis.mesh_cut,
    semanticCutRefs: basis.semantic_cut_refs,
    semanticLinkRefs: basis.semantic_link_refs,
    sourceObservationRefs: basis.source_observation_refs,
    physicalSnapshotRefs: basis.physical_snapshot_refs,
    projectionContractRef: basis.projection_contract_ref,
    projectionContractVersion: basis.projection_contract_version
  });
  if (basis.freshness.dependency_digest !== expectedDependencyDigest) {
    throw new Error("context basis freshness dependency digest mismatch");
  }
  requireText(basis.truncation.limit_ref, "context basis truncation limit_ref");
  if (
    !Number.isSafeInteger(basis.truncation.omitted_count) ||
    basis.truncation.omitted_count < 0 ||
    basis.truncation.omitted_count > basis.semantic_cut_refs.length + basis.semantic_link_refs.length
  ) {
    throw new Error("context basis truncation omitted_count is invalid");
  }
  if (basis.truncation.applied !== (basis.truncation.omitted_count > 0)) {
    throw new Error("context basis truncation applied flag is inconsistent");
  }
  if (basis.truncation.applied && !basis.losses.includes("context_window_truncation")) {
    throw new Error("context basis truncation requires a declared context_window_truncation loss");
  }
  const expectedFidelity =
    basis.truncation.applied ||
    basis.losses.length > 0 ||
    basis.exclusions.length > 0 ||
    basis.unresolved_gaps.length > 0
      ? "lossy_projection"
      : "lossless_projection";
  if (basis.fidelity !== expectedFidelity) {
    throw new Error(`context basis fidelity must be ${expectedFidelity}`);
  }
  requireTimestamp(basis.resolved_at, "context basis resolved_at");
  const { basis_digest: recorded, ...digestInput } = basis;
  const expected = sha256Digest(digestInput);
  if (recorded !== expected) throw new Error(`context basis digest mismatch: expected ${expected}`);
}

export function assertContextProjectionDigest(projection: ContextProjection): void {
  requireText(projection.projection_ref, "context projection ref");
  assertUniqueExactRefs([projection.context_basis], "context projection basis");
  assertUniqueExactRefs(projection.included_refs, "context projection included_refs");
  assertUniqueStrings(projection.losses, "context projection losses");
  assertUniqueExactRefs(
    projection.omitted_refs.map((item) => item.exact_ref),
    "context projection omitted_refs"
  );
  for (const omission of projection.omitted_refs) requireText(omission.reason, "context projection omission reason");
  if (projection.content_digest !== sha256Digest(projection.content)) {
    throw new Error("context projection content digest mismatch");
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(projection.content);
  } catch (error: unknown) {
    throw new Error(`context projection content is not JSON: ${String(error)}`);
  }
  if (canonicalJson(parsed) !== projection.content) {
    throw new Error("context projection content is not canonical JSON");
  }
  if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("context projection content must be an object");
  }
  const content = parsed as Record<string, unknown>;
  const contentBasis = content.context_basis;
  if (contentBasis === null || typeof contentBasis !== "object" || Array.isArray(contentBasis)) {
    throw new Error("context projection content has no exact basis");
  }
  const basisRecord = contentBasis as Record<string, unknown>;
  if (
    basisRecord.ref !== projection.context_basis.ref ||
    basisRecord.digest !== projection.context_basis.digest
  ) {
    throw new Error("context projection content identifies a different basis");
  }
  if (!Array.isArray(content.items)) throw new Error("context projection content items must be an array");
  const renderedRefs = content.items.map((item, index) => {
    if (item === null || typeof item !== "object" || Array.isArray(item)) {
      throw new Error(`context projection content item ${index} is invalid`);
    }
    const exactRef = (item as Record<string, unknown>).exact_ref;
    if (exactRef === null || typeof exactRef !== "object" || Array.isArray(exactRef)) {
      throw new Error(`context projection content item ${index} has no exact ref`);
    }
    const refRecord = exactRef as Record<string, unknown>;
    if (typeof refRecord.ref !== "string" || typeof refRecord.digest !== "string") {
      throw new Error(`context projection content item ${index} has an invalid exact ref`);
    }
    return {
      ref: refRecord.ref,
      digest: refRecord.digest as ExactRef["digest"],
      ...(typeof refRecord.version === "string" ? { version: refRecord.version } : {})
    } satisfies ExactRef;
  });
  assertUniqueExactRefs(renderedRefs, "context projection rendered refs");
  if (
    renderedRefs.length !== projection.included_refs.length ||
    renderedRefs.some((ref, index) => exactRefKey(ref) !== exactRefKey(projection.included_refs[index]!))
  ) {
    throw new Error("context projection rendered refs do not match included_refs");
  }
  if (projection.omitted_refs.length !== projection.truncation.omitted_count) {
    throw new Error("context projection omitted refs do not match truncation count");
  }
  assertUniqueExactRefs(
    projection.exclusions.map((item) => item.exact_ref),
    "context projection exclusions"
  );
  for (const exclusion of projection.exclusions) requireText(exclusion.reason, "context projection exclusion reason");
  if (
    canonicalJson(content.exclusions) !== canonicalJson(projection.exclusions) ||
    canonicalJson(content.omitted_refs) !== canonicalJson(projection.omitted_refs) ||
    canonicalJson(content.losses) !== canonicalJson(projection.losses) ||
    canonicalJson(content.truncation) !== canonicalJson(projection.truncation) ||
    canonicalJson(content.unresolved_gaps) !== canonicalJson(projection.unresolved_gaps) ||
    content.fidelity !== projection.fidelity
  ) {
    throw new Error("context projection content disclosure differs from projection metadata");
  }
  const includedKeys = new Set(projection.included_refs.map(exactRefKey));
  if (projection.omitted_refs.some((item) => includedKeys.has(exactRefKey(item.exact_ref)))) {
    throw new Error("context projection includes and omits the same exact ref");
  }
  requireText(projection.truncation.limit_ref, "context projection truncation limit_ref");
  if (
    !Number.isSafeInteger(projection.truncation.omitted_count) ||
    projection.truncation.omitted_count < 0 ||
    projection.truncation.applied !== (projection.truncation.omitted_count > 0)
  ) {
    throw new Error("context projection truncation metadata is inconsistent");
  }
  if (projection.truncation.applied && !projection.losses.includes("context_window_truncation")) {
    throw new Error("context projection truncation requires a declared context_window_truncation loss");
  }
  const expectedFidelity =
    projection.truncation.applied ||
    projection.losses.length > 0 ||
    projection.exclusions.length > 0 ||
    projection.unresolved_gaps.length > 0
      ? "lossy_projection"
      : "lossless_projection";
  if (projection.fidelity !== expectedFidelity) {
    throw new Error(`context projection fidelity must be ${expectedFidelity}`);
  }
  requireTimestamp(projection.created_at, "context projection created_at");
  const { projection_digest: recorded, ...digestInput } = projection;
  const expected = sha256Digest(digestInput);
  if (recorded !== expected) throw new Error(`context projection digest mismatch: expected ${expected}`);
}

export function assertContextProjectionMatchesBasis(
  projection: ContextProjection,
  basis: ContextBasis
): void {
  assertContextBasisDigest(basis);
  assertContextProjectionDigest(projection);
  if (
    projection.context_basis.ref !== basis.basis_ref ||
    projection.context_basis.digest !== basis.basis_digest
  ) {
    throw new Error("context projection does not identify the supplied exact basis");
  }
  if (projection.projection_contract_ref !== basis.projection_contract_ref) {
    throw new Error("context projection uses a different projection contract");
  }
  for (const [label, actual, expected] of [
    ["losses", projection.losses, basis.losses],
    ["exclusions", projection.exclusions, basis.exclusions],
    ["truncation", projection.truncation, basis.truncation],
    ["unresolved gaps", projection.unresolved_gaps, basis.unresolved_gaps]
  ] as const) {
    if (canonicalJson(actual) !== canonicalJson(expected)) {
      throw new Error(`context projection ${label} differ from its exact basis`);
    }
  }
  if (projection.fidelity !== basis.fidelity) {
    throw new Error("context projection fidelity differs from its exact basis");
  }
  const expectedPartition = [...basis.semantic_cut_refs, ...basis.semantic_link_refs];
  const actualPartition = [
    ...projection.included_refs,
    ...projection.omitted_refs.map((item) => item.exact_ref)
  ];
  if (
    actualPartition.length !== expectedPartition.length ||
    actualPartition.some((item, index) => exactRefKey(item) !== exactRefKey(expectedPartition[index]!))
  ) {
    throw new Error("context projection item partition differs from its exact basis");
  }
  const content = JSON.parse(projection.content) as Record<string, unknown>;
  const expectedDependencies = {
    mesh_cut: basis.mesh_cut,
    source_observation_refs: basis.source_observation_refs,
    physical_snapshot_refs: basis.physical_snapshot_refs,
    projection_contract_ref: basis.projection_contract_ref,
    projection_contract_version: basis.projection_contract_version,
    temporal_coordinates: basis.temporal_coordinates,
    source_authority_refs: basis.source_authority_refs,
    semantic_authority_refs: basis.semantic_authority_refs
  };
  if (
    content.interaction_goal !== basis.interaction_goal ||
    canonicalJson(content.basis_dependencies) !== canonicalJson(expectedDependencies)
  ) {
    throw new Error("context projection rendered basis differs from its exact basis");
  }
}

export function assertContextInvocationRecordDigest(record: ContextInvocationRecord): void {
  requireText(record.invocation_ref, "context invocation ref");
  assertUniqueExactRefs([record.context_basis], "context invocation basis");
  assertUniqueExactRefs([record.context_projection], "context invocation projection");
  assertUniqueExactRefs([record.admission], "context invocation admission");
  assertUniqueExactRefs([record.freshness_catalog], "context invocation freshness catalog");
  requireText(record.model_identity, "context invocation model identity");
  requireText(record.output_proposal_ref, "context invocation output proposal ref");
  assertUniqueStrings(record.abg_event_refs, "context invocation abg_event_refs");
  if (!isSha256Digest(record.output_digest)) throw new Error("context invocation output_digest is not sha256");
  requireTimestamp(record.invoked_at, "context invocation invoked_at");
  requireTimestamp(record.completed_at, "context invocation completed_at");
  if (Date.parse(record.completed_at) < Date.parse(record.invoked_at)) {
    throw new Error("context invocation completed before it was invoked");
  }
  const { invocation_digest: recorded, ...digestInput } = record;
  const expected = sha256Digest(digestInput);
  if (recorded !== expected) throw new Error(`context invocation digest mismatch: expected ${expected}`);
}

export function createContextBasis(
  input: ContextBasisInput,
  meshCut: BoundedMeshCut,
  publishedCuts: readonly PublishedSemanticCut[],
  semanticLinks: readonly SemanticLink[]
): ContextBasis {
  assertBoundedMeshCutClosure(meshCut, publishedCuts, semanticLinks);
  requireText(input.basis_ref, "basis_ref");
  requireText(input.projection_contract_ref, "projection_contract_ref");
  requireText(input.projection_contract_version, "projection_contract_version");
  requireText(input.freshness_policy_ref, "freshness_policy_ref");
  requireText(input.truncation_limit_ref, "truncation_limit_ref");
  requireTimestamp(input.freshness_evaluated_at, "freshness_evaluated_at");
  requireTimestamp(input.resolved_at, "resolved_at");
  if (!Number.isSafeInteger(input.truncation_max_items) || input.truncation_max_items < 1) {
    throw new Error("truncation_max_items must be a positive safe integer");
  }
  if (Object.keys(input.temporal_coordinates).length === 0) {
    throw new Error("context basis requires temporal coordinates");
  }
  for (const [role, value] of Object.entries(input.temporal_coordinates)) {
    requireText(role, "temporal coordinate role");
    requireText(value, `temporal_coordinates.${role}`);
  }
  assertUniqueStrings(input.source_authority_refs, "source_authority_refs");
  assertUniqueStrings(input.semantic_authority_refs, "semantic_authority_refs");
  if (input.source_authority_refs.length === 0 || input.semantic_authority_refs.length === 0) {
    throw new Error("context basis requires source and semantic authority refs");
  }
  assertUniqueStrings(input.declared_losses, "declared_losses");

  const publications = exactPublicationCatalog(publishedCuts);
  for (const node of meshCut.node_refs) {
    if (exactRefKey(publications.get(node.ref) ?? { ref: "missing", digest: sha256Digest("missing") }) !== exactRefKey(node)) {
      throw new Error(`mesh node ${node.ref} is not an exact published cut`);
    }
  }
  const links = exactLinkCatalog(semanticLinks);
  for (const link of meshCut.link_refs) {
    if (exactRefKey(links.get(link.ref) ?? { ref: "missing", digest: sha256Digest("missing") }) !== exactRefKey(link)) {
      throw new Error(`mesh link ${link.ref} is not an exact published link`);
    }
  }

  const expectedCount = meshCut.node_refs.length + meshCut.link_refs.length;
  const omittedCount = Math.max(0, expectedCount - input.truncation_max_items);
  const truncation = Object.freeze({
    applied: omittedCount > 0,
    limit_ref: input.truncation_limit_ref,
    omitted_count: omittedCount
  });
  const exclusions: OmittedContextRef[] = meshCut.excluded_refs.map((exactRef) => {
    const reason = input.exclusion_reasons?.[exactRef.ref];
    if (reason === undefined) throw new Error(`excluded ref ${exactRef.ref} requires a reason`);
    requireText(reason, `exclusion reason for ${exactRef.ref}`);
    return Object.freeze({ exact_ref: exactRef, reason });
  });
  const losses = Object.freeze([
    ...input.declared_losses,
    ...(truncation.applied && !input.declared_losses.includes("context_window_truncation")
      ? ["context_window_truncation"]
      : [])
  ]);
  const unresolvedGaps = Object.freeze([...meshCut.unresolved_gaps]);
  const fidelity = losses.length > 0 || exclusions.length > 0 || unresolvedGaps.length > 0
    ? "lossy_projection" as const
    : "lossless_projection" as const;
  const currentState: ContextCurrentState = {
    meshCutRef: { ref: meshCut.mesh_cut_ref, digest: meshCut.mesh_cut_digest },
    semanticCutRefs: meshCut.node_refs,
    semanticLinkRefs: meshCut.link_refs,
    sourceObservationRefs: normalizeExactRefs(
      meshCut.node_refs.map((node) => {
        const cut = publishedCuts.find((candidate) => candidate.semantic_cut_ref === node.ref);
        if (cut === undefined) throw new Error(`published cut ${node.ref} disappeared during basis construction`);
        return cut.source_observation;
      }),
      "mesh source-observation closure"
    ),
    physicalSnapshotRefs: normalizeExactRefs(
      meshCut.node_refs.flatMap((node) => {
        const cut = publishedCuts.find((candidate) => candidate.semantic_cut_ref === node.ref);
        if (cut === undefined) throw new Error(`published cut ${node.ref} disappeared during basis construction`);
        return cut.snapshot_refs;
      }),
      "mesh physical snapshot closure"
    ),
    projectionContractRef: input.projection_contract_ref,
    projectionContractVersion: input.projection_contract_version
  };
  const basisInput = {
    schema_kind: input.schema_kind,
    schema_version: input.schema_version,
    basis_ref: input.basis_ref,
    interaction_goal: meshCut.interaction_goal,
    mesh_cut: { ref: meshCut.mesh_cut_ref, digest: meshCut.mesh_cut_digest },
    semantic_cut_refs: meshCut.node_refs,
    semantic_link_refs: meshCut.link_refs,
    source_observation_refs: Object.freeze([...currentState.sourceObservationRefs]),
    physical_snapshot_refs: Object.freeze([...currentState.physicalSnapshotRefs]),
    projection_contract_ref: input.projection_contract_ref,
    projection_contract_version: input.projection_contract_version,
    selection_policy_ref: meshCut.selection_policy_ref,
    temporal_coordinates: Object.freeze({ ...input.temporal_coordinates }),
    source_authority_refs: Object.freeze([...input.source_authority_refs]),
    semantic_authority_refs: Object.freeze([...input.semantic_authority_refs]),
    freshness: Object.freeze({
      status: "fresh" as const,
      policy_ref: input.freshness_policy_ref,
      evaluated_at: input.freshness_evaluated_at,
      dependency_digest: dependencyDigest(currentState)
    }),
    fidelity,
    losses,
    exclusions: Object.freeze(exclusions),
    truncation,
    unresolved_gaps: unresolvedGaps,
    resolved_at: input.resolved_at
  };
  return Object.freeze({ ...basisInput, basis_digest: sha256Digest(basisInput) });
}

export function renderContextProjection(input: {
  readonly projectionRef: string;
  readonly basis: ContextBasis;
  readonly rendererRef: string;
  readonly items: readonly ContextRenderItem[];
  readonly createdAt: string;
}): ContextProjection {
  assertContextBasisDigest(input.basis);
  requireText(input.projectionRef, "projectionRef");
  requireText(input.rendererRef, "rendererRef");
  requireTimestamp(input.createdAt, "createdAt");
  assertUniqueExactRefs(input.items.map((item) => item.exact_ref), "items");
  const expected = [...input.basis.semantic_cut_refs, ...input.basis.semantic_link_refs];
  const itemMap = new Map(input.items.map((item) => [item.exact_ref.ref, item]));
  for (const exactRef of expected) {
    const item = itemMap.get(exactRef.ref);
    if (item === undefined || exactRefKey(item.exact_ref) !== exactRefKey(exactRef)) {
      throw new Error(`renderer lacks exact content for ${exactRef.ref}`);
    }
  }
  for (const item of input.items) {
    if (!expected.some((exactRef) => exactRefKey(exactRef) === exactRefKey(item.exact_ref))) {
      throw new Error(`renderer introduces hidden ref ${item.exact_ref.ref}`);
    }
  }
  const includedCount = expected.length - input.basis.truncation.omitted_count;
  const includedRefs = Object.freeze(expected.slice(0, includedCount));
  const omittedRefs = Object.freeze(expected.slice(includedCount).map((exactRef) => Object.freeze({
    exact_ref: exactRef,
    reason: `excluded by ${input.basis.truncation.limit_ref}`
  })));
  const content = canonicalJson({
    schema_kind: "odd_world_model.rendered_context_content",
    schema_version: "v1",
    context_basis: { ref: input.basis.basis_ref, digest: input.basis.basis_digest },
    interaction_goal: input.basis.interaction_goal,
    basis_dependencies: {
      mesh_cut: input.basis.mesh_cut,
      source_observation_refs: input.basis.source_observation_refs,
      physical_snapshot_refs: input.basis.physical_snapshot_refs,
      projection_contract_ref: input.basis.projection_contract_ref,
      projection_contract_version: input.basis.projection_contract_version,
      temporal_coordinates: input.basis.temporal_coordinates,
      source_authority_refs: input.basis.source_authority_refs,
      semantic_authority_refs: input.basis.semantic_authority_refs
    },
    fidelity: input.basis.fidelity,
    losses: input.basis.losses,
    exclusions: input.basis.exclusions,
    omitted_refs: omittedRefs,
    truncation: input.basis.truncation,
    unresolved_gaps: input.basis.unresolved_gaps,
    items: includedRefs.map((exactRef) => ({
      exact_ref: exactRef,
      content: itemMap.get(exactRef.ref)!.content
    }))
  });
  const projectionInput = {
    schema_kind: "odd_world_model.context_projection" as const,
    schema_version: "v1" as const,
    projection_ref: input.projectionRef,
    context_basis: { ref: input.basis.basis_ref, digest: input.basis.basis_digest },
    projection_contract_ref: input.basis.projection_contract_ref,
    renderer_ref: input.rendererRef,
    representation_kind: "canonical_json" as const,
    content,
    content_digest: sha256Digest(content),
    included_refs: includedRefs,
    omitted_refs: omittedRefs,
    exclusions: input.basis.exclusions,
    fidelity: input.basis.fidelity,
    losses: input.basis.losses,
    truncation: input.basis.truncation,
    unresolved_gaps: input.basis.unresolved_gaps,
    created_at: input.createdAt
  };
  return Object.freeze({ ...projectionInput, projection_digest: sha256Digest(projectionInput) });
}

export const createContextProjection = renderContextProjection;

function compareContextStaleness(
  basis: ContextBasis,
  current: ContextCurrentState
): TypedGap | null {
  assertContextBasisDigest(basis);
  assertUniqueExactRefs(current.semanticCutRefs, "current.semanticCutRefs");
  assertUniqueExactRefs(current.semanticLinkRefs, "current.semanticLinkRefs");
  assertUniqueExactRefs(current.sourceObservationRefs, "current.sourceObservationRefs");
  assertUniqueExactRefs(current.physicalSnapshotRefs, "current.physicalSnapshotRefs");
  assertUniqueExactRefs([current.meshCutRef], "current.meshCutRef");
  requireText(current.projectionContractRef, "current.projectionContractRef");
  requireText(current.projectionContractVersion, "current.projectionContractVersion");
  const expected = new Map(
    [
      ...basis.semantic_cut_refs,
      ...basis.semantic_link_refs,
      ...basis.source_observation_refs,
      ...basis.physical_snapshot_refs,
      basis.mesh_cut
    ]
      .map((item) => [item.ref, exactRefKey(item)])
  );
  const actual = new Map(
    [
      ...current.semanticCutRefs,
      ...current.semanticLinkRefs,
      ...current.sourceObservationRefs,
      ...current.physicalSnapshotRefs,
      current.meshCutRef
    ]
      .map((item) => [item.ref, exactRefKey(item)])
  );
  const changed = [...new Set([...expected.keys(), ...actual.keys()])]
    .filter((ref) => expected.get(ref) !== actual.get(ref))
    .sort();
  const contractChanged = basis.projection_contract_ref !== current.projectionContractRef ||
    basis.projection_contract_version !== current.projectionContractVersion;
  const digestChanged = basis.freshness.dependency_digest !== dependencyDigest(current);
  if (changed.length === 0 && !contractChanged && !digestChanged) return null;
  return {
    gap_type: "stale_context_basis",
    message: `context basis ${basis.basis_ref} no longer matches its declared dependency closure`,
    retryable: true,
    evidence_refs: [basis.basis_ref],
    details: {
      changed_refs: changed,
      projection_contract_changed: contractChanged,
      dependency_digest_changed: digestChanged
    }
  };
}

export function detectContextStaleness(
  basis: ContextBasis,
  catalog: ContextDependencyCatalog
): TypedGap | null {
  try {
    return compareContextStaleness(basis, resolveContextCurrentState(basis, catalog).state);
  } catch (error: unknown) {
    return {
      gap_type: "stale_context_basis",
      message: `context basis ${basis.basis_ref} cannot be resolved against the current dependency catalog`,
      retryable: true,
      evidence_refs: [basis.basis_ref, catalog.catalogRef],
      details: {
        catalog_resolution_error: error instanceof Error ? error.message : String(error)
      }
    };
  }
}

export function createContextInvocationRecord(
  input: ContextInvocationRecordInput,
  basis: ContextBasis,
  projection: ContextProjection,
  admission: AbgAdmissionWitness,
  catalog: ContextDependencyCatalog
): ContextInvocationRecord {
  assertContextProjectionMatchesBasis(projection, basis);
  if (input.context_basis.ref !== basis.basis_ref || input.context_basis.digest !== basis.basis_digest) {
    throw new Error("invocation does not identify the exact context basis");
  }
  if (input.context_projection.ref !== projection.projection_ref ||
      input.context_projection.digest !== projection.projection_digest) {
    throw new Error("invocation does not identify the exact context projection");
  }
  if (projection.context_basis.ref !== basis.basis_ref || projection.context_basis.digest !== basis.basis_digest) {
    throw new Error("invocation projection is not derived from the supplied basis");
  }
  if (projection.projection_contract_ref !== basis.projection_contract_ref) {
    throw new Error("invocation projection uses a different projection contract");
  }
  let freshnessResolution: ResolvedContextCurrentState;
  try {
    freshnessResolution = resolveContextCurrentState(basis, catalog);
  } catch (error: unknown) {
    throw new Error(
      `cannot record a model invocation against a stale context basis: ${error instanceof Error ? error.message : String(error)}`
    );
  }
  if (compareContextStaleness(basis, freshnessResolution.state) !== null) {
    throw new Error("cannot record a model invocation against a stale context basis");
  }
  requireText(input.invocation_ref, "invocation_ref");
  requireText(input.model_identity, "model_identity");
  requireTimestamp(input.invoked_at, "invoked_at");
  requireTimestamp(input.completed_at, "completed_at");
  requireText(input.output_proposal_ref, "output_proposal_ref");
  if (!isSha256Digest(input.output_digest)) throw new Error("output_digest is not sha256");
  assertReplayDerivedAdmissionWitness(admission);
  if (admission.admission_kind !== "model_invocation") {
    throw new Error("context invocation requires a model-invocation admission witness");
  }
  const outputRef: ExactRef = { ref: input.output_proposal_ref, digest: input.output_digest };
  const requiredSubjects: readonly ExactRef[] = [
    { ref: basis.basis_ref, digest: basis.basis_digest },
    { ref: projection.projection_ref, digest: projection.projection_digest },
    outputRef
  ];
  for (const required of requiredSubjects) {
    if (!admission.subjects.some((subject) => exactRefKey(subject) === exactRefKey(required))) {
      throw new Error(`model-invocation admission does not identify ${required.ref}`);
    }
  }
  const recordInput = {
    ...input,
    abg_event_refs: admission.runtime_event_refs,
    admission: {
      ref: admission.witness_ref,
      digest: admission.witness_digest
    },
    freshness_catalog: freshnessResolution.catalog,
    admission_status: "admitted" as const,
    freshness_status: "fresh" as const
  };
  return Object.freeze({ ...recordInput, invocation_digest: sha256Digest(recordInput) });
}
