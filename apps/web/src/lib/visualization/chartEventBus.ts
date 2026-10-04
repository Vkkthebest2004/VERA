// ─────────────────────────────────────────────────────────────────────────────
// VERA CHART EVENT BUS
// Decoupled, normalized event pipeline linking ECharts to Chat & Zustand
// ─────────────────────────────────────────────────────────────────────────────

import { SelectedPoint } from './chartDsl';

export type ChartEventType =
  | 'pointClick'
  | 'pointHover'
  | 'zoomChanged'
  | 'brushChanged'
  | 'legendChanged'
  | 'seriesSelected'
  | 'segmentSelected'
  | 'peerSelected'
  | 'drilldown'
  | 'chartTypeChanged'
  | 'periodChanged'
  | 'requestExplanation';

export interface VERAChartEvent {
  type: ChartEventType;
  chartId: string;
  timestamp: number;
  payload: {
    point?: SelectedPoint;
    seriesName?: string;
    period?: [string, string];
    segment?: string;
    peer?: string;
    chartType?: string;
    zoomRange?: [number, number];
    rawEvent?: unknown;
  };
}

type EventListener = (event: VERAChartEvent) => void;

class ChartEventBus {
  private listeners: Map<ChartEventType | '*', Set<EventListener>> = new Map();

  public subscribe(eventType: ChartEventType | '*', listener: EventListener): () => void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    this.listeners.get(eventType)!.add(listener);

    return () => {
      this.listeners.get(eventType)?.delete(listener);
    };
  }

  public emit(type: ChartEventType, chartId: string, payload: VERAChartEvent['payload'] = {}): void {
    const event: VERAChartEvent = {
      type,
      chartId,
      timestamp: Date.now(),
      payload,
    };

    // Specific listeners
    const specific = this.listeners.get(type);
    if (specific) {
      specific.forEach((listener) => {
        try {
          listener(event);
        } catch (err) {
          console.error(`Error in chart event listener for ${type}:`, err);
        }
      });
    }

    // Catch-all listeners
    const all = this.listeners.get('*');
    if (all) {
      all.forEach((listener) => {
        try {
          listener(event);
        } catch (err) {
          console.error('Error in catch-all chart event listener:', err);
        }
      });
    }
  }
}

export const chartEventBus = new ChartEventBus();
