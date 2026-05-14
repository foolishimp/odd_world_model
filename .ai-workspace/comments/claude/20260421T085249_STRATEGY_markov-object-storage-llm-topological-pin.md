# STRATEGY: Markov-Object Storage Evolution — Pinning Published Cuts Into LLM Topological Space

**Author**: claude
**Date**: 2026-04-21
**Addresses**: `build_tenants/common/schemas/markov_object.schema.json`; `build_tenants/common/schemas/world_model_object.schema.json`; `build_tenants/common/design/WORLD_MODEL_REPRESENTATION_TENANT.md`; `specification/requirements/10-world-model-object-representation.md`; `build_tenants/python/code/odd_world_model/world_model/materialize.py`; `build_tenants/python/code/odd_world_model/world_model/validate.py`; upstream method surface `specification_methodology/specification/standards/WORLD_MODEL_METHOD.md`.
**Status**: Draft

---

## Summary

`odd_world_model` today stores a published Markov object as a JSON packet whose
blanket is a tuple of named surface lists (ingress / egress / observable /
control surfaces) plus two natural-language claim strings. This encodes a
**set-theoretic** reading of the Markov blanket — what's "in" vs "out" by
column membership.

An empirical program in `constraint_emergence_ontology/markov_object_research`
(experiments 08–18 on GPT-2 small + SAEs) has now validated the
Markov-object construct inside a learned representation system and forced
four refinements on it. The most important: **the effective blanket is
geometric, not set-theoretic.** Object identity in a learned representation
is a low-rank direction (typically a difference-of-means translation) in
residual space; any fixed attribute dictionary only partially aligns with
and fragments that direction.

Upstream, `WORLD_MODEL_METHOD.md` has been amended (2026-04-21) to adopt
this reading: added section *Theoretical Underpinnings Of The Markov
Object*, new *Markov Object Construction Law*, Representation Law and
Markov-object unit tightened.

`odd_world_model` has not yet tracked that amendment. The current storage
shape is insufficient for:

- publishing an **identity projection** (geometric direction over ledger
  evidence)
- carrying a **verification-by-treatment** record
- carrying a **null-peer discrimination** record
- distinguishing **core** (identity-carrying) ledger entries from
  **coat** (context-selected) ledger entries
- **pinning published cuts into LLM topological space** so downstream
  LLMs can align to the object with grounded representation rather than
  re-deriving it from raw text each time

This post proposes a concrete evolution: three new schemas, one extension
of the existing Markov-object schema, four new requirements, new
materialize/validate helpers, and an architectural decision on the
LLM-space pin.

The post is a proposal. It is not ratified. Nothing in `specification/`
or `build_tenants/` changes until explicit adoption.

---

## Context For A Cold-Start Reviewer

### 1. The two linked bodies of work

**Method side** —
`specification_methodology/specification/standards/WORLD_MODEL_METHOD.md`
governs world-model construction in this workspace. It defines a Markov
object as *"a stable self-bounding world-model object whose internal
state can be reasoned about through its effective blanket"* and governs
how such objects are built, published, and composed.

**Empirical side** —
`constraint_emergence_ontology/markov_object_research/empirical_results.md`
reports 11 experiments testing whether Markov objects are empirically
present inside GPT-2 small's residual stream, using pretrained sparse
autoencoders (`gpt2-small-res-jb`, 24 576 features per layer). The
experiments:

- **08–09** identify culturally loaded numbers (666, 999, 42) as SAE-feature
  ensembles with an invariant core + context-selected coat
- **10** shows the ensemble is assembled across layers (present from
  layer 2, strengthens monotonically)
- **11** shows symbol-binding at this scale ("42" digit ≠ "forty-two")
- **12** shows the structure generalises across domains (colours,
  emotions, names)
- **13–14** demonstrate causal directionality: ablating core features
  drops target-token probabilities, injecting them raises them;
  transplanting 999's full core into 500 lifts ` 911` probability by ×4.7
- **15** null-peer battery: core *identity* discriminates cultural from
  boring targets; core *size* does not
- **16** permutation baselines: only 666 significantly beats a
  target-shuffle null on core size (p≈0.033) — size alone is a weak
  signal
