"""Sandbox-local configuration for installed odd_world_model workspaces."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any


SANDBOX_CONFIG_RELATIVE = Path(".ai-workspace") / "context" / "world_builder_config.json"


def sandbox_config_path(workspace_root: Path) -> Path:
    return workspace_root / SANDBOX_CONFIG_RELATIVE


def load_sandbox_config(workspace_root: Path) -> dict[str, Any] | None:
    path = sandbox_config_path(workspace_root)
    if not path.exists():
        return None
    raw = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(raw, dict):
        raise ValueError(f"{path} must contain a JSON object")
    return raw


def configured_builder_kind(workspace_root: Path) -> str | None:
    config = load_sandbox_config(workspace_root)
    if config is None:
        return None
    builder = config.get("builder", {})
    if not isinstance(builder, dict):
        raise ValueError("sandbox builder config must contain an object at 'builder'")
    kind = builder.get("kind")
    if kind is None:
        return None
    if not isinstance(kind, str) or not kind:
        raise ValueError("sandbox builder kind must be a non-empty string")
    return kind


def configured_self_test_program(workspace_root: Path, *, default: str) -> str:
    config = load_sandbox_config(workspace_root)
    if config is None:
        return default
    builder = config.get("builder", {})
    if not isinstance(builder, dict):
        raise ValueError("sandbox builder config must contain an object at 'builder'")
    program = builder.get("self_test_program", default)
    if not isinstance(program, str) or not program:
        raise ValueError("sandbox builder self_test_program must be a non-empty string")
    return program
