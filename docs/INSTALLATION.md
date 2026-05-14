# Installation

This document defines the first explicit installation contract for
`odd_world_model`.

## Position

Installing `odd_world_model` means stamping a target project workspace with the
builder package and the minimum supporting surfaces required to use that
builder outside the source workspace.

The install target is a configured source-project instance consuming a released
`odd_world_model` product.

It is not the `odd_world_model` source workspace itself.

This installer is intentionally kept close in structure to the `odd_sdlc`
release installer.

The long-term direction is installer convergence across:

- `abiogenesis`
- `odd_sdlc`
- `odd_world_model`

The current slice accepts some duplication so the `odd_world_model` install contract
can become explicit now without waiting for the full shared-installer refactor.

The current convergence design is recorded in:

- `build_tenants/common/design/INSTALLER_CONVERGENCE_LINE.md`

## First-Slice Contract

The first installer is filesystem-first and release-oriented.

It installs:

- the `odd_world_model` Python package under `.genesis/odd_world_model/python/code/odd_world_model`
- the installed carrier assets under `.genesis/odd_world_model/python/code/odd_world_model/assets/`
- the retained root-level example hierarchy under `examples/`
- installed standards under `.genesis/docs/standards/`
- workspace bootstrap under `.ai-workspace/`
- install provenance under `.genesis/odd_world_model/release/install_manifest.json`
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
  .genesis/
    docs/standards/
    odd_world_model/
      python/code/odd_world_model/
        assets/
      release/install_manifest.json
  examples/
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
python -m odd_world_model.release.install \
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
PYTHONPATH=.genesis:.genesis/odd_world_model/python/code \
python -m odd_world_model.world_model.validate \
  examples/trade_representation_model/sandbox/20260419T000000Z_v1/published/trade_representation_domain

PYTHONPATH=.genesis:.genesis/odd_world_model/python/code \
python -m odd_world_model.build_line.trade_to_apra

PYTHONPATH=.genesis:.genesis/odd_world_model/python/code \
python -m odd_world_model.query.trade_to_apra
```

## Interpretation Rule

The install manifest tells you what was stamped into the target workspace.

Installed standards tell you how world-model work should be done.

Project-owned specification tells you what the configured project is trying to
build.

Within each example domain, `sources/` is the retained rebuild authority:
source data, PDFs, code samples, and URI ledgers that remain stable as the
world-model build line changes.

Published example outputs under `examples/<domain>/sandbox/<datetime>_<version>/`
are the project's own retained domain-model instances, not source-workspace
commentary. New sandbox versions may be stamped alongside earlier cuts from the
same `sources/` corpus as different `odd_world_model` versions rebuild the
domain.