- **17** boundary-tightness: overwriting SAE features *outside* the
  target's active set still leaks 23–28 % identity transfer — set-theoretic
  boundary is not clean
- **18** direction-native test: a single difference-of-means direction
  in residual space transfers identity uniformly across targets
  (≈ 0.24–0.28 at α=1); PCA1 fails (identity is a DC shift, not a
  variance axis); cosine of the identity direction with the SAE core
  sum is ≈ 0.5 (SAE senses and fragments rather than isolates)

### 2. What the empirical work forces on the method

Four refinements, named in `WORLD_MODEL_METHOD.md` §"Four Empirical
Refinements":

1. **Identity is a translation, not a variance axis.** Characterise
   objects by typical-offset-from-a-null-peer, not by dominant-variance
   direction.
2. **Attribute schemas sense and fragment.** Any fixed attribute basis
   only partially aligns with and partially distributes object
   identity. The published cut must expose the identity axis, not only
   the attribute profile.
3. **Core identity, not core size, is diagnostic.** A sparse invariant
   with semantically loaded content is a lawful Markov object. A rich
   attribute cluster without invariants under context variation is not.
4. **Boundary is interventional, not structural.** The test for "is
   this the blanket?" is: does projection along this direction preserve
   identity under plausible treatments? Not: which attributes are
   members?

### 3. What the method now requires at construction and publication

From the new *Markov Object Construction Law* (seven subsections, in the
Law stack between Attribute Ledger Law and Saturation Law):

1. **Paired Evidence Collection** — `(object, context)` + `(null-peer, context)` ledger entries
2. **Identity-Direction Extraction** — canonical form `d = μ(evidence_object) − μ(evidence_null)`; PCA/max-variance not admissible
3. **Verification By Treatment** — α-sweep, transplant, or boundary test
4. **Core And Coat Decomposition** — stable-across-contexts core vs context-selected coat
5. **Null-Peer Discrimination** — uniqueness of identity content vs similar instances
6. **Cut Publication** — identity direction + attribute evidence + verification record + boundary characterisation + null-peer comparison + effective coordinate
7. **Storage Shape** — geometric object + distributed evidence + verification trace + provenance + supersession record

### 4. Current `odd_world_model` storage shape

**Schemas**: `build_tenants/common/schemas/`

Relevant today:
- `world_model_object.schema.json` — base object with `identity`, `boundary`, `state`, `evidence`, `materialization.attribute_ledger_entry_refs`, `cross_domain`, `composition`
- `markov_object.schema.json` — extends base; adds `blanket` = `{ingress_surfaces, egress_surfaces, observable_surfaces, control_surfaces?, adjacent_objects?, adjacent_domains?, internal_claim, external_claim}`
- `attribute_ledger_entry.schema.json` — `claim_key`, `claim_kind`, `value`, `trace_record_refs`, `assurance_record_refs`, `supersedes_entry_ref`
- `assurance_record.schema.json`, `trace_record.schema.json`, `evidence_manifest.schema.json`

**Worked example**: `examples/trade_representation_model/sandbox/20260419T000000Z_v1/published/trade_representation_domain/objects/trade_contract_state.json` — concrete Markov object for an FpML commodity-swap trade. Blanket is string-array surfaces + NL claims; `materialization.attribute_ledger_entry_refs` is a flat list.

**Layout rule**: `build_tenants/common/design/WORLD_MODEL_REPRESENTATION_TENANT.md` §"Shared Carrier Topology" defines a fragment root with `objects/`, `reference_artifacts/`, `treatments/`, `edges/`, `projections/`, `evidence/manifests/`.

**Materialization**: `build_tenants/python/code/odd_world_model/world_model/materialize.py` has `trace_record()`, `assurance_record()`, `attribute_ledger_entry()` deterministic F_D helpers. No helpers for projection, null-peer, or core/coat.

**Requirements**: `specification/requirements/10-world-model-object-representation.md` REQ-ODD-WORLD-MODEL-WORLD-OBJECT-001 through -012. The blanket-explicitness requirement (REQ-002) currently reads as membership-set explicitness: *"ingress surfaces, egress surfaces, observable surfaces, adjacent objects or domains, and the local claim of what is treated as internal versus external"*.

