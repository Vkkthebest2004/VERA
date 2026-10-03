import os
import json

def generate_markdown(data, output_path):
    lines = []
    c_name = data["company_name"]
    ticker = data["ticker"]
    website = data["website"]
    
    lines.append(f"# 📊 {c_name} ({ticker}) — Complete Financial & Corporate Profile")
    lines.append(f"\n> **Website:** [{website}]({website})  ")
    lines.append("> **Statutory Regulatory Filing Source:** Screener.in / BSE India / NSE India  ")
    lines.append("\n---\n")

    lines.append("## 🏢 1. Company Overview & Business Model\n")
    lines.append(data["about"])
    lines.append("\n\n---\n")

    lines.append("## 📈 2. Current Market Valuation & Key Ratios\n")
    lines.append("| Metric | Value |")
    lines.append("|---|---|")
    for k, v in data["key_ratios"].items():
        lines.append(f"| **{k}** | {v} |")
    lines.append("\n---\n")

    # Quarterly Results
    q = data.get("quarterly_results")
    if q and q.get("periods"):
        lines.append("## 🗓️ 3. Quarterly Financial Performance (Past Quarters)\n")
        lines.append("*All monetary figures in ₹ Crores (Consolidated)*\n")
        periods = q["periods"]
        header_cols = ["Metric"] + periods[-6:]
        lines.append("| " + " | ".join(header_cols) + " |")
        lines.append("|" + "|".join(["---"] * len(header_cols)) + "|")
        for m, vals in q["metrics"].items():
            recent_vals = vals[-6:]
            lines.append(f"| **{m}** | " + " | ".join(recent_vals) + " |")
        lines.append("\n---\n")

    # Profit & Loss
    pnl = data.get("profit_and_loss")
    if pnl and pnl.get("periods"):
        lines.append("## 📑 4. Annual Profit & Loss Trajectory (10-Year Trend)\n")
        lines.append("*All monetary figures in ₹ Crores (Consolidated)*\n")
        periods = pnl["periods"]
        header_cols = ["Metric"] + periods[-7:]
        lines.append("| " + " | ".join(header_cols) + " |")
        lines.append("|" + "|".join(["---"] * len(header_cols)) + "|")
        for m, vals in pnl["metrics"].items():
            recent_vals = vals[-7:]
            lines.append(f"| **{m}** | " + " | ".join(recent_vals) + " |")
        lines.append("\n---\n")

    # Balance Sheet
    bs = data.get("balance_sheet")
    if bs and bs.get("periods"):
        lines.append("## 🏛️ 5. Consolidated Balance Sheet\n")
        lines.append("*All monetary figures in ₹ Crores (Consolidated)*\n")
        periods = bs["periods"]
        header_cols = ["Balance Sheet Item"] + periods[-6:]
        lines.append("| " + " | ".join(header_cols) + " |")
        lines.append("|" + "|".join(["---"] * len(header_cols)) + "|")
        for m, vals in bs["metrics"].items():
            recent_vals = vals[-6:]
            lines.append(f"| **{m}** | " + " | ".join(recent_vals) + " |")
        lines.append("\n---\n")

    # Cash Flow
    cf = data.get("cash_flow")
    if cf and cf.get("periods"):
        lines.append("## 💵 6. Cash Flow Analysis\n")
        lines.append("*All monetary figures in ₹ Crores (Consolidated)*\n")
        periods = cf["periods"]
        header_cols = ["Cash Flow Activity"] + periods[-6:]
        lines.append("| " + " | ".join(header_cols) + " |")
        lines.append("|" + "|".join(["---"] * len(header_cols)) + "|")
        for m, vals in cf["metrics"].items():
            recent_vals = vals[-6:]
            lines.append(f"| **{m}** | " + " | ".join(recent_vals) + " |")
        lines.append("\n---\n")

    # Shareholding Pattern
    sh = data.get("shareholding_pattern")
    if sh and sh.get("periods"):
        lines.append("## 👥 7. Shareholding Pattern\n")
        periods = sh["periods"]
        header_cols = ["Shareholder Class"] + periods[-6:]
        lines.append("| " + " | ".join(header_cols) + " |")
        lines.append("|" + "|".join(["---"] * len(header_cols)) + "|")
        for m, vals in sh["metrics"].items():
            recent_vals = vals[-6:]
            lines.append(f"| **{m}** | " + " | ".join(recent_vals) + " |")
        lines.append("\n---\n")

    # Announcements
    anns = data.get("recent_announcements", [])
    if anns:
        lines.append("## 📢 8. Recent Statutory & Regulatory Announcements (SEBI Reg 30)\n")
        for i, a in enumerate(anns[:8], 1):
            title = a["title"]
            url = a["url"]
            lines.append(f"{i}. [{title}]({url})")
        lines.append("\n")

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))
    print(f"Generated {output_path}")

if __name__ == "__main__":
    with open("data/financials/reliance_industries.json", "r") as f:
        rel = json.load(f)
    with open("data/financials/tata_power.json", "r") as f:
        tp = json.load(f)

    generate_markdown(rel, "data/financials/RELIANCE_INDUSTRIES_FINANCIAL_PROFILE.md")
    generate_markdown(tp, "data/financials/TATA_POWER_FINANCIAL_PROFILE.md")
