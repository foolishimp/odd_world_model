import { sha256Digest } from "../domain/canonical.ts";
import {
  assertExactRef,
  assertUniqueExactRefs,
  assertUniqueStrings,
  exactRefKey,
  requireText
} from "../domain/exact_refs.ts";
import type {
  BoundedMeshCut,
  BoundedMeshCutInput,
  SemanticLink
} from "../domain/semantic_memory.ts";
import {
  assertPublishedSemanticLinkAuthority,
  assertSemanticLinkCatalog,
  exactRefForSemanticLink,
  resolveExactSemanticLinks
} from "../domain/semantic_link_resolution.ts";
import {
  assertPublishedSemanticCutAuthority,
  exactRefForPublishedCut,
  type PublishedSemanticCut
} from "../domain/semantic_publication.ts";

const relationRoles = new Set([
  "references",
  "composes",
  "treatment",
  "covariance",
  "adjoint",
  "supersedes"
]);

function publishedCutMap(publishedCuts: readonly PublishedSemanticCut[]): Map<string, PublishedSemanticCut> {
  const result = new Map<string, PublishedSemanticCut>();
  for (const cut of publishedCuts) {
    assertPublishedSemanticCutAuthority(cut);
    if (result.has(cut.semantic_cut_ref)) throw new Error(`published cut catalog repeats ${cut.semantic_cut_ref}`);
    result.set(cut.semantic_cut_ref, cut);
  }
  return result;
}

function assertPublishedRef(
  exactRef: SemanticLink["source_cut"],
  catalog: Map<string, PublishedSemanticCut>,
  label: string
): void {
  const published = catalog.get(exactRef.ref);
  if (published === undefined || exactRefKey(exactRefForPublishedCut(published)) !== exactRefKey(exactRef)) {
    throw new Error(`${label} is not an exact published semantic cut`);
  }
}

export function assertBoundedMeshCutDigest(cut: BoundedMeshCut): void {
  if (cut.schema_kind !== "odd_world_model.bounded_mesh_cut" || cut.schema_version !== "v1") {
    throw new Error("bounded mesh cut has an unsupported schema identity");
  }
  requireText(cut.mesh_cut_ref, "mesh_cut_ref");
  requireText(cut.interaction_goal, "interaction_goal");
  requireText(cut.scope_ref, "scope_ref");
  requireText(cut.selection_policy_ref, "selection_policy_ref");
  assertUniqueExactRefs(cut.root_refs, "root_refs");
  assertUniqueExactRefs(cut.node_refs, "node_refs");
  assertUniqueExactRefs(cut.link_refs, "link_refs");
  assertUniqueExactRefs(cut.common_model_refs, "common_model_refs");
  assertUniqueExactRefs(cut.excluded_refs, "excluded_refs");
  assertUniqueStrings(cut.relation_selectors, "relation_selectors");
  if (cut.root_refs.length === 0 || cut.relation_selectors.length === 0) {
    throw new Error("bounded mesh cut requires roots and relation selectors");
  }
  for (const selector of cut.relation_selectors) {
    if (!relationRoles.has(selector)) throw new Error(`unsupported relation selector ${selector}`);
  }
  if (!["roots_only", "outbound_dependency_closure", "bidirectional_dependency_closure"].includes(cut.closure_rule)) {
    throw new Error(`unsupported mesh closure rule ${String(cut.closure_rule)}`);
  }
  const nodeKeys = new Set(cut.node_refs.map(exactRefKey));
  if (cut.root_refs.some((root) => !nodeKeys.has(exactRefKey(root)))) {
    throw new Error("bounded mesh cut node closure omits a root");
  }
  if (cut.excluded_refs.some((excluded) => nodeKeys.has(exactRefKey(excluded)))) {
    throw new Error("bounded mesh cut includes an excluded node");
  }
  if (cut.common_model_refs.some((common) => !nodeKeys.has(exactRefKey(common)))) {
    throw new Error("bounded mesh cut common-model refs are not in its node closure");
  }
  cut.unresolved_gaps.forEach((gap, index) => {
    requireText(gap.gap_type, `unresolved_gaps[${index}].gap_type`);
    requireText(gap.message, `unresolved_gaps[${index}].message`);
    assertUniqueStrings(gap.evidence_refs, `unresolved_gaps[${index}].evidence_refs`);
  });
  if (Number.isNaN(Date.parse(cut.resolved_at))) throw new Error("resolved_at must be a timestamp");
  const { mesh_cut_digest: recordedDigest, ...digestInput } = cut;
  const expectedDigest = sha256Digest(digestInput);
  if (recordedDigest !== expectedDigest) {
    throw new Error(`mesh_cut_digest mismatch: expected ${expectedDigest}`);
  }
}

