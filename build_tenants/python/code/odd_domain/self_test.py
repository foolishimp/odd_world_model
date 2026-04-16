# Implements: REQ-ODD-DOMAIN-BUILD-VERIFY-003
# Implements: REQ-ODD-DOMAIN-BUILD-VERIFY-004
"""Executive program runner derived from the current odd_domain GTL carrier."""

from __future__ import annotations

from typing import Any

from genesis.result_ingest import ingest_fp_result

from .app import OddDomainApp, start
from .constructor import construct_manifest
from .function_catalog import active_programs, program_by_name


DEFAULT_SELF_TEST_PROGRAM = "build_and_query_world_model"


def programs() -> list[dict[str, Any]]:
    return [entry.to_dict() for entry in active_programs()]


def run_program(app: OddDomainApp, *, name: str) -> dict[str, Any]:
    program = program_by_name(name)
    workspace_root = app.config.workspace_root
    steps: list[dict[str, Any]] = []

    for expected_edge in program.steps:
        start_result = start(app)
        if start_result.get("status") == "converged":
            return {
                "status": "ok",
                "program": program.to_dict(),
                "completed_edges": [step["edge"] for step in steps],
                "steps": steps,
                "final_state": start_result,
                "already_converged": True,
            }
        actual_edge = start_result.get("edge")
        if actual_edge != expected_edge:
            raise RuntimeError(
                f"executive program {program.name!r} expected {expected_edge!r} "
                f"but start selected {actual_edge!r}"
            )
        manifest_path = start_result.get("fp_manifest_path")
        if not isinstance(manifest_path, str) or not manifest_path:
            raise RuntimeError(
                f"executive program {program.name!r} step {expected_edge!r} "
                "did not produce fp_manifest_path"
            )
        constructor_result = construct_manifest(manifest_path, workspace_root=workspace_root)
        assessed_result = ingest_fp_result(constructor_result["result_path"], workspace_root)
        steps.append(
            {
                "edge": expected_edge,
                "start": start_result,
                "constructor": constructor_result,
                "assessed": assessed_result,
            }
        )

    final_state = start(app)
    return {
        "status": "ok",
        "program": program.to_dict(),
        "completed_edges": [step["edge"] for step in steps],
        "steps": steps,
        "final_state": final_state,
    }


def self_test(app: OddDomainApp) -> dict[str, Any]:
    return run_program(app, name=DEFAULT_SELF_TEST_PROGRAM)
