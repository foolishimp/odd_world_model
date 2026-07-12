"""Canonical JSON and digest functions shared by protocol carriers."""

from __future__ import annotations

import hashlib
import re
from typing import Any

import rfc8785

SHA256_DIGEST_PATTERN = r"^sha256:[0-9a-f]{64}$"
_SHA256_DIGEST_RE = re.compile(SHA256_DIGEST_PATTERN)


def canonical_json(value: Any) -> str:
    return rfc8785.dumps(value).decode("utf-8")


def sha256_digest(value: Any) -> str:
    encoded = rfc8785.dumps(value)
    return f"sha256:{hashlib.sha256(encoded).hexdigest()}"


def is_sha256_digest(value: Any) -> bool:
    return isinstance(value, str) and _SHA256_DIGEST_RE.fullmatch(value) is not None
