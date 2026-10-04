import { create } from 'zustand';
import { ChartType, SelectedPoint, ChartCommand } from '@/lib/visualization/chartDsl';
import { COMPANY_RECORDS, FullCompanyRecord } from '@/lib/financial/companyDataset';
import { chartEventBus } from '@/lib/visualization/chartEventBus';

export interface ExplanationContext {
  isOpen: boolean;
  chartId: string;
  headline: string;
  whatYouAreSeeing: string;
  whatChanged: string;
  whatDeservesAttention: string;
  whyItMatters: string;
  sourceEvidence: string;
}

export interface VisualizationStoreState {
  selectedCompany: 'RELIANCE' | 'TATAPOWER';
  activeChartId: string;
  chartType: ChartType;
  timeRange: [string, string];
  globalTimeIndex: number; // 0 to 10 for FY16 to FY26
  activeSeries: string[];
  displayMode: 'absolute' | 'percentage' | 'simplified' | 'normalized';
  isSimplified: boolean;
  selectedPoint: SelectedPoint | null;
  selectedSegment: string | null;
  selectedPeers: string[];
  comparisonMode: boolean;
  comparisonYears: [string, string];
  highlightedPeriod: string | null;
  highlightedMetric: string | null;
  explanationContext: ExplanationContext | null;

  // Actions
  selectCompany: (company: 'RELIANCE' | 'TATAPOWER') => void;
  setActiveChart: (chartId: string) => void;
  setChartType: (chartType: ChartType) => void;
  setTimeRange: (from: string, to: string) => void;
  setGlobalTimeIndex: (index: number) => void;
  addSeries: (metric: string) => void;
  removeSeries: (metric: string) => void;
  setSeries: (series: string[]) => void;
  setDisplayMode: (mode: 'absolute' | 'percentage' | 'simplified' | 'normalized') => void;
  setSimplified: (simplified: boolean) => void;
  setSelectedPoint: (point: SelectedPoint | null) => void;
  setSelectedSegment: (segment: string | null) => void;
  setSelectedPeers: (peers: string[]) => void;
  setComparisonMode: (enabled: boolean, years?: [string, string]) => void;
  setHighlightedPeriod: (period: string | null) => void;
  setHighlightedMetric: (metric: string | null) => void;
  openExplanation: (context?: Partial<ExplanationContext>) => void;
  closeExplanation: () => void;
  resetChart: () => void;
  executeCommand: (cmd: ChartCommand) => void;

  // Getters
  getCurrentCompanyRecord: () => FullCompanyRecord;
}

