import { sha256Digest } from "./canonical.ts";
import {
  assertExactRef,
  assertUniqueExactRefs,
  assertUniqueStrings,
  exactRefKey,
  requireText
} from "./exact_refs.ts";
import type {
  ExactRef,
  SemanticLink,
  SemanticLinkProposal,
  SemanticLinkProposalInput
} from "./semantic_memory.ts";
import {
  assertPublishedSemanticCutAuthority,
  assertReplayDerivedAdmissionWitness,
  exactRefForAdmissionWitness,
  exactRefForPublishedCut,
  type AbgAdmissionWitness,
  type PublishedSemanticCut
} from "./semantic_publication.ts";

export const SEMANTIC_RELATION_ROLES = Object.freeze([
  "references",
  "composes",
  "treatment",
  "covariance",
  "adjoint",
  "supersedes"
] as const);

const relationRoles = new Set<string>(SEMANTIC_RELATION_ROLES);
const constructedLinkProposals = new WeakSet<SemanticLinkProposal>();
const publishedSemanticLinks = new WeakSet<SemanticLink>();

function assertSemanticLinkTerms(link: SemanticLinkProposal | SemanticLink): void {
  requireText(link.link_ref, "link_ref");
  assertExactRef(link.source_cut, "source_cut");
  assertExactRef(link.target_cut, "target_cut");
  if (!relationRoles.has(link.relation_role)) {
    throw new Error(`unsupported relation role ${String(link.relation_role)}`);
  }
  requireText(link.treatment_ref, "treatment_ref");
  requireText(link.authority_ref, "authority_ref");
  assertUniqueStrings(link.provenance_refs, "provenance_refs");
  if (link.provenance_refs.length === 0) throw new Error("provenance_refs must not be empty");
  assertUniqueStrings(link.losses, "losses");
  if (link.fidelity !== "lossy_projection" && link.losses.length > 0) {
    throw new Error("losses require lossy_projection fidelity");
  }
  if (Number.isNaN(Date.parse(link.validity.valid_from))) {
    throw new Error("validity.valid_from must be a timestamp");
  }
  if (link.validity.valid_to !== undefined) {
    if (Number.isNaN(Date.parse(link.validity.valid_to))) {
      throw new Error("validity.valid_to must be a timestamp");
    }
    if (Date.parse(link.validity.valid_to) <= Date.parse(link.validity.valid_from)) {
      throw new Error("validity.valid_to must be after validity.valid_from");
    }
  }
  if (link.supersession_status === "superseded" && link.superseded_by_link_ref === undefined) {
    throw new Error("a superseded link must identify its superseding link");
  }
  if (link.supersession_status === "superseded" && link.validity.valid_to === undefined) {
    throw new Error("a superseded link must close its validity interval");
  }
  if (link.supersession_status === "active" && link.superseded_by_link_ref !== undefined) {
    throw new Error("an active link cannot identify a superseding link");
  }
}

function publishedCutMap(publishedCuts: readonly PublishedSemanticCut[]): Map<string, PublishedSemanticCut> {
  const result = new Map<string, PublishedSemanticCut>();
  for (const cut of publishedCuts) {
    assertPublishedSemanticCutAuthority(cut);
    if (result.has(cut.semantic_cut_ref)) throw new Error(`published cut catalog repeats ${cut.semantic_cut_ref}`);
    result.set(cut.semantic_cut_ref, cut);
  }
  return result;
}

function assertPublishedEndpoint(
  exactRef: ExactRef,
  catalog: Map<string, PublishedSemanticCut>,
  label: string
): void {
  const published = catalog.get(exactRef.ref);
  if (published === undefined || exactRefKey(exactRefForPublishedCut(published)) !== exactRefKey(exactRef)) {
    throw new Error(`${label} is not an exact published semantic cut`);
  }
}

export function createSemanticLinkProposal(
  input: SemanticLinkProposalInput,
  publishedCuts: readonly PublishedSemanticCut[]
): SemanticLinkProposal {
  assertSemanticLinkTerms(input as SemanticLinkProposal);
  const catalog = publishedCutMap(publishedCuts);
  assertPublishedEndpoint(input.source_cut, catalog, "source_cut");
  assertPublishedEndpoint(input.target_cut, catalog, "target_cut");
  const proposalInput = {
    ...input,
    epistemic_status: "candidate" as const
  };
  const proposal = Object.freeze({ ...proposalInput, proposal_digest: sha256Digest(proposalInput) });
  constructedLinkProposals.add(proposal);
  return proposal;
}

export function assertSemanticLinkProposalDigest(proposal: SemanticLinkProposal): void {
  if (proposal.schema_kind !== "odd_world_model.semantic_link_proposal" || proposal.schema_version !== "v1") {
    throw new Error("semantic link proposal has an unsupported schema identity");
  }
  assertSemanticLinkTerms(proposal);
  if (proposal.epistemic_status !== "candidate") throw new Error("semantic link proposal must remain candidate");
  const { proposal_digest: recorded, ...digestInput } = proposal;
  const expected = sha256Digest(digestInput);
  if (recorded !== expected) throw new Error(`semantic link proposal digest mismatch: expected ${expected}`);
}

export function exactRefForSemanticLinkProposal(proposal: SemanticLinkProposal): ExactRef {
  assertSemanticLinkProposalDigest(proposal);
  if (!constructedLinkProposals.has(proposal)) {
    throw new Error("semantic link proposal was not produced by the governed proposal constructor");
  }
  return Object.freeze({ ref: `semantic-link-proposal:${proposal.link_ref}`, digest: proposal.proposal_digest });
}

