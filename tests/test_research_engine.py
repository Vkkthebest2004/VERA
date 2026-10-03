import pytest
from fastapi.testclient import TestClient
from apps.api.src.main import app
from apps.api.src.modules.research.domain.claim_decomposition import ClaimDecompositionService
from apps.api.src.modules.research.domain.numerical_engine import NumericalReasoningEngine
from apps.api.src.modules.research.domain.temporal_engine import TemporalReasoningEngine, EventStage
from apps.api.src.modules.research.domain.source_registry import SourceRegistry
from apps.api.src.modules.research.infrastructure.crawler_service import CrawlerService
from apps.api.src.modules.research.application.research_orchestrator import InvestigationService
from apps.api.src.modules.research.domain.entities import EvidenceStatus

client = TestClient(app)


def test_claim_decomposition():
    """Verify that compound claim is broken into isolated atomic assertions."""
    service = ClaimDecompositionService()
    claim = "ABC Ltd secretly acquired ₹45 crore land in Noida."
    assertions = service.decompose(claim)

    assert len(assertions) >= 3
    texts = [a.assertion_text.lower() for a in assertions]
    
    # 1. Acquisition event
    assert any("acquired" in t for t in texts)
    # 2. Location Noida
    assert any("noida" in t for t in texts)
    # 3. Monetary value ₹45 crore
    assert any("45 crore" in t for t in texts)
    # 4. Attribute secret
    assert any("secret" in t for t in texts)


def test_numerical_reasoning_deterministic():
    """Verify that Python handles deterministic currency math and ratio factor."""
    engine = NumericalReasoningEngine()
    
    # Normalization tests
    assert engine.normalize_to_inr("₹45 crore") == 450_000_000.0
    assert engine.normalize_to_inr("₹31.4 crore") == 314_000_000.0
    assert engine.normalize_to_inr("₹4,500 lakh") == 450_000_000.0
    assert engine.normalize_to_inr("450000000 INR") == 450_000_000.0

    # Comparison test
    comparison = engine.compare("Land Consideration", "₹45 crore", "₹31.4 crore")
    assert comparison.is_mismatch is True
    assert comparison.difference_amount == 136_000_000.0
    assert "Exaggeration" in comparison.ratio_factor


def test_temporal_reasoning_lifecycle():
    """Verify event stage hierarchy prevents premature completion classification."""
    engine = TemporalReasoningEngine()
    claimed = "ABC Ltd completed acquisition of XYZ"
    evidence = "ABC Ltd entered into a preliminary agreement for XYZ"

    tc = engine.compare_event_stages("Acquisition", claimed, evidence)
    assert tc.is_mismatch is True
    assert tc.claimed_stage == EventStage.COMPLETION.value
    assert tc.evidence_stage == EventStage.AGREEMENT.value
    assert "closing conditions" in tc.explanation.lower()


def test_ssrf_protection_crawler():
    """Verify that private network IP ranges and localhost are blocked."""
    crawler = CrawlerService()
    
    is_safe, reason = crawler.validate_url_safe("http://localhost:8080/admin")
    assert is_safe is False
    assert "localhost" in reason.lower()

    is_safe_127, reason_127 = crawler.validate_url_safe("http://127.0.0.1/secrets")
    assert is_safe_127 is False


def test_source_registry_classification():
    """Verify authoritative source prioritization and classification."""
    registry = SourceRegistry()
    
    nse_source = registry.classify_source("https://www.nseindia.com/filings")
    assert nse_source.source_type.value == "EXCHANGE"
    assert nse_source.priority == 1

    sebi_source = registry.classify_source("https://sebi.gov.in/orders")
    assert sebi_source.source_type.value == "REGULATOR"

    news_source = registry.classify_source("https://livemint.com/market")
    assert news_source.source_type.value == "NEWS"


@pytest.mark.asyncio
async def test_end_to_end_research_orchestrator():
    """Canonical test: 'ABC Ltd secretly acquired ₹45 crore land in Noida'
    Matches against official filing of ₹31.4 crore land in Noida.
    Asserts PARTIAL_EVIDENCE status, numerical variance, and transparent evidence trail.
    """
    service = InvestigationService()
    inv = await service.run_investigation("ABC Ltd secretly acquired ₹45 crore land in Noida.")

    assert inv.investigation_id.startswith("inv_")
    assert len(inv.assertions) >= 3
    assert len(inv.search_results) > 0
    assert len(inv.documents) > 0
    assert len(inv.evidence_trail) > 0
    assert inv.overall_status == EvidenceStatus.PARTIAL_EVIDENCE

    # Verify numerical comparison was populated
    assert len(inv.numerical_comparisons) > 0
    nc = inv.numerical_comparisons[0]
    assert nc.is_mismatch is True
    assert "31.4" in nc.evidence_raw

    # Verify uncertainty-aware explanation does NOT say "The claim is false"
    assert "The claim is false" not in inv.human_readable_explanation
    assert "support" in inv.human_readable_explanation.lower()
    assert "31.4" in inv.human_readable_explanation


def test_api_research_endpoint():
    """Test POST /api/v1/research/investigate endpoint."""
    response = client.post(
        "/api/v1/research/investigate",
        json={"claim": "ABC Ltd secretly acquired ₹45 crore land in Noida."},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["overall_status"] == "PARTIAL_EVIDENCE"
    assert len(data["assertions"]) >= 3
    assert len(data["evidence_trail"]) > 0
    assert len(data["numerical_comparisons"]) > 0
    assert "uncertainty_notice" in data


def test_api_presets_and_sources():
    """Test GET /api/v1/research/presets and GET /api/v1/research/sources."""
    res_presets = client.get("/api/v1/research/presets")
    assert res_presets.status_code == 200
    presets = res_presets.json()
    assert len(presets) >= 3
    assert any(p["id"] == "PRESET_ABC_NOIDA" for p in presets)

    res_sources = client.get("/api/v1/research/sources")
    assert res_sources.status_code == 200
    sources = res_sources.json()
    assert len(sources) >= 5
