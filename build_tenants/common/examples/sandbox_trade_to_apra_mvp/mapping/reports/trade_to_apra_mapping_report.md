# Trade To APRA Mapping Report

## Scope

- source fragment: `odd_world_model.fragment.trade_representation.fpml_commodity_swap.v1`
- target fragment: `odd_world_model.fragment.apra_liquidity.reporting.sandbox.v1`
- durable mapping record: `odd_world_model.mapping_record.trade_representation.to_apra_liquidity.trade_fpml_001.v1`

## Object Pairing Basis

- source object: `odd_world_model.markov_object.trade_representation.trade_contract_state.trade_fpml_001`
- target object: `odd_world_model.markov_object.apra_liquidity.reporting_position.apra_liquidity_position_001`
- category: `treatment_projection`
- confidence: `strong`

Supporting refs:
- `odd_world_model.treatment.trade_representation.to_apra_liquidity.candidate.v1`
- `odd_world_model.covariance.trade_representation.to_apra_liquidity.trade_fpml_001.v1`
- `odd_world_model.adjoint.trade_representation.to_apra_liquidity.trade_fpml_001.v1`

Rationale:
- published treatment explicitly reinterprets the trade object as a regulatory reporting position
- published covariance and adjoint surfaces bind the object pair directly
- target object evidence declares imported trade artifact dependence

## Attribute Mappings

- `party_a_reference` -> `counterparty_bucket`
  - category: `treatment_projection`
  - confidence: `strong`
  - reasons:
  - shared counterparty identity appears in the source and target qualifiers
  - target trace explicitly references imported trade counterparty evidence
  - target claim is a regulatory classification over the imported party reference
  - ambiguity:
  - The retained slice does not yet model counterparty-side role selection generically across both trade parties.
  - declared loss:
  - none declared
- `master_agreement_reference` -> `agreement_treatment_basis`
  - category: `treatment_projection`
  - confidence: `strong`
  - reasons:
  - shared agreement type qualifiers support the correspondence
  - target claim composes APRA treatment guidance over imported agreement evidence
  - adjoint support declares interpret-back over the agreement surface
  - ambiguity:
  - none declared
  - declared loss:
  - none declared
- `product_reference` -> `liquidity_bucket`
  - category: `derived_mapping`
  - confidence: `moderate`
  - reasons:
  - target claim is derived from imported product type and APRA liquidity guidance
  - semantic correspondence is through classification, not direct identity
  - source product economics are narrowed into a regulatory liquidity bucket
  - ambiguity:
  - Detailed commodity economics do not survive intact across the regulatory treatment boundary.
  - declared loss:
  - Detailed commodity product semantics do not survive intact into the APRA-liquidity reporting view.

## Category Breakdown

- `derived_mapping`: 1
- `treatment_projection`: 2

## Confidence Breakdown

- `moderate`: 1
- `strong`: 2

## Unassigned Source Attributes

- `party_b_reference` — No explicit retained target attribute currently materializes this source semantic in the bounded APRA slice.
- `trade_date` — No explicit retained target attribute currently materializes this source semantic in the bounded APRA slice.
- `trade_identifier` — No explicit retained target attribute currently materializes this source semantic in the bounded APRA slice.

## Unassigned Target Attributes

- `reporting_lifecycle_state` — No retained source attribute currently maps to this target reporting semantic in the bounded trade slice.

## Governing Semantic Refs

- `odd_world_model.treatment.trade_representation.to_apra_liquidity.candidate.v1`
- `odd_world_model.covariance.trade_representation.to_apra_liquidity.trade_fpml_001.v1`
- `odd_world_model.adjoint.trade_representation.to_apra_liquidity.trade_fpml_001.v1`
