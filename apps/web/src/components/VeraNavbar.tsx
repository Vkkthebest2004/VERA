'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  ChevronDown,
  User,
  Sparkles,
  Bookmark,
  TrendingUp,
  FileSpreadsheet,
  Building,
  ShieldCheck,
  Menu,
  X,
  MessageSquare,
  LayoutGrid,
} from 'lucide-react';
import { COMPANIES, CompanyData } from '@/data/mockCompanies';

interface VeraNavbarProps {
  currentView: 'visualizer' | 'company' | 'watchlist' | 'raw_ingestion' | 'bento';
  onViewChange: (view: 'visualizer' | 'company' | 'watchlist' | 'raw_ingestion' | 'bento') => void;
  selectedCompanyId: string;
  onSelectCompany: (companyId: string) => void;
  onToggleAiSidebar?: () => void;
  onOpenChat?: () => void;
  onOpenEvidence?: () => void;
  isAiSidebarOpen: boolean;
  activeDrawerMode?: 'chat' | 'evidence' | null;
  watchlistCount: number;
}

export const VeraNavbar: React.FC<VeraNavbarProps> = ({
  currentView,
  onViewChange,
  selectedCompanyId,
  onSelectCompany,
  onToggleAiSidebar,
  onOpenChat,
  onOpenEvidence,
  isAiSidebarOpen,
  activeDrawerMode,
  watchlistCount,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Filter companies based on search input
  const searchResults = Object.values(COMPANIES).filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.ticker.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-neutral-200 text-neutral-800 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* Left: Brand Logo & Navigation Links */}
        <div className="flex items-center gap-6 md:gap-8">
          {/* VERA Brand Logo */}
          <button
            onClick={() => onViewChange('company')}
            className="flex items-center gap-1.5 focus:outline-hidden group cursor-pointer"
          >
            <span className="text-2xl font-bold tracking-tight text-neutral-950 transition-colors">
              vera<span className="text-neutral-400 font-medium">.ai</span>
            </span>
            <div className="flex items-end gap-[3px] h-5 mb-0.5">
              <span className="w-1.5 h-3.5 bg-neutral-900 rounded-[1px]" />
              <span className="w-1.5 h-5 bg-neutral-900 rounded-[1px]" />
            </div>
          </button>

          {/* Primary Nav Menu: FEED, SCREENS, TOOLS */}
          <nav className="hidden md:flex items-center gap-6 text-[13px] font-medium text-neutral-700">
            <button
              onClick={() => onViewChange('company')}
              className={`hover:text-neutral-950 transition-colors uppercase tracking-wider font-semibold ${
                currentView === 'company'
                  ? 'text-neutral-950 font-bold border-b-2 border-neutral-900 pb-[17px] mt-[17px]'
                  : 'text-neutral-600'
              }`}
            >
              FEED
            </button>

            <button
              onClick={() => onViewChange('watchlist')}
              className={`hover:text-neutral-950 transition-colors uppercase tracking-wider font-semibold ${
                currentView === 'watchlist'
                  ? 'text-neutral-950 font-bold border-b-2 border-neutral-900 pb-[17px] mt-[17px]'
                  : 'text-neutral-600'
              }`}
            >
              SCREENS
            </button>

            <button
              onClick={() => onViewChange('visualizer')}
              className={`hover:text-neutral-950 transition-colors uppercase tracking-wider font-semibold flex items-center gap-1.5 ${
                currentView === 'visualizer'
                  ? 'text-neutral-950 font-bold border-b-2 border-neutral-900 pb-[17px] mt-[17px]'
                  : 'text-neutral-600 hover:text-neutral-950'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-neutral-800" />
              <span>VISUALIZER</span>
            </button>

            <div className="relative">
              <button
                onClick={() => setIsToolsOpen(!isToolsOpen)}
                className="hover:text-neutral-950 transition-colors uppercase tracking-wider font-semibold text-neutral-600 flex items-center gap-1"
              >
                <span>TOOLS</span>
                <ChevronDown className="w-3.5 h-3.5 text-neutral-500" />
              </button>

              {isToolsOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-neutral-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <button
                    onClick={() => {
                      if (onOpenChat) onOpenChat();
                      else if (onToggleAiSidebar) onToggleAiSidebar();
                      setIsToolsOpen(false);
                    }}
                    className="w-full px-3.5 py-2 text-left text-xs font-medium text-neutral-700 hover:bg-purple-50 flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4 text-purple-600 shrink-0" />
                    <div>
                      <div className="font-semibold text-neutral-900">✦ Artha</div>
                      <div className="text-[10px] text-neutral-500">Financial Intelligence Copilot</div>
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      if (onOpenEvidence) onOpenEvidence();
                      else if (onToggleAiSidebar) onToggleAiSidebar();
                      setIsToolsOpen(false);
                    }}
                    className="w-full px-3.5 py-2 text-left text-xs font-medium text-neutral-700 hover:bg-emerald-50 flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <div className="font-semibold text-neutral-900">Evidence & Filings</div>
                      <div className="text-[10px] text-neutral-500">Statutory filings & regulatory records</div>
                    </div>
                  </button>
                  <div className="my-1 border-t border-neutral-100" />
                  <button
                    onClick={() => {
                      onViewChange('raw_ingestion');
                      setIsToolsOpen(false);
                    }}
                    className="w-full px-3.5 py-2 text-left text-xs font-medium text-neutral-700 hover:bg-neutral-50 flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-neutral-700 shrink-0" />
                    <div>
                      <div className="font-semibold text-neutral-900">Raw Media Ingestion Studio</div>
                      <div className="text-[10px] text-neutral-500">Extract tables, PDFs & filings</div>
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      onViewChange('bento');
                      setIsToolsOpen(false);
                    }}
                    className="w-full px-3.5 py-2 text-left text-xs font-medium text-neutral-700 hover:bg-neutral-50 flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <LayoutGrid className="w-4 h-4 text-neutral-900 shrink-0" />
                    <div>
                      <div className="font-semibold text-neutral-900">Bento Architecture Grid</div>
                      <div className="text-[10px] text-neutral-500">Monochrome interactive feature cards</div>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* Right: Search Box, User Profile & AI Bot Trigger */}
        <div className="flex items-center gap-3">
          {/* Screener-style Search Bar */}
          <div ref={searchRef} className="relative w-48 sm:w-64 md:w-80">
            <div className="relative flex items-center">
              <Search className="absolute left-3 w-4 h-4 text-neutral-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                placeholder="Search for a company"
                className="w-full pl-9 pr-3 py-1.5 text-[13px] bg-white border border-neutral-300 rounded-lg text-neutral-900 placeholder-neutral-400 focus:outline-hidden focus:border-neutral-500 focus:ring-1 focus:ring-neutral-400 transition-all shadow-2xs"
              />
            </div>

            {/* Live Autocomplete Dropdown */}
            {isSearchOpen && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-lg shadow-xl border border-neutral-200 py-1 z-50 max-h-72 overflow-y-auto">
                <div className="px-3 py-1.5 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                  Companies
                </div>
                {searchResults.length > 0 ? (
                  searchResults.map((company) => (
                    <button
                      key={company.id}
                      onClick={() => {
                        onSelectCompany(company.id);
                        onViewChange('company');
                        setIsSearchOpen(false);
                        setSearchQuery('');
                      }}
                      className="w-full px-3 py-2 text-left hover:bg-neutral-50 flex items-center justify-between text-xs transition-colors border-b border-neutral-100 last:border-0"
                    >
                      <div>
                        <div className="font-semibold text-neutral-900 flex items-center gap-1.5">
                          <span>{company.name}</span>
                          <span className="text-[10px] text-neutral-500 font-mono bg-neutral-100 px-1 py-0.5 rounded">
                            {company.ticker}
                          </span>
                        </div>
                        <div className="text-[11px] text-neutral-500 truncate max-w-[200px]">
                          {company.exchange}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-neutral-900">₹{company.price}</div>
                        <div
                          className={`text-[11px] font-medium ${
                            company.changePercent >= 0 ? 'text-emerald-600' : 'text-rose-600'
                          }`}
                        >
                          {company.changePercent >= 0 ? '▲' : '▼'}{' '}
                          {Math.abs(company.changePercent)}%
                        </div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="px-3 py-4 text-center text-xs text-neutral-500">
                    No matching company found.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* User Profile Pill matching Screener.in */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-neutral-300 hover:bg-neutral-50 text-neutral-800 text-xs font-semibold uppercase tracking-wider transition-colors shadow-2xs cursor-pointer"
            >
              <User className="w-3.5 h-3.5 text-neutral-600" />
              <span>VAIBHAV</span>
              <ChevronDown className="w-3 h-3 text-neutral-500" />
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-lg shadow-lg border border-neutral-200 py-1 z-50 animate-in fade-in">
                <div className="px-3 py-2 border-b border-neutral-100">
                  <p className="text-xs font-bold text-neutral-900">Vaibhav Kesarwani</p>
                  <p className="text-[11px] text-neutral-500 truncate">vaibhav@vera.ai</p>
                </div>
                <button
                  onClick={() => {
                    onViewChange('watchlist');
                    setIsUserMenuOpen(false);
                  }}
                  className="w-full px-3 py-1.5 text-left text-xs text-neutral-700 hover:bg-neutral-50 flex items-center gap-2 cursor-pointer"
                >
                  <Bookmark className="w-3.5 h-3.5 text-neutral-500" />
                  <span>My Watchlist ({watchlistCount})</span>
                </button>
                <button
                  onClick={() => {
                    if (onOpenChat) onOpenChat();
                    else if (onToggleAiSidebar) onToggleAiSidebar();
                    setIsUserMenuOpen(false);
                  }}
                  className="w-full px-3 py-1.5 text-left text-xs text-neutral-700 hover:bg-purple-50 flex items-center gap-2 cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-purple-600" />
                  <span>✦ Artha</span>
                </button>
                <button
                  onClick={() => {
                    if (onOpenEvidence) onOpenEvidence();
                    else if (onToggleAiSidebar) onToggleAiSidebar();
                    setIsUserMenuOpen(false);
                  }}
                  className="w-full px-3 py-1.5 text-left text-xs text-neutral-700 hover:bg-emerald-50 flex items-center gap-2 cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Evidence</span>
                </button>
              </div>
            )}
          </div>

          {/* ─────────────────────────────────────────────────────────────
              SEPARATED DUAL OPTIONS:
              1. ✦ Artha (Financial Copilot)
              2. 🛡️ Statutory Evidence Tracker
          ────────────────────────────────────────────────────────────── */}
          <div className="flex items-center gap-1.5">
            {/* OPTION 1: Artha */}
            <button
              onClick={() => {
                if (onOpenChat) onOpenChat();
                else if (onToggleAiSidebar) onToggleAiSidebar();
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                isAiSidebarOpen && activeDrawerMode === 'chat'
                  ? 'bg-black text-white ring-2 ring-neutral-400 shadow-md'
                  : 'bg-neutral-900 hover:bg-neutral-800 text-white'
              }`}
              title="Chat with Artha"
            >
              <Sparkles className="w-3.5 h-3.5 text-neutral-300" />
              <span>✦ Artha</span>
            </button>

            {/* OPTION 2: Statutory Evidence Tracker */}
            <button
              onClick={() => {
                if (onOpenEvidence) onOpenEvidence();
                else if (onToggleAiSidebar) onToggleAiSidebar();
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer border ${
                isAiSidebarOpen && activeDrawerMode === 'evidence'
                  ? 'bg-neutral-200 text-neutral-950 border-neutral-400 ring-2 ring-neutral-300 font-bold'
                  : 'bg-white hover:bg-neutral-100 text-neutral-800 border-neutral-300'
              }`}
              title="Audit Viral Rumors & Verify SEBI LODR 30 Filings"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-neutral-700" />
              <span className="hidden sm:inline">Evidence Tracker</span>
              <span className="sm:hidden">Evidence</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
