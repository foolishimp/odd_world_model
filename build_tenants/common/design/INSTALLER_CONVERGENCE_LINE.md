# Installer Convergence Line

**Status**: Retained downstream design input; release/install work remains T-026
**Scope**: Shared installer-family responsibilities for `abiogenesis`,
`odd_sdlc`, and `odd_world_model`

## Purpose

Define the common installer line so `odd_world_model` does not drift away from the
existing `odd_sdlc` installer shape while the broader installer family is still
under active development.

## Common Installer Responsibilities

Every installer in the family should own the same core responsibilities:

- stamp an immutable released product into a target workspace
- propagate installed standards and docs into the install surface
- stamp package/runtime assets into a product-local install root
- bootstrap `.ai-workspace/`
- write install provenance
- install or update instruction bootloaders such as `AGENTS.md` and
  `CLAUDE.md`

These are installer responsibilities. They are not project-owned mutable
surfaces.

## Split

### 1. Substrate Installer

The substrate installer is responsible for:

- shared kernel/bootstrap conventions
- shared `.genesis` bootstrap and runtime substrate
- lower-level runtime contract hooks when present

Current example: `abiogenesis`.

### 2. Shared `odd_*` Installer Line

The shared `odd_*` installer line should converge on:

- product-local package stamping under `.<product>/`
- install provenance under `.<product>/release/`
- shared workspace bootstrap conventions
- installed standards propagation by running install
- instruction bootloader management

This is the installer-family layer that `odd_sdlc` and `odd_world_model` should
share.

### 3. Product-Local Overrides

Product-local installer logic is allowed only for:

- package-relative install paths
- product-specific scaffold directories
- product-specific verification commands
- product-local runtime contract or bootloader wording

Product-local overrides must not redefine the common installer responsibilities.

## Current Bound

For the current proving wave, `odd_world_model` intentionally tracks the existing
`odd_sdlc` installer structure rather than extracting a shared installer
package prematurely.

That duplication is explicitly bounded:

- it is acceptable while the shared installer line is still being clarified
- new divergence should not be added casually
- future installer work should move toward the split defined above

## Standards Propagation Rule

Installed standards move from source authority into installs by running the
installer.

They are not manually mirrored into `.genesis/docs/standards/` during ordinary
development.
