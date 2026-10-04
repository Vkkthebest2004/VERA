"""
ARTHA DATA GATHERER: Live Market Intelligence & Web Crawling Engine.

Provides Artha with autonomous real-time data gathering capabilities by wiring:
1. GoogleAndMultiSearchProvider (Google News RSS, Bing News RSS, SearXNG, DuckDuckGo)
2. CrawlerService (Crawl4AI + httpx HTML fallback with SSRF protection)
3. DocumentProcessor (HTML/PDF/Markdown → structured traceable chunks)

Artha uses this to:
- Fetch live financial news headlines for any company or market topic
- Crawl and extract article text from top search results
- Gather current stock prices, market data, and regulatory announcements
- Synthesize crawled intelligence into concise briefings for conversation

DESIGN PRINCIPLE:
Artha is the conversational tutor. The data gatherer runs silently in the background.
Raw crawl artifacts, HTTP status codes, and debug traces are NEVER exposed to the user.
Artha receives clean, synthesized text snippets and source citations.
"""

import re
import asyncio
import logging
from typing import List, Dict, Any, Optional
from datetime import datetime, timezone

logger = logging.getLogger("artha_data_gatherer")


class ArthaDataGatherer:
    """
    Autonomous data gathering engine for Artha.
    Searches multiple live sources, crawls top results, extracts clean text,
    and returns synthesized market intelligence for Artha's conversations.
    """

    # Best sources for Indian financial market intelligence
    MARKET_DATA_SOURCES = {
        "stock_price": [
            "https://www.google.com/finance/quote/{ticker}:NSE",
            "https://www.nseindia.com/get-quotes/equity?symbol={ticker}",
        ],
        "financial_news": [
            "news.google.com", "economictimes.com", "livemint.com",
            "moneycontrol.com", "ndtv.com/business", "reuters.com",
            "bloomberg.com", "financialexpress.com",
        ],
        "regulatory": [
            "bseindia.com", "nseindia.com", "sebi.gov.in", "mca.gov.in",
        ],
    }

    def __init__(self, search_timeout: float = 3.0, crawl_timeout: float = 5.0, max_crawl_results: int = 3):
        self.search_timeout = search_timeout
        self.crawl_timeout = crawl_timeout
        self.max_crawl_results = max_crawl_results
        self._search_provider = None
        self._crawler = None
        self._doc_processor = None
        self._cache: Dict[str, Dict[str, Any]] = {}

    @property
    def search_provider(self):
        """Lazy-init the multi-source search provider."""
        if self._search_provider is None:
            from ..infrastructure.google_search_provider import GoogleAndMultiSearchProvider
            self._search_provider = GoogleAndMultiSearchProvider(timeout=self.search_timeout)
        return self._search_provider

    @property
    def crawler(self):
        """Lazy-init the Crawl4AI + httpx crawler."""
        if self._crawler is None:
            from ..infrastructure.crawler.service import CrawlerService
            self._crawler = CrawlerService(timeout_seconds=self.crawl_timeout)
        return self._crawler

    @property
    def doc_processor(self):
        """Lazy-init the document processor."""
        if self._doc_processor is None:
            from ..infrastructure.document_processor import DocumentProcessor
            self._doc_processor = DocumentProcessor()
        return self._doc_processor

    def gather_market_intelligence(
        self,
        query: str,
        entity_name: str,
        intent: str,
        ticker: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Main entry point: searches the web, crawls top results, extracts text,
        and returns a clean intelligence package for Artha.

        Returns:
            {
                "headlines": [...],          # List of news headline dicts
                "crawled_articles": [...],    # List of extracted article text snippets
                "market_snapshot": {...},     # Best-effort current market data
                "sources_consulted": [...],  # Clean source citations
                "raw_search_count": int,     # Number of search results found
                "gathering_timestamp": str,  # ISO timestamp
            }
        """
        cache_key = f"{entity_name}:{query[:80]}:{intent}"
        if cache_key in self._cache:
            return self._cache[cache_key]

        result = {
            "headlines": [],
            "crawled_articles": [],
            "market_snapshot": {},
            "sources_consulted": [],
            "raw_search_count": 0,
            "gathering_timestamp": datetime.now(timezone.utc).isoformat(),
        }

        # 1. Build optimized search queries based on intent
        search_queries = self._build_search_queries(query, entity_name, intent, ticker)

        # 2. Execute multi-source search across all queries
        all_search_results = []
        for sq in search_queries:
            try:
                hits = self.search_provider.search(sq)
                all_search_results.extend(hits)
            except Exception as e:
                logger.debug(f"Search query failed for '{sq}': {e}")

        # De-duplicate by URL
        seen_urls = set()
        unique_results = []
        for sr in all_search_results:
            if sr.url not in seen_urls:
                seen_urls.add(sr.url)
                unique_results.append(sr)

        result["raw_search_count"] = len(unique_results)

        # 3. Extract headlines from search results
        for sr in unique_results[:8]:
            headline = {
                "title": sr.title,
                "snippet": sr.snippet[:300] if sr.snippet else "",
                "source": sr.provider,
                "domain": sr.domain,
                "url": sr.url,
                "retrieved_at": sr.retrieved_at.isoformat() if sr.retrieved_at else "",
            }
            result["headlines"].append(headline)
            result["sources_consulted"].append({
                "name": sr.provider,
                "domain": sr.domain,
                "url": sr.url,
            })

        # 4. Crawl top results for deeper article text (async)
        urls_to_crawl = [
            sr.url for sr in unique_results[:self.max_crawl_results]
            if not sr.url.endswith(".pdf")  # Skip PDFs in quick crawl mode
            and "google.com/url" not in sr.url  # Skip Google redirect URLs
        ]

        if urls_to_crawl:
            crawled_texts = self._crawl_urls_sync(urls_to_crawl)
            for url, text in crawled_texts.items():
                if text and len(text.strip()) > 50:
                    # Trim to a useful snippet for Artha context (max ~1500 chars)
                    clean_text = self._clean_and_truncate(text, max_chars=1500)
                    domain = self._extract_domain(url)
                    result["crawled_articles"].append({
                        "url": url,
                        "domain": domain,
                        "extracted_text": clean_text,
                    })

        # 5. Attempt to extract market snapshot from crawled text
        result["market_snapshot"] = self._extract_market_snapshot(
            entity_name, ticker, result["crawled_articles"], result["headlines"]
        )

        self._cache[cache_key] = result
        return result

    def _build_search_queries(
        self,
        query: str,
        entity_name: str,
        intent: str,
        ticker: Optional[str],
    ) -> List[str]:
        """Build optimized search queries based on conversation intent."""
        queries = []
        ticker_str = ticker or entity_name.split()[0]

        if intent in ("INVESTMENT_DECISION", "COMPANY_ANALYSIS"):
            queries.extend([
                f"{entity_name} financial results quarterly FY2025 FY2026",
                f"{ticker_str} stock price target analysis India",
                f"{entity_name} annual report key highlights",
            ])
        elif intent == "BUSINESS_MODEL":
            queries.extend([
                f"{entity_name} business model revenue segments",
                f"{entity_name} competitive advantage moat India",
            ])
        elif intent == "PEER_COMPARISON":
            queries.extend([
                f"{entity_name} vs competitors valuation comparison India",
                f"{ticker_str} peer comparison P/E ROCE margins",
            ])
        elif intent == "STATUTORY_RUMOR":
            queries.extend([
                f"{entity_name} BSE NSE corporate announcement {query[:60]}",
                f"{entity_name} SEBI filing {query[:60]}",
            ])
        elif intent == "FINANCIAL_EDUCATION":
            # For education topics, search for authoritative explainers
            concept = query.strip()
            queries.extend([
                f"{concept} explained for investors India",
                f"{concept} financial analysis practical example",
            ])
        elif intent in ("MARKET_NEWS", "GENERAL_CONVERSATION"):
            queries.extend([
                f"{entity_name} latest news financial update India",
                f"{ticker_str} stock market news today",
            ])
        else:
            # General fallback
            queries.extend([
                f"{entity_name} {query[:80]} India financial",
                f"{ticker_str} latest news stock market",
            ])

        return queries[:3]  # Cap at 3 queries to keep latency low

    def _crawl_urls_sync(self, urls: List[str]) -> Dict[str, str]:
        """Synchronously crawl URLs using asyncio event loop."""
        results = {}

        async def _crawl_all():
            for url in urls:
                try:
                    crawl_run, raw_bytes, content_type = await self.crawler.crawl(url)
                    if crawl_run.status == "SUCCESS" and raw_bytes:
                        doc = self.doc_processor.process(
                            raw_bytes=raw_bytes,
                            url=url,
                            content_type=content_type,
                            publisher=self._extract_domain(url),
                        )
                        # Combine all document chunks into readable text
                        full_text = "\n\n".join(
                            chunk.text for chunk in doc.chunks
                            if chunk.text and len(chunk.text.strip()) > 20
                        )
                        results[url] = full_text
                except Exception as e:
                    logger.debug(f"Crawl failed for {url}: {e}")

        try:
            loop = asyncio.get_event_loop()
            if loop.is_running():
                # We're inside an already-running loop (e.g. FastAPI)
                import concurrent.futures
                with concurrent.futures.ThreadPoolExecutor() as pool:
                    future = pool.submit(asyncio.run, _crawl_all())
                    future.result(timeout=self.crawl_timeout * len(urls) + 2)
            else:
                loop.run_until_complete(_crawl_all())
        except Exception as e:
            logger.debug(f"Async crawl orchestration failed: {e}")
            # Fallback: try simple synchronous httpx fetch
            results = self._fallback_sync_fetch(urls)

        return results

    def _fallback_sync_fetch(self, urls: List[str]) -> Dict[str, str]:
        """Simple synchronous HTTP fetch fallback when async crawl fails."""
        import httpx
        results = {}
        headers = {
            "User-Agent": (
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/128.0.0.0 Safari/537.36"
            ),
        }

        for url in urls:
            try:
                with httpx.Client(timeout=self.crawl_timeout, follow_redirects=True) as client:
                    resp = client.get(url, headers=headers)
                    if resp.status_code == 200 and resp.text:
                        clean_text = self._html_to_text(resp.text)
                        if clean_text and len(clean_text.strip()) > 50:
                            results[url] = clean_text
            except Exception as e:
                logger.debug(f"Sync fetch failed for {url}: {e}")

        return results

    def _html_to_text(self, html: str) -> str:
        """Extract readable text from HTML."""
        try:
            from bs4 import BeautifulSoup
            soup = BeautifulSoup(html, "html.parser")
            for tag in soup(["script", "style", "nav", "footer", "header", "aside", "noscript", "iframe"]):
                tag.decompose()
            container = soup.find("article") or soup.find("main") or soup.body or soup
            paragraphs = [
                p.get_text().strip()
                for p in container.find_all(["p", "h1", "h2", "h3", "li"])
                if len(p.get_text().strip()) > 20
            ]
            return "\n\n".join(paragraphs) if paragraphs else container.get_text(separator="\n", strip=True)
        except Exception:
            # Strip HTML tags with regex as last resort
            text = re.sub(r"<[^>]+>", " ", html)
            return " ".join(text.split())

    def _clean_and_truncate(self, text: str, max_chars: int = 1500) -> str:
        """Clean extracted text and truncate to a useful length."""
        # Remove excessive whitespace
        text = re.sub(r"\n{3,}", "\n\n", text)
        text = re.sub(r" {2,}", " ", text)

        # Remove common boilerplate patterns
        boilerplate_patterns = [
            r"(?i)cookie(s)? (policy|consent|notice)",
            r"(?i)subscribe to our newsletter",
            r"(?i)sign up for alerts",
            r"(?i)download the app",
            r"(?i)follow us on (twitter|facebook|instagram|linkedin)",
            r"(?i)terms (of|and) (use|service|conditions)",
            r"(?i)privacy policy",
            r"(?i)all rights reserved",
            r"(?i)©\s*\d{4}",
        ]
        for pat in boilerplate_patterns:
            text = re.sub(pat, "", text)

        text = text.strip()

        if len(text) > max_chars:
            # Truncate at a sentence boundary
            truncated = text[:max_chars]
            last_period = truncated.rfind(".")
            if last_period > max_chars * 0.5:
                truncated = truncated[:last_period + 1]
            return truncated

        return text

    def _extract_domain(self, url: str) -> str:
        """Extract clean domain from URL."""
        try:
            from urllib.parse import urlparse
            parsed = urlparse(url)
            domain = parsed.netloc.lower().replace("www.", "")
            return domain or "web"
        except Exception:
            return "web"

    def _extract_market_snapshot(
        self,
        entity_name: str,
        ticker: Optional[str],
        crawled_articles: List[Dict[str, Any]],
        headlines: List[Dict[str, Any]],
    ) -> Dict[str, Any]:
        """
        Best-effort extraction of current market data from crawled text.
        Pulls stock prices, market cap, P/E, volume, 52W high/low from article text.
        """
        snapshot = {}
        all_text = " ".join(
            a.get("extracted_text", "") for a in crawled_articles
        ) + " " + " ".join(
            h.get("snippet", "") for h in headlines
        )

        if not all_text.strip():
            return snapshot

        # Extract stock price (₹ or Rs or INR patterns)
        price_patterns = [
            r"(?:current|stock|share|market)\s*(?:price|value)[\s:]*[₹Rs.INR]*\s*([\d,]+(?:\.\d{1,2})?)",
            r"(?:CMP|cmp|LTP|ltp)[\s:]*[₹Rs.INR]*\s*([\d,]+(?:\.\d{1,2})?)",
            r"(?:trading|trades?)\s*(?:at|around|near)[\s:]*[₹Rs.INR]*\s*([\d,]+(?:\.\d{1,2})?)",
            r"₹\s*([\d,]+(?:\.\d{1,2})?)\s*(?:per share|/share)",
        ]
        for pat in price_patterns:
            match = re.search(pat, all_text, re.IGNORECASE)
            if match:
                price_str = match.group(1).replace(",", "")
                try:
                    snapshot["current_price"] = float(price_str)
                    break
                except ValueError:
                    pass

        # Extract Market Cap
        mcap_patterns = [
            r"market\s*cap(?:italization)?[\s:]*[₹Rs.INR]*\s*([\d,]+(?:\.\d{1,2})?)\s*(crore|cr|lakh crore|trillion|billion)",
        ]
        for pat in mcap_patterns:
            match = re.search(pat, all_text, re.IGNORECASE)
            if match:
                snapshot["market_cap"] = f"₹{match.group(1)} {match.group(2)}"
                break

        # Extract P/E Ratio
        pe_patterns = [
            r"(?:P/E|PE|price.to.earnings)\s*(?:ratio)?[\s:]*(\d+(?:\.\d{1,2})?)\s*(?:x|×|times)?",
        ]
        for pat in pe_patterns:
            match = re.search(pat, all_text, re.IGNORECASE)
            if match:
                try:
                    snapshot["pe_ratio"] = float(match.group(1))
                    break
                except ValueError:
                    pass

        # Extract 52-week high/low
        week52_patterns = [
            r"52[\s-]*week\s*(?:high|H)[\s:]*[₹Rs.]*\s*([\d,]+(?:\.\d{1,2})?)",
            r"52[\s-]*week\s*(?:low|L)[\s:]*[₹Rs.]*\s*([\d,]+(?:\.\d{1,2})?)",
        ]
        for idx, pat in enumerate(week52_patterns):
            match = re.search(pat, all_text, re.IGNORECASE)
            if match:
                key = "52w_high" if idx == 0 else "52w_low"
                snapshot[key] = match.group(1).replace(",", "")

        # Extract revenue / profit numbers
        revenue_patterns = [
            r"(?:revenue|sales|topline)[\s:]*[₹Rs.INR]*\s*([\d,]+(?:\.\d{1,2})?)\s*(crore|cr|billion|bn)",
        ]
        for pat in revenue_patterns:
            match = re.search(pat, all_text, re.IGNORECASE)
            if match:
                snapshot["latest_revenue"] = f"₹{match.group(1)} {match.group(2)}"
                break

        profit_patterns = [
            r"(?:net\s*profit|PAT|profit\s*after\s*tax)[\s:]*[₹Rs.INR]*\s*([\d,]+(?:\.\d{1,2})?)\s*(crore|cr|billion|bn)",
        ]
        for pat in profit_patterns:
            match = re.search(pat, all_text, re.IGNORECASE)
            if match:
                snapshot["latest_net_profit"] = f"₹{match.group(1)} {match.group(2)}"
                break

        return snapshot

    def format_intelligence_for_artha(self, intel: Dict[str, Any], entity_name: str) -> str:
        """
        Formats gathered intelligence into a clean context block
        that Artha can seamlessly weave into its conversational response.

        This is NOT shown directly to the user — it's internal context for Artha's LLM prompt.
        """
        sections = []

        # Headlines
        if intel.get("headlines"):
            headline_lines = []
            for h in intel["headlines"][:5]:
                source = h.get("domain", h.get("source", ""))
                headline_lines.append(f"• {h['title']} ({source})")
            sections.append(f"LATEST NEWS FOR {entity_name.upper()}:\n" + "\n".join(headline_lines))

        # Market snapshot
        if intel.get("market_snapshot"):
            snap = intel["market_snapshot"]
            snap_lines = []
            if "current_price" in snap:
                snap_lines.append(f"• Current Price: ₹{snap['current_price']:,.2f}")
            if "market_cap" in snap:
                snap_lines.append(f"• Market Cap: {snap['market_cap']}")
            if "pe_ratio" in snap:
                snap_lines.append(f"• P/E Ratio: {snap['pe_ratio']}x")
            if "52w_high" in snap:
                snap_lines.append(f"• 52-Week High: ₹{snap['52w_high']}")
            if "52w_low" in snap:
                snap_lines.append(f"• 52-Week Low: ₹{snap['52w_low']}")
            if "latest_revenue" in snap:
                snap_lines.append(f"• Latest Revenue: {snap['latest_revenue']}")
            if "latest_net_profit" in snap:
                snap_lines.append(f"• Latest Net Profit: {snap['latest_net_profit']}")
            if snap_lines:
                sections.append("LIVE MARKET DATA:\n" + "\n".join(snap_lines))

        # Crawled article context
        if intel.get("crawled_articles"):
            article_sections = []
            for art in intel["crawled_articles"][:2]:
                domain = art.get("domain", "source")
                text = art.get("extracted_text", "")[:800]
                article_sections.append(f"[From {domain}]: {text}")
            sections.append("CRAWLED ARTICLE CONTEXT:\n" + "\n\n".join(article_sections))

        # Sources
        if intel.get("sources_consulted"):
            source_names = list(set(s.get("domain", "") for s in intel["sources_consulted"] if s.get("domain")))[:6]
            sections.append(f"SOURCES CONSULTED: {', '.join(source_names)}")

        return "\n\n".join(sections)

    def get_source_citations(self, intel: Dict[str, Any]) -> List[Dict[str, str]]:
        """Extract clean source citations for Artha's response footnotes."""
        citations = []
        seen_domains = set()
        for h in intel.get("headlines", []):
            domain = h.get("domain", "")
            if domain and domain not in seen_domains:
                seen_domains.add(domain)
                citations.append({
                    "title": h.get("title", ""),
                    "domain": domain,
                    "url": h.get("url", ""),
                    "source": h.get("source", domain),
                })
        return citations[:6]
