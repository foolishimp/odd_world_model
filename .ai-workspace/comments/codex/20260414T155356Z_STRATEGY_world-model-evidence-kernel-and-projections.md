# STRATEGY: World-Model Evidence, Semantic Kernel, and Projections

**Author**: codex
**Date**: 2026-04-14T15:53:56Z
**Addresses**: `specification/INTENT.md`; `specification/PRODUCT.md`; `specification/GOALS.md`; `specification/requirements/10-world-model-object-representation.md`; `/Users/jim/src/apps/specification_methodology/specification/standards/WORLD_MODEL_GUIDE.md`
**Status**: Draft

## Summary

This note captures the current product direction that sits below intent and
product vision but above implementation tickets.

The core position is:

- `odd_domain` observes source systems and builds a governed world-model
  representation over them
- source systems remain sovereign for operational truth
- published world-model cuts are the semantic truth of the `odd_domain` layer
- Markov objects form the semantic kernel of that layer
- most users interact through derived projections, not raw object packets
- the product must work even when source code is unavailable and truth must be
  reconstructed from large observational corpora

## Findings

### Source Truth and Evidence Hierarchy

Source code is the highest-fidelity explanatory surface when it is available,
but it is not the only usable evidence surface.

The stronger statement is:

- realized source-system behavior is the top-level truth we are trying to
  explain
- code, configuration, schedules, interfaces, records, and emitted events are
  evidence surfaces for that behavior

Some systems will be proprietary or only partially observable. In those cases,
`odd_domain` must derive semantic truth from the strongest available evidence:

- code and rules when available
- interfaces and schemas
- records and events
- large-scale data observation
- documentation and catalog metadata

This is not a fallback curiosity. It is part of the normal product case.

### Semantic Kernel

Markov objects become the canonical semantic substrate of the `odd_domain`
layer.

That does not make them the ultimate truth of the enterprise. It means:

- source systems remain authoritative for operational fact
- published Markov objects and world-model objects are authoritative for the
  `odd_domain` semantic interpretation layer

Those objects must be prompt-sufficient for reasoning agents and auditable from
evidence.

### Projection Layer

Users will rarely want to work directly with object packets.

They will want:

- tables
- mapping documents
- `dbt` transformations
- lineage views
- state timelines
- glossary-like pages

Those artifacts should be derived projections over the semantic kernel, not
parallel hand-maintained truths.

Every projection should remain traceable back to:

- the governing object packet
- the supporting evidence surfaces
- the treatment, covariance, and adjoint semantics that explain it

### Progressive Deepening

World-model object construction should be sparse first and deepen over time.

An initial object cut may begin with:

- provisional identity
- local boundary claim
- limited evidence set
- ambiguity markers
- a rough adjacency set

Later cuts may add richer blanket detail, lifecycle, invariants, treatments,
covariance, and adjoint mappings.

Published cuts remain immutable and versioned through Git. New understanding is
introduced by publishing a new cut, not by silently rewriting old truth.

### Side-by-Side Proof

The world model should drive both:

- conventional enterprise artifacts such as mapping documents and `dbt`
  transformations
- `data_mapper` covariant transforms

Running those side by side is part of the proving strategy.

The point is not only compatibility. The point is to show that a governed world
model preserves semantic continuity and explainability better than detached
conventional artifacts while still being able to generate those incumbent
artifacts.

## Layer Placement

This discussion should be captured across four layers:

1. strategy commentary
   - evolving R&D positions, open framing, proof strategy, evidence hierarchy
2. shared standards
   - reusable representation rules such as world-fragment and Markov-object
     guidance
3. product constitutional surfaces
   - ratified product truth for `odd_domain`
4. tickets
   - bounded implementation work such as sensors, review surfaces, projection
     generation, fragment publication, and stitching

Commentary carries the sprawling discussion.

Standards keep reusable method separate from one product.

Product surfaces keep the ratified local truth.

Tickets keep implementation bounded.

## Recommended Action

1. Keep using `.ai-workspace/comments/codex/` for strategy capture when product
   direction is still moving faster than constitutional repricing.
2. Promote reusable parts of the conversation into the shared standards library
   when they become general enough to guide more than one project.
3. Promote stable product-specific conclusions into `INTENT.md`, `PRODUCT.md`,
   `GOALS.md`, and requirement families.
4. Turn the next concrete implementation slices into tickets, especially:
   - evidence extraction and review surfaces
   - sparse object publication
   - projection generation
   - side-by-side conventional versus covariant proof