export function assertBoundedMeshCutClosure(
  cut: BoundedMeshCut,
  publishedCuts: readonly PublishedSemanticCut[],
  linkCatalog: readonly SemanticLink[]
): void {
  assertBoundedMeshCutDigest(cut);
  const recomputed = createBoundedMeshCut({
    schema_kind: cut.schema_kind,
    schema_version: cut.schema_version,
    mesh_cut_ref: cut.mesh_cut_ref,
    interaction_goal: cut.interaction_goal,
    scope_ref: cut.scope_ref,
    selection_policy_ref: cut.selection_policy_ref,
    root_refs: cut.root_refs,
    relation_selectors: cut.relation_selectors,
    closure_rule: cut.closure_rule,
    excluded_refs: cut.excluded_refs,
    unresolved_gaps: cut.unresolved_gaps,
    resolved_at: cut.resolved_at
  }, publishedCuts, linkCatalog);
  if (recomputed.mesh_cut_digest !== cut.mesh_cut_digest) {
    throw new Error("bounded mesh cut differs from its declared catalog-relative closure");
  }
}

export function createBoundedMeshCut(
  input: BoundedMeshCutInput,
  publishedCuts: readonly PublishedSemanticCut[],
  linkCatalog: readonly SemanticLink[]
): BoundedMeshCut {
  requireText(input.mesh_cut_ref, "mesh_cut_ref");
  requireText(input.interaction_goal, "interaction_goal");
  requireText(input.scope_ref, "scope_ref");
  requireText(input.selection_policy_ref, "selection_policy_ref");
  assertUniqueExactRefs(input.root_refs, "root_refs");
  assertUniqueExactRefs(input.excluded_refs, "excluded_refs");
  assertUniqueStrings(input.relation_selectors, "relation_selectors");
  if (input.root_refs.length === 0) throw new Error("root_refs must not be empty");
  if (input.relation_selectors.length === 0) throw new Error("relation_selectors must not be empty");
  for (const selector of input.relation_selectors) {
    if (!relationRoles.has(selector)) throw new Error(`unsupported relation selector ${selector}`);
  }
  if (![
    "roots_only",
    "outbound_dependency_closure",
    "bidirectional_dependency_closure"
  ].includes(input.closure_rule)) {
    throw new Error(`unsupported mesh closure rule ${String(input.closure_rule)}`);
  }
  assertSemanticLinkCatalog(linkCatalog);
  const publications = publishedCutMap(publishedCuts);
  for (const root of input.root_refs) assertPublishedRef(root, publications, `root ${root.ref}`);
  for (const excluded of input.excluded_refs) assertPublishedRef(excluded, publications, `excluded ref ${excluded.ref}`);
  const excluded = new Set(input.excluded_refs.map((item) => exactRefKey(item)));
  for (const root of input.root_refs) {
    if (excluded.has(exactRefKey(root))) throw new Error(`root ${root.ref} cannot be excluded`);
  }
  const selectors = new Set(input.relation_selectors);
  const eligibleLinks = linkCatalog.filter((link) => {
    assertPublishedSemanticLinkAuthority(link);
    if (link.supersession_status !== "active" || !selectors.has(link.relation_role)) return false;
    assertPublishedRef(link.source_cut, publications, `link ${link.link_ref} source`);
    assertPublishedRef(link.target_cut, publications, `link ${link.link_ref} target`);
    return !excluded.has(exactRefKey(link.source_cut)) && !excluded.has(exactRefKey(link.target_cut));
  });
  const selected = new Map(input.root_refs.map((root) => [root.ref, root]));
  if (input.closure_rule !== "roots_only") {
    let expanded = true;
    while (expanded) {
      expanded = false;
      for (const link of eligibleLinks) {
        const sourceSelected = selected.has(link.source_cut.ref);
        const targetSelected = selected.has(link.target_cut.ref);
        const includeTarget = sourceSelected && (
          input.closure_rule === "bidirectional_dependency_closure" ||
          link.dependency_direction !== "target_to_source"
        );
        const includeSource = targetSelected && (
          input.closure_rule === "bidirectional_dependency_closure" ||
          link.dependency_direction !== "source_to_target"
        );
        if (includeTarget && !selected.has(link.target_cut.ref)) {
          selected.set(link.target_cut.ref, link.target_cut);
          expanded = true;
        }
        if (includeSource && !selected.has(link.source_cut.ref)) {
          selected.set(link.source_cut.ref, link.source_cut);
          expanded = true;
        }
      }
    }
  }
  const nodeRefs = Object.freeze([...selected.values()].sort((left, right) => left.ref.localeCompare(right.ref)));
  const selectedLinks = input.closure_rule === "roots_only"
    ? []
    : eligibleLinks.filter((link) => selected.has(link.source_cut.ref) && selected.has(link.target_cut.ref));
  const linkRefs = Object.freeze(selectedLinks
    .map(exactRefForSemanticLink)
    .sort((left, right) => left.ref.localeCompare(right.ref)));
  const commonModelRefs = Object.freeze(nodeRefs.filter((node) => publications.get(node.ref)?.cut_role === "common_model"));
  const unresolvedGaps = Object.freeze([...(input.unresolved_gaps ?? [])]);
  const cutInput = {
    ...input,
    unresolved_gaps: unresolvedGaps,
    node_refs: nodeRefs,
    link_refs: linkRefs,
    common_model_refs: commonModelRefs
  };
  return { ...cutInput, mesh_cut_digest: sha256Digest(cutInput) };
}

