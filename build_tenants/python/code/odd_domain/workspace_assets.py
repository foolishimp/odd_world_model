# Implements: REQ-ODD-DOMAIN-ODD-CARRIER-001
# Implements: REQ-ODD-DOMAIN-ODD-CARRIER-004
# Implements: REQ-ODD-DOMAIN-ODD-CARRIER-006
"""Active odd_domain asset inventory and bindings for the first ODD carrier slice."""

from __future__ import annotations

from dataclasses import dataclass
import hashlib
from pathlib import Path

from .domain_model import (
    Asset,
    AssetCheckpoint,
    AssetCollection,
    AssetNodeBinding,
    AssetProvenance,
    relative_file_uri,
)


ASSET_PATHS: tuple[tuple[str, str, str], ...] = (
    ("intent_surface", "intent_surface", "specification/INTENT.md"),
    ("product_surface", "product_surface", "specification/PRODUCT.md"),
    ("odd_method_carrier_requirements_surface", "published_domain_artifact_surface", "specification/requirements/50-odd-method-gtl-carrier.md"),
    ("attribute_ledger_build_line_surface", "published_domain_artifact_surface", "build_tenants/common/design/ATTRIBUTE_LEDGER_BUILD_LINE.md"),
    ("odd_gtl_attribute_ledger_carrier_surface", "published_domain_artifact_surface", "build_tenants/common/design/ODD_GTL_ATTRIBUTE_LEDGER_CARRIER.md"),
    ("source_observation_surface", "source_observation_surface", "build_tenants/common/examples/fpml_trade_representation_standard/review/parsed_trade_observation.json"),
    ("trace_surface", "trace_surface", "build_tenants/common/examples/sandbox_trade_to_apra_mvp/review/traces"),
    ("assurance_surface", "assurance_surface", "build_tenants/common/examples/sandbox_trade_to_apra_mvp/review/assurance"),
    ("attribute_ledger_surface", "attribute_ledger_surface", "build_tenants/common/examples/sandbox_trade_to_apra_mvp/published/trade_representation_domain/attribute_ledger"),
    ("markov_object_cut_surface", "markov_object_cut_surface", "build_tenants/common/examples/sandbox_trade_to_apra_mvp/published/trade_representation_domain/objects/trade_contract_state.json"),
    ("published_domain_artifact_surface", "published_domain_artifact_surface", "build_tenants/common/examples/sandbox_trade_to_apra_mvp/published/trade_representation_domain/fragment.json"),
    ("composed_world_model_surface", "composed_world_model_surface", "build_tenants/common/examples/sandbox_trade_to_apra_mvp/published"),
    ("query_projection_surface", "query_projection_surface", "build_tenants/common/examples/sandbox_trade_to_apra_mvp/query/trade_to_apra_query_summary.json"),
    ("mapping_analysis_surface", "mapping_analysis_surface", "build_tenants/common/examples/sandbox_trade_to_apra_mvp/mapping/analysis/trade_to_apra_mapping_analysis.json"),
    ("mapping_record_surface", "mapping_record_surface", "build_tenants/common/examples/sandbox_trade_to_apra_mvp/mapping/records/trade_to_apra_mapping_record.json"),
    ("mapping_report_surface", "mapping_report_surface", "build_tenants/common/examples/sandbox_trade_to_apra_mvp/mapping/reports/trade_to_apra_mapping_report.md"),
)

INPUT_SET_ASSET_IDS: tuple[str, ...] = (
    "intent_surface",
    "product_surface",
    "odd_method_carrier_requirements_surface",
    "attribute_ledger_build_line_surface",
    "odd_gtl_attribute_ledger_carrier_surface",
    "source_observation_surface",
)

NODE_BINDINGS: tuple[tuple[str, tuple[str, ...]], ...] = (
    ("source_observation_surface", ("source_observation_surface",)),
    ("trace_surface", ("trace_surface",)),
    ("assurance_surface", ("assurance_surface",)),
    ("attribute_ledger_surface", ("attribute_ledger_surface",)),
    ("markov_object_cut_surface", ("markov_object_cut_surface",)),
    ("published_domain_artifact_surface", ("published_domain_artifact_surface",)),
    ("composed_world_model_surface", ("composed_world_model_surface",)),
    ("query_projection_surface", ("query_projection_surface",)),
    ("mapping_analysis_surface", ("mapping_analysis_surface",)),
    ("mapping_record_surface", ("mapping_record_surface",)),
    ("mapping_report_surface", ("mapping_report_surface",)),
)


@dataclass(frozen=True)
class GeneratedAssetContract:
    asset_id: str
    materialization_kind: str
    heading_prefix: str | None = None

    def to_dict(self) -> dict[str, object]:
        return {
            "asset_id": self.asset_id,
            "materialization_kind": self.materialization_kind,
            "heading_prefix": self.heading_prefix,
        }


