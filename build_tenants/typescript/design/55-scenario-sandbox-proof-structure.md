# TypeScript Scenario Sandbox Proof Structure

**Status**: Active target design
**Date**: 2026-05-15
**Reference implementation**:
- `/Users/jim/src/apps/odd_sdlc/build_tenants/typescript/test_env/sandbox/scenario_sandbox.mjs`
- `/Users/jim/src/apps/odd_sdlc/build_tenants/typescript/test_env/sandbox/scenarios/README.md`

The TypeScript world-model proof line should reuse the generic `odd_sdlc`
scenario sandbox structure rather than create a separate world-model-specific
runner.

## Reused Sandbox Contract

The generic sandbox shape is:

```text
build_tenants/typescript/test_env/
├── fixtures/
├── sandbox/
│   ├── scenario_sandbox.mjs
│   └── scenarios/
│       └── <scenario>.scenario.mjs
└── test_runs/
    └── <scenarioId>/
        └── <timestamp>_pid<pid>/
            ├── abg_install/
            ├── abg_installed_command_probe/
            ├── abg_installed_workspace/
            └── workspace/
```

The reusable flow is:

1. mint a run root under `test_env/test_runs/<scenarioId>/`
2. provision an ABG installed sandbox
3. copy a fixture into a fresh `workspace/`
4. install `odd_sdlc.TS` into that workspace
5. run `gaps -> start` through the installed command surface
6. assert scenario expectations against workspace files, operator archives,
   event evidence, graph targets, overlays, process checks, and closure

World-model scenarios should be data descriptors plus fixture roots. They
should not fork traversal, installation, run-root minting, or archive logic.

## World-Model Fixture Mapping

Retained example source directories are fixture authority:

```text
examples/<domain>/sources/
```

For each admitted example domain, the TypeScript tenant should define a
scenario descriptor that points at the retained source corpus and declares the
expected graph-function, publication, query, mapping, proof, and
recoverability outputs.

The first scenario family should cover:

- `trade_source_model`
- `trade_representation_model`
- `apra_liquidity_model`
- `banking_product_model`

## Comparison Cut Rule

The authoritative TypeScript execution archive is the generic sandbox run under
`build_tenants/typescript/test_env/test_runs/`.

When side-by-side comparison against retained Python-built references is useful,
the run may also emit or export a comparison projection under:

```text
examples/<domain>/sandbox/<datetime>_<version>.TS/
```

That `.TS` directory is a comparison cut projected from the generic sandbox
run. It is not a second runner and not a copy of Python runtime state.

The comparison projection should include comparable output families where
applicable:

- source/config context for the admitted example corpus
- graph-function manifests and run results
- ABG or installed-operation event evidence
- published domain artifacts
- review and query projections
- mapping records and proof summaries
- comparison notes that record semantic matches, declared deltas, and omitted
  Python-only runtime payloads

Old `.genesis` roots and installed Python package payloads are retained only in
the Python-built reference sandboxes. They are not required in TypeScript
comparison cuts.

## Acceptance

The TypeScript proof line is acceptable when:

- world-model retained examples run through the generic scenario sandbox
  contract
- each admitted scenario has a descriptor and fixture authority
- run evidence is archived under `test_env/test_runs/<scenarioId>/`
- `.TS` comparison cuts, when emitted, are projections from the generic run
- comparison evaluates source-to-artifact behavior and recoverability rather
  than Python runtime parity
