// ─────────────────────────────────────────────────────────────────────────────
// VERA DETERMINISTIC FINANCIAL ANALYSIS ENGINE
// Pure, deterministic financial calculations — zero hallucinated math
// ─────────────────────────────────────────────────────────────────────────────

export interface FinancialYearData {
  period: string; // 'FY16', 'FY17', ... 'FY26', 'TTM'
  year: number;
  revenueCr: number;
  expensesCr: number;
  ebitdaCr: number;
  depreciationCr: number;
  interestCr: number;
  taxCr: number;
  patCr: number;
  eps: number;
  ocfCr: number; // Operating cash flow
  capexCr: number; // Capital expenditure
  totalDebtCr: number;
  cashCr: number;
  equityCr: number;
  reservesCr: number;
  fixedAssetsCr: number;
  cwipCr: number;
  investmentsCr: number;
  debtorDays: number;
  inventoryDays: number;
  payableDays: number;
  peRatio: number;
  marketCapCr: number;
}

export interface ComputedMetrics {
  ebitdaMarginPct: number;
  patMarginPct: number;
  freeCashFlowCr: number;
  netDebtCr: number;
  debtToEbitda: number;
  interestCoverageRatio: number;
  capitalEmployedCr: number;
  rocePct: number;
  roePct: number;
  cashConversionCycleDays: number;
  fcfConversionPct: number; // FCF / PAT %
}

/**
 * Computes all derived financial ratios deterministically from raw accounting line items.
 */
export function computeFinancialMetrics(raw: FinancialYearData): ComputedMetrics {
  const ebitdaMarginPct = raw.revenueCr > 0 ? (raw.ebitdaCr / raw.revenueCr) * 100 : 0;
  const patMarginPct = raw.revenueCr > 0 ? (raw.patCr / raw.revenueCr) * 100 : 0;
  const freeCashFlowCr = raw.ocfCr - raw.capexCr;
  const netDebtCr = Math.max(0, raw.totalDebtCr - raw.cashCr);
  const debtToEbitda = raw.ebitdaCr > 0 ? raw.totalDebtCr / raw.ebitdaCr : 0;
  const ebit = raw.ebitdaCr - raw.depreciationCr;
  const interestCoverageRatio = raw.interestCr > 0 ? ebit / raw.interestCr : 99.9;
  const capitalEmployedCr = raw.equityCr + raw.reservesCr + raw.totalDebtCr;
  const rocePct = capitalEmployedCr > 0 ? (ebit / capitalEmployedCr) * 100 : 0;
  const netWorthCr = raw.equityCr + raw.reservesCr;
  const roePct = netWorthCr > 0 ? (raw.patCr / netWorthCr) * 100 : 0;
  const cashConversionCycleDays = raw.debtorDays + raw.inventoryDays - raw.payableDays;
  const fcfConversionPct = raw.patCr > 0 ? (freeCashFlowCr / raw.patCr) * 100 : 0;

  return {
    ebitdaMarginPct: Number(ebitdaMarginPct.toFixed(1)),
    patMarginPct: Number(patMarginPct.toFixed(1)),
    freeCashFlowCr: Math.round(freeCashFlowCr),
    netDebtCr: Math.round(netDebtCr),
    debtToEbitda: Number(debtToEbitda.toFixed(2)),
    interestCoverageRatio: Number(interestCoverageRatio.toFixed(1)),
    capitalEmployedCr: Math.round(capitalEmployedCr),
    rocePct: Number(rocePct.toFixed(1)),
    roePct: Number(roePct.toFixed(1)),
    cashConversionCycleDays: Math.round(cashConversionCycleDays),
    fcfConversionPct: Number(fcfConversionPct.toFixed(1)),
  };
}

/**
 * Calculates compound annual growth rate (CAGR).
 */
export function calculateCAGR(startValue: number, endValue: number, years: number): number {
  if (startValue <= 0 || endValue <= 0 || years <= 0) return 0;
  const cagr = (Math.pow(endValue / startValue, 1 / years) - 1) * 100;
  return Number(cagr.toFixed(1));
}

/**
 * Calculates year-on-year percentage change.
 */
export function calculateYoY(current: number, previous: number): number {
  if (previous === 0) return 0;
  const change = ((current - previous) / Math.abs(previous)) * 100;
  return Number(change.toFixed(1));
}

export interface DivergenceResult {
  hasDivergence: boolean;
  patGrowthPct: number;
  ocfGrowthPct: number;
  explanation: string;
  divergenceSeverity: 'NONE' | 'MODERATE' | 'CRITICAL';
  retailTakeaway: string;
}

