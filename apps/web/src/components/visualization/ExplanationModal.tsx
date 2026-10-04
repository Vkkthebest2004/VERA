'use client';

import React from 'react';
import { useVisualizationStore } from '@/state/visualizationStore';
import { X, Sparkles, ShieldCheck, Eye, AlertCircle, TrendingUp, BookOpen } from 'lucide-react';
import { useChatStore } from '@/state/chatStore';
import { VeraActionToolbar } from '@/components/ui/VeraActionToolbar';

export const ExplanationModal: React.FC = () => {
  const { explanationContext, closeExplanation, getCurrentCompanyRecord } = useVisualizationStore();
  const { sendMessage } = useChatStore();
  const record = getCurrentCompanyRecord();

  if (!explanationContext || !explanationContext.isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 space-y-6">
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 border-b border-neutral-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-neutral-900 text-white">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-neutral-900 text-white font-mono">
                  VERA Graph Analysis
                </span>
                <span className="text-xs text-neutral-400 font-mono">•</span>
                <span className="text-xs font-semibold text-neutral-600">{record.name}</span>
              </div>
              <h2 className="text-base font-bold text-neutral-900 mt-0.5">
                {explanationContext.headline}
              </h2>
            </div>
          </div>

          <button
            onClick={closeExplanation}
            className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 5-Part Structured Content */}
        <div className="space-y-4 text-xs">
          {/* 1. What You Are Seeing */}
          <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200/70 space-y-1">
            <div className="flex items-center gap-2 font-bold text-neutral-800 uppercase tracking-wider text-[11px]">
              <Eye className="w-3.5 h-3.5 text-neutral-900" />
              <span>WHAT YOU ARE SEEING</span>
            </div>
            <p className="text-neutral-700 leading-relaxed pl-5">
              {explanationContext.whatYouAreSeeing}
            </p>
          </div>

          {/* 2. What Changed */}
          <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200/70 space-y-1">
            <div className="flex items-center gap-2 font-bold text-neutral-800 uppercase tracking-wider text-[11px]">
              <TrendingUp className="w-3.5 h-3.5 text-neutral-900" />
              <span>WHAT CHANGED</span>
            </div>
            <p className="text-neutral-700 leading-relaxed pl-5">
              {explanationContext.whatChanged}
            </p>
          </div>

          {/* 3. What Deserves Attention */}
          <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200/70 space-y-1 text-neutral-900">
            <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-[11px] text-neutral-900">
              <AlertCircle className="w-3.5 h-3.5 text-neutral-900" />
              <span>WHAT DESERVES ATTENTION</span>
            </div>
            <p className="text-neutral-800 leading-relaxed pl-5">
              {explanationContext.whatDeservesAttention}
            </p>
          </div>

          {/* 4. Why It Matters */}
          <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200/70 space-y-1 text-neutral-950">
            <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-[11px] text-neutral-900">
              <BookOpen className="w-3.5 h-3.5 text-neutral-900" />
              <span>WHY IT MATTERS</span>
            </div>
            <p className="text-neutral-800 leading-relaxed pl-5">
              {explanationContext.whyItMatters}
            </p>
          </div>

          {/* 5. Source / Evidence */}
          <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200/70 space-y-1">
            <div className="flex items-center gap-2 font-bold text-neutral-900 uppercase tracking-wider text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-neutral-900" />
              <span>SOURCE & STATUTORY EVIDENCE</span>
            </div>
            <p className="text-neutral-700 leading-relaxed pl-5 font-mono text-[11px]">
              {explanationContext.sourceEvidence}
            </p>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-neutral-100 text-xs">
          <div className="shrink-0">
            <VeraActionToolbar
              size="sm"
              onUploadClick={() => {
                closeExplanation();
                sendMessage(`Auditing evidence documents for ${record.name}`);
              }}
              onArchiveClick={() => {
                closeExplanation();
                sendMessage(`Show official filings regarding ${explanationContext.headline}`);
              }}
              onScanClick={() => {
                closeExplanation();
                sendMessage(`Perform deeper audit on ${record.name}`);
              }}
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => {
                closeExplanation();
                sendMessage(`Can you explain more details about what we saw in the ${explanationContext.headline}?`);
              }}
              className="flex-1 sm:flex-none px-4 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Discuss in Chat</span>
            </button>
            <button
              onClick={closeExplanation}
              className="px-4 py-2 rounded-lg border border-neutral-300 hover:bg-neutral-50 text-neutral-700 font-semibold transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
