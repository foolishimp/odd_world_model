# Project Requirements

Project-specific requirement families live in this folder.

Use `.genesis/docs/standards/` as the governing method reference when writing or revising these files.

## Rules

- Write requirement families as separate `*.md` files.
- Use deterministic REQ headers in the form `### REQ-...`.
- Replace `00-starter.md` with real project requirement families as the project becomes concrete.
- Use lawful lifecycle metadata in the header: `Active`, `Deferred`,
  `Superseded`, or `Orphaned`.
- Use lawful requirement categories in the header: `Capability`,
  `Constraint / Guarantee`, `Governance`, or `Verification`.
- For the active world-model line, every new requirement added in this folder
  should cite the governing `WORLD_MODEL_METHOD.md` or `ODD_METHOD.md`
  section, plus the relevant `INTENT.md` or `PRODUCT.md` clause it carries.

## Current Families

- `05-product-definition-authority.md`
- `10-world-model-object-representation.md`
- `20-domain-build-and-composition-capability.md`
- `30-domain-build-and-composition-constraints.md`
- `40-domain-build-verification.md`
- `50-odd-method-gtl-carrier.md`
- `60-multi-domain-mapping-capability.md`
- `70-multi-domain-mapping-constraints.md`
- `80-world-model-mesh-capability.md`
- `90-world-model-mesh-constraints.md`
- `95-release-installation-governance.md`
