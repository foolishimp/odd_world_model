# Tenant Registry

This registry records the active project-owned realization tenants.

| Tenant | Kind | Root | Status | Notes |
| --- | --- | --- | --- | --- |
| `python` | realization | `build_tenants/python/` | Historical active/reference | Retained executable realization and comparison evidence; no new forward implementation work should deepen this line |
| `typescript` | realization | `build_tenants/typescript/` | Selected paused | Forward realization tenant; completed rc.3 reference evidence is retained while backlog T-026 waits for stable ABIogenesis 5.0 capability review |
| `storage/python` | supporting effect | `build_tenants/storage/python/` | Accepted supporting effect | Bounded PyIceberg physical-cut adapter accepted under completed T-030 and consumed by T-026; no semantic, GTL, traversal, or closure authority |

## TypeScript Grounding

The TypeScript tenant consumes the floating GTL/ABG and GLC contracts declared
by the product specification. Every concrete build and proof must record its
exact dependency identities and compatibility resolution.

For the current incremental concept-proving slice, F_H selected exact ABIogenesis
`4.6.0-rc.3` with `odd_glc 0.1.0`. This is a build/design resolution, not
timeless Product law. The implemented `substrate_binding/` preserves explicit
contract adapters and migration seams for the successor line.

The tenant also realizes T-023's repriced mesh law: typed semantic links,
finite purpose-bound mesh cuts, dependency-local change impact, and typed
reconciliation gaps over published world-model truth.

Native realization is paused. The tenant shall not add product-local traversal,
C-runtime, probabilistic result-admission, retry, replay, payload-ledger,
catalog, or install mechanisms while ABIogenesis 5.0 is delivering those
generic substrate capabilities.

The installed `3.7.1-rc.3` odd_sdlc-era workspace state is stale readback, not
current closure evidence. The current npm resolution, conformance report, ABG
event logs, and GLC projections are pinned to ABIogenesis `4.6.0-rc.3` and
odd_glc `0.1.0`.

The repository-root npm manifest is coordination-only and has no exports or
runtime dependencies. It cannot resolve or launch the stale installed line.

## Supporting Storage Tenant

The `storage/python` tenant implements accepted ADR-WM-003 and ADR-WM-005. It
accepts already-admitted physical-write requests and returns exact Iceberg
snapshot evidence. `PythonPhysicalCutStore` is the explicit TypeScript process
adapter; request payloads cannot select deployment configuration. Direct CLI
use remains contract-test tooling only.
