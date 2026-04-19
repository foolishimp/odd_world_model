# Implements: REQ-ODD-WORLD-MODEL-BUILD-CAP-005
# Implements: REQ-ODD-WORLD-MODEL-ODD-CARRIER-006
"""Domain-query projection for the retained odd_world_model ODD carrier slice."""

from __future__ import annotations

import json
from typing import Any

from odd_world_model.app import bootstrap, catalog, initialize
from odd_world_model.query_contract import query_domain_contract


def query_domain(*, workspace_root: str = ".") -> dict[str, Any]:
    app = initialize(bootstrap(workspace_root=workspace_root))
    return {
        "query_contract": query_domain_contract(),
        **catalog(app),
    }


def main() -> int:
    print(json.dumps(query_domain(), indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
