# T-006 Implement Temporal Reference Artifacts

- id: T-006
- type: feature
- status: completed
- goal: proving-wave-01
- priority: high
- dependencies: T-001
- created_at: 2026-04-15
- updated_at: 2026-04-15

## Context

The standards and requirements were updated to say that changing value lists,
code sets, and classifications must be modeled as governed temporal artifacts
rather than left as static enum metadata.

This ticket implements that carrier support in the first common tenant and
demonstrates it in the sandbox corpus with a concrete APRA-liquidity reference
surface.

## Acceptance

- the common carrier can represent governed temporal reference artifacts
- published fragments can reference temporal reference artifacts alongside
  objects, treatments, edges, projections, and evidence
- deterministic validation recognizes the new document kind
- at least one concrete sandbox fragment publishes a temporal reference artifact
  for a changing value-list or classification surface

## Completion

Completed by:

- adding `odd_domain.temporal_reference_artifact` to the common carrier
- extending fragment publication to carry `reference_artifacts`
- updating deterministic validation and schema registry
- adding a minimal reference-artifact example
- wiring an APRA counterparty-bucket reference set into the sandbox corpus

## Links

- parent: `.ai-workspace/tickets/completed/T-001-add-world-model-representation-tenant.md`
- standard: `/Users/jim/src/apps/specification_methodology/specification/standards/WORLD_MODEL_GUIDE.md`
- requirements: `specification/requirements/10-world-model-object-representation.md`
- design: `build_tenants/common/design/WORLD_MODEL_REPRESENTATION_TENANT.md`
