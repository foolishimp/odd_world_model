# Validates: REQ-ODD-WORLD-MODEL-ODD-CARRIER-005
# Validates: REQ-ODD-WORLD-MODEL-BUILD-VERIFY-004
from __future__ import annotations

import json
import os
import subprocess
import sys
from pathlib import Path

from odd_world_model.release.install import install

def test_release_install_stamps_workspace_layout(tmp_path: Path) -> None:
    target = tmp_path / "sandbox"
    result = install(target, project_slug="sandbox_domain")

    assert result["status"] == "installed"
    assert (target / ".odd_world_model" / "python" / "code" / "odd_world_model").exists()
    assert (target / ".genesis" / "genesis").exists()
    assert (target / ".genesis" / "gtl").exists()
    assert (target / "build_tenants" / "common").exists()
    assert (target / ".genesis" / "docs" / "standards").exists()
    assert (target / ".ai-workspace").exists()

    manifest = json.loads((target / result["install_manifest"]).read_text(encoding="utf-8"))
    assert manifest["product"] == "odd_world_model"
    assert manifest["project_slug"] == "sandbox_domain"

    assert "ODD_WORLD_MODEL_BOOTLOADER_START" in (target / "AGENTS.md").read_text(encoding="utf-8")
    assert "ODD_WORLD_MODEL_BOOTLOADER_START" in (target / "CLAUDE.md").read_text(encoding="utf-8")


def test_installed_package_exposes_program_catalog_in_sandbox(tmp_path: Path) -> None:
    target = tmp_path / "sandbox_runtime"
    install(target, project_slug="sandbox_runtime")

    completed = subprocess.run(
        [sys.executable, "-m", "odd_world_model", "programs", "--workspace", "."],
        cwd=target,
        env={
            **dict(os.environ),
            "PYTHONPATH": f"{target / '.genesis'}:{target / '.odd_world_model' / 'python' / 'code'}",
        },
        capture_output=True,
        text=True,
        check=True,
    )
    payload = json.loads(completed.stdout)

    assert payload["workspace_root"] == str(target.resolve())
    assert payload["programs"][0]["name"] == "build_and_query_world_model"
