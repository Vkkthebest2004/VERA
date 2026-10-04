'use client';

import React, { useMemo } from 'react';
import { EChartWrapper } from '../visualization/EChartWrapper';
import { useVisualizationStore } from '@/state/visualizationStore';
import { EChartsOption } from 'echarts';

export const WorkingCapitalChart: React.FC = () => {
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
    const debtorDays = filteredHistory.map((h) => h.debtorDays);
    const inventoryDays = filteredHistory.map((h) => h.inventoryDays);
    const payableDays = filteredHistory.map((h) => h.payableDays);
    const ccc = filteredHistory.map(
      (h) => h.debtorDays + h.inventoryDays - h.payableDays
    );

    return {
      title: {
        text: isSimplified
          ? 'How Quickly Does Cash Cycle Through the Business?'
          : `${record.name} — Working Capital & Cash Conversion Cycle (Days)`,
        subtext:
          'Cash Conversion Cycle (CCC) = Debtor Days + Inventory Days – Payable Days.',
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
          let s = `<div class="font-bold text-xs mb-1 border-b border-neutral-700 pb-1">${params[0].name} Working Capital</div>`;
          params.forEach((p: any) => {
            s += `<div class="flex items-center justify-between gap-4 text-xs py-0.5">
              <span>${p.marker} ${p.seriesName}:</span>
              <span class="font-mono font-bold">${p.value} Days</span>
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
        name: 'Days',
        axisLine: { show: false },
        splitLine: { lineStyle: { color: '#f3f4f6', type: 'dashed' } },
        axisLabel: {
          color: '#6b7280',
          fontSize: 10,
          formatter: '{value}d',
        },
      },
      series: [
        {
          name: isSimplified ? 'Customer Payment Time (Debtors)' : 'Receivable Days (Debtor Days)',
          type: 'bar',
          data: debtorDays,
          itemStyle: { color: '#0284c7', borderRadius: [4, 4, 0, 0] },
        },
        {
          name: isSimplified ? 'Stock on Shelf (Inventory)' : 'Inventory Days',
          type: 'bar',
          data: inventoryDays,
          itemStyle: { color: '#d97706', borderRadius: [4, 4, 0, 0] },
        },
        {
          name: isSimplified ? 'Supplier Credit Time (Payables)' : 'Payable Days',
          type: 'bar',
          data: payableDays,
          itemStyle: { color: '#6b7280', borderRadius: [4, 4, 0, 0] },
        },
        {
          name: 'Cash Conversion Cycle (CCC)',
          type: 'line',
          smooth: true,
          data: ccc,
          itemStyle: { color: '#7c3aed' },
          lineStyle: { width: 3 },
          symbolSize: 8,
        },
      ],
    };
  }, [filteredHistory, periods, record, isSimplified]);

  return (
    <div className="bg-white rounded-2xl border border-neutral-200/80 p-5 shadow-2xs space-y-4">
      <EChartWrapper
        chartId="working-capital"
        option={option}
        height="380px"
        onPointClick={(point) => setSelectedPoint(point)}
      />

      <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
        <span>A lower or negative Cash Conversion Cycle means the business effectively funds its operations using supplier credit.</span>
        <span className="font-mono text-[11px] text-neutral-400">Audited Balance Sheet Notes</span>
      </div>
    </div>
  );
};
