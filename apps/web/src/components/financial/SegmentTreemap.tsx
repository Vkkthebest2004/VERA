'use client';

import React, { useMemo } from 'react';
import { EChartWrapper } from '../visualization/EChartWrapper';
import { useVisualizationStore } from '@/state/visualizationStore';
import { EChartsOption } from 'echarts';

export const SegmentTreemap: React.FC = () => {
  const { getCurrentCompanyRecord, setSelectedSegment, selectedSegment, isSimplified } =
    useVisualizationStore();

  const record = getCurrentCompanyRecord();

  const option: EChartsOption = useMemo(() => {
    // Format segments into hierarchical tree
    const treeData = record.segments.map((seg) => ({
      name: seg.name,
      value: seg.revenueCr,
      growth: seg.growthYoY,
      contribution: seg.percentageContribution,
      description: seg.description,
      children: seg.children?.map((c) => ({
        name: c.name,
        value: c.value,
        parentSegment: seg.name,
      })),
    }));

    return {
      title: {
        text: isSimplified
          ? 'What Products & Services Does the Company Sell?'
          : `${record.name} — Business Architecture & Segment Composition`,
        subtext: 'Proportional Revenue Treemap (Click any block to drill down into division units).',
        textStyle: { fontSize: 15, fontWeight: 700, color: '#111827' },
        subtextStyle: { fontSize: 11, color: '#6b7280' },
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        textStyle: { color: '#f9fafb', fontSize: 12 },
        formatter: (params: any) => {
          const data = params.data;
          const rev = Number(data.value || 0);
          const totalRev = record.segments.reduce((acc, s) => acc + s.revenueCr, 0);
          const share = ((rev / totalRev) * 100).toFixed(1);

          return `<div class="font-bold text-xs mb-1 pb-1 border-b border-neutral-700">${data.name}</div>
            <div class="text-xs py-0.5">Revenue: <strong class="font-mono text-white">₹${rev.toLocaleString('en-IN')} Cr</strong></div>
            <div class="text-xs py-0.5">Share of Total: <strong class="font-mono">${share}%</strong></div>
            ${data.growth !== undefined ? `<div class="text-xs py-0.5">YoY Growth: <strong class="font-mono text-neutral-300">${data.growth > 0 ? '+' : ''}${data.growth}%</strong></div>` : ''}
            ${data.description ? `<div class="text-[11px] text-neutral-300 mt-1 max-w-xs leading-relaxed">${data.description}</div>` : ''}
            <div class="text-[10px] text-neutral-400 mt-1.5 italic">Click to focus segment in conversation</div>`;
        },
      },
      series: [
        {
          type: 'treemap',
          visibleMin: 300,
          label: {
            show: true,
            formatter: '{b}\n₹{c} Cr',
            fontSize: 11,
            fontWeight: 600,
            color: '#ffffff',
          },
          upperLabel: {
            show: true,
            height: 24,
            color: '#111827',
            fontSize: 11,
            fontWeight: 700,
          },
          itemStyle: {
            borderColor: '#ffffff',
            borderWidth: 2,
            gapWidth: 2,
          },
          levels: [
            {
              itemStyle: {
                borderWidth: 0,
                gapWidth: 5,
              },
            },
            {
              itemStyle: {
                gapWidth: 2,
              },
              color: ['#4f46e5', '#059669', '#0284c7', '#d97706', '#7c3aed'],
            },
            {
              colorSaturation: [0.35, 0.5],
              itemStyle: {
                gapWidth: 1,
                borderColorSaturation: 0.6,
              },
            },
          ],
          data: treeData,
        },
      ],
    };
  }, [record, isSimplified]);

  return (
    <div className="bg-white rounded-2xl border border-neutral-200/80 p-5 shadow-2xs space-y-4">
      <EChartWrapper
        chartId="segment-treemap"
        option={option}
        height="400px"
        onPointClick={(point) => setSelectedSegment(point.metric || point.period)}
      />

      {/* Segment Details Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2 border-t border-neutral-100">
        {record.segments.map((seg, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedSegment(seg.name)}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
              selectedSegment === seg.name
                ? 'bg-neutral-100 border-neutral-900 ring-2 ring-neutral-300'
                : 'bg-neutral-50/60 hover:bg-neutral-100/70 border-neutral-200/70'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-bold text-neutral-900 mb-1">
              <span className="truncate pr-1">{seg.name}</span>
              <span className="font-mono text-neutral-900 shrink-0">{seg.percentageContribution}%</span>
            </div>
            <div className="text-[11px] text-neutral-600 font-mono">
              ₹{seg.revenueCr.toLocaleString('en-IN')} Cr{' '}
              <span className="text-neutral-900 font-semibold">
                ({seg.growthYoY >= 0 ? '+' : ''}{seg.growthYoY}% YoY)
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
