# GTL Graph-Function Contracts

**Status**: Accepted implementation contract
**Ticket**: T-029
**ADR**: `adrs/ADR-WM-004-gtl-graph-function-catalog.md`
**Date**: 2026-07-12

## Contract Law

`First-slice runnable` below is the accepted target contract. The current rc.3
catalog records `execution_mode=reference_digest_bridge`: ABG traverses the
declared graphs and admits exact refs, while the WM semantic kernel executes as
a local reference implementation. Native payload execution and F_P authorship
remain open under T-026 and are not implied by this contract status.

Every retained function is a GTL `GraphFunction` contract, not a service method,
script, or product-local controller.

Every function declares:

- one stable handle;
- public or private role;
- typed required and provided assets;
- cumulative carried environment;
- allowed F_D, F_P, and F_H participation;
- refinement/foldback boundary where applicable;
- closure obligations; and
- typed non-closure outcomes.

The executable request definitions live in
`build_tenants/common/schemas/graph_function_contracts.schema.json`; explicit
multi-ref outcome tuples live in `graph_function_outcomes.schema.json`. A
machine carrier passes only when an instance validates against those schemas.
Resolving a schema address without validating an instance is not contract proof.

ABG owns selection, invocation, traversal, continuation, admission, replay, and
closure truth. WM owns domain interpretation and acceptance. No function reads
ambient workspace, chat, model memory, or latest storage state outside its
declared environment.

## Shared Cumulative Environment

Every function carries these bindings when present:

- `ExactProductBinding`
- `AuthorityContext`
- `TemporalContext`
- `LineageContext`
- `TypedGapSet`
- `PolicyContext`
- `ReplayEvidenceRefs`

A function may narrow but may not silently widen the environment.

## Public Catalog Summary

| Handle | Outcome | Compute | First-slice status |
| --- | --- | --- | --- |
| `odd_world_model.publish_domain_model` | Publish one attested domain semantic cut from governed source evidence | composed F_D/F_P/F_H | First-slice runnable |
| `odd_world_model.publish_semantic_links` | Publish exact typed relations between published cuts | F_D with bounded F_P/F_H | First-slice runnable |
| `odd_world_model.compose_world_model` | Publish one reference-preserving composed world model | F_D with bounded F_P/F_H | First-slice runnable |
| `odd_world_model.resolve_mesh_cut` | Resolve one finite purpose-bound cut and dependency closure | F_D, optional F_P proposal | First-slice runnable |
| `odd_world_model.project_context` | Produce exact basis and loss-declared model context | F_D only | First-slice runnable |
| `odd_world_model.interpret_context` | Invoke a governed model and publish attributed output proposal | F_P with F_D admission | First-slice runnable |
| `odd_world_model.query_world_model` | Query/prove an exact attested cut | F_D only | First-slice runnable |
| `odd_world_model.map_domains` | Publish governed cross-domain mapping and report | F_P with F_D/F_H | Defined, deferred |

## Public Contract: `odd_world_model.publish_domain_model`

**Intent**: construct and publish one domain semantic cut from an exact governed
source scope.

**Requires**:

- `SourceScope`
- `SourceEvidenceSet`
- `SourceAuthorityPolicy`
- `SemanticConstructionPolicy`
- `PublicationPolicy`
- `ExactProductBinding`

**Provides**:

- `PublishedDomainArtifactRef`
- `SemanticCutAttestationRef`
- `DomainPublicationEvidence`

**Carries**:

- construction evidence refs;
- accepted attribute-ledger refs;
- candidate/established object-cut status;
- source and semantic authority refs;
- temporal coordinates;
- typed gaps; and
- exact substrate/storage effect refs.

**Refines through**:

1. `internal.observe_source_evidence`
2. `internal.construct_domain_semantics`
3. `internal.admit_domain_claims`
4. `internal.project_domain_cut`
5. `internal.materialize_attested_cut`

**Closure**:

- the domain artifact, assurance-neutral `SemanticCutAttestation`, and separate
  physical-effect observation are admitted and joined by one final
  `PublishedSemanticCut`; or
- the function yields/blocks with typed source, semantic, authority,
  conformance, admission, or storage gaps.

Files, model prose, unadmitted ledger entries, or physical snapshots alone do
not close the function.

## Public Contract: `odd_world_model.publish_semantic_links`

**Intent**: publish exact typed semantic relations between already-published
cuts without copying either endpoint.

**Requires**:

- two or more exact `PublishedSemanticCutRef` values;
- `SemanticLinkProposalSet`;
- relation-role and treatment contracts;
- `LinkAuthorityPolicy`; and
- exact product binding.

