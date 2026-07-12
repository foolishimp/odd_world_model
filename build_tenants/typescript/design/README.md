# odd_world_model TypeScript Tenant Design

This directory defines TypeScript realization `HOW` for the singleton Product
authority under `specification/`.

## Current Entry Point

Read in this order:

1. `build_tenants/common/design/WORLD_MODEL_COMMON_ARCHITECTURE.md`
2. `build_tenants/common/design/adrs/ADR-WM-001-source-decomposition-and-build-boundaries.md`
3. `build_tenants/common/design/adrs/ADR-WM-002-semantic-memory-and-authority-boundaries.md`
4. `build_tenants/common/design/adrs/ADR-WM-003-iceberg-storage-and-cut-attestation.md`
5. `adrs/ADR-006-exact-rc3-proving-substrate-and-migration-seam.md`
6. `90-admitted-semantic-steel-thread-design.md` for the target migration design
7. `95-rc3-reference-bridge-as-built-review.md` for the current axiom backfill
8. `80-current-full-build-design.md` for the superseded component-qualified
   as-built record

Accepted ADR-WM-004 and
`build_tenants/common/design/GTL_GRAPH_FUNCTION_CONTRACTS.md` define the
implemented GTL catalog and closure contracts.

## Current Position

TypeScript is the forward WM domain realization tenant. It owns local semantic
carrier types, deterministic validation, publication meaning, mesh/context
meaning, and technology-neutral effect ports.

The first physical writer is a bounded Python PyIceberg adapter. It receives
already-admitted write requests and returns exact physical snapshot evidence.
It has no semantic, traversal, or closure authority.

The current runnable graph proof uses exact ABIogenesis `4.6.0-rc.3` with
`odd_glc 0.1.0` behind `substrate_binding/`. This is an incremental proving
resolution with a migration seam, not Product tethering.

## Implementation State

The current correction binds a preconstructed semantic payload by exact ref and
digest, derives admission from canonical ABG events, separates WM acceptance
from ABG closure, and permits query only over a published cut with admitted
physical evidence. ABG remains the only runtime traversal owner; there is no
product-local iteration loop. Native WM payload execution by the selected
GraphFunction and calibrated F_P authorship remain migration gaps.

## Retained Inputs

The earlier feature, architecture, module, proof, sandbox, and ADR files remain
lineage evidence. Their active-target, old-handle, odd_sdlc-runner, and
filesystem-first claims are superseded by
`60-current-rc3-design-rebase.md`. ADR-003 and ADR-005 retain useful
reference-derivation and semantic-lineage decisions as refined by common
architecture.

Generated overlay files are planning read models. They are not design
authority and do not participate in the accepted ADR sequence.
