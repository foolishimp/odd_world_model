# Product UAT Testcases

**Project**: `odd_world_model`
**Status**: Active
**Date**: 2026-07-12
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

---

## UAT-010: Specialize GLC Without Duplicating Lifecycle Or Runtime Authority

**Validates**: REQ-ODD-WORLD-MODEL-PRODUCT-007, REQ-ODD-WORLD-MODEL-PRODUCT-008, REQ-ODD-WORLD-MODEL-PRODUCT-010, REQ-ODD-WORLD-MODEL-ODD-CARRIER-012

### Preconditions

- Published GLC and GTL/ABG contracts are selected for a WM build.
- A WM downstream module declares domain assets and lifecycle interpretation.

### Steps

1. Inspect the module's domain, lifecycle, and runtime responsibilities.
2. Trace lifecycle declarations and reads to GLC and runtime facts to ABG.
3. Inspect how a missing or non-addressable dependency contract is handled.

### Expected Outcome

- WM contributes world-model domain meaning through the GLC downstream boundary.
- GLC remains domain-agnostic and ABG remains the sole runtime-truth owner.
- WM publishes no rival traversal, event, retry, closure, or lifecycle ledger.
- Missing dependency law remains an explicit gap or block rather than local law.

---

## UAT-011: Publish Markov-Object Cuts With Honest Epistemic Status

**Validates**: REQ-ODD-WORLD-MODEL-WORLD-OBJECT-002, REQ-ODD-WORLD-MODEL-WORLD-OBJECT-012, REQ-ODD-WORLD-MODEL-WORLD-OBJECT-013, REQ-ODD-WORLD-MODEL-BUILD-VERIFY-007, REQ-ODD-WORLD-MODEL-BUILD-VERIFY-008

### Preconditions

- Attribute-ledger evidence exists across multiple contexts with a null peer.
- A candidate identity direction has held-out treatment evidence.

### Steps

1. Publish the immutable cut with identity projection, evidence, treatment verification, boundary characterization, and status.
2. Verify that attribute membership and ingress or egress lists are supporting evidence rather than the blanket definition.
3. Attempt to classify the cut as `established` without a qualifying direction-native conditional-independence result.

### Expected Outcome

- The publication exposes the identity-preserving projection and its evidence.
- The cut defaults to `candidate` and is superseded rather than mutated.
- `established` status is rejected until the formal promotion gate is evidenced.

---

## UAT-012: Admit Semantic Proposals Through The Governed Carrier

**Validates**: REQ-ODD-WORLD-MODEL-BUILD-CONSTRAINT-001, REQ-ODD-WORLD-MODEL-BUILD-VERIFY-009, REQ-ODD-WORLD-MODEL-ODD-CARRIER-007, REQ-ODD-WORLD-MODEL-ODD-CARRIER-008, REQ-ODD-WORLD-MODEL-ODD-CARRIER-009, REQ-ODD-WORLD-MODEL-ODD-CARRIER-010, REQ-ODD-WORLD-MODEL-ODD-CARRIER-011

### Preconditions

- A published WM graph function and calibrated probabilistic worker are available.
- Exact GTL/ABG conformance, event, plugin, and shape contracts are resolved.

### Steps

1. Select the graph function through the public catalog and conformance-check its GTL program.
2. Produce a semantic candidate through a governed plugin seam.
3. Apply deterministic checks, admit the result through ABG, and inspect semantic acceptance and publication lineage.
4. Validate emitted events and wire shapes against the exact selected contracts.

### Expected Outcome

- Public work enters only through a published graph function.
- The probabilistic worker proposes but does not directly write runtime or semantic truth.
- Events use the canonical envelope and published census with no rival kinds.
- Shape authority comes from the selected published contract, not inferred source or tests.

---

## UAT-013: Resolve Floating Product Dependencies Into Exact Artifact Evidence

**Validates**: REQ-ODD-WORLD-MODEL-PRODUCT-009, REQ-ODD-WORLD-MODEL-RELEASE-005, REQ-ODD-WORLD-MODEL-RELEASE-006, REQ-ODD-WORLD-MODEL-RELEASE-007, REQ-ODD-WORLD-MODEL-RELEASE-008

### Preconditions

- WM product law names GTL/ABG and GLC contracts without exact versions.
- A concrete build, proof, release, or install selects dependency products.

### Steps

1. Resolve the selected dependencies under their declared compatibility constraints.
2. Record package, version, source or tag, manifest, digest, and contract locators.
3. Replay release or install proof from the recorded lock with ambient moving labels and mutable sibling workspaces unavailable.

### Expected Outcome

- Product law remains version-floating.
- The concrete artifact carries exact, compatible, recoverable dependency evidence.
- Release and install replay do not drift with the surrounding workspace.
- A development resolution is not misrepresented as released-product evidence.

---

## UAT-014: Resolve A Bounded Mesh Cut For One Interaction Goal

