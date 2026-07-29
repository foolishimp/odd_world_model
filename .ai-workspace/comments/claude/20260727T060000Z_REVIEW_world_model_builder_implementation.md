# Review: odd_world_model Builder Implementation

- reviewer: claude (independent)
- date: 2026-07-27T06:00Z
- subject: `main` at `f94aa30` (2026-07-12) plus 15 uncommitted paths
- basis: `WORLD_MODEL_METHOD.md` as released at STDO `v2.2.1`

## Verdict

**The builder has built the distribution half of the method and not the
comprehension half — and it says so, precisely, in machine-readable form.**

The mesh, composition, context-memory, query, and exact-reference publication
layers are substantially evidenced. The `source → tracing → assurance →
attribute ledger → object cut` chain, which is the method's Materialization
Law and the thing that makes a cut *mean* anything, is absent by the
implementation's own declaration.

No finding here is a discovered defect. Everything material below is something
the implementation already declares. That is the most unusual and most
creditable property of this codebase.

## Gates — Verified

| Gate | Result |
|---|---|
| `npm run typecheck` | clean |
| `npm test` (TS) | **35/35** |
| `npm run test:storage` (Python) | **22/22** |
| `npm run test:sandbox` | **1/1** |

~6,900 lines of real TypeScript across 13 modules, plus a Python storage
tenant. Four worked examples (`apra_liquidity`, `banking_product`,
`trade_representation`, `trade_source`) each produce a digest-bound
`wm-instance.json` with a product binding, source inventory, artifact
manifest, and an eight-kind artifact index. The end-to-end path runs.

## The Shape, Quantified

The proof surface emits a requirement ledger: **116 requirements, 53
candidate_evidence, 44 open, 18 deferred, 1 n/a, zero closed**, with
`closure_authority: "not_claimed"`. By family:

| Family | cand | open | defr |
|---|---:|---:|---:|
| 90-world-model-mesh-constraints | **11** | 0 | 0 |
| 80-world-model-mesh-capability | **10** | 0 | 0 |
| 50-odd-method-gtl-carrier | 8 | 4 | 0 |
| 25-governed-context-memory-capability | 6 | 0 | 0 |
| 30-domain-build-and-composition-constraints | 5 | 1 | 0 |
| 35-governed-context-memory-constraints | 5 | 1 | 0 |
| 20-domain-build-and-composition-capability | 4 | 3 | 0 |
| **10-world-model-object-representation** | **4** | **9** | 0 |
| 05-product-definition-authority | 0 | **10** | 0 |
| 40-domain-build-verification | 0 | **8** | 0 |
| 95-release-installation-governance | 0 | **8** | 0 |
| 60-multi-domain-mapping-capability | 0 | 0 | **10** |
| 70-multi-domain-mapping-constraints | 0 | 0 | **8** |

Read down that table and the build order is legible: **the mesh is complete
(21/21) while the object it meshes is 4/13**, verification is 0/8, and the
entire cross-domain treatment/covariance/adjoint layer — 18 requirements — is
deferred wholesale.

## The Central Finding: The Comprehension Chain Is Absent

The proof surface declares this eight separate ways. Verbatim:

- `no_append_only_attribute_ledger_is_the_immediate_source_of_the_candidate_object_cut`
- `traced_observation_exists_but_the_separate_assurance_surface_is_not_realized`
- `the_current_slice_has_source_check_acceptance_and_publication_but_not_the_required_assurance_and_attribute_ledger_chain`
- `reverse_recoverability_stops_before_resolved_attribute_ledger_and_assurance_evidence`
- `attribute_level_sourceability_cannot_close_without_attribute_ledger_and_assurance_records`
- `append_only_attribute_ledger_materialization_is_not_realized`
- `source_check_and_cut_surfaces_exist_but_assurance_and_attribute_ledger_review_surfaces_are_missing`
- `the_integrated_slice_is_semantic_plumbing_not_the_full_source_to_attribute_ledger_to_object_chain`

That last one is the honest summary of the whole build, written by the build.

