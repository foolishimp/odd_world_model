"""Generic topology-aware mapping line over the retained example domains."""

from __future__ import annotations

import json
import re
import shutil
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Iterable

from odd_world_model.examples_layout import (
    ACTIVE_SANDBOX_VERSION,
    APRA_LIQUIDITY_MODEL,
    BANKING_PRODUCT_MODEL,
    TRADE_REPRESENTATION_MODEL,
    TRADE_SOURCE_MODEL,
    apra_liquidity_sandbox_root,
    banking_product_sandbox_root,
    trade_representation_sandbox_root,
    trade_source_sandbox_root,
)
from odd_world_model.world_model.load import load_json, resolve_ref
from odd_world_model.world_model.registry import project_root


TOKEN_RE = re.compile(r"[A-Za-z0-9]+")
CAMEL_RE = re.compile(r"([a-z0-9])([A-Z])")

STOPWORDS = {
    "a",
    "an",
    "and",
    "are",
    "as",
    "at",
    "basis",
    "bounded",
    "built",
    "by",
    "candidate",
    "claims",
    "configured",
    "cross",
    "current",
    "cut",
    "domain",
    "downstream",
    "evidence",
    "example",
    "examples",
    "external",
    "first",
    "for",
    "from",
    "governed",
    "input",
    "inside",
    "internal",
    "local",
    "model",
    "object",
    "objects",
    "odd",
    "odd_world_model",
    "of",
    "over",
    "publication",
    "published",
    "recovered",
    "ref",
    "refs",
    "remains",
    "retained",
    "sandbox",
    "semantic",
    "semantics",
    "source",
    "surface",
    "surfaces",
    "that",
    "the",
    "this",
    "through",
    "used",
    "v1",
    "view",
    "world",
}

TOKEN_NORMALIZATION = {
    "agreementtreatmentbasis": "agreement",
    "apraagreementtreatmentbasis": "agreement",
    "apracounterpartybucket": "party",
    "apraliquidityreportingposition": "reporting",
    "bankingproductcatalog": "catalog",
    "commodityswap": "commodityswap",
    "confirmationview": "confirmation",
    "counterparty": "party",
    "creditcard": "card",
    "depositaccount": "deposit",
    "documentation": "agreement",
    "financialinstitution": "bank",
    "fpml": "fpml",
    "loanorcredit": "loan",
    "masteragreement": "agreement",
    "mortgageloan": "mortgage",
    "reportingposition": "reporting",
    "tradepartyprofile": "party",
}

CONCEPT_DEFINITIONS: tuple[dict[str, Any], ...] = (
    {
        "concept_id": "odd_world_model.concept.four_domain.trade_lifecycle_surface.v1",
        "tag": "trade_lifecycle_surface",
        "label": "Trade Lifecycle Surface",
        "summary": "Trade capture, interpreted trade state, and downstream regulatory position aligned through shared lifecycle and treatment structure.",
        "boundary_kind": "hierarchical",
    },
    {
        "concept_id": "odd_world_model.concept.four_domain.financial_product_surface.v1",
        "tag": "financial_product_surface",
        "label": "Financial Product Surface",
        "summary": "Product-like objects that express instrument, catalog, or classification meaning across trade, regulatory, and banking domains.",
        "boundary_kind": "intersectional",
    },
    {
        "concept_id": "odd_world_model.concept.four_domain.party_qualification_surface.v1",
        "tag": "party_qualification_surface",
        "label": "Party Qualification Surface",
        "summary": "Party or counterparty semantics that are preserved locally and reclassified downstream.",
        "boundary_kind": "intersectional",
    },
    {
        "concept_id": "odd_world_model.concept.four_domain.agreement_governance_surface.v1",
        "tag": "agreement_governance_surface",
        "label": "Agreement Governance Surface",
        "summary": "Agreement semantics that move from local contract reference into downstream treatment basis.",
        "boundary_kind": "intersectional",
    },
)

ENVELOPE_BOUNDARY_ID = "odd_world_model.boundary_candidate.four_domain.financial_instrument_envelope.v1"

DOMAIN_ORDER = {
    "trade_source_model": 0,
    "trade_representation_model": 1,
    "banking_product_model": 2,
    "apra_liquidity_model": 3,
}


@dataclass(frozen=True)
class DomainSpec:
    domain_key: str
    example_name: str
    fragment_slug: str
    published_root: Path


@dataclass(frozen=True)
class PublishedObject:
    domain_key: str
    example_name: str
    fragment_id: str
    bounded_context: str
    domain_root: Path
    path: Path
    payload: dict[str, Any]
    attribute_entries: tuple[dict[str, Any], ...]
    tokens: frozenset[str]
    alias_tokens: frozenset[str]
    concept_tags: frozenset[str]
    topology_signature: dict[str, Any]

    @property
    def object_id(self) -> str:
        return self.payload["object_id"]

    @property
    def object_kind(self) -> str:
        return self.payload["object_kind"]


def mapping_root() -> Path:
    return project_root() / "mapping" / "four_domain_topology"


def analysis_path() -> Path:
    return mapping_root() / "analysis" / "four_domain_topology_mapping_analysis.json"


