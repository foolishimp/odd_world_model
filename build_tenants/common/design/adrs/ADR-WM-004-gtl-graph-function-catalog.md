# ADR-WM-004 GTL Graph-Function Catalog

**Status**: Accepted by F_H direction
**Date**: 2026-07-12
**Ticket**: T-029
**Implementation authority**: T-026 full build
**Implements**:
- REQ-ODD-WORLD-MODEL-BUILD-CAP-001
- REQ-ODD-WORLD-MODEL-BUILD-CAP-003
- REQ-ODD-WORLD-MODEL-BUILD-CAP-004
- REQ-ODD-WORLD-MODEL-BUILD-CAP-005
- REQ-ODD-WORLD-MODEL-BUILD-CAP-006
- REQ-ODD-WORLD-MODEL-CONTEXT-MEMORY-002
- REQ-ODD-WORLD-MODEL-CONTEXT-MEMORY-003
- REQ-ODD-WORLD-MODEL-CONTEXT-MEMORY-005
- REQ-ODD-WORLD-MODEL-ODD-CARRIER-001
- REQ-ODD-WORLD-MODEL-ODD-CARRIER-002
- REQ-ODD-WORLD-MODEL-ODD-CARRIER-003
- REQ-ODD-WORLD-MODEL-ODD-CARRIER-004
- REQ-ODD-WORLD-MODEL-ODD-CARRIER-005
- REQ-ODD-WORLD-MODEL-ODD-CARRIER-006
- REQ-ODD-WORLD-MODEL-ODD-CARRIER-007
- REQ-ODD-WORLD-MODEL-MESH-CAP-008
- REQ-ODD-WORLD-MODEL-MESH-CAP-009
- REQ-ODD-WORLD-MODEL-MESH-CAP-010
- REQ-ODD-WORLD-MODEL-MAPPING-CAP-001
- REQ-ODD-WORLD-MODEL-MAPPING-CAP-002
**Derives from**:
- INT-ODD-WORLD-MODEL-001
- PROD-ODD-WORLD-MODEL-001
- ADR-WM-002
- ADR-WM-003
- T-029
**Supersedes if accepted**:
- the historical Python `build_and_query_world_model` executive carrier
- the unratified TypeScript handle `odd_world_model.rebuild_world_model_core`

## Context

The specification mandates named graph functions, a machine-readable catalog,
a GTL module, cumulative environments, public invocation, explicit F_P/F_D/F_H
bindings, and ABG-owned traversal. It does not fix the exact callable catalog.

F_H first authorized contract definition without code so the catalog could be
reviewed before implementation. On 2026-07-12, the owner directed Codex to
continue to full build. That direction accepts the recommended topology below
and authorizes T-026 to implement it against the exact proving substrate.
Exact contracts live in `../GTL_GRAPH_FUNCTION_CONTRACTS.md`.

## Decision

### Public Functions Follow Authority And Outcome Seams

The accepted public catalog is:

1. `odd_world_model.publish_domain_model`
2. `odd_world_model.publish_semantic_links`
3. `odd_world_model.compose_world_model`
4. `odd_world_model.resolve_mesh_cut`
5. `odd_world_model.project_context`
6. `odd_world_model.interpret_context`
7. `odd_world_model.query_world_model`
8. `odd_world_model.map_domains`

The first seven form the accepted first executable catalog. `map_domains` is a
defined downstream contract but remains deferred until the core semantic-memory
and context slice is proven.

### Domain Construction Uses Private Refinements

`publish_domain_model` is the public outcome contract. It refines into private
GraphFunctions:

1. `odd_world_model.internal.observe_source_evidence`
2. `odd_world_model.internal.construct_domain_semantics`
3. `odd_world_model.internal.admit_domain_claims`
4. `odd_world_model.internal.project_domain_cut`
5. `odd_world_model.internal.materialize_attested_cut`

Trace, assurance, ledger, and serialization remain typed intermediate assets
and vectors. They are not public work entrypoints.

### Link Publication Precedes Composition

