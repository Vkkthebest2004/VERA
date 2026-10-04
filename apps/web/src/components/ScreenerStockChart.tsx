'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import { Bell, ChevronDown, Sparkles } from 'lucide-react';

export interface StockPoint {
  x: string;
  y: number;
  volume: number;
}

interface ScreenerStockChartProps {
  chartData: {
    '1M'?: StockPoint[];
    '6M'?: StockPoint[];
    '1Yr': StockPoint[];
    '3Yr'?: StockPoint[];
    '5Yr'?: StockPoint[];
    '10Yr'?: StockPoint[];
    'Max'?: StockPoint[];
  };
  currentPrice: number;
  stockPe?: number;
  companyName: string;
  onSelectPoint?: (date: string, price: number, volume: number) => void;
  onOpenAiWithClaim?: (claimText: string) => void;
}

export const ScreenerStockChart: React.FC<ScreenerStockChartProps> = ({
  chartData,
  currentPrice,
  stockPe = 19.4,
  companyName,
  onSelectPoint,
  onOpenAiWithClaim,
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  const [activeTimeframe, setActiveTimeframe] = useState<'1M' | '6M' | '1Yr' | '3Yr' | '5Yr' | '10Yr' | 'Max'>('1Yr');
  const [chartMode, setChartMode] = useState<'Price' | 'PE Ratio'>('Price');
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  // Timeframe buttons matching Screener: 1M, 6M, 1Yr, 3Yr, 5Yr, 10Yr, Max
  const timeframes = ['1M', '6M', '1Yr', '3Yr', '5Yr', '10Yr', 'Max'] as const;

  // Selected dataset
  const points: StockPoint[] =
    chartData[activeTimeframe] ||
    chartData['1Yr'] ||
    chartData['Max'] ||
    [];

  useEffect(() => {
    if (!chartRef.current) return;

    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current, undefined, {
        renderer: 'canvas',
      });
    }

    const chart = chartInstance.current;

    const dates = points.map((p) => p.x);
    const prices = points.map((p) => p.y);
    const volumes = points.map((p) => p.volume * 1000); // in thousands/crores

    // Calculate max volume to keep bars in the bottom 25-30% of the chart
    const maxVol = Math.max(...volumes, 100000);
    const minPrice = Math.min(...prices) * 0.92;
    const maxPrice = Math.max(...prices) * 1.05;

    // Screener signature styling: dual Y axes (Left: Volume, Right: Price)
    const option: echarts.EChartsOption = {
      backgroundColor: '#ffffff',
      animation: true,
      animationDuration: 500,
      grid: {
        left: 55,
        right: 45,
        top: 25,
        bottom: 30,
        containLabel: false,
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          lineStyle: {
            color: '#94a3b8',
            width: 1,
            type: 'dashed',
          },
          label: {
            backgroundColor: '#334155',
            color: '#ffffff',
            fontSize: 11,
          },
        },
        backgroundColor: 'rgba(255, 255, 255, 0.96)',
        borderColor: '#e2e8f0',
        borderWidth: 1,
        padding: [8, 12],
        textStyle: {
          color: '#1e293b',
          fontSize: 12,
        },
        formatter: (params: any) => {
          if (!Array.isArray(params) || params.length === 0) return '';
          const date = params[0].axisValue;
          let priceVal = 0;
          let volVal = 0;

          params.forEach((item: any) => {
            if (item.seriesName === 'Price' || item.seriesName === 'PE Ratio') {
              priceVal = item.data;
            } else if (item.seriesName === 'Volume') {
              volVal = item.data;
            }
          });

          return `
            <div style="font-family: inherit;">
              <div style="font-size: 11px; color: #64748b; font-weight: 500; margin-bottom: 4px;">${date}</div>
              <div style="display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 2px;">
                <span style="color: #475569; font-size: 12px;">${chartMode === 'Price' ? 'Price:' : 'P/E:'}</span>
                <span style="font-weight: 700; color: #3b82f6; font-size: 13px;">${chartMode === 'Price' ? '₹ ' + Number(priceVal).toFixed(1) : Number(priceVal).toFixed(2) + 'x'}</span>
              </div>
              <div style="display: flex; align-items: center; justify-content: space-between; gap: 16px;">
                <span style="color: #64748b; font-size: 11px;">Volume:</span>
                <span style="color: #334155; font-size: 11px; font-weight: 500;">${Number(volVal).toLocaleString('en-IN')}</span>
              </div>
            </div>
          `;
        },
      },
      xAxis: {
        type: 'category',
        data: dates,
        boundaryGap: false,
        axisLine: {
          show: true,
          lineStyle: {
            color: '#e2e8f0',
          },
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          color: '#94a3b8',
          fontSize: 11,
          margin: 10,
        },
      },
      yAxis: [
        {
          // Left Y Axis: Volume (Screener shows 120000k, 100000k, 80000k etc)
          type: 'value',
          position: 'left',
          min: 0,
          max: maxVol * 4, // Keeps volume bars constrained to the lower 25%
          splitLine: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            color: '#94a3b8',
            fontSize: 11,
            formatter: (v: number) => {
              if (v === 0) return '';
              return `${Math.round(v / 1000)}k`;
            },
          },
        },
        {
          // Right Y Axis: Price (Screener shows 280, 260, 240, 220, etc.)
          type: 'value',
          position: 'right',
          min: chartMode === 'Price' ? minPrice : 0,
          max: chartMode === 'Price' ? maxPrice : undefined,
          splitLine: {
            show: true,
            lineStyle: {
              color: '#f1f5f9',
              type: 'solid',
            },
          },
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            color: '#94a3b8',
            fontSize: 11,
            formatter: (v: number) => {
              return chartMode === 'Price' ? `${Math.round(v)}` : `${v.toFixed(1)}x`;
            },
          },
        },
      ],
      series: [
        {
          name: 'Volume',
          type: 'bar',
          yAxisIndex: 0,
          data: volumes,
          barWidth: '60%',
          itemStyle: {
            color: '#cbd5e1', // Light slate-blue matching Screener volume columns
            opacity: 0.65,
          },
        },
        {
          name: chartMode === 'Price' ? 'Price' : 'PE Ratio',
          type: 'line',
          yAxisIndex: 1,
          data: chartMode === 'Price' ? prices : prices.map((p) => Number(((p / currentPrice) * stockPe).toFixed(2))),
          smooth: 0.2,
          showSymbol: false,
          symbolSize: 6,
          lineStyle: {
            color: '#3b82f6', // Clean vibrant Screener blue
            width: 1.8,
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(59, 130, 246, 0.12)' },
              { offset: 1, color: 'rgba(59, 130, 246, 0.0)' },
            ]),
          },
        },
      ],
    };

    chart.setOption(option, true);

    // Event listener for clicks
    const handleChartClick = (params: any) => {
      if (params && params.name && onSelectPoint) {
        const point = points.find((p) => p.x === params.name);
        if (point) {
          onSelectPoint(point.x, point.y, point.volume);
        }
      }
    };

    chart.off('click');
    chart.on('click', handleChartClick);

    const resizeObserver = new ResizeObserver(() => {
      chart.resize();
    });
    resizeObserver.observe(chartRef.current);

    return () => {
      resizeObserver.disconnect();
      chart.off('click');
    };
  }, [points, chartMode, currentPrice, stockPe, onSelectPoint]);

  return (
    <div className="bg-white rounded-xl border border-neutral-200/90 p-4 sm:p-5 shadow-2xs space-y-3">
      {/* ─────────────────────────────────────────────────────────────
          Chart Top Toolbar (Pixel-perfect matching Screener.in)
      ────────────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2">
        {/* Left: Timeframe Button Group [1M | 6M | 1Yr | 3Yr | 5Yr | 10Yr | Max] */}
        <div className="inline-flex rounded-md border border-neutral-300 divide-x divide-neutral-200 overflow-hidden shadow-2xs bg-white text-xs">
          {timeframes.map((tf) => {
            const isActive = activeTimeframe === tf;
            return (
              <button
                key={tf}
                onClick={() => setActiveTimeframe(tf)}
                className={`px-3 py-1 font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 font-bold'
                    : 'text-neutral-700 hover:bg-neutral-50'
                }`}
              >
                {tf}
              </button>
            );
          })}
        </div>

        {/* Right: Chart Controls [Price | PE Ratio | More v | Alerts] */}
        <div className="flex items-center gap-2">
          {/* Price / PE Ratio Group */}
          <div className="inline-flex rounded-md border border-neutral-300 divide-x divide-neutral-200 overflow-hidden shadow-2xs bg-white text-xs">
            <button
              onClick={() => setChartMode('Price')}
              className={`px-3 py-1 font-medium transition-colors cursor-pointer ${
                chartMode === 'Price'
                  ? 'bg-blue-50 text-blue-600 font-bold'
                  : 'text-neutral-700 hover:bg-neutral-50'
              }`}
            >
              Price
            </button>
            <button
              onClick={() => setChartMode('PE Ratio')}
              className={`px-3 py-1 font-medium transition-colors cursor-pointer ${
                chartMode === 'PE Ratio'
                  ? 'bg-blue-50 text-blue-600 font-bold'
                  : 'text-neutral-700 hover:bg-neutral-50'
              }`}
            >
              PE Ratio
            </button>
          </div>

          {/* More Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsMoreOpen(!isMoreOpen)}
              className="px-3 py-1 text-xs border border-neutral-300 rounded-md text-neutral-700 hover:bg-neutral-50 flex items-center gap-1 font-medium shadow-2xs cursor-pointer"
            >
              <span>More</span>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-500" />
            </button>
            {isMoreOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-48 bg-white border border-neutral-200 rounded-lg shadow-lg py-1 z-30 text-xs">
                <button
                  onClick={() => {
                    setIsMoreOpen(false);
                    onOpenAiWithClaim?.(`Explain the price and volume patterns for ${companyName}`);
                  }}
                  className="w-full px-3 py-2 text-left hover:bg-neutral-50 flex items-center gap-2 text-purple-700 font-semibold"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Explain Price Action</span>
                </button>
              </div>
            )}
          </div>

          {/* Alerts Button */}
          <button
            onClick={() => onOpenAiWithClaim?.(`Set up automated statutory filing alerts for ${companyName}`)}
            className="flex items-center gap-1.5 px-3 py-1 text-xs border border-neutral-300 rounded-md text-neutral-700 hover:bg-neutral-50 font-medium shadow-2xs cursor-pointer"
          >
            <Bell className="w-3.5 h-3.5 text-blue-600 fill-blue-600" />
            <span>Alerts</span>
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          Apache ECharts Dual-Axis Screener Canvas
      ────────────────────────────────────────────────────────────── */}
      <div className="relative w-full h-[320px]">
        <div ref={chartRef} className="w-full h-full" />
      </div>
    </div>
  );
};
