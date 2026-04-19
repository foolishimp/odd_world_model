# T-001 Add World Model Representation Tenant

- id: T-001
- type: feature
- status: completed
- goal: proving-wave-01
- priority: high
- created_at: 2026-04-15
- updated_at: 2026-04-15

## Context

Building `odd_world_model` exposed a gap in the current `odd_sdlc` UX: product-shape
discovery found a concrete build need before the workspace had a local ticket
carrier for turning that discovery into bounded execution work.

The immediate build need was the first common representation tenant for the
`odd_world_model` semantic kernel.

That tenant needed to define the file-native carrier for:

- world fragments
- world-model objects
- Markov objects
- treatment surfaces
- covariance edges
- adjoint mappings
- derived projections

## Acceptance

- a first common representation tenant is defined for `odd_world_model`
- the tenant uses JSON as the initial canonical object carrier
- the tenant covers world fragments, world-model objects, Markov objects,
  treatment surfaces, covariance edges, adjoint mappings, and projection
  specifications
- the tenant preserves the file-first publication model and does not require a
  database in the initial low-volume lane
- the required spec-method triage is identified for the affected standards,
  product, requirement, and design surfaces
- the ticket links the build work back to the strategy and standards material
  that motivated it

## Completion

Completed by:

- triaging the work into standards, product, requirement, design, and build
  surfaces
- implementing the common JSON carrier and deterministic validation lane
- building the bounded sandbox corpus and real FpML trade-standard ingestion
  lane
- implementing the first side-by-side proof lane with conventional and
  covariant outputs from the same governed model

## Links

- comment: `.ai-workspace/comments/codex/20260414T020656Z_STRATEGY_odd-world-model-product-direction.md`
- comment: `.ai-workspace/comments/codex/20260414T155356Z_STRATEGY_world-model-evidence-kernel-and-projections.md`
- comment: `.ai-workspace/comments/codex/20260414T161949Z_TRIAGE_T-001-world-model-representation-tenant.md`
- standard: `/Users/jim/src/apps/specification_methodology/specification/standards/WORLD_MODEL_GUIDE.md`
- product: `specification/PRODUCT.md`
- requirements: `specification/requirements/10-world-model-object-representation.md`
- design: `build_tenants/common/design/WORLD_MODEL_REPRESENTATION_TENANT.md`
- child: `.ai-workspace/tickets/completed/T-002-implement-common-json-carrier.md`
- child: `.ai-workspace/tickets/completed/T-003-implement-projection-and-proof-lane.md`
- child: `.ai-workspace/tickets/completed/T-004-build-sandbox-mvp-and-markov-object-corpus.md`
- child: `.ai-workspace/tickets/completed/T-005-ingest-real-trade-representation-standard.md`
- child: `.ai-workspace/tickets/completed/T-006-implement-temporal-reference-artifacts.md`
