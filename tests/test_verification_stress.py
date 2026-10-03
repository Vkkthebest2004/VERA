"""
VERA — Comprehensive Verification Pipeline Stress Test
========================================================
12 test cases spanning:

  ✅ TRUE claims (real filings exist)
  🔴 EXAGGERATED claims (kernel of truth, inflated metrics)
  ❌ CONTRADICTED claims (official data refutes claim)
  🟡 UNSUBSTANTIATED claims (zero official evidence)
  ⚡ EDGE CASES (price targets, vague rumors, mixed entities)

Each test fires an HTTP call to the live FastAPI endpoint and validates:
  - correct overall_verdict
  - correct chatgpt_response format (VERDICT / CLAIM / WHY / EVIDENCE / VERA SAYS)
  - entity extraction
  - risk_level assignment
  - search_steps and citations presence
"""

import pytest
import httpx
import json
import time

BASE_URL = "http://127.0.0.1:8000"

TIMEOUT = 30.0


# ─────────────────────────────────────────────────────────────────────────────
# CATEGORY 1: CONFIRMED TRUE CLAIMS (should yield CONFIRMED_TRUE)
# ─────────────────────────────────────────────────────────────────────────────

class TestConfirmedTrue:
    """Claims backed by real canonical filings. VERA must return CONFIRMED_TRUE."""

    def test_reliance_edamamma_acquisition(self):
        """Reliance acquired 51% of Ed-a-Mamma for ₹350 Crore — exact match in filings."""
        resp = httpx.post(f"{BASE_URL}/api/v1/investigation/verify-claim", json={
            "text": "Reliance Retail acquired 51% stake in Ed-a-Mamma for ₹350 Crore"
        }, timeout=TIMEOUT)
        assert resp.status_code == 200
        data = resp.json()
        print(f"\n{'='*70}")
        print(f"CLAIM: Reliance Retail acquired 51% stake in Ed-a-Mamma for ₹350 Crore")
        print(f"VERDICT: {data['overall_verdict']}")
        print(f"HEADLINE: {data['verdict_headline']}")
        print(f"RISK: {data['protection_guidance']['risk_level'] if data.get('protection_guidance') else 'N/A'}")
        print(f"ENTITIES: {data.get('extracted_entities', [])}")
        print(f"CHATGPT RESPONSE:\n{data.get('chatgpt_response', '')}")
        print(f"{'='*70}")

        assert data["overall_verdict"] == "CONFIRMED_TRUE", \
            f"Expected CONFIRMED_TRUE, got {data['overall_verdict']}"
        assert data["protection_guidance"]["risk_level"] == "LOW"
        assert len(data["evidence_trail"]) >= 1
        assert any("Ed-a-Mamma" in e["exact_quote"] or "RRVL" in e["exact_quote"]
                    for e in data["evidence_trail"])

    def test_tata_motors_cv_revenue(self):
        """Tata Motors CV ₹24,000 Cr revenue with 180 bps margin — exact match."""
        resp = httpx.post(f"{BASE_URL}/api/v1/investigation/verify-claim", json={
            "text": "Tata Motors commercial vehicle revenue was ₹24,000 Crore with 180 bps margin expansion"
        }, timeout=TIMEOUT)
        assert resp.status_code == 200
        data = resp.json()
        print(f"\n{'='*70}")
        print(f"CLAIM: Tata Motors CV ₹24,000 Cr revenue, 180 bps margin")
        print(f"VERDICT: {data['overall_verdict']}")
        print(f"CHATGPT RESPONSE:\n{data.get('chatgpt_response', '')}")
        print(f"{'='*70}")

        assert data["overall_verdict"] == "CONFIRMED_TRUE", \
            f"Expected CONFIRMED_TRUE, got {data['overall_verdict']}"


# ─────────────────────────────────────────────────────────────────────────────
# CATEGORY 2: EXAGGERATED / MISLEADING CLAIMS (should yield MISLEADING_OR_EXAGGERATED)
# ─────────────────────────────────────────────────────────────────────────────

