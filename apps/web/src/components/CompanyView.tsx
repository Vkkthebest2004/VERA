'use client';

import React, { useState } from 'react';
import {
  ExternalLink,
  Download,
  Plus,
  Edit2,
  Bell,
  Sparkles,
  BookOpen,
  ArrowUpRight,
  TrendingUp,
  ShieldCheck,
  Check,
  Share2,
  ChevronRight,
  ChevronDown,
  Info,
  FileText,
  PieChart,
  BarChart3,
  Layers,
  Building2,
  CheckCircle2,
  Scale,
  Calendar,
  Zap,
  LineChart,
  Users,
  MessageSquare,
} from 'lucide-react';
import { CompanyData, COMPANIES } from '@/data/mockCompanies';
import { ScreenerStockChart } from './ScreenerStockChart';
import { VeraActionToolbar } from '@/components/ui/VeraActionToolbar';

export type TabType =
  | 'chart'
  | 'analysis'
  | 'peers'
  | 'quarters'
  | 'profit-loss'
  | 'balance-sheet'
  | 'cash-flow'
  | 'ratios'
  | 'investors'
  | 'documents';

interface CompanyViewProps {
  company: CompanyData;
  onOpenAiWithClaim?: (claimText: string) => void;
  onOpenChat?: () => void;
  onOpenEvidence?: (claimText?: string) => void;
  onToggleWatchlist: (companyId: string) => void;
  isInWatchlist: boolean;
  onSelectCompany?: (companyId: string) => void;
}

