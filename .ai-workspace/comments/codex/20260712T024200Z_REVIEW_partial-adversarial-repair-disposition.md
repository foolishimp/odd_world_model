# Partial Adversarial Review Repair Disposition

**Date**: 2026-07-12
**Scope**: non-GTL semantic-memory and physical-cut MVP review findings
**Tickets**: T-026, T-030
**Authority**: commentary and review evidence; not specification, design acceptance, ticket closure, or release authority

## Ruling

The review was correct on all four blocking findings. Each was reproduced before
repair. The four blockers now have direct adversarial regression tests and pass.
The proof bundle was regenerated after the repairs. Final requirement review,
release/install proof, and ticket closure remain open.

## Findings

| Finding | Disposition | Evidence |
| --- | --- | --- |
| 1. Request digest was recomputed after Pydantic normalization | Fixed. Request and attestation digests close over the received object before defaults or null handling. | `models.py`; omitted-optionals Python tests |
| 2. Post-append reload could bind a concurrent commit | Fixed. Binding uses the append-mutated table object, verifies snapshot summary identity, and resolves the metadata file whose current snapshot is the bound snapshot. | `store.py`; interleaved-commit Python test |
| 3. Mesh closure skipped absent or changed selected links | Fixed. One exact-link resolver now governs cut construction and affected closure; missing links, digest changes, duplicate catalog identities, endpoint drift, and mutated mesh cuts fail closed. Context-basis construction also recomputes the mesh-cut digest. | `semantic_mesh.ts`, `context_memory.ts`; missing/changed-link and stale-mesh TypeScript tests |
| 4. Language seam leaked untyped failures | Fixed. Configuration and unexpected adapter errors become operation-typed results; exit status `2` carries typed JSON; TypeScript validates full result shapes before exposure. | `service.py`, `cli.py`, `python_physical_cut_store.ts`, `physical_cut_store.ts`; decoder and exit-2 tests |
| 8. Recovery scanned every snapshot's data | Fixed beyond the blocking set. Snapshot summaries filter exact request identity before any row scan. | `store.py`; unrelated-summary no-scan test |
| 6-7. Digest parsing was lax and case-mutating | Fixed beyond the blocking set. One strict lowercase SHA-256 predicate governs failure echo. | `canonical.py`, `service.py`; uppercase-digest test |
| 9. Adapter mints generic `verified` vocabulary | Superseded by the subsequent full-build review. The assurance field is removed from the attestation and actual post-readback results now travel separately as `PhysicalEffectObservation`. | ADR-WM-005; Python implementation design; full-build follow-up review |
| 10. Recorded schema fingerprint was not checked | Fixed beyond the blocking set. Verification compares the attested fingerprint with the exact snapshot schema and the fixed v1 envelope. | `store.py`; schema-fingerprint tamper test |

The supplied partial summary did not state finding 5, so this disposition does
not invent or close it.

## Refreshed Evidence

- strict TypeScript compile: pass;
- TypeScript tests: 33/33 after the full-build follow-up;
- Python tests: 21/21 after the full-build follow-up;
- Python compileall: pass;
- Python dependency check: pass;
- GTL conformance issues: 0;
- public targets: 7;
- first-run/replay events: 267/267;
- exact proving products: ABIogenesis `4.6.0-rc.3`, odd_glc `0.1.0`;
- proof bundle: `build_tenants/typescript/test_env/proof/20260712T000000Z_full-build-v1/`;
- source state: dirty development workspace; release authority not claimed.

## Remaining Review Boundary

The repairs remove the partial review's blockers for the incremental physical
and semantic-memory slice. They do not prove immutable release installation,
production storage topology, production model-provider integration, deferred
`map_domains`, or requirement closure. T-026 and T-030 remain active pending
the planned full review.
