# TypeScript World-Model ODD Design

**Status**: Active target design
**Date**: 2026-05-15
**Derived from**:
- `build_tenants/python/design/30-generated-odd-design.md`
- `build_tenants/typescript/design/20-feature-decomposition.md`
- `build_tenants/typescript/design/adrs/ADR-001-typescript-gtl-abg-tech-stack.md`
- `build_tenants/typescript/design/adrs/ADR-002-odd-sdlc-build-component-inheritance.md`
- `build_tenants/typescript/design/adrs/ADR-003-reference-derived-design-carry-forward.md`

## Design Principle

`odd_world_model` is designed as a TypeScript ODD domain product whose
constructive carrier is a published GTL module of named graph functions, and
whose semantic substrate is a ledger-backed world-model line.

The design keeps four boundaries explicit:

1. `specification/` defines the product WHAT.
2. `odd_world_model` owns world-model construction, composition, mapping,
   query, and proof meaning.
3. installed `odd_sdlc` governs build lineage, tracking registers,
   ticket/execution contracts, and operator evidence.
4. ABG owns traversal, frames, continuations, runtime facts, replay,
   projection, proof, and closure mechanics.

The core semantic chain is:

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

## Component Index

| Component | Responsibility | Target Modules | Feature Alignment |
|---|---|---|---|
| C-CARRIER | Typed domain assets, graph functions, jobs, GTL module, function catalog | `domain/`, `gtl/` | FEAT-TS-CARRIER-001 |
| C-SDLC-GOVERNANCE | `odd_sdlc` build evidence and operator/register adapters | `sdlc/` | FEAT-TS-SDLC-GOV-001 |
| C-ADAPTER | Source-shape ingestion and bounded source-domain decomposition | `adapters/` | FEAT-TS-BUILD-001 |
| C-BUILD | Semantic build-line transforms from source observation to publication | `build_line/` | FEAT-TS-BUILD-001, FEAT-TS-BUILD-002, FEAT-TS-BUILD-003 |
| C-WORLD | Attribute ledger, object cuts, published artifacts, validation, registry | `world_model/` | FEAT-TS-BUILD-002, FEAT-TS-BUILD-003 |
| C-COMPOSE | Reference-preserving composition over published artifacts | `world_model/composition.*` | FEAT-TS-COMP-001 |
| C-MAPPING | Mapping and correspondence over published domains | `mapping/` | FEAT-TS-MAPPING-001 |
| C-QUERY | Query and traversal projections over constructive history | `query/` | FEAT-TS-QUERY-001 |
| C-PROOF | Conventional, covariant, and reverse-recoverability proof | `proof/` | FEAT-TS-PROOF-001 |
| C-RELEASE | Release/install boundary and installed builder-product proof | `release/` | FEAT-TS-RELEASE-001 |

## Target Dependency Graph

```text
domain/assets + gtl/functions + gtl/jobs + gtl/module
  -> sdlc/build_evidence
  -> adapters/source_domain
  -> build_line/source_observation
  -> build_line/trace_surface
  -> build_line/assurance_surface
  -> world_model/attribute_ledger
  -> world_model/object_cut
  -> world_model/domain_artifact
  -> world_model/composition
  -> mapping/correspondence
  -> query/projection
  -> proof/reverse_recoverability
  -> release/install_boundary
```

This graph describes realization dependency, not runtime traversal ownership.
Runtime traversal remains ABG-owned through published graph functions.

## C-CARRIER - ODD Runtime Carrier

The carrier publishes:

- typed source, trace, assurance, ledger, object-cut, artifact, composition,
  mapping, query, proof, and build-evidence assets
- `odd_world_model.rebuild_world_model_core`
- later graph functions for source-domain build, publication, composition,
  mapping, saturation, and installed proof as they are admitted
- GTL jobs over public graph functions
- one GTL module publication surface

The carrier must not hide graph movement inside TypeScript service methods.
TypeScript modules implement bounded deterministic pieces beneath GTL/ABG.

## C-SDLC-GOVERNANCE - Build Evidence Adapter

