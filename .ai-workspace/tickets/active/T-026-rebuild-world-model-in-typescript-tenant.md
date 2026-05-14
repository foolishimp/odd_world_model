# T-026 Rebuild World Model In TypeScript Tenant

- id: T-026
- title: Rebuild world model in TypeScript tenant
- type: feature
- ticket_category: tenant_migration
- status: active
- governance_method: STDO
- method_stack: SPEC_METHOD, TICKET_METHOD, DESIGN_MODULE_METHOD, ODD_METHOD
- goal: proving-wave-07
- change_intent: define the technology-independent world-model product requirements first, then rebuild the retained world-model functionality through the selected forward realization tenant under current ODD Method, GTL, ABG, and odd_sdlc.TS execution contracts
- change_class: requirement_reprice
- re_entry_point: requirements
- triaged_at: 2026-05-14
- priority: high
- dependencies: T-023, T-025
- links: basis:T-023, basis:T-024, basis:T-025, basis:build_tenants/TENANT_REGISTRY.md, basis:build_tenants/typescript/README.md, basis:build_tenants/typescript/design/adrs/ADR-001-typescript-gtl-abg-tech-stack.md, basis:build_tenants/typescript/design/adrs/ADR-002-odd-sdlc-build-component-inheritance.md, basis:build_tenants/typescript/design/adrs/ADR-003-reference-derived-design-carry-forward.md, basis:AGENTS.md, basis:CLAUDE.md, basis:.abiogenesis/docs/standards/SPEC_METHOD.md, basis:.abiogenesis/docs/standards/TICKET_METHOD.md, basis:.abiogenesis/docs/standards/DESIGN_MODULE_METHOD.md, basis:.abiogenesis/docs/standards/ODD_METHOD.md, basis:/Users/jim/src/apps/abiogenesis/docs/LLM_GTL_APP_BUILDER_GUIDE.md
- intake_source: F_H authority after odd_sdlc.TS install migration
- affected_boundary: world-model realization tenant and active implementation authority
- created_at: 2026-05-14
- updated_at: 2026-05-15

## Context

`odd_world_model` has been migrated to the current `odd_sdlc.TS` installed
governance shape.

The source project now records:

- installed odd_sdlc.TS governance under `.abiogenesis/odd_sdlc/typescript/`
- current agent bootstraps that point at `odd-sdlc-ts`
- a registered `typescript` tenant under `build_tenants/TENANT_REGISTRY.md`
- a source-side TypeScript tenant root at `build_tenants/typescript/`

The current executable project realization still resolves as:

- active tenant: `python`
- selected output root: `build_tenants/python`

The Python tenant contains the retained historical implementation, but the
forward build should not continue by extending that line. ODD Method, GTL, ABG,
and odd_sdlc.TS have evolved. The next work should rebuild the world-model line
against the current graph-function, overlay, event, evidence, and closure model
rather than port Python modules file-for-file.

## STDO Governance

This ticket follows STDO Method.

For this workspace, STDO is the governance stack composed from:

- `SPEC_METHOD.md`
- `TICKET_METHOD.md`
- `DESIGN_MODULE_METHOD.md`
- `ODD_METHOD.md`

Execution must triage and close through:

`Goals -> Intent -> Product -> Requirements -> Design -> Code -> Tests/Proof -> Release`

The symptom is not the re-entry authority. The visible symptom is that the
current executable realization still resolves to the Python tenant. The
governing re-entry is the first missing or stale layer in the STDO chain.

For this ticket, the admitted re-entry is requirements. Requirements define the
world-model product `WHAT`: source observation, traced evidence, assurance,
attribute ledger, immutable object cuts, published domain artifacts, composed
world models, query/proof projections, and installable builder-product proof.

The TypeScript tenant selection belongs downstream in design and realization.
It must satisfy the product requirements; it must not become product
definition.

The first accepted TypeScript tenant design decisions are:

- `build_tenants/typescript/design/adrs/ADR-001-typescript-gtl-abg-tech-stack.md`
- `build_tenants/typescript/design/adrs/ADR-002-odd-sdlc-build-component-inheritance.md`
- `build_tenants/typescript/design/adrs/ADR-003-reference-derived-design-carry-forward.md`

ADR-001 selects the TypeScript stack, binds graph construction to GTL
`GraphFunction` / `Job` / `Module` publication, and keeps ABG as the owner of
traversal, runtime facts, replay, projection, proof, and closure.

ADR-002 records that installed `odd_sdlc` is used as a build component and
development product for SDLC governance, ticket/execution-contract
interpretation, operator surfaces, proof/release patterns, lineage ledgers, and
tracking registers. It keeps `odd_world_model` as the authored ODD domain
product and keeps world-model semantics under the product specification and
`WORLD_MODEL_METHOD.md`.

The intended use is that the TypeScript tenant can build custom world-model
domain graphs while reusing `odd_sdlc` lineage and tracking registers as build
evidence. Those registers do not replace the published world-model semantic
layer.

ADR-003 records that `build_tenants/python/design/` is stale reference design
evidence. Relevant feature layering, component responsibilities, module groups,
and proof lanes are carried forward into the TypeScript design pack, while
Python-specific stack, package, command, and test-runner choices are demoted to
historical evidence.

This ticket is therefore the durable STDO work authority for the parent rebuild
line. Later sprints or execution contracts may refine the implementation wave,
but they must trace back to this ticket or to a successor ticket created from
its repricing.

## Required Outcome

The required move is:

`Python retained realization -> frozen historical reference -> technology-independent product requirements -> selected realization design -> world-model graph functions -> deterministic and installed proof`

