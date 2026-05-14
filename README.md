# odd_world_model

`odd_world_model` is a world-model construction product.

The source workspace at repo root defines the product, build line, installer,
and retained example-domain hierarchy. The example domains live under
`examples/`, and each versioned sandbox is an installed `odd_world_model`
instance with immutable runtime/package assets under `.genesis/` and mutable
working state under `.ai-workspace/`. Within each example domain, `sources/` is
the retained rebuild authority and `sandbox/<datetime>_<version>/` is a derived
installed cut that can be restamped by later `odd_world_model` versions against
the same source corpus.

Methodology master: `https://github.com/foolishimp/specification_methodology`

Start with these surfaces:

- `AGENTS.md`
- `CLAUDE.md`
- `.genesis/docs/standards/SPEC_METHOD.md`
- `specification/GOALS.md`
- `specification/INTENT.md`
- `specification/PRODUCT.md`
- `specification/requirements/`
- `examples/`
- `build_tenants/python/`
- `.genesis/docs/LLM_GTL_APP_BUILDER_GUIDE.md`
