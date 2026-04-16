# T-013 Build Current Query And Traversal Slice

- id: T-013
- title: Build current query and traversal delivery slice
- type: feature
- status: completed
- goal: proving-wave-01
- change_intent: realize the current odd_domain query and traversal pillar over published domain artifacts and composed world models in the low-volume lane without changing the constitutional split between world-model construction and any future dedicated query plane
- change_class: design_reframe
- re_entry_point: design
- triaged_at: 2026-04-15
- priority: medium
- dependencies: T-010, T-011
- links: parent:T-009
- created_at: 2026-04-15
- updated_at: 2026-04-15

## Context

`odd_domain` still treats query/traversal as a current delivery pillar even
though it is not constitutional core.

The active queue previously preserved that pillar only in parent-ticket prose.
This ticket owns the delivery slice explicitly so the current proving wave can
stay honest about what is being built now versus what may later move behind a
dedicated query plane.

The current expectation is low-volume and filesystem-first unless a stronger
query-plane need is proven.

This ticket is complete through:

- `build_tenants/common/design/CURRENT_QUERY_TRAVERSAL_SLICE.md`
- `build_tenants/python/code/odd_domain/query/trade_to_apra.py`
- `build_tenants/common/examples/sandbox_trade_to_apra_mvp/query/`

## Major Ambiguities

- the current low-volume query/traversal lane must remain clearly distinct from
  any future database-backed or dedicated query-plane serving surface
- the query/traversal slice must not silently become the constitutional source
  of truth; it remains downstream of published domain artifacts and composed
  world models
- the exact first proving queries should stay bounded to mapping, lineage,
  treatment, and explainability needs already present in the sandbox/proof lane

## Acceptance

- there is an explicit design or realization surface for current query and
  traversal over published domain artifacts and composed world models
- the slice is filesystem-first or otherwise clearly bounded to the low-volume
  lane unless a stronger serving need is explicitly repriced
- the slice can answer at least one mapping/traversal question against the
  current proving corpus without introducing a separate constitutional storage
  authority
- the query/traversal implementation remains compatible with the attribute
  ledger, object-cut, publication, and composition model being defined by the
  sibling tickets
- the ticket records the seam where a future dedicated query plane could later
  take over without changing the constitutional identity of the line
