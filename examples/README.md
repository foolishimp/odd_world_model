# Example Domains

This directory holds the retained root-level example hierarchy for
`odd_world_model`.

Each example domain separates:

- `sources/`
  retained source authority, local source data, PDFs, code samples, and URI
  ledgers for the domain
- `sandbox/<datetime>_<version>/`
  a versioned installed `odd_world_model` instance for that domain
- `sandbox/<datetime>_<wm-product-version>.TS/`
  an immutable world-model instance cut built by one exact TypeScript product
  deployment over the retained source corpus

`sources/` is the retained rebuild authority for the example domain. New
`sandbox/<datetime>_<version>/` or `sandbox/<datetime>_<version>.TS/` cuts may
be stamped side by side against the same source corpus as later
`odd_world_model` releases or release candidates change the world-model build
line.

The existing unsuffixed sandbox cuts are retained Python-built references. Do
not rename them as part of the TypeScript rebuild.

Current sandbox authority is
`build_tenants/common/design/adrs/ADR-WM-006-versioned-installed-product-example-sandboxes.md`.
The earlier odd_sdlc/filesystem runner is historical only.

Every current TypeScript cut has `wm-instance.json` as its prime identity
surface. It binds one source inventory to one exact installed product manifest
and indexes the semantic, physical, mesh, context, query, runtime, proof, and
comparison projections produced by that build.

Build all retained examples with an exact development deployment:

```text
cd build_tenants/typescript
npm run sandbox:examples
```

Build one example or select a previously deployed WM product:

```text
npm run sandbox:examples -- --example banking_product_model
npm run sandbox:examples -- --deployment /absolute/path/to/deployment-manifest.json
npm run sandbox:inspect -- --instance /absolute/path/to/instance --source-root /absolute/path/to/sources
```

An existing instance cut is never overwritten. Running another WM deployment
creates another side-by-side cut. Development deployments and their local
Python environments are cached under `build_tenants/typescript/test_env/deployments/`
and are not source truth.

Current cuts preserve comparable output families where semantically
applicable:

- exact source inventory and product binding
- candidate Markov-object and semantic-publication evidence
- PyIceberg physical state and DuckDB exact-snapshot evidence
- ABG runtime events and replay-derived admission witnesses
- bounded mesh, context-memory, invocation, and query projections
- proof and historical-reference comparison projections

The comparison target is source-to-artifact behavior and recoverability, not
copied runtime internals. The first current cuts are explicitly development
reference evidence: native GraphFunction payload execution, calibrated F_P
authorship, and replay-native semantic projection remain typed gaps.

Current example domains:

- `trade_source_model/`
- `trade_representation_model/`
- `apra_liquidity_model/`
- `banking_product_model/`
