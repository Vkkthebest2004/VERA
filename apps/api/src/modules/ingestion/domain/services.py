import re
import uuid
from typing import List, Tuple
from .entities import (
    ChannelType,
    ExtractedAssertion,
    FactCheckDossier,
    FinancialEntity,
    FinancialMetric,
    RedFlagIndicator,
    RedFlagSeverity,
)

# Common Indian & Global market tickers and company name mappings
KNOWN_ENTITIES = {
    "TATA POWER": {"ticker": "TATAPOWER", "type": "COMPANY"},
    "TATA MOTORS": {"ticker": "TATAMOTORS", "type": "COMPANY"},
    "TATA CONSULTANCY SERVICES": {"ticker": "TCS", "type": "COMPANY"},
    "TCS": {"ticker": "TCS", "type": "COMPANY"},
    "RELIANCE": {"ticker": "RELIANCE", "type": "COMPANY"},
    "RELIANCE INDUSTRIES": {"ticker": "RELIANCE", "type": "COMPANY"},
    "SUZLON": {"ticker": "SUZLON", "type": "COMPANY"},
    "SUZLON ENERGY": {"ticker": "SUZLON", "type": "COMPANY"},
    "INFOSYS": {"ticker": "INFY", "type": "COMPANY"},
    "HDFC BANK": {"ticker": "HDFCBANK", "type": "COMPANY"},
    "ICICI BANK": {"ticker": "ICICIBANK", "type": "COMPANY"},
    "STATE BANK OF INDIA": {"ticker": "SBIN", "type": "COMPANY"},
    "SBI": {"ticker": "SBIN", "type": "COMPANY"},
    "ADANI ENTERPRISES": {"ticker": "ADANIENT", "type": "COMPANY"},
    "ADANI POWER": {"ticker": "ADANIPOWER", "type": "COMPANY"},
    "ADANI GREEN": {"ticker": "ADANIGREEN", "type": "COMPANY"},
    "ZOMATO": {"ticker": "ZOMATO", "type": "COMPANY"},
    "PAYTM": {"ticker": "PAYTM", "type": "COMPANY"},
    "ONE97": {"ticker": "PAYTM", "type": "COMPANY"},
    "IRFC": {"ticker": "IRFC", "type": "COMPANY"},
    "HAL": {"ticker": "HAL", "type": "COMPANY"},
    "BHEL": {"ticker": "BHEL", "type": "COMPANY"},
    "IREDA": {"ticker": "IREDA", "type": "COMPANY"},
    "ITC": {"ticker": "ITC", "type": "COMPANY"},
    "WIPRO": {"ticker": "WIPRO", "type": "COMPANY"},
    # Global Tech Giants & Global Corporations
    "APPLE": {"ticker": "AAPL", "type": "COMPANY"},
    "GOOGLE": {"ticker": "GOOGL", "type": "COMPANY"},
    "GOOGLE CLOUD": {"ticker": "GOOGL", "type": "COMPANY"},
    "ALPHABET": {"ticker": "GOOGL", "type": "COMPANY"},
    "MICROSOFT": {"ticker": "MSFT", "type": "COMPANY"},
    "AMAZON": {"ticker": "AMZN", "type": "COMPANY"},
    "META": {"ticker": "META", "type": "COMPANY"},
    "TESLA": {"ticker": "TSLA", "type": "COMPANY"},
    "NVIDIA": {"ticker": "NVDA", "type": "COMPANY"},
    "NETFLIX": {"ticker": "NFLX", "type": "COMPANY"},
    "INTEL": {"ticker": "INTC", "type": "COMPANY"},
    "AMD": {"ticker": "AMD", "type": "COMPANY"},
    "OPENAI": {"ticker": None, "type": "COMPANY"},
    "SAMSUNG": {"ticker": "005930", "type": "COMPANY"},
    "BERKSHIRE HATHAWAY": {"ticker": "BRK", "type": "COMPANY"},
    "JPMORGAN": {"ticker": "JPM", "type": "COMPANY"},
    "GOLDMAN SACHS": {"ticker": "GS", "type": "COMPANY"},
    # Media & News Publishers
    "NEWSNATION": {"ticker": None, "type": "MEDIA"},
    "MONEYCONTROL": {"ticker": None, "type": "MEDIA"},
    "REUTERS": {"ticker": None, "type": "MEDIA"},
    "BLOOMBERG": {"ticker": None, "type": "MEDIA"},
    "CNBC": {"ticker": None, "type": "MEDIA"},
    # Regulators & Exchanges
    "SEBI": {"ticker": None, "type": "REGULATOR"},
    "RBI": {"ticker": None, "type": "REGULATOR"},
    "NSE": {"ticker": None, "type": "EXCHANGE"},
    "BSE": {"ticker": None, "type": "EXCHANGE"},
    "NIFTY": {"ticker": "NIFTY50", "type": "INDEX"},
    "SENSEX": {"ticker": "SENSEX", "type": "INDEX"},
}

