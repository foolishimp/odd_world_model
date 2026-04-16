# Implements: REQ-ODD-DOMAIN-BUILD-CAP-001
# Implements: REQ-ODD-DOMAIN-BUILD-CAP-006
# Implements: REQ-ODD-DOMAIN-WORLD-OBJECT-004
# Implements: REQ-ODD-DOMAIN-WORLD-OBJECT-010
"""Bounded FpML confirmation-view parsing for the first trade lane."""

from __future__ import annotations

import xml.etree.ElementTree as ET
from pathlib import Path
from typing import Any


def _local_name(tag: str) -> str:
    if tag.startswith("{"):
        return tag.split("}", 1)[1]
    return tag


def _namespace(root: ET.Element) -> dict[str, str]:
    if root.tag.startswith("{"):
        return {"fpml": root.tag[1:].split("}", 1)[0]}
    return {"fpml": ""}


def _find(element: ET.Element, path: str, ns: dict[str, str]) -> ET.Element | None:
    if ns["fpml"]:
        return element.find(path, ns)
    cleaned = path.replace("fpml:", "")
    return element.find(cleaned)


def _findall(element: ET.Element, path: str, ns: dict[str, str]) -> list[ET.Element]:
    if ns["fpml"]:
        return list(element.findall(path, ns))
    cleaned = path.replace("fpml:", "")
    return list(element.findall(cleaned))


def _text(element: ET.Element | None) -> str | None:
    if element is None or element.text is None:
        return None
    return element.text.strip()


def _text_at(element: ET.Element | None, ns: dict[str, str], *paths: str) -> str | None:
    if element is None:
        return None
    for path in paths:
        value = _text(_find(element, path, ns))
        if value:
            return value
    return None


def _extract_leg(element: ET.Element, ns: dict[str, str], *, index: int) -> dict[str, Any]:
    leg_kind = _local_name(element.tag)
    leg_id = element.attrib.get("id") or f"{leg_kind.lower()}_{index:02d}"
    calculation_schedule_ref = None
    direct_schedule_ref = _find(element, "fpml:calculationPeriodsScheduleReference", ns)
    if direct_schedule_ref is not None:
        calculation_schedule_ref = direct_schedule_ref.attrib.get("href")
    pricing_schedule_ref = _find(
        element,
        "fpml:calculation/fpml:pricingDates/fpml:calculationPeriodsScheduleReference",
        ns,
    )
    if calculation_schedule_ref is None and pricing_schedule_ref is not None:
        calculation_schedule_ref = pricing_schedule_ref.attrib.get("href")

    payer_ref = _find(element, "fpml:payerPartyReference", ns)
    receiver_ref = _find(element, "fpml:receiverPartyReference", ns)
    return {
        "leg_id": leg_id,
        "leg_kind": leg_kind,
        "payer_party_ref": payer_ref.attrib.get("href") if payer_ref is not None else "",
        "receiver_party_ref": receiver_ref.attrib.get("href") if receiver_ref is not None else "",
        "quantity": _text_at(element, ns, "fpml:notionalQuantity/fpml:quantity"),
        "quantity_unit": _text_at(element, ns, "fpml:notionalQuantity/fpml:quantityUnit"),
        "quantity_frequency": _text_at(
            element,
            ns,
            "fpml:notionalQuantity/fpml:quantityFrequency",
        ),
        "total_notional_quantity": _text_at(element, ns, "fpml:totalNotionalQuantity"),
        "fixed_price": _text_at(element, ns, "fpml:fixedPrice/fpml:price"),
        "price_currency": _text_at(element, ns, "fpml:fixedPrice/fpml:priceCurrency"),
        "price_unit": _text_at(element, ns, "fpml:fixedPrice/fpml:priceUnit"),
        "commodity_instrument_id": _text_at(
            element,
            ns,
            "fpml:commodity/fpml:instrumentId",
        ),
        "calculation_schedule_ref": calculation_schedule_ref or "",
    }


