from __future__ import annotations

import json
from dataclasses import asdict

from odd_world_model_storage.duckdb_proof import DuckDbExactSnapshotVerifier


verifier = DuckDbExactSnapshotVerifier()
try:
    print(json.dumps(asdict(verifier.runtime_identity), sort_keys=True))
finally:
    verifier.connection.close()
