# Source Authority

The trade lane is now grounded in an official online FpML confirmation-view
example, not a house-authored local sample.

Authoritative online sources:

- FpML examples index:
  https://www.fpml.org/spec/fpml-5-12-4-rec-1/html/confirmation/fpml-5-12-examples.html
- Official commodity swap confirmation example:
  https://www.fpml.org/spec/fpml-5-12-4-rec-1/html/confirmation/xml/products/commodity-derivatives/com-ex28-gas-swap-daily-delivery-prices-option-last.xml

Locally retained source copies:

- `authority/fpml-5-12-examples.html`
- `authority/com-ex28-gas-swap-daily-delivery-prices-option-last.xml`

This lane now publishes two bounded domains over that one source truth:

1. `fpml_confirmation_source_domain`
   The upstream source-truth domain preserving the official FpML trade header,
   commodity swap surface, and fixed/floating leg structure.
2. `trade_representation_domain`
   The downstream interpreted world-model domain built by `odd_domain` from the
   official source domain.

The internal review surface `parsed_trade_observation.json` is only a constructor
aid. It is not a third truth surface.

The current bounded focus remains:

- trade identifiers and trade date
- parties and party references
- commodity swap product surface
- fixed and floating legs
- master-agreement documentation reference
- enough structure to build the first trade world-model domain and compose it
  downstream into APRA liquidity
