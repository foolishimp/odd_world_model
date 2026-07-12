# World-Model Mesh Capability Requirements

**Family**: REQ-ODD-WORLD-MODEL-MESH-CAP-*
**Status**: Active
**Category**: Capability

### REQ-ODD-WORLD-MODEL-MESH-CAP-001 — Federated Mesh As Complexity Management

**Carries**:
- `WORLD_MODEL_METHOD.md` — `Single Truth Surface`, `Composition Law`
- `INTENT.md` — `Outcomes`, `Constraints`
- `PRODUCT.md` — `Mesh As Complexity Management`, `Current Product Definition`

`odd_world_model` SHALL support a federated world-model mesh built from published
semantic cuts and typed links rather than from one flattened central enterprise
model. The mesh SHALL let an operator or agent resolve finite purpose-bound
context without loading or reconciling the whole world model.

### REQ-ODD-WORLD-MODEL-MESH-CAP-002 — Lawful Mesh Participation

**Carries**:
- `WORLD_MODEL_METHOD.md` — `Method Units`, `Composition Law`
- `INTENT.md` — `Outcomes`
- `PRODUCT.md` — `Published Domain Artifact`, `Common Model`, `Composed World Model`

The mesh SHALL admit at least these lawful node roles:

- published domain artifacts
- common models
- composed world models

and SHALL preserve their distinct role rather than collapsing them into one
anonymous node kind. `Common model` SHALL be an explicitly adopted reuse role
played by a published artifact, not a privileged ambient node type.

### REQ-ODD-WORLD-MODEL-MESH-CAP-003 — Versioned Reference-Based Composition

**Carries**:
- `WORLD_MODEL_METHOD.md` — `Composition Law`, `Publication Law`
- `INTENT.md` — `Constraints`
- `PRODUCT.md` — `Core Product Intent / World-Model Composition`, `Product End State`

The world-model mesh SHALL compose through typed links between exact versioned
published cuts so identity, authority, boundary, relation meaning, and
publication cut remain inspectable at every mesh node and link.

### REQ-ODD-WORLD-MODEL-MESH-CAP-004 — Cross-Domain Traversal

**Carries**:
- `WORLD_MODEL_METHOD.md` — `Method Units / Query Plane`, `Projection Law`
- `INTENT.md` — `Outcomes`
- `PRODUCT.md` — `World-Model Query`, `Current Delivery Pillars`, `Product End State`

The world-model mesh SHALL support bounded traversal across federated domain
boundaries from declared roots, scopes, relation roles, and closure rules so
operators can move between exact published nodes, links, treatments, mappings,
and composed models without flattening the mesh or loading it as ambient global
context.

### REQ-ODD-WORLD-MODEL-MESH-CAP-005 — Common-Model Reuse

**Carries**:
- `WORLD_MODEL_METHOD.md` — `Single Truth Surface`, `Composition Law`
- `INTENT.md` — `Outcomes`, `Constraints`
- `PRODUCT.md` — `Common Model`, `Product Vision`

The world-model mesh SHALL support explicit common-model adoption so multiple
local domains can reference the same published semantic cut without duplicating
it into hidden local truth surfaces or treating it as an automatic global
default.

### REQ-ODD-WORLD-MODEL-MESH-CAP-006 — Incremental Mesh Growth

**Carries**:
- `WORLD_MODEL_METHOD.md` — `Publication Law`, `Composition Law`
- `ODD_METHOD.md` — `Invocation Rule`
- `PRODUCT.md` — `Current Product Definition`, `Product End State`

The world-model mesh SHALL grow incrementally as new bounded domains, common
models, links, or higher-order composed models are published. Addition or
supersession SHALL pressure the declared dependency closure without requiring a
full rebuild or reinterpretation of unrelated mesh truth.

### REQ-ODD-WORLD-MODEL-MESH-CAP-007 — Mesh-Aware Downstream Projection

**Carries**:
- `WORLD_MODEL_METHOD.md` — `Projection Law`, `Composition Law`
- `INTENT.md` — `Outcomes`
- `PRODUCT.md` — `World-Model Query`, `Projection Layer`, `Product End State`

`odd_world_model` SHALL allow downstream projections such as query, mapping, proof,
and application-facing artifacts to operate over the mesh as a governed
semantic substrate through exact node and link refs rather than over detached
local copies.

### REQ-ODD-WORLD-MODEL-MESH-CAP-008 — First-Class Typed Semantic Links

**Carries**:
- `WORLD_MODEL_METHOD.md` — `Composition Law`, `Projection Law`
- `INTENT.md` — `Outcomes`, `Constraints`
- `PRODUCT.md` — `Mesh As Complexity Management`, `Semantic Mesh Link`

The mesh SHALL publish durable typed semantic links. Each link SHALL identify
its exact source and target cuts, relation role, owning authority, provenance,
version or validity coordinates, declared treatment, fidelity or loss where
applicable, and supersession state. The minimum supported relation roles SHALL
cover reference/composition, treatment, covariance, adjoint interpretation,
and supersession. An already-published treatment surface, covariance edge,
adjoint mapping, or supersession relation SHALL satisfy its link role by
reference rather than through a duplicate mesh-only relation record.

### REQ-ODD-WORLD-MODEL-MESH-CAP-009 — Bounded Purpose-Specific Mesh Cuts

**Carries**:
- `WORLD_MODEL_METHOD.md` — `Composition Law`, `Projection Law`
- `INTENT.md` — `Outcomes`, `Constraints`
- `PRODUCT.md` — `Mesh As Complexity Management`, `Bounded Mesh Cut`

`odd_world_model` SHALL resolve a finite mesh cut for a declared interaction
goal from exact root refs, traversal scope, relation selectors, and closure
rules. The cut SHALL retain exact node and link refs and SHALL remain a
downstream working projection rather than copied semantic truth.

### REQ-ODD-WORLD-MODEL-MESH-CAP-010 — Dependency-Local Change Impact

**Carries**:
- `WORLD_MODEL_METHOD.md` — `Publication Law`, `Composition Law`
- `PRODUCT.md` — `Mesh As Complexity Management`, `Mesh Dependency Closure`

When a mesh node or link is added, corrected, or superseded,
`odd_world_model` SHALL identify the finite declared dependency closure whose
compositions and projections are pressured. Unrelated mesh truth SHALL remain
addressable without mandatory reconstruction.
