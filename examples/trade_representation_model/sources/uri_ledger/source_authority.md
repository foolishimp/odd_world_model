# Trade Representation Source Authority

This source-authority surface records the retained source set for the bounded
`trade_representation_model` example domain.

This example does not carry independent external authority separate from the
trade-source example. Its authority is layered:

1. official FpML confirmation-view material retained in the sibling
   `trade_source_model`
2. a bounded local trade-capture schema snapshot and input record used to build
   the trade-representation cut

## Retained Source Set

### 1. Upstream official trade-source authority

- sibling authority surface:
  `../../trade_source_model/sources/uri_ledger/source_authority.md`
- role:
  retained official FpML authority for the trade identifiers, parties, product
  structure, and agreement semantics reinterpreted in this example domain

### 2. Local trade-capture schema snapshot

- local file:
  `data/schema_snapshot.json`
- role:
  bounded source-contract snapshot for the local trade-representation lane,
  recording the fields retained for the example trade-capture surface

### 3. Local trade-capture input slice

- local file:
  `data/domain_input.json`
- role:
  bounded local representation of the trade record over which later
  `odd_world_model` cuts can rebuild the trade-representation domain

## Current Bounding Rule

The current trade-representation example keeps only these semantic centers:

- trade contract state
- commodity or product representation
- counterparty identity
- governing agreement

This retained source set is intentionally sparse. Its job is to preserve the
minimum local representation contract over the official trade-source corpus so
the domain can be rebuilt cleanly by later `odd_world_model` versions.