---

## Findings

### Current state vs strengthened method — gap matrix

| Method obligation (new in WORLD_MODEL_METHOD.md)                                                  | Storage locus today                                                                                              | Status   |
|---------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------|----------|
| Identity direction (geometric projection over ledger evidence)                                    | none                                                                                                             | missing  |
| Construction method record (mean-diff / LDA / linear probe; PCA excluded)                         | none                                                                                                             | missing  |
| Verification-by-treatment record (α-sweep / transplant / boundary test outcomes)                  | none                                                                                                             | missing  |
| Null-peer discrimination record (peers tested, accepted/rejected, diagnostic content)             | none                                                                                                             | missing  |
| Core vs coat split on ledger references                                                           | `materialization.attribute_ledger_entry_refs` is flat                                                            | degraded |
| Projection support / boundary characterisation                                                    | `blanket` = named surface lists                                                                                  | wrong shape |
| Pin to LLM topological space (embedding / prompt-template / alignment signature)                  | none                                                                                                             | missing  |
| Immutability + supersession                                                                        | present for ledger entries (`supersedes_entry_ref`) and object cuts (filesystem/Git)                              | ok       |
| Source-traceability at attribute level                                                             | present via `trace_record_refs` + `assurance_record_refs`                                                        | ok       |

### Why the gap is structural, not cosmetic

The current `markov_object.schema.json.blanket` shape **cannot** be
extended to a geometric projection without either breaking
`additionalProperties: false` or co-opting the existing surface fields
to mean something different from what they say. The current blanket is a
Set-Of-Named-Surfaces. What's needed is a projection-over-evidence that
may or may not correspond to any named surface.

Similarly, `world_model_object.schema.json.materialization.attribute_ledger_entry_refs`
is a flat list. The core/coat split is a set partition with semantic
content: core entries carry identity, coat entries carry context. A flat
list cannot carry that semantics.

### The LLM-topological-space question

The strengthened method says the effective blanket is a low-rank
direction in a representation space. In the empirical work the
representation space is GPT-2 layer-8 residuals. For institutional
Markov objects in `odd_world_model`, the representation space is
whatever space a downstream LLM uses to reason about the institutional
domain — typically the LLM's own residual or embedding space.

If published Markov-object cuts are to be *anchors* that downstream LLMs
align to, rather than descriptions LLMs must re-derive from raw text,
the cuts must carry enough geometric or prompt-template evidence for
that alignment. This is the "pin into LLM topological space" move.

Three storage options (proposed; see Recommended Action for a choice):

- **(a) Prompt-template only.** Store the prompts and null-peer prompts
  needed to re-derive the identity direction on demand against any
  named model+layer. Small, portable, requires the model at consumption.
- **(b) Frozen vector only.** Store the computed direction as `.npy` (or
  base64 in JSON) against one reference model+layer. Self-contained,
  model-specific, versions with the model.
- **(c) Both.** Prompt-template for recomputation across models; frozen
  snapshot against a reference model for immediate consumption.

---

## Proposal — Directional

This is a target direction. Nothing is adopted until ratified.

### Proposal 1 — New schema `identity_projection.schema.json`

A sibling to `markov_object.schema.json`. Purpose: carry the geometric
identity descriptor for one (Markov object × model × layer) triple. A
single Markov object may have many projection artifacts (one per pinned
model+layer); projection artifacts are individually immutable and
superseded as cuts.

Sketch:

```jsonc
{
  "schema_kind": "odd_world_model.identity_projection",
  "schema_version": "v1",
  "projection_id": "odd_world_model.identity_projection.trade_representation.trade_contract_state.trade_fpml_001.gpt2.L8.v1",
  "markov_object_ref": "odd_world_model.markov_object.trade_representation.trade_contract_state.trade_fpml_001",
  "model": {
    "name": "gpt2",
    "revision": "...",
    "layer": 8,
    "hook": "blocks.8.hook_resid_pre"
  },
  "construction": {
    "method": "mean_diff",        // mean_diff | linear_probe | conditional_mean_diff
    "null_peer_refs": [
      "odd_world_model.markov_object.trade_representation.trade_contract_state.null_peer_generic_trade"
    ],
    "paired_contexts": [
      {"template": "The trade {id} is confirmed", "n_pairs": 20}
    ],
    "core_ledger_entry_refs": ["ledger://.../trade_identifier.json", "..."],
    "coat_ledger_entry_refs": ["ledger://.../lifecycle_amendment.json", "..."]
  },
  "vector": {
    "dim": 768,
    "storage_kind": "npy_ref",    // npy_ref | inline_base64
    "vector_ref": "embeddings/trade_contract_state.gpt2.L8.v1.npy",
    "norm": 12.37,
    "fingerprint": "sha256:..."
  },
  "verification": {
    "held_out_contexts": 10,
    "alpha_sweep": [
      {"alpha": 0.5, "transfer": 0.17},
      {"alpha": 1.0, "transfer": 0.26},
      {"alpha": 1.5, "transfer": 0.24},
      {"alpha": 2.0, "transfer": 0.19}
    ],
    "transplant_test": {"null_peer_ref": "...", "transfer_at_alpha_1": 0.22},
    "boundary_test": {"overwritten_attrs_outside_support": 50, "identity_preserved": true}
  },
  "supersedes_projection_ref": null,
  "published_at": "2026-04-21T08:52:49Z"
}
```

Supersession: a new projection against the same (object, model, layer)
sets `supersedes_projection_ref` rather than mutating the prior file.
Rationale: matches Publication Law.

### Proposal 2 — Extend `markov_object.schema.json`

Add two optional reference fields:

```jsonc
{
  // existing fields unchanged
  "identity_projection_refs": [
    "projections/trade_contract_state.gpt2.L8.v1.json"
  ],
  "null_peer_discrimination_ref": "null_peer_records/trade_contract_state.v1.json"
}
```

Keep the existing `blanket` field for now (it still carries legitimate
domain-level ingress/egress surface information). Upgrade the
interpretation in documentation: named surfaces are **evidence for** the
identity projection, not the blanket itself. In a later wave the
`blanket` field may be reshaped; do not break existing cuts.

Alternative considered: replace `blanket` outright. Rejected —
published cuts are immutable; backwards compatibility is load-bearing.

### Proposal 3 — New schema `null_peer_record.schema.json`

```jsonc
{
  "schema_kind": "odd_world_model.null_peer_record",
  "schema_version": "v1",
  "record_id": "odd_world_model.null_peer_record.trade_contract_state.v1",
  "markov_object_ref": "odd_world_model.markov_object.trade_representation.trade_contract_state.trade_fpml_001",
  "peers_tested": [
    {
      "peer_ref": "odd_world_model.markov_object.trade_representation.trade_contract_state.null_peer_generic_trade",
      "relationship": "structural_sibling",
      "disposition": "accepted_as_null"
    },
    {
      "peer_ref": "odd_world_model.markov_object.banking_product.commodity_swap_product",
      "relationship": "cross_domain_cousin",
      "disposition": "rejected_as_equivalent",
      "rejection_reason": "Distinct identity: this object carries party relationship and master-agreement linkage; peer carries product-definition structure only."
    }
  ],
  "diagnostic_content": [
    "trade_must_have_trade_identifier",
    "trade_must_have_two_parties",
    "master_agreement_linkage"
  ],
  "published_at": "2026-04-21T08:52:49Z"
}
```

### Proposal 4 — Fragment layout extensions

Add two folders to the fragment root in
`WORLD_MODEL_REPRESENTATION_TENANT.md` §"Shared Carrier Topology":

```text
<fragment-root>/
  fragment.json
  objects/
    *.json
  identity_projections/             # NEW
    *.json
  null_peer_records/                # NEW
    *.json
  embeddings/                       # NEW (binary)
    *.npy
  reference_artifacts/
    *.json
  treatments/
    *.json
  edges/
    covariance/*.json
    adjoints/*.json
  projections/
    *.json
  evidence/
    manifests/*.json
```