This component reads or adapts installed `odd_sdlc` governance evidence:

- lineage ledgers
- requirement-closure registers
- design-depth and component-depth registers
- execution contracts
- gaps/start/rc operator projections
- release/install proof evidence

It may annotate graph-build proof with build-governance evidence. It must not
become the semantic source for world-model objects, attributes, treatments,
covariance, mappings, or published artifacts.

## C-ADAPTER - Source Shape Ingestion

Source adapters are categorical decomposition readers. They normalize source
families such as FpML, schemas, code, Markdown, PDFs, event streams, or APIs
into source observations and source-domain candidates.

Adapters produce reviewable evidence. They do not publish final semantic truth.

## C-BUILD - Semantic Build Line

The build line carries the accepted world-model chain:

1. source observation
2. traced evidence
3. assured claim
4. attribute-ledger entry
5. immutable object cut
6. published domain artifact

The TypeScript implementation may use deterministic materializers for file or
record writes, but the lawful movement between these states belongs to the
published graph function.

## C-WORLD - Ledger-Backed Semantic Substrate

The attribute ledger is the immediate semantic source for object cuts.

Published artifacts must be immutable cuts with explicit identity, version,
source evidence, treatment semantics, and supersession lineage. Validation is
local to the carrier and should fail closed when required source evidence or
ledger support is absent.

## C-COMPOSE - World-Model Composition

Composition operates over published artifacts, not mutable workspaces.

It preserves local authority, bounded-context meaning, artifact identity,
version, treatment, declared ambiguity, and declared loss at stitch points.

## C-MAPPING - Governed Mapping

Mapping operates downstream of published domains and composed world models.

The retained trade-to-APRA Python slice is reference evidence for the boundary,
but the target TypeScript design is generic to published domains. A durable
mapping record is a product-owned projection over published semantic truth, not
a helper report.

## C-QUERY - Projection Over Constructive History

Query and traversal expose the current state of published artifacts, mappings,
compositions, and proof evidence as projections over constructive history.

The first implementation may be filesystem-first. Later query or serving
planes remain downstream projections unless a separate design reprices them.

## C-PROOF - Product Proof

Proof must cover both:

- software/ODD carrier closure through GTL/ABG and installed `odd_sdlc`
  governance evidence
- world-model semantic closure through source-to-ledger-to-artifact
  recoverability

Conventional and covariant projections are proof outputs over the same
semantic substrate.

Retained example proof should run through the generic scenario sandbox pattern
proven in `odd_sdlc/build_tenants/typescript/test_env/sandbox`. The primary
TypeScript archive lives under:

```text
build_tenants/typescript/test_env/test_runs/<scenarioId>/<timestamp>_pid<pid>/
```

That run root contains the ABG installed sandbox evidence, copied workspace,
installed `odd_sdlc.TS` state, operator-run archives, graph movement evidence,
and scenario assertions.

When side-by-side comparison is useful, the run may also emit a sibling
TypeScript comparison cut under:

```text
examples/<domain>/sandbox/<datetime>_<version>.TS/
```

Those cuts use the same `examples/<domain>/sources/` authority as the retained
Python-built references and mirror the comparable output families: graph
manifests, run results, ABG or installed-operation events, published fragments,
review/query projections, mapping records, proof summaries, and comparison
notes.

The `.TS` cut is not a port of the Python sandbox runtime. It is a comparison
projection from the TypeScript graph-function proof run.

## C-RELEASE - Installed Builder Product Boundary

The release boundary proves that `odd_world_model` can be installed as a
builder product into a separate builder project.

The installed product may use shared installer mechanics, but it must preserve
`odd_world_model` product identity, method guidance, assets, provenance, and
publication obligations.

## Python Reference Carry-Forward

Preserved:

- component layering
- source-to-artifact semantic chain
- ledger-backed world-model substrate
- query/proof downstream position
- installed-product boundary

Not preserved:

- Python package names
- Python commands
- Python-first stack and test runner
- direct FpML/trade/APRA hardcoding as the generic design
- local runtime loops that compete with ABG traversal
