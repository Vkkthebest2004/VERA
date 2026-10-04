'use client';

import React, { useMemo } from 'react';
import { EChartWrapper } from '../visualization/EChartWrapper';
import { useVisualizationStore } from '@/state/visualizationStore';
import { EChartsOption } from 'echarts';

export const EPSChart: React.FC = () => {
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

  const option: EChartsOption = useMemo(() => {
    const epsValues = filteredHistory.map((h) => h.eps);

    return {
      title: {
        text: isSimplified
          ? 'Profit Earned for Every Single Share (EPS)'
          : `${record.name} — Diluted Earnings Per Share (EPS in ₹)`,
        subtext:
          'Net profit divided by total outstanding shares. Diluted for bonus shares & stock splits.',
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
          const p = params[0];
          return `<div class="font-bold text-xs mb-1 pb-1 border-b border-neutral-700">${p.name}</div>
            <div class="text-xs py-0.5">Diluted EPS: <strong class="font-mono text-white">₹${p.value} per share</strong></div>`;
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
        name: '₹ per share',
        axisLine: { show: false },
        splitLine: { lineStyle: { color: '#f3f4f6', type: 'dashed' } },
        axisLabel: {
          color: '#6b7280',
          fontSize: 10,
          formatter: '₹{value}',
        },
      },
      series: [
        {
          name: 'Diluted EPS',
          type: 'bar',
          data: epsValues,
          itemStyle: { color: '#8b5cf6', borderRadius: [4, 4, 0, 0] },
          label: {
            show: true,
            position: 'top',
            formatter: '₹{c}',
            fontSize: 10,
            fontWeight: 700,
            color: '#4b5563',
          },
        },
      ],
    };
  }, [filteredHistory, periods, record, isSimplified]);

  return (
    <div className="bg-white rounded-2xl border border-neutral-200/80 p-5 shadow-2xs space-y-4">
      <EChartWrapper
        chartId="eps-trend"
        option={option}
        height="380px"
        onPointClick={(point) => setSelectedPoint(point)}
      />

      <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
        <span>
          Current Diluted EPS:{' '}
          <strong className="text-neutral-900 font-mono">
            ₹{filteredHistory[filteredHistory.length - 1]?.eps}
          </strong>
        </span>
        <span className="font-mono text-[11px] text-neutral-400">SEBI Reg 33 Disclosures</span>
      </div>
    </div>
  );
};
