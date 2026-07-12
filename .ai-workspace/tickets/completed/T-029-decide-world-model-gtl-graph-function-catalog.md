# T-029 Decide World-Model GTL Graph-Function Catalog

- id: T-029
- title: Decide world-model GTL graph-function catalog
- type: feature
- ticket_category: ordinary
- status: completed
- governance_method: STDO
- method_stack: SPEC_METHOD, TICKET_METHOD, DESIGN_MODULE_METHOD, ODD_METHOD, WORLD_MODEL_METHOD
- goal: proving-wave-07
- change_intent: record F_H decisions for the public WM graph-function catalog, outer/refined traversal boundaries, cumulative environments, probabilistic worker placement, and first-slice callable scope before tenant implementation
- change_class: design_reframe
- re_entry_point: build_tenants/common/design/adrs/ADR-WM-004-gtl-graph-function-catalog.md
- triaged_at: 2026-07-12
- priority: high
- execution_state: catalog_decision_accepted
- review_status: accepted_by_F_H
- proof_status: accepted_catalog_contract_and_reference_conformance
- dependencies: T-028 (completed common architecture and candidate traversal derivation)
- affected_tickets: T-026 (TypeScript implementation)
- links: basis:specification/PRODUCT.md, basis:specification/requirements/20-domain-build-and-composition-capability.md, basis:specification/requirements/25-governed-context-memory-capability.md, basis:specification/requirements/50-odd-method-gtl-carrier.md, basis:specification/requirements/80-world-model-mesh-capability.md, basis:build_tenants/common/design/WORLD_MODEL_COMMON_ARCHITECTURE.md, decision:build_tenants/common/design/adrs/ADR-WM-004-gtl-graph-function-catalog.md, affected:T-026
- intake_source: F_H owner direction — actual GTL-built graph-function decisions remain owner-held
- affected_boundary: public constructive carriers and their refinement, environment, worker, projection, and invocation contracts
- release_scope: no release cut; owner-held architecture decision
- implementation_authorization: accepted first-slice catalog, private refinements, runtime declarations, GTL jobs/module, exact substrate binding, and proof under T-026; map_domains remains deferred
- target_truth: one accepted public function catalog and refinement model from which the TypeScript GTL module can be reconstructed
- superseded_truth: the historical Python `build_and_query_world_model` executive carrier and stale TypeScript design catalogs are reference evidence only
- closure_law: F_H selects every material catalog option, the accepted ADR records the decision, and T-026 can derive the machine-readable catalog and module without inventing public semantics
- evaluation_criteria: product-intent alignment, prime public carriers, cumulative environment law, F_P/F_D/F_H authority, ABG continuation ownership, projection subordination, and zoom-stable closure
- non_closure_conditions: agent-inferred public catalog, hidden service/orchestrator carrier, one monolithic function without lawful refinement, stage explosion into public wrappers, or unrecorded ambiguity about model invocation
- proof_surface: accepted ADR decision table, requirement trace, candidate catalog comparison, and F_H decision record
- created_at: 2026-07-12
- updated_at: 2026-07-12 (F_H accepted the recommended catalog through the direction to continue to full build)
- closed_at: 2026-07-12
- terminal_disposition: graph_function_catalog_decision_accepted

## Intake Triage

The requirements mandate named graph functions, a machine-readable catalog, a
GTL module, cumulative environments, public invocation, and ABG-owned runtime
truth. They intentionally do not decide the product's exact callable catalog.

The first missing layer is therefore design. The decision is material because
function granularity determines the public product surface, inner traversal
topology, model-worker boundary, closure obligations, and the amount of context
each call must carry.

## Decisions Recorded From F_H

F_H accepted the recommended options and contracts for:

1. public-catalog granularity;
2. source-to-publication outer carrier and inner refinements;
3. mesh-link publication versus bounded-cut resolution;
4. context projection versus probabilistic model invocation;
5. invocation-output attribution and semantic acceptance;
6. mapping and query inclusion in the first public catalog; and
7. names, inputs, outputs, cumulative environment, and closure obligations for
   the selected functions.

## Acceptance

- the proposed ADR lists every material choice and a recommendation with
  consequences;
- F_H decisions are recorded verbatim or as an attributable decision table;
- the accepted catalog contains only prime public carriers;
- inner refinement is explicit where one public carrier spans several outcome
  traversals;
- every retained function declares required/provided/carried environment;
- F_P proposal, deterministic checking, ABG admission, WM semantic acceptance,
  and effectful persistence remain distinct authorities;
- no product-local continuation loop is introduced; and
- T-026 can publish the selected catalog and GTL module without further
  semantic invention.

## Current Execution State

T-027 is closed and T-028 design is complete. F_H first authorized Codex to
define reviewable contracts without code, then directed Codex on 2026-07-12 to
continue to full build. ADR-WM-004 records that decision. The accepted catalog
contains seven first-slice public functions, five private publication
refinements, target-specific semantic re-entry, and one contract-defined but
deferred mapping function. T-026 owns implementation and exact-substrate proof.

T-026 implements seven runtime-declared public functions, five private composed
publication vectors, no private public jobs, and no runtime declaration for
`map_domains`. The exact rc.3 compiler reports zero issues. Persisted starts now
run all seven public functions to convergence; domain publication closes five
vectors. Exact semantic refs/digests enter through input bindings and admitted
evidence. `interpret_context` and semantic publication retain an explicit rc.3
reference bridge without claiming a production provider or inline payload
carrier. The reference bridge does not execute the WM semantic kernel or prove
F_P authorship; those are T-026 migration obligations, not catalog-decision
defects.
The persisted proof bundle is linked from T-026. The final review accepts the
catalog decision while preserving native execution as a separate T-026 gate.

The independent product review repair aligned the machine-readable carrier
schemas with the accepted contracts: all seven requests now carry their named
domain prerequisites, all seven outcomes are explicit multi-ref tuples, and the
declared compute sets retain bounded F_P/F_H authority for link publication and
composition plus optional F_P relevance for mesh resolution. Contract tests
instantiate every request and outcome rather than checking schema addresses only.

## Completion

Closed as accepted. F_H selected the seven-function public catalog, five
private publication refinements, cumulative environment contracts, explicit
F_P/F_D/F_H boundaries, and deferred `map_domains` disposition. The exact rc.3
compiler reports zero conformance issues over the declared catalog.

This decision closure does not claim that the rc.3 reference bridge executes
native WM payloads. That realization question remains active in T-026.
