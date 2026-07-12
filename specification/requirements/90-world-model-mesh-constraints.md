# World-Model Mesh Constraint Requirements

**Family**: REQ-ODD-WORLD-MODEL-MESH-CONSTRAINT-*
**Status**: Active
**Category**: Constraint / Guarantee

### REQ-ODD-WORLD-MODEL-MESH-CONSTRAINT-001 — No Central Flattened Truth

**Carries**:
- `WORLD_MODEL_METHOD.md` — `Single Truth Surface`, `Composition Law`
- `INTENT.md` — `Constraints`
- `PRODUCT.md` — `Product Vision`, `Current Product Definition`

The world-model mesh SHALL not become a central flattened super-model that
erases bounded-context identity, publication cut, or domain ownership.

### REQ-ODD-WORLD-MODEL-MESH-CONSTRAINT-002 — Published Nodes Only

**Carries**:
- `WORLD_MODEL_METHOD.md` — `Single Truth Surface`, `Method Units`
- `INTENT.md` — `Constraints`
- `PRODUCT.md` — `Published Domain Artifact`, `Composed World Model`

Durable mesh participation SHALL be restricted to published semantic cuts.
Mutable review observations, constructor aids, local adapter output, or
unpublished workspace state SHALL not be admitted as durable mesh truth.

### REQ-ODD-WORLD-MODEL-MESH-CONSTRAINT-003 — Reference Before Copy

**Carries**:
- `WORLD_MODEL_METHOD.md` — `Composition Law`
- `INTENT.md` — `Constraints`
- `PRODUCT.md` — `Core Product Intent / World-Model Composition`

Cross-domain mesh linkage SHALL preserve upstream node identity by reference
before any copied or projected convenience surface. If a local projection is
materialized, its upstream mesh refs SHALL remain explicit.

### REQ-ODD-WORLD-MODEL-MESH-CONSTRAINT-004 — Version And Supersession Disclosure

**Carries**:
- `WORLD_MODEL_METHOD.md` — `Publication Law`
- `INTENT.md` — `Constraints`
- `PRODUCT.md` — `Product End State`

Every durable mesh node and link SHALL disclose the exact publication cut or
version it relies on, together with explicit supersession where newer semantic
truth replaces an older cut or relation.

### REQ-ODD-WORLD-MODEL-MESH-CONSTRAINT-005 — Query And Mapping Stay Downstream

**Carries**:
- `WORLD_MODEL_METHOD.md` — `Method Objectives`
- `INTENT.md` — `Constraints`
- `PRODUCT.md` — `World-Model Query`, `Projection Layer`

Query, mapping, report, and proof surfaces SHALL remain downstream projections
over the mesh. They SHALL not become a competing authority layer over mesh
nodes or links.

### REQ-ODD-WORLD-MODEL-MESH-CONSTRAINT-006 — Common Models Are Reusable Published Nodes

**Carries**:
- `WORLD_MODEL_METHOD.md` — `Composition Law`, `Single Truth Surface`
- `INTENT.md` — `Constraints`
- `PRODUCT.md` — `Common Model`

A common model admitted into the mesh SHALL be treated as an explicitly adopted
role of a reusable published node, not as hidden ambient doctrine, a privileged
node type, or an undeclared central default model.

### REQ-ODD-WORLD-MODEL-MESH-CONSTRAINT-007 — Mesh Line Must Be Generic

**Carries**:
- `ODD_METHOD.md` — `Core Law / 2. Graph Functions Are The Primary Constructive Carrier`
- `INTENT.md` — `Constraints`
- `PRODUCT.md` — `Current Product Definition`

A retained mesh slice MAY use named domain corpora for proof, but the mesh asset
and graph-function boundaries SHALL be generic to federated published domains
rather than hardcoded to any example pair.

### REQ-ODD-WORLD-MODEL-MESH-CONSTRAINT-008 — No Ambient Whole-Mesh Context

**Carries**:
- `INTENT.md` — `Outcomes`, `Constraints`
- `PRODUCT.md` — `Mesh As Complexity Management`, `Bounded Mesh Cut`

No query, mapping, proof, agent task, or application projection SHALL require
the whole mesh as implicit context. It SHALL declare a finite root and scope,
and any expansion beyond the resolved bounded cut SHALL be explicit and
traceable.

### REQ-ODD-WORLD-MODEL-MESH-CONSTRAINT-009 — Exact Link Integrity

**Carries**:
- `WORLD_MODEL_METHOD.md` — `Composition Law`
- `PRODUCT.md` — `Mesh As Complexity Management`, `Semantic Mesh Link`

A durable semantic link SHALL resolve exact published source and target cuts
and SHALL carry a declared lawful relation role and authority. Local-name
similarity, inferred adjacency, or an unversioned target SHALL NOT be sufficient
to admit link truth.

### REQ-ODD-WORLD-MODEL-MESH-CONSTRAINT-010 — No Silent Mesh Reconciliation

**Carries**:
- `INTENT.md` — `Constraints`
- `PRODUCT.md` — `Mesh As Complexity Management`

An unresolved ref, incompatible publication cut, authority conflict, invalid
relation, or unreconciled treatment, fidelity, or loss SHALL remain a typed
gap. Mesh construction and traversal SHALL NOT hide it through fallback name
matching, flattening, silent omission, or substitution from mutable local state.

### REQ-ODD-WORLD-MODEL-MESH-CONSTRAINT-011 — One Link Truth, Many Projections

**Carries**:
- `WORLD_MODEL_METHOD.md` — `Single Truth Surface`, `Projection Law`
- `PRODUCT.md` — `Single Truth Surface`, `Mesh As Complexity Management`

An admitted semantic relation SHALL have one durable mesh-link truth surface.
Indexes, reports, mapping views, query responses, caches, and bounded mesh cuts
MAY project that relation many times, but SHALL retain its exact link ref and
SHALL NOT publish a rival copy as semantic authority.
