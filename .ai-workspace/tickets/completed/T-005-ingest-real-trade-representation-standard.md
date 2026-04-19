# T-005 Ingest Real Trade Representation Standard

- id: T-005
- type: feature
- status: completed
- goal: proving-wave-01
- priority: high
- dependencies: T-002, T-004
- created_at: 2026-04-15
- updated_at: 2026-04-15

## Context

The sandbox initially proved the first executable world-model lane using bounded
hand-authored inputs.

This ticket moved that lane onto one real published trade representation family
by selecting FpML confirmation-view trade representation, bounded to one
commodity swap slice, and translating it into a governed `odd_world_model` domain
artifact.

## Acceptance

- one concrete published trade representation standard is selected as the first
  source authority for this lane
- a bounded input adapter exists for that standard
- the adapter can produce at least one published trade domain artifact in the
  common JSON carrier
- the published artifact contains at least one Markov object and the related
  supporting world-model objects needed for a lawful local trade fragment
- the resulting artifact is inspectable enough to identify what semantic
  surfaces were recoverable directly from the standard and what surfaces still
  require deepening
- the published output follows the fully qualified naming rule for semantic
  artifacts
- the resulting trade artifact can be used as input to the existing trade to
  APRA sandbox and proof lane

## Completion

Completed by:

- selecting FpML confirmation view as the first source authority
- adding a bounded FpML parser at
  `build_tenants/python/code/odd_world_model/adapters/fpml_confirmation.py`
- adding the first real-standard builder at
  `build_tenants/python/code/odd_world_model/sandbox/fpml_trade_domain.py`
- publishing the resulting FQN-compliant trade artifact under
  `build_tenants/common/examples/fpml_trade_representation_standard/`
- feeding that published artifact into the trade-to-APRA sandbox lane

## Links

- parent: `.ai-workspace/tickets/active/T-001-add-world-model-representation-tenant.md`
- related: `.ai-workspace/tickets/active/T-003-implement-projection-and-proof-lane.md`
- related: `.ai-workspace/tickets/completed/T-004-build-sandbox-mvp-and-markov-object-corpus.md`
- product: `specification/PRODUCT.md`
- requirements: `specification/requirements/10-world-model-object-representation.md`
- standard: `/Users/jim/src/apps/specification_methodology/specification/standards/WORLD_MODEL_GUIDE.md`
- example: `build_tenants/common/examples/fpml_trade_representation_standard/README.md`
- builder: `build_tenants/python/code/odd_world_model/sandbox/fpml_trade_domain.py`
