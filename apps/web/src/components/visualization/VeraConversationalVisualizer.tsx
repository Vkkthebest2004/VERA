'use client';

import React from 'react';
import { useVisualizationStore } from '@/state/visualizationStore';
import { CompanyGrowthChart } from '../financial/CompanyGrowthChart';
import { ProfitCashFlowChart } from '../financial/ProfitCashFlowChart';
import { MarginTrendChart } from '../financial/MarginTrendChart';
import { FreeCashFlowChart } from '../financial/FreeCashFlowChart';
import { FinancialWaterfall } from '../financial/FinancialWaterfall';
import { DebtHealthChart } from '../financial/DebtHealthChart';
import { CapitalEfficiencyChart } from '../financial/CapitalEfficiencyChart';
import { SegmentTreemap } from '../financial/SegmentTreemap';
import { PeerComparisonChart } from '../financial/PeerComparisonChart';
import { WorkingCapitalChart } from '../financial/WorkingCapitalChart';
import { CapitalAllocationChart } from '../financial/CapitalAllocationChart';
import { EPSChart } from '../financial/EPSChart';
import { ValuationChart } from '../financial/ValuationChart';
import { CompanyTimeline } from '../financial/CompanyTimeline';
import { ChangeAnalysis } from '../financial/ChangeAnalysis';
import { ChartToolbar } from './ChartToolbar';
import { GlobalTimeSlider } from './GlobalTimeSlider';
import { ExplanationModal } from './ExplanationModal';
import { VeraChatPanel } from '../chat/VeraChatPanel';
import { VeraActionToolbar } from '@/components/ui/VeraActionToolbar';
import {
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Building2,
  DollarSign,
  Activity,
  Layers,
  ArrowUpRight,
  Zap,
} from 'lucide-react';
import { COMPANY_RECORDS } from '@/lib/financial/companyDataset';

