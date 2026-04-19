# Implements: REQ-ODD-WORLD-MODEL-BUILD-CAP-005
# Implements: REQ-ODD-WORLD-MODEL-BUILD-CONSTRAINT-005
# Implements: REQ-ODD-WORLD-MODEL-ODD-CARRIER-006
"""Stable query-contract descriptors for odd_world_model query projections."""

from __future__ import annotations


QUERY_DOMAIN_CONTRACT_NAME = "odd_world_model.query-domain"
QUERY_DOMAIN_CONTRACT_VERSION = "v1"
QUERY_DOMAIN_TOP_LEVEL_KEYS = (
    "query_contract",
    "workspace_root",
    "semantic_facets",
    "asset_types",
    "asset_families",
    "assets",
    "collections",
    "functions",
    "programs",
    "graph_functions",
    "bindings",
    "jobs",
)


def query_domain_contract() -> dict[str, object]:
    return {
        "name": QUERY_DOMAIN_CONTRACT_NAME,
        "version": QUERY_DOMAIN_CONTRACT_VERSION,
        "top_level_keys": list(QUERY_DOMAIN_TOP_LEVEL_KEYS),
        "runtime_model": "abg-aligned",
        "query_model": "odd-world-model-projection",
    }
