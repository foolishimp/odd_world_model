# ADR-005 Source Lineage To Markov Object Carrier

**Status**: Accepted
**Date**: 2026-05-15
**Scope**: Source lineage, external information admission, and Markov-object construction semantics
**Ticket**: `T-026`

## Context

The world-model product is not a generic SDLC tracker. Its purpose is to link
external information into coherent world-model objects with lineage back to
source.

The product definition already declares the semantic chain:

```text
source observation
-> traced evidence
-> assured claim
-> attribute ledger
-> immutable object cut
-> published domain artifact
-> composed world model
-> query/proof projection
```

ADR-004 assigns feature and gap pressure to installed `odd_sdlc`. This ADR
records what `odd_world_model` contributes on top of that substrate.

## Decision

Every external information piece admitted into `odd_world_model` SHALL be
linked into a recoverable source-lineage chain before it can affect a
published Markov object.

The TypeScript tenant SHALL implement world-model graph functions and carriers
that make that chain explicit.

### External Information Unit

An external information piece may originate from:

- source records
- schema or interface definitions
- source code
- event payloads
- metadata catalogs
- documents
- mapping files
- reference data
- runtime observations
- existing enterprise artifacts

The product must not treat these as detached facts. Each admitted piece must
be represented first as an observation with source locator, evidence boundary,
capture context, and provenance.

### Lineage Chain

The required lineage chain is:

```text
external information piece
-> source observation
-> traced evidence span
-> assurance claim
-> accepted attribute claim
-> append-only attribute ledger entry
-> immutable Markov-object cut
-> published domain artifact
```

Derived projections, mappings, query answers, and proof reports must remain
traceable back through this chain.

### Markov Object Coherence

A Markov object is coherent only when its accepted attributes, boundaries,
adjacent objects, ingress and egress surfaces, treatment semantics, and
evidence basis are explainable through the lineage chain.

The object cut must preserve:

- stable object identity
- source-backed attribute claims
- explicit boundary and adjacency context
- treatment and covariance relationships where applicable
- unresolved ambiguity or saturation gaps
- supersession links to prior cuts
- publication and proof provenance

### Graph Function Boundary

World-model graph functions SHALL own the semantic construction movement:

- observe source
- trace evidence
- assure claim
- admit attribute
- materialize ledger entry
- project object cut
- publish domain artifact
- compose world model
- project query or proof

These graph functions may use `odd_sdlc` to admit, track, prove, and close the
governed build work. They must not move semantic lineage into `odd_sdlc`
tracking registers.

### No Unattached Facts

The TypeScript tenant SHALL NOT admit:

- unlocated source facts
- attributes without evidence provenance
- object cuts without ledger basis
- mappings without source and treatment traceability
- query projections that cannot explain their published-artifact basis
- generated documentation that presents inferred semantics as published truth

## Consequences

### Positive

- Every accepted world-model claim remains challengeable and recoverable.
- Markov objects become coherent semantic cuts rather than aggregated records.
- Query and mapping outputs can explain their source basis.
- `odd_sdlc` can track the build without becoming the semantic ledger.

### Negative

- Early implementation must materialize lineage carriers before broad query
  convenience.
- Retained examples need source locators and evidence spans, not only expected
  output files.
- The first slice may expose more missing source evidence than the old Python
  reference made visible.

## Non-Decisions

- This ADR does not choose a database, file format, or serving plane.
- This ADR does not define every Markov-object field.
- This ADR does not replace product requirements under `specification/`.
- This ADR does not create a second feature-gap tracking system.

## Acceptance

- Implementation design defines carriers for source observation, traced
  evidence, assurance claim, attribute ledger entry, object cut, and published
  domain artifact.
- Every accepted attribute claim is recoverable to source evidence.
- Every published Markov-object cut is projected from the attribute ledger.
- Query, mapping, and proof projections can trace back to published artifacts
  and their source evidence chain.
- `odd_sdlc` feature and gap tracking is reused for build governance while
  world-model lineage remains product-owned semantics.
