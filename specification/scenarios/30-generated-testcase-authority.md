# Testcase Authority

**Project**: `odd_world_model`
**Status**: Active
**Date**: 2026-05-15
**Derived from**:
- `specification/scenarios/20-generated-uat-testcases.md`
- `specification/scenarios/40-generated-scenarios.md`
- `specification/requirements/`

This surface bridges product acceptance intent, product scenarios, and future
realization evidence.

It answers the acceptance question:

`Which product claims must a downstream realization prove before it can claim closure?`

It does not admit a language, tenant, test runner, generated design surface, or
historical prototype as product authority.

---

## 1. Authority Rules

- Requirements under `specification/requirements/` define product obligations.
- UAT cases define acceptance intent for those obligations.
- Scenarios define operational meaning for product behavior.
- Realization evidence is accepted only when it traces to requirements, UAT,
  and scenarios.
- Retained examples and historical prototypes are admissible proof corpora or
  readback evidence, not product definition.

---

## 2. Coverage Mapping

### AUTH-001: Product definition is specification-owned

**UAT**: `UAT-001`
**Scenarios**: `SCN-PRODUCT-001`
**Requirements**:
- `REQ-ODD-WORLD-MODEL-PRODUCT-001`
- `REQ-ODD-WORLD-MODEL-PRODUCT-002`
- `REQ-ODD-WORLD-MODEL-PRODUCT-004`
- `REQ-ODD-WORLD-MODEL-PRODUCT-005`

Authority statement:

- downstream realization may satisfy product requirements
- downstream realization may not redefine product-definition authority
- published semantic outputs preserve one world-model truth surface

Evidence required:

- trace from realization design to product requirements
- proof that implementation-specific choices are not embedded as product
  requirements unless explicitly ratified

### AUTH-002: Retained examples are proof corpora

**UAT**: `UAT-002`
**Scenarios**: `SCN-PRODUCT-002`, `SCN-BUILD-001`
**Requirements**:
- `REQ-ODD-WORLD-MODEL-PRODUCT-005`
- `REQ-ODD-WORLD-MODEL-BUILD-VERIFY-004`
- `REQ-ODD-WORLD-MODEL-WORLD-OBJECT-004`

Authority statement:

- retained examples and historical prototypes can guide specification readback
  and proof
- they do not become product architecture without re-derivation into
  specification

Evidence required:

- explicit source corpus or prototype evidence
- trace from evidence to requirements or scenarios
- declared ambiguity where evidence is insufficient

### AUTH-003: Source evidence becomes assured semantic claims

**UAT**: `UAT-002`, `UAT-003`
**Scenarios**: `SCN-BUILD-001`, `SCN-BUILD-002`
**Requirements**:
- `REQ-ODD-WORLD-MODEL-BUILD-CAP-001`
- `REQ-ODD-WORLD-MODEL-BUILD-CAP-002`
- `REQ-ODD-WORLD-MODEL-WORLD-OBJECT-009`
- `REQ-ODD-WORLD-MODEL-WORLD-OBJECT-010`

Authority statement:

- source observations must be traced
- semantic admission requires assurance

Evidence required:

- source locators
- trace records
- assurance records
- visible rejected or ambiguous observations where present

### AUTH-004: Attribute ledgers govern object cuts

**UAT**: `UAT-004`
**Scenarios**: `SCN-BUILD-003`
**Requirements**:
- `REQ-ODD-WORLD-MODEL-WORLD-OBJECT-001`
- `REQ-ODD-WORLD-MODEL-WORLD-OBJECT-011`
- `REQ-ODD-WORLD-MODEL-WORLD-OBJECT-012`
- `REQ-ODD-WORLD-MODEL-BUILD-CONSTRAINT-002`
- `REQ-ODD-WORLD-MODEL-BUILD-CONSTRAINT-003`

Authority statement:

- accepted claims enter the attribute ledger
- immutable object cuts project from ledger truth
- supersession replaces in-place mutation

Evidence required:

