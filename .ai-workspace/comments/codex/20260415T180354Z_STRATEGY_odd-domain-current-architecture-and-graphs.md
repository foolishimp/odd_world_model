# STRATEGY: odd_domain Current Architecture And Graphs

**Author**: codex
**Date**: 2026-04-15T18:03:54Z
**Addresses**: `build_tenants/python/code/odd_domain/gtl_module.py`, `build_tenants/python/code/odd_domain/app.py`, `build_tenants/python/code/odd_domain/workspace_assets.py`, `build_tenants/python/code/odd_domain/constructor.py`, `build_tenants/python/code/odd_domain/self_test.py`, `build_tenants/common/design/ODD_GTL_ATTRIBUTE_LEDGER_CARRIER.md`
**Status**: Draft

## Summary

This post describes the current `odd_domain` runtime architecture as it exists
after the first GTL carrier wave.

It is a current-reality read, not a target-only proposal.

The short version is:

- `odd_domain` now has one active GTL executive carrier:
  `build_and_query_world_model`
- that carrier is published through one GTL module and one live runtime job
- the runtime progresses lawfully through:
  `start -> fp_manifest_path -> construct_manifest() -> ingest_fp_result() -> next edge`
- the semantic chain is now executable from:
  `source_observation_surface`
  through
  `trace -> assurance -> attribute_ledger -> markov_object_cut -> published_domain_artifact -> composed_world_model -> query_projection`
- the constructor is now narrowed by target surface, so early edges do not
  force later composition/query outputs

## Analysis

### 1. Architectural Reading

The current architecture has five main layers:

1. `App Runtime`
   `odd_domain.app` bootstraps the ABG event stream and constructs `Scope`.
2. `Published GTL Module`
   `odd_domain.gtl_module` publishes nodes, graph functions, refinement
   boundaries, evaluators, and one active job.
3. `Workspace Asset Inventory`
   `odd_domain.workspace_assets` binds concrete workspace files and directories
   to the published node names.
4. `Constructor`
   `odd_domain.constructor` is the retained F_P closure path that materializes
   the target asset for the currently selected edge.
5. `Proof Surface`
   `odd_domain.self_test` proves the executive carrier end to end by replaying
   the runtime loop over a clean workspace.

### 2. Runtime Domain Model

This is the current runtime/domain-model shape of the carrier, not the business
world-model semantics:

```mermaid
classDiagram
  class AppConfig {
    +workspace_root
    +runtime_config
    +build
    +runtime_identity
    +domain_module
  }

  class OddDomainApp {
    +config
    +stream
    +worker
    +scope()
  }

  class Module {
    +name
    +graph_functions
    +jobs
    +evaluators
    +refinement_boundaries
    +metadata
  }

  class GraphFunction {
    +name
    +inputs
    +outputs
    +environment.requires
    +environment.provides
    +environment.carries
  }

  class Job {
    +name
    +contracts
    +roles
  }

  class Asset {
    +asset_id
    +declared_type
    +uri
    +checkpoint
  }

  class AssetCollection {
    +name
    +assets
  }

  class AssetNodeBinding {
    +node
    +asset_ids
  }

  class GeneratedAssetContract {
    +asset_id
    +materialization_kind
  }

  class FunctionCatalogEntry {
    +name
    +intent
    +inputs
    +outputs
    +backing_graph_function
  }

  class ExecutiveProgramEntry {
    +name
    +intent
    +steps
    +outputs
  }

  OddDomainApp --> AppConfig
  OddDomainApp --> Module
  Module --> GraphFunction
  Module --> Job
  OddDomainApp --> AssetCollection
  AssetCollection --> Asset
  OddDomainApp --> AssetNodeBinding
  AssetNodeBinding --> Asset
  GeneratedAssetContract ..> Asset
  Module ..> FunctionCatalogEntry
  Module ..> ExecutiveProgramEntry
```

### 3. Semantic Surface Model

This is the actual retained semantic surface chain currently published by the
GTL carrier:

```mermaid
classDiagram
  class SourceObservationSurface
  class TraceSurface
  class AssuranceSurface
  class AttributeLedgerSurface
  class MarkovObjectCutSurface
  class PublishedDomainArtifactSurface
  class ComposedWorldModelSurface
  class QueryProjectionSurface

  SourceObservationSurface --> TraceSurface : traced_into
  TraceSurface --> AssuranceSurface : assured_into
  AssuranceSurface --> AttributeLedgerSurface : qualified_into
  AttributeLedgerSurface --> MarkovObjectCutSurface : projected_into
  MarkovObjectCutSurface --> PublishedDomainArtifactSurface : packaged_into
  PublishedDomainArtifactSurface --> ComposedWorldModelSurface : composed_into
  ComposedWorldModelSurface --> QueryProjectionSurface : projected_into
```