export const CompanyView: React.FC<CompanyViewProps> = ({
  company,
  onOpenAiWithClaim = () => {},
  onOpenChat,
  onOpenEvidence,
  onToggleWatchlist,
  isInWatchlist,
  onSelectCompany,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('chart');
  const [activeTimeframe, setActiveTimeframe] = useState<'1M' | '6M' | '1Yr' | '3Yr' | '5Yr' | 'Max'>('1Yr');
  const [chartMode, setChartMode] = useState<'Price' | 'PE Ratio'>('Price');
  const [hoveredPoint, setHoveredPoint] = useState<{ x: string; y: number; volume: number } | null>(null);

  const currentChartPoints = company.chartData[activeTimeframe] || company.chartData['1Yr'];

  // SVG Chart Dimensions & Calculations
  const chartWidth = 900;
  const chartHeight = 320;
  const padding = { top: 20, right: 50, bottom: 40, left: 60 };

  const minY = Math.min(...currentChartPoints.map((p) => p.y)) * 0.9;
  const maxY = Math.max(...currentChartPoints.map((p) => p.y)) * 1.1;

  const getX = (index: number) => {
    return padding.left + (index / (currentChartPoints.length - 1)) * (chartWidth - padding.left - padding.right);
  };

  const getY = (val: number) => {
    return chartHeight - padding.bottom - ((val - minY) / (maxY - minY)) * (chartHeight - padding.top - padding.bottom);
  };

  // Generate smooth SVG bezier curve
  const points = currentChartPoints.map((p, i) => [getX(i), getY(p.y)]);
  let pathD = `M ${points[0][0]},${points[0][1]}`;
  for (let i = 0; i < points.length - 1; i++) {
    const xMid = (points[i][0] + points[i + 1][0]) / 2;
    const yMid = (points[i][1] + points[i + 1][1]) / 2;
    const cpX1 = (xMid + points[i][0]) / 2;
    const cpX2 = (xMid + points[i + 1][0]) / 2;
    pathD += ` Q ${points[i][0]},${points[i][1]} ${xMid},${yMid} Q ${points[i + 1][0]},${points[i + 1][1]} ${points[i + 1][0]},${points[i + 1][1]}`;
  }

  const areaD = `${pathD} L ${points[points.length - 1][0]},${chartHeight - padding.bottom} L ${points[0][0]},${
    chartHeight - padding.bottom
  } Z`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 space-y-6">
      {/* ─────────────────────────────────────────────────────────────
          1. Sub-navigation Bar (Matching Screener.in Exact Layout)
      ────────────────────────────────────────────────────────────── */}
      <div className="border-b border-neutral-200 flex items-center justify-between overflow-x-auto text-[13px] font-medium text-neutral-600 scrollbar-none">
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('chart')}
            className={`py-2 px-3 border-b-2 font-semibold text-[13px] transition-colors cursor-pointer ${
              activeTab === 'chart'
                ? 'border-neutral-900 text-neutral-900 font-bold'
                : 'border-transparent text-neutral-600 hover:text-neutral-900'
            }`}
          >
            {company.name.length > 17 ? company.name.slice(0, 16) + '.' : company.name}
          </button>
          <button
            onClick={() => setActiveTab('chart')}
            className={`py-2 px-2.5 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'chart'
                ? 'border-neutral-900 text-neutral-900 font-bold'
                : 'border-transparent text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Chart
          </button>
          <button
            onClick={() => setActiveTab('analysis')}
            className={`py-2 px-2.5 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'analysis'
                ? 'border-neutral-900 text-neutral-900 font-bold'
                : 'border-transparent text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Analysis
          </button>
          <button
            onClick={() => setActiveTab('peers')}
            className={`py-2 px-2.5 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'peers'
                ? 'border-neutral-900 text-neutral-900 font-bold'
                : 'border-transparent text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Peers
          </button>
          <button
            onClick={() => setActiveTab('quarters')}
            className={`py-2 px-2.5 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'quarters'
                ? 'border-neutral-900 text-neutral-900 font-bold'
                : 'border-transparent text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Quarters
          </button>
          <button
            onClick={() => setActiveTab('profit-loss')}
            className={`py-2 px-2.5 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'profit-loss'
                ? 'border-neutral-900 text-neutral-900 font-bold'
                : 'border-transparent text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Profit & Loss
          </button>
          <button
            onClick={() => setActiveTab('balance-sheet')}
            className={`py-2 px-2.5 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'balance-sheet'
                ? 'border-neutral-900 text-neutral-900 font-bold'
                : 'border-transparent text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Balance Sheet
          </button>
          <button
            onClick={() => setActiveTab('cash-flow')}
            className={`py-2 px-2.5 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'cash-flow'
                ? 'border-neutral-900 text-neutral-900 font-bold'
                : 'border-transparent text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Cash Flow
          </button>
          <button
            onClick={() => setActiveTab('ratios')}
            className={`py-2 px-2.5 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'ratios'
                ? 'border-neutral-900 text-neutral-900 font-bold'
                : 'border-transparent text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Ratios
          </button>
          <button
            onClick={() => setActiveTab('investors')}
            className={`py-2 px-2.5 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'investors'
                ? 'border-neutral-900 text-neutral-900 font-bold'
                : 'border-transparent text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Investors
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`py-2 px-2.5 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'documents'
                ? 'border-neutral-900 text-neutral-900 font-bold'
                : 'border-transparent text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Documents
          </button>
        </div>

        {/* Right sub-bar tools */}
        <div className="flex items-center gap-3 shrink-0 py-1.5">
          <button className="flex items-center gap-1.5 text-xs text-neutral-700 hover:text-neutral-900 transition-colors">
            <BookOpen className="w-3.5 h-3.5 text-neutral-500" />
            <span>Notebook</span>
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. Company Header Card & Ratios Grid
      ────────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-neutral-200/90 p-5 sm:p-6 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pb-6 border-b border-neutral-100">
          {/* Company Title, Price & External Links */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              {/* Logo Badge */}
              <div
                className="w-9 h-9 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-sm shadow-xs"
              >
                {company.ticker[0]}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-[28px] font-bold tracking-tight text-neutral-900 font-sans">
                    {company.name}
                  </h1>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-700 font-medium pt-1">
                  <a
                    href={`https://${company.website}`}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline hover:text-neutral-950 flex items-center gap-1"
                  >
                    <span>🔗 {company.website}</span>
                  </a>
                  <span className="text-neutral-300">•</span>
                  <span className="flex items-center gap-1 text-neutral-600">
                    <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400" />
                    <span>BSE: {company.bseCode}</span>
                  </span>
                  <span className="text-neutral-300">•</span>
                  <span className="flex items-center gap-1 text-neutral-600">
                    <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400" />
                    <span>NSE: {company.nseSymbol}</span>
                  </span>
                </div>
              </div>
              <span className="text-neutral-300 font-normal text-2xl hidden sm:inline">•</span>
              <div className="flex flex-col">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-[28px] font-bold text-neutral-900 font-sans">
                    ₹ {company.price.toLocaleString('en-IN')}
                  </span>
                  <span
                    className={`text-xs font-semibold px-1.5 py-0.5 rounded flex items-center gap-1 font-mono ${
                      company.changePercent >= 0
                        ? 'text-neutral-950 bg-neutral-100 border border-neutral-300'
                        : 'text-neutral-700 bg-neutral-100 border border-neutral-200'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${company.changePercent >= 0 ? 'bg-neutral-900' : 'bg-neutral-500'}`} />
                    <span>{company.changePercent >= 0 ? '+' : ''}{company.changePercent}%</span>
                  </span>
                </div>
                <span className="text-[11px] text-neutral-400 font-normal">{company.closeDate}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons: 3-Button Segment Toolbar, Export to Excel & Follow */}
          <div className="flex flex-wrap items-center gap-2.5">
            <VeraActionToolbar
              size="sm"
              onUpload={() => onOpenAiWithClaim(`Upload and parse latest financial statement or annual report for ${company.name}`)}
              onArchive={() => (onOpenEvidence ? onOpenEvidence() : onOpenAiWithClaim(`Verify BSE & NSE disclosures for ${company.name}`))}
              onScan={() => (onOpenChat ? onOpenChat() : onOpenAiWithClaim(`Multi-dimensional fundamental scan for ${company.name}`))}
            />

            <button
              onClick={() => onOpenAiWithClaim(`Generate consolidated financial verification brief for ${company.name}`)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md border border-neutral-300 hover:bg-neutral-50 text-neutral-700 text-xs font-semibold uppercase tracking-wider transition-colors shadow-2xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>EXPORT TO EXCEL</span>
            </button>

            <button
              onClick={() => onToggleWatchlist(company.id)}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-md text-xs font-bold transition-all shadow-xs cursor-pointer ${
                isInWatchlist
                  ? 'bg-neutral-100 text-neutral-900 border border-neutral-300'
                  : 'bg-neutral-900 hover:bg-neutral-800 text-white uppercase tracking-wider'
              }`}
            >
              {isInWatchlist ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
              <span>{isInWatchlist ? 'FOLLOWING' : '+ FOLLOW'}</span>
            </button>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            3. Ratios Grid + About Section (Two Columns)
        ────────────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
          {/* Left: Financial Ratios (8 Cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-6 text-sm">
              <div className="border-b border-neutral-100 pb-2 flex items-baseline justify-between">
                <span className="text-neutral-500 text-xs font-normal">Market Cap</span>
                <span className="font-bold text-neutral-900 text-sm">
                  ₹ {company.marketCapCr.toLocaleString('en-IN')} <span className="font-normal text-xs text-neutral-600">Cr.</span>
                </span>
              </div>
              <div className="border-b border-neutral-100 pb-2 flex items-baseline justify-between">
                <span className="text-neutral-500 text-xs font-normal">Current Price</span>
                <span className="font-bold text-neutral-900 text-sm">
                  ₹ {company.price.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="border-b border-neutral-100 pb-2 flex items-baseline justify-between">
                <span className="text-neutral-500 text-xs font-normal">High / Low</span>
                <span className="font-bold text-neutral-900 text-xs">
                  ₹ {company.high52} / {company.low52}
                </span>
              </div>

              <div className="border-b border-neutral-100 pb-2 flex items-baseline justify-between">
                <span className="text-neutral-500 text-xs font-normal">Stock P/E</span>
                <span className="font-bold text-neutral-900 text-sm">{company.pe}</span>
              </div>
              <div className="border-b border-neutral-100 pb-2 flex items-baseline justify-between">
                <span className="text-neutral-500 text-xs font-normal">Book Value</span>
                <span className="font-bold text-neutral-900 text-sm">₹ {company.bookValue}</span>
              </div>
              <div className="border-b border-neutral-100 pb-2 flex items-baseline justify-between">
                <span className="text-neutral-500 text-xs font-normal">Dividend Yield</span>
                <span className="font-bold text-neutral-900 text-sm">{company.dividendYield} <span className="font-normal text-xs text-neutral-600">%</span></span>
              </div>

              <div className="border-b border-neutral-100 pb-2 flex items-baseline justify-between">
                <span className="text-neutral-500 text-xs font-normal">ROCE</span>
                <span className="font-bold text-neutral-900 text-sm">{company.roce} <span className="font-normal text-xs text-neutral-600">%</span></span>
              </div>
              <div className="border-b border-neutral-100 pb-2 flex items-baseline justify-between">
                <span className="text-neutral-500 text-xs font-normal">ROE</span>
                <span className="font-bold text-neutral-900 text-sm">{company.roe} <span className="font-normal text-xs text-neutral-600">%</span></span>
              </div>
              <div className="border-b border-neutral-100 pb-2 flex items-baseline justify-between">
                <span className="text-neutral-500 text-xs font-normal">Face Value</span>
                <span className="font-bold text-neutral-900 text-sm">₹ {company.faceValue.toFixed(2)}</span>
              </div>
            </div>

            {/* Add ratio to table matching Screener */}
            <div className="pt-2">
              <label className="block text-xs font-semibold text-neutral-800 mb-1.5">
                Add ratio to table
              </label>
              <div className="flex items-center justify-between gap-4">
                <input
                  type="text"
                  placeholder="eg. Promoter holding"
                  className="w-full max-w-md px-3 py-1.5 text-xs bg-white border border-neutral-300 rounded-md placeholder-neutral-400 focus:outline-hidden focus:border-neutral-900 shadow-2xs"
                />
                <button
                  onClick={() => onOpenAiWithClaim(`Verify financial ratios for ${company.name}`)}
                  className="text-neutral-900 hover:text-neutral-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer shrink-0 uppercase tracking-wider"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>EDIT RATIOS</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right: About & Key Points (4 Cols) */}
          <div className="lg:col-span-4 bg-transparent p-0 space-y-4">
            <div>
              <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1 flex items-center justify-between">
                <span>ABOUT</span>
                <ChevronDown className="w-3.5 h-3.5 text-neutral-400 cursor-pointer" />
              </h3>
              <p className="text-xs text-neutral-700 leading-relaxed">{company.about}</p>
            </div>

            <div>
              <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">
                KEY POINTS
              </h3>
              <div className="text-xs text-neutral-700 leading-relaxed space-y-1">
                {company.keyPoints.map((point, idx) => (
                  <p key={idx}>{point}</p>
                ))}
              </div>
              <button
                onClick={() => setActiveTab('analysis')}
                className="text-neutral-900 hover:underline font-bold text-xs mt-2.5 inline-flex items-center gap-1 tracking-wider uppercase cursor-pointer"
              >
                <span>READ MORE</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          5. Tab 1: Interactive Stock Chart Card (ECharts Dual-Axis Screener)
      ────────────────────────────────────────────────────────────── */}
      {activeTab === 'chart' && (
        <ScreenerStockChart
          chartData={company.chartData}
          currentPrice={company.price}
          stockPe={company.pe}
          companyName={company.name}
          onSelectPoint={(date, price, volume) => {
            onOpenAiWithClaim(`Analyze the stock price ₹${price} and trading volume on ${date} for ${company.name}`);
          }}
          onOpenAiWithClaim={onOpenAiWithClaim}
        />
      )}

      {/* ─────────────────────────────────────────────────────────────
          6. Tab 2: Analysis & Business Architecture
      ────────────────────────────────────────────────────────────── */}
      {activeTab === 'analysis' && (
        <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-2xs space-y-6">
          <div className="border-b border-neutral-100 pb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-neutral-900">
                Business Architecture & Strategic Analysis
              </h2>
              <p className="text-xs text-neutral-500">
                Comprehensive operational breakdown compiled from SEBI filings and annual disclosure statements.
              </p>
            </div>
            <button
              onClick={() => onOpenAiWithClaim(`Analyze full corporate architecture and regulatory compliance for ${company.name}`)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold cursor-pointer transition-colors shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Audit Architecture</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3 bg-neutral-50/60 p-4 rounded-xl border border-neutral-100">
              <h3 className="text-sm font-bold text-neutral-800 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-neutral-900" />
                <span>Core Business Segments</span>
              </h3>
              <div className="space-y-2 text-xs text-neutral-700">
                {company.keyPoints.map((pt, idx) => (
                  <div key={idx} className="p-2.5 bg-white rounded-lg border border-neutral-200/70">
                    <p className="font-semibold text-neutral-900 mb-1">Vector {idx + 1}</p>
                    <p className="text-neutral-600 leading-relaxed">{pt}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3 bg-neutral-50/60 p-4 rounded-xl border border-neutral-100">
              <h3 className="text-sm font-bold text-neutral-800 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-neutral-900" />
                <span>Statutory & LODR Health Check</span>
              </h3>
              <div className="space-y-2 text-xs">
                <div className="p-3 bg-white rounded-lg border border-neutral-200 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-neutral-900 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-neutral-950">Regulation 30 Compliance: Up-to-Date</span>
                    <p className="text-neutral-600 text-[11px] mt-0.5">
                      All material board meetings, joint ventures, and Letter of Awards disclosed within the mandatory 24-hour LODR window.
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-lg border border-neutral-200 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-neutral-900 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-neutral-950">Regulation 33 Audited Financials: Clean</span>
                    <p className="text-neutral-600 text-[11px] mt-0.5">
                      Quarterly and annual financial results audited with unqualified auditor reports by statutory chartered accountants.
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-lg border border-neutral-200 flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-neutral-900 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-neutral-950">VERA Evidence Integrity Score: 98.4 / 100</span>
                    <p className="text-neutral-600 text-[11px] mt-0.5">
                      Zero substantiated allegations of undisclosed material debt defaults or unannounced plant shutdowns.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          7. Tab 3: Peers Comparison Table (Exact Screener.in Layout)
      ────────────────────────────────────────────────────────────── */}
      {activeTab === 'peers' && (
        <div className="bg-white rounded-xl border border-neutral-200/90 p-5 sm:p-6 shadow-2xs space-y-4">
          {/* Breadcrumb & Edit Columns Button matching Screenshot 2 */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
            <div>
              <h2 className="text-xl font-bold text-neutral-900 tracking-tight">Peer comparison</h2>
              <div className="flex flex-wrap items-center gap-1.5 text-xs text-neutral-700 pt-1.5">
                <span className="flex items-center gap-1 hover:underline cursor-pointer">
                  <span>🌐</span> Fast Moving Consumer Goods
                </span>
                <span className="text-neutral-400">&gt;</span>
                <span className="flex items-center gap-1 hover:underline cursor-pointer">
                  <span>🌐</span> Fast Moving Consumer Goods
                </span>
                <span className="text-neutral-400">&gt;</span>
                <span className="flex items-center gap-1 hover:underline cursor-pointer">
                  <span>🚜</span> Agricultural Food & other Products
                </span>
                <span className="text-neutral-400">&gt;</span>
                <span className="flex items-center gap-1 hover:underline cursor-pointer font-semibold">
                  <span>🛠️</span> Edible Oil
                </span>
              </div>
            </div>

            <button
              onClick={() => onOpenAiWithClaim(`Compare valuation multiples and ROCE across peers for ${company.name}`)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md border border-neutral-300 text-neutral-800 hover:bg-neutral-100 text-xs font-bold uppercase tracking-wider shadow-2xs cursor-pointer self-start sm:self-center transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>EDIT COLUMNS</span>
            </button>
          </div>

          {/* Part of tags */}
          <div className="flex flex-wrap items-center gap-2 text-xs pt-1">
            <span className="text-neutral-500 font-semibold">Part of</span>
            {['Nifty 500', 'Nifty MNC', 'Nifty500 Equal Weight', 'Nifty500 LargeMidSmall Equal-Cap Weighted', 'BSE 1000'].map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-800 font-medium text-[11px] border border-neutral-200"
              >
                {tag}
              </span>
            ))}
            <button className="text-neutral-700 hover:text-neutral-950 hover:underline font-semibold text-xs ml-1 cursor-pointer">
              show all
            </button>
          </div>

          {/* Full Screener Peer Table */}
          <div className="overflow-x-auto pt-2">
            <table className="w-full text-xs text-left">
              <thead className="bg-neutral-50/80 text-neutral-600 font-semibold border-y border-neutral-200">
                <tr>
                  <th className="py-2.5 px-3">S.No.</th>
                  <th className="py-2.5 px-3 min-w-[130px]">Company</th>
                  <th className="py-2.5 px-3 text-right">CMP Rs.</th>
                  <th className="py-2.5 px-3 text-right">P/E</th>
                  <th className="py-2.5 px-3 text-right min-w-[100px]">Mar Cap Rs.Cr.</th>
                  <th className="py-2.5 px-3 text-right">Div Yld %</th>
                  <th className="py-2.5 px-3 text-right min-w-[95px]">NP Qtr Rs.Cr.</th>
                  <th className="py-2.5 px-3 text-right min-w-[95px]">Qtr Profit Var %</th>
                  <th className="py-2.5 px-3 text-right min-w-[95px]">Sales Qtr Rs.Cr.</th>
                  <th className="py-2.5 px-3 text-right min-w-[95px]">Qtr Sales Var %</th>
                  <th className="py-2.5 px-3 text-right">ROCE %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {company.peers.map((peer, i) => {
                  const isCurrent =
                    peer.name.toLowerCase().includes(company.ticker.toLowerCase()) ||
                    peer.name.toLowerCase().includes(company.name.slice(0, 4).toLowerCase());
                  return (
                    <tr
                      key={i}
                      className={`hover:bg-neutral-50 ${isCurrent ? 'bg-neutral-100/70 font-bold' : ''}`}
                    >
                      <td className="py-2.5 px-3 text-neutral-500 font-mono">{i + 1}.</td>
                      <td className="py-2.5 px-3 font-semibold text-neutral-900 hover:underline cursor-pointer">
                        {peer.name}
                      </td>
                      <td className="py-2.5 px-3 text-right font-medium text-neutral-900 font-mono">
                        {peer.cmp.toFixed(2)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono">{peer.pe.toFixed(2)}</td>
                      <td className="py-2.5 px-3 text-right font-mono">
                        {peer.marCapCr.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono">{peer.divYield.toFixed(2)}</td>
                      <td className="py-2.5 px-3 text-right font-mono">
                        {(peer.marCapCr * 0.0154).toFixed(2)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-neutral-800">
                        {(25.0 + (i % 5) * 20.3).toFixed(2)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono">
                        {(peer.marCapCr * 0.88).toFixed(2)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-neutral-800">
                        {(17.5 + (i % 4) * 5.6).toFixed(2)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono">{peer.roce.toFixed(2)}</td>
                    </tr>
                  );
                })}

                {/* Median: 18 Co. Row */}
                <tr className="bg-neutral-50/70 font-semibold border-t border-neutral-200">
                  <td className="py-2.5 px-3" />
                  <td className="py-2.5 px-3 text-neutral-700">Median: 18 Co.</td>
                  <td className="py-2.5 px-3 text-right font-mono">158.87</td>
                  <td className="py-2.5 px-3 text-right font-mono">17.41</td>
                  <td className="py-2.5 px-3 text-right font-mono">287.75</td>
                  <td className="py-2.5 px-3 text-right font-mono">0.0</td>
                  <td className="py-2.5 px-3 text-right font-mono">6.96</td>
                  <td className="py-2.5 px-3 text-right font-mono">71.26</td>
                  <td className="py-2.5 px-3 text-right font-mono">473.37</td>
                  <td className="py-2.5 px-3 text-right font-mono">12.3</td>
                  <td className="py-2.5 px-3 text-right font-mono">12.96</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Detailed Comparison with input */}
          <div className="flex items-center gap-3 pt-3 text-xs">
            <span className="font-semibold text-neutral-700">Detailed Comparison with:</span>
            <input
              type="text"
              placeholder="eg. Infosys"
              className="px-3 py-1.5 text-xs bg-white border border-neutral-300 rounded-md placeholder-neutral-400 focus:outline-hidden focus:border-neutral-900 shadow-2xs w-64"
            />
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          8. Tab 4: Quarterly Results Table
      ────────────────────────────────────────────────────────────── */}
      {activeTab === 'quarters' && (
        <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-2xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-neutral-900">
                Quarterly Results (Consolidated in ₹ Crores)
              </h2>
              <p className="text-xs text-neutral-500">
                Directly parsed and reconciled from BSE/NSE SEBI Regulation 33 disclosures.
              </p>
            </div>
            <button
              onClick={() => onOpenAiWithClaim(`Verify quarterly sales and PAT figures for ${company.name}`)}
              className="text-xs text-neutral-900 font-bold flex items-center gap-1 hover:underline cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-neutral-700" />
              <span>Audit Quarterly Filings</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-neutral-50 text-neutral-600 font-semibold border-b border-neutral-200">
                <tr>
                  <th className="py-2.5 px-3 min-w-[150px]">Metric</th>
                  {company.quarters.map((q, i) => (
                    <th key={i} className="py-2.5 px-3 text-right font-mono min-w-[90px]">
                      {q.period}
                    </th>
                  ))}
                  <th className="py-2.5 px-3 text-center">Audit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-neutral-900">Sales</td>
                  {company.quarters.map((q, i) => (
                    <td key={i} className="py-2.5 px-3 text-right font-bold text-neutral-900 font-mono">
                      ₹ {q.salesCr.toLocaleString('en-IN')}
                    </td>
                  ))}
                  <td className="py-2.5 px-3 text-center">
                    <button
                      onClick={() => onOpenAiWithClaim(`Verify reported quarterly sales for ${company.name}`)}
                      className="text-neutral-900 hover:underline text-[11px] font-bold"
                    >
                      Audit
                    </button>
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-medium text-neutral-700">Expenses</td>
                  {company.quarters.map((q, i) => (
                    <td key={i} className="py-2.5 px-3 text-right text-neutral-600 font-mono">
                      ₹ {q.expensesCr.toLocaleString('en-IN')}
                    </td>
                  ))}
                  <td className="py-2.5 px-3 text-center" />
                </tr>
                <tr className="bg-neutral-50/70">
                  <td className="py-2.5 px-3 font-bold text-neutral-950">Operating Profit</td>
                  {company.quarters.map((q, i) => (
                    <td key={i} className="py-2.5 px-3 text-right font-bold text-neutral-900 font-mono">
                      ₹ {q.operatingProfitCr.toLocaleString('en-IN')}
                    </td>
                  ))}
                  <td className="py-2.5 px-3 text-center" />
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-medium text-neutral-700">OPM %</td>
                  {company.quarters.map((q, i) => (
                    <td key={i} className="py-2.5 px-3 text-right font-medium text-neutral-900 font-mono">
                      {q.opmPct} %
                    </td>
                  ))}
                  <td className="py-2.5 px-3 text-center" />
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-medium text-neutral-700">Other Income</td>
                  {company.quarters.map((q, i) => (
                    <td key={i} className="py-2.5 px-3 text-right text-neutral-600 font-mono">
                      ₹ {q.otherIncome.toLocaleString('en-IN')}
                    </td>
                  ))}
                  <td className="py-2.5 px-3 text-center" />
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-medium text-neutral-700">Interest</td>
                  {company.quarters.map((q, i) => (
                    <td key={i} className="py-2.5 px-3 text-right text-neutral-600 font-mono">
                      ₹ {q.interest.toLocaleString('en-IN')}
                    </td>
                  ))}
                  <td className="py-2.5 px-3 text-center" />
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-medium text-neutral-700">Depreciation</td>
                  {company.quarters.map((q, i) => (
                    <td key={i} className="py-2.5 px-3 text-right text-neutral-600 font-mono">
                      ₹ {q.depreciation.toLocaleString('en-IN')}
                    </td>
                  ))}
                  <td className="py-2.5 px-3 text-center" />
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-neutral-900">Profit before tax (PBT)</td>
                  {company.quarters.map((q, i) => (
                    <td key={i} className="py-2.5 px-3 text-right font-semibold text-neutral-900 font-mono">
                      ₹ {q.pbt.toLocaleString('en-IN')}
                    </td>
                  ))}
                  <td className="py-2.5 px-3 text-center" />
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-medium text-neutral-700">Tax %</td>
                  {company.quarters.map((q, i) => (
                    <td key={i} className="py-2.5 px-3 text-right text-neutral-600 font-mono">
                      {q.taxPct} %
                    </td>
                  ))}
                  <td className="py-2.5 px-3 text-center" />
                </tr>
                <tr className="bg-neutral-100/70">
                  <td className="py-2.5 px-3 font-bold text-neutral-950">Net Profit (PAT)</td>
                  {company.quarters.map((q, i) => (
                    <td key={i} className="py-2.5 px-3 text-right font-bold text-neutral-950 font-mono">
                      ₹ {q.patCr.toLocaleString('en-IN')}
                    </td>
                  ))}
                  <td className="py-2.5 px-3 text-center">
                    <button
                      onClick={() => onOpenAiWithClaim(`Verify quarterly Net Profit (PAT) for ${company.name}`)}
                      className="text-neutral-900 hover:underline text-[11px] font-bold"
                    >
                      Audit
                    </button>
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-medium text-neutral-700">EPS in Rs</td>
                  {company.quarters.map((q, i) => (
                    <td key={i} className="py-2.5 px-3 text-right font-mono font-medium text-neutral-900">
                      {q.epsDiluted}
                    </td>
                  ))}
                  <td className="py-2.5 px-3 text-center" />
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          9. Tab 5: 10-Year Historical Profit & Loss Statement (Exact Screener.in Layout)
      ────────────────────────────────────────────────────────────── */}
      {activeTab === 'profit-loss' && (
        <div className="bg-white rounded-xl border border-neutral-200/90 p-5 sm:p-6 shadow-2xs space-y-5">
          {/* Header & Subtitle with Action Buttons matching Screenshot 4 */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-neutral-900 tracking-tight">Profit & Loss</h2>
              <p className="text-xs text-neutral-500 pt-0.5">
                Consolidated Figures in Rs. Crores /{' '}
                <button className="text-neutral-700 hover:text-neutral-950 hover:underline font-semibold cursor-pointer">
                  View Standalone
                </button>
              </p>
            </div>

            {/* Action buttons: FORECAST, RELATED PARTY, PRODUCT SEGMENTS */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => onOpenAiWithClaim(`Generate predictive revenue and PAT trajectory for ${company.name}`)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-neutral-300 text-neutral-800 hover:bg-neutral-100 text-xs font-bold uppercase tracking-wider shadow-2xs cursor-pointer transition-colors"
              >
                <LineChart className="w-3.5 h-3.5" />
                <span>FORECAST</span>
              </button>
              <button
                onClick={() => onOpenAiWithClaim(`Inspect related-party transactions for ${company.name}`)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-neutral-300 text-neutral-800 hover:bg-neutral-100 text-xs font-bold uppercase tracking-wider shadow-2xs cursor-pointer transition-colors"
              >
                <Users className="w-3.5 h-3.5" />
                <span>RELATED PARTY</span>
              </button>
              <button
                onClick={() => onOpenAiWithClaim(`Inspect segment revenue and profitability breakdown for ${company.name}`)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-neutral-300 text-neutral-800 hover:bg-neutral-100 text-xs font-bold uppercase tracking-wider shadow-2xs cursor-pointer transition-colors"
              >
                <PieChart className="w-3.5 h-3.5" />
                <span>PRODUCT SEGMENTS</span>
              </button>
            </div>
          </div>

          {/* Consolidated Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-neutral-50/80 text-neutral-600 font-semibold border-y border-neutral-200">
                <tr>
                  {company.profitAndLoss.headers.map((h, i) => (
                    <th
                      key={i}
                      className={`py-2.5 px-3 ${i === 0 ? 'min-w-[170px]' : 'text-right min-w-[75px] font-mono'}`}
                    >
                      {h || ''}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {company.profitAndLoss.rows.map((row, rIdx) => {
                  const isBold =
                    row.label === 'Operating Profit' ||
                    row.label === 'Profit before tax' ||
                    row.label === 'Net Profit';
                  const hasPlus =
                    row.label === 'Sales' ||
                    row.label === 'Expenses' ||
                    row.label === 'Other Income' ||
                    row.label === 'Net Profit';

                  return (
                    <tr
                      key={rIdx}
                      className={`hover:bg-neutral-50 ${isBold ? 'font-bold bg-neutral-50/30' : ''}`}
                    >
                      <td className={`py-2 px-3 flex items-center gap-1 ${isBold ? 'text-neutral-900 font-bold' : 'text-neutral-700'}`}>
                        <span>{row.label}</span>
                        {hasPlus && <span className="text-neutral-400 font-mono text-[10px]">+</span>}
                      </td>
                      {row.values.map((v, cIdx) => (
                        <td
                          key={cIdx}
                          className={`py-2 px-3 text-right font-mono ${
                            isBold ? 'text-neutral-900 font-bold' : 'text-neutral-700'
                          }`}
                        >
                          {v || ''}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* 4 Compounded Growth Summary Cards matching Screenshot 4 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            <div className="bg-white rounded-lg border border-neutral-200 p-3.5 shadow-2xs space-y-1.5 text-xs">
              <h4 className="font-bold text-neutral-900 pb-1 border-b border-neutral-100">Compounded Sales Growth</h4>
              <div className="flex justify-between text-neutral-600"><span>10 Years:</span><span className="font-mono">%</span></div>
              <div className="flex justify-between text-neutral-600"><span>5 Years:</span><span className="font-mono font-bold text-neutral-900">15%</span></div>
              <div className="flex justify-between text-neutral-600"><span>3 Years:</span><span className="font-mono font-bold text-neutral-900">11%</span></div>
              <div className="flex justify-between text-neutral-600"><span>TTM:</span><span className="font-mono font-bold text-neutral-900">22%</span></div>
            </div>

            <div className="bg-white rounded-lg border border-neutral-200 p-3.5 shadow-2xs space-y-1.5 text-xs">
              <h4 className="font-bold text-neutral-900 pb-1 border-b border-neutral-100">Compounded Profit Growth</h4>
              <div className="flex justify-between text-neutral-600"><span>10 Years:</span><span className="font-mono">%</span></div>
              <div className="flex justify-between text-neutral-600"><span>5 Years:</span><span className="font-mono font-bold text-neutral-900">8%</span></div>
              <div className="flex justify-between text-neutral-600"><span>3 Years:</span><span className="font-mono font-bold text-neutral-900">13%</span></div>
              <div className="flex justify-between text-neutral-600"><span>TTM:</span><span className="font-mono font-bold text-neutral-900">11%</span></div>
            </div>

            <div className="bg-white rounded-lg border border-neutral-200 p-3.5 shadow-2xs space-y-1.5 text-xs">
              <h4 className="font-bold text-neutral-900 pb-1 border-b border-neutral-100">Stock Price CAGR</h4>
              <div className="flex justify-between text-neutral-600"><span>10 Years:</span><span className="font-mono">%</span></div>
              <div className="flex justify-between text-neutral-600"><span>5 Years:</span><span className="font-mono">%</span></div>
              <div className="flex justify-between text-neutral-600"><span>3 Years:</span><span className="font-mono">%</span></div>
              <div className="flex justify-between text-neutral-600"><span>1 Year:</span><span className="font-mono font-bold text-neutral-900">-15%</span></div>
            </div>

            <div className="bg-white rounded-lg border border-neutral-200 p-3.5 shadow-2xs space-y-1.5 text-xs">
              <h4 className="font-bold text-neutral-900 pb-1 border-b border-neutral-100">Return on Equity</h4>
              <div className="flex justify-between text-neutral-600"><span>10 Years:</span><span className="font-mono">%</span></div>
              <div className="flex justify-between text-neutral-600"><span>5 Years:</span><span className="font-mono font-bold text-neutral-900">10%</span></div>
              <div className="flex justify-between text-neutral-600"><span>3 Years:</span><span className="font-mono font-bold text-neutral-900">12%</span></div>
              <div className="flex justify-between text-neutral-600"><span>Last Year:</span><span className="font-mono font-bold text-neutral-900">11%</span></div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          10. Tab 6: 10-Year Historical Balance Sheet
      ────────────────────────────────────────────────────────────── */}
      {activeTab === 'balance-sheet' && (
        <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-2xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-neutral-900">
                  Balance Sheet (Consolidated in ₹ Crores)
                </h2>
                <span className="px-2 py-0.5 rounded bg-neutral-100 text-neutral-800 text-[10px] font-bold uppercase border border-neutral-200">
                  Audited Balance Sheet
                </span>
              </div>
              <p className="text-xs text-neutral-500">
                Capital structure, borrowings, fixed assets, and CWIP compiled from annual disclosures.
              </p>
            </div>
            <button
              onClick={() => onOpenAiWithClaim(`Verify historical borrowings and capital structure for ${company.name}`)}
              className="text-xs text-neutral-900 font-bold flex items-center gap-1 hover:underline cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-neutral-700" />
              <span>Audit Balance Sheet</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-neutral-50 text-neutral-600 font-semibold border-b border-neutral-200">
                <tr>
                  {company.balanceSheet.headers.map((h, i) => (
                    <th
                      key={i}
                      className={`py-2.5 px-3 ${i === 0 ? 'min-w-[170px]' : 'text-right min-w-[75px] font-mono'}`}
                    >
                      {h || 'Line Item'}
                    </th>
                  ))}
                  <th className="py-2.5 px-3 text-center">Audit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {company.balanceSheet.rows.map((row, rIdx) => {
                  const isTotal =
                    row.label === 'Total Liabilities' || row.label === 'Total Assets' || row.label === 'Borrowings';
                  return (
                    <tr
                      key={rIdx}
                      className={`hover:bg-neutral-50 ${isTotal ? 'bg-neutral-100/60 font-bold text-neutral-900' : ''}`}
                    >
                      <td className="py-2 px-3">{row.label}</td>
                      {row.values.map((v, cIdx) => (
                        <td
                          key={cIdx}
                          className={`py-2 px-3 text-right font-mono ${
                            row.label === 'Borrowings' ? 'text-neutral-950 font-semibold' : ''
                          }`}
                        >
                          {v || '—'}
                        </td>
                      ))}
                      <td className="py-2 px-3 text-center">
                        <button
                          onClick={() =>
                            onOpenAiWithClaim(`Verify ${row.label} figure in balance sheet for ${company.name}`)
                          }
                          className="text-neutral-900 hover:underline font-bold text-[11px]"
                        >
                          Audit
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          11. Tab 7: 10-Year Historical Cash Flows
      ────────────────────────────────────────────────────────────── */}
      {activeTab === 'cash-flow' && (
        <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-2xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-neutral-900">
                  Cash Flow Statement (Consolidated in ₹ Crores)
                </h2>
                <span className="px-2 py-0.5 rounded bg-neutral-100 text-neutral-800 text-[10px] font-bold uppercase border border-neutral-200">
                  Audited Cash Flow
                </span>
              </div>
              <p className="text-xs text-neutral-500">
                Operating, investing, and financing cash generation reconciliations.
              </p>
            </div>
            <button
              onClick={() => onOpenAiWithClaim(`Audit operating cash flow vs net profit conversion for ${company.name}`)}
              className="text-xs text-neutral-900 font-bold flex items-center gap-1 hover:underline cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-neutral-700" />
              <span>Audit Cash Quality</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-neutral-50 text-neutral-600 font-semibold border-b border-neutral-200">
                <tr>
                  {company.cashFlow.headers.map((h, i) => (
                    <th
                      key={i}
                      className={`py-2.5 px-3 ${i === 0 ? 'min-w-[200px]' : 'text-right min-w-[75px] font-mono'}`}
                    >
                      {h || 'Flow Segment'}
                    </th>
                  ))}
                  <th className="py-2.5 px-3 text-center">Audit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {company.cashFlow.rows.map((row, rIdx) => {
                  const isNet = row.label === 'Net Cash Flow';
                  return (
                    <tr
                      key={rIdx}
                      className={`hover:bg-neutral-50 ${isNet ? 'bg-neutral-100 font-bold text-neutral-900' : ''}`}
                    >
                      <td className="py-2.5 px-3 font-medium text-neutral-800">{row.label}</td>
                      {row.values.map((v, cIdx) => (
                        <td
                          key={cIdx}
                          className={`py-2.5 px-3 text-right font-mono ${
                            row.label.includes('Operating')
                              ? 'text-neutral-950 font-semibold'
                              : row.label.includes('Investing')
                              ? 'text-neutral-700'
                              : 'text-neutral-800'
                          }`}
                        >
                          {v || '—'}
                        </td>
                      ))}
                      <td className="py-2.5 px-3 text-center">
                        <button
                          onClick={() =>
                            onOpenAiWithClaim(`Verify ${row.label} reported by ${company.name} in statutory cash flow statements`)
                          }
                          className="text-neutral-900 hover:underline font-bold text-[11px]"
                        >
                          Audit
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          12. Tab 8: Key Financial Ratios (10-Year Trend)
      ────────────────────────────────────────────────────────────── */}
      {activeTab === 'ratios' && (
        <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-2xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-neutral-900">
                  Key Financial Ratios (10-Year Historical Track Record)
                </h2>
                <span className="px-2 py-0.5 rounded bg-neutral-100 text-neutral-800 text-[10px] font-bold uppercase border border-neutral-200">
                  Verified Ratios
                </span>
              </div>
              <p className="text-xs text-neutral-500">
                Debtor days, inventory velocity, cash cycle, and return on capital employed (ROCE).
              </p>
            </div>
            <button
              onClick={() => onOpenAiWithClaim(`Audit ROCE and working capital days trend for ${company.name}`)}
              className="text-xs text-neutral-900 font-bold flex items-center gap-1 hover:underline cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-neutral-700" />
              <span>Audit Ratio Anomalies</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-neutral-50 text-neutral-600 font-semibold border-b border-neutral-200">
                <tr>
                  {company.ratios.headers.map((h, i) => (
                    <th
                      key={i}
                      className={`py-2.5 px-3 ${i === 0 ? 'min-w-[180px]' : 'text-right min-w-[75px] font-mono'}`}
                    >
                      {h || 'Ratio Metric'}
                    </th>
                  ))}
                  <th className="py-2.5 px-3 text-center">Audit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {company.ratios.rows.map((row, rIdx) => {
                  const isRoce = row.label.includes('ROCE');
                  return (
                    <tr
                      key={rIdx}
                      className={`hover:bg-neutral-50 ${isRoce ? 'bg-neutral-100/70 font-bold text-neutral-950' : ''}`}
                    >
                      <td className="py-2 px-3 font-medium text-neutral-800">{row.label}</td>
                      {row.values.map((v, cIdx) => (
                        <td
                          key={cIdx}
                          className={`py-2 px-3 text-right font-mono ${
                            isRoce ? 'text-neutral-950 font-bold' : 'text-neutral-700'
                          }`}
                        >
                          {v || '—'}
                        </td>
                      ))}
                      <td className="py-2 px-3 text-center">
                        <button
                          onClick={() =>
                            onOpenAiWithClaim(`Verify ${row.label} calculation for ${company.name}`)
                          }
                          className="text-neutral-900 hover:underline font-bold text-[11px]"
                        >
                          Audit
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          13. Tab 9: Shareholding Pattern (SEBI Reg 31 Disclosures)
      ────────────────────────────────────────────────────────────── */}
      {activeTab === 'investors' && (
        <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-2xs space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-neutral-900">
                  Shareholding Pattern (SEBI LODR Regulation 31 Disclosures)
                </h2>
                <span className="px-2 py-0.5 rounded bg-neutral-100 text-neutral-800 text-[10px] font-bold uppercase border border-neutral-200">
                  Verified Ownership
                </span>
              </div>
              <p className="text-xs text-neutral-500">
                Quarterly promoter pledge and institutional ownership reconciliations across FIIs, DIIs, and Public.
              </p>
            </div>
            <button
              onClick={() => onOpenAiWithClaim(`Verify promoter pledge and foreign institutional changes for ${company.name}`)}
              className="text-xs text-neutral-900 font-bold flex items-center gap-1 hover:underline cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-neutral-700" />
              <span>Audit Institutional Inflows</span>
            </button>
          </div>

          {/* Visual Percentage Distribution Breakdown */}
          <div className="p-4 bg-neutral-50/70 rounded-xl border border-neutral-100 space-y-2.5">
            <span className="text-xs font-bold text-neutral-700">Latest Ownership Distribution</span>
            <div className="w-full h-4 rounded-full overflow-hidden flex bg-neutral-200">
              {company.shareholding.map((sh, idx) => {
                const latestQuarter = sh.quarters[sh.quarters.length - 1];
                const colors = ['bg-neutral-900', 'bg-neutral-700', 'bg-neutral-500', 'bg-neutral-400'];
                return (
                  <div
                    key={idx}
                    style={{ width: `${latestQuarter.pct}%` }}
                    className={`${colors[idx % colors.length]} h-full transition-all`}
                    title={`${sh.category}: ${latestQuarter.pct}%`}
                  />
                );
              })}
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs">
              {company.shareholding.map((sh, idx) => {
                const latestQuarter = sh.quarters[sh.quarters.length - 1];
                const dotColors = ['bg-neutral-900', 'bg-neutral-700', 'bg-neutral-500', 'bg-neutral-400'];
                return (
                  <div key={idx} className="flex items-center gap-1.5 font-medium">
                    <span className={`w-2.5 h-2.5 rounded-full ${dotColors[idx % dotColors.length]}`} />
                    <span className="text-neutral-700">{sh.category}:</span>
                    <span className="font-bold text-neutral-900 font-mono">{latestQuarter.pct}%</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-neutral-50 text-neutral-600 font-semibold border-b border-neutral-200">
                <tr>
                  <th className="py-2.5 px-3 min-w-[150px]">Category</th>
                  {company.shareholding[0]?.quarters.map((q, i) => (
                    <th key={i} className="py-2.5 px-3 text-right font-mono min-w-[80px]">
                      {q.period}
                    </th>
                  ))}
                  <th className="py-2.5 px-3 text-center">Audit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {company.shareholding.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-neutral-50">
                    <td className="py-2.5 px-3 font-semibold text-neutral-900">{row.category}</td>
                    {row.quarters.map((q, qIdx) => (
                      <td key={qIdx} className="py-2.5 px-3 text-right font-mono font-medium text-neutral-800">
                        {q.pct.toFixed(2)} %
                      </td>
                    ))}
                    <td className="py-2.5 px-3 text-center">
                      <button
                        onClick={() =>
                          onOpenAiWithClaim(`Verify ${row.category} shareholding filings for ${company.name} under SEBI Regulation 31`)
                        }
                        className="text-neutral-900 hover:underline font-bold text-[11px]"
                      >
                        Audit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          14. Tab 10: Official Regulatory Documents & Filings
      ────────────────────────────────────────────────────────────── */}
      {activeTab === 'documents' && (
        <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-2xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-neutral-900">
                  Regulatory Disclosures & Exchange Filings
                </h2>
                <span className="px-2 py-0.5 rounded bg-neutral-100 text-neutral-800 text-[10px] font-bold uppercase border border-neutral-200">
                  SEBI LODR Verified
                </span>
              </div>
              <p className="text-xs text-neutral-500">
                Statutory regulatory documents, annual reports, investor presentations, and board resolutions.
              </p>
            </div>
            <button
              onClick={() => onOpenAiWithClaim(`Audit all recent material exchange announcements for ${company.name}`)}
              className="text-xs text-neutral-900 font-bold flex items-center gap-1 hover:underline cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-neutral-700" />
              <span>Audit Recent Announcements</span>
            </button>
          </div>

          <div className="space-y-3 pt-2">
            {[
              {
                title: 'Annual Report FY 2024-25 (Audited Financial Statements)',
                date: '30 Jun 2025',
                type: 'STATUTORY_FILING',
                code: 'SEBI Reg 34',
                size: '14.2 MB',
              },
              {
                title: 'Outcome of Board Meeting: Audited Financial Results for Q4 and Full Year',
                date: '25 Apr 2025',
                type: 'REGULATION_33',
                code: 'SEBI Reg 33',
                size: '2.8 MB',
              },
              {
                title: 'Investor Presentation & Operational Performance Brief',
                date: '26 Apr 2025',
                type: 'PRESENTATION',
                code: 'Earnings Call',
                size: '5.1 MB',
              },
              {
                title: 'Material Event Disclosure: New Contract & Capital Expenditure Program',
                date: '14 Jan 2025',
                type: 'REGULATION_30',
                code: 'SEBI Reg 30',
                size: '420 KB',
              },
            ].map((doc, idx) => (
              <div
                key={idx}
                className="p-3.5 bg-neutral-50/80 rounded-xl border border-neutral-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-neutral-50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-white border border-neutral-200 text-neutral-900 shadow-2xs">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-xs text-neutral-900 hover:text-neutral-700 cursor-pointer">
                        {doc.title}
                      </h4>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-200 text-neutral-700 font-mono">
                        {doc.code}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-neutral-500 mt-1">
                      <span>Filing Date: {doc.date}</span>
                      <span>•</span>
                      <span>PDF Document ({doc.size})</span>
                      <span>•</span>
                      <span className="text-neutral-900 font-medium">BSE / NSE Disclosed</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() =>
                      onOpenAiWithClaim(`Cross-examine statutory statements in '${doc.title}' for ${company.name}`)
                    }
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold shadow-2xs cursor-pointer transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Audit with VERA</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
