from typing import Optional, Tuple
from .entities import TemporalComparison, EventStage


class TemporalReasoningEngine:
    """Evaluates event lifecycle progression and temporal validity.
    
    CRITICAL SUTRA PRINCIPLE:
    Temporal reasoning is essential in financial verification.
    A company saying: "We entered into an agreement" must NOT automatically become:
    "The acquisition was completed".
    Preserve event dates, announcement dates, and filing publication dates separately.
    """

    STAGE_HIERARCHY = {
        EventStage.ANNOUNCEMENT: 1,
        EventStage.AGREEMENT: 2,
        EventStage.FILING: 3,
        EventStage.APPROVAL: 4,
        EventStage.COMPLETION: 5,
    }

    def infer_stage_from_text(self, text: str) -> EventStage:
        lower = text.lower()
        if any(w in lower for w in ["completed", "closed", "finalized", "concluded", "executed transfer"]):
            return EventStage.COMPLETION
        elif any(w in lower for w in ["approved", "cleared", "cci approval", "rbi nod"]):
            return EventStage.APPROVAL
        elif any(w in lower for w in ["agreement", "definitive agreement", "signed pact", "mou"]):
            return EventStage.AGREEMENT
        elif any(w in lower for w in ["disclosed", "notified", "regulation 30", "outcome"]):
            return EventStage.FILING
        else:
            return EventStage.ANNOUNCEMENT

    def compare_event_stages(
        self,
        event_name: str,
        claimed_text: str,
        evidence_text: str,
        event_date: Optional[str] = None,
    ) -> TemporalComparison:
        claimed_stage = self.infer_stage_from_text(claimed_text)
        evidence_stage = self.infer_stage_from_text(evidence_text)

        claimed_order = self.STAGE_HIERARCHY.get(claimed_stage, 1)
        evidence_order = self.STAGE_HIERARCHY.get(evidence_stage, 1)

        is_mismatch = claimed_order > evidence_order

        if is_mismatch:
            explanation = (
                f"Claim asserts event completion ({claimed_stage.value}), but authoritative filing "
                f"only confirms preliminary stage ({evidence_stage.value}). Closing conditions or regulatory "
                f"approvals remain pending."
            )
        else:
            explanation = (
                f"Reported event stage ({claimed_stage.value}) aligns with official documentation "
                f"({evidence_stage.value})."
            )

        return TemporalComparison(
            event_name=event_name,
            claimed_stage=claimed_stage.value,
            evidence_stage=evidence_stage.value,
            event_date=event_date,
            is_mismatch=is_mismatch,
            explanation=explanation,
        )
