# FpML Trade Representation Standard

This example is the first real published trade-representation ingestion lane
for `odd_world_model`.

It takes a bounded FpML-shaped trade representation input and materializes a
published `odd_world_model` trade domain artifact in the common JSON carrier.

The intent is not full FpML coverage.

The intent is to prove one lawful slice:

1. ingest a real published trade representation standard shape
2. parse a bounded trade sample
3. publish a governed trade world fragment with FQN-compliant semantic objects
4. inspect what semantics were explicit in the standard and what still needs
   deepening

## Build

```bash
PYTHONPATH=build_tenants/python/code python -m odd_world_model.build_line.fpml_trade_domain
```

## Validate

```bash
PYTHONPATH=build_tenants/python/code python -m odd_world_model.world_model.validate build_tenants/common/examples/fpml_trade_representation_standard/published
```

## Inspect

Start with:

- `review/parsed_trade_observation.json`
- `review/traces/trade_contract_state/*.json`
- `review/assurance/trade_contract_state/*.json`
- `published/trade_representation_domain/fragment.json`
- `published/trade_representation_domain/attribute_ledger/trade_contract_state/*.json`
- the object packets under `published/trade_representation_domain/objects/`

## Source Authority

The sample is house-authored but shaped from official FpML documentation.

See:

- `inputs/trade_representation/source_authority.md`
