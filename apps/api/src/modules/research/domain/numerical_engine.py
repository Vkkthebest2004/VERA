import re
from typing import Optional, Tuple
from .entities import NumericalComparison


class NumericalReasoningEngine:
    """Deterministic financial figure normalization and numerical variance calculator.
    
    CRITICAL SUTRA PRINCIPLE:
    Numerical comparison should NOT be purely LLM-based.
    Python handles the deterministic calculation.
    The LLM provides plain-English interpretation.
    """

    @staticmethod
    def normalize_to_inr(raw_val: str) -> Optional[float]:
        """Convert Indian currency notations (Crores, Lakhs, Billions, Millions) into canonical integer INR."""
        if not raw_val:
            return None

        clean = raw_val.replace(",", "").strip()

        # ₹45 crore / 45 Cr / 45 crores
        crore_match = re.search(r"₹?\s*([\d\.]+)\s*(?:cr(?:ore)?s?|crores?)\b", clean, re.IGNORECASE)
        if crore_match:
            num = float(crore_match.group(1))
            return num * 10_000_000.0  # 1 Crore = 10,000,000

        # ₹4,500 lakh / 4500 lakhs
        lakh_match = re.search(r"₹?\s*([\d\.]+)\s*(?:lakh?s?|lacs?)\b", clean, re.IGNORECASE)
        if lakh_match:
            num = float(lakh_match.group(1))
            return num * 100_000.0  # 1 Lakh = 100,000

        # $5 billion / 5B
        billion_match = re.search(r"[\$₹]?\s*([\d\.]+)\s*(?:billion|bn|b)\b", clean, re.IGNORECASE)
        if billion_match:
            num = float(billion_match.group(1))
            return num * 1_000_000_000.0

        # $50 million / 50M
        million_match = re.search(r"[\$₹]?\s*([\d\.]+)\s*(?:million|mn|m)\b", clean, re.IGNORECASE)
        if million_match:
            num = float(million_match.group(1))
            return num * 1_000_000.0

        # Pure numeric with currency symbol e.g. ₹450,000,000 or 450000000 INR
        pure_match = re.search(r"[\$₹]?\s*([\d\.]+)\s*(?:inr|rs\.?|rupees)?", clean, re.IGNORECASE)
        if pure_match:
            try:
                return float(pure_match.group(1))
            except ValueError:
                return None

        return None

    @staticmethod
    def normalize_basis_points(raw_val: str) -> Optional[float]:
        """Convert basis points (e.g. 180 bps -> 1.80%)."""
        bps_match = re.search(r"(\d+(?:\.\d+)?)\s*(?:bps|basis\s*points)\b", raw_val, re.IGNORECASE)
        if bps_match:
            return float(bps_match.group(1)) / 100.0
        return None

    def compare(
        self,
        metric_name: str,
        claimed_raw: str,
        evidence_raw: str,
    ) -> NumericalComparison:
        claimed_norm = self.normalize_to_inr(claimed_raw) or 0.0
        evidence_norm = self.normalize_to_inr(evidence_raw) or 0.0

        diff = claimed_norm - evidence_norm
        is_mismatch = abs(diff) > 1000.0  # Tolerance for minor rounding

        ratio_str = "Exact Match"
        if is_mismatch and evidence_norm > 0:
            factor = claimed_norm / evidence_norm
            if factor > 1.0:
                ratio_str = f"{factor:.1f}x Exaggeration (Inflated by {(factor - 1.0)*100:.0f}%)"
            else:
                ratio_str = f"Understated ({factor:.2f}x of official figure)"
        elif is_mismatch:
            ratio_str = "Significant Discrepancy"

        explanation = (
            f"Official filing states {evidence_raw} (canonical {evidence_norm:,.0f} INR), "
            f"whereas the claim asserted {claimed_raw} (canonical {claimed_norm:,.0f} INR). "
            f"Mathematical variance: {ratio_str}."
        ) if is_mismatch else f"Claimed value of {claimed_raw} exactly reconciles with official filing of {evidence_raw}."

        return NumericalComparison(
            metric_name=metric_name,
            claimed_raw=claimed_raw,
            claimed_normalized=claimed_norm,
            evidence_raw=evidence_raw,
            evidence_normalized=evidence_norm,
            difference_amount=diff,
            ratio_factor=ratio_str,
            is_mismatch=is_mismatch,
            explanation=explanation,
        )
