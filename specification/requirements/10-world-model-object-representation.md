# World Model Object Representation Requirements

**Family**: REQ-ODD-WORLD-MODEL-WORLD-OBJECT-*
**Status**: Active
**Category**: Capability

### REQ-ODD-WORLD-MODEL-WORLD-OBJECT-001 — Prompt-Sufficient Object Representation

`odd_world_model` SHALL represent each published world-model object with sufficient
identity, boundary, state, transition, evidence, and adjacency context for a
reasoning agent to distinguish that object from nearby objects and reason over
it without relying on detached raw records alone.

### REQ-ODD-WORLD-MODEL-WORLD-OBJECT-002 — Identity Projection And Effective Boundary

**Carries**:
- `WORLD_MODEL_METHOD.md` — `Theoretical Underpinnings Of The Markov Object`, `Representation Law`
- `PRODUCT.md` — `Markov Objects As The Semantic Kernel`

For every published candidate or established Markov-object cut,
`odd_world_model` SHALL make the effective boundary explicit as the projection
along which object identity is preserved under held-out treatment. The cut
SHALL expose the identity direction or equivalent geometric description, its
projection support, the distributed attribute evidence supporting it, the
verification record, and the adjacent contexts or domains in which the
boundary applies. Ingress, egress, observable, and attribute surfaces MAY
support that claim, but they SHALL NOT define the blanket by set membership.

### REQ-ODD-WORLD-MODEL-WORLD-OBJECT-003 — Cross-Domain Alignment Sufficiency

`odd_world_model` SHALL represent world-model objects with enough context for a
reasoning agent to align equivalent, corresponding, or partially corresponding
objects across bounded contexts while preserving declared ambiguity, treatment
difference, and loss.

### REQ-ODD-WORLD-MODEL-WORLD-OBJECT-004 — Source Evidence Attachment

Every published world-model object SHALL carry recoverable source evidence for
the representation claim, including applicable source-system references and any
relevant code, interface, event, schema, record, or metadata surfaces used to
support that object's meaning.

### REQ-ODD-WORLD-MODEL-WORLD-OBJECT-005 — Treatment and Adjoint Traceability

When a world-model object participates in a downstream treatment or
cross-domain transformation, `odd_world_model` SHALL attach the applicable
treatment surface, covariance relationship, adjoint interpretation, and
declared loss or surplus semantics needed to explain how the object's meaning
changes across the boundary.

### REQ-ODD-WORLD-MODEL-WORLD-OBJECT-006 — Conventional and Covariant Reuse

The published world-model object representation SHALL be sufficient to support
both conventional enterprise projections, such as schema contracts, API
contracts, mapping documents, and `dbt` transformations, and `data_mapper`
covariant transforms from the same governed semantic source.

### REQ-ODD-WORLD-MODEL-WORLD-OBJECT-007 — Fully Qualified Semantic Naming

`odd_world_model` SHALL assign fully qualified identifiers to published semantic
artifacts, including fragments, world-model objects, Markov objects,
treatment surfaces, covariance edges, adjoint mappings, and projections, so
bounded-context aliasing is reduced and cross-domain mappings can be expressed
as explicit qualified relationships rather than local-name coincidence.

### REQ-ODD-WORLD-MODEL-WORLD-OBJECT-008 — Temporal Reference Artifact Modeling

When an attribute depends on a value list, code set, classification set, or
other governed reference semantics that can change over time, `odd_world_model`
SHALL model that changing reference surface as a governed temporal artifact
with recoverable authority, effective period, and usage linkage rather than
treating it as static field metadata only.

### REQ-ODD-WORLD-MODEL-WORLD-OBJECT-009 — Attribute-Level Sourceability

`odd_world_model` SHALL make every accepted world-model attribute claim recoverable
to traceable source evidence, including the applicable source locator, traced
observation, and assurance basis used to accept that claim into the semantic
layer.

### REQ-ODD-WORLD-MODEL-WORLD-OBJECT-010 — Qualified Multi-Surface Attribute Support

`odd_world_model` SHALL support world-model attribute claims whose authority is
derived from one or more evidence surfaces, including documents for declared
semantics, code for derivation logic or invariants, and data for observed state
or emitted values.

### REQ-ODD-WORLD-MODEL-WORLD-OBJECT-011 — Attribute Ledger Materialization

`odd_world_model` SHALL materialize accepted world-model attribute claims into an
append-only attribute ledger that records the qualified semantic basis for
later object projection rather than mutating object state in place as the
primary truth surface.

### REQ-ODD-WORLD-MODEL-WORLD-OBJECT-012 — Immutable Classified Object-Cut Projection

**Carries**:
- `WORLD_MODEL_METHOD.md` — `Materialization Law`, `Epistemic Status Of The Construct`
- `PRODUCT.md` — `Markov Objects As The Semantic Kernel`

`odd_world_model` SHALL materialize each published Markov-object cut as an
immutable projection from the attribute ledger over a stable identity
direction, with explicit supersession rather than silent in-place mutation.
Every cut SHALL declare whether it is `candidate` or `established`; publication
SHALL default to `candidate` unless REQ-ODD-WORLD-MODEL-WORLD-OBJECT-013 is
satisfied.

### REQ-ODD-WORLD-MODEL-WORLD-OBJECT-013 — Established Markov-Object Promotion Gate

**Carries**:
- `WORLD_MODEL_METHOD.md` — `Epistemic Status Of The Construct`, `Markov Object Construction Law`
- `PRODUCT.md` — `Markov Objects As The Semantic Kernel`, `Product Terms`

A candidate Markov-object cut SHALL be classified as `established` only when a
direction-native conditional-independence test shows, at a declared meaningful
threshold and under plausible treatments, that residual variation outside the
identity projection is independent of the target. Schema fit, attribute
membership, structural plausibility, treatment preservation, or semantic
review alone SHALL NOT satisfy this promotion gate.
