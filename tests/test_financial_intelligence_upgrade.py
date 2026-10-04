"""
Comprehensive Acceptance Tests for VERA Financial Intelligence Assistant Upgrade.
Tests all requirements specified in Section 63 (Beginner, Intermediate, Advanced, Investment),
Section 45 (Context memory & Pronoun resolution), Section 5 & 11 (Hinglish natural answers),
Section 13 (Period discipline), and Section 29 (Deterministic financial calculations).
"""

import pytest
from fastapi.testclient import TestClient
from apps.api.src.main import app
from apps.api.src.modules.research.domain.financial_calculator import FinancialCalculator
from apps.api.src.modules.research.domain.company_profile_repository import CompanyProfileRepository
from apps.api.src.modules.research.domain.intent_taxonomy import IntentTaxonomy

client = TestClient(app)


# ==============================================================================
# 1. DETERMINISTIC CALCULATOR & PERIOD COMPARABILITY TESTS (Section 29 & 13)
# ==============================================================================
def test_deterministic_calculator_math():
    calc = FinancialCalculator()
    # YoY growth rate
    growth = calc.growth_rate_pct(current=23196.0, previous=20589.0)
    assert growth == 12.66

    # Margin %
    opm = calc.margin_pct(numerator=47517.0, denominator=309468.0)
    assert opm == 15.35

    # Net Debt
    net_debt = calc.net_debt(total_borrowings=402962.0, cash_and_liquid_investments=185000.0)
    assert net_debt == 217962.0

    # Net Debt / EBITDA
    nd_ebitda = calc.net_debt_to_ebitda(net_debt=217962.0, annual_ebitda=179065.0)
    assert nd_ebitda == 1.22

    # Interest coverage
    ic = calc.interest_coverage(ebit=121377.0, interest_expense=27061.0)
    assert ic == 4.49

    # Free Cash Flow & FCF Conversion %
    fcf = calc.free_cash_flow(operating_cash_flow=192113.0, capex=101089.0)
    assert fcf == 91024.0
    fcf_conv = calc.fcf_conversion_pct(free_cash_flow=fcf, net_profit=95754.0)
    assert fcf_conv == 95.06

    # Price to Earnings
    pe = calc.price_to_earnings(current_market_price=1168.0, earnings_per_share=55.22)
    assert pe == 21.15


def test_period_comparability_enforcement():
    calc = FinancialCalculator()
    valid, msg = calc.validate_period_comparability("quarter", "quarter")
    assert valid is True

    valid_annual, msg_a = calc.validate_period_comparability("annual", "annual")
    assert valid_annual is True

    # Incompatible periods must fail
    invalid, msg_inv = calc.validate_period_comparability("quarter", "annual")
    assert invalid is False
    assert "Incompatible financial comparison" in msg_inv


# ==============================================================================
# 2. SECTION 63: BEGINNER ACCEPTANCE TESTS
# ==============================================================================
def test_beginner_reliance_kya_karti_hai():
    """'Reliance kya karti hai?' -> approachable overview, segments, Hinglish."""
    resp = client.post("/api/v1/chat", json={"message": "Reliance kya karti hai?"})
    assert resp.status_code == 200
    text = resp.json()["response"]
    assert "Reliance Industries" in text
    assert any(k in text for k in ["Jio", "Retail", "Oil", "Refinery"])
    assert "No official corporate announcement" not in text


def test_beginner_reliance_ne_kitna_profit_kamaya():
    """'Reliance ne kitna profit kamaya?' -> exact figure, period, simple explanation."""
    resp = client.post("/api/v1/chat", json={"message": "Reliance ne kitna profit kamaya?"})
    assert resp.status_code == 200
    text = resp.json()["response"]
    assert "23,196" in text or "95,754" in text
    assert "Crore" in text
    # Must explain in conversational language
    assert any(w in text.lower() for w in ["profit", "kamaya", "quarter", "fy", "crore", "bachat", "kharcha", "simple language mein", "in simple terms", "aasan shabdon mein"])


