'use client';

import React, { useMemo } from 'react';
import { EChartWrapper } from '../visualization/EChartWrapper';
import { useVisualizationStore } from '@/state/visualizationStore';
import { computeFinancialMetrics } from '@/lib/financial/financialMath';
import { ShieldCheck, AlertCircle, Info } from 'lucide-react';
import { EChartsOption } from 'echarts';

export const DebtHealthChart: React.FC = () => {
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

  const latestMetrics = metrics[metrics.length - 1];

  const option: EChartsOption = useMemo(() => {
    const totalDebt = filteredHistory.map((h) => h.totalDebtCr);
    const netDebt = metrics.map((m) => m.netDebtCr);
    const interestCoverage = metrics.map((m) => m.interestCoverageRatio);

    return {
      title: {
        text: isSimplified
          ? 'How Much Debt Does the Company Owe?'
          : `${record.name} — Debt Health & Interest Coverage Solvency`,
        subtext:
          'Monitors loan obligations, net debt after cash, and ability to comfortably pay annual interest.',
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
          let s = `<div class="font-bold text-xs mb-1 border-b border-neutral-700 pb-1">${params[0].name} Debt Health</div>`;
          params.forEach((p: any) => {
            const isRatio = p.seriesName.includes('Coverage');
            s += `<div class="flex items-center justify-between gap-4 text-xs py-0.5">
              <span>${p.marker} ${p.seriesName}:</span>
              <span class="font-mono font-bold">${isRatio ? p.value + 'x' : '₹' + Number(p.value).toLocaleString('en-IN') + ' Cr'}</span>
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
      yAxis: [
        {
          type: 'value',
          name: 'Debt (₹ Cr)',
          axisLine: { show: false },
          splitLine: { lineStyle: { color: '#f3f4f6', type: 'dashed' } },
          axisLabel: {
            color: '#6b7280',
            fontSize: 10,
            formatter: (v: number) => `₹${Math.round(v / 1000)}k Cr`,
          },
        },
        {
          type: 'value',
          name: 'Interest Coverage (x)',
          position: 'right',
          axisLine: { show: false },
          splitLine: { show: false },
          axisLabel: {
            color: '#059669',
            fontSize: 10,
            formatter: '{value}x',
          },
        },
      ],
      series: [
        {
          name: isSimplified ? 'Total Loans' : 'Total Borrowings (Gross Debt)',
          type: 'bar',
          data: totalDebt,
          itemStyle: { color: '#f59e0b', borderRadius: [4, 4, 0, 0] },
          barGap: '15%',
        },
        {
          name: isSimplified ? 'Net Debt (Loans minus Cash)' : 'Net Debt',
          type: 'bar',
          data: netDebt,
          itemStyle: { color: '#dc2626', borderRadius: [4, 4, 0, 0] },
        },
        {
          name: 'Interest Coverage Ratio',
          type: 'line',
          yAxisIndex: 1,
          smooth: true,
          data: interestCoverage,
          itemStyle: { color: '#059669' },
          lineStyle: { width: 3 },
          symbolSize: 7,
        },
      ],
    };
  }, [filteredHistory, metrics, periods, record, isSimplified]);

  return (
    <div className="bg-white rounded-2xl border border-neutral-200/80 p-5 shadow-2xs space-y-4">
      {/* Solvency Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/70 text-xs">
          <span className="text-neutral-500 text-[11px] block mb-0.5">Debt / EBITDA</span>
          <span className="text-lg font-bold text-neutral-900 font-mono">
            {latestMetrics?.debtToEbitda}x
          </span>
          <p className="text-[10px] text-neutral-500 mt-0.5">
            {latestMetrics?.debtToEbitda < 3 ? 'Healthy leverage (<3.0x)' : 'Moderate leverage'}
          </p>
        </div>

        <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/70 text-xs">
          <span className="text-neutral-500 text-[11px] block mb-0.5">Interest Coverage</span>
          <span className="text-lg font-bold text-emerald-700 font-mono">
            {latestMetrics?.interestCoverageRatio}x
          </span>
          <p className="text-[10px] text-neutral-500 mt-0.5">
            Operating profit can pay interest {latestMetrics?.interestCoverageRatio} times over
          </p>
        </div>

        <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/70 text-xs">
          <span className="text-neutral-500 text-[11px] block mb-0.5">Cash Cushion</span>
          <span className="text-lg font-bold text-neutral-900 font-mono">
            ₹{filteredHistory[filteredHistory.length - 1]?.cashCr.toLocaleString('en-IN')} Cr
          </span>
          <p className="text-[10px] text-neutral-500 mt-0.5">
            Liquid treasury cash and current investments
          </p>
        </div>
      </div>

      <EChartWrapper
        chartId="debt-health"
        option={option}
        height="360px"
        onPointClick={(point) => setSelectedPoint(point)}
      />

      <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Interest coverage above 3.0x indicates strong debt solvency and minimal default risk.</span>
        </span>
        <span className="text-[11px] font-mono text-neutral-400">SEBI Reg 33 Audited</span>
      </div>
    </div>
  );
};