export function calculateAffectedClosure(
  cut: BoundedMeshCut,
  publishedCuts: readonly PublishedSemanticCut[],
  linkCatalog: readonly SemanticLink[],
  changedCutRefs: readonly string[]
): readonly string[] {
  assertBoundedMeshCutClosure(cut, publishedCuts, linkCatalog);
  assertUniqueStrings(changedCutRefs, "changedCutRefs");
  const selectedLinks = resolveExactSemanticLinks(
    cut.node_refs,
    cut.link_refs,
    linkCatalog,
    "the exact node cut"
  );
  const selectedNodes = new Set(cut.node_refs.map((item) => item.ref));
  for (const changed of changedCutRefs) {
    if (!selectedNodes.has(changed)) throw new Error(`changed cut ${changed} is outside the mesh cut`);
  }
  const affected = new Set(changedCutRefs);
  let expanded = true;
  while (expanded) {
    expanded = false;
    for (const link of selectedLinks) {
      const sourceAffected = affected.has(link.source_cut.ref);
      const targetAffected = affected.has(link.target_cut.ref);
      const targets: string[] = [];
      if (sourceAffected && link.dependency_direction !== "target_to_source") targets.push(link.target_cut.ref);
      if (targetAffected && link.dependency_direction !== "source_to_target") targets.push(link.source_cut.ref);
      for (const target of targets) {
        if (!affected.has(target)) {
          affected.add(target);
          expanded = true;
        }
      }
    }
  }
  return [...affected].sort();
}
