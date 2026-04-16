# T-020 Reprice Multi-Domain Mapping Requirements

- id: T-020
- title: Reprice multi-domain mapping requirements
- type: feature
- status: completed
- goal: proving-wave-04
- change_intent: carry the ratified mapping direction into explicit odd_domain requirement families for governed cross-domain mapping, durable mapping records, mapping reports, category semantics, confidence disclosure, and unassigned-surface treatment
- change_class: requirement_reprice
- re_entry_point: requirements
- triaged_at: 2026-04-16
- priority: high
- dependencies: none
- links: parent:T-019
- created_at: 2026-04-16
- updated_at: 2026-04-16

## Context

`odd_domain` already supports:

- published domain artifacts
- composed world models
- bounded query and explainability over those published surfaces

What was missing was explicit requirement authority for governed multi-domain
mapping. The direction was only in ticket prose.

The mapping line now needs requirement coverage for:

- published-domain mapping as a governed downstream capability
- a durable machine-usable mapping record
- a human mapping report projection
- mapping categories
- confidence with reasons
- unassigned source and target surfaces
- the guarantee that mapping remains downstream of published truth

## Major Ambiguities

- whether the durable truth surface should be the mapping record alone or a
  deeper intermediate analysis asset
- whether confidence should be categorical only or support a derived numeric
  projection later
- whether the first retained slice should prove only interpreted-domain mapping
  or later widen to source-domain plus interpreted-domain mapping in one line

## Acceptance

- `odd_domain/specification/requirements/` contains explicit requirement
  families covering governed multi-domain mapping
- the requirement set makes the mapping record the durable truth boundary of
  the retained slice
- the requirement set keeps mapping downstream of published domains and
  composed world models
- the requirement set requires categorized mappings, confidence with reasons,
  and unassigned source and target disclosure
- every new mapping requirement cites the governing method section and the
  relevant `INTENT.md` or `PRODUCT.md` clause it carries

## Completion

Completed by:

- adding `60-multi-domain-mapping-capability.md`
- adding `70-multi-domain-mapping-constraints.md`
- updating `requirements/README.md` so the mapping families are part of the
  active project requirement set