**Validates**: REQ-ODD-WORLD-MODEL-MESH-CAP-001, REQ-ODD-WORLD-MODEL-MESH-CAP-002, REQ-ODD-WORLD-MODEL-MESH-CAP-003, REQ-ODD-WORLD-MODEL-MESH-CAP-004, REQ-ODD-WORLD-MODEL-MESH-CAP-005, REQ-ODD-WORLD-MODEL-MESH-CAP-007, REQ-ODD-WORLD-MODEL-MESH-CAP-008, REQ-ODD-WORLD-MODEL-MESH-CAP-009, REQ-ODD-WORLD-MODEL-MESH-CONSTRAINT-001, REQ-ODD-WORLD-MODEL-MESH-CONSTRAINT-002, REQ-ODD-WORLD-MODEL-MESH-CONSTRAINT-003, REQ-ODD-WORLD-MODEL-MESH-CONSTRAINT-005, REQ-ODD-WORLD-MODEL-MESH-CONSTRAINT-006, REQ-ODD-WORLD-MODEL-MESH-CONSTRAINT-007, REQ-ODD-WORLD-MODEL-MESH-CONSTRAINT-008, REQ-ODD-WORLD-MODEL-MESH-CONSTRAINT-009, REQ-ODD-WORLD-MODEL-MESH-CONSTRAINT-011

### Preconditions

- Several locally owned domain artifacts and one composed model are published.
- Typed semantic links connect exact publication cuts.
- One interaction goal declares roots, scope, relation selectors, and closure.

### Steps

1. Admit the published cuts and typed links into the federated mesh.
2. Adopt one reusable published artifact explicitly as a common-model role.
3. Resolve the finite mesh cut required by the interaction goal.
4. Traverse the cut through query or mapping without loading unrelated mesh truth.

### Expected Outcome

- Local node identity, authority, version, and boundary remain visible.
- Link relation, provenance, treatment or loss, and supersession state remain visible.
- The common model has authority only through explicit adoption.
- The bounded cut contains exact refs and is not a copied truth surface.
- Query or mapping remains a downstream projection over the cut.

---

## UAT-015: Propagate A Local Mesh Change Without Global Reconstruction

**Validates**: REQ-ODD-WORLD-MODEL-MESH-CAP-006, REQ-ODD-WORLD-MODEL-MESH-CAP-010, REQ-ODD-WORLD-MODEL-MESH-CONSTRAINT-004, REQ-ODD-WORLD-MODEL-MESH-CONSTRAINT-010

### Preconditions

- A published mesh contains several independent branches and one composed branch.
- One node or semantic link has a newer superseding cut.

### Steps

1. Admit the superseding cut and its explicit supersession relation.
2. Calculate the declared dependency closure affected by the change.
3. Re-resolve an affected bounded cut and an unrelated bounded cut.
4. Introduce one unresolved ref or incompatible relation in the affected branch.

### Expected Outcome

- Only the declared dependent branch is pressured for recomputation or review.
- Unrelated published truth remains addressable without reconstruction.
- The unresolved or incompatible relation is emitted as a typed gap.
- No flattening, fallback name match, or silent omission hides the conflict.

---

## UAT-016: Serve And Judge An LLM Output Against Exact Context Memory

**Validates**: REQ-ODD-WORLD-MODEL-CONTEXT-MEMORY-001, REQ-ODD-WORLD-MODEL-CONTEXT-MEMORY-002, REQ-ODD-WORLD-MODEL-CONTEXT-MEMORY-003, REQ-ODD-WORLD-MODEL-CONTEXT-MEMORY-004, REQ-ODD-WORLD-MODEL-CONTEXT-MEMORY-005, REQ-ODD-WORLD-MODEL-CONTEXT-MEMORY-006, REQ-ODD-WORLD-MODEL-CONTEXT-MEMORY-CONSTRAINT-001, REQ-ODD-WORLD-MODEL-CONTEXT-MEMORY-CONSTRAINT-002, REQ-ODD-WORLD-MODEL-CONTEXT-MEMORY-CONSTRAINT-003, REQ-ODD-WORLD-MODEL-CONTEXT-MEMORY-CONSTRAINT-004, REQ-ODD-WORLD-MODEL-CONTEXT-MEMORY-CONSTRAINT-005, REQ-ODD-WORLD-MODEL-CONTEXT-MEMORY-CONSTRAINT-006

### Preconditions

- Application, data, processing, and documentary evidence has been admitted into published semantic cuts.
- A bounded mesh cut and context-projection contract exist for one LLM interaction goal.

### Steps

1. Resolve an immutable context basis with exact mesh refs, digests, temporal coordinates, scope, freshness, fidelity, loss, exclusions, and gaps.
2. Project the basis into bounded LLM context using candidate Markov-object and treatment surfaces as recoverable compression.
3. Invoke the model and record model identity, invocation identity, output digest, basis ref, and admission status.
4. Change one referenced source digest or semantic cut and evaluate the prior basis for staleness.
5. Attempt to read undeclared ambient context or accept a basisless output as governed truth.

### Expected Outcome

- The context projection is reproducible from its exact basis and declares what it omitted or compressed.
- The model output is judgeable against the world-state it saw and remains an F_P proposal.
- The prior basis becomes visibly stale without silently retargeting the invocation.
- Hidden context expansion and basisless governed output are rejected.
- The proof does not depend on any particular storage engine or version-control technology.
