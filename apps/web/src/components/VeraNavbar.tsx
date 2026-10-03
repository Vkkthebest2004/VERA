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
} from 'lucide-react';
import { COMPANIES, CompanyData } from '@/data/mockCompanies';

interface VeraNavbarProps {
  currentView: 'company' | 'watchlist' | 'raw_ingestion';
  onViewChange: (view: 'company' | 'watchlist' | 'raw_ingestion') => void;
  selectedCompanyId: string;
  onSelectCompany: (companyId: string) => void;
  onToggleAiSidebar: () => void;
  isAiSidebarOpen: boolean;
  watchlistCount: number;
}

export const VeraNavbar: React.FC<VeraNavbarProps> = ({
  currentView,
  onViewChange,
  selectedCompanyId,
  onSelectCompany,
  onToggleAiSidebar,
  isAiSidebarOpen,
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
          {/* VERA Logo with Screener-style two green bars */}
          <button
            onClick={() => onViewChange('company')}
            className="flex items-center gap-1.5 focus:outline-hidden group"
          >
            <span className="text-xl font-bold tracking-tight text-neutral-900 group-hover:text-emerald-700 transition-colors">
              vera<span className="text-emerald-600">.</span>
            </span>
            <div className="flex items-end gap-[2px] h-4 mb-0.5">
              <span className="w-1.5 h-2.5 bg-emerald-600 rounded-[1px]" />
              <span className="w-1.5 h-4 bg-emerald-600 rounded-[1px]" />
            </div>
          </button>

          {/* Primary Nav Menu */}
          <nav className="hidden md:flex items-center gap-5 text-[13px] font-medium text-neutral-700">
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
              className={`hover:text-neutral-950 transition-colors uppercase tracking-wider font-semibold flex items-center gap-1.5 ${
                currentView === 'watchlist'
                  ? 'text-neutral-950 font-bold border-b-2 border-neutral-900 pb-[17px] mt-[17px]'
                  : 'text-neutral-600'
              }`}
            >
              <span>WATCHLIST</span>
              {watchlistCount > 0 && (
                <span className="px-1.5 py-0.2 bg-purple-100 text-purple-700 text-[10px] rounded-full font-bold">
                  {watchlistCount}
                </span>
              )}
            </button>

            <button
              onClick={() => onViewChange('company')}
              className="hover:text-neutral-950 transition-colors uppercase tracking-wider font-semibold text-neutral-600"
            >
              SCREENS
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
                <div className="absolute top-full left-0 mt-2 w-52 bg-white rounded-lg shadow-lg border border-neutral-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <button
                    onClick={() => {
                      onViewChange('raw_ingestion');
                      setIsToolsOpen(false);
                    }}
                    className="w-full px-3.5 py-2 text-left text-xs font-medium text-neutral-700 hover:bg-neutral-50 flex items-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Raw Media Ingestion Studio</span>
                  </button>
                  <button
                    onClick={() => {
                      onToggleAiSidebar();
                      setIsToolsOpen(false);
                    }}
                    className="w-full px-3.5 py-2 text-left text-xs font-medium text-neutral-700 hover:bg-neutral-50 flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    <span>Open VERA Evidence AI Bot</span>
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

          {/* User Profile Pill */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-neutral-100 text-neutral-700 text-xs font-semibold uppercase tracking-wider transition-colors border border-transparent hover:border-neutral-200"
            >
              <div className="w-5 h-5 rounded-full bg-neutral-200 text-neutral-700 flex items-center justify-center font-bold text-[10px]">
                V
              </div>
              <span className="hidden sm:inline">VAIBHAV</span>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-500" />
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-44 bg-white rounded-lg shadow-lg border border-neutral-200 py-1 z-50 animate-in fade-in">
                <div className="px-3 py-2 border-b border-neutral-100">
                  <p className="text-xs font-bold text-neutral-900">Vaibhav Kesarwani</p>
                  <p className="text-[11px] text-neutral-500 truncate">vaibhav@vera.ai</p>
                </div>
                <button
                  onClick={() => {
                    onViewChange('watchlist');
                    setIsUserMenuOpen(false);
                  }}
                  className="w-full px-3 py-1.5 text-left text-xs text-neutral-700 hover:bg-neutral-50 flex items-center gap-2"
                >
                  <Bookmark className="w-3.5 h-3.5 text-neutral-500" />
                  <span>My Watchlist ({watchlistCount})</span>
                </button>
                <button
                  onClick={() => {
                    onToggleAiSidebar();
                    setIsUserMenuOpen(false);
                  }}
                  className="w-full px-3 py-1.5 text-left text-xs text-neutral-700 hover:bg-neutral-50 flex items-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  <span>VERA AI Evidence Bot</span>
                </button>
              </div>
            )}
          </div>

          {/* THE AI EVIDENCE BOT BUTTON — Prominent Purple Pill matching Screener's '+ AI' */}
          <button
            onClick={onToggleAiSidebar}
            className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
              isAiSidebarOpen
                ? 'bg-purple-800 text-white ring-2 ring-purple-300 shadow-md'
                : 'bg-purple-600 hover:bg-purple-700 text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-200 animate-pulse" />
            <span>AI Bot</span>
            <span className="hidden lg:inline text-[10px] bg-purple-500/50 px-1 py-0.5 rounded font-mono">
              VERA
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
