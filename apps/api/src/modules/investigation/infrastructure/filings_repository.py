import uuid
from typing import List, Optional
from ..domain.entities import EvidencePassage, SourceTier
from .data.canonical_filings import CANONICAL_FILINGS
from ...research.infrastructure.google_search_provider import GoogleAndMultiSearchProvider


class AuthoritativeFilingsRepository:
    """Provides evidence retrieval against official stock exchange filings, SEBI circulars, and live multi-engine web search (Google News, Bing News, DuckDuckGo)."""

    def __init__(self, filings=None, search_provider=None):
        self.filings = filings if filings is not None else CANONICAL_FILINGS
        self.search_provider = search_provider or GoogleAndMultiSearchProvider()

    def search(self, query: str, ticker: Optional[str] = None) -> List[EvidencePassage]:
        results: List[EvidencePassage] = []
        lower_query = query.lower()
        upper_query = query.upper()
        seen_urls = set()

        # 1. First, search canonical filings (for verified historical test cases and regulatory archives)
        for idx, doc in enumerate(self.filings):
            doc_ticker = doc.get("ticker", "").upper()
            company_name = doc.get("company_name", "").lower()

            # Ensure company match: do not falsely match Suzlon when searching Zomato or Reliance
            is_company_match = False
            if ticker and doc_ticker == ticker.upper():
                is_company_match = True
            elif doc_ticker and doc_ticker in upper_query:
                is_company_match = True
            elif any(part in lower_query for part in company_name.split() if len(part) > 3):
                is_company_match = True
            elif doc_ticker == "SEBI_GENERAL" and any(k in lower_query for k in ["tip", "telegram", "whatsapp", "guaranteed", "pump"]):
                is_company_match = True

            if not is_company_match:
                continue

            keywords = doc.get("keywords", [])
            matched_keywords = [kw for kw in keywords if kw in lower_query]

            if doc_ticker == "SEBI_GENERAL":
                if matched_keywords:
                    score = 0.80
                else:
                    continue
            elif matched_keywords:
                score = 0.80 + min(len(matched_keywords) * 0.05, 0.19)
            else:
                continue

            if score >= 0.5:
                url = doc["source_url"]
                seen_urls.add(url)
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
                        source_url=url,
                        relevance_score=min(round(score, 2), 0.99),
                        relationship="CONTEXT",
                    )
                )

        # 2. Live Multi-Source Search (Google News RSS, Bing News, DuckDuckGo) for ANY entity / query
        # Skip slow external network roundtrips if an authoritative statutory filing is already matched
        if not any(r.relevance_score >= 0.85 for r in results):
            try:
                live_results = self.search_provider.search(query)
                for lr in live_results:
                    if lr.url in seen_urls:
                        continue
                    seen_urls.add(lr.url)

                    is_exchange = any(dom in lr.url.lower() for dom in ["bseindia.com", "nseindia.com", "sebi.gov.in", "mca.gov.in"])
                    source_tier = SourceTier.TIER_1_REGULATORY if is_exchange else SourceTier.TIER_3_FINANCIAL_MEDIA
                    filing_type = "STATUTORY_EXCHANGE_FILING" if is_exchange else "ACCREDITED_FINANCIAL_MEDIA"

                    results.append(
                        EvidencePassage(
                            passage_id=f"ev_web_{uuid.uuid4().hex[:6]}",
                            document_title=lr.title,
                            filing_type=filing_type,
                            source_name=lr.provider,
                            source_tier=source_tier,
                            filing_date=lr.retrieved_at.strftime("%Y-%m-%d"),
                            page_number=1,
                            paragraph_number=lr.rank,
                            exact_quote=lr.snippet,
                            source_url=lr.url,
                            relevance_score=0.85 if is_exchange else 0.75,
                            relationship="CONTEXT",
                        )
                    )
            except Exception:
                pass

        results.sort(key=lambda x: x.relevance_score, reverse=True)
        return results
