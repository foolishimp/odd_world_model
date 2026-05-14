# Product UAT Testcases

**Project**: `odd_world_model`
**Status**: Active
**Date**: 2026-05-15
**Requirement Surface**: `specification/requirements/`

These UAT cases validate the technology-independent `odd_world_model` product
definition. They are acceptance intent over the product `WHAT`; realization
tenants, language stacks, and test modules provide downstream evidence only
when they trace back to these cases and the live requirement surface.

---

## UAT-001: Preserve Product Authority Above Realization

**Validates**: REQ-ODD-WORLD-MODEL-PRODUCT-001, REQ-ODD-WORLD-MODEL-PRODUCT-002, REQ-ODD-WORLD-MODEL-PRODUCT-004, REQ-ODD-WORLD-MODEL-PRODUCT-005

### Preconditions

- `GOALS.md`, `INTENT.md`, `PRODUCT.md`, and the live requirement families are present.
- A downstream design or realization line is proposed for the product.

### Steps

1. Inspect the proposed downstream line.
2. Trace its product claims back to `specification/`.
3. Verify that implementation choices are design or realization choices, not product-definition authority.

### Expected Outcome

- Product-definition authority remains owned by `specification/`.
- Published semantic outputs preserve one world-model truth surface.
- The realization line is admitted only as a downstream implementation of the product definition.
- No language, tenant, package, test runner, or historical prototype narrows the product `WHAT`.

---

## UAT-002: Observe Source Systems Without Replacing Their Authority

**Validates**: REQ-ODD-WORLD-MODEL-BUILD-CAP-001, REQ-ODD-WORLD-MODEL-WORLD-OBJECT-004, REQ-ODD-WORLD-MODEL-PRODUCT-005

### Preconditions

- A bounded source corpus is available.
- The source corpus contains evidence for at least one functional surface.

### Steps

1. Observe the source corpus.
2. Identify source-system functions, records, interfaces, rules, or events that support semantic claims.
3. Record source locators without treating copied source data as the product's semantic authority.

### Expected Outcome

- Source systems remain sovereign for operational truth.
- Source observations become traceable evidence for world-model claims.
- Retained examples serve as proof corpora, not as product definition.

---

## UAT-003: Convert Evidence Into Assured Claims

**Validates**: REQ-ODD-WORLD-MODEL-BUILD-CAP-002, REQ-ODD-WORLD-MODEL-WORLD-OBJECT-009, REQ-ODD-WORLD-MODEL-WORLD-OBJECT-010

### Preconditions

- Traced observations exist for a bounded source corpus.

### Steps

1. Review each traced observation.
2. Record the assurance basis for accepting or rejecting the semantic claim.
3. Preserve ambiguity or rejected evidence instead of silently collapsing it.

### Expected Outcome

- Accepted claims carry recoverable evidence and assurance.
- Rejected or ambiguous observations remain inspectable.
- Downstream object state is not asserted without evidence.

---

## UAT-004: Materialize Attribute Ledgers And Immutable Object Cuts

**Validates**: REQ-ODD-WORLD-MODEL-WORLD-OBJECT-001, REQ-ODD-WORLD-MODEL-WORLD-OBJECT-011, REQ-ODD-WORLD-MODEL-WORLD-OBJECT-012, REQ-ODD-WORLD-MODEL-BUILD-CONSTRAINT-002, REQ-ODD-WORLD-MODEL-BUILD-CONSTRAINT-003

### Preconditions

- Assured semantic claims exist for a bounded object family.

### Steps

1. Materialize accepted claims into an attribute ledger.
2. Project an immutable object cut from the ledger.
3. Inspect the object cut's identity, boundary, state, evidence, and supersession lineage.

### Expected Outcome

- The attribute ledger is the immediate semantic source for accepted claims.
- Object cuts are immutable projections over ledger truth.
- Later changes supersede object cuts explicitly rather than mutating them in place.

---

## UAT-005: Publish Domain Artifacts As Durable Semantic Units

