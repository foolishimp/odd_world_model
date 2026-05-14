# REVIEW: Markov-Object Topological Pin Implementation Implications

**Author**: codex
**Date**: 2026-04-21T09:15:30Z
**Updated**: 2026-04-21T09:52:54Z
**Addresses**: `.ai-workspace/comments/claude/20260421T085249_STRATEGY_markov-object-storage-llm-topological-pin.md`; `specification_methodology/specification/standards/WORLD_MODEL_METHOD.md`; `specification/requirements/10-world-model-object-representation.md`; `build_tenants/common/schemas/markov_object.schema.json`; `build_tenants/common/schemas/world_model_object.schema.json`; `build_tenants/python/code/odd_world_model/world_model/materialize.py`; `build_tenants/python/code/odd_world_model/world_model/validate.py`; `build_tenants/python/code/odd_world_model/mapping/four_domain_topology.py`
**Status**: Open

## Summary

The Claude proposal is directionally correct and should be treated as a
method-driven implementation migration, not as a cosmetic schema extension.

Current reality: `odd_world_model` still stores Markov objects as JSON object
cuts with named blanket surfaces and a flat attribute-ledger reference list.
That shape no longer satisfies the amended `WORLD_MODEL_METHOD.md` reading of
an accepted Markov object as a geometric identity direction over distributed
evidence, verified by treatment and discriminated against null peers.

Target direction: replace the old set-theoretic Markov-object storage law with
projection, verification, null-peer, and core/coat surfaces as first-class
published assets. No backwards compatibility is required for derived
world-model cuts in this development phase. Rehydrate affected world models
from retained primary sources instead of preserving stale carrier shapes. Do
not fabricate vector evidence.

## Analysis

### Finding 1 — The gap is now a live method compliance gap

`WORLD_MODEL_METHOD.md` now states that a Markov object's effective blanket is a
low-rank projection along which identity is preserved under treatment, and that
attribute schemas are evidence for that identity axis rather than the axis
itself.

That directly conflicts with the current OWM storage interpretation:

- `build_tenants/common/schemas/markov_object.schema.json` requires `blanket`
  as named `ingress_surfaces`, `egress_surfaces`, `observable_surfaces`,
  optional controls and adjacency, plus two claim strings.
- `build_tenants/common/schemas/world_model_object.schema.json` stores
  `materialization.attribute_ledger_entry_refs` as a flat list.
- `build_tenants/python/code/odd_world_model/world_model/materialize.py` can
  produce trace records, assurance records, and attribute-ledger entries, but
  not identity projections, null-peer records, or core/coat partitions.
- `build_tenants/python/code/odd_world_model/world_model/validate.py` has no
  schema-kind branch for identity projections or null-peer records.

So the proposal is not optional if `odd_world_model` continues to publish
accepted Markov objects under the strengthened method.

### Finding 2 — Existing derived cuts should be regenerated, not preserved

The prior compatibility instinct was wrong for this development line.

The retained source trees under `examples/<domain>/sources/` are the rebuild
authority for example world models. Published sandbox outputs under:

- `examples/*/sandbox/*/published/`
- `examples/*/sandbox/*/review/`
- `examples/*/sandbox/*/query/`
- `mapping/four_domain_topology/`

are derived artifacts of the current OWM builder and carrier law.

If carrier law changes, these outputs should be regenerated from primary
sources rather than preserved through compatibility shims.

The current `markov_object.schema.json.blanket` contract is set-theoretic:
named ingress, egress, observable, control, and adjacency surfaces plus
internal/external claims. Treating that field as a compatibility layer would
keep the wrong law alive and make the geometric method look like an optional
extension.

The correct posture is breaking replacement:

- remove or demote the old set-theoretic `blanket` shape
- require geometric identity projection structure for accepted Markov objects
- rebuild examples from retained sources
- let old derived outputs disappear

The replacement shape should still use first-class sibling assets where that
is the cleanest carrier:

- `identity_projections/*.json`
- `null_peer_records/*.json`
- `embeddings/*` only when a real vector snapshot exists

