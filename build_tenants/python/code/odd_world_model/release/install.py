# Implements: REQ-ODD-WORLD-MODEL-ODD-CARRIER-005
# Implements: REQ-ODD-WORLD-MODEL-BUILD-VERIFY-004
"""Install odd_world_model into a target project workspace.

This installer is intentionally shaped to track the `odd_sdlc` release
installer pattern so the `odd_*` installers can converge later instead of
drifting into unrelated one-off install flows.
"""

from __future__ import annotations

import argparse
import json
import shutil
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


SOURCE_PACKAGE = Path(__file__).resolve().parents[1]
SOURCE_WORKSPACE_ROOT = Path(__file__).resolve().parents[5]
SOURCE_COMMON_ROOT = SOURCE_WORKSPACE_ROOT / "build_tenants" / "common"
SOURCE_RUNTIME_ROOT = SOURCE_WORKSPACE_ROOT / ".genesis"
PACKAGE_RELATIVE = Path(".odd_world_model") / "python" / "code" / "odd_world_model"
INSTALL_MANIFEST_RELATIVE = Path(".odd_world_model") / "release" / "install_manifest.json"
_BOOTLOADER_START = "<!-- ODD_WORLD_MODEL_BOOTLOADER_START -->"
_BOOTLOADER_END = "<!-- ODD_WORLD_MODEL_BOOTLOADER_END -->"


def _canonical_slug(target_root: Path, project_slug: str | None) -> str:
    slug = project_slug or target_root.name.split(".", 1)[0] or "project"
    return slug.replace("-", "_")


def _copytree(source: Path, destination: Path) -> Path:
    if destination.exists() and destination.resolve() == source.resolve():
        return destination
    destination.parent.mkdir(parents=True, exist_ok=True)
    shutil.copytree(
        source,
        destination,
        dirs_exist_ok=True,
        ignore=shutil.ignore_patterns("__pycache__", "*.pyc", "*.pyo"),
    )
    return destination


def _copy_package(target_root: Path) -> Path:
    return _copytree(SOURCE_PACKAGE, target_root / PACKAGE_RELATIVE)


def _copy_common_assets(target_root: Path) -> Path:
    return _copytree(SOURCE_COMMON_ROOT, target_root / "build_tenants" / "common")


def _copy_runtime_surface(target_root: Path) -> Path:
    return _copytree(SOURCE_RUNTIME_ROOT, target_root / ".genesis")


def _bootstrap_workspace(target_root: Path) -> None:
    ai_workspace = target_root / ".ai-workspace"
    directories = [
        ai_workspace / "events",
        ai_workspace / "features" / "active",
        ai_workspace / "features" / "completed",
        ai_workspace / "context",
        ai_workspace / "reviews" / "pending",
        ai_workspace / "reviews" / "proxy-log",
        ai_workspace / "comments" / "codex",
        ai_workspace / "agents",
        ai_workspace / "runtime",
        ai_workspace / "tickets" / "active",
        ai_workspace / "tickets" / "completed",
    ]
    for directory in directories:
        directory.mkdir(parents=True, exist_ok=True)

    events_file = ai_workspace / "events" / "events.jsonl"
    if not events_file.exists():
        events_file.touch()


def _ensure_project_scaffold(target_root: Path) -> None:
    directories = [
        target_root / "specification" / "requirements",
        target_root / "docs",
        target_root / "docs" / "pilots",
        target_root / "domain_artifacts",
    ]
    for directory in directories:
        directory.mkdir(parents=True, exist_ok=True)


def _write_install_manifest(target_root: Path, *, project_slug: str) -> Path:
    manifest_path = target_root / INSTALL_MANIFEST_RELATIVE
    manifest_path.parent.mkdir(parents=True, exist_ok=True)
    payload = {
        "product": "odd_world_model",
        "schema_version": "v1",
        "installed_at": datetime.now(timezone.utc).isoformat(),
        "project_slug": project_slug,
        "target_root": str(target_root),
        "source_workspace": str(SOURCE_WORKSPACE_ROOT),
        "source_package": str(SOURCE_PACKAGE),
        "package_path": PACKAGE_RELATIVE.as_posix(),
        "common_assets_path": "build_tenants/common",
        "runtime_path": ".genesis",
        "standards_path": ".genesis/docs/standards",
        "installation_type": "filesystem_release_install",
    }
    manifest_path.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")
    return manifest_path


