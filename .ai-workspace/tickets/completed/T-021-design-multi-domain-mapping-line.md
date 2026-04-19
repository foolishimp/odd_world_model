# T-021 Design Multi-Domain Mapping Line

- id: T-021
- title: Design multi-domain mapping line
- type: feature
- status: completed
- goal: proving-wave-04
- change_intent: define the odd_world_model mapping design from published world-model domains through mapping analysis into one durable mapping record and one projected mapping report
- change_class: design_reframe
- re_entry_point: design
- triaged_at: 2026-04-16
- priority: medium
- dependencies: T-020
- links: parent:T-019
- created_at: 2026-04-16
- updated_at: 2026-04-16

## Context

The mapping direction is now explicit in requirements, but the realization
shape was not.

The design needed to make clear:

- what the durable truth boundary is
- whether there is a supporting constructive analysis surface
- what mapping categories exist in the retained line
- how confidence is represented
- where unassigned source and target disclosure lives
- what ODD carrier surfaces the implementation must publish

## Major Ambiguities

- whether the first slice should treat `mapping_analysis_surface` as a durable
  asset or only as a subordinate constructive aid
- whether numeric confidence should ever be authoritative rather than derived
- whether the first carrier should prove only one executive mapping program or
  also several leaf graph functions

## Acceptance

- there is a design surface for the multi-domain mapping line under
  `build_tenants/.../design/`
- the design defines mapping truth boundaries, categories, confidence, and
  unassigned-surface treatment
- the design makes the durable mapping record versus projected mapping report
  split explicit
- the design is specific enough that a first retained implementation slice can
  land without reopening product direction

## Completion

Completed by:

- adding `build_tenants/common/design/MULTI_DOMAIN_MAPPING_LINE.md`
- updating `build_tenants/common/design/README.md` so the mapping-line design
  is part of the active shared-design set
