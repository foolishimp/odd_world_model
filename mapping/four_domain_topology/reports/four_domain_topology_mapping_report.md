# Four-Domain Topology Mapping Report

## Scope

- `odd_world_model.fragment.fpml_confirmation_source.commodity_swap.v1` (trade_source_model)
- `odd_world_model.fragment.trade_representation.fpml_commodity_swap.v1` (trade_representation_model)
- `odd_world_model.fragment.apra_liquidity.reporting.sandbox.v1` (apra_liquidity_model)
- `odd_world_model.fragment.sandbox_banking_product_catalog.v1` (banking_product_model)

## Object Correspondence

- `odd_world_model.world_model_object.fpml_confirmation.commodity_swap_source.product_fpml_001` -> `odd_world_model.world_model_object.trade_representation.commodity_swap_product.product_fpml_001`
  - category: `constrained_equivalence`
  - confidence: `moderate` (0.6398)
  - shared concepts: `financial_product_surface`
  - rationale: shared semantic tokens anchor the correspondence; shared aliases or qualifier values anchor the correspondence; shared higher-order concept tags place the objects in the same semantic family; topology and constructive shape are materially similar; adjacent-domain placement points at the paired bounded context; evidence refs already cross the paired example boundary; shared stable identifier values anchor the correspondence; shared identifier semantics survive across the paired objects
- `odd_world_model.markov_object.trade_representation.trade_contract_state.trade_fpml_001` -> `odd_world_model.markov_object.apra_liquidity.reporting_position.apra_liquidity_position_001`
  - category: `derived_mapping`
  - confidence: `moderate` (0.602)
  - shared concepts: `trade_lifecycle_surface`
  - rationale: shared semantic tokens anchor the correspondence; shared aliases or qualifier values anchor the correspondence; shared higher-order concept tags place the objects in the same semantic family; topology and constructive shape are materially similar; published adjacency directly references the paired object; adjacent-domain placement points at the paired bounded context; evidence refs already cross the paired example boundary; shared stable identifier values anchor the correspondence; shared identifier semantics survive across the paired objects
- `odd_world_model.world_model_object.trade_representation.master_agreement_reference.trade_fpml_001` -> `odd_world_model.world_model_object.apra_liquidity.agreement_treatment_basis.master_agreement_reviewed`
  - category: `treatment_projection`
  - confidence: `moderate` (0.5723)
  - shared concepts: `agreement_governance_surface`
  - rationale: shared semantic tokens anchor the correspondence; shared aliases or qualifier values anchor the correspondence; shared higher-order concept tags place the objects in the same semantic family; topology and constructive shape are materially similar; published adjacency directly references the paired object; adjacent-domain placement points at the paired bounded context; evidence refs already cross the paired example boundary; shared identifier semantics survive across the paired objects
- `odd_world_model.world_model_object.fpml_confirmation.trade_record.trade_fpml_001` -> `odd_world_model.markov_object.trade_representation.trade_contract_state.trade_fpml_001`
  - category: `constrained_equivalence`
  - confidence: `moderate` (0.5703)
  - shared concepts: `trade_lifecycle_surface`
  - rationale: shared semantic tokens anchor the correspondence; shared aliases or qualifier values anchor the correspondence; shared higher-order concept tags place the objects in the same semantic family; adjacent-domain placement points at the paired bounded context; evidence refs already cross the paired example boundary; shared stable identifier values anchor the correspondence; shared identifier semantics survive across the paired objects
- `odd_world_model.world_model_object.trade_representation.party_profile.partyA` -> `odd_world_model.markov_object.apra_liquidity.reporting_position.apra_liquidity_position_001`
  - category: `treatment_projection`
  - confidence: `weak` (0.5008)
  - shared concepts: `party_qualification_surface`, `trade_lifecycle_surface`
  - rationale: shared semantic tokens anchor the correspondence; shared aliases or qualifier values anchor the correspondence; shared higher-order concept tags place the objects in the same semantic family; adjacent-domain placement points at the paired bounded context; evidence refs already cross the paired example boundary; shared stable identifier values anchor the correspondence; shared identifier semantics survive across the paired objects
