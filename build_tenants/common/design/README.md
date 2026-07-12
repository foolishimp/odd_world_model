# Common Tenant Design

Shared realization design for this project lives here.

Use this surface only for design law that genuinely applies across multiple
build tenants.

## Current Authority

- `WORLD_MODEL_COMMON_ARCHITECTURE.md`
- `REQUIREMENT_DESIGN_TRACE.md`
- `adrs/REGISTRY.md`
- `adrs/ADR-WM-001-source-decomposition-and-build-boundaries.md`
- `adrs/ADR-WM-002-semantic-memory-and-authority-boundaries.md`
- `adrs/ADR-WM-003-iceberg-storage-and-cut-attestation.md`
- `adrs/ADR-WM-004-gtl-graph-function-catalog.md`
- `adrs/ADR-WM-005-storage-effect-protocol.md`

ADR-WM-004 is the accepted public/private GTL catalog decision. Its executable
first-slice realization lives in the TypeScript tenant; `map_domains` remains
contracted and deferred.

## Retained Inputs

- `ATTRIBUTE_LEDGER_BUILD_LINE.md` preserves the semantic build-line analysis.
- `MULTI_DOMAIN_MAPPING_LINE.md` owns downstream mapping design pressure.
- `INSTALLER_CONVERGENCE_LINE.md` preserves downstream release/install input.

## Superseded Or Historical

- `WORLD_MODEL_REPRESENTATION_TENANT.md` is superseded as current carrier
  topology; JSON schemas remain compatibility and fixture assets.
- `CURRENT_QUERY_TRAVERSAL_SLICE.md` is superseded as current storage/query
  topology; query subordination remains adopted.
- `ODD_GTL_ATTRIBUTE_LEDGER_CARRIER.md` is historical Python GraphFunction
  evidence and does not choose the new public catalog.
- `ODD_SDLC_DOGFOOD_LINE.md` is historical governance proof from the retired
  operating line.
