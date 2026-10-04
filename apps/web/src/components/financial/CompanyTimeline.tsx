'use client';

import React, { useState } from 'react';
import { useVisualizationStore } from '@/state/visualizationStore';
import { CompanyEventItem } from '@/lib/financial/companyDataset';
import { ShieldCheck, AlertCircle, ExternalLink, Sparkles, Calendar, FileText } from 'lucide-react';
import { useChatStore } from '@/state/chatStore';

export const CompanyTimeline: React.FC = () => {
  const { getCurrentCompanyRecord } = useVisualizationStore();
  const { sendMessage } = useChatStore();
  const record = getCurrentCompanyRecord();
  const [selectedEvent, setSelectedEvent] = useState<CompanyEventItem | null>(record.events[0] || null);

  const getStatusBadge = (status: CompanyEventItem['evidenceStatus']) => {
    switch (status) {
      case 'SUPPORTED':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            <span>SUPPORTED</span>
          </span>
        );
      case 'PARTIALLY_SUPPORTED':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1">
            <AlertCircle className="w-3 h-3 text-amber-600" />
            <span>PARTIALLY SUPPORTED</span>
          </span>
        );
      case 'CONTRADICTED':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-rose-100 text-rose-800 border border-rose-300">
            CONTRADICTED
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-neutral-100 text-neutral-800 border border-neutral-300">
            UNVERIFIED
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-neutral-200/80 p-5 shadow-2xs space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-3">
        <div>
          <h2 className="text-base font-bold text-neutral-900">
            {record.name} — Regulatory Event & Statutory Evidence Timeline
          </h2>
          <p className="text-xs text-neutral-500">
            Chronological corporate milestones reconciled against official BSE/NSE SEBI filings.
          </p>
        </div>
        <span className="text-xs font-mono font-medium px-2 py-1 rounded bg-neutral-100 text-neutral-700">
          SEBI LODR Audit Trail
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Interactive Timeline Spine (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative border-l-2 border-purple-200 ml-4 pl-6 space-y-6">
            {record.events.map((ev) => {
              const isSelected = selectedEvent?.id === ev.id;
              return (
                <div
                  key={ev.id}
                  onClick={() => setSelectedEvent(ev)}
                  className={`relative p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-purple-50/90 border-purple-300 shadow-xs ring-2 ring-purple-100'
                      : 'bg-white hover:bg-neutral-50/80 border-neutral-200/80'
                  }`}
                >
                  {/* Timeline dot */}
                  <span
                    className={`absolute -left-[31px] top-4 w-4 h-4 rounded-full border-2 bg-white transition-all ${
                      isSelected
                        ? 'border-purple-600 bg-purple-600 ring-4 ring-purple-100'
                        : 'border-purple-400'
                    }`}
                  />

                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-xs font-mono font-bold text-purple-700 bg-purple-100/70 px-1.5 py-0.5 rounded">
                      {ev.period} • {ev.date}
                    </span>
                    {getStatusBadge(ev.evidenceStatus)}
                  </div>

                  <h3 className="font-bold text-xs text-neutral-900 mb-1 leading-snug">
                    {ev.title}
                  </h3>

                  <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed">
                    {ev.summary}
                  </p>

                  <div className="mt-2.5 pt-2 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-500">
                    <span className="font-medium text-neutral-700">{ev.sourceType}</span>
                    <span className="text-purple-600 font-semibold flex items-center gap-1">
                      <span>Inspect Evidence</span> &rarr;
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Evidence Inspection Drawer (5 Cols) */}
        <div className="lg:col-span-5 bg-neutral-50/80 rounded-xl p-4 border border-neutral-200/80 space-y-4 sticky top-20">
          {selectedEvent ? (
            <>
              <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
                <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                  VERIFIED STATUTORY EVIDENCE
                </span>
                {getStatusBadge(selectedEvent.evidenceStatus)}
              </div>

              <div className="space-y-1">
                <h4 className="font-bold text-sm text-neutral-900">{selectedEvent.title}</h4>
                <div className="flex items-center gap-2 text-xs text-neutral-500">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Filed on {selectedEvent.date}</span>
                </div>
              </div>

              <div className="p-3 bg-white rounded-lg border border-neutral-200 text-xs text-neutral-700 leading-relaxed">
                {selectedEvent.summary}
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between py-1 border-b border-neutral-200/60">
                  <span className="text-neutral-500">Impact Metric:</span>
                  <span className="font-bold text-neutral-900">{selectedEvent.impactMetric}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-neutral-200/60">
                  <span className="text-neutral-500">Financial Magnitude:</span>
                  <span className="font-bold font-mono text-purple-700">{selectedEvent.impactMagnitude}</span>
                </div>
                <div className="flex items-start justify-between py-1">
                  <span className="text-neutral-500">Primary Source:</span>
                  <span className="font-medium text-right text-neutral-800 max-w-[200px]">
                    {selectedEvent.sourceTitle}
                  </span>
                </div>
              </div>

              <button
                onClick={() =>
                  sendMessage(
                    `Cross-examine official disclosure: "${selectedEvent.title}" for ${record.name} against SEBI LODR Regulation 30`
                  )
                }
                className="w-full py-2 px-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Cross-Examine Event in Chat</span>
              </button>
            </>
          ) : (
            <div className="py-12 text-center text-xs text-neutral-400">
              Select an event to inspect statutory evidence filings
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
