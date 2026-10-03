'use client';

import React, { useState, useEffect } from 'react';
import { ResearchInvestigation, ResearchPreset } from '@/types/research';
import { investigateWebResearch, fetchResearchPresets, fetchResearchSources } from '@/lib/api';
import {
  Globe,
  Search,
  Scale,
  Calendar,
  ShieldCheck,
  AlertTriangle,
  FileText,
  ExternalLink,
  ChevronRight,
  ArrowRight,
  Loader2,
  Lock,
  Layers,
  Sparkles,
  BookOpen,
  Info,
} from 'lucide-react';

import { CrawlerAnimationScreen } from './CrawlerAnimationScreen';

const CANONICAL_DEMO = 'ABC Ltd secretly acquired ₹45 crore land in Noida.';

export const ResearchWorkstation: React.FC = () => {
  const [claimText, setClaimText] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [investigation, setInvestigation] = useState<ResearchInvestigation | null>(null);
  const [presets, setPresets] = useState<ResearchPreset[]>([]);
  const [sources, setSources] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'EVIDENCE_MATCH' | 'TRAIL' | 'TRACE' | 'SOURCES'>('EVIDENCE_MATCH');

  useEffect(() => {
    fetchResearchPresets().then(setPresets).catch(() => {});
    fetchResearchSources().then(setSources).catch(() => {});
  }, []);

  const handleRunInvestigation = async (queryText?: string) => {
    const textToSearch = queryText || claimText;
    if (!textToSearch.trim()) return;

    setIsSearching(true);
    try {
      const result = await investigateWebResearch(textToSearch.trim());
      setInvestigation(result);
    } catch (err) {
      console.error('Research failed', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectPreset = (p: ResearchPreset) => {
    setClaimText(p.claim);
    handleRunInvestigation(p.claim);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SUPPORTING_EVIDENCE':
      case 'SUPPORTS':
        return 'bg-emerald-950 text-emerald-300 border-emerald-800/60';
      case 'PARTIAL_EVIDENCE':
      case 'PARTIALLY_SUPPORTS':
        return 'bg-amber-950 text-amber-300 border-amber-800/60';
      case 'CONFLICTING_EVIDENCE':
      case 'CONTRADICTS':
        return 'bg-rose-950 text-rose-300 border-rose-800/60';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8 animate-in fade-in duration-300">
      {/* 🧭 Workstation Title & Scope */}
      <div className="text-center space-y-2.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/60 text-cyan-400 text-xs font-semibold">
          <Globe className="w-3.5 h-3.5" />
          <span>Autonomous Web Research & Filing Crawler</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Evidence Investigation Workstation
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl mx-auto">
          Decomposes market claims into atomic assertions, queries authoritative exchange filings & regulators,
          and executes deterministic numerical & temporal comparison.
        </p>
      </div>

      {/* 🔍 Omni-Box Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl p-5 shadow-2xl space-y-4">
        <textarea
          rows={3}
          value={claimText}
          onChange={(e) => setClaimText(e.target.value)}
          placeholder="Enter a financial claim to investigate (e.g. ABC Ltd secretly acquired ₹45 crore land in Noida)..."
          className="w-full bg-transparent text-white font-sans text-sm focus:outline-none placeholder-slate-500 resize-none leading-relaxed"
        />

        {/* Action Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t border-slate-800/80">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Presets:</span>
            {presets.slice(0, 3).map((p) => (
              <button
                key={p.id}
                onClick={() => handleSelectPreset(p)}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition cursor-pointer"
              >
                {p.title}
              </button>
            ))}
          </div>

          <button
            onClick={() => handleRunInvestigation()}
            disabled={isSearching || !claimText.trim()}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs tracking-wide transition flex items-center gap-2 cursor-pointer ${
              isSearching || !claimText.trim()
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20 active:scale-95'
            }`}
          >
            {isSearching ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Crawling Exchange Filings...</span>
              </>
            ) : (
              <>
                <span>Execute Investigation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* 📡 Animated Crawler Surfing Screen */}
      {isSearching && (
        <div className="pt-2 animate-in fade-in duration-300">
          <CrawlerAnimationScreen />
        </div>
      )}

      {/* 📊 Investigation Report View */}
      {!isSearching && investigation && (
        <div className="space-y-6 pt-2 animate-in fade-in duration-300">
          {/* Master Verdict Banner */}
          <div className="rounded-2xl border border-cyan-800/50 bg-gradient-to-br from-slate-900 to-cyan-950/30 p-6 backdrop-blur-xl shadow-2xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
              <div>
                <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md border ${getStatusBadge(investigation.overall_status)}`}>
                  {investigation.overall_status.replace(/_/g, ' ')}
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mt-2">
                  {investigation.verdict_headline}
                </h2>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                <span className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800">
                  {investigation.assertions.length} Assertions
                </span>
                <span className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800">
                  {investigation.evidence_trail.length} Evidence Matches
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-200 leading-relaxed font-sans">
              {investigation.human_readable_explanation}
            </p>

            {/* Navigation Tabs */}
            <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-800/60">
              <button
                onClick={() => setActiveTab('EVIDENCE_MATCH')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'EVIDENCE_MATCH'
                    ? 'bg-white text-slate-950'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Claim ↔ Evidence Breakdown</span>
              </button>
              <button
                onClick={() => setActiveTab('TRAIL')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'TRAIL'
                    ? 'bg-white text-slate-950'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Evidence Trail ({investigation.evidence_trail.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('TRACE')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'TRACE'
                    ? 'bg-white text-slate-950'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Search className="w-3.5 h-3.5" />
                <span>Research Trace & Crawler</span>
              </button>
              <button
                onClick={() => setActiveTab('SOURCES')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'SOURCES'
                    ? 'bg-white text-slate-950'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Source Universe</span>
              </button>
            </div>
          </div>

          {/* TAB 1: CLAIM ↔ EVIDENCE BREAKDOWN */}
          {activeTab === 'EVIDENCE_MATCH' && (
            <div className="space-y-6">
              {/* Atomic Assertions Table */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-xl space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-cyan-400" />
                  Decomposed Atomic Assertions & Verification
                </h3>

                <div className="space-y-3">
                  {investigation.assertions.map((a, idx) => (
                    <div
                      key={a.assertion_id}
                      className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                            Assertion #{idx + 1}
                          </span>
                          <span className="text-sm font-semibold text-white">{a.assertion_text}</span>
                        </div>
                        {a.finding_summary && (
                          <p className="text-xs text-slate-400 pl-1">{a.finding_summary}</p>
                        )}
                      </div>

                      <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded border self-start sm:self-auto ${getStatusBadge(a.status)}`}>
                        {a.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Deterministic Numerical Comparison Card */}
              {investigation.numerical_comparisons.length > 0 && (
                <div className="rounded-2xl border border-amber-800/50 bg-slate-900/60 p-6 backdrop-blur-xl space-y-4">
                  <div className="flex items-center gap-2 text-amber-400">
                    <Scale className="w-4 h-4" />
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                      Deterministic Numerical Variance (Python Calculated)
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {investigation.numerical_comparisons.map((nc, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                        <span className="text-xs font-semibold text-slate-400">{nc.metric_name}</span>
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-slate-500 block uppercase">Claimed Figure:</span>
                            <span className="text-base font-mono font-bold text-rose-400">{nc.claimed_raw}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-500 block uppercase">Official Filing:</span>
                            <span className="text-base font-mono font-bold text-emerald-400">{nc.evidence_raw}</span>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-slate-900">
                          <span className="text-xs font-bold text-amber-300 block">{nc.ratio_factor}</span>
                          <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{nc.explanation}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Temporal Lifecycle Comparison Card */}
              {investigation.temporal_comparisons.length > 0 && (
                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-xl space-y-4">
                  <div className="flex items-center gap-2 text-cyan-400">
                    <Calendar className="w-4 h-4" />
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                      Temporal Event Progression & Stage Reasoning
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {investigation.temporal_comparisons.map((tc, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-white capitalize">{tc.event_name}</span>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">
                              Claimed: {tc.claimed_stage}
                            </span>
                            <span className="text-slate-500">→</span>
                            <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono text-[10px]">
                              Filing: {tc.evidence_stage}
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">{tc.explanation}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: DETAILED EVIDENCE TRAIL */}
          {activeTab === 'TRAIL' && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-xl space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                Granular Statutory Citations & Passages
              </h3>

              <div className="space-y-4">
                {investigation.evidence_trail.map((ev, idx) => (
                  <div key={ev.evidence_id} className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                          Citation #{idx + 1}
                        </span>
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                          {ev.publisher}
                        </span>
                      </div>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${getStatusBadge(ev.relationship)}`}>
                        {ev.relationship}
                      </span>
                    </div>

                    {/* 🤖 GEMMA 3 PLAIN LANGUAGE BREAKDOWN */}
                    {ev.simplified_takeaway && (
                      <div className="p-3 rounded-lg bg-indigo-950/40 border border-indigo-500/30 text-xs text-indigo-100 leading-relaxed font-sans space-y-1">
                        <div className="flex items-center gap-1.5 text-indigo-400 font-bold text-[11px]">
                          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                          <span>Gemma 3 Plain-Language Breakdown (Zero Jargon):</span>
                        </div>
                        <p>{ev.simplified_takeaway}</p>
                      </div>
                    )}

                    <div className="p-3.5 rounded-lg bg-slate-900/80 border-l-2 border-cyan-500 text-xs text-slate-200 italic leading-relaxed">
                      "{ev.exact_text}"
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-900 text-slate-400">
                      <span className="font-mono text-[11px]">
                        Section: {ev.section || 'General'} | Page {ev.page || 1}
                      </span>
                      <a
                        href={ev.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium"
                      >
                        <span>View Original Document</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: RESEARCH TRACE & CRAWLER PROVENANCE */}
          {activeTab === 'TRACE' && (
            <div className="space-y-6">
              {/* Generated Queries Provenance */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-xl space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                  <Search className="w-4 h-4 text-cyan-400" />
                  Targeted Queries Generated
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {investigation.queries.map((q) => (
                    <div key={q.query_id} className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300 flex items-center gap-2">
                      <span className="text-slate-600">❯</span>
                      <span className="truncate">{q.query_text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Crawler Runs with SSRF Protection Status */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-xl space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-emerald-400" />
                  Crawler Runs & SSRF Audit
                </h3>
                <div className="space-y-2">
                  {investigation.crawl_runs.map((cr) => (
                    <div key={cr.crawl_id} className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                      <span className="font-mono text-slate-300 truncate max-w-md">{cr.url}</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono text-[10px]">
                        Status: {cr.status} ({cr.http_status})
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 🤖 GEMMA 3 PLAIN LANGUAGE PIPELINE: CRAWLED DOCUMENTS SIMPLIFIED */}
              {investigation.crawled_data_simplified && investigation.crawled_data_simplified.length > 0 && (
                <div className="rounded-2xl border border-indigo-800/50 bg-indigo-950/20 p-6 backdrop-blur-xl space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-indigo-900/50 border border-indigo-700/60 text-indigo-400">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                          Gemma 3 Plain-Language Pipeline: Crawled Documents
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Raw crawler extracts transferred to Google Gemma 3 for jargon-free simplification
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950 border border-indigo-800 text-indigo-300">
                      {investigation.crawled_data_simplified.length} Simplified
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                    {investigation.crawled_data_simplified.map((cd, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-xs text-white truncate max-w-[200px]">{cd.title}</span>
                          <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                            {cd.publisher}
                          </span>
                        </div>
                        <div className="p-3 rounded-lg bg-indigo-950/40 border border-indigo-500/30 text-xs text-slate-200 leading-relaxed font-sans">
                          {cd.simplified_text}
                        </div>
                        {cd.raw_preview && (
                          <div className="text-[10px] text-slate-500 italic truncate font-mono">
                            Raw snippet: {cd.raw_preview}...
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: SOURCE UNIVERSE */}
          {activeTab === 'SOURCES' && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-xl space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                <Globe className="w-4 h-4 text-cyan-400" />
                Configured Source Registry
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {sources.map((s, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white">{s.domain}</span>
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 font-mono text-[10px]">
                        {s.type} (Priority {s.priority})
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{s.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VERA Principle 5: Uncertainty Notice */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 flex items-start gap-2.5">
            <Lock className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">{investigation.uncertainty_notice}</p>
          </div>
        </div>
      )}
    </div>
  );
};
