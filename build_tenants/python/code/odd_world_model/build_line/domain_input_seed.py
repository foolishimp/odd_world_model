"""Generic single-domain build line over retained domain_input source corpora."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timezone
import json
from pathlib import Path
import re
import shutil
from typing import Any

from odd_world_model.sandbox_config import load_sandbox_config


PUBLISHED_AT = "2026-04-20T00:00:00Z"
META_KEYS = {"source_id", "published_by", "bounded_context", "summary", "evidence_refs"}


def _read_json(path: Path, *, label: str) -> dict[str, Any]:
    raw = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(raw, dict):
        raise ValueError(f"{label} must contain a JSON object")
    return raw


def _slug(value: str) -> str:
    normalized = re.sub(r"[^a-zA-Z0-9]+", "_", value).strip("_").lower()
    return normalized or "value"


def _camel(value: str) -> str:
    parts = [part for part in re.split(r"[^a-zA-Z0-9]+", value) if part]
    return "".join(part[:1].upper() + part[1:] for part in parts) or "DomainObject"


def _claim_kind(key: str) -> str:
    if key.endswith("_id"):
        return "identity"
    if key.endswith("_state"):
        return "state"
    return "attribute"


def _now() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")


def _relative_to_workspace(workspace_root: Path, path: Path) -> str:
    return path.resolve().relative_to(workspace_root.resolve()).as_posix()


@dataclass(frozen=True)
class SeedObject:
    key: str
    file_name: str
    object_kind: str
    object_id: str
    identity_alias: str
    payload: dict[str, Any]
    locator_prefix: str
    parent_object_ref: str | None = None


@dataclass(frozen=True)
class DomainSeedConfig:
    workspace_root: Path
    example_name: str
    artifact_slug: str
    source_manifest_path: Path
    source_manifest_relative: str
    source_manifest: dict[str, Any]
    bounded_context: str
    published_by: str
    summary: str
    primary_section_key: str
    primary_section_payload: dict[str, Any]
    root_object: SeedObject
    child_objects: tuple[SeedObject, ...]

    @property
    def all_objects(self) -> tuple[SeedObject, ...]:
        return (self.root_object, *self.child_objects)

    @property
    def review_root(self) -> Path:
        return self.workspace_root / "review"

    @property
    def source_observation_path(self) -> Path:
        return self.review_root / "source_observation.json"

    @property
    def traces_root(self) -> Path:
        return self.review_root / "traces"

    @property
    def assurance_root(self) -> Path:
        return self.review_root / "assurance"

    @property
    def published_root(self) -> Path:
        return self.workspace_root / "published" / self.artifact_slug

    @property
    def attribute_ledger_root(self) -> Path:
        return self.published_root / "attribute_ledger"

    @property
    def objects_root(self) -> Path:
        return self.published_root / "objects"

    @property
    def projections_root(self) -> Path:
        return self.published_root / "projections"

    @property
    def evidence_root(self) -> Path:
        return self.published_root / "evidence" / "manifests"

    @property
    def fragment_path(self) -> Path:
        return self.published_root / "fragment.json"

    @property
    def world_model_root(self) -> Path:
        return self.workspace_root / "published" / "world_model"

    @property
    def world_model_summary_path(self) -> Path:
        return self.world_model_root / "composed_world_model.json"

    @property
    def query_root(self) -> Path:
        return self.workspace_root / "query"

    @property
    def query_summary_path(self) -> Path:
        return self.query_root / "world_model_query_summary.json"

    @property
    def mapping_analysis_path(self) -> Path:
        return self.workspace_root / "mapping" / "analysis" / "domain_mapping_analysis.json"

    @property
    def mapping_record_path(self) -> Path:
        return self.workspace_root / "mapping" / "records" / "domain_mapping_record.json"

    @property
    def mapping_report_path(self) -> Path:
        return self.workspace_root / "mapping" / "reports" / "domain_mapping_report.md"

    @property
    def fragment_id(self) -> str:
        return f"odd_world_model.fragment.{_slug(self.bounded_context)}.v1"


def _first_scalar_identifier(record: dict[str, Any]) -> tuple[str, str]:
    for key, value in record.items():
        if key.endswith("_id") and isinstance(value, str) and value:
            return key, value
    return "synthetic_id", "seed_001"


def _build_root_object(config: DomainSeedConfig | None, section_key: str, payload: dict[str, Any], bounded_context: str) -> SeedObject:
    _, identifier = _first_scalar_identifier(payload)
    object_kind = _camel(section_key)
    object_key = _slug(identifier)
    return SeedObject(
        key=object_key,
        file_name=f"{object_key}.json",
        object_kind=object_kind,
        object_id=f"odd_world_model.markov_object.{_slug(bounded_context)}.{_slug(object_kind)}.{object_key}",
        identity_alias=f"{section_key}:{identifier}",
        payload=payload,
        locator_prefix=section_key,
    )


def _build_child_objects(root_object: SeedObject, payload: dict[str, Any], bounded_context: str) -> tuple[SeedObject, ...]:
    child_objects: list[SeedObject] = []
    for key, value in payload.items():
        if not isinstance(value, list):
            continue
        for index, entry in enumerate(value):
            if not isinstance(entry, dict):
                continue
            _, identifier = _first_scalar_identifier(entry)
            object_kind = entry.get("product_kind") if isinstance(entry.get("product_kind"), str) else _camel(key.rstrip("s"))
            object_key = _slug(identifier)
            child_objects.append(
                SeedObject(
                    key=object_key,
                    file_name=f"{object_key}.json",
                    object_kind=_camel(str(object_kind)),
                    object_id=(
                        f"odd_world_model.markov_object.{_slug(bounded_context)}."
                        f"{_slug(str(object_kind))}.{object_key}"
                    ),
                    identity_alias=f"{key}[{index}]:{identifier}",
                    payload=entry,
                    locator_prefix=f"{key}[{index}]",
                    parent_object_ref=root_object.object_id,
                )
            )
    return tuple(child_objects)


def load_domain_seed_config(workspace_root: Path) -> DomainSeedConfig:
    config = load_sandbox_config(workspace_root)
    if config is None:
        raise ValueError(f"missing sandbox builder config for {workspace_root}")
    domain = config.get("domain", {})
    if not isinstance(domain, dict):
        raise ValueError("sandbox builder config must contain an object at 'domain'")
    example_name = domain.get("example_name")
    artifact_slug = domain.get("artifact_slug")
    source_manifest_relative = domain.get("source_manifest")
    if not isinstance(example_name, str) or not example_name:
        raise ValueError("sandbox builder domain.example_name must be a non-empty string")
    if not isinstance(artifact_slug, str) or not artifact_slug:
        raise ValueError("sandbox builder domain.artifact_slug must be a non-empty string")
    if not isinstance(source_manifest_relative, str) or not source_manifest_relative:
        raise ValueError("sandbox builder domain.source_manifest must be a non-empty string")

    source_manifest_path = (workspace_root / source_manifest_relative).resolve()
    source_manifest = _read_json(source_manifest_path, label=f"domain source manifest {source_manifest_path}")
    bounded_context = source_manifest.get("bounded_context")
    published_by = source_manifest.get("published_by")
    summary = source_manifest.get("summary")
    if not isinstance(bounded_context, str) or not bounded_context:
        raise ValueError("domain source manifest must provide bounded_context")
    if not isinstance(published_by, str) or not published_by:
        raise ValueError("domain source manifest must provide published_by")
    if not isinstance(summary, str) or not summary:
        raise ValueError("domain source manifest must provide summary")

    payload_keys = [key for key in source_manifest if key not in META_KEYS]
    if not payload_keys:
        raise ValueError("domain source manifest must provide at least one payload section")
    primary_section_key = payload_keys[0]
    primary_section_payload = source_manifest.get(primary_section_key)
    if not isinstance(primary_section_payload, dict):
        raise ValueError(
            f"domain source manifest section {primary_section_key!r} must contain an object"
        )

    root_object = _build_root_object(None, primary_section_key, primary_section_payload, bounded_context)
    child_objects = _build_child_objects(root_object, primary_section_payload, bounded_context)

    return DomainSeedConfig(
        workspace_root=workspace_root,
        example_name=example_name,
        artifact_slug=artifact_slug,
        source_manifest_path=source_manifest_path,
        source_manifest_relative=source_manifest_relative,
        source_manifest=source_manifest,
        bounded_context=bounded_context,
        published_by=published_by,
        summary=summary,
        primary_section_key=primary_section_key,
        primary_section_payload=primary_section_payload,
        root_object=root_object,
        child_objects=child_objects,
    )


def configured_asset_paths(workspace_root: Path) -> tuple[tuple[str, str, str], ...]:
    config = load_domain_seed_config(workspace_root)
    return (
        ("intent_surface", "intent_surface", "specification/INTENT.md"),
        ("product_surface", "product_surface", "specification/PRODUCT.md"),
        (
            "odd_method_carrier_requirements_surface",
            "published_domain_artifact_surface",
            "specification/requirements/50-odd-method-gtl-carrier.md",
        ),
        (
            "attribute_ledger_build_line_surface",
            "published_domain_artifact_surface",
            "@package/assets/design/ATTRIBUTE_LEDGER_BUILD_LINE.md",
        ),
        (
            "odd_gtl_attribute_ledger_carrier_surface",
            "published_domain_artifact_surface",
            "@package/assets/design/ODD_GTL_ATTRIBUTE_LEDGER_CARRIER.md",
        ),
        ("source_observation_surface", "source_observation_surface", _relative_to_workspace(workspace_root, config.source_observation_path)),
        ("trace_surface", "trace_surface", _relative_to_workspace(workspace_root, config.traces_root)),
        ("assurance_surface", "assurance_surface", _relative_to_workspace(workspace_root, config.assurance_root)),
        ("attribute_ledger_surface", "attribute_ledger_surface", _relative_to_workspace(workspace_root, config.attribute_ledger_root)),
        ("markov_object_cut_surface", "markov_object_cut_surface", _relative_to_workspace(workspace_root, config.objects_root / config.root_object.file_name)),
        ("published_domain_artifact_surface", "published_domain_artifact_surface", _relative_to_workspace(workspace_root, config.fragment_path)),
        ("composed_world_model_surface", "composed_world_model_surface", _relative_to_workspace(workspace_root, config.world_model_root)),
        ("query_projection_surface", "query_projection_surface", _relative_to_workspace(workspace_root, config.query_summary_path)),
        ("mapping_analysis_surface", "mapping_analysis_surface", _relative_to_workspace(workspace_root, config.mapping_analysis_path)),
        ("mapping_record_surface", "mapping_record_surface", _relative_to_workspace(workspace_root, config.mapping_record_path)),
        ("mapping_report_surface", "mapping_report_surface", _relative_to_workspace(workspace_root, config.mapping_report_path)),
    )


def _write_json(path: Path, payload: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")


def _reset_output(config: DomainSeedConfig) -> None:
    for root in (config.review_root, config.published_root, config.world_model_root, config.query_root):
        if root.exists():
            shutil.rmtree(root)


def _scalar_claims(payload: dict[str, Any]) -> list[tuple[str, Any]]:
    claims: list[tuple[str, Any]] = []
    for key, value in payload.items():
        if isinstance(value, (str, int, float, bool)):
            claims.append((key, value))
    return claims


def _source_ref(config: DomainSeedConfig) -> str:
    evidence_refs = config.source_manifest.get("evidence_refs", [])
    if isinstance(evidence_refs, list):
        for entry in evidence_refs:
            if isinstance(entry, str) and entry.endswith("domain_input.json"):
                return entry
        for entry in evidence_refs:
            if isinstance(entry, str) and entry:
                return entry
    return f"input://{config.source_manifest_relative}"


def _trace_path(config: DomainSeedConfig, obj: SeedObject, claim_key: str) -> Path:
    return config.traces_root / obj.key / f"{claim_key}.json"


def _assurance_path(config: DomainSeedConfig, obj: SeedObject, claim_key: str) -> Path:
    return config.assurance_root / obj.key / f"{claim_key}.json"


def _ledger_path(config: DomainSeedConfig, obj: SeedObject, claim_key: str) -> Path:
    return config.attribute_ledger_root / obj.key / f"{claim_key}.json"


def _review_ref(kind: str, obj: SeedObject, claim_key: str) -> str:
    return f"review://{kind}/{obj.key}/{claim_key}.json"


def _ledger_ref(obj: SeedObject, claim_key: str) -> str:
    return f"ledger://{obj.key}/{claim_key}.json"


def _trace_payload(config: DomainSeedConfig, obj: SeedObject, claim_key: str, value: Any) -> dict[str, Any]:
    return {
        "schema_kind": "odd_world_model.trace_record",
        "schema_version": "v1",
        "trace_id": f"odd_world_model.trace.{_slug(config.bounded_context)}.{obj.key}.{claim_key}.v1",
        "source_ref": _source_ref(config),
        "source_kind": "domain_input_json",
        "claim_key": claim_key,
        "locator": f"{obj.locator_prefix}.{claim_key}",
        "observed_at": _now(),
        "observed_value": value,
        "summary": f"Observed {claim_key} for {obj.object_kind} from retained domain_input source.",
    }


def _assurance_payload(config: DomainSeedConfig, obj: SeedObject, claim_key: str, value: Any) -> dict[str, Any]:
    return {
        "schema_kind": "odd_world_model.assurance_record",
        "schema_version": "v1",
        "assurance_id": f"odd_world_model.assurance.{_slug(config.bounded_context)}.{obj.key}.{claim_key}.v1",
        "object_ref": obj.object_id,
        "claim_key": claim_key,
        "claim_kind": _claim_kind(claim_key),
        "accepted_value": value,
        "trace_record_refs": [_review_ref("traces", obj, claim_key)],
        "authority_basis": [
            f"source:{config.source_manifest.get('source_id', config.example_name)}",
            f"builder:domain_input_seed.{claim_key}",
        ],
        "accepted_at": PUBLISHED_AT,
    }


def _ledger_payload(config: DomainSeedConfig, obj: SeedObject, claim_key: str, value: Any) -> dict[str, Any]:
    return {
        "schema_kind": "odd_world_model.attribute_ledger_entry",
        "schema_version": "v1",
        "entry_id": f"odd_world_model.attribute_ledger.{_slug(config.bounded_context)}.{obj.key}.{claim_key}.v1",
        "object_ref": obj.object_id,
        "claim_key": claim_key,
        "claim_kind": _claim_kind(claim_key),
        "value": value,
        "trace_record_refs": [_review_ref("traces", obj, claim_key)],
        "assurance_record_refs": [_review_ref("assurance", obj, claim_key)],
        "published_at": PUBLISHED_AT,
    }


def _object_payload(config: DomainSeedConfig, obj: SeedObject) -> dict[str, Any]:
    claims = _scalar_claims(obj.payload)
    child_refs = [child.object_id for child in config.child_objects if child.parent_object_ref == obj.object_id]
    state_value = obj.payload.get("lifecycle_state")
    lifecycle_state = state_value if isinstance(state_value, str) and state_value else "observed"
    return {
        "schema_kind": "odd_world_model.markov_object",
        "schema_version": "v1",
        "object_id": obj.object_id,
        "object_kind": obj.object_kind,
        "bounded_context": config.bounded_context,
        "semantic_role": f"{obj.object_kind} recovered from retained domain_input evidence for {config.example_name}.",
        "identity": {
            "authority_basis": config.source_manifest.get("source_id", config.example_name),
            "aliases": [obj.identity_alias],
        },
        "boundary": {
            "internal_claim": f"{obj.object_kind} claims are bounded to the local {config.bounded_context} publication cut.",
            "external_claim": "Cross-domain mappings, treatments, and external projections remain downstream work.",
            "adjacent_objects": child_refs,
            "adjacent_domains": [],
        },
        "blanket": {
            "ingress_surfaces": [config.source_manifest_path.name],
            "egress_surfaces": [f"{config.artifact_slug}_publication"],
            "observable_surfaces": [config.source_observation_path.name],
            "control_surfaces": ["inspect_source", "publish_domain_artifact"],
            "adjacent_objects": child_refs,
            "adjacent_domains": [],
            "internal_claim": f"{obj.object_kind} is a local semantic object for the configured sandbox source corpus.",
            "external_claim": "Further world-model stitching is not implied by the local single-domain publication cut.",
        },
        "state": {
            "lifecycle_state": lifecycle_state,
            "state_summary": f"{obj.object_kind} published from retained sandbox source evidence.",
            "effective_time": PUBLISHED_AT,
            "observation_time": PUBLISHED_AT,
            "ambiguity_status": "bounded",
        },
        "constraints": {
            "invariants": [f"{obj.key}_identity_present"],
            "policies": [f"{config.example_name}_publication_policy"],
            "valid_transitions": ["review", "republish"],
        },
        "evidence": {
            "refs": list(config.source_manifest.get("evidence_refs", [])) or [_source_ref(config)],
            "summary": config.summary,
        },
        "materialization": {
            "projection_summary": f"Immutable object cut projected from the attribute ledger for {obj.object_kind}.",
            "attribute_ledger_entry_refs": [_ledger_ref(obj, claim_key) for claim_key, _ in claims],
            "assurance_record_refs": [_review_ref("assurance", obj, claim_key) for claim_key, _ in claims],
            "trace_record_refs": [_review_ref("traces", obj, claim_key) for claim_key, _ in claims],
        },
        "cross_domain": {
            "treatment_refs": [],
            "covariance_edge_refs": [],
            "adjoint_mapping_refs": [],
            "loss_notes": [],
        },
        "composition": {
            "fragment_id": config.fragment_id,
            "parent_object_refs": [obj.parent_object_ref] if obj.parent_object_ref else [],
            "child_object_refs": child_refs,
        },
    }


def _projection_payload(config: DomainSeedConfig) -> dict[str, Any]:
    return {
        "schema_kind": "odd_world_model.projection_spec",
        "schema_version": "v1",
        "projection_id": f"odd_world_model.projection.{_slug(config.bounded_context)}.summary.v1",
        "projection_kind": "domain_summary",
        "source_refs": [config.fragment_id],
        "summary": config.summary,
    }


def _evidence_manifest_payload(config: DomainSeedConfig) -> dict[str, Any]:
    return {
        "schema_kind": "odd_world_model.evidence_manifest",
        "schema_version": "v1",
        "manifest_id": f"odd_world_model.evidence.{_slug(config.bounded_context)}.v1",
        "refs": list(config.source_manifest.get("evidence_refs", [])) or [_source_ref(config)],
    }


def _fragment_payload(config: DomainSeedConfig) -> dict[str, Any]:
    attribute_ledger_entries: list[str] = []
    for obj in config.all_objects:
        for claim_key, _ in _scalar_claims(obj.payload):
            attribute_ledger_entries.append(f"attribute_ledger/{obj.key}/{claim_key}.json")
    return {
        "schema_kind": "odd_world_model.world_fragment",
        "schema_version": "v1",
        "fragment_id": config.fragment_id,
        "bounded_context": config.bounded_context,
        "published_at": PUBLISHED_AT,
        "published_by": config.published_by,
        "summary": config.summary,
        "objects": [f"objects/{obj.file_name}" for obj in config.all_objects],
        "attribute_ledger_entries": attribute_ledger_entries,
        "reference_artifacts": [],
        "treatments": [],
        "edges": [],
        "projections": ["projections/domain_summary.json"],
        "evidence_manifests": ["evidence/manifests/domain_source_manifest.json"],
        "links": [config.source_manifest_relative],
    }


def _world_model_payload(config: DomainSeedConfig) -> dict[str, Any]:
    return {
        "world_model_id": f"odd_world_model.world_model.{_slug(config.bounded_context)}.v1",
        "fragments": [config.fragment_id],
        "bounded_contexts": [config.bounded_context],
        "summary": f"Single-domain composed world model for {config.example_name}.",
    }


def _query_payload(config: DomainSeedConfig) -> dict[str, Any]:
    return {
        "query_id": f"odd_world_model.query.{_slug(config.bounded_context)}.v1",
        "lane": "filesystem_first",
        "fragment_ref": config.fragment_id,
        "question": f"What did the configured sandbox publish for {config.bounded_context}?",
        "answer": config.summary,
        "objects": [obj.object_id for obj in config.all_objects],
        "source_manifest": config.source_manifest_relative,
        "world_model_ref": f"published/world_model/{config.world_model_summary_path.name}",
    }


def build_to_stage(workspace_root: Path, *, stage: str, reset: bool = True) -> None:
    config = load_domain_seed_config(workspace_root)
    if reset:
        _reset_output(config)

    _write_json(
        config.source_observation_path,
        {
            "source_id": config.source_manifest.get("source_id", config.example_name),
            "bounded_context": config.bounded_context,
            "summary": config.summary,
            "source_manifest": config.source_manifest_relative,
            "observed_payload": config.primary_section_payload,
            "evidence_refs": list(config.source_manifest.get("evidence_refs", [])),
        },
    )
    if stage == "source_observation_surface":
        return

    for obj in config.all_objects:
        for claim_key, value in _scalar_claims(obj.payload):
            _write_json(_trace_path(config, obj, claim_key), _trace_payload(config, obj, claim_key, value))
    if stage == "trace_surface":
        return

    for obj in config.all_objects:
        for claim_key, value in _scalar_claims(obj.payload):
            _write_json(_assurance_path(config, obj, claim_key), _assurance_payload(config, obj, claim_key, value))
    if stage == "assurance_surface":
        return

    for obj in config.all_objects:
        for claim_key, value in _scalar_claims(obj.payload):
            _write_json(_ledger_path(config, obj, claim_key), _ledger_payload(config, obj, claim_key, value))
    if stage == "attribute_ledger_surface":
        return

    for obj in config.all_objects:
        _write_json(config.objects_root / obj.file_name, _object_payload(config, obj))
    if stage == "markov_object_cut_surface":
        return

    _write_json(config.projections_root / "domain_summary.json", _projection_payload(config))
    _write_json(config.evidence_root / "domain_source_manifest.json", _evidence_manifest_payload(config))
    _write_json(config.fragment_path, _fragment_payload(config))
    if stage == "published_domain_artifact_surface":
        return

    _write_json(config.world_model_summary_path, _world_model_payload(config))
    if stage == "composed_world_model_surface":
        return

    if stage == "query_projection_surface":
        _write_json(config.query_summary_path, _query_payload(config))
        return

    raise ValueError(f"Unsupported stage {stage!r}")


def materialize_source_observation_surface(*, workspace_root: str | Path = ".", reset: bool = True) -> None:
    build_to_stage(Path(workspace_root).resolve(), stage="source_observation_surface", reset=reset)


def materialize_trace_surface(*, workspace_root: str | Path = ".", reset: bool = True) -> None:
    build_to_stage(Path(workspace_root).resolve(), stage="trace_surface", reset=reset)


def materialize_assurance_surface(*, workspace_root: str | Path = ".", reset: bool = True) -> None:
    build_to_stage(Path(workspace_root).resolve(), stage="assurance_surface", reset=reset)


def materialize_attribute_ledger_surface(*, workspace_root: str | Path = ".", reset: bool = True) -> None:
    build_to_stage(Path(workspace_root).resolve(), stage="attribute_ledger_surface", reset=reset)


def materialize_markov_object_cut_surface(*, workspace_root: str | Path = ".", reset: bool = True) -> None:
    build_to_stage(Path(workspace_root).resolve(), stage="markov_object_cut_surface", reset=reset)


def materialize_published_domain_artifact_surface(*, workspace_root: str | Path = ".", reset: bool = True) -> None:
    build_to_stage(Path(workspace_root).resolve(), stage="published_domain_artifact_surface", reset=reset)


def materialize_composed_world_model_surface(*, workspace_root: str | Path = ".", reset: bool = True) -> None:
    build_to_stage(Path(workspace_root).resolve(), stage="composed_world_model_surface", reset=reset)


def materialize_query_projection_surface(*, workspace_root: str | Path = ".", reset: bool = True) -> None:
    build_to_stage(Path(workspace_root).resolve(), stage="query_projection_surface", reset=reset)
