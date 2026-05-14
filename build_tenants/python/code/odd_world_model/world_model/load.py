# Implements: REQ-ODD-WORLD-MODEL-WORLD-OBJECT-003
# Implements: REQ-ODD-WORLD-MODEL-WORLD-OBJECT-004
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


def project_root_from_domain_root(domain_root: Path) -> Path:
    current = domain_root.resolve()
    fallback: Path | None = None
    for candidate in current.parents:
        if (candidate / "specification").exists() and (candidate / ".genesis").exists():
            if fallback is None:
                fallback = candidate
        if (candidate / "specification").exists() and (candidate / "examples").exists() and (candidate / ".genesis").exists():
            return candidate
    if fallback is not None:
        return fallback
    raise RuntimeError(f"unable to resolve project root from domain root {domain_root}")


def example_root_from_domain_root(domain_root: Path) -> Path:
    current = domain_root.resolve()
    for candidate in current.parents:
        if candidate.name == "sandbox":
            return candidate.parent
    raise RuntimeError(f"unable to resolve example root from domain root {domain_root}")


def workspace_root_from_domain_root(domain_root: Path) -> Path:
    current = domain_root.resolve()
    for candidate in current.parents:
        if candidate.parent.name == "sandbox":
            return candidate
    return domain_root.parent.parent


def resolve_ref(domain_root: Path, ref: str) -> Path:
    project_root = project_root_from_domain_root(domain_root)
    workspace_root = workspace_root_from_domain_root(domain_root)
    if ref.startswith("ledger://"):
        return domain_root / "attribute_ledger" / ref.removeprefix("ledger://")
    if ref.startswith("review://"):
        relative = ref.removeprefix("review://")
        if relative.startswith("examples/"):
            return project_root / relative
        return workspace_root / "review" / relative
    if ref.startswith("input://"):
        relative = ref.removeprefix("input://")
        if relative.startswith("examples/"):
            return project_root / relative
        return example_root_from_domain_root(domain_root) / "sources" / relative
    return domain_root / ref


def load_ref(domain_root: Path, ref: str) -> dict[str, Any]:
    return load_json(resolve_ref(domain_root, ref))