- `odd_world_model.world_model_object.trade_representation.party_profile.partyA` -> `odd_world_model.world_model_object.apra_liquidity.counterparty_bucket.financial_institution`
  - category: `treatment_projection`
  - confidence: `weak` (0.4763)
  - shared concepts: `party_qualification_surface`
  - rationale: shared semantic tokens anchor the correspondence; shared higher-order concept tags place the objects in the same semantic family; topology and constructive shape are materially similar; published adjacency directly references the paired object; adjacent-domain placement points at the paired bounded context; evidence refs already cross the paired example boundary
- `odd_world_model.world_model_object.trade_representation.party_profile.partyB` -> `odd_world_model.world_model_object.apra_liquidity.counterparty_bucket.financial_institution`
  - category: `treatment_projection`
  - confidence: `weak` (0.4763)
  - shared concepts: `party_qualification_surface`
  - rationale: shared semantic tokens anchor the correspondence; shared higher-order concept tags place the objects in the same semantic family; topology and constructive shape are materially similar; published adjacency directly references the paired object; adjacent-domain placement points at the paired bounded context; evidence refs already cross the paired example boundary

## Attribute Correspondence

- `party_a_reference` -> `counterparty_bucket`
  - category: `derived_mapping`
  - confidence: `moderate` (0.564)
- `master_agreement_reference` -> `agreement_treatment_basis`
  - category: `derived_mapping`
  - confidence: `weak` (0.4617)
- `product_reference` -> `liquidity_bucket`
  - category: `derived_mapping`
  - confidence: `weak` (0.4443)
- `trade_date` -> `reporting_lifecycle_state`
  - category: `derived_mapping`
  - confidence: `rejected` (0.3568)
- `party_b_reference` -> `counterparty_bucket`
  - category: `derived_mapping`
  - confidence: `rejected` (0.354)
- `trade_identifier` -> `reporting_lifecycle_state`
  - category: `derived_mapping`
  - confidence: `rejected` (0.3517)

## Higher-Order Concepts

- `odd_world_model.concept.four_domain.agreement_governance_surface.v1`
  - label: Agreement Governance Surface
  - domains: `odd_world_model.fragment.apra_liquidity.reporting.sandbox.v1`, `odd_world_model.fragment.trade_representation.fpml_commodity_swap.v1`
  - members: `odd_world_model.world_model_object.trade_representation.master_agreement_reference.trade_fpml_001`, `odd_world_model.world_model_object.apra_liquidity.agreement_treatment_basis.master_agreement_reviewed`, `odd_world_model.markov_object.apra_liquidity.reporting_position.apra_liquidity_position_001`
  - confidence: `confirmed` (0.825)
- `odd_world_model.concept.four_domain.financial_product_surface.v1`
  - label: Financial Product Surface
  - domains: `odd_world_model.fragment.apra_liquidity.reporting.sandbox.v1`, `odd_world_model.fragment.fpml_confirmation_source.commodity_swap.v1`, `odd_world_model.fragment.sandbox_banking_product_catalog.v1`, `odd_world_model.fragment.trade_representation.fpml_commodity_swap.v1`
  - members: `odd_world_model.world_model_object.fpml_confirmation.commodity_swap_leg.fixed_leg_01`, `odd_world_model.world_model_object.fpml_confirmation.commodity_swap_leg.floating_leg_02`, `odd_world_model.world_model_object.fpml_confirmation.commodity_swap_source.product_fpml_001`, `odd_world_model.world_model_object.trade_representation.commodity_swap_product.product_fpml_001`, `odd_world_model.markov_object.apra_liquidity.reporting_position.apra_liquidity_position_001`, `odd_world_model.markov_object.sandbox_banking_product_catalog.bankingproductcatalog.banking_product_catalog_001`, `odd_world_model.markov_object.sandbox_banking_product_catalog.creditcard.card_001`, `odd_world_model.markov_object.sandbox_banking_product_catalog.depositaccount.deposit_001`, `odd_world_model.markov_object.sandbox_banking_product_catalog.loanorcredit.loan_001`, `odd_world_model.markov_object.sandbox_banking_product_catalog.mortgageloan.mortgage_001`
  - confidence: `strong` (0.755)
- `odd_world_model.concept.four_domain.party_qualification_surface.v1`
  - label: Party Qualification Surface
  - domains: `odd_world_model.fragment.apra_liquidity.reporting.sandbox.v1`, `odd_world_model.fragment.trade_representation.fpml_commodity_swap.v1`
  - members: `odd_world_model.world_model_object.trade_representation.party_profile.partyA`, `odd_world_model.world_model_object.trade_representation.party_profile.partyB`, `odd_world_model.world_model_object.apra_liquidity.counterparty_bucket.financial_institution`, `odd_world_model.markov_object.apra_liquidity.reporting_position.apra_liquidity_position_001`
  - confidence: `confirmed` (0.825)
