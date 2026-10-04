# 🏛️ VERA: Qwen 3 4B Financial Domain Training & Adaptation Specification

## 1. Executive Overview

This specification establishes the end-to-end training, fine-tuning, and operational deployment of the **Qwen 3 / Qwen 2.5 (3B–4B class)** model adapted specifically for **VERA** (*Verifiable Evidence & Regulatory Assertion Platform*).

The objective is to equip Qwen to handle **complex, adversarial, and deceptive financial scenarios**—including viral WhatsApp forwards, inflated government tenders, fabricated concessions, pump-and-dump tips, and subtle quarterly earnings manipulations—while **strictly enforcing VERA's Five Architectural Invariants** under Indian Securities Law.

---

## 2. Strict Enforcement of the 5 VERA Invariants

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                VERA INVARIANT SYSTEM                                   │
├────────────────────────────────────────────────────────────────────────────────────────┤
│  1. Evidence-First, Not LLM-First  ➔ LLM is never the ungrounded source of truth.     │
│  2. Coordinate Provenance          ➔ Every citation has document title, URL & quote.  │
│  3. Absence != Proof of Falsehood  ➔ SEBI LODR Reg 30 24h window -> UNSUBSTANTIATED.   │
│  4. Deterministic Math             ➔ Exact inflation ratios (e.g. 10x / 900% inflation)│
│  5. Categorical Verdicts           ➔ CONFIRMED, MISLEADING, DEBUNKED, UNSUBSTANTIATED. │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### Invariant 1: Evidence-First, Not LLM-First
The model never generates ungrounded financial claims. It acts strictly as an extraction, reasoning, and reconciliation engine over authoritative corporate disclosures submitted to **BSE India**, **NSE India**, and the **SEBI enforcement gazette**.

### Invariant 2: Strong Provenance & Coordinate Traceability
Every finding must cite the exact statutory instrument:
- Document title (e.g., `Tata Power Company Ltd — Regulation 30 Outcome Disclosure (SJVN)`).
- Regulatory framework (e.g., `SEBI LODR Regulation 30` or `Regulation 33`).
- Verbatim quote with coordinate fidelity.

### Invariant 3: Absence of Evidence $\neq$ Proof of Falsehood
In securities law, the absence of an exchange filing within the **SEBI LODR Regulation 30 mandatory 24-hour continuous disclosure window** legally classifies a claim as **`UNSUBSTANTIATED_SPECULATION`** (rather than declaring it "false" without legal basis).

### Invariant 4: Deterministic Numerical Reasoning
Currency figures in Indian notation (₹, Crores, Lakhs, Billions, Millions) are normalized canonically:
$$\text{Ratio} = \frac{\text{Claimed Value}}{\text{Official Value}}$$
- $\text{Ratio} > 1.20 \implies$ Categorized as `MISLEADING_OR_EXAGGERATED` with exact percentage calculation (e.g., *10x Exaggeration / Inflated by 900%*).
- Certified auditor PAT vs claimed numbers $\implies$ Exact basis point and percentage discrepancy.

### Invariant 5: Uncertainty-Aware Categorical Verdicts
Every inquiry resolves unambiguously into one of four verdicts:
1. 🟢 **`CONFIRMED_TRUE`**: Fully substantiated by statutory filings.
2. 🟡 **`MISLEADING_OR_EXAGGERATED`**: Real underlying project, but metrics inflated to induce retail FOMO.
3. 🔴 **`DEBUNKED_FAKE`**: Contradicted by certified auditor reports, statutory filings, or formal corporate denials.
4. ⚪ **`UNSUBSTANTIATED_SPECULATION`**: Complete absence of mandatory exchange filings or regulatory trail.

---

## 3. Complex Financial Scenarios & Training Matrix

| Scenario Type | Claim Example | Official Reality | Trained Verdict | Statutory Basis |
| :--- | :--- | :--- | :--- | :--- |
| **10x Metric Inflation** | Tata Power signed secret ₹12,500 Cr Solar deal with SJVN! Guaranteed upper circuit | Contract exists, but LOA value is ₹1,250 Cr (not ₹12,500 Cr) | `MISLEADING_OR_EXAGGERATED` | SEBI LODR Reg 30 (10x inflation / 900% expansion) |
| **Fabricated International Pact** | Saudi Aramco signed ₹2,50,000 Cr crude concession with Reliance | Zero Reg 30 filing; discussions formally withdrawn in Nov 2021 | `DEBUNKED_FAKE` | SEBI LODR Reg 30 (Continuous Disclosure) |
| **Audited Earnings Discrepancy** | Suzlon reports blockbuster Q3 net profit of ₹850 Crore (+300% YoY) | Certified auditor report shows Net Profit is ₹203 Crore (+160% YoY) | `DEBUNKED_FAKE` | Section 129 Companies Act & Reg 33 |
| **Genuine M&A Disclosure** | Reliance Retail acquires 51% stake in Ed-a-Mamma for approx ₹350 Cr | Verified definitive agreement filed on BSE/NSE archives | `CONFIRMED_TRUE` | SEBI LODR Reg 30 definitive documentation |
| **Absence of Mandatory Filing** | AWL Agri Business approved for ₹15,000 Cr edible oil government grant | Zero exchange disclosures or gazette notification exists | `UNSUBSTANTIATED_SPECULATION` | Reg 30 24h continuous disclosure window |
| **Market Manipulation Scheme** | Guaranteed 100% profit! Join VIP Telegram for daily 10% penny stock calls | Guaranteed returns are strictly illegal under Indian law | `DEBUNKED_FAKE` | Section 12A SEBI Act & SEBI PFUTP 2003 |

---

## 4. Training Artifacts & File Structure

```
training/
├── Modelfile.qwen-vera           # Custom Ollama Modelfile with 5 Invariants & temperature 0.1
├── build_ollama_qwen.sh          # Automated compilation & registration script
├── dataset_generator.py          # Generator for canonical complex training pairs
├── train_qwen_vera.py            # LoRA/QLoRA PyTorch SFT fine-tuning script
└── dataset/
    ├── train.jsonl               # ChatML format training dataset
    └── val.jsonl                 # ChatML format validation dataset

apps/api/src/modules/research/application/
└── qwen_reasoning_pipeline.py    # Backend reasoning pipeline connected to FastAPI

scripts/
└── evaluate_qwen_vera.py         # 6-case complex test suite (100% pass verification)
```

---

## 5. How to Run Training & Verification

### Option A: Compile & Run with Ollama
```bash
# 1. Build and register the custom Qwen VERA model
bash training/build_ollama_qwen.sh

# 2. Test direct inference
ollama run qwen-vera:4b "Tata Power signed secret 12,500 Cr deal! Guaranteed 20% upper circuit"
```

### Option B: Run Full LoRA Fine-Tuning (GPU / Apple Silicon)
```bash
# Generate datasets
python3 training/dataset_generator.py

# Run LoRA training script
python3 training/train_qwen_vera.py --model Qwen/Qwen2.5-3B-Instruct --epochs 3
```

### Option C: Run the Complex Situations Evaluation Suite
```bash
python3 scripts/evaluate_qwen_vera.py
```

Result:
```
================================================================================
EVALUATION RESULTS: 6/6 tests passed (100% success rate)
All VERA Invariant Principles successfully verified on Qwen reasoning engine.
================================================================================
```
