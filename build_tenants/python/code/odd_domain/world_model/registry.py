# Implements: REQ-ODD-DOMAIN-BUILD-CAP-003
# Implements: REQ-ODD-DOMAIN-WORLD-OBJECT-007
# Implements: REQ-ODD-DOMAIN-WORLD-OBJECT-008
"""Schema registry for the common world-model carrier."""

from __future__ import annotations

from pathlib import Path


SCHEMA_FILE_NAMES = {
    "odd_domain.world_fragment": "fragment.schema.json",
    "odd_domain.world_model_object": "world_model_object.schema.json",
    "odd_domain.markov_object": "markov_object.schema.json",
    "odd_domain.trace_record": "trace_record.schema.json",
    "odd_domain.assurance_record": "assurance_record.schema.json",
    "odd_domain.attribute_ledger_entry": "attribute_ledger_entry.schema.json",
    "odd_domain.treatment_surface": "treatment_surface.schema.json",
    "odd_domain.covariance_edge": "covariance_edge.schema.json",
    "odd_domain.adjoint_mapping": "adjoint_mapping.schema.json",
    "odd_domain.temporal_reference_artifact": "temporal_reference_artifact.schema.json",
    "odd_domain.projection_spec": "projection_spec.schema.json",
    "odd_domain.evidence_manifest": "evidence_manifest.schema.json",
}


def project_root() -> Path:
    return Path(__file__).resolve().parents[5]


def schemas_root() -> Path:
    return project_root() / "build_tenants" / "common" / "schemas"


def examples_root() -> Path:
    return project_root() / "build_tenants" / "common" / "examples"
