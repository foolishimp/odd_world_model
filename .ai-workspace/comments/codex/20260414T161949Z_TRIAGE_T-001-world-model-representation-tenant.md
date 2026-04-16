# TRIAGE: T-001 World Model Representation Tenant

**Author**: codex
**Date**: 2026-04-14T16:19:49Z
**Addresses**: `.ai-workspace/tickets/active/T-001-add-world-model-representation-tenant.md`; `build_tenants/common/design/`; `specification/PRODUCT.md`; `specification/requirements/10-world-model-object-representation.md`
**Status**: Draft

## Intake

- ticket: `T-001`
- title: `Add World Model Representation Tenant`
- reported gap: `odd_sdlc` product-shape discovery found a concrete build need
  before the workspace had a lawful design and ticket cut for the first common
  world-model representation tenant

## Change Intent

Define the first common build tenant for the `odd_domain` semantic kernel.

The tenant must provide the file-native representation carrier for:

- world fragments
- world-model objects
- Markov objects
- treatment surfaces
- covariance edges
- adjoint mappings
- projection specifications

## Triage Outcome

The discovery originally forced repricing at product and requirement level.
Those repricings have already been applied in the current workspace.

For the ticketed build work, the lawful active change class is:

- `design_reframe`

because the current work changes the realization structure while keeping the
active intent, product direction, and requirement truth stable.

## Affected Surfaces

- shared standards already repriced:
  - `WORLD_MODEL_GUIDE.md`
- active constitutional surfaces already repriced:
  - `specification/PRODUCT.md`
  - `specification/GOALS.md`
  - `specification/requirements/10-world-model-object-representation.md`
- new required downstream design surface:
  - `build_tenants/common/design/README.md`
  - `build_tenants/common/design/WORLD_MODEL_REPRESENTATION_TENANT.md`
- downstream realization work to follow:
  - common carrier schemas and validators
  - fragment publication carriers
  - projection generation

## Design Decisions Fixed By This Triage

- Git and filesystem remain the publication authority
- JSON is the first canonical carrier format
- low-volume operation remains file-first
- no database is required for the first lane
- a future database, if added, will be a complementary tenant for regenerated
  query/read models rather than constitutional truth

## Ticket Split

This intake should continue as:

- `T-001` parent design and coordination ticket
- `T-002` implement common JSON carrier and validation surfaces
- `T-003` implement projection and side-by-side proof surfaces from the same
  governed model
