'use client';

import React, { useMemo } from 'react';
import { EChartWrapper } from '../visualization/EChartWrapper';
import { useVisualizationStore } from '@/state/visualizationStore';
import { Info, ShieldAlert } from 'lucide-react';
import { EChartsOption } from 'echarts';

export const ValuationChart: React.FC = () => {
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

  const medianPE = useMemo(() => {
    const peList = [...filteredHistory.map((h) => h.peRatio)].sort((a, b) => a - b);
    const mid = Math.floor(peList.length / 2);
    return peList.length % 2 !== 0 ? peList[mid] : (peList[mid - 1] + peList[mid]) / 2;
  }, [filteredHistory]);

  const latestPE = filteredHistory[filteredHistory.length - 1]?.peRatio || 0;

  const option: EChartsOption = useMemo(() => {
    const peValues = filteredHistory.map((h) => h.peRatio);

    return {
      title: {
        text: isSimplified
          ? 'Price-to-Earnings (P/E): What Price are Investors Paying for ₹1 of Profit?'
          : `${record.name} — Valuation Context & Historical P/E Multiple`,
        subtext:
          'Evaluates current valuation multiple against 10-year historical median (Non-advisory context).',
        textStyle: { fontSize: 15, fontWeight: 700, color: '#111827' },
        subtextStyle: { fontSize: 11, color: '#6b7280' },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'cross' },
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        textStyle: { color: '#f9fafb', fontSize: 12 },
        formatter: (params: any) => {
          if (!Array.isArray(params)) return '';
          const p = params[0];
          return `<div class="font-bold text-xs mb-1 pb-1 border-b border-neutral-700">${p.name} Valuation</div>
            <div class="text-xs py-0.5">P/E Multiple: <strong class="font-mono text-white">${p.value}x</strong></div>
            <div class="text-xs py-0.5 text-neutral-400">10-Yr Median: <strong class="font-mono">${medianPE}x</strong></div>`;
        },
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
        name: 'P/E (x)',
        axisLine: { show: false },
        splitLine: { lineStyle: { color: '#f3f4f6', type: 'dashed' } },
        axisLabel: {
          color: '#6b7280',
          fontSize: 10,
          formatter: '{value}x',
        },
      },
      series: [
        {
          name: 'P/E Multiple',
          type: 'line',
          smooth: true,
          data: peValues,
          itemStyle: { color: '#d97706' },
          lineStyle: { width: 3 },
          symbolSize: 8,
          markLine: {
            silent: true,
            data: [{ yAxis: medianPE, name: `Median: ${medianPE}x` }],
            lineStyle: { type: 'dashed', color: '#6b7280', width: 2 },
            label: { formatter: `Median: ${medianPE}x`, position: 'end', fontSize: 11, color: '#4b5563' },
          },
        },
      ],
    };
  }, [filteredHistory, periods, medianPE, record, isSimplified]);

  return (
    <div className="bg-white rounded-2xl border border-neutral-200/80 p-5 shadow-2xs space-y-4">
      {/* Strict Educational Non-Advisory Panel */}
      <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200/70 text-xs text-neutral-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="font-bold text-neutral-900 block">
            Valuation Context Analysis:
          </span>
          <p className="text-[11px] text-neutral-600 mt-0.5">
            Current P/E of <strong className="font-mono text-neutral-900">{latestPE}x</strong> is{' '}
            {latestPE > medianPE ? (
              <span className="text-neutral-900 font-semibold">above its historical median of {medianPE}x</span>
            ) : (
              <span className="text-neutral-900 font-semibold">below its historical median of {medianPE}x</span>
            )}. VERA never provides price targets or trading signals.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="px-2.5 py-1 rounded bg-white border border-neutral-300 font-mono font-bold text-neutral-900 text-[11px]">
            Latest P/E: {latestPE}x
          </span>
          <span className="px-2.5 py-1 rounded bg-white border border-neutral-300 font-mono font-bold text-neutral-600 text-[11px]">
            Median: {medianPE}x
          </span>
        </div>
      </div>

      <EChartWrapper
        chartId="valuation-context"
        option={option}
        height="360px"
        onPointClick={(point) => setSelectedPoint(point)}
      />

      <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
        <span className="flex items-center gap-1.5 text-neutral-500">
          <Info className="w-3.5 h-3.5" />
          <span>Calculated against consolidated diluted earnings per share.</span>
        </span>
        <span className="font-mono text-[11px] text-neutral-400">Strictly Non-Advisory</span>
      </div>
    </div>
  );
};
