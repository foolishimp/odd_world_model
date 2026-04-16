# Implements: REQ-ODD-DOMAIN-BUILD-VERIFY-003
# Implements: REQ-ODD-DOMAIN-BUILD-VERIFY-004
"""Executive program runner derived from the current odd_domain GTL carrier."""

from __future__ import annotations

from typing import Any

from genesis.result_ingest import ingest_fp_result

from .app import OddDomainApp, start
from .app import gaps as runtime_gaps
from .constructor import construct_manifest
from .function_catalog import active_programs, program_by_name


DEFAULT_SELF_TEST_PROGRAM = "build_and_query_world_model"


def programs() -> list[dict[str, Any]]:
    return [entry.to_dict() for entry in active_programs()]


def _program_converged(app: OddDomainApp, *, name: str) -> bool:
    program = program_by_name(name)
    gap_payload = runtime_gaps(app)
    passed_edges = {
        entry.get("edge")
        for entry in gap_payload.get("gaps", [])
        if entry.get("delta") == 0.0
    }
    return all(edge in passed_edges for edge in program.steps)


def run_program(app: OddDomainApp, *, name: str) -> dict[str, Any]:
    program = program_by_name(name)
    workspace_root = app.config.workspace_root
    steps: list[dict[str, Any]] = []
    remaining_steps = list(program.steps)

    if _program_converged(app, name=name):
        return {
            "status": "ok",
            "program": program.to_dict(),
            "completed_edges": [],
            "steps": [],
            "final_state": {
                "status": "converged",
                "scope": "executive_program",
                "program": program.name,
            },
            "already_converged": True,
        }

    while remaining_steps:
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
        if actual_edge not in remaining_steps:
            if _program_converged(app, name=name):
                break
            raise RuntimeError(
                f"executive program {program.name!r} expected one of {remaining_steps!r} "
                f"but start selected {actual_edge!r}"
            )
        while remaining_steps and remaining_steps[0] != actual_edge:
            remaining_steps.pop(0)
        expected_edge = remaining_steps.pop(0)
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

    return {
        "status": "ok",
        "program": program.to_dict(),
        "completed_edges": [step["edge"] for step in steps],
        "steps": steps,
        "final_state": {
            "status": "converged",
            "scope": "executive_program",
            "program": program.name,
        },
        "already_converged": False,
    }


def self_test(app: OddDomainApp) -> dict[str, Any]:
    return run_program(app, name=DEFAULT_SELF_TEST_PROGRAM)
