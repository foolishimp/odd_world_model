# Trade Representation Source Authority

This source-authority surface records the retained official FpML documents
carried by the `trade_source_model` example domain.

The trade-source example is grounded in official online FpML
confirmation-view material.

## Official Source Set

### 1. FpML examples index

- local file:
  `data/authority/fpml-5-12-examples.html`
- canonical URL:
  `https://www.fpml.org/spec/fpml-5-12-4-rec-1/html/confirmation/fpml-5-12-examples.html`
- role:
  official examples index for the bounded confirmation-view source lane

### 2. Official commodity swap confirmation example

- local file:
  `data/authority/com-ex28-gas-swap-daily-delivery-prices-option-last.xml`
- canonical URL:
  `https://www.fpml.org/spec/fpml-5-12-4-rec-1/html/confirmation/xml/products/commodity-derivatives/com-ex28-gas-swap-daily-delivery-prices-option-last.xml`
- role:
  bounded official source sample for the retained trade slice

## Downstream Use

This source truth currently feeds two retained downstream semantic cuts:

1. `fpml_confirmation_source_domain`
   The upstream source-truth cut published inside the versioned
   `trade_source_model` sandbox.
2. `trade_representation_domain`
   The downstream interpreted trade world-model cut published inside the
   versioned `trade_representation_model` sandbox.

## Current Bounding Rule

The current retained trade slice stays narrow. It carries only enough source
authority and interpreted depth to support the current example-domain proving
corpus.

The retained focus remains:

- trade identifiers and trade date
- parties and party references
- commodity swap product surface
- fixed and floating legs
- master-agreement documentation reference
- enough structure to build the first retained trade world-model domain and
  compose it downstream into APRA liquidity
