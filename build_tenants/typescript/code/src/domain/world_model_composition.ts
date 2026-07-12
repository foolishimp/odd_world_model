import { sha256Digest } from "./canonical.ts";
import {
  assertExactRef,
  assertUniqueExactRefs,
  assertUniqueStrings,
  exactRefKey,
  requireText
} from "./exact_refs.ts";
import type { ExactRef, Fidelity, SemanticLink, Sha256Digest, TypedGap } from "./semantic_memory.ts";
import { resolveExactSemanticLinks } from "./semantic_link_resolution.ts";
import {
    assertPublishedSemanticCutAuthority,
  exactRefForPublishedCut,
  type PublishedSemanticCut
} from "./semantic_publication.ts";

export interface ComposedWorldModel {
  readonly schema_kind: "odd_world_model.composed_world_model";
  readonly schema_version: "v1";
  readonly world_model_ref: string;
  readonly composition_intent: string;
  readonly component_cut_refs: readonly ExactRef[];
  readonly semantic_link_refs: readonly ExactRef[];
  readonly common_model_refs: readonly ExactRef[];
  readonly authority_boundary_refs: readonly string[];
  readonly fidelity: Fidelity;
  readonly losses: readonly string[];
  readonly unresolved_gaps: readonly TypedGap[];
  readonly composed_at: string;
  readonly world_model_digest: Sha256Digest;
}

export type ComposedWorldModelInput = Omit<ComposedWorldModel, "world_model_digest">;

export function assertComposedWorldModelDigest(worldModel: ComposedWorldModel): void {
  const { world_model_digest: recorded, ...digestInput } = worldModel;
  const expected = sha256Digest(digestInput);
  if (recorded !== expected) throw new Error(`composed world-model digest mismatch: expected ${expected}`);
}

export function createComposedWorldModel(
  input: ComposedWorldModelInput,
  publishedCuts: readonly PublishedSemanticCut[],
  linkCatalog: readonly SemanticLink[]
): ComposedWorldModel {
  requireText(input.world_model_ref, "world_model_ref");
  requireText(input.composition_intent, "composition_intent");
  requireText(input.composed_at, "composed_at");
  if (Number.isNaN(Date.parse(input.composed_at))) throw new Error("composed_at must be a timestamp");
  if (input.component_cut_refs.length < 2) {
    throw new Error("composition requires at least two exact component cuts");
  }
  assertUniqueExactRefs(input.component_cut_refs, "component_cut_refs");
  assertUniqueExactRefs(input.semantic_link_refs, "semantic_link_refs");
  if (input.semantic_link_refs.length === 0) throw new Error("composition requires a semantic link");
  assertUniqueExactRefs(input.common_model_refs, "common_model_refs");
  assertUniqueStrings(input.authority_boundary_refs, "authority_boundary_refs");
  if (input.authority_boundary_refs.length === 0) throw new Error("composition requires an authority boundary");
  assertUniqueStrings(input.losses, "losses");
  if (input.fidelity !== "lossy_projection" && input.losses.length > 0) {
    throw new Error("composition losses require lossy_projection fidelity");
  }

  const publicationCatalog = new Map<string, PublishedSemanticCut>();
  for (const cut of publishedCuts) {
    assertPublishedSemanticCutAuthority(cut);
    if (publicationCatalog.has(cut.semantic_cut_ref)) {
      throw new Error(`published cut catalog repeats ${cut.semantic_cut_ref}`);
    }
    publicationCatalog.set(cut.semantic_cut_ref, cut);
  }
  for (const component of input.component_cut_refs) {
    const published = publicationCatalog.get(component.ref);
    if (published === undefined || exactRefKey(exactRefForPublishedCut(published)) !== exactRefKey(component)) {
      throw new Error(`component ${component.ref} is not an exact published cut`);
    }
  }
  const components = new Map(input.component_cut_refs.map((ref) => [ref.ref, exactRefKey(ref)]));
  const resolvedLinks = resolveExactSemanticLinks(
    input.component_cut_refs,
    input.semantic_link_refs,
    linkCatalog,
    "the composition"
  );
  const adjacency = new Map(input.component_cut_refs.map((component) => [component.ref, new Set<string>()]));
  for (const link of resolvedLinks) {
    adjacency.get(link.source_cut.ref)!.add(link.target_cut.ref);
    adjacency.get(link.target_cut.ref)!.add(link.source_cut.ref);
  }
  const firstComponent = input.component_cut_refs[0]!;
  const reachable = new Set<string>([firstComponent.ref]);
  const pending = [firstComponent.ref];
  while (pending.length > 0) {
    const current = pending.shift()!;
    for (const adjacent of adjacency.get(current) ?? []) {
      if (reachable.has(adjacent)) continue;
      reachable.add(adjacent);
      pending.push(adjacent);
    }
  }
  if (reachable.size !== input.component_cut_refs.length) {
    const disconnected = input.component_cut_refs
      .filter((component) => !reachable.has(component.ref))
      .map((component) => component.ref)
      .sort();
    throw new Error(`composition has disconnected component cuts: ${disconnected.join(", ")}`);
  }
  for (const common of input.common_model_refs) {
    assertExactRef(common, "common_model_ref");
    if (components.get(common.ref) !== exactRefKey(common)) {
      throw new Error(`common model ${common.ref} is outside the composition`);
    }
    if (publicationCatalog.get(common.ref)?.cut_role !== "common_model") {
      throw new Error(`common model ${common.ref} does not have the published common-model role`);
    }
  }
  return { ...input, world_model_digest: sha256Digest(input) };
}
