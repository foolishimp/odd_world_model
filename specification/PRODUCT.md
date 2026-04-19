# Product

**ID**: PROD-ODD-WORLD-MODEL-001
**Status**: Draft
**Date**: 2026-04-15

This document is the current product-definition surface of the mutable
`odd_world_model` source project.

It defines what the next released `odd_world_model` product is becoming. It is not
the tapped release artifact or an installed product instance.

This product-definition line is governed by `SPEC_METHOD.md` as refined by
`WORLD_MODEL_METHOD.md` for world-model construction and composition.

## Product Position

`odd_world_model` is a world-model construction and comprehension product for
existing source systems.

It observes live systems of record, their interfaces, events, metadata, and
code surfaces, then reconstructs the bounded contexts, functional objects,
treatment semantics, and cross-domain covariance they imply. The product does
not replace those systems or become the primary store of raw operational data.

The product line is generic: it applies wherever source systems expose local
truth that later becomes detached from its context as it moves through adjacent
domains and transformations.

`odd_world_model` is also the concrete product domain that realizes this line of
work. It is implemented in GTL/ABG as a specific domain, with its own
constitutional surfaces, domain terms, and downstream realization path.

Within that realization path, semantic derivation is expected to be declared
through GTL / graph functions, while deterministic `F_D` primitives are used
for record and provenance/event materialization.

Architecturally, `odd_world_model` is a federated world-model mesh rather than a
central monolith. Teams publish bounded world-model fragments from the source
systems they comprehend, and higher-order domain views are stitched from those
published fragments without erasing local authority.

The product therefore has two core intents:

1. build published domain artifacts
2. compose those artifacts into higher-order world models

## Product Vision

The product vision is an inspectable machine-reasonable world model that lets
an AI or human expert answer questions such as:

- what functional surface created this record
- which domain object or Markov object this record is evidence of
- which treatment changed its meaning on the way downstream
- what was preserved, aggregated, delayed, narrowed, enriched, or lost
- how a source-domain change should propagate into adjacent domain consequence
- why a reported downstream figure is or is not fully explainable from upstream
  source reality

The product is not a static data catalog and not a generic ETL orchestrator. It
is the explicit world model that source-system experts already use implicitly
when they reason about how the institution actually works.

The world model is federated. Each team can publish its own bounded fragment of
world understanding, and larger domain views are composed recursively from
those fragments. The goal is stitched comprehension, not one flattened
enterprise ontology.

The product also supports side-by-side proof. From the same world model it can
emit conventional enterprise artifacts, such as schemas, API contracts,
mapping documents, and `dbt` transformations, while also emitting
`data_mapper` covariant transforms. The comparison between those outputs is
part of the proof of value, not an afterthought.

The canonical semantic substrate is the world-model object layer, including
Markov objects where applicable. Users will often work through familiar
projections such as tables, schema contracts, API contracts, mapping
documents, lineage views, and transformation artifacts. Those projections are
derived from the semantic substrate and remain traceable back to it.

Within that semantic substrate, Markov objects are not treated as mutable
records. They are immutable object cuts projected from a governed attribute
ledger so every accepted attribute can remain sourceable back through traced
and assured evidence.

The product also stands in parallel with spec-driven development. A well-formed
world model can project large parts of an application surface, including API,
schema, workflow, validation, lineage, and test scaffolds. `odd_world_model` does
not claim to replace every normative application specification, but it does aim
to collapse duplicated semantic intent into governed domain truth wherever the
application is mainly an interface over stable domain semantics.

## Core Product Intent

### 1. Domain Build

`odd_world_model` builds published domain artifacts from source evidence.

Those artifacts make local domain truth explicit by publishing bounded contexts,
fragments, world-model objects, Markov objects, treatment surfaces, covariance
edges, adjoint mappings, and temporal reference artifacts.

### 2. World-Model Composition

`odd_world_model` composes published domain artifacts into higher-order world
models.

Composition is reference-preserving rather than flattening. The higher-order
world model should keep artifact identity, version, boundary meaning, and
declared loss explicit at every stitch point.

## Current Delivery Pillars

The current delivery line has three active pillars:

1. domain build
2. world-model composition
3. world-model query and traversal

The first two are constitutional to the product identity.

The third is currently an important delivery pillar, but it may later be
served by a distinct query or serving plane without changing the underlying
constitutional identity of the product.

