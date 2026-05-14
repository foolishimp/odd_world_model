# T-025 Replace Narrow Mapping Slice With Generic Four-Domain Topology Mapping

- id: T-025
- title: Replace narrow mapping slice with generic four-domain topology mapping
- type: feature
- ticket_category: implementation_migration
- status: completed
- goal: proving-wave-06
- change_intent: replace the retained trade-to-APRA-specific mapping truth path with a generic topology-aware four-domain mapping line that can synthesize higher-order concepts and hierarchical or intersectional boundary candidates over published domains while keeping inferred structures downstream of domain truth
- change_class: requirement_reprice
- re_entry_point: requirements
- triaged_at: 2026-04-20
- priority: high
- dependencies: T-020, T-021, T-022
- links: basis:T-023, basis:60-multi-domain-mapping-capability.md, basis:70-multi-domain-mapping-constraints.md, basis:MULTI_DOMAIN_MAPPING_LINE.md
- intake_source: F_H authority during mapping-feature req/design/impl wave
- affected_boundary: multi-domain mapping line
- created_at: 2026-04-20
- updated_at: 2026-04-20

## Context

`odd_world_model` already had a first retained mapping slice, but that line was
still narrow:

- source: `trade_representation_domain`
- target: `apra_liquidity_domain`

That first slice proved the product could publish a governed mapping record and
report, but it was not the generic mapping carrier now required by the current
install-first wave.

The current proving direction is broader:

- retained example domains are first-class root examples
- installed sandboxes can be configured per domain corpus
- mapping must operate over published domains rather than one hard-coded trade
  or APRA pair

This ticket captures the governed replacement of the old narrow mapping truth
path with a generic four-domain topology-aware carrier over:

- `fpml_confirmation_source_domain`
- `trade_representation_domain`
- `apra_liquidity_domain`
- `banking_product_domain`

The replacement must use semantic boundary, adjacency, composition, treatment,
constructive-history, and cross-domain-reference signals rather than lexical
similarity alone.

## Required Outcome

The retained mapping line should now be:

`published domains -> topology-aware mapping analysis -> higher-order concept synthesis -> boundary-candidate projection -> mapping record -> mapping report`

The outcome of this ticket is not just a new report.

It is a governed migration of the product mapping truth path so:

- requirements explicitly authorize topology-aware matching and downstream
  higher-order inference
- design defines the generic four-domain mapping line
- runtime asset inventory and constructor dispatch use the new mapping line
- one retained implementation materializes:
  - `mapping_analysis_surface`
  - `mapping_record_surface`
  - `mapping_report_surface`
- the new line synthesizes higher-order concept candidates
- the new line projects hierarchical and intersectional boundary candidates
- inferred concepts and boundaries remain downstream artifacts, not promoted
  domain truth

## Major Ambiguities

- how aggressive the first generic carrier should be about direct pairwise
  object mappings versus concept-level participation for weaker domains such as
  the first banking slice
- how much weak attribute correspondence should remain visible in the review
  analysis versus being pruned from the first durable record
- whether later world-model mesh work should consume the higher-order boundary
  candidates directly or project its own mesh-specific boundary layer
- how the future transformer or latent-space matcher should enter this line
  without turning mapping truth into an opaque non-replayable read model

## Current State

The first retained implementation is already landed locally and awaiting
review. The current source-project state includes:

- requirements repriced in:
  - `specification/requirements/60-multi-domain-mapping-capability.md`
  - `specification/requirements/70-multi-domain-mapping-constraints.md`
- design updated in:
  - `build_tenants/common/design/MULTI_DOMAIN_MAPPING_LINE.md`
- implementation added in:
  - `build_tenants/python/code/odd_world_model/mapping/four_domain_topology.py`
- runtime mapping surfaces rewired in:
  - `build_tenants/python/code/odd_world_model/workspace_assets.py`
  - `build_tenants/python/code/odd_world_model/constructor.py`
- review artifacts materialized under:
  - `mapping/four_domain_topology/analysis/`
  - `mapping/four_domain_topology/records/`
  - `mapping/four_domain_topology/reports/`
- deterministic verification passing over the retained mapping and runtime
  carrier surfaces

## Acceptance

- `odd_world_model` has explicit requirement authority for:
  - topology-aware semantic matching
  - higher-order concept synthesis
  - hierarchical and intersectional boundary candidates
- the retained design defines the generic four-domain mapping line over
  published domains
- the retained implementation materializes mapping analysis, record, and report
  surfaces from the four retained example domains
- the produced report exposes higher-order concepts and boundary candidates for
  review
- constructor and runtime asset inventory resolve the new mapping line instead
  of the older narrow trade/APRA path
- deterministic verification proves the retained asset shapes and runtime
  integration
- the ticket closure decision explicitly states whether:
  - the generic carrier is accepted as the new mapping truth path
  - or more repricing is required before closure

## Completion

Closed as accepted.

The retained narrow trade-to-APRA mapping truth path has been replaced by the
generic four-domain topology-aware carrier.

Completed by:

- repricing mapping requirements with explicit authority for:
  - topology-aware semantic matching
  - higher-order concept synthesis
  - hierarchical and intersectional boundary candidates
- updating the retained design line in:
  - `build_tenants/common/design/MULTI_DOMAIN_MAPPING_LINE.md`
- adding the retained implementation:
  - `build_tenants/python/code/odd_world_model/mapping/four_domain_topology.py`
- rewiring runtime mapping surfaces in:
  - `build_tenants/python/code/odd_world_model/workspace_assets.py`
  - `build_tenants/python/code/odd_world_model/constructor.py`
- materializing the reviewable retained outputs under:
  - `mapping/four_domain_topology/analysis/`
  - `mapping/four_domain_topology/records/`
  - `mapping/four_domain_topology/reports/`
- extending deterministic verification so the test layer explicitly covers the
  new topology-aware requirements and boundary structure

Closure decision:

- the generic carrier is accepted as the new retained mapping truth path
- follow-on enrichment remains separate future work:
  - operational semantics enrichment in `T-024`
  - future mesh consumption and latent-space matcher refinement through later
    tickets as needed

## Notes

- this ticket replaces the narrow mapping slice as the retained mapping truth
  path; it does not retire the historical proof artifacts
- do not broaden this ticket into operational-semantics enrichment; that future
  direction is tracked separately in `T-024`
- this ticket is about the first generic carrier, not the final latent-space
  matcher
