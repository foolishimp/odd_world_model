# Domain Build Verification Requirements

**Family**: REQ-ODD-DOMAIN-BUILD-VERIFY-*
**Status**: Active
**Category**: Verification

### REQ-ODD-DOMAIN-BUILD-VERIFY-001 — Explicit Intermediate Review Surfaces

**Carries**:
- `WORLD_MODEL_METHOD.md` — `Method Flow`, `Attribute Ledger Law`
- `INTENT.md` — `Outcomes`, `Constraints`
- `PRODUCT.md` — `Product Vision`, `Product End State`

`odd_domain` SHALL expose explicit reviewable intermediate surfaces for the
active world-model build line, including traced observations, assurance
records, attribute-ledger entries, and immutable object cuts, rather than
leaving those stages implicit inside builder code only.

### REQ-ODD-DOMAIN-BUILD-VERIFY-002 — Reverse Recoverability Proof

**Carries**:
- `WORLD_MODEL_METHOD.md` — `Materialization Law`, `Attribute Ledger Law`
- `INTENT.md` — `Outcomes`
- `PRODUCT.md` — `Product Vision`, `World-Model Query And Traversal`

`odd_domain` SHALL make it possible to recover an accepted world-model
attribute or object-cut claim backward through:

- the governing object cut
- the supporting attribute-ledger entries
- the assurance basis
- the traced source observations
- the originating source evidence

### REQ-ODD-DOMAIN-BUILD-VERIFY-003 — Steel-Thread Prototype Proof

**Carries**:
- `WORLD_MODEL_METHOD.md` — `Method Flow`, `Saturation Law`
- `INTENT.md` — `Outcomes`, `Constraints`
- `PRODUCT.md` — `Current Delivery Pillars`, `Product End State`

At least one bounded proving corpus SHALL exercise the full source-to-object
chain as a steel thread so the ratified build line is validated against a real
prototype slice rather than only by design narrative.

### REQ-ODD-DOMAIN-BUILD-VERIFY-004 — Prototype Readback Governance

**Carries**:
- `SPEC_METHOD.md` — `Change Management Rule`, `Consistency Gate Rule`
- `INTENT.md` — `Constraints`
- `PRODUCT.md` — `Product Position`, `Product Vision`

When an existing prototype predates the current ratified requirement or design
line, `odd_domain` SHALL treat that prototype as a readback surface for
requirement and design refinement rather than as implicit authority to preserve
unchallenged.
