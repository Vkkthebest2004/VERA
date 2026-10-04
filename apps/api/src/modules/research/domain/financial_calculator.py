"""
Deterministic Financial Calculation Engine for VERA.
Enforces Section 29 (Calculations Must Be Deterministic) and Section 13 (Never Mix Periods).
Handles mathematical computation in code, not the LLM.
"""

from typing import Dict, Any, Optional, Tuple


class FinancialCalculator:
    """
    Deterministic mathematical engine for derived metrics, growth rates,
    margins, balance sheet leverage, and capital efficiency ratios.
    """

    @staticmethod
    def growth_rate_pct(current: float, previous: float) -> Optional[float]:
        """Calculates percentage growth rate: ((current - previous) / abs(previous)) * 100"""
        if previous is None or current is None or previous == 0:
            return None
        return round(((current - previous) / abs(previous)) * 100.0, 2)

    @staticmethod
    def margin_pct(numerator: float, denominator: float) -> Optional[float]:
        """Calculates margin percentage: (numerator / denominator) * 100"""
        if denominator is None or numerator is None or denominator == 0:
            return None
        return round((numerator / denominator) * 100.0, 2)

    @staticmethod
    def net_debt(total_borrowings: float, cash_and_liquid_investments: float) -> float:
        """Net Debt = Total Borrowings - Cash & Liquid Investments"""
        return round(total_borrowings - (cash_and_liquid_investments or 0.0), 2)

    @staticmethod
    def net_debt_to_ebitda(net_debt: float, annual_ebitda: float) -> Optional[float]:
        """Net Debt / EBITDA leverage multiple"""
        if not annual_ebitda or annual_ebitda <= 0:
            return None
        return round(net_debt / annual_ebitda, 2)

    @staticmethod
    def interest_coverage(ebit: float, interest_expense: float) -> Optional[float]:
        """Interest Coverage = Operating Profit (EBIT) / Annual Interest Expense"""
        if not interest_expense or interest_expense <= 0:
            return None
        return round(ebit / interest_expense, 2)

    @staticmethod
    def free_cash_flow(operating_cash_flow: float, capex: float) -> float:
        """
        Free Cash Flow = Cash from Operations - Capital Expenditure (CapEx).
        If capex is given as negative outflow, adds or subtracts correctly.
        """
        abs_capex = abs(capex) if capex is not None else 0.0
        return round(operating_cash_flow - abs_capex, 2)

    @staticmethod
    def fcf_conversion_pct(free_cash_flow: float, net_profit: float) -> Optional[float]:
        """FCF Conversion % = (Free Cash Flow / PAT) * 100"""
        if not net_profit or net_profit <= 0:
            return None
        return round((free_cash_flow / net_profit) * 100.0, 2)

    @staticmethod
    def price_to_earnings(current_market_price: float, earnings_per_share: float) -> Optional[float]:
        """P/E Multiple = CMP / EPS"""
        if not earnings_per_share or earnings_per_share <= 0:
            return None
        return round(current_market_price / earnings_per_share, 2)

    @staticmethod
    def roce_pct(ebit: float, total_equity: float, total_debt: float) -> Optional[float]:
        """ROCE = EBIT / (Equity + Debt) * 100"""
        capital_employed = total_equity + total_debt
        if capital_employed <= 0:
            return None
        return round((ebit / capital_employed) * 100.0, 2)

    @staticmethod
    def roe_pct(net_profit: float, shareholders_equity: float) -> Optional[float]:
        """ROE = Net Profit / Equity * 100"""
        if not shareholders_equity or shareholders_equity <= 0:
            return None
        return round((net_profit / shareholders_equity) * 100.0, 2)

    @staticmethod
    def validate_period_comparability(period_a_type: str, period_b_type: str) -> Tuple[bool, str]:
        """
        Enforces Section 13: Never mix annual figures with quarterly figures
        without explicit validation and warnings.
        """
        norm_a = period_a_type.strip().lower()
        norm_b = period_b_type.strip().lower()
        if norm_a != norm_b:
            return (
                False,
                f"Incompatible financial comparison: '{norm_a}' cannot be compared directly with '{norm_b}'."
            )
        return (True, "Periods are comparable.")
