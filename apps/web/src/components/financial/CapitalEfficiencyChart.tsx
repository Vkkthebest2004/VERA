'use client';

import React, { useMemo } from 'react';
import { EChartWrapper } from '../visualization/EChartWrapper';
import { useVisualizationStore } from '@/state/visualizationStore';
import { computeFinancialMetrics } from '@/lib/financial/financialMath';
import { EChartsOption } from 'echarts';

export const CapitalEfficiencyChart: React.FC = () => {
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

  const metrics = useMemo(() => {
    return filteredHistory.map((h) => computeFinancialMetrics(h));
  }, [filteredHistory]);

  const latestROCE = metrics[metrics.length - 1]?.rocePct || 0;
  const latestROE = metrics[metrics.length - 1]?.roePct || 0;

  const option: EChartsOption = useMemo(() => {
    const roceData = metrics.map((m) => m.rocePct);
    const roeData = metrics.map((m) => m.roePct);

    return {
      title: {
        text: isSimplified
          ? 'How Efficiently Does the Company Multiply Its Money?'
          : `${record.name} — Capital Efficiency (ROCE vs. ROE %)`,
        subtext:
          'Return on Capital Employed (ROCE) and Return on Equity (ROE) over the economic cycle.',
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
          let s = `<div class="font-bold text-xs mb-1 border-b border-neutral-700 pb-1">${params[0].name} Efficiency</div>`;
          params.forEach((p: any) => {
            s += `<div class="flex items-center justify-between gap-4 text-xs py-0.5">
              <span>${p.marker} ${p.seriesName}:</span>
              <span class="font-mono font-bold">${p.value}% (₹${p.value} per ₹100)</span>
            </div>`;
          });
          return s;
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
          formatter: '{value}%',
        },
      },
      series: [
        {
          name: isSimplified ? 'Earnings per ₹100 Invested (ROCE)' : 'ROCE % (Capital Employed)',
          type: 'line',
          smooth: true,
          data: roceData,
          itemStyle: { color: '#4f46e5' },
          lineStyle: { width: 3 },
          symbolSize: 8,
          markLine: {
            silent: true,
            data: [{ yAxis: 15, name: 'Cost of Capital Hurdle (15%)' }],
            lineStyle: { type: 'dashed', color: '#9ca3af' },
            label: { formatter: '15% Benchmark', position: 'end', fontSize: 10 },
          },
        },
        {
          name: isSimplified ? 'Shareholder Return (ROE)' : 'ROE % (Shareholder Equity)',
          type: 'line',
          smooth: true,
          data: roeData,
          itemStyle: { color: '#059669' },
          lineStyle: { width: 2.5 },
          symbolSize: 7,
        },
      ],
    };
  }, [periods, metrics, record, isSimplified]);

  return (
    <div className="bg-white rounded-2xl border border-neutral-200/80 p-5 shadow-2xs space-y-4">
      {/* Retail Investor Plain-Language Card */}
      <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div>
          <span className="font-bold text-neutral-900 block text-xs">
            Retail Investor Translation:
          </span>
          <p className="text-neutral-700 text-[11px] mt-0.5">
            For every ₹100 of total capital deployed in factories, towers, and inventory, {record.name}{' '}
            generated <strong className="underline">₹{latestROCE.toFixed(2)}</strong> of operating profit in {periods[periods.length - 1]}.
          </p>
        </div>
        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
          <span className="px-2.5 py-1 rounded bg-white font-mono font-bold text-neutral-900 shadow-2xs border border-neutral-300">
            ROCE: {latestROCE}%
          </span>
          <span className="px-2.5 py-1 rounded bg-white font-mono font-bold text-neutral-900 shadow-2xs border border-neutral-300">
            ROE: {latestROE}%
          </span>
        </div>
      </div>

      <EChartWrapper
        chartId="capital-efficiency"
        option={option}
        height="360px"
        onPointClick={(point) => setSelectedPoint(point)}
      />

      <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
        <span>A consistently high ROCE above the cost of capital creates sustainable shareholder value.</span>
        <span className="font-mono text-[11px] text-neutral-400">Audited Financial Ratios</span>
      </div>
    </div>
  );
};