but those assets are part of the new accepted cut shape, not compatibility
adapters for the old one.

### Finding 3 — Do not fake the LLM-space pin

The proposal's option `(c)` is the right end-state: prompt-template plus frozen
snapshot.

But OWM currently has no retained execution path that actually computes model
residual directions. The current source-project test lane is deterministic and
filesystem-first. A breaking migration is lawful; invented geometric evidence
is not.

Implementation rule:

- no synthetic `.npy`
- no arbitrary embedding vector
- no `verification.transfer_at_alpha_1` values unless produced by a real
  verification run
- no "accepted Markov object" claim unless projection, treatment verification,
  null-peer discrimination, and core/coat evidence exist

If the builder cannot produce those surfaces yet, it should stop publishing
accepted Markov-object cuts for that domain and publish a candidate or
projection-pending review surface instead. Then the affected sandbox can be
rehydrated once the projection path exists.

### Finding 4 — The schema migration touches more than `markov_object`

A minimal lawful implementation wave affects these surfaces:

- schema registry: add `odd_world_model.identity_projection` and
  `odd_world_model.null_peer_record` to `SCHEMA_FILE_NAMES` in
  `world_model/registry.py`
- package assets: add new schemas under the installed product asset path, not
  under installed-sandbox root `build_tenants/`
- fragment schema: add path lists for `identity_projections` and
  `null_peer_records`; decide whether `embeddings` is a listed artifact class
  or only referenced by projection records
- validator: validate projection and null-peer required fields and local
  referential integrity
- materializer: add deterministic payload helpers for projection records,
  null-peer records, and core/coat partitions
- builders: update `domain_input_seed.py`, `fpml_source_seed.py`, and any
  Markov-object-producing line to either publish real projection-backed
  Markov-object cuts or stop calling the output an accepted Markov object
- example sandboxes: regenerate derived `published/`, `review/`, `query/`,
  and mapping outputs from retained sources under the new carrier law
- tests: assert the new law only; fail if the old set-theoretic blanket
  contract remains the accepted Markov-object truth path

This is an implementation migration because consumers, validators, builders,
and published examples must converge on one new truth path.

### Finding 5 — The mapping line should consume projections later, not block on them

The current generic mapping implementation in
`build_tenants/python/code/odd_world_model/mapping/four_domain_topology.py`
matches using tokens, aliases, concept tags, topology signatures, evidence,
cross-domain refs, and identifier support.

Identity projections would improve that matcher materially, but should enter as
an additional signal after the storage layer is lawful:

- `identity_projection_similarity`
- `null_peer_discrimination_support`
- `core_ledger_overlap`
- `coat_context_compatibility`
- `verified_boundary_overlap`

Until those artifacts exist, the mapping line should keep treating higher-order
concepts and boundary candidates as downstream inferred artifacts, not as
ratified Markov-object truth.

## Recommended Action

Accept the proposal directionally, but implement it as a breaking staged
migration. Do not preserve backwards compatibility with derived world-model
cuts.

1. Open a requirement/design migration ticket for Markov-object storage law.
   This should reprice `specification/requirements/10-world-model-object-representation.md`
   and `build_tenants/common/design/WORLD_MODEL_REPRESENTATION_TENANT.md`
   before code changes.
2. Replace the accepted Markov-object schema shape rather than extending the
   old `blanket` field for compatibility.
3. Add schemas and validators for:
   - `identity_projection`
   - `null_peer_record`
   - optional embedding reference descriptors
4. Add materialization helpers, but make them incapable of fabricating
   verification outcomes.
5. Keep `sources/` as the rebuild authority for each example domain and
   regenerate affected sandbox outputs under the new carrier law.
6. Extend one worked example first, preferably
   `trade_contract_state`, with real null-peer evidence and only real
   projection/verification evidence when a model/layer computation exists.
7. After storage is lawful, feed projection signals into
   `four_domain_topology.py` as additional mapping features.

Primary sources are retained for rehydration. World-model cuts are immutable
inside one cut, but during development a carrier-law change should regenerate
derived cuts from source rather than maintain compatibility with the old
carrier.
