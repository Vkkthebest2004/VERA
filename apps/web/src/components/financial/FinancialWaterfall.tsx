'use client';

import React, { useMemo } from 'react';
import { EChartWrapper } from '../visualization/EChartWrapper';
import { useVisualizationStore } from '@/state/visualizationStore';
import { EChartsOption } from 'echarts';

export const FinancialWaterfall: React.FC = () => {
  const { getCurrentCompanyRecord, timeRange, setSelectedPoint, isSimplified } =
    useVisualizationStore();

  const record = getCurrentCompanyRecord();

  // Use the latest year in selected range, e.g. FY26
  const targetYearData = useMemo(() => {
    const found = record.history.find((h) => h.period === timeRange[1]);
    return found || record.history[record.history.length - 1];
  }, [record, timeRange]);

  const option: EChartsOption = useMemo(() => {
    const rev = targetYearData.revenueCr;
    const exp = targetYearData.expensesCr;
    const ebitda = targetYearData.ebitdaCr;
    const dep = targetYearData.depreciationCr;
    const ebit = ebitda - dep;
    const int = targetYearData.interestCr;
    const pbt = ebit - int;
    const tax = targetYearData.taxCr;
    const pat = targetYearData.patCr;

    // Waterfall steps:
    // 0: Revenue (Total)
    // 1: Operating Costs (Deduction)
    // 2: EBITDA (Subtotal)
    // 3: Depreciation (Deduction)
    // 4: Interest Cost (Deduction)
    // 5: Taxes Paid (Deduction)
    // 6: Net Profit (Final)

    const categories = [
      'Revenue',
      'Operating Costs',
      'EBITDA',
      'Depreciation',
      'Interest Cost',
      'Govt Taxes',
      'Net Profit (PAT)',
    ];

    // Transparent baseline for floating waterfall steps
    const baseLine = [
      0, // Revenue starts at 0
      rev - exp, // Costs float between (rev - exp) and rev
      0, // EBITDA subtotal from 0
      ebitda - dep, // Dep floats
      ebitda - dep - int, // Interest floats
      pat, // Taxes float above PAT
      0, // PAT ends at 0
    ];

    const values = [rev, exp, ebitda, dep, int, tax, pat];

    const colors = [
      '#4f46e5', // Revenue (Indigo)
      '#f43f5e', // Costs (Rose deduction)
      '#059669', // EBITDA (Emerald subtotal)
      '#f59e0b', // Depreciation (Amber deduction)
      '#ef4444', // Interest (Red deduction)
      '#f97316', // Taxes (Orange deduction)
      '#7c3aed', // PAT (Violet final)
    ];

    const plainExplanations = [
      'Total gross receipts from customers across all operational subsidiaries.',
      'Raw materials, employee salaries, plant utilities, and operating overheads.',
      'Cash profit generated directly by daily business operations.',
      'Wear and tear accounting write-down on machinery, refineries, and assets.',
      'Interest paid to banks and bondholders on outstanding conglomerate debt.',
      'Direct corporate income taxes paid to central and state authorities.',
      'True net earnings pocketed and added to shareholder equity reserves.',
    ];

    return {
      title: {
        text: isSimplified
          ? `Where Did the Money Go in ${targetYearData.period}?`
          : `${record.name} — Full P&L Waterfall Bridge (${targetYearData.period})`,
        subtext:
          'Step-by-step financial cascade: From gross revenue down to final shareholder net profit.',
        textStyle: { fontSize: 15, fontWeight: 700, color: '#111827' },
        subtextStyle: { fontSize: 11, color: '#6b7280' },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        textStyle: { color: '#f9fafb', fontSize: 12 },
        formatter: (params: any) => {
          const idx = params[1]?.dataIndex ?? params[0]?.dataIndex ?? 0;
          const cat = categories[idx];
          const val = values[idx];
          const expText = plainExplanations[idx];

          return `<div class="font-bold text-xs mb-1 pb-1 border-b border-neutral-700">${cat} (${targetYearData.period})</div>
            <div class="text-sm font-mono font-bold text-neutral-100 mb-1.5">₹${val.toLocaleString('en-IN')} Cr</div>
            <div class="text-xs text-neutral-300 leading-relaxed max-w-xs">${expText}</div>`;
        },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '12%',
        top: 75,
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: categories,
        axisLine: { lineStyle: { color: '#e5e7eb' } },
        axisLabel: {
          color: '#374151',
          fontSize: 11,
          fontWeight: 600,
          interval: 0,
          rotate: 15,
        },
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
          name: 'Placeholder Base',
          type: 'bar',
          stack: 'waterfall',
          itemStyle: { borderColor: 'transparent', color: 'transparent' },
          emphasis: { itemStyle: { borderColor: 'transparent', color: 'transparent' } },
          data: baseLine,
        },
        {
          name: 'Amount',
          type: 'bar',
          stack: 'waterfall',
          data: values.map((val, i) => ({
            value: val,
            itemStyle: { color: colors[i], borderRadius: 4 },
          })),
          label: {
            show: true,
            position: 'top',
            formatter: (p: any) => `₹${Math.round(p.value / 1000)}k`,
            fontSize: 10,
            fontWeight: 700,
            color: '#374151',
          },
        },
      ],
    };
  }, [targetYearData, record, isSimplified]);

  return (
    <div className="bg-white rounded-2xl border border-neutral-200/80 p-5 shadow-2xs space-y-4">
      <EChartWrapper
        chartId="financial-waterfall"
        option={option}
        height="390px"
        onPointClick={(point) => setSelectedPoint(point)}
      />

      <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
        <span>
          Selected Period: <strong className="text-neutral-900">{targetYearData.period}</strong> (Net Profit Retention:{' '}
          <strong className="text-purple-700 font-mono">
            {((targetYearData.patCr / targetYearData.revenueCr) * 100).toFixed(1)}%
          </strong>
          )
        </span>
        <span className="text-[11px] italic text-neutral-400">Hover any bar for plain-language accounting explanation</span>
      </div>
    </div>
  );
};
