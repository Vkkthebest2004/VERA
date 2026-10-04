'use client';

import React from 'react';
import { useVisualizationStore } from '@/state/visualizationStore';
import { Clock, Play, RotateCcw, Sparkles } from 'lucide-react';

export const GlobalTimeSlider: React.FC = () => {
  const { getCurrentCompanyRecord, globalTimeIndex, setGlobalTimeIndex, timeRange } =
    useVisualizationStore();
  const record = getCurrentCompanyRecord();
  const allPeriods = record.history.map((h) => h.period);

  const currentYearItem = record.history[globalTimeIndex] || record.history[record.history.length - 1];

  return (
    <div className="bg-white rounded-2xl border border-neutral-200/90 p-4 shadow-2xs space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-purple-100 text-purple-700">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-xs text-neutral-900 flex items-center gap-1.5">
              <span>Global Financial Time Machine</span>
              <span className="px-1.5 py-0.2 rounded bg-purple-100 text-purple-800 text-[10px] font-mono font-bold">
                {currentYearItem.period} Active
              </span>
            </h3>
            <p className="text-[11px] text-neutral-500">
              Drag to travel through {record.name}'s 10-year audited financial history.
            </p>
          </div>
        </div>

        {/* Live Headline Snapshot at this point in time */}
        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="flex items-baseline gap-1">
            <span className="text-neutral-400 text-[10px]">Sales:</span>
            <span className="font-bold text-neutral-900">
              ₹{Math.round(currentYearItem.revenueCr / 1000)}k Cr
            </span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-neutral-400 text-[10px]">PAT:</span>
            <span className="font-bold text-purple-700">
              ₹{currentYearItem.patCr.toLocaleString('en-IN')} Cr
            </span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-neutral-400 text-[10px]">Debt:</span>
            <span className="font-bold text-amber-700">
              ₹{Math.round(currentYearItem.totalDebtCr / 1000)}k Cr
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Slider Input */}
      <div className="space-y-1.5 pt-1">
        <input
          type="range"
          min={0}
          max={record.history.length - 1}
          value={globalTimeIndex}
          onChange={(e) => setGlobalTimeIndex(Number(e.target.value))}
          className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-purple-600 focus:outline-hidden"
        />

        {/* Tick labels */}
        <div className="flex justify-between text-[10px] font-mono text-neutral-500 px-0.5">
          {allPeriods.map((p, idx) => (
            <button
              key={p}
              onClick={() => setGlobalTimeIndex(idx)}
              className={`hover:text-purple-600 font-medium transition-colors ${
                idx === globalTimeIndex ? 'text-purple-700 font-bold scale-110' : ''
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
