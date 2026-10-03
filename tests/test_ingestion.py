import pytest
from fastapi.testclient import TestClient
from apps.api.src.main import app
from apps.api.src.modules.ingestion.domain.services import FinancialInformationDehypingService
from apps.api.src.modules.ingestion.domain.entities import ChannelType, RedFlagSeverity

client = TestClient(app)


def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] == "vera-api"


def test_presets_endpoint():
    response = client.get("/api/v1/ingestion/presets")
    assert response.status_code == 200
    presets = response.json()
    assert len(presets) >= 4
    preset_ids = [p["id"] for p in presets]
    assert "whatsapp_viral_tip" in preset_ids
    assert "instagram_finfluencer_reel" in preset_ids


def test_whatsapp_viral_extraction():
    service = FinancialInformationDehypingService()
    viral_text = (
        "🔥🚨 FORWARDED MANY TIMES 🚨🔥\n"
        "BREAKING INSIDER NEWS!! Tata Power signed secret ₹12,500 Crore mega solar contract "
        "with Government of India! Big operators loading heavily before 9:15 AM tomorrow!!\n"
        "Guaranteed upper circuit 20%!! Target price ₹550 in 1 week!! "
        "Don't miss this multibagger rocket jackpot load heavily 🚀💰💸!!"
    )
    dossier = service.analyze_content(viral_text, ChannelType.WHATSAPP)
    
    # 1. Hype Score should be very high
    assert dossier.hype_score >= 0.7
    assert dossier.sentiment == "HYPER_BULLISH"
    
    # 2. Critical Red flags detected
    flag_names = [f.flag_name for f in dossier.red_flags]
    assert "Guaranteed Return Claim" in flag_names or "Upper Circuit / Pump Signal" in flag_names
    assert "Artificial Urgency & FOMO" in flag_names
    assert any(f.severity in (RedFlagSeverity.HIGH, RedFlagSeverity.CRITICAL) for f in dossier.red_flags)
    
    # 3. Financial Entities identified
    entity_names = [e.name for e in dossier.entities]
    assert "Tata Power" in entity_names
    tata = next(e for e in dossier.entities if e.name == "Tata Power")
    assert tata.ticker == "TATAPOWER"
    
    # 4. Metrics extracted
    raw_metrics = [m.raw_text for m in dossier.metrics]
    assert any("12,500" in m or "₹12,500" in m for m in raw_metrics)
    assert any("20%" in m for m in raw_metrics)
    
    # 5. Assertions decomposed
    assert len(dossier.assertions) >= 1
    assert any("solar" in a.statement.lower() or "contract" in a.statement.lower() for a in dossier.assertions)
    
    # 6. De-hyped summary produced
    assert len(dossier.dehyped_summary) > 20
    assert "Tata Power" in dossier.dehyped_summary


def test_official_disclosure_low_hype():
    service = FinancialInformationDehypingService()
    official_text = (
        "Reliance Industries Limited announces that Reliance Retail Ventures has entered into "
        "a definitive agreement to acquire a 51% majority stake in Ed-a-Mamma for an aggregate "
        "cash consideration of ₹350 Crore. The transaction has received all statutory approvals."
    )
    dossier = service.analyze_content(official_text, ChannelType.PDF)
    
    # Hype score should be calm/low
    assert dossier.hype_score <= 0.3
    assert len(dossier.red_flags) == 0  # No sensationalist pump flags
    
    # Entity check
    assert any(e.name in ["Reliance Industries", "Reliance"] for e in dossier.entities)
    
    # Assertion check
    assert len(dossier.assertions) >= 1
    assert any(a.category in ["M&A_SHAREHOLDING", "CONTRACT_DEAL"] for a in dossier.assertions)


def test_api_analyze_text():
    response = client.post(
        "/api/v1/ingestion/analyze-text",
        json={
            "text": "Suzlon Energy Q3 EBITDA jumped 300% YoY to ₹850 Crore! Buy today before it flies!",
            "channel": "INSTAGRAM",
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["channel"] == "INSTAGRAM"
    assert len(data["entities"]) > 0
    assert data["entities"][0]["ticker"] == "SUZLON"
    assert len(data["assertions"]) > 0
    assert len(data["red_flags"]) > 0


def test_audio_transcription_and_analysis():
    import os
    if os.path.exists("test_voicenote.wav"):
        with open("test_voicenote.wav", "rb") as f:
            response = client.post(
                "/api/v1/ingestion/analyze-file",
                files={"file": ("test_voicenote.wav", f, "audio/wav")},
            )
        assert response.status_code == 200
        data = response.json()
        assert data["channel"] == "AUDIO"
        assert "VERBATIM AUDIO TRANSCRIPTION" in data["raw_verbatim_text"]
        assert len(data["assertions"]) >= 1
        assert "human_readable_explanation" in data
        assert "plain_summary" in data["human_readable_explanation"]
