'use client';

import React, { useMemo } from 'react';
import { EChartWrapper } from '../visualization/EChartWrapper';
import { useVisualizationStore } from '@/state/visualizationStore';
import { EChartsOption } from 'echarts';

export const FreeCashFlowChart: React.FC = () => {
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
    const ocf = filteredHistory.map((h) => h.ocfCr);
    const capex = filteredHistory.map((h) => -h.capexCr); // Negative for outflow
    const fcf = filteredHistory.map((h) => h.ocfCr - h.capexCr);

    return {
      title: {
        text: isSimplified
          ? 'Free Cash Flow: Cash Left After Building New Plants'
          : 'Free Cash Flow (FCF = Operating Cash Flow – Capital Expenditure)',
        subtext:
          'True discretionary cash available for dividends, debt reduction, and strategic reserves.',
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
          const name = params[0]?.name;
          const ocfVal = params.find((p: any) => p.seriesName.includes('Operating Cash Flow'))?.value || 0;
          const capexVal = Math.abs(
            params.find((p: any) => p.seriesName.includes('CapEx'))?.value || 0
          );
          const fcfVal = params.find((p: any) => p.seriesName.includes('Free Cash Flow'))?.value || 0;

          return `<div class="font-bold text-xs mb-1.5 pb-1 border-b border-neutral-700">${name} Free Cash Flow</div>
            <div class="flex items-center justify-between gap-4 text-xs py-0.5 text-neutral-300">
              <span>(+) Cash from Operations:</span>
              <span class="font-mono font-bold">₹${Number(ocfVal).toLocaleString('en-IN')} Cr</span>
            </div>
            <div class="flex items-center justify-between gap-4 text-xs py-0.5 text-neutral-400">
              <span>(-) CapEx Spent:</span>
              <span class="font-mono font-bold">-₹${Number(capexVal).toLocaleString('en-IN')} Cr</span>
            </div>
            <div class="flex items-center justify-between gap-4 text-xs py-1 mt-1 border-t border-neutral-700 text-white font-bold">
              <span>(=) Free Cash Flow:</span>
              <span class="font-mono">₹${Number(fcfVal).toLocaleString('en-IN')} Cr</span>
            </div>`;
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
          name: 'Operating Cash Flow',
          type: 'bar',
          data: ocf,
          itemStyle: { color: '#0284c7', borderRadius: [4, 4, 0, 0] },
          barGap: '10%',
        },
        {
          name: 'CapEx (Infrastructure Spend)',
          type: 'bar',
          data: capex,
          itemStyle: { color: '#f43f5e', borderRadius: [0, 0, 4, 4] },
        },
        {
          name: 'Free Cash Flow (FCF)',
          type: 'line',
          smooth: true,
          data: fcf,
          itemStyle: { color: '#10b981' },
          lineStyle: { width: 3 },
          symbolSize: 8,
        },
      ],
    };
  }, [filteredHistory, periods, isSimplified]);

  return (
    <div className="bg-white rounded-2xl border border-neutral-200/80 p-5 shadow-2xs space-y-4">
      <EChartWrapper
        chartId="free-cash-flow"
        option={option}
        height="380px"
        onPointClick={(point) => setSelectedPoint(point)}
      />

      <div className="pt-2 border-t border-neutral-100 flex flex-wrap items-center justify-between text-xs text-neutral-500 gap-2">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-neutral-900" />
          <span>Positive Free Cash Flow means the company self-funds its expansion without reliance on debt.</span>
        </span>
        <span className="font-mono text-[11px] text-neutral-400">Audited Cash Flow Statements</span>
      </div>
    </div>
  );
};