- `odd_world_model.concept.four_domain.trade_lifecycle_surface.v1`
  - label: Trade Lifecycle Surface
  - domains: `odd_world_model.fragment.apra_liquidity.reporting.sandbox.v1`, `odd_world_model.fragment.fpml_confirmation_source.commodity_swap.v1`, `odd_world_model.fragment.trade_representation.fpml_commodity_swap.v1`
  - members: `odd_world_model.world_model_object.fpml_confirmation.trade_record.trade_fpml_001`, `odd_world_model.world_model_object.trade_representation.commodity_swap_product.product_fpml_001`, `odd_world_model.world_model_object.trade_representation.master_agreement_reference.trade_fpml_001`, `odd_world_model.world_model_object.trade_representation.party_profile.partyA`, `odd_world_model.world_model_object.trade_representation.party_profile.partyB`, `odd_world_model.markov_object.trade_representation.trade_contract_state.trade_fpml_001`, `odd_world_model.markov_object.apra_liquidity.reporting_position.apra_liquidity_position_001`
  - confidence: `confirmed` (0.9125)

## Boundary Candidates

- `odd_world_model.boundary_candidate.four_domain.financial_instrument_envelope.v1`
  - kind: `hierarchical`
  - parent refs: none
  - overlap refs: none
  - members: `odd_world_model.markov_object.apra_liquidity.reporting_position.apra_liquidity_position_001`, `odd_world_model.markov_object.sandbox_banking_product_catalog.bankingproductcatalog.banking_product_catalog_001`, `odd_world_model.markov_object.sandbox_banking_product_catalog.creditcard.card_001`, `odd_world_model.markov_object.sandbox_banking_product_catalog.depositaccount.deposit_001`, `odd_world_model.markov_object.sandbox_banking_product_catalog.loanorcredit.loan_001`, `odd_world_model.markov_object.sandbox_banking_product_catalog.mortgageloan.mortgage_001`, `odd_world_model.markov_object.trade_representation.trade_contract_state.trade_fpml_001`, `odd_world_model.world_model_object.apra_liquidity.agreement_treatment_basis.master_agreement_reviewed`, `odd_world_model.world_model_object.apra_liquidity.counterparty_bucket.financial_institution`, `odd_world_model.world_model_object.fpml_confirmation.commodity_swap_leg.fixed_leg_01`, `odd_world_model.world_model_object.fpml_confirmation.commodity_swap_leg.floating_leg_02`, `odd_world_model.world_model_object.fpml_confirmation.commodity_swap_source.product_fpml_001`, `odd_world_model.world_model_object.fpml_confirmation.trade_record.trade_fpml_001`, `odd_world_model.world_model_object.trade_representation.commodity_swap_product.product_fpml_001`, `odd_world_model.world_model_object.trade_representation.master_agreement_reference.trade_fpml_001`, `odd_world_model.world_model_object.trade_representation.party_profile.partyA`, `odd_world_model.world_model_object.trade_representation.party_profile.partyB`
- `odd_world_model.boundary_candidate.four_domain.agreement_governance_surface.v1`
  - kind: `intersectional`
  - parent refs: `odd_world_model.boundary_candidate.four_domain.financial_instrument_envelope.v1`
  - overlap refs: `odd_world_model.boundary_candidate.four_domain.financial_product_surface.v1`, `odd_world_model.boundary_candidate.four_domain.party_qualification_surface.v1`, `odd_world_model.boundary_candidate.four_domain.trade_lifecycle_surface.v1`
  - members: `odd_world_model.world_model_object.trade_representation.master_agreement_reference.trade_fpml_001`, `odd_world_model.world_model_object.apra_liquidity.agreement_treatment_basis.master_agreement_reviewed`, `odd_world_model.markov_object.apra_liquidity.reporting_position.apra_liquidity_position_001`