export const VeraConversationalVisualizer: React.FC = () => {
  const {
    selectedCompany,
    selectCompany,
    activeChartId,
    getCurrentCompanyRecord,
  } = useVisualizationStore();

  const record = getCurrentCompanyRecord();
  const latestFinancials = record.history[record.history.length - 1];

  // Render active visualization component based on state
  const renderActiveChart = () => {
    switch (activeChartId) {
      case 'growth-timeline':
        return <CompanyGrowthChart />;
      case 'profit-vs-ocf':
        return <ProfitCashFlowChart />;
      case 'margin-trend':
        return <MarginTrendChart />;
      case 'free-cash-flow':
        return <FreeCashFlowChart />;
      case 'financial-waterfall':
        return <FinancialWaterfall />;
      case 'debt-health':
        return <DebtHealthChart />;
      case 'capital-efficiency':
        return <CapitalEfficiencyChart />;
      case 'segment-treemap':
        return <SegmentTreemap />;
      case 'peer-comparison':
        return <PeerComparisonChart />;
      case 'working-capital':
        return <WorkingCapitalChart />;
      case 'capital-allocation':
        return <CapitalAllocationChart />;
      case 'eps-trend':
        return <EPSChart />;
      case 'valuation-context':
        return <ValuationChart />;
      case 'company-timeline':
        return <CompanyTimeline />;
      case 'change-analysis':
        return <ChangeAnalysis />;
      default:
        return <CompanyGrowthChart />;
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-4 space-y-5">
      {/* ─────────────────────────────────────────────────────────────
          1. Top Company Switcher & Key Fundamental Headline Strip
      ────────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-neutral-200/90 p-4 sm:p-5 shadow-2xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Company Switcher Pills */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 p-1 bg-neutral-100 rounded-xl border border-neutral-200">
              {(['RELIANCE', 'TATAPOWER'] as const).map((id) => {
                const c = COMPANY_RECORDS[id];
                const isSelected = selectedCompany === id;
                return (
                  <button
                    key={id}
                    onClick={() => selectCompany(id)}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white text-neutral-900 shadow-xs border border-neutral-300 ring-2 ring-neutral-300'
                        : 'text-neutral-600 hover:text-neutral-900'
                    }`}
                  >
                    {id === 'RELIANCE' ? (
                      <img src="/reliance_icon.svg" alt="Reliance" className="w-3.5 h-3.5 object-contain shrink-0" />
                    ) : (
                      <img src="/tatapower_logo.svg" alt="Tata Power" className="w-4 h-3 object-contain shrink-0" />
                    )}
                    <span>{c.name}</span>
                    <span className="font-mono text-neutral-500 font-normal">₹{c.currentPrice}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2 text-neutral-400 text-xs font-mono hidden sm:inline">
              <span>{record.exchange}</span>
            </div>
          </div>

          {/* User's 3-Button Action Segment Toolbar + Transparency Badge */}
          <div className="flex flex-wrap items-center gap-3">
            <VeraActionToolbar
              size="sm"
              onUpload={() => {}}
              onArchive={() => {}}
              onScan={() => {}}
            />
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-100 text-neutral-900 text-xs font-semibold border border-neutral-200">
              <ShieldCheck className="w-4 h-4 text-neutral-800" />
              <span>Educational & Analytical Visualizer • SEBI LODR Audited Records</span>
            </div>
          </div>
        </div>

        {/* Headline Fundamental Snapshot */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-3 border-t border-neutral-100 text-xs">
          <div className="p-2.5 bg-neutral-50/70 rounded-xl border border-neutral-100">
            <span className="text-neutral-500 text-[10px] uppercase font-bold tracking-wider block mb-0.5">
              Market Capitalization
            </span>
            <span className="text-sm font-bold text-neutral-900 font-mono">
              ₹{(record.marketCapCr / 1000).toFixed(0)}k Cr
            </span>
          </div>

          <div className="p-2.5 bg-neutral-50/70 rounded-xl border border-neutral-100">
            <span className="text-neutral-500 text-[10px] uppercase font-bold tracking-wider block mb-0.5">
              Revenue ({latestFinancials.period})
            </span>
            <span className="text-sm font-bold text-neutral-900 font-mono">
              ₹{(latestFinancials.revenueCr / 1000).toFixed(0)}k Cr
            </span>
          </div>

          <div className="p-2.5 bg-neutral-50/70 rounded-xl border border-neutral-100">
            <span className="text-neutral-500 text-[10px] uppercase font-bold tracking-wider block mb-0.5">
              Net Profit (PAT)
            </span>
            <span className="text-sm font-bold text-neutral-950 font-mono">
              ₹{latestFinancials.patCr.toLocaleString('en-IN')} Cr
            </span>
          </div>

          <div className="p-2.5 bg-neutral-50/70 rounded-xl border border-neutral-100">
            <span className="text-neutral-500 text-[10px] uppercase font-bold tracking-wider block mb-0.5">
              Operating Cash Flow
            </span>
            <span className="text-sm font-bold text-neutral-900 font-mono">
              ₹{latestFinancials.ocfCr.toLocaleString('en-IN')} Cr
            </span>
          </div>

          <div className="p-2.5 bg-neutral-50/70 rounded-xl border border-neutral-100">
            <span className="text-neutral-500 text-[10px] uppercase font-bold tracking-wider block mb-0.5">
              ROCE (Capital Return)
            </span>
            <span className="text-sm font-bold text-neutral-950 font-mono">
              {(( (latestFinancials.ebitdaCr - latestFinancials.depreciationCr) / (latestFinancials.equityCr + latestFinancials.reservesCr + latestFinancials.totalDebtCr) ) * 100).toFixed(1)}%
            </span>
          </div>

          <div className="p-2.5 bg-neutral-50/70 rounded-xl border border-neutral-100">
            <span className="text-neutral-500 text-[10px] uppercase font-bold tracking-wider block mb-0.5">
              P/E Valuation Multiple
            </span>
            <span className="text-sm font-bold text-neutral-900 font-mono">
              {latestFinancials.peRatio}x
            </span>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. Global Financial Time Machine Slider
      ────────────────────────────────────────────────────────────── */}
      <GlobalTimeSlider />

      {/* ─────────────────────────────────────────────────────────────
          3. Two-Column Conversational Visualizer Workspace
      ────────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left: Active Hero Visualization & Toolbars (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          <ChartToolbar />
          {renderActiveChart()}
        </div>

        {/* Right: Conversational Chart Intelligence Assistant (4 Cols) */}
        <div className="lg:col-span-4 h-[680px]">
          <VeraChatPanel />
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          4. 5-Part Explanation Modal
      ────────────────────────────────────────────────────────────── */}
      <ExplanationModal />
    </div>
  );
};
