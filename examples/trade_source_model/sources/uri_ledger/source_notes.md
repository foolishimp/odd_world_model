# Trade Source Notes

This example retains the upstream official trade-source corpus for the current
`odd_world_model` proving line.

The retained local authority files are:

- `data/authority/fpml-5-12-examples.html`
- `data/authority/com-ex28-gas-swap-daily-delivery-prices-option-last.xml`
- `source_authority.md`

This source lane is intentionally raw.

It preserves the official FpML confirmation-view material so later
`odd_world_model` versions can rebuild:

- the upstream `fpml_confirmation_source_domain`
- the downstream `trade_representation_domain`
- any future sibling trade interpretations that still depend on the same
  official confirmation source

The current retained semantic center remains:

- trade identifier and trade date
- parties and party references
- commodity swap product shape
- fixed and floating swap legs
- governing master-agreement reference