- `odd_world_model.boundary_candidate.four_domain.financial_product_surface.v1`
  - kind: `intersectional`
  - parent refs: `odd_world_model.boundary_candidate.four_domain.financial_instrument_envelope.v1`
  - overlap refs: `odd_world_model.boundary_candidate.four_domain.party_qualification_surface.v1`, `odd_world_model.boundary_candidate.four_domain.trade_lifecycle_surface.v1`
  - members: `odd_world_model.world_model_object.fpml_confirmation.commodity_swap_leg.fixed_leg_01`, `odd_world_model.world_model_object.fpml_confirmation.commodity_swap_leg.floating_leg_02`, `odd_world_model.world_model_object.fpml_confirmation.commodity_swap_source.product_fpml_001`, `odd_world_model.world_model_object.trade_representation.commodity_swap_product.product_fpml_001`, `odd_world_model.markov_object.apra_liquidity.reporting_position.apra_liquidity_position_001`, `odd_world_model.markov_object.sandbox_banking_product_catalog.bankingproductcatalog.banking_product_catalog_001`, `odd_world_model.markov_object.sandbox_banking_product_catalog.creditcard.card_001`, `odd_world_model.markov_object.sandbox_banking_product_catalog.depositaccount.deposit_001`, `odd_world_model.markov_object.sandbox_banking_product_catalog.loanorcredit.loan_001`, `odd_world_model.markov_object.sandbox_banking_product_catalog.mortgageloan.mortgage_001`
- `odd_world_model.boundary_candidate.four_domain.party_qualification_surface.v1`
  - kind: `intersectional`
  - parent refs: `odd_world_model.boundary_candidate.four_domain.financial_instrument_envelope.v1`
  - overlap refs: `odd_world_model.boundary_candidate.four_domain.trade_lifecycle_surface.v1`
  - members: `odd_world_model.world_model_object.trade_representation.party_profile.partyA`, `odd_world_model.world_model_object.trade_representation.party_profile.partyB`, `odd_world_model.world_model_object.apra_liquidity.counterparty_bucket.financial_institution`, `odd_world_model.markov_object.apra_liquidity.reporting_position.apra_liquidity_position_001`
- `odd_world_model.boundary_candidate.four_domain.trade_lifecycle_surface.v1`
  - kind: `hierarchical`
  - parent refs: `odd_world_model.boundary_candidate.four_domain.financial_instrument_envelope.v1`
  - overlap refs: none
  - members: `odd_world_model.world_model_object.fpml_confirmation.trade_record.trade_fpml_001`, `odd_world_model.world_model_object.trade_representation.commodity_swap_product.product_fpml_001`, `odd_world_model.world_model_object.trade_representation.master_agreement_reference.trade_fpml_001`, `odd_world_model.world_model_object.trade_representation.party_profile.partyA`, `odd_world_model.world_model_object.trade_representation.party_profile.partyB`, `odd_world_model.markov_object.trade_representation.trade_contract_state.trade_fpml_001`, `odd_world_model.markov_object.apra_liquidity.reporting_position.apra_liquidity_position_001`

## Coverage

- `odd_world_model.fragment.fpml_confirmation_source.commodity_swap.v1`
  - unmapped objects: `odd_world_model.world_model_object.fpml_confirmation.commodity_swap_leg.fixed_leg_01`, `odd_world_model.world_model_object.fpml_confirmation.commodity_swap_leg.floating_leg_02`
  - unconceptualized objects: none
- `odd_world_model.fragment.trade_representation.fpml_commodity_swap.v1`
  - unmapped objects: none
  - unconceptualized objects: none
- `odd_world_model.fragment.apra_liquidity.reporting.sandbox.v1`
  - unmapped objects: none
  - unconceptualized objects: none
- `odd_world_model.fragment.sandbox_banking_product_catalog.v1`
  - unmapped objects: `odd_world_model.markov_object.sandbox_banking_product_catalog.bankingproductcatalog.banking_product_catalog_001`, `odd_world_model.markov_object.sandbox_banking_product_catalog.creditcard.card_001`, `odd_world_model.markov_object.sandbox_banking_product_catalog.depositaccount.deposit_001`, `odd_world_model.markov_object.sandbox_banking_product_catalog.loanorcredit.loan_001`, `odd_world_model.markov_object.sandbox_banking_product_catalog.mortgageloan.mortgage_001`
  - unconceptualized objects: none

## Notes

- Higher-order concepts and boundary candidates remain downstream mapping artifacts until separately ratified.
- Operational-semantics enrichment beyond the published blanket/control surfaces remains future work gated on richer source corpora.
