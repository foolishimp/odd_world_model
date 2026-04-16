# T-002 Implement Common JSON Carrier

- id: T-002
- type: feature
- status: completed
- goal: proving-wave-01
- priority: high
- dependencies: T-001
- created_at: 2026-04-15
- updated_at: 2026-04-15

## Context

`T-001` establishes the shared design need for the first common world-model
representation tenant.

This ticket covers the implementation of the initial JSON carrier and
validation surfaces for the semantic kernel.

## Acceptance

- canonical JSON document kinds are created for the first carrier set
- the carrier covers world fragments, world-model objects, Markov objects,
  treatment surfaces, covariance edges, adjoint mappings, and projection specs
- deterministic validation exists for the initial carrier documents
- the carrier preserves the file-first and Git-first publication model

## Completion

Completed by introducing:

- shared JSON schema documents under `build_tenants/common/schemas/`
- a minimal validated example fragment under `build_tenants/common/examples/`
- deterministic Python validation and loading helpers under
  `build_tenants/python/code/odd_domain/world_model/`

## Links

- parent: `.ai-workspace/tickets/active/T-001-add-world-model-representation-tenant.md`
- triage: `.ai-workspace/comments/codex/20260414T161949Z_TRIAGE_T-001-world-model-representation-tenant.md`
- design: `build_tenants/common/design/WORLD_MODEL_REPRESENTATION_TENANT.md`
