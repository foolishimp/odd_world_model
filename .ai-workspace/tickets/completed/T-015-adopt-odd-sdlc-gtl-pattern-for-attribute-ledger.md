# T-015 Adopt odd_sdlc GTL Pattern For Attribute Ledger

- id: T-015
- title: Adopt odd_sdlc GTL pattern for attribute-ledger project asset
- type: feature
- status: completed
- goal: proving-wave-02
- change_intent: adopt the proven odd_sdlc GTL design pattern in odd_world_model so that domain build is carried by typed callable assets and named graph functions, with the attribute ledger published as the primary project asset rather than left implicit inside Python orchestration
- change_class: design_reframe
- re_entry_point: design
- triaged_at: 2026-04-16
- priority: high
- dependencies:
- links: basis:20260416T000013Z_STRATEGY_odd-world-model-gtl-basis-from-odd-sdlc-review.md
- created_at: 2026-04-16
- updated_at: 2026-04-16

## Context

The current `odd_world_model` line had:

- articulated requirements for domain build, composition, and the attribute-ledger
  chain
- a lawful semantic prototype proving
  `source -> tracing -> assurance -> attribute ledger -> object cut -> published domain artifact -> composed world model`
- deterministic `F_D`-style materializers for trace, assurance, ledger, and
  object-cut records

What it lacked was the constructive carrier pattern already proven in
`odd_sdlc`:

- typed callable asset/node surfaces
- an explicit machine-readable function catalog
- a published GTL module
- a query surface that treats current visible state as projection over
  constructive history

The design target was therefore visible in `odd_sdlc`. This ticket adopted
that GTL pattern in `odd_world_model` using `odd_world_model` semantics.

## Major Ambiguities Encountered

- whether the attribute ledger itself is the first-class current project asset
  or whether the first-class current project asset should be a thinner build
  surface projected over a deeper claim history
- how closely `odd_world_model` should mirror `odd_sdlc` asset/catalog/query shapes
  versus only mirroring the GTL structural law
- whether the first GTL-native adoption slice should include the current
  query/traversal lane directly or leave query projecting over the new GTL
  checkpoint surfaces in a follow-on step

## Acceptance Realized

- `odd_world_model` now has a local design and implementation line that follows the
  `odd_sdlc` GTL structural pattern rather than leaving semantic derivation in
  one-off imperative build scripts
- the retained GTL realization was created by copying the relevant
  `odd_sdlc` GTL surfaces into `odd_world_model` and customizing them locally,
  rather than by attempting an abstract shared-library extraction in the same
  wave
- the adopted line defines typed callable asset or node surfaces for:
  - trace
  - assurance
  - attribute ledger
  - Markov object cut
  - published domain artifact
  - composed world model
  - query projection
- `odd_world_model` publishes an explicit machine-readable function catalog and a
  GTL module for the first retained subset
- the attribute ledger is treated as a governed project asset, not only as an
  incidental file written by bespoke implementation code
- the steel-thread build is replayable from source through ledger to object cut,
  publication, composition, and query projection
- the adopted shape is specific enough to prevent further `F_D`/Python loader
  sprawl

## Realized Surfaces

- requirement family:
  - `specification/requirements/50-odd-method-gtl-carrier.md`
- shared design:
  - `build_tenants/common/design/ODD_GTL_ATTRIBUTE_LEDGER_CARRIER.md`
- Python tenant carrier surfaces:
  - `build_tenants/python/code/odd_world_model/domain_model.py`
  - `build_tenants/python/code/odd_world_model/asset_types.py`
  - `build_tenants/python/code/odd_world_model/workspace_assets.py`
  - `build_tenants/python/code/odd_world_model/function_catalog.py`
  - `build_tenants/python/code/odd_world_model/query_contract.py`
  - `build_tenants/python/code/odd_world_model/app.py`
  - `build_tenants/python/code/odd_world_model/gtl_module.py`
  - `build_tenants/python/code/odd_world_model/fd_contracts.py`
  - `build_tenants/python/code/odd_world_model/fd_checks.py`
  - `build_tenants/python/code/odd_world_model/constructor.py`
  - `build_tenants/python/code/odd_world_model/self_test.py`
  - `build_tenants/python/code/odd_world_model/query/domain.py`

## Runtime Proof Landed

The retained app/runtime surface is now live:

- `odd_world_model.app` bootstraps the workspace event stream through ABG and
  exposes `catalog`, `gaps`, `iterate`, and `start`
- the published GTL module passes ABG selection/traversal-surface validation
- the retained deterministic `F_D` evaluators are bound through
  `odd_world_model.fd_contracts` and `odd_world_model.fd_checks`
- the active runtime now exposes one public executive carrier:
  `build_and_query_world_model`
- the product-local self-test proves the full retained program through
  `start -> fp_manifest_path -> construct_manifest() -> ingest_fp_result() -> start`
  until convergence

## Proof Outcome

The clean-workspace self-test now converges through the full retained edge set:

- `trace_source_observations`
- `assure_attribute_claims`
- `materialize_attribute_ledger`
- `project_markov_object_cut`
- `publish_domain_artifact`
- `compose_world_model`
- `project_query_surface`

Final state:

- `status: converged`
- `message: All jobs in scope have delta = 0. Run /gen-gaps for full report.`

## Notes

- The retained semantic materialization is still deliberately coarse-grained in
  the constructor: it calls the canonical `build_line/*` and query build
  surfaces to satisfy the target asset contract for the active edge.
- That coarseness is acceptable for this wave because the GTL carrier is now
  the actual execution authority over the retained line rather than a sidecar
  publication surface.
