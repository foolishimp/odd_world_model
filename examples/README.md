# Example Domains

This directory holds the retained root-level example hierarchy for
`odd_world_model`.

Each example domain separates:

- `sources/`
  retained source authority, local source data, PDFs, code samples, and URI
  ledgers for the domain
- `sandbox/<datetime>_<version>/`
  a versioned installed `odd_world_model` instance for that domain

`sources/` is the retained rebuild authority for the example domain. New
`sandbox/<datetime>_<version>/` cuts may be stamped side by side against the
same source corpus as later `odd_world_model` releases or release candidates
change the world-model build line.

Current example domains:

- `trade_source_model/`
- `trade_representation_model/`
- `apra_liquidity_model/`
- `banking_product_model/`
