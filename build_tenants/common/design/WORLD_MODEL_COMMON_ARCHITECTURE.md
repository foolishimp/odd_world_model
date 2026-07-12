# World Model Common Architecture

**Status**: Accepted shared target design; GTL catalog contracts implemented,
native WM payload execution open
**Ticket**: T-028
**Date**: 2026-07-12
**Scope**: Shared realization architecture below `specification/` and above
tenant-local implementation

## Purpose

This design realizes `odd_world_model` as governed semantic memory for exact,
bounded, loss-declared LLM context.

It fixes the shared realization boundaries that tenant code must preserve:

- source evidence remains attributable to source authority;
- semantic proposals, deterministic checks, runtime admission, and WM semantic
  acceptance remain distinct;
- the published semantic layer is the single WM truth surface;
- typed mesh links preserve local publication authority;
- bounded mesh cuts constrain each interaction goal;
- context projections disclose fidelity, loss, omissions, and gaps;
- every model output is bound to the exact context basis it saw;
- physical storage is attested materialization, not independent semantic
  authority; and
- GTL, ABG, GLC, WM, storage, and projection responsibilities do not overlap.

ADR-WM-004 fixes the accepted public/private graph-function catalog. T-026
implements its declarations and exact-reference proving adapter in the
TypeScript tenant. The current rc.3 adapter does not execute the WM semantic
kernel as the selected GraphFunction payload implementation; the as-built gap
is recorded in
`build_tenants/typescript/design/95-rc3-reference-bridge-as-built-review.md`.

## Governing Authority

This design derives from:

- `specification/GOALS.md`
- `specification/INTENT.md`
- `specification/PRODUCT.md`
- all live families under `specification/requirements/`
- `SPEC_METHOD.md`
- `DESIGN_MODULE_METHOD.md`
- `ODD_METHOD.md`
- `WORLD_MODEL_METHOD.md`

The specification defines `WHAT`. This document and accepted ADRs define
shared `HOW`. Tenant-local design may refine these boundaries but may not
redefine them.

## Proving Posture

F_H selected exact ABIogenesis `4.6.0-rc.3` with `odd_glc 0.1.0` for the next
incremental concept-proving slice.

This is not Product tethering. The common design isolates the substrate behind
typed publication, conformance, invocation, event, and admission seams. A
successor implementation may replace rc.3 without semantic redesign when it
preserves those contracts. Every concrete build and proof records the exact
dependency identities it exercises.

The rc.3 path uses:

- typed GTL/ABG package exports for declared contract shape;
- GTL `Module`, `GraphFunction`, and job construction;
- `typecheck-gtl-program` for program conformance;
- `start graph_function:<published_handle>` through the exact workspace
  binding's `runtimeRegistryStartup` target catalog; and
- the selected canonical event roster and ABG admission path.

It does not assume the later standalone catalog product, graph shell, catalog
operation family, or broad public-consumption contract.

## Semantic Chain

```text
source evidence
  -> admitted construction evidence
  -> accepted attribute-ledger entries
  -> immutable object cuts
  -> published semantic cuts
  -> typed semantic links
  -> bounded mesh cut
  -> context basis
  -> loss-declared context projection
  -> governed model invocation
  -> attributed output proposal
  -> deterministic checks / ABG admission / WM semantic acceptance
  -> new publication, typed gap, or no change
```

Storage and query attach to this chain as explicit effects and projections.
They do not create alternate constructive chains.

## Authority Boundaries

### GTL

GTL owns declarative program structure: typed nodes, vectors, graph functions,
modules, cumulative environments, refinement boundaries, and public catalog
publication.

### ABG

ABG owns execution, traversal, graph calls, continuations, admission, runtime
events, replay, runtime evidence, correction, re-entry, and closure truth.

### GLC

GLC owns generic lifecycle vocabulary and the downstream specialization
contract consumed by WM.

### WM

