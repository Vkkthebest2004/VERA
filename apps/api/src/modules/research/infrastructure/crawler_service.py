"""
Crawler Service Facade.
Provides backward-compatible exports from the modular 'crawler' submodule:
- crawler.service.CrawlerService
- crawler.ssrf_guard.SSRFGuard
- crawler.browser_client.BrowserClientConfig
- crawler.fixtures.CanonicalFilingFixtures
"""

from .crawler.service import CrawlerService
from .crawler.ssrf_guard import SSRFGuard
from .crawler.browser_client import BrowserClientConfig
from .crawler.fixtures import CanonicalFilingFixtures

__all__ = [
    "CrawlerService",
    "SSRFGuard",
    "BrowserClientConfig",
    "CanonicalFilingFixtures",
]
