# TypeScript Tenant

`build_tenants/typescript/` is the selected forward realization tenant for the
`odd_world_model` rebuild.

Current status: executable semantic-contract reference slice implemented;
native GraphFunction payload execution, final product review, and immutable
release proof remain open.

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
- `design/adrs/ADR-006-exact-rc3-proving-substrate-and-migration-seam.md`
- `design/90-admitted-semantic-steel-thread-design.md`
- `design/95-rc3-reference-bridge-as-built-review.md`
- `design/80-current-full-build-design.md`
- `design/20-feature-decomposition.md`
- `design/30-world-model-odd-design.md`
- `design/40-module-boundaries.md`
- `design/50-test-and-proof-design.md`

## Runnable Slice

The current slice publishes seven accepted GTL GraphFunctions, seven jobs, one
module, one exact runtime catalog startup binding, pure WM semantic kernels,
and a bounded PyIceberg effect with DuckDB exact-snapshot proof. Public starts
delegate to ABIogenesis and odd_glc projects the emitted registry/traversal
truth.

The reference-bound steel thread binds exact source and candidate refs through all
five domain-publication vectors, derives ABG admission from canonical events,
applies attributed WM acceptance, admits physical effects, and projects mesh,
context, invocation, staleness, and query over final published cuts. The rc.3
F_P bridge re-carries a preconstructed proposal; it neither executes the WM
semantic kernel nor proves calibrated authorship. It remains a deterministic
reference-and-digest adapter, not a production model provider.

Run current validation and persist development proof:

```bash
npm run typecheck
npm test
npm run proof:generate
```

The old filesystem constructor is preserved only under
`historical/filesystem_runner/`. It is outside current source, package scripts,
exports, tests, and proof. Its generated files are historical read models, not
ABG events or WM publication truth.

## Stack Position

The TypeScript tenant uses GTL/ABG through the ABIogenesis TypeScript substrate.

Installed `odd_sdlc` under `.abiogenesis/odd_sdlc/typescript/` is historical
builder/readback evidence. Current method authority comes from the workspace
STDO source, current GTL/ABG execution comes from the exact ABIogenesis package,
and lifecycle interpretation comes from odd_glc. None owns WM domain meaning.

The stale Python design line is retained as reference evidence only. Relevant
feature layering, component boundaries, module groups, and proof lanes have
been carried forward into the TypeScript design pack through ADR-003.

## Example Sandbox Comparison

Retained example sources live under `examples/*/sources/`. Existing unsuffixed
example sandboxes are Python-built reference cuts.

Current versioned instance cuts are built through the exact installed-product
protocol defined by ADR-WM-006. Build all four retained corpora with a
self-contained development deployment:

```text
cd build_tenants/typescript
npm run sandbox:examples
```

Use `--deployment /path/to/deployment-manifest.json` to build the same corpora
with another deployed WM version. Use `--example <name>` to select one corpus.
The deployment cache is under `test_env/deployments/`; immutable instance cuts
are emitted under `examples/<domain>/sandbox/` and are never overwritten.

Inspect a cut's prime digest, byte-level artifact manifest, exact source
inventory, product binding, and compressed runtime-event archive with:

```text
npm run sandbox:inspect -- --instance /path/to/cut --source-root /path/to/example/sources
```

The current development proof archive is:

```text
build_tenants/typescript/test_env/proof/20260712T000000Z_full-build-v1/
```

Each current cut is rooted by:

```text
examples/<domain>/sandbox/<datetime>_<wm-product-version>.TS/wm-instance.json
```

The prime manifest binds the exact source inventory, product deployment,
dependencies, runtime evidence, semantic publication, physical snapshots,
mesh, context, query, proof, and declared gaps. Historical Python and early
TypeScript sandboxes remain comparison evidence and are not upgraded into exact
deployed-product proof.

The retired `odd_world_model.rebuild_world_model_core` handle is historical
readback. Current public handles are defined once in
`code/src/gtl/graph_functions.ts` and projected through
`code/src/gtl/catalog.ts`.
