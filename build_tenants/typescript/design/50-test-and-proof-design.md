# TypeScript Test And Proof Design

**Status**: Active target design
**Date**: 2026-05-15
**Derived from**:
- `build_tenants/python/design/40-generated-test-design.md`
- `build_tenants/typescript/design/40-module-boundaries.md`

This surface carries forward the Python test-design intent while replacing
Python-specific commands, pytest assumptions, and Python module targets with
TypeScript, GTL/ABG, and installed `odd_sdlc` proof lanes.

## Qualification Boundary

Qualification must prove two coupled lines:

1. the ODD carrier line:
   - typed assets
   - graph functions
   - GTL jobs
   - GTL module publication
   - ABG-backed graph build trigger
   - installed `odd_sdlc` build evidence
2. the world-model semantic line:
   - source observations
   - traced evidence
   - assurance claims
   - attribute ledger
   - immutable object cuts
   - published domain artifacts
   - composed world models
   - mapping/query/proof projections

Passing TypeScript checks alone is not product proof.

## Test Lanes

### Lane A - Fast Deterministic Module Qualification

This lane covers:

- TypeScript semantic strict build
- deterministic unit tests over carrier constructors and semantic kernels
- schema/decoder tests over foreign input collapse
- module-boundary tests derived from `40-module-boundaries.md`

Primary targets:

- `domain/`
- `gtl/`
- `adapters/`
- `build_line/`
- `world_model/`

### Lane B - Graph-Function Publication And First Slice Proof

This lane proves that the first graph build is published and callable through
the TypeScript GTL/ABG carrier.

It covers:

- `odd_world_model.rebuild_world_model_core`
- GTL module publication
- semantic job binding
- ABG-backed graph start wrapper
- deterministic proof for the first source-to-artifact slice

The graph build is not lawful until the public graph function, job, module,
typed assets, and proof/closure evaluators are all visible.

### Lane C - Retained Corpus And Custom Domain Graph Proof

This lane carries forward the Python steel-thread intent without hardcoding the
Python example shape as architecture.

It covers:

- retained source authority under `examples/*/sources/`
- generic `odd_sdlc` scenario sandbox runs under
  `build_tenants/typescript/test_env/test_runs/<scenarioId>/`
- optional sibling TypeScript comparison cuts under
  `examples/*/sandbox/<datetime>_<version>.TS/`, projected from the generic
  run when side-by-side comparison is useful
- the existing unsuffixed sandbox cuts as Python-built references
- at least one published source-domain construction
- at least one interpreted downstream world-model artifact
- at least one composition or mapping over published artifacts
- reverse recoverability from downstream projection back to source observation

The purpose is to prove that the TypeScript tenant can build custom
world-model domain graphs while retaining traceability.

The first retained corpus should cover the current example domains:

- `trade_source_model`
- `trade_representation_model`
- `apra_liquidity_model`
- `banking_product_model`

For each admitted domain, the TypeScript proof run should define a scenario
descriptor and fixture rooted in the same `sources/` authority as the retained
Python reference. It should reuse the generic sandbox pattern proven in
`odd_sdlc/build_tenants/typescript/test_env/sandbox`:

- fixture root plus asserted source files
- descriptor-owned expectations
- fresh run root under `test_env/test_runs/<scenarioId>/<timestamp>_pid<pid>/`
- ABG installed sandbox evidence
- copied workspace with installed `odd_sdlc.TS`
- `gaps -> start` advances until lawful stop, error, or declared limit
- assertions over graph targets, overlays, event evidence, workspace files,
  operator archives, process checks, and closure artifacts

When a `.TS` comparison cut is emitted beside the retained Python reference, it
should preserve comparable output families where applicable:

- graph-function manifests and run results
- ABG event evidence
- published domain artifacts
- review and query projections
- mapping records and proof summaries for examples that include mapping
- a comparison note or manifest that records semantic matches, declared deltas,
  and unsupported Python-only runtime payloads

The retained Python sandbox is comparison evidence. It is not architecture
authority. A TypeScript run may omit old `.genesis` or Python package payloads,
but it must preserve enough output shape to compare source admission, graph
movement, publication, query, mapping, proof, and reverse recoverability.

### Lane D - Installed Governance And Builder-Product Proof

This lane proves the current installed-product and governance boundary.

It covers:

- installed `odd_sdlc` gap/start/register evidence over the workspace
- release/install proof for `odd_world_model` as a builder product
- installed product provenance and project-local configuration
- proof that installed operation does not depend on uninstalled source-project
  internals

## Requirement Allocation

| Requirement Family | Primary Lanes |
|---|---|
| `REQ-ODD-WORLD-MODEL-PRODUCT-*` | B, C, D |
| `REQ-ODD-WORLD-MODEL-ODD-CARRIER-*` | A, B, D |
| `REQ-ODD-WORLD-MODEL-BUILD-CAP-*` | B, C |
| `REQ-ODD-WORLD-MODEL-BUILD-CONSTRAINT-*` | A, B, C |
| `REQ-ODD-WORLD-MODEL-WORLD-OBJECT-*` | A, C |
| `REQ-ODD-WORLD-MODEL-MAPPING-*` | C |
| `REQ-ODD-WORLD-MODEL-MESH-*` | C |
| `REQ-ODD-WORLD-MODEL-BUILD-VERIFY-*` | B, C, D |
| `REQ-ODD-WORLD-MODEL-RELEASE-*` | D |

## Evidence Expectations

Each proof run must preserve:

- lane name
- command or graph-function target
- requirement and scenario coverage
- input source corpus or builder-project scope
- published outputs
- retained reference sandbox used for comparison, when applicable
- scenario id, fixture root, and generic sandbox run root, when applicable
- TypeScript `.TS` comparison-cut output path, when applicable
- closure verdict
- open gaps with owning carrier or module boundary
- installed `odd_sdlc` evidence used, when applicable

The run archive is a proof projection over admitted work. It is not a
replacement for the semantic output.

## Python Reference Carry-Forward

Preserved:

- carrier qualification lane
- semantic steel-thread lane
- installed-product lane
- reverse recoverability requirement
- run archive as evidence projection

Not preserved:

- `py_compile`
- pytest as the target runner
- Python module names as test ownership
- Python CLI commands as proof targets

The target proof surface must derive from TypeScript module ownership and
published graph functions.
