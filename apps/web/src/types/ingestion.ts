export type ChannelType = 'WHATSAPP' | 'INSTAGRAM' | 'TELEGRAM' | 'AUDIO' | 'PDF' | 'URL' | 'TEXT';

export type RedFlagSeverity = 'INFO' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface RedFlag {
  flag_id: string;
  flag_name: string;
  severity: RedFlagSeverity;
  description: string;
  matched_snippet: string;
}

export interface FinancialEntity {
  name: string;
  ticker?: string | null;
  entity_type: string;
  role: string;
}

export interface FinancialMetric {
  metric_type: string;
  raw_text: string;
  normalized_value?: number | null;
  unit_or_currency?: string | null;
  timeframe?: string | null;
}

export interface ExtractedAssertion {
  assertion_id: string;
  statement: string;
  category: string;
  verifiable: boolean;
  confidence_score: number;
  verification_target: string;
}

export interface DecodedMetric {
  raw_text: string;
  metric_type: string;
  plain_meaning: string;
}

export interface HumanReadableExplanation {
  plain_summary?: string;
  decoded_metrics?: DecodedMetric[];
  verifiable_claims?: string[];
  speculative_claims?: string[];
  verification_questions?: string[];
}

export interface FactCheckDossier {
  dossier_id: string;
  channel: ChannelType | string;
  original_content: string;
  dehyped_summary: string;
  raw_verbatim_text?: string;
  human_readable_explanation?: HumanReadableExplanation;
  hype_score: number;
  sentiment: string;
  entities: FinancialEntity[];
  metrics: FinancialMetric[];
  red_flags: RedFlag[];
  assertions: ExtractedAssertion[];
  metadata: Record<string, any>;
  created_at: string;
}

export interface PresetExample {
  id: string;
  title: string;
  channel: string;
  badge: string;
  preview: string;
  full_text: string;
}
