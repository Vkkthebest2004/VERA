from typing import Dict, List, Optional
from urllib.parse import urlparse
from .entities import Source, SourceType


class SourceRegistry:
    """Configurable registry of authoritative, regulatory, media, and social source domains.
    
    IMPORTANT SUTRA RULE:
    Source classification is metadata used for evidence assessment.
    Do NOT assume that source priority alone determines truth.
    """

    def __init__(self, custom_sources: Optional[Dict[str, Source]] = None):
        self._sources: Dict[str, Source] = custom_sources or self._default_registry()

    def _default_registry(self) -> Dict[str, Source]:
        return {
            "nseindia.com": Source(
                domain="nseindia.com",
                source_type=SourceType.EXCHANGE,
                priority=1,
                country="IN",
                description="National Stock Exchange of India (Official Filings & Announcements)",
            ),
            "bseindia.com": Source(
                domain="bseindia.com",
                source_type=SourceType.EXCHANGE,
                priority=1,
                country="IN",
                description="Bombay Stock Exchange (Corporate Regulation 30 Filings)",
            ),
            "sebi.gov.in": Source(
                domain="sebi.gov.in",
                source_type=SourceType.REGULATOR,
                priority=1,
                country="IN",
                description="Securities and Exchange Board of India (Orders & Regulatory Gazettes)",
            ),
            "rbi.org.in": Source(
                domain="rbi.org.in",
                source_type=SourceType.REGULATOR,
                priority=1,
                country="IN",
                description="Reserve Bank of India (Monetary Policy & Circulars)",
            ),
            "mca.gov.in": Source(
                domain="mca.gov.in",
                source_type=SourceType.GOVERNMENT,
                priority=1,
                country="IN",
                description="Ministry of Corporate Affairs (Statutory Registry of Companies)",
            ),
            "pib.gov.in": Source(
                domain="pib.gov.in",
                source_type=SourceType.GOVERNMENT,
                priority=1,
                country="IN",
                description="Press Information Bureau, Government of India",
            ),
            "reuters.com": Source(
                domain="reuters.com",
                source_type=SourceType.NEWS,
                priority=2,
                country="GLOBAL",
                description="Reuters Financial News",
            ),
            "bloomberg.com": Source(
                domain="bloomberg.com",
                source_type=SourceType.NEWS,
                priority=2,
                country="GLOBAL",
                description="Bloomberg Markets & Corporate News",
            ),
            "livemint.com": Source(
                domain="livemint.com",
                source_type=SourceType.NEWS,
                priority=2,
                country="IN",
                description="Mint Financial Newspaper & Corporate Reporting",
            ),
            "economictimes.indiatimes.com": Source(
                domain="economictimes.indiatimes.com",
                source_type=SourceType.NEWS,
                priority=2,
                country="IN",
                description="Economic Times Corporate Filings & Analysis",
            ),
            "moneycontrol.com": Source(
                domain="moneycontrol.com",
                source_type=SourceType.NEWS,
                priority=3,
                country="IN",
                description="Moneycontrol Market Reports",
            ),
            "sec.gov": Source(
                domain="sec.gov",
                source_type=SourceType.REGULATOR,
                priority=1,
                country="US",
                description="U.S. Securities and Exchange Commission (EDGAR Filings & Disclosures)",
            ),
            "business-standard.com": Source(
                domain="business-standard.com",
                source_type=SourceType.NEWS,
                priority=2,
                country="IN",
                description="Business Standard Corporate Disclosures & Analysis",
            ),
            "financialexpress.com": Source(
                domain="financialexpress.com",
                source_type=SourceType.NEWS,
                priority=2,
                country="IN",
                description="Financial Express Market News & Company Disclosures",
            ),
        }

    def get_domain_from_url(self, url: str) -> str:
        parsed = urlparse(url)
        netloc = parsed.netloc.lower()
        if netloc.startswith("www."):
            netloc = netloc[4:]
        return netloc

    def classify_source(self, url_or_domain: str) -> Source:
        domain = self.get_domain_from_url(url_or_domain) if "://" in url_or_domain else url_or_domain.lower()
        
        # Exact match
        if domain in self._sources:
            return self._sources[domain]
        
        # Subdomain match (e.g. corp.bseindia.com -> bseindia.com)
        for registered_domain, source in self._sources.items():
            if domain.endswith("." + registered_domain):
                return source

        # Default fallback classification
        return Source(
            domain=domain,
            source_type=SourceType.NEWS if any(k in domain for k in ["news", "times", "post", "wire"]) else SourceType.CORPORATE,
            priority=3,
            country="IN",
            description=f"Web source ({domain})",
        )

    def get_authoritative_domains(self) -> List[str]:
        return [
            src.domain
            for src in self._sources.values()
            if src.source_type in [SourceType.EXCHANGE, SourceType.REGULATOR, SourceType.GOVERNMENT]
        ]
