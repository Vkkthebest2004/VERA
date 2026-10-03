import os
import uuid
import httpx
from typing import List, Optional, Dict, Any
from datetime import datetime, timezone
from urllib.parse import urlparse

from ..domain.entities import SearchResult
from .search_provider import SearchProvider, AuthoritativeFinancialSearchProvider


class SearXNGSearchProvider(SearchProvider):
    """SearXNG MetaSearch Aggregator.
    Queries SearXNG across Google, Bing, DuckDuckGo, and financial sources,
    with automatic graceful fallback to the authoritative index if offline.
    """

    def __init__(
        self,
        base_url: Optional[str] = None,
        timeout: float = 4.0,
        fallback_provider: Optional[SearchProvider] = None,
    ):
        self.base_url = (base_url or os.environ.get("SEARXNG_URL", "http://localhost:8080")).rstrip("/")
        self.timeout = timeout
        self.fallback = fallback_provider or AuthoritativeFinancialSearchProvider()

    def search(self, query: str, filters: Optional[Dict[str, Any]] = None) -> List[SearchResult]:
        query_id = filters.get("query_id", "qry_searxng") if filters else "qry_searxng"

        # 1. Attempt SearXNG JSON query
        try:
            params = {
                "q": query,
                "format": "json",
                "categories": "general,news,science",
            }
            resp = httpx.get(f"{self.base_url}/search", params=params, timeout=self.timeout)
            if resp.status_code == 200:
                data = resp.json()
                items = data.get("results", [])
                if items:
                    results: List[SearchResult] = []
                    for idx, item in enumerate(items[:10], start=1):
                        raw_url = item.get("url", "")
                        domain = urlparse(raw_url).netloc.lower().replace("www.", "")
                        results.append(
                            SearchResult(
                                result_id=f"res_{uuid.uuid4().hex[:8]}",
                                query_id=query_id,
                                url=raw_url,
                                title=item.get("title", "Search Result"),
                                snippet=item.get("content", ""),
                                rank=idx,
                                domain=domain,
                                provider=f"SearXNG ({item.get('engine', 'meta')})",
                                retrieved_at=datetime.now(timezone.utc),
                            )
                        )
                    if results:
                        return results
        except Exception:
            # SearXNG instance not running or timed out; fall back seamlessly
            pass

        # 2. Fallback to Authoritative Financial Index
        return self.fallback.search(query, filters)
