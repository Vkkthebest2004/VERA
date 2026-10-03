from fastapi import APIRouter, File, HTTPException, UploadFile
from typing import List
from ..domain.entities import ChannelType
from ..application.use_cases import IngestFinancialInformationUseCase
from .schemas import (
    FactCheckDossierResponse,
    FinancialEntityDTO,
    FinancialMetricDTO,
    RedFlagDTO,
    ExtractedAssertionDTO,
    PresetExample,
    TextIngestRequest,
    UrlIngestRequest,
)

router = APIRouter(prefix="/api/v1/ingestion", tags=["Multi-Modal Ingestion"])
use_case = IngestFinancialInformationUseCase()

PRESET_EXAMPLES = [
    PresetExample(
        id="whatsapp_viral_tip",
        title="WhatsApp Viral Stock Tip",
        channel="WHATSAPP",
        badge="High Risk / Viral Forward",
        preview="Tata Power secret ₹12,500 Cr deal, 20% Upper Circuit tomorrow at 9:15 AM...",
        full_text=(
            "🔥🚨 FORWARDED MANY TIMES 🚨🔥\n"
            "BREAKING INSIDER NEWS!! Tata Power signed secret ₹12,500 Crore mega solar contract "
            "with Government of India! Big operators loading heavily before 9:15 AM tomorrow!!\n"
            "Guaranteed upper circuit 20%!! Target price ₹550 in 1 week!! "
            "Don't miss this multibagger rocket jackpot load heavily 🚀💰💸!!"
        ),
    ),
    PresetExample(
        id="instagram_finfluencer_reel",
        title="Instagram Finfluencer Reel Post",
        channel="INSTAGRAM",
        badge="Finfluencer Hype",
        preview="Suzlon Energy FIIs bought 15% stake, Q3 EBITDA jumped 300% YoY to ₹850 Cr...",
        full_text=(
            "Why I just put ₹5 Lakhs into SUZLON ENERGY! 📈🔥\n"
            "FIIs bought a massive 15% stake this quarter. Q3 EBITDA jumped 300% YoY to ₹850 Crore! "
            "Debt reduced by 80%. This stock is heading straight to ₹120 by Diwali!\n"
            "Don't miss this 10x multibagger gem! (Not SEBI registered, for educational purpose only) 💎🎯"
        ),
    ),
    PresetExample(
        id="telegram_penny_pump",
        title="Telegram Penny Stock Pump",
        channel="TELEGRAM",
        badge="Pump & Dump Alert",
        preview="Confidential operator leak: ₹300 Cr UAE export order, 100% risk free guaranteed return...",
        full_text=(
            "⚠️ CONFIDENTIAL OPERATOR LEAK: Penny stock under ₹15!\n"
            "Company bagged ₹300 Crore export order from UAE. "
            "100% risk-free guaranteed return. 5 consecutive upper circuits starting Monday! "
            "Hurry, buy today before it blasts off and news hits CNBC! 🚀💣"
        ),
    ),
    PresetExample(
        id="official_disclosure",
        title="Official BSE/NSE Disclosure",
        channel="PDF",
        badge="Authoritative Source",
        preview="Reliance Industries enters into definitive agreement to acquire 51% stake for ₹350 Crore...",
        full_text=(
            "RELIANCE INDUSTRIES LIMITED — DISCLOSURE UNDER REGULATION 30 OF SEBI (LODR) REGULATIONS, 2015.\n"
            "We wish to inform you that Reliance Retail Ventures Limited has executed definitive agreements "
            "to acquire a 51% equity stake in Ed-a-Mamma for an aggregate cash consideration of ₹350 Crore.\n"
            "The proposed acquisition has received customary regulatory approvals and is expected to close within 30 days."
        ),
    ),
]


def _to_response_dto(dossier) -> FactCheckDossierResponse:
    return FactCheckDossierResponse(
        dossier_id=dossier.dossier_id,
        channel=dossier.channel.value if hasattr(dossier.channel, "value") else str(dossier.channel),
        original_content=dossier.original_content,
        dehyped_summary=dossier.dehyped_summary,
        hype_score=dossier.hype_score,
        sentiment=dossier.sentiment,
        entities=[
            FinancialEntityDTO(
                name=e.name,
                ticker=e.ticker,
                entity_type=e.entity_type,
                role=e.role,
            )
            for e in dossier.entities
        ],
        metrics=[
            FinancialMetricDTO(
                metric_type=m.metric_type,
                raw_text=m.raw_text,
                normalized_value=m.normalized_value,
                unit_or_currency=m.unit_or_currency,
                timeframe=m.timeframe,
            )
            for m in dossier.metrics
        ],
        red_flags=[
            RedFlagDTO(
                flag_id=f.flag_id,
                flag_name=f.flag_name,
                severity=f.severity.value if hasattr(f.severity, "value") else str(f.severity),
                description=f.description,
                matched_snippet=f.matched_snippet,
            )
            for f in dossier.red_flags
        ],
        assertions=[
            ExtractedAssertionDTO(
                assertion_id=a.assertion_id,
                statement=a.statement,
                category=a.category,
                verifiable=a.verifiable,
                confidence_score=a.confidence_score,
                verification_target=a.verification_target,
            )
            for a in dossier.assertions
        ],
        raw_verbatim_text=getattr(dossier, "raw_verbatim_text", dossier.original_content),
        human_readable_explanation=getattr(dossier, "human_readable_explanation", {}),
        metadata=dossier.metadata,
        created_at=dossier.created_at,
    )


@router.get("/presets", response_model=List[PresetExample])
def get_presets():
    """Retrieve pre-configured real-world financial misinformation and disclosure examples."""
    return PRESET_EXAMPLES


@router.post("/analyze-text", response_model=FactCheckDossierResponse)
def analyze_text(payload: TextIngestRequest):
    """Analyze raw text, WhatsApp forward, Instagram caption, or Telegram tip."""
    try:
        channel_enum = ChannelType(payload.channel.upper())
    except ValueError:
        channel_enum = ChannelType.TEXT

    dossier = use_case.process_text(payload.text, channel_enum)
    return _to_response_dto(dossier)


@router.post("/analyze-file", response_model=FactCheckDossierResponse)
async def analyze_file(file: UploadFile = File(...)):
    """Upload screenshot, PDF filing, or audio voice note for extraction."""
    try:
        contents = await file.read()
        dossier = use_case.process_file(
            file_bytes=contents,
            filename=file.filename or "uploaded_file",
            content_type=file.content_type or "",
        )
        return _to_response_dto(dossier)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process file: {str(e)}")


@router.post("/analyze-url", response_model=FactCheckDossierResponse)
async def analyze_url(payload: UrlIngestRequest):
    """Fetch content from link and extract financial facts."""
    try:
        dossier = await use_case.process_url(payload.url)
        return _to_response_dto(dossier)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to extract from URL: {str(e)}")
