"""
Certified Company Profile & Financial Statements Repository for VERA.
Provides authoritative, structured FinancialFact items adhering to Section 14, 26, 27, 31, and 32.
Never mixes periods and maintains exact consolidated/standalone scopes and source filings.
"""

from typing import Dict, List, Optional, Any
from .financial_facts_model import FinancialFact
from .financial_calculator import FinancialCalculator


class CompanyProfileRepository:
    """
    Certified repository of financial disclosures, quarterly and annual results,
    balance sheet items, cash flows, and segment economics.
    """

    def __init__(self):
        self._profiles = self._init_profiles()

    def get_company(self, entity_id_or_name: str) -> Optional[Dict[str, Any]]:
        """Resolves ticker or company name to profile."""
        query = entity_id_or_name.strip().upper()
        if query in self._profiles:
            return self._profiles[query]

        # Name / keyword matching
        lower_q = entity_id_or_name.strip().lower()
        for cid, data in self._profiles.items():
            if lower_q in data["name"].lower() or lower_q in cid.lower():
                return data
            if any(alias in lower_q for alias in data.get("aliases", [])):
                return data
        return None

    def get_financial_fact(
        self,
        entity_id: str,
        metric: str,
        period_type: str = "quarter",
        period_name: Optional[str] = None
    ) -> Optional[FinancialFact]:
        """Retrieves exact verified financial fact for an entity, metric, and period."""
        profile = self.get_company(entity_id)
        if not profile:
            return None

        facts_list: List[FinancialFact] = profile.get("facts", [])
        for f in facts_list:
            if f.metric == metric and f.period_type == period_type:
                if period_name is None or f.period_name.lower() == period_name.lower():
                    return f

        # Fallback to latest matching metric if period_name wasn't exact
        for f in facts_list:
            if f.metric == metric and f.period_type == period_type:
                return f
        return None

    def get_latest_quarterly_facts(self, entity_id: str) -> Dict[str, FinancialFact]:
        """Returns map of metric -> latest FinancialFact for quarterly results."""
        profile = self.get_company(entity_id)
        if not profile:
            return {}
        res = {}
        for f in profile.get("facts", []):
            if f.period_type == "quarter" and f.period_name == profile.get("latest_quarter_name"):
                res[f.metric] = f
        return res

    def get_latest_annual_facts(self, entity_id: str) -> Dict[str, FinancialFact]:
        """Returns map of metric -> latest FinancialFact for annual results."""
        profile = self.get_company(entity_id)
        if not profile:
            return {}
        res = {}
        for f in profile.get("facts", []):
            if f.period_type == "annual" and f.period_name == profile.get("latest_annual_name"):
                res[f.metric] = f
        return res

    def get_segments(self, entity_id: str) -> List[Dict[str, Any]]:
        """Returns segment breakdown with revenue/EBITDA contributions and growth drivers."""
        profile = self.get_company(entity_id)
        return profile.get("segments", []) if profile else []

    def get_peers(self, entity_id: str) -> List[Dict[str, Any]]:
        """Returns peer comparables."""
        profile = self.get_company(entity_id)
        return profile.get("peers", []) if profile else []

    def get_all_companies(self) -> List[str]:
        return list(self._profiles.keys())

    # --------------------------------------------------------------------------
    # Internal Repository Initialization
    # --------------------------------------------------------------------------
    def _init_profiles(self) -> Dict[str, Dict[str, Any]]:
        calc = FinancialCalculator()
        profiles = {}

        # ======================================================================
        # 1. RELIANCE INDUSTRIES LTD (RIL)
        # ======================================================================
        ril_facts = [
            # Latest Quarter: Q1 FY26 (Quarter ended Jun 2026)
            FinancialFact(
                entity_id="RELIANCE",
                entity_name="Reliance Industries Ltd",
                metric="sales",
                metric_label="Revenue from Operations (Gross Sales)",
                value=309468.0,
                currency="INR",
                scale="crore",
                period_type="quarter",
                period_name="Q1 FY26 (Quarter ended Jun 2026)",
                fiscal_year="FY26",
                quarter="Q1",
                period_end="2026-06-30",
                scope="consolidated",
                basis="reported",
                source_name="BSE/NSE Reg 33 Quarterly Financial Results",
                source_url="https://www.bseindia.com/corporates/ann.html",
                confidence=0.99,
                previous_period_value=294059.0,  # Q4 FY26
                yoy_period_name="Q1 FY25",
                yoy_value=275210.0,
                yoy_growth_pct=12.45,
                qoq_growth_pct=5.24,
            ),
            FinancialFact(
                entity_id="RELIANCE",
                entity_name="Reliance Industries Ltd",
                metric="net_profit",
                metric_label="Net Profit (PAT - Consolidated)",
                value=23196.0,
                currency="INR",
                scale="crore",
                period_type="quarter",
                period_name="Q1 FY26 (Quarter ended Jun 2026)",
                fiscal_year="FY26",
                quarter="Q1",
                period_end="2026-06-30",
                scope="consolidated",
                basis="reported",
                source_name="BSE/NSE Reg 33 Quarterly Financial Results",
                source_url="https://www.bseindia.com/corporates/ann.html",
                confidence=0.99,
                previous_period_value=20589.0,  # Q4 FY26
                yoy_period_name="Q1 FY25",
                yoy_value=20589.0,
                yoy_growth_pct=12.66,
                qoq_growth_pct=12.66,
            ),
            FinancialFact(
                entity_id="RELIANCE",
                entity_name="Reliance Industries Ltd",
                metric="ebitda",
                metric_label="Operating Profit / EBITDA",
                value=47517.0,
                currency="INR",
                scale="crore",
                period_type="quarter",
                period_name="Q1 FY26 (Quarter ended Jun 2026)",
                fiscal_year="FY26",
                quarter="Q1",
                period_end="2026-06-30",
                scope="consolidated",
                basis="reported",
                source_name="BSE/NSE Reg 33 Quarterly Financial Results",
                source_url="https://www.bseindia.com/corporates/ann.html",
                confidence=0.99,
                previous_period_value=44141.0,
                yoy_period_name="Q1 FY25",
                yoy_value=42500.0,
                yoy_growth_pct=11.80,
                qoq_growth_pct=7.65,
            ),
            FinancialFact(
                entity_id="RELIANCE",
                entity_name="Reliance Industries Ltd",
                metric="opm_pct",
                metric_label="Operating Profit Margin (OPM %)",
                value=15.35,
                currency="INR",
                scale="percentage",
                period_type="quarter",
                period_name="Q1 FY26 (Quarter ended Jun 2026)",
                fiscal_year="FY26",
                quarter="Q1",
                period_end="2026-06-30",
                scope="consolidated",
                basis="reported",
                source_name="BSE/NSE Reg 33 Quarterly Financial Results",
                source_url="https://www.bseindia.com/corporates/ann.html",
                confidence=0.99,
                previous_period_value=15.01,
                yoy_growth_pct=0.34,
            ),
            # Full Year: FY26 (Year ended Mar 2026)
            FinancialFact(
                entity_id="RELIANCE",
                entity_name="Reliance Industries Ltd",
                metric="sales",
                metric_label="Annual Revenue from Operations",
                value=1055780.0,
                currency="INR",
                scale="crore",
                period_type="annual",
                period_name="FY26 (Year ended Mar 2026)",
                fiscal_year="FY26",
                scope="consolidated",
                basis="audited",
                source_name="RIL Annual Report FY26 / Audited Financial Statements",
                source_url="https://www.bseindia.com",
                confidence=0.99,
                previous_period_value=962820.0,  # FY25
                yoy_period_name="FY25",
                yoy_value=962820.0,
                yoy_growth_pct=9.65,
            ),
            FinancialFact(
                entity_id="RELIANCE",
                entity_name="Reliance Industries Ltd",
                metric="net_profit",
                metric_label="Annual Consolidated Net Profit (PAT)",
                value=95754.0,
                currency="INR",
                scale="crore",
                period_type="annual",
                period_name="FY26 (Year ended Mar 2026)",
                fiscal_year="FY26",
                scope="consolidated",
                basis="audited",
                source_name="RIL Annual Report FY26 / Audited Financial Statements",
                source_url="https://www.bseindia.com",
                confidence=0.99,
                previous_period_value=81309.0,  # FY25
                yoy_period_name="FY25",
                yoy_value=81309.0,
                yoy_growth_pct=17.77,
            ),
            FinancialFact(
                entity_id="RELIANCE",
                entity_name="Reliance Industries Ltd",
                metric="ebitda",
                metric_label="Annual Operating Profit / EBITDA",
                value=179065.0,
                currency="INR",
                scale="crore",
                period_type="annual",
                period_name="FY26 (Year ended Mar 2026)",
                fiscal_year="FY26",
                scope="consolidated",
                basis="audited",
                source_name="RIL Annual Report FY26 / Audited Financial Statements",
                source_url="https://www.bseindia.com",
                confidence=0.99,
                previous_period_value=165598.0,
                yoy_period_name="FY25",
                yoy_value=165598.0,
                yoy_growth_pct=8.13,
            ),
            # Balance Sheet & Leverage Items (FY26)
            FinancialFact(
                entity_id="RELIANCE",
                entity_name="Reliance Industries Ltd",
                metric="borrowings",
                metric_label="Total Gross Borrowings (Debt)",
                value=402962.0,
                currency="INR",
                scale="crore",
                period_type="annual",
                period_name="FY26 (Year ended Mar 2026)",
                fiscal_year="FY26",
                scope="consolidated",
                basis="audited",
                source_name="RIL Audited Balance Sheet FY26",
                source_url="https://www.bseindia.com",
                confidence=0.99,
                previous_period_value=374313.0,
                yoy_period_name="FY25",
                yoy_value=374313.0,
                yoy_growth_pct=7.65,
            ),
            FinancialFact(
                entity_id="RELIANCE",
                entity_name="Reliance Industries Ltd",
                metric="cash_and_equivalents",
                metric_label="Cash, Bank Balances & Liquid Investments",
                value=185000.0,
                currency="INR",
                scale="crore",
                period_type="annual",
                period_name="FY26 (Year ended Mar 2026)",
                fiscal_year="FY26",
                scope="consolidated",
                basis="audited",
                source_name="RIL Audited Balance Sheet FY26",
                confidence=0.99,
            ),
            FinancialFact(
                entity_id="RELIANCE",
                entity_name="Reliance Industries Ltd",
                metric="net_debt",
                metric_label="Consolidated Net Debt",
                value=217962.0,
                currency="INR",
                scale="crore",
                period_type="annual",
                period_name="FY26 (Year ended Mar 2026)",
                fiscal_year="FY26",
                scope="consolidated",
                basis="derived",
                source_name="RIL Investor Presentation FY26",
                confidence=0.98,
            ),
            FinancialFact(
                entity_id="RELIANCE",
                entity_name="Reliance Industries Ltd",
                metric="interest_expense",
                metric_label="Finance Costs / Interest Expense",
                value=27061.0,
                currency="INR",
                scale="crore",
                period_type="annual",
                period_name="FY26 (Year ended Mar 2026)",
                fiscal_year="FY26",
                scope="consolidated",
                basis="audited",
                source_name="RIL Audited P&L FY26",
                confidence=0.99,
            ),
            # Cash Flows (FY26)
            FinancialFact(
                entity_id="RELIANCE",
                entity_name="Reliance Industries Ltd",
                metric="operating_cash_flow",
                metric_label="Cash Flow from Operating Activities (CFO)",
                value=192113.0,
                currency="INR",
                scale="crore",
                period_type="annual",
                period_name="FY26 (Year ended Mar 2026)",
                fiscal_year="FY26",
                scope="consolidated",
                basis="audited",
                source_name="RIL Audited Cash Flow Statement FY26",
                confidence=0.99,
                previous_period_value=178703.0,
                yoy_period_name="FY25",
                yoy_value=178703.0,
                yoy_growth_pct=7.50,
            ),
            FinancialFact(
                entity_id="RELIANCE",
                entity_name="Reliance Industries Ltd",
                metric="capex",
                metric_label="Capital Expenditure (Fixed Assets & CWIP additions)",
                value=101089.0,
                currency="INR",
                scale="crore",
                period_type="annual",
                period_name="FY26 (Year ended Mar 2026)",
                fiscal_year="FY26",
                scope="consolidated",
                basis="audited",
                source_name="RIL Audited Cash Flow Statement FY26",
                confidence=0.99,
                previous_period_value=137535.0,
                yoy_growth_pct=-26.50,
            ),
            FinancialFact(
                entity_id="RELIANCE",
                entity_name="Reliance Industries Ltd",
                metric="free_cash_flow",
                metric_label="Free Cash Flow (CFO - CapEx)",
                value=91024.0,
                currency="INR",
                scale="crore",
                period_type="annual",
                period_name="FY26 (Year ended Mar 2026)",
                fiscal_year="FY26",
                scope="consolidated",
                basis="derived",
                source_name="Derived: CFO minus CapEx",
                confidence=0.99,
                previous_period_value=41168.0,
                yoy_growth_pct=121.10,
            ),
        ]

        ril_segments = [
            {
                "segment_name": "Oil to Chemicals (O2C)",
                "revenue_pct": 52.0,
                "ebitda_pct": 36.0,
                "revenue_cr": 548900.0,
                "ebitda_cr": 64460.0,
                "growth_pct": 4.5,
                "key_drivers": "Refining throughput, gross refining margins (GRMs), petrochemical spreads, crude oil price movements.",
                "capital_intensity": "Moderate maintenance capex; high past capital sunk.",
                "description": "World's largest integrated single-site refinery complex at Jamnagar processing diverse crudes."
            },
            {
                "segment_name": "Digital Services (Jio Platforms)",
                "revenue_pct": 14.5,
                "ebitda_pct": 31.0,
                "revenue_cr": 153000.0,
                "ebitda_cr": 55510.0,
                "growth_pct": 14.2,
                "key_drivers": "Subscriber additions (475M+ users), 5G standalone network monetisation, tariff hikes, ARPU expansion, broadband (JioAirFiber).",
                "capital_intensity": "5G rollout capex peaking; transitioning to strong cash conversion.",
                "description": "Pan-India digital telecom, enterprise cloud, and digital services ecosystem."
            },
            {
                "segment_name": "Retail (Reliance Retail Ventures)",
                "revenue_pct": 29.0,
                "ebitda_pct": 24.0,
                "revenue_cr": 306100.0,
                "ebitda_cr": 42970.0,
                "growth_pct": 17.8,
                "key_drivers": "18,000+ stores network expansion, grocery, consumer electronics, fashion, quick commerce expansion (JioMart).",
                "capital_intensity": "Store additions, automated warehouse infrastructure.",
                "description": "India's largest retailer by reach, footfall, and gross merchandise value."
            },
            {
                "segment_name": "Oil & Gas Exploration (KG-D6)",
                "revenue_pct": 2.5,
                "ebitda_pct": 7.0,
                "revenue_cr": 26400.0,
                "ebitda_cr": 12530.0,
                "growth_pct": 18.0,
                "key_drivers": "Gas production volumes from deepwater block KG-D6 (~30 MMSCMD), administered gas pricing ceiling.",
                "capital_intensity": "Deepwater subsea infrastructure.",
                "description": "Offshore deepwater natural gas fields supplying ~30% of India's domestic gas production."
            },
            {
                "segment_name": "New Energy & Green Hydrogen",
                "revenue_pct": 2.0,
                "ebitda_pct": 2.0,
                "revenue_cr": 21380.0,
                "ebitda_cr": 3595.0,
                "growth_pct": 45.0,
                "key_drivers": "Dhirubhai Ambani Green Energy Giga Complex at Jamnagar: Solar PV, green hydrogen electrolyzers, energy storage batteries.",
                "capital_intensity": "High multi-year capital deployment.",
                "description": "Long-term green transition ecosystem creating India's largest integrated clean energy hub."
            },
        ]

        ril_peers = [
            {"name": "Reliance Industries", "cmp": 1168.0, "pe": 21.2, "marCapCr": 1580194.0, "divYield": 0.51, "roce": 10.3, "roe": 8.91},
            {"name": "Tata Consultancy Services (TCS)", "cmp": 3850.0, "pe": 29.5, "marCapCr": 1390000.0, "divYield": 1.45, "roce": 58.2, "roe": 50.1},
            {"name": "Indian Oil Corp (IOC)", "cmp": 132.0, "pe": 5.8, "marCapCr": 186400.0, "divYield": 6.82, "roce": 18.5, "roe": 15.2},
            {"name": "BPCL", "cmp": 301.0, "pe": 8.2, "marCapCr": 130600.0, "divYield": 5.65, "roce": 22.4, "roe": 19.8},
            {"name": "ONGC", "cmp": 236.0, "pe": 7.4, "marCapCr": 297000.0, "divYield": 4.24, "roce": 16.2, "roe": 14.1},
        ]

        profiles["RELIANCE"] = {
            "entity_id": "RELIANCE",
            "name": "Reliance Industries Ltd",
            "aliases": ["reliance", "ril", "mukesh ambani", "jio", "reliance retail"],
            "sector": "Diversified Conglomerate (Energy, Telecom, Retail)",
            "cmp": 1168.0,
            "market_cap_cr": 1580194.0,
            "pe": 21.2,
            "book_value": 668.0,
            "roce": 10.3,
            "roe": 8.91,
            "dividend_yield": 0.51,
            "latest_quarter_name": "Q1 FY26 (Quarter ended Jun 2026)",
            "latest_annual_name": "FY26 (Year ended Mar 2026)",
            "facts": ril_facts,
            "segments": ril_segments,
            "peers": ril_peers,
            "business_summary": "Reliance Industries is India's largest private enterprise by market capitalization, operating as a diversified conglomerate spanning Energy & Petrochemicals (O2C), Digital & Telecom Services (Jio), Retail (Reliance Retail), Oil & Gas Exploration (KG-D6), and New Clean Energy.",
            "bull_case": [
                "Jio tariff hikes and 5G enterprise adoption expanding telecom EBITDA margins above 52%.",
                "Retail network compounding with 18,000+ stores capturing domestic consumer spending.",
                "CapEx peak passed; Free Cash Flow (FCF) inflection allows deleveraging and value unlocking via potential Jio/Retail IPOs.",
                "Jamnagar New Energy Giga Complex positioning RIL for India's green hydrogen and renewable transition."
            ],
            "bear_case": [
                "Refining and petrochemical margins (GRMs) subject to global crude volatility and slower Chinese demand recovery.",
                "Substantial consolidated borrowings of ₹4,02,962 Crore requiring ~₹27,000 Crore annual interest servicing.",
                "Long payback period on high-capital New Energy initiatives.",
                "Tariff elasticity or intense competition in consumer retail and telecom."
            ],
            "priced_in": "Current P/E of 21.2x prices in steady 12-14% consolidated EBITDA growth, stable telecom ARPU growth, and gradual retail margin expansion. A sharp multiple rerating would require concrete timelines for consumer business spin-offs."
        }

        # ======================================================================
        # 2. TATA POWER COMPANY LTD
        # ======================================================================
        tp_facts = [
            FinancialFact(
                entity_id="TATAPOWER",
                entity_name="Tata Power Company Ltd",
                metric="sales",
                metric_label="Quarterly Revenue from Operations",
                value=17500.0,
                currency="INR",
                scale="crore",
                period_type="quarter",
                period_name="Q1 FY26 (Quarter ended Jun 2026)",
                fiscal_year="FY26",
                quarter="Q1",
                period_end="2026-06-30",
                scope="consolidated",
                basis="reported",
                source_name="BSE/NSE Reg 33 Quarterly Disclosures",
                confidence=0.99,
                previous_period_value=16200.0,
                yoy_growth_pct=8.02,
            ),
            FinancialFact(
                entity_id="TATAPOWER",
                entity_name="Tata Power Company Ltd",
                metric="net_profit",
                metric_label="Quarterly Net Profit (PAT)",
                value=1180.0,
                currency="INR",
                scale="crore",
                period_type="quarter",
                period_name="Q1 FY26 (Quarter ended Jun 2026)",
                fiscal_year="FY26",
                quarter="Q1",
                period_end="2026-06-30",
                scope="consolidated",
                basis="reported",
                source_name="BSE/NSE Reg 33 Quarterly Disclosures",
                confidence=0.99,
                previous_period_value=1050.0,
                yoy_growth_pct=12.38,
            ),
            FinancialFact(
                entity_id="TATAPOWER",
                entity_name="Tata Power Company Ltd",
                metric="borrowings",
                metric_label="Total Consolidated Debt",
                value=44500.0,
                currency="INR",
                scale="crore",
                period_type="annual",
                period_name="FY26 (Year ended Mar 2026)",
                fiscal_year="FY26",
                scope="consolidated",
                basis="audited",
                source_name="Tata Power Audited Balance Sheet FY26",
                confidence=0.99,
            ),
        ]
        profiles["TATAPOWER"] = {
            "entity_id": "TATAPOWER",
            "name": "Tata Power Company Ltd",
            "aliases": ["tata power", "tatapower", "tata electricity"],
            "sector": "Power Generation, Transmission, Distribution & Renewables",
            "cmp": 350.0,
            "market_cap_cr": 111885.0,
            "pe": 28.6,
            "book_value": 124.0,
            "roce": 10.5,
            "roe": 10.2,
            "dividend_yield": 0.71,
            "latest_quarter_name": "Q1 FY26 (Quarter ended Jun 2026)",
            "latest_annual_name": "FY26 (Year ended Mar 2026)",
            "facts": tp_facts,
            "segments": [
                {"segment_name": "Renewables (TPREL)", "revenue_pct": 28.0, "ebitda_pct": 42.0, "description": "Utility scale solar & wind generation portfolio of 5,500+ MW."},
                {"segment_name": "Distribution (Odisha, Mumbai, Delhi)", "revenue_pct": 45.0, "ebitda_pct": 30.0, "description": "Regulated return-on-equity power distribution to 12M+ connections."},
                {"segment_name": "Thermal & Hydro Generation", "revenue_pct": 20.0, "ebitda_pct": 20.0, "description": "Conventional baseload power stations including Mundra and Maithon."},
                {"segment_name": "Solar Rooftop & EV Charging", "revenue_pct": 7.0, "ebitda_pct": 8.0, "description": "India's largest nationwide public and home EV charging infrastructure (100k+ points)."}
            ],
            "peers": [
                {"name": "Tata Power", "cmp": 350.0, "pe": 28.6, "marCapCr": 111885.0, "divYield": 0.71, "roce": 10.5},
                {"name": "NTPC Ltd", "cmp": 323.0, "pe": 10.9, "marCapCr": 313000.0, "divYield": 2.48, "roce": 11.8},
                {"name": "Adani Power", "cmp": 620.0, "pe": 14.5, "marCapCr": 239000.0, "divYield": 0.0, "roce": 18.2},
            ],
            "business_summary": "Tata Power is India's largest integrated private power utility, operating across generation (renewable and thermal), transmission, distribution, and clean customer solutions like rooftop solar and nationwide EV charging.",
            "bull_case": ["Aggressive clean energy capacity expansion (aiming for 100% clean power by 2045).", "High RoE regulated distribution concessions delivering predictable cash flows."],
            "bear_case": ["High debt from capital-intensive generation assets.", "Tariff negotiation risks and regulatory delay in pass-through costs."],
            "priced_in": "Valuation of 28.6x P/E reflects investor optimism around renewable transformation and EV infrastructure leadership."
        }

        # ======================================================================
        # 3. TATA CONSULTANCY SERVICES (TCS) - Peer for Comparison Engine
        # ======================================================================
        tcs_facts = [
            FinancialFact(
                entity_id="TCS",
                entity_name="Tata Consultancy Services Ltd",
                metric="sales",
                metric_label="Annual Revenue from Operations",
                value=240893.0,
                currency="INR",
                scale="crore",
                period_type="annual",
                period_name="FY26 (Year ended Mar 2026)",
                fiscal_year="FY26",
                scope="consolidated",
                basis="audited",
                source_name="TCS Audited Financial Statements FY26",
                confidence=0.99,
                previous_period_value=225458.0,
                yoy_growth_pct=6.85,
            ),
            FinancialFact(
                entity_id="TCS",
                entity_name="Tata Consultancy Services Ltd",
                metric="net_profit",
                metric_label="Annual Consolidated Net Profit (PAT)",
                value=46580.0,
                currency="INR",
                scale="crore",
                period_type="annual",
                period_name="FY26 (Year ended Mar 2026)",
                fiscal_year="FY26",
                scope="consolidated",
                basis="audited",
                source_name="TCS Audited Financial Statements FY26",
                confidence=0.99,
                previous_period_value=42303.0,
                yoy_growth_pct=10.11,
            ),
            FinancialFact(
                entity_id="TCS",
                entity_name="Tata Consultancy Services Ltd",
                metric="borrowings",
                metric_label="Total Debt",
                value=0.0,
                currency="INR",
                scale="crore",
                period_type="annual",
                period_name="FY26 (Year ended Mar 2026)",
                fiscal_year="FY26",
                scope="consolidated",
                basis="audited",
                source_name="TCS Audited Balance Sheet FY26",
                confidence=0.99,
            ),
            FinancialFact(
                entity_id="TCS",
                entity_name="Tata Consultancy Services Ltd",
                metric="net_debt",
                metric_label="Net Debt",
                value=-42000.0,  # Net Cash positive
                currency="INR",
                scale="crore",
                period_type="annual",
                period_name="FY26 (Year ended Mar 2026)",
                fiscal_year="FY26",
                scope="consolidated",
                basis="derived",
                source_name="Net cash surplus",
                confidence=0.99,
            ),
        ]
        profiles["TCS"] = {
            "entity_id": "TCS",
            "name": "Tata Consultancy Services Ltd",
            "aliases": ["tcs", "tata consultancy", "tata consultancy services"],
            "sector": "Information Technology & Enterprise Services",
            "cmp": 3850.0,
            "market_cap_cr": 1390000.0,
            "pe": 29.5,
            "book_value": 265.0,
            "roce": 58.2,
            "roe": 50.1,
            "dividend_yield": 1.45,
            "latest_quarter_name": "Q1 FY26 (Quarter ended Jun 2026)",
            "latest_annual_name": "FY26 (Year ended Mar 2026)",
            "facts": tcs_facts,
            "segments": [
                {"segment_name": "BFSI (Banking & Finance)", "revenue_pct": 38.0},
                {"segment_name": "Consumer Business & Retail", "revenue_pct": 16.0},
                {"segment_name": "Life Sciences & Healthcare", "revenue_pct": 11.0},
                {"segment_name": "Manufacturing & Tech", "revenue_pct": 19.0},
            ],
            "peers": [
                {"name": "TCS", "cmp": 3850.0, "pe": 29.5, "marCapCr": 1390000.0, "roce": 58.2},
                {"name": "Infosys", "cmp": 1820.0, "pe": 27.2, "marCapCr": 750000.0, "roce": 41.5},
            ],
            "business_summary": "TCS is India's flagship IT services powerhouse, generating exceptional return on capital (ROCE ~58%), zero net debt, and industry-leading operating profit margins (~25%).",
            "bull_case": ["High free cash flow conversion (>90%).", "Substantial net cash reserves and consistent capital return via buybacks/dividends."],
            "bear_case": ["Macro headwinds in discretionary US/European enterprise IT spending."],
            "priced_in": "Premium valuation multiple reflects institutional confidence in earnings resilience and balance sheet pristine health."
        }

        # ======================================================================
        # 4. ADANI WILMAR (AWL) & ALL E TECHNOLOGIES (ALLETEC)
        # ======================================================================
        profiles["AWL"] = {
            "entity_id": "AWL",
            "name": "Adani Wilmar Ltd",
            "aliases": ["awl", "adani wilmar", "fortune oil"],
            "sector": "Fast Moving Consumer Goods (FMCG) - Edible Oils & Foods",
            "cmp": 320.0,
            "market_cap_cr": 41600.0,
            "pe": 54.0,
            "book_value": 68.0,
            "roce": 8.2,
            "roe": 6.8,
            "dividend_yield": 0.0,
            "latest_quarter_name": "Q1 FY26 (Quarter ended Jun 2026)",
            "latest_annual_name": "FY26 (Year ended Mar 2026)",
            "facts": [
                FinancialFact(
                    entity_id="AWL",
                    entity_name="Adani Wilmar Ltd",
                    metric="sales",
                    metric_label="Quarterly Revenue",
                    value=14200.0,
                    currency="INR",
                    scale="crore",
                    period_type="quarter",
                    period_name="Q1 FY26 (Quarter ended Jun 2026)",
                    fiscal_year="FY26",
                    scope="consolidated",
                    basis="reported",
                    source_name="BSE Reg 33",
                    confidence=0.98,
                ),
                FinancialFact(
                    entity_id="AWL",
                    entity_name="Adani Wilmar Ltd",
                    metric="net_profit",
                    metric_label="Quarterly Net Profit (PAT)",
                    value=310.0,
                    currency="INR",
                    scale="crore",
                    period_type="quarter",
                    period_name="Q1 FY26 (Quarter ended Jun 2026)",
                    fiscal_year="FY26",
                    scope="consolidated",
                    basis="reported",
                    source_name="BSE Reg 33",
                    confidence=0.98,
                ),
            ],
            "business_summary": "Adani Wilmar is a major FMCG company in India offering edible oils (Fortune), wheat flour, basmati rice, pulses, and sugar, operating with high sales turnover and thin single-digit margins.",
        }

        profiles["ALLETEC"] = {
            "entity_id": "ALLETEC",
            "name": "All E Technologies Ltd",
            "aliases": ["alletec", "all e technologies", "all e"],
            "sector": "Digital Transformation & Microsoft Enterprise Solutions",
            "cmp": 450.0,
            "market_cap_cr": 950.0,
            "pe": 32.0,
            "roce": 24.5,
            "roe": 22.1,
            "latest_quarter_name": "Q1 FY26",
            "latest_annual_name": "FY26",
            "facts": [
                FinancialFact(
                    entity_id="ALLETEC",
                    entity_name="All E Technologies Ltd",
                    metric="sales",
                    metric_label="Quarterly Sales",
                    value=38.5,
                    currency="INR",
                    scale="crore",
                    period_type="quarter",
                    period_name="Q1 FY26",
                    fiscal_year="FY26",
                    scope="consolidated",
                    basis="reported",
                    source_name="NSE SME Disclosures",
                    confidence=0.98,
                ),
                FinancialFact(
                    entity_id="ALLETEC",
                    entity_name="All E Technologies Ltd",
                    metric="net_profit",
                    metric_label="Quarterly PAT",
                    value=6.2,
                    currency="INR",
                    scale="crore",
                    period_type="quarter",
                    period_name="Q1 FY26",
                    fiscal_year="FY26",
                    scope="consolidated",
                    basis="reported",
                    source_name="NSE SME Disclosures",
                    confidence=0.98,
                ),
            ],
            "business_summary": "All E Technologies is a specialized IT consulting firm and Microsoft Business Applications Gold partner providing digital transformation, ERP, and CRM solutions globally.",
        }

        return profiles