**Provides**:

- `PublishedSemanticLinkSetRef`
- `SemanticCutAttestationRef`
- `LinkPublicationEvidence`

**Carries**:

- exact endpoint digests;
- relation role;
- treatment, fidelity/loss, validity, and supersession;
- authority/provenance refs; and
- unresolved link gaps.

**Compute authority**:

- F_P may propose relation meaning;
- F_D validates endpoint identity, role, treatment shape, and duplicates;
- F_H resolves authority conflicts where policy cannot; and
- ABG admits publication events.

**Closure**: every published link resolves exact endpoints and has one admitted
authority/treatment basis. Missing or conflicting meaning remains a typed gap.

## Public Contract: `odd_world_model.compose_world_model`

**Intent**: publish one higher-order model by referencing local semantic cuts
and admitted links while preserving local authority.

**Requires**:

- at least two exact `PublishedSemanticCutRef` values;
- sufficient admitted `SemanticLinkRef` values;
- `CompositionIntent`;
- `CompositionPolicy`; and
- exact product binding.

**Provides**:

- `ComposedWorldModelRef`
- `SemanticCutAttestationRef`
- `CompositionEvidence`

**Carries**:

- component identities and versions;
- adopted common-model roles;
- admitted link refs;
- declared composition loss/ambiguity;
- authority boundaries; and
- typed gaps.

**Closure**: the composed model references rather than copies its components,
all governing links are admitted, declared loss is present, and its physical cut
is attested. A missing relation yields a proposal for
`publish_semantic_links`; composition does not publish hidden link truth.

## Public Contract: `odd_world_model.resolve_mesh_cut`

**Intent**: resolve the minimum sufficient finite mesh context for one declared
interaction goal.

**Requires**:

- `InteractionGoal`
- exact root `PublishedSemanticCutRef` values;
- `MeshScope`
- selectors;
- `MeshClosurePolicy`; and
- admitted semantic-link refs.

**Provides**:

- `BoundedMeshCutRef`
- `DependencyClosureProjection`
- `MeshResolutionEvidence`

**Carries**:

- exact node/link refs and digests;
- root, purpose, scope, selectors, and closure rule;
- exclusions and unresolved refs;
- dependency-local impact surface; and
- staleness inputs.

**Compute authority**:

- F_D resolves declared topology and validates finiteness;
- F_P may propose relevance only when the interaction goal is semantically
  ambiguous;
- any F_P selection remains a candidate until deterministic scope/closure
  checks and admission.

**Closure**: the cut is finite, exact, purpose-bound, and contains no undeclared
ambient expansion. It is a projection, not copied semantic truth.

## Public Contract: `odd_world_model.project_context`

**Intent**: construct the exact basis and bounded loss-declared representation
given to one model invocation.

**Requires**:

- `BoundedMeshCutRef`
- `ContextProjectionContract`
- `ContextWindowPolicy`
- freshness policy; and
- exact projection dependency refs.

**Provides**:

- `ContextBasisRef`
- `ContextProjectionRef`
- `ContextFreshnessWitness`

**Carries**:

- exact semantic and physical cut refs;
- projection contract/version;
- temporal coordinates;
- freshness/staleness;
- fidelity, loss, exclusions, truncation, and gaps; and
- source authority refs.

**Compute authority**: F_D only. Probabilistic summarization is not permitted in
this contract because it would hide F_P work inside basis construction.

**Closure**: the projection is reproducible from the exact basis, all loss is
declared, and no undeclared source enters the context.

## Public Contract: `odd_world_model.interpret_context`

**Intent**: invoke a governed probabilistic model over one exact context
projection and publish an attributed output proposal.

**Requires**:

- `ContextBasisRef`
- `ContextProjectionRef`
- `ModelCapabilityBinding`
- `InvocationPolicy`; and
- expected output contract.

**Provides**:

- `ContextInvocationRecordRef`
- `ProposedSemanticResultRef`
- `OutputAdmissionReport`

**Carries**:

- model/provider/capability identity;
- invocation identity and time;
- exact basis/projection refs;
- output digest;
- F_D shape/check results;
- ABG result/event refs; and
- typed output gaps.

**Compute authority**: F_P performs interpretation. F_D checks closed output
shape, refs, digests, and declared constraints. ABG admits runtime result truth.

**Closure**: the invocation and output proposal are admitted and attributable to
the exact basis. Closure does not make the proposal semantic truth. Selected
changes re-enter their target publication GraphFunction.

