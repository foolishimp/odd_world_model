# ADR-001 TypeScript GTL/ABG Tech Stack

**Status**: Accepted
**Date**: 2026-05-15
**Scope**: TypeScript tenant technology stack, GTL/ABG binding, and first graph-build trigger boundary
**Ticket**: `T-026`

## Context

`odd_world_model` is rebuilding its forward realization line under
`build_tenants/typescript/`.

The live product definition and requirements live under `specification/`.
They define product `WHAT`. This ADR defines the first downstream TypeScript
tenant `HOW` needed to start graph construction without treating technology as
product law.

The governing GTL/ABG reference is:

- `/Users/jim/src/apps/abiogenesis/docs/LLM_GTL_APP_BUILDER_GUIDE.md`

The relevant substrate law is:

- GTL declares constructive structure.
- `GraphFunction` is the public callable workflow carrier.
- `Job` binds durable semantic work to published graph functions, not bare
  graph vectors.
- `Module` is the GTL publication boundary.
- ABG owns graph calls, frames, continuations, runtime facts, traversal,
  replay, projection, correction, proof, and closure.
- Product-local code must not introduce an imperative executive loop as a
  second traversal runtime.

## Decision

The `odd_world_model` TypeScript tenant SHALL be a package-first TypeScript
realization over the ABIogenesis TypeScript tenant substrate.

### 1. Runtime And Language Stack

The tenant stack is:

- Node.js `>=20`
- ESM TypeScript package
- strict TypeScript semantic build
- Node built-in test runner for deterministic tenant tests
- `@abiogenesis/typescript-tenant` as the GTL/ABG substrate dependency

The package manifest and implementation files are downstream realization
surfaces. They must satisfy `specification/`; they do not define product truth.

### 2. GTL/ABG Binding

The tenant SHALL publish `odd_world_model` construction through GTL declarations:

- typed asset and node surfaces for the world-model product chain
- public `GraphFunction` carriers for constructive work
- one public executive graph function for the first rebuild slice
- `Job` bindings over public graph functions
- one GTL `Module` publication surface
- policy, proof, and closure declarations where needed

The first public executive carrier is:

`odd_world_model.rebuild_world_model_core`

It carries the product chain:

```text
source observation
-> traced evidence
-> assured claim
-> attribute ledger
-> immutable object cut
-> published domain artifact
-> composed world model
-> query/proof projection
```

Internal vectors may realize that chain, but they are not public job targets.

### 3. ABG Runtime Ownership

The TypeScript tenant SHALL delegate traversal to ABG.

The tenant may provide:

- GTL module construction
- typed domain asset definitions
- deterministic materializers
- app-owned projection and proof readers
- an app wrapper command that selects the published job or graph function

The tenant SHALL NOT provide:

- an app-owned loop that replaces ABG traversal
- hidden prompt-only policy
- graph-build scripts that write product truth outside GTL/ABG runtime facts
- compatibility paths that keep Python and TypeScript as co-equal active truth

### 4. First Graph-Build Trigger Contract

The first graph-build trigger is a tenant-local wrapper over ABG public start.

The intended implementation command shape is:

```text
npm run graph:build:first-slice
```

That script SHALL delegate to an app wrapper or ABG public runtime that targets:

```text
graph_function:odd_world_model.rebuild_world_model_core
```

The trigger is lawful only if the published GTL module includes:

- the executive graph function
- the materialized graph for that executive
- traversal-visible internal vectors through lawful refinement or candidate
  publication
- the semantic job binding
- typed asset-surface declarations for required and produced assets
- proof or closure evaluators for the bounded slice

Before those declarations exist, the trigger may be documented but must fail
closed or remain unimplemented.

### 5. Initial Source Layout

The TypeScript tenant implementation should materialize this source shape:

```text
build_tenants/typescript/
├── package.json
├── tsconfig.semantic-strict.json
├── code/
│   └── src/
│       ├── index.ts
│       ├── cli/
│       │   └── main.ts
│       ├── domain/
│       │   ├── assets.ts
│       │   └── evidence.ts
│       ├── gtl/
│       │   ├── functions.ts
│       │   ├── jobs.ts
│       │   └── module.ts
│       ├── build_line/
│       │   ├── source_observation.ts
│       │   ├── trace_surface.ts
│       │   ├── assurance_surface.ts
│       │   ├── attribute_ledger.ts
│       │   ├── object_cut.ts
│       │   ├── domain_artifact.ts
│       │   ├── composed_world_model.ts
│       │   └── query_projection.ts
│       └── proof/
│           └── first_slice.ts
└── test_env/
    ├── fixtures/
    ├── sandbox/
    │   ├── scenario_sandbox.mjs
    │   └── scenarios/
    ├── test_runs/
    └── tests/
        └── test_t026_graph_build_trigger.test.mjs
```

This is the initial target layout. It may be refined by later design, but the
graph-function, module, job, and ABG traversal boundaries are not optional.
The `test_env/sandbox` structure should reuse the generic scenario sandbox
pattern from `odd_sdlc` rather than introduce a world-model-specific runner.

## Consequences

### Positive

- The first TypeScript tenant slice can trigger graph construction through a
  published public carrier instead of a ported Python runner.
- The technology stack is explicit before code lands.
- ABG remains the runtime truth owner.
- The tenant can use retained Python behavior as comparison evidence without
  preserving Python architecture as the target.
- Later deterministic tests have a stable trigger contract.

### Negative

- The tenant cannot take a shortcut through a simple imperative build script.
- The first implementation wave must publish enough GTL structure before the
  graph-build trigger can lawfully run.
- Package setup and graph-module publication must land together for the first
  usable trigger.

## Non-Decisions

- This ADR does not select final persistence for published artifacts beyond the
  current specification law that the published semantic layer is the single
  world-model truth surface.
- This ADR does not define the full query plane.
- This ADR does not delete or rewrite the retained Python tenant.
- This ADR does not promote TypeScript into product definition.

## Acceptance

- The TypeScript tenant has a documented stack selection.
- The ADR names `@abiogenesis/typescript-tenant` as the GTL/ABG substrate.
- The ADR binds graph construction to a public `GraphFunction`, semantic `Job`,
  and GTL `Module`.
- The ADR states that ABG owns traversal and runtime facts.
- The ADR defines the intended first graph-build trigger contract.
- The ADR keeps the product `WHAT` in `specification/` and the TypeScript stack
  in design/realization.
