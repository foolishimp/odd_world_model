# T-026 Rebuild World Model In TypeScript Tenant

- id: T-026
- title: Rebuild world model in TypeScript tenant
- type: feature
- ticket_category: tenant_migration
- status: backlog
- governance_method: STDO
- method_stack: SPEC_METHOD, TICKET_METHOD, DESIGN_MODULE_METHOD, ODD_METHOD, WORLD_MODEL_METHOD
- goal: proving-wave-07
- change_intent: make TypeScript the forward world-model realization tenant over the current semantic-memory, mesh, context, GTL/ABG, GLC, and proof contracts while preserving explicit successor migration seams
- change_class: design_reframe
- re_entry_point: build_tenants/typescript/design/
- triaged_at: 2026-05-14
- priority: high
- execution_state: paused_pending_stable_abiogenesis_5_0_release
- substrate_ruling: retain_exact_rc3_reference_proof_and_resume_native_closure_only_after_stable_abiogenesis_5_0_release
- migration_posture: capability_first_successor_adoption_without_local_runtime_redevelopment
- pause_reason: ABIogenesis 5.0 owns the generic native GraphFunction, C-runtime, F_P admission, recursion, replay, catalog, and install capabilities required for lawful WM closure
- resume_trigger: immutable stable ABIogenesis 5.0 release product is published
- resume_gate: audit the exact released product against the WM native-carrier capability contract and resolve an exact released GLC downstream-program product; release availability alone is not acceptance
- dependencies: T-023 (completed), T-025 (completed), T-027 (completed), T-028 (completed), T-029 (completed); supporting effect T-030 (completed)
- grounding_ticket: T-027
- affected_boundary: forward WM TypeScript realization, exact substrate adapter, semantic carriers, effect ports, GTL publication, and tenant proof
- target_truth: a TypeScript ODD realization whose public constructive movement is carried by reviewed GTL GraphFunctions, whose runtime truth is ABG-owned, whose physical persistence is replaceable, and whose context outputs are exact-basis attributed
- superseded_truth: Python as forward realization, odd_sdlc as current product/runtime authority, filesystem executive, unratified rebuild_world_model_core handle, and mutable 5.0 catalog assumptions
- closure_law: reviewed GTL catalog is implemented and conformed on the exact proving substrate; the end-to-end semantic publication, bounded mesh, context, storage, event, replay, installed-product, and requirement proof lanes pass without rival truth or hidden traversal
- non_closure_conditions: GTL code before T-029 acceptance, filesystem-runner continuation, implicit latest reads, basisless output, hidden context expansion, Python semantic authority, unrecorded dependency resolution, or proof inferred from unit tests alone
- proof_surface: strict TypeScript compile, common-schema validation, semantic carrier negative tests, cross-language storage contract, exact rc.3 conformance and target resolution, ABG event/replay evidence, installed-product proof, and requirement closure trace
- links: basis:T-023, basis:T-027, basis:build_tenants/common/design/WORLD_MODEL_COMMON_ARCHITECTURE.md, basis:build_tenants/common/design/adrs/ADR-WM-002-semantic-memory-and-authority-boundaries.md, basis:build_tenants/common/design/adrs/ADR-WM-003-iceberg-storage-and-cut-attestation.md, decision:build_tenants/common/design/adrs/ADR-WM-004-gtl-graph-function-catalog.md, basis:build_tenants/common/design/adrs/ADR-WM-005-storage-effect-protocol.md, basis:build_tenants/typescript/design/60-current-rc3-design-rebase.md, basis:build_tenants/typescript/design/adrs/ADR-006-exact-rc3-proving-substrate-and-migration-seam.md, supporting:T-030
- created_at: 2026-05-14
- updated_at: 2026-07-12 (paused by F_H pending stable ABIogenesis 5.0 release)

## Current Basis

T-027 closed the Intent, Product, requirement, scenario, and dependency-boundary
reprice. T-023 closed the retained mesh complexity-management slice. T-028
closed the accepted common architecture, T-029 closed the F_H catalog decision,
and T-030 closed the bounded storage effect. Native carrier and final product
closure remain here.

F_H paused T-026 on 2026-07-12 after review of the live ABIogenesis 5.0
delivery plan. The current reference kernel remains valid development evidence,
but WM will not redevelop generic traversal, C-runtime, F_P admission,
continuation, retry, replay, payload-ledger, catalog, or install machinery that
ABIogenesis 5.0 owns.

