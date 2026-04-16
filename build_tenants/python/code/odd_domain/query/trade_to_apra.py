# Implements: REQ-ODD-DOMAIN-BUILD-CAP-005
# Implements: REQ-ODD-DOMAIN-BUILD-VERIFY-002
# Implements: REQ-ODD-DOMAIN-BUILD-CONSTRAINT-005
"""Query and explain the sandbox trade-to-APRA corpus from published artifacts."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from odd_domain.build_line.trade_to_apra import (
    materialize_composed_world_model_surface,
    sandbox_root,
)
from odd_domain.world_model.load import load_json, resolve_ref


def query_root() -> Path:
    return sandbox_root() / "query"


def published_root() -> Path:
    return sandbox_root() / "published"


def stitching_root() -> Path:
    return sandbox_root() / "stitching_candidates"


def _write_json(path: Path, payload: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8") as handle:
        json.dump(payload, handle, indent=2)
        handle.write("\n")


def _write_text(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8") as handle:
        handle.write(content)


def _artifact_roots() -> dict[str, Path]:
    return {
        "trade": published_root() / "trade_representation_domain",
        "apra": published_root() / "apra_liquidity_domain",
    }


def _bundle() -> dict[str, Any]:
    materialize_composed_world_model_surface(reset=True)
    roots = _artifact_roots()
    return {
        "roots": roots,
        "trade_fragment": load_json(roots["trade"] / "fragment.json"),
        "trade_object": load_json(roots["trade"] / "objects" / "trade_contract_state.json"),
        "apra_fragment": load_json(roots["apra"] / "fragment.json"),
        "apra_object": load_json(roots["apra"] / "objects" / "reporting_position.json"),
        "treatment": load_json(roots["trade"] / "treatments" / "trade_to_apra_liquidity_candidate.json"),
        "covariance": load_json(stitching_root() / "trade_to_apra_covariance_candidate.json"),
        "adjoint": load_json(stitching_root() / "trade_to_apra_adjoint_candidate.json"),
    }


def _ref_with_suffix(refs: list[str], suffix: str) -> str:
    for ref in refs:
        if ref.endswith(suffix):
            return ref
    raise KeyError(f"missing ref with suffix: {suffix}")


def _refs_for_claim(refs: list[str], claim_key: str) -> list[str]:
    marker = f"/{claim_key}/"
    return [ref for ref in refs if marker in ref]


def _counterparty_bucket_explainability(bundle: dict[str, Any]) -> dict[str, Any]:
    roots = bundle["roots"]
    apra_object = bundle["apra_object"]
    materialization = apra_object["materialization"]
    ledger_ref = _ref_with_suffix(materialization["attribute_ledger_entry_refs"], "counterparty_bucket.json")
    assurance_ref = _ref_with_suffix(materialization["assurance_record_refs"], "counterparty_bucket.json")
    trace_refs = _refs_for_claim(materialization["trace_record_refs"], "counterparty_bucket")

    ledger_path = resolve_ref(roots["apra"], ledger_ref)
    assurance_path = resolve_ref(roots["apra"], assurance_ref)
    ledger_entry = load_json(ledger_path)
    assurance_record = load_json(assurance_path)
    trace_records = []
    for trace_ref in trace_refs:
        trace_path = resolve_ref(roots["apra"], trace_ref)
        trace_record = load_json(trace_path)
        source_path = resolve_ref(roots["apra"], trace_record["source_ref"])
        trace_records.append(
            {
                "trace_record_ref": trace_ref,
                "trace_record_path": str(trace_path.relative_to(sandbox_root())),
                "source_ref": trace_record["source_ref"],
                "source_path": str(source_path.relative_to(sandbox_root())),
                "source_locator": trace_record["locator"],
            }
        )

    return {
        "question": "Why is the APRA reporting position classified into the financial institution counterparty bucket?",
        "object_ref": apra_object["object_id"],
        "claim_key": ledger_entry["claim_key"],
        "answer": (
            "The reporting position carries a ledger-backed counterparty-bucket claim. "
            "That claim is accepted through an assurance record and traced both to the "
            "official APRA authority-claim surface and to the imported trade counterparty evidence."
        ),
        "path": {
            "object_cut_ref": apra_object["object_id"],
            "ledger_entry_ref": ledger_ref,
            "ledger_entry_path": str(ledger_path.relative_to(sandbox_root())),
            "assurance_record_ref": assurance_ref,
            "assurance_record_path": str(assurance_path.relative_to(sandbox_root())),
            "trace_records": trace_records,
        },
        "value": ledger_entry["value"],
        "authority_basis": assurance_record["authority_basis"],
    }


def _trade_to_apra_mapping_path(bundle: dict[str, Any]) -> dict[str, Any]:
    trade_object = bundle["trade_object"]
    apra_object = bundle["apra_object"]
    treatment = bundle["treatment"]
    covariance = bundle["covariance"]
    adjoint = bundle["adjoint"]

    return {
        "question": "What published path explains the mapping from the FpML trade object to the APRA reporting position?",
        "answer": (
            "The path is governed by the published trade object cut, the cross-domain treatment, "
            "the covariance candidate, and the adjoint mapping that declares what is preserved, "
            "lost, and added in the APRA interpretation."
        ),
        "path": {
            "source_object_ref": trade_object["object_id"],
            "target_object_ref": apra_object["object_id"],
            "treatment_ref": treatment["treatment_id"],
            "covariance_edge_ref": covariance["edge_id"],
            "adjoint_mapping_ref": adjoint["mapping_id"],
        },
        "preserved_structure": treatment["preserved_structure"],
        "changed_meaning": treatment["changed_meaning"],
        "loss_notes": adjoint["loss_notes"],
        "surplus_notes": adjoint["surplus_notes"],
    }


def _report(bundle: dict[str, Any], explainability: dict[str, Any], mapping_path: dict[str, Any]) -> str:
    return f"""# Trade To APRA Query Report