The rebuild must make the TypeScript tenant the forward implementation authority
for the world-model line while preserving Python as historical reference and
comparison evidence until TypeScript parity is proven.

## Scope

This ticket starts with `Rebuild World Model`.

The first retained TypeScript slice should cover the core world-model function
chain before broader mesh or operational-semantics enrichment:

1. source observation and source authority ingestion
2. world-model object and attribute carrier
3. evidence manifest and trace record carrier
4. attribute ledger materialization
5. published domain artifact materialization
6. composed world-model cut
7. query projection over the published cut
8. deterministic proof over retained example data

The first TypeScript slice should use current retained example domains only
where they clarify the carrier:

- `fpml_confirmation_source_domain`
- `trade_representation_domain`
- `apra_liquidity_domain`
- `banking_product_domain`

The retained examples should keep the current source/sandbox split. Existing
unsuffixed sandbox cuts are Python-built references.

TypeScript proof should reuse the generic scenario sandbox structure developed
in `odd_sdlc/build_tenants/typescript/test_env/sandbox`: fixture root, scenario
descriptor, fresh workspace, ABG installed sandbox evidence, installed
`odd_sdlc.TS`, `gaps -> start` advances, and archived closure evidence under:

```text
build_tenants/typescript/test_env/test_runs/<scenarioId>/<timestamp>_pid<pid>/
```

When side-by-side comparison is useful, a TypeScript proof run may also stamp a
sibling comparison projection under:

```text
examples/<domain>/sandbox/<datetime>_<version>.TS/
```

Each `.TS` comparison projection should use the same
`examples/<domain>/sources/` authority and preserve comparable graph, event,
published, review, query, mapping, and proof outputs where applicable. The
comparison target is source-to-artifact behavior and recoverability, not
Python runtime payload parity.

## Disable Python Tenant

Disabling the Python tenant means:

- no new forward implementation work should be added to `build_tenants/python`
- Python remains a retained historical reference and comparison surface
- Python artifacts may be read to understand behavior, but they do not define
  the new TypeScript architecture
- Python must not be deleted until TypeScript has equivalent admitted proof for
  the retained world-model slice

The implementation wave should eventually update source configuration so
`odd-sdlc-ts gaps --workspace .` resolves the active tenant as `typescript` and
the selected output root as `build_tenants/typescript`.

## Required Re-Entry

This is not a realization-only refactor.

The lawful re-entry starts at requirements because the product definition must
be rebuilt as a technology-independent world-model specification before any
tenant is treated as forward implementation authority.

The first implementation wave must therefore proceed in this order:

1. requirements
   - define world-model product requirements independent of implementation
     technology
   - define retained-reference boundaries for older prototypes and examples
   - define current graph-function, publication, install, and proof obligations
2. design
   - select and define the forward realization tenant
   - define the world-model graph-function catalog for that realization
   - define carrier boundaries for objects, attributes, evidence, traces,
     ledgers, published domains, composed cuts, and query projections
   - define how installed odd_sdlc.TS starts, proves, and projects the work
3. implementation
   - materialize the TypeScript tenant source surfaces under
     `build_tenants/typescript/`
   - implement the first world-model graph-function chain
   - keep installed `.abiogenesis/` payloads out of source truth
4. verification
   - deterministic TypeScript tests over the retained slice
   - installed `odd-sdlc-ts gaps --workspace .` proof after tenant switch
   - comparison notes against the Python retained behavior without treating
     Python as architecture authority

No implementation step should be treated as closed unless the STDO trace is
visible from ticket intent to requirements, design, code, and proof.

## Out Of Scope

- file-for-file Python port
- deleting the Python tenant before TypeScript proof exists
- extending Python to close this ticket
- reviving `.odd_sdlc/` or `.genesis/` as runtime roots
- promoting installed `.abiogenesis/` package payloads into project source
- broad mesh closure from T-023 before the core TypeScript world-model carrier
  is rebuilt
- operational-semantics enrichment from T-024 before the TypeScript carrier has
  a retained proof line

## Acceptance

- requirements define the technology-independent world-model product `WHAT`
  before tenant implementation work proceeds
- the execution contract for the rebuild cites this ticket as STDO work
  authority
- design or execution contract records the selected forward realization tenant
  as a downstream `HOW`
- `build_tenants/TENANT_REGISTRY.md` records Python as retained/reference or
  disabled and TypeScript as the forward active tenant once proof is ready
- source configuration makes `odd-sdlc-ts gaps --workspace .` resolve:
  - active tenant: `typescript`
  - selected output root: `build_tenants/typescript`
- TypeScript design defines the world-model graph-function chain and carrier
  boundaries
- TypeScript implementation materializes the first retained world-model slice
  under `build_tenants/typescript/`
- deterministic TypeScript proof validates the retained carrier shapes and
  graph-function outputs
- TypeScript proof reuses the generic `odd_sdlc` scenario sandbox structure for
  retained example domains
- scenario run archives are written under
  `build_tenants/typescript/test_env/test_runs/<scenarioId>/`
- optional `.TS` example cuts record comparison evidence against matching
  retained references without copying old Python runtime roots
- installed odd_sdlc.TS proof runs without relying on Python runtime roots
- Python remains available as historical comparison evidence, not forward
  implementation authority

## Notes

- This ticket is the parent rebuild ticket for the TypeScript world-model line.
- T-023 mesh work should wait for or build on the TypeScript world-model carrier
  rather than deepen the Python mesh line.
- T-024 operational-semantics enrichment remains a later enrichment track.
- T-025 generic four-domain topology mapping is retained as behavior/evidence
  to compare against, not as a mandate to preserve Python structure.
