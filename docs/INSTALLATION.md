# Installation

This document defines the first explicit installation contract for
`odd_domain`.

## Position

Installing `odd_domain` means stamping a target project workspace with the
builder package and the minimum supporting surfaces required to use that
builder outside the source workspace.

The install target is a configured source-project instance consuming a released
`odd_domain` product.

It is not the `odd_domain` source workspace itself.

This installer is intentionally kept close in structure to the `odd_sdlc`
release installer.

The long-term direction is installer convergence across:

- `abiogenesis`
- `odd_sdlc`
- `odd_domain`

The current slice accepts some duplication so the `odd_domain` install contract
can become explicit now without waiting for the full shared-installer refactor.

The current convergence design is recorded in:

- `build_tenants/common/design/INSTALLER_CONVERGENCE_LINE.md`

## First-Slice Contract

The first installer is filesystem-first and release-oriented.

It installs:

- the `odd_domain` Python package under `.odd_domain/python/code/odd_domain`
- the shared common carrier assets under `build_tenants/common/`
- installed standards under `.genesis/docs/standards/`
- workspace bootstrap under `.ai-workspace/`
- install provenance under `.odd_domain/release/install_manifest.json`
- installed guidance into `AGENTS.md` and `CLAUDE.md`

It does not yet install:

- a database tenant
- a UI
- a full GTL/ABG runtime contract for project execution
- generalized release versioning beyond install provenance

## Shared Installer Split

The current family split is:

- substrate installer
  Owns shared kernel/bootstrap conventions and lower-level `.genesis`
  substrate behavior.
- shared `odd_*` installer line
  Owns package stamping, standards propagation, install provenance, workspace
  bootstrap, and instruction bootloaders.
- product-local overrides
  Own only product-specific paths, scaffold folders, verification commands,
  and runtime wording.

Installed standards move from source authority into installs by running
install. They are not manually mirrored into `.genesis`.

## Install Shape

After install, a target project should contain at least:

```text
<project-root>/
  .ai-workspace/
  .genesis/docs/standards/
  .odd_domain/
    python/code/odd_domain/
    release/install_manifest.json
  build_tenants/common/
  specification/
  docs/
  domain_artifacts/
  AGENTS.md
  CLAUDE.md
```

## Current Entrypoint

Run the installer from the source workspace with:

```bash
PYTHONPATH=build_tenants/python/code \
python -m odd_domain.release.install \
  --target /Users/jim/src/apps/ai_sdlc_examples/local_projects/odd_domains/project \
  --project-slug odd_domains
```

## Repository-Level Use

The current repository-level consumer shape is:

- repository root:
  `/Users/jim/src/apps/ai_sdlc_examples/local_projects/odd_domains`
- project target:
  `/Users/jim/src/apps/ai_sdlc_examples/local_projects/odd_domains/project`

The repository root holds released-product and source-project separation.

The project folder is the configured builder-project instance where domains are
built.

## Verification

After install, the first verification commands are:

```bash
PYTHONPATH=.odd_domain/python/code \
python -m odd_domain.world_model.validate build_tenants/common/examples/world_fragment_minimal

PYTHONPATH=.odd_domain/python/code \
python -m odd_domain.build_line.fpml_trade_domain

PYTHONPATH=.odd_domain/python/code \
python -m odd_domain.build_line.trade_to_apra

PYTHONPATH=.odd_domain/python/code \
python -m odd_domain.query.trade_to_apra
```

## Interpretation Rule

The install manifest tells you what was stamped into the target workspace.

Installed standards tell you how world-model work should be done.

Project-owned specification tells you what the configured project is trying to
build.

Published outputs under `domain_artifacts/` are the project's own domain
artifacts, not source-workspace examples.
