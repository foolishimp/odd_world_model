# odd_world_model TypeScript Tenant Design

Tenant-local design for the `odd_world_model` TypeScript realization lives here.

The TypeScript line realizes the singleton `specification/` authority. It does
not define a rival product constitution.

## Governing Surfaces

- `specification/GOALS.md`
- `specification/INTENT.md`
- `specification/PRODUCT.md`
- `specification/requirements/`
- `.ai-workspace/tickets/active/T-026-rebuild-world-model-in-typescript-tenant.md`
- `/Users/jim/src/apps/specification_methodology/specification/standards/DESIGN_MODULE_METHOD.md`
- `/Users/jim/src/apps/specification_methodology/specification/standards/ODD_METHOD.md`
- `/Users/jim/src/apps/specification_methodology/specification/standards/WORLD_MODEL_METHOD.md`
- `/Users/jim/src/apps/abiogenesis/docs/LLM_GTL_APP_BUILDER_GUIDE.md`
- `/Users/jim/src/apps/odd_sdlc/build_tenants/typescript/test_env/sandbox/`
- `.abiogenesis/odd_sdlc/typescript/install-manifest.json`
- `build_tenants/python/design/`

## Reference And Proof Corpus

- `examples/*/sources/`
- `examples/*/sandbox/20260419T000000Z_v1/`
- `build_tenants/typescript/test_env/test_runs/`
- optional `examples/*/sandbox/<datetime>_<version>.TS/` comparison cuts

The source directories are retained example authority. The existing unsuffixed
sandbox cuts are Python-built references. TypeScript proof runs should use the
generic `odd_sdlc` scenario sandbox shape under `test_env/`: scenario
descriptors, fixture roots, installed ABG/odd_sdlc workspaces, and archived
`gaps -> start` evidence. Optional sibling `.TS` cuts under `examples/` are
comparison projections from those generic runs, not a separate runner.

## Active Design Pack

- `adrs/ADR-001-typescript-gtl-abg-tech-stack.md`
- `adrs/ADR-002-odd-sdlc-build-component-inheritance.md`
- `adrs/ADR-003-reference-derived-design-carry-forward.md`
- `20-feature-decomposition.md`
- `30-world-model-odd-design.md`
- `40-module-boundaries.md`
- `50-test-and-proof-design.md`
- `55-scenario-sandbox-proof-structure.md`

## Design Position

The TypeScript tenant target is:

```text
odd_world_model product requirements
-> TypeScript typed assets and GTL module
-> public world-model graph functions
-> ABG graph calls, traversal, runtime facts, projection, proof, and closure
```

GTL publishes the graph-function programs.

ABG owns traversal, frames, continuations, events, replay, projection,
correction, proof, and closure.

`odd_world_model.TS` owns world-model domain assets, function catalog, module
publication, deterministic materializers, proof readers, and app wrapper
commands that delegate to ABG.

Installed `odd_sdlc` is a build component and development product used by this
source project. It contributes SDLC governance, ticket/execution-contract
interpretation, operator surfaces, proof/release patterns, lineage ledgers, and
tracking registers. It does not own the `odd_world_model` product identity,
world-model domain semantics, or public graph-function namespace.

This lets the TypeScript tenant build custom world-model domain graphs while
reusing robust SDLC lineage and tracking evidence. Those registers prove and
project the governed build; they do not replace the world-model semantic layer.

The retained Python tenant remains historical reference and comparison
evidence. Its module layout and imperative runner shape are not target
architecture.

The retained Python design files are consumed through the reference-derived
mapping in ADR-003. The TypeScript design pack preserves the useful semantic
build-line, component, module, and proof structure while replacing Python-first
runtime, package, command, and test-runner choices.