TypeScript is the forward WM realization tenant. The retained Python product
tenant and odd_sdlc-era files are historical/reference evidence only. The
supporting `storage/python` tenant is a bounded physical effect, not a second
product realization.

## Pause Disposition

The ticket is moved to backlog until an immutable stable ABIogenesis 5.0
product is published. Publication triggers reassessment, not automatic resume.

Resume requires an exact installed-product probe showing that the selected
release supplies:

- native typed GraphFunction payload execution;
- governed F_P capability selection and result admission;
- declared recursion, foldback, batching, and retry through the accepted C
  runtime;
- ABG-owned events, payload ledger, continuation, replay, and projection;
- public catalog invocation and source-independent install contracts; and
- a compatible exact released GLC product exposing the downstream-program
  specialization boundary.

If any capability is absent, the gap remains upstream or returns through a
separate design decision. WM shall not close it with a local runner, shim,
event ledger, retry loop, or copied runtime contract.

## Product Slice

The target TypeScript steel thread covers:

1. source evidence and accepted attribute-ledger lineage;
2. immutable object and published semantic cuts;
3. exact typed semantic links;
4. one finite interaction-goal-bound mesh cut;
5. dependency-local impact closure and typed gaps;
6. one immutable context basis over exact refs;
7. one fidelity/loss-declared context projection;
8. one model invocation record bound to that basis and projection;
9. one admitted physical-cut request and exact snapshot-vector attestation; and
10. query/proof projections over the exact admitted cut.

Mapping execution, operational enrichment, production storage, broad serving,
and release installation remain owned downstream work. They are not silently
removed and cannot be claimed closed by this slice.

The current reference slice does not yet realize item 1's accepted
attribute-ledger chain or native GraphFunction execution of the semantic
kernel. It exercises source observation, proposal, deterministic check,
admission witness, attributed acceptance, physical publication, mesh, context,
and query contracts without claiming those remaining obligations closed.

## Accepted Realization Boundary

- `specification/` defines Product `WHAT`.
- accepted common architecture and ADRs define shared `HOW`.
- TypeScript owns WM-local carrier types, deterministic checks, semantic
  interpretation, effect ports, and the eventual GTL module.
- GTL owns declared graph structure and public function/module publication.
- ABG owns execution, graph calls, continuations, runtime facts, admission,
  events, replay, correction, projection mechanics, and closure truth.
- GLC owns generic lifecycle vocabulary and downstream specialization law.
- Python/PyIceberg persists already-admitted effects and returns exact physical
  evidence only.

## Concrete Proving Resolution

F_H selected exact ABIogenesis `4.6.0-rc.3` with `odd_glc 0.1.0` for the next
incremental proof. The Product dependency remains floating.

The selected adapter will use rc.3 package declarations,
`typecheck-gtl-program`, and workspace `runtimeRegistryStartup` target
resolution. It does not claim later standalone catalog operations, graph shell,
marketplace, or broad public-consumption contracts.

All rc.3-specific shapes belong in `substrate_binding/`. Every run records the
exact package, tag/source, manifest, digest, workspace binding, and
compatibility result.

## Current Implementation Authority

The accepted non-GTL implementation includes:

- RFC 8785 canonical JSON and SHA-256 digests;
- exact refs, semantic links, bounded mesh cuts, and impact closure;
- context bases, loss-declared projections, staleness evidence, and attributed
  invocation records;
- current common JSON schemas and strict Draft 2020-12 compilation;
- a technology-neutral `PhysicalCutStore` port and protocol codecs;
- a cross-language TypeScript-to-Python storage contract test; and
- strict TypeScript compiler and negative-test gates.

T-030 owns the PyIceberg effect implementation and exact-snapshot proof.

## GTL Decision

F_H accepted ADR-WM-004 and `GTL_GRAPH_FUNCTION_CONTRACTS.md` through the
2026-07-12 direction to continue to full build. T-026 may now implement the
accepted public and private GraphFunctions, jobs, module, exact runtime catalog
declarations, substrate binding, worker boundary, and proof.

The authorization does not permit a product-local graph-function start wrapper
or a service/runner that imperatively performs the accepted traversal. ABG
remains the only traversal, continuation, admission, replay, and closure owner.

`odd_world_model.rebuild_world_model_core` is retired readback and is not a
lawful public handle.

## Current Full-Build Work

1. Complete: materialize only the accepted graph-function catalog and
   refinement model.
