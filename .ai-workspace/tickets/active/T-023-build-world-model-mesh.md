# T-023 Build World-Model Mesh

- id: T-023
- title: Build world-model mesh
- type: feature
- status: active
- goal: proving-wave-05
- change_intent: turn the existing federated world-model direction in odd_world_model into an explicit governed mesh line over published domain artifacts, common models, and composed world models
- change_class: requirement_reprice
- re_entry_point: requirements
- triaged_at: 2026-04-16
- priority: high
- dependencies:
- links: basis:ATTRIBUTE_LEDGER_BUILD_LINE.md, basis:CURRENT_QUERY_TRAVERSAL_SLICE.md, basis:MULTI_DOMAIN_MAPPING_LINE.md, basis:ADR-001-source-decomposition-and-build-boundaries.md
- created_at: 2026-04-16
- updated_at: 2026-04-16

## Context

`odd_world_model` already has the local ingredients for a mesh:

- published domain artifacts
- source domains and interpreted domains
- composed world models
- common-model language in `PRODUCT.md`
- query and mapping lines that can operate across published domains

What it does not yet have is an explicit governed mesh line.

Right now, the product vision says:

- the world model is federated
- each bounded context can publish its own domain artifact
- those artifacts can be stitched into higher-order world models

But that is still mostly product direction and design implication. It has not
yet been cut as a concrete requirement/design/implementation wave.

The required move is to make the mesh explicit:

- what the mesh nodes are
- what the lawful edge types are
- how published domains, common models, and composed world models participate
- how versioning and supersession work across the mesh
- how traversal, query, and mapping remain downstream of the mesh rather than
  becoming competing truth surfaces

## Required Outcome

This ticket should establish a lawful line of the form:

`published domain artifact / common model / composed world model -> mesh linkage and publication -> mesh traversal and downstream projections`

The mesh is not a central flattened super-model.

It is a federated graph of published semantic cuts with explicit identity,
boundary, version, reference, and supersession.

## First Mesh Scope

The first retained mesh slice should use real domains already present in the
product line:

- `fpml_confirmation_source_domain`
- `trade_representation_domain`
- `apra_liquidity_domain`

and should be capable of admitting future common-model nodes without reopening
the law of the line.

## Major Ambiguities

- whether the first durable mesh truth should be:
  - one mesh manifest
  - one mesh fragment
  - or a mesh root plus linked node records
- whether `common model` should become:
  - a distinct published-domain subtype
  - or remain a role played by an ordinary published domain artifact
- whether composed world models belong:
  - inside the same mesh as first-class nodes
  - or as a separate layer projected over the mesh
- whether the first proving slice should include:
  - mesh traversal only
  - mesh-aware mapping
  - or mesh-aware query plus mapping together
- how much of the first slice should be explicit about:
  - supersession
  - version ranges
  - compatibility contracts
  - common-model adoption

## Expected Downstream Work

This ticket should carry downstream closure through:

1. requirements
   - explicit mesh capability and constraint requirements
2. design
   - mesh node and edge model
   - publication boundaries
   - version/supersession handling
   - traversal/projection boundaries
3. implementation
   - mesh asset surfaces
   - graph-function support
   - first retained mesh corpus
4. verification
   - deterministic mesh publication checks
   - retained traversal/query/mapping proof over the first mesh slice

## Acceptance

- `odd_world_model` has explicit requirements for a federated world-model mesh over
  published semantic cuts
- the requirements define lawful mesh participation for:
  - published domain artifacts
  - common models
  - composed world models
- the design line defines:
  - mesh nodes
  - mesh edges
  - version and supersession treatment
  - traversal and projection boundaries
- the first retained implementation publishes a real mesh slice over domains
  already present in `odd_world_model`
- the first retained proof can traverse across the mesh without flattening it
  into a central anonymous model

## Notes

- this is not a rewrite of the existing domain-build line
- this is not a license to introduce a second truth surface beside published
  domains and composed world models
- the mesh should make federation explicit, not erase bounded-context identity
- mapping and query should remain downstream projections over the mesh
