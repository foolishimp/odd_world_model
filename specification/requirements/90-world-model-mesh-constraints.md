# World-Model Mesh Constraint Requirements

**Family**: REQ-ODD-DOMAIN-MESH-CONSTRAINT-*
**Status**: Active
**Category**: Constraint / Guarantee

### REQ-ODD-DOMAIN-MESH-CONSTRAINT-001 — No Central Flattened Truth

**Carries**:
- `WORLD_MODEL_METHOD.md` — `Preferred Topology`
- `INTENT.md` — `Constraints`
- `PRODUCT.md` — `Product Vision`, `Current Product Definition`

The world-model mesh SHALL not become a central flattened super-model that
erases bounded-context identity, publication cut, or domain ownership.

### REQ-ODD-DOMAIN-MESH-CONSTRAINT-002 — Published Nodes Only

**Carries**:
- `WORLD_MODEL_METHOD.md` — `Key Product Taxonomy`, `Compositions Are Built By Reference`
- `INTENT.md` — `Constraints`
- `PRODUCT.md` — `Published Domain Artifact`, `Composed World Model`

Durable mesh participation SHALL be restricted to published semantic cuts.
Mutable review observations, constructor aids, local adapter output, or
unpublished workspace state SHALL not be admitted as durable mesh truth.

### REQ-ODD-DOMAIN-MESH-CONSTRAINT-003 — Reference Before Copy

**Carries**:
- `WORLD_MODEL_METHOD.md` — `Compositions Are Built By Reference`
- `INTENT.md` — `Constraints`
- `PRODUCT.md` — `Core Product Intent / World-Model Composition`

Cross-domain mesh linkage SHALL preserve upstream node identity by reference
before any copied or projected convenience surface. If a local projection is
materialized, its upstream mesh refs SHALL remain explicit.

### REQ-ODD-DOMAIN-MESH-CONSTRAINT-004 — Version And Supersession Disclosure

**Carries**:
- `WORLD_MODEL_METHOD.md` — `Versioning`
- `INTENT.md` — `Constraints`
- `PRODUCT.md` — `Product End State`

Every durable mesh node and link SHALL disclose the publication cut or version
it relies on, together with explicit supersession where a newer semantic cut
replaces an older one.

### REQ-ODD-DOMAIN-MESH-CONSTRAINT-005 — Query And Mapping Stay Downstream

**Carries**:
- `WORLD_MODEL_METHOD.md` — `Method Objectives`
- `INTENT.md` — `Constraints`
- `PRODUCT.md` — `World-Model Query`, `Projection Layer`

Query, mapping, report, and proof surfaces SHALL remain downstream projections
over the mesh. They SHALL not become a competing authority layer over mesh
nodes or links.

### REQ-ODD-DOMAIN-MESH-CONSTRAINT-006 — Common Models Are Reusable Published Nodes

**Carries**:
- `WORLD_MODEL_METHOD.md` — `Preferred Topology`
- `INTENT.md` — `Constraints`
- `PRODUCT.md` — `Common Model`

A common model admitted into the mesh SHALL be treated as a reusable published
node, not as hidden ambient doctrine or an undeclared central default model.

### REQ-ODD-DOMAIN-MESH-CONSTRAINT-007 — Mesh Line Must Be Generic

**Carries**:
- `ODD_METHOD.md` — `Core Law / 2. Graph Functions Are The Primary Constructive Carrier`
- `INTENT.md` — `Constraints`
- `PRODUCT.md` — `Current Product Definition`

The first retained mesh slice may prove itself on the current trade and APRA
domains, but the mesh asset and graph-function boundaries SHALL be generic to
federated published domains rather than hardcoded to one retained example pair.
