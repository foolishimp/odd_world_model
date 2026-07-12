# ADR-WM-003 Iceberg Storage And Cut Attestation

**Status**: Accepted for the incremental proving slice
**Date**: 2026-07-12
**Ticket**: T-028
**Implements**:
- REQ-ODD-WORLD-MODEL-PRODUCT-004
- REQ-ODD-WORLD-MODEL-PRODUCT-005
- REQ-ODD-WORLD-MODEL-CONTEXT-MEMORY-002
- REQ-ODD-WORLD-MODEL-CONTEXT-MEMORY-005
- REQ-ODD-WORLD-MODEL-CONTEXT-MEMORY-006
- REQ-ODD-WORLD-MODEL-CONTEXT-MEMORY-CONSTRAINT-002
- REQ-ODD-WORLD-MODEL-CONTEXT-MEMORY-CONSTRAINT-005
- REQ-ODD-WORLD-MODEL-MESH-CAP-003
- REQ-ODD-WORLD-MODEL-MESH-CAP-006
- REQ-ODD-WORLD-MODEL-MESH-CONSTRAINT-003
- REQ-ODD-WORLD-MODEL-MESH-CONSTRAINT-004
- REQ-ODD-WORLD-MODEL-RELEASE-005
- REQ-ODD-WORLD-MODEL-RELEASE-006
**Derives from**:
- INT-ODD-WORLD-MODEL-001
- PROD-ODD-WORLD-MODEL-001
- ADR-WM-002
- T-028
**Supersedes**:
- JSON/file/Git as canonical publication storage in `../WORLD_MODEL_REPRESENTATION_TENANT.md`
- direct filesystem query as the current target in `../CURRENT_QUERY_TRAVERSAL_SLICE.md`

## Context

F_H directed the current design to follow Claude's TypeScript plus polyglot
storage proposal and selected an incremental, easily migrated concept-proving
posture.

The proposal needs three authority corrections:

1. an Iceberg snapshot identifies one table state, not a complete WM semantic
   cut by itself;
2. a Python writer is a deterministic effect adapter, not F_P by language; and
3. ABG runtime events and WM semantic ledgers must not be replaced by a new
   storage-format event authority.

## Decision

### Forward Product And Storage Split

- TypeScript remains the forward WM domain/GTL realization tenant.
- Python hosts the first PyIceberg write adapter.
- The adapter accepts only admitted physical-write requests and returns typed
  effect results with exact snapshot identities.
- The adapter performs no semantic proposal, acceptance, traversal, or closure
  decision.

The TypeScript/Python transport must bind through the selected GTL/ABG operator
or plugin contract. It may not become a hidden controller.

### First-Slice Physical Stack

- Apache Iceberg is the table/snapshot layer.
- Parquet is the first-slice data-file format.
- PyIceberg performs table creation and commits.
- PyIceberg `SqlCatalog` with SQLite is the development catalog.
- A local filesystem warehouse is the development data store.
- DuckDB reads and proves exact Iceberg snapshots.
- Git stores schemas, governing refs, and small cut-attestation records. Git
  does not store bulk table data.

No exact package version is constitutional. Each build and proof locks and
records the exact versions it used.

### Semantic Cut Is An Attested Snapshot Vector

A WM semantic cut may span multiple Iceberg tables. Its physical identity is a
vector of exact table snapshots, not one current catalog pointer.

`SemanticCutAttestation` binds:

- one semantic cut ref and digest;
- every table identifier and exact snapshot ID;
- metadata locations and schema fingerprints;
- payload/content digests where available;
- source, authority, projection, graph invocation, and ABG event refs;
- temporal coordinates;
- fidelity, loss, exclusions, and typed gaps;
- exact dependency/build identities.

The attestation carries no provider-authored assurance state. Physical
reproduction results are a separate `PhysicalEffectObservation` offered to ABG
alongside the attestation.

Readers use the attested vector. Reading `latest`, guessing a metadata version,
or mixing current snapshots is fail-closed.

### Publication Commit Protocol

1. Receive an admitted physical-write request.
2. Write each participating Iceberg table.
3. Capture exact resulting snapshot and schema identities.
4. Construct the assurance-neutral semantic-cut attestation over the complete
   vector.
