# Implements: REQ-ODD-WORLD-MODEL-ODD-CARRIER-003
"""CLI entry for the active odd_world_model package."""

from __future__ import annotations

import argparse
import json

from .app import bootstrap, catalog, gaps, initialize, iterate, start
from .constructor import construct_manifest
from .query.domain import query_domain
from .self_test import programs, self_test


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(prog="odd_world_model")
    subparsers = parser.add_subparsers(dest="command", required=True)

    common = argparse.ArgumentParser(add_help=False)
    common.add_argument("--workspace", default=".")

    subparsers.add_parser("catalog", parents=[common])
    subparsers.add_parser("programs", parents=[common])
    subparsers.add_parser("query-domain", parents=[common])
    subparsers.add_parser("gaps", parents=[common])
    subparsers.add_parser("iterate", parents=[common])
    subparsers.add_parser("self-test", parents=[common])
    construct_parser = subparsers.add_parser("construct", parents=[common])
    construct_parser.add_argument("--manifest", required=True)
    start_parser = subparsers.add_parser("start", parents=[common])
    start_parser.add_argument("--auto", action="store_true")

    args = parser.parse_args(argv)

    if args.command == "construct":
        result = construct_manifest(args.manifest, workspace_root=args.workspace)
    elif args.command == "query-domain":
        result = query_domain(workspace_root=args.workspace)
    else:
        app = initialize(bootstrap(workspace_root=args.workspace))
        if args.command == "catalog":
            result = catalog(app)
        elif args.command == "programs":
            result = {
                "workspace_root": str(app.config.workspace_root),
                "programs": programs(),
            }
        elif args.command == "gaps":
            result = gaps(app)
        elif args.command == "iterate":
            result = iterate(app)
        elif args.command == "self-test":
            result = self_test(app)
        else:
            result = start(app, auto=args.auto)

    print(json.dumps(result, indent=2, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
