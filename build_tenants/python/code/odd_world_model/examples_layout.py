"""Root-level example and sandbox layout for retained odd_world_model domains."""

from __future__ import annotations

import os
from pathlib import Path

from .world_model.registry import project_root


ACTIVE_SANDBOX_VERSION = "20260419T000000Z_v1"

TRADE_SOURCE_MODEL = "trade_source_model"
TRADE_REPRESENTATION_MODEL = "trade_representation_model"
APRA_LIQUIDITY_MODEL = "apra_liquidity_model"
BANKING_PRODUCT_MODEL = "banking_product_model"


def examples_root() -> Path:
    return project_root() / "examples"


def example_root(example_name: str) -> Path:
    return examples_root() / example_name


def sources_root(example_name: str) -> Path:
    return example_root(example_name) / "sources"


def sources_data_root(example_name: str) -> Path:
    return sources_root(example_name) / "data"


def sources_pdfs_root(example_name: str) -> Path:
    return sources_root(example_name) / "pdfs"


def sources_code_root(example_name: str) -> Path:
    return sources_root(example_name) / "code"


def sources_uri_ledger_root(example_name: str) -> Path:
    return sources_root(example_name) / "uri_ledger"


def sandbox_versions_root(example_name: str) -> Path:
    return example_root(example_name) / "sandbox"


def sandbox_root(example_name: str) -> Path:
    return sandbox_versions_root(example_name) / ACTIVE_SANDBOX_VERSION


def trade_source_example_root() -> Path:
    return example_root(TRADE_SOURCE_MODEL)


def trade_source_sources_root() -> Path:
    return sources_root(TRADE_SOURCE_MODEL)


def trade_source_data_root() -> Path:
    return sources_data_root(TRADE_SOURCE_MODEL)


def trade_source_uri_ledger_root() -> Path:
    return sources_uri_ledger_root(TRADE_SOURCE_MODEL)


def trade_source_sandbox_root() -> Path:
    return sandbox_root(TRADE_SOURCE_MODEL)


def trade_representation_example_root() -> Path:
    return example_root(TRADE_REPRESENTATION_MODEL)


def trade_representation_sources_root() -> Path:
    return sources_root(TRADE_REPRESENTATION_MODEL)


def trade_representation_data_root() -> Path:
    return sources_data_root(TRADE_REPRESENTATION_MODEL)


def trade_representation_uri_ledger_root() -> Path:
    return sources_uri_ledger_root(TRADE_REPRESENTATION_MODEL)


def trade_representation_sandbox_root() -> Path:
    return sandbox_root(TRADE_REPRESENTATION_MODEL)


def apra_liquidity_example_root() -> Path:
    return example_root(APRA_LIQUIDITY_MODEL)


def apra_liquidity_sources_root() -> Path:
    return sources_root(APRA_LIQUIDITY_MODEL)


def apra_liquidity_data_root() -> Path:
    return sources_data_root(APRA_LIQUIDITY_MODEL)


def apra_liquidity_pdfs_root() -> Path:
    return sources_pdfs_root(APRA_LIQUIDITY_MODEL)


def apra_liquidity_uri_ledger_root() -> Path:
    return sources_uri_ledger_root(APRA_LIQUIDITY_MODEL)


def apra_liquidity_sandbox_root() -> Path:
    return sandbox_root(APRA_LIQUIDITY_MODEL)


def banking_product_example_root() -> Path:
    return example_root(BANKING_PRODUCT_MODEL)


def banking_product_sources_root() -> Path:
    return sources_root(BANKING_PRODUCT_MODEL)


def banking_product_data_root() -> Path:
    return sources_data_root(BANKING_PRODUCT_MODEL)


def banking_product_uri_ledger_root() -> Path:
    return sources_uri_ledger_root(BANKING_PRODUCT_MODEL)


def banking_product_sandbox_root() -> Path:
    return sandbox_root(BANKING_PRODUCT_MODEL)


def relative_path(from_root: Path, to_path: Path) -> str:
    return os.path.relpath(to_path, start=from_root)


def example_relative_input_ref(example_name: str, relative_path: str | Path) -> str:
    return f"input://examples/{example_name}/sources/{Path(relative_path).as_posix()}"


def example_relative_review_ref(example_name: str, relative_path: str | Path) -> str:
    return f"review://examples/{example_name}/sandbox/{ACTIVE_SANDBOX_VERSION}/review/{Path(relative_path).as_posix()}"
