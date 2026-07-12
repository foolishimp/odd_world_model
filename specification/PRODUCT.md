# Product

**ID**: PROD-ODD-WORLD-MODEL-001
**Status**: Active
**Date**: 2026-07-12

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

At the LLM boundary, the product deliberately blurs the conventional separation
between application, data, and data processing. It treats application behavior,
code, records, events, documents, and transformations as governed evidence for
one semantic memory while preserving their distinct provenance and authority.
WM is therefore a governed memory bank for producing versioned, bounded, and
provable LLM context rather than an ad hoc prompt-assembly layer.

`odd_world_model` is also the concrete product domain that realizes this line of
work. It has its own constitutional surfaces, domain terms, and downstream
realization path.

Within that product path, semantic construction is declared through published
graph functions. Calibrated probabilistic workers may propose meaning;
deterministic machinery checks closed rules and materializes deterministic
artifacts.

`odd_world_model` specializes the generic lifecycle meaning published by
`odd_glc`. It does not obtain world-model semantics from GLC and does not
republish lifecycle or runtime machinery locally. GTL declares graph-native
program structure, ABG owns execution and admitted runtime truth, GLC supplies
generic lifecycle interpretation, and this product owns world-model domain
meaning.

Architecturally, `odd_world_model` is a federated world-model mesh rather than a
central monolith. The mesh is the product's current complexity-management form:
teams publish bounded semantic cuts from the source systems they comprehend,
connect them through typed links, and resolve finite purpose-bound cuts without
erasing local authority or loading one global model.

The product therefore has three core intents:

1. build published domain artifacts
2. compose those artifacts into higher-order world models
3. project governed LLM context and bind model output to the exact world-state it saw

## Lifecycle And Runtime Boundary

`odd_world_model` is a downstream domain program under the `odd_glc`
Downstream Program Contract.

The ownership boundary is:

- **GTL** owns graph, node, graph-function, module, job, interface, and
  composition declaration law;
- **ABG** owns traversal, graph calls, frames, execution, admission, runtime
  events, evidence, replay, folds, residuals, continuation, correction,
  re-entry, and closure truth;
- **GLC** owns domain-agnostic lifecycle vocabulary, lifecycle policy and
  read/query interpretation, proof interpretation, and downstream
  specialization contracts; and
- **WM** owns bounded contexts, world-model objects and candidate Markov-object
  cuts, source and authority qualification, attribute-ledger meaning,
  treatments, covariance, adjoints, temporal reference semantics, publication,
  world-model composition, and semantic proof interpretation.

WM contributes domain assets, schemas, policies, evidence expectations, and
semantic interpretation through the GLC downstream boundary. It must not add a
second traversal controller, runtime event envelope, requirement ledger,
retry/continuation loop, closure store, or local copy of generic lifecycle law.

WM's constitutional dependency versions float. The product names the published
GTL/ABG and GLC contracts it consumes, not a substrate or lifecycle release
number. Mutable development may resolve governed development or released
dependency products through those contracts and must honor the compatibility
declared by that resolution. Successor implementations may replace current ones without
changing WM product identity when their contracts preserve this ownership
boundary. A contract change that alters WM meaning or obligations re-enters
through normal triage.

Every concrete build, proof, release, and install records and verifies the exact
package, version, source or tag, manifest, and digest identities it actually
resolved. Floating product law never permits an existing artifact or proof to
change dependencies after the fact.

## Consumed Contract Boundary

WM consumes these contract classes without republishing them:

- the GTL declaration, graph-function publication, cumulative-environment, and
  program-conformance contracts;
- the ABG traversal, admission, canonical event-envelope and event-census,
  evidence, replay, correction, continuation, and projection contracts;
- the governed transform, evaluation, and consequence plugin seams, under ABG
  admission rather than direct runtime mutation;
- the selected substrate's published typed schema authority; and
- GLC's generic lifecycle vocabulary, policy and read interpretation, and
  downstream-program specialization contract.

When a selected dependency does not publish a required contract, publishes it
only partially, or does not make it addressable to the consumer, WM records the
gap and defers, blocks, or opens a triaged owner ticket. WM does not infer a
missing contract from source paths, tests, later-version behavior, or a local
replacement.

## Mesh As Complexity Management

