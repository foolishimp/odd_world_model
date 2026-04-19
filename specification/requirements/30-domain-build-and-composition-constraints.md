# Domain Build And Composition Constraint Requirements

**Family**: REQ-ODD-WORLD-MODEL-BUILD-CONSTRAINT-*
**Status**: Active
**Category**: Constraint / Guarantee

### REQ-ODD-WORLD-MODEL-BUILD-CONSTRAINT-001 — GTL And F_D Responsibility Split

**Carries**:
- `WORLD_MODEL_METHOD.md` — `Method Flow`, `Materialization Law`
- `INTENT.md` — `Purpose`, `Constraints`
- `PRODUCT.md` — `Product Position`, `Current Delivery Pillars`

`odd_world_model` SHALL keep semantic derivation and deterministic materialization as
explicit separate responsibilities. GTL / graph functions SHALL carry the
world-model derivation and traversal logic. Deterministic `F_D` primitives
SHALL be limited to record, provenance/event, and other deterministic artifact
materialization.

### REQ-ODD-WORLD-MODEL-BUILD-CONSTRAINT-002 — Attribute Ledger As Immediate Semantic Source

**Carries**:
- `WORLD_MODEL_METHOD.md` — `Materialization Law`, `Attribute Ledger Law`
- `INTENT.md` — `Outcomes`
- `PRODUCT.md` — `Product Vision`, `Product Terms / Attribute Ledger`

The attribute ledger SHALL be the immediate semantic source of published Markov
object cuts. The object cut SHALL not be treated as the primary mutable truth
surface.

### REQ-ODD-WORLD-MODEL-BUILD-CONSTRAINT-003 — Immutable Supersession

**Carries**:
- `WORLD_MODEL_METHOD.md` — `Materialization Law`, `Publication Law`
- `INTENT.md` — `Constraints`
- `PRODUCT.md` — `Product Vision`, `Product End State`

Published domain artifacts, attribute-ledger-backed object cuts, and their
contained semantic truth SHALL be superseded by new cuts rather than edited in
place as current truth.

### REQ-ODD-WORLD-MODEL-BUILD-CONSTRAINT-004 — Composition Preservation

**Carries**:
- `WORLD_MODEL_METHOD.md` — `Composition Law`
- `INTENT.md` — `Outcomes`, `Constraints`
- `PRODUCT.md` — `Core Product Intent / World-Model Composition`, `Product End State`

Composition SHALL preserve published-artifact identity, version, local
authority, bounded-context meaning, and declared loss or ambiguity at every
stitch point.

### REQ-ODD-WORLD-MODEL-BUILD-CONSTRAINT-005 — Query Plane Subordination

**Carries**:
- `WORLD_MODEL_METHOD.md` — `Constitutional Intents`, `Method Units / Query Plane`, `Publication Law`
- `INTENT.md` — `Constraints`
- `PRODUCT.md` — `Current Delivery Pillars`, `World-Model Query`, `Product End State`

Any current or future query or serving surface SHALL remain downstream of
published domain artifacts and composed world models and SHALL not become a
competing constitutional source of semantic truth.

### REQ-ODD-WORLD-MODEL-BUILD-CONSTRAINT-006 — Categorical Adapters And Single Published Truth

**Carries**:
- `WORLD_MODEL_METHOD.md` — `Method Flow`, `Publication Law`
- `INTENT.md` — `Constraints`
- `PRODUCT.md` — `Product Terms`, `Product End State`

Source adapters SHALL remain categorical decomposition readers over source
families such as PDF, Markdown, code, schemas, or FpML. They SHALL not become
project-instanced truth surfaces. Review observations emitted by adapters are
constructor aids only. Durable truth SHALL be published by the build line as
bounded source domains and downstream interpreted world-model domains.
