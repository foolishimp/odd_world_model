# T-011 Design Attribute-Ledger Build Line

- id: T-011
- title: Design attribute-ledger and object-cut build line
- type: feature
- status: completed
- goal: proving-wave-01
- change_intent: define the odd_world_model build design from traced source evidence through assurance and attribute-ledger materialization into immutable Markov object cuts, published domain artifacts, composed world models, and the current query/traversal path
- change_class: design_reframe
- re_entry_point: design
- triaged_at: 2026-04-15
- priority: medium
- dependencies: T-010
- links: parent:T-009
- created_at: 2026-04-15
- updated_at: 2026-04-15

## Context

The method and product line are now explicit, but the realization design is not
yet cut clearly enough to guide implementation.

The design needs to make clear:

- where tracing stops and assurance begins
- where deterministic `F_D` primitives materialize records
- where GTL / graph functions carry semantic derivation
- how attribute-ledger entries relate to provenance/event records
- how immutable object cuts are projected and superseded
- how published domain artifacts are composed into higher-order world models
- where the current filesystem-first query/traversal path ends and a future
  dedicated query plane could begin

## Major Ambiguities

- the GTL-versus-`F_D` boundary is still a major design ambiguity. This ticket
  must either resolve it in the design surface or publish an explicit ADR or
  equivalent design-decision record for the chosen split.
- the attribute-ledger position is ratified method direction, but the exact
  implementation shape remains open: immediate semantic source versus a thinner
  projection cache over another deeper claim store. This ambiguity must be
  surfaced and resolved or explicitly carried.
- query/traversal remains in-scope delivery while not being constitutional
  core. The design must state the current filesystem-first boundary and the
  future optional query-plane seam explicitly.

## Acceptance

- there is a design surface for the build line under `build_tenants/.../design/`
  or an equivalent local authority surface
- the design explicitly models:
  - source evidence
  - tracing
  - assurance
  - attribute ledger
  - immutable object cuts
  - publication cuts
  - composition
  - current query/traversal path
- the design makes the GTL / `F_D` split explicit enough to prevent one-off
  loader sprawl
- if the GTL / `F_D` split remains materially arguable, the ticket publishes an
  explicit ADR or equivalent design-decision record rather than leaving the
  choice implicit in ticket prose
- the design is specific enough that a first build slice can be implemented
  without reopening intent/product direction

## Completion

Completed by:

- adding `build_tenants/common/design/ATTRIBUTE_LEDGER_BUILD_LINE.md`
- extending `build_tenants/common/design/README.md` so the build-line design is
  part of the active shared-design set
- resolving the GTL / `F_D` split in the design itself rather than leaving it
  as ticket prose
- defining the current filesystem-first query/traversal seam and the future
  optional query-plane boundary
