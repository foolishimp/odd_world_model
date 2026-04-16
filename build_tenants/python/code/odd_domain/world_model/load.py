# Implements: REQ-ODD-DOMAIN-WORLD-OBJECT-003
# Implements: REQ-ODD-DOMAIN-WORLD-OBJECT-004
"""File-first loading helpers for the common world-model carrier."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any


def load_json(path: Path) -> dict[str, Any]:
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def load_fragment(fragment_path: Path) -> dict[str, Any]:
    return load_json(fragment_path)


def workspace_root_from_domain_root(domain_root: Path) -> Path:
    return domain_root.parent.parent


def resolve_ref(domain_root: Path, ref: str) -> Path:
    workspace_root = workspace_root_from_domain_root(domain_root)
    if ref.startswith("ledger://"):
        return domain_root / "attribute_ledger" / ref.removeprefix("ledger://")
    if ref.startswith("review://"):
        return workspace_root / "review" / ref.removeprefix("review://")
    if ref.startswith("input://"):
        return workspace_root / "inputs" / ref.removeprefix("input://")
    return domain_root / ref


def load_ref(domain_root: Path, ref: str) -> dict[str, Any]:
    return load_json(resolve_ref(domain_root, ref))
