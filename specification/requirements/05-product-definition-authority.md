# Product Definition Authority Requirements

**Family**: REQ-ODD-WORLD-MODEL-PRODUCT-*
**Status**: Active
**Category**: Governance

### REQ-ODD-WORLD-MODEL-PRODUCT-001 — Specification-Owned Product Definition

**Carries**:
- `SPEC_METHOD.md` — `Specification Surface Rule`
- `GOALS.md` — `Current Goals`
- `PRODUCT.md` — `Product Definition Boundary`

`odd_world_model` SHALL treat `specification/` as the constitutional source of
product-definition authority. Design, realization tenants, generated views, historical
prototypes, and runtime projections SHALL remain downstream of the live
specification surface.

### REQ-ODD-WORLD-MODEL-PRODUCT-002 — Technology-Independent Product Definition

**Carries**:
- `SPEC_METHOD.md` — `Requirement Categories`, `Design Rule`
- `INTENT.md` — `Purpose`, `Constraints`
- `PRODUCT.md` — `Product Definition Boundary`

The `odd_world_model` product definition SHALL be independent of programming
language, package manager, test runner, tenant implementation, and historical
prototype structure. Those choices MAY be selected by design or realization,
but they SHALL NOT define the product `WHAT`.

### REQ-ODD-WORLD-MODEL-PRODUCT-003 — Product Chain Sufficiency

**Carries**:
- `WORLD_MODEL_METHOD.md` — `Method Flow`
- `PRODUCT.md` — `Product Definition Boundary`, `Single Truth Surface`, `Current Product Definition`

The live product definition SHALL be sufficient for downstream design to derive
the product chain from source observation through traced evidence, assured
claims, attribute ledger, immutable object cuts, published domain artifacts,
composed world models, and query or proof projections.

### REQ-ODD-WORLD-MODEL-PRODUCT-004 — Published Semantic Layer As Single Truth Surface

**Carries**:
- `WORLD_MODEL_METHOD.md` — `Single Truth Surface`
- `PRODUCT.md` — `Single Truth Surface`

`odd_world_model` SHALL treat the published semantic layer as the product's
single world-model truth surface. Query planes, mapping reports, compiled
execution artifacts, generated views, epistemic overlays, retained source
corpora, and historical prototypes SHALL remain downstream, supporting, or
evidentiary surfaces rather than rival semantic truth.

### REQ-ODD-WORLD-MODEL-PRODUCT-005 — Realization Tenant Subordination

**Carries**:
- `SPEC_METHOD.md` — `Process Constitution`, `Specification Surface Rule`
- `PRODUCT.md` — `Product Definition Boundary`

Any realization tenant SHALL be a downstream implementation of the shared
product specification. A tenant MAY carry design and implementation choices,
but it SHALL NOT become a rival product definition or narrow the product to
the structure of one implementation line.

### REQ-ODD-WORLD-MODEL-PRODUCT-006 — Retained Example Boundaries

**Carries**:
- `SPEC_METHOD.md` — `Trace Closure And Anti-Drift Rule`
- `GOALS.md` — `Current Goals`
- `PRODUCT.md` — `Current Product Definition`

Retained examples and historical prototypes SHALL be used as proof corpora,
readback surfaces, and comparison evidence. They SHALL NOT define product
scope, product vocabulary, or product architecture unless their claims are
re-derived into the live specification.
