# Governed Context Memory Capability Requirements

**Family**: REQ-ODD-WORLD-MODEL-CONTEXT-MEMORY-*
**Status**: Active
**Category**: Capability

### REQ-ODD-WORLD-MODEL-CONTEXT-MEMORY-001 — Unified Governed Semantic Memory

**Carries**:
- `INTENT.md` — `Purpose`, `Outcomes`
- `PRODUCT.md` — `Governed Context Memory`

`odd_world_model` SHALL make application behavior, code, data, events,
documents, transformations, and published semantic cuts available as one
governed context-memory surface while preserving each source's distinct
identity, provenance, authority, and temporal coordinates.

### REQ-ODD-WORLD-MODEL-CONTEXT-MEMORY-002 — Exact Context Basis

**Carries**:
- `INTENT.md` — `Outcomes`, `Constraints`
- `PRODUCT.md` — `Governed Context Memory`, `Context Basis`

Every governed LLM invocation SHALL resolve an immutable context basis that
identifies the exact published node and semantic-link refs and digests, bounded
mesh-cut declaration, temporal coordinates, projection contract and version,
source and semantic authority, freshness, fidelity, loss, exclusions,
truncation, and unresolved gaps made available to the invocation.

### REQ-ODD-WORLD-MODEL-CONTEXT-MEMORY-003 — Loss-Declared Context Projection

**Carries**:
- `INTENT.md` — `Outcomes`, `Constraints`
- `PRODUCT.md` — `Governed Context Memory`, `Context Projection`

`odd_world_model` SHALL project a context basis into a bounded model-context
representation under a declared projection contract. The projection SHALL
retain its basis ref and SHALL disclose semantic fidelity, compression loss,
excluded surfaces, truncation, and unresolved gaps.

### REQ-ODD-WORLD-MODEL-CONTEXT-MEMORY-004 — Recoverable Semantic Compression

**Carries**:
- `WORLD_MODEL_METHOD.md` — `Representation Law`, `Projection Law`
- `PRODUCT.md` — `Governed Context Memory`, `Candidate Markov-Object Cut`

Context projection SHALL be able to use candidate Markov-object cuts,
treatments, covariance, adjoints, and related published semantic surfaces as a
compression layer over raw source evidence. Every compressed semantic claim
SHALL remain recoverable to its published cut and source evidence, and
compression SHALL NOT promote epistemic status.

### REQ-ODD-WORLD-MODEL-CONTEXT-MEMORY-005 — Invocation And Output Lineage

**Carries**:
- `PRODUCT.md` — `Governed Context Memory`, `Context Invocation Record`
- `SPEC_METHOD.md` — `Probabilistic Work Boundary`

Each governed LLM invocation SHALL publish a lineage record joining the context
basis ref to the model and invocation identity, output digest, time, declared
role or capability, and admission status so the output can be judged and
replayed against the exact world-state it saw.

### REQ-ODD-WORLD-MODEL-CONTEXT-MEMORY-006 — Context Staleness Detection

**Carries**:
- `PRODUCT.md` — `Governed Context Memory`, `Context Basis`
- `WORLD_MODEL_METHOD.md` — `Publication Law`

`odd_world_model` SHALL detect when a context basis or projection is stale
because a referenced source digest, semantic cut, link, projection contract, or
dependency closure has changed. Staleness SHALL remain visible and SHALL NOT
silently retarget an existing invocation basis.
