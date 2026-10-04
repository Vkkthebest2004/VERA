'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';

interface VeraLandingPageProps {
  onLaunchTerminal: (companyId?: string) => void;
  onOpenVisualizer: () => void;
  onOpenWatchlist: () => void;
  onOpenIngestion: () => void;
  onOpenChat: () => void;
  onOpenEvidence: (claimText?: string) => void;
}

interface SearchableCompany {
  id: string;
  ticker: string;
  name: string;
  exchange: string;
  sector: string;
  price: number;
  changePercent: number;
  marketCapCr: number;
  pe: number;
  roce: number;
  roe: number;
  high52: number;
  low52: number;
  isFullyAudited: boolean;
  logoUrl?: string;
}

const AVAILABLE_COMPANIES: SearchableCompany[] = [
  {
    id: 'RELIANCE',
    ticker: 'RELIANCE',
    name: 'Reliance Industries Ltd',
    exchange: 'NSE: RELIANCE | BSE: 500325',
    sector: 'Conglomerate (Oil, Retail, Telecom)',
    price: 1168.0,
    changePercent: 1.45,
    marketCapCr: 1580194,
    pe: 21.2,
    roce: 10.3,
    roe: 8.91,
    high52: 1612,
    low52: 1161,
    isFullyAudited: true,
    logoUrl: '/reliance_icon.svg',
  },
  {
    id: 'TATAPOWER',
    ticker: 'TATAPOWER',
    name: 'Tata Power Company Ltd',
    exchange: 'NSE: TATAPOWER | BSE: 500400',
    sector: 'Utilities & Clean Energy',
    price: 412.5,
    changePercent: 2.1,
    marketCapCr: 131780,
    pe: 31.8,
    roce: 11.2,
    roe: 10.4,
    high52: 495,
    low52: 320,
    isFullyAudited: true,
    logoUrl: '/tatapower_logo.svg',
  },
  {
    id: 'AWL',
    ticker: 'AWL',
    name: 'Adani Wilmar Ltd',
    exchange: 'NSE: AWL | BSE: 543458',
    sector: 'FMCG & Edible Oils',
    price: 342.1,
    changePercent: -0.35,
    marketCapCr: 44460,
    pe: 48.2,
    roce: 14.1,
    roe: 11.8,
    high52: 418,
    low52: 285,
    isFullyAudited: true,
    logoUrl: '/adani_logo.svg',
  },
  {
    id: 'ALLETEC',
    ticker: 'ALLETEC',
    name: 'All E Technologies Ltd',
    exchange: 'NSE: ALLETEC | BSE: 543719',
    sector: 'IT Services & Cloud ERP',
    price: 289.4,
    changePercent: 3.2,
    marketCapCr: 612,
    pe: 24.5,
    roce: 22.0,
    roe: 18.5,
    high52: 340,
    low52: 175,
    isFullyAudited: true,
    logoUrl: '/alletec_logo.svg',
  },
];

