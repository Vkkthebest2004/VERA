'use client';

import React, { useState } from 'react';

interface VeraFooterProps {
  onNavigateToVisualizer?: () => void;
  onOpenChat?: () => void;
  onOpenEvidence?: () => void;
  onOpenIngestion?: () => void;
  onViewChange?: (view: 'visualizer' | 'company' | 'watchlist' | 'raw_ingestion' | 'bento') => void;
}

export const VeraFooter: React.FC<VeraFooterProps> = ({
  onNavigateToVisualizer,
  onOpenChat,
  onOpenEvidence,
  onOpenIngestion,
  onViewChange,
}) => {
  const [activeAction, setActiveAction] = useState<string | null>(null);

  return (
    <footer className="w-full bg-white border-t border-neutral-200 text-neutral-900 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-10">
        {/* Top Section: Brand Identity + Action Group + Grid Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Brand Info & User's Action Segment Group */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-bold tracking-tight text-neutral-950 font-sans">
                vera<span className="text-neutral-400">.ai</span>
              </span>
              <div className="flex items-end gap-[3px] h-4 mb-0.5">
                <span className="w-1.5 h-2.5 bg-neutral-900 rounded-[1px]" />
                <span className="w-1.5 h-4 bg-neutral-900 rounded-[1px]" />
              </div>
            </div>

            <p className="text-neutral-600 leading-relaxed text-xs max-w-sm">
              Evidence-first financial intelligence & statutory truth platform for Indian equities. Cross-examining financial statements, corporate actions, and rumors against authentic stock exchange disclosures.
            </p>

            {/* User-requested Action Segment Toolbar */}
            <div className="pt-2">
              <div className="flex overflow-hidden bg-white border border-neutral-200 divide-x divide-neutral-200 rounded-lg rtl:flex-row-reverse shadow-2xs w-fit">
                <button
                  type="button"
                  onClick={() => {
                    setActiveAction('upload');
                    if (onOpenIngestion) onOpenIngestion();
                  }}
                  title="Upload & Extract Filings (Cloud Storage)"
                  className={`px-4 py-2 font-medium transition-colors duration-200 sm:px-5 cursor-pointer ${
                    activeAction === 'upload'
                      ? 'bg-neutral-900 text-white'
                      : 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-950'
                  }`}
                >
                  <svg
                    className="w-5 h-5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
                      strokeLinejoin="round"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveAction('archive');
                    if (onOpenEvidence) onOpenEvidence();
                  }}
                  title="Regulatory Archives & Statutory Disclosures"
                  className={`px-4 py-2 font-medium transition-colors duration-200 sm:px-5 cursor-pointer ${
                    activeAction === 'archive'
                      ? 'bg-neutral-900 text-white'
                      : 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-950'
                  }`}
                >
                  <svg
                    className="w-5 h-5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
                      strokeLinejoin="round"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveAction('scan');
                    if (onNavigateToVisualizer) onNavigateToVisualizer();
                  }}
                  title="Multi-Dimensional Deep Scan & Visualizer Canvas"
                  className={`px-4 py-2 font-medium transition-colors duration-200 sm:px-5 cursor-pointer ${
                    activeAction === 'scan'
                      ? 'bg-neutral-900 text-white'
                      : 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-950'
                  }`}
                >
                  <svg
                    className="w-5 h-5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7.5 3.75H6A2.25 2.25 0 003.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0120.25 6v1.5m0 9V18A2.25 2.25 0 0118 20.25h-1.5m-9 0H6A2.25 2.25 0 013.75 18v-1.5M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      strokeLinejoin="round"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Columns */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-6 text-xs">
            {/* Col 1: Platform */}
            <div className="space-y-3">
              <h3 className="font-semibold text-neutral-950 uppercase tracking-wider text-[11px]">
                Platform
              </h3>
              <ul className="space-y-2 text-neutral-600">
                <li>
                  <button
                    onClick={() => onViewChange && onViewChange('company')}
                    className="hover:text-neutral-950 transition-colors cursor-pointer"
                  >
                    Company Screener
                  </button>
                </li>
                <li>
                  <button
                    onClick={onOpenChat}
                    className="hover:text-neutral-950 transition-colors cursor-pointer"
                  >
                    Artha Copilot
                  </button>
                </li>
                <li>
                  <button
                    onClick={onNavigateToVisualizer}
                    className="hover:text-neutral-950 transition-colors cursor-pointer"
                  >
                    Conversational Visualizer
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onViewChange && onViewChange('watchlist')}
                    className="hover:text-neutral-950 transition-colors cursor-pointer"
                  >
                    Core Watchlist
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onViewChange && onViewChange('bento')}
                    className="hover:text-neutral-950 transition-colors cursor-pointer"
                  >
                    Bento Architecture Grid
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 2: Regulatory Truth */}
            <div className="space-y-3">
              <h3 className="font-semibold text-neutral-950 uppercase tracking-wider text-[11px]">
                Regulatory Truth
              </h3>
              <ul className="space-y-2 text-neutral-600">
                <li>
                  <button
                    onClick={onOpenEvidence}
                    className="hover:text-neutral-950 transition-colors cursor-pointer"
                  >
                    LODR 30 Evidence Tracker
                  </button>
                </li>
                <li>
                  <a
                    href="https://www.bseindia.com"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-neutral-950 transition-colors"
                  >
                    BSE Corporate Disclosures
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.nseindia.com"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-neutral-950 transition-colors"
                  >
                    NSE Announcements
                  </a>
                </li>
                <li>
                  <button
                    onClick={() => {
                      if (onOpenEvidence) onOpenEvidence();
                    }}
                    className="hover:text-neutral-950 transition-colors cursor-pointer"
                  >
                    Exchange Filing Crawler
                  </button>
                </li>
                <li>
                  <a
                    href="https://scores.sebi.gov.in"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-neutral-950 transition-colors"
                  >
                    SEBI SCORES Redressal
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 3: Intelligence */}
            <div className="space-y-3">
              <h3 className="font-semibold text-neutral-950 uppercase tracking-wider text-[11px]">
                Intelligence
              </h3>
              <ul className="space-y-2 text-neutral-600">
                <li>
                  <span className="text-neutral-600">Qwen 3.4B Fine-tuned</span>
                </li>
                <li>
                  <span className="text-neutral-600">DuPont 3-Stage ROE</span>
                </li>
                <li>
                  <span className="text-neutral-600">Free Cash Flow Waterfall</span>
                </li>
                <li>
                  <span className="text-neutral-600">Debt & Leverage Health</span>
                </li>
                <li>
                  <span className="text-neutral-600">Segment Revenue Treemaps</span>
                </li>
              </ul>
            </div>

            {/* Col 4: Governance */}
            <div className="space-y-3">
              <h3 className="font-semibold text-neutral-950 uppercase tracking-wider text-[11px]">
                Governance
              </h3>
              <ul className="space-y-2 text-neutral-600">
                <li>
                  <span className="text-neutral-600">Exchange Filing Invariant</span>
                </li>
                <li>
                  <span className="text-neutral-600">Statutory Disclaimer</span>
                </li>
                <li>
                  <span className="text-neutral-600">Auditor Notes Reconciliation</span>
                </li>
                <li>
                  <span className="text-neutral-600">Data Provenance Protocol</span>
                </li>
                <li>
                  <span className="text-neutral-600">Terms & Privacy</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Compliance */}
        <div className="pt-6 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-900" />
            <span>© 2026 VERA Financial Technologies Inc. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-4 text-neutral-400">
            <span>BSE & NSE Audited Archives</span>
            <span>•</span>
            <span>Non-advisory research & verification system</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
