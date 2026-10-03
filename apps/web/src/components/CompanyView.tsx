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
  Info,
} from 'lucide-react';
import { CompanyData } from '@/data/mockCompanies';

interface CompanyViewProps {
  company: CompanyData;
  onOpenAiWithClaim: (claimText: string) => void;
  onToggleWatchlist: (companyId: string) => void;
  isInWatchlist: boolean;
}

export const CompanyView: React.FC<CompanyViewProps> = ({
  company,
  onOpenAiWithClaim,
  onToggleWatchlist,
  isInWatchlist,
}) => {
  const [activeTab, setActiveTab] = useState<'chart' | 'analysis' | 'peers' | 'quarters' | 'documents'>('chart');
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
          1. Sub-navigation Bar (Matching Screener.in)
      ────────────────────────────────────────────────────────────── */}
      <div className="border-b border-neutral-200 flex items-center justify-between overflow-x-auto text-[13px] font-medium text-neutral-600 scrollbar-none">
        <div className="flex items-center gap-1 sm:gap-4 shrink-0">
          <button
            onClick={() => setActiveTab('chart')}
            className={`py-2 px-2 border-b-2 font-semibold transition-colors ${
              activeTab === 'chart'
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent hover:text-neutral-900'
            }`}
          >
            {company.name.split(' ')[0]} Tech
          </button>
          <button
            onClick={() => setActiveTab('chart')}
            className={`py-2 px-2 border-b-2 transition-colors ${
              activeTab === 'chart' ? 'text-neutral-900 font-semibold' : 'border-transparent hover:text-neutral-900'
            }`}
          >
            Chart
          </button>
          <button
            onClick={() => setActiveTab('analysis')}
            className={`py-2 px-2 border-b-2 transition-colors ${
              activeTab === 'analysis'
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent hover:text-neutral-900'
            }`}
          >
            Analysis
          </button>
          <button
            onClick={() => setActiveTab('peers')}
            className={`py-2 px-2 border-b-2 transition-colors ${
              activeTab === 'peers'
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent hover:text-neutral-900'
            }`}
          >
            Peers
          </button>
          <button
            onClick={() => setActiveTab('quarters')}
            className={`py-2 px-2 border-b-2 transition-colors ${
              activeTab === 'quarters'
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent hover:text-neutral-900'
            }`}
          >
            Quarters
          </button>
          <button className="py-2 px-2 border-b-2 border-transparent hover:text-neutral-900 hidden md:inline">
            Profit & Loss
          </button>
          <button className="py-2 px-2 border-b-2 border-transparent hover:text-neutral-900 hidden lg:inline">
            Balance Sheet
          </button>
          <button className="py-2 px-2 border-b-2 border-transparent hover:text-neutral-900 hidden lg:inline">
            Cash Flow
          </button>
          <button className="py-2 px-2 border-b-2 border-transparent hover:text-neutral-900 hidden md:inline">
            Ratios
          </button>
          <button className="py-2 px-2 border-b-2 border-transparent hover:text-neutral-900 hidden lg:inline">
            Investors
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`py-2 px-2 border-b-2 transition-colors ${
              activeTab === 'documents'
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent hover:text-neutral-900'
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

          {/* VERA AI Evidence Verification Button */}
          <button
            onClick={() => onOpenAiWithClaim(`Verify official Regulation 30 filings for ${company.name}`)}
            className="flex items-center gap-1 px-3 py-1 rounded-full bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>+ AI</span>
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. Company Header Card & Ratios Grid (Matching Image 1)
      ────────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-neutral-200/90 p-5 sm:p-6 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pb-6 border-b border-neutral-100">
          {/* Company Title, Price & External Links */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              {/* Logo */}
              <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                O
              </div>
              <h1 className="text-2xl sm:text-[26px] font-bold tracking-tight text-neutral-900">
                {company.name}
              </h1>
              <span className="text-neutral-400 font-normal text-xl">•</span>
              <span className="text-2xl sm:text-[26px] font-bold text-neutral-900">
                ₹ {company.price.toLocaleString('en-IN')}
              </span>
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded ${
                  company.changePercent >= 0
                    ? 'text-emerald-700 bg-emerald-50'
                    : 'text-rose-700 bg-rose-50'
                }`}
              >
                {company.changePercent >= 0 ? '▲' : '▼'} {Math.abs(company.changePercent)}%
              </span>
              <span className="text-xs text-neutral-500 font-normal">{company.closeDate}</span>
            </div>

            {/* Links */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-blue-600 font-medium pt-0.5">
              <a
                href={`https://${company.website}`}
                target="_blank"
                rel="noreferrer"
                className="hover:underline flex items-center gap-1 text-neutral-700 hover:text-blue-600"
              >
                <span>🔗 {company.website}</span>
              </a>
              <span className="text-neutral-300">•</span>
              <span className="flex items-center gap-1 text-neutral-700">
                <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400" />
                <span>{company.exchange}</span>
              </span>
            </div>
          </div>

          {/* Action Buttons: Export to Excel & Follow */}
          <div className="flex items-center gap-2.5">
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-300 hover:bg-neutral-50 text-neutral-700 text-xs font-semibold uppercase tracking-wider transition-colors shadow-2xs">
              <Download className="w-3.5 h-3.5" />
              <span>EXPORT TO EXCEL</span>
            </button>

            <button
              onClick={() => onToggleWatchlist(company.id)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer ${
                isInWatchlist
                  ? 'bg-purple-100 text-purple-800 border border-purple-300'
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
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
              <div className="border-b border-neutral-100 pb-2.5 flex items-baseline justify-between">
                <span className="text-neutral-500 text-xs">Market Cap</span>
                <span className="font-bold text-neutral-900">
                  ₹ {company.marketCapCr.toLocaleString('en-IN')} Cr.
                </span>
              </div>
              <div className="border-b border-neutral-100 pb-2.5 flex items-baseline justify-between">
                <span className="text-neutral-500 text-xs">Current Price</span>
                <span className="font-bold text-neutral-900">₹ {company.price}</span>
              </div>
              <div className="border-b border-neutral-100 pb-2.5 flex items-baseline justify-between">
                <span className="text-neutral-500 text-xs">High / Low</span>
                <span className="font-bold text-neutral-900">
                  ₹ {company.high52} / {company.low52}
                </span>
              </div>

              <div className="border-b border-neutral-100 pb-2.5 flex items-baseline justify-between">
                <span className="text-neutral-500 text-xs">Stock P/E</span>
                <span className="font-bold text-neutral-900">{company.pe}</span>
              </div>
              <div className="border-b border-neutral-100 pb-2.5 flex items-baseline justify-between">
                <span className="text-neutral-500 text-xs">Book Value</span>
                <span className="font-bold text-neutral-900">₹ {company.bookValue}</span>
              </div>
              <div className="border-b border-neutral-100 pb-2.5 flex items-baseline justify-between">
                <span className="text-neutral-500 text-xs">Dividend Yield</span>
                <span className="font-bold text-neutral-900">{company.dividendYield} %</span>
              </div>

              <div className="border-b border-neutral-100 pb-2.5 flex items-baseline justify-between">
                <span className="text-neutral-500 text-xs">ROCE</span>
                <span className="font-bold text-neutral-900">{company.roce} %</span>
              </div>
              <div className="border-b border-neutral-100 pb-2.5 flex items-baseline justify-between">
                <span className="text-neutral-500 text-xs">ROE</span>
                <span className="font-bold text-neutral-900">{company.roe} %</span>
              </div>
              <div className="border-b border-neutral-100 pb-2.5 flex items-baseline justify-between">
                <span className="text-neutral-500 text-xs">Face Value</span>
                <span className="font-bold text-neutral-900">₹ {company.faceValue}</span>
              </div>
            </div>

            {/* Add ratio to table input */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="relative max-w-xs w-full">
                <input
                  type="text"
                  placeholder="eg. Promoter holding"
                  className="w-full px-3 py-1.5 bg-neutral-50 border border-neutral-200 rounded-md text-xs placeholder-neutral-400 focus:outline-hidden focus:border-neutral-400"
                />
              </div>
              <button className="text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 tracking-wider uppercase">
                <Edit2 className="w-3 h-3" />
                <span>EDIT RATIOS</span>
              </button>
            </div>
          </div>

          {/* Right: About & Key Points (4 Cols) */}
          <div className="lg:col-span-4 bg-neutral-50/70 rounded-xl p-4 border border-neutral-100 space-y-4">
            <div>
              <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1.5">
                ABOUT
              </h3>
              <p className="text-xs text-neutral-700 leading-relaxed">
                {company.about}{' '}
                <span className="text-blue-600 font-mono text-[10px] cursor-pointer">[1]</span>
              </p>
            </div>

            <div>
              <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1.5">
                KEY POINTS
              </h3>
              <div className="space-y-1.5 text-xs text-neutral-700 leading-relaxed">
                {company.keyPoints.map((point, idx) => (
                  <p key={idx}>
                    {point}{' '}
                    <span className="text-blue-600 font-mono text-[10px] cursor-pointer">
                      [{idx + 1}]
                    </span>
                  </p>
                ))}
              </div>
              <button className="text-blue-600 hover:underline font-bold text-[11px] mt-2 block tracking-wider uppercase">
                READ MORE &gt;
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          4. Interactive Stock Chart Card (Matching Image 1)
      ────────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-neutral-200/90 p-5 shadow-2xs space-y-4">
        {/* Top Controls: Timeframes on Left, Options on Right */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-neutral-100">
          {/* Timeframe Selectors */}
          <div className="flex items-center gap-1">
            {(['1M', '6M', '1Yr', '3Yr', '5Yr', 'Max'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setActiveTimeframe(tf)}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  activeTimeframe === tf
                    ? 'bg-blue-50 text-blue-600 font-bold border border-blue-200 shadow-2xs'
                    : 'text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Right Toggles: Price, PE Ratio, Alerts */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setChartMode('Price')}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                chartMode === 'Price'
                  ? 'bg-blue-50 text-blue-600 font-bold border border-blue-200'
                  : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              Price
            </button>
            <button
              onClick={() => setChartMode('PE Ratio')}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                chartMode === 'PE Ratio'
                  ? 'bg-blue-50 text-blue-600 font-bold border border-blue-200'
                  : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              PE Ratio
            </button>
            <button className="px-2.5 py-1 text-xs text-neutral-600 hover:bg-neutral-100 rounded">
              More ⌵
            </button>
            <button className="flex items-center gap-1 px-3 py-1 text-xs bg-amber-50 text-amber-800 border border-amber-200 rounded font-semibold hover:bg-amber-100 transition-colors">
              <Bell className="w-3.5 h-3.5 text-amber-600" />
              <span>Alerts</span>
            </button>
          </div>
        </div>

        {/* SVG Stock Curve Chart */}
        <div className="relative w-full overflow-hidden">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="w-full h-72 sm:h-80 select-none"
          >
            <defs>
              <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            <line
              x1={padding.left}
              y1={padding.top}
              x2={chartWidth - padding.right}
              y2={padding.top}
              stroke="#f1f5f9"
              strokeDasharray="4 4"
            />
            <line
              x1={padding.left}
              y1={chartHeight / 2}
              x2={chartWidth - padding.right}
              y2={chartHeight / 2}
              stroke="#f1f5f9"
              strokeDasharray="4 4"
            />
            <line
              x1={padding.left}
              y1={chartHeight - padding.bottom}
              x2={chartWidth - padding.right}
              y2={chartHeight - padding.bottom}
              stroke="#e2e8f0"
            />

            {/* Volume Bars at bottom */}
            {currentChartPoints.map((p, idx) => {
              const x = getX(idx);
              const barH = (p.volume / 450) * 80;
              return (
                <rect
                  key={idx}
                  x={x - 4}
                  y={chartHeight - padding.bottom - barH}
                  width="8"
                  height={barH}
                  fill="#93c5fd"
                  opacity="0.5"
                />
              );
            })}

            {/* Area Fill */}
            <path d={areaD} fill="url(#blueGradient)" />

            {/* Main Price Line */}
            <path
              d={pathD}
              fill="none"
              stroke="#2563eb"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* X-axis date labels */}
            {currentChartPoints.map((p, idx) => {
              if (idx % 2 === 0 || idx === currentChartPoints.length - 1) {
                return (
                  <text
                    key={idx}
                    x={getX(idx)}
                    y={chartHeight - 12}
                    textAnchor="middle"
                    className="text-[11px] fill-neutral-400 font-mono"
                  >
                    {p.x}
                  </text>
                );
              }
              return null;
            })}

            {/* Left Y-axis labels (Volume) */}
            <text x="10" y={padding.top + 40} className="text-[10px] fill-neutral-400 font-mono">
              140k
            </text>
            <text x="10" y={padding.top + 100} className="text-[10px] fill-neutral-400 font-mono">
              120k
            </text>
            <text x="10" y={padding.top + 160} className="text-[10px] fill-neutral-400 font-mono">
              100k
            </text>

            {/* Right Y-axis labels (Price) */}
            <text
              x={chartWidth - 35}
              y={padding.top + 20}
              className="text-[10px] fill-neutral-500 font-mono font-semibold"
            >
              {Math.round(maxY)}
            </text>
            <text
              x={chartWidth - 35}
              y={chartHeight / 2}
              className="text-[10px] fill-neutral-500 font-mono font-semibold"
            >
              {Math.round((maxY + minY) / 2)}
            </text>
            <text
              x={chartWidth - 35}
              y={chartHeight - padding.bottom}
              className="text-[10px] fill-neutral-500 font-mono font-semibold"
            >
              {Math.round(minY)}
            </text>

            {/* Interactive Points on hover */}
            {currentChartPoints.map((p, idx) => (
              <circle
                key={idx}
                cx={getX(idx)}
                cy={getY(p.y)}
                r="5"
                className="fill-blue-600 hover:fill-blue-800 transition-all cursor-pointer opacity-0 hover:opacity-100"
                onMouseEnter={() => setHoveredPoint(p)}
                onMouseLeave={() => setHoveredPoint(null)}
              />
            ))}
          </svg>

          {/* Hover Crosshair Card */}
          {hoveredPoint && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-neutral-900 text-white px-3 py-1.5 rounded shadow-lg text-xs font-mono z-10 flex items-center gap-3">
              <span>{hoveredPoint.x}</span>
              <span className="text-emerald-400 font-bold">₹ {hoveredPoint.y}</span>
              <span className="text-neutral-400">Vol: {hoveredPoint.volume}k</span>
            </div>
          )}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          5. VERA Statutory Evidence Banner (Direct AI Hook)
      ────────────────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-purple-900 to-indigo-950 text-white rounded-xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-purple-500/30 text-purple-300">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <span className="font-bold text-sm">SEBI Regulation 30 Statutory Audit</span>
            <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono uppercase font-bold">
              VERA Active
            </span>
          </div>
          <p className="text-xs text-purple-200/90 max-w-2xl">
            Audit social rumors, WhatsApp forwards, or exaggerated order figures for {company.name} against verified BSE/NSE exchange disclosures.
          </p>
        </div>

        {/* Quick Sample Rumor Audit Chips */}
        <div className="flex flex-wrap items-center gap-2">
          {company.sampleClaims.slice(0, 2).map((item, idx) => (
            <button
              key={idx}
              onClick={() => onOpenAiWithClaim(item.claim)}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors border border-white/10 flex items-center gap-1.5"
            >
              <Sparkles className="w-3 h-3 text-purple-300" />
              <span>Audit: {item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          6. Tab Details: Peers & Quarters
      ────────────────────────────────────────────────────────────── */}
      {activeTab === 'peers' && (
        <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-2xs space-y-3">
          <h2 className="text-base font-bold text-neutral-900">Peer Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-neutral-50 text-neutral-600 font-semibold border-b border-neutral-200">
                <tr>
                  <th className="py-2.5 px-3">Name</th>
                  <th className="py-2.5 px-3">CMP Rs.</th>
                  <th className="py-2.5 px-3">P/E</th>
                  <th className="py-2.5 px-3">Mar Cap Rs.Cr.</th>
                  <th className="py-2.5 px-3">Div Yld %</th>
                  <th className="py-2.5 px-3">ROCE %</th>
                  <th className="py-2.5 px-3">Audit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {company.peers.map((peer, i) => (
                  <tr key={i} className="hover:bg-neutral-50">
                    <td className="py-2.5 px-3 font-semibold text-blue-600 cursor-pointer">
                      {peer.name}
                    </td>
                    <td className="py-2.5 px-3 font-bold text-neutral-900">
                      ₹ {peer.cmp.toLocaleString('en-IN')}
                    </td>
                    <td className="py-2.5 px-3">{peer.pe}</td>
                    <td className="py-2.5 px-3 font-medium">
                      ₹ {peer.marCapCr.toLocaleString('en-IN')}
                    </td>
                    <td className="py-2.5 px-3">{peer.divYield} %</td>
                    <td className="py-2.5 px-3">{peer.roce} %</td>
                    <td className="py-2.5 px-3">
                      <button
                        onClick={() =>
                          onOpenAiWithClaim(`Verify recent news and Regulation 30 filings for ${peer.name}`)
                        }
                        className="text-purple-600 hover:text-purple-800 font-bold flex items-center gap-1"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Check</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'quarters' && (
        <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-2xs space-y-3">
          <h2 className="text-base font-bold text-neutral-900">Quarterly Results (Rs. Cr.)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-neutral-50 text-neutral-600 font-semibold border-b border-neutral-200">
                <tr>
                  <th className="py-2.5 px-3">Metric</th>
                  {company.quarters.map((q, i) => (
                    <th key={i} className="py-2.5 px-3">
                      {q.period}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                <tr>
                  <td className="py-2.5 px-3 font-medium text-neutral-700">Sales</td>
                  {company.quarters.map((q, i) => (
                    <td key={i} className="py-2.5 px-3 font-semibold text-neutral-900">
                      ₹ {q.salesCr.toLocaleString('en-IN')}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-medium text-neutral-700">Expenses</td>
                  {company.quarters.map((q, i) => (
                    <td key={i} className="py-2.5 px-3 text-neutral-600">
                      ₹ {q.expensesCr.toLocaleString('en-IN')}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-medium text-neutral-700">Operating Profit</td>
                  {company.quarters.map((q, i) => (
                    <td key={i} className="py-2.5 px-3 font-bold text-emerald-700">
                      ₹ {q.operatingProfitCr.toLocaleString('en-IN')}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-medium text-neutral-700">OPM %</td>
                  {company.quarters.map((q, i) => (
                    <td key={i} className="py-2.5 px-3 font-medium text-neutral-900">
                      {q.opmPct} %
                    </td>
                  ))}
                </tr>
                <tr className="bg-neutral-50/50">
                  <td className="py-2.5 px-3 font-bold text-neutral-900">Net Profit (PAT)</td>
                  {company.quarters.map((q, i) => (
                    <td key={i} className="py-2.5 px-3 font-bold text-neutral-900">
                      ₹ {q.patCr.toLocaleString('en-IN')}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