Note potential collision: the existing `projections/` folder holds
`ProjectionSpec` documents (tables, API contracts, dbt models). The new
`identity_projections/` folder holds geometric identity projections for
Markov objects. Naming is intentionally distinct.

### Proposal 5 — Requirements additions

Append to `specification/requirements/10-world-model-object-representation.md`:

- **REQ-ODD-WORLD-MODEL-WORLD-OBJECT-013 — Geometric Identity Projection**
  `odd_world_model` SHALL, for every published Markov object, provide at least
  one identity-projection artifact that makes the geometric direction
  preserving object identity under treatment recoverable, scoped to a
  named model and layer.

- **REQ-ODD-WORLD-MODEL-WORLD-OBJECT-014 — Verification By Treatment Record**
  Every published identity projection SHALL carry a verification record
  naming the treatments applied (α-sweep, transplant, or boundary test),
  the held-out contexts used, and the observed transfer outcome.

- **REQ-ODD-WORLD-MODEL-WORLD-OBJECT-015 — Null-Peer Discrimination Record**
  Every published Markov object SHALL carry a null-peer record naming the
  peers tested, their disposition (accepted as null / rejected as
  equivalent), and the diagnostic content unique to the object.

- **REQ-ODD-WORLD-MODEL-WORLD-OBJECT-016 — Core And Coat Decomposition In Published Cuts**
  Published Markov-object cuts SHALL distinguish the invariant-core
  subset of attribute-ledger references from the context-coat subset on
  the associated identity projection, rather than presenting a flat list
  of attribute references.

Amendment to REQ-002 (Markov Blanket Explicitness) — re-interpret to
require explicitness of the **identity projection**; named surfaces
remain evidence for the projection rather than the blanket itself.

### Proposal 6 — Implementation additions

`build_tenants/python/code/odd_world_model/world_model/materialize.py`:

- `identity_projection(...)` — accepts `markov_object_ref`, `model`,
  `core_ledger_entry_refs`, `coat_ledger_entry_refs`,
  `construction_method`, `vector` descriptor, `verification` block;
  returns the JSON payload.
- `null_peer_record(...)` — accepts `markov_object_ref`, `peers_tested`,
  `diagnostic_content`; returns the JSON payload.
- `core_coat_split(...)` — accepts a list of ledger-entry payloads and a
  null-peer reference; returns `(core_refs, coat_refs)` by a declared
  criterion (stability-across-contexts threshold).

`build_tenants/python/code/odd_world_model/world_model/validate.py`:

- recognise `odd_world_model.identity_projection` and
  `odd_world_model.null_peer_record` as valid `schema_kind` values
- referential integrity: projection → markov_object → ledger entries;
  vector_ref resolves; null-peer refs resolve
- constraint: at least one projection per published Markov object (per
  REQ-013)

### Proposal 7 — LLM-topological-space pin: recommend option (c)

**Prompt-template for recomputation across models, frozen snapshot against
a reference model for immediate consumption.**

Rationale:

- Matches immutable-cut publication: a frozen snapshot *is* the cut; a
  new reference model produces a new cut that supersedes.
- Keeps the filesystem-first low-volume lane: JSON + `.npy` both live
  under Git (or `.npy` fingerprinted and externally stored, with hash
  recorded in JSON, for large bodies).
- Gives downstream LLMs two consumption modes: load the frozen vector
  directly (if they match the reference model), or recompute on demand
  from the prompt-template (if they do not).
- Preserves author control: authors pick which models are pinned.

---

## Worked Example — Direction For `trade_contract_state`

Mapped onto the existing example at
`examples/trade_representation_model/sandbox/20260419T000000Z_v1/published/trade_representation_domain/objects/trade_contract_state.json`:

- **Null peer**: a generic-trade Markov object lacking commodity-swap and
  party-relationship identity; constructed from the same FpML schema
  frame but with null party refs and a generic product.
- **Paired contexts**: 20 templated contexts in which "this trade" is
  instantiated (confirmation, amendment, termination, query, lineage,
  reporting). Null peer instantiated in the same 20 templates.
- **Construction**: `d = μ(resid_trade_contract_state) − μ(resid_null_peer)`
  at a pinned reference model+layer.