/**
 * Signature VERA Audit: Detects accounting divergence between Reported PAT and Cash from Operations.
 */
export function detectProfitCashDivergence(
  current: FinancialYearData,
  previous: FinancialYearData
): DivergenceResult {
  const patGrowth = calculateYoY(current.patCr, previous.patCr);
  const ocfGrowth = calculateYoY(current.ocfCr, previous.ocfCr);

  // Divergence occurs if PAT increased while Cash Flow decreased, or PAT grew > 25% faster than OCF
  const isDivergent = (patGrowth > 0 && ocfGrowth < 0) || (patGrowth > 15 && ocfGrowth < patGrowth - 25);

  let severity: DivergenceResult['divergenceSeverity'] = 'NONE';
  let explanation = `Both Reported Profit (${patGrowth > 0 ? '+' : ''}${patGrowth}%) and Cash Flow (${ocfGrowth > 0 ? '+' : ''}${ocfGrowth}%) trended in harmony.`;
  let retailTakeaway = 'Profits reported on the income statement are backed by actual cash inflows into the bank account.';

  if (patGrowth > 0 && ocfGrowth < -10) {
    severity = 'CRITICAL';
    explanation = `DIVERGENCE DETECTED: Reported PAT increased by ${patGrowth}%, yet actual Cash Flow from Operations declined by ${Math.abs(ocfGrowth)}%.`;
    retailTakeaway = 'Warning: The company booked paper accounting profits, but cash did not enter the bank. Often driven by rising unpaid customer bills (debtors) or unsold inventory.';
  } else if (patGrowth > 0 && ocfGrowth < 0) {
    severity = 'MODERATE';
    explanation = `MODERATE DIVERGENCE: PAT grew by ${patGrowth}%, while Operating Cash Flow dropped by ${Math.abs(ocfGrowth)}%.`;
    retailTakeaway = 'Cash collection trailed accounting earnings this fiscal cycle. Monitor working capital cycle in subsequent quarters.';
  } else if (patGrowth > 25 && ocfGrowth < patGrowth - 20) {
    severity = 'MODERATE';
    explanation = `EARNINGS QUALITY GAP: PAT expanded by ${patGrowth}%, but Operating Cash Flow only grew by ${ocfGrowth}%.`;
    retailTakeaway = 'Cash conversion speed slowed compared to headline net profit expansion.';
  }

  return {
    hasDivergence: isDivergent,
    patGrowthPct: patGrowth,
    ocfGrowthPct: ocfGrowth,
    explanation,
    divergenceSeverity: severity,
    retailTakeaway,
  };
}

export interface VarianceComparisonItem {
  metric: string;
  label: string;
  fromValue: number;
  toValue: number;
  displayFrom: string;
  displayTo: string;
  changePct: number;
  changeAbs: number;
  isPositiveForCompany: boolean;
  plainEnglishExplanation: string;
}

/**
 * "What Changed?" Comparator: Produces verified line-by-line delta between any two years.
 */
