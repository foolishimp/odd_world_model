"""Deployment configuration for the local physical-cut adapter."""

from __future__ import annotations

import os
from dataclasses import dataclass
from pathlib import Path
from urllib.parse import urlparse


@dataclass(frozen=True)
class StorageConfig:
    catalog_name: str
    catalog_uri: str
    warehouse_uri: str
    receipt_root: Path
    storage_profile_ref: str = "local-pyiceberg-v1"
    duckdb_allow_extension_install: bool = False

    def __post_init__(self) -> None:
        if not self.catalog_name or not self.storage_profile_ref:
            raise ValueError("catalog name and storage profile ref must be non-empty")
        if urlparse(self.catalog_uri).scheme != "sqlite":
            raise ValueError("the v1 local adapter requires a sqlite catalog URI")
        if urlparse(self.warehouse_uri).scheme != "file":
            raise ValueError("the v1 local adapter requires a file warehouse URI")
        if not self.receipt_root.is_absolute():
            raise ValueError("receipt root must be absolute")

    @classmethod
    def from_env(cls) -> "StorageConfig":
        required = {
            "catalog_name": os.environ.get("OWM_ICEBERG_CATALOG_NAME"),
            "catalog_uri": os.environ.get("OWM_ICEBERG_CATALOG_URI"),
            "warehouse_uri": os.environ.get("OWM_ICEBERG_WAREHOUSE_URI"),
            "receipt_root": os.environ.get("OWM_STORAGE_RECEIPT_ROOT"),
        }
        missing = [name for name, value in required.items() if not value]
        if missing:
            raise ValueError(f"missing storage configuration: {', '.join(sorted(missing))}")
        return cls(
            catalog_name=str(required["catalog_name"]),
            catalog_uri=str(required["catalog_uri"]),
            warehouse_uri=str(required["warehouse_uri"]),
            receipt_root=Path(str(required["receipt_root"])).resolve(),
            storage_profile_ref=os.environ.get(
                "OWM_STORAGE_PROFILE_REF", "local-pyiceberg-v1"
            ),
            duckdb_allow_extension_install=os.environ.get(
                "OWM_DUCKDB_ALLOW_EXTENSION_INSTALL", "0"
            ) == "1",
        )

    @classmethod
    def local(cls, root: Path) -> "StorageConfig":
        resolved = root.resolve()
        return cls(
            catalog_name="odd_world_model_local",
            catalog_uri=f"sqlite:///{resolved / 'catalog.db'}",
            warehouse_uri=f"file://{resolved / 'warehouse'}",
            receipt_root=resolved / "receipts",
        )

    def as_env(self) -> dict[str, str]:
        return {
            "OWM_ICEBERG_CATALOG_NAME": self.catalog_name,
            "OWM_ICEBERG_CATALOG_URI": self.catalog_uri,
            "OWM_ICEBERG_WAREHOUSE_URI": self.warehouse_uri,
            "OWM_STORAGE_RECEIPT_ROOT": str(self.receipt_root),
            "OWM_STORAGE_PROFILE_REF": self.storage_profile_ref,
            "OWM_DUCKDB_ALLOW_EXTENSION_INSTALL": (
                "1" if self.duckdb_allow_extension_install else "0"
            ),
        }
