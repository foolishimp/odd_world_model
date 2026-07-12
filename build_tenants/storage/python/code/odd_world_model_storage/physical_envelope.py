"""Canonical physical-record envelope projection shared by storage readers."""

from __future__ import annotations

import json
from typing import Any

from .canonical import canonical_json, sha256_digest


def stored_payload_digest(rows: list[dict[str, Any]]) -> str:
    physical = [
        {
            **row,
            "payload_json": canonical_json(json.loads(row["payload_json"])),
        }
        for row in sorted(rows, key=lambda item: int(item["record_ordinal"]))
    ]
    return sha256_digest(physical)
