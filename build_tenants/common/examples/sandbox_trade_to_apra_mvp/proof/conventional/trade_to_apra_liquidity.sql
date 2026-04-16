-- Generated from the governed odd_domain semantic kernel.
-- Source object: odd_domain.markov_object.trade_representation.trade_contract_state.trade_fpml_001
-- Target object: odd_domain.markov_object.apra_liquidity.reporting_position.apra_liquidity_position_001
-- Preserved structure: trade_identifier, party_identity, master_agreement_reference, trade_lifecycle_state

with source_trade as (
    select
        trade_id,
        trade_date,
        product_id,
        counterparty_id,
        agreement_id
    from {{ ref('fpml_trade_representation') }}
)

select
    trade_id as trade_identifier,
    case
        when counterparty_id is not null then 'financial_institution'
        else 'unclassified'
    end as counterparty_bucket,
    'master_agreement_reviewed' as agreement_assessment,
    'contractual_outflow_assessment' as liquidity_bucket,
    'draft_classified' as reporting_lifecycle_state
from source_trade
