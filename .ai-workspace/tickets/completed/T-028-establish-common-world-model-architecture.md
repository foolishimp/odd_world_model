# T-028 Establish Common World-Model Architecture

- id: T-028
- title: Establish common world-model architecture
- type: feature
- ticket_category: ordinary
- status: completed
- governance_method: STDO
- method_stack: SPEC_METHOD, TICKET_METHOD, DESIGN_MODULE_METHOD, ODD_METHOD, WORLD_MODEL_METHOD
- goal: proving-wave-07
- change_intent: derive one shared realization architecture from the uplifted world-model specification, including semantic-memory, mesh, context, storage, attestation, projection, and runtime ownership boundaries, before TypeScript implementation continues
- change_class: design_reframe
- re_entry_point: build_tenants/common/design/
- triaged_at: 2026-07-12
- priority: high
- execution_state: common_architecture_accepted
- review_status: accepted_under_F_H_close_direction
- proof_status: accepted_design_and_integrated_boundary_evidence
- dependencies: T-027 (completed Intent/Product/specification authority), T-023 (completed mesh complexity-management slice)
- affected_tickets: T-026 (TypeScript implementation), T-029 (GTL graph-function owner decision), T-030 (storage effect)
- links: basis:specification/INTENT.md, basis:specification/PRODUCT.md, basis:specification/requirements/, basis:specification/scenarios/, basis:build_tenants/common/design/, basis:.ai-workspace/comments/claude/20260711T174348Z_STRATEGY_wm-storage-and-tech-stack-recommendation.md, review:.ai-workspace/comments/codex/20260711T174718Z_REVIEW_claude-wm-storage-stack-boundary.md, affected:T-026, affected:T-029
- intake_source: F_H owner direction — follow STDO through Intent, Product, requirements, shared design, and architecture ADRs; use Claude's proposed stack for the current direction while reserving actual GTL graph-function decisions to F_H
- affected_boundary: shared realization law beneath the technology-independent WM specification and above tenant-local code
- release_scope: no release cut; design authority and decision preparation only
- target_truth: one current common architecture, one requirement-to-design allocation, accepted first-slice storage and cut-attestation decisions, and an explicit unresolved GTL catalog decision owned by T-029
- superseded_truth: stale file-first/Git-first, Python-first, odd_sdlc-era, and imperative-runner assumptions currently mixed through legacy common and TypeScript design readback
- closure_law: common design is internally coherent, requirement-grounded, classified against legacy design, and sufficient for T-026 implementation after T-029 records F_H graph-function decisions
- evaluation_criteria: no rival truth surface, prime carrier/module boundaries, explicit effects, semantic-cut/physical-snapshot attestation, ABG/GLC/WM ownership integrity, and complete requirement-design trace
- non_closure_conditions: inferred GTL public catalog, unresolved duplicate design authority, storage format treated as semantic authority, Python writer classified as F_P by language, or implementation claimed as design proof
- proof_surface: design trace audit, ADR metadata/links, legacy classification register, `git diff --check`, requirement-reference validation, and reviewer decision record
- created_at: 2026-07-12
- updated_at: 2026-07-12 (common design complete; non-GTL storage realization admitted under T-030)
- closed_at: 2026-07-12
- terminal_disposition: common_architecture_accepted

## Intake Triage

The current pressure is substantive and begins at design.

Intent, Product, requirement, and scenario surfaces now define:

- governed semantic memory for exact LLM context;
- published local truth, typed mesh links, and bounded purpose-specific cuts;
- candidate Markov-object compression with declared loss;
- output attribution and staleness;
- GTL/ABG/GLC/WM ownership; and
- storage neutrality at the constitutional layer.

The first missing layer is a current shared realization architecture. Existing
common design mixes useful semantic decisions with stale Python-first,
filesystem-first, Git-as-publication-authority, and odd_sdlc-era runtime
assumptions. T-026 cannot lawfully infer a current implementation from that
mixture.

The lawful change class is `design_reframe`. No Goal, Intent, Product, or
requirement reprice is implied unless design derivation exposes a real
constitutional gap.

## Required Outcome

T-028 establishes:

1. one current common architecture over the semantic chain;
2. one irreducible carrier and module boundary model;
3. one requirement-to-design allocation for every live requirement family;
4. one accepted first-slice storage and physical-cut strategy following the
   owner-directed Claude proposal with the reviewed authority corrections;
