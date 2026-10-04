'use client';

import React from 'react';
import { useVisualizationStore } from '@/state/visualizationStore';
import {
  TrendingUp,
  BarChart2,
  LineChart,
  Sparkles,
  Zap,
  RotateCcw,
  Layers,
  ChevronDown,
  Info,
  Maximize2,
  HelpCircle,
} from 'lucide-react';
import { useChatStore } from '@/state/chatStore';

export const CHART_MODES = [
  { id: 'growth-timeline', label: '1. Revenue + EBITDA + PAT Trend', icon: '📈' },
  { id: 'profit-vs-ocf', label: '2. PAT vs Operating Cash Flow', icon: '⚖️' },
  { id: 'margin-trend', label: '3. Profitability Margin Trend', icon: '📊' },
  { id: 'free-cash-flow', label: '4. Free Cash Flow (FCF)', icon: '💧' },
  { id: 'financial-waterfall', label: '5. Full P&L Waterfall Bridge', icon: '🌊' },
  { id: 'debt-health', label: '6. Debt & Interest Coverage', icon: '🛡️' },
  { id: 'capital-efficiency', label: '7. ROCE / ROE Capital Return', icon: '⚡' },
  { id: 'segment-treemap', label: '8. Business Segment Treemap', icon: '🏢' },
  { id: 'peer-comparison', label: '9. Peer Comparison Benchmark', icon: '👥' },
  { id: 'working-capital', label: '10. Working Capital & Cash Cycle', icon: '🔄' },
  { id: 'capital-allocation', label: '11. Capital Allocation Strategy', icon: '💼' },
  { id: 'eps-trend', label: '12. Diluted EPS Growth', icon: '🎯' },
  { id: 'valuation-context', label: '13. Valuation Context (Historical P/E)', icon: '🏷️' },
  { id: 'company-timeline', label: '14. Regulatory Events & Evidence', icon: '📜' },
  { id: 'change-analysis', label: '15. "What Changed?" Comparator', icon: '🔍' },
];

export const ChartToolbar: React.FC = () => {
  const {
    activeChartId,
    setActiveChart,
    chartType,
    setChartType,
    timeRange,
    setTimeRange,
    isSimplified,
    setSimplified,
    openExplanation,
    resetChart,
    getCurrentCompanyRecord,
  } = useVisualizationStore();

  const { sendMessage } = useChatStore();
  const record = getCurrentCompanyRecord();

  return (
    <div className="bg-white rounded-2xl border border-neutral-200/90 p-3 sm:p-4 shadow-2xs space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Chart View Selector Dropdown */}
        <div className="relative flex items-center gap-2">
          <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider hidden sm:inline">
            Story View:
          </span>
          <select
            value={activeChartId}
            onChange={(e) => setActiveChart(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-neutral-300 bg-white font-semibold text-xs text-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-purple-200 cursor-pointer shadow-2xs"
          >
            {CHART_MODES.map((m) => (
              <option key={m.id} value={m.id}>
                {m.icon} {m.label}
              </option>
            ))}
          </select>
        </div>

        {/* Action Controls: Time Horizon, Chart Type, Explain, Simplify */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {/* Quick Time Horizon Pills */}
          <div className="flex items-center rounded-lg border border-neutral-200 p-0.5 bg-neutral-50 text-xs">
            {[
              { label: '3Yr', from: 'FY23', to: 'FY26' },
              { label: '5Yr', from: 'FY21', to: 'FY26' },
              { label: 'Max (10Yr)', from: 'FY16', to: 'FY26' },
            ].map((t) => {
              const isSelected = timeRange[0] === t.from && timeRange[1] === t.to;
              return (
                <button
                  key={t.label}
                  onClick={() => setTimeRange(t.from, t.to)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white text-neutral-900 shadow-2xs border border-neutral-200 font-bold'
                      : 'text-neutral-500 hover:text-neutral-900'
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>

          {/* Line / Bar Switcher */}
          <div className="flex items-center rounded-lg border border-neutral-200 p-0.5 bg-neutral-50">
            <button
              onClick={() => setChartType('line')}
              title="Line Chart Mode"
              className={`p-1.5 rounded-md transition-all cursor-pointer ${
                chartType === 'line'
                  ? 'bg-white text-neutral-900 shadow-2xs border border-neutral-200 font-bold'
                  : 'text-neutral-400 hover:text-neutral-700'
              }`}
            >
              <LineChart className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setChartType('bar')}
              title="Bar Chart Mode"
              className={`p-1.5 rounded-md transition-all cursor-pointer ${
                chartType === 'bar'
                  ? 'bg-white text-neutral-900 shadow-2xs border border-neutral-200 font-bold'
                  : 'text-neutral-400 hover:text-neutral-700'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* "Make This Easier" Mode Toggle */}
          <button
            onClick={() => setSimplified(!isSimplified)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer shadow-2xs ${
              isSimplified
                ? 'bg-emerald-600 text-white font-bold ring-2 ring-emerald-300'
                : 'bg-neutral-100 hover:bg-neutral-200/70 text-neutral-700 border border-neutral-300'
            }`}
            title="Translates complex accounting terms into plain-language concepts for retail investors"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{isSimplified ? 'Simplified Mode Active' : 'Make This Easier'}</span>
          </button>

          {/* "Explain This Graph" Button */}
          <button
            onClick={() => openExplanation()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-200" />
            <span>Explain This</span>
          </button>

          {/* Reset Chart */}
          <button
            onClick={() => resetChart()}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
            title="Reset to default view"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
