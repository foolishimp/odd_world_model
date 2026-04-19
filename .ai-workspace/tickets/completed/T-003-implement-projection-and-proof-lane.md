# T-003 Implement Projection And Proof Lane

- id: T-003
- type: feature
- status: completed
- goal: proving-wave-01
- priority: high
- dependencies: T-001, T-002, T-004, T-005
- created_at: 2026-04-15
- updated_at: 2026-04-15

## Context

The product direction required side-by-side proof from the same governed world
model.

This ticket covered the first projection and proof lane:

- conventional enterprise projections such as mapping docs or `dbt`
  transformations
- `data_mapper` covariant transforms

Both outputs needed to derive from the same semantic kernel.

## Acceptance

- at least one conventional projection can be generated from the governed model
- at least one `data_mapper` covariant transform can be generated from the same
  governed model
- the proof lane preserves traceability back to the governing objects and
  evidence surfaces
- the comparison surface can show semantic continuity, declared loss, and drift
  visibility between the two output classes

## Completion

Completed by introducing:

- proof-lane builder:
  `build_tenants/python/code/odd_world_model/proof/trade_to_apra.py`
- conventional mapping document:
  `build_tenants/common/examples/sandbox_trade_to_apra_mvp/proof/conventional/trade_to_apra_mapping_document.md`
- conventional dbt-style SQL projection:
  `build_tenants/common/examples/sandbox_trade_to_apra_mvp/proof/conventional/trade_to_apra_liquidity.sql`
- covariant transform spec:
  `build_tenants/common/examples/sandbox_trade_to_apra_mvp/proof/covariant/trade_to_apra_covariant_transform.json`
- comparison surface:
  `build_tenants/common/examples/sandbox_trade_to_apra_mvp/proof/comparison/trade_to_apra_comparison.md`
- proof summary manifest:
  `build_tenants/common/examples/sandbox_trade_to_apra_mvp/proof/proof_summary.json`

The proof lane is generated from the same governed sandbox corpus that now
imports the FpML-derived trade artifact and composes it with the APRA-liquidity
domain.

## Links

- parent: `.ai-workspace/tickets/completed/T-001-add-world-model-representation-tenant.md`
- triage: `.ai-workspace/comments/codex/20260414T161949Z_TRIAGE_T-001-world-model-representation-tenant.md`
- design: `build_tenants/common/design/WORLD_MODEL_REPRESENTATION_TENANT.md`
- proof_corpus: `.ai-workspace/tickets/completed/T-004-build-sandbox-mvp-and-markov-object-corpus.md`
- real_trade_input: `.ai-workspace/tickets/completed/T-005-ingest-real-trade-representation-standard.md`
