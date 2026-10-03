import re
import uuid
from typing import List, Tuple
from .entities import AtomicAssertion
from .numerical_engine import NumericalReasoningEngine


class ClaimDecompositionService:
    """Decomposes complex compound financial claims into isolated atomic assertions.
    
    CRITICAL SUTRA PRINCIPLE:
    Given: 'ABC Ltd secretly acquired ₹45 crore land in Noida.'
    Create atomic assertions:
    1. ABC Ltd acquired land.
    2. The land is in Noida.
    3. Transaction value is ₹45 crore.
    4. The acquisition was secret.
    
    Do NOT treat the compound sentence as one indivisible claim.
    Each assertion must be independently investigated.
    """

    def __init__(self):
        self.numerical_engine = NumericalReasoningEngine()

    def decompose(self, claim_text: str, entity_name: str = "") -> List[AtomicAssertion]:
        assertions: List[AtomicAssertion] = []
        clean = claim_text.strip()

        # 1. Identify Entity
        entity = entity_name
        if not entity:
            entity_match = re.search(r"\b([A-Z][A-Za-z0-9\s&]+(?:Ltd|Limited|Industries|Enterprises|Power|Motors|Energy))\b", clean)
            if entity_match:
                entity = entity_match.group(1).strip()
            else:
                entity = clean.split()[0] if clean else "Entity"

        # 2. Extract Event / Transaction Assertion
        if any(w in clean.lower() for w in ["acquired", "acquisition", "bought", "purchase"]):
            event_type = "land acquisition" if "land" in clean.lower() else "acquisition"
            assertions.append(
                AtomicAssertion(
                    assertion_id=f"ast_{uuid.uuid4().hex[:6]}",
                    assertion_text=f"{entity} acquired {'land' if 'land' in clean.lower() else 'asset/business'}",
                    entity=entity,
                    event=event_type,
                )
            )
        elif any(w in clean.lower() for w in ["contract", "order", "signed", "deal"]):
            assertions.append(
                AtomicAssertion(
                    assertion_id=f"ast_{uuid.uuid4().hex[:6]}",
                    assertion_text=f"{entity} signed a commercial contract or order",
                    entity=entity,
                    event="contract execution",
                )
            )
        elif any(w in clean.lower() for w in ["profit", "pat", "q3", "results", "growth"]):
            assertions.append(
                AtomicAssertion(
                    assertion_id=f"ast_{uuid.uuid4().hex[:6]}",
                    assertion_text=f"{entity} achieved claimed quarterly financial results",
                    entity=entity,
                    event="financial results announcement",
                )
            )

        # 3. Extract Geographic / Location Assertion
        location_match = re.search(r"\b(?:in|at|near)\s+([A-Z][A-Za-z]+)\b", clean)
        if location_match:
            loc = location_match.group(1)
            assertions.append(
                AtomicAssertion(
                    assertion_id=f"ast_{uuid.uuid4().hex[:6]}",
                    assertion_text=f"The transaction/property is located in {loc}",
                    entity=entity,
                    location=loc,
                )
            )

        # 4. Extract Monetary / Numerical Value Assertion
        amount_match = re.search(r"(₹?\s*[\d\.,]+\s*(?:crores?|cr|lakhs?|billion|million))\b", clean, re.IGNORECASE)
        if amount_match:
            raw_amt = amount_match.group(1).strip()
            norm_amt = self.numerical_engine.normalize_to_inr(raw_amt)
            assertions.append(
                AtomicAssertion(
                    assertion_id=f"ast_{uuid.uuid4().hex[:6]}",
                    assertion_text=f"Transaction value or financial figure was {raw_amt}",
                    entity=entity,
                    amount_raw=raw_amt,
                    amount_normalized=norm_amt,
                )
            )

        # 5. Extract Suspicious / Secret / Confidential Attribute Assertion
        if any(w in clean.lower() for w in ["secret", "secretly", "undisclosed", "hidden", "insider"]):
            assertions.append(
                AtomicAssertion(
                    assertion_id=f"ast_{uuid.uuid4().hex[:6]}",
                    assertion_text="The transaction was conducted secretly without statutory exchange notification",
                    entity=entity,
                    attribute="secret",
                )
            )

        # Fallback if no structured assertions extracted
        if not assertions:
            assertions.append(
                AtomicAssertion(
                    assertion_id=f"ast_{uuid.uuid4().hex[:6]}",
                    assertion_text=clean,
                    entity=entity,
                )
            )

        return assertions
