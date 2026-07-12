# Domain Build Verification Requirements

**Family**: REQ-ODD-WORLD-MODEL-BUILD-VERIFY-*
**Status**: Active
**Category**: Verification

### REQ-ODD-WORLD-MODEL-BUILD-VERIFY-001 — Explicit Intermediate Review Surfaces

**Carries**:
- `WORLD_MODEL_METHOD.md` — `Method Flow`, `Attribute Ledger Law`
- `INTENT.md` — `Outcomes`, `Constraints`
- `PRODUCT.md` — `Product Vision`, `Product End State`

`odd_world_model` SHALL expose explicit reviewable intermediate surfaces for the
active world-model build line, including traced observations, assurance
records, attribute-ledger entries, and immutable object cuts, rather than
leaving those stages implicit inside builder code only.

### REQ-ODD-WORLD-MODEL-BUILD-VERIFY-002 — Reverse Recoverability Proof

**Carries**:
- `WORLD_MODEL_METHOD.md` — `Materialization Law`, `Attribute Ledger Law`
- `INTENT.md` — `Outcomes`
- `PRODUCT.md` — `Product Vision`, `World-Model Query And Traversal`

`odd_world_model` SHALL make it possible to recover an accepted world-model
attribute or object-cut claim backward through:

- the governing object cut
- the supporting attribute-ledger entries
- the assurance basis
- the traced source observations
- the originating source evidence

### REQ-ODD-WORLD-MODEL-BUILD-VERIFY-003 — Steel-Thread Prototype Proof

**Carries**:
- `WORLD_MODEL_METHOD.md` — `Method Flow`, `Saturation Law`
- `INTENT.md` — `Outcomes`, `Constraints`
- `PRODUCT.md` — `Current Delivery Pillars`, `Product End State`

At least one bounded proving corpus SHALL exercise the full source-to-object
chain as a steel thread so the ratified build line is validated against a real
prototype slice rather than only by design narrative.

### REQ-ODD-WORLD-MODEL-BUILD-VERIFY-004 — Prototype Readback Governance

**Carries**:
- `SPEC_METHOD.md` — `Change Management Rule`, `Consistency Gate Rule`
- `INTENT.md` — `Constraints`
- `PRODUCT.md` — `Product Position`, `Product Vision`

When an existing prototype predates the current ratified requirement or design
line, `odd_world_model` SHALL treat that prototype as a readback surface for
requirement and design refinement rather than as implicit authority to preserve
unchallenged.

### REQ-ODD-WORLD-MODEL-BUILD-VERIFY-005 — Realization-Independent Product Proof

**Carries**:
- `SPEC_METHOD.md` — `Reconstruction Litmus`, `Specification Surface Rule`
- `WORLD_MODEL_METHOD.md` — `Proof Law`
- `PRODUCT.md` — `Product Definition Boundary`, `Current Product Definition`

Product proof SHALL validate the live product requirements and scenarios rather
than merely proving that one historical implementation continues to run.
Tenant-local tests, generated reports, and runtime projections MAY provide
evidence, but the accepted proof claim SHALL trace back to product requirements,
scenario coverage, and the source-to-publication semantic chain.

### REQ-ODD-WORLD-MODEL-BUILD-VERIFY-006 — Installed Builder Product Proof

**Carries**:
- `SPEC_METHOD.md` — `Recursive Product Taxonomy`, `Reconstruction Litmus`
- `PRODUCT.md` — `Release And Install Boundary`

When `odd_world_model` claims installable builder-product behavior, proof SHALL
exercise a stamped install rather than only the mutable source workspace. The
proof SHALL show that the installed product can use project-local source
configuration to produce or inspect the expected published semantic outputs
without relying on uninstalled source-project realization structure.

### REQ-ODD-WORLD-MODEL-BUILD-VERIFY-007 — Candidate Markov-Object Cut Proof

**Carries**:
- `WORLD_MODEL_METHOD.md` — `Markov Object Construction Law`, `Epistemic Status Of The Construct`
- `PRODUCT.md` — `Markov Objects As The Semantic Kernel`

Proof for a published candidate Markov-object cut SHALL recover the identity
direction or equivalent projection, distributed ledger evidence, paired
candidate and null-peer basis, held-out treatment verification, boundary
characterization, and publication classification. Structural shape or schema
membership alone SHALL NOT count as object-cut proof.

### REQ-ODD-WORLD-MODEL-BUILD-VERIFY-008 — Established Status Proof

**Carries**:
- `WORLD_MODEL_METHOD.md` — `Epistemic Status Of The Construct`
- `PRODUCT.md` — `Product Terms / Established Markov-Object Cut`

Any proof claiming an `established` Markov-object cut SHALL include the exact
direction-native conditional-independence method, corpus, treatments,
threshold, result, and provenance that satisfied the promotion gate. A missing,
inconclusive, or failed result SHALL leave the publication at `candidate`.

### REQ-ODD-WORLD-MODEL-BUILD-VERIFY-009 — Semantic Admission Chain Proof

**Carries**:
- `PRODUCT.md` — `Semantic Construction And Admission Boundary`
- `ODD_METHOD.md` — `What An ODD Product Is / ABG`

Proof for probabilistically proposed semantic content SHALL recover the chain
from the declared graph-function invocation and calibrated `F_P` proposal,
through deterministic checks and ABG admission, to attributed WM semantic
acceptance and publication. The proof SHALL demonstrate that the probabilistic
worker did not directly write runtime or published semantic truth.
