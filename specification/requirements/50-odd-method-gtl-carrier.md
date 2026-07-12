# ODD Method GTL Carrier Requirements

**Family**: REQ-ODD-WORLD-MODEL-ODD-CARRIER-*
**Status**: Active
**Category**: Capability

### REQ-ODD-WORLD-MODEL-ODD-CARRIER-001 — Typed Domain Assets And Nodes

**Carries**:
- `ODD_METHOD.md` — `Core Law / 1. Typed Assets And Nodes Are Explicit`
- `PRODUCT.md` — `Product Terms`, `Current Product Definition`

`odd_world_model` SHALL publish explicit typed domain asset and node surfaces for
its retained build line rather than leaving the active domain-build carrier
implicit inside realization-local orchestration only.

### REQ-ODD-WORLD-MODEL-ODD-CARRIER-002 — Graph Functions As Primary Carrier

**Carries**:
- `ODD_METHOD.md` — `Core Law / 2. Graph Functions Are The Primary Constructive Carrier`
- `INTENT.md` — `Constraints`
- `PRODUCT.md` — `Product Position`, `Current Product Definition`

`odd_world_model` SHALL realize its retained constructive build line through named
graph functions rather than through bespoke imperative builder loops as the
primary carrier. A published `GraphFunction` SHALL be the sole named callable
catalog contribution for constructive work; internal vectors, workers, plugins,
and service methods SHALL remain subordinate implementation surfaces.

### REQ-ODD-WORLD-MODEL-ODD-CARRIER-003 — Explicit Function Catalog And GTL Module

**Carries**:
- `ODD_METHOD.md` — `Core Law / 3. The Function Catalog Is Published`, `Core Law / 4. The GTL Module Is The Operative Publication Surface`
- `PRODUCT.md` — `Current Product Definition`

`odd_world_model` SHALL publish a machine-readable function catalog together with a
GTL module that exposes the retained public graph-function carriers, their
typed input/output boundaries, and their outer callable contracts.

### REQ-ODD-WORLD-MODEL-ODD-CARRIER-004 — Cumulative Environment And Traversal Boundaries

**Carries**:
- `ODD_METHOD.md` — `Core Law / 8. Cumulative Environment Law Is Mandatory`
- `PRODUCT.md` — `Product Position`, `Current Product Definition`

`odd_world_model` SHALL define retained graph functions using cumulative carried
environment contracts and explicit traversal-boundary publication rather than
simple output-piped composition or hidden inner-vector jobs.

### REQ-ODD-WORLD-MODEL-ODD-CARRIER-005 — Governed Graph Carrier For The Live Line

**Carries**:
- `ODD_METHOD.md` — `What An ODD Product Is`, `Invocation Rule`
- `PRODUCT.md` — `Product Definition Boundary`, `Current Product Definition`

`odd_world_model` SHALL define its live constructive carrier as explicit typed
assets, published graph functions, function catalog, graph module, and
projection surfaces. A realization tenant may implement that carrier, but the
carrier contract SHALL remain derivable from product requirements rather than
from one tenant's historical implementation structure.

### REQ-ODD-WORLD-MODEL-ODD-CARRIER-006 — Query As Projection Over Constructive History

**Carries**:
- `ODD_METHOD.md` — `Core Law / 5. Current State Is A Projection Over Constructive History`
- `PRODUCT.md` — `Current Delivery Pillars`, `World-Model Query And Traversal`

`odd_world_model` SHALL expose current asset and query views as projections over the
constructive history of the retained build line rather than as replacement
runtime truth.

### REQ-ODD-WORLD-MODEL-ODD-CARRIER-007 — Public Graph-Function Invocation

**Carries**:
- `ODD_METHOD.md` — `Invocation Rule`
- `ABIogenesis specification/PRODUCT.md` — `Canonical GTL Topology Anchors`
- `PRODUCT.md` — `Consumed Contract Boundary`

Every public constructive invocation SHALL select a published graph-function
handle through the selected substrate's public catalog and operator contract.
Jobs SHALL target graph-function contracts. Bare graph vectors, nodes, workers,
plugins, one-off scripts, and realization-local service methods SHALL NOT become
rival public work entrypoints.

For the current rc.3 grounding, the concrete published resolution surface is
the exact workspace binding's declared `runtimeRegistryStartup` catalog used by
`start graph_function:<published_handle>`. This requirement does not assume the
later standalone catalog product, graph shell, catalog-operation family, or
broad public-consumption surface that rc.3 explicitly excludes.

### REQ-ODD-WORLD-MODEL-ODD-CARRIER-008 — Selected-Substrate Program Conformance

**Carries**:
- `ABIogenesis specification/PRODUCT.md` — `GTL Contract-Law API Reload Anchor`
- `PRODUCT.md` — `Consumed Contract Boundary`

Before a GTL program is accepted for admitted execution or conformance proof,
`odd_world_model` SHALL check it through the selected substrate's published
program-conformance contract and operator binding. On the current published
contract that operator binding is `typecheck-gtl-program`. Diagnostic IDs,
repair classes, and admissible-repair sets SHALL be resolved from the exact
selected contract rather than copied into WM authority.

### REQ-ODD-WORLD-MODEL-ODD-CARRIER-009 — Canonical Runtime Event Contract

**Carries**:
- `ABIogenesis REQ-R-ABG3-EVENTS-029` — published runtime event-kind census
- `PRODUCT.md` — `Lifecycle And Runtime Boundary`, `Consumed Contract Boundary`

Any runtime events produced while executing the WM carrier SHALL conform
exactly to the selected substrate's published runtime event-kind census and
canonical envelope: no missing required kinds, undeclared extra kinds, or rival
envelope. Conformance evidence SHALL identify the exact published roster it
checked.

### REQ-ODD-WORLD-MODEL-ODD-CARRIER-010 — Governed Plugin Seams

**Carries**:
- `ABIogenesis specification/PRODUCT.md` — `Ontology And Epistemology`
- `PRODUCT.md` — `Semantic Construction And Admission Boundary`

WM transform, evaluation, or consequence plugins SHALL be selected through the
substrate's declared catalog and capability policy. Plugins MAY propose
candidates and evidence through the governed transform, evaluation, and
consequence seams. They SHALL NOT write runtime events or ledgers directly,
dispatch workers independently, or bypass ABG admission.

### REQ-ODD-WORLD-MODEL-ODD-CARRIER-011 — Published Contract Shape Authority

**Carries**:
- `ABIogenesis specification/PRODUCT.md` — `Ontology And Epistemology / published contract shape`
- `PRODUCT.md` — `Consumed Contract Boundary`

Wire and serialization shape SHALL be checked against the exact typed contract
authority published by the selected substrate, whether exposed through package
exports or a later addressable contract catalog. Source paths, inferred runtime
shape, tests, and contracts from a different dependency resolution SHALL NOT be
treated as authority. A missing addressable contract SHALL remain an explicit
gap rather than be reconstructed locally.

### REQ-ODD-WORLD-MODEL-ODD-CARRIER-012 — GLC Downstream Carrier Boundary

**Carries**:
- `odd_glc specification/PRODUCT.md` — `Downstream Program Contract`, `Constitutional Position`
- `PRODUCT.md` — `Lifecycle And Runtime Boundary`

The WM GTL module SHALL contribute world-model domain assets, schemas, policies,
evidence expectations, and semantic proof interpretation through GLC's
downstream-program boundary. GLC declarations, policy, and read interpretation
SHALL remain overlays over GTL/ABG truth; WM SHALL NOT introduce a standalone
GLC runtime, CLI, traversal path, or lifecycle ledger.
