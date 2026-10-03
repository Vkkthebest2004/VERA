from typing import List, Optional
from ..domain.entities import EvidencePassage
from .data.canonical_filings import CANONICAL_FILINGS


class AuthoritativeFilingsRepository:
    """Provides evidence retrieval against official stock exchange filings, SEBI circulars, and audited disclosures."""

    def __init__(self, filings=None):
        self.filings = filings if filings is not None else CANONICAL_FILINGS

    def search(self, query: str, ticker: Optional[str] = None) -> List[EvidencePassage]:
        results: List[EvidencePassage] = []
        lower_query = query.lower()
        upper_query = query.upper()

        for idx, doc in enumerate(self.filings):
            score = 0.0
            doc_ticker = doc.get("ticker", "")

            # Match ticker
            if ticker and doc_ticker == ticker.upper():
                score += 0.5
            elif doc_ticker in upper_query:
                score += 0.4

            # Match keywords
            keywords = doc.get("keywords", [])
            for kw in keywords:
                if kw in lower_query:
                    score += 0.15

            # If score is high enough, format as EvidencePassage
            if score >= 0.3:
                results.append(
                    EvidencePassage(
                        passage_id=f"ev_{doc_ticker.lower()}_{idx + 1}",
                        document_title=doc["document_title"],
                        filing_type=doc["filing_type"],
                        source_name=doc["source_name"],
                        source_tier=doc["source_tier"],
                        filing_date=doc["filing_date"],
                        page_number=doc["page_number"],
                        paragraph_number=doc["paragraph_number"],
                        exact_quote=doc["exact_quote"],
                        source_url=doc["source_url"],
                        relevance_score=min(round(score, 2), 0.99),
                        relationship="CONTEXT",
                    )
                )

        results.sort(key=lambda x: x.relevance_score, reverse=True)
        return results
