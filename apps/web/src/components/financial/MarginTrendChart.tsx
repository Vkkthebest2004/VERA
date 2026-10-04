'use client';

import React, { useMemo } from 'react';
import { EChartWrapper } from '../visualization/EChartWrapper';
import { useVisualizationStore } from '@/state/visualizationStore';
import { EChartsOption } from 'echarts';

export const MarginTrendChart: React.FC = () => {
  const { getCurrentCompanyRecord, timeRange, displayMode, setSelectedPoint, isSimplified } =
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
  const isPercentage = displayMode === 'percentage' || true; // Margin charts default to %

  const option: EChartsOption = useMemo(() => {
    const ebitdaMargins = filteredHistory.map((h) =>
      Number(((h.ebitdaCr / h.revenueCr) * 100).toFixed(1))
    );
    const patMargins = filteredHistory.map((h) =>
      Number(((h.patCr / h.revenueCr) * 100).toFixed(1))
    );

    return {
      title: {
        text: isSimplified
          ? 'How Much of Every Rupee Does the Company Keep?'
          : 'Profitability Margin Evolution (Operating vs. Net Margin %)',
        subtext:
          'Tracks operational pricing power (EBITDA margin) and post-tax retention (PAT margin).',
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
          let s = `<div class="font-bold text-xs mb-1 border-b border-neutral-700 pb-1">${params[0].name} Margins</div>`;
          params.forEach((p: any) => {
            s += `<div class="flex items-center justify-between gap-4 text-xs py-0.5">
              <span>${p.marker} ${p.seriesName}:</span>
              <span class="font-mono font-bold">${p.value}%</span>
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
          name: isSimplified ? 'Operating Cushion (EBITDA %)' : 'EBITDA Margin %',
          type: 'line',
          smooth: true,
          data: ebitdaMargins,
          itemStyle: { color: '#059669' },
          lineStyle: { width: 3 },
          markPoint: {
            data: [
              { type: 'max', name: 'Peak Margin' },
              { type: 'min', name: 'Trough' },
            ],
            label: { formatter: '{c}%', fontSize: 10 },
          },
        },
        {
          name: isSimplified ? 'Final Profit Pocketed (PAT %)' : 'Net Profit Margin %',
          type: 'line',
          smooth: true,
          data: patMargins,
          itemStyle: { color: '#7c3aed' },
          lineStyle: { width: 2.5 },
        },
      ],
    };
  }, [filteredHistory, periods, isSimplified]);

  return (
    <div className="bg-white rounded-2xl border border-neutral-200/80 p-5 shadow-2xs space-y-4">
      <EChartWrapper
        chartId="margin-trend"
        option={option}
        height="380px"
        onPointClick={(point) => setSelectedPoint(point)}
      />

      <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
        <span>
          Latest EBITDA Margin:{' '}
          <strong className="text-emerald-700 font-mono">
            {((filteredHistory[filteredHistory.length - 1]?.ebitdaCr / (filteredHistory[filteredHistory.length - 1]?.revenueCr || 1)) * 100).toFixed(1)}%
          </strong>
        </span>
        <span className="text-[11px] italic text-neutral-400">
          Expanding margins signify pricing power and operating leverage
        </span>
      </div>
    </div>
  );
};
