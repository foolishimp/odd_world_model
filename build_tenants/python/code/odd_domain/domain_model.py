# Implements: REQ-ODD-DOMAIN-ODD-CARRIER-001
# Implements: REQ-ODD-DOMAIN-ODD-CARRIER-003
# Implements: REQ-ODD-DOMAIN-WORLD-OBJECT-001
# Implements: REQ-ODD-DOMAIN-WORLD-OBJECT-002
"""Domain model for odd_domain ODD carrier assets, functions, and descriptors."""

from __future__ import annotations

from dataclasses import asdict, dataclass, field
from pathlib import Path


@dataclass(frozen=True)
class AssetSemanticFacet:
    name: str
    description: str

    def to_dict(self) -> dict:
        return asdict(self)


@dataclass(frozen=True)
class AssetTypeProfile:
    name: str
    description: str
    semantic_facets: tuple[str, ...]
    fd_evaluator: str
    fp_descriptive_framing: str
    mutable_default: bool = True
    proof_hints: tuple[str, ...] = ()

    def to_dict(self) -> dict:
        return {
            "name": self.name,
            "description": self.description,
            "semantic_facets": list(self.semantic_facets),
            "fd_evaluator": self.fd_evaluator,
            "fp_descriptive_framing": self.fp_descriptive_framing,
            "mutable_default": self.mutable_default,
            "proof_hints": list(self.proof_hints),
        }


@dataclass(frozen=True)
class AssetCheckpoint:
    exists: bool
    path_kind: str
    content_digest: str | None
    bytes: int | None

    def to_dict(self) -> dict:
        return asdict(self)


@dataclass(frozen=True)
class AssetProvenance:
    model: str
    source: str
    mutable: bool
    history_basis: str

    def to_dict(self) -> dict:
        return asdict(self)


@dataclass(frozen=True)
class Asset:
    asset_id: str
    uri: str
    declared_type: str
    kind: str = "asset"
    metadata: dict[str, str] = field(default_factory=dict)
    provenance: AssetProvenance | None = None
    checkpoint: AssetCheckpoint | None = None

    def to_dict(self) -> dict:
        return {
            "asset_id": self.asset_id,
            "uri": self.uri,
            "declared_type": self.declared_type,
            "kind": self.kind,
            "metadata": dict(self.metadata),
            "provenance": None if self.provenance is None else self.provenance.to_dict(),
            "checkpoint": None if self.checkpoint is None else self.checkpoint.to_dict(),
        }


@dataclass(frozen=True)
class AssetCollection:
    name: str
    assets: tuple[Asset, ...]

    def to_dict(self) -> dict:
        return {
            "name": self.name,
            "assets": [asset.to_dict() for asset in self.assets],
        }


@dataclass(frozen=True)
class AssetFamilyDescriptor:
    name: str
    description: str
    lifecycle_role: str
    representative_asset_types: tuple[str, ...]
    realization_status: str

    def to_dict(self) -> dict:
        return {
            "name": self.name,
            "description": self.description,
            "lifecycle_role": self.lifecycle_role,
            "representative_asset_types": list(self.representative_asset_types),
            "realization_status": self.realization_status,
        }


@dataclass(frozen=True)
class AssetNodeBinding:
    node: str
    asset_ids: tuple[str, ...]

    def to_dict(self) -> dict:
        return {
            "node": self.node,
            "asset_ids": list(self.asset_ids),
        }


@dataclass(frozen=True)
class FunctionCatalogEntry:
    name: str
    intent: str
    inputs: tuple[str, ...]
    outputs: tuple[str, ...]
    backing_graph_function: str

    def to_dict(self) -> dict:
        return {
            "name": self.name,
            "intent": self.intent,
            "inputs": list(self.inputs),
            "outputs": list(self.outputs),
            "backing_graph_function": self.backing_graph_function,
        }


@dataclass(frozen=True)
class ExecutiveProgramEntry:
    name: str
    intent: str
    steps: tuple[str, ...]
    outputs: tuple[str, ...]
    kind: str = "executive_program"

    def to_dict(self) -> dict:
        return {
            "name": self.name,
            "intent": self.intent,
            "steps": list(self.steps),
            "outputs": list(self.outputs),
            "kind": self.kind,
        }


def relative_file_uri(path: Path, *, workspace_root: Path) -> str:
    relative = path.resolve().relative_to(workspace_root.resolve())
    return f"file://{relative.as_posix()}"
