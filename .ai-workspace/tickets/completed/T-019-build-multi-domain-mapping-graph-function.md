# T-019 Build Multi-Domain Mapping Graph Function

- id: T-019
- title: Build multi-domain mapping graph function
- type: feature
- status: completed
- goal: proving-wave-04
- change_intent: turn cross-domain mapping into a governed odd_world_model build line that operates over published world-model domains and emits both a tool-usable mapping record and a detailed mapping report with confidence, reasoning, and unassigned attributes
- change_class: requirement_reprice
- re_entry_point: requirements
- triaged_at: 2026-04-16
- priority: high
- dependencies:
- links: basis:ADR-001-source-decomposition-and-build-boundaries.md, basis:ATTRIBUTE_LEDGER_BUILD_LINE.md, basis:CURRENT_QUERY_TRAVERSAL_SLICE.md, basis:T-015-adopt-odd-sdlc-gtl-pattern-for-attribute-ledger.md, basis:T-016-refine-constructor-to-edge-specific-materialization.md, child:T-020, child:T-021, child:T-022
- created_at: 2026-04-16
- updated_at: 2026-04-16

## Context

`odd_world_model` can already:

- publish bounded source and interpreted world-model domains
- compose published domains into higher-order world models
- answer bounded filesystem-first query and explainability questions
- emit conventional and covariant proof artifacts from the same governed corpus

What it does not yet have is a first-class multi-domain mapping line with the
same rigor as the SDLC line:

- governed inputs
- explicit GTL graph function boundary
- lawful intermediate assets
- traceable outputs
- deterministic verification

The required line is not "generate a nice mapping memo".

It is:

- start from one or more published world-model domains
- analyze attribute, object, treatment, and topology correspondence across them
- produce a durable mapping record that another mapping tool can consume
- produce a mapping report that explains what was mapped, how strong the
  mapping is, why, and what remains unmapped

The current retained proving basis should be the trade/APRA line, but the
design must be generic to multiple domains rather than hardcoded to that one
pair.

## Required Outcome

This ticket should establish a lawful build line of the form:

`published world-model domains -> mapping analysis -> mapping record asset -> mapping report asset`

The line must remain downstream of published domains and constructive history.
It must not become a competing truth surface over the domains themselves.

## Mapping Assets Required

### 1. Mapping Record Asset

This is the durable machine-usable mapping artifact intended to feed a mapping
tool or downstream transformation surface.

It should be detailed enough to capture at least:

- source domain and target domain identities
- source object / attribute refs
- target object / attribute refs
- mapping category
- confidence score or band
- confidence reasons / evidence basis
- mapping directionality
- derived / treated / adjoint / covariance basis where applicable
- declared loss or ambiguity
- unassigned source attributes
- unassigned target attributes
- lineage back to the published domains and relevant supporting surfaces

### 2. Mapping Report Asset

This is the detailed human-facing analysis surface.

It should explain:

- mapping scope
- object-level pairing basis
- attribute-level match rationale
- category breakdown
- confidence breakdown
- loss / ambiguity / surplus
- unassigned source attributes
- unassigned target attributes
- recommended next actions for unresolved areas

The report is a projection over the mapping analysis and record, not an
independent truth surface.

## Suggested Mapping Categories

The first wave should not collapse all mappings into "matched / unmatched".

The report and record should distinguish at least:

- `exact_identity`
  same semantic meaning and shape across domains
- `constrained_equivalence`
  same semantic meaning with bounded type/unit/basis differences
- `treatment_projection`
  target value is a treatment over the source semantic object
- `derived_mapping`
  target value is computed from one or more source values
- `aggregation_rollup`
  target value aggregates multiple source attributes or objects
- `split_mapping`
  one source attribute or object expands into multiple target surfaces
- `lossy_mapping`
  mapping exists but does not preserve all source semantics
- `reference_alignment`
  mapping is primarily identity, topology, or reference-set alignment
- `incompatible_or_no_mapping`
  no lawful target mapping exists in the current bounded line

These are a starting taxonomy, not a frozen final vocabulary. The final
requirement/design surfaces may tighten or rename them.

## Suggested Confidence Model

The first slice should not emit opaque confidence numbers with no explanation.

Every mapping should carry:

- a confidence band or numeric score
- explicit reasoning
- evidence basis
- ambiguity notes

The confidence basis should consider at least:

- direct identity preservation
- structural similarity
- unit / basis compatibility
- treatment / adjoint support
- covariance support
- source-domain evidence quality
- lossiness
- unresolved ambiguity

## Major Ambiguities

- whether the first mapping line should operate over:
  - interpreted domains only
  - source domains plus interpreted domains
  - or a mix depending on mapping category
- whether mapping should be modeled as:
  - a single `MappingRecord` asset
  - or a fragment containing several mapping sub-assets
- whether confidence should be:
  - categorical only
  - numeric only
  - or both numeric and categorical
- whether unassigned attributes should be tracked only at attribute level or
  also at object / relation level
- how much of the first slice should rely on:
  - covariance edges
  - adjoint mappings
  - treatments
  - direct attribute comparison
- whether the first proving slice should be:
  - trade representation -> APRA liquidity
  - source FpML domain -> trade representation domain
  - or both to prove intra-line and cross-line mapping
- whether the mapping report should be:
  - markdown first
  - JSON first with markdown projection
  - or both in the same wave

## Expected Downstream Work

This ticket should carry downstream closure through:

1. requirements
   - explicit mapping capability and constraint requirements
2. design
   - graph-function shape
   - asset schemas
   - confidence and category model
3. implementation
   - function catalog entries
   - GTL module surfaces
   - constructor / build-line support
4. verification
   - deterministic shape/content tests
   - retained proving slice over real published domains

## Current Status

Downstream closure is complete:

- requirements
  - completed by `T-020`
- design
  - completed by `T-021`
- implementation and verification
  - completed by `T-022`

## Acceptance

- `odd_world_model` has explicit requirements for multi-domain mapping as a
  governed downstream capability over published world-model domains
- `odd_world_model` has a design surface that defines:
  - mapping graph-function boundaries
  - mapping asset boundaries
  - mapping category model
  - confidence model
  - unassigned-attribute treatment
- the GTL carrier publishes a named mapping graph function or executive
  carrier over published domains rather than leaving mapping as an ad hoc
  proof script
- the first retained implementation produces at least two durable assets:
  - a machine-usable mapping record
  - a human-usable mapping report
- the mapping record includes explicit lineage back to the governing published
  domains and relevant supporting semantic surfaces
- the mapping report includes:
  - categorized mappings
  - confidence with reasoning
  - declared loss / ambiguity
  - unassigned source attributes
  - unassigned target attributes
- the first proving slice runs against real published domains already present in
  `odd_world_model`, not synthetic placeholder domains
- the first proving slice is narrow enough to stay deterministic and reviewable
  while still demonstrating cross-domain rigor

## Notes

- this is not a replacement for downstream mapping tools
- this is the governed semantic mapping line that should make downstream
  mapping tools lawful and explainable
- this ticket should keep mapping downstream of published domains, just as
  query remains downstream of publication
- the retained proving basis should likely use the current trade/APRA corpus,
  but the design must not hardcode the ticket to that one mapping pair

## Completion

Completed by:

- repricing the mapping direction into explicit requirement families
- defining the durable truth boundary as:
  - subordinate `mapping_analysis_surface`
  - durable `mapping_record_surface`
  - projected `mapping_report_surface`
- publishing named mapping graph functions and an executive mapping carrier in
  the GTL module
- implementing and verifying the first retained mapping slice over the real
  `trade_representation_domain -> apra_liquidity_domain` pair
