import { z } from 'zod';

// ─────────────────────────────────────────────────────────────────────────────
// VERA VISUALIZATION DOMAIN SPECIFIC LANGUAGE (DSL)
// Strongly typed, validated chart command & state specification
// ─────────────────────────────────────────────────────────────────────────────

export const ChartTypeSchema = z.enum([
  'line',
  'bar',
  'waterfall',
  'treemap',
  'radar',
  'area',
  'scatter',
  'sankey',
]);
export type ChartType = z.infer<typeof ChartTypeSchema>;

export const MetricIdSchema = z.enum([
  'revenue',
  'expenses',
  'ebitda',
  'ebitda_margin',
  'pat',
  'pat_margin',
  'eps',
  'operating_cash_flow',
  'capex',
  'free_cash_flow',
  'total_debt',
  'net_debt',
  'debt_to_ebitda',
  'interest_coverage',
  'roce',
  'roe',
  'debtor_days',
  'inventory_days',
  'payable_days',
  'cash_conversion_cycle',
  'pe_ratio',
  'market_cap',
]);
export type MetricId = z.infer<typeof MetricIdSchema>;

export const TimePeriodSchema = z.object({
  from: z.string(),
  to: z.string(),
});
export type TimePeriod = z.infer<typeof TimePeriodSchema>;

export const SelectedPointSchema = z.object({
  metric: z.string(),
  period: z.string(),
  value: z.number(),
  displayValue: z.string().optional(),
  unit: z.string().optional(),
  divergenceNotice: z.string().optional(),
});
export type SelectedPoint = z.infer<typeof SelectedPointSchema>;

export const AnnotationSchema = z.object({
  id: z.string(),
  period: z.string(),
  text: z.string(),
  type: z.enum(['info', 'alert', 'positive', 'neutral']).default('info'),
  sourceRef: z.string().optional(),
});
export type Annotation = z.infer<typeof AnnotationSchema>;

// Chart Configuration DSL
export const ChartConfigSchema = z.object({
  chartId: z.string(),
  chartType: ChartTypeSchema,
  entity: z.enum(['RELIANCE', 'TATAPOWER']).default('RELIANCE'),
  period: TimePeriodSchema,
  series: z.array(z.string()),
  displayMode: z.enum(['absolute', 'percentage', 'simplified', 'normalized']).default('absolute'),
  compareMode: z.enum(['none', 'peers', 'historical']).default('none'),
  peers: z.array(z.string()).default([]),
  annotations: z.array(AnnotationSchema).default([]),
  highlightPeriod: z.string().nullable().optional(),
  highlightMetric: z.string().nullable().optional(),
  selectedPoint: SelectedPointSchema.nullable().optional(),
  selectedSegment: z.string().nullable().optional(),
  isSimplified: z.boolean().default(false),
  interaction: z
    .object({
      zoom: z.boolean().default(true),
      crosshair: z.boolean().default(true),
      brush: z.boolean().default(true),
      drilldown: z.boolean().default(true),
    })
    .default({ zoom: true, crosshair: true, brush: true, drilldown: true }),
});
export type ChartConfig = z.infer<typeof ChartConfigSchema>;

// Typed Chart Commands
export const ChartCommandSchema = z.discriminatedUnion('action', [
  z.object({
    action: z.literal('create_chart'),
    chartId: z.string(),
    chartType: ChartTypeSchema,
    series: z.array(z.string()),
    period: TimePeriodSchema.optional(),
  }),
  z.object({
    action: z.literal('change_chart_type'),
    chartType: ChartTypeSchema,
    targetSeries: z.string().optional(),
  }),
  z.object({
    action: z.literal('add_series'),
    metric: z.string(),
  }),
  z.object({
    action: z.literal('remove_series'),
    metric: z.string(),
  }),
  z.object({
    action: z.literal('replace_series'),
    series: z.array(z.string()),
  }),
  z.object({
    action: z.literal('change_period'),
    from: z.string(),
    to: z.string(),
  }),
  z.object({
    action: z.literal('add_peer_comparison'),
    peers: z.array(z.string()).optional(),
  }),
  z.object({
    action: z.literal('remove_peer_comparison'),
  }),
  z.object({
    action: z.literal('highlight_period'),
    period: z.string(),
  }),
  z.object({
    action: z.literal('highlight_metric'),
    metric: z.string(),
  }),
  z.object({
    action: z.literal('convert_to_percentage'),
    enabled: z.boolean(),
  }),
  z.object({
    action: z.literal('simplify'),
    enabled: z.boolean(),
  }),
  z.object({
    action: z.literal('reset_chart'),
  }),
  z.object({
    action: z.literal('compare_periods'),
    periodA: z.string(),
    periodB: z.string(),
  }),
  z.object({
    action: z.literal('select_point'),
    point: SelectedPointSchema,
  }),
  z.object({
    action: z.literal('drill_down'),
    segment: z.string(),
  }),
  z.object({
    action: z.literal('explain_selection'),
  }),
]);

export type ChartCommand = z.infer<typeof ChartCommandSchema>;

// Context passed from Graph back to Chat
export interface GraphToChatContext {
  activeChartId: string;
  chartTitle: string;
  selectedEntity: string;
  selectedPeriod: [string, string];
  activeSeries: string[];
  selectedPoint: SelectedPoint | null;
  selectedSegment: string | null;
  selectedPeers: string[];
  isSimplified: boolean;
  displayMode: 'absolute' | 'percentage' | 'simplified' | 'normalized';
  comparisonMode: boolean;
  comparisonPeriods?: [string, string];
  recentInteraction: string;
}
