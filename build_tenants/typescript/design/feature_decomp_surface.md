> **Classification**: Superseded generated planning read model; retained as lineage only.

## Execution Plan

Read authority for this transform:

- `.ai-workspace/runtime/odd_sdlc/operator-runs/20260514T161025382Z_pid79255/worker_brief.json`
- `.ai-workspace/runtime/odd_sdlc/operator-runs/20260514T161025382Z_pid79255/worker_invocation_package.json`
- `.ai-workspace/runtime/odd_sdlc/operator-runs/20260514T161025382Z_pid79255/traversal_intent_package.json`
- package-referenced project authority under `.ai-workspace/context/`, `specification/`, and `build_tenants/typescript/design/`

Bounded steps:

1. Preserve the launch contract as `F_P.transform` evidence only.
2. Read project-owned product, intent, goals, requirements, and existing TypeScript design surfaces.
3. Derive a full-breadth `feature_decomp_surface` from the complete requirement trace set without narrowing to a feature slice.
4. Write only this tenant-local SDLC surface artifact at `build_tenants/typescript/design/feature_decomp_surface.md`.
5. Leave product source files, tests, framework result reports, ledgers, runtime events, evaluator projections, and closure carriers to the framework.

First materialization target: `build_tenants/typescript/design/feature_decomp_surface.md`.

Product materialization is not required for this edge.

## Accepted ADR Authority

This overlay read model must be interpreted with the accepted TypeScript tenant
ADRs:

- `build_tenants/typescript/design/adrs/ADR-001-typescript-gtl-abg-tech-stack.md`
- `build_tenants/typescript/design/adrs/ADR-002-odd-sdlc-build-component-inheritance.md`
- `build_tenants/typescript/design/adrs/ADR-003-reference-derived-design-carry-forward.md`
- `build_tenants/typescript/design/adrs/ADR-004-reuse-odd-sdlc-gap-tracking.md`
- `build_tenants/typescript/design/adrs/ADR-005-source-lineage-markov-object-carrier.md`

Feature and gap pressure remain owned by installed `odd_sdlc`; this surface is
a planning projection over that pressure. World-model product semantics remain
the source-lineage chain into coherent Markov-object cuts.

## Surface Identity

- kind: `feature_decomp_surface`
- graph function: `solution_architecture`
- edge: `derive_feature_decomp_surface`
- target asset type: `feature_decomp_surface`
- strategy: `full_breadth`
- feature scope: `odd_world_model`
- selected output root: `build_tenants/typescript`
- tenant-local artifact path: `design/feature_decomp_surface.md`

This surface decomposes the current `odd_world_model` product architecture into
feature obligations for the TypeScript tenant. It does not define product
`WHAT`; `specification/` remains authoritative. It also does not make
`odd_sdlc`, GTL, ABG, the TypeScript tenant, or any retained Python reference a
rival semantic truth surface.

The governing product chain is:

```text
source observation
-> traced evidence
-> assured claim
-> attribute ledger
-> immutable object cut
-> published domain artifact
-> composed world model
-> query/proof projection
```

## Feature Decomposition

