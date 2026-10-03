import re
import httpx
from typing import List, Dict, Any
from .entities import FinancialEntity, FinancialMetric, ExtractedAssertion, RedFlagIndicator


class HumanReadableExplanationLayer:
    """Translates raw extractable financial data and document text into an intuitive, human-readable breakdown."""

    @staticmethod
    def generate_explanation(
        raw_text: str,
        entities: List[FinancialEntity],
        metrics: List[FinancialMetric],
        assertions: List[ExtractedAssertion],
        red_flags: List[RedFlagIndicator],
    ) -> Dict[str, Any]:
        # 1. Plain English Executive Summary
        entity_names = ", ".join(e.name for e in entities) if entities else "the subject entity"
        plain_summary = (
            f"This document presents claims regarding {entity_names}. "
            f"It contains {len(assertions)} core factual assertion(s) and {len(metrics)} quantitative metric(s). "
        )
        if red_flags:
            plain_summary += f"Caution: {len(red_flags)} promotional/manipulation flag(s) were detected."
        else:
            plain_summary += "The content is phrased neutrally with no overt promotional red flags."

        # 2. Decoded Financial Numbers (Translating jargon into plain English)
        decoded_metrics = []
        for m in metrics:
            explanation = HumanReadableExplanationLayer._decode_metric(m.raw_text, m.metric_type)
            decoded_metrics.append({
                "raw_text": m.raw_text,
                "metric_type": m.metric_type,
                "plain_meaning": explanation,
            })

        # 3. Factual vs Speculative Breakdown
        verifiable_claims = [a.statement for a in assertions if a.verifiable]
        speculative_claims = [a.statement for a in assertions if not a.verifiable]

        # 4. Critical Questions for Fact-Checking
        verification_questions = []
        for e in entities:
            verification_questions.append(f"Has {e.name} filed an official corporate disclosure with BSE/NSE confirming these details?")
        for a in assertions[:2]:
            verification_questions.append(f"Can the claim \"{a.statement}\" be cross-referenced with audited financial statements?")

        # 5. Try asking Gemma 3 for an AI-narrated human synthesis
        ai_narrative = HumanReadableExplanationLayer._try_gemma_synthesis(raw_text, entity_names)

        return {
            "plain_summary": ai_narrative or plain_summary,
            "decoded_metrics": decoded_metrics,
            "verifiable_claims": verifiable_claims,
            "speculative_claims": speculative_claims,
            "verification_questions": verification_questions,
        }

    @staticmethod
    def _decode_metric(raw: str, metric_type: str) -> str:
        lower = raw.lower()
        if "bps" in lower:
            # Extract number
            nums = re.findall(r"([0-9.]+)", raw)
            if nums:
                val = float(nums[0])
                return f"{val} basis points equals a {val / 100:.2f}% percentage point change."
            return "Basis points (100 bps = 1.00% change in margin or interest rate)."
        elif "cr" in lower or "crore" in lower:
            nums = re.findall(r"([0-9,.]+)", raw)
            if nums:
                return f"₹{nums[0]} Crore in Indian numbering (equivalent to ₹{nums[0]}0 Million or approx 10 Million INR per Crore)."
            return "Denominated in Indian Crores (1 Crore = 10,000,000 INR)."
        elif "%" in raw:
            if "yoy" in lower:
                return f"{raw}: Year-over-Year comparison against the exact same quarter from the prior fiscal year."
            elif "qoq" in lower:
                return f"{raw}: Quarter-over-Quarter comparison against the immediately preceding quarter."
            return f"{raw}: Relative percentage change."
        elif "upper circuit" in lower or "uc" in lower:
            return "Upper Circuit: The maximum price ceiling set by stock exchanges (BSE/NSE) for the trading day. No trades are permitted above this level."
        elif "target" in lower or "tgt" in lower:
            return f"{raw}: A speculative forward price expectation, NOT a guaranteed valuation."
        return f"{raw}: Reported financial figure."

    @staticmethod
    def _try_gemma_synthesis(text: str, entities_str: str) -> str:
        """Call local Gemma 3 model to generate an executive plain English synthesis if available."""
        try:
            prompt = (
                f"Explain the following financial document/claim in 2 simple, objective sentences for an everyday investor. "
                f"State what is actually being claimed and what needs to be verified. Do not use financial jargon.\n\n"
                f"Content: {text[:1000]}"
            )
            resp = httpx.post(
                "http://localhost:11434/api/generate",
                json={
                    "model": "gemma3:4b",
                    "prompt": prompt,
                    "stream": False,
                },
                timeout=4.0,
            )
            if resp.status_code == 200:
                summary = resp.json().get("response", "").strip()
                if len(summary) > 20:
                    return summary
        except Exception:
            pass
        return ""
