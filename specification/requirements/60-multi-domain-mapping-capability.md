# Multi-Domain Mapping Capability Requirements

**Family**: REQ-ODD-WORLD-MODEL-MAPPING-CAP-*
**Status**: Active
**Category**: Capability

### REQ-ODD-WORLD-MODEL-MAPPING-CAP-001 — Governed Mapping Over Published Domains

**Carries**:
- `WORLD_MODEL_METHOD.md` — `Constitutional Intents`, `Method Objectives`, `Mappings Are Semantic Treatments`
- `INTENT.md` — `Outcomes`, `Constraints`
- `PRODUCT.md` — `Current Delivery Pillars`, `World-Model Query And Traversal`, `Product End State`

`odd_world_model` SHALL support governed mapping work over published domain
artifacts and composed world models rather than treating mapping as detached
field correspondence over raw names or ad hoc local reports.

### REQ-ODD-WORLD-MODEL-MAPPING-CAP-002 — Durable Mapping Record Publication

**Carries**:
- `WORLD_MODEL_METHOD.md` — `Method Objectives`, `Mappings Are Semantic Treatments`
- `INTENT.md` — `Outcomes`, `Constraints`
- `PRODUCT.md` — `Projection Layer`, `Conventional Projection`, `Product End State`

`odd_world_model` SHALL publish a durable machine-usable mapping record asset that
captures cross-domain object, attribute, relation, and treatment
correspondence with explicit lineage back to the governing published domain
artifacts.

### REQ-ODD-WORLD-MODEL-MAPPING-CAP-003 — Human Mapping Report Projection

**Carries**:
- `WORLD_MODEL_METHOD.md` — `Method Objectives`
- `INTENT.md` — `Outcomes`
- `PRODUCT.md` — `Projection Layer`, `World-Model Query And Traversal`

`odd_world_model` SHALL project a human-usable mapping report from the governed
mapping line so operators can inspect scope, pairing rationale, confidence,
declared loss, ambiguity, and recommended next actions without treating the
report as an independent truth surface.

### REQ-ODD-WORLD-MODEL-MAPPING-CAP-004 — Categorized Mapping Semantics

**Carries**:
- `WORLD_MODEL_METHOD.md` — `Mappings Are Semantic Treatments`
- `INTENT.md` — `Outcomes`, `Constraints`
- `PRODUCT.md` — `Product Vision`, `Projection Layer`

`odd_world_model` SHALL classify mappings by semantic correspondence category rather
than collapsing them into matched or unmatched only. The active line SHALL at
least distinguish exact identity, constrained equivalence, treatment
projection, derived mapping, aggregation or rollup, split mapping, reference
alignment, lossy mapping, and incompatible or no mapping.

### REQ-ODD-WORLD-MODEL-MAPPING-CAP-005 — Confidence And Reasoning Disclosure

**Carries**:
- `WORLD_MODEL_METHOD.md` — `Method Objectives`, `Mappings Are Semantic Treatments`
- `INTENT.md` — `Outcomes`, `Constraints`
- `PRODUCT.md` — `Product Vision`, `World-Model Query And Traversal`

Every published mapping correspondence SHALL carry an explicit confidence
assessment together with reasoning, evidence basis, and ambiguity notes so
mapping confidence is inspectable rather than opaque.

### REQ-ODD-WORLD-MODEL-MAPPING-CAP-006 — Unassigned Surface Disclosure

**Carries**:
- `WORLD_MODEL_METHOD.md` — `Method Objectives`
- `INTENT.md` — `Outcomes`
- `PRODUCT.md` — `Product Vision`, `Product End State`

The mapping line SHALL disclose unassigned source and target surfaces so the
current bounded correspondence can be inspected for missing coverage rather
than presenting a falsely complete mapping.

### REQ-ODD-WORLD-MODEL-MAPPING-CAP-007 — Real Published-Domain Proving Slice

**Carries**:
- `ODD_METHOD.md` — `Method Composition`, `Invocation Rule`
- `INTENT.md` — `Constraints`
- `PRODUCT.md` — `Current Product Definition`, `Product End State`

The first retained proving slice for governed mapping SHALL run over real
published domains already present in the product line rather than over
synthetic placeholder domains or detached sample tables.
