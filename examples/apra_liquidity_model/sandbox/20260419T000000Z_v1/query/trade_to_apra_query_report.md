# Trade To APRA Query Report

## Current Query Lane

- lane: filesystem-first
- source fragment: `odd_world_model.fragment.trade_representation.fpml_commodity_swap.v1`
- target fragment: `odd_world_model.fragment.apra_liquidity.reporting.sandbox.v1`

## Explainability Query

Question:
Why is the APRA reporting position classified into the financial institution counterparty bucket?

Answer:
The reporting position carries a ledger-backed counterparty-bucket claim. That claim is accepted through an assurance record and traced both to the official APRA authority-claim surface and to the imported trade counterparty evidence.

Path:
- object cut: `odd_world_model.markov_object.apra_liquidity.reporting_position.apra_liquidity_position_001`
- ledger entry: `ledger://reporting_position/counterparty_bucket.json`
- assurance: `review://apra_liquidity/assurance/reporting_position/counterparty_bucket.json`

Trace chain:
- trace: `review://apra_liquidity/traces/reporting_position/counterparty_bucket/authority_claim.json` -> source: `input://examples/apra_liquidity_model/sources/data/authority_claims.json` @ `claims.counterparty_bucket_financial_institution`
- trace: `review://apra_liquidity/traces/reporting_position/counterparty_bucket/trade_counterparty.json` -> source: `review://examples/trade_representation_model/sandbox/20260419T000000Z_v1/review/parsed_trade_observation.json` @ `parties[0]`

Resolved files:
- `published/apra_liquidity_domain/attribute_ledger/reporting_position/counterparty_bucket.json`
- `review/apra_liquidity/assurance/reporting_position/counterparty_bucket.json`
- `review/apra_liquidity/traces/reporting_position/counterparty_bucket/authority_claim.json`
- `examples/apra_liquidity_model/sources/data/authority_claims.json`
- `review/apra_liquidity/traces/reporting_position/counterparty_bucket/trade_counterparty.json`
- `examples/trade_representation_model/sandbox/20260419T000000Z_v1/review/parsed_trade_observation.json`

Value:
- `odd_world_model.world_model_object.apra_liquidity.counterparty_bucket.financial_institution`

Authority basis:
- official:ars_210_0.financial_institution_counterparty_category
- official:apra_liquidity_faq.q25.reporting_classification_examples
- trade:parsed_trade_observation.primary_counterparty
- interpretation:bounded_apra_counterparty_classification_from_imported_trade

## Mapping Query

Question:
What published path explains the mapping from the FpML trade object to the APRA reporting position?

Answer:
The path is governed by the published trade object cut, the cross-domain treatment, the covariance candidate, and the adjoint mapping that declares what is preserved, lost, and added in the APRA interpretation.

Published path:
- source object: `odd_world_model.markov_object.trade_representation.trade_contract_state.trade_fpml_001`
- treatment: `odd_world_model.treatment.trade_representation.to_apra_liquidity.candidate.v1`
- covariance: `odd_world_model.covariance.trade_representation.to_apra_liquidity.trade_fpml_001.v1`
- adjoint: `odd_world_model.adjoint.trade_representation.to_apra_liquidity.trade_fpml_001.v1`
- target object: `odd_world_model.markov_object.apra_liquidity.reporting_position.apra_liquidity_position_001`

Preserved structure:
- `trade_identifier`
- `party_identity`
- `master_agreement_reference`
- `trade_lifecycle_state`

Changed meaning:
- Trade representation is reinterpreted as a regulatory liquidity position rather than a confirmation-view trade object.

Declared loss:
- Detailed commodity product semantics do not survive intact into the APRA-liquidity reporting view.

Future seam:
- any future dedicated query plane is regenerated from published artifacts and composed world models
