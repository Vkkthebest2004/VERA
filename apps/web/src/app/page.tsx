'use client';

import React, { useState } from 'react';
import { VeraNavbar } from '@/components/VeraNavbar';
import { CompanyView } from '@/components/CompanyView';
import { WatchlistView } from '@/components/WatchlistView';
import { IngestionStudio } from '@/components/IngestionStudio';
import { VeraAssistantDrawer, AssistantMode } from '@/components/VeraAssistantDrawer';
import { VeraConversationalVisualizer } from '@/components/visualization/VeraConversationalVisualizer';
import { VeraBentoShowcase } from '@/components/VeraBentoShowcase';
import { COMPANIES, CompanyData } from '@/data/mockCompanies';
import { ShieldCheck } from 'lucide-react';

export default function Home() {
  const [currentView, setCurrentView] = useState<'visualizer' | 'company' | 'watchlist' | 'raw_ingestion' | 'bento'>('company');
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('AWL');
  const [watchlistIds, setWatchlistIds] = useState<string[]>(['AWL', 'ALLETEC', 'RELIANCE', 'TATAPOWER']);
  
  // SEPARATED DRAWER STATE:
  // Mode: 'chat' (Conversational Financial Copilot) OR 'evidence' (Statutory Fact-Checker & Rumor Auditor)
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState<boolean>(false);
  const [aiDrawerMode, setAiDrawerMode] = useState<AssistantMode>('chat');
  const [activeClaimForSidebar, setActiveClaimForSidebar] = useState<string>('');

  const currentCompany: CompanyData = COMPANIES[selectedCompanyId] || COMPANIES['AWL'] || COMPANIES['RELIANCE'];

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

  // Dedicated Open Handlers
  const handleOpenChat = () => {
    setAiDrawerMode('chat');
    setIsAiDrawerOpen(true);
  };

  const handleOpenEvidence = (claimText?: string) => {
    if (claimText) {
      setActiveClaimForSidebar(claimText);
    }
    setAiDrawerMode('evidence');
    setIsAiDrawerOpen(true);
  };

  return (
    <main className="min-h-screen bg-[#fcfcfd] text-neutral-900 selection:bg-purple-900 selection:text-white relative">
      {/* 1. Screener-style Top Navbar with Separated AI Chat & Evidence Tracker Buttons */}
      <VeraNavbar
        currentView={currentView}
        onViewChange={setCurrentView}
        selectedCompanyId={selectedCompanyId}
        onSelectCompany={setSelectedCompanyId}
        onOpenChat={handleOpenChat}
        onOpenEvidence={handleOpenEvidence}
        isAiSidebarOpen={isAiDrawerOpen}
        activeDrawerMode={isAiDrawerOpen ? aiDrawerMode : null}
        watchlistCount={watchlistIds.length}
      />

      {/* 2. Main Page Views */}
      <div className="pb-20">
        {currentView === 'visualizer' && (
          <VeraConversationalVisualizer />
        )}

        {currentView === 'company' && (
          <CompanyView
            company={currentCompany}
            onOpenChat={handleOpenChat}
            onOpenEvidence={handleOpenEvidence}
            onOpenAiWithClaim={handleOpenEvidence}
            onToggleWatchlist={handleToggleWatchlist}
            isInWatchlist={watchlistIds.includes(currentCompany.id)}
            onSelectCompany={setSelectedCompanyId}
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
            onOpenAiWithClaim={handleOpenEvidence}
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

        {currentView === 'bento' && (
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="mb-4 flex items-center justify-between pb-3 border-b border-neutral-200">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-neutral-900" />
                <h2 className="font-bold text-base text-neutral-900">
                  VERA Monochrome Architecture Grid
                </h2>
              </div>
              <button
                onClick={() => setCurrentView('company')}
                className="text-xs text-neutral-600 hover:text-neutral-950 font-semibold cursor-pointer"
              >
                &larr; Back to Company View
              </button>
            </div>
            <VeraBentoShowcase
              onNavigateToVisualizer={() => setCurrentView('visualizer')}
              onOpenChat={handleOpenChat}
              onOpenEvidence={handleOpenEvidence}
              onOpenIngestion={() => setCurrentView('raw_ingestion')}
            />
          </div>
        )}
      </div>

      {/* 3. The Separated VERA Assistant Drawer (Conversational Chat + Evidence Tracker) */}
      <VeraAssistantDrawer
        isOpen={isAiDrawerOpen}
        onClose={() => setIsAiDrawerOpen(false)}
        selectedCompany={currentCompany}
        activeMode={aiDrawerMode}
        onModeChange={setAiDrawerMode}
        initialClaim={activeClaimForSidebar}
        onNavigateToVisualizer={() => setCurrentView('visualizer')}
      />
    </main>
  );
}