class TestMisleadingExaggerated:
    """Claims with a kernel of truth but heavily inflated numbers."""

    def test_tata_power_10x_solar_exaggeration(self):
        """Tata Power solar contract exists at ₹1,250 Cr, but claim says ₹12,500 Cr (10x)."""
        resp = httpx.post(f"{BASE_URL}/api/v1/investigation/verify-claim", json={
            "text": "Tata Power signed secret ₹12,500 Crore mega solar contract with Government of India!"
        }, timeout=TIMEOUT)
        assert resp.status_code == 200
        data = resp.json()
        print(f"\n{'='*70}")
        print(f"CLAIM: Tata Power ₹12,500 Cr solar contract (actually ₹1,250 Cr)")
        print(f"VERDICT: {data['overall_verdict']}")
        print(f"HEADLINE: {data['verdict_headline']}")
        print(f"RECONCILIATIONS: {data.get('numerical_reconciliations', [])}")
        print(f"CHATGPT RESPONSE:\n{data.get('chatgpt_response', '')}")
        print(f"{'='*70}")

        assert data["overall_verdict"] == "MISLEADING_OR_EXAGGERATED", \
            f"Expected MISLEADING_OR_EXAGGERATED, got {data['overall_verdict']}"
        assert data["protection_guidance"]["risk_level"] == "HIGH_RISK"
        # Should detect 10x numerical discrepancy
        assert len(data["numerical_reconciliations"]) >= 1
        recon = data["numerical_reconciliations"][0]
        assert recon["is_mismatch"] is True
        assert "10x" in recon["discrepancy_factor"] or "1,000%" in recon["discrepancy_factor"]


# ─────────────────────────────────────────────────────────────────────────────
# CATEGORY 3: CONTRADICTED / DEBUNKED CLAIMS (should yield DEBUNKED_FAKE or contradicted)
# ─────────────────────────────────────────────────────────────────────────────

class TestContradicted:
    """Claims that official filings directly disprove."""

    def test_suzlon_fake_profit_claim(self):
        """Claim: Suzlon ₹850 Cr profit. Reality: ₹203 Cr PAT (160% YoY, not 300%)."""
        resp = httpx.post(f"{BASE_URL}/api/v1/investigation/verify-claim", json={
            "text": "Suzlon Energy just posted ₹850 Crore profit, 300% growth! Target ₹120 by Diwali!"
        }, timeout=TIMEOUT)
        assert resp.status_code == 200
        data = resp.json()
        print(f"\n{'='*70}")
        print(f"CLAIM: Suzlon ₹850 Cr profit, 300% growth, ₹120 target")
        print(f"VERDICT: {data['overall_verdict']}")
        print(f"HEADLINE: {data['verdict_headline']}")
        print(f"RECONCILIATIONS: {data.get('numerical_reconciliations', [])}")
        print(f"CHATGPT RESPONSE:\n{data.get('chatgpt_response', '')}")
        print(f"{'='*70}")

        # Should recognize official Q3 shows ₹203 Cr, contradicting ₹850 Cr claim
        assert data["overall_verdict"] in ("DEBUNKED_FAKE", "MISLEADING_OR_EXAGGERATED"), \
            f"Expected DEBUNKED_FAKE or MISLEADING_OR_EXAGGERATED, got {data['overall_verdict']}"


# ─────────────────────────────────────────────────────────────────────────────
# CATEGORY 4: UNSUBSTANTIATED SPECULATION (should yield UNSUBSTANTIATED_SPECULATION)
# ─────────────────────────────────────────────────────────────────────────────