- ledger entries
- object cuts
- identity and supersession records
- recoverable links from cuts back to ledger entries

### AUTH-005: Published artifacts are durable semantic units

**UAT**: `UAT-005`
**Scenarios**: `SCN-BUILD-004`
**Requirements**:
- `REQ-ODD-WORLD-MODEL-BUILD-CAP-003`
- `REQ-ODD-WORLD-MODEL-BUILD-CAP-007`
- `REQ-ODD-WORLD-MODEL-WORLD-OBJECT-005`
- `REQ-ODD-WORLD-MODEL-WORLD-OBJECT-007`
- `REQ-ODD-WORLD-MODEL-WORLD-OBJECT-008`

Authority statement:

- published domain artifacts are the semantic publication boundary
- artifact identity, naming, treatments, temporal references, and source
  evidence remain visible

Evidence required:

- published artifact manifest
- fragment and object identifiers
- treatment surfaces
- temporal reference artifacts where applicable
- source and assurance links

### AUTH-006: Composition preserves local authority

**UAT**: `UAT-006`
**Scenarios**: `SCN-COMP-001`
**Requirements**:
- `REQ-ODD-WORLD-MODEL-BUILD-CAP-004`
- `REQ-ODD-WORLD-MODEL-BUILD-CONSTRAINT-004`
- `REQ-ODD-WORLD-MODEL-MESH-CAP-001`
- `REQ-ODD-WORLD-MODEL-MESH-CONSTRAINT-001`

Authority statement:

- composed world models reference published artifacts
- composition preserves identity, version, local authority, covariance, adjoint
  interpretation, and declared loss

Evidence required:

- composition manifest
- published artifact references
- stitch records
- declared loss and ambiguity records

### AUTH-007: Query and proof are projections over constructive history

**UAT**: `UAT-007`, `UAT-008`
**Scenarios**: `SCN-QUERY-001`, `SCN-PROOF-001`, `SCN-DEEPEN-001`
**Requirements**:
- `REQ-ODD-WORLD-MODEL-BUILD-CAP-005`
- `REQ-ODD-WORLD-MODEL-BUILD-CONSTRAINT-005`
- `REQ-ODD-WORLD-MODEL-BUILD-VERIFY-001`
- `REQ-ODD-WORLD-MODEL-BUILD-VERIFY-002`
- `REQ-ODD-WORLD-MODEL-BUILD-VERIFY-003`
- `REQ-ODD-WORLD-MODEL-BUILD-VERIFY-005`
- `REQ-ODD-WORLD-MODEL-ODD-CARRIER-006`

Authority statement:

- query and proof surfaces are downstream projections
- accepted proof must recover claims backward through the semantic chain
- later deepening proceeds by explicit supersession

Evidence required:

- query or proof output
- requirement and scenario trace
- reverse recoverability path
- supersession lineage where claims change

### AUTH-008: Released builder products install without source-workspace leakage

**UAT**: `UAT-009`
**Scenarios**: `SCN-RELEASE-001`
**Requirements**:
- `REQ-ODD-WORLD-MODEL-RELEASE-001`
- `REQ-ODD-WORLD-MODEL-RELEASE-002`
- `REQ-ODD-WORLD-MODEL-RELEASE-003`
- `REQ-ODD-WORLD-MODEL-RELEASE-004`
- `REQ-ODD-WORLD-MODEL-BUILD-VERIFY-006`

Authority statement:

- released builder products can be installed into builder projects
- installs preserve product identity, release provenance, installed assets,
  method guidance, project-local configuration, and publication obligations
- installed-product proof must not depend on uninstalled source-project
  realization structure

Evidence required:

- install manifest or equivalent provenance surface
- installed product asset inventory
- project-local source configuration
- bounded source-to-publication proof from the installed product

---

## 3. Current Qualification Position

This surface defines acceptance authority for the product specification.

It does not claim that any particular realization line has closed these
authority claims. A future design or implementation wave must attach concrete
evidence to these authority mappings before claiming product closure.