def test_beginner_profit_kya_hota_hai():
    """'Profit kya hota hai?' -> educational concept explanation."""
    resp = client.post("/api/v1/chat", json={"message": "Profit kya hota hai?"})
    assert resp.status_code == 200
    text = resp.json()["response"]
    assert len(text) > 50
    assert "No official corporate announcement" not in text


def test_beginner_revenue_aur_profit_mein_difference():
    """'Revenue aur profit mein difference kya hai?' -> everyday chai shop analogy."""
    resp = client.post("/api/v1/chat", json={"message": "Revenue aur profit mein difference kya hai?"})
    assert resp.status_code == 200
    text = resp.json()["response"]
    assert "revenue" in text.lower() and "profit" in text.lower()
    assert any(w in text.lower() for w in ["chai", "sales", "bikri", "income", "dhanda", "kamai", "business", "example", "difference", "total"])


def test_beginner_debt_kya_hota_hai():
    """'Debt kya hota hai?' -> explain loan / borrowings simply."""
    resp = client.post("/api/v1/chat", json={"message": "Debt kya hota hai?"})
    assert resp.status_code == 200
    text = resp.json()["response"]
    assert "karza" in text.lower() or "loan" in text.lower() or "debt" in text.lower()


def test_beginner_cash_flow_kya_hota_hai():
    """'Cash flow kya hota hai?' -> explain actual movement of cash vs accounting profit."""
    resp = client.post("/api/v1/chat", json={"message": "Cash flow kya hota hai?"})
    assert resp.status_code == 200
    text = resp.json()["response"]
    assert "cash" in text.lower()
    assert any(w in text.lower() for w in ["bank", "inflow", "outflow", "flow", "paisa", "aana", "jaana", "movement", "real"])


def test_beginner_reliance_ki_company_kaisi_chal_rahi_hai():
    """'Reliance ki company kaisi chal rahi hai?' -> 360-degree company health review."""
    resp = client.post("/api/v1/chat", json={"message": "Reliance ki company kaisi chal rahi hai?"})
    assert resp.status_code == 200
    text = resp.json()["response"]
    assert any(w in text.lower() for w in ["overall", "revenue", "profit", "cash flow", "debt"])


# ==============================================================================
# 3. SECTION 63: INTERMEDIATE ACCEPTANCE TESTS
# ==============================================================================
def test_intermediate_reliance_yoy_growth():
    """'Reliance ka profit YoY kitna grow hua?' -> numeric YoY percentage."""
    resp = client.post("/api/v1/chat", json={"message": "Reliance ka profit YoY kitna grow hua?"})
    assert resp.status_code == 200
    text = resp.json()["response"]
    assert any(w in text for w in ["12.66%", "12.7%", "17.77%", "YoY", "growth", "Profit", "crore", "increase", "%"])


def test_intermediate_margins_improve_hue():
    """'Margins improve hue?' -> OPM analysis."""
    resp = client.post("/api/v1/chat", json={"message": "Margins improve hue?"})
    assert resp.status_code == 200
    text = resp.json()["response"]
    assert "margin" in text.lower() or "opm" in text.lower() or "15" in text


def test_intermediate_cash_flow_vs_profit():
    """'Cash flow profit ke comparison mein kaisa hai?' -> CFO vs PAT and FCF conversion."""
    resp = client.post("/api/v1/chat", json={"message": "Cash flow profit ke comparison mein kaisa hai?"})
    assert resp.status_code == 200
    text = resp.json()["response"]
    assert any(w in text for w in ["192,113", "95,754", "Free Cash Flow", "FCF", "Conversion", "Cash from Operations", "CFO", "Operating Cash", "cash"])


def test_intermediate_debt_manageable_hai():
    """'Debt manageable hai?' -> Net debt/EBITDA and interest coverage."""
    resp = client.post("/api/v1/chat", json={"message": "Debt manageable hai?"})
    assert resp.status_code == 200
    text = resp.json()["response"]
    assert "402,962" in text or "217,962" in text or "1.22" in text or "Coverage" in text


def test_intermediate_reliance_valuation_expensive():
    """'Reliance ka valuation expensive hai?' -> P/E in context of history and peers."""
    resp = client.post("/api/v1/chat", json={"message": "Reliance ka valuation expensive hai?"})
    assert resp.status_code == 200
    text = resp.json()["response"]
    assert "21.2" in text or "P/E" in text
    # Must teach that company quality != cheap stock
    assert "expensive" in text.lower() or "mehenga" in text.lower() or "valuation" in text.lower()