2. Complete: add the isolated exact rc.3 substrate adapter and conformance
   proof.
3. Complete for reference transport: prove binding-declared target resolution,
   canonical events, and traversal of the declared F_P path.
4. Complete for the local reference kernel: run the semantic-contract, mesh,
   context, storage, and query integration slice.
5. Paused: migrate WM payload execution and calibrated F_P authorship into the
   selected published GraphFunctions and derive semantic state through the
   native replay/projection contract after the stable ABIogenesis 5.0
   capability gate passes.
6. Sequenced after resume: add installed-product and immutable release-cut
   evidence.
7. Sequenced after resume: dispose every requirement claim through the
   requirement-design-test-proof trace rather than aggregate pass counts.

## Implemented Full-Build Evidence

The corrected TypeScript tenant now contains:

- seven accepted public GraphFunctions, five private publication refinements,
  seven jobs, three roles, one GTL module, and one machine-readable catalog;
- exact ABIogenesis `4.6.0-rc.3` and odd_glc `0.1.0` package bindings with
  independently recorded tarball hashes;
- zero-issue rc.3 conformance over seven published functions, eleven vectors,
  eleven target carriers, eleven edge closures, seven public starts, one typed
  prompt asset, and one F_P plugin contract;
- converged public ABG start, registry admission, exact target selection,
  graph-call, vector-close, canonical-event, repeated-run replay, and GLC
  interpretation proof for every public handle; domain publication traverses
  all five private vectors rather than stopping after the first;
- an explicit `abg.runtime_regime=F_P` path for `interpret_context`, including
  instruction assembly, one replay-visible dispatch request, deterministic
  attached-result admission, F_P evaluation, F_D consequence, and closure;
- replay-derived admission witnesses for preconstructed proposal,
  physical-effect, invocation, and final-publication refs; executable local
  deterministic payload checks; attributed WM semantic acceptance; and final
  `PublishedSemanticCut` construction only from an admitted publication
  candidate;
- replay-admitted semantic-link proposals and durable links,
  root/selector/closure-derived bounded mesh cuts, connected composition,
  deterministic content rendering, complete context basis metadata,
  catalog-derived stale dependency detection, mandatory invocation admission,
  and exact bounded query traversal; and
- integrated physical proof over two retained FpML-derived publications, with
  PyIceberg and DuckDB reproducing every exact named snapshot.

The persisted development bundle is
`build_tenants/typescript/test_env/proof/20260712T000000Z_full-build-v1/`.
It records 35 passing TypeScript tests, 22 passing Python tests, 402 raw and
402 repeated-run canonical events, dirty source state, and explicitly claims
no release authority. All eleven manifest hashes match. Its 116-row requirement
ledger records 53 `candidate_evidence`, 18 deferred, one not applicable, and
44 open rows. It assigns no locally minted verified or closed status. The
composition, query, freshness, durable-link, common-model, and supersession
candidates carry claim-specific dispositions and witnesses. An eleventh
hash-bound artifact persists the integrated semantic objects, 26 admission
witnesses, and their 284 exact referenced runtime events with zero unresolved
witness event refs. The source inventory binds every dirty non-proof path by
content digest while excluding the generated proof directory from its own hash.

Remaining work is requirement-by-requirement disposition, native WM payload
execution by the selected GraphFunctions, calibrated F_P semantic authorship,
replay-native semantic projection, and a clean immutable release/install cut.
Execution is paused pending the stable ABIogenesis 5.0 release and capability
audit.
`map_domains` and production storage remain explicitly deferred. A production
LLM/model-provider adapter is also open; the current F_P adapter proves only
deterministic reference transport and ABG traversal.

## Acceptance

These are closure criteria, not current-state claims. The native-carrier,
installed-product, and requirement-proof criteria remain open.

- TypeScript is the only forward WM domain realization tenant.
- Public constructive movement is implemented only through accepted GTL
  GraphFunctions and lawful refinements.
- ABG remains the only traversal/runtime/admission/replay/closure authority.
- published semantic truth is singular and physical snapshots are attested
  effects rather than rival truth.
- every mesh/context ref is exact, bounded, purpose-declared, and loss-aware.
- every governed output identifies the exact basis and projection it consumed.
- stale bases produce evidence without retargeting history.
- every concrete dependency and build identity is recorded.
- deterministic, integration, exact-substrate, and event/replay development
  proof lanes pass; installed/release and requirement-closure lanes must pass
  before this ticket closes.
