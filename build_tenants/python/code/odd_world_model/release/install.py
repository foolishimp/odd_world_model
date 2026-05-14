# Implements: REQ-ODD-WORLD-MODEL-ODD-CARRIER-005
# Implements: REQ-ODD-WORLD-MODEL-BUILD-VERIFY-004
"""Install odd_world_model into a target project workspace."""

from __future__ import annotations

import argparse
import json
import os
import shutil
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


SOURCE_PACKAGE = Path(__file__).resolve().parents[1]
SOURCE_WORKSPACE_ROOT = Path(__file__).resolve().parents[5]
SOURCE_EXAMPLES_ROOT = SOURCE_WORKSPACE_ROOT / "examples"
SOURCE_RUNTIME_ROOT = SOURCE_WORKSPACE_ROOT / ".genesis"

PACKAGE_RELATIVE = Path(".genesis") / "odd_world_model" / "python" / "code" / "odd_world_model"
RELEASE_CONTRACT_RELATIVE = Path(".genesis") / "odd_world_model" / "release" / "genesis.yml"
INSTALL_MANIFEST_RELATIVE = Path(".genesis") / "odd_world_model" / "release" / "install_manifest.json"

_BOOTLOADER_START = "<!-- ODD_WORLD_MODEL_BOOTLOADER_START -->"
_BOOTLOADER_END = "<!-- ODD_WORLD_MODEL_BOOTLOADER_END -->"


def _canonical_slug(target_root: Path, project_slug: str | None) -> str:
    slug = project_slug or target_root.name.split(".", 1)[0] or "project"
    return slug.replace("-", "_")


def _copytree(source: Path, destination: Path, *, replace: bool = False) -> Path:
    if destination.exists() and destination.resolve() == source.resolve():
        return destination
    if replace and destination.exists():
        shutil.rmtree(destination)
    destination.parent.mkdir(parents=True, exist_ok=True)
    shutil.copytree(
        source,
        destination,
        dirs_exist_ok=not replace,
        ignore=shutil.ignore_patterns("__pycache__", "*.pyc", "*.pyo"),
    )
    return destination


def _copy_package(target_root: Path) -> Path:
    return _copytree(SOURCE_PACKAGE, target_root / PACKAGE_RELATIVE, replace=True)


def _copy_examples(target_root: Path) -> Path:
    return _copytree(SOURCE_EXAMPLES_ROOT, target_root / "examples")


def _copy_runtime_surface(target_root: Path) -> Path:
    return _copytree(SOURCE_RUNTIME_ROOT, target_root / ".genesis", replace=True)


def _write_kernel_bootstrap(target_root: Path) -> Path:
    payload = "\n".join(
        (
            "# Genesis kernel default — written by odd_world_model installer",
            "#",
            "# This file is the engine bootstrap config for the installed workspace.",
            "# The odd_world_model runtime contract is rooted under .genesis/odd_world_model.",
            "#",
            "runtime_contract: .genesis/odd_world_model/release/genesis.yml",
            "",
        )
    )
    path = target_root / ".genesis" / "genesis.yml"
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(payload, encoding="utf-8")
    return path


def _write_runtime_contract(target_root: Path) -> Path:
    payload = "\n".join(
        (
            "# odd_world_model runtime contract",
            "module: odd_world_model.gtl_module:MODULE",
            "package: odd_world_model.gtl_module:MODULE",
            "domain_package: odd_world_model",
            "runtime_backend: codex",
            (
                'asset_binding_contract: {"asset_id_key":"asset_id","assets_key":"assets",'
                '"command":["python","-m","odd_world_model","query-domain","--workspace","."],'
                '"exists_key":"checkpoint.exists","path_kind_key":"checkpoint.path_kind",'
                '"relative_path_key":"metadata.relative_path","uri_key":"uri"}'
            ),
            "pythonpath:",
            "  - .genesis",
            "  - .genesis/odd_world_model/python/code",
            "",
        )
    )
    path = target_root / RELEASE_CONTRACT_RELATIVE
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(payload, encoding="utf-8")
    return path


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


def _remove_legacy_install_surfaces(target_root: Path) -> None:
    legacy_paths = [
        target_root / "build_tenants",
    ]
    for path in legacy_paths:
        if path.exists():
            shutil.rmtree(path)


def _artifact_slug_for_example(example_name: str) -> str:
    if example_name == "trade_source_model":
        return "fpml_confirmation_source_domain"
    if example_name.endswith("_model"):
        return f"{example_name[:-6]}_domain"
    return f"{example_name}_domain"


