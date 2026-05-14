# Example Domains

This directory holds the retained root-level example hierarchy for
`odd_world_model`.

Each example domain separates:

- `sources/`
  retained source authority, local source data, PDFs, code samples, and URI
  ledgers for the domain
- `sandbox/<datetime>_<version>/`
  a versioned installed `odd_world_model` instance for that domain
- `sandbox/<datetime>_<version>.TS/`
  an optional TypeScript-built comparison projection over the same retained
  source corpus

`sources/` is the retained rebuild authority for the example domain. New
`sandbox/<datetime>_<version>/` or `sandbox/<datetime>_<version>.TS/` cuts may
be stamped side by side against the same source corpus as later
`odd_world_model` releases or release candidates change the world-model build
line.

The existing unsuffixed sandbox cuts are retained Python-built references. Do
not rename them as part of the TypeScript rebuild.

TypeScript proof runs should reuse the generic scenario sandbox shape from
`odd_sdlc/build_tenants/typescript/test_env/sandbox`: descriptor, fixture root,
fresh workspace, installed ABG/odd_sdlc state, `gaps -> start` advances, and
archived closure evidence under `build_tenants/typescript/test_env/test_runs/`.

TypeScript comparison cuts under `examples/*/sandbox/*.TS/` are optional
projections from those generic runs. They should mirror comparable output
families where semantically applicable:

- source/config context for the admitted example corpus
- graph-function manifests and run results
- ABG event evidence
- published domain artifacts
- review, query, mapping, and proof projections when the example requires them
- comparison notes that explain any semantic delta from the retained
  Python-built reference

The comparison target is source-to-artifact behavior and recoverability, not
the copied Python runtime payload. TypeScript cuts should not copy installed
Python package state or old `.genesis` runtime roots.

Current example domains:

- `trade_source_model/`
- `trade_representation_model/`
- `apra_liquidity_model/`
- `banking_product_model/`
