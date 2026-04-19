# Implements: REQ-ODD-WORLD-MODEL-ODD-CARRIER-001
"""Asset semantics for the first live odd_world_model ODD carrier slice."""

from __future__ import annotations

from .domain_model import AssetFamilyDescriptor, AssetSemanticFacet, AssetTypeProfile


SEMANTIC_FACETS = {
    "traceability": AssetSemanticFacet(
        name="traceability",
        description="Makes the path from accepted semantic claim back to source evidence explicit.",
    ),
    "assurance": AssetSemanticFacet(
        name="assurance",
        description="Carries why a traced observation is accepted into semantic truth.",
    ),
    "ledger_authority": AssetSemanticFacet(
        name="ledger_authority",
        description="Treats the attribute ledger as the immediate semantic source of object cuts.",
    ),
    "immutable_publication": AssetSemanticFacet(
        name="immutable_publication",
        description="Publishes immutable object and artifact cuts with explicit supersession.",
    ),
    "composition": AssetSemanticFacet(
        name="composition",
        description="Builds higher-order world models by reference-preserving composition.",
    ),
    "query_projection": AssetSemanticFacet(
        name="query_projection",
        description="Exposes current views as projection over constructive history rather than as replacement runtime truth.",
    ),
    "mapping_correspondence": AssetSemanticFacet(
        name="mapping_correspondence",
        description="Captures governed cross-domain correspondence over published semantic truth.",
    ),
}


ASSET_TYPES = {
    "source_observation_surface": AssetTypeProfile(
        name="source_observation_surface",
        description="Reviewable source-derived observation input for the current steel thread.",
        semantic_facets=("traceability",),
        fd_evaluator="odd_world_model_fd_source_observation",
        fp_descriptive_framing="Current source-facing observation surface for the retained world-model build line.",
        mutable_default=True,
        proof_hints=("source_observation_present",),
    ),
    "trace_surface": AssetTypeProfile(
        name="trace_surface",
        description="Concrete trace records linking candidate claims to source locators.",
        semantic_facets=("traceability",),
        fd_evaluator="odd_world_model_fd_trace_surface",
        fp_descriptive_framing="Trace evidence that points accepted claims back to concrete source locators.",
        mutable_default=True,
        proof_hints=("trace_surface_present",),
    ),
    "assurance_surface": AssetTypeProfile(
        name="assurance_surface",
        description="Assurance records stating why traced claims are accepted as semantic truth.",
        semantic_facets=("assurance",),
        fd_evaluator="odd_world_model_fd_assurance_surface",
        fp_descriptive_framing="Assurance surface carrying claim kind, authority basis, and explicit ambiguity.",
        mutable_default=True,
        proof_hints=("assurance_surface_present",),
    ),
    "attribute_ledger_surface": AssetTypeProfile(
        name="attribute_ledger_surface",
        description="Append-only qualified claim ledger over stable object identity.",
        semantic_facets=("ledger_authority", "traceability", "assurance"),
        fd_evaluator="odd_world_model_fd_attribute_ledger_surface",
        fp_descriptive_framing="Immediate semantic source for immutable Markov object cuts.",
        mutable_default=True,
        proof_hints=("attribute_ledger_surface_present",),
    ),
    "markov_object_cut_surface": AssetTypeProfile(
        name="markov_object_cut_surface",
        description="Immutable Markov object cut projected from the attribute ledger.",
        semantic_facets=("immutable_publication", "ledger_authority"),
        fd_evaluator="odd_world_model_fd_markov_object_cut_surface",
        fp_descriptive_framing="Published object-cut surface carrying bounded state, identity, and ledger refs.",
        mutable_default=False,
        proof_hints=("markov_object_cut_surface_present",),
    ),
    "published_domain_artifact_surface": AssetTypeProfile(
        name="published_domain_artifact_surface",
        description="Durable published domain artifact packaging fragments, cuts, and references.",
        semantic_facets=("immutable_publication", "composition"),
        fd_evaluator="odd_world_model_fd_published_domain_artifact_surface",
        fp_descriptive_framing="Durable semantic publication unit for later reference and composition.",
        mutable_default=False,
        proof_hints=("published_domain_artifact_surface_present",),
    ),
    "composed_world_model_surface": AssetTypeProfile(
        name="composed_world_model_surface",
        description="Higher-order world model built by stitching published domain artifacts.",
        semantic_facets=("composition", "immutable_publication"),
        fd_evaluator="odd_world_model_fd_composed_world_model_surface",
        fp_descriptive_framing="Reference-preserving composed world-model surface.",
        mutable_default=False,
        proof_hints=("composed_world_model_surface_present",),
    ),
    "query_projection_surface": AssetTypeProfile(
        name="query_projection_surface",
        description="Current query/report surface projected from published artifacts and constructive history.",
        semantic_facets=("query_projection", "traceability"),
        fd_evaluator="odd_world_model_fd_query_projection_surface",
        fp_descriptive_framing="Filesystem-first query/report projection over retained odd_world_model assets.",
        mutable_default=True,
        proof_hints=("query_projection_surface_present",),
    ),
    "mapping_analysis_surface": AssetTypeProfile(
        name="mapping_analysis_surface",
        description="Constructive analysis surface over retained published-domain correspondence.",
        semantic_facets=("mapping_correspondence", "traceability", "composition"),
        fd_evaluator="odd_world_model_fd_mapping_analysis_surface",
        fp_descriptive_framing="Reviewable mapping-analysis surface over published source and target domains.",
        mutable_default=True,
        proof_hints=("mapping_analysis_surface_present",),
    ),
    "mapping_record_surface": AssetTypeProfile(
        name="mapping_record_surface",
        description="Durable machine-usable mapping record over published world-model domains.",
        semantic_facets=("mapping_correspondence", "immutable_publication", "composition"),
        fd_evaluator="odd_world_model_fd_mapping_record_surface",
        fp_descriptive_framing="Durable mapping record that remains downstream of published semantic truth.",
        mutable_default=False,
        proof_hints=("mapping_record_surface_present",),
    ),
    "mapping_report_surface": AssetTypeProfile(
        name="mapping_report_surface",
        description="Human-facing mapping report projected from the governed mapping record.",
        semantic_facets=("mapping_correspondence", "query_projection"),
        fd_evaluator="odd_world_model_fd_mapping_report_surface",
        fp_descriptive_framing="Projected mapping report over the durable mapping record and retained analysis surface.",
        mutable_default=True,
        proof_hints=("mapping_report_surface_present",),
    ),
}


