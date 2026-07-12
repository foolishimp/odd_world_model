# Requirement To Design Trace

**Status**: Current shared allocation
**Ticket**: T-028
**Date**: 2026-07-12

This register allocates every live requirement family to accepted shared design,
accepted GTL contract design, tenant-local realization design, or explicit
downstream deferment. It is a read model; requirements and ADRs remain
authoritative.

| Requirement family | Shared design owner | Tenant/downstream owner | State |
| --- | --- | --- | --- |
| `REQ-ODD-WORLD-MODEL-PRODUCT-001..010` | common architecture, ADR-WM-002 | T-026 package/install proof | Allocated |
| `REQ-ODD-WORLD-MODEL-WORLD-OBJECT-001..013` | ADR-WM-001, common architecture, ADR-WM-002 | T-026 schemas, constructors, promotion proof | Allocated |
| `REQ-ODD-WORLD-MODEL-BUILD-CAP-001..007` | common architecture; accepted ADR-WM-004/contracts for graph carriers | T-026 full first-slice realization | Reference-contract implementation; attribute ledger, saturation, and native runtime payload execution open |
| `REQ-ODD-WORLD-MODEL-CONTEXT-MEMORY-001..006` | common architecture, ADR-WM-002, ADR-WM-003, ADR-WM-004 | T-026 carriers, GTL invocation, storage, and query proof | Local kernel and exact-basis candidate evidence; native invocation/provider and final review open |
| `REQ-ODD-WORLD-MODEL-BUILD-CONSTRAINT-001..006` | ADR-WM-001, common architecture, ADR-WM-002 | T-026 module/effect enforcement | Allocated |
| `REQ-ODD-WORLD-MODEL-CONTEXT-MEMORY-CONSTRAINT-001..006` | common architecture, ADR-WM-002, ADR-WM-003 | T-026 negative and integrated tests | Proof candidate; final review open |
| `REQ-ODD-WORLD-MODEL-BUILD-VERIFY-001..009` | common architecture first-slice proof boundary | T-026 deterministic, integrated, exact-substrate, and persisted proof lanes | Candidate evidence only; full ledger chain, resolved Markov evidence, F_P authorship, and immutable release proof open |
| `REQ-ODD-WORLD-MODEL-ODD-CARRIER-001..012` | accepted ADR-WM-004 and GTL contracts | T-026 GTL module, runtime catalog, conformance, event, and deterministic attached-result F_P dispatch proof | Declarations, conformance, traversal, and reference transport present; native payload execution, production plugin resolution, GLC downstream carrier, and final review open |
| `REQ-ODD-WORLD-MODEL-MAPPING-CAP-001..010` | retained mapping design and proposed `map_domains` contract | T-026 later mapping slice | Defined, explicitly deferred |
| `REQ-ODD-WORLD-MODEL-MAPPING-CONSTRAINT-001..008` | retained mapping design, ADR-WM-002 one-truth law | T-026 later mapping slice | Defined, explicitly deferred |
| `REQ-ODD-WORLD-MODEL-MESH-CAP-001..010` | common architecture, ADR-WM-002, ADR-WM-003, ADR-WM-004 | T-026 carriers, impact, public GTL resolution, and context integration | Local deterministic implementation candidate; native GraphFunction execution and final review open |
| `REQ-ODD-WORLD-MODEL-MESH-CONSTRAINT-001..011` | common architecture, ADR-WM-002, ADR-WM-003 | T-026 negative/dependency-local tests | Proof candidate; final review open |
| `REQ-ODD-WORLD-MODEL-RELEASE-001..008` | retained installer design, ADR-WM-003 exact identities | T-026 release/install design | Downstream, owned |

## Open Proof And Release Gate

ADR-WM-004 and `GTL_GRAPH_FUNCTION_CONTRACTS.md` are accepted; their
declarations and reference-transport implementation are present. Final review
must reconcile individual requirement claims against the persisted development
proof and the failed as-built axiom checks. Native payload execution, immutable
clean-source, install, and release-cut proof remain open and cannot be inferred
from the development bundle.

## Deferred Does Not Mean Unowned

Mapping execution, operational semantics, production storage, and release
installation are outside the first implementation slice. Their requirements
remain live and their owners are named above. The first slice cannot claim them
closed.
