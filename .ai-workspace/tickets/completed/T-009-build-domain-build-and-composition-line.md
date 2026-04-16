# T-009 Build Domain-Build And Composition Line

- id: T-009
- title: Build domain-build and world-model-composition line
- type: feature
- status: completed
- goal: proving-wave-01
- change_intent: realize the current odd_domain product-definition line downstream of the ratified intent and product surfaces so installed odd_domain products can be used by builder projects to build published domain artifacts, compose them into higher-order world models, and preserve full source traceability
- change_class: requirement_reprice
- re_entry_point: requirements
- triaged_at: 2026-04-15
- priority: high
- dependencies: none
- links: T-010, T-011, T-012, T-013, T-014
- created_at: 2026-04-15
- updated_at: 2026-04-15

## Context

`odd_domain` now has a materially repriced constitutional shape.

The current product-definition surface says the line has two constitutional
intents:

1. build published domain artifacts
2. compose those artifacts into higher-order world models

Query and traversal remain important delivery pillars, but they are not the
constitutional core of the product line.

The current intent and product-definition surfaces are already repriced. The
next work therefore needs to be cut as one build ticket that carries that
ratified line downstream through:

- requirement repricing
- design surfaces
- module / tenant boundaries
- build realization

The ticket must preserve the currently ratified shape:

- two constitutional intents:
  - build published domain artifacts
  - compose those artifacts into higher-order world models
- one current additional delivery pillar:
  - query and traversal over published domain artifacts and composed world
    models

The key technical posture is:

- prefer GTL / graph-function loading and derivation over a zoo of bespoke
  `F_D` loader modules
- use deterministic `F_D` primitives to materialize world-model records and
  event/provenance records
- keep the same traceability discipline for semantic derivation that
  `odd_sdlc` uses for specification derivation

The key governing requirement is:

every material world-model attribute must be sourceable back to evidence.

The core semantic chain is now:

`source -> tracing -> assurance -> attribute ledger -> Markov object cut`

## Major Ambiguities

- the GTL-versus-`F_D` boundary is a major downstream design ambiguity and must
  not be settled only by inherited ticket prose
- query/traversal remains a delivery pillar while not being constitutional
  core; the current line must preserve that split explicitly
- the project-local declaration that `WORLD_MODEL_METHOD.md` governs this line
  should become explicit in downstream requirement or product-definition
  surfaces rather than remaining implicit

That means the build line must make it possible to confirm, for each accepted
world-model fact or attribute:

- which source evidence supports it
- which tracing surface locates that evidence precisely
- which assurance basis accepted the qualified claim
- which attribute-ledger entry records the accepted claim
- which transformation or graph step created it
- which event or provenance record was emitted at that step
- which published domain artifact and publication cut now governs it

## Acceptance

- `odd_domain` has an explicit downstream requirement family or families for:
  - domain build
  - world-model composition
  - attribute-level sourceability / provenance
  - GTL / graph-function loading posture
- `odd_domain` has a design surface that defines the build line from:
  - source evidence
  - tracing and assurance
  - attribute-ledger materialization
  - immutable object-cut projection
  - published domain artifact
  - composed world model
  - current query / traversal delivery path
  - future optional dedicated query plane boundary
- the design makes clear where deterministic `F_D` primitives stop and where
  GTL / graph functions carry the real semantic derivation
- the design includes event / provenance emission as part of the same loading
  line that materializes world-model facts
- query and traversal remain explicitly in scope as a current delivery pillar,
  even if the design chooses a filesystem-first or low-volume implementation in
  the first slice rather than a dedicated query plane
- the module or tenant split is explicit enough that build work can proceed
  without inventing one-off loaders by default
- at least one first build slice is identified that can be implemented against
  the current sandbox or adjacent proving lane
- the resulting build line preserves source traceability strongly enough that
  every accepted world-model attribute can be traced back to evidence

## Expected Downstream Work

This ticket is expected to fan out into child work for:

- requirement repricing
- build-line design
- module / tenant realization
- first GTL / graph-function implementation slice
- provenance / event emission support
- current query / traversal delivery slice

Current child tickets:

- `T-010` completed for downstream requirement repricing
- `T-011` completed for build-line design
- `T-014` completed for prototype-driven requirement deepening before refactor
- `T-012` completed for the first implementation slice
- `T-013` completed for the current query / traversal delivery slice

The parent ticket is complete. The line is now explicit end to end:

- requirement families exist for the build/composition/verification line
- the attribute-ledger build line is ratified in design
- the proving corpus now emits trace, assurance, ledger, and object-cut
  surfaces
- the current query/traversal slice is explicit and filesystem-first