The federated world-model mesh is the operative form of world-model
composition. It is not a future serving optimization, a central enterprise
ontology, or a detached index over copied records.

The durable semantic units remain published cuts. The mesh admits these node
roles:

- published domain artifacts as locally authoritative semantic cuts;
- common models as published artifacts explicitly adopted for reuse; and
- composed world models as published reference-based compositions.

A common model is a role played by a published artifact. It has no privileged
ambient authority and applies only where another published node adopts it by
explicit reference.

Cross-node meaning is carried by typed semantic links. Each durable link must
identify its exact source and target cuts, relation role, owning authority,
provenance, validity or version coordinates, declared treatment, fidelity or
loss where applicable, and supersession state. The minimum relation roles are
reference/composition, treatment, covariance, adjoint interpretation, and
supersession. A same-name join or inferred adjacency is not a semantic link.
Where a treatment surface, covariance edge, adjoint mapping, or supersession
relation is already published, that artifact is the link truth. Mesh
publication references it and does not create a mesh-only duplicate.

For one interaction goal, an operator or agent resolves a bounded mesh cut: a
finite projection rooted in exact published refs with declared purpose, scope,
and traversal closure. The cut references mesh truth; it does not copy or
republish it. This lets reasoning, review, mapping, and proof operate over the
minimum sufficient semantic context.

When a node or link is superseded, pressure propagates through its declared
dependency closure rather than forcing reconstruction of the whole mesh.
Unresolved references, incompatible publication cuts, authority conflicts, and
unreconciled treatment or fidelity loss remain typed gaps. They are not erased
by flattening, renaming, fallback matching, or silent omission.

## Governed Context Memory

WM serves LLM context as a projection over governed world-model truth.

The context contract is:

`published semantic memory -> bounded mesh cut -> context basis -> context projection -> LLM invocation -> attributed output`

A context basis identifies the exact world-state made available to one model
invocation. It includes:

- exact published node and semantic-link refs and their digests;
- the bounded mesh-cut root, purpose, scope, selectors, and closure;
- effective, observed, admitted, and publication coordinates where applicable;
- the context-projection contract and version;
- source and semantic-authority refs;
- freshness and staleness state; and
- declared fidelity, loss, exclusions, truncation, and unresolved gaps.

An invocation does not query "the data" in the abstract. It reasons as of this
declared basis. The immutable bounded cut is therefore the unit of epistemic
accountability: an existing answer cannot silently retarget when world-state
changes.

A context projection serializes and compresses that basis for a model context
window. Candidate Markov-object cuts, treatments, covariance, adjoints, and
other published semantic surfaces provide the semantic compression layer. Raw
source evidence remains recoverable by reference. Compression never upgrades a
candidate Markov-object cut to established status and never hides what was
discarded.

Every governed LLM output carries its context-basis ref, model and invocation
identity, and output digest. The output is judgeable and replayable against the
world-state it saw. It remains an F_P proposal until deterministic checks, ABG
admission, and attributed WM authority accept any resulting semantic claim.
Basisless output is not admissible as governed proof or published semantic
truth.

The product requires immutable cut identity, digests, recoverability, and
staleness detection. It does not require a particular table format, object
store, database, version-control system, or prompt renderer. Those are
realization choices.

## Product Definition Boundary

The product definition is technology-independent.

The product is not defined by a programming language, package manager, test
runner, tenant implementation, or historical prototype. Those surfaces may
realize, prove, or compare the product, but they do not define the product
`WHAT`.

The product is defined by the semantic chain it must make true:

`source observation -> traced evidence -> assured claim -> attribute ledger -> immutable object cut -> published domain artifact -> typed mesh -> bounded mesh cut -> context basis/projection or query/proof projection -> attributed output`

Any conformant realization must be derivable from this chain and from the live
requirements under `specification/requirements/`.

For project governance, `specification/` is the source of product-definition
authority. For world-model output, the single semantic truth surface is the
published semantic layer.

## Single Truth Surface

The product's single semantic truth surface is the published world-model layer.

That layer consists of:

- published domain artifacts
- bounded fragments inside those artifacts
- published Markov-object cuts
- treatment surfaces
- covariance edges
- adjoint mappings
- temporal reference artifacts
- composed world models built by reference from published artifacts

