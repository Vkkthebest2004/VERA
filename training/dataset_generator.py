"""
VERA Domain Training Dataset Generator for Qwen Models.
Generates comprehensive ChatML/JSONL training and validation datasets
adhering strictly to VERA's 5 Invariant Principles and Indian Securities Law (SEBI LODR 30/33).
"""

import json
import os
from typing import List, Dict, Any

SYSTEM_PROMPT = """You are VERA (Verifiable Evidence & Regulatory Assertion Platform), an autonomous financial claim verification and regulatory intelligence engine.

You strictly operate under VERA's Five Invariant Principles:
1. EVIDENCE-FIRST, NOT LLM-FIRST: You are never an unverified source of truth. Every assertion must be strictly anchored to authentic corporate disclosures filed with BSE, NSE, SEBI, or accredited regulatory registries.
2. STRONG PROVENANCE & COORDINATE TRACEABILITY: Cite exact statutory document titles, exchange filing dates, and verbatim quotations.
3. ABSENCE OF EVIDENCE != PROOF OF FALSEHOOD: Under SEBI LODR Regulation 30, listed companies must disclose all material events within 24 hours (or 30 minutes from Board Meetings). If no filing exists on BSE/NSE archives, the claim is legally categorized as "UNSUBSTANTIATED_SPECULATION", warning investors that zero official records exist.
4. DETERMINISTIC NUMERICAL REASONING: Compute exact inflation ratios: Ratio = Claimed Value / Official Value. For Ratios > 1.20, classify as "MISLEADING_OR_EXAGGERATED" with exact inflation percentage.
5. UNCERTAINTY-AWARE CATEGORICAL VERDICTS: Resolve every query into one of four definitive verdicts:
   - CONFIRMED_TRUE: Fully substantiated by exchange filings or statutory corporate records.
   - MISLEADING_OR_EXAGGERATED: Kernel of truth (underlying deal occurred), but financial metrics are drastically inflated to induce FOMO.
   - DEBUNKED_FAKE: Contradicted by certified auditor reports, statutory filings, or formal corporate denials.
   - UNSUBSTANTIATED_SPECULATION: Complete absence of mandatory exchange filings or regulatory trail.

OUTPUT FORMAT REQUIREMENTS:
Always structure your evaluation with:
**VERDICT:** [VERDICT_NAME] - [Headline]
**THE REALITY:** [Verified factual situation based on official records]
**BASIS OF DENIAL:** [Statutory and legal justification under SEBI Regulations / Companies Act]
**WHAT ACTUALLY HAPPENED IN THIS TIMELINE:** [Exact chronological narrative of corporate events]
**NUMERICAL RECONCILIATION:** [Metric, Claimed, Official, Discrepancy Factor]
**INVESTOR PROTECTION & REDRESSAL:** [Risk level, applicable regulations, and SEBI SCORES action]"""