def record_path() -> Path:
    return mapping_root() / "records" / "four_domain_topology_mapping_record.json"


def report_path() -> Path:
    return mapping_root() / "reports" / "four_domain_topology_mapping_report.md"


def _write_json(path: Path, payload: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8") as handle:
        json.dump(payload, handle, indent=2)
        handle.write("\n")


def _write_text(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")


def _reset_outputs() -> None:
    shutil.rmtree(mapping_root(), ignore_errors=True)


def _domain_specs() -> tuple[DomainSpec, ...]:
    return (
        DomainSpec(
            domain_key="trade_source",
            example_name=TRADE_SOURCE_MODEL,
            fragment_slug="fpml_confirmation_source_domain",
            published_root=trade_source_sandbox_root() / "published" / "fpml_confirmation_source_domain",
        ),
        DomainSpec(
            domain_key="trade_representation",
            example_name=TRADE_REPRESENTATION_MODEL,
            fragment_slug="trade_representation_domain",
            published_root=trade_representation_sandbox_root() / "published" / "trade_representation_domain",
        ),
        DomainSpec(
            domain_key="apra_liquidity",
            example_name=APRA_LIQUIDITY_MODEL,
            fragment_slug="apra_liquidity_domain",
            published_root=apra_liquidity_sandbox_root() / "published" / "apra_liquidity_domain",
        ),
        DomainSpec(
            domain_key="banking_product",
            example_name=BANKING_PRODUCT_MODEL,
            fragment_slug="banking_product_domain",
            published_root=banking_product_sandbox_root() / "published" / "banking_product_domain",
        ),
    )


def _collect_strings(value: Any) -> Iterable[str]:
    if isinstance(value, str):
        yield value
        return
    if isinstance(value, dict):
        for item in value.values():
            yield from _collect_strings(item)
        return
    if isinstance(value, (list, tuple)):
        for item in value:
            yield from _collect_strings(item)


def _tokenize_text(text: str) -> list[str]:
    expanded = CAMEL_RE.sub(r"\1 \2", text)
    parts = TOKEN_RE.findall(expanded)
    tokens: list[str] = []
    for part in parts:
        token = TOKEN_NORMALIZATION.get(part.lower(), part.lower())
        if token in STOPWORDS:
            continue
        if len(token) == 1 and not token.isdigit():
            continue
        tokens.append(token)
    return tokens


def _tokenize_values(values: Iterable[str]) -> frozenset[str]:
    tokens: set[str] = set()
    for value in values:
        tokens.update(_tokenize_text(value))
    return frozenset(tokens)


def _attribute_entries(domain_root: Path, payload: dict[str, Any]) -> tuple[dict[str, Any], ...]:
    materialization = payload.get("materialization", {})
    refs = materialization.get("attribute_ledger_entry_refs", [])
    if not isinstance(refs, list):
        return ()
    entries: list[dict[str, Any]] = []
    for ref in refs:
        if not isinstance(ref, str):
            continue
        try:
            path = resolve_ref(domain_root, ref)
        except RuntimeError:
            continue
        if path.exists() and path.is_file():
            entries.append(load_json(path))
    return tuple(entries)


def _concept_tags(payload: dict[str, Any], tokens: frozenset[str], attribute_entries: tuple[dict[str, Any], ...]) -> frozenset[str]:
    tags: set[str] = set()
    object_kind = payload.get("object_kind", "").lower()
    claim_keys = {entry.get("claim_key", "") for entry in attribute_entries}
    if any(token in object_kind for token in ("trade", "record", "position", "contract")) or {
        "trade",
        "contract",
    } <= tokens:
        tags.add("trade_lifecycle_surface")
    if (
        any(token in object_kind for token in ("product", "loan", "mortgage", "deposit", "card", "catalog"))
        or ("commodityswap" in object_kind and "source" in object_kind)
        or ("commodityswap" in tokens and "source" in tokens)
        or "liquidity_bucket" in claim_keys
        or (any(token in object_kind for token in ("reporting", "position")) and "product" in tokens)
    ):
        tags.add("financial_product_surface")
    if any(token in object_kind for token in ("party", "counterparty")) or (
        any(token in object_kind for token in ("reporting", "position")) and {"party", "counterparty", "bank"} & tokens
    ):
        tags.add("party_qualification_surface")
    if any(token in object_kind for token in ("agreement",)) or (
        any(token in object_kind for token in ("reporting", "position")) and {"agreement", "isda"} & tokens
    ):
        tags.add("agreement_governance_surface")
    return frozenset(tags)


def _topology_signature(payload: dict[str, Any], attribute_entries: tuple[dict[str, Any], ...]) -> dict[str, Any]:
    boundary = payload.get("boundary", {})
    blanket = payload.get("blanket", {})
    composition = payload.get("composition", {})
    cross_domain = payload.get("cross_domain", {})
    state = payload.get("state", {})
    return {
        "is_markov": payload.get("schema_kind") == "odd_world_model.markov_object",
        "parent_count": len(composition.get("parent_object_refs", []) or []),
        "child_count": len(composition.get("child_object_refs", []) or []),
        "adjacent_object_count": len(boundary.get("adjacent_objects", []) or []),
        "adjacent_domain_count": len(boundary.get("adjacent_domains", []) or []),
        "treatment_count": len(cross_domain.get("treatment_refs", []) or []),
        "covariance_count": len(cross_domain.get("covariance_edge_refs", []) or []),
        "adjoint_count": len(cross_domain.get("adjoint_mapping_refs", []) or []),
        "ingress_count": len(blanket.get("ingress_surfaces", []) or []),
        "egress_count": len(blanket.get("egress_surfaces", []) or []),
        "control_count": len(blanket.get("control_surfaces", []) or []),
        "attribute_count": len(attribute_entries),
        "lifecycle_state": state.get("lifecycle_state"),
        "ambiguity_status": state.get("ambiguity_status"),
    }


def _load_object(spec: DomainSpec, fragment: dict[str, Any], path: Path) -> PublishedObject:
    payload = load_json(path)
    attribute_entries = _attribute_entries(spec.published_root, payload)
    token_values = [
        payload.get("object_id", ""),
        payload.get("object_kind", ""),
        payload.get("bounded_context", ""),
        payload.get("semantic_role", ""),
        *list(_collect_strings(payload.get("identity", {}))),
        *list(_collect_strings(payload.get("boundary", {}))),
        *list(_collect_strings(payload.get("blanket", {}))),
        *list(_collect_strings(payload.get("state", {}))),
        *list(_collect_strings(payload.get("constraints", {}))),
        *list(_collect_strings(payload.get("evidence", {}))),
        *list(_collect_strings(payload.get("cross_domain", {}))),
    ]
    token_values.extend(string for entry in attribute_entries for string in _collect_strings(entry))
    alias_values = list(_collect_strings(payload.get("identity", {}).get("aliases", [])))
    for entry in attribute_entries:
        alias_values.extend(_collect_strings(entry.get("qualifiers", {})))
        value = entry.get("value")
        if isinstance(value, str):
            alias_values.append(value)
    tokens = _tokenize_values(token_values)
    alias_tokens = _tokenize_values(alias_values)
    return PublishedObject(
        domain_key=spec.domain_key,
        example_name=spec.example_name,
        fragment_id=fragment["fragment_id"],
        bounded_context=fragment["bounded_context"],
        domain_root=spec.published_root,
        path=path,
        payload=payload,
        attribute_entries=attribute_entries,
        tokens=tokens,
        alias_tokens=alias_tokens,
        concept_tags=_concept_tags(payload, tokens | alias_tokens, attribute_entries),
        topology_signature=_topology_signature(payload, attribute_entries),
    )


def _load_domains() -> tuple[list[dict[str, Any]], list[PublishedObject]]:
    domains: list[dict[str, Any]] = []
    objects: list[PublishedObject] = []
    for spec in _domain_specs():
        fragment = load_json(spec.published_root / "fragment.json")
        object_paths = sorted((spec.published_root / "objects").glob("*.json"))
        domain_payload = {
            "domain_key": spec.domain_key,
            "example_name": spec.example_name,
            "fragment_id": fragment["fragment_id"],
            "bounded_context": fragment["bounded_context"],
            "published_root": str(spec.published_root),
            "sandbox_version": ACTIVE_SANDBOX_VERSION,
            "object_count": len(object_paths),
        }
        domains.append(domain_payload)
        for path in object_paths:
            objects.append(_load_object(spec, fragment, path))
    return domains, objects


def _jaccard(left: frozenset[str], right: frozenset[str]) -> float:
    if not left or not right:
        return 0.0
    overlap = len(left & right)
    union = len(left | right)
    if union == 0:
        return 0.0
    return overlap / union


def _topology_similarity(left: PublishedObject, right: PublishedObject) -> float:
    comparable_keys = (
        "parent_count",
        "child_count",
        "adjacent_object_count",
        "adjacent_domain_count",
        "treatment_count",
        "covariance_count",
        "adjoint_count",
        "ingress_count",
        "egress_count",
        "control_count",
        "attribute_count",
    )
    similarities: list[float] = []
    for key in comparable_keys:
        left_value = left.topology_signature[key]
        right_value = right.topology_signature[key]
        denominator = max(left_value, right_value, 1)
        similarities.append(1.0 - abs(left_value - right_value) / denominator)
    similarities.append(1.0 if left.topology_signature["is_markov"] == right.topology_signature["is_markov"] else 0.0)
    similarities.append(
        1.0 if left.topology_signature["lifecycle_state"] == right.topology_signature["lifecycle_state"] else 0.0
    )
    return round(sum(similarities) / len(similarities), 4)


def _direct_reference_support(left: PublishedObject, right: PublishedObject) -> tuple[float, list[str]]:
    reasons: list[str] = []
    score = 0.0
    left_adjacent = set(left.payload.get("boundary", {}).get("adjacent_objects", []) or [])
    right_adjacent = set(right.payload.get("boundary", {}).get("adjacent_objects", []) or [])
    if right.object_id in left_adjacent or left.object_id in right_adjacent:
        score += 0.7
        reasons.append("published adjacency directly references the paired object")

    right_context = right.bounded_context
    left_context = left.bounded_context
    left_adjacent_domains = " ".join(left.payload.get("boundary", {}).get("adjacent_domains", []) or [])
    right_adjacent_domains = " ".join(right.payload.get("boundary", {}).get("adjacent_domains", []) or [])
    if any(token in left_adjacent_domains for token in right_context.split(".")) or any(
        token in right_adjacent_domains for token in left_context.split(".")
    ):
        score += 0.3
        reasons.append("adjacent-domain placement points at the paired bounded context")

    left_evidence = " ".join(left.payload.get("evidence", {}).get("refs", []) or [])
    right_evidence = " ".join(right.payload.get("evidence", {}).get("refs", []) or [])
    if right.example_name in left_evidence or left.example_name in right_evidence:
        score += 0.25
        reasons.append("evidence refs already cross the paired example boundary")

    return min(score, 1.0), reasons


def _identifier_support(left: PublishedObject, right: PublishedObject) -> tuple[float, list[str]]:
    shared_aliases = left.alias_tokens & right.alias_tokens
    reasons: list[str] = []
    score = 0.0
    if any(token.isdigit() for token in shared_aliases):
        score += 0.7
        reasons.append("shared stable identifier values anchor the correspondence")
    if {"trade", "agreement", "party", "product"} & shared_aliases:
        score += 0.3
        reasons.append("shared identifier semantics survive across the paired objects")
    return min(score, 1.0), reasons


def _confidence_band(score: float) -> str:
    if score >= 0.82:
        return "confirmed"
    if score >= 0.68:
        return "strong"
    if score >= 0.54:
        return "moderate"
    if score >= 0.42:
        return "weak"
    return "rejected"


def _mapping_category(left: PublishedObject, right: PublishedObject, score: float) -> str:
    shared_concepts = left.concept_tags & right.concept_tags
    domains = {left.example_name, right.example_name}
    if domains == {TRADE_SOURCE_MODEL, TRADE_REPRESENTATION_MODEL}:
        return "constrained_equivalence"
    if APRA_LIQUIDITY_MODEL in domains:
        if "agreement_governance_surface" in shared_concepts or "party_qualification_surface" in shared_concepts:
            return "treatment_projection"
        if "financial_product_surface" in shared_concepts or "trade_lifecycle_surface" in shared_concepts:
            return "derived_mapping"
    if BANKING_PRODUCT_MODEL in domains and "financial_product_surface" in shared_concepts:
        return "reference_alignment"
    if score >= 0.68:
        return "constrained_equivalence"
    return "reference_alignment"


def _directionality(left: PublishedObject, right: PublishedObject, category: str) -> tuple[PublishedObject, PublishedObject, str]:
    if category in {"constrained_equivalence", "reference_alignment"}:
        if DOMAIN_ORDER[left.example_name] <= DOMAIN_ORDER[right.example_name]:
            return left, right, "bidirectional"
        return right, left, "bidirectional"
    if DOMAIN_ORDER[left.example_name] <= DOMAIN_ORDER[right.example_name]:
        return left, right, "source_to_target"
    return right, left, "source_to_target"


def _object_candidates(objects: list[PublishedObject]) -> list[dict[str, Any]]:
    candidates: list[dict[str, Any]] = []
    for index, left in enumerate(objects):
        for right in objects[index + 1 :]:
            if left.example_name == right.example_name:
                continue
            token_similarity = _jaccard(left.tokens, right.tokens)
            alias_similarity = _jaccard(left.alias_tokens, right.alias_tokens)
            concept_similarity = _jaccard(left.concept_tags, right.concept_tags)
            topology_similarity = _topology_similarity(left, right)
            direct_support, direct_reasons = _direct_reference_support(left, right)
            identifier_support, identifier_reasons = _identifier_support(left, right)
            score = round(
                (0.25 * token_similarity)
                + (0.10 * alias_similarity)
                + (0.20 * concept_similarity)
                + (0.10 * topology_similarity)
                + (0.20 * direct_support)
                + (0.15 * identifier_support),
                4,
            )
            category = _mapping_category(left, right, score)
            source, target, directionality = _directionality(left, right, category)
            candidate = {
                "mapping_id": f"odd_world_model.mapping_candidate.{source.example_name}.to.{target.example_name}.{source.path.stem}.to.{target.path.stem}.v1",
                "source_domain_ref": source.fragment_id,
                "target_domain_ref": target.fragment_id,
                "source_object_ref": source.object_id,
                "target_object_ref": target.object_id,
                "directionality": directionality,
                "category": category,
                "confidence_band": _confidence_band(score),
                "confidence_score": score,
                "shared_tokens": sorted((left.tokens & right.tokens) - STOPWORDS),
                "shared_alias_tokens": sorted(left.alias_tokens & right.alias_tokens),
                "shared_concepts": sorted(left.concept_tags & right.concept_tags),
                "score_components": {
                    "token_similarity": round(token_similarity, 4),
                    "alias_similarity": round(alias_similarity, 4),
                    "concept_similarity": round(concept_similarity, 4),
                    "topology_similarity": topology_similarity,
                    "direct_reference_support": round(direct_support, 4),
                    "identifier_support": round(identifier_support, 4),
                },
                "confidence_rationale": [
                    *(["shared semantic tokens anchor the correspondence"] if token_similarity >= 0.15 else []),
                    *(["shared aliases or qualifier values anchor the correspondence"] if alias_similarity >= 0.10 else []),
                    *(["shared higher-order concept tags place the objects in the same semantic family"] if concept_similarity > 0 else []),
                    *(["topology and constructive shape are materially similar"] if topology_similarity >= 0.55 else []),
                    *direct_reasons,
                    *identifier_reasons,
                ],
                "ambiguity_notes": [],
                "declared_loss": sorted(
                    {
                        *left.payload.get("cross_domain", {}).get("loss_notes", []),
                        *right.payload.get("cross_domain", {}).get("loss_notes", []),
                    }
                ),
            }
            if not candidate["confidence_rationale"]:
                candidate["confidence_rationale"].append(
                    "semantic support is present but still bounded; correspondence remains review-grade."
                )
            candidates.append(candidate)
    candidates.sort(key=lambda item: item["confidence_score"], reverse=True)
    return candidates


def _select_object_mappings(candidates: list[dict[str, Any]]) -> list[dict[str, Any]]:
    selected: list[dict[str, Any]] = []
    counts: dict[str, int] = {}
    per_domain_pair: dict[tuple[str, str], int] = {}
    for candidate in candidates:
        if candidate["confidence_score"] < 0.44:
            continue
        key = tuple(sorted((candidate["source_domain_ref"], candidate["target_domain_ref"])))
        source_ref = candidate["source_object_ref"]
        target_ref = candidate["target_object_ref"]
        if counts.get(source_ref, 0) >= 3 or counts.get(target_ref, 0) >= 3:
            continue
        if per_domain_pair.get(key, 0) >= 5:
            continue
        if candidate["confidence_band"] == "weak" and not candidate["shared_concepts"]:
            continue
        selected.append(candidate)
        counts[source_ref] = counts.get(source_ref, 0) + 1
        counts[target_ref] = counts.get(target_ref, 0) + 1
        per_domain_pair[key] = per_domain_pair.get(key, 0) + 1
    return selected


def _entry_tokens(entry: dict[str, Any]) -> frozenset[str]:
    return _tokenize_values(_collect_strings(entry))


def _attribute_category(object_category: str, source_entry: dict[str, Any], target_entry: dict[str, Any]) -> str:
    if object_category == "treatment_projection":
        return "treatment_projection"
    if object_category == "derived_mapping":
        return "derived_mapping"
    if "id" in source_entry["claim_key"] and "id" in target_entry["claim_key"]:
        return "reference_alignment"
    if source_entry["claim_key"] == target_entry["claim_key"]:
        return "exact_identity"
    return object_category


def _attribute_candidates(
    objects_by_id: dict[str, PublishedObject],
    selected_object_mappings: list[dict[str, Any]],
) -> list[dict[str, Any]]:
    candidates: list[dict[str, Any]] = []
    for object_mapping in selected_object_mappings:
        source_object = objects_by_id[object_mapping["source_object_ref"]]
        target_object = objects_by_id[object_mapping["target_object_ref"]]
        if not source_object.attribute_entries or not target_object.attribute_entries:
            continue
        for source_entry in source_object.attribute_entries:
            source_tokens = _entry_tokens(source_entry)
            for target_entry in target_object.attribute_entries:
                target_tokens = _entry_tokens(target_entry)
                token_similarity = _jaccard(source_tokens, target_tokens)
                qualifier_similarity = _jaccard(
                    _tokenize_values(_collect_strings(source_entry.get("qualifiers", {}))),
                    _tokenize_values(_collect_strings(target_entry.get("qualifiers", {}))),
                )
                score = round(
                    (0.55 * token_similarity)
                    + (0.20 * qualifier_similarity)
                    + (0.25 * object_mapping["confidence_score"]),
                    4,
                )
                if score < 0.34:
                    continue
                category = _attribute_category(object_mapping["category"], source_entry, target_entry)
                candidates.append(
                    {
                        "mapping_id": f"odd_world_model.attribute_mapping.{source_entry['claim_key']}.to.{target_entry['claim_key']}.v1",
                        "source_object_ref": source_object.object_id,
                        "source_attribute_ref": source_entry["entry_id"],
                        "source_claim_key": source_entry["claim_key"],
                        "target_object_ref": target_object.object_id,
                        "target_attribute_ref": target_entry["entry_id"],
                        "target_claim_key": target_entry["claim_key"],
                        "category": category,
                        "directionality": object_mapping["directionality"],
                        "confidence_band": _confidence_band(score),
                        "confidence_score": score,
                        "supporting_object_mapping_ref": object_mapping["mapping_id"],
                        "confidence_rationale": [
                            "attribute claim tokens align across the paired objects",
                            "object-level correspondence already places the objects in a lawful mapping path",
                        ],
                        "ambiguity_notes": [],
                        "declared_loss": sorted(
                            {
                                *object_mapping.get("declared_loss", []),
                                *([] if score >= 0.54 else ["attribute-level semantic narrowing remains partially unresolved"]),
                            }
                        ),
                    }
                )
    candidates.sort(key=lambda item: item["confidence_score"], reverse=True)
    selected: list[dict[str, Any]] = []
    seen_sources: set[str] = set()
    for candidate in candidates:
        if candidate["source_attribute_ref"] in seen_sources and candidate["confidence_score"] < 0.62:
            continue
        selected.append(candidate)
        seen_sources.add(candidate["source_attribute_ref"])
    return selected


def _concept_syntheses(
    objects: list[PublishedObject],
    selected_object_mappings: list[dict[str, Any]],
) -> list[dict[str, Any]]:
    mappings_by_object: dict[str, set[str]] = {}
    for mapping in selected_object_mappings:
        mappings_by_object.setdefault(mapping["source_object_ref"], set()).add(mapping["mapping_id"])
        mappings_by_object.setdefault(mapping["target_object_ref"], set()).add(mapping["mapping_id"])

    syntheses: list[dict[str, Any]] = []
    for definition in CONCEPT_DEFINITIONS:
        members = [obj for obj in objects if definition["tag"] in obj.concept_tags]
        domain_refs = sorted({obj.fragment_id for obj in members})
        if len(domain_refs) < 2:
            continue
        supporting_mapping_refs = sorted(
            {
                mapping_id
                for obj in members
                for mapping_id in mappings_by_object.get(obj.object_id, set())
            }
        )
        support_ratio = len(supporting_mapping_refs) / max(len(members), 1)
        confidence_score = round(min(1.0, (0.35 * (len(domain_refs) / 4.0)) + (0.35 * support_ratio) + 0.30), 4)
        syntheses.append(
            {
                "concept_id": definition["concept_id"],
                "label": definition["label"],
                "boundary_kind": definition["boundary_kind"],
                "domain_refs": domain_refs,
                "member_object_refs": [obj.object_id for obj in members],
                "inference_basis": [
                    "shared topology-aware concept tags across published domains",
                    "repeated correspondence structure over the retained example domains",
                ],
                "supporting_mapping_refs": supporting_mapping_refs,
                "confidence_band": _confidence_band(confidence_score),
                "confidence_score": confidence_score,
                "semantic_summary": definition["summary"],
                "declared_loss": sorted(
                    {
                        note
                        for obj in members
                        for note in obj.payload.get("cross_domain", {}).get("loss_notes", [])
                    }
                ),
                "ambiguity_notes": [],
            }
        )
    syntheses.sort(key=lambda item: item["concept_id"])
    return syntheses


def _boundary_candidates(
    objects_by_id: dict[str, PublishedObject],
    concepts: list[dict[str, Any]],
) -> list[dict[str, Any]]:
    boundaries: list[dict[str, Any]] = []
    concept_boundary_ids: list[str] = []
    for concept in concepts:
        boundary_id = concept["concept_id"].replace("odd_world_model.concept", "odd_world_model.boundary_candidate")
        concept_boundary_ids.append(boundary_id)
        members = [objects_by_id[object_ref] for object_ref in concept["member_object_refs"]]
        boundaries.append(
            {
                "boundary_id": boundary_id,
                "boundary_kind": concept["boundary_kind"],
                "semantic_role": concept["label"],
                "member_object_refs": concept["member_object_refs"],
                "member_concept_refs": [concept["concept_id"]],
                "domain_refs": concept["domain_refs"],
                "parent_boundary_refs": [ENVELOPE_BOUNDARY_ID],
                "overlap_boundary_refs": [],
                "supporting_mapping_refs": concept["supporting_mapping_refs"],
                "ingress_surfaces": sorted(
                    {
                        surface
                        for obj in members
                        for surface in obj.payload.get("blanket", {}).get("ingress_surfaces", []) or []
                    }
                ),
                "egress_surfaces": sorted(
                    {
                        surface
                        for obj in members
                        for surface in obj.payload.get("blanket", {}).get("egress_surfaces", []) or []
                    }
                ),
                "confidence_band": concept["confidence_band"],
                "confidence_score": concept["confidence_score"],
                "semantic_summary": concept["semantic_summary"],
                "declared_loss": concept["declared_loss"],
                "ambiguity_notes": concept["ambiguity_notes"],
            }
        )

    for index, boundary in enumerate(boundaries):
        overlaps: list[str] = []
        member_refs = set(boundary["member_object_refs"])
        for other in boundaries[index + 1 :]:
            if member_refs & set(other["member_object_refs"]):
                overlaps.append(other["boundary_id"])
                other["overlap_boundary_refs"].append(boundary["boundary_id"])
        boundary["overlap_boundary_refs"] = sorted(overlaps)

    envelope_member_refs = sorted({ref for boundary in boundaries for ref in boundary["member_object_refs"]})
    envelope_domain_refs = sorted({ref for boundary in boundaries for ref in boundary["domain_refs"]})
    envelope_confidence = round(
        sum(boundary["confidence_score"] for boundary in boundaries) / max(len(boundaries), 1),
        4,
    )
    boundaries.insert(
        0,
        {
            "boundary_id": ENVELOPE_BOUNDARY_ID,
            "boundary_kind": "hierarchical",
            "semantic_role": "Financial Instrument Envelope",
            "member_object_refs": envelope_member_refs,
            "member_concept_refs": [concept["concept_id"] for concept in concepts],
            "domain_refs": envelope_domain_refs,
            "parent_boundary_refs": [],
            "overlap_boundary_refs": [],
            "supporting_mapping_refs": sorted(
                {
                    mapping_ref
                    for concept in concepts
                    for mapping_ref in concept["supporting_mapping_refs"]
                }
            ),
            "ingress_surfaces": [],
            "egress_surfaces": [],
            "confidence_band": _confidence_band(envelope_confidence),
            "confidence_score": envelope_confidence,
            "semantic_summary": "Higher-order containment envelope over the retained multi-domain trade, regulatory, and banking semantic families.",
            "declared_loss": sorted(
                {
                    note
                    for boundary in boundaries
                    for note in boundary["declared_loss"]
                }
            ),
            "ambiguity_notes": [],
        },
    )
    return boundaries


def _coverage(
    domains: list[dict[str, Any]],
    objects: list[PublishedObject],
    selected_object_mappings: list[dict[str, Any]],
    concepts: list[dict[str, Any]],
) -> dict[str, Any]:
    mapped_object_refs = {
        *[mapping["source_object_ref"] for mapping in selected_object_mappings],
        *[mapping["target_object_ref"] for mapping in selected_object_mappings],
    }
    conceptualized_object_refs = {
        object_ref
        for concept in concepts
        for object_ref in concept["member_object_refs"]
    }
    coverage_rows = []
    for domain in domains:
        domain_objects = [obj for obj in objects if obj.fragment_id == domain["fragment_id"]]
        mapped = [obj.object_id for obj in domain_objects if obj.object_id in mapped_object_refs]
        conceptualized = [obj.object_id for obj in domain_objects if obj.object_id in conceptualized_object_refs]
        coverage_rows.append(
            {
                "domain_ref": domain["fragment_id"],
                "object_refs": [obj.object_id for obj in domain_objects],
                "mapped_object_refs": mapped,
                "unmapped_object_refs": [obj.object_id for obj in domain_objects if obj.object_id not in mapped_object_refs],
                "conceptualized_object_refs": conceptualized,
                "unconceptualized_object_refs": [
                    obj.object_id for obj in domain_objects if obj.object_id not in conceptualized_object_refs
                ],
            }
        )
    return {
        "objects_in_scope": len(objects),
        "mapped_objects": len(mapped_object_refs),
        "conceptualized_objects": len(conceptualized_object_refs),
        "domains": coverage_rows,
    }


def _analysis_payload() -> dict[str, Any]:
    domains, objects = _load_domains()
    objects_by_id = {obj.object_id: obj for obj in objects}
    candidate_object_matches = _object_candidates(objects)
    selected_object_mappings = _select_object_mappings(candidate_object_matches)
    selected_attribute_mappings = _attribute_candidates(objects_by_id, selected_object_mappings)
    concepts = _concept_syntheses(objects, selected_object_mappings)
    boundaries = _boundary_candidates(objects_by_id, concepts)
    coverage = _coverage(domains, objects, selected_object_mappings, concepts)
    return {
        "schema_kind": "odd_world_model.mapping_analysis",
        "schema_version": "v1",
        "analysis_id": "odd_world_model.mapping_analysis.four_domain_topology.v1",
        "mapping_mode": "generic_topology_and_concept_matching",
        "domains_in_scope": domains,
        "matcher_signals": [
            "published object tokens and aliases",
            "attribute-ledger summaries and qualifiers",
            "boundary adjacency and composition",
            "blanket ingress, egress, and control surfaces",
            "treatment, covariance, and adjoint support",
        ],
        "object_inventory": [
            {
                "domain_ref": obj.fragment_id,
                "object_ref": obj.object_id,
                "object_kind": obj.object_kind,
                "bounded_context": obj.bounded_context,
                "concept_tags": sorted(obj.concept_tags),
                "topology_signature": obj.topology_signature,
                "attribute_claim_keys": [entry["claim_key"] for entry in obj.attribute_entries],
                "path": str(obj.path),
            }
            for obj in objects
        ],
        "candidate_object_matches": candidate_object_matches[:20],
        "selected_object_mappings": selected_object_mappings,
        "selected_attribute_mappings": selected_attribute_mappings,
        "concept_candidates": concepts,
        "boundary_candidates": boundaries,
        "coverage": coverage,
        "notes": [
            "Higher-order concepts and boundary candidates remain downstream mapping artifacts until separately ratified.",
            "Operational-semantics enrichment beyond the published blanket/control surfaces remains future work gated on richer source corpora.",
        ],
    }


def build_analysis(*, reset: bool = True) -> dict[str, Any]:
    if reset:
        _reset_outputs()
    analysis = _analysis_payload()
    _write_json(analysis_path(), analysis)
    return analysis


def build_record(*, reset: bool = True) -> dict[str, Any]:
    analysis = build_analysis(reset=reset)
    record = {
        "schema_kind": "odd_world_model.mapping_record",
        "schema_version": "v1",
        "mapping_record_id": "odd_world_model.mapping_record.four_domain_topology.v1",
        "analysis_ref": "mapping://four_domain_topology/analysis/four_domain_topology_mapping_analysis.json",
        "mapping_mode": analysis["mapping_mode"],
        "domain_refs": [domain["fragment_id"] for domain in analysis["domains_in_scope"]],
        "domain_scope": analysis["domains_in_scope"],
        "object_mappings": analysis["selected_object_mappings"],
        "attribute_mappings": analysis["selected_attribute_mappings"],
        "higher_order_concepts": analysis["concept_candidates"],
        "boundary_candidates": analysis["boundary_candidates"],
        "coverage": analysis["coverage"],
        "category_breakdown": {
            category: sum(1 for mapping in analysis["selected_object_mappings"] if mapping["category"] == category)
            for category in sorted({mapping["category"] for mapping in analysis["selected_object_mappings"]})
        },
        "confidence_breakdown": {
            band: sum(1 for mapping in analysis["selected_object_mappings"] if mapping["confidence_band"] == band)
            for band in sorted({mapping["confidence_band"] for mapping in analysis["selected_object_mappings"]})
        },
        "notes": analysis["notes"],
    }
    _write_json(record_path(), record)
    return record


def _report(record: dict[str, Any]) -> str:
    domains = "\n".join(
        f"- `{domain['fragment_id']}` ({domain['example_name']})"
        for domain in record["domain_scope"]
    )
    object_mappings = "\n".join(
        "\n".join(
            [
                f"- `{mapping['source_object_ref']}` -> `{mapping['target_object_ref']}`",
                f"  - category: `{mapping['category']}`",
                f"  - confidence: `{mapping['confidence_band']}` ({mapping['confidence_score']})",
                f"  - shared concepts: {', '.join(f'`{item}`' for item in mapping['shared_concepts']) or 'none'}",
                f"  - rationale: {'; '.join(mapping['confidence_rationale'])}",
            ]
        )
        for mapping in record["object_mappings"]
    )
    attribute_mappings = "\n".join(
        "\n".join(
            [
                f"- `{mapping['source_claim_key']}` -> `{mapping['target_claim_key']}`",
                f"  - category: `{mapping['category']}`",
                f"  - confidence: `{mapping['confidence_band']}` ({mapping['confidence_score']})",
            ]
        )
        for mapping in record["attribute_mappings"]
    ) or "- none retained in this bounded slice"
    concepts = "\n".join(
        "\n".join(
            [
                f"- `{concept['concept_id']}`",
                f"  - label: {concept['label']}",
                f"  - domains: {', '.join(f'`{item}`' for item in concept['domain_refs'])}",
                f"  - members: {', '.join(f'`{item}`' for item in concept['member_object_refs'])}",
                f"  - confidence: `{concept['confidence_band']}` ({concept['confidence_score']})",
            ]
        )
        for concept in record["higher_order_concepts"]
    )
    boundaries = "\n".join(
        "\n".join(
            [
                f"- `{boundary['boundary_id']}`",
                f"  - kind: `{boundary['boundary_kind']}`",
                f"  - parent refs: {', '.join(f'`{item}`' for item in boundary['parent_boundary_refs']) or 'none'}",
                f"  - overlap refs: {', '.join(f'`{item}`' for item in boundary['overlap_boundary_refs']) or 'none'}",
                f"  - members: {', '.join(f'`{item}`' for item in boundary['member_object_refs'])}",
            ]
        )
        for boundary in record["boundary_candidates"]
    )
    coverage = "\n".join(
        "\n".join(
            [
                f"- `{domain['domain_ref']}`",
                f"  - unmapped objects: {', '.join(f'`{item}`' for item in domain['unmapped_object_refs']) or 'none'}",
                f"  - unconceptualized objects: {', '.join(f'`{item}`' for item in domain['unconceptualized_object_refs']) or 'none'}",
            ]
        )
        for domain in record["coverage"]["domains"]
    )
    return "\n".join(
        [
            "# Four-Domain Topology Mapping Report",
            "",
            "## Scope",
            "",
            domains,
            "",
            "## Object Correspondence",
            "",
            object_mappings or "- none retained",
            "",
            "## Attribute Correspondence",
            "",
            attribute_mappings,
            "",
            "## Higher-Order Concepts",
            "",
            concepts or "- none retained",
            "",
            "## Boundary Candidates",
            "",
            boundaries or "- none retained",
            "",
            "## Coverage",
            "",
            coverage,
            "",
            "## Notes",
            "",
            *[f"- {note}" for note in record["notes"]],
            "",
        ]
    )


def build_report(*, reset: bool = True) -> dict[str, Any]:
    record = build_record(reset=reset)
    _write_text(report_path(), _report(record))
    return {
        "analysis_path": str(analysis_path()),
        "record_path": str(record_path()),
        "report_path": str(report_path()),
        "mapping_record_id": record["mapping_record_id"],
    }


def build(*, reset: bool = True) -> dict[str, Any]:
    return build_report(reset=reset)
