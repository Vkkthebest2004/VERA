'use client';

import React, { useMemo } from 'react';
import { EChartWrapper } from '../visualization/EChartWrapper';
import { useVisualizationStore } from '@/state/visualizationStore';
import { EChartsOption } from 'echarts';

export const CompanyGrowthChart: React.FC = () => {
  const {
    getCurrentCompanyRecord,
    timeRange,
    activeSeries,
    chartType,
    displayMode,
    isSimplified,
    setSelectedPoint,
  } = useVisualizationStore();

  const record = getCurrentCompanyRecord();

  // Filter history to current timeRange
  const filteredHistory = useMemo(() => {
    const fromIdx = record.history.findIndex((h) => h.period === timeRange[0]);
    const toIdx = record.history.findIndex((h) => h.period === timeRange[1]);
    const start = fromIdx >= 0 ? fromIdx : 0;
    const end = toIdx >= 0 ? toIdx + 1 : record.history.length;
    return record.history.slice(start, end);
  }, [record, timeRange]);

  const periods = filteredHistory.map((h) => h.period);

  const option: EChartsOption = useMemo(() => {
    const seriesList: any[] = [];

    // Colors: Indigo (Revenue), Emerald (EBITDA), Violet (PAT), Cyan (OCF)
    if (activeSeries.includes('revenue')) {
      seriesList.push({
        name: isSimplified ? 'Sales (Customer Inflows)' : 'Revenue from Operations',
        type: chartType === 'bar' ? 'bar' : 'line',
        smooth: true,
        data: filteredHistory.map((h) => h.revenueCr),
        itemStyle: { color: '#4f46e5' },
        lineStyle: { width: 3 },
        areaStyle:
          chartType === 'line' && !isSimplified
            ? {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    { offset: 0, color: 'rgba(79, 70, 229, 0.22)' },
                    { offset: 1, color: 'rgba(79, 70, 229, 0.0)' },
                  ],
                },
              }
            : undefined,
      });
    }

    if (activeSeries.includes('ebitda')) {
      seriesList.push({
        name: isSimplified ? 'Operating Earnings' : 'EBITDA (Core Cash Profit)',
        type: chartType === 'bar' ? 'bar' : 'line',
        smooth: true,
        data: filteredHistory.map((h) => h.ebitdaCr),
        itemStyle: { color: '#059669' },
        lineStyle: { width: 2.5 },
      });
    }

    if (activeSeries.includes('pat')) {
      seriesList.push({
        name: isSimplified ? 'Net Profit (Bottom Line)' : 'Net Profit (PAT)',
        type: chartType === 'bar' ? 'bar' : 'line',
        smooth: true,
        data: filteredHistory.map((h) => h.patCr),
        itemStyle: { color: '#7c3aed' },
        lineStyle: { width: 3 },
      });
    }

    if (activeSeries.includes('ocf')) {
      seriesList.push({
        name: isSimplified ? 'Cash In Bank' : 'Operating Cash Flow (OCF)',
        type: chartType === 'bar' ? 'bar' : 'line',
        smooth: true,
        data: filteredHistory.map((h) => h.ocfCr),
        itemStyle: { color: '#0284c7' },
        lineStyle: { width: 2.5, type: 'dashed' },
      });
    }

    return {
      title: {
        text: isSimplified
          ? 'How Much Money Does the Company Make?'
          : `${record.name} — Growth & Cash Generation Timeline`,
        subtext: isSimplified
          ? 'Comparing customer sales, operating earnings, real bottom-line profit, and actual cash in the bank.'
          : 'Consolidated Audited Figures in ₹ Crores (Source: BSE/NSE Regulatory Disclosures)',
        left: '0',
        textStyle: { fontSize: 15, fontWeight: 700, color: '#111827' },
        subtextStyle: { fontSize: 11, color: '#6b7280' },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'cross' },
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        borderColor: '#374151',
        textStyle: { color: '#f9fafb', fontSize: 12 },
        formatter: (params: any) => {
          if (!Array.isArray(params) || params.length === 0) return '';
          let tip = `<div class="font-bold text-xs mb-1.5 pb-1 border-b border-neutral-700">${params[0].name}</div>`;
          params.forEach((p: any) => {
            tip += `<div class="flex items-center justify-between gap-4 text-xs py-0.5">
              <span class="flex items-center gap-1.5">${p.marker} <span>${p.seriesName}</span></span>
              <span class="font-mono font-bold text-neutral-100">₹${Number(p.value).toLocaleString('en-IN')} Cr</span>
            </div>`;
          });
          tip += `<div class="text-[10px] text-neutral-400 mt-2 italic">Click point to examine in conversational AI</div>`;
          return tip;
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
          formatter: (val: number) => {
            if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L Cr`;
            if (val >= 1000) return `₹${(val / 1000).toFixed(0)}k Cr`;
            return `₹${val} Cr`;
          },
        },
      },
      series: seriesList,
    };
  }, [record, filteredHistory, periods, activeSeries, chartType, isSimplified]);

  return (
    <div className="bg-white rounded-2xl border border-neutral-200/80 p-5 shadow-2xs space-y-4">
      <EChartWrapper
        chartId="growth-timeline"
        option={option}
        height="380px"
        onPointClick={(point) => setSelectedPoint(point)}
      />

      {/* Retail Investor Footnote */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-neutral-100 text-xs text-neutral-500">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>
            {record.ticker}: 10-Yr Revenue CAGR is{' '}
            <strong className="text-neutral-900 font-mono">
              {((Math.pow(filteredHistory[filteredHistory.length - 1]?.revenueCr / (filteredHistory[0]?.revenueCr || 1), 1 / (filteredHistory.length || 1)) - 1) * 100).toFixed(1)}%
            </strong>
          </span>
        </div>
        <span className="italic text-[11px] text-neutral-400">
          Click any bar or line point to sync chat context
        </span>
      </div>
    </div>
  );
};