Everything else is downstream, supporting, or evidentiary:

- retained source corpora
- source inventories and traced observations
- assurance review surfaces
- epistemic overlays
- query planes
- mapping reports
- conventional projections
- compiled deterministic execution artifacts
- generated views and dashboards

Those surfaces may be necessary for construction, proof, inspection, or use.
They do not create a second semantic truth surface.

## Semantic Construction And Admission Boundary

World-model interpretation is probabilistic where source evidence does not
mechanically determine semantic meaning.

An F_P worker may propose:

- bounded-context and object candidates;
- source-to-claim interpretations;
- identity directions and candidate Markov-object cuts;
- treatment and correspondence candidates;
- covariance and adjoint candidates; and
- projections into schemas, API contracts, mapping documents, `dbt` models,
  workflows, validations, and covariant-stream contracts.

Each proposal enters through a declared graph-function contract with required
context, source references, expected output schema, evidence policy, and
authority requirements. F_D machinery may check closed structural rules,
identity and digest coherence, reference resolution, completeness against a
declared inventory, deterministic transformations, and proof predicates. It
must not silently replace semantic authorship with string, schema, or label
matching.

ABG admission determines which proposed results become runtime facts. WM policy
and attributed authority determine which admitted candidates become accepted
semantic claims, treatments, ledger entries, or published cuts. The LLM
proposes; deterministic checks constrain; admission and governed authority make
truth.

## Release And Install Boundary

`odd_world_model` is a builder product.

A released cut of the product may be installed into a builder project that has
its own source inputs, settings, and publication lane. The install gives that
builder project the product assets needed to construct published domain
artifacts and composed world models.

The install is not the mutable source project and not a new product
definition. It is a stamped use of a released product.

An installed builder project must preserve:

- product identity and release provenance
- installed product assets
- required method and operating guidance
- project-local source inputs and settings
- a publication lane for the builder project's outputs
- evidence that published outputs were produced through the installed product
- exact consumed ABIogenesis and odd_glc identities and compatibility evidence

An immutable WM release or install never resolves dependencies from an ambient
moving label. The mutable source project may resolve different governed
dependency products through their published contracts, but a release lock and
install manifest bind the exact identities used for construction and proof.

This boundary lets the product be consumed outside its source workspace without
leaking source-project realization structure into the installed builder
project.

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

Within that semantic substrate, a Markov-object publication is not a mutable
record or a set of member columns. It is an immutable candidate identity
direction projected from a governed attribute ledger, accompanied by the
distributed evidence and held-out treatment verification supporting that
direction. Every accepted attribute remains sourceable through traced and
assured evidence.

Current method law treats the Markov-object construct as candidate-level until
a direction-native conditional-independence promotion gate succeeds at a
declared threshold. Publications therefore default to candidate-class cuts.
The product must not call a cut a formally established statistical blanket
merely because it has a stable schema, transition list, or plausible boundary.

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

### 3. Governed Context Memory

`odd_world_model` projects finite mesh cuts into exact, loss-declared LLM
context bases and binds each model output to the world-state it saw.

Context memory unifies application, data, processing, and documentary evidence
for model use while preserving source authority, semantic provenance,
freshness, omissions, and staleness.

## Current Delivery Pillars

The current delivery line has four active pillars:

1. domain build
2. world-model composition
3. governed context memory
4. world-model query and traversal

The first three are constitutional to the product identity.

The fourth is currently an important delivery pillar, but it may later be
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
- **Product Domain**: the specific world-model domain specialization published
  through GLC's downstream contract and realized through GTL/ABG, rather than a
  vocabulary that merely describes the domain externally.
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
- **Candidate Markov-Object Cut**: an immutable identity direction projected
  from the attribute ledger together with distributed attribute evidence,
  treatment verification, boundary evidence, and epistemic status. It is the
  default Markov-object publication class until the formal promotion gate is
  satisfied.
- **Established Markov-Object Cut**: a candidate cut promoted only after the
  declared direction-native conditional-independence test and associated
  treatment/boundary checks pass at the governed threshold.
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
- **Common Model**: an explicit reuse role played by a published domain artifact
  that is adopted by reference from more than one local domain or composed
  world model. It is not ambient global doctrine.
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
  semantic cuts and typed links that yields higher-order domain understanding
  while preserving local authority and finite traversal.
