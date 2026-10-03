'use client';

import React, { useState } from 'react';
import { VeraNavbar } from '@/components/VeraNavbar';
import { CompanyView } from '@/components/CompanyView';
import { WatchlistView } from '@/components/WatchlistView';
import { IngestionStudio } from '@/components/IngestionStudio';
import { VeraEvidenceSidebar } from '@/components/VeraEvidenceSidebar';
import { COMPANIES, CompanyData } from '@/data/mockCompanies';
import { Sparkles, ShieldCheck } from 'lucide-react';

export default function Home() {
  const [currentView, setCurrentView] = useState<'company' | 'watchlist' | 'raw_ingestion'>('company');
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('ALLETEC');
  const [watchlistIds, setWatchlistIds] = useState<string[]>([]);
  const [isAiSidebarOpen, setIsAiSidebarOpen] = useState<boolean>(false);
  const [activeClaimForSidebar, setActiveClaimForSidebar] = useState<string>('');

  const currentCompany: CompanyData = COMPANIES[selectedCompanyId] || COMPANIES['ALLETEC'];

  // Watchlist Handlers
  const handleToggleWatchlist = (companyId: string) => {
    setWatchlistIds((prev) =>
      prev.includes(companyId) ? prev.filter((id) => id !== companyId) : [...prev, companyId]
    );
  };

  const handleAddCompany = (companyId: string) => {
    if (!watchlistIds.includes(companyId)) {
      setWatchlistIds((prev) => [...prev, companyId]);
    }
  };

  const handleRemoveCompany = (companyId: string) => {
    setWatchlistIds((prev) => prev.filter((id) => id !== companyId));
  };

  // Open AI Sidebar with a specific pre-filled claim
  const handleOpenAiWithClaim = (claimText: string) => {
    setActiveClaimForSidebar(claimText);
    setIsAiSidebarOpen(true);
  };

  return (
    <main className="min-h-screen bg-[#fcfcfd] text-neutral-900 selection:bg-purple-900 selection:text-white relative">
      {/* 1. Screener-style Top Navbar */}
      <VeraNavbar
        currentView={currentView}
        onViewChange={setCurrentView}
        selectedCompanyId={selectedCompanyId}
        onSelectCompany={setSelectedCompanyId}
        onToggleAiSidebar={() => setIsAiSidebarOpen(!isAiSidebarOpen)}
        isAiSidebarOpen={isAiSidebarOpen}
        watchlistCount={watchlistIds.length}
      />

      {/* 2. Main Page Views */}
      <div className="pb-16">
        {currentView === 'company' && (
          <CompanyView
            company={currentCompany}
            onOpenAiWithClaim={handleOpenAiWithClaim}
            onToggleWatchlist={handleToggleWatchlist}
            isInWatchlist={watchlistIds.includes(currentCompany.id)}
          />
        )}

        {currentView === 'watchlist' && (
          <WatchlistView
            watchlistIds={watchlistIds}
            onAddCompany={handleAddCompany}
            onRemoveCompany={handleRemoveCompany}
            onSelectCompany={(id) => {
              setSelectedCompanyId(id);
              setCurrentView('company');
            }}
            onOpenAiWithClaim={handleOpenAiWithClaim}
          />
        )}

        {currentView === 'raw_ingestion' && (
          <div className="max-w-5xl mx-auto px-4 py-6">
            <div className="mb-4 flex items-center justify-between pb-3 border-b border-neutral-200">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h2 className="font-bold text-base text-neutral-900">
                  Multimodal Media Ingestion & Fact-Check Dossier Studio
                </h2>
              </div>
              <button
                onClick={() => setCurrentView('company')}
                className="text-xs text-blue-600 hover:underline font-semibold"
              >
                &larr; Back to Company View
              </button>
            </div>
            <IngestionStudio />
          </div>
        )}
      </div>

      {/* 3. The AI Evidence Checking Drawer / Sidebar */}
      <VeraEvidenceSidebar
        isOpen={isAiSidebarOpen}
        onClose={() => setIsAiSidebarOpen(false)}
        selectedCompany={currentCompany}
        initialClaim={activeClaimForSidebar}
      />

      {/* 4. Floating Quick AI Button in bottom-right corner */}
      {!isAiSidebarOpen && (
        <button
          onClick={() => setIsAiSidebarOpen(true)}
          className="fixed bottom-6 right-6 z-30 px-4 py-2.5 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-2 shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 cursor-pointer border border-purple-400/30"
          title="Open VERA Evidence Fact-Check Bot"
        >
          <Sparkles className="w-4 h-4 text-purple-200 animate-pulse" />
          <span>VERA Evidence Bot</span>
        </button>
      )}
    </main>
  );
}
