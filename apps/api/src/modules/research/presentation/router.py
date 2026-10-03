from fastapi import APIRouter, HTTPException
from typing import Dict, List
from .schemas import (
    ResearchRequest,
    InvestigationResponseDTO,
    AtomicAssertionDTO,
    SearchQueryDTO,
    SearchResultDTO,
    CrawlRunDTO,
    EvidenceDTO,
    NumericalComparisonDTO,
    TemporalComparisonDTO,
)
from ..application.research_orchestrator import InvestigationService
from ..domain.entities import Investigation

router = APIRouter(prefix="/api/v1/research", tags=["Web Research & Evidence Investigation Engine"])
investigation_service = InvestigationService()

# In-memory persistence store for completed investigations
INVESTIGATIONS_STORE: Dict[str, Investigation] = {}


def _to_dto(inv: Investigation) -> InvestigationResponseDTO:
    return InvestigationResponseDTO(
        investigation_id=inv.investigation_id,
        claim_text=inv.claim_text,
        overall_status=inv.overall_status.value if hasattr(inv.overall_status, "value") else str(inv.overall_status),
        verdict_headline=inv.verdict_headline,
        human_readable_explanation=inv.human_readable_explanation,
        assertions=[
            AtomicAssertionDTO(
                assertion_id=a.assertion_id,
                assertion_text=a.assertion_text,
                entity=a.entity,
                event=a.event,
                location=a.location,
                amount_raw=a.amount_raw,
                amount_normalized=a.amount_normalized,
                status=a.status.value if hasattr(a.status, "value") else str(a.status),
                finding_summary=a.finding_summary,
            )
            for a in inv.assertions
        ],
        queries=[
            SearchQueryDTO(
                query_id=q.query_id,
                assertion_id=q.assertion_id,
                query_text=q.query_text,
                target_domains=q.target_domains,
            )
            for q in inv.queries
        ],
        search_results=[
            SearchResultDTO(
                result_id=r.result_id,
                query_id=r.query_id,
                url=r.url,
                title=r.title,
                snippet=r.snippet,
                rank=r.rank,
                domain=r.domain,
                provider=r.provider,
            )
            for r in inv.search_results
        ],
        crawl_runs=[
            CrawlRunDTO(
                crawl_id=c.crawl_id,
                url=c.url,
                status=c.status,
                content_type=c.content_type,
                http_status=c.http_status,
            )
            for c in inv.crawl_runs
        ],
        evidence_trail=[
            EvidenceDTO(
                evidence_id=e.evidence_id,
                assertion_id=e.assertion_id,
                relationship=e.relationship.value if hasattr(e.relationship, "value") else str(e.relationship),
                exact_text=e.exact_text,
                page=e.page,
                section=e.section,
                source_url=e.source_url,
                publisher=e.publisher,
                confidence=e.confidence,
                simplified_takeaway=getattr(e, "simplified_takeaway", None),
            )
            for e in inv.evidence_trail
        ],
        numerical_comparisons=[
            NumericalComparisonDTO(
                metric_name=n.metric_name,
                claimed_raw=n.claimed_raw,
                evidence_raw=n.evidence_raw,
                difference_amount=n.difference_amount,
                ratio_factor=n.ratio_factor,
                is_mismatch=n.is_mismatch,
                explanation=n.explanation,
            )
            for n in inv.numerical_comparisons
        ],
        temporal_comparisons=[
            TemporalComparisonDTO(
                event_name=t.event_name,
                claimed_stage=t.claimed_stage,
                evidence_stage=t.evidence_stage,
                is_mismatch=t.is_mismatch,
                explanation=t.explanation,
            )
            for t in inv.temporal_comparisons
        ],
        uncertainty_notice=inv.uncertainty_notice,
        crawled_data_simplified=getattr(inv, "crawled_data_simplified", []),
        created_at=inv.created_at,
    )


@router.post("/investigate", response_model=InvestigationResponseDTO)
async def investigate_claim(payload: ResearchRequest):
    """Orchestrates dynamic web search, crawler ingestion, document extraction,
    and deterministic claim ↔ evidence verification."""
    try:
        investigation = await investigation_service.run_investigation(
            claim_text=payload.claim,
            entity_hint=payload.entity_hint,
        )
        INVESTIGATIONS_STORE[investigation.investigation_id] = investigation
        return _to_dto(investigation)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Research investigation failed: {str(e)}")


@router.get("/investigations/{investigation_id}", response_model=InvestigationResponseDTO)
def get_investigation(investigation_id: str):
    """Retrieve existing investigation report by ID."""
    if investigation_id not in INVESTIGATIONS_STORE:
        raise HTTPException(status_code=404, detail="Investigation ID not found")
    return _to_dto(INVESTIGATIONS_STORE[investigation_id])


@router.get("/sources")
def list_authoritative_sources():
    """Returns the registry of authoritative exchange, regulatory, and media source domains."""
    return [
        {"domain": s.domain, "type": s.source_type.value, "priority": s.priority, "description": s.description}
        for s in investigation_service.source_registry._sources.values()
    ]


@router.get("/presets")
def get_research_presets():
    """Provides canonical test cases for one-click verification."""
    return [
        {
            "id": "PRESET_ABC_NOIDA",
            "title": "ABC Ltd Noida Land Acquisition",
            "claim": "ABC Ltd secretly acquired ₹45 crore land in Noida.",
            "description": "Tests claim decomposition, location matching, 10x/numerical variance check, and secret claim verification.",
        },
        {
            "id": "PRESET_TATA_SOLAR",
            "title": "Tata Power Mega Solar Contract",
            "claim": "Tata Power signed secret ₹12,500 Crore mega solar contract with Government of India!",
            "description": "Tests 10x overstatement detection against official BSE Regulation 30 filings.",
        },
        {
            "id": "PRESET_UNSUBSTANTIATED",
            "title": "Unlisted Penny Stock Rocket Tip",
            "claim": "Apex Mining has secret lithium vein worth $50 Billion. Guaranteed 100x return in 2 weeks!",
            "description": "Tests absence of evidence handling under SUTRA Principle 5 without crashing.",
        },
    ]
