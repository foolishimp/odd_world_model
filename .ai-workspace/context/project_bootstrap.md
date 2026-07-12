# Project Bootstrap

This generated surface is a deterministic read model over imported project authority.
It is not a replacement for project-owned specification truth.

## Workspace Identity
- workspace: `odd_world_model`
- project slug: `odd_world_model`
- platform: `typescript`

## Project Identity
- authoritative project title: odd_world_model
- identity source: `specification/PRODUCT.md`
- workspace/template/bootstrap provenance does not change project identity

## Source Titles
- `specification/INTENT.md`: Intent
- `README.md`: odd_world_model [provenance/context]

## Ontology Anchors
- `README.md` → odd_world_model

## Read Order
- `specification/INTENT.md` when present
- `specification/GOALS.md`
- `specification/PRODUCT.md`
- `specification/requirements/`
- `build_tenants/common/design/WORLD_MODEL_COMMON_ARCHITECTURE.md`
- `build_tenants/typescript/design/80-current-full-build-design.md`
- `README.md` as operator context after constitutional and design authority

## Current Build And Proof Surface
- `npm --prefix build_tenants/typescript run typecheck`
- `npm --prefix build_tenants/typescript test`
- `npm --prefix build_tenants/typescript run proof:generate`
- `.venv/bin/python -m unittest discover -s test_env/tests -v` from `build_tenants/storage/python`
- treat `.abiogenesis/odd_sdlc`, `.genesis`, and the Python product tenant as historical installed/reference surfaces
- ABG owns runtime traversal and events; odd_glc supplies downstream lifecycle interpretation; WM owns domain semantics

## Interpretation Rule
- use this surface to orient quickly
- use imported project sources as authority
- treat README/bootstrap history and template language as provenance unless an imported authority surface makes it project-defining
- if ontology remains incomplete, say so explicitly rather than inferring it from repository context
