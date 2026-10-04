'use client';

import React, { useMemo } from 'react';
import { EChartWrapper } from '../visualization/EChartWrapper';
import { useVisualizationStore } from '@/state/visualizationStore';
import { detectProfitCashDivergence } from '@/lib/financial/financialMath';
import { AlertTriangle, CheckCircle2, Info, Sparkles, ShieldCheck } from 'lucide-react';
import { EChartsOption } from 'echarts';

export const ProfitCashFlowChart: React.FC = () => {
  const { getCurrentCompanyRecord, timeRange, setSelectedPoint, isSimplified } =
    useVisualizationStore();

  const record = getCurrentCompanyRecord();

  const filteredHistory = useMemo(() => {
    const fromIdx = record.history.findIndex((h) => h.period === timeRange[0]);
    const toIdx = record.history.findIndex((h) => h.period === timeRange[1]);
    const start = fromIdx >= 0 ? fromIdx : 0;
    const end = toIdx >= 0 ? toIdx + 1 : record.history.length;
    return record.history.slice(start, end);
  }, [record, timeRange]);

  const periods = filteredHistory.map((h) => h.period);

  // Latest divergence audit
  const divergence = useMemo(() => {
    if (filteredHistory.length < 2) return null;
    const cur = filteredHistory[filteredHistory.length - 1];
    const prev = filteredHistory[filteredHistory.length - 2];
    return detectProfitCashDivergence(cur, prev);
  }, [filteredHistory]);

  const option: EChartsOption = useMemo(() => {
    return {
      title: {
        text: isSimplified
          ? 'Did the Profits Actually Turn Into Cash?'
          : 'Reported Net Profit (PAT) vs. Real Operating Cash Flow (OCF)',
        subtext:
          'Signature VERA Audit: Checks if accounting profits match money entering the bank account.',
        textStyle: { fontSize: 15, fontWeight: 700, color: '#111827' },
        subtextStyle: { fontSize: 11, color: '#6b7280' },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        textStyle: { color: '#f9fafb', fontSize: 12 },
        formatter: (params: any) => {
          if (!Array.isArray(params)) return '';
          const pName = params[0]?.name;
          const pat = params.find((p: any) => p.seriesName.includes('PAT'))?.value || 0;
          const ocf = params.find((p: any) => p.seriesName.includes('Cash Flow'))?.value || 0;
          const ratio = pat > 0 ? ((ocf / pat) * 100).toFixed(0) : '0';

          return `<div class="font-bold text-xs mb-1.5 pb-1 border-b border-neutral-700">${pName} Quality Audit</div>
            <div class="flex items-center justify-between gap-4 text-xs py-0.5">
              <span class="text-neutral-300">Reported Net Profit (PAT):</span>
              <span class="font-mono font-bold">₹${Number(pat).toLocaleString('en-IN')} Cr</span>
            </div>
            <div class="flex items-center justify-between gap-4 text-xs py-0.5">
              <span class="text-neutral-400">Operating Cash Flow (OCF):</span>
              <span class="font-mono font-bold">₹${Number(ocf).toLocaleString('en-IN')} Cr</span>
            </div>
            <div class="flex items-center justify-between gap-4 text-xs py-1 mt-1 border-t border-neutral-800 text-white font-medium">
              <span>Cash Conversion Quality:</span>
              <span class="font-mono font-bold">${ratio}% of PAT</span>
            </div>
            <div class="text-[10px] text-neutral-400 mt-1 italic">Click bar to inspect in VERA AI</div>`;
        },
      },
      legend: {
        top: 28,
        right: 0,
        textStyle: { fontSize: 11, color: '#4b5563' },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '8%',
        top: 75,
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: periods,
        axisLine: { lineStyle: { color: '#e5e7eb' } },
        axisLabel: { color: '#6b7280', fontSize: 11, fontWeight: 600 },
      },
      yAxis: {
        type: 'value',
        axisLine: { show: false },
        splitLine: { lineStyle: { color: '#f3f4f6', type: 'dashed' } },
        axisLabel: {
          color: '#6b7280',
          fontSize: 10,
          formatter: (v: number) => `₹${Math.round(v / 1000)}k Cr`,
        },
      },
      series: [
        {
          name: isSimplified ? 'Paper Profit (PAT)' : 'Reported Net Profit (PAT)',
          type: 'bar',
          data: filteredHistory.map((h) => h.patCr),
          itemStyle: { color: '#8b5cf6', borderRadius: [4, 4, 0, 0] },
          barGap: '15%',
        },
        {
          name: isSimplified ? 'Real Cash in Bank (OCF)' : 'Operating Cash Flow (OCF)',
          type: 'bar',
          data: filteredHistory.map((h) => h.ocfCr),
          itemStyle: { color: '#0284c7', borderRadius: [4, 4, 0, 0] },
        },
      ],
    };
  }, [filteredHistory, periods, isSimplified]);

  return (
    <div className="bg-white rounded-2xl border border-neutral-200/80 p-5 shadow-2xs space-y-4">
      {/* Divergence Banner */}
      {divergence && (
        <div
          className="p-3.5 rounded-xl border border-neutral-300 bg-neutral-50 text-neutral-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
        >
          <div className="flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-neutral-900 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">{divergence.explanation}</span>
              <p className="text-[11px] mt-0.5 opacity-90">{divergence.retailTakeaway}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
            <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-white/70 border border-neutral-200 font-semibold">
              PAT: {divergence.patGrowthPct > 0 ? '+' : ''}{divergence.patGrowthPct}% | OCF: {divergence.ocfGrowthPct > 0 ? '+' : ''}{divergence.ocfGrowthPct}%
            </span>
          </div>
        </div>
      )}

      <EChartWrapper
        chartId="profit-vs-ocf"
        option={option}
        height="380px"
        onPointClick={(point) => setSelectedPoint(point)}
      />

      <div className="flex items-center justify-between text-xs text-neutral-500 pt-2 border-t border-neutral-100">
        <span className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-purple-600" />
          <span>If purple bars rise while blue bars sink, investigate rising receivables or inventories.</span>
        </span>
        <span className="font-mono text-[11px] text-neutral-400">SEBI Reg 33 Statutory Data</span>
      </div>
    </div>
  );
};
