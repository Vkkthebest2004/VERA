import pytest
from fastapi.testclient import TestClient
from apps.api.src.main import app

client = TestClient(app)


def test_chat_explain_reliance():
    """Verify that asking to explain Reliance yields an approachable company breakdown, NOT a rumor denial."""
    response = client.post(
        "/api/v1/chat",
        json={
            "message": "EXPLAIN me about reliance industries",
            "company_id": "RELIANCE",
            "company_name": "Reliance Industries Ltd",
        },
    )
    assert response.status_code == 200
    data = response.json()
    resp_text = data["response"]

    # Must NOT contain the rumor denial text
    assert "No official corporate announcement, regulatory filing, or accredited disclosure exists" not in resp_text
    assert "Absence of Evidence is Not Proof of Falsehood" not in resp_text

    # Must contain approachable company breakdown
    assert "Reliance Industries" in resp_text
    assert "Jio" in resp_text
    assert "Retail" in resp_text


def test_chat_general_market_questions():
    """Verify that general financial questions are answered with easy, approachable concepts."""
    queries = [
        ("How does stock market work?", ["market", "company", "shares", "buy", "sell"]),
        ("What is Nifty and Sensex?", ["nifty", "sensex", "index", "50", "30", "market"]),
        ("Why do stock prices move up and down?", ["demand", "supply", "price", "buyer", "seller", "move"]),
        ("Mutual Funds vs Direct Stocks", ["fund", "diversif", "stock", "portfolio", "risk", "basket"]),
        ("What is an IPO?", ["ipo", "public", "shares", "company", "list"]),
        ("What is inflation?", ["inflation", "price", "money", "purchasing power", "mehengai"]),
    ]
    for q, expected_keywords in queries:
        response = client.post(
            "/api/v1/chat",
            json={"message": q},
        )
        assert response.status_code == 200
        data = response.json()
        resp_text = data["response"]
        assert any(kw.lower() in resp_text.lower() for kw in expected_keywords)
        # Must never be a rumor denial
        assert "No official corporate announcement" not in resp_text


def test_chat_statutory_rumor_audit():
    """Verify that actual viral rumors with numbers trigger statutory filings checks on BSE/NSE."""
    response = client.post(
        "/api/v1/chat",
        json={
            "message": "Is 12500 cr solar contract true?",
            "company_id": "TATAPOWER",
            "company_name": "Tata Power Company Ltd",
        },
    )
    assert response.status_code == 200
    data = response.json()
    resp_text = data["response"]
    assert any(k in resp_text.lower() for k in ["filing", "exchange", "bse", "nse", "official", "contract"])
    assert any(k in resp_text.lower() for k in ["solar", "contract", "tata power", "verified", "crore", "1,250", "12,500", "12500"])
