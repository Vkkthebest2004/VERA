export type EvidenceStatus =
  | 'SUPPORTING_EVIDENCE'
  | 'PARTIAL_EVIDENCE'
  | 'CONFLICTING_EVIDENCE'
  | 'INSUFFICIENT_EVIDENCE'
  | 'NO_MATCHING_EVIDENCE';

export interface AtomicAssertion {
  assertion_id: string;
  assertion_text: string;
  entity?: string | null;
  event?: string | null;
  location?: string | null;
  amount_raw?: string | null;
  amount_normalized?: number | null;
  status: EvidenceStatus | string;
  finding_summary?: string | null;
}

export interface SearchQuery {
  query_id: string;
  assertion_id: string;
  query_text: string;
  target_domains: string[];
}

export interface SearchResult {
  result_id: string;
  query_id: string;
  url: string;
  title: string;
  snippet: string;
  rank: number;
  domain: string;
  provider: string;
}

export interface CrawlRun {
  crawl_id: string;
  url: string;
  status: string;
  content_type: string;
  http_status: number;
}

export interface EvidenceItem {
  evidence_id: string;
  assertion_id: string;
  relationship: string;
  exact_text: string;
  page?: number | null;
  section?: string | null;
  source_url: string;
  publisher: string;
  confidence: number;
  simplified_takeaway?: string;
}

export interface NumericalComparison {
  metric_name: string;
  claimed_raw: string;
  evidence_raw: string;
  difference_amount: number;
  ratio_factor: string;
  is_mismatch: boolean;
  explanation: string;
}

export interface TemporalComparison {
  event_name: string;
  claimed_stage: string;
  evidence_stage: string;
  is_mismatch: boolean;
  explanation: string;
}

export interface ResearchInvestigation {
  investigation_id: string;
  claim_text: string;
  overall_status: EvidenceStatus | string;
  verdict_headline: string;
  human_readable_explanation: string;
  assertions: AtomicAssertion[];
  queries: SearchQuery[];
  search_results: SearchResult[];
  crawl_runs: CrawlRun[];
  evidence_trail: EvidenceItem[];
  numerical_comparisons: NumericalComparison[];
  temporal_comparisons: TemporalComparison[];
  uncertainty_notice: string;
  crawled_data_simplified?: Array<{
    url: string;
    title: string;
    publisher: string;
    simplified_text: string;
    raw_preview: string;
  }>;
  created_at: string;
}

export interface ResearchPreset {
  id: string;
  title: string;
  claim: string;
  description: string;
}
