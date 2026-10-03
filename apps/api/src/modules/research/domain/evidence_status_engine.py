from typing import List, Tuple
from .entities import (
    AtomicAssertion,
    Evidence,
    EvidenceRelationship,
    EvidenceStatus,
    NumericalComparison,
    TemporalComparison,
)


class EvidenceStatusEngine:
    """Deterministic status evaluation and uncertainty-aware synthesis engine.
    
    CRITICAL SUTRA PRINCIPLE:
    NO_MATCHING_EVIDENCE DOES NOT MEAN FALSE.
    The system must communicate uncertainty explicitly.
    Do not declare: "The claim is false."
    Provide clear evidence accounting: What is supported, what contradicts, and what is unproven.
    """

    def evaluate_assertions_and_overall_status(
        self,
        assertions: List[AtomicAssertion],
        evidence_trail: List[Evidence],
        numerical_comparisons: List[NumericalComparison],
        temporal_comparisons: List[TemporalComparison],
    ) -> Tuple[EvidenceStatus, str, str]:
        if not evidence_trail:
            for a in assertions:
                a.status = EvidenceStatus.NO_MATCHING_EVIDENCE
                a.finding_summary = "No authoritative statutory filings found matching this specific assertion."

            headline = "No Authoritative Regulatory Records Found"
            explanation = (
                "VERA's automated web research and regulatory crawler cross-examined official exchange filings "
                "(NSE, BSE, SEBI) and found no matching corporate announcements. Under SEBI (LODR) Regulation 30, "
                "material corporate transactions require disclosure within 24 hours. The absence of filings indicates "
                "unverified market speculation, but is not conclusive proof that no private discussions occurred."
            )
            return EvidenceStatus.NO_MATCHING_EVIDENCE, headline, explanation

        has_support = False
        has_contradiction = False
        has_unmatched = False

        evidence_by_assertion = {}
        for ev in evidence_trail:
            evidence_by_assertion.setdefault(ev.assertion_id, []).append(ev)

        supported_items = []
        contradicted_items = []
        unmatched_items = []

        for a in assertions:
            evs = evidence_by_assertion.get(a.assertion_id, [])
            if not evs:
                a.status = EvidenceStatus.NO_MATCHING_EVIDENCE
                a.finding_summary = "No matching regulatory evidence retrieved for this statement."
                has_unmatched = True
                unmatched_items.append(a.assertion_text)
            else:
                has_rel_contra = any(e.relationship == EvidenceRelationship.CONTRADICTS for e in evs)
                has_rel_supp = any(e.relationship == EvidenceRelationship.SUPPORTS for e in evs)

                if has_rel_contra:
                    a.status = EvidenceStatus.CONFLICTING_EVIDENCE
                    a.finding_summary = "Official filing contradicts this statement."
                    has_contradiction = True
                    contradicted_items.append(a.assertion_text)
                elif has_rel_supp:
                    a.status = EvidenceStatus.SUPPORTING_EVIDENCE
                    a.finding_summary = "Confirmed by official statutory disclosure."
                    has_support = True
                    supported_items.append(a.assertion_text)
                else:
                    a.status = EvidenceStatus.PARTIAL_EVIDENCE
                    a.finding_summary = "Partial regulatory match found."
                    has_support = True

        # Synthesize overall status
        if has_support and has_contradiction:
            overall = EvidenceStatus.PARTIAL_EVIDENCE
            headline = "Partial Statutory Evidence: Numerical or Factual Discrepancy Found"
            
            # Build detailed explanation
            expl_parts = []
            if supported_items:
                expl_parts.append(f"The retrieved official filings support: {', '.join(supported_items)}.")
            if contradicted_items:
                expl_parts.append(f"However, official records contradict: {', '.join(contradicted_items)}.")
            if numerical_comparisons:
                nc = numerical_comparisons[0]
                expl_parts.append(f"Specifically, the filing states consideration of {nc.evidence_raw} rather than claimed {nc.claimed_raw}.")
            if unmatched_items:
                expl_parts.append(f"The retrieved evidence does not establish the assertion that: {', '.join(unmatched_items)}.")

            explanation = " ".join(expl_parts)

        elif has_contradiction and not has_support:
            overall = EvidenceStatus.CONFLICTING_EVIDENCE
            headline = "Conflicting Regulatory Evidence: Official Records Contradict Claim"
            explanation = "Official stock exchange filings directly contradict the primary assertions made in this claim."

        elif has_support and not has_contradiction:
            overall = EvidenceStatus.SUPPORTING_EVIDENCE
            headline = "Supported by Official Regulatory Filings"
            explanation = "Authoritative disclosures lodged with stock exchanges substantiate the reported statements."

        else:
            overall = EvidenceStatus.INSUFFICIENT_EVIDENCE
            headline = "Insufficient Statutory Grounding"
            explanation = "Available exchange disclosures provide insufficient factual basis to establish this claim."

        return overall, headline, explanation