| Feature | Responsibility | Primary dependencies | Primary design owners |
|---|---|---|---|
| FD-001 Product Authority Boundary | Keep `specification/` as product authority, preserve technology independence, subordinate tenants and retained examples, and treat the published semantic layer as the single truth surface. | none | `domain/`, `sdlc/`, `release/` |
| FD-002 ODD Carrier And Build Governance | Publish typed assets, graph functions, jobs, a GTL module, and a function catalog while importing installed `odd_sdlc` evidence only as build governance. | FD-001 | `domain/`, `gtl/`, `sdlc/`, `cli/` |
| FD-003 Source Observation And Adapter Decomposition | Admit source-system code, documents, schemas, records, events, APIs, and metadata as bounded source observations through categorical adapters. | FD-002 | `adapters/`, `build_line/` |
| FD-004 Trace And Assurance Admission | Convert source observations into traced evidence and assurance claims before semantic admission. | FD-003 | `build_line/`, `proof/` |
| FD-005 Attribute Ledger And Object Cuts | Materialize accepted claims into an append-only attribute ledger and project immutable Markov object cuts with explicit boundaries, sourceability, and supersession. | FD-004 | `world_model/`, `build_line/` |
| FD-006 Published Domain Artifact Construction | Publish bounded domain artifacts with object cuts, fragments, treatment surfaces, temporal references, covariance edges, adjoint mappings, and source evidence refs. | FD-005 | `world_model/`, `gtl/` |
| FD-007 Reference-Preserving Composition And Mesh | Compose higher-order world models and federated mesh nodes by reference to versioned published artifacts while preserving local authority, version, boundary meaning, and declared loss. | FD-006 | `world_model/`, `world_model/composition.*` |
| FD-008 Governed Mapping Record And Report | Produce durable mapping records and subordinate human mapping reports over published domains with semantic categories, confidence, reasoning, ambiguity, and unassigned-surface disclosure. | FD-007 | `mapping/`, `query/`, `proof/` |
| FD-009 Topology-Aware Mapping And Concept Synthesis | Support topology-aware matching, constructive-history weighting, higher-order concept synthesis, and hierarchical or intersectional boundary candidates without promoting inferred candidates into domain truth. | FD-008 | `mapping/`, `world_model/`, `proof/` |
| FD-010 Query And Traversal Projection | Expose current query, traversal, lineage, mapping, and proof views as downstream projections over published artifacts, composed models, and constructive history. | FD-007 | `query/`, `proof/` |
| FD-011 Verification, Recoverability, And Saturation | Provide review surfaces, reverse recoverability, steel-thread proof, prototype readback governance, realization-independent product proof, and iterative saturation with explicit gaps. | FD-004, FD-005, FD-006, FD-010 | `proof/`, `test_env/`, `sdlc/` |
| FD-012 Release And Installed Builder Product Proof | Prove release/install boundaries, installed product provenance, project-local configuration, and source-workspace isolation for installed builder projects. | FD-002, FD-011 | `release/`, `sdlc/`, `proof/` |

## Dependency Spine

```text
FD-001 Product Authority Boundary
-> FD-002 ODD Carrier And Build Governance
-> FD-003 Source Observation And Adapter Decomposition
-> FD-004 Trace And Assurance Admission
-> FD-005 Attribute Ledger And Object Cuts
-> FD-006 Published Domain Artifact Construction
-> FD-007 Reference-Preserving Composition And Mesh
-> FD-008 Governed Mapping Record And Report
-> FD-009 Topology-Aware Mapping And Concept Synthesis
-> FD-010 Query And Traversal Projection
-> FD-011 Verification, Recoverability, And Saturation
-> FD-012 Release And Installed Builder Product Proof
```

`FD-010` may run as soon as `FD-007` has published artifacts and composed
models to project. `FD-008` and `FD-009` are downstream of published semantic
truth. They cannot create competing domain truth even when they synthesize
higher-order concepts or boundary candidates.

## Feature Detail

### FD-001 Product Authority Boundary

The system must preserve the current constitutional boundary:

- `specification/` owns product definition.
- product `WHAT` remains independent of TypeScript, package tooling, test
  runner choice, retained Python structure, and installed substrate mechanics.
- the published semantic layer is the single world-model truth surface.
- query planes, mapping reports, generated views, epistemic overlays, retained
  corpora, historical prototypes, and runtime projections remain evidentiary or
  downstream surfaces.
- retained examples are proof corpora and comparison evidence only.

This feature keeps the rest of the decomposition from drifting into
implementation-owned product law.

### FD-002 ODD Carrier And Build Governance

The TypeScript tenant must expose the live constructive line through ODD
carrier assets:

- typed source, trace, assurance, ledger, object-cut, artifact, composition,
  mapping, query, proof, and build-evidence assets
- public graph functions, including `odd_world_model.rebuild_world_model_core`
- semantic job bindings over public graph functions
- one GTL module publication surface
- a function catalog with typed input/output boundaries
- app wrapper commands that delegate traversal to ABG

Installed `odd_sdlc` may provide build-governance evidence, execution-contract
interpretation, gap/start projections, lineage registers, and release proof
patterns. It must not own world-model semantics, the published semantic layer,
or a replacement traversal runtime.

### FD-003 Source Observation And Adapter Decomposition

Source adapters convert source-family evidence into reviewable source
observations and bounded source-domain candidates. Adapter inputs may include
documents, Markdown, PDFs, code, schemas, FpML, APIs, event streams, records,
and metadata. Adapter output is constructor evidence, not durable semantic
truth.

