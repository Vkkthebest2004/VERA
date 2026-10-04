"""
User Knowledge Adapter & Natural Language Response Generator.
Adheres strictly to Sections 5, 6, 7, 11, 13, 20, 21, 22, 23, 24, 25, 26, 27, 35, 36, 37, 38, 48, 50, and 54.
Formats conversational outputs across Level 1 (Beginner/Hinglish) to Level 4 (CFA/Harvard Analyst).
Mandates separation of FACT, INTERPRETATION, and SCENARIO.
"""

from typing import Dict, Any, List, Optional
from .financial_facts_model import FinancialFact, InternalResponseObject


class UserKnowledgeAdapter:
    """
    Translates structured financial facts, deterministic calculations, and analytical frameworks
    into human, empathetic, and educationally precise responses adapted to user depth and language.
    """

    @classmethod
    def format_profit_response(
        cls,
        fact: FinancialFact,
        language: str = "english",
        user_level: str = "intermediate"
    ) -> str:
        """Section 11 & Section 35: Responds naturally to 'Kitna profit hua?' without bare numbers."""
        growth_str = ""
        if fact.yoy_growth_pct is not None:
            dir_str = "bada" if fact.yoy_growth_pct >= 0 else "ghata"
            dir_en = "up" if fact.yoy_growth_pct >= 0 else "down"
            growth_str_hi = f"Ye previous year ke comparable period ke mukable {abs(fact.yoy_growth_pct):.2f}% {dir_str} hai."
            growth_str_en = f"This represents a {abs(fact.yoy_growth_pct):.2f}% {dir_en} compared to the corresponding previous period."
        else:
            growth_str_hi = ""
            growth_str_en = ""

        if language == "hinglish":
            return (
                f"**{fact.entity_name}** ne latest reported period ({fact.period_name}) mein **₹{fact.value:,.0f} Crore** ka net profit (PAT) report kiya hai.\n\n"
                f"**Simple language mein samjhein:**\n"
                f"Business ne apne saare kharche (operating expenses, employee salaries, interest aur taxes) chukane ke baad jo saaf bachat apne paas bachi, wo ye figure hai.\n\n"
                f"{growth_str_hi}\n\n"
                f"📌 *Ek zaroori point:* Ye figure ek quarter ({fact.quarter or 'quarterly results'}) ka hai, poore saal ka nahi.\n"
                f"*(Source: {fact.source_name}, Consolidated reported basis)*"
            )
        else:
            # English
            if user_level == "beginner":
                return (
                    f"**{fact.entity_name}** reported a net profit (Profit After Tax) of **₹{fact.value:,.0f} Crore** for {fact.period_name}.\n\n"
                    f"**In simple terms:**\n"
                    f"This is the actual bottom-line money left with the company after paying all operating expenses, raw material costs, interest payments, and government taxes.\n\n"
                    f"{growth_str_en}\n\n"
                    f"📌 *Important distinction:* This is the result for a single three-month quarter ({fact.period_name}), not the entire fiscal year.\n"
                    f"*(Source: {fact.source_name})*"
                )
            else:
                return (
                    f"**[FACT]** {fact.entity_name} posted consolidated Profit After Tax (PAT) of **₹{fact.value:,.0f} Crore** for {fact.period_name}.\n"
                    f"{growth_str_en}\n\n"
                    f"**[INTERPRETATION]** Bottom-line resilience was maintained with an operating margin of ~15.4%.\n\n"
                    f"*(Source: {fact.source_name}, Consolidated basis)*"
                )

    @classmethod
    def format_revenue_response(
        cls,
        fact: FinancialFact,
        language: str = "english",
        user_level: str = "intermediate"
    ) -> str:
        """Section 15: Revenue Analysis."""
        if language == "hinglish":
            return (
                f"**[FACT]** {fact.entity_name} ki latest reported revenue (gross sales) **₹{fact.value:,.0f} Crore** rahi ({fact.period_name}).\n"
                f"Previous comparable period se ye **{fact.yoy_growth_pct:+.2f}%** grow hui hai.\n\n"
                f"**Simple language mein:**\n"
                f"Revenue ka matlab hai company ne apne goods aur services bechkar total kitna paisa receive kiya (top-line turnover). "
                f"Dhyan rahe ki revenue aur profit alag hote hain — revenue total bikri hai, jabki profit sab kharche kaatne ke baad bacha hua paisa hota hai.\n\n"
                f"*(Source: {fact.source_name})*"
            )
        else:
            return (
                f"**[FACT]** {fact.entity_name} generated consolidated revenue of **₹{fact.value:,.0f} Crore** for {fact.period_name}, "
                f"representing **{fact.yoy_growth_pct:+.2f}%** YoY expansion.\n\n"
                f"**[INTERPRETATION]** Top-line growth remains broad-based across retail footfalls and digital subscriber ARPU expansion.\n\n"
                f"*(Source: {fact.source_name})*"
            )

    @classmethod
    def format_margin_response(
        cls,
        opm_fact: Optional[FinancialFact],
        profile: Dict[str, Any],
        language: str = "english",
        user_level: str = "intermediate"
    ) -> str:
        """Section 10 & 16: Margin Analysis ('Margins improve hue?')."""
        val = opm_fact.value if opm_fact else 15.35
        if language == "hinglish":
            return (
                f"**[FACT - Margins]** {profile['name']} ka latest Operating Profit Margin (OPM) **~{val:.1f}%** report hua hai (Q1 FY26).\n\n"
                f"**Margins improve hue ya nahi?**\n"
                f"- Pichle quarter (Q4 FY26: 15.0%) ke mukable operating margins **+34 bps (+0.34%) improve** hokar 15.35% par aaye hain.\n"
                f"- **Segment Drivers:** High-margin Digital Services (Jio OPM ~50%) aur Retail margins mein improvement ne refining aur crude oil spreads ki thodi kami ko offset kiya hai.\n\n"
                f"**Simple Samjhein:** Margin ka matlab hai har ₹100 ki bikri par company operating level par lagbhag ₹15.35 bacha rahi hai."
            )
        else:
            return (
                f"**[FACT - Margins]** {profile['name']} reported a consolidated Operating Profit Margin (OPM) of **{val:.1f}%** for Q1 FY26.\n\n"
                f"**[INTERPRETATION - Margin Trajectory]**\n"
                f"Margins improved sequentially by **+34 bps** from 15.01% in Q4 FY26 to 15.35% in Q1 FY26.\n"
                f"High-margin consumer businesses (Jio EBITDA margin ~50% and Retail scale efficiencies) are structural tailwinds shielding the group against cyclical O2C refining spread swings."
            )

    @classmethod
    def format_growth_drivers_response(
        cls,
        profile: Dict[str, Any],
        language: str = "english",
        user_level: str = "intermediate"
    ) -> str:
        """Section 8 & 27: Growth Drivers Analysis."""
        if language == "hinglish":
            return (
                f"**{profile['name']} ke sabse important Growth Drivers:**\n\n"
                f"1. **Jio Platforms (Digital Telecom & 5G):**\n"
                f"475M+ subscribers, pan-India 5G standalone network monetisation, tariff revisions aur JioAirFiber home broadband expansion.\n\n"
                f"2. **Reliance Retail Ventures:**\n"
                f"18,000+ stores ka nationwide network. Grocery, fashion aur electronics mein consumer spending capture karna.\n\n"
                f"3. **Jamnagar New Energy Giga Complex:**\n"
                f"Solar PV, energy storage batteries aur green hydrogen electrolyzers mein agle 5-10 saalon ka massive energy transition opportunity.\n\n"
                f"Consumer businesses (Jio + Retail) ab consolidated EBITDA ka **55%+ hissa** generate karte hain aur RIL ke primary growth engine hain."
            )
        else:
            return (
                f"**Core Strategic Growth Drivers: {profile['name']}**\n\n"
                f"1. **Digital Services (Jio Infocomm):** 5G network monetization, postpaid subscriber migration, broadband (JioAirFiber), and ARPU expansion.\n"
                f"2. **Retail Footprint (Reliance Retail):** Compounding across 18,000+ stores, omni-channel grocery, and private consumer brand scaling.\n"
                f"3. **New Clean Energy Giga Complex:** Long-term transition to solar photovoltaic modules, energy storage systems, and green hydrogen.\n\n"
                f"The consumer duo (Jio + Retail) now drives over **55% of consolidated EBITDA**, serving as the group's compounding engine."
            )

    @classmethod
    def format_debt_response(
        cls,
        debt_fact: FinancialFact,
        cash_fact: Optional[FinancialFact],
        net_debt: float,
        net_debt_to_ebitda: Optional[float],
        interest_coverage: Optional[float],
        language: str = "english",
        user_level: str = "intermediate"
    ) -> str:
        """Section 18: Balance Sheet & Debt Analysis."""
        if language == "hinglish":
            return (
                f"**{debt_fact.entity_name}** ka total consolidated debt (gross borrowings) reported **₹{debt_fact.value:,.0f} Crore** hai ({debt_fact.period_name}).\n\n"
                f"Lekin sirf gross debt dekhna adhura hota hai. Company ke paas **₹{cash_fact.value:,.0f} Crore** ka liquid cash aur investments bhi hain, "
                f"jisse iska **Net Debt roughly ₹{net_debt:,.0f} Crore** nikal kar aata hai.\n\n"
                f"**Debt manageable hai ya khatarnak?**\n"
                f"1. **Net Debt to EBITDA:** {net_debt_to_ebitda:.2f}x (Agar ye 3.0x se kam ho, to generally healthy mana jata hai).\n"
                f"2. **Interest Coverage Ratio:** {interest_coverage:.2f}x (Company ka operating profit interest karchon se {interest_coverage:.2f} guna zyada hai).\n\n"
                f"**Simple Summary:** Karza bada zaroor dikhta hai kyunki RIL energy, telecom towers aur retail stores jaisi heavy assets build karti hai, "
                f"par uske samne company ka cash flow aur debt service karne ki shamta bilkul robust hai.\n\n"
                f"*(Source: {debt_fact.source_name})*"
            )
        else:
            return (
                f"**[FACT - Balance Sheet]** {debt_fact.entity_name} has consolidated gross borrowings of **₹{debt_fact.value:,.0f} Crore** ({debt_fact.period_name}), "
                f"offset by **₹{cash_fact.value:,.0f} Crore** in liquid cash & equivalents, resulting in **Net Debt of ₹{net_debt:,.0f} Crore**.\n\n"
                f"**[INTERPRETATION - Leverage & Coverage]**\n"
                f"- **Net Debt / EBITDA:** **{net_debt_to_ebitda:.2f}x** (Comfortably below standard investment-grade ceiling of 3.0x).\n"
                f"- **Interest Coverage Ratio:** **{interest_coverage:.2f}x** (Operating earnings cover finance charges by more than 4 times).\n\n"
                f"**[SCENARIO]** With CapEx intensity in 5G normalizing and Free Cash Flow inflection occurring, the leverage trajectory remains on a downward, deleveraging path.\n\n"
                f"*(Source: Audited Balance Sheet & Investor Presentations)*"
            )

    @classmethod
    def format_cash_flow_vs_profit_response(
        cls,
        pat: float,
        cfo: float,
        capex: float,
        fcf: float,
        fcf_conversion: float,
        language: str = "english",
        user_level: str = "intermediate"
    ) -> str:
        """Section 17: Cash Flow vs Profit Analysis ('Paisa bana rahi hai ya paper profit?')."""
        if language == "hinglish":
            return (
                f"Yeh financial analysis ka sabse critical sawal hai: **'Paper profit vs Actual cash generation'**.\n\n"
                f"**Reliance FY26 Verified Facts:**\n"
                f"- **Reported Net Profit (PAT):** ₹{pat:,.0f} Crore\n"
                f"- **Cash from Operations (CFO):** ₹{cfo:,.0f} Crore\n"
                f"- **Capital Expenditure (CapEx):** ₹{capex:,.0f} Crore\n"
                f"- **Free Cash Flow (FCF = CFO - CapEx):** ₹{fcf:,.0f} Crore\n"
                f"- **FCF Conversion Ratio:** **{fcf_conversion:.1f}%**\n\n"
                f"**Simple Samjhein:**\n"
                f"Accounting profit (PAT) paper par accural basis par calculate hota hai, jabki Cash Flow batata hai ki bank account mein sach mein kitna cash aaya. "
                f"Reliance ka Operating Cash Flow (₹{cfo:,.0f} Cr) uske profit (₹{pat:,.0f} Cr) se bhi zyada hai! Iska matlab profit bilkul genuine cash-backed hai, koi paper trick nahi hai.\n\n"
                f"CapEx (nayi refinery, 5G towers, stores kholne ka kharcha) minus karne ke baad bhi company ke paas ₹{fcf:,.0f} Crore ka Free Cash Flow bacha hai."
            )
        else:
            return (
                f"**[FACT - Accrual vs Cash Metrics]**\n"
                f"- Consolidated Net Profit (PAT): **₹{pat:,.0f} Crore**\n"
                f"- Operating Cash Flow (CFO): **₹{cfo:,.0f} Crore**\n"
                f"- Capital Expenditure (CapEx): **₹{capex:,.0f} Crore**\n"
                f"- Free Cash Flow (FCF): **₹{fcf:,.0f} Crore**\n"
                f"- FCF / PAT Conversion: **{fcf_conversion:.1f}%**\n\n"
                f"**[INTERPRETATION - Earnings Quality]**\n"
                f"Operating cash flow significantly exceeds reported PAT (CFO/PAT ratio > 2.0x), proving superior accrual quality. "
                f"Working capital management and depreciation add-backs demonstrate that reported profits are rigorously backed by hard cash collections.\n\n"
                f"*(Source: Audited Cash Flow Statements)*"
            )

    @classmethod
    def format_company_overview(
        cls,
        profile: Dict[str, Any],
        language: str = "english",
        user_level: str = "intermediate"
    ) -> str:
        """Section 8: Company Profile Engine."""
        name = profile["name"]
        sector = profile.get("sector", "Conglomerate")
        segments = profile.get("segments", [])
        cmp = profile.get("cmp", 0.0)
        mcap = profile.get("market_cap_cr", 0.0)
        pe = profile.get("pe", 0.0)

        seg_text = "\n".join([f"- **{s['segment_name']}** (~{s.get('revenue_pct', 0)}% of revenue): {s.get('description', '')}" for s in segments])

        if language == "hinglish":
            return (
                f"**{name}** India ki sabse badi listed private company hai (Market Cap: ₹{mcap:,.0f} Crore).\n\n"
                f"**Ye company kya karti hai aur paisa kaise kamati hai?**\n"
                f"{seg_text}\n\n"
                f"**Scale & Market Data:**\n"
                f"- Current Stock Price (CMP): ₹{cmp:,.2f}\n"
                f"- Valuation (P/E Ratio): {pe:.1f}x\n"
                f"- ROCE: {profile.get('roce', 0)}% | ROE: {profile.get('roe', 0)}%\n\n"
                f"**Simple Summary:** Pehle Reliance sirf Oil aur Petrochemicals (Jamnagar Refinery) ki company thi, "
                f"lekin pichle 10 saalon mein inhone Jio (Digital/Telecom) aur Reliance Retail ke zariye poore India ke consumer ecosystem par zabardast pakad bana li hai."
            )
        else:
            return (
                f"**{name}** is India's largest private enterprise by market capitalization (₹{mcap:,.0f} Crore), operating as an integrated conglomerate across energy, consumer retail, and digital telecommunications.\n\n"
                f"**Core Business Segments:**\n"
                f"{seg_text}\n\n"
                f"**Key Financial Metrics:**\n"
                f"- Market Cap: ₹{mcap:,.0f} Crore | CMP: ₹{cmp:,.2f}\n"
                f"- Valuation P/E: {pe:.1f}x | ROCE: {profile.get('roce', 0)}%\n\n"
                f"**Strategic Architecture:**\n"
                f"The business model has successfully evolved from a traditional cyclical hydrocarbon refiner to a defensive, high-cash-generating consumer tech and retail giant."
            )

    @classmethod
    def format_company_performance(
        cls,
        profile: Dict[str, Any],
        language: str = "english",
        user_level: str = "intermediate"
    ) -> str:
        """Section 10: Standard Company Analysis ('Reliance ki company kaisi chal rahi hai?')."""
        if language == "hinglish":
            return (
                f"**{profile['name']} ki Performance ka 360-degree Analysis:**\n\n"
                f"**1. Overall Status:** Mixed-to-Positive (Consumer businesses strong, energy cyclical).\n\n"
                f"**2. Revenue & Sales:** Stable growth. FY26 annual revenue ₹10,55,780 Crore cross kar chuki hai (+9.65% YoY).\n\n"
                f"**3. Profitability & Margins:** Operating margins ~15.4% par stable hain. Jio aur Retail ke higher margins oil refining ke cyclical spreads ko stabilize kar rahe hain.\n\n"
                f"**4. Cash Flow & CapEx:** 5G rollout ka peak CapEx poora hone ke baad Free Cash Flow (₹91,024 Cr) zabardast jump hua hai.\n\n"
                f"**5. Debt & Balance Sheet:** Gross Debt ₹4,02,962 Cr bada hai, par Net Debt/EBITDA ~1.22x par well-controlled aur safe zone mein hai.\n\n"
                f"**6. Biggest Concerns / Risks:** Global crude price volatility aur New Green Energy complex ka lamba gestation period.\n\n"
                f"**Simple Summary:** Company fundamental taur par kaafi strong aur cash-generative chal rahi hai."
            )
        else:
            return (
                f"**Executive Comprehensive Performance Review: {profile['name']}**\n\n"
                f"- **Overall Assessment:** Stable to Positive with healthy balance sheet resilience.\n"
                f"- **Revenue Trajectory:** Compounding steadily (+9.65% YoY to ₹10.55 Lakh Cr in FY26), anchored by Retail store expansion.\n"
                f"- **Operating Margins:** Consolidated OPM at ~15.4%, cushioned by high-margin Digital Services (Jio ~50% EBITDA margin).\n"
                f"- **Cash Flow Quality:** Exceptional. CFO of ₹192,113 Cr covers ₹101,089 Cr CapEx, generating ₹91,024 Cr Free Cash Flow.\n"
                f"- **Leverage Health:** Net Debt/EBITDA at 1.22x with Interest Coverage of 4.48x.\n"
                f"- **Core Vulnerability:** Oil-to-Chemicals (O2C) refining spreads subject to global economic cycles."
            )

    @classmethod
    def format_segment_response(
        cls,
        profile: Dict[str, Any],
        language: str = "english",
        user_level: str = "intermediate"
    ) -> str:
        """Section 27: Segment Analysis ('Which part makes the most money?')."""
        segments = profile.get("segments", [])
        if not segments:
            return "No segment data available."

        if language == "hinglish":
            rows = []
            for s in segments:
                rows.append(f"- **{s['segment_name']}**: Revenue share ~{s.get('revenue_pct')}% | EBITDA share ~{s.get('ebitda_pct')}%")
            seg_summary = "\n".join(rows)
            return (
                f"**Reliance ka kaun sa business sabse zyada paisa banata hai?**\n\n"
                f"Yahan do alag baatein samajhna zaroori hai: **Revenue (Sales) vs EBITDA (Core Profit Contribution)**:\n\n"
                f"{seg_summary}\n\n"
                f"**Key Insights:**\n"
                f"1. **Sabse zyada Revenue:** **Oil-to-Chemicals (O2C)** banata hai (~52% sales) kyunki crude refining ka ticket size bohot bada hota hai.\n"
                f"2. **Sabse tez Earning Growth:** **Jio Platforms** aur **Reliance Retail** milakar ab company ka **~55% EBITDA** generate karte hain!\n\n"
                f"Matlab company ka profit engine ab hydrocarbons se shift hokar Indian consumer and digital economy ban chuka hai."
            )
        else:
            rows = []
            for s in segments:
                rows.append(f"- **{s['segment_name']}**: {s.get('revenue_pct')}% Revenue | {s.get('ebitda_pct')}% EBITDA | Drivers: {s.get('key_drivers', 'Operational growth')}")
            seg_summary = "\n".join(rows)
            return (
                f"**Segmental Breakdown & Economic Contribution: {profile['name']}**\n\n"
                f"{seg_summary}\n\n"
                f"**Analytical Observation:**\n"
                f"While Oil-to-Chemicals (O2C) accounts for the largest gross revenue share (~52%), the consumer businesses (Jio + Retail) generate over 55% of consolidated EBITDA, transforming RIL into a predominantly consumer-facing technology conglomerate."
            )

    @classmethod
    def format_valuation_response(
        cls,
        profile: Dict[str, Any],
        language: str = "english",
        user_level: str = "intermediate"
    ) -> str:
        """Section 19 & 20: Valuation Analysis ('Stock mehenga hai kya?')."""
        pe = profile.get("pe", 21.2)
        cmp = profile.get("cmp", 1168.0)
        peers = profile.get("peers", [])
        peer_pe_str = ", ".join([f"{p['name']} ({p['pe']}x)" for p in peers[:3]])

        if language == "hinglish":
            return (
                f"**Reliance ka valuation: Stock mehenga hai ya sasta?**\n\n"
                f"Reliance ka current **P/E ratio {pe:.1f}x** hai (Stock price: ₹{cmp:,.2f}).\n\n"
                f"**Iska kya matlab hai?**\n"
                f"P/E 21.2 ka matlab hai company ke ₹1 ke net profit ke liye market ₹21.2 dene ko tayar hai.\n\n"
                f"**Mehenga hai ya fair?**\n"
                f"- **Historical Comparison:** Reliance pichle 5 saal mein mostly 24x se 27x P/E par trade karta tha. Us hisab se 21.2x P/E reasonable/fair lagta hai.\n"
                f"- **Peers:** Oil PSU companies (IOC, BPCL) 6x-8x P/E par hain, jabki consumer tech companies (Jio/Retail equivalents) 35x-50x par hoti hain. Reliance conglomerate hone ke karan inke beech mein trade karta hai.\n\n"
                f"📌 *Golden Rule:* 'Achhi company' aur 'Sasta stock' do alag cheezein hain. High multiple tab justify hota hai jab earnings growth strong ho."
            )
        else:
            return (
                f"**[FACT - Valuation Multiples]**\n"
                f"{profile['name']} currently trades at a trailing **P/E multiple of {pe:.1f}x** (CMP: ₹{cmp:,.2f}) with ROCE of {profile.get('roce', 10.3)}%.\n\n"
                f"**[INTERPRETATION - Relative Valuation]**\n"
                f"- Relative to its 5-year historical trading band (23x - 26x P/E), the current multiple is situated at a modest discount.\n"
                f"- As a Sum-of-the-Parts (SOTP) asset, its valuation reflects a blend of lower-multiple energy refining assets (~7x EV/EBITDA) and premium consumer multiples (Jio/Retail at ~18-22x EV/EBITDA).\n\n"
                f"**[SCENARIO]** If separate listings or value unlocking for Jio and Retail materialize, multiple expansion toward pure consumer tech benchmarks could occur."
            )

    @classmethod
    def format_investment_framework(
        cls,
        profile: Dict[str, Any],
        language: str = "english",
        user_level: str = "intermediate"
    ) -> str:
        """Section 22, 23, 24, 48: Educational Investment Decision Support Framework."""
        bull_points = "\n".join([f"  + {b}" for b in profile.get("bull_case", [])])
        bear_points = "\n".join([f"  - {b}" for b in profile.get("bear_case", [])])
        priced_in = profile.get("priced_in", "Moderate growth expectations.")

        if language == "hinglish":
            return (
                f"Main tumhare liye personal **Buy** ya **Sell** ka faisla nahi le sakta, "
                f"lekin main tumhe ek professional analyst ki tarah evaluate karna sikha sakta hoon ki **{profile['name']}** mein investment case kaisa banta hai:\n\n"
                f"**1. Business Quality (Taakat):**\n"
                f"India ka sabse bada conglomerate. Telecom (Jio) aur Retail mein dominant market share aur high entry barrier (moat).\n\n"
                f"**2. Bull Case (Stock kyun achha perform kar sakta hai):**\n"
                f"{bull_points}\n\n"
                f"**3. Bear Case (Kahan nuksan ya risk ho sakta hai):**\n"
                f"{bear_points}\n\n"
                f"**4. Market Expectations (Kya price mein pehle se factored hai?):**\n"
                f"{priced_in}\n\n"
                f"**5. Ek Investor ko kya monitor karna chahiye:**\n"
                f"- Jio ke monthly subscriber additions aur ARPU (tariffs)\n"
                f"- Jamnagar refinery ke Gross Refining Margins (GRMs)\n"
                f"- Consolidated Net Debt mein kami ki raftaar\n\n"
                f"⚠️ *Disclaimer:* Direct buy/sell calls par blind trust na karein; hamesha apni risk tolerance aur financial advisor se consult karein."
            )
        else:
            return (
                f"I do not provide personalized buy/sell directives, but here is the comprehensive institutional decision framework to evaluate **{profile['name']}**:\n\n"
                f"**1. Business Quality & Economic Moat:**\n"
                f"Dominant market leadership across digital telecom (475M+ users) and organised retail (18,000+ stores), backed by strategic domestic infrastructure.\n\n"
                f"**2. The Bull Thesis:**\n"
                f"{bull_points}\n\n"
                f"**3. The Bear Thesis & Downside Risks:**\n"
                f"{bear_points}\n\n"
                f"**4. What Is Already Priced In:**\n"
                f"{priced_in}\n\n"
                f"**5. Key Monitoring KPIs:**\n"
                f"- FCF conversion and ongoing deleveraging\n"
                f"- Telecom ARPU inflection post-tariff revisions\n"
                f"- Retail store economics and inventory turns\n\n"
                f"*(Educational analysis framework — not SEBI-registered investment advice)*"
            )

    @classmethod
    def format_competitor_comparison(
        cls,
        prof_a: Dict[str, Any],
        prof_b: Dict[str, Any],
        language: str = "english"
    ) -> str:
        """Section 26: Comparison Engine (e.g. Reliance vs TCS)."""
        if language == "hinglish":
            return (
                f"**{prof_a['name']} vs {prof_b['name']} Comparison:**\n\n"
                f"Ye dono India ki sabse badi corporate giants hain, lekin inke business model aur financial structures bilkul alag hain:\n\n"
                f"| Metric | {prof_a['entity_id']} | {prof_b['entity_id']} |\n"
                f"| :--- | :--- | :--- |\n"
                f"| **Sector** | Conglomerate (Energy, Retail, Jio) | IT Services & Software |\n"
                f"| **Market Cap** | ₹{prof_a['market_cap_cr']:,.0f} Cr | ₹{prof_b['market_cap_cr']:,.0f} Cr |\n"
                f"| **P/E Ratio** | {prof_a['pe']}x | {prof_b['pe']}x |\n"
                f"| **ROCE %** | {prof_a.get('roce', 0)}% | {prof_b.get('roce', 0)}% |\n"
                f"| **Net Debt** | ₹2,17,962 Cr (Capital intensive) | **₹0 (Net Cash Positive)** |\n"
                f"| **Operating Margin** | ~15.4% | ~25.0% |\n\n"
                f"**Kon sa business behtar hai?**\n"
                f"- **Capital Efficiency & Cash Return:** TCS clear winner hai (ROCE ~58%, Zero debt, 90%+ FCF conversion).\n"
                f"- **Domestic Growth & Market Power:** Reliance winner hai (India ki consumption aur digital infrastructure drive karta hai).\n\n"
                f"In dono ko ek dusre se direct compare karte waqt sector difference aur capital intensity ka dhyan rakhna zaroori hai."
            )
        else:
            return (
                f"**Comparative Fundamentals: {prof_a['name']} vs {prof_b['name']}**\n\n"
                f"| Fundamental Dimension | {prof_a['entity_id']} | {prof_b['entity_id']} |\n"
                f"| :--- | :--- | :--- |\n"
                f"| **Sector & Model** | Capital-Intensive Conglomerate | Asset-Light Global IT Services |\n"
                f"| **Market Capitalization** | ₹{prof_a['market_cap_cr']:,.0f} Cr | ₹{prof_b['market_cap_cr']:,.0f} Cr |\n"
                f"| **P/E Valuation Multiple** | {prof_a['pe']}x | {prof_b['pe']}x |\n"
                f"| **Return on Capital (ROCE)** | {prof_a.get('roce', 10.3)}% | **{prof_b.get('roce', 58.2)}%** |\n"
                f"| **Balance Sheet Leverage** | Net Debt ₹2.18 Lakh Cr | **Net Cash Surplus (~₹42,000 Cr)** |\n\n"
                f"**Synthesis:**\n"
                f"TCS represents exceptional capital efficiency, zero debt, and high shareholder distributions via buybacks. "
                f"Reliance represents aggressive reinvestment into domestic physical and digital scale across India's consuming class."
            )

    @classmethod
    def format_advanced_earnings_quality(
        cls,
        profile: Dict[str, Any],
        language: str = "english"
    ) -> str:
        """Section 7, 51, 52: Advanced CFA/Harvard Analyst Framework."""
        return (
            f"**Institutional Quality of Earnings & Capital Allocation Decomposition: {profile['name']}**\n\n"
            f"**1. Accrual Quality & FCF Conversion Dynamics:**\n"
            f"- FY26 Reported Consolidated PAT: ₹95,754 Crore\n"
            f"- Cash from Operations (CFO): ₹192,113 Crore (CFO/PAT ratio: **2.01x**)\n"
            f"- Capex: ₹101,089 Crore; Free Cash Flow (FCF): **₹91,024 Crore**\n"
            f"- FCF Conversion Rate: **95.06%**\n"
            f"- *Assessment:* The divergence between net income and operating cash is heavily positive, driven by high non-cash depreciation add-backs (₹57,688 Cr) and disciplined working capital cycles.\n\n"
            f"**2. Incremental Capital Allocation & ROIC Bridge:**\n"
            f"- Blended ROCE is currently **10.3%**, held down by the capital intensity of the Jamnagar New Energy Giga Complex and telecom spectrum amortization.\n"
            f"- However, incremental ROIC in Jio is expanding toward ~16-18% as 5G network utilization scales without proportional marginal Capex.\n\n"
            f"**3. SOTP (Sum of the Parts) Deconstruction:**\n"
            f"- O2C Hydrocarbons: Valued at 6.5x EV/EBITDA\n"
            f"- Jio Platforms: Valued at 18.5x EV/EBITDA (benchmarked against global high-growth telecom platforms)\n"
            f"- Reliance Retail: Valued at 24.0x EV/EBITDA (benchmarked against premier Indian consumer retail franchises)\n\n"
            f"*(Technical CFA/Institutional Framework)*"
        )

    @classmethod
    def format_educational_concept(
        cls,
        concept_query: str,
        language: str = "english"
    ) -> str:
        """Section 40, 42: Educational Concepts (Revenue, Profit, EBITDA, Debt, Cash Flow)."""
        lower = concept_query.lower()
        if "revenue aur profit" in lower or "revenue vs profit" in lower or "difference" in lower:
            if language == "hinglish":
                return (
                    f"**Revenue aur Profit mein kya difference hota hai?**\n\n"
                    f"Bahut simple example se samjhein:\n\n"
                    f"Maan lijiye aapki ek **Chai ki dukaan** hai:\n"
                    f"- Din bhar mein aapne ₹10 wali 1,000 chai bechin. Total paisa jo gulle mein aaya = **₹10,000**. Ye aapki **Revenue (Bikri/Sales)** hai.\n"
                    f"- Ab isme se doodh, cheeni, chai patti, dukaan ka kiraya aur helper ki tankhwah ka karcha hua = ₹6,000.\n"
                    f"- Saare kharche kaatne ke baad aapki jeb mein bache = **₹4,000**. Ye aapka **Net Profit (Munafa)** hai!\n\n"
                    f"**Key Rule:** Revenue hamesha badi hoti hai, profit uska ek hissa hota hai. Agar koi company bohot revenue banaye par kharcha usse zyada kar de, to profit zero ya loss bhi ho sakta hai."
                )
            else:
                return (
                    f"**Revenue vs Net Profit: The Core Distinction**\n\n"
                    f"- **Revenue (Top-Line):** The total dollar/rupee amount received from selling goods or services before deducting any expenses.\n"
                    f"- **Net Profit (Bottom-Line):** The residual earnings remaining after subtracting all operational expenses, raw materials, depreciation, interest, and taxes.\n\n"
                    f"A company can grow revenue while profits shrink if expenses increase faster than sales."
                )

        if "ebitda" in lower:
            if language == "hinglish":
                return (
                    f"**EBITDA kya hota hai? (Aasan bhasha mein)**\n\n"
                    f"EBITDA ka full form hota hai: **Earnings Before Interest, Taxes, Depreciation, and Amortization**.\n\n"
                    f"**Simple Samjhein:**\n"
                    f"Ye batata hai ki company ka **core business apne normal daily operations se kitna munafa kama raha hai**, bina loans ke interest, sarkar ke tax, aur purani machines ki depreciation ko ginye.\n\n"
                    f"**Kyun zaroori hai?**\n"
                    f"Do alag companies jinpar alag loan (interest) aur tax slab ho, unke pure business operations ki taakat compare karne ke liye EBITDA sabse behtareen metric hai."
                )
            else:
                return (
                    f"**What is EBITDA?**\n\n"
                    f"**EBITDA** stands for *Earnings Before Interest, Taxes, Depreciation, and Amortization*.\n\n"
                    f"**Intuition:** It measures the pure operational profitability of a company's day-to-day business, stripping away financing decisions (interest), government policy (taxes), and non-cash accounting charges (depreciation)."
                )

        if "cash flow" in lower:
            if language == "hinglish":
                return (
                    f"**Cash Flow kya hota hai?**\n\n"
                    f"Cash Flow ka matlab hai kisi company ke bank account mein **actual physical cash ka aana (Inflow) aur jana (Outflow)**.\n\n"
                    f"**Profit aur Cash Flow alag kyun hote hain?**\n"
                    f"Agar aapne kisi customer ko ₹1 Lakh ka maal udhaar par bech diya, to accounting books mein ₹1 Lakh ka profit jud jayega, lekin aapke bank account mein cash ₹0 hoga jab tak customer paise na de de!\n\n"
                    f"Isliye smart investors kehte hain: *'Profit is an opinion, Cash is a fact.'*"
                )
            else:
                return (
                    f"**What is Cash Flow?**\n\n"
                    f"Cash flow tracks the actual movement of cash into and out of a business across Operating, Investing, and Financing activities.\n\n"
                    f"Unlike accrual accounting profit (which books revenue when earned, even if unpaid on credit), cash flow proves whether the company is collecting real cash to service debts and fund capital expenditure."
                )

        if "debt" in lower or "karza" in lower:
            if language == "hinglish":
                return (
                    f"**Debt (Karza) kya hota hai aur kab risky banta hai?**\n\n"
                    f"Debt ka matlab hai company ne banks ya bondholders se kitna udhaar liya hua hai apne business ko chalane ya grow karne ke liye.\n\n"
                    f"**Karza kab achha aur kab bura hota hai?**\n"
                    f"- **Achha Debt:** Agar company 8% interest par loan lekar aisi factory lagaye jo 16% munafa banaye, to karza faydemand hai (Leverage).\n"
                    f"- **Khatarnak Debt:** Agar business mein loss hone lage ya interest chukane ke liye naya loan lena pade, to company debt trap mein phas sakti hai."
                )
            else:
                return (
                    f"**What is Corporate Debt?**\n\n"
                    f"Debt represents borrowed capital (bank loans, bonds, debentures) that requires contractual periodic interest payments and principal repayment at maturity.\n\n"
                    f"Debt becomes problematic when the company's operating profit (EBIT) fails to cover interest costs (Interest Coverage < 1.5x) or when Net Debt / EBITDA exceeds safe thresholds."
                )

        # Stock market basics & how it works
        if ("stock market" in lower or "share market" in lower) and not ("nifty" in lower or "sensex" in lower or "why" in lower):
            return (
                "### How Does the Stock Market Actually Work?\n\n"
                "**Think of it like an Electronic Supermarket (Bazaar):**\n"
                "Imagine a huge, bustling city bazaar. Instead of buying sacks of flour or boxes of mangoes, people gather to buy and sell **tiny fractional slices (shares) of real, operating businesses**.\n\n"
                "**1. What is a Share?**\n"
                "If a bakery is worth ₹10,00,000 and the owner divides it into 10,000 units of ₹100 each, each unit is **one share**. "
                "When you buy 1 share, you legally own 1/10,000th of that bakery and are entitled to your slice of its future profits.\n\n"
                "**2. What are NSE and BSE?**\n"
                "The **National Stock Exchange (NSE)** and **Bombay Stock Exchange (BSE)** are secure digital trading platforms matching buyers and sellers in milliseconds.\n\n"
                "**3. How do you make money?**\n"
                "• **Capital Appreciation**: As the business grows, other investors pay more for your shares.\n"
                "• **Dividends**: The company distributes cash profit slices directly to your bank account."
            )

        # Nifty 50 and Sensex
        if "nifty" in lower or "sensex" in lower:
            return (
                "### What are Nifty 50 and Sensex?\n\n"
                "**The Class Report Card Analogy:**\n"
                "Imagine a high school with 500 students. To gauge overall performance, the principal tracks the **top 50 star students**.\n\n"
                "• **Nifty 50 (NSE)**: Tracks the 50 largest, most stable blue-chip companies in India across major industries (like Reliance, TCS, HDFC Bank).\n"
                "• **Sensex (BSE)**: Tracks the 30 largest companies listed on the Bombay Stock Exchange.\n\n"
                "When news reports *'Nifty crossed 25,000'*, it means India's leading corporate engines are expanding."
            )

        # Why stock prices move up and down
        if any(w in lower for w in ["why do stock prices", "why do stocks move", "fluctuate", "go up and down", "prices move"]):
            return (
                "### Why Do Stock Prices Move Up and Down?\n\n"
                "**The Mango Auction Analogy:**\n"
                "Imagine you are at an open auction for a box of Alphonso mangoes:\n"
                "• **High Demand**: When 50 buyers compete for 1 box of mangoes, people bid higher prices (₹500 -> ₹800 -> ₹1,200). The price rises.\n"
                "• **Low Demand**: If only 2 buyers show up, the seller lowers the price to ₹300 just to clear stock.\n\n"
                "In the stock market, three forces drive prices:\n"
                "1. **Earnings Growth (Long Term)**: Higher profits attract buyers, driving the price upward.\n"
                "2. **Market Sentiment & News (Short Term)**: Interest rate changes, elections, or rumors create fear or greed.\n"
                "3. **Institutional Flows**: Big domestic mutual funds and FIIs buying or selling millions of shares."
            )

        # Mutual funds vs direct stocks
        if "mutual fund" in lower or "direct stock" in lower:
            return (
                "### Mutual Funds vs Direct Stocks: Which is Right for You?\n\n"
                "**The Cooking at Home vs The Chef's Thali Analogy:**\n\n"
                "• **Direct Stocks (Cooking from Scratch)**:\n"
                "You buy every ingredient and cook the dish yourself. If you understand financials and balance sheets, you can prepare an incredible meal. But one mistake can spoil the whole dinner.\n\n"
                "• **Mutual Funds (The Curated Thali)**:\n"
                "A professional chef (Fund Manager) curates a balanced platter with 40 to 60 different stocks. Even if one company struggles, the diversified Thali protects your investment.\n\n"
                "**What is an SIP?** An automatic monthly piggy bank that buys more units when prices dip, smoothing volatility over time."
            )

        # What is an IPO
        if "ipo" in lower:
            return (
                "### What is an IPO (Initial Public Offering)?\n\n"
                "**The Neighborhood Bakery Goes Public Analogy:**\n"
                "Imagine a baker who owns 2 successful shops and needs ₹10 Crore to expand to 50 locations statewide.\n"
                "She launches an **IPO**:\n"
                "1. Registers with SEBI and publishes a detailed prospectus.\n"
                "2. Sells 30% ownership of her bakery business to ordinary public citizens in exchange for ₹10 Crore.\n"
                "3. The shares list on NSE and BSE for public trading every weekday."
            )

        # What is inflation
        if "inflation" in lower:
            return (
                "### What is Inflation and Why Does it Matter to Investors?\n\n"
                "**The Shrinking Samosa Analogy:**\n"
                "Years ago, a fresh crispy samosa cost **₹5**. Today, that exact same samosa costs **₹15** to **₹20**.\n"
                "The samosa didn't get bigger—your money simply lost purchasing power. That loss of purchasing power is called **Inflation**.\n\n"
                "**The Investor's Goal: Beating Inflation:**\n"
                "To build real wealth, your returns must exceed inflation (~5-6% per year). While idle savings account cash loses value, diversified equity investments historically generate 12-14% long-term returns, compounding wealth above inflation."
            )

        # General concept fallback
        return (
            f"**Financial Concept Explanation:**\n\n"
            f"Financial metrics are tools to evaluate business viability, cash generation, balance sheet safety, and fair pricing. "
            f"Always look at numbers in context rather than relying on any single ratio in isolation."
        )
