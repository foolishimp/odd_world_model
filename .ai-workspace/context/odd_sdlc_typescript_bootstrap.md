# odd_sdlc TypeScript Workspace Governance Surface

This workspace contains a target project governed by `odd_sdlc.TS`.
GTL/ABG are substrate. `odd_sdlc` is the governance and domain package.
Imported project authority defines what the project is.

## Workspace Identity
- workspace: `odd_world_model`
- project slug: `odd_world_model`
- product: `odd_sdlc`
- build tenant: `typescript`
- installed product root: `workspace://.abiogenesis/odd_sdlc/typescript`
- install manifest: `workspace://.abiogenesis/odd_sdlc/typescript/install-manifest.json`
- ABG install manifest: `workspace://.abiogenesis/install-manifest.json`
- normalization projection: `workspace://.ai-workspace/runtime/odd_sdlc-typescript-installation.json`
- bootstrap guide: `workspace://.ai-workspace/context/odd_sdlc_typescript_bootstrap.md`

## Agent Operating Rule
- start from project truth, not substrate ontology
- treat `odd_sdlc` as governance over the target project
- do not describe the project itself as a GTL/ABG app unless project authority says so
- `specification/` is project-owned `WHAT`
- `build_tenants/` is project-owned realization `HOW`
- `.ai-workspace/runtime/odd_sdlc/assets` is the default transform-asset archive root
- product files materialize under the conformed `selected_output_root`, normally `build_tenants/<tenant>`
- `.abiogenesis/*` is installed substrate or installed product payload, not mutable project source
- ABG owns traversal, continuation, events, runtime facts, and projection mechanics

## STDO Bootstrap Provenance
- `STDO law`, `STDO governance`, `STDO Constitution`, and `STDO Method` are aliases for the same governance stack
- `STDO-UX` is the UI/operator-surface application of that same governance stack
- STDO expands to:
  - `workspace://.abiogenesis/docs/standards/SPEC_METHOD.md`
  - `workspace://.abiogenesis/docs/standards/TICKET_METHOD.md`
  - `workspace://.abiogenesis/docs/standards/DESIGN_MODULE_METHOD.md`
  - `workspace://.abiogenesis/docs/standards/ODD_METHOD.md`
- before substantive ticket execution, triage the first missing layer:
  - `Goals -> Intent -> Product -> Requirements -> Design -> Code -> Tests/Proof -> Release`
- the symptom layer is not the re-entry authority
- if triage finds a higher missing layer, fix the ticket execution contract before implementation
- for UI/operator tickets under `STDO-UX`, preserve the Agentic Coder CLI as the user interface over installed product truth, not as a rival runtime or hidden worker controller

## Read First
- `workspace://.ai-workspace/context/odd_sdlc_typescript_bootstrap.md`
- `workspace://.ai-workspace/runtime/odd_sdlc-typescript-installation.json`
- `workspace://.abiogenesis/odd_sdlc/typescript/install-manifest.json`
- `workspace://.abiogenesis/install-manifest.json`
- `workspace://specification/INTENT.md` when present
- `workspace://specification/PRODUCT.md` when present
- `workspace://specification/requirements/` when present

## Start Here
- when the operator says `gaps`, run `node_modules/.bin/odd-sdlc-ts gaps --workspace .`
- `start` is an operator shell over ABG-owned graph execution; do not treat odd_sdlc as a second traversal runtime
- when the operator says `start` for live completion on Claude, run the ABG-backed start path with `node_modules/.bin/odd-sdlc-ts start --workspace . --target next --until converged --worker process://claude`
- when the operator says `start` for live completion on Codex, run the ABG-backed start path with `node_modules/.bin/odd-sdlc-ts start --workspace . --target next --until converged --worker process://codex`
- use `node_modules/.bin/odd-sdlc-ts start --workspace . --target next --until blocked` only when you intentionally want a bounded frontier inspection rather than full ABG-owned graph execution
- inspect the RC surface with `node_modules/.bin/odd-sdlc-ts rc-report`
- ABG command binding: `node_modules/.bin/genesis-ts`
- ABIogenesis command binding: `node_modules/.bin/abiogenesis-ts`
- if `start` returns `fp_worker_unattached`, the traversal stopped lawfully because no live worker transport was attached; that is not completion
- do not add ad hoc traversal loops or scripts when answering operator `start` requests

## Interpretation Rule
- substrate truth explains how work is executed
- governance truth explains how this project is operated
- imported project sources explain what the project is
- copied template history is provenance unless imported authority makes it project-defining

If those layers disagree, imported project authority wins for project identity,
and GTL/ABG plus `odd_sdlc` govern how work proceeds over that authority.