# ADR-003 Reference-Derived Design Carry-Forward

**Status**: Retained derivation decision; current target is the 2026-07-12 rebase
**Date**: 2026-05-15
**Scope**: Carry forward relevant design structure from the stale Python tenant into the TypeScript tenant
**Ticket**: `T-026`

Reference derivation remains accepted. The target files named below are now
inputs to `60-current-rc3-design-rebase.md`, not independent current authority.

## Context

The Python tenant under `build_tenants/python/` is now a stale reference
implementation.

Its design surfaces remain useful evidence:

- `build_tenants/python/design/20-generated-feature-decomp.md`
- `build_tenants/python/design/30-generated-odd-design.md`
- `build_tenants/python/design/40-generated-implementation-design.md`
- `build_tenants/python/design/40-generated-implementation-modules.md`
- `build_tenants/python/design/40-generated-implementation-stack.md`
- `build_tenants/python/design/40-generated-test-design.md`

They are not the current target design. They were generated for a Python-first
implementation line and include stale choices such as Python entry points,
Python package names, pytest lanes, and installed `.genesis/` runtime binding.

`DESIGN_MODULE_METHOD.md` requires a reference-derived realization to preserve
the derivation chain:

```text
constitutional WHAT
-> reference design
-> target design mapping
-> target module boundary assets
-> implementation and unit tests
```

This ADR records the target mapping. The TypeScript tenant design assets under
`build_tenants/typescript/design/` are the current HOW for the rebuild.

## Decision

The TypeScript tenant SHALL carry forward only the design structure from the
Python reference that still satisfies the current `specification/`,
`WORLD_MODEL_METHOD.md`, `ODD_METHOD.md`, and `DESIGN_MODULE_METHOD.md`.

The TypeScript tenant SHALL NOT port Python modules file-for-file.

### Preserved

The TypeScript target preserves these design commitments:

- the product chain:

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

- the layer order:
  - carrier and runtime foundation
  - semantic build line
  - ledger-backed world-model substrate
  - composition over published artifacts
  - query/proof projection
  - release/install proof
- source adapters as bounded ingestion and decomposition readers
- the attribute ledger as the immediate semantic source for object cuts
- immutable supersession rather than in-place mutation of published truth
- query as projection over published artifacts and constructive history
- retained source examples as proof corpora, not as product definition
- explicit test lanes for carrier qualification, semantic steel-thread proof,
  and installed-product proof

### Reshaped

The TypeScript target reshapes these reference design choices:

- Python package modules become TypeScript module boundaries under
  `build_tenants/typescript/code/src/`.
- Python `start()` / `iterate()` runtime ownership becomes an ABG-backed graph
  function start path.
- Python `function_catalog.py` and `gtl_module.py` become TypeScript GTL
  function, job, and module publication surfaces.
- Python deterministic materializers become TypeScript semantic kernels and
  effect shells beneath published graph functions.
- The FpML, trade, and APRA proving slice becomes retained corpus evidence for
  generic source-domain, artifact-publication, composition, and mapping
  boundaries.
- Python filesystem-first query remains an allowed first projection, but not a
  constitutional query-plane commitment.
- Python install behavior is reframed through current release/install
  requirements and installed `odd_sdlc` governance.

### Deferred

The TypeScript target defers:

- a database-backed serving plane
- a UI/front-end runtime
- cloud or container deployment
- full parity with every historical Python entry point
- broad multi-domain mesh closure beyond the first admitted graph-build slice

Those may be designed later as downstream projections or release/runtime
surfaces.

### Demoted

The TypeScript target demotes these reference details to historical evidence:

- Python filenames and package layout
- `python -m odd_world_model ...` commands
- `py_compile`, pytest, and Python-specific test modules
- installed `.genesis/` runtime assumptions
- deleted sandbox compatibility wrappers
- the old claim that Python is the canonical project realization tenant

## Target Design Assets

The accepted TypeScript carry-forward design assets are:

- `build_tenants/typescript/design/20-feature-decomposition.md`
- `build_tenants/typescript/design/30-world-model-odd-design.md`
- `build_tenants/typescript/design/40-module-boundaries.md`
- `build_tenants/typescript/design/50-test-and-proof-design.md`

Together with ADR-001 and ADR-002, these replace the Python-first generated
design line for new implementation work.

## Consequences

### Positive

- The TypeScript rebuild inherits useful world-model design structure without
  inheriting Python runtime drift.
- The design chain satisfies the reference-derived evidence route from
  `DESIGN_MODULE_METHOD.md`.
- The current target design remains traceable to specification WHAT and to the
  Python reference design evidence.

### Negative

- The implementation cannot claim parity by matching Python filenames or
  commands.
- Some retained examples must be re-expressed through generic TypeScript graph
  and carrier boundaries before they count as current proof.

## Acceptance

- Python design surfaces are documented as stale reference evidence.
- TypeScript target design assets state what is preserved, reshaped, deferred,
  and demoted.
- The TypeScript module boundary design declares its irreducible carrier set.
- New implementation work traces to the TypeScript design assets, not to the
  Python generated design files directly.
