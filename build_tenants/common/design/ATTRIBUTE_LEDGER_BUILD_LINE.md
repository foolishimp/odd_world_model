# Attribute Ledger Build Line

**Status**: Draft
**Scope**: Shared realization design for the `odd_world_model` build line from
source evidence to composed world models

## Purpose

Define the realization shape of the current `odd_world_model` line:

- build published domain artifacts
- compose those artifacts into higher-order world models
- support the current low-volume query/traversal pillar downstream of the
  publication truth

This surface does not redefine constitutional method or product truth. It
realizes the governing line carried by:

- `WORLD_MODEL_METHOD.md`
- `specification/INTENT.md`
- `specification/PRODUCT.md`
- `specification/requirements/10-world-model-object-representation.md`
- `specification/requirements/20-domain-build-and-composition-capability.md`
- `specification/requirements/30-domain-build-and-composition-constraints.md`
- `ADR-001-source-decomposition-and-build-boundaries.md`

Use `WORLD_MODEL_REPRESENTATION_TENANT.md` for the file-carrier and schema law.
This document defines the build flow, asset boundaries, and responsibility
split.

## Resolved Design Decisions

### 1. Attribute Ledger Is The Immediate Semantic Source

The attribute ledger is the immediate semantic source of a published Markov
object cut.

The ledger is append-only and records qualified semantic claims over a stable
object identity.

The object cut is the immutable projection over that ledger at a publication
boundary.

### 2. GTL Carries Semantic Derivation

GTL / graph functions carry the semantic derivation and traversal law of the
build line.

They are responsible for:

- selecting the source-object set
- traversing source evidence surfaces
- aligning traced observations
- forming assured qualified claims
- grouping claims by stable object identity
- projecting immutable object cuts
- orchestrating publication and composition flow

### 3. F_D Carries Deterministic Materialization

Deterministic `F_D` primitives do not own the semantic interpretation of the
build line.

They are responsible for deterministic materialization such as:

- trace records
- assurance records
- attribute-ledger entries
- provenance/event records
- object-cut serialization
- publication manifests
- projection records

This is a hard boundary. One-off `F_D` loaders that quietly absorb semantic
derivation are not part of the design.

### 4. Query Is Downstream Of Publication

The current query/traversal pillar remains downstream of published domain
artifacts and composed world models.

The low-volume lane remains filesystem-first.

If a future database-backed query plane is introduced, it is regenerated from
published artifacts and does not become the publication authority.

## Build Line

The build line is:

`source evidence -> tracing -> assurance -> attribute ledger -> immutable object cut -> published domain artifact -> composed world model -> current query/traversal`

Each stage is explicit and addressable.

### 1. Source Evidence

Source evidence is any lawful upstream surface used to support world-model
claims, including:

- documents
- code and configuration
- data records
- interfaces and schemas
- events and runtime surfaces
- reference artifacts

At this stage, the project is observing candidate evidence, not yet accepting
semantic truth.

### 1A. Categorical Adapters And Published Source Domains

Source adapters are categorical decomposition readers over source families.

They exist to deconstruct sources such as:

- PDF
- Markdown
- code
- schemas
- FpML

They are not project-instanced truth surfaces.

Adapter-emitted review observations are subordinate constructor aids only.

Where source structure must remain explorable for lineage and provenance, the
build line should publish a bounded source domain before or alongside the
downstream interpreted world-model domain.

### 2. Tracing

Tracing creates precise locators from accepted source surfaces into usable
intermediate records.

Trace records should carry enough detail to point back to:

- source identity
- source kind
- source path or handle
- field, span, locator, or code path
- observation coordinates

Tracing answers:

- where did this candidate fact come from?

Tracing does not yet answer:

- should this become world-model truth?

### 3. Assurance

Assurance converts traced observations into qualified candidate claims that may
enter the semantic layer.

Assurance records should state:

- what is being claimed
- whether the claim is observed, derived, interpreted, or composed
- which sources support the claim
- what authority each source contributes
- what ambiguity remains

Assurance answers:

- why do we accept this claim as lawful semantic truth?

### 4. Attribute Ledger

The attribute ledger materializes the accepted qualified claim set.

Each ledger entry is append-only and should be fully qualified enough to carry:

- stable object identity
- attribute or relation identity
- claim kind
- claimed value or relation
- authority/provenance basis
- effective, observed, and publication coordinates
- supersession relation where applicable

The ledger is not merely a cache of object state. It is the accountable
semantic record from which object cuts are projected.

### 5. Immutable Object Cuts

An immutable object cut is projected from the attribute ledger over one stable
object identity.

Object cuts should carry:

- object identity
- cut identity
- governing ledger-entry references
- state surface
- blanket/boundary surface
- evidence references
- treatment/covariance/adjoint references where applicable
- supersedes or superseded_by

No object cut is edited in place. A new publication understanding creates a new
cut.

### 6. Published Domain Artifacts

A published domain artifact is the durable semantic publication unit.

It packages:

- bounded fragments
- object cuts
- reference artifacts
- treatments
- edges
- projections
- evidence manifests

Publication remains file-first and Git-first in the current lane.

### 7. Composed World Models

Composed world models are built by referencing published domain artifacts and
their cuts.

Composition should preserve:

- artifact identity
- artifact version
- local authority
- bounded-context meaning
- declared loss and ambiguity

Composition does not flatten or overwrite local published truth.

### 8. Current Query / Traversal Path

The current query/traversal path operates over:

- published domain artifacts
- composed world models
- their edges, treatments, and provenance references

The first lane is filesystem-first:

- file enumeration
- manifest loading
- structured object lookup
- edge traversal
- proof/report generation

This lane should be sufficient for current sandbox questions such as:

- what published artifact defines this object?
- which ledger-backed cut governs this value?
- what treatment or adjoint explains this downstream mapping?
- what path through composed artifacts explains this reporting position?

## Build Assets

The build line should use or introduce explicit assets for at least:

- `SourceObservation`
- `TraceRecord`
- `AssuranceRecord`
- `AttributeLedgerEntry`
- `MarkovObjectCut`
- `PublishedDomainArtifact`
- `CompositionRecord`
- `ProjectionRecord`

The exact document names may differ during implementation, but these boundaries
must remain explicit.

## Tenant Split

### Common Tenant

`build_tenants/common/` owns:

- carrier law
- shared schemas
- shared build-line design
- shared examples and proving corpus

### Python Tenant

`build_tenants/python/` currently owns the first executable lane for:

- deterministic validation
- source adapters
- sandbox builders
- proof generation

The first implementation slice should extend this tenant rather than inventing
additional tenant families prematurely.

## Implementation Guidance

The first realization slice should:

1. introduce explicit trace and assurance records in the current sandbox lane
2. materialize an explicit attribute-ledger surface
3. project at least one Markov object cut from that ledger
4. publish the resulting domain artifact without changing file-first authority
5. keep current proof and query/traversal compatibility intact

The first slice should not:

- introduce a mandatory database
- replace the existing carrier topology
- generalize the platform beyond the current proving lane

## Future Query-Plane Seam

If the query/traversal pillar outgrows the low-volume lane, the future query
plane should be inserted after published artifacts and composed world models,
not before them.

That future seam is:

`published artifacts / composed world models -> regenerated query plane`

The query plane may accelerate:

- lookup
- traversal
- indexing
- serving

It may not become the constitutional source of semantic truth.
