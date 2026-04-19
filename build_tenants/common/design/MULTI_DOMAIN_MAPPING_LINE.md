# Multi-Domain Mapping Line

**Status**: Draft
**Scope**: Shared realization design for governed mapping over published
world-model domains

## Purpose

Define the realization shape of the retained `odd_world_model` mapping line:

- consume published world-model domains
- analyze cross-domain correspondence rigorously
- publish one durable machine-usable mapping record
- project one human-usable mapping report

This surface stays downstream of the domain-build and world-model-composition
truth already defined by:

- `WORLD_MODEL_METHOD.md`
- `ODD_METHOD.md`
- `specification/INTENT.md`
- `specification/PRODUCT.md`
- `specification/requirements/60-multi-domain-mapping-capability.md`
- `specification/requirements/70-multi-domain-mapping-constraints.md`
- `CURRENT_QUERY_TRAVERSAL_SLICE.md`

It does not redefine world-model semantics. It defines the constructive
mapping line over already-published semantic truth.

## Design Position

Cross-domain mapping is not plain field matching.

In `odd_world_model`, mapping is a governed downstream treatment analysis over
published domains. The line must be explicit enough to answer:

- what source object or attribute is being mapped
- what target object or attribute it maps to
- what semantic category that mapping belongs to
- how strong the correspondence is
- what evidence supports the assessment
- what loss, ambiguity, or surplus remains
- which source and target surfaces remain unassigned

The line should be as explicit and reviewable as the SDLC constructive line.

## Durable Truth Boundary

The durable truth surface for the retained mapping line is the
`mapping_record_surface`.

Two subordinate surfaces may exist around it:

- `mapping_analysis_surface`
  A constructive and review-oriented analysis aid over published domains and
  supporting semantic surfaces.
- `mapping_report_surface`
  A human-facing projection over the durable mapping record and its supporting
  analysis.

The line must not publish a second co-equal truth surface for the same mapping.

## Inputs

The retained mapping line operates over published assets such as:

- source published domain artifacts
- target published domain artifacts
- composed world models when the mapping question is already composition-level
- supporting semantic surfaces where needed:
  - treatments
  - covariance candidates
  - adjoint mappings
  - reference artifacts
  - query projections for explainability only

The first proving slice should use the existing trade-to-APRA retained corpus.

## Mapping Build Line

The build line is:

`published world-model domains -> mapping analysis -> mapping record -> mapping report`

### 1. Published Domain Selection

The line starts from explicit published domain refs.

Selection must preserve:

- source artifact identity and version
- target artifact identity and version
- bounded-context meaning
- any supporting treatment or composition surfaces already in force

### 2. Mapping Analysis

`mapping_analysis_surface` is the constructive working surface.

It should inventory at least:

- source objects and attributes in scope
- target objects and attributes in scope
- candidate object pairings
- candidate attribute pairings
- relation and topology correspondences
- unit or basis compatibility
- treatment, covariance, or adjoint support
- ambiguity and surplus

This surface is reviewable and replayable, but it is not the durable truth
surface of the mapping line.

### 3. Mapping Record

`mapping_record_surface` is the durable machine-usable mapping artifact.

Each retained mapping entry should carry at least:

- source domain artifact ref
- target domain artifact ref
- source object ref
- source attribute or relation ref
- target object ref
- target attribute or relation ref
- mapping category
- mapping directionality
- confidence band
- confidence reasons
- evidence basis
- supporting treatment, covariance, or adjoint refs where applicable
- declared loss or ambiguity

The record should also publish:

- unassigned source attributes
- unassigned target attributes
- scope summary
- record provenance back to the governing published domains

### 4. Mapping Report

`mapping_report_surface` is a human-facing projection over the mapping record
and supporting analysis.

It should explain:

- scope and domain pair
- object pairing basis
- attribute-level rationale
- category breakdown
- confidence breakdown
- loss, surplus, and ambiguity
- unassigned source attributes
- unassigned target attributes
- recommended next actions

The report may be Markdown-first in the first retained slice, but it remains a
projection over the durable record, not a second truth surface.

## Category Model

The retained category model is:

- `exact_identity`
- `constrained_equivalence`
- `treatment_projection`
- `derived_mapping`
- `aggregation_rollup`
- `split_mapping`
- `reference_alignment`
- `lossy_mapping`
- `incompatible_or_no_mapping`

Guidance:

- use `exact_identity` only where semantic meaning and shape are materially the
  same
- use `constrained_equivalence` when meaning is the same but type, unit, basis,
  or bounded normalization differs
- use `treatment_projection` when the target is a domain-native reinterpretation
  of upstream reality
- use `derived_mapping` when the target is computed from one or more upstream
  facts
- use `aggregation_rollup` when multiple source facts become one target fact
- use `split_mapping` when one source fact becomes several target facts
- use `reference_alignment` for identity, topology, agreement, code-set, or
  reference-set alignment
- use `lossy_mapping` when correspondence exists but important semantics do not
  survive intact
- use `incompatible_or_no_mapping` when no lawful target correspondence exists
  in the current bounded line

## Confidence Model

The authoritative confidence surface should be categorical first.

Retained confidence bands:

- `confirmed`
- `strong`
- `moderate`
- `weak`
- `rejected`

Each mapping entry should also carry reason codes or structured rationale over
at least:

- semantic identity support
- structural compatibility
- unit or basis compatibility
- topology or relation alignment
- treatment, covariance, or adjoint support
- evidence quality
- declared loss
- unresolved ambiguity

A numeric score may later be projected, but the retained truth should remain
explainable without relying on an opaque number.

## Unassigned Surface Model

The line must publish both:

- unassigned source surfaces
- unassigned target surfaces

The first retained slice should track this at attribute level and may also
track object-level surplus where that materially affects mapping review.

Unassigned disclosure is part of the durable record, not only the report.

## ODD Carrier Shape

The mapping line should publish explicit ODD carrier surfaces:

- typed mapping assets
- named graph functions
- function-catalog entries
- GTL module boundaries
- deterministic contracts for produced assets

The first retained carrier shape should include at least:

- `analyze_domain_mapping`
- `publish_mapping_record`
- `project_mapping_report`
- an executive carrier such as `build_mapping_assets`

## First Proving Slice

The first retained slice should prove mapping over real published domains
already present in the repository:

- source:
  `trade_representation_domain`
- target:
  `apra_liquidity_domain`

The proving slice should stay narrow and deterministic while demonstrating:

- object-level correspondence
- attribute-level categorized correspondence
- confidence with reasons
- declared loss and ambiguity
- unassigned source and target attributes
- lineage back to the published domain artifacts