GENERATED_ASSET_CONTRACTS: dict[str, GeneratedAssetContract] = {
    "source_observation_surface": GeneratedAssetContract("source_observation_surface", "file"),
    "trace_surface": GeneratedAssetContract("trace_surface", "directory"),
    "assurance_surface": GeneratedAssetContract("assurance_surface", "directory"),
    "attribute_ledger_surface": GeneratedAssetContract("attribute_ledger_surface", "directory"),
    "markov_object_cut_surface": GeneratedAssetContract("markov_object_cut_surface", "file"),
    "published_domain_artifact_surface": GeneratedAssetContract("published_domain_artifact_surface", "file"),
    "composed_world_model_surface": GeneratedAssetContract("composed_world_model_surface", "directory"),
    "query_projection_surface": GeneratedAssetContract("query_projection_surface", "file"),
    "mapping_analysis_surface": GeneratedAssetContract("mapping_analysis_surface", "file"),
    "mapping_record_surface": GeneratedAssetContract("mapping_record_surface", "file"),
    "mapping_report_surface": GeneratedAssetContract("mapping_report_surface", "file"),
}


def asset_path(workspace_root: Path, asset_id: str) -> Path:
    for declared_asset_id, _, relative_path in ASSET_PATHS:
        if declared_asset_id == asset_id:
            return workspace_root / relative_path
    raise KeyError(f"Unknown odd_domain asset id: {asset_id}")


def generated_asset_contract(asset_id: str) -> GeneratedAssetContract:
    return GENERATED_ASSET_CONTRACTS[asset_id]


def assess_generated_asset_contract(workspace_root: Path, asset_id: str) -> dict[str, object]:
    path = asset_path(workspace_root, asset_id)
    contract = generated_asset_contract(asset_id)
    exists = path.exists()
    actual_kind = "directory" if path.is_dir() else "file" if path.is_file() else "missing"
    contract_satisfied = exists and actual_kind == contract.materialization_kind
    return {
        "asset_id": asset_id,
        "path": str(path),
        "exists": exists,
        "actual_kind": actual_kind,
        "expected_kind": contract.materialization_kind,
        "contract_satisfied": contract_satisfied,
    }


def _digest_path(path: Path) -> tuple[str | None, int | None]:
    if not path.exists():
        return None, None
    if path.is_file():
        payload = path.read_bytes()
        return hashlib.sha256(payload).hexdigest(), len(payload)
    if path.is_dir():
        hasher = hashlib.sha256()
        count = 0
        for child in sorted(p for p in path.rglob("*") if p.is_file()):
            relative = child.relative_to(path).as_posix().encode("utf-8")
            payload = child.read_bytes()
            hasher.update(relative)
            hasher.update(b"\0")
            hasher.update(payload)
            count += len(payload)
        return hasher.hexdigest(), count
    return None, None


def _checkpoint(path: Path) -> AssetCheckpoint:
    digest, bytes_count = _digest_path(path)
    return AssetCheckpoint(
        exists=path.exists(),
        path_kind="dir" if path.is_dir() else "file",
        content_digest=digest,
        bytes=bytes_count,
    )


def _asset(asset_id: str, declared_type: str, relative_path: str, *, workspace_root: Path) -> Asset:
    path = workspace_root / relative_path
    return Asset(
        asset_id=asset_id,
        uri=relative_file_uri(path, workspace_root=workspace_root),
        declared_type=declared_type,
        metadata={"relative_path": relative_path},
        provenance=AssetProvenance(
            model="odd_domain",
            source="workspace_scan",
            mutable=True,
            history_basis="current_workspace_projection",
        ),
        checkpoint=_checkpoint(path),
    )


def bootstrap_assets(workspace_root: Path) -> tuple[Asset, ...]:
    return tuple(
        _asset(asset_id, declared_type, relative_path, workspace_root=workspace_root)
        for asset_id, declared_type, relative_path in ASSET_PATHS
    )


def bootstrap_input_collection(workspace_root: Path) -> AssetCollection:
    asset_by_id = {asset.asset_id: asset for asset in bootstrap_assets(workspace_root)}
    return AssetCollection(
        name="odd_domain_input_set",
        assets=tuple(asset_by_id[asset_id] for asset_id in INPUT_SET_ASSET_IDS),
    )


def bootstrap_bindings(workspace_root: Path) -> tuple[AssetNodeBinding, ...]:
    asset_ids = {asset.asset_id for asset in bootstrap_assets(workspace_root)}
    return tuple(
        AssetNodeBinding(
            node=node,
            asset_ids=tuple(asset_id for asset_id in bound_asset_ids if asset_id in asset_ids),
        )
        for node, bound_asset_ids in NODE_BINDINGS
    )
