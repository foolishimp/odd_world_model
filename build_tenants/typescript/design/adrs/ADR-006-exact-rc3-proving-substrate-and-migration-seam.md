# ADR-006 Exact rc.3 Proving Substrate And Migration Seam

**Status**: Accepted for the incremental proving slice
**Date**: 2026-07-12
**Scope**: Concrete TypeScript substrate resolution and successor migration boundary
**Tickets**: T-026, T-028

## Context

The Product depends on floating GTL/ABG and GLC contracts. A concrete build
still needs one exact dependency resolution.

F_H selected ABIogenesis `4.6.0-rc.3` with `odd_glc 0.1.0` because the current
work is an incremental concept proof and the resulting local contracts can be
migrated through explicit adapters. This selection is not timeless Product
law.

At rc.3, a published graph-function handle is resolved by the exact workspace
binding's `runtimeRegistryStartup` target catalog. GTL module construction and
program conformance are available. Later standalone catalog operations, graph
shells, and broad public-consumption contracts are not rc.3 capabilities and
must not be assumed.

The prior TypeScript design also named
`odd_world_model.rebuild_world_model_core` and a filesystem-oriented scenario
runner before the current function catalog was decided. Those are stale
readback.

## Decision

### Exact Resolution

The next runnable TypeScript proof will bind to:

- ABIogenesis `4.6.0-rc.3`;
- `odd_glc 0.1.0`;
- the exact package exports and workspace binding from that release family;
- `typecheck-gtl-program` for declared program conformance; and
- `start graph_function:<accepted_handle>` through the binding-declared
  `runtimeRegistryStartup` catalog.

Every build and proof records package version, source/tag, manifest, digest,
workspace binding, and compatibility result.

### Migration Seam

All selected-substrate knowledge belongs in `substrate_binding/`. Product
modules consume WM-local contracts for:

- graph-function declaration;
- module publication;
- invocation request/result;
- runtime event and admission refs;
- replay/evidence refs; and
- F_P capability binding.

The rc.3 adapter converts those contracts once at ingress and egress. Domain,
mesh, context, storage, and query modules do not import rc.3-specific wire
shapes.

Stable successor invariants are exact semantic payload digests, distinct F_P
proposal/F_D check/ABG admission/WM acceptance states, replay-derived
publication and physical-effect witnesses, immutable published cuts, typed
gaps, and ABG-owned closure. Provisional rc.3 mechanics are
`StartInputAssetBinding`, evidence-ref payload carriage, canonical event field
names, and run/graph-call identity formatting.

A successor is equivalent only when the same fixture produces byte-equivalent
semantic payloads, trace-equivalent authority transitions, the same lawful
terminal/gap states, and no product-local traversal or status ledger. A
different successor contract requires an explicit design reframe; adapter-only
migration is not assumed.

### Accepted GTL Realization

This ADR selects the proving substrate; accepted ADR-WM-004 selects function
names and granularity. The TypeScript tenant implements that catalog through
public package APIs and keeps all rc.3 knowledge in `substrate_binding/`.

The public-start probe is a bounded substrate adapter, not a product traversal
runtime. It delegates target selection and declared graph traversal to
ABIogenesis and reads GLC projections over emitted ABG truth. Its current
plugins carry preconstructed exact refs; they do not execute WM payload
transforms or prove calibrated F_P authorship. The local semantic kernel is an
executable reference implementation pending successor migration.

### No Filesystem Executive

The TypeScript example runner is quarantined under
`historical/filesystem_runner/`. It may be read to recover expected semantics,
but is not exported, packaged, tested, or cited as current proof.

## Consequences

- Concept work can proceed against a real, exact released family.
- Successor migration is concentrated in one adapter and conformance lane.
- The project cannot claim later ABIogenesis catalog features on rc.3.
- accepted GTL code is isolated behind the same successor migration seam as
  conformance and public start.
- native WM payload execution and replay-native semantic projection remain
  explicit open migration obligations.
- The old monolithic handle and filesystem-runner topology lose authority.

## Acceptance

- exact rc.3 and GLC dependency identities are recorded by every concrete run;
- rc.3-specific types do not leak into WM domain or storage contracts;
- target resolution uses the binding-declared catalog;
- no later catalog or graph-shell capability is claimed;
- public handles in code match accepted ADR-WM-004 exactly; and
- no filesystem executive is extended as the current carrier.