class TestUnsubstantiated:
    """Completely fabricated or rumored claims with zero official evidence."""

    def test_penny_stock_pump_dump(self):
        """Classic pump-and-dump: Apex Mining $50 Billion lithium vein, guaranteed 100x."""
        resp = httpx.post(f"{BASE_URL}/api/v1/investigation/verify-claim", json={
            "text": "Apex Mining has secret lithium vein worth $50 Billion. Guaranteed 100x return in 2 weeks!"
        }, timeout=TIMEOUT)
        assert resp.status_code == 200
        data = resp.json()
        print(f"\n{'='*70}")
        print(f"CLAIM: Apex Mining $50B lithium, guaranteed 100x")
        print(f"VERDICT: {data['overall_verdict']}")
        print(f"RISK: {data['protection_guidance']['risk_level']}")
        print(f"CHATGPT RESPONSE:\n{data.get('chatgpt_response', '')}")
        print(f"{'='*70}")

        assert data["overall_verdict"] == "UNSUBSTANTIATED_SPECULATION", \
            f"Expected UNSUBSTANTIATED_SPECULATION, got {data['overall_verdict']}"
        assert data["protection_guidance"]["risk_level"] == "EXTREME_RISK"

    def test_apple_500b_investment_unverified(self):
        """Apple $500B investment — no Indian regulatory filings exist for this."""
        resp = httpx.post(f"{BASE_URL}/api/v1/investigation/verify-claim", json={
            "text": "Apple is planning to hire 20,000 employees as part of a $500B U.S. investment"
        }, timeout=TIMEOUT)
        assert resp.status_code == 200
        data = resp.json()
        print(f"\n{'='*70}")
        print(f"CLAIM: Apple $500B US investment, 20,000 hires")
        print(f"VERDICT: {data['overall_verdict']}")
        print(f"CHATGPT RESPONSE:\n{data.get('chatgpt_response', '')}")
        print(f"{'='*70}")

        assert data["overall_verdict"] == "UNSUBSTANTIATED_SPECULATION", \
            f"Expected UNSUBSTANTIATED_SPECULATION, got {data['overall_verdict']}"

    def test_fabricated_adani_claim(self):
        """Totally fabricated: Adani Group secret deal — no filings exist."""
        resp = httpx.post(f"{BASE_URL}/api/v1/investigation/verify-claim", json={
            "text": "Adani Group secretly signed a $80 Billion deal with Saudi Arabia for green hydrogen. Stock will go 5x in 3 months!"
        }, timeout=TIMEOUT)
        assert resp.status_code == 200
        data = resp.json()
        print(f"\n{'='*70}")
        print(f"CLAIM: Adani $80B Saudi deal, stock 5x")
        print(f"VERDICT: {data['overall_verdict']}")
        print(f"RISK: {data['protection_guidance']['risk_level']}")
        print(f"RED FLAGS: {data.get('detected_red_flags', [])}")
        print(f"CHATGPT RESPONSE:\n{data.get('chatgpt_response', '')}")
        print(f"{'='*70}")

        assert data["overall_verdict"] == "UNSUBSTANTIATED_SPECULATION", \
            f"Expected UNSUBSTANTIATED_SPECULATION, got {data['overall_verdict']}"
        assert data["protection_guidance"]["risk_level"] == "EXTREME_RISK"

    def test_crypto_guaranteed_returns(self):
        """Crypto guaranteed returns scam — no regulatory backing."""
        resp = httpx.post(f"{BASE_URL}/api/v1/investigation/verify-claim", json={
            "text": "BlockchainMaxx coin backed by RBI, guaranteed 500% returns in 1 month. Join Telegram group now!"
        }, timeout=TIMEOUT)
        assert resp.status_code == 200
        data = resp.json()
        print(f"\n{'='*70}")
        print(f"CLAIM: BlockchainMaxx RBI-backed, 500% returns")
        print(f"VERDICT: {data['overall_verdict']}")
        print(f"RISK: {data['protection_guidance']['risk_level']}")
        print(f"CHATGPT RESPONSE:\n{data.get('chatgpt_response', '')}")
        print(f"{'='*70}")

        assert data["overall_verdict"] == "UNSUBSTANTIATED_SPECULATION", \
            f"Expected UNSUBSTANTIATED_SPECULATION, got {data['overall_verdict']}"


# ─────────────────────────────────────────────────────────────────────────────
# CATEGORY 5: EDGE CASES & TRICKY CLAIMS
# ─────────────────────────────────────────────────────────────────────────────

class TestEdgeCases:
    """Tricky edge cases that test VERA's boundary logic."""

    def test_vague_insider_tip(self):
        """Vague WhatsApp-style tip with no company name — tests entity extraction."""
        resp = httpx.post(f"{BASE_URL}/api/v1/investigation/verify-claim", json={
            "text": "Bhai ek aur tip hai, yeh stock upar jayega next week, 200% guaranteed. Source inside hai. Buy karo jaldi!"
        }, timeout=TIMEOUT)
        assert resp.status_code == 200
        data = resp.json()
        print(f"\n{'='*70}")
        print(f"CLAIM: Vague WhatsApp insider tip (no company named)")
        print(f"VERDICT: {data['overall_verdict']}")
        print(f"CHATGPT RESPONSE:\n{data.get('chatgpt_response', '')}")
        print(f"{'='*70}")

        # No filings can match this — must be unsubstantiated
        assert data["overall_verdict"] == "UNSUBSTANTIATED_SPECULATION"

    def test_mixed_true_and_fake_claim(self):
        """Combines a real entity (Tata Power) with exaggerated claim (₹12,500 Cr)."""
        resp = httpx.post(f"{BASE_URL}/api/v1/investigation/verify-claim", json={
            "text": "Breaking: Tata Power ₹12,500 Crore solar mega deal confirmed by PM Modi himself! Stock to hit ₹500!"
        }, timeout=TIMEOUT)
        assert resp.status_code == 200
        data = resp.json()
        print(f"\n{'='*70}")
        print(f"CLAIM: Tata Power ₹12,500 Cr + PM Modi endorsement + price target")
        print(f"VERDICT: {data['overall_verdict']}")
        print(f"HEADLINE: {data['verdict_headline']}")
        print(f"CHATGPT RESPONSE:\n{data.get('chatgpt_response', '')}")
        print(f"{'='*70}")

        assert data["overall_verdict"] == "MISLEADING_OR_EXAGGERATED", \
            f"Expected MISLEADING_OR_EXAGGERATED, got {data['overall_verdict']}"

    def test_old_news_presented_as_new(self):
        """Real Reliance acquisition presented as if it just happened."""
        resp = httpx.post(f"{BASE_URL}/api/v1/investigation/verify-claim", json={
            "text": "JUST IN! Reliance just acquired Ed-a-Mamma TODAY for 51% stake at ₹350 Crore! Buy RELIANCE now!"
        }, timeout=TIMEOUT)
        assert resp.status_code == 200
        data = resp.json()
        print(f"\n{'='*70}")
        print(f"CLAIM: Old Reliance acquisition framed as brand new")
        print(f"VERDICT: {data['overall_verdict']}")
        print(f"CHATGPT RESPONSE:\n{data.get('chatgpt_response', '')}")
        print(f"{'='*70}")

        # The underlying facts are real, but the "TODAY" framing is misleading
        # VERA should still find the filing and confirm the core facts
        assert data["overall_verdict"] in ("CONFIRMED_TRUE", "MISLEADING_OR_EXAGGERATED"), \
            f"Expected CONFIRMED_TRUE or MISLEADING_OR_EXAGGERATED, got {data['overall_verdict']}"