# Red flag patterns typical in WhatsApp/Instagram/Telegram finfluencer tips
RED_FLAG_PATTERNS = [
    {
        "pattern": r"(100%|guaranteed|guarantee|risk[- ]?free|sure[- ]?shot|jackpot|paisa double)",
        "name": "Guaranteed Return Claim",
        "severity": RedFlagSeverity.CRITICAL,
        "description": "Financial returns can never be legally or practically guaranteed. High probability of deceptive promotion.",
    },
    {
        "pattern": r"(upper circuit|uc guaranteed|continuous uc|circuit breaker)",
        "name": "Upper Circuit / Pump Signal",
        "severity": RedFlagSeverity.HIGH,
        "description": "Claims of imminent circuit limits are common triggers in pump-and-dump or momentum manipulation schemes.",
    },
    {
        "pattern": r"(buy (now|today|tomorrow)|hurry|don'?t miss|last chance|load (heavily|up)|9:15 am|before it (blasts|flies|runs))",
        "name": "Artificial Urgency & FOMO",
        "severity": RedFlagSeverity.HIGH,
        "description": "Creates panic or FOMO to induce hasty buying without due diligence.",
    },
    {
        "pattern": r"(insider (news|leak|info)|secret (news|deal|meeting)|operator (buying|active|game)|confidential report)",
        "name": "Unverified Insider / Operator Leak Claim",
        "severity": RedFlagSeverity.CRITICAL,
        "description": "Trading on alleged insider info is illegal under SEBI regulations; circulating fake insider rumors is a classic fraud tactic.",
    },
    {
        "pattern": r"(multibagger|10x|20x|50x|100x|rocket|next mrf|huge profit)",
        "name": "Sensationalist Multi-bagger Exaggeration",
        "severity": RedFlagSeverity.MEDIUM,
        "description": "Unrealistic forward multipliers without verifiable fundamental financial justification.",
    },
    {
        "pattern": r"(forwarded many times|forwarded as received|whatsapp forward|circulating on telegram)",
        "name": "Viral Forward Propagation",
        "severity": RedFlagSeverity.MEDIUM,
        "description": "Mass-forwarded message with no traceable primary origin or accountable author.",
    },
    {
        "pattern": r"(not sebi registered|no sebi registration|personal view only|educational purpose)",
        "name": "Registration Disclaimer / Grey-Area Advisor",
        "severity": RedFlagSeverity.LOW,
        "description": "Unregistered entity providing explicit stock tips while shielding behind an educational disclaimer.",
    },
]