export function publishSemanticLink(input: {
  readonly proposal: SemanticLinkProposal;
  readonly publicationAdmission: AbgAdmissionWitness;
  readonly publishedAt: string;
}): SemanticLink {
  const proposalRef = exactRefForSemanticLinkProposal(input.proposal);
  assertReplayDerivedAdmissionWitness(input.publicationAdmission);
  if (input.publicationAdmission.admission_kind !== "published_cut") {
    throw new Error("semantic link publication requires a published-cut admission witness");
  }
  if (!input.publicationAdmission.subjects.some((subject) => exactRefKey(subject) === exactRefKey(proposalRef))) {
    throw new Error("semantic link admission does not identify the exact proposal");
  }
  if (Number.isNaN(Date.parse(input.publishedAt))) throw new Error("publishedAt must be a timestamp");
  const {
    schema_kind: _schemaKind,
    epistemic_status: _epistemicStatus,
    proposal_digest: _proposalDigest,
    ...terms
  } = input.proposal;
  const publishedInput = {
    ...terms,
    schema_kind: "odd_world_model.semantic_link" as const,
    publication_status: "published" as const,
    proposal: proposalRef,
    publication_admission: exactRefForAdmissionWitness(input.publicationAdmission),
    abg_event_refs: input.publicationAdmission.runtime_event_refs,
    published_at: input.publishedAt
  };
  const link = Object.freeze({ ...publishedInput, link_digest: sha256Digest(publishedInput) });
  publishedSemanticLinks.add(link);
  return link;
}

export function assertSemanticLinkDigest(link: SemanticLink): void {
  if (link.schema_kind !== "odd_world_model.semantic_link" || link.schema_version !== "v1") {
    throw new Error("semantic link has an unsupported schema identity");
  }
  assertSemanticLinkTerms(link);
  if (link.publication_status !== "published") throw new Error("semantic link is not published");
  assertExactRef(link.proposal, "semantic link proposal");
  assertExactRef(link.publication_admission, "semantic link publication admission");
  assertUniqueStrings(link.abg_event_refs, "semantic link abg_event_refs");
  if (link.abg_event_refs.length === 0) throw new Error("semantic link requires ABG event refs");
  if (Number.isNaN(Date.parse(link.published_at))) throw new Error("semantic link published_at must be a timestamp");
  const { link_digest: recorded, ...digestInput } = link;
  const expected = sha256Digest(digestInput);
  if (recorded !== expected) throw new Error(`semantic link digest mismatch: expected ${expected}`);
}

export function assertPublishedSemanticLinkAuthority(link: SemanticLink): void {
  assertSemanticLinkDigest(link);
  if (!publishedSemanticLinks.has(link)) {
    throw new Error("semantic link was not produced by the governed publication constructor");
  }
}

export function exactRefForSemanticLink(link: SemanticLink): ExactRef {
  assertPublishedSemanticLinkAuthority(link);
  return Object.freeze({ ref: link.link_ref, digest: link.link_digest });
}

export function assertSemanticLinkCatalog(linkCatalog: readonly SemanticLink[]): void {
  assertUniqueStrings(linkCatalog.map((link) => link.link_ref), "link catalog refs");
  const catalog = new Map<string, SemanticLink>();
  for (const link of linkCatalog) {
    assertPublishedSemanticLinkAuthority(link);
    catalog.set(link.link_ref, link);
  }
  for (const link of linkCatalog) {
    if (link.supersession_status !== "superseded") continue;
    const visited = new Set([link.link_ref]);
    let current = link;
    while (current.supersession_status === "superseded") {
      const successorRef = current.superseded_by_link_ref;
      if (successorRef === undefined) {
        throw new Error(`superseded semantic link ${current.link_ref} has no successor`);
      }
      if (visited.has(successorRef)) {
        throw new Error(`semantic link supersession cycle reaches ${successorRef}`);
      }
      const successor = catalog.get(successorRef);
      if (successor === undefined) {
        throw new Error(`semantic link ${current.link_ref} has unresolved successor ${successorRef}`);
      }
      visited.add(successorRef);
      current = successor;
    }
  }
}

export function resolveExactSemanticLinks(
  nodeRefs: readonly ExactRef[],
  linkRefs: readonly ExactRef[],
  linkCatalog: readonly SemanticLink[],
  boundaryLabel: string
): readonly SemanticLink[] {
  assertUniqueExactRefs(nodeRefs, `${boundaryLabel}.node_refs`);
  assertUniqueExactRefs(linkRefs, `${boundaryLabel}.link_refs`);
  const nodes = new Map(nodeRefs.map((item) => [item.ref, exactRefKey(item)]));
  assertSemanticLinkCatalog(linkCatalog);
  const catalog = new Map<string, SemanticLink>();
  for (const link of linkCatalog) {
    catalog.set(link.link_ref, link);
  }
  return linkRefs.map((selected) => {
    const link = catalog.get(selected.ref);
    if (!link || exactRefKey(exactRefForSemanticLink(link)) !== exactRefKey(selected)) {
      throw new Error(`semantic link ${selected.ref} is unresolved or has a different digest`);
    }
    for (const endpoint of [link.source_cut, link.target_cut]) {
      if (nodes.get(endpoint.ref) !== exactRefKey(endpoint)) {
        throw new Error(
          `semantic link ${link.link_ref} endpoint ${endpoint.ref} is outside ${boundaryLabel}`
        );
      }
    }
    return link;
  });
}
