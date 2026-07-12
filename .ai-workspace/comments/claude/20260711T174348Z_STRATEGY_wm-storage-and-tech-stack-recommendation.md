---
kind: strategy
agent: claude
date: 2026-07-11T17:43:48Z
ticket: T-027
authority: commentary (per POSTING_GUIDE.md)
---

# STRATEGY: WM Tech Stack Recommendation — TypeScript Product Line, Polyglot Storage Tier

**Author**: claude
**Date**: 2026-07-11T17:43:48Z
**Addresses**: T-027 (storage realization direction); 2026-07-12 operator session (WM code review + stack ratification); WORLD_MODEL_METHOD; the ABG cut/replay attestation law
**Status**: Open

## Summary

Operator-ratified direction from the 2026-07-12 session. The WM product line
stays TypeScript on the GTL/ABG/GLC path; the storage tier is deliberately not
TypeScript-bound. Endstate: Apache Iceberg as the ledger/cut manager, an
Avro/Parquet format split that coincides with the truth boundary, and git as
the constitutional spine pinning cuts — never the bulk store. This post
describes target direction, with current reality noted where it diverges.

## Analysis

### 1. Product line stays TypeScript

WM sits on the existing substrate: GTL/ABG via `@abiogenesis/typescript-tenant`
under the 4.6-generation law, with GLC 0.1 as the base lifecycle layer. WM is a
declarations-only domain package on the GLC path — no product runtime, no
product CLI. Execution goes through `genesis-ts start` over published graph
functions. Per the 2026-07-12 code review: the domain assets and Markov-object
payloads survive as the node-type catalog; local evidence, assurance, and
ledger minting die — ABG owns that truth.

### 2. Storage tier is polyglot by design

The storage tier is deliberately not TypeScript-bound. Endstate: Apache
Iceberg as the ledger/cut manager. Iceberg's immutable snapshots ARE the
material self-consistent cuts. Schema evolution is first-class. Time-travel is
replay-derived projections at any cut.

### 3. Format split coincides with the truth boundary

- **Avro** for append-only event ledger segments: row-oriented,
  schema-carrying, evolution-mature.
- **Parquet** for replay-derived read models — Markov objects, world
  fragments, query surfaces: columnar, predicate pushdown, nested-shape
  capable.

Admissible simplification: start all-Parquet (the Iceberg default) and
introduce Avro when append rates demand it.

### 4. Git is the constitutional spine, never the bulk store

A material cut is a git commit pinning: Iceberg snapshot ID + schema
fingerprints + governing spec ref. Kilobytes per cut. This is the same law as
ABG's `eventLogSha256`/replay attestation. Kafka is admissible as transport
only — offsets are not cut material. RDS/Postgres is admissible as a
serving/read-model tier only. Neither holds truth authority.

### 5. Adoption ladder

1. **First slice**: pyiceberg + SQLite catalog + local-filesystem warehouse;
   DuckDB for SQL over cuts.
2. **Multi-consumer**: REST catalog + MinIO via docker compose.
3. **Production**: same format, object store.

Known gap: there is no mature TypeScript Iceberg writer. Ledger writes land in
a Python F_P worker behind a declared operator boundary. This is lawful — F_P
workers are polyglot — and must be recorded in T-027.

### 6. Why

WM blurs application, data, and processing into a governed memory bank for LLM
context. Markov objects are declared-loss compression of source systems. Every
LLM invocation reasons as-of a pinned cut — context provenance is basis
identity. The `stdo_compressed.md` digest-pinned authority compression is the
hand-built prototype of this pattern.

## Recommended Action

Commentary, not law. Ratification path is T-027 slice 1 (storage-realization
direction): adopt this stack recommendation into the ticket's design surface,
record the Python F_P Iceberg-writer boundary in T-027, and land the first
slice (pyiceberg + SQLite catalog + local FS + DuckDB) as the proving ground.
