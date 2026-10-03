export type OverallVerdict =
  | 'CONFIRMED_TRUE'
  | 'MISLEADING_OR_EXAGGERATED'
  | 'DEBUNKED_FAKE'
  | 'UNSUBSTANTIATED_SPECULATION';

export type VerificationStatus =
  | 'SUPPORTED'
  | 'PARTIALLY_SUPPORTED'
  | 'CONTRADICTED'
  | 'INSUFFICIENT_EVIDENCE'
  | 'UNVERIFIED';

export interface EvidencePassage {
  passage_id: string;
  document_title: string;
  filing_type: string;
  source_name: string;
  source_tier: string;
  filing_date: string;
  page_number: number;
  paragraph_number: number;
  exact_quote: string;
  source_url: string;
  relevance_score: number;
  relationship: string;
  simplified_takeaway?: string;
}

export interface NumericalReconciliation {
  metric_name: string;
  claimed_value: string;
  official_value: string;
  discrepancy_factor: string;
  is_mismatch: boolean;
}

export interface AssertionInvestigation {
  assertion_id: string;
  assertion_text: string;
  status: VerificationStatus | string;
  confidence: number;
  primary_finding: string;
  evidence_passages: EvidencePassage[];
  numerical_reconciliation?: NumericalReconciliation | null;
  contradiction_detail?: string | null;
}

export interface InvestorProtectionGuidance {
  risk_level: string;
  summary_warning: string;
  applicable_regulations: string[];
  recommended_actions: string[];
  official_redressal_url: string;
  intermediary_check_url: string;
}

export interface PerplexityCitation {
  index: number;
  title: string;
  url: string;
  domain: string;
  snippet: string;
  credibility_tier?: string;
  credibility_score?: number;
  badge?: string;
  page?: number;
  paragraph?: number;
}

export interface SearchStep {
  step: number;
  name: string;
  label: string;
  detail: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING' | string;
}

export interface InvestigationDossier {
  investigation_id: string;
  claim_summary: string;
  overall_verdict: OverallVerdict | string;
  verdict_headline: string;
  verdict_explanation: string;
  assertion_investigations: AssertionInvestigation[];
  evidence_trail: EvidencePassage[];
  numerical_reconciliations: NumericalReconciliation[];
  protection_guidance?: InvestorProtectionGuidance | null;
  raw_verbatim_text?: string;
  human_readable_explanation?: {
    executive_summary?: string;
    decoded_numbers?: Array<{
      term: string;
      raw_value: string;
      plain_english_meaning: string;
    }>;
    critical_verification_questions?: string[];
  };
  hype_score?: number;
  channel?: string;
  extracted_entities?: Array<{
    name: string;
    ticker?: string | null;
    entity_type: string;
  }>;
  detected_red_flags?: Array<{
    flag_name: string;
    severity: string;
    description: string;
  }>;
  statutory_search_context?: {
    queried_exchanges?: string[];
    statutory_mandate?: string;
    disclosure_window?: string;
    filings_found_count?: number;
    status_summary?: string;
    absence_of_evidence_notice?: string;
  };
  plain_language_takeaway?: string;
  crawled_social_sources?: Array<{
    platform: string;
    status: string;
    finding: string;
    domain?: string;
  }>;
  crawled_simplified_data?: Array<{
    source_type: string;
    title: string;
    source_url: string;
    raw_text: string;
    simplified_language: string;
    source_name?: string;
  }>;
  chatgpt_response?: string;
  citations?: PerplexityCitation[];
  search_steps?: SearchStep[];
  disclaimer: string;
  created_at: string;
}
