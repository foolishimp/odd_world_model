# ADR-WM-002 Semantic Memory And Authority Boundaries

**Status**: Accepted
**Date**: 2026-07-12
**Ticket**: T-028
**Implements**:
- REQ-ODD-WORLD-MODEL-PRODUCT-003
- REQ-ODD-WORLD-MODEL-PRODUCT-004
- REQ-ODD-WORLD-MODEL-PRODUCT-008
- REQ-ODD-WORLD-MODEL-WORLD-OBJECT-009
- REQ-ODD-WORLD-MODEL-WORLD-OBJECT-011
- REQ-ODD-WORLD-MODEL-WORLD-OBJECT-012
- REQ-ODD-WORLD-MODEL-BUILD-CONSTRAINT-001
- REQ-ODD-WORLD-MODEL-BUILD-CONSTRAINT-002
- REQ-ODD-WORLD-MODEL-BUILD-CONSTRAINT-003
- REQ-ODD-WORLD-MODEL-BUILD-CONSTRAINT-004
- REQ-ODD-WORLD-MODEL-BUILD-CONSTRAINT-005
- REQ-ODD-WORLD-MODEL-CONTEXT-MEMORY-001
- REQ-ODD-WORLD-MODEL-CONTEXT-MEMORY-002
- REQ-ODD-WORLD-MODEL-CONTEXT-MEMORY-003
- REQ-ODD-WORLD-MODEL-CONTEXT-MEMORY-004
- REQ-ODD-WORLD-MODEL-CONTEXT-MEMORY-005
- REQ-ODD-WORLD-MODEL-CONTEXT-MEMORY-006
- REQ-ODD-WORLD-MODEL-CONTEXT-MEMORY-CONSTRAINT-001
- REQ-ODD-WORLD-MODEL-CONTEXT-MEMORY-CONSTRAINT-002
- REQ-ODD-WORLD-MODEL-CONTEXT-MEMORY-CONSTRAINT-003
- REQ-ODD-WORLD-MODEL-CONTEXT-MEMORY-CONSTRAINT-004
- REQ-ODD-WORLD-MODEL-CONTEXT-MEMORY-CONSTRAINT-006
- REQ-ODD-WORLD-MODEL-MESH-CAP-001
- REQ-ODD-WORLD-MODEL-MESH-CAP-008
- REQ-ODD-WORLD-MODEL-MESH-CAP-009
- REQ-ODD-WORLD-MODEL-MESH-CAP-010
- REQ-ODD-WORLD-MODEL-MESH-CONSTRAINT-001
- REQ-ODD-WORLD-MODEL-MESH-CONSTRAINT-008
- REQ-ODD-WORLD-MODEL-MESH-CONSTRAINT-009
- REQ-ODD-WORLD-MODEL-MESH-CONSTRAINT-010
- REQ-ODD-WORLD-MODEL-MESH-CONSTRAINT-011
**Derives from**:
- INT-ODD-WORLD-MODEL-001
- PROD-ODD-WORLD-MODEL-001
- T-023
- completed T-027
**Supersedes**:
- file/Git publication authority in `../WORLD_MODEL_REPRESENTATION_TENANT.md`
- filesystem-first current-query topology in `../CURRENT_QUERY_TRAVERSAL_SLICE.md`

## Context

The Product defines WM as governed semantic memory over source evidence,
published cuts, typed mesh links, bounded context, and attributed LLM output.
Legacy common design makes files and Git the publication authority and treats
query as direct filesystem loading. That topology cannot provide exact
multi-consumer context bases without duplicating semantic authority.

## Decision

### One Published Semantic Truth

The admitted published semantic layer is the single WM truth surface.

Source observations, F_P proposals, review records, prompts, caches, indexes,
query tables, reports, and model outputs are subordinate until the declared
admission and semantic-acceptance path makes a publication true.

### Mesh Is Reference Topology

Published semantic cuts remain local and immutable. Typed links reference exact
cuts. A bounded mesh cut selects exact refs for one purpose and never copies
publication truth.

### Context Is A Loss-Declared Projection

Every governed model invocation consumes one exact `ContextBasis` and one
versioned `ContextProjection`. The projection discloses fidelity, loss,
exclusions, truncation, and gaps. The invocation record binds output to that
basis permanently.

### Physical State Requires Attestation

Physical storage does not become semantic authority by holding data. One
`SemanticCutAttestation` binds an admitted semantic cut to exact physical table
snapshot identities, schemas, digests, governing refs, and proof state.

Only an attested snapshot vector is readable as a published WM cut.

### Effects Stay At The Edge

Storage and model calls are explicit effect boundaries. The storage adapter is
deterministic/effectful, even when implemented in Python. The model call is F_P
only where it performs calibrated probabilistic semantic work. Neither may
admit itself, mutate semantic ledgers directly, or decide continuation.

### Selected Substrate Is Isolated

The exact rc.3 proving family is consumed through a tenant-local
`substrate_binding` seam. Domain kernels depend on local WM carrier contracts,
not rc.3 source paths or unadmitted raw values. This keeps successor migration
bounded to adapters, declarations, conformance, and proof when meaning stays
stable.

### Public GTL Catalog Is A Separate Decision

This ADR fixes authority and module seams, not graph-function names or public
granularity. Accepted ADR-WM-004 owns those choices.

## Consequences

### Positive

- one semantic truth surface survives storage and query evolution;
- context provenance is exact and staleness is judgeable;
- selected-substrate migration does not require domain semantic redesign;
- TypeScript and Python can cooperate without moving authority into a process
  boundary; and
- mesh complexity stays finite per interaction goal.

### Negative

- publication requires attestation after physical writes;
- a semantic cut spanning tables cannot be identified by one snapshot ID;
- consumers must resolve exact snapshot vectors; and
- legacy filesystem outputs require explicit migration or remain historical.

## Acceptance

- the common architecture names one truth surface and one physical bridge;
- every model output can resolve its exact context basis;
- every published physical cut can resolve its full snapshot vector;
- failed effects and unresolved semantics remain typed gaps;
- no module owns another layer's admission or continuation authority;
- rc.3 knowledge is isolated from domain kernels; and
- the accepted ADR-WM-004 catalog is consumed without changing these authority
  boundaries.
