# STRATEGY: odd_domain GTL Basis From odd_sdlc Review

**Author**: codex
**Date**: 2026-04-16T00:00:13Z
**Addresses**: `build_tenants/common/design/ATTRIBUTE_LEDGER_BUILD_LINE.md`, `specification/PRODUCT.md`, `specification/requirements/20-domain-build-and-composition-capability.md`, `specification/requirements/30-domain-build-and-composition-constraints.md`
**Status**: Draft

## Summary

I reviewed `odd_sdlc` as the logical basis for the proposed `odd_domain`
attribute-ledger design.

The conclusion is:

- the current `odd_domain` design direction is sound
- the current `odd_domain` implementation is still only `GTL-shaped`
- `odd_sdlc` shows the structural pattern that `odd_domain` should now adopt
  if this line is to become a real GTL realization rather than a Python
  prototype with better semantics

The important carryover is not the SDLC-specific asset taxonomy. It is the
structural law:

1. typed domain nodes/assets
2. explicit named graph functions over those nodes
3. a published GTL module as the execution carrier
4. a query surface that projects current checkpoints and provenance without
   collapsing the constructive history

## Review Basis

I reviewed the following `odd_sdlc` surfaces:

- [gtl_module.py](/Users/jim/src/apps/odd_sdlc/build_tenants/python/code/odd_sdlc/gtl_module.py:1)
- [function_catalog.py](/Users/jim/src/apps/odd_sdlc/build_tenants/python/code/odd_sdlc/function_catalog.py:1)
- [query.py](/Users/jim/src/apps/odd_sdlc/build_tenants/python/code/odd_sdlc/query.py:1)
- [02-graph-functions.md](/Users/jim/src/apps/odd_sdlc/specification/requirements/02-graph-functions.md:1)
- [07-asset-typing-and-binding.md](/Users/jim/src/apps/odd_sdlc/specification/requirements/07-asset-typing-and-binding.md:1)

Those surfaces show that `odd_sdlc` is not merely using graph language. It is
actually organized as:

- typed asset nodes
- machine-readable function catalog entries
- GTL `GraphFunction` carriers
- published module-level graph/function binding
- current-query projection over checkpoint/provenance history

## Analysis

### What odd_sdlc Proves

`odd_sdlc` proves a few load-bearing points that matter directly for
`odd_domain`.

First, graph functions are the primary constructive carrier, not one optional
wrapper around bespoke product-local executors.

Second, concrete assets bind into typed nodes explicitly. The graph is not one
hidden global project graph.

Third, the live line publishes a machine-readable function catalog. Inputs,
outputs, and intent are inspectable without prompt folklore.

Fourth, the current visible state is treated as a projection over constructive
history. Query does not erase lineage.

Those are the real GTL lessons to carry forward.

### Where odd_domain Is Already Aligned

The current `odd_domain` line is directionally aligned with that pattern.

It already has the right semantic chain:

`source -> tracing -> assurance -> attribute ledger -> object cut -> published domain artifact -> composed world model`

It also already has the right deterministic primitive split:

- `F_D`-style materialization for trace, assurance, ledger, and object-cut
  records
- explicit query/explainability over the resulting corpus

The design surface at
[ATTRIBUTE_LEDGER_BUILD_LINE.md](/Users/jim/src/apps/odd_domain/build_tenants/common/design/ATTRIBUTE_LEDGER_BUILD_LINE.md:1)
is therefore not wrong. It is a valid precursor.

### Where odd_domain Still Falls Short Of odd_sdlc

The missing part is that the current line is still orchestrated by Python
builders rather than by a real GTL module and named graph functions.

Today, the constructive flow still lives mainly in:

- [fpml_trade_domain.py](/Users/jim/src/apps/odd_domain/build_tenants/python/code/odd_domain/sandbox/fpml_trade_domain.py:1)
- [trade_to_apra.py](/Users/jim/src/apps/odd_domain/build_tenants/python/code/odd_domain/sandbox/trade_to_apra.py:1)

So the current state is:

- semantically repriced
- structurally improved
- still not yet GTL-native in the same way `odd_sdlc` is

That gap matters because otherwise `odd_domain` risks keeping the semantic
model in the docs while leaving the constructive carrier in product-local
scripts.

### What Should Carry Over

The right carryover from `odd_sdlc` is the pattern below.

`odd_domain` should define typed callable nodes or asset families for at least:

- source observation surfaces
- trace records
- assurance records
- attribute-ledger entries
- Markov object cuts
- published domain artifacts
- composition surfaces
- composed world models

Then it should publish named graph functions over those nodes, for example:

- `trace_source_observations`
- `assure_attribute_claims`
- `materialize_attribute_ledger`
- `project_markov_object_cut`
- `publish_domain_artifact`
- `compose_world_model`

Those names are illustrative only. The point is the callable structure.

The query line should then read current state as a projection over that
constructive history, exactly as `odd_sdlc` does for asset checkpoints.

## Recommended Reading Of The Proposed Design

The proposed design should be accepted with one important refinement:

It should be read as the semantic and requirement basis for a GTL realization,
not as the final runtime form.

In other words:

- keep the attribute-ledger chain
- keep the object-cut semantics
- keep the trace/assurance/sourceability law
- but re-express the build as typed GTL graph functions rather than leaving the
  constructive carrier inside sandbox scripts

## Recommended Action

1. Treat the current `odd_domain` attribute-ledger design as ratified semantic
   direction, not as final runtime realization.
2. Add the next implementation wave explicitly:
   - publish an `odd_domain` GTL module
   - publish an `odd_domain` function catalog
   - bind concrete review and published assets into typed callable nodes
   - migrate semantic derivation from sandbox orchestrators into graph
     functions
3. Preserve `F_D` as the deterministic record-materialization layer rather than
   expanding it into a rival constructive runtime.
4. Keep the query lane projection-based, reading current object state and
   artifact state as the visible projection over constructive history.

## Bottom Line

`odd_sdlc` is a valid logical basis for this line.

It does not say that `odd_domain` should copy SDLC asset names.
It says that `odd_domain` should adopt the same GTL discipline:

- typed semantic nodes
- named graph functions
- published module carrier
- projection/query over governed history

Until that lands, `odd_domain` has a strong semantic prototype and a lawful
design, but not yet a true GTL implementation.
