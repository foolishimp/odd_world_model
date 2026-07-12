# TypeScript Feature Decomposition

**Status**: Retained decomposition input; superseded as current target
**Date**: 2026-05-15
**Derived from**:
- `specification/`
- `build_tenants/python/design/20-generated-feature-decomp.md`
- `build_tenants/typescript/design/adrs/ADR-003-reference-derived-design-carry-forward.md`

This surface carries forward the useful feature layering from the Python
reference design while making TypeScript, GTL/ABG, and installed `odd_sdlc`
the current realization context.

Specification remains the product WHAT. This file defines delivery HOW for the
TypeScript tenant.

## Layer 0 - Carrier And Build Governance

### FEAT-TS-CARRIER-001 - Typed ODD Carrier And GTL Module

Publish typed domain assets, named graph functions, a function catalog, GTL
jobs, and a GTL module for the current world-model product chain.

**Realizes**:
- `REQ-ODD-WORLD-MODEL-ODD-CARRIER-*`
- `REQ-ODD-WORLD-MODEL-BUILD-CONSTRAINT-001`

**Dependency**: none

**Design pressure**: graph functions are the constructive carrier; TypeScript
modules are realization cuts beneath that carrier.

### FEAT-TS-SDLC-GOV-001 - SDLC Build Evidence Adapter

Use installed `odd_sdlc` lineage ledgers, tracking registers, ticket/execution
contracts, and operator surfaces as build-governance evidence for the
TypeScript graph build.

**Realizes**:
- `REQ-ODD-WORLD-MODEL-PRODUCT-005`
- `REQ-ODD-WORLD-MODEL-RELEASE-*`

**Dependency**: FEAT-TS-CARRIER-001

**Design pressure**: `odd_sdlc` governs the build. It does not own
world-model domain semantics.

## Layer 1 - Semantic Build Line

### FEAT-TS-BUILD-001 - Source Observation, Trace, And Assurance

Recover bounded source observations into traced evidence and assurance review
surfaces before any claim is admitted into the semantic substrate.

**Realizes**:
- `REQ-ODD-WORLD-MODEL-BUILD-CAP-001`
- `REQ-ODD-WORLD-MODEL-BUILD-CAP-002`
- `REQ-ODD-WORLD-MODEL-BUILD-CAP-007`
- `REQ-ODD-WORLD-MODEL-WORLD-OBJECT-004`
- `REQ-ODD-WORLD-MODEL-WORLD-OBJECT-009`
- `REQ-ODD-WORLD-MODEL-WORLD-OBJECT-010`

**Dependency**: FEAT-TS-CARRIER-001

**Design pressure**: source adapters decompose source shapes. They do not
become durable semantic truth.

### FEAT-TS-BUILD-002 - Attribute Ledger And Immutable Object Cuts

Materialize accepted claims into an append-only attribute ledger and project
immutable Markov object cuts from that ledger.

**Realizes**:
- `REQ-ODD-WORLD-MODEL-BUILD-CONSTRAINT-002`
- `REQ-ODD-WORLD-MODEL-BUILD-CONSTRAINT-003`
- `REQ-ODD-WORLD-MODEL-WORLD-OBJECT-001`
- `REQ-ODD-WORLD-MODEL-WORLD-OBJECT-002`
- `REQ-ODD-WORLD-MODEL-WORLD-OBJECT-011`
- `REQ-ODD-WORLD-MODEL-WORLD-OBJECT-012`

**Dependency**: FEAT-TS-BUILD-001

**Design pressure**: object cuts are projections from admitted ledger truth,
not mutable records.

### FEAT-TS-BUILD-003 - Published Domain Artifact Construction

Publish bounded domain artifacts that carry object cuts, fragments, treatments,
temporal references, covariance edges, adjoint mappings, and source evidence
references.

**Realizes**:
- `REQ-ODD-WORLD-MODEL-BUILD-CAP-003`
- `REQ-ODD-WORLD-MODEL-WORLD-OBJECT-003`
- `REQ-ODD-WORLD-MODEL-WORLD-OBJECT-005`
- `REQ-ODD-WORLD-MODEL-WORLD-OBJECT-006`
- `REQ-ODD-WORLD-MODEL-WORLD-OBJECT-007`
- `REQ-ODD-WORLD-MODEL-WORLD-OBJECT-008`