- **Verification**: α-sweep on 10 held-out contexts. Transplant test:
  apply `d` to a null-peer instance and check the output reads as a
  trade-contract-state-like object.
- **Core / coat**: core ledger entries likely include
  `trade_identifier`, `product_reference`, `party_a_reference`,
  `party_b_reference`, `master_agreement_reference`. Coat ledger
  entries likely include amendment metadata, termination notices,
  lifecycle-position-specific attributes.
- **Null-peer discrimination**: distinguish from
  `commodity_swap_product` (product definition, no parties) and from a
  generic trade (has structure, lacks party relationship and master
  agreement linkage).

No change to the existing cut; a new projection artifact and null-peer
record are added alongside.

---

## References

### Within `odd_world_model`

- `specification/INTENT.md`
- `specification/PRODUCT.md`
- `specification/requirements/10-world-model-object-representation.md` (REQ-001..012)
- `build_tenants/common/schemas/markov_object.schema.json`
- `build_tenants/common/schemas/world_model_object.schema.json`
- `build_tenants/common/schemas/attribute_ledger_entry.schema.json`
- `build_tenants/common/schemas/assurance_record.schema.json`
- `build_tenants/common/schemas/trace_record.schema.json`
- `build_tenants/common/design/WORLD_MODEL_REPRESENTATION_TENANT.md`
- `build_tenants/python/code/odd_world_model/world_model/materialize.py`
- `build_tenants/python/code/odd_world_model/world_model/validate.py`
- `examples/trade_representation_model/sandbox/20260419T000000Z_v1/published/trade_representation_domain/objects/trade_contract_state.json`

### Upstream method surfaces (amended 2026-04-21)

- `specification_methodology/specification/standards/WORLD_MODEL_METHOD.md`
  - §"Theoretical Underpinnings Of The Markov Object" (new)
  - §"Markov Object Construction Law" (new, seven subsections)
  - §"Markov Object" unit (tightened; points forward)
  - §"Representation Law" (tightened; geometric blanket reading)
  - §"Materialization Law" (tightened; cut is literal projection)
  - §"Companion Surfaces" (references empirical paper)

### Empirical validation surface

- `constraint_emergence_ontology/markov_object_research/empirical_results.md`
  — 11 experiments (08–18); §15 is the claim-by-claim validation table
  mapping method claims to experiments.
- `constraint_emergence_ontology/markov_object_research/experiments/18_direction_native_object.py`
  — direction-native identity-transfer test.
- `constraint_emergence_ontology/markov_object_research/results/18_direction_native/direction_report.txt`
  — transfer ratios, cosines, per-target results.
- `constraint_emergence_ontology/constraint_emergence_ontology.md` — ontology
  in which "Markov object" is defined as a substrate-neutral construct.

### Posting authority

- `specification_methodology/specification/standards/POSTING_GUIDE.md`

---

## Recommended Action

1. **Review-level** — accept, amend, or reject the directional proposal.
   Focus review on:
   - whether the geometric-blanket reading is the correct lift of the
     empirical finding into `odd_world_model` storage
   - whether the LLM-topological-space pin belongs in-band in the cut
     or whether it is a downstream concern
   - whether option (c) (prompt-template + frozen snapshot) is the right
     trade-off for the current filesystem-first lane
2. **If accepted directionally** — open four tickets (one per requirement
   REQ-013..016) and one ticket for the tenant-design amendment
   (`WORLD_MODEL_REPRESENTATION_TENANT.md` layout extension). Schemas
   and materialize helpers are implementation work under those tickets.
3. **Worked-example ticket** — extend `trade_contract_state` with one
   identity projection + one null-peer record as the first proving cut.
   Do not mutate the existing object JSON; add the new artifacts
   alongside.
4. **Do not** change `markov_object.schema.json.blanket` shape in this
   wave. The field continues to carry legitimate domain-level surface
   evidence and can be re-interpreted in documentation without a
   breaking change.

---

## Status Note

This post describes both current reality (§"Context For A Cold-Start
Reviewer" and the gap matrix) and target direction (§"Proposal"). It is
commentary, not ratified specification or design. No files under
`specification/` or `build_tenants/` change until this proposal is
explicitly adopted.