WM owns world-model meaning: source and authority qualification, bounded
contexts, semantic claims, attribute-ledger meaning, object cuts, treatments,
covariance, adjoints, semantic links, mesh cuts, context bases, projection
fidelity, and attributed semantic acceptance.

### Storage And Projection

Storage adapters persist already-admitted payloads and return verifiable
physical identities. Query and context adapters project admitted truth. Neither
decides meaning, authority, next work, admission, closure, or continuation.

## Irreducible Architectural Carrier Set

| Carrier family | Owns | Does not own |
| --- | --- | --- |
| `ConstructionEvidence` | Source observations, traces, assurance proposals, locators, and authority refs used during construction | Published semantic truth |
| `AbgAdmissionWitness` | Replay-derived binding of exact subjects to graph calls, admitted evidence events, vector closure, and terminal state | Domain acceptance or provider-authored closure |
| `WmAcceptanceDecision` | Attributed WM decision over one exact proposal, deterministic check, and proposal-admission basis | ABG event truth or un-attributed acceptance |
| `AttributeLedger` | Append-only accepted semantic claims over stable object identities | Runtime event truth or current object projection |
| `MarkovObjectCut` | Immutable candidate or established identity-direction projection with declared evidence and status; current candidate v1 keeps held-out treatment status inconclusive | Whole domain publication, self-asserted treatment verification, or automatic established status |
| `PublishedSemanticCut` | Versioned published source domain, domain artifact, common-model role, or composed world-model identity | Copied mesh or query state |
| `SemanticPublicationCandidate` | Complete accepted semantic and admitted physical bundle offered to the publication GraphFunction | Published truth before its own admission witness |
| `SemanticLinkProposal` | Candidate exact typed relation and treatment basis offered to the link-publication GraphFunction | Durable mesh truth or self-admission |
| `SemanticLink` | Replay-admitted durable relation between exact published cuts, with treatment, fidelity/loss, authority, provenance, validity, and supersession | Inferred same-name joins or unadmitted proposals |
| `BoundedMeshCut` | Finite purpose/scope/closure selection over exact node and link refs | Copied publication truth or ambient whole-mesh context |
| `ContextBasis` | Exact immutable published cuts, links, source observations, physical snapshots, and projection contract for one invocation | Serialized prompt body |
| `ContextProjection` | Loss-declared bounded representation of one context basis | Semantic truth or implicit context expansion |
| `ContextInvocationRecord` | Basis, model, invocation, output digest, role, time, admission lineage, and exact current dependency-catalog witness | Acceptance of model output as semantic truth |
| `SemanticCutAttestation` | Assurance-neutral binding between an accepted semantic-cut candidate and an exact physical snapshot vector, schemas, digests, and governing refs | Semantic meaning, verification, admission, or proof state by storage identity alone |
| `TypedGap` | Unresolved reference, authority conflict, incompatibility, loss, stale basis, failed effect, or unaccepted proposal | Null, silent omission, or fallback truth |

`TraceRecord`, `AssuranceClaim`, and similar stage records are variants or
subordinate payloads inside `ConstructionEvidence` unless independent identity,
authority, lifecycle, cross-module consumption, and proof require promotion.

### Promotion Test

A new top-level carrier is lawful only when all are true:

1. it has identity independent of an existing carrier;
2. it crosses a real authority, lifecycle, persistence, or module boundary;
3. composing existing carriers would lose required meaning or proof; and
4. a negative test can show what fails when the boundary is absent.

Serialization convenience, schema generation, or one branch's payload shape is
not sufficient.

## Shared Module Boundaries

