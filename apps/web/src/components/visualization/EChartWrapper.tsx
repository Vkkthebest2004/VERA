'use client';

import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { chartEventBus } from '@/lib/visualization/chartEventBus';
import { SelectedPoint } from '@/lib/visualization/chartDsl';

interface EChartWrapperProps {
  option: echarts.EChartsOption;
  height?: string | number;
  className?: string;
  chartId: string;
  onPointClick?: (point: SelectedPoint) => void;
  loading?: boolean;
}

export const EChartWrapper: React.FC<EChartWrapperProps> = ({
  option,
  height = '400px',
  className = '',
  chartId,
  onPointClick,
  loading = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<echarts.ECharts | null>(null);

  // Initialize or re-init ECharts instance
  useEffect(() => {
    if (!containerRef.current) return;

    if (!chartInstanceRef.current) {
      chartInstanceRef.current = echarts.init(containerRef.current, undefined, {
        renderer: 'canvas',
      });

      // Bind native click event
      chartInstanceRef.current.on('click', (params: any) => {
        if (params.name && (params.value !== undefined || params.data !== undefined)) {
          const rawVal =
            typeof params.value === 'number'
              ? params.value
              : Array.isArray(params.value)
              ? params.value[1]
              : params.data?.value || 0;

          const point: SelectedPoint = {
            metric: params.seriesName || params.name || 'Metric',
            period: params.name || '',
            value: Number(rawVal),
            displayValue: `₹${Number(rawVal).toLocaleString('en-IN')} Cr`,
          };

          chartEventBus.emit('pointClick', chartId, { point });
          if (onPointClick) {
            onPointClick(point);
          }
        }
      });
    }

    // Set chart options smoothly
    if (chartInstanceRef.current && option) {
      chartInstanceRef.current.setOption(option, {
        notMerge: false,
        lazyUpdate: true,
      });
    }

    // ResizeObserver for robust layout adaptation
    const resizeObserver = new ResizeObserver(() => {
      chartInstanceRef.current?.resize();
    });
    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [option, chartId, onPointClick]);

  // Handle loading state
  useEffect(() => {
    if (!chartInstanceRef.current) return;
    if (loading) {
      chartInstanceRef.current.showLoading({
        text: 'Reconciling statutory filings...',
        color: '#7c3aed',
        textColor: '#6b7280',
        maskColor: 'rgba(255, 255, 255, 0.8)',
      });
    } else {
      chartInstanceRef.current.hideLoading();
    }
  }, [loading]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      chartInstanceRef.current?.dispose();
      chartInstanceRef.current = null;
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ height, width: '100%' }}
      className={`relative select-none ${className}`}
    />
  );
};