## Current Query Lane

- lane: filesystem-first
- source fragment: `{bundle["trade_fragment"]["fragment_id"]}`
- target fragment: `{bundle["apra_fragment"]["fragment_id"]}`

## Explainability Query

Question:
{explainability["question"]}

Answer:
{explainability["answer"]}

Path:
- object cut: `{explainability["path"]["object_cut_ref"]}`
- ledger entry: `{explainability["path"]["ledger_entry_ref"]}`
- assurance: `{explainability["path"]["assurance_record_ref"]}`

Trace chain:
{chr(10).join(f"- trace: `{item['trace_record_ref']}` -> source: `{item['source_ref']}` @ `{item['source_locator']}`" for item in explainability["path"]["trace_records"])}

Resolved files:
- `{explainability["path"]["ledger_entry_path"]}`
- `{explainability["path"]["assurance_record_path"]}`
{chr(10).join(f"- `{item['trace_record_path']}`{chr(10)}- `{item['source_path']}`" for item in explainability["path"]["trace_records"])}

Value:
- `{explainability["value"]}`

Authority basis:
{chr(10).join(f"- {item}" for item in explainability["authority_basis"])}

## Mapping Query

Question:
{mapping_path["question"]}

Answer:
{mapping_path["answer"]}

Published path:
- source object: `{mapping_path["path"]["source_object_ref"]}`
- treatment: `{mapping_path["path"]["treatment_ref"]}`
- covariance: `{mapping_path["path"]["covariance_edge_ref"]}`
- adjoint: `{mapping_path["path"]["adjoint_mapping_ref"]}`
- target object: `{mapping_path["path"]["target_object_ref"]}`

Preserved structure:
{chr(10).join(f"- `{item}`" for item in mapping_path["preserved_structure"])}

Changed meaning:
{chr(10).join(f"- {item}" for item in mapping_path["changed_meaning"])}

Declared loss:
{chr(10).join(f"- {item}" for item in mapping_path["loss_notes"])}

Future seam:
- any future dedicated query plane is regenerated from published artifacts and composed world models
"""


def build() -> None:
    bundle = _bundle()
    explainability = _counterparty_bucket_explainability(bundle)
    mapping_path = _trade_to_apra_mapping_path(bundle)
    report_path = query_root() / "trade_to_apra_query_report.md"
    summary_path = query_root() / "trade_to_apra_query_summary.json"

    _write_text(report_path, _report(bundle, explainability, mapping_path))
    _write_json(
        summary_path,
        {
            "query_id": "odd_domain.query.trade_to_apra.v1",
            "lane": "filesystem_first",
            "source_fragment_ref": bundle["trade_fragment"]["fragment_id"],
            "target_fragment_ref": bundle["apra_fragment"]["fragment_id"],
            "explainability": explainability,
            "mapping_path": mapping_path,
            "future_query_plane_seam": "published domain artifacts / composed world models -> regenerated query plane",
        },
    )


def main() -> int:
    build()
    print(query_root())
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
