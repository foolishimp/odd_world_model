# Sandbox Trade To APRA MVP

This sandbox is the first executable `odd_domain` MVP lane.

It exists to prove the lifecycle end to end:

1. bounded source inputs are provided
2. `odd_domain` imports a real FpML-derived trade artifact and combines it with
   bounded APRA-liquidity inputs
3. `odd_domain` builds and publishes the resulting two-domain corpus in the
   common JSON carrier
4. the team inspects the resulting representations to find missing semantics

The sandbox uses the first concrete two-domain pair discussed in product work:

- a trade-representation domain imported from the bounded FpML real-standard
  lane
- an APRA-liquidity regulatory domain

The sandbox corpus is intentionally sparse. It is meant to be deepened after
inspection, not treated as a finished ontology.

## Layout

- `inputs/`
  bounded source inputs used to build the APRA side of the sandbox publication
- `published/`
  generated world fragments for the imported trade domain and the APRA domain
- `review/`
  generated trace and assurance records for both the imported trade object cut
  and the APRA reporting-position cut
- `stitching_candidates/`
  cross-domain covariance and adjoint candidates to support later proof work
- `proof/`
  generated conventional and covariant proof outputs from the same governed
  model
- `query/`
  generated filesystem-first explainability and mapping traversal outputs over
  the published corpus

## Build

Run the sandbox builder:

```bash
PYTHONPATH=build_tenants/python/code python -m odd_domain.build_line.trade_to_apra
```

Validate the generated fragments:

```bash
PYTHONPATH=build_tenants/python/code python -m odd_domain.world_model.validate build_tenants/common/examples/sandbox_trade_to_apra_mvp/published
```

Generate the first proof lane:

```bash
PYTHONPATH=build_tenants/python/code python -m odd_domain.proof.trade_to_apra
```

Generate the current query/traversal lane:

```bash
PYTHONPATH=build_tenants/python/code python -m odd_domain.query.trade_to_apra
```

## Current Intent

This sandbox is not trying to prove enterprise coverage.

It is trying to prove that `odd_domain` can:

- observe bounded input evidence and import an upstream published trade artifact
- publish initial semantic kernel objects in a composed sandbox corpus
- expose trace, assurance, and attribute-ledger surfaces backing those cuts
- keep the representations inspectable
- generate a conventional mapping path and a covariant transform path from the
  same governed model
- answer bounded explainability and mapping traversal questions without a
  separate query store
