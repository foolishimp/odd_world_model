# T-016 Refine Constructor To Edge-Specific Materialization

- id: T-016
- title: Refine constructor to edge-specific materialization
- type: feature
- status: completed
- goal: proving-wave-02
- change_intent: narrow the retained odd_domain constructor so each GTL edge materializes the target surface it governs rather than rebuilding the full retained corpus for every step
- change_class: realization_refactor
- re_entry_point: realized_surface
- triaged_at: 2026-04-16
- priority: high
- dependencies:
- links: parent:T-015-adopt-odd-sdlc-gtl-pattern-for-attribute-ledger.md
- created_at: 2026-04-16
- updated_at: 2026-04-16

## Context

`T-015` proved that the retained GTL carrier is the live execution line for
`odd_domain`. The remaining structural weakness was in the constructor:

- early retained edges still satisfied their target by calling coarse-grained
  build functions
- that meant `trace`, `assurance`, `attribute_ledger`, `object_cut`, and
  `published_domain_artifact` were all effectively rebuilt through the same
  broad retained path
- the runtime was lawful and proven, but the constructive boundary was still
  wider than the governing edge

This ticket narrowed the retained constructor so the active edge materializes
the target surface it is responsible for while preserving the already-proven
runtime loop.

## Major Ambiguities Encountered

- how narrow the edge-specific materialization should be in this wave:
  exactly-one-target writes, or bounded grouped writes where the retained
  source/import surface is the true constructive unit
- whether the imported trade-domain copy inside the trade-to-APRA sandbox
  should stay as one retained import step or be split further into separate
  trace / assurance / ledger / object-cut import phases
- whether later composed-world-model and query edges should continue to rebuild
  from clean retained inputs or become incremental over current workspace state

## Acceptance Realized

- `odd_domain.constructor.construct_manifest()` now dispatches to named
  edge-specific retained materialization functions rather than using one broad
  rebuild path for most edges
- the canonical `build_line/*` modules now expose retained materialization
  functions aligned to the active GTL target surfaces
- early edges no longer force APRA composition or stitching outputs when the
  target surface is only the imported trade-domain side
- composed-world-model and query edges still materialize their broader retained
  outputs lawfully
- the active `build_and_query_world_model` executive program still converges in
  a clean workspace through the product-local self-test

## Realized Surfaces

- `build_tenants/python/code/odd_domain/build_line/fpml_trade_domain.py`
  - `materialize_source_observation_surface()`
  - `materialize_trace_surface()`
  - `materialize_assurance_surface()`
  - `materialize_trade_domain_artifact()`
- `build_tenants/python/code/odd_domain/build_line/trade_to_apra.py`
  - `materialize_trade_domain_import()`
  - `materialize_trace_surface()`
  - `materialize_assurance_surface()`
  - `materialize_attribute_ledger_surface()`
  - `materialize_markov_object_cut_surface()`
  - `materialize_published_domain_artifact_surface()`
  - `materialize_composed_world_model_surface()`
- `build_tenants/python/code/odd_domain/constructor.py`
- `build_tenants/python/code/odd_domain/query/trade_to_apra.py`

## Proof Outcome

The retained end-to-end proof still converges through:

- `trace_source_observations`
- `assure_attribute_claims`
- `materialize_attribute_ledger`
- `project_markov_object_cut`
- `publish_domain_artifact`
- `compose_world_model`
- `project_query_surface`

Additional narrowing proof:

- in a clean workspace, constructing the first edge
  `trace_source_observations` materialized the target `trace_surface`
  successfully
- APRA composed-artifact outputs remained absent in that workspace at that
  stage, showing the early edge no longer forces the broader composition slice

## Notes

- The constructor is still intentionally retained and bounded. It now narrows
  constructive scope by edge, but it does not yet attempt a fully incremental
  per-file update strategy.
- That is acceptable for this wave because the GTL runtime is now both lawful
  and materially closer to the edge boundaries it governs.
