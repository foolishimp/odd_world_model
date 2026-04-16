# World Model Representation Tenant

**Status**: Draft
**Scope**: Shared realization design for the canonical file-native
representation carrier used by `odd_domain`

## Purpose

Define the first common tenant law for the `odd_domain` semantic kernel.

This tenant is the shared representation carrier for published world fragments,
world-model objects, Markov objects, treatment surfaces, covariance edges,
adjoint mappings, temporal reference artifacts, and derived projection
specifications.

## Position

This tenant is a shared realization surface under `build_tenants/common/`.

It does not redefine constitutional product truth. It chooses the structural
how for realizing the requirement family in
`specification/requirements/10-world-model-object-representation.md`.

The tenant is file-first and Git-first.

Published semantic cuts remain versioned files under project control.

No database is required in the initial low-volume lane.

If a database is later introduced, it will be a complementary tenant for
regenerated read models and query acceleration, not the publication authority.

## Design Rules

### Canonical Carrier

Use `JSON` as the initial canonical carrier format for governed semantic
objects and fragment publications.

Rationale:

- deterministic parsing
- strong schema validation
- stable tooling
- grep-friendly enough for authoring
- easier canonicalization than YAML

### Publication Authority

Git and the filesystem are the authority for published world-model cuts.

The tenant must preserve:

- immutable published cuts
- explicit supersession by new cuts
- reviewable diffs
- human-readable manifests and object packets

### Scale Boundary

The low-volume lane should assume file-first authoring and retrieval.

Large evidence bodies remain referenced, fingerprinted, summarized, or
selectively cached rather than duplicated into every semantic object packet.

### Projection Boundary

Markov objects and world-model objects are the semantic kernel.

User-facing tables, schema contracts, API contracts, event contracts, mapping
documents, lineage views, and transformation artifacts are derived projections
over that kernel.

Those projections must remain traceable back to:

- the governing object packet
- the supporting evidence surfaces
- the treatment, covariance, and adjoint semantics that explain them

## Shared Carrier Topology

The common tenant should define carrier law for at least these document kinds:

- `WorldFragment`
- `WorldModelObject`
- `MarkovObject`
- `TreatmentSurface`
- `CovarianceEdge`
- `AdjointMapping`
- `TemporalReferenceArtifact`
- `ProjectionSpec`
- `EvidenceManifest`

Projection specifications should support publication of at least:

- tables
- schema contracts
- API contracts
- event contracts
- mapping documents
- `dbt` models
- lineage views
- state timelines
- glossary pages

The initial topology should support a fragment root shaped roughly as:

```text
<fragment-root>/
  fragment.json
  objects/
    *.json
  reference_artifacts/
    *.json
  treatments/
    *.json
  edges/
    covariance/*.json
    adjoints/*.json
  projections/
    *.json
  evidence/
    manifests/*.json
```

The exact folder names may change during implementation, but the realization
must preserve the separation between objects, edges, projections, and evidence
manifests.

Temporal reference artifacts should be used for changing value lists, code
sets, classifications, and other governed reference semantics whose meaning or
membership can vary over time.

## Object Packet Rule

Every object packet must be sufficient to carry:

- identity
- boundary
- state
- evidence
- cross-domain semantics
- composition references

Markov-object packets must additionally make the effective blanket explicit.

The tenant does not require every first-cut object to be fully deepened.
Sparse first publication is lawful if the packet remains bounded, auditable, and
distinguishable from nearby objects.

## Validation Rule

The common tenant should provide deterministic validation for the carrier
documents.

At minimum, validation must check:

- required fields by document kind
- object and edge identity stability
- reference integrity within a fragment
- required treatment and covariance fields where those documents exist
- projection references back to the governing semantic objects

## Initial Implementation Split

The first implementation wave should split into:

1. common JSON carrier schemas and validators
2. fragment publication scaffolds
3. projection generation from the same governed model

The first implementation wave should not include:

- a mandatory database tenant
- a large interactive UI surface
- generalized enterprise-scale indexing

Those may follow once the low-volume publication lane is proven.
