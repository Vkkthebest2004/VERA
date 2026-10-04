'use client';

import React, { useState } from 'react';
import { VeraActionToolbar } from '@/components/ui/VeraActionToolbar';

interface VeraFooterProps {
  onNavigateToVisualizer?: () => void;
  onOpenChat?: () => void;
  onOpenEvidence?: () => void;
  onOpenIngestion?: () => void;
  onViewChange?: (view: 'landing' | 'visualizer' | 'company' | 'watchlist' | 'raw_ingestion' | 'bento') => void;
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
            <div className="flex items-center gap-2">
              <img
                src="/vera_icon.svg"
                alt="VERA Logo"
                className="w-7 h-7 object-contain"
              />
              <span className="text-xl font-bold tracking-tight text-neutral-950 font-sans">
                VERA
              </span>
            </div>

            <p className="text-neutral-600 leading-relaxed text-xs max-w-sm">
              Evidence-first financial intelligence & statutory truth platform for Indian equities. Cross-examining financial statements, corporate actions, and rumors against authentic stock exchange disclosures.
            </p>

            {/* User-requested Action Segment Toolbar */}
            <div className="pt-2">
              <VeraActionToolbar
                onUpload={onOpenIngestion}
                onArchive={onOpenEvidence}
                onScan={onNavigateToVisualizer}
              />
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
                    onClick={() => onViewChange && onViewChange('landing')}
                    className="hover:text-neutral-950 transition-colors cursor-pointer"
                  >
                    Platform Overview
                  </button>
                </li>
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
