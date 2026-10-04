import { ChartCommand, ChartCommandSchema } from './chartDsl';
import { VisualizationStoreState } from '@/state/visualizationStore';
import { detectProfitCashDivergence, calculateYoY, computeFinancialMetrics } from '../financial/financialMath';

export interface CommandParseResult {
  command: ChartCommand | null;
  assistantResponse: string;
  matchedIntent: string;
  suggestedFollowUps: string[];
}

/**
 * Natural language intent parser for conversational visualization control.
 * Strictly maps user utterances into safe, typed DSL commands.
 */
export function parseNaturalLanguageCommand(
  text: string,
  state: VisualizationStoreState
): CommandParseResult {
  const lower = text.trim().toLowerCase();
  const company = state.getCurrentCompanyRecord();

  // 1. "Make this easier" / Simplify
  if (
    lower.includes('easier') ||
    lower.includes('simple') ||
    lower.includes('simplify') ||
    lower.includes('make it simple')
  ) {
    return {
      command: { action: 'simplify', enabled: true },
      assistantResponse: `I've simplified the visualization for ${company.name}. Jargon has been replaced with plain-language retail descriptions, and secondary axes have been decluttered.`,
      matchedIntent: 'SIMPLIFY_CHART',
      suggestedFollowUps: [
        'Explain this in plain English',
        'Show cash flow vs profit',
        'Restore full view',
      ],
    };
  }

  // 2. Restore full view
  if (lower.includes('restore') || lower.includes('full view') || lower.includes('unsimplify')) {
    return {
      command: { action: 'simplify', enabled: false },
      assistantResponse: `Restored full multi-axis institutional view for ${company.name}.`,
      matchedIntent: 'RESTORE_CHART',
      suggestedFollowUps: ['Show free cash flow', 'Compare with peers', 'What changed recently?'],
    };
  }

  // 3. Reset chart
  if (lower === 'reset' || lower.includes('reset chart') || lower.includes('start over')) {
    return {
      command: { action: 'reset_chart' },
      assistantResponse: `Reset visualizer to default 5-year growth trajectory for ${company.name}.`,
      matchedIntent: 'RESET_CHART',
      suggestedFollowUps: ['Show PAT vs Cash Flow', 'Show margins', 'What changed in FY26?'],
    };
  }

  // 4. "Remove [metric]" (e.g. "remove revenue", "remove ocf")
  if (lower.startsWith('remove ') || lower.startsWith('hide ')) {
    let target = '';
    if (lower.includes('revenue') || lower.includes('sales')) target = 'revenue';
    else if (lower.includes('ebitda')) target = 'ebitda';
    else if (lower.includes('pat') || lower.includes('profit')) target = 'pat';
    else if (lower.includes('cash') || lower.includes('ocf')) target = 'ocf';
    else if (lower.includes('debt')) target = 'total_debt';

    if (target) {
      return {
        command: { action: 'remove_series', metric: target },
        assistantResponse: `Removed **${target.toUpperCase()}** from the chart. The visualization has dynamically refocused on the remaining series.`,
        matchedIntent: 'REMOVE_SERIES',
        suggestedFollowUps: ['Make profit a bar chart', 'Compare with peers', 'Why did profit grow?'],
      };
    }
  }

  // 5. "Make [metric / it] a bar chart" / change chart type
  if (
    lower.includes('bar chart') ||
    lower.includes('change to bar') ||
    lower.includes('make it bar')
  ) {
    return {
      command: { action: 'change_chart_type', chartType: 'bar' },
      assistantResponse: `Switched series representation to **Bar Chart** mode for enhanced period-over-period comparison.`,
      matchedIntent: 'CHANGE_CHART_TYPE',
      suggestedFollowUps: ['Change back to line', 'Show percentages', 'Explain this graph'],
    };
  }

  if (
    lower.includes('line chart') ||
    lower.includes('change to line') ||
    lower.includes('make it line')
  ) {
    return {
      command: { action: 'change_chart_type', chartType: 'line' },
      assistantResponse: `Switched series representation to **Line Chart** mode for smooth historical trend tracking.`,
      matchedIntent: 'CHANGE_CHART_TYPE',
      suggestedFollowUps: ['Show PAT vs Cash Flow', 'What changed?', 'Compare with peers'],
    };
  }

  // 6. "Show percentages" / "convert to percentage"
  if (lower.includes('percentage') || lower.includes('show %') || lower.includes('as %')) {
    return {
      command: { action: 'convert_to_percentage', enabled: true },
      assistantResponse: `Chart toggled to **Percentage / Margin View**. Metrics are now normalized as a proportion of total revenue.`,
      matchedIntent: 'CONVERT_TO_PERCENTAGE',
      suggestedFollowUps: ['Show absolute values', 'Explain margin trend', 'What changed in FY26?'],
    };
  }

  if (lower.includes('absolute') || lower.includes('show rupees') || lower.includes('in crores')) {
    return {
      command: { action: 'convert_to_percentage', enabled: false },
      assistantResponse: `Toggled back to **Absolute Financial Figures (₹ Crores)**.`,
      matchedIntent: 'CONVERT_TO_ABSOLUTE',
      suggestedFollowUps: ['Show cash flow', 'Compare with peers'],
    };
  }

  // 7. Time range / period change (e.g. "show last 5 years", "only show FY23 onward", "from FY22 to FY26")
  if (lower.includes('last 5 years') || lower.includes('5 years')) {
    return {
      command: { action: 'change_period', from: 'FY22', to: 'FY26' },
      assistantResponse: `Adjusted time horizon to the **Last 5 Fiscal Years (FY22 – FY26)** for ${company.name}.`,
      matchedIntent: 'CHANGE_PERIOD',
      suggestedFollowUps: ['What changed between FY22 and FY26?', 'Show 10-year view', 'Show margins'],
    };
  }

  if (lower.includes('10 years') || lower.includes('all years') || lower.includes('max')) {
    return {
      command: { action: 'change_period', from: 'FY16', to: 'FY26' },
      assistantResponse: `Expanded time horizon to the full **10-Year Audited Track Record (FY16 – FY26)**.`,
      matchedIntent: 'CHANGE_PERIOD',
      suggestedFollowUps: ['Highlight highest growth period', 'Show debt health', 'Show ROCE trend'],
    };
  }

  if (lower.includes('fy23 onward') || lower.includes('from fy23')) {
    return {
      command: { action: 'change_period', from: 'FY23', to: 'FY26' },
      assistantResponse: `Filtered time range to **FY23 – FY26**.`,
      matchedIntent: 'CHANGE_PERIOD',
      suggestedFollowUps: ['What changed in FY24?', 'Show free cash flow'],
    };
  }

  // 8. "Compare with peers" / "peer comparison"
  if (
    lower.includes('peer') ||
    lower.includes('industry') ||
    lower.includes('competitors') ||
    lower.includes('compare it with')
  ) {
    return {
      command: { action: 'add_peer_comparison' },
      assistantResponse: `Activated **Peer Comparison Workspace**. Benchmarking ${company.name} against sector peers across Revenue Growth, EBITDA Margin, ROCE, and Leverage. Note: VERA displays verified financial metrics purely for analytical understanding, not stock buy/sell advice.`,
      matchedIntent: 'PEER_COMPARISON',
      suggestedFollowUps: [
        'How does ROCE compare?',
        'Show debt to EBITDA peer comparison',
        'Back to company timeline',
      ],
    };
  }

  // 9. "PAT vs Cash Flow" / "Profit vs Cash Flow" / "Divergence"
  if (
    lower.includes('pat vs') ||
    lower.includes('cash flow') ||
    lower.includes('divergence') ||
    lower.includes('cash vs profit')
  ) {
    const cur = company.history[company.history.length - 1];
    const prev = company.history[company.history.length - 2];
    const div = detectProfitCashDivergence(cur, prev);

    return {
      command: {
        action: 'create_chart',
        chartId: 'profit-vs-ocf',
        chartType: 'bar',
        series: ['pat', 'ocf'],
      },
      assistantResponse: `Loaded the **Profit vs. Operating Cash Flow (OCF)** audit chart. \n\n**VERA Audit Finding:** ${div.explanation}\n\n**Retail Takeaway:** ${div.retailTakeaway}`,
      matchedIntent: 'PROFIT_VS_CASH_FLOW',
      suggestedFollowUps: [
        'Show Free Cash Flow',
        'Why did cash flow change?',
        'Show Working Capital Cycle',
      ],
    };
  }

  // 10. "Free Cash Flow" / "FCF"
  if (lower.includes('free cash') || lower.includes('fcf')) {
    return {
      command: {
        action: 'create_chart',
        chartId: 'free-cash-flow',
        chartType: 'bar',
        series: ['ocf', 'capex', 'free_cash_flow'],
      },
      assistantResponse: `Loaded **Free Cash Flow (FCF)** analysis. Shows how much real cash is left after paying for capital expenditure (new factories, infrastructure CapEx).`,
      matchedIntent: 'FREE_CASH_FLOW',
      suggestedFollowUps: [
        'Show Capital Allocation',
        'Explain Capex spending',
        'Show Profit vs Cash Flow',
      ],
    };
  }

  // 11. "Margin trend" / "EBITDA Margin"
  if (lower.includes('margin') || lower.includes('profitability')) {
    return {
      command: {
        action: 'create_chart',
        chartId: 'margin-trend',
        chartType: 'line',
        series: ['ebitda_margin', 'pat_margin'],
      },
      assistantResponse: `Displaying **Operating Margin & Net Profit Margin Trend**. Tracks how many paise of operating earnings the company retains from every rupee of sales.`,
      matchedIntent: 'MARGIN_TREND',
      suggestedFollowUps: [
        'Show percentages',
        'Compare margins with peers',
        'What changed in FY26?',
      ],
    };
  }

  // 12. "Debt health" / "Interest coverage" / "Borrowings"
  if (lower.includes('debt') || lower.includes('interest coverage') || lower.includes('loan')) {
    return {
      command: {
        action: 'create_chart',
        chartId: 'debt-health',
        chartType: 'line',
        series: ['total_debt', 'net_debt', 'interest_coverage'],
      },
      assistantResponse: `Displaying **Debt Health & Solvency Matrix**. Analyzes total borrowings, net debt, and interest coverage safety buffers against operational shocks.`,
      matchedIntent: 'DEBT_HEALTH',
      suggestedFollowUps: [
        'Is the debt safe?',
        'Show Debt to EBITDA',
        'Show Capital Allocation',
      ],
    };
  }

  // 13. "ROCE" / "ROE" / "Capital Efficiency"
  if (lower.includes('roce') || lower.includes('roe') || lower.includes('efficiency')) {
    return {
      command: {
        action: 'create_chart',
        chartId: 'capital-efficiency',
        chartType: 'line',
        series: ['roce', 'roe'],
      },
      assistantResponse: `Displaying **Capital Efficiency (ROCE / ROE)**. For retail investors: ROCE measures how many rupees of operating profit the business generates for every ₹100 of total capital deployed.`,
      matchedIntent: 'CAPITAL_EFFICIENCY',
      suggestedFollowUps: [
        'Compare ROCE with peers',
        'Show working capital',
        'What changed in FY26?',
      ],
    };
  }

  // 14. "Segment revenue" / "segments" / "business mix"
  if (lower.includes('segment') || lower.includes('treemap') || lower.includes('business mix')) {
    return {
      command: {
        action: 'create_chart',
        chartId: 'segment-treemap',
        chartType: 'treemap',
        series: ['segments'],
      },
      assistantResponse: `Displaying **Business Composition & Segment Treemap** for ${company.name}. Click on any segment block to inspect its revenue share and operational sub-units.`,
      matchedIntent: 'SEGMENT_TREEMAP',
      suggestedFollowUps: [
        'Drill into highest growth segment',
        'Show company timeline',
        'Back to growth timeline',
      ],
    };
  }

  // 15. "Working capital" / "cash conversion cycle"
  if (lower.includes('working capital') || lower.includes('cash conversion') || lower.includes('debtor days')) {
    return {
      command: {
        action: 'create_chart',
        chartId: 'working-capital',
        chartType: 'bar',
        series: ['debtor_days', 'inventory_days', 'payable_days', 'cash_conversion_cycle'],
      },
      assistantResponse: `Displaying **Working Capital Velocity & Cash Conversion Cycle (CCC)**. Reveals how many days cash remains locked in customer receivables and inventory before being collected.`,
      matchedIntent: 'WORKING_CAPITAL',
      suggestedFollowUps: [
        'Why did debtor days change?',
        'Show Profit vs Cash Flow',
        'Make this easier',
      ],
    };
  }

  // 16. "Capital allocation"
  if (lower.includes('capital allocation') || lower.includes('where cash goes') || lower.includes('capex')) {
    return {
      command: {
        action: 'create_chart',
        chartId: 'capital-allocation',
        chartType: 'bar',
        series: ['capex', 'dividends', 'debt_repayment'],
      },
      assistantResponse: `Displaying **Capital Allocation Breakdown**. Visualizes how management deployed cash between CapEx growth, dividend payouts, debt reduction, and retained surplus.`,
      matchedIntent: 'CAPITAL_ALLOCATION',
      suggestedFollowUps: [
        'Show Free Cash Flow',
        'Show Debt Health',
        'Explain this graph',
      ],
    };
  }

  // 17. "EPS" / "Earnings per share"
  if (lower.includes('eps') || lower.includes('earnings per share')) {
    return {
      command: {
        action: 'create_chart',
        chartId: 'eps-trend',
        chartType: 'bar',
        series: ['eps'],
      },
      assistantResponse: `Displaying **Diluted Earnings Per Share (EPS)** trend over time.`,
      matchedIntent: 'EPS_TREND',
      suggestedFollowUps: ['Show valuation context', 'Show PAT trend', 'What changed?'],
    };
  }

  // 18. "Valuation" / "PE ratio"
  if (lower.includes('valuation') || lower.includes('pe ratio') || lower.includes('p/e')) {
    return {
      command: {
        action: 'create_chart',
        chartId: 'valuation-context',
        chartType: 'line',
        series: ['pe_ratio'],
      },
      assistantResponse: `Displaying **Valuation Context & Historical P/E Multiple** alongside historical medians. Notice: VERA provides analytical valuation metrics without providing stock recommendations or speculative price targets.`,
      matchedIntent: 'VALUATION_CONTEXT',
      suggestedFollowUps: ['Compare P/E with peers', 'Show ROCE', 'Show growth timeline'],
    };
  }

  // 19. "What changed?" / "Compare periods"
  if (lower.includes('what changed') || lower.includes('compare periods') || lower.includes('variance')) {
    return {
      command: {
        action: 'compare_periods',
        periodA: 'FY25',
        periodB: 'FY26',
      },
      assistantResponse: `Activated **"What Changed?" Variance Comparator** between FY25 and FY26. Every metric is audited line-by-line with exact percentage variances and plain-language driver explanations.`,
      matchedIntent: 'WHAT_CHANGED',
      suggestedFollowUps: [
        'Why did cash flow diverge?',
        'Show evidence for FY26 filings',
        'Back to growth timeline',
      ],
    };
  }

  // 20. "Explain this graph" / "Why did it change?" / Anaphoric reference
  if (
    lower.includes('explain') ||
    lower.includes('why did it') ||
    lower.includes('why did this') ||
    lower.includes('what am i seeing')
  ) {
    const point = state.selectedPoint;
    const chartId = state.activeChartId;
    let explanationText = '';

    if (point) {
      explanationText = `Looking at **${point.metric.toUpperCase()}** in **${point.period}** (${point.displayValue || '₹' + point.value.toLocaleString('en-IN') + ' Cr'}):\n` +
        `This data point reflects audited performance filed under SEBI LODR Regulation 33. ` +
        (point.divergenceNotice ? `\n\n⚠️ **Notice:** ${point.divergenceNotice}` : '');
    } else {
      explanationText = `Examining **${chartId.replace('-', ' ').toUpperCase()}** for **${company.name}** across **${state.timeRange[0]}–${state.timeRange[1]}**.\n` +
        `This visualizer provides verified insight into fundamental operational health. Zero numbers are estimated or synthetic.`;
    }

    return {
      command: { action: 'explain_selection' },
      assistantResponse: explanationText,
      matchedIntent: 'EXPLAIN_SELECTION',
      suggestedFollowUps: [
        'Make this easier to understand',
        'Show evidence filings',
        'Compare with peers',
      ],
    };
  }

  // 21. Default fallback: Conversational contextual answer with active chart preservation
  return {
    command: null,
    assistantResponse: `I'm analyzing **${company.name}**'s verified financial disclosures. You can ask me to modify the chart (e.g. *"Show PAT vs Cash Flow"*, *"Remove revenue"*, *"Make it a bar chart"*, *"Compare with peers"*, or *"What changed in FY26?"*).`,
    matchedIntent: 'CONVERSATIONAL_FALLBACK',
    suggestedFollowUps: [
      'Show Revenue + EBITDA + PAT trend',
      'Show Profit vs Operating Cash Flow',
      'Compare with peers',
      'What changed recently?',
    ],
  };
}
