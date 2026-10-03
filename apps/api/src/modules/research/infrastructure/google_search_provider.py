import os
import re
import uuid
import urllib.parse
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from typing import List, Optional, Dict, Any
from urllib.parse import urlparse, parse_qs
import httpx

from ..domain.entities import SearchResult
from .search_provider import SearchProvider, AuthoritativeFinancialSearchProvider


class GoogleAndMultiSearchProvider(SearchProvider):
    """Multi-source search aggregator combining:
    1. Google News & Financial Search RSS (live real-time headlines across hundreds of news wires)
    2. Bing Financial News RSS (direct multi-website news links across dozens of financial portals)
    3. SearXNG MetaSearch (if local instance is active)
    4. DuckDuckGo Web Engine (multi-website coverage)
    5. Authoritative Financial Archive (BSE, NSE, SEBI canonical disclosures)
    """

    BROWSER_HEADERS = {
        "User-Agent": (
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/128.0.0.0 Safari/537.36"
        ),
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
    }

    def __init__(
        self,
        searxng_url: Optional[str] = None,
        timeout: float = 2.5,
        fallback_provider: Optional[SearchProvider] = None,
    ):
        self.searxng_url = (searxng_url or os.environ.get("SEARXNG_URL", "http://localhost:8080")).rstrip("/")
        self.timeout = timeout
        self.canonical_provider = fallback_provider or AuthoritativeFinancialSearchProvider()
        self._cache: Dict[str, List[SearchResult]] = {}

    def search(self, query: str, filters: Optional[Dict[str, Any]] = None) -> List[SearchResult]:
        query_key = query.strip().lower()
        if query_key in self._cache:
            return self._cache[query_key]

        query_id = filters.get("query_id", f"qry_{uuid.uuid4().hex[:6]}") if filters else f"qry_{uuid.uuid4().hex[:6]}"
        aggregated_results: List[SearchResult] = []
        seen_urls = set()

        # 1. Authoritative Financial Registry for regulatory exchange disclosures (BSE, NSE, SEBI - TIER 1 PRIORITY)
        canonical_results = self.canonical_provider.search(query, filters)
        for r in canonical_results:
            if r.url not in seen_urls:
                seen_urls.add(r.url)
                aggregated_results.append(r)

        # 2. Live Google News & Financial RSS (Reuters, Bloomberg, LiveMint, Economic Times, NDTV, etc.)
        google_results = self._search_google_news(query, query_id)
        for r in google_results:
            if r.url not in seen_urls:
                seen_urls.add(r.url)
                aggregated_results.append(r)

        # 3. Live Bing Financial News RSS (provides direct destination URLs to Financial Express, ET Now, Moneycontrol, etc.)
        bing_results = self._search_bing_news(query, query_id)
        for r in bing_results:
            if r.url not in seen_urls:
                seen_urls.add(r.url)
                aggregated_results.append(r)

        # 4. Attempt SearXNG if the local instance is up
        searxng_results = self._search_searxng(query, query_id)
        for r in searxng_results:
            if r.url not in seen_urls:
                seen_urls.add(r.url)
                aggregated_results.append(r)

        # 5. DuckDuckGo Web HTML engine if more candidates needed
        if len(aggregated_results) < 5:
            ddg_results = self._search_duckduckgo(query, query_id)
            for r in ddg_results:
                if r.url not in seen_urls:
                    seen_urls.add(r.url)
                    aggregated_results.append(r)

        final_results = aggregated_results[:12]
        self._cache[query_key] = final_results
        return final_results

    def _search_google_news(self, query: str, query_id: str) -> List[SearchResult]:
        """Queries Google News RSS endpoint for real-time coverage across global and Indian financial news wires."""
        results: List[SearchResult] = []
        try:
            encoded_q = urllib.parse.quote(query)
            rss_url = f"https://news.google.com/rss/search?q={encoded_q}&hl=en-IN&gl=IN&ceid=IN:en"
            
            resp = httpx.get(rss_url, headers=self.BROWSER_HEADERS, timeout=self.timeout)
            if resp.status_code == 200 and resp.text:
                root = ET.fromstring(resp.text)
                items = root.findall(".//item")
                for idx, item in enumerate(items[:6], start=1):
                    raw_title = item.find("title").text if item.find("title") is not None else ""
                    raw_link = item.find("link").text if item.find("link") is not None else ""
                    raw_desc = item.find("description").text if item.find("description") is not None else ""
                    pub_date_str = item.find("pubDate").text if item.find("pubDate") is not None else ""

                    # Clean HTML tags from description snippet
                    snippet = re.sub(r"<[^>]+>", " ", raw_desc)
                    snippet = " ".join(snippet.split())

                    # Extract publisher source name from title format "Article Title - Publisher"
                    source_name = "Google News"
                    clean_title = raw_title
                    if " - " in raw_title:
                        parts = raw_title.rsplit(" - ", 1)
                        clean_title = parts[0].strip()
                        source_name = parts[1].strip()

                    domain = urlparse(raw_link).netloc.lower().replace("www.", "") or "news.google.com"

                    results.append(
                        SearchResult(
                            result_id=f"res_goog_{uuid.uuid4().hex[:6]}",
                            query_id=query_id,
                            url=raw_link,
                            title=clean_title,
                            snippet=f"{snippet} (Published: {pub_date_str}, Source: {source_name})" if pub_date_str else snippet,
                            rank=idx,
                            domain=domain,
                            provider=f"Google News ({source_name})",
                            retrieved_at=datetime.now(timezone.utc),
                        )
                    )
        except Exception:
            pass
        return results

    def _search_bing_news(self, query: str, query_id: str) -> List[SearchResult]:
        """Queries Bing News RSS for direct news links across dozens of financial websites."""
        results: List[SearchResult] = []
        try:
            encoded_q = urllib.parse.quote(query)
            rss_url = f"https://www.bing.com/news/search?q={encoded_q}&format=rss"
            resp = httpx.get(rss_url, headers=self.BROWSER_HEADERS, timeout=self.timeout)
            if resp.status_code == 200 and resp.text:
                root = ET.fromstring(resp.text)
                items = root.findall(".//item")
                for idx, item in enumerate(items[:6], start=1):
                    raw_title = item.find("title").text if item.find("title") is not None else ""
                    raw_link = item.find("link").text if item.find("link") is not None else ""
                    raw_desc = item.find("description").text if item.find("description") is not None else ""

                    # Decode the destination URL if wrapped in bing apiclick
                    direct_url = raw_link
                    if "url=" in raw_link:
                        parsed = urlparse(raw_link)
                        params = parse_qs(parsed.query)
                        if "url" in params and params["url"]:
                            direct_url = params["url"][0]

                    clean_snippet = re.sub(r"<[^>]+>", " ", raw_desc)
                    clean_snippet = " ".join(clean_snippet.split())
                    domain = urlparse(direct_url).netloc.lower().replace("www.", "") or "news.bing.com"

                    results.append(
                        SearchResult(
                            result_id=f"res_bing_{uuid.uuid4().hex[:6]}",
                            query_id=query_id,
                            url=direct_url,
                            title=raw_title,
                            snippet=clean_snippet,
                            rank=idx,
                            domain=domain,
                            provider=f"Web News ({domain})",
                            retrieved_at=datetime.now(timezone.utc),
                        )
                    )
        except Exception:
            pass
        return results

    def _search_searxng(self, query: str, query_id: str) -> List[SearchResult]:
        """Queries local or remote SearXNG meta-search instance."""
        results: List[SearchResult] = []
        try:
            params = {
                "q": query,
                "format": "json",
                "categories": "general,news",
            }
            resp = httpx.get(f"{self.searxng_url}/search", params=params, timeout=1.5)
            if resp.status_code == 200:
                data = resp.json()
                items = data.get("results", [])
                for idx, item in enumerate(items[:5], start=1):
                    raw_url = item.get("url", "")
                    domain = urlparse(raw_url).netloc.lower().replace("www.", "")
                    results.append(
                        SearchResult(
                            result_id=f"res_searx_{uuid.uuid4().hex[:6]}",
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
        except Exception:
            pass
        return results

    def _search_duckduckgo(self, query: str, query_id: str) -> List[SearchResult]:
        """Scrapes DuckDuckGo HTML results for multi-site coverage."""
        results: List[SearchResult] = []
        try:
            url = f"https://html.duckduckgo.com/html/?q={urllib.parse.quote(query)}"
            resp = httpx.get(url, headers=self.BROWSER_HEADERS, timeout=self.timeout)
            if resp.status_code == 200 and resp.text:
                pattern = r'<a class="result__url"[^>]*href="([^"]+)"[^>]*>.*?<a class="result__snippet"[^>]*>(.*?)</a>'
                matches = re.findall(pattern, resp.text, re.DOTALL)
                for idx, (raw_url, snippet_html) in enumerate(matches[:4], start=1):
                    clean_snippet = re.sub(r"<[^>]+>", " ", snippet_html).strip()
                    domain = urlparse(raw_url).netloc.lower().replace("www.", "")
                    if domain:
                        results.append(
                            SearchResult(
                                result_id=f"res_ddg_{uuid.uuid4().hex[:6]}",
                                query_id=query_id,
                                url=raw_url,
                                title=f"Report from {domain}",
                                snippet=clean_snippet,
                                rank=idx,
                                domain=domain,
                                provider=f"DuckDuckGo ({domain})",
                                retrieved_at=datetime.now(timezone.utc),
                            )
                        )
        except Exception:
            pass
        return results
