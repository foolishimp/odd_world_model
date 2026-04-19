# T-018 Dogfood odd_world_model Through Released odd_sdlc

- id: T-018
- title: Dogfood odd_world_model through released odd_sdlc
- type: feature
- status: completed
- goal: proving-wave-03
- change_intent: make the odd_world_model source project a real odd_sdlc-built product line so odd_sdlc, as a released static product, governs the mutable odd_world_model development environment without collapsing the boundary between them
- change_class: design_reframe
- re_entry_point: design
- triaged_at: 2026-04-16
- priority: high
- dependencies:
- links: related:T-017-add-live-installed-sandbox-tests.md
- created_at: 2026-04-16
- updated_at: 2026-04-16

## Context

Current reality is close to dogfooding but not yet true dogfooding.

What is already true:

- `odd_sdlc` has provided the structural GTL pattern used in `odd_world_model`
- `SPEC_METHOD` and `ODD_METHOD` are governing the `odd_world_model` line
- `odd_world_model` now has its own published GTL carrier, runtime loop, and
  retained self-test

What is not yet true:

- the mutable `odd_world_model` source project is not yet being built by a released
  installed `odd_sdlc` product as its active SDLC runtime
- the boundary between:
  - released static `odd_sdlc` product
  - mutable `odd_world_model` development environment
  is not yet explicit enough in execution

The meaningful next step is to make that recursive product relationship real:

`released odd_sdlc product -> builds mutable odd_world_model source project -> releases odd_world_model product`

This ticket exists to create that boundary cleanly rather than letting
`odd_world_model` evolve only by direct source-workspace edits indefinitely.

## Major Ambiguities

- how much of the `odd_world_model` delivery line should be moved under active
  `odd_sdlc` runtime in the first wave:
  - just requirements/design/build authority surfaces
  - or full feature/design/code/test/release flow
- whether the first dogfood cut should use one canonical installed `odd_sdlc`
  workspace against `odd_world_model` or a more formal multi-workspace release line
- what minimum released-product boundary is sufficient for `odd_sdlc`:
  - installed local release cut
  - or stricter tagged/released provenance before the flow counts as dogfood
- how much local project scaffolding in `odd_world_model` should be replaced by
  `odd_sdlc`-owned surfaces in the first wave

## Acceptance

- `odd_world_model` has an explicit design and implementation line where a released
  installed `odd_sdlc` product is used to govern the mutable `odd_world_model`
  source project
- the separation is kept clean:
  - `odd_sdlc` is the released static SDLC product
  - `odd_world_model` is the mutable development/source workspace being built
- the dogfood line is explicit enough to prevent boundary collapse between:
  - the `odd_sdlc` product artifact
  - the `odd_world_model` source project
  - any installed `odd_world_model` product outputs
- the chosen `odd_sdlc` runtime surfaces and workflows used to govern
  `odd_world_model` are named explicitly
- at least one bounded `odd_world_model` delivery slice is shown running through
  that released `odd_sdlc` line rather than only through direct source edits
- the resulting operational model is specific enough that future `odd_world_model`
  work can continue under the same dogfood boundary without re-deciding the
  product relationship each time

## Notes

- this is not a ticket to rewrite `odd_world_model` semantics
- this is not a ticket to collapse `odd_sdlc` into `odd_world_model`
- this is a ticket to make the recursive product relationship operationally
  real
- the main architectural rule is to preserve the distinction between:
  - product build (`odd_sdlc` builds `odd_world_model`)
  - domain build (`odd_world_model` builds published domains/world models)
- upstream bug `B-006` is now closed:
  - the refreshed installed `odd_sdlc` product in `odd_world_model` regenerates
    `specification/requirements/10-generated-bootstrap.md` with live carried
    `REQ-*` authority
  - installed deterministic proof now shows
    `derive_requirement_surface` converged
  - the next dogfood work is downstream of requirements, not blocked by the
    original constructor defect
- bounded dogfood line now converged through generated requirement, design,
  scenario, code, test, testcase-authority, and release surfaces
- governed realized pytest evidence is archived at:
  - `build_tenants/python/test_env/50-generated-run-archive.md`
- generated release authority is now present at:
  - `docs/40-generated-release.md`
