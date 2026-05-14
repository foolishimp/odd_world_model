# TypeScript Tenant

`build_tenants/typescript/` is the selected forward realization tenant for the
`odd_world_model` rebuild.

Current status: first implementation slice active.

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

## Runnable Slice

The first TypeScript materialization slice is a deterministic filesystem
runner for retained example sources. It is not the final ABG-backed graph
execution path, but it proves the source-observation to published-artifact to
query projection carrier for all retained example corpora.

Run the retained examples from the repo root:

```bash
npm --prefix build_tenants/typescript run examples -- --run-id 20260515T000000Z_v1.TS
```

Compare generated `.TS` cuts against the Python-built reference cuts:

```bash
node build_tenants/typescript/code/src/cli/main.ts compare-examples --workspace . --run-id 20260515T000000Z_v1.TS --reference-run-id 20260419T000000Z_v1
```

Run the TypeScript tenant tests:

```bash
npm --prefix build_tenants/typescript test
```

The generated comparison cuts are under:

```text
examples/<domain>/sandbox/20260515T000000Z_v1.TS/
```

They omit Python runtime payloads and write a TypeScript install manifest under
`.genesis/odd_world_model/typescript/release/install_manifest.json`.

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
query, mapping, proof, and event evidence where the TypeScript slice implements
the corresponding carrier while omitting old Python runtime payloads. The first
slice preserves source, review, published, composed-world-model, query, event,
manifest, and result evidence. Rich historical APRA/trade mapping and proof
surfaces remain parity pressure for the next implementation slice.

The first graph-build trigger is designed around:

```text
graph_function:odd_world_model.rebuild_world_model_core
```

The implementation wave must publish that public `GraphFunction`, bind a
semantic `Job`, publish the GTL `Module`, and delegate traversal to ABG before
claiming a runnable graph build.