**Validates**: REQ-ODD-WORLD-MODEL-BUILD-CAP-003, REQ-ODD-WORLD-MODEL-BUILD-CAP-007, REQ-ODD-WORLD-MODEL-WORLD-OBJECT-005, REQ-ODD-WORLD-MODEL-WORLD-OBJECT-007, REQ-ODD-WORLD-MODEL-WORLD-OBJECT-008

### Preconditions

- One or more object cuts and supporting semantic surfaces exist.

### Steps

1. Publish a bounded domain artifact.
2. Inspect fragment identity, object identities, treatment surfaces, temporal references, and naming.
3. Verify that the artifact can be referenced by later composition without copying mutable builder state.

### Expected Outcome

- Published domain artifacts are durable semantic publication units.
- Names are fully qualified and non-ambiguous.
- Temporal reference semantics and treatment surfaces remain explicit.

---

## UAT-006: Compose Published Domain Artifacts Without Flattening Authority

**Validates**: REQ-ODD-WORLD-MODEL-BUILD-CAP-004, REQ-ODD-WORLD-MODEL-BUILD-CONSTRAINT-004, REQ-ODD-WORLD-MODEL-MESH-CAP-001, REQ-ODD-WORLD-MODEL-MESH-CONSTRAINT-001

### Preconditions

- At least two published domain artifacts exist.

### Steps

1. Compose the artifacts into a higher-order world model.
2. Inspect stitch points, covariance edges, adjoint mappings, and declared loss.
3. Verify that local artifact identity and authority remain visible.

### Expected Outcome

- Composition references published artifacts rather than mutable builder state.
- Boundary meaning, object identity, version, and declared loss remain explicit.
- The composed world model does not become one flattened enterprise ontology.

---

## UAT-007: Query Published Constructive History

**Validates**: REQ-ODD-WORLD-MODEL-BUILD-CAP-005, REQ-ODD-WORLD-MODEL-BUILD-CONSTRAINT-005, REQ-ODD-WORLD-MODEL-ODD-CARRIER-006

### Preconditions

- A published domain artifact or composed world model exists.

### Steps

1. Start from a published object, projection, or reported value.
2. Traverse backward through composition, artifact, object cut, attribute ledger, assurance, trace, and source evidence.
3. Inspect whether the query surface reports ambiguity, loss, or missing evidence where present.

### Expected Outcome

- Query works as a projection over constructive history.
- Explainability is available without making the query plane the product's semantic authority.
- Missing or ambiguous proof remains visible.

---

## UAT-008: Prove Product Claims Against The Specification

**Validates**: REQ-ODD-WORLD-MODEL-BUILD-VERIFY-001, REQ-ODD-WORLD-MODEL-BUILD-VERIFY-002, REQ-ODD-WORLD-MODEL-BUILD-VERIFY-003, REQ-ODD-WORLD-MODEL-BUILD-VERIFY-005

### Preconditions

- A downstream realization has produced evidence for one bounded product slice.

### Steps

1. Map evidence back to requirements and scenarios.
2. Recover a downstream semantic claim backward to source evidence.
3. Compare conventional projection evidence and world-model evidence where both are produced.

### Expected Outcome

- Product proof is accepted only when it validates the live product requirements and scenarios.
- A claim can be recovered backward through the semantic chain.
- Implementation-local success is not over-claimed as product closure without specification trace.

---

## UAT-009: Install A Released Builder Product Without Source-Workspace Leakage

**Validates**: REQ-ODD-WORLD-MODEL-RELEASE-001, REQ-ODD-WORLD-MODEL-RELEASE-002, REQ-ODD-WORLD-MODEL-RELEASE-003, REQ-ODD-WORLD-MODEL-RELEASE-004, REQ-ODD-WORLD-MODEL-BUILD-VERIFY-006

### Preconditions

- A released `odd_world_model` builder product exists.
- A target builder project has project-local source inputs or configuration.

### Steps

1. Install the released product into the target builder project.
2. Inspect product identity, release provenance, installed product assets, method guidance, and project-local configuration.
3. Run a bounded source-to-publication proof through the installed product.

### Expected Outcome

- The installed builder project is distinct from the mutable source project.
- The install carries enough provenance and product assets to operate lawfully.
- Product proof does not rely on uninstalled source-workspace realization structure.