The feature must keep source systems sovereign for operational truth while
making their functional surfaces inspectable.

### FD-004 Trace And Assurance Admission

The build line must expose trace and assurance stages before a claim enters the
semantic substrate. A traced observation links source evidence to a claim
candidate. An assurance claim records review, basis, verdict, and ambiguity.

This feature creates the challenge point between extraction and publication so
world-model attributes are not silently accepted from raw records or adapter
output.

### FD-005 Attribute Ledger And Object Cuts

Accepted attribute claims enter an append-only attribute ledger. Published
Markov object cuts are immutable projections over stable object identity, not
mutable record state. Each object cut must carry identity, boundary, state,
transition, evidence, adjacency, ingress, egress, observable surfaces,
internal/external boundary claims, sourceability, and supersession.

Temporal reference semantics are represented as governed temporal artifacts
when value lists, code sets, classifications, or reference meanings vary over
time.

### FD-006 Published Domain Artifact Construction

Published domain artifacts are the durable local semantic publication units.
They contain or reference bounded fragments, object cuts, treatment surfaces,
covariance edges, adjoint mappings, temporal reference artifacts, source
evidence, and version identity.

This feature is the first point where local domain truth becomes reusable by
composition, mapping, query, and proof.

### FD-007 Reference-Preserving Composition And Mesh

Composition builds higher-order world models by referencing versioned published
domain artifacts. The mesh admits at least published domain artifacts, common
models, and composed world models as distinct node roles.

Mesh links preserve upstream identity before copied projections. Every durable
node or link discloses version, publication cut, local authority, bounded
context, declared ambiguity, declared loss, and supersession.

### FD-008 Governed Mapping Record And Report

Mapping remains downstream of published domains and composed world models.
The durable mapping truth for a retained mapping slice is the published mapping
record, not the review report.

Mapping records capture object, attribute, relation, treatment, lineage,
confidence, reasoning, evidence basis, ambiguity, declared loss, and unassigned
source or target surfaces. Human mapping reports are readable projections over
that record.

Mapping semantics must distinguish exact identity, constrained equivalence,
treatment projection, derived mapping, aggregation or rollup, split mapping,
reference alignment, lossy mapping, and incompatible or no mapping.

### FD-009 Topology-Aware Mapping And Concept Synthesis

The mapping line must consider topology and constructive history before lexical
similarity. Matching can use object boundary, adjacency, composition,
treatment, covariance, adjoint support, evidence, and prior graph movement.

Repeated correspondence can synthesize higher-order concepts and candidate
Markov-boundary structures. Those candidates may express hierarchical
containment or intersectional overlap, but they remain downstream mapping
artifacts until separately ratified as published world-model truth.

### FD-010 Query And Traversal Projection

Query and traversal expose current views over the published semantic layer,
composed world models, mapping records, proof evidence, and constructive
history. They answer mapping, lineage, treatment, and explainability questions
without becoming semantic authority.

The first implementation may be filesystem-first. Any later query or serving
plane remains a downstream projection unless separately repriced by design.

### FD-011 Verification, Recoverability, And Saturation

Proof must cover the ODD carrier and the semantic chain. Required proof
surfaces include traced observations, assurance records, attribute-ledger
entries, object cuts, published artifacts, query/proof projections, reverse
recoverability, conventional projections, covariant projections, and scenario
archives.

Reverse recoverability must be able to travel from an accepted downstream
claim back through object cut, attribute ledger, assurance basis, traced source
observation, and originating source evidence.

The first steel-thread proof should use the generic TypeScript scenario
sandbox pattern and retained source corpora as proof evidence, not as
architecture authority. Iterative saturation deepens a bounded source-object
set until publication is sufficient, with remaining gaps explicit.

### FD-012 Release And Installed Builder Product Proof

The product must be releasable as an installable builder product. Installed
builder projects must preserve product identity, release provenance, installed
assets, method guidance, project-local source configuration, publication lane,
and evidence that outputs were produced through installed product assets.

Shared installer mechanics may be reused, but they cannot collapse
`odd_world_model` product identity or leak mutable source-workspace structure
into installed product authority.

## Existing TypeScript Design Alignment