`publish_semantic_links` owns durable link truth. `compose_world_model` consumes
admitted link refs and cannot create a second embedded link truth. If composition
discovers a missing relation, it yields a link proposal that re-enters through
`publish_semantic_links` under ABG continuation.

### Mesh Resolution Is Public And Reusable

`resolve_mesh_cut` is separate from context, query, mapping, and proof. This
prevents each consumer from reconstructing a different working mesh and gives
all consumers one finite-cut contract.

### Context Projection Is Separate From Model Invocation

`project_context` is deterministic over an exact bounded cut and projection
contract. `interpret_context` is the F_P boundary. Separating them makes the
exact model input inspectable and reusable and prevents probabilistic
summarization from hiding inside basis construction.

### Model Output Does Not Receive A Generic Mutation Gateway

There is no public `accept_semantic_result` function. `interpret_context`
produces an attributed proposal, not semantic truth. A selected proposal
re-enters the target-specific publication function:

- domain claims through `publish_domain_model`;
- link changes through `publish_semantic_links`; or
- composition changes through `compose_world_model`.

ABG owns re-entry and continuation. This avoids one generic function that can
mutate every semantic surface.

### Query Is First-Slice Public; Mapping Is Contracted But Deferred

Query is a current delivery pillar and is included in the first catalog.
Mapping remains a live Product capability, so its contract is defined now, but
its executable publication is deferred until the context-memory steel thread
is proven.

## Rejected Topologies

### One Executive Function

Rejected. A single `build_and_query_world_model` or
`rebuild_world_model_core` carrier hides publication, mesh, context, F_P, and
query authority seams and makes independent reuse difficult.

### Stage-Per-Public-Function

Rejected. Public `trace`, `assure`, `append_ledger`, and `serialize` functions
would expose implementation stages as product API and inflate the catalog.

### Context Projection Inside Invocation

Rejected. It would make the model's actual basis harder to inspect, compare,
cache, replay, and prove.

### Generic Semantic Acceptance Function

Rejected. It would become a rival universal mutation gateway and obscure the
target publication contract.

## Consequences

### Positive

- public functions align to independently useful outcomes;
- durable publication and downstream projection remain distinct;
- context is inspectable before F_P work;
- model outputs re-enter through target-specific truth boundaries;
- inner construction remains modular without public stage inflation; and
- the catalog can migrate from rc.3 by replacing substrate bindings rather than
  public WM semantics.

### Negative

- the public catalog has seven first-slice functions rather than one executive;
- cross-function re-entry requires explicit ABG continuation and evidence;
- link publication is an extra step before composition; and
- the runtime catalog and GTL module will require careful refinement/foldback
  proof during implementation.

## F_H Decision Record

The 2026-07-12 full-build direction records these dispositions:

1. Accept all eight handles at the stated semantic altitude.
2. Keep `publish_semantic_links` independent of composition.
3. Require model proposals to re-enter through the target publication
   function; do not introduce a generic semantic mutation gateway.
4. Define `map_domains` now and defer its executable publication from the first
   runnable catalog.
5. Accept the five private domain-publication refinements without promoting
   trace, assurance, ledger, or serialization stages to public functions.

Implementation remains bound by the typed inputs, outputs, environments,
compute authorities, foldback obligations, closure conditions, and typed
non-closure outcomes in the contract document. Acceptance authorizes GTL code;
it does not weaken ABG ownership of traversal, admission, replay, or closure.

## Current Realization Status

The TypeScript tenant publishes this catalog and rc.3 traverses each declared
graph. The current adapter carries preconstructed WM evidence by exact ref and
digest; it does not execute the local WM semantic kernel as the selected graph
binding and does not prove calibrated F_P authorship. Catalog acceptance is
therefore not native-carrier completion. The target/as-built distinction and
migration gaps are recorded in
`build_tenants/typescript/design/90-admitted-semantic-steel-thread-design.md`
and `build_tenants/typescript/design/95-rc3-reference-bridge-as-built-review.md`.
