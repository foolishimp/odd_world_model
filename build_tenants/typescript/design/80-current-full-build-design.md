# TypeScript Current Full-Build Design

**Status**: Superseded as a product-integration claim; retained as component-qualified as-built design
**Date**: 2026-07-12
**Tickets**: T-023, T-026, T-028, T-029, T-030
**Substrate resolution**: ABIogenesis `4.6.0-rc.3` with odd_glc `0.1.0`

## Authority

This design realizes accepted common architecture and ADR-WM-004. Product
meaning remains in `specification/`; this surface defines TypeScript `HOW`.

The target product integration correction is defined by
`90-admitted-semantic-steel-thread-design.md`; the current reference-bridge
backfill is `95-rc3-reference-bridge-as-built-review.md`. This file remains the
as-built record for the earlier component wave and must not be cited as
end-to-end semantic publication proof.

The exact dependency resolution is a proving adapter, not Product tethering.
All imports from ABIogenesis or odd_glc are confined to `substrate_binding/`.

## Constructive Carrier

The first runnable catalog publishes:

1. `odd_world_model.publish_domain_model`
2. `odd_world_model.publish_semantic_links`
3. `odd_world_model.compose_world_model`
4. `odd_world_model.resolve_mesh_cut`
5. `odd_world_model.project_context`
6. `odd_world_model.interpret_context`
7. `odd_world_model.query_world_model`

`publish_domain_model` is one composed public GraphFunction containing five
private refinement vectors. Private refinements are not runtime registry
entries or public jobs. `odd_world_model.map_domains` remains cataloged as a
deferred contract with no GraphFunction or runtime declaration.

The GTL module contains seven public GraphFunctions, seven jobs, three roles,
eleven graph vectors, one domain-publication refinement boundary, and one typed
context prompt asset. The machine-readable catalog is derived from the same
GraphFunction objects used by the module and runtime declarations.

## Module Map

| Module | Responsibility |
| --- | --- |
| `gtl/` | Typed assets, functions, module, jobs, roles, catalog, startup declarations |
| `substrate_binding/` | Exact product binding, rc.3 API facade, conformance, public start, GLC interpretation |
| `domain/` | Canonical identity, exact refs, semantic-memory carriers, reference-preserving composition |
| `mesh/` | Admitted semantic-link publication, finite cuts, connected composition, dependency-local impact |
| `context/` | Immutable basis, loss-declared projection, catalog-derived staleness, attributed invocation |
| `storage/` | Technology-neutral port, protocol codecs, explicit Python process adapter |
| `query/` | Bounded root/selector/closure traversal over an exact basis and attested snapshot vector |
| `proof/` | Development proof generation; no product traversal authority |

## Runtime And Data Boundary

ABIogenesis public `start` owns registry admission, target selection, graph
calls, C-call stages, vector closure, and canonical events. odd_glc interprets
the emitted registry and traversal truth. WM pure kernels own semantic values.
PyIceberg owns only admitted physical effects.

`interpret_context` declares `abg.runtime_regime=F_P` on its graph vector. The
development probe supplies an rc.3 instruction plan plus a deterministic
attached-result adapter and proves an F_P traversal followed by F_D consequence
and vector closure. It does not prove that the F_P turn authored the semantic
payload, and it does not claim a production model provider or live LLM
invocation.

The current rc.3 generic target carrier is not represented as the WM semantic
payload. The earlier integrated proof attached unrelated graph-call/event refs
to locally constructed semantic values and is therefore component-composition
evidence only. The correction binds exact candidate refs and digests through
the public start input/evidence contract. Admission witnesses derive from
canonical events; accepted and published WM objects remain local deterministic
projections over those witnesses pending native-carrier migration.

## Storage And Query

`PythonPhysicalCutStore` receives executable, module root, catalog, warehouse,
receipt, and profile configuration at construction. The request cannot select
those deployment paths. One write produces an assurance-neutral attestation
over the complete table snapshot vector plus a separate physical-effect
observation produced only after PyIceberg and DuckDB reproduce those exact
snapshots. The attestation contains no provider-authored assurance state.

Query receives an attestation, context basis, context projection, exact mesh,
admitted publication/link catalogs, and a versioned root/selector/closure
contract. It executes the bounded traversal and projects exact traversed node,
link, and snapshot vectors. It never substitutes current table state, exceeds
the admitted basis, or publishes semantic truth.

## Proof

The current development proof lives under:

`test_env/proof/20260712T000000Z_full-build-v1/`

It records:

- exact release-product identities and tarball hashes;
- zero-issue rc.3 conformance;
- raw and repeated-run ABG event logs for all seven public targets;
- GLC target-selection projections;
- TypeScript and Python verification output;
- event and artifact hashes; and
- dirty source state with release authority explicitly not claimed.

The superseded component wave recorded 33 TypeScript tests. The corrected
current proof records 34 TypeScript tests and 22 Python tests. Every
attested table is reproduced at its exact snapshot through both PyIceberg and
the pinned DuckDB Iceberg extension. The raw and repeated-run ledgers each
contain 402 canonical events because every public probe now runs to convergence
and `publish_domain_model` traverses all five refinements. `interpret_context`
contributes one replay-visible `fp_dispatch_requested` event and one admitted
attached result in each run.

The earlier integrated test persists a six-table composed semantic cut,
verifies every historical snapshot, and projects a query over the exact
attestation. It does not prove semantic payload traversal or publication and is
superseded by the reference-bound semantic contract thread.

## Open Closure

- final adversarial review and requirement-by-requirement disposition;
- clean committed source and immutable release-cut proof;
- installed-product proof beyond local exact package installation;
- production catalog/object-store topology;
- production LLM/model-provider integration;
- executable `map_domains`; and
- direct runtime binding of WM semantic payloads to rc.3 target carriers.

These are explicit residuals. They do not invalidate the development slice and
must not be hidden by a release claim.