| Module | Input | Output | Allowed effects | Forbidden authority |
| --- | --- | --- | --- | --- |
| `source_ingress` | Foreign code, records, documents, events, schemas | Admitted local source observations | Read source, calculate digests | Semantic interpretation or publication |
| `semantic_construction` | Construction evidence, policies, cumulative environment | Proposed claims, treatments, object candidates, typed gaps | F_P call through governed binding; F_D checks | Direct ledger mutation, closure, continuation |
| `semantic_publication` | Admitted proposals, authority decisions, accepted ledger entries | Object cuts and published semantic cuts | Deterministic construction; admitted publish request | Hidden source reconstruction or in-place cut edit |
| `mesh` | Exact published cut refs and link proposals | Admitted links, bounded cuts, impact closure, gaps | Deterministic ref/closure validation | Copying publications or loading ambient whole mesh |
| `context` | Bounded mesh cut, current admitted dependency catalog, and projection contract | Context basis, context projection, and catalog-bound freshness result | Deterministic selection, compression accounting, rendering | Caller-asserted freshness, undeclared retrieval, or model invocation |
| `invocation` | Exact context projection and governed model capability | Invocation record and F_P output proposal | Model call through governed binding | Direct semantic acceptance or ledger write |
| `storage_effect` | Admitted physical-write request | Snapshot vector, schemas, metadata refs, digests, effect result | Iceberg catalog/table IO | Semantic decisions, F_P work, runtime admission |
| `query_projection` | Attested semantic cut or context basis | Query, mapping, report, or proof projection | Exact-snapshot reads and rendering | Publishing rival semantic truth or reading latest implicitly |
| `substrate_binding` | Product GTL declarations and exact workspace binding | Conformance, target resolution, admitted runtime/event refs | Exact rc.3 package/CLI invocation | Domain meaning or compatibility inference |

These modules are realization cuts inside graph programs. They are not the GTL
program itself.

## Substrate Migration Seam

Tenant code must concentrate selected-substrate knowledge in
`substrate_binding` contracts for:

- module and graph-function publication;
- program conformance;
- graph-function target resolution;
- canonical event identity;
- F_P worker/plugin binding;
- result admission; and
- replay/evidence refs.

Domain modules consume local WM carrier types. They do not import rc.3-specific
wire shapes directly. Ingress adapters admit selected-substrate values into
local types once; egress adapters serialize local declarations once. This makes
successor migration an adapter and conformance change unless the successor
changes Product meaning.

## Target Semantic Publication Protocol

1. Admit source observations at ingress.
2. Perform bounded semantic construction through the selected graph function.
3. Retain F_P output as a proposal.
4. Apply closed F_D checks.
5. Admit the checked result through ABG as runtime fact.
6. Apply WM policy and attributed authority to accept or reject semantic
   claims.
7. Append accepted claims to the attribute ledger.
8. Project immutable object cuts and a candidate published semantic cut.
9. Issue one admitted storage-effect request.
10. Persist physical table state and receive exact snapshot identities.
11. Construct one assurance-neutral semantic-cut attestation over the full
    snapshot vector.
12. Reproduce the named state through the independent physical readers and
    emit one `PhysicalEffectObservation` outside the attestation digest.
13. Offer the attestation and observation to ABG for admission.
14. Construct one immutable semantic-publication candidate from the accepted
    cut and admitted physical facts.
15. Carry that candidate through the selected publication GraphFunction and
    derive its admission witness from replay.
16. Publish the semantic cut only from the exact admitted publication candidate.

An effect failure produces a typed gap and leaves the prior published cut
current. Intermediate physical snapshots not named by an admitted attestation
are not published WM cuts.

## Physical Cut Boundary

Iceberg snapshots are table-level physical states. A WM semantic cut may span
several tables.

```text
WM semantic cut identity != one Iceberg snapshot id
WM physical cut identity = admitted semantic identity + attested vector of exact table snapshots
```

`SemanticCutAttestation` is the physical binding candidate. Readers consume it
only with an admitted physical-effect observation and final
`PublishedSemanticCut`; they query every table at the exact named snapshot and
never substitute current state.

The attestation includes:

- semantic cut ref, role, version, and digest;
- exact table identifier and snapshot ID for every participating table;
- metadata location and schema fingerprint for each table;
- governing source, authority, GTL invocation, and ABG event refs;
- temporal coordinates;
- declared fidelity, loss, exclusions, and unresolved gaps;
- exact specification, design, dependency, and projection-contract refs;
- optional Git commit containing the small attestation record.

