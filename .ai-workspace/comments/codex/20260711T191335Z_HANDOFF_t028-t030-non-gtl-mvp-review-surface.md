# Handoff: T-028 Through T-030 Non-GTL MVP Review Surface

**Date**: 2026-07-12 Australia/Sydney
**Agent**: Codex
**State**: Implementation complete within the authorized non-GTL boundary;
full review pending

## Authority State

- T-027 is completed by F_H ruling.
- T-024 is backlog, not an active deferred ticket.
- T-023 is specification/common-design complete; pure mesh carriers and local
  impact checks are implemented, while integrated GTL/ABG proof remains open.
- T-026 has completed the authorized non-GTL TypeScript slice and remains
  active for reviewed GTL realization and integrated proof.
- T-028 common architecture is complete pending full review.
- T-029 contains proposed GraphFunction contracts only. No GTL code exists.
- T-030 PyIceberg effect implementation and deterministic proof are complete
  pending full review.

## Design Delivered

- current common architecture and complete requirement-to-design allocation;
- accepted semantic-memory/authority, storage/attestation, and storage-protocol
  ADRs;
- proposed public/private GTL catalog and cumulative-environment contracts;
- current TypeScript rc.3 rebase and exact-substrate migration ADR;
- current non-GTL TypeScript implementation design;
- bounded Python storage implementation design;
- legacy common and TypeScript surfaces classified as current, retained input,
  superseded readback, or historical evidence; and
- active T-026 compressed to current authority instead of odd_sdlc-era history.

## Implementation Delivered

### TypeScript

- RFC 8785 canonical JSON and SHA-256 identity;
- one semantic carrier type authority and exact-ref utility;
- semantic-link construction, bounded-mesh closure, and dependency-local impact;
- context basis, closed loss-declared projection, staleness evidence, and exact
  invocation attribution;
- versioned `PhysicalCutStore` request/result contracts and codecs;
- strict common-schema compilation and instance validation; and
- cross-language write plus verify proof against the Python adapter.

### Python Storage Effect

- strict request, result, attestation, and gap models;
- deployment-owned SQLite catalog/local warehouse configuration;
- explicit stable Iceberg field IDs and schema fingerprint;
- exact snapshot writes and historical readback;
- full physical-envelope digests including request and admission identity;
- idempotent receipts plus exact lost-receipt recovery;
- typed partial-write evidence without false multi-table atomicity; and
- one-request/one-response JSONL CLI with stdout framing discipline.

## Verification

- TypeScript: 13/13 tests pass.
- TypeScript strict compile: pass.
- Python storage: 10/10 tests pass.
- Python `compileall`: pass.
- Python `pip check`: no broken requirements.
- Common Draft 2020-12 schemas: all compile by their declared `$id`; current
  semantic and storage instances validate.
- Specification: 116 requirement definitions, no duplicate definitions, and no
  unresolved concrete requirement refs.
- Acceptance trace: all 29 modified tracked requirement IDs and all 12 new
  context-memory IDs occur in UAT, testcase-authority, and scenario surfaces.
- Tickets: no duplicate ticket IDs across active/backlog/completed.
- `git diff --check`: pass.
- No added GTL function/job/module/catalog implementation file exists.

## Deliberately Open

1. F_H full review and disposition of ADR-WM-004 function names, public/private
   granularity, mapping/query scope, and invocation/acceptance boundaries.
2. GTL GraphFunction, Job, Module, and runtime catalog materialization after
   that acceptance.
3. Exact ABIogenesis `4.6.0-rc.3` plus `odd_glc 0.1.0` substrate adapter,
   conformance, binding target resolution, canonical event, ABG admission,
   replay, correction, and closure proof.
4. Integrated retained-domain semantic publication, mesh, context, storage,
   query, and installed-product proof.
5. DuckDB exact-snapshot query proof, REST catalog/object storage evolution,
   production security/operations, mapping execution, and operational
   enrichment.

The retained Python product suite is not currently runnable in this workspace:
with its source root supplied, collection reaches a missing external `genesis`
package. This is historical substrate availability, not a failure in the new
storage tenant. No attempt was made to restore or deepen that retired runtime.

## Review Order

1. `specification/INTENT.md`, `PRODUCT.md`, requirements, and scenarios.
2. `WORLD_MODEL_COMMON_ARCHITECTURE.md` and ADR-WM-001 through ADR-WM-005.
3. ADR-WM-004 plus `GTL_GRAPH_FUNCTION_CONTRACTS.md` for owner decisions.
4. TypeScript `60`/`70` design and module/test surfaces.
5. Python storage implementation design, code, lock, and tests.
6. T-023, T-026, T-028, T-029, and T-030 closure/readiness decisions.
