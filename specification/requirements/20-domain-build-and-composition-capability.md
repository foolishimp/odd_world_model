# Domain Build And Composition Capability Requirements

**Family**: REQ-ODD-WORLD-MODEL-BUILD-CAP-*
**Status**: Active
**Category**: Capability

### REQ-ODD-WORLD-MODEL-BUILD-CAP-001 — Source-To-Artifact Build Line

**Carries**:
- `WORLD_MODEL_METHOD.md` — `Method Flow`, `Materialization Law`
- `INTENT.md` — `Outcomes`
- `PRODUCT.md` — `Core Product Intent / Domain Build`

`odd_world_model` SHALL build published domain artifacts through an explicit line
from source evidence through tracing, assurance, attribute-ledger
materialization, immutable object-cut projection, and publication rather than
through opaque intermediate mutation.

### REQ-ODD-WORLD-MODEL-BUILD-CAP-002 — Tracing And Assurance Surfaces

**Carries**:
- `WORLD_MODEL_METHOD.md` — `Method Flow`, `Attribute Ledger Law`
- `INTENT.md` — `Outcomes`, `Constraints`
- `PRODUCT.md` — `Product Vision`, `Core Product Intent / Domain Build`

`odd_world_model` SHALL expose traced-observation and assurance surfaces in the
domain-build line so accepted world-model claims can be challenged before they
become published semantic truth.

### REQ-ODD-WORLD-MODEL-BUILD-CAP-003 — Published Domain Artifact Construction

**Carries**:
- `WORLD_MODEL_METHOD.md` — `Constitutional Intents`, `Method Units`, `Publication Law`
- `INTENT.md` — `Outcomes`, `Constraints`
- `PRODUCT.md` — `Core Product Intent / Domain Build`, `Product Terms`

`odd_world_model` SHALL publish bounded domain artifacts as the durable semantic
publication units of local truth, with enough contained identity, version,
object, relation, and evidence structure for later reference, reuse, and
composition.

### REQ-ODD-WORLD-MODEL-BUILD-CAP-004 — Composed World-Model Construction

**Carries**:
- `WORLD_MODEL_METHOD.md` — `Constitutional Intents`, `Method Units`, `Composition Law`
- `INTENT.md` — `Outcomes`
- `PRODUCT.md` — `Core Product Intent / World-Model Composition`, `Product Terms`

`odd_world_model` SHALL compose higher-order world models by referencing and
stitching versioned published domain artifacts rather than flattening them into
one mutable central representation.

### REQ-ODD-WORLD-MODEL-BUILD-CAP-005 — Current Query And Traversal Capability

**Carries**:
- `WORLD_MODEL_METHOD.md` — `Constitutional Intents`, `Method Flow / Serve Or Query (Optional)`
- `INTENT.md` — `Outcomes`, `Constraints`
- `PRODUCT.md` — `Current Delivery Pillars`, `World-Model Query And Traversal`

`odd_world_model` SHALL support query and traversal over published domain artifacts
and composed world models as a current delivery capability, even though that
capability is not part of the product's constitutional core.

### REQ-ODD-WORLD-MODEL-BUILD-CAP-006 — Iterative Saturation For Publication

**Carries**:
- `WORLD_MODEL_METHOD.md` — `Saturation Law`
- `INTENT.md` — `Outcomes`, `Constraints`
- `PRODUCT.md` — `Product Vision`, `Product End State`

`odd_world_model` SHALL support iterative work over a bounded source-object set
until the resulting attribute ledger and object cuts are sufficiently
saturated for publication, with remaining gaps carried as explicit ambiguity
rather than silent omission.

### REQ-ODD-WORLD-MODEL-BUILD-CAP-007 — Published Source Domain Construction

**Carries**:
- `WORLD_MODEL_METHOD.md` — `Method Flow`, `Publication Law`
- `INTENT.md` — `Outcomes`, `Constraints`
- `PRODUCT.md` — `Core Product Intent / Domain Build`, `Product Terms`

Where source structure must remain explorable for lineage and provenance,
`odd_world_model` SHALL publish a bounded source domain over the deconstructed
source objects before or alongside the downstream interpreted world-model
domain.