`PhysicalEffectObservation` separately records the exact subject-attestation
identity, observer, observation time, per-snapshot reproduction results, and
failure details. It is provider output, not assurance state, semantic
acceptance, or admission. It is never sealed into the attestation digest before
the observation runs.

## Context Protocol

For every governed invocation:

1. resolve one finite `BoundedMeshCut` for a declared interaction goal;
2. construct one immutable `ContextBasis` over exact semantic, source-observation,
   physical-snapshot, and projection-contract refs and digests;
3. project only that basis under a versioned projection contract;
4. disclose compression, omissions, truncation, fidelity, and gaps;
5. bind the model call to the basis and projection refs;
6. record model identity, invocation identity, output digest, and time; and
7. detect staleness without retargeting the historical invocation.

Candidate Markov-object cuts are compression inputs. They do not become
established because they fit a context window or produce a useful answer.

## Storage And Query Topology

ADR-WM-003 selects the first-slice topology. ADR-WM-005 fixes the local
cross-tenant effect as a versioned one-request/one-response JSONL protocol with
deployment-owned configuration and typed partial-failure evidence:

```text
TypeScript WM/GTL domain
  -> admitted storage-effect request
  -> Python PyIceberg adapter
  -> Iceberg tables using Parquet data files
  -> development SQL catalog in SQLite + local filesystem warehouse
  -> exact-snapshot DuckDB query/proof
  -> small Git-tracked semantic-cut attestation
```

The multi-consumer evolution replaces the development catalog/warehouse with a
REST catalog and object storage without changing semantic carriers or cut
attestation.

## Accepted GTL Boundary

The accepted catalog assigns these outcome traversals to prime public carriers:

1. source evidence to published domain truth;
2. published domains to composed models and semantic links;
3. mesh truth to bounded mesh cut;
4. bounded cut to context basis and projection;
5. context projection to attributed F_P output proposal;
6. proposal to accepted semantic change or typed gap; and
7. admitted constructive history to query/proof projection.

ADR-WM-004 records the F_H selection: seven first-slice public functions, five
private domain-publication refinements, target-specific semantic re-entry, and
one contract-defined but deferred mapping function.

## Fail-Closed Rules

The design fails closed when:

- a source payload bypasses ingress admission;
- a proposal writes a ledger or published cut directly;
- a physical snapshot lacks semantic-cut attestation;
- a multi-table reader mixes snapshot times;
- a query guesses latest state instead of using exact snapshot refs;
- a context projection reads outside its bounded cut;
- fidelity, loss, truncation, or gaps are absent or unknown but claimed
  complete;
- a model output lacks a context-basis ref;
- ABG continuation is replaced by a local loop;
- rc.3-specific shapes leak into domain kernels; or
- a legacy JSON/filesystem record is reconstructed as current truth without an
  explicit admitted migration.

## Current Reference Integrated Slice

The current reference slice proves:

1. one retained source domain is admitted;
2. one preconstructed candidate domain publication is carried by exact ref and
   digest through a selected public GraphFunction and ABG admission;
3. one physical snapshot vector is written;
4. one semantic-cut attestation is admitted;
5. one typed semantic link and one bounded mesh cut are produced;
6. one exact context basis and loss-declared projection are produced;
7. one model output is linked to that basis;
8. one changed source makes the old basis visibly stale; and
9. DuckDB reproduces the exact historical cut without latest-state guessing.

It does not prove that the selected GraphFunction executed the semantic kernel,
that a calibrated F_P worker authored the proposal, or that accepted and
published semantic state is a native replay projection. Those are migration
gaps, not implied by green reference-slice tests.

No whole-enterprise mesh, production object-store deployment, or operational
semantics enrichment is required.

Pure mesh/context carriers and the physical effect may be qualified before
T-029 because they do not decide or implement GTL traversal. Those tests do not
substitute for the integrated GraphFunction, ABG event/replay, or release proof.