export function comparePeriods(
  fromData: FinancialYearData,
  toData: FinancialYearData
): {
  fromPeriod: string;
  toPeriod: string;
  comparisons: VarianceComparisonItem[];
  headlineSummary: string;
} {
  const fromMetrics = computeFinancialMetrics(fromData);
  const toMetrics = computeFinancialMetrics(toData);

  const items: VarianceComparisonItem[] = [
    {
      metric: 'revenue',
      label: 'Revenue (Sales)',
      fromValue: fromData.revenueCr,
      toValue: toData.revenueCr,
      displayFrom: `₹${fromData.revenueCr.toLocaleString('en-IN')} Cr`,
      displayTo: `₹${toData.revenueCr.toLocaleString('en-IN')} Cr`,
      changePct: calculateYoY(toData.revenueCr, fromData.revenueCr),
      changeAbs: toData.revenueCr - fromData.revenueCr,
      isPositiveForCompany: toData.revenueCr >= fromData.revenueCr,
      plainEnglishExplanation: 'Total money received from customers across all commercial segments.',
    },
    {
      metric: 'ebitda',
      label: 'Operating Profit (EBITDA)',
      fromValue: fromData.ebitdaCr,
      toValue: toData.ebitdaCr,
      displayFrom: `₹${fromData.ebitdaCr.toLocaleString('en-IN')} Cr`,
      displayTo: `₹${toData.ebitdaCr.toLocaleString('en-IN')} Cr`,
      changePct: calculateYoY(toData.ebitdaCr, fromData.ebitdaCr),
      changeAbs: toData.ebitdaCr - fromData.ebitdaCr,
      isPositiveForCompany: toData.ebitdaCr >= fromData.ebitdaCr,
      plainEnglishExplanation: 'Core operational earnings before deducting interest, taxes, and asset depreciation.',
    },
    {
      metric: 'pat',
      label: 'Net Profit (PAT)',
      fromValue: fromData.patCr,
      toValue: toData.patCr,
      displayFrom: `₹${fromData.patCr.toLocaleString('en-IN')} Cr`,
      displayTo: `₹${toData.patCr.toLocaleString('en-IN')} Cr`,
      changePct: calculateYoY(toData.patCr, fromData.patCr),
      changeAbs: toData.patCr - fromData.patCr,
      isPositiveForCompany: toData.patCr >= fromData.patCr,
      plainEnglishExplanation: 'Bottom-line profit remaining after paying all operating expenses, loans, and government taxes.',
    },
    {
      metric: 'ocf',
      label: 'Operating Cash Flow',
      fromValue: fromData.ocfCr,
      toValue: toData.ocfCr,
      displayFrom: `₹${fromData.ocfCr.toLocaleString('en-IN')} Cr`,
      displayTo: `₹${toData.ocfCr.toLocaleString('en-IN')} Cr`,
      changePct: calculateYoY(toData.ocfCr, fromData.ocfCr),
      changeAbs: toData.ocfCr - fromData.ocfCr,
      isPositiveForCompany: toData.ocfCr >= fromData.ocfCr,
      plainEnglishExplanation: 'Real cash deposited into the company bank accounts from business activities.',
    },
    {
      metric: 'fcf',
      label: 'Free Cash Flow (FCF)',
      fromValue: fromMetrics.freeCashFlowCr,
      toValue: toMetrics.freeCashFlowCr,
      displayFrom: `₹${fromMetrics.freeCashFlowCr.toLocaleString('en-IN')} Cr`,
      displayTo: `₹${toMetrics.freeCashFlowCr.toLocaleString('en-IN')} Cr`,
      changePct: calculateYoY(toMetrics.freeCashFlowCr, fromMetrics.freeCashFlowCr),
      changeAbs: toMetrics.freeCashFlowCr - fromMetrics.freeCashFlowCr,
      isPositiveForCompany: toMetrics.freeCashFlowCr >= fromMetrics.freeCashFlowCr,
      plainEnglishExplanation: 'Surplus cash remaining after funding all new factories, towers, and infrastructure CapEx.',
    },
    {
      metric: 'debt',
      label: 'Total Borrowings',
      fromValue: fromData.totalDebtCr,
      toValue: toData.totalDebtCr,
      displayFrom: `₹${fromData.totalDebtCr.toLocaleString('en-IN')} Cr`,
      displayTo: `₹${toData.totalDebtCr.toLocaleString('en-IN')} Cr`,
      changePct: calculateYoY(toData.totalDebtCr, fromData.totalDebtCr),
      changeAbs: toData.totalDebtCr - fromData.totalDebtCr,
      isPositiveForCompany: toData.totalDebtCr <= fromData.totalDebtCr,
      plainEnglishExplanation: 'Total bank loans and debt debentures owed by the conglomerate.',
    },
    {
      metric: 'roce',
      label: 'ROCE (Capital Efficiency)',
      fromValue: fromMetrics.rocePct,
      toValue: toMetrics.rocePct,
      displayFrom: `${fromMetrics.rocePct}%`,
      displayTo: `${toMetrics.rocePct}%`,
      changePct: Number((toMetrics.rocePct - fromMetrics.rocePct).toFixed(1)),
      changeAbs: toMetrics.rocePct - fromMetrics.rocePct,
      isPositiveForCompany: toMetrics.rocePct >= fromMetrics.rocePct,
      plainEnglishExplanation: `Return generated for every ₹100 of total capital deployed in the business (₹${toMetrics.rocePct} earned).`,
    },
  ];

  const revYoY = calculateYoY(toData.revenueCr, fromData.revenueCr);
  const patYoY = calculateYoY(toData.patCr, fromData.patCr);
  const headlineSummary = `From ${fromData.period} to ${toData.period}, revenue moved ${revYoY > 0 ? '+' : ''}${revYoY}% and bottom-line PAT changed by ${patYoY > 0 ? '+' : ''}${patYoY}%.`;

  return {
    fromPeriod: fromData.period,
    toPeriod: toData.period,
    comparisons: items,
    headlineSummary,
  };
}