ASSET_FAMILIES = (
    AssetFamilyDescriptor(
        name="evidence_intake_assets",
        description="Assets that capture source-facing observation and traced evidence.",
        lifecycle_role="input_and_trace",
        representative_asset_types=("source_observation_surface", "trace_surface"),
        realization_status="live",
    ),
    AssetFamilyDescriptor(
        name="semantic_construction_assets",
        description="Assets that convert traced evidence into assured claims, ledger entries, and object cuts.",
        lifecycle_role="semantic_construction",
        representative_asset_types=("assurance_surface", "attribute_ledger_surface", "markov_object_cut_surface"),
        realization_status="live",
    ),
    AssetFamilyDescriptor(
        name="publication_assets",
        description="Durable published semantic outputs for local truth.",
        lifecycle_role="publication",
        representative_asset_types=("published_domain_artifact_surface",),
        realization_status="live",
    ),
    AssetFamilyDescriptor(
        name="composition_assets",
        description="Assets that stitch published semantic outputs into higher-order world models.",
        lifecycle_role="composition",
        representative_asset_types=("composed_world_model_surface",),
        realization_status="live",
    ),
    AssetFamilyDescriptor(
        name="query_assets",
        description="Current visible projections over retained constructive and publication history.",
        lifecycle_role="query_projection",
        representative_asset_types=("query_projection_surface",),
        realization_status="live",
    ),
    AssetFamilyDescriptor(
        name="mapping_assets",
        description="Assets that analyze and publish governed cross-domain correspondence over published semantic truth.",
        lifecycle_role="mapping",
        representative_asset_types=("mapping_analysis_surface", "mapping_record_surface", "mapping_report_surface"),
        realization_status="live",
    ),
)