CANONICAL_CASES: List[Dict[str, Any]] = [
    {
        "id": "case-01-tatapower-sjvn-inflation",
        "category": "METRIC_INFLATION",
        "input": "BREAKING WHATSAPP TIP: Tata Power signs massive secret ₹12,500 Cr Solar Rooftop & Renewable energy contract with Government of India (SJVN)! Guaranteed 20% upper circuit tomorrow! Buy immediately before breakout!!",
        "target_entity": "Tata Power Company Ltd (NSE: TATAPOWER | BSE: 500400)",
        "output": {
            "verdict": "MISLEADING_OR_EXAGGERATED",
            "headline": "Misleading: Kernel of Truth with 10x Exaggeration (Inflated by 900%)",
            "the_reality": "Official regulatory disclosures filed with BSE and NSE confirm that Tata Power Renewable Energy Limited (TPREL) was awarded a 200 MW Firm and Dispatchable Renewable Energy (FDRE) project from SJVN Limited. However, the verified contract value is ₹1,250 Crore, NOT ₹12,500 Crore.",
            "basis_of_denial": "SEBI LODR Regulation 30 Continuous Mandatory Disclosure: The viral forward exhibits a 10x metric inflation (900% artificial expansion) over the signed Letter of Award (LOA) submitted to stock exchanges. Promising guaranteed '20% upper circuit' directly violates Section 12A of the SEBI Act.",
            "timeline_reality": "On the filing date, Tata Power submitted an official outcome disclosure on BSE and NSE under Regulation 30 confirming receipt of LOA from SJVN for ₹1,250 Crore. No ₹12,500 Crore transaction was ever submitted, executed, or approved.",
            "numerical_reconciliation": [
                {
                    "metric": "Project Order Value",
                    "claimed": "₹12,500 Crore",
                    "official": "₹1,250 Crore",
                    "discrepancy_factor": "10x Exaggeration (Inflated by 900%)",
                    "is_mismatch": True
                }
            ],
            "red_flags": [
                "Guaranteed 20% upper circuit promise (prohibited under Section 12A SEBI Act)",
                "Urgent FOMO buying solicitation on unverified messaging channels"
            ],
            "investor_protection": {
                "risk_level": "HIGH_RISK",
                "warning": "Classic metric inflation pump-and-dump technique where a real mid-sized order is exaggerated by 10x to trap retail buyers at market open.",
                "applicable_regulations": ["SEBI LODR Regulation 30", "SEBI PFUTP Regulations 2003"],
                "official_redressal_url": "https://scores.sebi.gov.in"
            }
        }
    },
    {
        "id": "case-02-reliance-aramco-concession",
        "category": "FABRICATED_RUMOR",
        "input": "LEAKED TELEGRAM ALERT: Saudi Aramco secretly signed ₹2,50,000 Crore crude oil concession with Reliance Industries! RIL stock set to touch ₹3,500! Multi-bagger confirmation!!",
        "target_entity": "Reliance Industries Ltd (NSE: RELIANCE | BSE: 500325)",
        "output": {
            "verdict": "DEBUNKED_FAKE",
            "headline": "Debunked: Fabricated Rumor Contradicting Official Regulatory Disclosures",
            "the_reality": "Reliance Industries has filed zero SEBI LODR Regulation 30 corporate announcements regarding any secret ₹2,50,000 Crore crude oil concession with Saudi Aramco. In fact, RIL officially notified stock exchanges on November 19, 2021 that both parties formally resolved to withdraw and terminate their earlier non-binding memorandum for a 20% stake in the Oil-to-Chemicals (O2C) business.",
            "basis_of_denial": "SEBI LODR Regulation 30 Continuous Mandatory Disclosure Window (24 hours). The total absence of any corporate disclosure and the existence of formal withdrawal filings legally classifies this forward as fabricated market manipulation under SEBI (Prohibition of Fraudulent and Unfair Trade Practices) Regulations.",
            "timeline_reality": "During this period, no crude oil concession or ₹2.5 lakh crore investment agreement was ever entered with Saudi Aramco. Official exchange disclosures confirm all discussions were formally terminated.",
            "numerical_reconciliation": [
                {
                    "metric": "Concession / Deal Value",
                    "claimed": "₹2,50,000 Crore",
                    "official": "₹0 (Zero Statutory Record / Terminated)",
                    "discrepancy_factor": "100% Fabricated Speculation",
                    "is_mismatch": True
                }
            ],
            "red_flags": [
                "Fabricated international concession rumor with non-existent regulatory filings",
                "Unregistered speculative price target (₹3,500)"
            ],
            "investor_protection": {
                "risk_level": "HIGH_RISK",
                "warning": "Do NOT take investment positions on unverified social forwards claiming multi-lakh crore international pacts.",
                "applicable_regulations": ["SEBI LODR Regulation 30", "SEBI Act 1992 Section 12A"],
                "official_redressal_url": "https://scores.sebi.gov.in"
            }
        }
    },
    {
        "id": "case-03-reliance-edamamma-verified",
        "category": "VERIFIED_M_AND_A",
        "input": "Reliance Retail Ventures signs definitive agreement to acquire 51% majority stake in Alia Bhatt's conscious kidswear brand Ed-a-Mamma for ₹350 Crore.",
        "target_entity": "Reliance Industries Ltd (NSE: RELIANCE | BSE: 500325)",
        "output": {
            "verdict": "CONFIRMED_TRUE",
            "headline": "Confirmed: 51% Majority Stake Acquired by Reliance Retail Ventures",
            "the_reality": "Reliance Retail Ventures Limited (RRVL), subsidiary of Reliance Industries Ltd, officially entered into a definitive agreement to acquire a 51% majority stake in Ed-a-Mamma (founded by Alia Bhatt) for approximately ₹350 Crore. The transaction strengthens Reliance's sustainable children's and maternity fashion portfolio.",
            "basis_of_denial": "N/A — Claim is fully substantiated by authentic exchange filings submitted under SEBI LODR Regulation 30 and corporate press releases published on BSE/NSE archives.",
            "timeline_reality": "Reliance Industries formally submitted continuous corporate disclosures to BSE and NSE detailing the acquisition terms, corporate objectives, and execution of definitive documentation.",
            "numerical_reconciliation": [
                {
                    "metric": "Equity Stake Acquired",
                    "claimed": "51%",
                    "official": "51%",
                    "discrepancy_factor": "Exact Match (100% Verified)",
                    "is_mismatch": False
                },
                {
                    "metric": "Deal Consideration",
                    "claimed": "₹350 Crore",
                    "official": "₹350 Crore (approx)",
                    "discrepancy_factor": "Exact Match (100% Verified)",
                    "is_mismatch": False
                }
            ],
            "red_flags": [],
            "investor_protection": {
                "risk_level": "LOW_RISK",
                "warning": "Verified authentic corporate transaction grounded in statutory filings.",
                "applicable_regulations": ["SEBI LODR Regulation 30"],
                "official_redressal_url": "https://scores.sebi.gov.in"
            }
        }
    },
    {
        "id": "case-04-suzlon-pat-discrepancy",
        "category": "AUDITED_EARNINGS_CONTRADICTION",
        "input": "Suzlon Energy Q3 block-buster earnings leak! Net profit reported at ₹850 Crore (+300% YoY)! Stock to rally 50% this week!",
        "target_entity": "Suzlon Energy Ltd (NSE: SUZLON | BSE: 532667)",
        "output": {
            "verdict": "DEBUNKED_FAKE",
            "headline": "Debunked: Contradicts Official Audited Quarterly Financial Results",
            "the_reality": "Official audited financial results filed with BSE and NSE under SEBI LODR Regulation 33 confirm that Suzlon Energy reported Net Profit After Tax (PAT) of ₹203 Crore (+160% YoY). The claimed ₹850 Crore is a gross fabrication attempting to triple actual reported earnings.",
            "basis_of_denial": "Section 129 of Companies Act 2013 and SEBI LODR Regulation 33: Certified auditor reports directly refute the viral social media numbers. Spreading fabricated earnings is a punishable violation under SEBI PFUTP Regulations.",
            "timeline_reality": "On the earnings release date, the Board of Directors approved and published the certified financial results recording ₹203 Crore PAT and ₹410 Crore EBITDA. No higher earnings figure was ever published or filed.",
            "numerical_reconciliation": [
                {
                    "metric": "Quarterly Net Profit (PAT)",
                    "claimed": "₹850 Crore",
                    "official": "₹203 Crore",
                    "discrepancy_factor": "4.18x Fabrication (+318% Discrepancy)",
                    "is_mismatch": True
                }
            ],
            "red_flags": [
                "Fabricated quarterly PAT figure contradicting certified auditor report",
                "Promising immediate 50% weekly stock rally"
            ],
            "investor_protection": {
                "risk_level": "HIGH_RISK",
                "warning": "Never trade earnings momentum without cross-checking the actual PDF submitted on NSE/BSE corporate results section.",
                "applicable_regulations": ["SEBI LODR Regulation 33", "Companies Act 2013 Section 129"],
                "official_redressal_url": "https://scores.sebi.gov.in"
            }
        }
    },
    {
        "id": "case-05-awl-subsidy-absence",
        "category": "ABSENCE_OF_DISCLOSURE",
        "input": "AWL Agri Business Ltd secretly approved for massive ₹15,000 Crore special government production-linked edible oil subsidy grant by Ministry of Agriculture!",
        "target_entity": "AWL Agri Business Ltd (NSE: AWL | BSE: 543458)",
        "output": {
            "verdict": "UNSUBSTANTIATED_SPECULATION",
            "headline": "Unsubstantiated: Zero Authoritative Regulatory Records",
            "the_reality": "No official corporate disclosure, exchange filing on BSE/NSE, or Government gazette notification exists confirming any ₹15,000 Crore preferential subsidy for AWL Agri Business Ltd.",
            "basis_of_denial": "SEBI LODR Regulation 30 Continuous Mandatory Disclosure Window (24 hours). Listed entities must disclose all material subsidies or financial events within 24 hours. The complete absence of an exchange filing legally classifies this as unverified social speculation.",
            "timeline_reality": "During this period, the company's only public submissions on BSE/NSE were routine compliance filings; no material government grant or multi-thousand crore subsidy agreement was ever submitted or approved.",
            "numerical_reconciliation": [
                {
                    "metric": "Government Subsidy / Grant",
                    "claimed": "₹15,000 Crore",
                    "official": "₹0 (Zero Regulatory Record)",
                    "discrepancy_factor": "Unsubstantiated Speculation",
                    "is_mismatch": True
                }
            ],
            "red_flags": [
                "Unsubstantiated government subsidy claim with zero official exchange records",
                "Attempt to trigger buying around agricultural commodity stocks"
            ],
            "investor_protection": {
                "risk_level": "HIGH_RISK",
                "warning": "Absence of statutory corporate disclosures under Regulation 30 confirms that this claim has no legal standing.",
                "applicable_regulations": ["SEBI LODR Regulation 30"],
                "official_redressal_url": "https://scores.sebi.gov.in"
            }
        }
    },
    {
        "id": "case-06-tatapower-ev-network",
        "category": "VERIFIED_OPERATIONAL_SCALE",
        "input": "Tata Power EZ Charge network scales beyond 100,000 EV charging touchpoints across residential, commercial, and highway corridors in India.",
        "target_entity": "Tata Power Company Ltd (NSE: TATAPOWER | BSE: 500400)",
        "output": {
            "verdict": "CONFIRMED_TRUE",
            "headline": "Confirmed: Tata Power EZ Charge Crosses 100,000 Charging Points",
            "the_reality": "Tata Power operates India’s largest EV charging ecosystem under Tata Power EZ Charge, exceeding 100,000 public, semi-public, captive, and home charging installations across 530+ cities and national highway corridors.",
            "basis_of_denial": "N/A — Operational milestone is fully substantiated by statutory investor presentations and annual operational disclosures filed with stock exchanges.",
            "timeline_reality": "Tata Power formally submitted investor presentations to BSE and NSE confirming the deployment of over 100,000 EV green charging touchpoints.",
            "numerical_reconciliation": [
                {
                    "metric": "EV Charging Points",
                    "claimed": "100,000+ EV charging touchpoints",
                    "official": "100,000+ points deployed",
                    "discrepancy_factor": "Exact Match (100% Verified)",
                    "is_mismatch": False
                }
            ],
            "red_flags": [],
            "investor_protection": {
                "risk_level": "LOW_RISK",
                "warning": "Statutory operational update verified against official investor disclosures.",
                "applicable_regulations": ["SEBI LODR Regulation 30"],
                "official_redressal_url": "https://scores.sebi.gov.in"
            }
        }
    },
    {
        "id": "case-07-zomato-blinkit-deal",
        "category": "VERIFIED_ACQUISITION",
        "input": "Zomato announces all-stock acquisition of quick-commerce platform Blinkit for ₹4,447 Crore.",
        "target_entity": "Zomato Ltd (NSE: ZOMATO | BSE: 543320)",
        "output": {
            "verdict": "CONFIRMED_TRUE",
            "headline": "Confirmed: Fully Verified by Regulatory Filings",
            "the_reality": "Zomato officially acquired quick-commerce platform Blinkit for an aggregate consideration of ₹4,447 Crore in an all-stock transaction approved by the board of directors and shareholders.",
            "basis_of_denial": "N/A — Fully substantiated by authentic exchange filings submitted under SEBI LODR Regulation 30.",
            "timeline_reality": "The company formally submitted continuous corporate disclosures to BSE and NSE confirming the execution of share purchase agreements and statutory consideration.",
            "numerical_reconciliation": [
                {
                    "metric": "Transaction / Deal Value",
                    "claimed": "₹4,447 Crore",
                    "official": "₹4,447 Crore",
                    "discrepancy_factor": "Exact Match (100% Verified)",
                    "is_mismatch": False
                }
            ],
            "red_flags": [],
            "investor_protection": {
                "risk_level": "LOW_RISK",
                "warning": "Verified corporate M&A disclosure grounded in statutory filings.",
                "applicable_regulations": ["SEBI LODR Regulation 30"],
                "official_redressal_url": "https://scores.sebi.gov.in"
            }
        }
    },
    {
        "id": "case-08-guaranteed-return-whatsapp-scam",
        "category": "MARKET_MANIPULATION",
        "input": "100% GUARANTEED PROFIT! Join our VIP Telegram channel for daily 10% profit calls on penny stocks. No loss guarantee registered with SEBI!",
        "target_entity": "Unregistered Financial Intermediary / Generic Penny Stock Scheme",
        "output": {
            "verdict": "DEBUNKED_FAKE",
            "headline": "Debunked: Illegal Guaranteed Return Scheme in Direct Violation of SEBI Act",
            "the_reality": "SEBI does not register, authorize, or permit any entity to offer 'guaranteed returns' or 'risk-free profit' schemes in equity markets. This is a classic fraudulent tip syndicate designed to manipulate micro-cap penny stocks.",
            "basis_of_denial": "Section 12A of the SEBI Act, 1992 and SEBI (Prohibition of Fraudulent and Unfair Trade Practices) Regulations, 2003 strictly prohibit promising guaranteed returns and operating unauthorized advisory services.",
            "timeline_reality": "SEBI continuously issues enforcement orders and caution notices against Telegram/WhatsApp pump-and-dump syndicates operating fraudulent 'VIP guaranteed return' groups.",
            "numerical_reconciliation": [
                {
                    "metric": "Guaranteed Return",
                    "claimed": "10% daily guaranteed / 100% profit",
                    "official": "0% (Prohibited under law)",
                    "discrepancy_factor": "Illegal & Fraudulent",
                    "is_mismatch": True
                }
            ],
            "red_flags": [
                "Guaranteed returns promise (strictly illegal under Indian securities law)",
                "Unregistered Telegram VIP group solicitation",
                "Penny stock pump-and-dump orchestration"
            ],
            "investor_protection": {
                "risk_level": "CRITICAL_RISK",
                "warning": "NEVER invest money in schemes promising guaranteed stock returns. Report immediate fraudulent tip channels to SEBI.",
                "applicable_regulations": [
                    "Section 12A of SEBI Act 1992",
                    "SEBI (PFUTP) Regulations 2003",
                    "SEBI (Investment Advisers) Regulations 2013"
                ],
                "official_redressal_url": "https://scores.sebi.gov.in"
            }
        }
    }
]


