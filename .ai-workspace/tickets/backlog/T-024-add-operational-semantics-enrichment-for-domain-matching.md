# T-024 Add Operational Semantics Enrichment For Domain Matching

- id: T-024
- title: Add operational semantics enrichment for domain matching
- type: feature
- ticket_category: ordinary
- status: backlog
- governance_method: STDO
- method_stack: SPEC_METHOD, TICKET_METHOD, WORLD_MODEL_METHOD, DESIGN_MODULE_METHOD
- goal: deferred-operational-semantics-enrichment
- source_goal: proving-wave-06
- change_intent: extend odd_world_model matching so published objects and attributes can carry derived operational semantics from retained source process, policy, and security signals, improving higher-order concept synthesis and hierarchical or intersectional Markov-boundary inference once source depth is available
- change_class: design_reframe
- re_entry_point: design
- triaged_at: 2026-04-20
- priority: medium
- dependencies: T-023, T-026
- links: basis:T-019, basis:T-021, basis:T-022, basis:T-023
- created_at: 2026-04-20
- intake_source: retained 2026-04-20 enrichment pressure, repriced by the 2026-07-12 active-set triage
- affected_boundary: downstream mapping enrichment over already-published world-model truth
- release_scope: none; not admitted into the current proving wave
- updated_at: 2026-07-12 (moved out of the current bounded execution set)

## Context

`odd_world_model` currently publishes bounded objects, evidence, adjacency,
treatments, covariance, adjoints, and composed local world-model cuts.

That is enough for the current proving wave, but it leaves one strong future
enrichment line open:

- derive more meaning from where an object or attribute sits in the graph
- derive more meaning from the process that created, changed, approved, or
  consumed it
- use policy and security surfaces as additional semantic evidence
- let matching synthesize higher-order concepts and boundary candidates from
  those richer signals

The important constraint is that this should not become a loose ontology grab
bag.

The richer signals only help if the retained source corpus actually contains
them. This ticket is therefore future work and should not broaden the current
install-first proving wave.

## Direction

The intended enrichment is an operational-semantics layer over the published
world-model carrier.

Candidate signals include:

- produced-by or observed-from process lineage
- confirmation, amendment, classification, approval, and consumption surfaces
- mutability and lifecycle-transition shape
- policy overlays
- security model or visibility scope
- control surfaces and ingress or egress surfaces

This layer may later support derived projections such as coarse `CRUD`, but
`CRUD` should remain a projection, not the primary semantic carrier.

## Required Outcome

When the retained source corpora are rich enough, `odd_world_model` should be
able to:

- enrich published objects and attributes with operational-semantics signals
- use those signals during domain matching rather than relying on text or local
  adjacency alone
- synthesize higher-order concepts from repeated cross-domain structure
- infer hierarchical and intersectional Markov-boundary candidates over those
  concepts
- project the resulting matches and boundary candidates as governed downstream
  assets with confidence, ambiguity, and declared loss

## Major Ambiguities

- whether operational semantics should be modeled:
  - directly on published objects and attributes
  - or as adjacent subordinate assets linked into the published object line
- whether the first retained process layer should emphasize:
  - lifecycle and process provenance
  - policy and control surfaces
  - security and visibility scope
  - or all of them together
- how much of the operational layer should be:
  - deterministically extracted from retained source evidence
  - versus bounded probabilistic construction from partial source evidence
- whether hierarchical and intersectional boundary candidates should be:
  - review-only first
  - or published as retained downstream assets in the first wave
- what minimum retained source-data depth is required before this line is
  worth implementing

## Acceptance

- there is a ratified design direction for operational-semantics enrichment of
  published world-model objects and attributes
- the design makes clear that `CRUD` is derivative and not the primary
  semantic carrier
- the design identifies which operational signals can lawfully influence
  domain matching and boundary inference
- the future mapping line can use those signals to synthesize higher-order
  concepts and boundary candidates
- the first retained implementation is explicitly gated on sufficient retained
  source evidence rather than guessed from thin local examples

## Notes

- this ticket is intentionally deferred
- backlog status is authoritative; it is not part of the current architecture or
  first TypeScript implementation wave
- the current proving wave remains:
  - install sandbox
  - configure sandbox
  - run builder against retained sources
- do not reopen the current wave with speculative operational-schema work
- source-data depth is the gating factor for this enhancement