### World-Model Query And Traversal

`odd_world_model` makes published domain artifacts and composed world models
queryable and traversable.

The query target is not only a table or schema surface. It is the graph of
versioned semantic artifacts and their treatment, covariance, and adjoint
relationships.

That should make it possible to answer mapping questions, lineage questions,
and downstream-explainability questions at any node in the world-model graph.

## Product Terms

- **App**: the `odd_world_model` builder application that observes source evidence
  and materializes governed world-model outputs.
- **Source Project**: the mutable `odd_world_model` workspace defining the next
  released `odd_world_model` product.
- **Released Product**: a tapped immutable `odd_world_model` release cut that can be
  installed into other workspaces.
- **Install**: a stamped workspace instance of a released `odd_world_model`
  product.
- **Builder Project**: a configured source-project instance of the app with
  its own source inputs, build settings, and publication lane.
- **Domain Artifact**: a published `odd_world_model` output built by a builder
  project and versioned as part of the product's semantic layer.
- **Published Domain Artifact**: the durable semantic publication unit produced
  by a builder project and later referenced, composed, or queried by other
  artifacts or world models.
- **Source System**: an existing operational system that remains authoritative
  for some local function, state transition, or representation.
- **Product Domain**: the specific GTL/ABG domain line that realizes a product
  capability rather than merely describing it externally.
- **Functional Surface**: the inputs, transformations, invariants, outputs, and
  adjacent dependencies through which a domain actually operates.
- **Bounded Context**: a locally coherent region of domain meaning with its own
  object semantics, lifecycle, events, policy rules, and authority
  boundaries.
- **World Fragment**: a published bounded world-model representation owned by a
  team or local domain and derived from the source systems it comprehends.
  Fragments are bounded slices within a published domain artifact.
- **World Model Object**: the machine-reasonable representation of something an
  expert treats as real inside the institution's operating model.
- **Attribute Ledger**: the append-only ordered record of qualified attribute
  claims over a stable object identity from which immutable Markov object cuts
  are projected.
- **Markov Object**: a stable self-bounding world-model object whose internal
  state can be reasoned about through its boundary and interfaces to adjacent
  objects or domains. In publication form, it is an immutable object cut
  projected from the attribute ledger rather than an in-place mutable record.
- **Projection Layer**: user-facing derived views such as tables, mapping
  documents, schema contracts, API contracts, `dbt` models, lineage reports,
  and other familiar artifacts generated from the semantic substrate.
- **Projection Identifier**: where shorthand is needed, use `pr` for
  projection-oriented names to avoid collision with `project`.
- **Fully Qualified Identifier**: the canonical qualified name for a published
  semantic artifact. The identifier should carry enough layer and context to
  prevent nearby domains, objects, and projections from aliasing together.
- **Treatment Surface**: a domain-native reinterpretation of upstream reality
  that preserves some structure, changes some meaning, and may introduce target
  specific obligations or loss.
- **Source Evidence**: the code, configuration, interface, event, schema,
  record, or metadata surface that supports a world-model claim.
- **Covariance Edge**: a declared relationship showing how changes in one
  Markov object or domain object correspond to changes in another domain.
- **Adjoint Mapping**: the interpret-back contract paired with a forward domain
  transformation so preserved structure, loss, and target-native surplus are
  explicit.
- **Covariant Stream**: a produced stream of linked downstream changes whose
  semantic relationship to upstream objects is governed by the world model.
- **Conventional Projection**: an enterprise-expected artifact such as a
  schema contract, API contract, mapping document, transformation
  specification, or `dbt` model generated from the world model for
  compatibility with incumbent delivery expectations.
- **Temporal Reference Artifact**: a governed value list, code set,
  classification set, or similar reference-semantic artifact whose membership
  or meaning can change over time and therefore must be modeled as its own
  world-model surface rather than as static enum metadata only.
- **Common Model**: a published domain artifact with shared reuse value across
  more than one local domain or composed world model.
- **Composed World Model**: a higher-order world model built by referencing and
  stitching published domain artifacts while preserving their identity, version,
  and local authority.
- **World-Model Query**: traversal or lookup over published domain artifacts and
  composed world models for mapping, lineage, treatment, and explainability
  questions. This is currently a delivery pillar and may later be served
  through a dedicated query plane.
- **World-Model-Driven Development**: the product stance that a sufficiently
  well-formed world model can project major application-facing surfaces without
  forcing those semantics to be re-authored independently in every downstream
  specification.