# ─────────────────────────────────────────────────────────────────────────────
# CATEGORY 6: RESPONSE FORMAT VALIDATION
# ─────────────────────────────────────────────────────────────────────────────

class TestResponseFormat:
    """Validates the Perplexity-style response structure & VERA format."""

    def test_chatgpt_response_format(self):
        """Every response must contain VERDICT / CLAIM / WHY / EVIDENCE / VERA SAYS."""
        resp = httpx.post(f"{BASE_URL}/api/v1/investigation/verify-claim", json={
            "text": "Suzlon Energy just posted ₹850 Crore profit, 300% growth! Target ₹120 by Diwali!"
        }, timeout=TIMEOUT)
        data = resp.json()
        chat = data.get("chatgpt_response", "")

        print(f"\n{'='*70}")
        print(f"FORMAT VALIDATION:")
        print(f"  VERDICT present: {'VERDICT' in chat}")
        print(f"  CLAIM present:   {'CLAIM' in chat}")
        print(f"  WHY present:     {'WHY' in chat}")
        print(f"  EVIDENCE present:{'EVIDENCE' in chat}")
        print(f"  VERA SAYS:       {'VERA SAYS' in chat}")
        print(f"{'='*70}")

        assert "VERDICT" in chat, "Missing VERDICT section in chatgpt_response"
        assert "CLAIM" in chat, "Missing CLAIM section in chatgpt_response"
        assert "WHY" in chat, "Missing WHY section in chatgpt_response"
        assert "EVIDENCE" in chat, "Missing EVIDENCE section in chatgpt_response"
        assert "VERA SAYS" in chat, "Missing VERA SAYS section in chatgpt_response"

    def test_search_steps_present(self):
        """Every response must include the 5 search pipeline steps."""
        resp = httpx.post(f"{BASE_URL}/api/v1/investigation/verify-claim", json={
            "text": "Apex Mining has secret lithium vein worth $50 Billion"
        }, timeout=TIMEOUT)
        data = resp.json()
        steps = data.get("search_steps", [])

        print(f"\n{'='*70}")
        print(f"SEARCH STEPS ({len(steps)} found):")
        for s in steps:
            print(f"  Step {s['step']}: {s['label']} — {s['status']}")
        print(f"{'='*70}")

        assert len(steps) == 5, f"Expected 5 search steps, got {len(steps)}"
        step_names = [s["name"] for s in steps]
        assert "SEARXNG_SEARCH" in step_names
        assert "CRAWL4AI_SCRAPING" in step_names
        assert "EVIDENCE_NORMALIZATION" in step_names
        assert "SOURCE_CREDIBILITY" in step_names
        assert "CLAIM_VERIFICATION" in step_names

    def test_citations_present_for_verified_claim(self):
        """Confirmed claims must produce at least 1 numbered citation."""
        resp = httpx.post(f"{BASE_URL}/api/v1/investigation/verify-claim", json={
            "text": "Reliance Retail acquired 51% stake in Ed-a-Mamma for ₹350 Crore"
        }, timeout=TIMEOUT)
        data = resp.json()
        citations = data.get("citations", [])

        print(f"\n{'='*70}")
        print(f"CITATIONS ({len(citations)} found):")
        for c in citations:
            print(f"  [{c['index']}] {c['title']} — {c['domain']} ({c['badge']})")
        print(f"{'='*70}")

        assert len(citations) >= 1, "Confirmed claims must produce at least 1 citation"
        assert all(c.get("credibility_score", 0) > 0 for c in citations)

    def test_statutory_search_context_always_present(self):
        """Every response must include the statutory search context metadata."""
        resp = httpx.post(f"{BASE_URL}/api/v1/investigation/verify-claim", json={
            "text": "Some random unverified rumor about XYZ Ltd"
        }, timeout=TIMEOUT)
        data = resp.json()
        ctx = data.get("statutory_search_context", {})

        assert "queried_exchanges" in ctx
        assert "statutory_mandate" in ctx
        assert "disclosure_window" in ctx
        assert "absence_of_evidence_notice" in ctx