def _workspace_instruction_bootloader(target_root: Path, *, project_slug: str) -> str:
    workspace_name = target_root.name
    manifest = f"workspace://{INSTALL_MANIFEST_RELATIVE.as_posix()}"
    return "\n".join(
        (
            "# odd_world_model Installed Builder Surface",
            "",
            "This workspace consumes `odd_world_model` as an installed domain-builder app.",
            "It is a configured project instance, not the `odd_world_model` source workspace.",
            "",
            "## Workspace Identity",
            f"- workspace: `{workspace_name}`",
            f"- project slug: `{project_slug}`",
            f"- install manifest: `{manifest}`",
            "- installed package root: `workspace://.odd_world_model/python/code/odd_world_model`",
            "- installed runtime root: `workspace://.genesis/`",
            "- installed standards: `workspace://.genesis/docs/standards/`",
            "- common carrier assets: `workspace://build_tenants/common/`",
            "- project-owned domain outputs: `workspace://domain_artifacts/`",
            "",
            "## Read First",
            "- `workspace://specification/GOALS.md` when present",
            "- `workspace://specification/INTENT.md` when present",
            "- `workspace://specification/PRODUCT.md` when present",
            "- `workspace://docs/pilots/` for current proving lanes",
            f"- `{manifest}`",
            "- `workspace://.genesis/docs/standards/WORLD_MODEL_METHOD.md`",
            "",
            "## Operating Rule",
            "- treat the project specification as project authority",
            "- treat the installed `odd_world_model` package as the builder substrate",
            "- treat the installed `.genesis` runtime as the GTL/ABG execution substrate",
            "- publish project-owned domain artifacts under `domain_artifacts/`",
            "- use `build_tenants/common/` as the installed carrier/examples/schema surface",
            "- do not confuse this installed workspace with the source workspace that produced the release",
            "",
            "## First Verification Commands",
            "- `PYTHONPATH=.genesis:.odd_world_model/python/code python -m odd_world_model.world_model.validate build_tenants/common/examples/world_fragment_minimal`",
            "- `PYTHONPATH=.genesis:.odd_world_model/python/code python -m odd_world_model.build_line.fpml_trade_domain`",
            "- `PYTHONPATH=.genesis:.odd_world_model/python/code python -m odd_world_model.build_line.trade_to_apra`",
            "- `PYTHONPATH=.genesis:.odd_world_model/python/code python -m odd_world_model self-test --workspace .`",
            "",
            "## Interpretation Rule",
            "- the install manifest explains what was stamped into this workspace",
            "- installed standards explain the method and representation rules",
            "- project-owned specs explain what this project is trying to build",
            "- published domain artifacts are the outputs of the configured project instance",
        )
    )


def _install_instruction_bootloader(
    target_root: Path,
    filename: str,
    *,
    project_slug: str,
) -> str:
    section = (
        f"{_BOOTLOADER_START}\n"
        f"{_workspace_instruction_bootloader(target_root, project_slug=project_slug)}\n"
        f"{_BOOTLOADER_END}"
    )
    instruction_path = target_root / filename
    if instruction_path.exists():
        existing = instruction_path.read_text(encoding="utf-8")
        if _BOOTLOADER_START in existing and _BOOTLOADER_END in existing:
            start = existing.index(_BOOTLOADER_START)
            end = existing.index(_BOOTLOADER_END) + len(_BOOTLOADER_END)
            updated = existing[:start] + section + existing[end:]
            instruction_path.write_text(updated, encoding="utf-8")
            return "updated"
        separator = "\n\n" if existing.strip() else "\n"
        instruction_path.write_text(section + separator + existing.lstrip(), encoding="utf-8")
        return "prepended"
    instruction_path.write_text(section + "\n", encoding="utf-8")
    return "created"


def install(target_root: Path | str, *, project_slug: str | None = None) -> dict[str, Any]:
    root = Path(target_root).resolve()
    slug = _canonical_slug(root, project_slug)

    _bootstrap_workspace(root)
    _ensure_project_scaffold(root)

    package_path = _copy_package(root)
    common_assets_path = _copy_common_assets(root)
    runtime_path = _copy_runtime_surface(root)
    manifest_path = _write_install_manifest(root, project_slug=slug)
    agents_md = _install_instruction_bootloader(root, "AGENTS.md", project_slug=slug)
    claude_md = _install_instruction_bootloader(root, "CLAUDE.md", project_slug=slug)

    return {
        "status": "installed",
        "target_root": str(root),
        "project_slug": slug,
        "package_path": str(package_path.relative_to(root)),
        "common_assets_path": str(common_assets_path.relative_to(root)),
        "runtime_path": str(runtime_path.relative_to(root)),
        "standards_path": ".genesis/docs/standards",
        "install_manifest": str(manifest_path.relative_to(root)),
        "agents_md": agents_md,
        "claude_md": claude_md,
    }


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(prog="odd_world_model.release.install")
    parser.add_argument("--target", required=True)
    parser.add_argument("--project-slug")
    args = parser.parse_args(argv)

    payload = install(args.target, project_slug=args.project_slug)
    print(json.dumps(payload, indent=2, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
