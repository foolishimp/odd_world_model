# World-Model Mesh Capability Requirements

**Family**: REQ-ODD-WORLD-MODEL-MESH-CAP-*
**Status**: Active
**Category**: Capability

### REQ-ODD-WORLD-MODEL-MESH-CAP-001 — Federated Mesh Over Published Semantic Cuts

**Carries**:
- `WORLD_MODEL_METHOD.md` — `Compositions Are Built By Reference`, `Preferred Topology`
- `INTENT.md` — `Outcomes`, `Constraints`
- `PRODUCT.md` — `Product Vision`, `Current Product Definition`, `Product End State`

`odd_world_model` SHALL support a federated world-model mesh built from published
semantic cuts rather than from one flattened central enterprise model.

### REQ-ODD-WORLD-MODEL-MESH-CAP-002 — Lawful Mesh Participation

**Carries**:
- `WORLD_MODEL_METHOD.md` — `Key Product Taxonomy`, `Compositions Are Built By Reference`
- `INTENT.md` — `Outcomes`
- `PRODUCT.md` — `Published Domain Artifact`, `Common Model`, `Composed World Model`

The mesh SHALL admit at least these lawful node roles:

- published domain artifacts
- common models
- composed world models

and SHALL preserve their distinct role in the mesh rather than collapsing them
into one anonymous node kind.

### REQ-ODD-WORLD-MODEL-MESH-CAP-003 — Versioned Reference-Based Composition

**Carries**:
- `WORLD_MODEL_METHOD.md` — `Compositions Are Built By Reference`, `Versioning`
- `INTENT.md` — `Constraints`
- `PRODUCT.md` — `Core Product Intent / World-Model Composition`, `Product End State`

The world-model mesh SHALL compose by explicit reference to versioned published
artifacts and composed models so that identity, boundary, and publication cut
remain inspectable at every mesh node.

### REQ-ODD-WORLD-MODEL-MESH-CAP-004 — Cross-Domain Traversal

**Carries**:
- `WORLD_MODEL_METHOD.md` — `Method Objectives`
- `INTENT.md` — `Outcomes`
- `PRODUCT.md` — `World-Model Query`, `Current Delivery Pillars`, `Product End State`

The world-model mesh SHALL support traversal across federated domain
boundaries so operators can move from one published node to adjacent nodes,
references, treatments, mappings, and composed models without flattening the
mesh into one local projection.

### REQ-ODD-WORLD-MODEL-MESH-CAP-005 — Common-Model Reuse

**Carries**:
- `WORLD_MODEL_METHOD.md` — `Preferred Topology`
- `INTENT.md` — `Outcomes`, `Constraints`
- `PRODUCT.md` — `Common Model`, `Product Vision`

The world-model mesh SHALL support shared common-model publication so multiple
local domains can reference the same published semantic model without
duplicating it into separate hidden local truth surfaces.

### REQ-ODD-WORLD-MODEL-MESH-CAP-006 — Incremental Mesh Growth

**Carries**:
- `WORLD_MODEL_METHOD.md` — `Versioning`, `Compositions Are Built By Reference`
- `ODD_METHOD.md` — `Invocation Rule`
- `PRODUCT.md` — `Current Product Definition`, `Product End State`

The world-model mesh SHALL grow incrementally as new bounded domains, common
models, or higher-order composed models are published, without requiring a
full rebuild of previously published mesh truth.

### REQ-ODD-WORLD-MODEL-MESH-CAP-007 — Mesh-Aware Downstream Projection

**Carries**:
- `WORLD_MODEL_METHOD.md` — `Method Objectives`
- `INTENT.md` — `Outcomes`
- `PRODUCT.md` — `World-Model Query`, `Projection Layer`, `Product End State`

`odd_world_model` SHALL allow downstream projections such as query, mapping, proof,
and application-facing artifacts to operate over the mesh as a governed
semantic substrate rather than over detached local copies of its nodes.
