import re
from typing import Dict, Any, Optional, Tuple
from datetime import datetime, timezone


class EvidenceNormalizationService:
    """Normalizes raw unstructured scraped financial text into standardized evidence units.
    Handles currency conversion, scale multipliers (Crore, Lakh, Billion, Million), percentages, and dates.
    """

    CURRENCY_SYMBOLS = {
        "₹": "INR",
        "rs": "INR",
        "rs.": "INR",
        "inr": "INR",
        "$": "USD",
        "usd": "USD",
        "€": "EUR",
        "eur": "EUR",
        "£": "GBP",
        "gbp": "GBP",
    }

    MULTIPLIERS = {
        "crore": 10_000_000.0,
        "cr": 10_000_000.0,
        "cr.": 10_000_000.0,
        "lakh": 100_000.0,
        "lac": 100_000.0,
        "billion": 1_000_000_000.0,
        "b": 1_000_000_000.0,
        "bn": 1_000_000_000.0,
        "million": 1_000_000.0,
        "m": 1_000_000.0,
        "mn": 1_000_000.0,
        "trillion": 1_000_000_000_000.0,
        "t": 1_000_000_000_000.0,
        "k": 1_000.0,
        "thousand": 1_000.0,
    }

    def normalize_monetary_value(self, raw_str: str) -> Optional[Dict[str, Any]]:
        """Extracts and normalizes currency and numeric scale from raw string.
        e.g. '₹31.4 crore' -> {'currency': 'INR', 'amount': 314000000.0, 'unit': 'crore', 'display': '₹31.4 Crore'}
        """
        if not raw_str:
            return None

        clean_lower = raw_str.lower().strip()

        # Identify currency
        currency = "INR"
        for symbol, code in self.CURRENCY_SYMBOLS.items():
            if symbol in clean_lower:
                currency = code
                break

        # Extract number
        num_match = re.search(r"(\d+(?:[.,]\d+)?)", clean_lower.replace(",", ""))
        if not num_match:
            return None

        try:
            base_number = float(num_match.group(1))
        except ValueError:
            return None

        # Identify multiplier
        multiplier = 1.0
        unit = "raw"
        for word, factor in self.MULTIPLIERS.items():
            if re.search(rf"\b{word}\b", clean_lower):
                multiplier = factor
                unit = word
                break

        normalized_amount = base_number * multiplier
        display_symbol = "₹" if currency == "INR" else ("$" if currency == "USD" else currency)

        return {
            "currency": currency,
            "base_value": base_number,
            "unit": unit,
            "normalized_amount": normalized_amount,
            "display": f"{display_symbol}{base_number:g} {unit.capitalize() if unit != 'raw' else ''}".strip(),
        }

    def normalize_percentage(self, raw_str: str) -> Optional[Dict[str, Any]]:
        """Extracts and normalizes percentage changes or bps from text.
        e.g. '+300% YoY' -> {'percentage': 300.0, 'is_yoy': True}
        """
        if not raw_str:
            return None

        clean = raw_str.strip()
        match = re.search(r"([+-]?\d+(?:\.\d+)?)\s*(%|percent|bps|basis points)", clean, re.IGNORECASE)
        if not match:
            return None

        val = float(match.group(1))
        unit = match.group(2).lower()
        if "bps" in unit or "basis" in unit:
            val = val / 100.0

        is_yoy = bool(re.search(r"\byoy\b|year[- ]over[- ]year", clean, re.IGNORECASE))
        is_qoq = bool(re.search(r"\bqoq\b|quarter[- ]over[- ]quarter", clean, re.IGNORECASE))

        return {
            "percentage_value": val,
            "is_yoy": is_yoy,
            "is_qoq": is_qoq,
            "display": f"{val:+.1f}%" if val > 0 else f"{val:.1f}%",
        }

    def normalize_source_chunk(self, raw_text: str) -> Dict[str, Any]:
        """Normalizes an entire evidence snippet by isolating metrics, dates, and entities."""
        monetary = self.normalize_monetary_value(raw_text)
        percentage = self.normalize_percentage(raw_text)

        return {
            "clean_text": " ".join(raw_text.split()),
            "monetary": monetary,
            "percentage": percentage,
            "has_quantitative_metric": bool(monetary or percentage),
        }
