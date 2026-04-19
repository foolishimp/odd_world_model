# T-017 Add Live Installed Sandbox Tests

- id: T-017
- title: Add live installed sandbox tests
- type: feature
- status: completed
- goal: proving-wave-03
- change_intent: turn the installed odd_world_model product proof into live tests that exercise installation and the retained trade-plus-regulation world-model scenario the same way odd_sdlc proves its installed runtime
- change_class: realization_refactor
- re_entry_point: realized_surface
- triaged_at: 2026-04-16
- priority: high
- dependencies:
- links: basis:T-015-adopt-odd-sdlc-gtl-pattern-for-attribute-ledger.md, basis:T-016-refine-constructor-to-edge-specific-materialization.md
- created_at: 2026-04-16
- updated_at: 2026-04-16

## Context

`odd_world_model` can now:

- install into a target sandbox workspace
- publish one active GTL executive carrier
- run the retained trade/APRA program end to end
- converge through:
  - `trace_source_observations`
  - `assure_attribute_claims`
  - `materialize_attribute_ledger`
  - `project_markov_object_cut`
  - `publish_domain_artifact`
  - `compose_world_model`
  - `project_query_surface`

What is still missing is the same live installed-test discipline used in
`odd_sdlc`.

Today the proof exists as:

- source-workspace verification
- product-local self-test
- manual installed-sandbox reasoning

That is not enough. The next lawful step is to make the installed-product proof
repeatable as live tests.

The retained installed test should prove that `odd_world_model` can be stamped into
a fresh sandbox workspace and used there, through the installed package, to
build the two bounded domains:

- trade representation
- regulation / APRA liquidity

and then converge/query the composed world-model line.

## Major Ambiguities

- whether the first installed live-test slice should use one canonical sandbox
  fixture or multiple sandbox workspaces
- whether the installed proof should exercise only `self-test` or also explicit
  retained commands such as:
  - `odd_world_model.build_line.fpml_trade_domain`
  - `odd_world_model.build_line.trade_to_apra`
  - `odd_world_model.query.trade_to_apra`
- whether live installed tests should route through the local `.genesis`
  install only or also verify a stricter released-product provenance boundary
- how much artifact content should be asserted in the first wave versus only
  convergence and presence contracts

## Acceptance

- `odd_world_model` has live tests that install the product into a fresh sandbox
  workspace and run through the installed package, not the source tree
- the installed test flow proves the retained two-domain scenario:
  - trade representation domain
  - regulation / APRA liquidity domain
- the installed proof uses the same general pattern as `odd_sdlc`:
  - install sandbox
  - invoke installed runtime
  - drive the retained executive carrier
  - assert lawful convergence and expected retained outputs
- at least one installed test exercises the GTL runtime path through
  `odd_world_model self-test`
- at least one installed test asserts the retained published outputs are
  materially present in the sandbox after convergence
- the live installed tests are narrow enough to remain deterministic and usable
  as product proof, not just as long-running exploratory scripts

## Notes

- this is not a new product-direction ticket
- this is not a guide-writing ticket
- this is the move from source-workspace proof to installed-product proof
- the basis should be the existing `odd_sdlc` live installed-test pattern, but
  specialized to the `odd_world_model` retained two-domain world-model scenario

## Closure

- installer now stamps the runnable `.genesis` GTL/ABG runtime into the target
  sandbox instead of only copying standards
- installed runtime tests now execute through
  `PYTHONPATH=.genesis:.odd_world_model/python/code python -m odd_world_model ...`
- live installed proof now covers:
  - installed `programs`
  - installed `self-test`
  - rerun of installed `self-test` once the executive program is already complete
  - retained output presence for:
    - `fpml_confirmation_source_domain`
    - `trade_representation_domain`
    - `apra_liquidity_domain`
    - query projection summary
