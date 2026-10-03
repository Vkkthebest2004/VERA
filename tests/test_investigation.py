import pytest
from fastapi.testclient import TestClient
from apps.api.src.main import app

client = TestClient(app)


def test_investigate_tata_power_10x_exaggeration():
    """Verify that viral claim claiming ₹12,500 Cr is reconciled against official filing of ₹1,250 Cr."""
    payload = {
        "text": "🔥🚨 FORWARDED MANY TIMES 🚨🔥 Tata Power signed secret ₹12,500 Crore mega solar contract with Government of India! Guaranteed upper circuit 20%!",
        "channel": "WHATSAPP",
    }
    response = client.post("/api/v1/investigation/verify-claim", json=payload)
    assert response.status_code == 200
    data = response.json()

    # Verdict should catch the exaggeration
    assert data["overall_verdict"] == "MISLEADING_OR_EXAGGERATED"
    assert "Misleading" in data["verdict_headline"]

    # Numerical reconciliation must catch the 10x inflation
    assert len(data["numerical_reconciliations"]) >= 1
    recon = data["numerical_reconciliations"][0]
    assert "12,500" in recon["claimed_value"]
    assert "1,250" in recon["official_value"]
    assert "10x Exaggeration" in recon["discrepancy_factor"]
    assert recon["is_mismatch"] is True

    # Evidence trail must contain statutory Tier 1 filing
    assert len(data["evidence_trail"]) >= 1
    top_evidence = data["evidence_trail"][0]
    assert top_evidence["source_tier"] == "TIER_1_REGULATORY"
    assert "Tata Power" in top_evidence["document_title"]
    assert top_evidence["page_number"] == 2
    assert top_evidence["paragraph_number"] == 4
    assert "₹1,250 Crore" in top_evidence["exact_quote"]
    assert top_evidence["relationship"] == "PARTIAL_MATCH"

    # Investor protection guidance must be provided
    assert data["protection_guidance"] is not None
    assert "scores.sebi.gov.in" in data["protection_guidance"]["official_redressal_url"]
    assert len(data["protection_guidance"]["recommended_actions"]) >= 3


def test_investigate_suzlon_contradicted():
    """Verify that fake earnings numbers are caught and contradicted by official audited reports."""
    payload = {
        "text": "Suzlon Energy Q3 EBITDA jumped 300% YoY to ₹850 Crore! Target price ₹120 by Diwali!",
        "channel": "INSTAGRAM",
    }
    response = client.post("/api/v1/investigation/verify-claim", json=payload)
    assert response.status_code == 200
    data = response.json()

    # Contradiction detected
    assert data["overall_verdict"] in ["DEBUNKED_FAKE", "MISLEADING_OR_EXAGGERATED"]
    assert len(data["evidence_trail"]) >= 1
    top_ev = data["evidence_trail"][0]
    assert "Audited Financial Results" in top_ev["document_title"]
    assert "203 Crore" in top_ev["exact_quote"]


def test_investigate_reliance_confirmed_true():
    """Verify that an authentic regulatory filing is confirmed 100% true with exact match."""
    payload = {
        "text": "Reliance Retail Ventures acquires 51% stake in Ed-a-Mamma for ₹350 Crore.",
        "channel": "PDF",
    }
    response = client.post("/api/v1/investigation/verify-claim", json=payload)
    assert response.status_code == 200
    data = response.json()

    assert data["overall_verdict"] == "CONFIRMED_TRUE"
    assert "Confirmed" in data["verdict_headline"]
    assert len(data["numerical_reconciliations"]) >= 1
    assert data["numerical_reconciliations"][0]["is_mismatch"] is False
    assert data["numerical_reconciliations"][0]["discrepancy_factor"] == "Exact Match (100% Verified)"


def test_investigate_unsubstantiated_penny_stock():
    """Verify that claims with zero regulatory trail receive an uncertainty-aware assessment."""
    payload = {
        "text": "Confidential operator leak: Microcap company bagged ₹300 Cr export order from UAE, 100% guaranteed upper circuit!",
        "channel": "TELEGRAM",
    }
    response = client.post("/api/v1/investigation/verify-claim", json=payload)
    assert response.status_code == 200
    data = response.json()

    assert data["overall_verdict"] == "UNSUBSTANTIATED_SPECULATION"
    assert data["protection_guidance"]["risk_level"] == "EXTREME_RISK"