That diagram is dependency/projection order, not OO inheritance.
The current chain is:

- source observation is the retained evidence entry
- trace records point back to source observation
- assurance records accept traced claims
- attribute ledger entries are qualified claims over the assured state
- Markov object cuts project immutable object state from the ledger
- published domain artifacts package those cuts
- composed world models stitch published artifacts
- query projection is a downstream serving surface over published/composed state

### 4. Graph Functions Actually Published

The current leaf graph functions in
[gtl_module.py](/Users/jim/src/apps/odd_domain/build_tenants/python/code/odd_domain/gtl_module.py:1)
are:

- `trace_source_observations`
- `assure_attribute_claims`
- `materialize_attribute_ledger`
- `project_markov_object_cut`
- `publish_domain_artifact`
- `compose_world_model`
- `project_query_surface`

The active executive graph function is:

- `build_and_query_world_model`

There is only one active runtime job:

- `build_and_query_world_model_job`

That matters because the earlier duplicate-runtime condition came from two
overlapping executive jobs exposing the same inner vectors as competing entry
points. That is now gone.

### 5. Graph Function Flow

This is the current actual graph-function chain:

```mermaid
flowchart LR
  SO["source_observation_surface"]
  TR["trace_surface"]
  AS["assurance_surface"]
  AL["attribute_ledger_surface"]
  MO["markov_object_cut_surface"]
  PD["published_domain_artifact_surface"]
  CW["composed_world_model_surface"]
  QP["query_projection_surface"]

  SO -->|"trace_source_observations"| TR
  SO -->|"assure_attribute_claims"| AS
  TR -->|"assure_attribute_claims"| AS
  SO -->|"materialize_attribute_ledger"| AL
  TR -->|"materialize_attribute_ledger"| AL
  AS -->|"materialize_attribute_ledger"| AL
  SO -->|"project_markov_object_cut"| MO
  TR -->|"project_markov_object_cut"| MO
  AS -->|"project_markov_object_cut"| MO
  AL -->|"project_markov_object_cut"| MO
  SO -->|"publish_domain_artifact"| PD
  TR -->|"publish_domain_artifact"| PD
  AS -->|"publish_domain_artifact"| PD
  AL -->|"publish_domain_artifact"| PD
  MO -->|"publish_domain_artifact"| PD
  PD -->|"compose_world_model"| CW
  PD -->|"project_query_surface"| QP
  CW -->|"project_query_surface"| QP
```

### 6. Executive Carrier Flow

The one active executive carrier is just the ordered composition of those leaf
functions:

```mermaid
flowchart LR
  A["trace_source_observations"]
  B["assure_attribute_claims"]
  C["materialize_attribute_ledger"]
  D["project_markov_object_cut"]
  E["publish_domain_artifact"]
  F["compose_world_model"]
  G["project_query_surface"]

  A --> B --> C --> D --> E --> F --> G

  H["build_and_query_world_model"] -.composes.-> A
  H -.composes.-> B
  H -.composes.-> C
  H -.composes.-> D
  H -.composes.-> E
  H -.composes.-> F
  H -.composes.-> G
```

### 7. Evaluator Shape

Each retained leaf edge currently has:

- one deterministic `F_D` evaluator checking the target surface contract
- one probabilistic `F_P` evaluator:
  `odd_domain_fp_semantic_constructor`

So the current runtime law is:

- `F_D` proves the target surface is materially present in the workspace
- `F_P` is satisfied by the retained constructor path and then closed through
  result ingestion

### 8. Concrete Asset Bindings

The current node bindings come from
[workspace_assets.py](/Users/jim/src/apps/odd_domain/build_tenants/python/code/odd_domain/workspace_assets.py:1).

Important current-reality point:

`odd_domain` is still proving itself against retained example artifacts under
`build_tenants/common/examples/...`, not yet against arbitrary user-defined
domain projects.

That means the current carrier is a real GTL runtime, but its concrete asset
inventory is still intentionally bounded to the proving corpus:

- FpML observation surface
- trade/APRA trace and assurance surfaces
- trade attribute ledger
- trade Markov object cut
- trade published fragment
- composed published sandbox root
- query summary projection

### 9. Constructor Dispatch Model