def _write_sandbox_builder_config(target_root: Path) -> Path | None:
    if target_root.parent.name != "sandbox":
        return None
    example_root = target_root.parent.parent
    sources_root = example_root / "sources"
    if not sources_root.exists():
        return None

    example_name = example_root.name
    config_path = target_root / ".ai-workspace" / "context" / "world_builder_config.json"
    config_path.parent.mkdir(parents=True, exist_ok=True)
    domain_input_path = sources_root / "data" / "domain_input.json"
    if domain_input_path.exists():
        payload = {
            "configuration_version": "v1",
            "workspace_kind": "installed_example_sandbox",
            "builder": {
                "kind": "domain_input_seed",
                "self_test_program": "build_and_query_world_model",
            },
            "domain": {
                "example_name": example_name,
                "artifact_slug": _artifact_slug_for_example(example_name),
                "source_manifest": os.path.relpath(domain_input_path, start=target_root),
            },
        }
    else:
        source_xml_path = sources_root / "data" / "authority" / "com-ex28-gas-swap-daily-delivery-prices-option-last.xml"
        examples_index_path = sources_root / "data" / "authority" / "fpml-5-12-examples.html"
        source_authority_path = sources_root / "uri_ledger" / "source_authority.md"
        source_notes_path = sources_root / "uri_ledger" / "source_notes.md"
        if not (source_xml_path.exists() and examples_index_path.exists() and source_authority_path.exists()):
            return None
        payload = {
            "configuration_version": "v1",
            "workspace_kind": "installed_example_sandbox",
            "builder": {
                "kind": "fpml_source_seed",
                "self_test_program": "build_and_query_world_model",
            },
            "domain": {
                "example_name": example_name,
                "artifact_slug": _artifact_slug_for_example(example_name),
                "source_xml": os.path.relpath(source_xml_path, start=target_root),
                "examples_index": os.path.relpath(examples_index_path, start=target_root),
                "source_authority": os.path.relpath(source_authority_path, start=target_root),
                "source_notes": os.path.relpath(source_notes_path, start=target_root) if source_notes_path.exists() else None,
            },
        }
    config_path.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")
    return config_path


def _write_install_manifest(
    target_root: Path,
    *,
    project_slug: str,
    include_examples: bool,
    builder_config_path: Path | None,
) -> Path:
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
        "package_assets_path": (PACKAGE_RELATIVE.parent / "odd_world_model" / "assets").as_posix(),
        "runtime_contract_path": RELEASE_CONTRACT_RELATIVE.as_posix(),
        "examples_path": "examples" if include_examples else None,
        "runtime_path": ".genesis",
        "standards_path": ".genesis/docs/standards",
        "installation_type": "filesystem_release_install",
        "builder_config_path": (
            str(builder_config_path.relative_to(target_root))
            if builder_config_path is not None
            else None
        ),
    }
    manifest_path.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")
    return manifest_path


