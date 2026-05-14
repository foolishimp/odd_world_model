# TypeScript Tenant

`build_tenants/typescript/` is the selected forward realization tenant for the
`odd_world_model` rebuild.

Current status: design active, implementation pending.

This tenant records the source-side landing zone for a TypeScript realization
of `odd_world_model`. Product `WHAT` remains under `specification/`. This tenant
owns downstream design and realization `HOW`.

The installed governance/runtime payload for `odd_sdlc.TS` lives under
`.abiogenesis/odd_sdlc/typescript/` and is not project source truth.

## Design

- `design/README.md`
- `design/adrs/ADR-001-typescript-gtl-abg-tech-stack.md`
- `design/adrs/ADR-002-odd-sdlc-build-component-inheritance.md`
- `design/adrs/ADR-003-reference-derived-design-carry-forward.md`
- `design/20-feature-decomposition.md`
- `design/30-world-model-odd-design.md`
- `design/40-module-boundaries.md`
- `design/50-test-and-proof-design.md`

## Stack Position

The TypeScript tenant uses GTL/ABG through the ABIogenesis TypeScript substrate.

Installed `odd_sdlc` under `.abiogenesis/odd_sdlc/typescript/` is used as a
build component for SDLC governance, ticket/execution-contract interpretation,
operator control surfaces, proof/release patterns, lineage ledgers, and
tracking registers. It is not the authored world-model product and does not own
world-model domain semantics.

The tenant may build custom world-model domain graphs over that governance
substrate. The SDLC registers track build lineage and closure; the published
world-model layer remains the semantic truth surface.

The stale Python design line is retained as reference evidence only. Relevant
feature layering, component boundaries, module groups, and proof lanes have
been carried forward into the TypeScript design pack through ADR-003.

## Example Sandbox Comparison

Retained example sources live under `examples/*/sources/`. Existing unsuffixed
example sandboxes are Python-built reference cuts.

The TypeScript tenant should reuse the generic `odd_sdlc` scenario sandbox
shape under:

```text
build_tenants/typescript/test_env/
├── fixtures/
├── sandbox/
└── test_runs/
```

The canonical TypeScript proof archive should be:

```text
build_tenants/typescript/test_env/test_runs/<scenarioId>/<timestamp>_pid<pid>/
```

When side-by-side comparison is useful, a run may also emit a projected
comparison cut under:

```text
examples/<domain>/sandbox/<datetime>_<version>.TS/
```

Those cuts should use the same source corpus and preserve comparable published,
query, mapping, proof, and event evidence while omitting old Python runtime or
`.genesis` payloads. They are projections from the generic scenario sandbox
run, not a separate sandbox mechanism.

The first graph-build trigger is designed around:

```text
graph_function:odd_world_model.rebuild_world_model_core
```

The implementation wave must publish that public `GraphFunction`, bind a
semantic `Job`, publish the GTL `Module`, and delegate traversal to ABG before
claiming a runnable graph build.
