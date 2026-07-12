# T-023 Reprice World-Model Mesh As Complexity Management

- id: T-023
- title: Reprice world-model mesh as complexity management
- type: feature
- ticket_category: product_capability_reprice
- status: completed
- governance_method: STDO
- method_stack: SPEC_METHOD, TICKET_METHOD, WORLD_MODEL_METHOD, ODD_METHOD, DESIGN_MODULE_METHOD
- goal: proving-wave-07
- change_intent: make the federated world-model mesh the current complexity-management form of composition, using typed semantic links and finite purpose-bound cuts over published local truth rather than a later graph feature or central enterprise model
- change_class: goal_reprice
- re_entry_point: specification/GOALS.md
- triaged_at: 2026-07-12 (owner-directed reprice of the original 2026-04-16 intake)
- priority: high
- execution_state: retained_mesh_supersession_slice_accepted
- review_status: accepted_under_F_H_close_direction
- proof_status: accepted_development_mesh_supersession_proof
- dependencies: T-027 (completed current GTL/ABG/GLC product boundary)
- affected_tickets: T-026 (TypeScript realization carrier)
- links: basis:specification/GOALS.md, basis:specification/INTENT.md, basis:specification/PRODUCT.md, basis:specification/requirements/80-world-model-mesh-capability.md, basis:specification/requirements/90-world-model-mesh-constraints.md, basis:.ai-workspace/comments/codex/20260711T172810Z_REVIEW_legacy-building-blocks-and-mesh-reprice.md, basis:build_tenants/common/design/ATTRIBUTE_LEDGER_BUILD_LINE.md, basis:build_tenants/common/design/CURRENT_QUERY_TRAVERSAL_SLICE.md, basis:build_tenants/common/design/MULTI_DOMAIN_MAPPING_LINE.md, affected:T-026
- intake_source: F_H owner direction — the early tickets are product building blocks; re-evaluate and reprice mesh because it is critical to managing world-model complexity
- release_scope: none frozen; specification reprice precedes design, realization, and proof
- created_at: 2026-04-16
- updated_at: 2026-07-12
- closed_at: 2026-07-12
- terminal_disposition: mesh_complexity_management_slice_accepted

## Context

The legacy T-001 through T-022 and T-025 sequence established the local
ingredients for a mesh:

- published domain artifacts
- source domains and interpreted domains
- composed world models
- common-model reuse
- edge-specific constructive materialization
- query, proof, and mapping lines that operate downstream of published truth

Those tickets are old, but their product claims remain load-bearing. Their JSON,
Python, filesystem, odd_sdlc, and retained-domain shapes are historical
realization evidence rather than current product authority.

The current specification already says:

- the world model is federated
- each bounded context can publish its own domain artifact
- those artifacts can be stitched into higher-order world models

The missing synthesis is complexity control. The current mesh requirements
name federation, nodes, versions, traversal, and projections, but do not define
typed semantic links, finite purpose-bound working cuts, local dependency
impact, or typed reconciliation gaps.

Owner direction makes mesh a current product obligation:

- local authorities publish bounded semantic cuts;
- typed links preserve composition, treatment, covariance, adjoint, reference,
  and supersession meaning between cuts;
- agents and operators resolve a finite cut sufficient for one interaction goal;
- a local change pressures only the affected dependency closure; and
- query, mapping, proof, and application surfaces remain projections over that
  mesh truth.

## Intake Triage

The pressure is substantive. Without a bounded mesh law, complexity is pushed
into global prompts, central schemas, broad constructors, and detached query or
mapping indexes. Correctness then depends on memory and reconstruction rather
than preserved semantic topology.

The upward walk reaches `GOALS.md` first. The current wave treats full mesh
closure as later scope and does not name bounded mesh construction as the
current way to manage complexity. Owner direction changes that work-wave focus
without changing the product's underlying purpose.

The lawful class is therefore `goal_reprice`, with downstream effects through
Intent, Product, requirement families 80/90, and specification acceptance
surfaces. Storage and module shape remain design. Runtime realization and proof
remain T-026 work under this ticket's product authority.

## Required Outcome

This ticket establishes a lawful line of the form:

`published local cuts -> typed semantic links -> bounded mesh cut -> downstream projections`

The mesh is not a central flattened super-model.

It is a federated graph of published semantic cuts and typed links with explicit
identity, authority, boundary, version, treatment/loss, reference, and
supersession. A bounded mesh cut is a finite downstream selection over that
truth for one declared purpose; it is not a second publication authority.

## Legacy Proving Corpus

The first retained realization may use real domains already present in the
product line as proof corpora:

- `fpml_confirmation_source_domain`
- `trade_representation_domain`
- `apra_liquidity_domain`