def _workspace_instruction_bootloader(
    target_root: Path,
    *,
    project_slug: str,
    include_examples: bool,
) -> str:
    workspace_name = target_root.name
    manifest = f"workspace://{INSTALL_MANIFEST_RELATIVE.as_posix()}"
    lines = [
        "# odd_world_model Installed Builder Surface",
        "",
        "This workspace consumes `odd_world_model` as an installed domain-builder app.",
        "It is a configured project instance, not the `odd_world_model` source workspace.",
        "",
        "## Workspace Identity",
        f"- workspace: `{workspace_name}`",
        f"- project slug: `{project_slug}`",
        f"- install manifest: `{manifest}`",
        "- installed package root: `workspace://.genesis/odd_world_model/python/code/odd_world_model`",
        "- installed package assets: `workspace://.genesis/odd_world_model/python/code/odd_world_model/assets/`",
        "- installed runtime contract: `workspace://.genesis/odd_world_model/release/genesis.yml`",
        "- installed runtime root: `workspace://.genesis/`",
        "- installed standards: `workspace://.genesis/docs/standards/`",
    ]
    if include_examples:
        lines.append("- example source and sandbox hierarchy: `workspace://examples/`")
    else:
        lines.append("- this workspace is one versioned installed example-domain sandbox cut")
        lines.append("- sandbox builder config: `workspace://.ai-workspace/context/world_builder_config.json`")

    lines.extend(
        [
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
            "- treat the installed `odd_world_model` package as the immutable builder substrate",
            "- treat the installed `.genesis` runtime as the GTL/ABG execution substrate",
            "- keep immutable installed package/runtime assets under `.genesis/`",
            "- keep mutable working state under `.ai-workspace/` and mutable domain outputs under the sandbox root",
            "- do not confuse this installed workspace with the source workspace that produced the release",
        ]
    )

    if include_examples:
        lines.extend(
            [
                "- treat `examples/` as the first-class example-domain hierarchy",
                "- treat each example `sources/` tree as retained rebuild authority for that domain",
                "- allow later `odd_world_model` cuts to stamp additional `sandbox/<datetime>_<version>/` instances against the same sources",
                "",
                "## First Verification Commands",
                "- `PYTHONPATH=.genesis:.genesis/odd_world_model/python/code python -m odd_world_model.world_model.validate examples/trade_representation_model/sandbox/20260419T000000Z_v1/published/trade_representation_domain`",
                "- `PYTHONPATH=.genesis:.genesis/odd_world_model/python/code python -m odd_world_model.build_line.trade_to_apra`",
                "- `PYTHONPATH=.genesis:.genesis/odd_world_model/python/code python -m odd_world_model self-test --workspace .`",
                "",
                "## Interpretation Rule",
                "- the install manifest explains what was stamped into this workspace",
                "- installed standards explain the method and representation rules",
                "- project-owned specs explain what this project is trying to build",
                "- example sandboxes under `examples/` are versioned installed-domain instances owned by this workspace",
            ]
        )
    else:
        lines.extend(
            [
                "- treat the sibling example-domain `sources/` tree as retained rebuild authority outside this installed cut",
                "",
                "## First Verification Commands",
                "- `PYTHONPATH=.genesis:.genesis/odd_world_model/python/code python -m odd_world_model programs --workspace .`",
                "- `PYTHONPATH=.genesis:.genesis/odd_world_model/python/code python -m odd_world_model query-domain --workspace .`",
                "",
                "## Interpretation Rule",
                "- the install manifest explains what was stamped into this workspace",
                "- installed standards explain the method and representation rules",
                "- project-owned specs explain what this project is trying to build",
                "- this workspace is one versioned installed example-domain sandbox instance",
            ]
        )

    return "\n".join(lines)


def _install_instruction_bootloader(
    target_root: Path,
    filename: str,
    *,
    project_slug: str,
    include_examples: bool,
) -> str:
    section = (
        f"{_BOOTLOADER_START}\n"
        f"{_workspace_instruction_bootloader(target_root, project_slug=project_slug, include_examples=include_examples)}\n"
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


def install(
    target_root: Path | str,
    *,
    project_slug: str | None = None,
    include_examples: bool = True,
) -> dict[str, Any]:
    root = Path(target_root).resolve()
    slug = _canonical_slug(root, project_slug)

    _bootstrap_workspace(root)
    _ensure_project_scaffold(root)
    _remove_legacy_install_surfaces(root)

    runtime_path = _copy_runtime_surface(root)
    package_path = _copy_package(root)
    kernel_bootstrap_path = _write_kernel_bootstrap(root)
    runtime_contract_path = _write_runtime_contract(root)
    examples_path = _copy_examples(root) if include_examples and SOURCE_EXAMPLES_ROOT.exists() else None
    builder_config_path = _write_sandbox_builder_config(root) if not include_examples else None
    manifest_path = _write_install_manifest(
        root,
        project_slug=slug,
        include_examples=include_examples,
        builder_config_path=builder_config_path,
    )
    agents_md = _install_instruction_bootloader(root, "AGENTS.md", project_slug=slug, include_examples=include_examples)
    claude_md = _install_instruction_bootloader(root, "CLAUDE.md", project_slug=slug, include_examples=include_examples)

    return {
        "status": "installed",
        "target_root": str(root),
        "project_slug": slug,
        "package_path": str(package_path.relative_to(root)),
        "examples_path": str(examples_path.relative_to(root)) if examples_path else None,
        "runtime_path": str(runtime_path.relative_to(root)),
        "kernel_bootstrap_path": str(kernel_bootstrap_path.relative_to(root)),
        "runtime_contract_path": str(runtime_contract_path.relative_to(root)),
        "standards_path": ".genesis/docs/standards",
        "install_manifest": str(manifest_path.relative_to(root)),
        "builder_config_path": (
            str(builder_config_path.relative_to(root))
            if builder_config_path is not None
            else None
        ),
        "agents_md": agents_md,
        "claude_md": claude_md,
    }


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(prog="odd_world_model.release.install")
    parser.add_argument("--target", required=True)
    parser.add_argument("--project-slug")
    parser.add_argument("--skip-examples", action="store_true")
    args = parser.parse_args(argv)

    payload = install(
        args.target,
        project_slug=args.project_slug,
        include_examples=not args.skip_examples,
    )
    print(json.dumps(payload, indent=2, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
