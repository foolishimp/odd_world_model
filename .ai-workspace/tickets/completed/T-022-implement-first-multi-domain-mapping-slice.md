# T-022 Implement First Multi-Domain Mapping Slice

- id: T-022
- title: Implement first multi-domain mapping slice
- type: feature
- status: completed
- goal: proving-wave-04
- change_intent: implement the first governed mapping carrier slice over real published domains so odd_domain emits one durable mapping record and one projected mapping report with categories, confidence, and unassigned-surface disclosure
- change_class: realization_refactor
- re_entry_point: realized_surface
- triaged_at: 2026-04-16
- priority: high
- dependencies: T-021
- links: parent:T-019
- created_at: 2026-04-16
- updated_at: 2026-04-16

## Context

`odd_domain` now has requirement and design authority for governed
multi-domain mapping.

What is missing is the first retained carrier slice:

- typed mapping assets
- named mapping graph functions
- function-catalog entries
- GTL module publication
- constructor support
- deterministic verification

The first proving slice should use real published domains already present in
the product line and stay narrow:

- source: `trade_representation_domain`
- target: `apra_liquidity_domain`

## Major Ambiguities

- whether the first retained implementation should publish
  `mapping_analysis_surface` as a persisted review asset or keep it internal
  and publish only the durable record plus report
- whether the first executive carrier should be mapping-only or also reachable
  from the current query/composition line
- how much of the first confidence model should be rule-based versus directly
  supported by existing treatment, covariance, and adjoint surfaces

## Acceptance

- the GTL carrier publishes named mapping graph functions over published
  domains
- the function catalog includes the retained mapping functions and one
  executive mapping carrier
- the workspace asset inventory and generated-asset contracts cover the
  retained mapping assets
- the constructor can materialize the retained mapping outputs lawfully
- the first retained implementation produces:
  - one durable mapping record
  - one human-facing mapping report
- the record and report run against the real retained trade/APRA published
  domains rather than synthetic placeholder domains
- the first slice publishes categorized mappings, confidence with reasons, and
  unassigned source and target disclosure
- deterministic verification proves the produced asset shapes and retained
  content contracts

## Completion

Completed by:

- adding mapping carrier requirements and design authority:
  - `specification/requirements/60-multi-domain-mapping-capability.md`
  - `specification/requirements/70-multi-domain-mapping-constraints.md`
  - `build_tenants/common/design/MULTI_DOMAIN_MAPPING_LINE.md`
- adding the retained mapping implementation:
  - `build_tenants/python/code/odd_domain/mapping/trade_to_apra.py`
- extending the ODD carrier with:
  - mapping asset inventory and contracts
  - mapping graph functions and executive carrier publication
  - constructor support for mapping assets
- publishing the first retained governed mapping assets over real trade/APRA
  published domains:
  - `mapping_analysis_surface`
  - `mapping_record_surface`
  - `mapping_report_surface`
- adding deterministic verification for:
  - runtime publication
  - mapping asset content
  - constructor-level materialization
