# ADR-WM-005 Storage Effect Protocol

**Status**: Accepted for the incremental proving slice
**Date**: 2026-07-12
**Scope**: Cross-tenant physical-cut request/result transport and deterministic effect contract
**Tickets**: T-028, T-030

## Context

ADR-WM-003 selects a TypeScript domain line and a bounded Python PyIceberg
writer. A polyglot boundary is useful only when it is explicit, replayable,
replaceable, and unable to become a second controller or semantic authority.

The first slice also needs honest behavior for multi-table publication.
Iceberg commits are table-local. A failed multi-table write can leave physical
snapshots that are not a published WM cut.

## Decision

### Protocol Shape

The local proving adapter uses UTF-8 JSON Lines over standard input/output:

```text
one request line -> one response line -> process exit
```

The adapter accepts `write_cut` and `verify_cut` operations. Standard output
contains only the protocol response. Diagnostics use standard error. Empty,
multiple, malformed, unsupported, or schema-invalid requests fail closed with
a typed result. Exit status `2` means the one response line is a typed failure;
consumers decode that line before classifying the process outcome as a transport
failure.

Direct process invocation is permitted in adapter contract tests only. The
eventual product runtime must invoke the effect through the accepted GTL/ABG
effect or plugin boundary. The adapter never selects next work or owns a
continuation.

### Configuration

Catalog and warehouse location are deployment configuration, not request
authority. The first adapter reads:

- `OWM_ICEBERG_CATALOG_NAME`;
- `OWM_ICEBERG_CATALOG_URI`;
- `OWM_ICEBERG_WAREHOUSE_URI`; and
- `OWM_STORAGE_RECEIPT_ROOT`.

Requests name a design-approved storage profile ref but cannot supply file
paths, catalog credentials, or arbitrary backend configuration.

### Physical Record Envelope

Each requested logical table carries records with a stable `record_id`, a
`record_kind`, and a JSON object payload. The adapter stores a fixed physical
envelope:

```text
write_request_id
request_digest
admission_ref
semantic_cut_ref
semantic_cut_digest
record_ordinal
record_id
record_kind
payload_json
payload_sha256
admitted_at
```

This envelope is a first-slice storage representation, not the final analytical
schema. It preserves exact payload and lineage while table-specific physical
models are priced later.

### Canonical Digests

Protocol digests use SHA-256 over RFC 8785 JSON Canonicalization Scheme bytes:

- UTF-8 encoding;
- object keys and numbers canonicalized by RFC 8785;
- array order retained;
- non-finite numbers rejected; and
- the digest field itself omitted from its digest input.

The digest input is the received protocol object before model defaults,
null-removal, or other normalization. Digest strings use exact
`sha256:<lowercase-hex>` syntax. Invalid or uppercase values are rejected, not
case-normalized and echoed.

### Attestation And Observation Split

`SemanticCutAttestation` contains exact cut, snapshot, basis, and lineage
identity. It contains no `verified` state or other provider-authored assurance.
Its digest can be constructed before readback because the digest claims only
the identity of the candidate physical cut.

After construction, PyIceberg and DuckDB independently reproduce every named
snapshot. The adapter then emits a separate `PhysicalEffectObservation` with
the exact subject-attestation identity, observer identity, observation time,
aggregate status, and actual per-snapshot results. A successful write result
carries both objects. A failed
post-write observation carries the failed observation and completed physical
snapshot refs but emits no attestation as a successful result.

The observation is provider output offered to ABG. It is not semantic
acceptance, event admission, publication, or closure.

### Idempotency And Receipts

`write_request_id` is the idempotency identity. The adapter stores a small
local effect receipt after complete physical reproduction. A repeated request
with the same identity and digest reruns the observation and returns the
original exact snapshot vector. A repeated identity with a different digest
fails closed.

Receipts are physical-effect evidence only. They do not publish semantic truth
or replace the admitted `SemanticCutAttestation`.

If a process fails before receipt creation, each stored row still carries the
request identity. The adapter may recover an exact matching table commit. A
mismatch produces a typed gap; it is never overwritten silently. Recovery
first resolves exact request identity from snapshot summary properties and
scans rows only for a matching snapshot.

### Multi-Table Failure

The adapter cannot claim cross-table atomicity. It performs table commits,
captures exact snapshots, constructs a candidate attestation, and reads each
named snapshot back. A successful result is emitted only after the separate
physical observation reproduces every snapshot.

On failure it returns:

- one typed gap;
- whether retry is lawful; and
- any completed but unadmitted physical snapshot refs.

Those snapshots are orphans until ABG-governed repair reuses or cleans them.
They are not published WM cuts.

### Identifier Boundary

The first adapter accepts only lowercase Iceberg identifiers of the form
`namespace.table` with ASCII letters, digits, and underscores. Record IDs and
semantic refs are data, not path fragments. No request value is interpolated
into a filesystem path other than through validated identifier mapping.

## Versioned Schemas

The protocol is governed by:

- `physical_cut_write_request.schema.json`;
- `physical_cut_write_result.schema.json`;
- `physical_effect_observation.schema.json`;
- `physical_cut_verify_request.schema.json`;
- `physical_cut_verify_result.schema.json`;
- `physical_cut_protocol_error.schema.json`;
- `semantic_cut_attestation.schema.json`; and
- `typed_gap.schema.json`.

Any incompatible protocol change requires a new schema version and an explicit
adapter compatibility decision.

## Consequences

- Python remains a replaceable deterministic effect adapter.
- Cross-language tests can compare exact canonical requests and responses.
- Multi-table partial failure is visible instead of falsely atomic.
- Local receipt recovery provides practical idempotency without creating a
  second semantic ledger.
- The fixed record envelope favors faithful proving over analytical layout.

## Acceptance

- malformed or multiple requests fail closed;
- stdout contains exactly one response object;
- request identity cannot be reused with different content;
- every successful result carries an assurance-neutral attestation and a
  reproduced physical-effect observation closing the same snapshot vector;
- every failed partial write declares completed physical refs;
- configuration cannot be selected by request payload;
- direct process invocation is labelled adapter proof only; and
- no GTL function, runtime loop, semantic acceptance, or closure decision is
  implemented by the adapter.