5. one classification of legacy common designs as current, retained input, or
   superseded reference; and
6. one explicit decision boundary for the GTL graph-function catalog, carried
   by T-029 and not guessed by this ticket.

## Stack Direction

For the current design wave, use this direction unless F_H reprices it:

- TypeScript remains the forward product realization tenant;
- Iceberg is the physical table/snapshot layer, not semantic authority;
- PyIceberg is the first-slice write adapter behind an explicit deterministic
  effect boundary;
- Parquet is the first-slice table data format;
- SQLite catalog plus local filesystem warehouse is development-only proof
  topology;
- DuckDB is the local query/proof consumer over exact snapshots;
- Git stores small cut-attestation and constitutional refs, never bulk data;
- REST catalog and object storage are the multi-consumer evolution path; and
- Avro, Kafka, and Postgres remain bounded event-transport or serving choices,
  never independent truth surfaces.

The common design must distinguish an Iceberg snapshot from a WM semantic cut.
A semantic-cut attestation binds an accepted cut to physical snapshots and
carries fidelity, loss, schema, and governing refs. It is assurance-neutral;
ABG admission and final WM publication remain separate carriers.

## GTL Owner Boundary

T-028 may derive candidate outcome traversals and the typed assets they require.
It must not ratify:

- the number or names of public graph functions;
- which traversals are public versus refined inner carriers;
- whether model invocation is inside or adjacent to context projection;
- the public mesh publication/resolution split; or
- which mapping/query functions enter the first catalog.

T-029 owns those decisions and closes only through explicit F_H selection.

## Acceptance

- common architecture is present under `build_tenants/common/design/`;
- accepted ADRs use the method metadata and cite the exact requirements they
  implement;
- every live requirement family has an owning design, a named tenant-local
  allocation, or an explicit deferment;
- legacy common design is classified and no stale surface remains described as
  current authority;
- the first-slice storage ADR follows the owner-directed stack while preserving
  semantic/physical cut separation and ABG runtime ownership;
- the GTL decision packet exposes material owner choices without deciding them;
- T-026 is rebased to the common architecture and T-029 decision dependency;
- design closure is judged from design evidence rather than inferred from implementation; and
- validation passes.

## Current Execution State

T-027 closed by F_H ruling on 2026-07-12. The common architecture is re-derived from the closed specification; the
earlier premature files do not carry forward automatically. F_H selected the
exact rc.3 family as the incremental concept-proving substrate and retained the
actual GTL graph-function decisions for T-029.

The common architecture, requirement allocation, legacy classification,
storage topology, semantic-cut attestation, and cross-tenant storage-effect
protocol are now defined. T-030 carries implementation of the bounded Python
effect. F_H's 2026-07-12 full-build direction accepts the common design for
implementation and accepts ADR-WM-004 through T-029. The integrated build and
retained mesh supersession witness prove the design boundaries used for this
ticket's closure.

The target design leaf contains domain, sequence, and state diagrams plus a
complete D/S/M/X evaluation. The as-built backfill in
`build_tenants/typescript/design/95-rc3-reference-bridge-as-built-review.md`
records failed native-carrier checks rather than projecting target law onto the
rc.3 bridge. The integrated build proves replay-derived admission witnesses,
attributed WM acceptance contracts, assurance-neutral storage, admitted exact
publication refs, and exact context/query consumers. Requirement families are
allocated to accepted design, T-026 realization, or explicit deferment; dirty
development proof continues to claim no release authority.

The independent product review repair made semantic-link proposal/admission a
first-class boundary, replaced caller-asserted freshness with a current
dependency-catalog witness, and made bounded query traversal return exact node
and link vectors. The target state machine now declares target-specific re-entry,
`max_reentries`, exact-ref foldback, ordinary convergence, and budget-exhaustion
`gap_stop`; M3, M4, M6, and X2 are evaluated against those explicit transitions.

## Completion

Closed as accepted under the 2026-07-12 F_H direction. The review confirms one
current common architecture, accepted ADR topology, complete family-level
requirement allocation, explicit legacy classification, semantic/physical cut
separation, ABG runtime ownership, and a bounded storage-effect protocol.

Native payload execution, final requirement disposition, and release/install
proof remain explicitly owned by active T-026. Their absence is not presented
as design closure evidence.