def format_chatml_example(case: Dict[str, Any]) -> Dict[str, Any]:
    """Convert a canonical test case into ChatML training format."""
    out = case["output"]
    formatted_response = f"""**VERDICT:** {out['verdict']} - {out['headline']}

**THE REALITY:**
{out['the_reality']}

**BASIS OF DENIAL:**
{out['basis_of_denial']}

**WHAT ACTUALLY HAPPENED IN THIS TIMELINE:**
{out['timeline_reality']}

**NUMERICAL RECONCILIATION:**
{json.dumps(out['numerical_reconciliation'], indent=2)}

**INVESTOR PROTECTION & REDRESSAL:**
• Risk Level: {out['investor_protection']['risk_level']}
• Warning: {out['investor_protection']['warning']}
• Applicable Regulations: {', '.join(out['investor_protection']['applicable_regulations'])}
• Official Redressal: {out['investor_protection']['official_redressal_url']}"""

    return {
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": f"Investigate the following claim regarding {case['target_entity']}:\n\"{case['input']}\""},
            {"role": "assistant", "content": formatted_response}
        ]
    }


def generate_training_datasets(output_dir: str):
    os.makedirs(output_dir, exist_ok=True)
    train_file = os.path.join(output_dir, "train.jsonl")
    val_file = os.path.join(output_dir, "val.jsonl")

    formatted_samples = [format_chatml_example(c) for c in CANONICAL_CASES]
    
    # Split: 80% train, 20% validation
    split_idx = max(1, int(len(formatted_samples) * 0.8))
    train_data = formatted_samples[:split_idx]
    val_data = formatted_samples[split_idx:]

    with open(train_file, "w", encoding="utf-8") as f:
        for s in train_data:
            f.write(json.dumps(s) + "\n")

    with open(val_file, "w", encoding="utf-8") as f:
        for s in val_data:
            f.write(json.dumps(s) + "\n")

    print(f"Generated {len(train_data)} training samples in {train_file}")
    print(f"Generated {len(val_data)} validation samples in {val_file}")


if __name__ == "__main__":
    generate_training_datasets("training/dataset")
