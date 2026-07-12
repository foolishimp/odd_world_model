# T-026 Full-Build Review Surface

**Kind**: Handoff
**Date**: 2026-07-12 Australia/Sydney
**Tickets**: T-023, T-026, T-028, T-029, T-030
**Closure authority**: Not claimed; final adversarial review remains F_H work

## Delivered Slice

- accepted common architecture and ADR-WM-004 GTL catalog;
- seven public GraphFunctions, five private publication refinements, seven
  jobs, three roles, one module, one overlay, and one runtime catalog;
- exact ABIogenesis `4.6.0-rc.3` and odd_glc `0.1.0` bindings isolated under
  `substrate_binding/`;
- zero-issue rc.3 conformance over seven functions and eleven vectors;
- ABG public-start, registry selection, canonical event, replay, and odd_glc
  interpretation proof for every public handle;
- pure semantic-link, reference-preserving composition, bounded-mesh,
  context-basis/projection, staleness, invocation, and query kernels;
- versioned TypeScript/Python physical-cut protocol and explicit
  `PythonPhysicalCutStore` effect adapter;
- six-table PyIceberg cut with exact snapshot-vector attestation;
- independent PyIceberg and DuckDB exact-historical-snapshot verification; and
- a 116-row requirement proof-candidate ledger with no closure inferred from
  aggregate test counts.

`odd_world_model.map_domains` remains cataloged and deferred. No executable or
runtime declaration was invented for it.

## Corrected During Finalization

### F_P Runtime Truth

`interpret_context` previously declared an F_P composition but fell through to
the basis F_D default. The vector now carries the registered
`abg.runtime_regime=F_P` declaration. The proof supplies an admitted rc.3
instruction plan and deterministic attached-result adapter, then observes:

- F_P traversal selection from the graph-vector declaration;
- `fp_dispatch_requested`;
- attached result observation and admission;
- F_P evaluation attributed to
  `abg.fn_composition://odd_world_model/interpret-context`;
- F_D consequence; and
- assessed vector closure.

This proves the substrate path. It does not claim a production LLM or model
provider.

### DuckDB Exact-Snapshot Proof

ADR-WM-003 required DuckDB historical readback, but the earlier slice used only
PyIceberg verification. The storage effect now also reads the attested metadata
URI with the attested `snapshot_from_id`, with unsafe version guessing disabled,
and recomputes the same canonical physical-envelope digest.

Current exact identity:

- DuckDB `1.4.5` LTS;
- Iceberg extension `2f229463`, signed `core` repository;
- local macOS ARM64 extension SHA-256
  `fefbc8dbf9c58c1ec6e1c443bd4fdd99f0958a84a62e795629b12b9508691f1e`.

The extension binary identity is development proof, not a portable release
lock.

## Verification

Current direct verification:

- TypeScript strict typecheck: pass;
- TypeScript tests: 27 pass;
- Python tests: 11 pass;
- Python compileall: pass;
- Python dependency check: pass;
- rc.3 GTL conformance: pass, zero issues;
- raw/repeated public-start event sequences: equal for all seven handles; and
- persisted proof-file hashes: independently checked after generation.

The proof bundle is:

`build_tenants/typescript/test_env/proof/20260712T000000Z_full-build-v1/`

It claims development exact-substrate and integrated first-slice evidence only.

## Active Ticket Disposition

- T-023: first bounded mesh slice implemented and proved; final review only.
- T-026: MVP development slice implemented; release/install and
  requirement-level closure remain open.
- T-028: common architecture implemented by the slice; final design review
  only.
- T-029: owner-selected catalog implemented exactly; final decision-record
  review only.
- T-030: bounded physical effect plus independent exact-snapshot proof
  implemented; final review only.
- T-024: backlog; operational semantics enrichment remains deferred.

No active ticket was moved to completed because F_H requested full reviews on
return.

## Honest Residuals

1. rc.3's generic target carrier is not the WM semantic payload. The steel
   thread binds semantic values to exact graph-call/event refs without claiming
   payload identity.
2. The F_P adapter is deterministic proof, not production provider integration.
3. `map_domains` and treatment authorship remain deferred.
4. Production REST catalog/object storage, concurrency, security, and orphan
   snapshot repair remain downstream.
5. The source worktree is dirty and uncommitted. No immutable release cut,
   install, or release authority is claimed.
6. The 116 requirement rows are review candidates. Release requirements remain
   open and other families still need F_H requirement-level disposition.

## Review Order

1. `specification/GOALS.md`, `INTENT.md`, and `PRODUCT.md`.
2. `build_tenants/common/design/WORLD_MODEL_COMMON_ARCHITECTURE.md` and ADRs
   WM-001 through WM-005.
3. `build_tenants/common/design/GTL_GRAPH_FUNCTION_CONTRACTS.md`.
4. `build_tenants/typescript/design/80-current-full-build-design.md`.
5. GTL module/catalog and `substrate_binding/` implementation.
6. semantic, mesh, context, storage, query, and steel-thread tests.
7. persisted proof manifest and requirement proof-candidate ledger.
8. active-ticket closure decisions in the order T-029, T-028, T-023, T-030,
   then T-026.
