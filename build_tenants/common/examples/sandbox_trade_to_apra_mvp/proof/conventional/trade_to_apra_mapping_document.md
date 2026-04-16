# Trade To APRA Mapping Document

## Scope

- Source fragment: `odd_domain.fragment.trade_representation.fpml_commodity_swap.v1`
- Target fragment: `odd_domain.fragment.apra_liquidity.reporting.sandbox.v1`
- Treatment: `odd_domain.treatment.trade_representation.to_apra_liquidity.candidate.v1`
- Covariance edge: `odd_domain.covariance.trade_representation.to_apra_liquidity.trade_fpml_001.v1`
- Adjoint mapping: `odd_domain.adjoint.trade_representation.to_apra_liquidity.trade_fpml_001.v1`

## Object Mapping

- `odd_domain.markov_object.trade_representation.trade_contract_state.trade_fpml_001` -> `odd_domain.markov_object.apra_liquidity.reporting_position.apra_liquidity_position_001`
- `odd_domain.world_model_object.trade_representation.commodity_swap_product.product_fpml_001` -> `odd_domain.markov_object.apra_liquidity.reporting_position.apra_liquidity_position_001`
- `odd_domain.world_model_object.trade_representation.master_agreement_reference.trade_fpml_001` -> `odd_domain.world_model_object.apra_liquidity.agreement_treatment_basis.master_agreement_reviewed`
- `odd_domain.markov_object.trade_representation.trade_contract_state.trade_fpml_001` -> `odd_domain.world_model_object.apra_liquidity.counterparty_bucket.financial_institution` via counterparty and reporting treatment

## Preserved Structure

- `trade_identifier`
- `party_identity`
- `master_agreement_reference`
- `trade_lifecycle_state`

## Changed Meaning

- Trade representation is reinterpreted as a regulatory liquidity position rather than a confirmation-view trade object.

## Declared Loss

- Detailed commodity product semantics do not survive intact into the APRA-liquidity reporting view.

## Target-Native Surplus

- The target adds reporting-position, bucket, and regulatory-classification semantics.

## Interpret-Back Summary

The APRA-liquidity reporting position can be interpreted back as a liquidity-focused treatment over the imported FpML trade, party, and agreement surfaces, with loss of detailed product nuance.

## Traceability

- Source evidence: `input://trade_representation/authority/com-ex28-gas-swap-daily-delivery-prices-option-last.xml`
- Target evidence: `input://apra_liquidity/authority_claims.json`
- Review surface: `review://fpml_trade_representation_standard/parsed_trade_observation.json`
