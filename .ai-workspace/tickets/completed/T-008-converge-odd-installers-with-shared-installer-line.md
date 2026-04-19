# T-008 Converge odd Installers With Shared Installer Line

- id: T-008
- title: Converge odd installers with shared installer line
- type: chore
- status: completed
- goal: installer-convergence-wave-01
- change_intent: converge installer behavior around immutable released products, installed toolsets, and installer-driven propagation of standards without manual mirroring
- change_class: design_reframe
- re_entry_point: design
- triaged_at: 2026-04-15
- priority: medium
- dependencies: none
- links: T-007
- created_at: 2026-04-15
- updated_at: 2026-04-15

## Context

`abiogenesis`, `odd_sdlc`, and now `odd_world_model` each carry installer logic.

That is acceptable for the first proving lanes, but the installers are clearly
part of one family:

- workspace bootstrap
- package stamping
- installed standards/docs
- instruction bootloaders
- install provenance

The design direction should be:

- keep `odd_world_model` close to `odd_sdlc` installer structure in the short term
- identify the common installer substrate between `abiogenesis` and `odd_*`
  products
- converge on one shared installer line with product-local overrides rather
  than three drifting installers
- treat installed standards/docs as installer-propagated distribution surfaces,
  not manually mirrored development surfaces

This work is parallel to the current world-model build line. It should not
block `T-009` and its children unless a later implementation slice proves that
the installer boundary itself prevents lawful realization.

This ticket is complete through explicit convergence design rather than a full
shared-installer extraction. The common responsibilities and the split between
substrate installer, shared `odd_*` installer line, and product-local overrides
are now recorded in:

- `build_tenants/common/design/INSTALLER_CONVERGENCE_LINE.md`
- `docs/INSTALLATION.md`

## Major Ambiguities

- the exact split between substrate installer logic, shared `odd_*` installer
  logic, and product-local overrides remains the central open design question
- this ticket should not silently expand into packaging/runtime refactoring
  beyond installer convergence

## Acceptance

- the common installer responsibilities are enumerated explicitly
- the split between substrate installer, `odd_*` shared installer, and
  product-local install logic is made explicit
- duplication between `odd_sdlc` and `odd_world_model` installer code is reduced or
  intentionally bounded
- future installer work follows the converged design rather than adding more
  ad hoc divergence
- the install line makes clear that standards move from source authority into
  installs by running install, not by hand-copying files into `.genesis`
