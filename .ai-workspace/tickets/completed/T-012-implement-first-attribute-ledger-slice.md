# T-012 Refactor Prototype Into First Attribute-Ledger Slice

- id: T-012
- title: Refactor prototype into first GTL and F_D attribute-ledger slice
- type: feature
- status: completed
- goal: proving-wave-01
- change_intent: refactor the existing sandbox/proof prototype into a first bounded odd_domain attribute-ledger slice that conforms to the ratified requirement and design line while preserving end-to-end provenance in the current proving lane
- change_class: realization_refactor
- re_entry_point: realized_surface
- triaged_at: 2026-04-15
- priority: low
- dependencies: T-011, T-014
- links: parent:T-009
- created_at: 2026-04-15
- updated_at: 2026-04-15

## Context

The current sandbox already proves bounded world-model construction, but it
does not yet explicitly implement the newer attribute-ledger and object-cut
model as the governing build line.

This ticket therefore treats the current sandbox as a prototype to be
refactored under the ratified requirement and design line rather than as a
source of implicit authority.

The first refactor slice should stay narrow and proving-oriented:

- one bounded sandbox lane
- traced source observations
- qualified attribute claims
- attribute-ledger materialization
- immutable Markov object-cut projection
- publication into a domain artifact
- current query/traversal compatibility

This ticket is complete in the sandbox proving lane:

- the FpML trade artifact now emits explicit trace, assurance, and
  attribute-ledger surfaces
- the APRA reporting-position object now emits the same chain
- trade and APRA Markov object cuts now carry explicit materialization refs back
  to the ledger, assurance, and trace surfaces
- proof compatibility was preserved across the same corpus

## Major Ambiguities

- this slice must stay bounded to the sandbox/proving lane. Any move toward a
  wider platform rewrite is out of scope and should be kicked back upstream.
- the current query/traversal pillar must remain compatible with the first
  slice, but the dedicated query-plane decision remains explicitly future work.
- if the prototype exposes new constitutional truth while being refactored, the
  work must stop and re-enter through the upstream requirement or design
  boundary rather than silently normalizing the prototype forward.

## Acceptance

- one bounded sandbox lane materializes an explicit attribute-ledger surface
- one or more Markov objects are projected from that ledger rather than treated
  as implicitly mutable state
- attribute claims are traceable to source evidence and linked to provenance or
  event records
- the refactored slice conforms to the active requirement and design surfaces
  rather than preserving prototype structure for its own sake
- the resulting artifact remains compatible with current composition and proof
  work
- the implementation is narrow enough to serve as the first proving slice
  rather than an open-ended platform rewrite
