# T-004 Build Sandbox MVP And Markov Object Corpus

- id: T-004
- type: feature
- status: completed
- goal: proving-wave-01
- priority: high
- dependencies: T-002
- created_at: 2026-04-15
- updated_at: 2026-04-15

## Context

`odd_domain` needed a sandbox MVP that exercised the lifecycle end to end.

The resulting sandbox now:

- imports the bounded FpML-derived trade artifact from the real-standard lane
- combines it with bounded APRA-liquidity inputs
- publishes a two-domain sandbox corpus in the common JSON carrier
- exposes inspectable representations, treatments, and stitching candidates for
  gap discovery

## Acceptance

- a sandbox install path exists for the first `odd_domain` MVP lane
- the sandbox can ingest bounded source inputs such as data, schema, docs, or
  similar evidence
- the first sandbox corpus includes the published trade-representation domain
  and the published APRA-liquidity regulatory domain
- the sandbox can publish at least one world fragment containing initial
  world-model objects and at least one Markov object where applicable
- the two published domains contain the relevant objects, treatments, and
  evidence surfaces needed to later establish covariance and adjoint candidates
- the resulting representations are inspectable enough to identify missing or
  weak semantics in identity, boundary, state, evidence, treatment, or
  covariance surfaces
- the corpus is sufficient to drive later conventional projection outputs and
  later `data_mapper` covariant outputs
- the sandbox output gives the team a concrete basis for deciding what to
  deepen next in the object model

## Completion

Completed by:

- creating the sandbox lane under
  `build_tenants/common/examples/sandbox_trade_to_apra_mvp/`
- materializing the composed two-domain corpus with
  `build_tenants/python/code/odd_domain/sandbox/trade_to_apra.py`
- importing the bounded FpML trade artifact instead of relying only on
  hand-authored synthetic trade input
- repricing the APRA side and stitching candidates to FQN-based semantic
  identifiers
- validating the published sandbox corpus with
  `python -m odd_domain.world_model.validate`

## Links

- parent: `.ai-workspace/tickets/active/T-001-add-world-model-representation-tenant.md`
- related: `.ai-workspace/tickets/active/T-003-implement-projection-and-proof-lane.md`
- design: `build_tenants/common/design/WORLD_MODEL_REPRESENTATION_TENANT.md`
- product: `specification/PRODUCT.md`
- goals: `specification/GOALS.md`
- sandbox: `build_tenants/common/examples/sandbox_trade_to_apra_mvp/README.md`
- builder: `build_tenants/python/code/odd_domain/sandbox/trade_to_apra.py`
- source_trade: `.ai-workspace/tickets/completed/T-005-ingest-real-trade-representation-standard.md`
