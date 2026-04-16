# Trade To APRA Proof Comparison

## Outputs

- Conventional mapping document: `proof/conventional/trade_to_apra_mapping_document.md`
- Conventional dbt model: `proof/conventional/trade_to_apra_liquidity.sql`
- Covariant transform: `proof/covariant/trade_to_apra_covariant_transform.json`

## Shared Governing Semantics

- Treatment: `odd_domain.treatment.trade_representation.to_apra_liquidity.candidate.v1`
- Covariance edge: `odd_domain.covariance.trade_representation.to_apra_liquidity.trade_fpml_001.v1`
- Adjoint mapping: `odd_domain.adjoint.trade_representation.to_apra_liquidity.trade_fpml_001.v1`

## Semantic Continuity

- Both output classes derive from the same source Markov object and target Markov object.
- Both output classes carry the same preserved structure set.
- Both output classes are anchored to the same cross-domain treatment and interpret-back semantics.

## Declared Loss

- Detailed commodity product semantics do not survive intact into the APRA-liquidity reporting view.

## Drift Visibility

- Conventional outputs show the intended structural mapping and SQL realization.
- The covariant transform keeps the covariance edge and adjoint reference explicit.
- If the cross-domain relationship changes, the covariant path has named semantic control points to inspect: treatment, covariance, and adjoint.
- The conventional path remains useful for incumbent delivery, but semantic drift is easier to hide there unless the governed model is reviewed first.
