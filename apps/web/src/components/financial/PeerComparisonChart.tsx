'use client';

import React, { useMemo } from 'react';
import { EChartWrapper } from '../visualization/EChartWrapper';
import { useVisualizationStore } from '@/state/visualizationStore';
import { ShieldCheck, Info } from 'lucide-react';
import { EChartsOption } from 'echarts';

export const PeerComparisonChart: React.FC = () => {
  const { getCurrentCompanyRecord, selectedPeers, setSelectedPoint, isSimplified } =
    useVisualizationStore();

  const record = getCurrentCompanyRecord();

  // Combine target company + selected peers
  const activePeers = useMemo(() => {
    return record.peers;
  }, [record]);

  const option: EChartsOption = useMemo(() => {
    const peerNames = activePeers.map((p) => p.name);
    const growth = activePeers.map((p) => p.revenueGrowthPct);
    const ebitdaMargin = activePeers.map((p) => p.ebitdaMarginPct);
    const roce = activePeers.map((p) => p.rocePct);
    const debtRatio = activePeers.map((p) => p.debtToEbitda);

    return {
      title: {
        text: isSimplified
          ? 'How Does the Company Compare to Other Industry Leaders?'
          : `${record.name} — Peer Benchmarking & Structural Competitiveness`,
        subtext:
          'Comparative Financial Understanding (Strictly Non-Advisory / Educational Analysis)',
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
          let s = `<div class="font-bold text-xs mb-1 border-b border-neutral-700 pb-1">${params[0].name}</div>`;
          params.forEach((p: any) => {
            const isRatio = p.seriesName.includes('Debt');
            s += `<div class="flex items-center justify-between gap-4 text-xs py-0.5">
              <span>${p.marker} ${p.seriesName}:</span>
              <span class="font-mono font-bold">${p.value}${isRatio ? 'x' : '%'}</span>
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
        bottom: '12%',
        top: 75,
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: peerNames,
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
          formatter: '{value}%',
        },
      },
      series: [
        {
          name: 'Revenue Growth YoY %',
          type: 'bar',
          data: growth,
          itemStyle: { color: '#4f46e5', borderRadius: [4, 4, 0, 0] },
          barGap: '15%',
        },
        {
          name: 'EBITDA Margin %',
          type: 'bar',
          data: ebitdaMargin,
          itemStyle: { color: '#059669', borderRadius: [4, 4, 0, 0] },
        },
        {
          name: 'ROCE % (Capital Efficiency)',
          type: 'bar',
          data: roce,
          itemStyle: { color: '#7c3aed', borderRadius: [4, 4, 0, 0] },
        },
      ],
    };
  }, [activePeers, record, isSimplified]);

  return (
    <div className="bg-white rounded-2xl border border-neutral-200/80 p-5 shadow-2xs space-y-4">
      {/* Strict Non-Advisory Notice */}
      <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 flex items-start gap-2.5 text-xs text-neutral-800">
        <Info className="w-4 h-4 text-neutral-700 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">SEBI Non-Advisory Notice:</span> Peer comparisons are provided solely to illustrate relative operating metrics, capital efficiency, and leverage. VERA does not provide buy/sell/hold ratings or price forecasts.
        </div>
      </div>

      <EChartWrapper
        chartId="peer-comparison"
        option={option}
        height="380px"
        onPointClick={(point) => setSelectedPoint(point)}
      />

      {/* Peer Metric Table Strip */}
      <div className="overflow-x-auto pt-2">
        <table className="w-full text-xs text-left">
          <thead className="text-[11px] font-semibold text-neutral-500 uppercase border-b border-neutral-100">
            <tr>
              <th className="py-2 px-3">Company</th>
              <th className="py-2 px-3 text-right">Price</th>
              <th className="py-2 px-3 text-right">Mar Cap</th>
              <th className="py-2 px-3 text-right">Growth</th>
              <th className="py-2 px-3 text-right">ROCE</th>
              <th className="py-2 px-3 text-right">Debt/EBITDA</th>
              <th className="py-2 px-3 text-right">P/E</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {activePeers.map((p, idx) => (
              <tr key={idx} className={`hover:bg-neutral-50 ${p.ticker === record.ticker ? 'bg-neutral-100 font-bold' : ''}`}>
                <td className="py-2 px-3 font-semibold text-neutral-900">{p.name}</td>
                <td className="py-2 px-3 text-right font-mono">₹{p.cmp.toLocaleString('en-IN')}</td>
                <td className="py-2 px-3 text-right font-mono">₹{p.marketCapCr.toLocaleString('en-IN')} Cr</td>
                <td className="py-2 px-3 text-right font-mono text-neutral-900">{p.revenueGrowthPct}%</td>
                <td className="py-2 px-3 text-right font-mono text-neutral-900">{p.rocePct}%</td>
                <td className="py-2 px-3 text-right font-mono">{p.debtToEbitda}x</td>
                <td className="py-2 px-3 text-right font-mono">{p.peRatio}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
