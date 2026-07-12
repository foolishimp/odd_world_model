# Common Schemas

This directory contains two classified schema groups.

## Current Boundary Schemas

These schemas govern current cross-module or cross-tenant contracts:

- `semantic_cut_attestation.schema.json`
- `source_observation.schema.json`
- `semantic_proposal.schema.json`
- `deterministic_check_report.schema.json`
- `abg_admission_witness.schema.json`
- `wm_acceptance_decision.schema.json`
- `accepted_semantic_cut.schema.json`
- `published_semantic_cut.schema.json`
- `semantic_publication_candidate.schema.json`
- `candidate_markov_object_cut.schema.json`
- `fpml_trade_observation.schema.json`
- `graph_function_contracts.schema.json`
- `graph_function_outcomes.schema.json`
- `exact_ref.schema.json`
- `semantic_link.schema.json`
- `semantic_link_proposal.schema.json`
- `bounded_mesh_cut.schema.json`
- `composed_world_model.schema.json`
- `context_basis.schema.json`
- `context_projection.schema.json`
- `context_invocation_record.schema.json`
- `physical_cut_write_request.schema.json`
- `physical_cut_write_result.schema.json`
- `physical_effect_observation.schema.json`
- `physical_cut_verify_request.schema.json`
- `physical_cut_verify_result.schema.json`
- `query_projection.schema.json`
- `physical_cut_protocol_error.schema.json`
- `typed_gap.schema.json`

They are serialization contracts beneath the accepted common architecture.
They do not outrank `specification/`, decide semantic acceptance, or create a
runtime authority.

## Retained Representation Schemas

The remaining schemas come from the first common world-model representation
tenant. They define retained carriers for fragments, world-model and Markov
objects, treatments, covariance, adjoints, temporal references, attribute
ledger entries, evidence, assurance, trace, and projection.

They remain useful for fixtures, compatibility, ingress validation, and
human-readable projections. They are not the forward physical publication
authority. Current implementation must apply the candidate/established,
published-cut, mesh, context, and attestation law from common architecture
even when consuming these older shapes.
