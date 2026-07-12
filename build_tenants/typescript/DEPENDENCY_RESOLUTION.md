# TypeScript Tenant Dependency Resolution

**Status**: Current exact proving resolution
**Date**: 2026-07-12
**Ticket**: T-026

The deterministic and cross-language contract proof used:

- Node.js `24.7.0`;
- TypeScript `5.9.3`;
- `@types/node 24.13.3`;
- `fast-xml-parser 5.10.0` for namespace-aware FpML parsing without
  regular-expression tag traversal;
- `fast-xml-validator 1.2.0` for bounded XML syntax and document-type checks
  before semantic extraction;
- `json-canonicalize 2.0.0`;
- Ajv `8.20.0`;
- `ajv-formats 3.0.1`; and
- `@abiogenesis/typescript-tenant 4.6.0-rc.3` from the immutable local release
  snapshot with SHA-256
  `9cffb372c0dfc00983a5d0e882efbc3d0c3ac937a56f313000f35a4473358113`;
- `@odd-glc/route-one-typescript 0.1.0` from the immutable local release
  snapshot with SHA-256
  `7e548f92ecd6b4442f9c9f1feb46dd2edd7e9610a7dae8706482fc65d80fa578`;
- the exact integrity-pinned graph in `package-lock.json`.

The local tarball paths select released artifacts, not mutable sibling source.
The package lock records npm integrity independently from the source snapshot
SHA-256 values above. Product specification remains version-floating; this
tenant resolution is the bounded proving adapter selected by F_H.

Code that imports either package is confined to `code/src/substrate_binding/`.
That adapter must record package identity, startup binding, catalog resolution,
conformance, events, and compatibility evidence without leaking rc.3 shapes
into WM semantic carriers.
