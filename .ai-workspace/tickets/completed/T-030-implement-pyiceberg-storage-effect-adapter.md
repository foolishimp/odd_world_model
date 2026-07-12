# T-030 Implement PyIceberg Storage Effect Adapter

- id: T-030
- title: Implement PyIceberg storage effect adapter
- type: feature
- ticket_category: supporting_tenant
- status: completed
- governance_method: STDO
- method_stack: SPEC_METHOD, TICKET_METHOD, DESIGN_MODULE_METHOD, ODD_METHOD, WORLD_MODEL_METHOD
- goal: proving-wave-07
- change_intent: implement the bounded Python PyIceberg physical-cut effect selected by accepted common architecture without introducing semantic, traversal, or GTL authority
- change_class: realization_refactor
- re_entry_point: build_tenants/storage/python/
- triaged_at: 2026-07-12
- priority: high
- execution_state: bounded_storage_effect_accepted
- review_status: accepted_under_F_H_close_direction
- proof_status: accepted_component_and_integrated_effect_evidence
- build_tenant: storage/python
- source_ticket: T-028
- dependencies: T-027 (completed), T-028 (completed accepted storage boundary), ADR-WM-003, ADR-WM-005
- affected_tickets: T-026
- links: basis:build_tenants/common/design/WORLD_MODEL_COMMON_ARCHITECTURE.md, basis:build_tenants/common/design/adrs/ADR-WM-003-iceberg-storage-and-cut-attestation.md, basis:build_tenants/common/design/adrs/ADR-WM-005-storage-effect-protocol.md, design:build_tenants/storage/python/design/IMPLEMENTATION_DESIGN.md, basis:build_tenants/common/schemas/physical_cut_write_request.schema.json, basis:build_tenants/common/schemas/physical_cut_write_result.schema.json, affected:T-026
- intake_source: F_H authority to implement as much governed work as possible; the later full-build direction accepted integration with the GTL slice
- affected_boundary: admitted physical persistence and exact snapshot observation only
- target_truth: one replaceable PyIceberg adapter that writes fixed record envelopes, keeps semantic-cut attestation identity separate from provider observation, detects conflicting idempotency, and reports partial physical effects honestly
- superseded_truth: Git/filesystem JSON as canonical publication and language-based classification of Python as F_P
- closure_law: implementation, unit tests, CLI contract tests, exact dependency record, and persisted local proof all pass review without claiming semantic or GTL closure
- non_closure_conditions: hidden controller, runtime loop, semantic acceptance, request-selected backend paths, implicit latest reads, false multi-table atomicity, untyped partial failure, or missing exact dependency evidence
- proof_surface: Python unit/integration tests, one-line CLI tests, exact snapshot readback, idempotent replay, conflicting replay rejection, malformed-request rejection, and dependency lock
- created_at: 2026-07-12
- updated_at: 2026-07-12 (full-build adversarial assurance correction complete)
- closed_at: 2026-07-12
- terminal_disposition: bounded_pyiceberg_effect_accepted

## Scope

Implement under `build_tenants/storage/python/`:

1. PyIceberg `SqlCatalog` plus SQLite/local warehouse configuration;
2. fixed physical record-envelope table creation and append;
3. exact snapshot capture and independent physical readback observation;
4. canonical request and attestation digest calculation;
5. local effect receipts and idempotent replay;
6. typed write/verify results including partial snapshots;
7. one-request/one-response JSONL CLI; and
8. deterministic tests and exact dependency evidence.

## Exclusions

- GTL functions, jobs, modules, and runtime catalogs;
- ABG traversal, event admission, replay, continuation, or closure;
- WM semantic proposal or acceptance;
- production catalog/object-store selection;
- analytical table-specific schema design;
- broad query service; and
- classification of direct CLI tests as product runtime proof.

## Acceptance

- a valid multi-table request returns one assurance-neutral attestation and one
  reproduced physical-effect observation over the same exact snapshot vector;
- a byte-equivalent repeated request is idempotent;
- a reused request identity with changed content fails closed;
- exact named snapshots can be verified after later table commits;
- malformed and multiple input lines return typed failure;
- partial effects are reported and never emitted as an attestation;
- configuration is external to request payload;
- tests run in an isolated temporary catalog and warehouse; and
- no file under the tenant implements GTL or product traversal.

## Current Evidence

- DuckDB `1.4.5`, Iceberg extension `2f229463`, PyIceberg `0.11.1`, PyArrow
  `25.0.0`, SQLAlchemy `2.0.51`, and RFC 8785 `0.1.4` are pinned and recorded.
- twenty-two Python tests pass for canonical digests over received payloads,
  strict lowercase digest syntax, local configuration, exact
  DuckDB runtime identity, multi-table write, exact
  historical verification, sequential and concurrent-process idempotency,
  conflicting replay, lost-receipt
  recovery without unrelated snapshot scans, concurrent-commit isolation,
  schema-fingerprint tamper rejection, malformed/multiple input, operation-typed
  configuration failure, one-line CLI framing, and partial-effect reporting.
- the TypeScript suite proves a request generated from the forward tenant is
  accepted by the Python adapter and its returned attestation validates against
  the shared schemas and TypeScript digest checker. It also proves an
  idempotency conflict survives Python exit `2` as a typed result. Every decoded
  response is correlated back to the exact outbound request and attestation.
- F_H's 2026-07-12 full-build direction accepts this bounded implementation for
  integration. The exact GTL/ABG reference steel thread proves the effect
  boundary and the final review records closure.
- The integrated steel thread derives protocol fields from an accepted cut and
  replay witness, writes two FpML-derived publications through the explicit
  TypeScript `PythonPhysicalCutStore`, validates each attestation, and retains
  the separate observation produced when PyIceberg and DuckDB reproduce every
  exact historical snapshot. DuckDB receives the attested metadata URI and
  snapshot ID with unsafe
  version guessing disabled. Deployment configuration enters through adapter
  construction and cannot be selected by request payload.
- The persisted development bundle captures the TypeScript integration lane,
  all twenty-two Python tests, compileall, pip-check, and DuckDB runtime-identity
  results. Production catalog/object-store topology is excluded.
- A process-shared request-identity lock now encloses lazy catalog construction,
  receipt recovery, physical writes, observation, and receipt commit. Independent
  CLI processes issuing the same exact request deterministically produce one
  `written` and one `idempotent` result.
- The partial adversarial review's four ratification blockers are repaired:
  raw-payload digest closure, append-local snapshot capture under concurrency,
  exact-link mesh closure, and typed cross-language failures. Strict digest
  parsing, summary-filtered recovery, and recorded schema-fingerprint checks
  are also repaired. The later full-build review rejected provider-authored
  assurance inside the attestation: that field is removed, actual post-readback
  results now travel as `PhysicalEffectObservation`, and failed observations
  retain completed snapshot refs without emitting a successful attestation.

## Completion

Closed as accepted under the 2026-07-12 F_H direction. The bounded effect has
typed request/result transport, exact snapshot correlation, process-safe
idempotency, honest partial failure, independent DuckDB reproduction, pinned
dependencies, and integrated TypeScript evidence. The storage tenant contains
no GTL, traversal, semantic-acceptance, or continuation implementation.

Production storage topology remains excluded and owned downstream; this ticket
closes only the local PyIceberg effect selected by the accepted architecture.
