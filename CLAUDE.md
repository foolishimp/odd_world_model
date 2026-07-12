# odd_world_model Agent Bootstrap

This repository builds governed semantic memory for exact, bounded,
loss-declared LLM context.

## Authority

Read current authority in this order:

1. `specification/GOALS.md`
2. `specification/INTENT.md`
3. `specification/PRODUCT.md`
4. `specification/requirements/`
5. `build_tenants/common/design/WORLD_MODEL_COMMON_ARCHITECTURE.md`
6. `build_tenants/typescript/design/80-current-full-build-design.md`
7. active tickets under `.ai-workspace/tickets/active/`

Specification defines `WHAT`. Design and build tenants define `HOW`.

## Product Boundary

- TypeScript is the forward WM realization tenant.
- GTL GraphFunctions are the constructive carrier.
- ABIogenesis/ABG owns traversal, runtime facts, admission, events, replay,
  continuation, and closure.
- odd_glc owns generic lifecycle vocabulary and downstream interpretation.
- WM owns semantic meaning, mesh, context, treatments, projection, and domain
  proof interpretation.
- `storage/python` is a bounded PyIceberg physical effect, not a second product
  or runtime.
- the repository-root npm manifest is validation coordination only; it has no
  exports or runtime dependency authority.
- `build_tenants/python`, `.genesis`, and installed odd_sdlc surfaces are
  historical/reference evidence.

The Product dependency boundary remains version-floating. The current proving
tenant uses immutable ABIogenesis `4.6.0-rc.3` and odd_glc `0.1.0` artifacts
through `build_tenants/typescript/code/src/substrate_binding/`.

## Operating Rules

- Follow STDO intake and the smallest lawful re-entry point.
- Do not add a product-local traversal loop or revive the filesystem executive.
- Do not expose private publication refinements as public jobs.
- Do not read implicit latest physical state; use exact attested snapshots.
- Do not accept F_P output as semantic truth without deterministic checks,
  ABG evidence, and WM authority.
- Keep legacy example generation as comparison tooling only.

## Validation

```text
cd build_tenants/typescript
npm run typecheck
npm test
npm run proof:generate

cd ../storage/python
.venv/bin/python -m unittest discover -s test_env/tests -v
```

The persisted bundle is development proof while source is dirty. It does not
claim an immutable release cut.
