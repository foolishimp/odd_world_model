# Implements: REQ-ODD-WORLD-MODEL-BUILD-CAP-003
# Implements: REQ-ODD-WORLD-MODEL-WORLD-OBJECT-007
# Implements: REQ-ODD-WORLD-MODEL-WORLD-OBJECT-008
"""Schema registry for the common world-model carrier."""

from __future__ import annotations

from pathlib import Path


SCHEMA_FILE_NAMES = {
    "odd_world_model.world_fragment": "fragment.schema.json",
    "odd_world_model.world_model_object": "world_model_object.schema.json",
    "odd_world_model.markov_object": "markov_object.schema.json",
    "odd_world_model.trace_record": "trace_record.schema.json",
    "odd_world_model.assurance_record": "assurance_record.schema.json",
    "odd_world_model.attribute_ledger_entry": "attribute_ledger_entry.schema.json",
    "odd_world_model.treatment_surface": "treatment_surface.schema.json",
    "odd_world_model.covariance_edge": "covariance_edge.schema.json",
    "odd_world_model.adjoint_mapping": "adjoint_mapping.schema.json",
    "odd_world_model.temporal_reference_artifact": "temporal_reference_artifact.schema.json",
    "odd_world_model.projection_spec": "projection_spec.schema.json",
    "odd_world_model.evidence_manifest": "evidence_manifest.schema.json",
}


def project_root() -> Path:
    return Path(__file__).resolve().parents[5]


def schemas_root() -> Path:
    return project_root() / "build_tenants" / "common" / "schemas"


def examples_root() -> Path:
    return project_root() / "build_tenants" / "common" / "examples"
