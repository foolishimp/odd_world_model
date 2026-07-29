# T-031 Build Versioned Installed-Product Example Sandboxes

- id: T-031
- title: Build versioned installed-product example sandboxes
- type: feature
- ticket_category: proof_infrastructure
- status: completed
- governance_method: STDO
- method_stack: SPEC_METHOD, TICKET_METHOD, DESIGN_MODULE_METHOD, ODD_METHOD, WORLD_MODEL_METHOD, RELEASE_METHOD
- goal: proving-wave-07-reference-evidence
- change_intent: preserve the retained example sandbox approach as an exact versioned builder-project proof surface so the same source corpus can be rebuilt and compared across deployed odd_world_model products
- change_class: design_reframe
- re_entry_point: build_tenants/common/design/adrs/
- triaged_at: 2026-07-12
- priority: high
- dependencies: T-027 (completed), T-028 (completed), T-029 (completed), T-030 (completed)
- affected_boundary: retained example corpora, deployed-product binding, builder-project instance cuts, comparison evidence, and installed-product proof protocol
- target_truth: each example sandbox is an immutable world-model instance cut bound to one exact source inventory and one exact deployed odd_world_model identity, with real semantic/runtime evidence and comparable projections
- superseded_truth: source-workspace-linked TypeScript sandboxes, mutable run roots, version labels without product digests, and locally fabricated pass events
- execution_scope: predecessor-evidence and installed-protocol proof only; T-026 native ABG 5.0 carrier closure remains paused
- execution_state: versioned_installed_product_sandbox_line_complete
- review_status: self_reviewed_under_F_H_direction
- proof_status: four_intact_development_instance_cuts_plus_isolation_and_immutability_test
- closure_law: all four retained example corpora build through an exact installed development or released product; each output has a prime instance manifest, exact source and dependency locks, admitted runtime evidence, semantic/mesh/context/query projections, fail-closed overwrite behavior, and tests proving source-workspace isolation
- non_closure_conditions: direct import from the mutable source project by the installed worker, ambient latest dependency resolution, overwrite of an existing instance cut, synthetic pass events, copied historical runtime authority, or release claims from a development cut
- proof_surface: deployment-pack digest, install manifest, source inventory, subprocess protocol result, ABG event archive, semantic artifacts, physical attestation, mesh/context/query outputs, comparison manifest, strict typecheck, and negative tests
- created_at: 2026-07-12
- updated_at: 2026-07-12 (implementation, all-domain proof, inspection, and self-review complete)
- closed_at: 2026-07-12
- terminal_disposition: versioned_example_sandbox_protocol_and_first_development_cut_accepted

## Intake Triage

The product and requirement surfaces already require an installable builder
product, retained examples as proof corpora, exact dependency evidence, and
installed-product proof. The request does not change product intent or
requirements. It changes the realization and proof structure, so the smallest
lawful re-entry is design.

The proving-wave realization pause remains in force for native GraphFunction
payload execution. This ticket may package and exercise the completed reference
kernel as explicitly labelled development evidence. It may not use the sandbox
runner to replace ABG traversal or close T-026.

## Required Outcome

- preserve `examples/<domain>/sources/` as shared source authority;
- preserve side-by-side instance cuts under `examples/<domain>/sandbox/`;
- bind every new cut to one exact WM deployment and dependency lock;
- build through an installed subprocess boundary rather than mutable source
  imports;
- run `trade_source_model`, `trade_representation_model`,
  `banking_product_model`, and `apra_liquidity_model`;
- publish exact source observation, candidate Markov-object, semantic cut,
  physical attestation, bounded mesh, context, query, runtime, and proof
  evidence where the reference product supports it;
- retain old Python and `.TS` cuts as historical comparison evidence; and
- make unsupported native-carrier, calibrated F_P, mapping, and release claims
  explicit gaps.

## Completion

Closed for the bounded development-reference scope.

ADR-WM-006 defines the sandbox as an immutable world-model instance cut bound
to one exact source inventory and one exact installed-product deployment. The
source-side orchestrator invokes a self-contained installed worker through the
v1 JSON subprocess protocol. The deployed Node product, storage wheel,
installed Node tree, and installed storage package are all content-bound. The
Python effect runs from a clean wheel-installed environment rather than an
editable source workspace.

The first retained cut is:

`20260712T142827Z_0.0.0-development.f94aa30.dirty.cc665fcae1.TS`

It exists beside the retained historical cuts for all four example domains.
Each instance contains 33 byte-manifested artifacts, 708 gzip-preserved ABG
runtime events, exact source and product bindings, physical snapshot state,
candidate Markov objects, a bounded mesh cut, context basis/projection,
attributed reference invocation, query projection, proof observations, and a
historical comparison projection. Candidate counts are one FpML trade, one
trade representation, five banking catalog/product objects, and one APRA
liquidity position.

Independent inspection reports `integrity_state=intact` and
`source_state=exact` for every cut. The installed-product test also proves that
the installed entrypoint resolves under the deployment rather than the mutable
source project, package dependencies contain no local file links, raw events
are ABG events rather than synthetic sandbox passes, existing cuts cannot be
overwritten, and failed duplicate creation leaves the prior prime manifest
unchanged.

Validation at closure:

- strict TypeScript compile: zero errors;
- existing TypeScript suite: 35/35 passing;
- Python storage suite: 22/22 passing;
- installed sandbox suite: 1/1 passing over all four domains;
- `git diff --check`: clean; and
- all four persisted instance inspections: intact with exact live source.

Every instance retains the typed gaps
`native_graph_payload_execution_not_realized`,
`calibrated_fp_authorship_not_proven`, and
`semantic_state_projection_not_replay_native`. Development evidence claims no
release authority. T-026 remains paused pending stable ABIogenesis 5.0 and the
exact GLC capability audit.
