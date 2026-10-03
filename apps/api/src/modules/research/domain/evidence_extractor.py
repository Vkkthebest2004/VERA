import re
import uuid
from typing import Optional, Tuple
from datetime import datetime, timezone
from .entities import AtomicAssertion, DocumentChunk, Evidence, EvidenceRelationship
from .numerical_engine import NumericalReasoningEngine


class EvidenceExtractionService:
    """Extracts granular evidence objects from document passages for atomic assertions.
    
    CRITICAL SUTRA PRINCIPLE:
    The reasoning layer extracts evidence, but MUST NOT invent or hallucinate evidence.
    Allowed relationships:
    - SUPPORTS
    - CONTRADICTS
    - PARTIALLY_SUPPORTS
    - UNRELATED
    - INSUFFICIENT
    
    The exact source passage must be preserved with document coordinates.
    """

    def __init__(self):
        self.numerical_engine = NumericalReasoningEngine()

    def extract_evidence(
        self,
        assertion: AtomicAssertion,
        chunk: DocumentChunk,
        claim_id: str,
        publisher: str = "Authoritative Source",
    ) -> Optional[Evidence]:
        chunk_lower = chunk.text.lower()
        stmt_lower = assertion.assertion_text.lower()

        # Check relevance
        is_relevant = False
        if assertion.entity and assertion.entity.lower() in chunk_lower:
            is_relevant = True
        if assertion.location and assertion.location.lower() in chunk_lower:
            is_relevant = True
        if assertion.event and any(w in chunk_lower for w in assertion.event.lower().split()):
            is_relevant = True
        if assertion.amount_raw and any(c.isdigit() for c in assertion.amount_raw):
            # Check if any numeric values appear
            is_relevant = True

        if not is_relevant:
            return None

        # 1. Location assertion matching
        if assertion.location:
            if assertion.location.lower() in chunk_lower:
                return Evidence(
                    evidence_id=f"evi_{uuid.uuid4().hex[:8]}",
                    claim_id=claim_id,
                    assertion_id=assertion.assertion_id,
                    document_id=chunk.document_id,
                    source_id="src_doc",
                    relationship=EvidenceRelationship.SUPPORTS,
                    exact_text=chunk.text,
                    page=chunk.page,
                    section=chunk.section,
                    source_url=chunk.source_url,
                    publisher=publisher,
                    confidence=0.95,
                )

        # 2. Amount assertion matching & contradiction detection
        if assertion.amount_raw:
            # Search for monetary figures in the chunk
            amounts_in_chunk = re.findall(r"(?:₹|rs\.?|inr)?\s*([\d\.,]+)\s*(?:cr(?:ore)?s?|lakh?s?|billion|million)", chunk_lower)
            if amounts_in_chunk:
                # Find matching numbers
                chunk_amount_match = re.search(r"(₹?\s*[\d\.,]+\s*(?:crores?|cr|lakhs?))\b", chunk.text, re.IGNORECASE)
                chunk_amt_raw = chunk_amount_match.group(1).strip() if chunk_amount_match else ""
                
                chunk_norm = self.numerical_engine.normalize_to_inr(chunk_amt_raw) if chunk_amt_raw else None
                claimed_norm = assertion.amount_normalized or self.numerical_engine.normalize_to_inr(assertion.amount_raw)

                if chunk_norm and claimed_norm:
                    if abs(chunk_norm - claimed_norm) < 1000.0:
                        rel = EvidenceRelationship.SUPPORTS
                    else:
                        rel = EvidenceRelationship.CONTRADICTS

                    return Evidence(
                        evidence_id=f"evi_{uuid.uuid4().hex[:8]}",
                        claim_id=claim_id,
                        assertion_id=assertion.assertion_id,
                        document_id=chunk.document_id,
                        source_id="src_doc",
                        relationship=rel,
                        exact_text=chunk.text,
                        page=chunk.page,
                        section=chunk.section,
                        source_url=chunk.source_url,
                        publisher=publisher,
                        amount_extracted=chunk_norm,
                        confidence=0.98,
                    )

        # 3. Event assertion matching (e.g. land acquisition)
        if assertion.event and any(w in chunk_lower for w in ["acquisition", "acquired", "purchase", "order", "contract"]):
            return Evidence(
                evidence_id=f"evi_{uuid.uuid4().hex[:8]}",
                claim_id=claim_id,
                assertion_id=assertion.assertion_id,
                document_id=chunk.document_id,
                source_id="src_doc",
                relationship=EvidenceRelationship.SUPPORTS,
                exact_text=chunk.text,
                page=chunk.page,
                section=chunk.section,
                source_url=chunk.source_url,
                publisher=publisher,
                confidence=0.92,
            )

        # 4. Attribute assertion matching (e.g. "secret")
        if assertion.attribute == "secret":
            # If official filing exists, it's public, not secret
            if "regulation 30" in chunk_lower or "notify the exchange" in chunk_lower or "corporate announcement" in chunk_lower:
                return Evidence(
                    evidence_id=f"evi_{uuid.uuid4().hex[:8]}",
                    claim_id=claim_id,
                    assertion_id=assertion.assertion_id,
                    document_id=chunk.document_id,
                    source_id="src_doc",
                    relationship=EvidenceRelationship.CONTRADICTS,
                    exact_text=chunk.text,
                    page=chunk.page,
                    section=chunk.section,
                    source_url=chunk.source_url,
                    publisher=publisher,
                    confidence=0.90,
                )

        return None
