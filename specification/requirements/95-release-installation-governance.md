# Release And Installation Governance Requirements

**Family**: REQ-ODD-WORLD-MODEL-RELEASE-*
**Status**: Active
**Category**: Governance

### REQ-ODD-WORLD-MODEL-RELEASE-001 — Installable Builder Product

**Carries**:
- `SPEC_METHOD.md` — `Recursive Product Taxonomy`
- `WORLD_MODEL_METHOD.md` — `Method Units / Builder Project`
- `PRODUCT.md` — `Release And Install Boundary`

`odd_world_model` SHALL be releasable as a builder product that can be installed
into a builder project without treating the mutable source workspace as the
installed product.

### REQ-ODD-WORLD-MODEL-RELEASE-002 — Installed Product Provenance

**Carries**:
- `SPEC_METHOD.md` — `Recursive Product Taxonomy`
- `PRODUCT.md` — `Release And Install Boundary`

An installed `odd_world_model` builder project SHALL carry product identity,
release provenance, installed product assets, required method and operating
guidance, and project-local source configuration sufficient to distinguish:

- the released product
- the install
- the mutable builder project
- the published artifacts produced by that builder project

### REQ-ODD-WORLD-MODEL-RELEASE-003 — Source-Workspace Structure Does Not Leak Into Installs

**Carries**:
- `SPEC_METHOD.md` — `Recursive Product Taxonomy`
- `PRODUCT.md` — `Release And Install Boundary`

An installed builder project SHALL not depend on mutable source-project
realization structure as its product authority. Source-project structure MAY
inform release construction, but installed operation SHALL proceed from
installed product assets, project-local source configuration, and the live
product specification carried into the release.

### REQ-ODD-WORLD-MODEL-RELEASE-004 — Installer Convergence Without Product Collapse

**Carries**:
- `SPEC_METHOD.md` — `Recursive Product Taxonomy`
- `PRODUCT.md` — `Release And Install Boundary`

Installer implementation may share substrate responsibilities with related
products, but shared installer mechanics SHALL NOT collapse product identity.
`odd_world_model` installs SHALL preserve product-local semantics, product
assets, provenance, and publication obligations even when installation logic is
factored through a shared installer line.
