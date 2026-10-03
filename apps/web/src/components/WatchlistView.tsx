'use client';

import React, { useState } from 'react';
import {
  Copy,
  Plus,
  TrendingUp,
  FileText,
  Building,
  ChevronRight,
  Flame,
  Play,
  Sparkles,
  ShieldCheck,
  Check,
  Trash2,
  ExternalLink,
  ChevronDown,
  LayoutGrid,
  List,
} from 'lucide-react';
import { COMPANIES, CompanyData } from '@/data/mockCompanies';

interface WatchlistViewProps {
  watchlistIds: string[];
  onAddCompany: (companyId: string) => void;
  onRemoveCompany: (companyId: string) => void;
  onSelectCompany: (companyId: string) => void;
  onOpenAiWithClaim: (claimText: string) => void;
}

export const WatchlistView: React.FC<WatchlistViewProps> = ({
  watchlistIds,
  onAddCompany,
  onRemoveCompany,
  onSelectCompany,
  onOpenAiWithClaim,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [watchlistName, setWatchlistName] = useState('Core Watchlist');
  const [isListDropdownOpen, setIsListDropdownOpen] = useState(false);

  const watchlistCompanies = watchlistIds
    .map((id) => COMPANIES[id])
    .filter((c): c is CompanyData => Boolean(c));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* ─────────────────────────────────────────────────────────────
          1. Sub-Header: Core Watchlist Dropdown & View Mode Switcher
      ────────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-4">
        {/* Dropdown for Watchlists */}
        <div className="relative">
          <button
            onClick={() => setIsListDropdownOpen(!isListDropdownOpen)}
            className="flex items-center gap-2 text-xl font-bold tracking-tight text-neutral-900 hover:text-neutral-700 transition-colors"
          >
            <span className="text-neutral-500 font-normal">☰</span>
            <span>{watchlistName}</span>
            <ChevronDown className="w-4 h-4 text-neutral-500" />
          </button>

          {isListDropdownOpen && (
            <div className="absolute top-full left-0 mt-1.5 w-56 bg-white rounded-lg shadow-xl border border-neutral-200 py-1.5 z-40">
              {['Core Watchlist', 'High Growth Tech', 'Dividend Champions', 'Green Energy'].map(
                (name) => (
                  <button
                    key={name}
                    onClick={() => {
                      setWatchlistName(name);
                      setIsListDropdownOpen(false);
                    }}
                    className={`w-full px-3.5 py-2 text-left text-xs font-semibold flex items-center justify-between ${
                      watchlistName === name
                        ? 'bg-purple-50 text-purple-700'
                        : 'text-neutral-700 hover:bg-neutral-50'
                    }`}
                  >
                    <span>{name}</span>
                    {watchlistName === name && <Check className="w-3.5 h-3.5" />}
                  </button>
                )
              )}
            </div>
          )}
        </div>

        {/* Watchlist View Switcher (Image 2 right button) */}
        <div className="flex items-center rounded-lg border border-neutral-300 p-0.5 bg-white text-xs text-neutral-600 shadow-2xs">
          <button
            onClick={() => setViewMode('table')}
            className={`px-3 py-1 rounded flex items-center gap-1.5 font-medium transition-colors ${
              viewMode === 'table'
                ? 'bg-neutral-100 text-neutral-900 font-bold'
                : 'hover:text-neutral-900'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">WATCHLIST VIEW</span>
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`px-2 py-1 rounded transition-colors ${
              viewMode === 'grid'
                ? 'bg-neutral-100 text-neutral-900 font-bold'
                : 'hover:text-neutral-900'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. Two-Column Layout (Matching Image 2)
      ────────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Main Content (Empty State or Watchlist Table) */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-neutral-200/90 shadow-2xs min-h-[460px] flex flex-col justify-center">
          {watchlistCompanies.length === 0 ? (
            /* Empty State exactly matching Image 2 */
            <div className="py-20 px-6 text-center max-w-md mx-auto space-y-4">
              <div className="flex justify-center">
                <div className="w-14 h-14 rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-400 border border-neutral-200">
                  <Copy className="w-7 h-7 stroke-1.5" />
                </div>
              </div>
              <div className="space-y-1.5">
                <h2 className="text-xl font-bold text-neutral-900">Add companies to watchlist</h2>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  Keep track of latest announcements, insider trades and credit ratings of your companies.
                </p>
              </div>
              <div className="pt-2">
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="px-6 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-xs cursor-pointer inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>ADD COMPANIES</span>
                </button>
              </div>
            </div>
          ) : (
            /* Populated Watchlist Table */
            <div className="p-4 sm:p-5 flex flex-col h-full justify-between space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <div className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                  Tracked Companies ({watchlistCompanies.length})
                </div>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="text-xs text-purple-600 hover:text-purple-800 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Company</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider border-b border-neutral-100">
                    <tr>
                      <th className="py-2 px-3">Company</th>
                      <th className="py-2 px-3">Price</th>
                      <th className="py-2 px-3">Change</th>
                      <th className="py-2 px-3">Mar Cap</th>
                      <th className="py-2 px-3">P/E</th>
                      <th className="py-2 px-3 text-right">Audit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {watchlistCompanies.map((c) => (
                      <tr key={c.id} className="hover:bg-neutral-50/80 transition-colors group">
                        <td className="py-3 px-3">
                          <button
                            onClick={() => onSelectCompany(c.id)}
                            className="text-left font-bold text-neutral-900 group-hover:text-blue-600 transition-colors block"
                          >
                            <div>{c.name}</div>
                            <div className="text-[10px] text-neutral-400 font-mono">{c.ticker}</div>
                          </button>
                        </td>
                        <td className="py-3 px-3 font-bold text-neutral-900">
                          ₹ {c.price.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-1.5 py-0.5 rounded font-semibold text-[11px] ${
                              c.changePercent >= 0
                                ? 'text-emerald-700 bg-emerald-50'
                                : 'text-rose-700 bg-rose-50'
                            }`}
                          >
                            {c.changePercent >= 0 ? '▲' : '▼'} {Math.abs(c.changePercent)}%
                          </span>
                        </td>
                        <td className="py-3 px-3 text-neutral-600 font-medium">
                          ₹ {c.marketCapCr.toLocaleString('en-IN')} Cr.
                        </td>
                        <td className="py-3 px-3 text-neutral-600">{c.pe}</td>
                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() =>
                                onOpenAiWithClaim(
                                  `Verify official Regulation 30 filings and recent rumors for ${c.name}`
                                )
                              }
                              className="px-2.5 py-1 rounded bg-purple-50 text-purple-700 hover:bg-purple-100 font-bold text-[11px] flex items-center gap-1 transition-colors cursor-pointer border border-purple-200"
                              title="Audit with VERA"
                            >
                              <Sparkles className="w-3 h-3 text-purple-600" />
                              <span>Audit</span>
                            </button>
                            <button
                              onClick={() => onRemoveCompany(c.id)}
                              className="text-neutral-400 hover:text-rose-600 p-1 transition-colors"
                              title="Remove from watchlist"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar: Quick Links & Power Feature Card (Image 2) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Quick Links Card */}
          <div className="bg-white rounded-xl border border-neutral-200/90 shadow-2xs divide-y divide-neutral-100 overflow-hidden text-xs">
            <button
              onClick={() => onOpenAiWithClaim('Audit market-wide Nifty 50 Regulation 30 corporate disclosures')}
              className="w-full px-4 py-3 text-left hover:bg-neutral-50 flex items-center justify-between text-neutral-800 font-medium transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <TrendingUp className="w-4 h-4 text-neutral-500" />
                <span>Market Pulse</span>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-400" />
            </button>

            <button
              onClick={() => onOpenAiWithClaim('Reconcile recent Q3 earnings announcements and profit growth numbers')}
              className="w-full px-4 py-3 text-left hover:bg-neutral-50 flex items-center justify-between text-neutral-800 font-medium transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <FileText className="w-4 h-4 text-neutral-500" />
                <span>Quarterly Results</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold">
                  0 new
                </span>
                <ChevronRight className="w-4 h-4 text-neutral-400" />
              </div>
            </button>

            <button
              onClick={() => onOpenAiWithClaim('Check statutory SEBI DRHP prospectus and upcoming IPO filings')}
              className="w-full px-4 py-3 text-left hover:bg-neutral-50 flex items-center justify-between text-neutral-800 font-medium transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Building className="w-4 h-4 text-neutral-500" />
                <span>Upcoming IPOs</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold">
                  12 open
                </span>
                <ChevronRight className="w-4 h-4 text-neutral-400" />
              </div>
            </button>
          </div>

          {/* Power Feature Promo Card (Matching Screener UI) */}
          <div className="bg-white rounded-xl border border-neutral-200/90 shadow-2xs overflow-hidden">
            {/* Screener UI Mockup Graphic with Purple Play Button */}
            <div className="h-44 bg-gradient-to-b from-slate-100 to-indigo-50/60 p-3 relative flex flex-col justify-between overflow-hidden border-b border-neutral-100 select-none">
              {/* Top search & user bar mockup */}
              <div className="flex items-center justify-between gap-2 text-[10px] text-neutral-400">
                <div className="flex items-center gap-1 bg-white/90 border border-neutral-200 rounded px-2 py-0.5 shadow-2xs">
                  <span className="text-neutral-400">🔍</span>
                  <span className="truncate max-w-[90px]">Search for a company</span>
                </div>
                <div className="flex items-center gap-1 font-semibold text-neutral-600 bg-white/90 border border-neutral-200 rounded px-1.5 py-0.5">
                  <span>PRATYUSH</span>
                  <span>⌵</span>
                </div>
              </div>

              {/* Middle navigation links mockup */}
              <div className="flex items-center gap-2 text-[9px] text-neutral-400 pl-1">
                <span>Ratios</span>
                <span>Investors</span>
                <span>Documents</span>
                <span className="ml-auto text-neutral-500">📓 Notebook</span>
              </div>

              {/* Action chips: Price, PE Ratio, More, Alerts */}
              <div className="flex items-center gap-1.5 text-[9px] z-10 pl-1">
                <span className="px-1.5 py-0.5 bg-blue-50 text-blue-600 border border-blue-200 rounded font-semibold">
                  Price
                </span>
                <span className="px-1.5 py-0.5 bg-white text-neutral-500 border border-neutral-200 rounded">
                  PE Ratio
                </span>
                <span className="px-1.5 py-0.5 bg-white text-neutral-500 border border-neutral-200 rounded">
                  More ⌵
                </span>
                <span className="ml-auto px-1.5 py-0.5 bg-white text-amber-800 border border-amber-200 rounded font-bold flex items-center gap-0.5 shadow-2xs">
                  🔔 Alerts
                </span>
              </div>

              {/* Blue Chart wave background */}
              <div className="absolute inset-0 top-12 opacity-85 pointer-events-none">
                <svg viewBox="0 0 360 140" className="w-full h-full">
                  <defs>
                    <linearGradient id="alertGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#818cf8" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#818cf8" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 0,90 Q 40,65 90,85 T 180,60 T 270,95 T 360,40 L 360,140 L 0,140 Z"
                    fill="url(#alertGrad)"
                  />
                  <path
                    d="M 0,90 Q 40,65 90,85 T 180,60 T 270,95 T 360,40"
                    fill="none"
                    stroke="#4f46e5"
                    strokeWidth="2"
                  />
                </svg>
              </div>

              {/* Prominent Purple Circular Play Button */}
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <button
                  onClick={() =>
                    onOpenAiWithClaim('How do stock price alerts and SEBI circuit filters work in Screener and VERA?')
                  }
                  className="w-11 h-11 rounded-full bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110 cursor-pointer border-2 border-white/80"
                >
                  <Play className="w-5 h-5 ml-0.5 fill-white" />
                </button>
              </div>
            </div>

            {/* Promo Content */}
            <div className="p-4 space-y-2">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                <Flame className="w-3 h-3 text-amber-600" />
                <span>Power Feature</span>
              </span>

              <h3 className="text-sm font-bold text-neutral-900">Stock Alerts</h3>

              <p className="text-xs text-neutral-600 leading-relaxed">
                Get notified if the price reaches your buy zone. Even after years. Set and forget.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. Modal to Add Companies to Watchlist
      ────────────────────────────────────────────────────────────── */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-neutral-200 max-w-md w-full p-5 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
              <h3 className="font-bold text-sm text-neutral-900">Add to Watchlist</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-700 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-neutral-500">
              Select verified listed companies to track announcements, ratios, and live evidence:
            </p>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {Object.values(COMPANIES).map((company) => {
                const added = watchlistIds.includes(company.id);
                return (
                  <div
                    key={company.id}
                    className="flex items-center justify-between p-2.5 rounded-lg border border-neutral-100 hover:bg-neutral-50 text-xs transition-colors"
                  >
                    <div>
                      <div className="font-bold text-neutral-900">{company.name}</div>
                      <div className="text-[11px] text-neutral-400 font-mono">
                        {company.ticker} • ₹{company.price}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        if (added) {
                          onRemoveCompany(company.id);
                        } else {
                          onAddCompany(company.id);
                        }
                      }}
                      className={`px-3 py-1 rounded text-xs font-bold transition-colors cursor-pointer ${
                        added
                          ? 'bg-neutral-100 text-neutral-700 border border-neutral-200'
                          : 'bg-purple-600 hover:bg-purple-700 text-white'
                      }`}
                    >
                      {added ? 'Added' : '+ Add'}
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
