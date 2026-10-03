from fastapi import APIRouter, File, HTTPException, UploadFile
from typing import Optional
from ...ingestion.application.use_cases import IngestFinancialInformationUseCase
from ...ingestion.domain.entities import ChannelType
from ..domain.verification_service import EvidenceInvestigationService
from .schemas import (
    InvestigationDossierResponse,
    InvestigateRequest,
    AssertionInvestigationDTO,
    EvidencePassageDTO,
    NumericalReconciliationDTO,
    InvestorProtectionDTO,
)

router = APIRouter(prefix="/api/v1/investigation", tags=["Evidence Investigation & Verification"])
ingest_use_case = IngestFinancialInformationUseCase()
investigation_service = EvidenceInvestigationService()


def _to_response_dto(inv) -> InvestigationDossierResponse:
    return InvestigationDossierResponse(
        investigation_id=inv.investigation_id,
        claim_summary=inv.claim_summary,
        overall_verdict=inv.overall_verdict.value if hasattr(inv.overall_verdict, "value") else str(inv.overall_verdict),
        verdict_headline=inv.verdict_headline,
        verdict_explanation=inv.verdict_explanation,
        assertion_investigations=[
            AssertionInvestigationDTO(
                assertion_id=a.assertion_id,
                assertion_text=a.assertion_text,
                status=a.status.value if hasattr(a.status, "value") else str(a.status),
                confidence=a.confidence,
                primary_finding=a.primary_finding,
                evidence_passages=[
                    EvidencePassageDTO(
                        passage_id=p.passage_id,
                        document_title=p.document_title,
                        filing_type=p.filing_type,
                        source_name=p.source_name,
                        source_tier=p.source_tier.value if hasattr(p.source_tier, "value") else str(p.source_tier),
                        filing_date=p.filing_date,
                        page_number=p.page_number,
                        paragraph_number=p.paragraph_number,
                        exact_quote=p.exact_quote,
                        source_url=p.source_url,
                        relevance_score=p.relevance_score,
                        relationship=p.relationship,
                        simplified_takeaway=getattr(p, "simplified_takeaway", "") or "",
                    )
                    for p in a.evidence_passages
                ],
                numerical_reconciliation=NumericalReconciliationDTO(
                    metric_name=a.numerical_reconciliation.metric_name,
                    claimed_value=a.numerical_reconciliation.claimed_value,
                    official_value=a.numerical_reconciliation.official_value,
                    discrepancy_factor=a.numerical_reconciliation.discrepancy_factor,
                    is_mismatch=a.numerical_reconciliation.is_mismatch,
                ) if a.numerical_reconciliation else None,
                contradiction_detail=a.contradiction_detail,
            )
            for a in inv.assertion_investigations
        ],
        evidence_trail=[
            EvidencePassageDTO(
                passage_id=p.passage_id,
                document_title=p.document_title,
                filing_type=p.filing_type,
                source_name=p.source_name,
                source_tier=p.source_tier.value if hasattr(p.source_tier, "value") else str(p.source_tier),
                filing_date=p.filing_date,
                page_number=p.page_number,
                paragraph_number=p.paragraph_number,
                exact_quote=p.exact_quote,
                source_url=p.source_url,
                relevance_score=p.relevance_score,
                relationship=p.relationship,
                simplified_takeaway=getattr(p, "simplified_takeaway", "") or "",
            )
            for p in inv.evidence_trail
        ],
        numerical_reconciliations=[
            NumericalReconciliationDTO(
                metric_name=r.metric_name,
                claimed_value=r.claimed_value,
                official_value=r.official_value,
                discrepancy_factor=r.discrepancy_factor,
                is_mismatch=r.is_mismatch,
            )
            for r in inv.numerical_reconciliations
        ],
        protection_guidance=InvestorProtectionDTO(
            risk_level=inv.protection_guidance.risk_level,
            summary_warning=inv.protection_guidance.summary_warning,
            applicable_regulations=inv.protection_guidance.applicable_regulations,
            recommended_actions=inv.protection_guidance.recommended_actions,
            official_redressal_url=inv.protection_guidance.official_redressal_url,
            intermediary_check_url=inv.protection_guidance.intermediary_check_url,
        ) if inv.protection_guidance else None,
        raw_verbatim_text=getattr(inv, "raw_verbatim_text", ""),
        human_readable_explanation=getattr(inv, "human_readable_explanation", {}) or {},
        hype_score=getattr(inv, "hype_score", 0.0),
        channel=getattr(inv, "channel", "TEXT"),
        extracted_entities=getattr(inv, "extracted_entities", []),
        detected_red_flags=getattr(inv, "detected_red_flags", []),
        statutory_search_context=getattr(inv, "statutory_search_context", {}),
        plain_language_takeaway=getattr(inv, "plain_language_takeaway", ""),
        crawled_social_sources=getattr(inv, "crawled_social_sources", []),
        crawled_simplified_data=getattr(inv, "crawled_simplified_data", []),
        chatgpt_response=getattr(inv, "chatgpt_response", "") or "",
        citations=getattr(inv, "citations", []) or [],
        search_steps=getattr(inv, "search_steps", []) or [],
        disclaimer=inv.disclaimer,
        created_at=inv.created_at,
    )


@router.post("/verify-claim", response_model=InvestigationDossierResponse)
def verify_claim(payload: InvestigateRequest):
    """Execute end-to-end evidence investigation against official stock exchange filings."""
    try:
        channel_enum = ChannelType(payload.channel.upper())
    except ValueError:
        channel_enum = ChannelType.TEXT

    # 1. Intake -> Understand -> Decompose
    dossier = ingest_use_case.process_text(payload.text, channel_enum)

    # 2. Investigate -> Verify -> Trace Evidence -> Protect
    investigation = investigation_service.investigate(dossier)

    return _to_response_dto(investigation)


@router.post("/verify-file", response_model=InvestigationDossierResponse)
async def verify_file(file: UploadFile = File(...)):
    """Upload image, screenshot, or audio to extract, investigate, and verify against official filings."""
    try:
        contents = await file.read()
        dossier = ingest_use_case.process_file(
            file_bytes=contents,
            filename=file.filename or "uploaded_file",
            content_type=file.content_type or "",
        )
        investigation = investigation_service.investigate(dossier)
        return _to_response_dto(investigation)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to investigate file: {str(e)}")
