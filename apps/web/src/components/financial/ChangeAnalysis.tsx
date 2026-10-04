'use client';

import React, { useMemo, useState } from 'react';
import { useVisualizationStore } from '@/state/visualizationStore';
import { comparePeriods } from '@/lib/financial/financialMath';
import { ArrowUpRight, ArrowDownRight, ShieldCheck, Sparkles, HelpCircle } from 'lucide-react';
import { useChatStore } from '@/state/chatStore';

export const ChangeAnalysis: React.FC = () => {
  const { getCurrentCompanyRecord, comparisonYears, setComparisonMode } = useVisualizationStore();
  const { sendMessage } = useChatStore();
  const record = getCurrentCompanyRecord();

  const [fromPeriod, setFromPeriod] = useState<string>(comparisonYears[0] || 'FY24');
  const [toPeriod, setToPeriod] = useState<string>(comparisonYears[1] || 'FY26');

  const comparisonResult = useMemo(() => {
    const fromData = record.history.find((h) => h.period === fromPeriod) || record.history[0];
    const toData =
      record.history.find((h) => h.period === toPeriod) ||
      record.history[record.history.length - 1];
    return comparePeriods(fromData, toData);
  }, [record, fromPeriod, toPeriod]);

  const allPeriods = record.history.map((h) => h.period);

  return (
    <div className="bg-white rounded-2xl border border-neutral-200/80 p-5 shadow-2xs space-y-6">
      {/* Top Header & Year Selectors */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-neutral-900 text-white">
              <Sparkles className="w-4 h-4" />
            </span>
            <h2 className="text-base font-bold text-neutral-900">
              "What Changed?" Financial Variance Engine
            </h2>
          </div>
          <p className="text-xs text-neutral-500 mt-0.5">
            Deterministic line-by-line delta comparison across verified corporate filings.
          </p>
        </div>

        {/* Period Selector Controls */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-neutral-500 font-medium">Compare:</span>
          <select
            value={fromPeriod}
            onChange={(e) => setFromPeriod(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-neutral-300 bg-white font-mono font-bold text-neutral-800"
          >
            {allPeriods.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          <span className="text-neutral-400 font-bold">&rarr;</span>
          <select
            value={toPeriod}
            onChange={(e) => setToPeriod(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-neutral-300 bg-white font-mono font-bold text-neutral-800"
          >
            {allPeriods.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary Highlight Card */}
      <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 text-xs">
        <span className="text-[11px] font-bold text-neutral-900 uppercase tracking-wider block mb-1">
          EXECUTIVE VARIANCE SUMMARY
        </span>
        <p className="text-neutral-800 font-medium text-sm leading-relaxed">
          {comparisonResult.headlineSummary}
        </p>
      </div>

      {/* Line-by-Line Delta Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {comparisonResult.comparisons.map((item) => {
          const isUp = item.changePct >= 0;
          return (
            <div
              key={item.metric}
              className="p-3.5 bg-neutral-50/70 hover:bg-neutral-50 rounded-xl border border-neutral-200/70 space-y-2 transition-colors"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-neutral-700">{item.label}</span>
                <span
                  className={`flex items-center gap-0.5 px-2 py-0.5 rounded-full font-mono font-bold text-xs ${
                    item.isPositiveForCompany
                      ? 'bg-neutral-900 text-white'
                      : 'bg-neutral-200 text-neutral-800'
                  }`}
                >
                  {isUp ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                  <span>{isUp ? '+' : ''}{item.changePct}%</span>
                </span>
              </div>

              <div className="flex items-baseline justify-between text-xs text-neutral-500 font-mono">
                <span>{item.displayFrom}</span>
                <span className="text-neutral-300">&rarr;</span>
                <span className="font-bold text-neutral-900">{item.displayTo}</span>
              </div>

              <p className="text-[11px] text-neutral-500 leading-snug pt-1 border-t border-neutral-100">
                {item.plainEnglishExplanation}
              </p>
            </div>
          );
        })}
      </div>

      {/* Deep Dive Action */}
      <div className="p-4 bg-neutral-900 text-white rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div>
          <span className="font-bold text-sm block">Want an evidence-backed explanation of these changes?</span>
          <p className="text-neutral-400 text-xs mt-0.5">
            VERA cross-references annual report disclosures and MD&A transcripts to identify what drove the variances.
          </p>
        </div>
        <button
          onClick={() =>
            sendMessage(
              `Explain the key operational drivers behind the financial variances between ${fromPeriod} and ${toPeriod} for ${record.name}`
            )
          }
          className="px-4 py-2 rounded-lg bg-white hover:bg-neutral-100 text-neutral-900 font-bold text-xs shrink-0 flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-neutral-900" />
          <span>Ask VERA to Explain Variance</span>
        </button>
      </div>
    </div>
  );
};
