'use client';

import React from 'react';
import {
  X,
} from 'lucide-react';
import { CompanyData } from '@/data/mockCompanies';
import { VeraConversationalChat } from '@/components/chat/VeraConversationalChat';
import { VeraEvidenceTracker } from '@/components/VeraEvidenceTracker';

export type AssistantMode = 'chat' | 'evidence';

interface VeraAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCompany: CompanyData;
  activeMode: AssistantMode;
  onModeChange: (mode: AssistantMode) => void;
  initialClaim?: string;
  onNavigateToVisualizer?: () => void;
}

export const VeraAssistantDrawer: React.FC<VeraAssistantDrawerProps> = ({
  isOpen,
  onClose,
  selectedCompany,
  activeMode,
  onModeChange,
  initialClaim,
  onNavigateToVisualizer,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Dim Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-neutral-900/35 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      {/* Slide-in Drawer Container */}
      <div className="relative w-full sm:w-[600px] md:w-[680px] bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-250 border-l border-neutral-200">
        {/* ─────────────────────────────────────────────────────────────
            1. Master Drawer Header: Clean Bloomberg/Terminal Style
        ────────────────────────────────────────────────────────────── */}
        <div className="border-b border-neutral-200 bg-white">
          {/* Top Bar: Brand & Close */}
          <div className="px-5 pt-3.5 pb-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-5 h-5 rounded bg-neutral-900 flex items-center justify-center text-white font-mono font-bold text-[11px]">
                V
              </div>
              <div>
                <h2 className="font-bold text-sm text-neutral-950 tracking-tight leading-none">
                  VERA
                </h2>
                <p className="text-[10px] text-neutral-500 font-medium tracking-wide mt-0.5">
                  Financial Intelligence
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1 rounded-md text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
              title="Close panel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-6 px-5 text-xs font-medium border-t border-neutral-100">
            <button
              onClick={() => onModeChange('chat')}
              className={`py-2.5 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                activeMode === 'chat'
                  ? 'border-purple-600 text-neutral-950 font-bold'
                  : 'border-transparent text-neutral-500 hover:text-neutral-800'
              }`}
            >
              <span>✦ Artha</span>
            </button>

            <button
              onClick={() => onModeChange('evidence')}
              className={`py-2.5 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                activeMode === 'evidence'
                  ? 'border-purple-600 text-neutral-950 font-bold'
                  : 'border-transparent text-neutral-500 hover:text-neutral-800'
              }`}
            >
              <span>Evidence</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-neutral-100 text-neutral-600 font-mono font-normal">
                12
              </span>
            </button>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            2. Body: Render Selected Dedicated Component
        ────────────────────────────────────────────────────────────── */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {activeMode === 'chat' ? (
            <VeraConversationalChat
              company={selectedCompany}
              onNavigateToVisualizer={() => {
                onClose();
                if (onNavigateToVisualizer) onNavigateToVisualizer();
              }}
              onOpenEvidenceTab={() => onModeChange('evidence')}
            />
          ) : (
            <VeraEvidenceTracker
              company={selectedCompany}
              initialClaim={initialClaim}
            />
          )}
        </div>
      </div>
    </div>
  );
};