Those names do not define mesh law. The carrier must admit any lawful published
domain and must let a common model be adopted by explicit reference as a role,
not as privileged ambient doctrine.

## Product Decisions And Design Freedom

Product law fixes these decisions:

- published domain artifacts, explicitly adopted common-model roles, and
  published composed world models may participate as mesh nodes;
- typed links are first-class semantic relations, not inferred joins;
- composed models remain reference-based published nodes rather than copied
  global state;
- common model is an explicitly adopted reuse role, not a privileged node kind;
- bounded mesh cuts are finite projections for reasoning and action;
- unresolved refs, incompatible cuts, authority conflicts, and semantic loss
  remain typed gaps; and
- query and mapping stay downstream.

Design remains free to choose one manifest, linked records, a root plus
fragments, indexes, storage engines, and caching strategies, provided those
choices preserve the product law.

## Expected Downstream Work

This ticket carries downstream closure through:

1. specification
   - goals, intent, product, mesh requirements, and acceptance trace
2. design under the selected tenant
   - mesh node and edge model
   - publication boundaries
   - version/supersession handling
   - traversal/projection boundaries
3. implementation under T-026
   - mesh asset surfaces
   - graph-function support
   - first retained mesh corpus
4. verification
   - deterministic mesh publication checks
   - bounded-cut, local-impact, traversal/query/mapping proof over the first mesh slice

## Acceptance

- the current goal and intent identify mesh as complexity management;
- Product defines mesh nodes, typed links, bounded mesh cuts, local impact, and
  projection authority;
- requirement families 80/90 make those claims testable;
- constitutional UAT, scenario, and testcase-authority surfaces trace them;
- downstream design derives a prime carrier set rather than copying legacy
  Python/JSON shapes;
- the first retained implementation publishes and traverses a real bounded mesh
  slice without flattening it into a central anonymous model; and
- proof shows that one local supersession affects only the declared dependency
  closure and exposes unresolved reconciliation as typed gaps.

## Current Execution State

The goal, intent, product, mesh requirement, and constitutional acceptance
surfaces are repriced. The legacy-ticket review is recorded in
`.ai-workspace/comments/codex/20260711T172810Z_REVIEW_legacy-building-blocks-and-mesh-reprice.md`.

`SemanticLink` now has a closed relation
role, exact published endpoints, provenance, validity, fidelity/loss, and
supersession state. `BoundedMeshCut` is derived from exact roots, selectors,
exclusions, and a closure rule; callers no longer supply the resulting node and
link set. Negative tests cover unpublished endpoints, open relation labels,
missing links, changed digests, and stale dependency closure.

Accepted public GraphFunction contracts declare link publication and bounded
cut resolution. Converged rc.3 starts admit preconstructed exact link and mesh
evidence; native execution of those deterministic WM kernels remains T-026
migration work. The integrated slice
uses the retained official FpML fixture, publishes source and interpreted cuts
as separate exact published nodes, resolves a finite purpose-bound cut, and
propagates a changed exact source-observation identity as a visible
stale-context gap.

The retained proof publishes immutable v1 and v2 interpreted cuts, joins them
with an admitted `supersedes` relation, closes and replaces the affected
semantic links, and resolves a second bounded mesh without editing v1. One
exact published common-model node is adopted by both local domains. A source
change affects only the source and current interpreted cut; the common-model
node and stable adoption link retain their exact identities. The revised mesh
also carries the unresolved business-unit reconciliation as a typed gap.

Evidence is under
`build_tenants/typescript/test_env/proof/20260712T000000Z_full-build-v1/`.
Immutable release proof, native GraphFunction payload execution, and executable
cross-domain mapping remain open under T-026 or its named successors; they are
not T-023 mesh-slice closure claims.

## Completion

Closed as accepted under the 2026-07-12 F_H direction to close every ticket
except T-026.

The ticket-local acceptance is supported by:

- admitted published-cut and semantic-link supersession;
- exact common-model adoption without ambient global truth;
- deterministic current-link selection with unresolved-successor rejection;
- dependency-local affected closure with unchanged exact refs preserved;
- a typed reconciliation gap in the current cut;
- strict schema and negative tests; and
- the hash-bound retained FpML witness in the development proof bundle.

This closure accepts the mesh complexity-management slice. It does not claim
native GTL execution, final requirement ratification, or release authority.

## Notes

- this is not a rewrite of the existing domain-build line;
- this does not restore legacy carrier or runtime choices;
- this is not a license to introduce a graph database or second truth surface;
- a bounded mesh cut is a projection, not a copied mini-model;
- mesh makes federation and locality explicit rather than erasing
  bounded-context identity; and
- mapping and query remain downstream projections over the mesh.