The constructor in
[constructor.py](/Users/jim/src/apps/odd_domain/build_tenants/python/code/odd_domain/constructor.py:1)
is now narrowed by target surface.

This is the current dispatch shape:

```mermaid
flowchart TD
  M["fp_manifest target_asset"] --> D["construct_manifest()"]

  D --> S1["source_observation_surface
  -> fpml_trade_domain.materialize_source_observation_surface(reset=True)"]

  D --> S2["trace_surface
  -> trade_to_apra.materialize_trace_surface(reset=True)"]
  D --> S3["assurance_surface
  -> trade_to_apra.materialize_assurance_surface(reset=True)"]
  D --> S4["attribute_ledger_surface
  -> trade_to_apra.materialize_attribute_ledger_surface(reset=True)"]
  D --> S5["markov_object_cut_surface
  -> trade_to_apra.materialize_markov_object_cut_surface(reset=True)"]
  D --> S6["published_domain_artifact_surface
  -> trade_to_apra.materialize_published_domain_artifact_surface(reset=True)"]
  D --> S7["composed_world_model_surface
  -> trade_to_apra.materialize_composed_world_model_surface(reset=True)"]
  D --> S8["query_projection_surface
  -> query.trade_to_apra.build()"]
```

The main architectural effect of the `T-016` refactor is:

- early edges no longer force APRA composition or stitching outputs
- later edges still widen into composed-world-model and query outputs

### 10. Runtime Closure Loop

This is the current closure path:

```mermaid
flowchart LR
  A["odd_domain.start()"] --> B["gen_start(scope, stream)"]
  B --> C["selected edge + fp_manifest_path"]
  C --> D["odd_domain.construct_manifest(manifest)"]
  D --> E["target surface materialized"]
  E --> F["result JSON written"]
  F --> G["ingest_fp_result(result_path, workspace)"]
  G --> H["assessed / proof_passed / closure_passed events"]
  H --> I["next odd_domain.start()"]
  I -->|until delta = 0| J["converged"]
```

This is no longer only theoretical. The product-local self-test in
[self_test.py](/Users/jim/src/apps/odd_domain/build_tenants/python/code/odd_domain/self_test.py:1)
executes that loop over a clean workspace and converges all seven retained
edges.

### 11. Product-Local Program Proof

The active program proof is:

```mermaid
flowchart TD
  P["self_test()"] --> S1["start() -> trace_source_observations"]
  S1 --> C1["construct_manifest()"]
  C1 --> I1["ingest_fp_result()"]
  I1 --> S2["start() -> assure_attribute_claims"]
  S2 --> C2["construct_manifest()"]
  C2 --> I2["ingest_fp_result()"]
  I2 --> S3["start() -> materialize_attribute_ledger"]
  S3 --> C3["construct_manifest()"]
  C3 --> I3["ingest_fp_result()"]
  I3 --> S4["start() -> project_markov_object_cut"]
  S4 --> C4["construct_manifest()"]
  C4 --> I4["ingest_fp_result()"]
  I4 --> S5["start() -> publish_domain_artifact"]
  S5 --> C5["construct_manifest()"]
  C5 --> I5["ingest_fp_result()"]
  I5 --> S6["start() -> compose_world_model"]
  S6 --> C6["construct_manifest()"]
  C6 --> I6["ingest_fp_result()"]
  I6 --> S7["start() -> project_query_surface"]
  S7 --> C7["construct_manifest()"]
  C7 --> I7["ingest_fp_result()"]
  I7 --> Z["start() -> converged"]
```

### 12. Current Boundedness

The current architecture is real, but still intentionally bounded:

- the constructor still uses retained canonical build-line materializers
- those materializers are stage-specific now, but not yet fine-grained
  incremental update engines
- the concrete asset inventory is still tied to the proving corpus examples
- the runtime is proving `odd_domain` over one retained trade/APRA steel thread,
  not yet over arbitrary project-specific domain inventories

That means the architecture is now best read as:

- genuine GTL runtime carrier
- genuine runtime proof
- bounded retained domain corpus
- still room for later generalization of asset binding and constructive
  granularity

## Recommended Action

1. Review this post as the current-reality explanation of the `odd_domain`
   carrier.
2. If the diagrams match your mental model, keep using this as the commentary
   explanation layer rather than trying to infer architecture from scattered
   code.
3. If you want the next wave, the most natural move is one of:
   - generalize asset binding away from retained example-only paths
   - make constructor materialization more incremental within each retained
     stage
   - introduce the next proving corpus beyond trade/APRA while keeping the same
     carrier law
