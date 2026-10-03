from typing import Dict, Any, Tuple
from urllib.parse import urlparse


class SourceCredibilityEvaluator:
    """Evaluates the legal authority, factual reliability, and epistemic credibility of sources.
    Uses VERA's 4-Tier Provenance Hierarchy.
    """

    STATUTORY_DOMAINS = {
        "bseindia.com": ("TIER_1_STATUTORY", 1.0, "🏛️ Statutory Stock Exchange Filing"),
        "nseindia.com": ("TIER_1_STATUTORY", 1.0, "🏛️ Statutory Stock Exchange Filing"),
        "sebi.gov.in": ("TIER_1_STATUTORY", 1.0, "⚖️ Statutory Securities Regulator"),
        "sec.gov": ("TIER_1_STATUTORY", 1.0, "🛡️ U.S. SEC Official EDGAR Registry"),
        "mca.gov.in": ("TIER_1_STATUTORY", 1.0, "📋 Ministry of Corporate Affairs"),
        "rbi.org.in": ("TIER_1_STATUTORY", 1.0, "🏦 Reserve Bank of India"),
        "pib.gov.in": ("TIER_1_STATUTORY", 0.95, "🇮🇳 Press Information Bureau (Govt of India)"),
    }

    ACCREDITED_NEWS_DOMAINS = {
        "reuters.com": ("TIER_3_FINANCIAL_WIRE", 0.85, "🌐 Accredited Global Financial Wire"),
        "bloomberg.com": ("TIER_3_FINANCIAL_WIRE", 0.85, "📰 Institutional Financial Reporting"),
        "livemint.com": ("TIER_3_FINANCIAL_WIRE", 0.80, "📑 Verified Domestic Financial Press"),
        "economictimes.indiatimes.com": ("TIER_3_FINANCIAL_WIRE", 0.80, "📑 Corporate Reporting & Filings"),
        "business-standard.com": ("TIER_3_FINANCIAL_WIRE", 0.80, "📑 Verified Financial Press"),
        "financialexpress.com": ("TIER_3_FINANCIAL_WIRE", 0.80, "📑 Market Reporting Wire"),
        "moneycontrol.com": ("TIER_3_FINANCIAL_WIRE", 0.75, "📊 Financial Market Portal"),
    }

    def evaluate_source(self, url: str) -> Dict[str, Any]:
        """Evaluates domain credibility, returning tier, numerical score, and display badge."""
        if not url:
            return {
                "domain": "unknown",
                "tier": "TIER_4_COMMUNITY",
                "credibility_score": 0.30,
                "badge": "⚠️ Unverified Web Source",
                "is_authoritative": False,
            }

        parsed = urlparse(url)
        domain = parsed.netloc.lower()
        if domain.startswith("www."):
            domain = domain[4:]

        # 1. Check Tier 1 Statutory
        for stat_dom, (tier, score, badge) in self.STATUTORY_DOMAINS.items():
            if domain == stat_dom or domain.endswith("." + stat_dom):
                return {
                    "domain": domain,
                    "tier": tier,
                    "credibility_score": score,
                    "badge": badge,
                    "is_authoritative": True,
                }

        # 2. Check Tier 3 Financial News
        for news_dom, (tier, score, badge) in self.ACCREDITED_NEWS_DOMAINS.items():
            if domain == news_dom or domain.endswith("." + news_dom):
                return {
                    "domain": domain,
                    "tier": tier,
                    "credibility_score": score,
                    "badge": badge,
                    "is_authoritative": True,
                }

        # 3. Check Corporate IR / Official Company Portals
        if any(keyword in url.lower() for keyword in ["/investor", "/investors", "/press-release", "/newsroom", "/ir/"]):
            return {
                "domain": domain,
                "tier": "TIER_2_OFFICIAL_IR",
                "credibility_score": 0.90,
                "badge": "🏢 Official Company Investor Relations",
                "is_authoritative": True,
            }

        # 4. Default Tier 4 General Web
        return {
            "domain": domain,
            "tier": "TIER_4_COMMUNITY",
            "credibility_score": 0.35,
            "badge": "🌐 General Web Content",
            "is_authoritative": False,
        }
