# odd_sdlc Dogfood Line

**Status**: Historical governance proof; not current realization authority
**Scope**: Source-project governance line for building `odd_world_model` through a
released installed `odd_sdlc` product

## Purpose

Define the first real dogfood boundary where a released installed
`odd_sdlc` product governs the mutable `odd_world_model` source project without
collapsing the distinction between:

- released `odd_sdlc` product
- mutable `odd_world_model` source project
- released or installed `odd_world_model` outputs

This design is governed by:

- `SPEC_METHOD.md`
- `ODD_METHOD.md`
- `specification/INTENT.md`
- `specification/PRODUCT.md`
- `.ai-workspace/tickets/active/T-018-dogfood-odd-world-model-through-released-odd-sdlc.md`

## Boundary

The governing recursive product line is:

`released odd_sdlc product -> mutable odd_world_model source project -> released odd_world_model product`

The roles stay distinct:

- `.odd_sdlc/` is the installed immutable SDLC product used to govern work
- `/Users/jim/src/apps/odd_world_model` is the mutable source project being built
- `.genesis/odd_world_model/` or downstream sandbox installs remain separate released
  `odd_world_model` product instances

`odd_sdlc` does not become the `odd_world_model` product domain.
It governs how the `odd_world_model` source project proceeds as software work.

## Chosen odd_sdlc Runtime Surfaces

The first dogfood wave uses only the released installed `odd_sdlc` runtime
already stamped into the source workspace:

- `python -m odd_sdlc refresh-analysis --workspace .`
- `python -m odd_sdlc gaps --workspace .`
- `python -m odd_sdlc start --auto --workspace .`
- `odd_sdlc.constructor.construct_manifest()`
- `genesis.result_ingest.ingest_fp_result()`

These are used against the mutable `odd_world_model` workspace root, not against an
installed `odd_world_model` sandbox.

## Bounded Delivery Slice

The first bounded slice is intentionally narrow:

1. adopt `specification/INTENT.md`
2. adopt `specification/PRODUCT.md`
3. adopt `specification/GOALS.md`
4. generate the first SDLC-owned downstream surfaces:
   - `specification/requirements/10-generated-bootstrap.md`
   - `build_tenants/python/design/20-generated-feature-decomp.md`
   - `specification/scenarios/20-generated-uat-testcases.md`
   - `build_tenants/python/design/30-generated-odd-design.md`

This is the smallest slice that proves the recursive relationship is
operational rather than purely rhetorical:

- the first three steps show `odd_sdlc` governing `odd_world_model` constitutional
  surfaces without rewriting them as direct source edits
- the fourth step shows `odd_sdlc` generating new project-owned SDLC surfaces
  from those governed inputs

## Operational Rule

The dogfood runner must treat the source workspace as stateful and resume-safe:

- refresh analysis before each turn
- call `start()` on the installed `odd_sdlc` app
- when `start()` returns `iterated` or a resumable `pending` FP manifest,
  construct the manifest and ingest the result
- stop after each bounded authoritative turn and refresh analysis before the
  next continuation edge

This keeps the proof narrow and lawful.

## Current Outcome

The released installed `odd_sdlc` line now operates over the live
`odd_world_model` workspace and has converged the full current SDLC authority line:

- adoption of the existing `INTENT.md`
- adoption of the existing `PRODUCT.md`
- adoption of the existing `GOALS.md`
- generation of `specification/requirements/10-generated-bootstrap.md`
- generation of `build_tenants/python/design/20-generated-feature-decomp.md`
- generation of `specification/scenarios/20-generated-uat-testcases.md`
- generation of `build_tenants/python/design/30-generated-odd-design.md`
- generation of `specification/scenarios/40-generated-scenarios.md`
- generation of `build_tenants/python/design/40-generated-implementation-design.md`
- generation of `build_tenants/python/design/40-generated-implementation-stack.md`
- generation of `build_tenants/python/design/40-generated-implementation-modules.md`
- convergence of `derive_code_surface` through explicit `Implements:` traceability
- generation of `build_tenants/python/design/40-generated-test-design.md`
- generation of `build_tenants/python/test_env/40-generated-test-stack.md`
- generation of `build_tenants/python/test_env/tests/40-generated-test-modules.md`
- realization of governed pytest source under `build_tenants/python/test_env/tests/`
- green non-live pytest evidence archived in `build_tenants/python/test_env/50-generated-run-archive.md`
- generation of `specification/scenarios/30-generated-testcase-authority.md`
- generation of `docs/40-generated-release.md`

This now counts as a full bounded dogfood proof for the current line:

- released `odd_sdlc` governs the mutable `odd_world_model` source project
- intermediate requirement, design, scenario, test, and release surfaces are produced by that released product
- the resulting code and tests are materially exercised and archived as governed evidence

## Remaining Limit

The dogfood line is converged for the current non-live source-workspace boundary.

What remains outside this specific proof:

- a deeper live installed-sandbox scenario proof for `odd_world_model` itself
- later-wave deployment/runtime-observation qualification
- any broader corpus beyond the retained trade/APRA slice

Those are downstream continuation waves, not open defects in this bounded dogfood line.
