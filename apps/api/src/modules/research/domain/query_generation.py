import uuid
from typing import List, Optional
from .entities import AtomicAssertion, SearchQuery


class QueryGenerationService:
    """Generates precise, targeted search queries from decomposed atomic assertions.
    
    CRITICAL SUTRA PRINCIPLE:
    Never let the crawler search randomly.
    Each assertion gets a multi-faceted search strategy across authoritative domains,
    keywords, and exchange filings.
    """

    def generate_queries_for_assertion(
        self,
        assertion: AtomicAssertion,
        entity_name: Optional[str] = None,
        ticker: Optional[str] = None,
    ) -> List[SearchQuery]:
        queries: List[SearchQuery] = []
        name = entity_name or assertion.entity or "Company"
        event = assertion.event or "announcement"
        location = assertion.location
        amount = assertion.amount_raw

        # Strategy 1: Targeted entity + event + location query
        terms = [f'"{name}"']
        if location:
            terms.append(f'"{location}"')
        if event:
            terms.append(event)
        queries.append(
            SearchQuery(
                query_id=f"qry_{uuid.uuid4().hex[:8]}",
                assertion_id=assertion.assertion_id,
                query_text=" ".join(terms),
                target_domains=["all"],
            )
        )

        # Strategy 2: Exact monetary amount search if present
        if amount:
            queries.append(
                SearchQuery(
                    query_id=f"qry_{uuid.uuid4().hex[:8]}",
                    assertion_id=assertion.assertion_id,
                    query_text=f'"{name}" "{amount}"',
                    target_domains=["all"],
                )
            )

        # Strategy 3: Authoritative Exchange Filings (NSE / BSE Regulation 30)
        queries.append(
            SearchQuery(
                query_id=f"qry_{uuid.uuid4().hex[:8]}",
                assertion_id=assertion.assertion_id,
                query_text=f'site:nseindia.com "{name}" {event}',
                target_domains=["nseindia.com"],
            )
        )
        queries.append(
            SearchQuery(
                query_id=f"qry_{uuid.uuid4().hex[:8]}",
                assertion_id=assertion.assertion_id,
                query_text=f'site:bseindia.com "{name}" {event}',
                target_domains=["bseindia.com"],
            )
        )

        # Strategy 4: Statutory Regulatory Check (SEBI Orders)
        queries.append(
            SearchQuery(
                query_id=f"qry_{uuid.uuid4().hex[:8]}",
                assertion_id=assertion.assertion_id,
                query_text=f'site:sebi.gov.in "{name}"',
                target_domains=["sebi.gov.in"],
            )
        )

        # Strategy 5: Corporate Annual Report / Balance Sheet Check
        queries.append(
            SearchQuery(
                query_id=f"qry_{uuid.uuid4().hex[:8]}",
                assertion_id=assertion.assertion_id,
                query_text=f'"{name}" "annual report" {event}',
                target_domains=["corporate"],
            )
        )

        return queries