export const VeraLandingPage: React.FC<VeraLandingPageProps> = ({
  onLaunchTerminal,
  onOpenVisualizer,
  onOpenWatchlist,
  onOpenIngestion,
  onOpenChat,
  onOpenEvidence,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtered search results
  const filteredResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return AVAILABLE_COMPANIES;
    return AVAILABLE_COMPANIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.ticker.toLowerCase().includes(q) ||
        c.exchange.toLowerCase().includes(q) ||
        c.sector.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  return (
    <div className="w-full min-h-screen bg-[#fcfcfd] text-neutral-900 selection:bg-neutral-900 selection:text-white flex flex-col justify-between">
      {/* ─────────────────────────────────────────────────────────────
          Search-First Institutional Core
      ────────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-12 sm:py-20">
        <div className="w-full max-w-3xl mx-auto text-center space-y-8">
          {/* Brand Header */}
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-3">
              <img src="/vera_icon.svg" alt="VERA Logo" className="w-12 h-12 object-contain" />
              <span className="text-4xl sm:text-5xl font-extrabold tracking-tight text-neutral-950 font-sans">
                VERA
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-neutral-950">
              Search Indian Equities
            </h1>
            <p className="text-sm sm:text-base text-neutral-600 max-w-lg mx-auto">
              Analyze audited financial statements, capital efficiency metrics, and official BSE &amp; NSE statutory disclosures.
            </p>
          </div>

          {/* Search Box & Dropdown */}
          <div ref={containerRef} className="relative max-w-2xl mx-auto text-left">
            <div
              className={`relative flex items-center bg-white rounded-2xl border-2 transition-all shadow-sm ${
                isDropdownOpen
                  ? 'border-neutral-950 ring-4 ring-neutral-100'
                  : 'border-neutral-300 hover:border-neutral-400'
              }`}
            >
              <Search className="w-5 h-5 text-neutral-400 ml-4 shrink-0" />
              <input
                id="front-page-search-input"
                type="text"
                value={searchQuery}
                onFocus={() => setIsDropdownOpen(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsDropdownOpen(true);
                }}
                placeholder="Search for a company (e.g. Reliance, Tata Power, Adani Wilmar)..."
                className="w-full py-4 pl-3 pr-10 text-sm font-medium text-neutral-900 bg-transparent placeholder-neutral-400 focus:outline-hidden"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                  }}
                  className="p-1.5 mr-3 text-neutral-400 hover:text-neutral-700 cursor-pointer"
                  title="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Instant Dropdown: Shows Available Companies or Search Filter */}
            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-neutral-200 shadow-2xl z-50 overflow-hidden divide-y divide-neutral-100 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-4 py-2 bg-neutral-50/90 border-b border-neutral-100 flex items-center justify-between text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
                  <span>
                    {searchQuery.trim()
                      ? `Matching Companies (${filteredResults.length})`
                      : 'Available Tracked Equities (4)'}
                  </span>
                  <span className="font-mono text-[10px] text-neutral-400">Click to Open Terminal</span>
                </div>

                {filteredResults.length > 0 ? (
                  <div className="divide-y divide-neutral-100 max-h-96 overflow-y-auto">
                    {filteredResults.map((c) => (
                      <div
                        key={c.id}
                        onMouseDown={() => {
                          setIsDropdownOpen(false);
                          onLaunchTerminal(c.id);
                        }}
                        className="p-3.5 hover:bg-neutral-50 transition-colors cursor-pointer flex items-center justify-between gap-4 group"
                      >
                        <div className="flex items-center gap-3">
                          {c.logoUrl ? (
                            <img
                              src={c.logoUrl}
                              alt={c.name}
                              className="w-10 h-10 object-contain p-1.5 rounded-xl border border-neutral-200 bg-neutral-50 shrink-0 group-hover:border-neutral-400 transition-colors"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-xl bg-neutral-900 text-white font-bold flex items-center justify-center shrink-0">
                              {c.ticker.slice(0, 2)}
                            </div>
                          )}
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-neutral-950 group-hover:text-neutral-900">
                                {c.name}
                              </span>
                              <span className="text-xs font-mono font-medium text-neutral-600 px-1.5 py-0.5 rounded bg-neutral-100 border border-neutral-200">
                                {c.ticker}
                              </span>
                              {c.isFullyAudited && (
                                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                                  SEBI AUDITED
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-neutral-500 mt-0.5">
                              {c.sector} &bull; <span className="font-mono text-[11px]">{c.exchange}</span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <div className="font-mono font-bold text-sm text-neutral-900">
                            ₹{c.price.toLocaleString('en-IN')}{' '}
                            <span
                              className={`text-xs font-semibold ${
                                c.changePercent >= 0 ? 'text-emerald-600' : 'text-rose-600'
                              }`}
                            >
                              {c.changePercent >= 0 ? '+' : ''}
                              {c.changePercent}%
                            </span>
                          </div>
                          <div className="text-[11px] text-neutral-500 font-mono mt-0.5">
                            MCap: ₹{(c.marketCapCr / 1000).toFixed(1)}k Cr &bull; P/E: {c.pe}x
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center text-sm text-neutral-500">
                    No matching companies found for &ldquo;{searchQuery}&rdquo;.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick-Access Pills for Available Companies */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs pt-1">
            <span className="text-neutral-400 font-medium mr-1">Available Companies:</span>
            {AVAILABLE_COMPANIES.map((c) => (
              <button
                key={c.id}
                onClick={() => onLaunchTerminal(c.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-neutral-100 border border-neutral-200 text-neutral-800 font-medium transition-all shadow-2xs hover:shadow-xs cursor-pointer group"
              >
                {c.logoUrl && (
                  <img src={c.logoUrl} alt="" className="w-3.5 h-3.5 object-contain" />
                )}
                <span className="font-semibold text-neutral-900">{c.name}</span>
                <span className="font-mono text-neutral-400 text-[11px]">({c.ticker})</span>
                <span className="font-mono font-bold text-neutral-900 text-[11px]">₹{c.price}</span>
              </button>
            ))}
          </div>


        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          Minimal Footer Note
      ────────────────────────────────────────────────────────────── */}
      <div className="py-4 border-t border-neutral-200/80 bg-white/70 text-center text-xs text-neutral-500 font-mono">
        VERA 2.0 &bull; SEBI LODR Regulation 30 &amp; 33 Reconciliation Engine &bull; BSE &amp; NSE Verified Data
      </div>
    </div>
  );
};
