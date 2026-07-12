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
typed mesh links, bounded mesh cuts, context basis/projection or query/proof
projections, and attributed outputs.

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

### REQ-ODD-WORLD-MODEL-PRODUCT-007 — GLC Downstream Specialization

**Carries**:
- `odd_glc specification/PRODUCT.md` — `Downstream Program Contract`
- `PRODUCT.md` — `Lifecycle And Runtime Boundary`

`odd_world_model` SHALL be defined as a world-model domain specialization of
the generic lifecycle meaning published by `odd_glc`. WM SHALL contribute
domain assets, schemas, policies, evidence expectations, and semantic proof
interpretation without treating GLC as the source of world-model meaning.

### REQ-ODD-WORLD-MODEL-PRODUCT-008 — Three-Layer Ownership Boundary

**Carries**:
- `odd_glc specification/PRODUCT.md` — `Constitutional Position`
- `PRODUCT.md` — `Lifecycle And Runtime Boundary`

The product definition SHALL preserve one ownership boundary: GTL owns
graph-native declaration law, ABG owns runtime and admitted truth, GLC owns
domain-agnostic lifecycle meaning, and WM owns world-model domain meaning. WM
SHALL NOT publish a rival runtime, event envelope, traversal or retry controller,
requirement ledger, closure store, or copy of generic lifecycle law.

### REQ-ODD-WORLD-MODEL-PRODUCT-009 — Floating Product Dependency Law

**Carries**:
- `PRODUCT.md` — `Lifecycle And Runtime Boundary`
- `SPEC_METHOD.md` — `Recursive Product Taxonomy`

WM product law SHALL NOT pin an exact ABIogenesis or odd_glc version. Mutable
development MAY resolve governed development or released dependency products
through the published contracts and SHALL honor the compatibility declared by
that resolution. Every build, proof, release, and install SHALL record its exact
resolved identities; those evidence identities SHALL NOT become timeless
product-definition authority.

### REQ-ODD-WORLD-MODEL-PRODUCT-010 — Missing Upstream Contract Honesty

**Carries**:
- `odd_glc specification/PRODUCT.md` — `GTL/ABG Consumption Rule`
- `PRODUCT.md` — `Consumed Contract Boundary`

When a required substrate or GLC capability is missing, partial, test-only,
unpublished, or unavailable through the selected dependency products, WM SHALL
defer, block, or open a triaged owner ticket. It SHALL NOT compensate by
inventing local ABIogenesis or GLC authority.
