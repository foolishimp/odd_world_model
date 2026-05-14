# ODD GTL Attribute-Ledger Carrier

**Status**: Implemented
**Scope**: Shared design for the first live ODD-method carrier slice in
`odd_world_model`

## Purpose

Define how `odd_world_model` adopts the proven `odd_sdlc` GTL pattern without
reopening product direction and without extracting a shared library
prematurely.

This design is governed by:

- `ODD_METHOD.md`
- `WORLD_MODEL_METHOD.md`
- `specification/INTENT.md`
- `specification/PRODUCT.md`
- `specification/requirements/50-odd-method-gtl-carrier.md`

## Design Position

The current `odd_world_model` line already has the right semantic chain:

`source -> tracing -> assurance -> attribute ledger -> object cut -> published domain artifact -> composed world model`

The missing part is not semantic direction. The missing part is the operative
carrier.

For the first live carrier slice, `odd_world_model` adopts the `odd_sdlc` GTL
pattern in the most pragmatic way:

1. copy the relevant GTL Python surfaces from `odd_sdlc`
2. land them inside `odd_world_model`
3. customize them to `odd_world_model` semantics
4. defer shared-library extraction until at least two real implementations
   exist

## Carrier Pattern To Copy

The retained pattern from `odd_sdlc` is:

- explicit typed asset/node surfaces
- explicit machine-readable function catalog
- GTL module as the operative publication surface
- query/catalog projection over current checkpoints and provenance

The retained pattern is **not**:

- SDLC-specific asset names
- SDLC-specific semantic chains
- SDLC-specific catalogs or proof nouns

## First Live odd_world_model Asset Set

The first retained callable asset set is:

- `source_observation_surface`
- `trace_surface`
- `assurance_surface`
- `attribute_ledger_surface`
- `markov_object_cut_surface`
- `published_domain_artifact_surface`
- `composed_world_model_surface`
- `query_projection_surface`

The primary project asset for this line is `attribute_ledger_surface`.

## First Live Function Set

The first retained graph-function subset should cover:

- trace construction
- assurance construction
- attribute-ledger materialization
- object-cut projection
- published-domain-artifact publication
- composed-world-model construction

The first public executive carrier should compose the retained build/query
chain rather than binding callers directly to inner vectors.

## GTL / F_D Split

The retained split is:

- GTL graph functions carry semantic derivation and traversal
- deterministic `F_D` helpers materialize trace, assurance, ledger,
  serialization, and projection records

The new GTL carrier must call into the existing deterministic materializers
rather than replacing them with another imperative runtime.

## Query Pattern

The first query/catalog lane should follow the `odd_sdlc` pattern:

- current visible state is projected from retained assets and checkpoints
- function catalog and graph-function metadata are queryable
- query does not replace runtime truth or publication truth

The app-owned runtime surface should also follow the `odd_sdlc` pattern:

- workspace bootstrap binds an ABG event stream
- the published module is entered through `Scope`
- `catalog`, `gaps`, `iterate`, and `start` are product-owned runtime entry
  points over that module
- deterministic `F_D` checks are bound explicitly rather than left as inert
  evaluator names
- a product-local executive program runner proves the runtime through
  `start -> manifest -> construct -> ingest -> continue`
- the retained executive program self-test converges in a clean workspace
  without bypassing the GTL carrier

The filesystem-first trade/APRA query lane remains valid and should be treated
as a downstream proof lane over the new carrier surfaces rather than as a rival
runtime.

## Tenant Boundary

The first live carrier remains entirely under:

`build_tenants/python/`

No second implementation stack should be introduced in the same wave.

## Current Realization

The first live retained realization is now present under the Python tenant:

- `build_tenants/python/code/odd_world_model/app.py`
- `build_tenants/python/code/odd_world_model/gtl_module.py`
- `build_tenants/python/code/odd_world_model/function_catalog.py`
- `build_tenants/python/code/odd_world_model/fd_contracts.py`
- `build_tenants/python/code/odd_world_model/fd_checks.py`
- `build_tenants/python/code/odd_world_model/constructor.py`
- `build_tenants/python/code/odd_world_model/self_test.py`

The operative runtime shape is now:

1. `start()` selects the active GTL edge and emits an `fp_manifest_path`
2. `construct_manifest()` materializes the retained target surface for that edge
3. `ingest_fp_result()` closes the result lawfully through ABG
4. the next `start()` call advances to the next retained edge

The active public executive carrier is now singular:

- `build_and_query_world_model`

This avoids the earlier duplicate-runtime condition where overlapping executive
jobs reintroduced the same inner vectors as competing entry points.

The retained constructor is now also narrowed to edge-specific materialization:

- `source_observation_surface` is materialized from the bounded FpML source lane
- early sandbox edges (`trace`, `assurance`, `attribute_ledger`,
  `markov_object_cut`, `published_domain_artifact`) now materialize through the
  imported trade-domain side only
- later edges (`compose_world_model`, `query_projection`) materialize the
  broader APRA-composition and query surfaces

This keeps the GTL runtime lawful while reducing the constructive scope of each
retained edge to the bounded surface it actually governs.