**Dependency**: FEAT-TS-BUILD-002

**Design pressure**: published domain artifacts are the durable local semantic
publication units.

## Layer 2 - Composition, Mapping, And Query

### FEAT-TS-COMP-001 - Reference-Preserving World-Model Composition

Compose higher-order world models by reference to versioned published domain
artifacts while preserving local authority, object identity, version, treatment
semantics, and declared loss.

**Realizes**:
- `REQ-ODD-WORLD-MODEL-BUILD-CAP-004`
- `REQ-ODD-WORLD-MODEL-BUILD-CONSTRAINT-004`
- `REQ-ODD-WORLD-MODEL-MESH-CAP-*`
- `REQ-ODD-WORLD-MODEL-MESH-CONSTRAINT-*`

**Dependency**: FEAT-TS-BUILD-003

### FEAT-TS-MAPPING-001 - Governed Mapping Over Published Domains

Carry forward the Python trade-to-APRA design as a generic mapping boundary
over published domain artifacts, not as a hardcoded example pair.

**Realizes**:
- `REQ-ODD-WORLD-MODEL-MAPPING-CAP-*`
- `REQ-ODD-WORLD-MODEL-MAPPING-CONSTRAINT-*`

**Dependency**: FEAT-TS-COMP-001

### FEAT-TS-QUERY-001 - Query And Traversal Projection

Expose query and traversal over published artifacts, composed world models,
mapping records, and constructive history as downstream projections.

**Realizes**:
- `REQ-ODD-WORLD-MODEL-BUILD-CAP-005`
- `REQ-ODD-WORLD-MODEL-BUILD-CONSTRAINT-005`
- `REQ-ODD-WORLD-MODEL-ODD-CARRIER-006`

**Dependency**: FEAT-TS-COMP-001

## Layer 3 - Verification, Saturation, And Release

### FEAT-TS-PROOF-001 - Review Surfaces And Reverse Recoverability

Produce deterministic review, query, conventional proof, covariant proof, and
reverse-recoverability evidence over the first retained graph-build slice.

**Realizes**:
- `REQ-ODD-WORLD-MODEL-BUILD-VERIFY-001`
- `REQ-ODD-WORLD-MODEL-BUILD-VERIFY-002`
- `REQ-ODD-WORLD-MODEL-BUILD-VERIFY-003`
- `REQ-ODD-WORLD-MODEL-BUILD-VERIFY-005`

**Dependency**: FEAT-TS-QUERY-001

### FEAT-TS-SATURATION-001 - Iterative Source-Domain Deepening

Support bounded iterative deepening over a source-object set until the
attribute ledger and object cuts are sufficient for publication, with remaining
gaps carried explicitly.

**Realizes**:
- `REQ-ODD-WORLD-MODEL-BUILD-CAP-006`
- `REQ-ODD-WORLD-MODEL-BUILD-VERIFY-004`

**Dependency**: FEAT-TS-PROOF-001

### FEAT-TS-RELEASE-001 - Installed Builder Product Proof

Prove that a released `odd_world_model` builder product can be stamped into a
builder project and produce or inspect published semantic outputs from
installed product assets and project-local configuration.

**Realizes**:
- `REQ-ODD-WORLD-MODEL-BUILD-VERIFY-006`
- `REQ-ODD-WORLD-MODEL-RELEASE-*`

**Dependency**: FEAT-TS-PROOF-001

## Dependency Order

```text
FEAT-TS-CARRIER-001
-> FEAT-TS-SDLC-GOV-001
-> FEAT-TS-BUILD-001
-> FEAT-TS-BUILD-002
-> FEAT-TS-BUILD-003
-> FEAT-TS-COMP-001
-> FEAT-TS-MAPPING-001
-> FEAT-TS-QUERY-001
-> FEAT-TS-PROOF-001
-> FEAT-TS-SATURATION-001
-> FEAT-TS-RELEASE-001
```

## Reference Carry-Forward Notes

- The Python feature layering is preserved.
- The Python-first stack, commands, and module filenames are not preserved.
- Mapping is generalized from the retained trade/APRA proof slice into a
  published-domain mapping boundary.
- Query remains a delivery pillar and proof projection, not a semantic truth
  surface.