def parse_fpml_trade(path: Path) -> dict[str, Any]:
    tree = ET.parse(path)
    root = tree.getroot()
    ns = _namespace(root)

    trade = _find(root, "fpml:trade", ns)
    if trade is None and root.tag.endswith("trade"):
        trade = root
    if trade is None:
        raise ValueError(f"{path}: missing trade element")

    trade_header = _find(trade, "fpml:tradeHeader", ns)
    if trade_header is None:
        raise ValueError(f"{path}: missing tradeHeader")

    trade_ids = [
        trade_id
        for identifier in _findall(trade_header, "fpml:partyTradeIdentifier", ns)
        if (trade_id := _text(_find(identifier, "fpml:tradeId", ns)))
    ]
    trade_id = trade_ids[0] if trade_ids else None
    trade_date = _text(_find(trade_header, "fpml:tradeDate", ns))

    commodity_swap = _find(trade, "fpml:commoditySwap", ns)
    if commodity_swap is None:
        raise ValueError(f"{path}: missing commoditySwap")

    product_type = _text(_find(commodity_swap, "fpml:productType", ns))
    product_id = _text(_find(commodity_swap, "fpml:productId", ns))
    asset_class = _text_at(
        commodity_swap,
        ns,
        "fpml:primaryAssetClass",
        "fpml:assetClass",
    )
    effective_date = _text_at(
        commodity_swap,
        ns,
        "fpml:effectiveDate/fpml:adjustableDate/fpml:unadjustedDate",
        "fpml:effectiveDate",
    )
    termination_date = _text_at(
        commodity_swap,
        ns,
        "fpml:terminationDate/fpml:adjustableDate/fpml:unadjustedDate",
        "fpml:terminationDate",
    )

    party_refs: list[str] = []
    for element in _findall(commodity_swap, ".//fpml:payerPartyReference", ns):
        href = element.attrib.get("href")
        if href and href not in party_refs:
            party_refs.append(href)
    for element in _findall(commodity_swap, ".//fpml:receiverPartyReference", ns):
        href = element.attrib.get("href")
        if href and href not in party_refs:
            party_refs.append(href)

    parties: list[dict[str, str]] = []
    for party in _findall(root, "fpml:party", ns):
        party_xml_id = party.attrib.get("id", "")
        party_id = _text(_find(party, "fpml:partyId", ns)) or party_xml_id
        party_name = _text(_find(party, "fpml:partyName", ns)) or party_id
        parties.append(
            {
                "xml_id": party_xml_id,
                "party_id": party_id,
                "party_name": party_name,
            }
        )

    legs = [
        _extract_leg(element, ns, index=index)
        for index, element in enumerate(list(commodity_swap), start=1)
        if _local_name(element.tag).endswith("Leg")
    ]

    documentation = _find(trade, "fpml:documentation", ns)
    master_agreement = _find(documentation, "fpml:masterAgreement", ns) if documentation is not None else None

    agreement = {
        "type": _text(_find(master_agreement, "fpml:masterAgreementType", ns)),
        "date": _text(_find(master_agreement, "fpml:masterAgreementDate", ns)),
        "version": _text(_find(master_agreement, "fpml:masterAgreementVersion", ns)),
    }

    return {
        "source_standard": "FpML",
        "source_view": "confirmation",
        "fpml_version": root.attrib.get("fpmlVersion", ""),
        "trade_xml_id": trade.attrib.get("id", ""),
        "trade_id": trade_id or "",
        "trade_identifiers": trade_ids,
        "trade_date": trade_date or "",
        "product": {
            "product_xml_id": commodity_swap.attrib.get("id", ""),
            "product_type": product_type or "",
            "product_id": product_id or "",
            "asset_class": asset_class or "",
            "effective_date": effective_date or "",
            "termination_date": termination_date or "",
            "legs": legs,
            "leg_count": len(legs),
        },
        "party_refs": party_refs,
        "parties": parties,
        "agreement": agreement,
    }
