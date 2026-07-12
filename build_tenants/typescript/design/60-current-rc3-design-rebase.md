# TypeScript Current Design Rebase

**Status**: Superseded implementation gate; retained pre-acceptance phase evidence
**Date**: 2026-07-12
**Tickets**: T-026, T-028, T-029
**Substrate resolution**: ABIogenesis `4.6.0-rc.3` with `odd_glc 0.1.0`

## Purpose

This document records the TypeScript tenant state before ADR-WM-004 acceptance.
`90-admitted-semantic-steel-thread-design.md` is the current TypeScript design
entry point. Design 80 is the superseded component-qualified as-built record.
The pre-acceptance prohibitions below are historical phase evidence, not a live
implementation gate.

The target semantic path is:

```text
source evidence
  -> construction evidence
  -> accepted attribute ledger
  -> immutable object cuts
  -> published semantic cut
  -> typed semantic links
  -> bounded mesh cut
  -> context basis
  -> loss-declared context projection
  -> attributed invocation output
```

Physical persistence is one admitted effect from this path. Query is one
projection over it. Neither is a second constructive carrier.

## Governing Design

The tenant consumes these shared decisions:

- `build_tenants/common/design/WORLD_MODEL_COMMON_ARCHITECTURE.md`
- `build_tenants/common/design/adrs/ADR-WM-001-source-decomposition-and-build-boundaries.md`
- `build_tenants/common/design/adrs/ADR-WM-002-semantic-memory-and-authority-boundaries.md`
- `build_tenants/common/design/adrs/ADR-WM-003-iceberg-storage-and-cut-attestation.md`
- accepted `build_tenants/common/design/adrs/ADR-WM-004-gtl-graph-function-catalog.md`
- accepted `build_tenants/common/design/GTL_GRAPH_FUNCTION_CONTRACTS.md`

ADR-WM-004 and the contract pack were review inputs at this phase. F_H later
accepted them and authorized the full build recorded by the successor design.

## Tenant Modules

| TypeScript module | Shared boundary | Current implementation authority |
| --- | --- | --- |
| `domain/` | Prime WM carriers and exact refs | Yes: types, constructors, validation |
| `source_ingress/` and `adapters/` | Foreign-source observation | Existing adapters retained; no new semantic authority |
| `semantic_construction/` | Proposed claims and deterministic checks | Types and pure checks only before GTL review |
| `semantic_publication/` | Ledger, object-cut, and publication semantics | Types and pure admission checks only before GTL review |
| `mesh/` | Semantic links, bounded cuts, impact closure | Types and pure deterministic checks |
| `context/` | Basis, projection, staleness | Types and pure deterministic checks |
| `invocation/` | Attributed model invocation | Contract types only before GTL review |
| `storage/` | `PhysicalCutStore` effect port and protocol codecs | Yes: port and deterministic codecs; Python owns first adapter |
| `query/` | Exact-cut projections | Contract types only in first slice |
| `substrate_binding/` | Exact rc.3 conformance, publication, invocation, event refs | Design only before GTL review |

The implementation may split a row when a module develops independent
identity, authority, lifecycle, or proof. It may not create stage wrappers
whose only purpose is file placement.

## Current Implementation Slice

Before GTL review, T-026 may implement and qualify:

1. exact-ref and semantic-memory carrier types;
2. semantic-link and bounded-mesh-cut invariants;
3. context-basis closure and hidden-expansion rejection;
4. projection fidelity/loss and staleness checks;
5. semantic-cut attestation construction and verification;
6. the technology-neutral `PhysicalCutStore` port;
7. the versioned TypeScript/Python storage-effect protocol; and
8. deterministic tests for those boundaries.

The first Python PyIceberg adapter may implement the admitted physical effect
behind that port. It has no semantic proposal, acceptance, traversal,
continuation, or closure authority.

## GTL Review Gate

Until ADR-WM-004 is accepted, the tenant must not add:

- `gtl/functions.ts`, `gtl/jobs.ts`, or `gtl/module.ts` implementations;
- a runtime function catalog;
- a public graph-function handle;
- an ABG start wrapper or process loop;
- a substitute filesystem executive; or
- a service method that performs the proposed graph traversal imperatively.

The historical handle `odd_world_model.rebuild_world_model_core` is retired
readback. The proposed catalog is defined only in ADR-WM-004 and
`GTL_GRAPH_FUNCTION_CONTRACTS.md` until review.

## Exact rc.3 Binding

The selected proving slice uses exact rc.3 only through an isolated
`substrate_binding` boundary. That boundary will own:

- GTL `GraphFunction`, `Job`, and `Module` conversion;
- `typecheck-gtl-program` conformance;
- workspace `runtimeRegistryStartup` target resolution;
- canonical event identity and ABG admission refs; and
- dependency/build identity evidence.

Domain and storage modules do not import rc.3 wire types. A successor substrate
changes this adapter and its conformance proof unless Product meaning changes.

## Proof Order

```text
pure carrier/invariant tests
-> cross-language protocol contract tests
-> PyIceberg exact-snapshot effect tests
-> accepted GTL declaration conformance
-> exact rc.3 target-resolution proof
-> ABG event/admission/replay proof
-> end-to-end semantic publication and context proof
-> installed-product and release proof
```

Passing an earlier lane does not imply closure of a later lane.

## Legacy Design Classification

| Surface | Classification |
| --- | --- |
| `20-feature-decomposition.md` | Retained decomposition input; superseded as current target |
| `30-world-model-odd-design.md` | Retained topology input; superseded as current target |
| `40-module-boundaries.md` | Retained module input; superseded as current target |
| `50-test-and-proof-design.md` | Retained proof input; old handle and runner claims superseded |
| `55-scenario-sandbox-proof-structure.md` | Historical odd_sdlc sandbox readback |
| ADR-001 | Technology provenance; trigger/catalog decision superseded |
| ADR-002 | Historical odd_sdlc governance decision |
| ADR-003 | Retained reference-derivation law |
| ADR-004 | Historical odd_sdlc tracking decision |
| ADR-005 | Retained lineage law, refined by common architecture |
| generated overlay surfaces | Superseded planning read models |

No stale surface above may authorize implementation when it conflicts with
this rebase or the accepted common ADRs.