- **Federated World-Model Mesh**: the recursively composed network of published
  world fragments, covariance edges, and composition boundaries that yields
  higher-order domain understanding without collapsing local models into one
  monolith.

## Goal Model

Goals focus one bounded proving wave of world-model construction. A goal selects
one slice where semantic continuity and cross-domain covariance can be made
explicit and tested.

For this product line, goals should choose concrete paths such as one object
family flowing through one set of treatments into one downstream outcome. Goals
are intentionally narrower than the full product vision so the line proves one
lawful slice before generalizing.

## Product End State

The end-state product is an inspectable world-model layer with:

- released builder products that can be consumed immutably by downstream
  builder projects
- observed source systems linked to the functions, code paths, interfaces, and
  records they enact
- published domain artifacts as the durable semantic publication units for
  local truth
- published world fragments owned by the teams or local domains that comprehend
  those source systems
- explicit bounded contexts for the domains being modeled
- Markov objects and treatment surfaces that explain how local domains
  transform shared reality
- audit and review surfaces between extracted source evidence and accepted
  object semantics
- covariance edges and adjoint mappings that make cross-domain interpretation
  lawful and explainable
- recursive stitching of published fragments into higher-order domain views
  without erasing fragment authority
- composed world models built by referencing versioned published domain
  artifacts rather than flattening mutable builder state
- temporal reference artifacts for governed value lists and changing
  classifications whose semantics affect object interpretation over time
- conventional projections generated from the world model for existing delivery
  expectations, including schema and API publication surfaces
- application-facing projections such as workflow, validation, lineage, and
  test scaffolds derived from the same governed semantic substrate where
  applicable
- covariant streams that `data_mapper` can emit without severing meaning from
  history
- side-by-side proof that conventional projections and covariant transforms can
  be compared against the same governed world model
- AI reasoning surfaces that can trace any downstream figure back to upstream
  semantics, transformations, assumptions, and remaining ambiguity
- traversable query surfaces over versioned published domain artifacts and
  composed world models so mapping questions can be answered at any node
- composition rules that preserve fragment boundary meaning and declared loss at
  every stitch point
- drift detection when operational systems, treatments, or correspondences stop
  matching the governed world model

## Current Product Definition

The current source project defines the next `odd_world_model` product as an initial
product vision and not yet a full materialized implementation.

Today the product definition consists of:

- a shared specification surface that states the product as a world-model and
  comprehension layer over existing source systems
- an explicit two-intent product shape:
  domain build and world-model composition
- a current three-pillar delivery line:
  domain build, world-model composition, and world-model query
- a specific product-domain identity for `odd_world_model` inside GTL/ABG
- a planned Python realization tenant at `build_tenants/python/`
- a first-slice boundary centered on one concrete source-to-downstream
  treatment path rather than on generalized enterprise coverage
- an architectural direction toward federated publication and recursive
  composition instead of centralized domain flattening
- a delivery posture in which query and traversal are first-class today, even
  though they may later move behind a dedicated serving or query plane
- a proof strategy that emits both conventional enterprise artifacts and
  `data_mapper` covariant transforms from the same world model
- a product direction in which well-formed world models become the semantic
  substrate for projecting substantial application surfaces
- a representation approach that allows sparse initial object publication and
  later object deepening without mutating prior published cuts in place

The first decomposable product slice in this source project is the ability to:

- observe one source system and comprehend the function that creates the record
  of representation
- define one bounded context around one object family or equivalent operational
  slice and publish that as one versioned domain artifact
- publish reviewable extracted evidence surfaces before and alongside accepted
  object packets
- model at least one downstream treatment chain in an adjacent domain
- establish at least one covariance edge and one adjoint mapping between
  upstream and downstream objects
- compose at least two published domain artifacts into one higher-order world
  model
- answer at least one mapping or lineage question by traversing that composed
  world model rather than by detached local-name mapping alone
- emit at least one conventional projection such as a mapping document or `dbt`
  transformation, schema contract, or API contract from the same governed
  model
- provide enough world-model structure that `data_mapper` can emit one governed
  covariant stream end to end

This first slice proves that the next `odd_world_model` product can preserve
semantic continuity from source-system function to downstream consequence
without becoming another opaque data sink, and that it can outperform detached
conventional delivery artifacts without refusing to generate them.
