# T-007 Build odd_world_model Installer

- id: T-007
- type: feature
- status: completed
- goal: project-installation-wave-01
- priority: high
- dependencies: T-001, T-002, T-003, T-004, T-005, T-006
- created_at: 2026-04-15
- updated_at: 2026-04-15

## Context

`odd_world_model` now has a bounded world-model carrier, a real-standard ingestion
lane, a sandbox composition lane, and a side-by-side proof lane.

What it does not yet have is an explicit consumer install contract.

We now need a first installer that can stamp a project workspace with the
released builder package, shared carrier assets, installed standards, and
install metadata so `odd_world_model` can be consumed outside its source workspace.

## Acceptance

- `odd_world_model` has an explicit installation document that states what install
  means and what gets installed
- a product-owned installer entrypoint exists under the Python tenant
- the installer can scaffold a target project workspace idempotently
- the installer copies the builder package and shared common carrier assets
- the installer installs standards/docs needed for local operation
- the installer writes install provenance into the target workspace
- the installer is proven against the repository-level
  `ai_sdlc_examples/local_projects/odd_domains/project` target

## Completion

Completed by introducing:

- install contract:
  `docs/INSTALLATION.md`
- installer package:
  `build_tenants/python/code/odd_world_model/release/__init__.py`
- installer entrypoint:
  `build_tenants/python/code/odd_world_model/release/install.py`

The installer now stamps a target workspace with:

- `.odd_world_model/python/code/odd_world_model`
- `build_tenants/common`
- `.genesis/docs/standards`
- `.ai-workspace`
- `.odd_world_model/release/install_manifest.json`
- installed `AGENTS.md` and `CLAUDE.md` guidance

The installer was proven against:

- `/Users/jim/src/apps/ai_sdlc_examples/local_projects/odd_domains/project`

Verified with:

- `PYTHONPATH=build_tenants/python/code python -m odd_world_model.release.install --target /Users/jim/src/apps/ai_sdlc_examples/local_projects/odd_domains/project --project-slug odd_domains`
- `PYTHONPATH=/Users/jim/src/apps/ai_sdlc_examples/local_projects/odd_domains/project/.odd_world_model/python/code python -m odd_world_model.world_model.validate /Users/jim/src/apps/ai_sdlc_examples/local_projects/odd_domains/project/build_tenants/common/examples/world_fragment_minimal`
- `PYTHONPATH=/Users/jim/src/apps/ai_sdlc_examples/local_projects/odd_domains/project/.odd_world_model/python/code python -m odd_world_model.sandbox.fpml_trade_domain`
- `PYTHONPATH=/Users/jim/src/apps/ai_sdlc_examples/local_projects/odd_domains/project/.odd_world_model/python/code python -m odd_world_model.sandbox.trade_to_apra`