| Existing design surface | Alignment in this surface |
|---|---|
| `20-feature-decomposition.md` | Preserves the layer order: carrier and governance, semantic build line, composition/mapping/query, verification/saturation/release. |
| `30-world-model-odd-design.md` | Preserves component ownership: C-CARRIER, C-SDLC-GOVERNANCE, C-ADAPTER, C-BUILD, C-WORLD, C-COMPOSE, C-MAPPING, C-QUERY, C-PROOF, C-RELEASE. |
| `40-module-boundaries.md` | Preserves the irreducible carrier set and module boundary table. |
| `50-test-and-proof-design.md` | Preserves proof lanes A through D and requirement-family allocation. |
| `55-scenario-sandbox-proof-structure.md` | Preserves the generic scenario sandbox as proof infrastructure and treats `.TS` comparison cuts as projections. |
| `ADR-001` | Preserves TypeScript, GTL module, public graph function, job, and ABG traversal ownership decisions. |
| `ADR-002` | Preserves installed `odd_sdlc` as build component rather than product identity. |
| `ADR-003` | Preserves useful Python reference structure while demoting Python implementation details. |
| `ADR-004` | Reuses installed `odd_sdlc` feature-gap and build-pressure tracking instead of creating a parallel world-model gap registry. |
| `ADR-005` | Makes source lineage into coherent Markov-object cuts the product-owned semantic carrier over the reused build substrate. |

## Requirement Coverage Allocation

| Requirement family | Covering features |
|---|---|
| `REQ-ODD-WORLD-MODEL-PRODUCT-*` | FD-001, FD-002, FD-006, FD-007, FD-010, FD-012 |
| `REQ-ODD-WORLD-MODEL-WORLD-OBJECT-*` | FD-004, FD-005, FD-006, FD-008, FD-009, FD-011 |
| `REQ-ODD-WORLD-MODEL-BUILD-CAP-*` | FD-003, FD-004, FD-005, FD-006, FD-007, FD-010, FD-011 |
| `REQ-ODD-WORLD-MODEL-BUILD-CONSTRAINT-*` | FD-002, FD-003, FD-005, FD-006, FD-007, FD-010 |
| `REQ-ODD-WORLD-MODEL-BUILD-VERIFY-*` | FD-004, FD-005, FD-006, FD-011, FD-012 |
| `REQ-ODD-WORLD-MODEL-ODD-CARRIER-*` | FD-002, FD-010, FD-011 |
| `REQ-ODD-WORLD-MODEL-MAPPING-CAP-*` | FD-008, FD-009, FD-010, FD-011 |
| `REQ-ODD-WORLD-MODEL-MAPPING-CONSTRAINT-*` | FD-008, FD-009, FD-010 |
| `REQ-ODD-WORLD-MODEL-MESH-CAP-*` | FD-007, FD-010 |
| `REQ-ODD-WORLD-MODEL-MESH-CONSTRAINT-*` | FD-007, FD-008, FD-010 |
| `REQ-ODD-WORLD-MODEL-RELEASE-*` | FD-002, FD-012 |

## Requirement Trace Register

