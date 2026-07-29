# odd_world_model

`odd_world_model` builds governed semantic memory for exact, bounded,
loss-declared LLM context.

It preserves source authority through accepted semantic claims, immutable
published cuts, typed semantic links, purpose-bound mesh cuts, context bases,
context projections, and attributed model outputs. Physical storage and query
are effects and projections over that semantic truth, not rival authorities.

## Current Product Line

- `specification/` defines Product `WHAT`.
- `build_tenants/common/design/` defines shared realization architecture.
- `build_tenants/typescript/` is the forward WM realization tenant.
- `build_tenants/storage/python/` is the bounded PyIceberg physical-cut effect
  with independent DuckDB exact-snapshot proof.
- `build_tenants/python/` is retained historical/reference implementation.

The repository-root `package.json` is a private validation-command coordinator.
It exports no runtime product and carries no dependency resolution. The only
forward runtime package is `build_tenants/typescript/`.

The current incremental proving slice targets exact ABIogenesis `4.6.0-rc.3` with
`odd_glc 0.1.0` behind a migration adapter. Product dependency law remains
floating.

The accepted GTL catalog publishes seven public GraphFunctions through one
module and runtime registry startup binding. ABIogenesis owns traversal and
events; odd_glc interprets lifecycle/startup truth; WM owns domain meaning.
`map_domains` remains a defined but deferred contract.

## Read First

1. `specification/GOALS.md`
2. `specification/INTENT.md`
3. `specification/PRODUCT.md`
4. `specification/requirements/`
5. `build_tenants/common/design/WORLD_MODEL_COMMON_ARCHITECTURE.md`
6. `build_tenants/common/design/adrs/REGISTRY.md`
7. `build_tenants/typescript/design/90-admitted-semantic-steel-thread-design.md`
8. `build_tenants/typescript/design/95-rc3-reference-bridge-as-built-review.md`
9. `.ai-workspace/tickets/active/`

## Current Validation

```text
cd build_tenants/typescript
npm test
npm run typecheck
npm run proof:generate

cd ../storage/python
.venv/bin/python -m unittest discover -s test_env/tests -v
```

Build versioned world-model instances from all retained example corpora:

```text
cd build_tenants/typescript
npm run sandbox:examples
```

Pass `--deployment /path/to/deployment-manifest.json` to rebuild the same
sources with another exact WM deployment. New cuts are written side by side
under `examples/<domain>/sandbox/`; existing cuts are never overwritten.

The proof bundle is development evidence and records the dirty source state; it
is not an immutable release cut. Direct Python CLI invocation is an adapter
contract test, not the product runtime. ABG remains the runtime, event,
admission, replay, and closure owner. The `interpret_context` proof exercises
an F_P traversal through a deterministic reference adapter, but the proposal
is preconstructed and re-carried by exact ref. Native WM payload execution,
calibrated F_P authorship, and production LLM/provider integration remain open.
