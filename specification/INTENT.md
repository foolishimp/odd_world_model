# Intent

**ID**: INT-ODD-WORLD-MODEL-001
**Status**: Active
**Date**: 2026-07-12
**Profile**: product intent

## Purpose

`odd_world_model` exists to externalize the world model that domain experts already
carry in their heads.

It deliberately blurs the traditional boundary between application, data, and
data processing at the LLM context surface. An LLM consumes context rather than
an application or database as such. `odd_world_model` therefore acts as a
governed memory bank that turns code, records, events, documents,
transformations, and published semantic cuts into versioned, attributable, and
provable context without erasing their distinct source authority.

This source project observes existing source systems of record and reconstructs the
bounded contexts, functional surfaces, treatment semantics, and cross-domain
co-variance those systems enact but do not explicitly carry. It does this
without replacing those systems, obstructing them, or becoming a new operational
system of record.

This source project exists because downstream outcomes are often produced by opaque
dumps, ETLs, and transformations that preserve values but lose the semantic
history required to explain what happened. `odd_world_model` reconstructs that
history as an inspectable world model rather than accepting detached data as the
best available representation of reality.

`odd_world_model` is the concrete product domain for this line of work. It is
specified as a governed graph-native product rather than remaining only as an
abstract product thesis or generic commentary about domains.

This intent surface defines what the current `odd_world_model` source project is
trying to make true for the next released `odd_world_model` product. It is not the
release artifact itself.

This line is governed by `SPEC_METHOD.md` as refined by
`WORLD_MODEL_METHOD.md` for world-model construction and composition.

This intent is independent of programming language, tenant implementation, or
runtime packaging choice. Those choices belong to design and realization unless
the live specification explicitly promotes a boundary into product law.

## Outcomes

- Build published domain artifacts from existing source systems so local domain
  truth becomes explicit, versioned, and reusable rather than remaining trapped
  in raw dumps, field names, or detached documentation.
- Compose published domain artifacts into higher-order world models without
  erasing local authority, boundary meaning, or declared loss at stitch
  points.
- Manage semantic complexity through a federated mesh of local published cuts
  and typed links, allowing each interaction goal to resolve a finite sufficient
  context instead of requiring one global model.
- Project bounded mesh cuts into LLM context with a declared basis, freshness,
  fidelity, loss, omissions, and unresolved gaps so every governed model output
  is judgeable against the exact world-state it saw.
- Use candidate Markov-object cuts and their supporting semantic surfaces as a
  recoverable compression layer over source evidence rather than repeatedly
  assembling raw code, data, and documents into ad hoc prompts.
- Support query and traversal over published domain artifacts and composed
  world models as a current delivery pillar, so AI or human operators can
  answer mapping, lineage, treatment, and explainability questions at any node
  in the graph.
- Let a sufficiently well-formed world model serve as the semantic substrate
  for projecting downstream application surfaces such as APIs, schemas,
  workflows, validations, and test scaffolds without forcing those semantics
  to be re-authored independently each time.
- Preserve semantic continuity from source-system function through downstream
  treatment and reporting domains.
- Make every material datum interpretable through recoverable context:
  originating function, authority boundary, lifecycle position, transformation
  history, and remaining ambiguity.
- Publish candidate Markov-object cuts, promote them only under the governed
  evidence gate, and establish lawful covariance between them across adjacent
  domains.
- Provide the world-model substrate that `data_mapper` can use to emit
  covariant streams with explicit adjoint interpretation and declared loss.

## Constraints

- The authoritative project truth lives in `specification/`; code is a
  downstream realization of that authority.
- `odd_world_model` is the product domain itself. The project is not only describing
  domain comprehension in the abstract; it is realizing that capability as a
  specific GTL/ABG domain.
- The build line should declare semantic construction through published graph
  functions, use calibrated probabilistic workers for semantic proposals, and
  use deterministic machinery for closed checks and artifact materialization
  rather than allowing one-off loader sprawl.
- This source project defines the next `odd_world_model` product. Installed
  workspaces consume released `odd_world_model` products to build project-owned
  domain artifacts.
- Published domain artifacts are the durable semantic publication units. They
  can be referenced, versioned, composed into higher-order world models, and
  traversed for query and mapping work.
- Mesh composition must preserve local publication authority through typed,
  versioned links. A common model is adopted by explicit reference and does not
  become ambient global doctrine.
- A bounded mesh cut is a purpose-specific projection over exact published node
  and link refs. It must not become copied semantic truth or require the full
  mesh to be loaded as ambient context.
- Every governed LLM invocation must identify its exact context basis and
  projection contract. Context expansion, truncation, fidelity, semantic loss,
  excluded surfaces, and staleness must remain explicit.
- Context projections and LLM outputs remain downstream of published semantic
  truth. An LLM output is an F_P proposal until deterministic checks, ABG
  admission, and attributed WM authority accept any resulting semantic claim.
- Immutable context identity and digest evidence are product obligations;
  storage engine, table format, version-control system, and prompt-rendering
  technology remain downstream design choices.
- Query and traversal are currently part of the delivery line, but the serving
  mechanism for that work may later be offloaded into a dedicated query plane
  without changing the constitutional identity of the product.
- Source systems remain sovereign for operational truth. `odd_world_model` observes,
  inspects, and comprehends them; it does not stand in their way.
- Catalogs and metadata systems are evidence surfaces, not primary semantic
  authority. The strongest comprehension comes from understanding the functions,
  code, rules, events, and interfaces that created the recorded representation.
- Domains are defined by functional surfaces, not by vocabulary clusters alone.
  A domain must expose inputs, transformations, invariants, outputs, and
  adjacent dependencies.
- Data is not treated as self-explanatory. Data is a trace of constrained
  function execution and is invalid in isolation from its context.
- Cross-domain transformation is not plain field mapping. Every transformation
  is a semantic treatment and must preserve or explicitly declare changes in
  meaning, authority, freshness, and loss.
- `odd_world_model` does not replace `data_mapper`; it builds the world model,
  Markov objects, treatment surfaces, and covariance relationships that make
  lawful mapping possible.
- The core abstractions remain generic across domains. Specific industries or
  business lines are proving use cases, not the constitutional identity of the
  product.
- The first proving wave stays narrow. It should prove one end-to-end source to
  downstream treatment slice rather than prematurely expanding into every
  possible domain at once.
- Deployment and runtime-observation stages remain out of scope until explicit
  capability contracts are declared for the product line.