export const useVisualizationStore = create<VisualizationStoreState>((set, get) => ({
  selectedCompany: 'RELIANCE',
  activeChartId: 'growth-timeline',
  chartType: 'line',
  timeRange: ['FY21', 'FY26'],
  globalTimeIndex: 10, // FY26
  activeSeries: ['revenue', 'ebitda', 'pat', 'ocf'],
  displayMode: 'absolute',
  isSimplified: false,
  selectedPoint: null,
  selectedSegment: null,
  selectedPeers: ['TCS', 'BHARTIARTL', 'HDFCBANK'],
  comparisonMode: false,
  comparisonYears: ['FY25', 'FY26'],
  highlightedPeriod: null,
  highlightedMetric: null,
  explanationContext: null,

  selectCompany: (company) => {
    set({
      selectedCompany: company,
      selectedPoint: null,
      selectedSegment: null,
      selectedPeers:
        company === 'RELIANCE'
          ? ['TCS', 'BHARTIARTL', 'HDFCBANK']
          : ['NTPC', 'ADANIPOWER', 'POWERGRID'],
    });
    chartEventBus.emit('seriesSelected', get().activeChartId, {
      seriesName: company,
    });
  },

  setActiveChart: (chartId) => {
    // Set appropriate default series based on chartId
    let series = get().activeSeries;
    let type: ChartType = 'line';

    switch (chartId) {
      case 'growth-timeline':
        series = ['revenue', 'ebitda', 'pat', 'ocf'];
        type = 'line';
        break;
      case 'profit-vs-ocf':
        series = ['pat', 'ocf'];
        type = 'bar';
        break;
      case 'margin-trend':
        series = ['ebitda_margin', 'pat_margin'];
        type = 'line';
        break;
      case 'free-cash-flow':
        series = ['ocf', 'capex', 'free_cash_flow'];
        type = 'bar';
        break;
      case 'financial-waterfall':
        series = ['waterfall'];
        type = 'waterfall';
        break;
      case 'debt-health':
        series = ['total_debt', 'net_debt', 'interest_coverage'];
        type = 'line';
        break;
      case 'capital-efficiency':
        series = ['roce', 'roe'];
        type = 'line';
        break;
      case 'segment-treemap':
        series = ['segments'];
        type = 'treemap';
        break;
      case 'peer-comparison':
        series = ['revenueGrowthPct', 'ebitdaMarginPct', 'rocePct', 'debtToEbitda'];
        type = 'radar';
        break;
      case 'working-capital':
        series = ['debtor_days', 'inventory_days', 'payable_days', 'cash_conversion_cycle'];
        type = 'bar';
        break;
      case 'capital-allocation':
        series = ['capex', 'dividends', 'debt_repayment'];
        type = 'bar';
        break;
      case 'eps-trend':
        series = ['eps'];
        type = 'bar';
        break;
      case 'valuation-context':
        series = ['pe_ratio'];
        type = 'line';
        break;
      case 'change-analysis':
        series = ['variance'];
        type = 'bar';
        break;
    }

    set({
      activeChartId: chartId,
      activeSeries: series,
      chartType: type,
      selectedPoint: null,
    });

    chartEventBus.emit('chartTypeChanged', chartId, { chartType: type });
  },

  setChartType: (chartType) => {
    set({ chartType });
    chartEventBus.emit('chartTypeChanged', get().activeChartId, { chartType });
  },

  setTimeRange: (from, to) => {
    set({ timeRange: [from, to] });
    chartEventBus.emit('periodChanged', get().activeChartId, { period: [from, to] });
  },

  setGlobalTimeIndex: (index) => {
    const record = get().getCurrentCompanyRecord();
    const safeIndex = Math.max(0, Math.min(index, record.history.length - 1));
    const yearItem = record.history[safeIndex];

    // Auto set time range window up to this year
    const fromIndex = Math.max(0, safeIndex - 4);
    const fromYear = record.history[fromIndex].period;
    const toYear = yearItem.period;

    set({
      globalTimeIndex: safeIndex,
      timeRange: [fromYear, toYear],
    });

    chartEventBus.emit('periodChanged', get().activeChartId, { period: [fromYear, toYear] });
  },

  addSeries: (metric) => {
    const current = get().activeSeries;
    if (!current.includes(metric)) {
      set({ activeSeries: [...current, metric] });
    }
  },

  removeSeries: (metric) => {
    const current = get().activeSeries;
    const filtered = current.filter((m) => m !== metric && m.toLowerCase() !== metric.toLowerCase());
    set({ activeSeries: filtered.length > 0 ? filtered : current });
  },

  setSeries: (series) => {
    set({ activeSeries: series });
  },

  setDisplayMode: (displayMode) => {
    set({ displayMode });
  },

  setSimplified: (isSimplified) => {
    set({
      isSimplified,
      displayMode: isSimplified ? 'simplified' : 'absolute',
    });
  },

  setSelectedPoint: (selectedPoint) => {
    set({ selectedPoint });
    if (selectedPoint) {
      chartEventBus.emit('pointClick', get().activeChartId, { point: selectedPoint });
    }
  },

  setSelectedSegment: (selectedSegment) => {
    set({ selectedSegment });
    if (selectedSegment) {
      chartEventBus.emit('segmentSelected', get().activeChartId, { segment: selectedSegment });
    }
  },

  setSelectedPeers: (selectedPeers) => {
    set({ selectedPeers });
  },

  setComparisonMode: (comparisonMode, years) => {
    set({
      comparisonMode,
      comparisonYears: years || get().comparisonYears,
      activeChartId: comparisonMode ? 'change-analysis' : get().activeChartId,
    });
  },

  setHighlightedPeriod: (highlightedPeriod) => {
    set({ highlightedPeriod });
  },

  setHighlightedMetric: (highlightedMetric) => {
    set({ highlightedMetric });
  },

  openExplanation: (custom) => {
    const state = get();
    const record = state.getCurrentCompanyRecord();
    const point = state.selectedPoint;

    set({
      explanationContext: {
        isOpen: true,
        chartId: state.activeChartId,
        headline: custom?.headline || `Financial Examination: ${record.name}`,
        whatYouAreSeeing:
          custom?.whatYouAreSeeing ||
          `Historical trajectory of ${state.activeSeries.join(', ').toUpperCase()} from ${state.timeRange[0]} to ${state.timeRange[1]}.`,
        whatChanged:
          custom?.whatChanged ||
          (point
            ? `At ${point.period}, ${point.metric.toUpperCase()} recorded ${point.displayValue || '₹' + point.value.toLocaleString('en-IN') + ' Cr'}.`
            : `Consistent compound expansion with stable operational margins.`),
        whatDeservesAttention:
          custom?.whatDeservesAttention ||
          `Cash conversion velocity and debt-to-EBITDA leverage cushion against cyclical downturns.`,
        whyItMatters:
          custom?.whyItMatters ||
          `Provides retail investors with an unmanipulated view of true cash generation versus paper accounting figures.`,
        sourceEvidence:
          custom?.sourceEvidence ||
          `Statutory Consolidated Financial Disclosures filed under SEBI LODR Regulation 33 with BSE & NSE.`,
      },
    });
  },

  closeExplanation: () => {
    set({ explanationContext: null });
  },

  resetChart: () => {
    set({
      activeChartId: 'growth-timeline',
      chartType: 'line',
      timeRange: ['FY21', 'FY26'],
      activeSeries: ['revenue', 'ebitda', 'pat', 'ocf'],
      displayMode: 'absolute',
      isSimplified: false,
      selectedPoint: null,
      selectedSegment: null,
      comparisonMode: false,
      highlightedPeriod: null,
      highlightedMetric: null,
    });
  },

  executeCommand: (cmd: ChartCommand) => {
    switch (cmd.action) {
      case 'create_chart':
        get().setActiveChart(cmd.chartId);
        get().setChartType(cmd.chartType);
        get().setSeries(cmd.series);
        if (cmd.period) {
          get().setTimeRange(cmd.period.from, cmd.period.to);
        }
        break;

      case 'change_chart_type':
        get().setChartType(cmd.chartType);
        break;

      case 'add_series':
        get().addSeries(cmd.metric);
        break;

      case 'remove_series':
        get().removeSeries(cmd.metric);
        break;

      case 'replace_series':
        get().setSeries(cmd.series);
        break;

      case 'change_period':
        get().setTimeRange(cmd.from, cmd.to);
        break;

      case 'add_peer_comparison':
        if (cmd.peers && cmd.peers.length > 0) {
          get().setSelectedPeers(cmd.peers);
        }
        get().setActiveChart('peer-comparison');
        break;

      case 'remove_peer_comparison':
        get().setActiveChart('growth-timeline');
        break;

      case 'highlight_period':
        get().setHighlightedPeriod(cmd.period);
        break;

      case 'highlight_metric':
        get().setHighlightedMetric(cmd.metric);
        break;

      case 'convert_to_percentage':
        get().setDisplayMode(cmd.enabled ? 'percentage' : 'absolute');
        break;

      case 'simplify':
        get().setSimplified(cmd.enabled);
        break;

      case 'reset_chart':
        get().resetChart();
        break;

      case 'compare_periods':
        get().setComparisonMode(true, [cmd.periodA, cmd.periodB]);
        break;

      case 'select_point':
        get().setSelectedPoint(cmd.point);
        break;

      case 'drill_down':
        get().setSelectedSegment(cmd.segment);
        get().setActiveChart('segment-treemap');
        break;

      case 'explain_selection':
        get().openExplanation();
        break;
    }
  },

  getCurrentCompanyRecord: () => {
    return COMPANY_RECORDS[get().selectedCompany] || COMPANY_RECORDS.RELIANCE;
  },
}));
