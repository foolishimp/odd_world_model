# ADR-002 odd_sdlc Build Component Inheritance

**Status**: Historical odd_sdlc governance input; superseded by current STDO/GLC rebase
**Date**: 2026-05-15
**Scope**: Installed `odd_sdlc` build-component inheritance for the `odd_world_model` TypeScript tenant
**Ticket**: `T-026`

This ADR records the prior installed odd_sdlc phase. It does not authorize the
current carrier, function namespace, runtime binding, or proof path.

## Context

`odd_world_model` is being rebuilt as an ODD domain product over GTL/ABG.
ADR-001 selects the TypeScript GTL/ABG stack and binds the first graph-build
target to the public `odd_world_model.rebuild_world_model_core` graph function.

The workspace also has an installed `odd_sdlc` product under:

- `.abiogenesis/odd_sdlc/typescript/`

That installed product is a development product used as builder substrate for
this source project. It governs how work is admitted, executed, proven, and
projected. It is not the product being authored by this repository.

The governing method split is:

- `ODD_METHOD.md` governs graph-native ODD product shape and GTL/ABG
  constructive structure.
- `WORLD_MODEL_METHOD.md` governs world-model semantics, publication, and
  composition law.
- `odd_sdlc` provides installed SDLC governance and build components for this
  workspace.
- ABIogenesis provides GTL/ABG runtime substrate.

## Decision

The `odd_world_model` TypeScript tenant SHALL inherit from installed
`odd_sdlc` as a build component.

This inheritance is build inheritance, not product identity inheritance.

`odd_world_model` remains the authored ODD domain product. Its product
definition, requirements, domain assets, graph-function catalog, semantic
publication layer, and proof interpretation remain owned by this source
project.

### 1. Build Component Boundary

Installed `odd_sdlc` may provide or govern:

- project conformance and tenant admission
- work-item, requirement, design, implementation, and proof lane structure
- ticket and execution-contract interpretation
- lineage ledgers and tracking registers for build governance
- graph-function publication conventions for SDLC-controlled work
- operator surfaces such as `gaps`, `start`, and release-candidate reporting
- installed proof and release/install evaluation patterns
- traceability, assurance, and closure evidence patterns

Installed `odd_sdlc` SHALL NOT provide or override:

- `odd_world_model` product identity
- world-model domain semantics
- world-model requirement identifiers or acceptance meaning
- the published world-model semantic truth surface
- the public `odd_world_model` graph-function namespace
- an imperative traversal loop outside ABG
- a second source of runtime facts, replay, projection, proof, or closure
- a replacement semantic ledger for world-model objects, attributes,
  treatments, covariance, or published artifacts

### 2. Layering

The rebuild line has this authority order:

```text
specification/                                    product WHAT
WORLD_MODEL_METHOD.md                            world-model semantic law
ODD_METHOD.md                                    graph-native ODD structure
build_tenants/typescript/design/                 tenant HOW
.abiogenesis/odd_sdlc/typescript/                installed SDLC build component
ABIogenesis GTL/ABG                              runtime substrate
```

Operationally, the layers compose as:

```text
odd_world_model source project
-> TypeScript tenant design and realization
-> installed odd_sdlc build governance
-> GTL module and graph-function publication
-> ABG traversal, runtime facts, replay, projection, proof, and closure
```

ABG owns traversal mechanics and runtime truth. `odd_sdlc` may select, admit,
or evaluate work over that runtime. `odd_world_model` owns the domain meaning
of the graph functions and the interpretation of world-model gaps and closure.

### 3. Custom World-Model Domain Graphs

This inheritance makes custom world-model domain graphs first-class.

The TypeScript tenant may define different world-model graph families for
different source domains, bounded contexts, source evidence types, artifact
publication lanes, and composition targets.

Those domain graphs may reuse `odd_sdlc` lineage and tracking registers as
build evidence. Examples include:

- lineage ledgers that relate requirements, generated assets, execution
  evidence, and proof claims
- requirement-closure registers that show whether admitted obligations have
  traceable closure evidence
- design-depth and component-depth registers that expose whether build targets
  have enough design and decomposition evidence
- analysis registers that track drift, retry, repair, handoff, and runtime
  proof signals

Those registers track the governed build. They do not become the world-model
semantic layer. World-model semantic ledgers, object cuts, treatment surfaces,
covariance edges, adjoint mappings, and published domain artifacts remain
product-owned assets.

### 4. Dependency Direction

`odd_world_model` may depend on installed `odd_sdlc` package surfaces, command
surfaces, and contracts where they help govern the rebuild.

`odd_sdlc` must not depend on `odd_world_model`.

If this rebuild discovers a reusable SDLC abstraction, it must be repriced into
`odd_sdlc` or the shared methodology source before it is treated as shared law.
The TypeScript tenant must not normalize reusable governance by copying local
patterns until they look canonical.

### 5. Graph Build Use

The first world-model graph build remains:

```text
graph_function:odd_world_model.rebuild_world_model_core
```

Installed `odd_sdlc` can be used to admit the work, prepare the execution
contract, invoke the ABG-backed start path, evaluate gaps, and record closure
evidence.

The graph function itself remains a world-model graph function. It must be
published through the `odd_world_model` GTL module and must delegate traversal
to ABG.

### 6. Implementation Impact

The TypeScript tenant may later add an explicit `odd_sdlc` build adapter. That
adapter should be bounded to SDLC governance concerns such as:

- project profile loading
- execution-contract materialization
- ticket-to-graph-build admission
- gap and proof projection reads
- release/install evidence reads
- lineage and tracking register reads

The adapter must not contain world-model semantics and must not introduce a
tenant-owned traversal runtime.

Package and command wiring may use the installed
`.abiogenesis/odd_sdlc/typescript/` surfaces or a published `odd_sdlc`
TypeScript package, depending on what the implementation wave proves current.
That choice is realization detail. The authority boundary in this ADR remains
the same.

## Consequences

### Positive

- `odd_world_model` can use the current installed SDLC product as a build
  component without becoming an SDLC product.
- The TypeScript tenant can reuse current governance, ticket, execution, proof,
  and release/install patterns.
- Custom world-model domain graphs can be built without rebuilding lineage and
  tracking infrastructure from scratch.
- The world-model graph-function carrier remains explicit.
- ABG remains the owner of traversal and runtime facts.

### Negative

- The implementation must keep more than one authority layer visible.
- Reusable SDLC abstractions discovered during this rebuild require repricing
  instead of silent local copying.
- `odd_sdlc` command success is not enough to prove world-model closure unless
  the world-model requirements and graph-function proof also close.

## Non-Decisions

- This ADR does not choose a package name for an `odd_sdlc` TypeScript build
  adapter.
- This ADR does not define the complete ticket-to-graph-build workflow.
- This ADR does not replace ADR-001's TypeScript GTL/ABG stack decision.
- This ADR does not move world-model semantics into `odd_sdlc`.

## Acceptance

- The tenant design identifies installed `odd_sdlc` as a build component.
- The ADR distinguishes builder substrate from the authored world-model
  product.
- The first graph-build target remains
  `odd_world_model.rebuild_world_model_core`.
- The ADR keeps world-model semantics under product specification and
  `WORLD_MODEL_METHOD.md`.
- The ADR permits custom world-model domain graphs to reuse `odd_sdlc` lineage
  and tracking registers as build evidence.
- The ADR keeps traversal, runtime facts, replay, projection, proof, and
  closure under ABG.