- `requirement:odd_world_model.stage_05_product_definition_authority.req_odd_world_model_product_001`
- `requirement:odd_world_model.stage_05_product_definition_authority.req_odd_world_model_product_002`
- `requirement:odd_world_model.stage_05_product_definition_authority.req_odd_world_model_product_003`
- `requirement:odd_world_model.stage_05_product_definition_authority.req_odd_world_model_product_004`
- `requirement:odd_world_model.stage_05_product_definition_authority.req_odd_world_model_product_005`
- `requirement:odd_world_model.stage_05_product_definition_authority.req_odd_world_model_product_006`
- `requirement:odd_world_model.stage_10_world_model_object_representation.req_odd_world_model_world_object_001`
- `requirement:odd_world_model.stage_10_world_model_object_representation.req_odd_world_model_world_object_002`
- `requirement:odd_world_model.stage_10_world_model_object_representation.req_odd_world_model_world_object_003`
- `requirement:odd_world_model.stage_10_world_model_object_representation.req_odd_world_model_world_object_004`
- `requirement:odd_world_model.stage_10_world_model_object_representation.req_odd_world_model_world_object_005`
- `requirement:odd_world_model.stage_10_world_model_object_representation.req_odd_world_model_world_object_006`
- `requirement:odd_world_model.stage_10_world_model_object_representation.req_odd_world_model_world_object_007`
- `requirement:odd_world_model.stage_10_world_model_object_representation.req_odd_world_model_world_object_008`
- `requirement:odd_world_model.stage_10_world_model_object_representation.req_odd_world_model_world_object_009`
- `requirement:odd_world_model.stage_10_world_model_object_representation.req_odd_world_model_world_object_010`
- `requirement:odd_world_model.stage_10_world_model_object_representation.req_odd_world_model_world_object_011`
- `requirement:odd_world_model.stage_10_world_model_object_representation.req_odd_world_model_world_object_012`
- `requirement:odd_world_model.stage_20_domain_build_and_composition_capability.req_odd_world_model_build_cap_001`
- `requirement:odd_world_model.stage_20_domain_build_and_composition_capability.req_odd_world_model_build_cap_002`
- `requirement:odd_world_model.stage_20_domain_build_and_composition_capability.req_odd_world_model_build_cap_003`
- `requirement:odd_world_model.stage_20_domain_build_and_composition_capability.req_odd_world_model_build_cap_004`
- `requirement:odd_world_model.stage_20_domain_build_and_composition_capability.req_odd_world_model_build_cap_005`
- `requirement:odd_world_model.stage_20_domain_build_and_composition_capability.req_odd_world_model_build_cap_006`
- `requirement:odd_world_model.stage_20_domain_build_and_composition_capability.req_odd_world_model_build_cap_007`
- `requirement:odd_world_model.stage_30_domain_build_and_composition_constraints.req_odd_world_model_build_constraint_001`
- `requirement:odd_world_model.stage_30_domain_build_and_composition_constraints.req_odd_world_model_build_constraint_002`
- `requirement:odd_world_model.stage_30_domain_build_and_composition_constraints.req_odd_world_model_build_constraint_003`
- `requirement:odd_world_model.stage_30_domain_build_and_composition_constraints.req_odd_world_model_build_constraint_004`
- `requirement:odd_world_model.stage_30_domain_build_and_composition_constraints.req_odd_world_model_build_constraint_005`
- `requirement:odd_world_model.stage_30_domain_build_and_composition_constraints.req_odd_world_model_build_constraint_006`
- `requirement:odd_world_model.stage_40_domain_build_verification.req_odd_world_model_build_verify_001`
- `requirement:odd_world_model.stage_40_domain_build_verification.req_odd_world_model_build_verify_002`
- `requirement:odd_world_model.stage_40_domain_build_verification.req_odd_world_model_build_verify_003`
- `requirement:odd_world_model.stage_40_domain_build_verification.req_odd_world_model_build_verify_004`
- `requirement:odd_world_model.stage_40_domain_build_verification.req_odd_world_model_build_verify_005`
- `requirement:odd_world_model.stage_40_domain_build_verification.req_odd_world_model_build_verify_006`
- `requirement:odd_world_model.stage_50_odd_method_gtl_carrier.req_odd_world_model_odd_carrier_001`
- `requirement:odd_world_model.stage_50_odd_method_gtl_carrier.req_odd_world_model_odd_carrier_002`
- `requirement:odd_world_model.stage_50_odd_method_gtl_carrier.req_odd_world_model_odd_carrier_003`
- `requirement:odd_world_model.stage_50_odd_method_gtl_carrier.req_odd_world_model_odd_carrier_004`
- `requirement:odd_world_model.stage_50_odd_method_gtl_carrier.req_odd_world_model_odd_carrier_005`
- `requirement:odd_world_model.stage_50_odd_method_gtl_carrier.req_odd_world_model_odd_carrier_006`
- `requirement:odd_world_model.stage_60_multi_domain_mapping_capability.req_odd_world_model_mapping_cap_001`
- `requirement:odd_world_model.stage_60_multi_domain_mapping_capability.req_odd_world_model_mapping_cap_002`
- `requirement:odd_world_model.stage_60_multi_domain_mapping_capability.req_odd_world_model_mapping_cap_003`
- `requirement:odd_world_model.stage_60_multi_domain_mapping_capability.req_odd_world_model_mapping_cap_004`
- `requirement:odd_world_model.stage_60_multi_domain_mapping_capability.req_odd_world_model_mapping_cap_005`
- `requirement:odd_world_model.stage_60_multi_domain_mapping_capability.req_odd_world_model_mapping_cap_006`
- `requirement:odd_world_model.stage_60_multi_domain_mapping_capability.req_odd_world_model_mapping_cap_007`
- `requirement:odd_world_model.stage_60_multi_domain_mapping_capability.req_odd_world_model_mapping_cap_008`
- `requirement:odd_world_model.stage_60_multi_domain_mapping_capability.req_odd_world_model_mapping_cap_009`
- `requirement:odd_world_model.stage_60_multi_domain_mapping_capability.req_odd_world_model_mapping_cap_010`
- `requirement:odd_world_model.stage_70_multi_domain_mapping_constraints.req_odd_world_model_mapping_constraint_001`
- `requirement:odd_world_model.stage_70_multi_domain_mapping_constraints.req_odd_world_model_mapping_constraint_002`
- `requirement:odd_world_model.stage_70_multi_domain_mapping_constraints.req_odd_world_model_mapping_constraint_003`
- `requirement:odd_world_model.stage_70_multi_domain_mapping_constraints.req_odd_world_model_mapping_constraint_004`
- `requirement:odd_world_model.stage_70_multi_domain_mapping_constraints.req_odd_world_model_mapping_constraint_005`
- `requirement:odd_world_model.stage_70_multi_domain_mapping_constraints.req_odd_world_model_mapping_constraint_006`
- `requirement:odd_world_model.stage_70_multi_domain_mapping_constraints.req_odd_world_model_mapping_constraint_007`
- `requirement:odd_world_model.stage_70_multi_domain_mapping_constraints.req_odd_world_model_mapping_constraint_008`
- `requirement:odd_world_model.stage_80_world_model_mesh_capability.req_odd_world_model_mesh_cap_001`
- `requirement:odd_world_model.stage_80_world_model_mesh_capability.req_odd_world_model_mesh_cap_002`
- `requirement:odd_world_model.stage_80_world_model_mesh_capability.req_odd_world_model_mesh_cap_003`
- `requirement:odd_world_model.stage_80_world_model_mesh_capability.req_odd_world_model_mesh_cap_004`
- `requirement:odd_world_model.stage_80_world_model_mesh_capability.req_odd_world_model_mesh_cap_005`
- `requirement:odd_world_model.stage_80_world_model_mesh_capability.req_odd_world_model_mesh_cap_006`
- `requirement:odd_world_model.stage_80_world_model_mesh_capability.req_odd_world_model_mesh_cap_007`
- `requirement:odd_world_model.stage_90_world_model_mesh_constraints.req_odd_world_model_mesh_constraint_001`
- `requirement:odd_world_model.stage_90_world_model_mesh_constraints.req_odd_world_model_mesh_constraint_002`
- `requirement:odd_world_model.stage_90_world_model_mesh_constraints.req_odd_world_model_mesh_constraint_003`
- `requirement:odd_world_model.stage_90_world_model_mesh_constraints.req_odd_world_model_mesh_constraint_004`
- `requirement:odd_world_model.stage_90_world_model_mesh_constraints.req_odd_world_model_mesh_constraint_005`
- `requirement:odd_world_model.stage_90_world_model_mesh_constraints.req_odd_world_model_mesh_constraint_006`
- `requirement:odd_world_model.stage_90_world_model_mesh_constraints.req_odd_world_model_mesh_constraint_007`
- `requirement:odd_world_model.stage_95_release_installation_governance.req_odd_world_model_release_001`
- `requirement:odd_world_model.stage_95_release_installation_governance.req_odd_world_model_release_002`
- `requirement:odd_world_model.stage_95_release_installation_governance.req_odd_world_model_release_003`
- `requirement:odd_world_model.stage_95_release_installation_governance.req_odd_world_model_release_004`

## Transform Boundary Notes

- No product source file is required or written for this edge.
- No product test file is required or written for this edge.
- The framework result report is intentionally not written by this worker.
- No ledgers, runtime events, evaluator projections, or closure carriers are
  written by this worker.
- This design surface is a tenant-local SDLC artifact, not a published
  product semantic artifact.
- The tenant-local SDLC surface artifact path is
  `design/feature_decomp_surface.md`; it is not a product materialized file
  and must not be listed in `materializedFiles`.
- Handoff manifest content was not needed because the launch packages provided
  direct authority refs for the project-owned surfaces used here.