5. Reproduce the named snapshots through PyIceberg and DuckDB and retain the
   actual per-snapshot observations separately.
6. Offer both carriers to ABG for admission.
7. Expose the semantic cut only after the required ABG admission.

Partial or failed writes may exist physically but are not published WM cuts.
They produce effect-gap evidence and remain eligible for ABG-governed repair.

### Query Contract

DuckDB is the local SQL/proof consumer. Every query receives an admitted
semantic-cut attestation or exact context basis resolving to one. The Iceberg
extension reads explicit snapshot IDs or exact metadata versions. Unsafe
latest-version guessing stays disabled.

DuckDB results are projections and retain semantic-cut and snapshot refs.

### Event And Format Boundary

WM does not introduce an independent authoritative event ledger. ABG remains
the runtime event and admission authority. Avro may later encode an ABG-governed
transport/archive projection. Kafka may transport admitted events. Neither
format nor offset is cut identity or semantic authority.

Iceberg's own Avro metadata files are table-format internals, not a WM domain
event decision.

### Multi-Consumer Evolution

The next topology replaces development-only SQLite/local filesystem with an
Iceberg REST catalog and S3-compatible object storage. MinIO is acceptable for
integration proof. Production vendor, deployment, security, and operations
remain later decisions. Semantic-cut attestation does not change.

### Migration Seam

Tenant code consumes a `PhysicalCutStore` port with admitted request/result
contracts. PyIceberg, catalog, warehouse, and DuckDB bindings live behind
adapters. A later writer, catalog, or object store can replace them without
changing WM semantic carriers.

### Schema Evolution

Iceberg schema evolution is physical capability, not semantic compatibility
proof. Any change in WM meaning still requires versioned treatment, declared
fidelity/loss, and a new attested cut.

## Alternatives Considered

### Keep JSON And Git As Canonical Publication

Rejected for the forward line. JSON remains useful for ingress, fixtures,
compatibility, and projections.

### Use DuckDB As Canonical Storage

Rejected. DuckDB is the query/proof consumer. Making it publication authority
would collapse projection and truth.

### Use One Iceberg Snapshot ID As The WM Cut

Rejected because snapshots are table-level. A snapshot vector is required.

### Add A WM Avro Event Ledger

Rejected because it would duplicate ABG event authority.

## External Contract Evidence

- Apache Iceberg snapshots and table metadata:
  <https://iceberg.apache.org/spec/>
- PyIceberg catalog configuration and development-only SQLite guidance:
  <https://py.iceberg.apache.org/configuration/>
- PyIceberg table write API:
  <https://py.iceberg.apache.org/api/>
- DuckDB Iceberg snapshot reads and time travel:
  <https://duckdb.org/docs/current/core_extensions/iceberg/overview>
- DuckDB Iceberg write boundary through REST catalog:
  <https://duckdb.org/docs/current/core_extensions/iceberg/writing>

## Consequences

### Positive

- exact historical context is queryable without making Git the bulk store;
- local proof and multi-consumer evolution share one table format;
- storage is replaceable behind a stable semantic/effect port;
- TypeScript remains the domain implementation line; and
- Python is constrained to one explicit effect.

### Negative

- the first slice is polyglot;
- multi-table publication needs an attestation protocol;
- SQLite is not suitable for concurrent use;
- local and multi-consumer catalogs need separate proof; and
- unadmitted orphan snapshots need repair/cleanup policy.

## Non-Decisions

- exact dependency versions;
- production cloud/object-store vendor;
- production REST catalog implementation;
- partition strategy and table-level physical schemas;
- Avro event projection; and
- GTL graph-function names or granularity.

ADR-WM-005 subsequently resolves the first local TypeScript/Python transport
as a versioned one-request/one-response JSONL effect protocol. Production
plugin/transport selection remains deferred.

## Acceptance

- an exact attestation can identify every physical table snapshot;
- no consumer reads implicit latest state;
- SQLite/local filesystem is labelled development-only;
- the Python adapter has no F_P, semantic-acceptance, or continuation authority;
- ABG remains event/admission authority;
- Git stores only small governing and attestation assets; and
- the same semantic cut can later resolve through another catalog/store without
  changing Product identity.
