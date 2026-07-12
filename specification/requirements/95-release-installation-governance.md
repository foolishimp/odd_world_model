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

### REQ-ODD-WORLD-MODEL-RELEASE-005 — Exact Dependency Resolution Evidence

**Carries**:
- `SPEC_METHOD.md` — `Recursive Product Taxonomy`
- `PRODUCT.md` — `Lifecycle And Runtime Boundary`, `Release And Install Boundary`

Every concrete build, proof, release, and install SHALL record the exact
GTL/ABG and GLC package, version, source or tag, manifest, and digest identities
it resolved, together with the compatibility declaration used to admit that
combination. A governed development resolution SHALL be labelled as such and
SHALL NOT be presented as released-product evidence.

### REQ-ODD-WORLD-MODEL-RELEASE-006 — Immutable Release And Install Locks

**Carries**:
- `SPEC_METHOD.md` — `Recursive Product Taxonomy`
- `PRODUCT.md` — `Release And Install Boundary`

An immutable WM release cut or install SHALL resolve dependencies only from its
recorded lock and manifest. It SHALL NOT resolve from an ambient moving label,
mutable sibling source workspace, unversioned local link, or whichever package
happens to be available when proof is replayed.

### REQ-ODD-WORLD-MODEL-RELEASE-007 — Dependency Contract Availability

**Carries**:
- `PRODUCT.md` — `Consumed Contract Boundary`, `Release And Install Boundary`

A release or installed proof SHALL be able to recover the authoritative
published contracts for its exact dependency resolution. When a required
contract is not installed as an addressable asset, the manifest SHALL preserve
its immutable source or tag locator and digest, and the limitation SHALL remain
an explicit gap. Mutable source-path inference SHALL NOT substitute for the
contract.

### REQ-ODD-WORLD-MODEL-RELEASE-008 — Dependency Compatibility Proof

**Carries**:
- `PRODUCT.md` — `Lifecycle And Runtime Boundary`, `Release And Install Boundary`

Release qualification SHALL prove that the exact GTL/ABG and GLC identities
used by WM satisfy their declared compatibility constraints and preserve the
GTL/ABG runtime, GLC lifecycle, and WM domain-meaning ownership boundary. A
floating product dependency reference SHALL NOT be accepted as release proof.