class FinancialInformationDehypingService:
    """Core domain service for de-noising social financial text and extracting facts."""

    def analyze_content(self, text: str, channel: ChannelType = ChannelType.TEXT) -> FactCheckDossier:
        clean_text = text.strip()
        
        # 1. Detect red flags
        red_flags = self._detect_red_flags(clean_text)
        
        # 2. Calculate hype score & sentiment
        hype_score, sentiment = self._calculate_hype_and_sentiment(clean_text, red_flags)
        
        # 3. Extract financial entities (companies, tickers, regulators)
        entities = self._extract_entities(clean_text)
        
        # 4. Extract financial metrics (deal amounts, percentages, targets)
        metrics = self._extract_metrics(clean_text)
        
        # 5. Extract atomic verifiable assertions
        assertions = self._decompose_into_assertions(clean_text, entities, metrics)
        
        # 6. Generate de-hyped objective summary
        dehyped_summary = self._generate_dehyped_summary(clean_text, assertions, entities, metrics)

        # 7. Generate human-readable explanation and decoded metrics
        from .explanation_layer import HumanReadableExplanationLayer
        explanation = HumanReadableExplanationLayer.generate_explanation(
            raw_text=clean_text,
            entities=entities,
            metrics=metrics,
            assertions=assertions,
            red_flags=red_flags,
        )
        
        return FactCheckDossier(
            channel=channel,
            original_content=clean_text,
            raw_verbatim_text=clean_text,
            dehyped_summary=dehyped_summary,
            human_readable_explanation=explanation,
            hype_score=hype_score,
            sentiment=sentiment,
            entities=entities,
            metrics=metrics,
            red_flags=red_flags,
            assertions=assertions,
            metadata={
                "char_count": len(clean_text),
                "word_count": len(clean_text.split()),
                "channel_detected": channel.value,
            },
        )

    def _detect_red_flags(self, text: str) -> List[RedFlagIndicator]:
        flags: List[RedFlagIndicator] = []
        lower_text = text.lower()
        
        for rule in RED_FLAG_PATTERNS:
            matches = list(re.finditer(rule["pattern"], lower_text, re.IGNORECASE))
            if matches:
                # Grab surrounding context for the snippet
                m = matches[0]
                start = max(0, m.start() - 15)
                end = min(len(text), m.end() + 15)
                snippet = text[start:end].strip()
                
                flags.append(
                    RedFlagIndicator(
                        flag_id=f"flag_{uuid.uuid4().hex[:6]}",
                        flag_name=rule["name"],
                        severity=rule["severity"],
                        description=rule["description"],
                        matched_snippet=f"...{snippet}...",
                    )
                )
        return flags

    def _calculate_hype_and_sentiment(
        self, text: str, red_flags: List[RedFlagIndicator]
    ) -> Tuple[float, str]:
        # Emojis commonly found in hype posts
        hype_emojis = ["🚀", "🔥", "💰", "🤑", "📈", "💣", "💥", "⚡", "🚨", "👑", "🎯", "💸", "💎"]
        emoji_count = sum(text.count(e) for e in hype_emojis)
        exclamation_count = text.count("!")
        
        # Upper case words count (excluding small words and tickers)
        words = text.split()
        caps_words = [w for w in words if w.isupper() and len(w) > 2 and w not in ["NSE", "BSE", "SEBI", "RBI", "USD", "INR"]]
        
        score = 0.05  # baseline
        score += min(emoji_count * 0.1, 0.35)
        score += min(exclamation_count * 0.05, 0.25)
        score += min(len(caps_words) * 0.05, 0.2)
        score += len([f for f in red_flags if f.severity in (RedFlagSeverity.HIGH, RedFlagSeverity.CRITICAL)]) * 0.15
        
        normalized_score = min(max(round(score, 2), 0.0), 1.0)
        
        # Determine sentiment
        lower = text.lower()
        if any(w in lower for w in ["crash", "dump", "default", "fraud", "scam", "bankruptcy", "plunge"]):
            sentiment = "PANIC" if normalized_score > 0.6 else "BEARISH"
        elif normalized_score > 0.6:
            sentiment = "HYPER_BULLISH"
        elif any(w in lower for w in ["buy", "growth", "order", "contract", "profit", "target"]):
            sentiment = "BULLISH"
        else:
            sentiment = "NEUTRAL"
            
        return normalized_score, sentiment

    def _extract_entities(self, text: str) -> List[FinancialEntity]:
        entities: List[FinancialEntity] = []
        found_names = set()
        upper_text = text.upper()
        
        # 1. Look for known companies/regulators/media
        for name, info in KNOWN_ENTITIES.items():
            pattern = r"\b" + re.escape(name) + r"\b"
            if re.search(pattern, upper_text):
                if name not in found_names:
                    found_names.add(name)
                    entities.append(
                        FinancialEntity(
                            name=name.title() if info["type"] in ("COMPANY", "MEDIA") else name,
                            ticker=info["ticker"],
                            entity_type=info["type"],
                            role="SUBJECT",
                        )
                    )
                    
        # 2. Check for isolated stock tickers like NSE: TATAPOWER, BSE: 500400 or $AAPL, $NVDA
        ticker_matches = re.findall(r"(?:NSE|BSE|\$):?\s*([A-Z]{2,12})\b", text)
        for t in ticker_matches:
            if t not in found_names and t not in [e.ticker for e in entities if e.ticker]:
                found_names.add(t)
                entities.append(
                    FinancialEntity(
                        name=t,
                        ticker=t,
                        entity_type="COMPANY",
                        role="SUBJECT",
                    )
                )

        # 3. Dynamic extraction from media tags: e.g. [NEWSNATION] Apple, [REUTERS] Tesla
        bracket_match = re.search(r"\[([A-Za-z0-9_-]+)\]\s*([A-Z][a-zA-Z0-9]+(?:\s+[A-Z][a-zA-Z0-9]+)?)", text)
        if bracket_match:
            cand = bracket_match.group(2).strip()
            if cand.upper() not in found_names and cand.upper() not in ["EXACT", "IMAGE", "TEXT", "MULTIMODAL"]:
                found_names.add(cand.upper())
                entities.append(
                    FinancialEntity(
                        name=cand,
                        ticker=None,
                        entity_type="COMPANY",
                        role="SUBJECT",
                    )
                )

        # 4. Dynamic extraction from subject action verbs: e.g. "Apple planning to hire...", "Google announces..."
        verb_pattern = r"\b([A-Z][a-zA-Z0-9]+(?:\s+[A-Z][a-zA-Z0-9]+)?)\s+(?:plans?|planning|announces?|announced|invests?|investing|hires?|hiring|signs?|signed|buys?|bought|acquires?|acquired|reports?|reported|bagged)\b"
        for vm in re.finditer(verb_pattern, text):
            cand = vm.group(1).strip()
            if cand.upper() not in found_names and cand.upper() not in ["EXACT", "IMAGE", "NEWS", "BREAKING", "EXCLUSIVE", "POST", "ALERT", "VERA"]:
                found_names.add(cand.upper())
                entities.append(
                    FinancialEntity(
                        name=cand,
                        ticker=None,
                        entity_type="COMPANY",
                        role="SUBJECT",
                    )
                )

        return entities

    def _extract_metrics(self, text: str) -> List[FinancialMetric]:
        metrics: List[FinancialMetric] = []
        
        # Currency / Deal values (e.g. ₹10,000 Cr, 500 Crore, $50 Million, Rs 1200 crore)
        deal_pattern = r"(?:₹|Rs\.?|INR|\$)?\s*([0-9]+(?:,[0-9]+)*(?:\.[0-9]+)?)\s*(Cr(?:ore)?|Lakh|Bn|Billion|Mn|Million)?"
        for m in re.finditer(r"(?:₹|Rs\.?|INR|\$)\s*[0-9]+(?:,[0-9]+)*(?:\.[0-9]+)?(?:\s*(?:Cr(?:ore)?|Lakh|Bn|Billion|Mn|Million))?", text, re.IGNORECASE):
            raw = m.group(0).strip()
            # Determine metric type from surrounding context
            context_start = max(0, m.start() - 30)
            context_end = min(len(text), m.end() + 30)
            context = text[context_start:context_end].lower()
            
            m_type = "FINANCIAL_VALUE"
            if any(k in context for k in ["deal", "order", "contract", "agreement", "bagged"]):
                m_type = "CONTRACT_VALUE"
            elif any(k in context for k in ["target", "tgt", "cmp", "buy at", "price"]):
                m_type = "TARGET_PRICE"
            elif any(k in context for k in ["revenue", "turnover", "sales"]):
                m_type = "REVENUE"
            elif any(k in context for k in ["profit", "pat", "ebitda", "net"]):
                m_type = "PROFIT"
                
            metrics.append(
                FinancialMetric(
                    metric_type=m_type,
                    raw_text=raw,
                    unit_or_currency="INR" if ("₹" in raw or "Rs" in raw or "Cr" in raw) else "USD",
                )
            )

        # Percentage numbers (e.g. +45%, 20% gain, 300% return)
        for m in re.finditer(r"([+-]?[0-9]+(?:\.[0-9]+)?)\s*%", text):
            raw = m.group(0).strip()
            metrics.append(
                FinancialMetric(
                    metric_type="PERCENTAGE_CLAIM",
                    raw_text=raw,
                    unit_or_currency="%",
                )
            )
            
        return metrics

    def _decompose_into_assertions(
        self, text: str, entities: List[FinancialEntity], metrics: List[FinancialMetric]
    ) -> List[ExtractedAssertion]:
        assertions: List[ExtractedAssertion] = []
        
        # Split by typical social post punctuation or newlines
        lines = [line.strip() for line in re.split(r"[\n\r]+|[.;]+(?=\s+[A-Z0-9])", text) if line.strip()]
        
        entity_name = entities[0].name if entities else "Disclosed Entity"
        
        for line in lines:
            # Filter out pure hype strings or pure emoji lines
            clean_line = re.sub(r"[🚀🔥💰🤑📈💣💥⚡🚨👑🎯💸💎!*#]+", "", line).strip()
            if len(clean_line.split()) < 3:
                continue
            
            lower_line = clean_line.lower()
            
            # Check if this line makes a specific financial assertion
            if any(k in lower_line for k in ["order", "deal", "contract", "agreement", "signed", "bagged", "awarded"]):
                assertions.append(
                    ExtractedAssertion(
                        assertion_id=f"ast_{uuid.uuid4().hex[:6]}",
                        statement=clean_line,
                        category="CONTRACT_DEAL",
                        verifiable=True,
                        confidence_score=0.92,
                        verification_target="BSE/NSE Corporate Announcements & Reg 30 Disclosures",
                    )
                )
            elif any(k in lower_line for k in ["revenue", "profit", "ebitda", "pat", "q1", "q2", "q3", "q4", "fy2"]):
                assertions.append(
                    ExtractedAssertion(
                        assertion_id=f"ast_{uuid.uuid4().hex[:6]}",
                        statement=clean_line,
                        category="FINANCIAL_RESULT",
                        verifiable=True,
                        confidence_score=0.90,
                        verification_target="Audited Quarterly Financial Results filed with Exchanges",
                    )
                )
            elif any(k in lower_line for k in ["target", "tgt", "cmp", "buy", "sell", "circuit", "return"]):
                assertions.append(
                    ExtractedAssertion(
                        assertion_id=f"ast_{uuid.uuid4().hex[:6]}",
                        statement=clean_line,
                        category="PRICE_TARGET",
                        verifiable=False,  # price targets are opinions/speculation, not historical facts
                        confidence_score=0.85,
                        verification_target="SEBI Research Analyst Disclosures & Historical Exchange Pricing",
                    )
                )
            elif any(k in lower_line for k in ["acquisition", "merger", "stake", "bought", "fii", "dii", "promoter"]):
                assertions.append(
                    ExtractedAssertion(
                        assertion_id=f"ast_{uuid.uuid4().hex[:6]}",
                        statement=clean_line,
                        category="M&A_SHAREHOLDING",
                        verifiable=True,
                        confidence_score=0.88,
                        verification_target="Shareholding Pattern Filings & SAST Disclosures (SEBI)",
                    )
                )
                
        # If no assertions detected via heuristic lines, formulate at least one structured assertion
        if not assertions and len(text) > 10:
            clean_stmt = re.sub(r"\[EXACT TEXT EXTRACTED.*?\]:?", "", text, flags=re.DOTALL)
            clean_stmt = re.sub(r"\[MULTIMODAL.*?\]:?", "", clean_stmt, flags=re.DOTALL)
            clean_stmt = re.sub(r"\[[A-Za-z0-9_-]+\]", "", clean_stmt)
            clean_stmt = re.sub(r"[🚀🔥💰🤑📈💣💥⚡🚨👑🎯💸💎!*#]+", "", clean_stmt)
            clean_stmt = re.sub(r"\s+", " ", clean_stmt).strip()
            summary_stmt = (clean_stmt[:140] + "...") if len(clean_stmt) > 140 else clean_stmt
            assertions.append(
                ExtractedAssertion(
                    assertion_id=f"ast_{uuid.uuid4().hex[:6]}",
                    statement=summary_stmt,
                    category="GENERAL_FINANCIAL_CLAIM",
                    verifiable=True,
                    confidence_score=0.75,
                    verification_target="Official Regulatory Filings & News Archive",
                )
            )
            
        return assertions

    def _generate_dehyped_summary(
        self,
        original_text: str,
        assertions: List[ExtractedAssertion],
        entities: List[FinancialEntity],
        metrics: List[FinancialMetric],
    ) -> str:
        comp_entities = [e for e in entities if e.entity_type == "COMPANY"]
        entity_str = ", ".join(e.name for e in comp_entities) if comp_entities else (", ".join(e.name for e in entities) if entities else "")

        clean = re.sub(r"\[EXACT TEXT EXTRACTED.*?\]:?", "", original_text, flags=re.DOTALL)
        clean = re.sub(r"\[MULTIMODAL.*?\]:?", "", clean, flags=re.DOTALL)
        clean = re.sub(r"\[[A-Za-z0-9_-]+\]", "", clean)
        clean = re.sub(r"[🚀🔥💰🤑📈💣💥⚡🚨👑🎯💸💎!*#]+", "", clean)
        clean = re.sub(r"\s+", " ", clean).strip()

        sentence_parts = re.split(r"(?<=[a-z0-9])\.\s+(?=[A-Z])", clean)
        first_sentence = sentence_parts[0].strip() if sentence_parts else clean[:160]

        if entity_str:
            return f"{entity_str}: {first_sentence}"
        return first_sentence[:160]
