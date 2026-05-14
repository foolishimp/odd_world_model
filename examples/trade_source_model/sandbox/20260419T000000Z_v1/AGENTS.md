<!-- ODD_WORLD_MODEL_BOOTLOADER_START -->
# odd_world_model Installed Builder Surface

This workspace consumes `odd_world_model` as an installed domain-builder app.
It is a configured project instance, not the `odd_world_model` source workspace.

## Workspace Identity
- workspace: `20260419T000000Z_v1`
- project slug: `trade_source_model`
- install manifest: `workspace://.genesis/odd_world_model/release/install_manifest.json`
- installed package root: `workspace://.genesis/odd_world_model/python/code/odd_world_model`
- installed package assets: `workspace://.genesis/odd_world_model/python/code/odd_world_model/assets/`
- installed runtime contract: `workspace://.genesis/odd_world_model/release/genesis.yml`
- installed runtime root: `workspace://.genesis/`
- installed standards: `workspace://.genesis/docs/standards/`
- this workspace is one versioned installed example-domain sandbox cut
- sandbox builder config: `workspace://.ai-workspace/context/world_builder_config.json`

## Read First
- `workspace://specification/GOALS.md` when present
- `workspace://specification/INTENT.md` when present
- `workspace://specification/PRODUCT.md` when present
- `workspace://docs/pilots/` for current proving lanes
- `workspace://.genesis/odd_world_model/release/install_manifest.json`
- `workspace://.genesis/docs/standards/WORLD_MODEL_METHOD.md`

## Operating Rule
- treat the project specification as project authority
- treat the installed `odd_world_model` package as the immutable builder substrate
- treat the installed `.genesis` runtime as the GTL/ABG execution substrate
- keep immutable installed package/runtime assets under `.genesis/`
- keep mutable working state under `.ai-workspace/` and mutable domain outputs under the sandbox root
- do not confuse this installed workspace with the source workspace that produced the release
- treat the sibling example-domain `sources/` tree as retained rebuild authority outside this installed cut

## First Verification Commands
- `PYTHONPATH=.genesis:.genesis/odd_world_model/python/code python -m odd_world_model programs --workspace .`
- `PYTHONPATH=.genesis:.genesis/odd_world_model/python/code python -m odd_world_model query-domain --workspace .`

## Interpretation Rule
- the install manifest explains what was stamped into this workspace
- installed standards explain the method and representation rules
- project-owned specs explain what this project is trying to build
- this workspace is one versioned installed example-domain sandbox instance
<!-- ODD_WORLD_MODEL_BOOTLOADER_END -->