The artifact index of a produced instance confirms it structurally:
`source_observation`, `candidate_markov_objects`, `published_semantic_cut`,
`bounded_mesh_cut`, `context_basis`, `context_projection`,
`world_model_query`, `runtime_events` — **no `attribute_ledger`, no
`assurance`**. The method's stated chain has its first and last links and
nothing between.

Consequence worth stating plainly: the Materialization Law's recoverability
requirement — every accepted attribute recoverable through cut → ledger entry
→ assurance basis → traced source — cannot be discharged today for any
published cut. The implementation says exactly this
(`reverse_recoverability_stops_before...`).

## The Second Finding: It Is Already An Entity-Cut Builder

This is the substantive discovery, and it bears directly on the method text.

A produced candidate object:

```json
{
  "schema_kind": "odd_world_model.candidate_markov_object_cut",
  "object_identity": "apra_liquidity_position_001",
  "identity_direction": {
    "source_state_refs": ["source-state://.../observed"],
    "target_state_refs": ["world-object://.../candidate"],
    "projection_ref": "projection://.../apra_liquidity_position/v1"
  },
  "projection_support_refs": ["source-field://.../agreement_asses…"]
}
```

The `identity_direction` is **not a geometric direction**. It is a referential
triple: this observed source state maps to this world object under this
projection. `projection_support_refs` are **source-field references**, not a
low-rank subspace.

So the implementation took the Markov vocabulary and bound it to referential
semantics — recovering a boundary a source system already commits to, and
citing the fields that evidence it. That is an **entity cut**. It has been one
all along, wearing geometric names.

The proof surface knows the difference:
`identity_direction_shape_exists_but_held_out_treatment_and_distributed_evidence_are_unresolved_refs`.
The shape is present; the geometric content and its verification are not, and
never were.

**This independently corroborates the method change.** The builder did not fail
to implement the Markov Object Construction Law — it built the discovery law
instead, because that is what the substrate admits. The document was the thing
out of step, not the code.

One real consequence of the current naming: `projection_support_refs` over
source fields is a *set-membership* boundary, which is precisely the reading
the method's own theory section says "does not survive contact with real
representations." Under the revised Representation Law that is admissible only
if the boundary is stated interventionally — and today there is no treatment
verification, so the boundary is asserted rather than tested. That is the gap
the new *Entity Cut Construction Law* §4 (adjoint round-trip) exists to close,
and the repo already has treatment and adjoint concepts in five and four files
respectively to build it from.

## Risk Worth Naming

The mesh layer reads "done" at 21/21 while the object it composes is 4/13 and
its evidentiary chain is unbuilt. That is structurally the same shape as the
ABIogenesis July-24 rejection — internal completion running ahead of the
product outcome — and it deserves a deliberate answer rather than momentum.

The mitigating difference is decisive: there, the greens concealed the gap;
here, the greens are explicitly scoped and the gap is enumerated in the
artifact. `closure_authority: "not_claimed"` is doing real work. But 21/21 on
composition is evidence about plumbing, and it will read as progress on world
models to anyone who does not open the ledger.

## Recommendation

1. **Rename to match reality.** `candidate_markov_object_cut` →
   `entity_cut`, with `identity_direction` split into the referential
   identity relation it actually is, and the Markov-object overlay reserved
   for a declared representation space. The code is already correct; the names
   are writing a cheque the artifacts do not cash.
2. **Build the ledger and assurance surfaces next**, not more mesh. They are
   the first and second links of the chain, eight declared gaps converge on
   them, and family 10 (object representation, 4/13) cannot move without them.
3. **Then close verification** via the adjoint round-trip — family 40 is 0/8,
   and it is what turns an asserted boundary into a recovered one.
4. Leave 60/70 deferred. Cross-domain treatment over cuts that lack ledger
   backing would compose unverified claims.

The build order chosen so far is defensible — publication substrate before
comprehension — but it has reached the point where more distribution
infrastructure adds nothing until there is something with warranted meaning to
distribute.
