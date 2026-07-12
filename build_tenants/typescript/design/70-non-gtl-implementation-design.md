# TypeScript Non-GTL Implementation Design

**Status**: Implemented predecessor slice; superseded by `90-admitted-semantic-steel-thread-design.md`
**Date**: 2026-07-12
**Tickets**: T-023, T-026, T-028

## Boundary

This module pack records the deterministic implementation that preceded the
accepted GTL catalog. Its modules remain current where adopted by the successor
design.

At this phase it did not implement graph functions, jobs, a GTL module, runtime
catalog, model invocation transport, ABG traversal, or semantic publication
workflow. The successor design now supplies those surfaces.

## Prime Module Map

| Module | One responsibility | Depends on |
| --- | --- | --- |
| `domain/canonical.ts` | RFC 8785 serialization and SHA-256 identity | Node crypto, `json-canonicalize` |
| `domain/semantic_memory.ts` | One type authority for mesh/context carriers | none |
| `domain/exact_refs.ts` | Exact-ref and uniqueness invariants | canonical and carrier types |
| `mesh/semantic_mesh.ts` | Link construction, bounded-cut closure, local impact | exact-ref utilities |
| `context/context_memory.ts` | Basis, projection, staleness, invocation attribution | exact-ref utilities |
| `storage/physical_cut_store.ts` | Technology-neutral effect port and protocol codecs | canonical and shared carrier types |
| `index.ts` | One public TypeScript projection over the modules | module exports only |

The modules are independently testable but share one carrier and digest truth.
No module duplicates exact-ref, fidelity, loss, or digest semantics.

## Cross-Tenant Boundary

`PhysicalCutStore` remains the only TypeScript dependency direction toward
physical storage. The successor slice adds one explicit
`PythonPhysicalCutStore` process adapter whose deployment-owned constructor
configuration supplies executable and catalog paths; request payloads cannot.

## Negative Closure

Tests fail when:

- a link endpoint differs from the selected exact cut;
- a bounded cut includes unresolved link identity;
- an impact seed is outside the cut;
- a context basis expands beyond its mesh cut;
- a projection adds, changes, or silently drops a ref;
- declared fidelity contradicts omissions/loss;
- an invocation names a different basis or projection;
- an attestation digest or snapshot identity is tampered with; or
- a storage table identifier can escape its validated namespace.

## Proof Classification

`npm test` and `npm run typecheck` prove deterministic module and protocol
contracts. They do not prove GTL publication, rc.3 target resolution, ABG
admission/events/replay, end-to-end semantic acceptance, or release closure.
The exact local dependency resolution is recorded in
`build_tenants/typescript/DEPENDENCY_RESOLUTION.md` and `package-lock.json`.
