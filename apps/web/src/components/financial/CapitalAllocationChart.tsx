'use client';

import React, { useMemo } from 'react';
import { EChartWrapper } from '../visualization/EChartWrapper';
import { useVisualizationStore } from '@/state/visualizationStore';
import { EChartsOption } from 'echarts';

export const CapitalAllocationChart: React.FC = () => {
  const { getCurrentCompanyRecord, setSelectedPoint, isSimplified } = useVisualizationStore();
  const record = getCurrentCompanyRecord();

  const allocData = record.capitalAllocation;
  const periods = allocData.map((d) => d.period);

  const option: EChartsOption = useMemo(() => {
    return {
      title: {
        text: isSimplified
          ? 'Where Did Management Spend the Money?'
          : `${record.name} — Capital Allocation Strategy (₹ Crores)`,
        subtext:
          'Breakdown of capital deployed between new CapEx growth, dividend returns, debt retirement, and M&A.',
        textStyle: { fontSize: 15, fontWeight: 700, color: '#111827' },
        subtextStyle: { fontSize: 11, color: '#6b7280' },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        textStyle: { color: '#f9fafb', fontSize: 12 },
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
          name: isSimplified ? 'New Factories & Plants (CapEx)' : 'Organic CapEx',
          type: 'bar',
          stack: 'allocation',
          data: allocData.map((d) => d.capexCr),
          itemStyle: { color: '#4f46e5' },
        },
        {
          name: isSimplified ? 'Debt Paid Back' : 'Debt Repayment',
          type: 'bar',
          stack: 'allocation',
          data: allocData.map((d) => d.debtRepaidCr),
          itemStyle: { color: '#059669' },
        },
        {
          name: isSimplified ? 'Cash to Shareholders (Dividends)' : 'Dividends Paid',
          type: 'bar',
          stack: 'allocation',
          data: allocData.map((d) => d.dividendsCr),
          itemStyle: { color: '#0284c7' },
        },
        {
          name: isSimplified ? 'Buying Other Companies (M&A)' : 'Acquisitions',
          type: 'bar',
          stack: 'allocation',
          data: allocData.map((d) => d.acquisitionsCr),
          itemStyle: { color: '#d97706' },
        },
      ],
    };
  }, [allocData, periods, record, isSimplified]);

  return (
    <div className="bg-white rounded-2xl border border-neutral-200/80 p-5 shadow-2xs space-y-4">
      <EChartWrapper
        chartId="capital-allocation"
        option={option}
        height="380px"
        onPointClick={(point) => setSelectedPoint(point)}
      />

      <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
        <span>Prudent capital allocators balance internal expansion CapEx with shareholder dividend discipline.</span>
        <span className="font-mono text-[11px] text-neutral-400">Cash Flow Reconciliations</span>
      </div>
    </div>
  );
};
