# ADR-004 Reuse odd_sdlc Gap Tracking

**Status**: Historical odd_sdlc tracking decision; retained as governance lineage
**Date**: 2026-05-15
**Scope**: Build pressure, feature gap tracking, and solution-architecture overlay reuse
**Ticket**: `T-026`

Current work tracking follows the repo STDO ticket/commentary surfaces. This
ADR does not authorize an odd_sdlc runtime, overlay, or constructive carrier.

## Context

`odd_world_model` is being rebuilt on top of installed `odd_sdlc.TS`.

The solution-architecture overlay generated tenant-local read models such as:

- `build_tenants/typescript/design/feature_decomp_surface.md`
- `build_tenants/typescript/design/adrs/ADR-001-design-surface.md`
- `build_tenants/typescript/design/scenario_surface.md`

Those artifacts are useful planning surfaces, but they must not become a new
world-model feature tracking system.

One reason for building `odd_world_model` on top of `odd_sdlc` is that
`odd_sdlc` already owns exhaustive feature, requirement, design, execution,
gap, repair, proof, and closure tracking for governed build work.

## Decision

`odd_world_model` SHALL reuse installed `odd_sdlc` gap and feature-pressure
tracking for governed build work.

The TypeScript tenant SHALL NOT create a parallel world-model feature-gap
registry, ticket tracker, closure ledger, or execution-pressure system.

### Reused odd_sdlc Surfaces

Installed `odd_sdlc` remains responsible for:

- ticket-to-work admission
- feature decomposition pressure
- requirement and design gap projection
- execution-contract construction
- graph-overlay traversal pressure
- edge fulfillment ledgers
- repair and retry pressure
- proof and closure projection
- release/install evaluation pressure

`odd_world_model` may read these surfaces as build evidence and may expose
domain-specific projections over them, but it must not fork their authority.

### World-Model Responsibility

`odd_world_model` remains responsible for world-model semantics:

- source observation
- traced evidence
- assurance and claim admission
- attribute ledger semantics
- immutable Markov-object cuts
- published domain artifacts
- reference-preserving composition
- query and proof interpretation over published semantic artifacts

The world-model product can describe semantic incompleteness, ambiguity,
missing source evidence, and unsaturated object cuts. Those are domain facts.
They are not a replacement for `odd_sdlc` build gaps.

### Overlay Interpretation

Solution-architecture overlay outputs are read models over `odd_sdlc` build
pressure.

They may guide implementation planning, but accepted ADRs and tenant design
surfaces govern how that planning is interpreted. If a generated overlay output
appears to introduce a second tracking system, the accepted interpretation is
that the output is naming pressure already owned by `odd_sdlc`.

### Stopped Design Run

The active solution-architecture overlay run was stopped before accepting an
implementation-design surface because the architecture boundary needed to be
repriced:

```text
feature gaps and build pressure -> odd_sdlc
source lineage and Markov-object semantics -> odd_world_model
```

Implementation design must be regenerated or revised from this ADR and
ADR-005 before code materialization proceeds.

## Consequences

### Positive

- `odd_world_model` avoids rebuilding SDLC tracking infrastructure.
- Feature and requirement pressure remains comparable with other
  `odd_sdlc`-governed products.
- World-model code can focus on semantic lineage and object construction.
- Overlay outputs remain useful without becoming a second authority plane.

### Negative

- Implementation design must keep build-pressure and semantic-lineage
  concerns visibly separate.
- Domain-specific incompleteness must be projected back through `odd_sdlc`
  when it becomes governed work pressure.
- A generated feature decomposition is not enough to prove world-model
  closure unless the underlying `odd_sdlc` pressure and world-model semantic
  lineage both close.

## Non-Decisions

- This ADR does not change `odd_sdlc` internals.
- This ADR does not define a new `odd_sdlc` overlay.
- This ADR does not define the world-model lineage carrier; ADR-005 owns that
  decision.
- This ADR does not accept any implementation-design surface generated before
  this repricing.

## Acceptance

- Tenant design states that `odd_sdlc` owns build feature-gap tracking.
- Tenant design does not introduce a parallel gap registry.
- Solution-architecture overlay outputs are treated as read models over
  `odd_sdlc` pressure.
- World-model semantic gaps are represented as source-lineage and object-cut
  facts, then admitted into `odd_sdlc` work pressure when they require build
  action.