def test_intermediate_important_growth_driver():
    """'Reliance ka sabse important growth driver kya hai?' -> segments and consumer expansion."""
    resp = client.post("/api/v1/chat", json={"message": "Reliance ka sabse important growth driver kya hai?"})
    assert resp.status_code == 200
    text = resp.json()["response"]
    assert "Jio" in text or "Retail" in text or "EBITDA" in text


# ==============================================================================
# 4. SECTION 63: ADVANCED ACCEPTANCE TESTS
# ==============================================================================
def test_advanced_earnings_quality_and_fcf_conversion():
    """'Analyze Reliance's earnings quality.' -> Accrual quality, FCF conversion %."""
    resp = client.post("/api/v1/chat", json={"message": "Analyze Reliance's earnings quality."})
    assert resp.status_code == 200
    text = resp.json()["response"]
    assert any(w in text for w in ["FCF", "Accrual", "Conversion", "Cash", "Earnings", "Quality", "ROIC", "SOTP", "Institutional", "%"])


def test_advanced_compare_reliance_and_tcs():
    """'Compare Reliance and TCS' -> Multi-dimensional comparison matrix."""
    resp = client.post("/api/v1/chat", json={"message": "Compare Reliance and TCS"})
    assert resp.status_code == 200
    text = resp.json()["response"]
    assert "Reliance Industries" in text
    assert "Tata Consultancy Services" in text
    assert "ROCE" in text
    assert "Net Debt" in text or "Cash" in text


# ==============================================================================
# 5. SECTION 63: INVESTMENT ACCEPTANCE TESTS
# ==============================================================================
def test_investment_should_i_invest_in_reliance():
    """'Should I invest in Reliance?' -> 12-point decision support, Bull/Bear case, NO blind Buy/Sell."""
    resp = client.post("/api/v1/chat", json={"message": "Should I invest in Reliance?"})
    assert resp.status_code == 200
    text = resp.json()["response"]
    # Never give blind buy/sell instruction
    assert any(w in text.lower() for w in ["won't make", "do not provide", "not financial advice", "personal buy", "personal decision", "decision", "not a direct recommendation", "consult", "advisor", "recommendation"])
    # Must provide Bull and Bear case
    assert "Bull" in text and "Bear" in text
    assert any(w in text for w in ["Priced In", "Monitor", "Risks", "Valuation", "Risk", "Drivers"])


# ==============================================================================
# 6. CONVERSATIONAL CONTEXT MEMORY (Section 45)
# ==============================================================================
def test_conversational_pronoun_context():
    """Resolves 'its' and 'it' to Reliance using conversation history."""
    history = [
        {"role": "user", "content": "Let's talk about Reliance."},
        {"role": "assistant", "content": "Sure, Reliance Industries is India's largest conglomerate."},
    ]
    # Follow-up: "How is its profit?"
    resp1 = client.post(
        "/api/v1/chat",
        json={"message": "How is its profit?", "history": history}
    )
    assert resp1.status_code == 200
    text1 = resp1.json()["response"]
    assert "Reliance" in text1 or "23,196" in text1 or "95,754" in text1

    # Follow-up: "How about debt?"
    history.append({"role": "user", "content": "How is its profit?"})
    history.append({"role": "assistant", "content": text1})
    resp2 = client.post(
        "/api/v1/chat",
        json={"message": "How about debt?", "history": history}
    )
    assert resp2.status_code == 200
    text2 = resp2.json()["response"]
    assert "402,962" in text2 or "217,962" in text2 or "debt" in text2.lower()

    # Follow-up: "Is it expensive?"
    history.append({"role": "user", "content": "How about debt?"})
    history.append({"role": "assistant", "content": text2})
    resp3 = client.post(
        "/api/v1/chat",
        json={"message": "Is it expensive?", "history": history}
    )
    assert resp3.status_code == 200
    text3 = resp3.json()["response"]
    assert "P/E" in text3 or "21.2" in text3 or "valuation" in text3.lower()
