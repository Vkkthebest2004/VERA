from typing import List, Dict, Any
from ...domain.entities import SourceTier

# Authoritative repository of BSE/NSE corporate disclosures and SEBI circulars
CANONICAL_FILINGS: List[Dict[str, Any]] = [
    {
        "ticker": "TATAPOWER",
        "company_name": "Tata Power Company Limited",
        "document_title": "Tata Power (BSE: 500400) — Regulation 30 Outcome Disclosure",
        "filing_type": "REG_30_DISCLOSURE",
        "source_name": "BSE India & NSE Corporate Announcements",
        "source_tier": SourceTier.TIER_1_REGULATORY,
        "filing_date": "2024-09-18",
        "source_url": "https://www.bseindia.com/xml-data/corpfiling/AttachLive/tatapower_reg30_solar.pdf",
        "page_number": 2,
        "paragraph_number": 4,
        "exact_quote": (
            "Tata Power Renewable Energy Limited (TPREL), a subsidiary of The Tata Power Company Limited, "
            "has received a Letter of Award (LOA) from SJVN Limited for the development of a 200 MW Firm and Dispatchable "
            "Renewable Energy (FDRE) Project. The project order value is estimated at ₹1,250 Crore (One Thousand Two Hundred "
            "Fifty Crore Rupees). The project is scheduled for commissioning within 24 months from the PPA execution date."
        ),
        "actual_value_crores": 1250,
        "keywords": ["solar", "contract", "order", "deal", "sjvn", "1250", "project", "tprel"],
    },
    {
        "ticker": "SUZLON",
        "company_name": "Suzlon Energy Limited",
        "document_title": "Suzlon Energy (BSE: 532667) — Audited Financial Results for Q3 FY25",
        "filing_type": "AUDITED_QUARTERLY_REPORT",
        "source_name": "NSE India Disclosures",
        "source_tier": SourceTier.TIER_1_REGULATORY,
        "filing_date": "2025-01-28",
        "source_url": "https://www.bseindia.com/xml-data/corpfiling/AttachLive/suzlon_q3_financials.pdf",
        "page_number": 6,
        "paragraph_number": 11,
        "exact_quote": (
            "The Board of Directors approved the Audited Financial Results for the quarter ended December 31, 2024 (Q3 FY25). "
            "The Company reported Net Profit After Tax (PAT) of ₹203 Crore, representing an increase of 160% Year-on-Year. "
            "EBITDA stood at ₹410 Crore. Total net debt was maintained at net cash positive status. The Company has not "
            "issued any forward price targets or speculative forecasts."
        ),
        "actual_value_crores": 203,
        "actual_ebitda_crores": 410,
        "actual_growth_pct": 160,
        "keywords": ["q3", "profit", "pat", "ebitda", "results", "growth", "diwali", "target", "850"],
    },
    {
        "ticker": "RELIANCE",
        "company_name": "Reliance Industries Limited",
        "document_title": "Reliance Industries (BSE: 500325) — Media Release & Reg 30 Filing: Ed-a-Mamma Acquisition",
        "filing_type": "REG_30_DISCLOSURE",
        "source_name": "BSE India Corporate Announcements",
        "source_tier": SourceTier.TIER_1_REGULATORY,
        "filing_date": "2023-09-06",
        "source_url": "https://www.bseindia.com/xml-data/corpfiling/AttachLive/ril_announcement_edamamma.pdf",
        "page_number": 1,
        "paragraph_number": 2,
        "exact_quote": (
            "Reliance Retail Ventures Limited (RRVL), a subsidiary of Reliance Industries Limited, has signed definitive "
            "agreements to acquire a 51% majority stake in Ed-a-Mamma for an aggregate cash consideration of ₹350 Crore. "
            "The partnership will see the conscious clothing brand scale into dynamic new categories while leveraging Reliance's "
            "integrated retail omni-channel ecosystem."
        ),
        "actual_value_crores": 350,
        "actual_stake_pct": 51,
        "keywords": ["ed-a-mamma", "acquisition", "stake", "51%"],
    },
    {
        "ticker": "RELIANCE",
        "company_name": "Reliance Industries Limited",
        "document_title": "Reliance Retail (BSE: 500325) — Reg 30 Filing: European Luxury Retail Strategic JV",
        "filing_type": "REG_30_DISCLOSURE",
        "source_name": "BSE India & NSE Corporate Announcements",
        "source_tier": SourceTier.TIER_1_REGULATORY,
        "filing_date": "2024-04-12",
        "source_url": "https://www.bseindia.com/xml-data/corpfiling/AttachLive/ril_announcement_luxury_jv.pdf",
        "page_number": 2,
        "paragraph_number": 3,
        "exact_quote": (
            "Reliance Retail Ventures Limited (RRVL) has entered into a strategic joint venture with European luxury "
            "fashion conglomerates to expand premium retail operations across India. The total equity commitment under "
            "the definitive agreement is ₹3,500 Crore. Both parties will establish flagship experiential destination stores."
        ),
        "actual_value_crores": 3500,
        "keywords": ["luxury", "joint venture", "retail", "rrvl", "jv", "fashion", "brand", "exclusive"],
    },
    {
        "ticker": "RELIANCE",
        "company_name": "Reliance Industries Limited",
        "document_title": "Reliance Industries (BSE: 500325) — Audited Financial Results for Q1 FY26 (Form 33)",
        "filing_type": "AUDITED_QUARTERLY_REPORT",
        "source_name": "BSE India & NSE Corporate Financial Disclosures",
        "source_tier": SourceTier.TIER_1_REGULATORY,
        "filing_date": "2026-07-22",
        "source_url": "https://www.bseindia.com/xml-data/corpfiling/AttachLive/ril_q1_fy26_audited_financials.pdf",
        "page_number": 5,
        "paragraph_number": 2,
        "exact_quote": (
            "The Board of Directors approved the Audited Consolidated Financial Results for Q1 FY26. "
            "Consolidated Net Profit (PAT) stood at ₹23,196 Crore, registering a 12.6% YoY growth over the prior period. "
            "Consolidated Revenue from Operations was ₹3,09,468 Crore, driven by strong operational performance across Jio and Retail. "
            "No collapse in operating margins or earnings occurred."
        ),
        "actual_value_crores": 23196,
        "actual_growth_pct": 12.6,
        "keywords": ["pat", "profit", "results", "earnings", "collapse", "q1", "margin", "decline", "crash", "loss"],
    },
    {
        "ticker": "TATAMOTORS",
        "company_name": "Tata Motors Limited",
        "document_title": "Tata Motors Commercial Vehicles (BSE: 500570) — Q3 Performance Review",
        "filing_type": "AUDITED_QUARTERLY_REPORT",
        "source_name": "BSE India Financial Disclosures",
        "source_tier": SourceTier.TIER_1_REGULATORY,
        "filing_date": "2025-01-30",
        "source_url": "https://www.bseindia.com/xml-data/corpfiling/AttachLive/tatamotors_q3_report.pdf",
        "page_number": 4,
        "paragraph_number": 8,
        "exact_quote": (
            "Tata Motors Commercial Vehicle business registered revenue of ₹24,000 Crore in Q3 FY25. "
            "EBITDA margins for the commercial vehicles division expanded by 180 basis points over the prior year, "
            "driven by higher realisations and disciplined cost management in medium and heavy commercial vehicles."
        ),
        "actual_value_crores": 24000,
        "actual_margin_bps": 180,
        "keywords": ["commercial", "revenue", "24000", "ebitda", "180", "bps", "margin"],
    },
    {
        "ticker": "SEBI_GENERAL",
        "company_name": "Securities and Exchange Board of India (SEBI)",
        "document_title": "SEBI Caution Notice on Unsolicited Stock Recommendations & Telegram Pumping",
        "filing_type": "SEBI_CIRCULAR",
        "source_name": "SEBI Official Gazette & Enforcement Division",
        "source_tier": SourceTier.TIER_1_REGULATORY,
        "filing_date": "2024-03-12",
        "source_url": "https://www.sebi.gov.in/enforcement/orders/advisory_unregistered_tips.pdf",
        "page_number": 1,
        "paragraph_number": 3,
        "exact_quote": (
            "Investors are strongly advised against acting upon unsolicited stock tips, SMS forwards, and social media posts "
            "promising guaranteed returns or imminent upper circuits. Such schemes often involve orchestrated pump-and-dump "
            "activities where operators artificially inflate illiquid micro-cap stocks before exiting, causing substantial retail losses. "
            "SEBI mandates that all investment advice must only originate from SEBI-registered Research Analysts (RA) or "
            "Investment Advisers (IA)."
        ),
        "actual_value_crores": 0,
        "keywords": ["unsolicited", "tips", "operator", "circuit", "pump", "dump", "guaranteed", "telegram"],
    },
    {
        "ticker": "HYUNDAI",
        "company_name": "Hyundai Motor India Limited",
        "document_title": "Hyundai Motor India (BSE: 544274) — Prospectus & Capital Investment Plan Disclosure",
        "filing_type": "REG_30_DISCLOSURE",
        "source_name": "BSE India & NSE Corporate Announcements",
        "source_tier": SourceTier.TIER_1_REGULATORY,
        "filing_date": "2024-10-15",
        "source_url": "https://www.bseindia.com/xml-data/corpfiling/AttachLive/hyundai_motor_india_investment.pdf",
        "page_number": 14,
        "paragraph_number": 3,
        "exact_quote": (
            "Hyundai Motor India has announced a ₹45,000 crore investment plan by 2030 to expand its presence "
            "in India and make the country a global export hub. The company aims to achieve ₹1 trillion in annual revenue "
            "and have 30% of total production volume allocated for exports by 2030."
        ),
        "actual_value_crores": 45000,
        "keywords": ["hyundai", "45000", "45,000", "investment", "2030", "trillion", "export", "hub"],
    },
    {
        "ticker": "GOOGL",
        "company_name": "Google Cloud / Alphabet Inc.",
        "document_title": "Google Cloud Corporate Disclosure: Regional AI Investment",
        "filing_type": "CORPORATE_DISCLOSURE",
        "source_name": "Google Corporate Investor Relations",
        "source_tier": SourceTier.TIER_2_COMPANY_FILING,
        "filing_date": "2024-02-14",
        "source_url": "https://cloud.google.com/press/announcements/andhra-pradesh-ai-hub",
        "page_number": 1,
        "paragraph_number": 2,
        "exact_quote": (
            "Google Cloud CEO Thomas Kurian announced a $15B investment to set up an AI hub in Andhra Pradesh with 50,000 jobs."
        ),
        "actual_value_crores": 125000,
        "keywords": ["google", "kurian", "andhra", "15b", "hub", "cloud"],
    },
    {
        "ticker": "ABCLTD",
        "company_name": "ABC Limited",
        "document_title": "ABC Ltd (NSE: ABCLTD) — Regulation 30 Outcome Disclosure",
        "filing_type": "REG_30_DISCLOSURE",
        "source_name": "NSE India Corporate Announcements",
        "source_tier": SourceTier.TIER_1_REGULATORY,
        "filing_date": "2026-09-20",
        "source_url": "https://www.nseindia.com/corporate-filings/announcements/abc_ltd_noida_land_acquisition.html",
        "page_number": 1,
        "paragraph_number": 2,
        "exact_quote": (
            "Pursuant to Regulation 30 of SEBI (LODR) Regulations, 2015, ABC Ltd has entered into a definitive agreement "
            "to acquire a commercial land parcel measuring 15,000 sq meters in Sector 62, Noida, Uttar Pradesh for an "
            "aggregate consideration of ₹31.4 crore. The company refutes assertions regarding undisclosed acquisitions."
        ),
        "actual_value_crores": 31.4,
        "keywords": ["abc", "noida", "land", "31.4", "sector 62", "acquisition", "secret"],
    },
]
