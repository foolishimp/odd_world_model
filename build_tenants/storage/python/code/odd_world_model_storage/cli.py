"""One-request/one-response JSONL command boundary."""

from __future__ import annotations

import json
import sys
from typing import Any

from .canonical import canonical_json
from .config import StorageConfig
from .service import dispatch, operation_failure, protocol_error


def handle_input(raw: str, config: StorageConfig | None = None) -> dict[str, Any]:
    lines = [line for line in raw.splitlines() if line.strip()]
    if len(lines) != 1:
        return protocol_error(
            "invalid_request_count",
            "exactly one non-empty JSON request line is required",
        )
    try:
        payload = json.loads(lines[0])
    except json.JSONDecodeError as exc:
        return protocol_error("malformed_json", str(exc))
    if not isinstance(payload, dict):
        return protocol_error("invalid_request_shape", "request must be a JSON object")
    try:
        resolved = config or StorageConfig.from_env()
    except Exception as exc:
        return operation_failure(payload, "storage_configuration_invalid", str(exc))
    return dispatch(payload, resolved)


def main() -> int:
    try:
        result = handle_input(sys.stdin.read())
    except Exception as exc:
        result = protocol_error("storage_adapter_failure", str(exc))
    sys.stdout.write(canonical_json(result) + "\n")
    observation = result.get("effect_observation")
    observation_failed = (
        isinstance(observation, dict) and observation.get("observation_status") == "failed"
    )
    failed = result.get("effect_status") == "failed" or observation_failed
    return 2 if failed else 0


if __name__ == "__main__":
    raise SystemExit(main())