- **Mesh Node**: an exact published semantic cut participating in the mesh as a
  domain artifact, explicitly adopted common model, or composed world model.
- **Semantic Mesh Link**: a durable typed relation between exact mesh-node cuts
  carrying relation meaning, authority, provenance, version or validity,
  treatment/fidelity/loss where applicable, and supersession.
- **Bounded Mesh Cut**: a finite purpose-specific projection over exact mesh
  nodes and links with declared root, scope, and traversal closure. It is a
  downstream working context, not a new semantic truth surface.
- **Mesh Dependency Closure**: the finite set of nodes, links, and downstream
  projections whose declared dependencies are pressured by a node or link
  change.
- **Governed Context Memory**: the versioned published semantic memory from
  which bounded, attributable, and provable LLM context is projected. It spans
  application, data, and processing evidence without erasing source authority.
- **Context Basis**: the exact immutable world-state and projection contract
  selected for one governed LLM invocation, including mesh refs, digests,
  temporal coordinates, scope, freshness, fidelity, loss, exclusions, and gaps.
- **Context Projection**: a bounded serialization and declared compression of a
  context basis for a model context window. It is a downstream projection, not
  semantic truth.
- **Context Invocation Record**: the lineage record joining one context basis
  to the model/invocation identity and output digest so the output can be judged
  and replayed against the state it saw.

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
- installable builder-product cuts that carry product identity, release
  provenance, product assets, method guidance, and a project-local publication
  lane
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
- typed semantic links that make cross-node relation meaning and authority
  explicit
- bounded mesh cuts that constrain each reasoning, mapping, query, or proof
  interaction to its minimum sufficient semantic context
- local dependency-closure propagation and typed gaps for unresolved or
  incompatible mesh truth
- governed context memory that projects exact bounded cuts into loss-declared
  LLM context and links every model output back to its invocation basis
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
- an explicit three-intent product shape:
  domain build, world-model composition, and governed context memory
- a current four-pillar delivery line:
  domain build, world-model composition, governed context memory, and
  world-model query
- a specific product-domain identity for `odd_world_model`
- a technology-independent product boundary in which realization tenants,
  languages, package managers, and runtime substrates are downstream design
  choices rather than product-definition authority
- a three-layer operating boundary in which GTL/ABG own graph/runtime truth,
  odd_glc owns generic lifecycle meaning, and WM owns world-model domain meaning
- a floating GTL/ABG/GLC dependency policy governed by published contracts,
  with exact dependency evidence for every build, proof, release, and install
- an F_P semantic-construction boundary under declared graph-function contracts,
  deterministic checking, ABG admission, and attributed semantic authority
- a first-slice boundary centered on one concrete source-to-downstream
  treatment path rather than on generalized enterprise coverage
- a current federated-mesh complexity law based on local published cuts, typed
  semantic links, bounded working cuts, and dependency-local change propagation
- a governed context-memory boundary that unifies application, data, and
  processing evidence for LLM use while preserving basis, provenance,
  freshness, fidelity, loss, and output lineage
- a delivery posture in which query and traversal are first-class today, even
  though they may later move behind a dedicated serving or query plane
- a proof strategy that emits both conventional enterprise artifacts and
  `data_mapper` covariant transforms from the same world model
- a product direction in which well-formed world models become the semantic
  substrate for projecting substantial application surfaces
- a representation approach that allows sparse initial object publication and
  later object deepening without mutating prior published cuts in place
- candidate-class Markov-object publication unless the formal statistical
  promotion gate is actually evidenced

The current named proving pressure is trade-world-model construction from
existing trading-system code, business-process material, and standards for
`odd_trading_eval`. That use case exercises treatment authorship, contextual
roles, temporal meaning, covariance, and projection without making trading the
constitutional identity of this generic product.

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
- publish the typed semantic links used by that composition and resolve one
  finite purpose-bound mesh cut over them
- supersede one participating cut and identify the affected dependency closure
  without rebuilding or reinterpreting unrelated mesh truth
- project one bounded mesh cut into an LLM context basis with declared loss and
  staleness behavior, then link one model output to that exact basis
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
