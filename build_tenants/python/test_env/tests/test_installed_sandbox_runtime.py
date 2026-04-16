# Validates: REQ-ODD-DOMAIN-BUILD-VERIFY-004
from __future__ import annotations

import json
import os
import subprocess
import sys
from pathlib import Path

from odd_domain.release.install import install


EXPECTED_PROGRAM_STEPS = (
    "trace_source_observations",
    "assure_attribute_claims",
    "materialize_attribute_ledger",
    "project_markov_object_cut",
    "publish_domain_artifact",
    "compose_world_model",
    "project_query_surface",
)


def _sandbox_env(target: Path) -> dict[str, str]:
    env = os.environ.copy()
    env["PYTHONPATH"] = os.pathsep.join(
        (
            str(target / ".genesis"),
            str(target / ".odd_domain" / "python" / "code"),
        )
    )
    env.pop("PYTEST_CURRENT_TEST", None)
    return env


def _run_installed(target: Path, *args: str) -> dict[str, object]:
    completed = subprocess.run(
        [sys.executable, "-m", "odd_domain", *args, "--workspace", "."],
        cwd=target,
        env=_sandbox_env(target),
        capture_output=True,
        text=True,
        check=True,
    )
    return json.loads(completed.stdout)


def test_installed_self_test_converges_the_retained_two_domain_program(tmp_path: Path) -> None:
    target = tmp_path / "sandbox_live_runtime"
    install(target, project_slug="sandbox_live_runtime")

    payload = _run_installed(target, "self-test")

    assert payload["status"] == "ok"
    assert payload["program"]["name"] == "build_and_query_world_model"
    assert payload["already_converged"] is False
    assert payload["completed_edges"] == list(EXPECTED_PROGRAM_STEPS)
    assert [step["edge"] for step in payload["steps"]] == list(EXPECTED_PROGRAM_STEPS)
    assert all(step["assessed"]["status"] == "ok" for step in payload["steps"])
    assert payload["final_state"]["status"] == "converged"
    assert payload["final_state"]["scope"] == "executive_program"


def test_installed_self_test_returns_clean_success_when_program_is_already_complete(tmp_path: Path) -> None:
    target = tmp_path / "sandbox_live_repeat"
    install(target, project_slug="sandbox_live_repeat")

    first = _run_installed(target, "self-test")
    second = _run_installed(target, "self-test")

    assert first["status"] == "ok"
    assert second["status"] == "ok"
    assert second["already_converged"] is True
    assert second["completed_edges"] == []
    assert second["steps"] == []
    assert second["final_state"]["status"] == "converged"


def test_installed_self_test_publishes_trade_apra_and_query_outputs(tmp_path: Path) -> None:
    target = tmp_path / "sandbox_live_outputs"
    install(target, project_slug="sandbox_live_outputs")

    payload = _run_installed(target, "self-test")
    assert payload["status"] == "ok"

    assert (
        target
        / "build_tenants"
        / "common"
        / "examples"
        / "fpml_trade_representation_standard"
        / "published"
        / "fpml_confirmation_source_domain"
        / "fragment.json"
    ).exists()
    assert (
        target
        / "build_tenants"
        / "common"
        / "examples"
        / "fpml_trade_representation_standard"
        / "published"
        / "trade_representation_domain"
        / "fragment.json"
    ).exists()
    assert (
        target
        / "build_tenants"
        / "common"
        / "examples"
        / "sandbox_trade_to_apra_mvp"
        / "published"
        / "apra_liquidity_domain"
        / "fragment.json"
    ).exists()
    assert (
        target
        / "build_tenants"
        / "common"
        / "examples"
        / "sandbox_trade_to_apra_mvp"
        / "query"
        / "trade_to_apra_query_summary.json"
    ).exists()