## Public Contract: `odd_world_model.query_world_model`

**Intent**: produce a lawful query/proof projection over exact admitted semantic
history.

**Requires**:

- `SemanticCutAttestationRef` or `ContextBasisRef`;
- `QueryContract`; and
- projection policy.

**Provides**:

- `QueryProjectionRef`
- `QueryProofEvidence`

**Carries**:

- exact table snapshot vector;
- source semantic refs;
- query contract/version;
- projection lineage; and
- unresolved query gaps.

**Compute authority**: F_D only. Reads use exact attested snapshots and never
implicit latest state.

**Closure**: the result is reproducible and structurally coherent with its
source cut. It remains a projection and cannot publish semantic truth.

## Public Contract: `odd_world_model.map_domains`

**Intent**: publish a governed downstream mapping over two or more exact
published domains.

**Availability**: contract defined; executable publication deferred from the
first context-memory slice.

**Requires**:

- two or more exact `PublishedSemanticCutRef` values;
- relevant admitted semantic-link/treatment refs;
- `MappingIntent`;
- mapping category/confidence policy; and
- exact product binding.

**Provides**:

- `MappingRecordRef`
- `MappingReportRef`
- `CandidateConceptSetRef`
- `CandidateBoundarySetRef`

**Carries**:

- participating domain refs;
- mapping evidence and rationale;
- category, direction, confidence, loss, surplus, and ambiguity;
- unassigned surfaces; and
- downstream-only epistemic status.

**Compute authority**: F_P proposes semantic correspondence and higher-order
concepts; F_D validates exact refs, completeness, category vocabulary, and
declared loss; F_H may resolve material ambiguity.

**Closure**: one durable mapping record is admitted, the human report projects
that record, and candidate concepts/boundaries remain downstream unless
separately republished through a domain publication function.

## Private Refinement Contracts

### `odd_world_model.internal.observe_source_evidence`

- **Requires**: source scope, evidence set, adapter contract, source authority.
- **Provides**: admitted `ConstructionEvidence` and source-domain candidates.
- **Compute**: F_D ingress only.
- **Closure**: every observation has exact locator, digest, kind, and authority.

### `odd_world_model.internal.construct_domain_semantics`

- **Requires**: admitted construction evidence and semantic construction policy.
- **Provides**: proposed claims, treatments, object identities, candidate
  boundaries, confidence, and gaps.
- **Compute**: F_P with declared calibration; F_D validates output contract.
- **Closure**: proposal is complete enough for authority evaluation, not true.

### `odd_world_model.internal.admit_domain_claims`

- **Requires**: proposals, F_D report, ABG result refs, WM authority decision.
- **Provides**: accepted attribute-ledger entries and rejected/gap records.
- **Compute**: F_D construction with F_H/policy decision input; ABG admission.
- **Closure**: each accepted claim has one attributable authority and source
  basis; no proposal writes the ledger directly.

### `odd_world_model.internal.project_domain_cut`

- **Requires**: accepted ledger entries, object identity, publication policy.
- **Provides**: immutable object cuts and candidate domain publication bundle.
- **Compute**: F_D only.
- **Closure**: cuts are immutable, status-honest, and reverse recoverable.

### `odd_world_model.internal.materialize_attested_cut`

- **Requires**: admitted publishable semantic bundle and physical-store policy.
- **Provides**: exact snapshot vector, semantic-cut attestation, effect evidence.
- **Compute**: deterministic effect binding; no F_P.
- **Closure**: one assurance-neutral attestation binds the complete snapshot
  vector, a separate exact readback observation is admitted, and partial or
  failed effects remain unpublished.

## Refinement And Foldback Law

`publish_domain_model` cannot close merely because all private refinements are
locally green. Foldback must prove the outer published-domain contract:

- exact source basis;
- accepted ledger lineage;
- immutable object cuts;
- admitted semantic publication;
- complete physical snapshot vector;
- admitted assurance-neutral attestation and physical-effect observation; and
- no unresolved blocking gap.

The same zoom law applies wherever public functions later gain private
refinements.

## Implementation Boundary

F_H accepted this contract through the 2026-07-12 direction to continue to
full build. T-026 may implement the first-slice public catalog, private
refinements, machine-readable registry declarations, GTL jobs/module, exact
substrate binding, and executable proof. `map_domains` remains contract-only.

Implementation must not add a product-local traversal loop, generic semantic
mutation gateway, ambient context read, implicit-latest storage read, or public
stage wrapper outside this accepted catalog.
