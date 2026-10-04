"""
Intent Taxonomy, Multi-Intent Classifier, Language Detector, and Context Resolver.
Adheres strictly to Sections 3, 4, 5, 6, 7, 12, and 45 of the VERA Architecture.
"""

import re
from typing import List, Dict, Any, Optional, Tuple


class IntentTaxonomy:
    """
    Classifies user messages into one or more financial intents, detects
    language (English vs Hinglish), user knowledge depth (Beginner, Intermediate, Advanced),
    and resolves entity and period references from conversation history.
    """

    INTENTS = [
        "EDUCATIONAL",
        "FACTUAL",
        "COMPANY_OVERVIEW",
        "FINANCIAL_PERFORMANCE",
        "REVENUE_ANALYSIS",
        "PROFIT_ANALYSIS",
        "EBITDA_ANALYSIS",
        "CASH_FLOW_ANALYSIS",
        "BALANCE_SHEET_ANALYSIS",
        "DEBT_ANALYSIS",
        "MARGIN_ANALYSIS",
        "GROWTH_ANALYSIS",
        "VALUATION_ANALYSIS",
        "STOCK_PRICE_ANALYSIS",
        "DIVIDEND_ANALYSIS",
        "CORPORATE_ACTION",
        "MANAGEMENT_ANALYSIS",
        "SEGMENT_ANALYSIS",
        "COMPETITOR_COMPARISON",
        "INVESTMENT_ANALYSIS",
        "RISK_ANALYSIS",
        "FINANCIAL_CLAIM_VERIFICATION",
        "NEWS_ANALYSIS",
        "HISTORICAL_ANALYSIS",
        "REGULATORY_ANALYSIS",
        "FINANCIAL_STATEMENT_EXPLANATION",
        "PORTFOLIO_EDUCATION",
        "GREETING_CASUAL",
    ]

    HINGLISH_WORDS = {
        "kya", "hai", "hua", "kitna", "kitni", "chal", "raha", "rahi", "kaise",
        "kaisa", "kaisi", "batao", "samjhao", "paisa", "paise", "karza", "kamaya",
        "bana", "kyun", "kyu", "badha", "ghata", "gir", "mehenga", "sasta", "acchi",
        "achha", "kharidna", "kharidu", "chahiye", "pichle", "pichli", "saal",
        "mein", "aur", "hota", "hoti", "haalat", "zyada", "lagaun", "isme", "sabse"
    }

    @classmethod
    def detect_language(cls, text: str) -> str:
        """Detects whether text is conversational Hinglish or standard English."""
        words = set(re.findall(r"\b[a-zA-Z]+\b", text.lower()))
        matched_hinglish = words.intersection(cls.HINGLISH_WORDS)
        if len(matched_hinglish) >= 1:
            return "hinglish"
        return "english"

    @classmethod
    def detect_user_level(cls, text: str, history: Optional[List[Dict[str, str]]] = None) -> str:
        """
        Infers user sophistication:
        - beginner: simple conversational questions, ELI5, 'simple mein', 'finance nahi aati'
        - advanced: CFA/Harvard, ROIC, incremental capital allocation, SOTP, accrual quality, SOTP framework
        - intermediate: default financial questions (YoY, margins, P/E, debt)
        """
        lower = text.lower()
        
        # Explicit beginner requests
        beginner_triggers = [
            "simple mein", "simple language", "eli5", "finance nahi aati",
            "beginner", "explain simply", "aasan bhasha", "layman",
            "like i am 5", "like i'm 5", "new to finance", "kid"
        ]
        if any(t in lower for t in beginner_triggers):
            return "beginner"

        # Explicit advanced triggers
        advanced_triggers = [
            "cfa", "harvard", "analyst level", "financial model", "deep analysis",
            "roic", "wacc", "fcff", "sotp", "sum of the parts", "incremental capital allocation",
            "accrual quality", "decompose the earnings", "earnings quality",
            "capital intensity", "fcf conversion", "working capital cycle", "unit economics"
        ]
        if any(t in lower for t in advanced_triggers):
            return "advanced"

        # Check for natural beginner phrasing
        if any(w in lower for w in ["kya hota hai", "kya hoti hai", "what is", "what does", "difference kya"]):
            if not any(t in lower for t in ["roic", "wacc", "sotp", "ebitda", "fcf conversion"]):
                return "beginner"

        return "intermediate"

    @classmethod
    def resolve_entity(
        cls,
        text: str,
        active_company_id: Optional[str] = None,
        active_company_name: Optional[str] = None,
        history: Optional[List[Dict[str, str]]] = None
    ) -> Tuple[str, str]:
        """
        Resolves entity ID and company name from current text or conversational context.
        Supports pronouns ('it', 'this company', 'company ki', 'uska').
        """
        lower = text.lower()

        # Known company matching
        if any(w in lower for w in ["reliance", "ril", "ambani", "jio"]):
            return "RELIANCE", "Reliance Industries Ltd"
        if any(w in lower for w in ["tata power", "tatapower"]):
            return "TATAPOWER", "Tata Power Company Ltd"
        if any(w in lower for w in ["tcs", "tata consultancy"]):
            return "TCS", "Tata Consultancy Services Ltd"
        if any(w in lower for w in ["adani wilmar", "awl", "fortune"]):
            return "AWL", "Adani Wilmar Ltd"
        if any(w in lower for w in ["all e", "alletec"]):
            return "ALLETEC", "All E Technologies Ltd"

        # Broad Indian & Global listed entities
        known_stocks = {
            "zomato": ("ZOMATO", "Zomato Ltd"),
            "infosys": ("INFY", "Infosys Ltd"),
            "infy": ("INFY", "Infosys Ltd"),
            "tata motors": ("TATAMOTORS", "Tata Motors Ltd"),
            "hdfc": ("HDFCBANK", "HDFC Bank Ltd"),
            "hdfc bank": ("HDFCBANK", "HDFC Bank Ltd"),
            "itc": ("ITC", "ITC Ltd"),
            "wipro": ("WIPRO", "Wipro Ltd"),
            "airtel": ("BHARTIARTL", "Bharti Airtel Ltd"),
            "bharti airtel": ("BHARTIARTL", "Bharti Airtel Ltd"),
            "icici": ("ICICIBANK", "ICICI Bank Ltd"),
            "icici bank": ("ICICIBANK", "ICICI Bank Ltd"),
            "sbi": ("SBIN", "State Bank of India"),
            "state bank": ("SBIN", "State Bank of India"),
            "ntpc": ("NTPC", "NTPC Ltd"),
            "adani power": ("ADANIPOWER", "Adani Power Ltd"),
            "adani enterprises": ("ADANIENT", "Adani Enterprises Ltd"),
            "suzlon": ("SUZLON", "Suzlon Energy Ltd"),
            "l&t": ("LT", "Larsen & Toubro Ltd"),
            "larsen": ("LT", "Larsen & Toubro Ltd"),
        }
        for kw, (ticker, full_name) in known_stocks.items():
            if kw in lower:
                return ticker, full_name

        # Pronoun resolution from active context or conversational history if pronoun is used
        pronoun_triggers = ["it", "its", "this company", "the company", "company ka", "company ki", "uska", "unki", "iska", "company"]
        has_pronoun = any(re.search(rf"\b{re.escape(p)}\b", lower) for p in pronoun_triggers)

        if has_pronoun and (history or active_company_id):
            if history:
                for turn in reversed(history):
                    content = turn.get("content", "").lower()
                    if any(w in content for w in ["reliance", "ril"]):
                        return "RELIANCE", "Reliance Industries Ltd"
                    if any(w in content for w in ["tata power", "tatapower"]):
                        return "TATAPOWER", "Tata Power Company Ltd"
                    if any(w in content for w in ["tcs", "tata consultancy"]):
                        return "TCS", "Tata Consultancy Services Ltd"
                    for kw, (ticker, full_name) in known_stocks.items():
                        if kw in content:
                            return ticker, full_name

            if active_company_id:
                name = active_company_name or active_company_id
                return active_company_id.upper(), name

        # Dynamic extraction from phrasing: "about X", "explain X", "explain me about X", "X ka profit"
        match = re.search(r"\b(?:about|analyze|explain(?:\s+me)?(?:\s+about)?|tell me(?:\s+about)?)\s+([A-Za-z0-9&]+(?:\s+[A-Za-z0-9&]+)?)\b", text, re.IGNORECASE)
        if match:
            cand = match.group(1).strip()
            financial_terms = {
                "the", "a", "an", "this", "it", "its", "profit", "revenue", "debt", "margin", "margins", 
                "cash", "pe", "stock", "growth", "cash flow", "valuation", "its profit", "its debt",
                "its margin", "its revenue", "expensive", "cheap", "good", "bad"
            }
            if cand.lower() not in financial_terms:
                return cand.upper().replace(" ", ""), cand.title()

        # Check history if no entity explicitly mentioned
        if history:
            for turn in reversed(history):
                content = turn.get("content", "").lower()
                if any(w in content for w in ["reliance", "ril"]):
                    return "RELIANCE", "Reliance Industries Ltd"
                if any(w in content for w in ["tata power", "tatapower"]):
                    return "TATAPOWER", "Tata Power Company Ltd"
                if any(w in content for w in ["tcs", "tata consultancy"]):
                    return "TCS", "Tata Consultancy Services Ltd"
                for kw, (ticker, full_name) in known_stocks.items():
                    if kw in content:
                        return ticker, full_name

        if active_company_id:
            name = active_company_name or active_company_id
            return active_company_id.upper(), name

        # Default fallback
        return "RELIANCE", "Reliance Industries Ltd"

    @classmethod
    def resolve_peer_entities(cls, text: str) -> Optional[Tuple[str, str]]:
        """Resolves pair of entities if query is a comparison (e.g., 'Compare Reliance and TCS', 'Zomato vs Swiggy')."""
        lower = text.lower()
        if "reliance" in lower and "tcs" in lower:
            return "RELIANCE", "TCS"
        if "tata power" in lower and "ntpc" in lower:
            return "TATAPOWER", "NTPC"

        # Dynamic comparison extraction: "X vs Y" or "Compare X and Y"
        match = re.search(r"\bcompare\s+([A-Za-z0-9&]+)\s+and\s+([A-Za-z0-9&]+)\b", lower)
        if match:
            ent1, ent2 = match.group(1).strip().upper(), match.group(2).strip().upper()
            return ent1, ent2
        match_vs = re.search(r"\b([A-Za-z0-9&]+)\s+vs\s+([A-Za-z0-9&]+)\b", lower)
        if match_vs:
            ent1, ent2 = match_vs.group(1).strip().upper(), match_vs.group(2).strip().upper()
            if ent1.lower() not in ["mutual", "revenue", "profit", "price", "roce"]:
                return ent1, ent2
        return None

    @classmethod
    def resolve_period(cls, text: str) -> Dict[str, str]:
        """
        Resolves requested period from text adhering to Section 12 & 13.
        Default to latest reported quarter/annual depending on metric.
        """
        lower = text.lower()
        
        if any(w in lower for w in ["last year", "pichle saal", "fy25", "fy2025", "previous year"]):
            return {"period_type": "annual", "period_name": "FY25", "fiscal_year": "FY25"}
        if any(w in lower for w in ["fy26", "fy2026", "this year", "annual", "full year", "saal"]):
            return {"period_type": "annual", "period_name": "FY26", "fiscal_year": "FY26"}
        if any(w in lower for w in ["last quarter", "pichli quarter", "q4"]):
            return {"period_type": "quarter", "period_name": "Q4 FY26", "fiscal_year": "FY26", "quarter": "Q4"}
        if any(w in lower for w in ["q1", "q1 fy26"]):
            return {"period_type": "quarter", "period_name": "Q1 FY26", "fiscal_year": "FY26", "quarter": "Q1"}

        # Default to latest reported period
        return {"period_type": "quarter", "period_name": "latest", "fiscal_year": "FY26", "quarter": "Q1"}

    @classmethod
    def classify_intents(cls, text: str) -> List[str]:
        """
        Classifies user query into one or more financial intents from Section 3.
        Supports compound questions like 'Reliance ka profit kitna hua aur pichle saal se better hai kya?'.
        """
        lower = text.lower()
        intents = []

        # 1. Greetings
        if re.search(r"^(hi|hello|hey|hola|namaste|good morning|who are you)\b", lower):
            intents.append("GREETING_CASUAL")

        # 2. Viral Rumor / Claim Verification early check (strict rumor/scam patterns)
        rumor_keywords = [
            "guaranteed", "no loss", "100% profit", "upper circuit", "secret deal",
            "whatsapp tip", "telegram tip", "insider info", "fake news", "is this true",
            "is it true", "fact check", "viral claim", "scam", "operator pump"
        ]
        has_rumor_keyword = any(k in lower for k in rumor_keywords)
        has_viral_deal_num = any(k in lower for k in ["12,500", "12500", "2,50,000", "250000", "crude concession"]) and any(w in lower for w in ["deal", "contract", "signed", "bagged", "secret", "aramco", "sjvn", "true"])
        is_exploratory = any(lower.startswith(w) for w in ["explain", "tell me", "what is", "who is", "how does", "how is", "kya hai", "kaise"])

        if (has_rumor_keyword or has_viral_deal_num) and not is_exploratory:
            intents.append("FINANCIAL_CLAIM_VERIFICATION")
        elif ("true" in lower or "fake" in lower) and any(char.isdigit() for char in lower) and not is_exploratory:
            intents.append("FINANCIAL_CLAIM_VERIFICATION")

        # 3. Profit Analysis ("Kitna profit hua?", "PAT", "earnings")
        profit_keywords = [
            "profit", "pat", "kitna kamaya", "net profit", "operating profit",
            "profit badha", "profit kitna", "earnings"
        ]
        if any(k in lower for k in profit_keywords):
            intents.append("PROFIT_ANALYSIS")

        # 4. Revenue Analysis ("Sales", "Revenue", "Kitna bik gaya")
        revenue_keywords = ["revenue", "sales", "turnover", "bikri", "sales kitni", "topline"]
        if any(k in lower for k in revenue_keywords):
            intents.append("REVENUE_ANALYSIS")

        # 5. EBITDA Analysis
        if "ebitda" in lower:
            intents.append("EBITDA_ANALYSIS")

        # 6. Cash Flow Analysis ("Cash flow", "Paisa bana rahi hai ya paper profit", "FCF", "CFO")
        cash_flow_keywords = [
            "cash flow", "cash flow statement", "paper pe profit", "paper profit",
            "actual cash", "cash kaha hai", "fcf", "free cash flow", "operating cash"
        ]
        if any(k in lower for k in cash_flow_keywords):
            intents.append("CASH_FLOW_ANALYSIS")

        # 7. Debt & Balance Sheet Analysis ("Kitna karza hai?", "Debt", "Borrowings", "Liabilities")
        debt_keywords = [
            "karza", "debt", "borrowings", "loan", "leverage", "liabilities",
            "interest coverage", "karz", "debt manageable"
        ]
        if any(k in lower for k in debt_keywords):
            intents.append("DEBT_ANALYSIS")

        # 8. Margins Analysis ("Margins improve hue?", "OPM", "Operating margin")
        margin_keywords = ["margin", "opm", "margins improve", "profit margin", "operating margin"]
        if any(k in lower for k in margin_keywords):
            intents.append("MARGIN_ANALYSIS")

        # 9. Growth & Comparison YoY / QoQ ("YoY kitna grow hua?", "Pichle saal se better", "Growth")
        growth_keywords = [
            "yoy", "qoq", "grow hua", "growth", "badha ya ghata", "pichle saal se",
            "better hai kya", "growing faster", "cagr", "trend"
        ]
        if any(k in lower for k in growth_keywords):
            intents.append("GROWTH_ANALYSIS")

        # 10. Valuation Analysis ("Stock mehenga hai?", "P/E", "Valuation", "Expensive")
        valuation_keywords = [
            "mehenga", "sasta", "valuation", "pe ratio", "p/e", "expensive", "cheap",
            "multiple", "ev/ebitda", "priced in", "valuation expensive"
        ]
        if any(k in lower for k in valuation_keywords):
            intents.append("VALUATION_ANALYSIS")

        # 11. Stock Price Movement ("Share kyun gir raha hai?", "Why did stock fall?")
        stock_price_keywords = ["stock fall", "stock falling", "share gir", "price drop", "share crash", "stock kyun"]
        if any(k in lower for k in stock_price_keywords):
            intents.append("STOCK_PRICE_ANALYSIS")

        # 12. Segment Analysis ("Which part makes most money?", "Jio kaisa hai", "Retail kaisa hai")
        segment_keywords = ["segment", "which business makes most", "jio", "retail", "o2c", "sabse zyada paisa"]
        if any(k in lower for k in segment_keywords) and not ("tata power" in lower and "jio" in lower):
            intents.append("SEGMENT_ANALYSIS")

        # 13. Competitor Comparison ("Reliance vs TCS", "Compare Reliance and TCS", "Who is growing faster")
        comparison_keywords = ["compare", "versus", "who is better", "growing faster", "peers"]
        is_concept_vs = any(c in lower for c in ["mutual fund", "revenue vs", "profit vs", "price vs", "roce vs", "cash vs", "bonus vs", "stocks vs mutual"])
        if (any(k in lower for k in comparison_keywords) or " vs " in lower) and not is_concept_vs:
            intents.append("COMPETITOR_COMPARISON")

        # 14. Investment Analysis ("Should I invest?", "Stock kharidna chahiye?", "Buy or sell")
        invest_keywords = [
            "should i invest", "should i buy", "kharidna chahiye", "paisa lagaun",
            "good stock", "worth buying", "bull case", "bear case", "investment thesis",
            "why might an investor buy", "bad investment"
        ]
        if any(k in lower for k in invest_keywords):
            intents.append("INVESTMENT_ANALYSIS")

        # 15. Financial Performance / Health ("Company kaisi chal rahi hai?", "Company strong hai?")
        perf_keywords = [
            "performance kaisi", "kaisi chal rahi", "strong hai", "financially healthy",
            "financial health", "haalat kaisi", "acchi company", "how is reliance doing",
            "how is the company doing", "business kaisa"
        ]
        if any(k in lower for k in perf_keywords):
            intents.append("FINANCIAL_PERFORMANCE")

        # 16. Company Overview ("What does Reliance do?", "Explain Zomato", "Tell me about Infosys")
        overview_patterns = [
            r"\b(explain|tell me about|tell me regarding|overview of|details on|describe|know about)\b",
            r"\b(kya karti hai|kaise kamati hai|kaisa hai|kaisi company hai)\b",
            r"\b(company profile|business model|overview)\b",
            r"\b(about|regarding)\s+[a-zA-Z0-9&]+",
            r"\b(what does|how does)\s+[a-zA-Z0-9&]+\s+(do|make|work|operate)\b",
            r"\bwho is\s+[a-zA-Z0-9&]+\b",
        ]
        if any(re.search(p, lower) for p in overview_patterns):
            intents.append("COMPANY_OVERVIEW")

        # 17. Educational Concepts ("What does EBITDA mean?", "Profit kya hota hai?", "Debt kya hota hai?")
        edu_keywords = [
            "kya hota hai", "kya hoti hai", "what is", "what does", "mean?", "difference kya",
            "explain simply", "teach me"
        ]
        if any(k in lower for k in edu_keywords) and not any(k in lower for k in ["karti hai", "profit kitna", "kitna hua"]):
            intents.append("EDUCATIONAL")

        # 18. Advanced Topics (Earnings quality, capital allocation, ROIC)
        advanced_keywords = [
            "earnings quality", "capital allocation", "roic", "fcf conversion",
            "sotp", "accrual quality", "decompose"
        ]
        if any(k in lower for k in advanced_keywords):
            intents.append("MANAGEMENT_ANALYSIS")

        # Default fallback
        if not intents:
            known_entity_names = ["reliance", "ril", "tatapower", "tata power", "tcs", "awl", "adani", "zomato", "infosys", "infy", "hdfc", "itc", "wipro", "airtel", "icici", "sbi", "ntpc", "company"]
            if any(w in lower for w in known_entity_names):
                intents.append("COMPANY_OVERVIEW")
            else:
                intents.append("COMPANY_OVERVIEW" if len(lower.split()) <= 4 else "EDUCATIONAL")

        return intents
