'use client';

import React, { useState } from 'react';
import { InvestigationDossier } from '@/types/investigation';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  FileText,
  ExternalLink,
  ChevronRight,
  TrendingDown,
  TrendingUp,
  Scale,
  CheckCircle2,
  XCircle,
  HelpCircle,
  LifeBuoy,
  Lock,
  FileSearch,
  BookOpen,
  Copy,
  Check,
  Search,
  Building2,
  Sparkles,
  Globe,
  Share2,
} from 'lucide-react';

interface InvestigationViewProps {
  investigation: InvestigationDossier;
  onReset?: () => void;
}

export const InvestigationView: React.FC<InvestigationViewProps> = ({
  investigation,
  onReset,
}) => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'EVIDENCE' | 'VERBATIM' | 'PROTECTION'>('OVERVIEW');
  const [copied, setCopied] = useState<boolean>(false);
  const [showFullPost, setShowFullPost] = useState<boolean>(false);

  const getVerdictStyle = (verdict: string) => {
    switch (verdict) {
      case 'CONFIRMED_TRUE':
        return {
          bg: 'bg-emerald-950/40 border-emerald-500/50 text-emerald-400',
          badge: 'bg-emerald-500 text-slate-950',
          icon: ShieldCheck,
          label: 'OFFICIALLY VERIFIED',
        };
      case 'MISLEADING_OR_EXAGGERATED':
        return {
          bg: 'bg-amber-950/40 border-amber-500/50 text-amber-400',
          badge: 'bg-amber-500 text-slate-950',
          icon: AlertTriangle,
          label: 'MISLEADING / EXAGGERATED',
        };
      case 'DEBUNKED_FAKE':
        return {
          bg: 'bg-rose-950/40 border-rose-500/50 text-rose-400',
          badge: 'bg-rose-500 text-white',
          icon: XCircle,
          label: 'DEBUNKED / CONTRADICTED',
        };
      default:
        return {
          bg: 'bg-yellow-950/40 border-yellow-500/50 text-yellow-400',
          badge: 'bg-yellow-500 text-slate-950',
          icon: HelpCircle,
          label: 'UNSUBSTANTIATED SPECULATION',
        };
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SUPPORTED':
        return 'bg-emerald-950 text-emerald-400 border-emerald-800/60';
      case 'PARTIALLY_SUPPORTED':
        return 'bg-amber-950 text-amber-400 border-amber-800/60';
      case 'CONTRADICTED':
        return 'bg-rose-950 text-rose-400 border-rose-800/60';
      case 'INSUFFICIENT_EVIDENCE':
        return 'bg-slate-800 text-slate-300 border-slate-700';
      default:
        return 'bg-indigo-950 text-indigo-300 border-indigo-800/60';
    }
  };

  const getRelationshipBadge = (rel: string) => {
    switch (rel) {
      case 'SUPPORTS':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'PARTIAL_MATCH':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'CONTRADICTS':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  const handleCopyVerbatim = () => {
    const textToCopy = investigation.raw_verbatim_text || investigation.claim_summary;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const style = getVerdictStyle(investigation.overall_verdict);
  const VerdictIcon = style.icon;
  const verbatimText = investigation.raw_verbatim_text || investigation.claim_summary || '';
  const explanation = investigation.human_readable_explanation;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 🏛️ MASTER VERDICT BANNER */}
      <div className={`rounded-2xl border p-6 backdrop-blur-xl shadow-2xl relative overflow-hidden ${style.bg}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/60 pb-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <VerdictIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md ${style.badge}`}>
                  {style.label}
                </span>
                {investigation.channel && (
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-md bg-slate-900 text-slate-400 border border-slate-800">
                    Source: {investigation.channel}
                  </span>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mt-1">
                {investigation.verdict_headline}
              </h2>
            </div>
          </div>

          {onReset && (
            <button
              onClick={onReset}
              className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-700 transition cursor-pointer self-start sm:self-auto"
            >
              Verify Another Claim
            </button>
          )}
        </div>

        <p className="text-sm text-slate-300 mt-4 leading-relaxed font-sans">
          {investigation.verdict_explanation}
        </p>

        {/* 🌟 PLAIN LANGUAGE TAKEAWAY (FOR NON-FINANCIAL / EVERYDAY INVESTORS) */}
        {investigation.plain_language_takeaway && (
          <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-cyan-500/10 to-indigo-500/10 border border-cyan-500/40 shadow-xl backdrop-blur-md">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-cyan-300">
                    Simple Explanation for Everyday Investors
                  </span>
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-700/60 text-cyan-300 font-mono font-semibold">
                    No Financial Jargon
                  </span>
                </div>
                <p className="text-sm font-semibold text-white leading-relaxed font-sans pt-0.5">
                  {investigation.plain_language_takeaway}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* System Metadata Pills */}
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-slate-800/40 text-[11px] text-slate-400">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-950/70 border border-slate-800">
            <Search className="w-3 h-3 text-cyan-400" />
            <span>Exchange Search: {investigation.evidence_trail.length > 0 ? `${investigation.evidence_trail.length} Official Filing(s)` : 'No Disclosures Found'}</span>
          </span>
          {verbatimText && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-950/70 border border-slate-800">
              <FileText className="w-3 h-3 text-indigo-400" />
              <span>Verbatim Input: {verbatimText.length} chars</span>
            </span>
          )}
          {investigation.detected_red_flags && investigation.detected_red_flags.length > 0 && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-950/50 border border-rose-900/60 text-rose-300 font-semibold">
              <AlertTriangle className="w-3 h-3 text-rose-400" />
              <span>{investigation.detected_red_flags.length} SEBI Red Flags</span>
            </span>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 mt-5 pt-4 border-t border-slate-800/60">
          <button
            onClick={() => setActiveTab('OVERVIEW')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              activeTab === 'OVERVIEW'
                ? 'bg-white text-slate-950'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            Investigation Findings
          </button>
          <button
            onClick={() => setActiveTab('EVIDENCE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'EVIDENCE'
                ? 'bg-white text-slate-950'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <span>Evidence Trail</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-cyan-400 font-mono">
              {investigation.evidence_trail.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('VERBATIM')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'VERBATIM'
                ? 'bg-white text-slate-950'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span>Extracted Verbatim & Translation</span>
          </button>
          <button
            onClick={() => setActiveTab('PROTECTION')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'PROTECTION'
                ? 'bg-rose-500 text-white'
                : 'text-rose-400 hover:bg-rose-950/40'
            }`}
          >
            <LifeBuoy className="w-3.5 h-3.5" />
            <span>Investor Protection & Rights</span>
          </button>
        </div>
      </div>

      {/* TAB 1: OVERVIEW & NUMERICAL RECONCILIATION */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-6">
          {/* 📄 SUBMITTED POST & CLAIM INFORMATION */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-cyan-950/80 border border-cyan-700/50 text-cyan-400">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-100">
                      Submitted Post & Claim Information
                    </h3>
                    {investigation.channel && (
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/60">
                        {investigation.channel}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Exact information extracted from the submitted post, screenshot, or viral forward
                  </p>
                </div>
              </div>

              {verbatimText && (
                <button
                  onClick={handleCopyVerbatim}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 border border-slate-700 transition cursor-pointer self-start sm:self-auto"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy Post Text'}</span>
                </button>
              )}
            </div>

            {/* Post Summary & Core Claim */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 block">
                Claimed Statement / Headline in Post:
              </span>
              <p className="text-sm font-medium text-white leading-relaxed font-sans">
                {investigation.claim_summary}
              </p>
            </div>

            {/* Key Entities & Metadata Pills */}
            {((investigation.extracted_entities && investigation.extracted_entities.length > 0) ||
              (investigation.detected_red_flags && investigation.detected_red_flags.length > 0)) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {investigation.extracted_entities && investigation.extracted_entities.length > 0 && (
                  <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Entities Identified in Post:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {investigation.extracted_entities.map((ent, idx) => (
                        <span
                          key={idx}
                          className="text-xs px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 font-medium flex items-center gap-1"
                        >
                          <span>{ent.name}</span>
                          {ent.ticker && (
                            <span className="text-[10px] font-mono text-cyan-400 font-bold">({ent.ticker})</span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {investigation.detected_red_flags && investigation.detected_red_flags.length > 0 && (
                  <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 block">
                      Post Red Flags Detected:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {investigation.detected_red_flags.map((rf, idx) => (
                        <span
                          key={idx}
                          className="text-xs px-2.5 py-1 rounded-lg bg-rose-950/40 border border-rose-900/60 text-rose-300 font-medium flex items-center gap-1"
                        >
                          <AlertTriangle className="w-3 h-3 text-rose-400" />
                          <span>{rf.flag_name}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Extracted Verbatim Text Preview / Accordion */}
            {verbatimText && (
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-400">
                    Raw Extracted Post Content ({verbatimText.length} characters):
                  </span>
                  <button
                    onClick={() => setShowFullPost(!showFullPost)}
                    className="text-cyan-400 hover:text-cyan-300 text-xs font-semibold cursor-pointer"
                  >
                    {showFullPost ? 'Show Less' : 'Show Full Raw Extract'}
                  </button>
                </div>

                <div
                  className={`p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 font-mono text-xs text-slate-300 leading-relaxed overflow-x-auto transition-all ${
                    showFullPost ? 'max-h-96 overflow-y-auto' : 'max-h-28 overflow-hidden relative'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{verbatimText}</p>
                  {!showFullPost && verbatimText.length > 250 && (
                    <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none" />
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Numerical Discrepancy Table */}
          {investigation.numerical_reconciliations.length > 0 && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-xl">
              <div className="flex items-center gap-2 mb-4 text-amber-400">
                <Scale className="w-4 h-4" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                  Numerical Reconciliation (Claimed vs Official Filing)
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-sans">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                      <th className="pb-3 font-semibold">Financial Metric</th>
                      <th className="pb-3 font-semibold">Claimed in Social Post</th>
                      <th className="pb-3 font-semibold">Official Regulatory Filing</th>
                      <th className="pb-3 font-semibold">Variance / Discrepancy</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {investigation.numerical_reconciliations.map((nr, idx) => (
                      <tr key={idx} className="hover:bg-slate-950/40 transition">
                        <td className="py-3.5 font-medium text-white">{nr.metric_name}</td>
                        <td className="py-3.5 font-mono text-rose-400">{nr.claimed_value}</td>
                        <td className="py-3.5 font-mono text-emerald-400 font-bold">{nr.official_value}</td>
                        <td className="py-3.5">
                          <span
                            className={`px-2 py-1 rounded-md text-[10px] font-bold ${
                              nr.is_mismatch
                                ? 'bg-rose-950 text-rose-300 border border-rose-800/60'
                                : 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                            }`}
                          >
                            {nr.discrepancy_factor}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SUTRA PRINCIPLE 5: STATUTORY SEARCH AUDIT (When no filings match) */}
          {investigation.evidence_trail.length === 0 && (
            <div className="rounded-2xl border border-yellow-800/50 bg-yellow-950/20 p-6 backdrop-blur-xl space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-yellow-900/40 border border-yellow-700/50 text-yellow-400 shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">
                    Statutory Exchange Search Report: No Official Disclosures Lodged
                  </h3>
                  <p className="text-xs text-yellow-300/90 mt-1 leading-relaxed">
                    VERA cross-referenced official BSE India Corporate Announcements, NSE NEAPS statutory records, and SEBI enforcement notifications for this claim.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2.5 text-xs text-slate-300 leading-relaxed font-sans">
                <div className="font-semibold text-cyan-400 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" />
                  <span>VERA Principle 5: Absence of Evidence ≠ Proof of Falsehood</span>
                </div>
                <p>
                  The lack of a matching regulatory disclosure does <strong>not</strong> conclusively prove that the mentioned business project does not exist. However, under <strong>SEBI (Listing Obligations and Disclosure Requirements) Regulations, 2015 (Regulation 30)</strong>, all listed companies are legally mandated to disclose any price-sensitive contract, acquisition, or material development within <strong>24 hours</strong>.
                </p>
                <p className="text-slate-400">
                  Because no statutory disclosure has been filed with BSE or NSE, acting on this unverified information carries extreme speculation and pump-and-dump risk.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="https://www.bseindia.com/corporates/ann.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-400 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition"
                >
                  <span>Search Live BSE Corporate Announcements ↗</span>
                </a>
                <a
                  href="https://www.nseindia.com/companies-listing/corporate-filings-announcements"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-400 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition"
                >
                  <span>Search Live NSE Filings Portal ↗</span>
                </a>
              </div>
            </div>
          )}

          {/* Per-Assertion Verified Findings */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-xl space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <FileSearch className="w-4 h-4 text-cyan-400" />
              Claim ↔ Evidence Verification Breakdown
            </h3>

            <div className="space-y-4">
              {investigation.assertion_investigations.map((ai) => (
                <div
                  key={ai.assertion_id}
                  className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-white">{ai.assertion_text}</p>
                    <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded border self-start sm:self-auto ${getStatusBadge(ai.status)}`}>
                      {ai.status}
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 text-xs text-slate-300">
                    <span className="font-semibold text-cyan-400 block mb-1">Authoritative Finding:</span>
                    {ai.primary_finding}
                  </div>

                  {/* Supporting Passages Snippet */}
                  {ai.evidence_passages.length > 0 && (
                    <div className="text-[11px] text-slate-400 space-y-1">
                      <span className="font-semibold text-slate-500">Official Citations:</span>
                      {ai.evidence_passages.slice(0, 1).map((ep) => (
                        <div key={ep.passage_id} className="p-2 rounded bg-slate-900 border border-slate-800 flex items-center justify-between gap-2">
                          <span className="truncate text-slate-300 font-mono">
                            {ep.document_title} (Page {ep.page_number}, Para {ep.paragraph_number})
                          </span>
                          <a
                            href={ep.source_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium whitespace-nowrap"
                          >
                            <span>Filing</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 🌐 SOCIAL MEDIA & VIRAL CHANNEL CRAWL AUDIT */}
          {investigation.crawled_social_sources && investigation.crawled_social_sources.length > 0 && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-indigo-950/60 border border-indigo-700/50 text-indigo-400">
                    <Share2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                      Social Media Web Crawl & Viral Channel Audit
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Cross-referenced viral finfluencer channels, tip groups, and forums against statutory databases
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2.5 py-1 rounded-lg bg-emerald-950/70 border border-emerald-800/60 text-emerald-400 flex items-center gap-1.5 self-start sm:self-auto">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  {investigation.crawled_social_sources.length} Platforms Audited
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
                {investigation.crawled_social_sources.map((s, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-xs text-white flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-cyan-400" />
                        {s.platform}
                      </span>
                      <span className="text-[9px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/60">
                        {s.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans">
                      {s.finding}
                    </p>
                    {(() => {
                      const simplified = investigation.crawled_simplified_data?.find(
                        (c) => c.title.toLowerCase().includes(s.platform.toLowerCase()) || s.platform.toLowerCase().includes(c.title.toLowerCase())
                      );
                      if (!simplified?.simplified_language) return null;
                      return (
                        <div className="p-2.5 rounded-lg bg-indigo-950/50 border border-indigo-500/30 text-[11px] text-indigo-200 space-y-1">
                          <div className="flex items-center gap-1.5 text-indigo-400 font-bold text-[10px] uppercase">
                            <Sparkles className="w-3 h-3 text-indigo-400" />
                            <span>Gemma 3 Plain-Language Translation:</span>
                          </div>
                          <p className="leading-relaxed font-sans">{simplified.simplified_language}</p>
                        </div>
                      );
                    })()}
                    {s.domain && (
                      <div className="text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-900">
                        Target Domain: {s.domain}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: DETAILED EVIDENCE TRAIL (SANGYAN PROVENANCE) */}
      {activeTab === 'EVIDENCE' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-xl space-y-5">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Traceable Evidence Trail & Source Provenance
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Every factual finding is linked to an official statutory document, publication date, and page/paragraph coordinates.
            </p>
          </div>

          {investigation.evidence_trail.length === 0 ? (
            <div className="p-8 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-3">
              <Search className="w-8 h-8 text-slate-600 mx-auto" />
              <h4 className="text-sm font-bold text-slate-200">No Regulatory Evidence Trail Retrieved</h4>
              <p className="text-xs text-slate-400 max-w-lg mx-auto">
                No official disclosures, quarterly filings, or circulars were matched against this specific text in the BSE/NSE canonical archives.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {investigation.evidence_trail.map((ev, idx) => (
                <div
                  key={ev.passage_id}
                  className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        Evidence #{idx + 1}
                      </span>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/60">
                        {ev.source_tier}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        Date: {ev.filing_date}
                      </span>
                    </div>

                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${getRelationshipBadge(ev.relationship)}`}>
                      Relationship: {ev.relationship}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white">{ev.document_title}</h4>

                  {/* 🤖 GEMMA 3 PLAIN LANGUAGE BREAKDOWN */}
                  {ev.simplified_takeaway && (
                    <div className="p-3.5 rounded-lg bg-indigo-950/40 border border-indigo-500/30 text-xs text-indigo-100 leading-relaxed font-sans space-y-1">
                      <div className="flex items-center gap-1.5 text-indigo-400 font-bold text-[11px]">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Gemma 3 Plain-Language Breakdown (Zero Jargon):</span>
                      </div>
                      <p>{ev.simplified_takeaway}</p>
                    </div>
                  )}

                  {/* Quoted Statutory Passage */}
                  <div className="p-3.5 rounded-lg bg-slate-900/80 border-l-2 border-cyan-500 text-xs text-slate-200 leading-relaxed font-sans italic">
                    "{ev.exact_quote}"
                  </div>

                  {/* Provenance Coordinates & Link */}
                  <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-900 text-slate-400">
                    <span className="font-mono text-[11px]">
                      Location: Page {ev.page_number}, Paragraph {ev.paragraph_number} ({ev.source_name})
                    </span>
                    <a
                      href={ev.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium"
                    >
                      <span>Inspect Raw Filing</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: EXTRACTED VERBATIM CONTENT & HUMAN-READABLE TRANSLATION LAYER */}
      {activeTab === 'VERBATIM' && (
        <div className="space-y-6">
          {/* Human-Readable Plain English Breakdown (Gemma 3 Layer) */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-xl space-y-5">
            <div className="flex items-center gap-2 text-cyan-400 border-b border-slate-800 pb-3">
              <Sparkles className="w-5 h-5" />
              <h3 className="text-base font-bold text-white tracking-tight">
                Plain-English Translation Layer (Google Gemma 3 Multimodal)
              </h3>
            </div>

            {explanation?.executive_summary ? (
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                <span className="font-bold text-cyan-400 block mb-1">Executive Summary:</span>
                {explanation.executive_summary}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                <span className="font-bold text-cyan-400 block mb-1">De-Hyped Claim Summary:</span>
                {investigation.claim_summary}
              </div>
            )}

            {/* Decoded Numbers */}
            {explanation?.decoded_numbers && explanation.decoded_numbers.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Decoded Financial Numbers & Everyday Meaning:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {explanation.decoded_numbers.map((dn, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-white">{dn.term}</span>
                        <span className="font-mono text-cyan-400 font-bold">{dn.raw_value}</span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">{dn.plain_english_meaning}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Critical Exchange Cross-Examination Questions */}
            {explanation?.critical_verification_questions && explanation.critical_verification_questions.length > 0 && (
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Questions to Ask Company Investor Relations / Exchanges:
                </h4>
                <div className="space-y-2">
                  {explanation.critical_verification_questions.map((q, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-2.5 text-xs text-slate-300">
                      <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{q}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Verbatim Extracted Text Viewer */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                  Exact Verbatim Ingested Content
                </h3>
              </div>
              <button
                onClick={handleCopyVerbatim}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Verbatim'}</span>
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto">
              {verbatimText}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: INVESTOR PROTECTION & RIGHTS (SANGYAN RECOVERY LAYER) */}
      {activeTab === 'PROTECTION' && investigation.protection_guidance && (
        <div className="rounded-2xl border border-rose-800/50 bg-slate-900/80 p-6 backdrop-blur-xl space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 font-mono">
                Risk Level: {investigation.protection_guidance.risk_level}
              </span>
              <h3 className="text-lg font-bold text-white tracking-tight mt-1">
                Investor Rights & Scam Safeguard Guide
              </h3>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-900/50 text-xs text-rose-200 leading-relaxed">
            <p className="font-bold mb-1">Protection Warning:</p>
            {investigation.protection_guidance.summary_warning}
          </div>

          {/* Actionable Safe Steps */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
              Mandatory Safe Actions Before Committing Capital:
            </h4>
            <div className="space-y-2">
              {investigation.protection_guidance.recommended_actions.map((act, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start gap-3"
                >
                  <span className="h-5 w-5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 flex items-center justify-center text-[10px] font-bold font-mono mt-0.5 shrink-0">
                    {idx + 1}
                  </span>
                  <span className="text-xs text-slate-200 leading-normal">{act}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Direct Redressal Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <a
              href={investigation.protection_guidance.official_redressal_url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white text-xs font-bold shadow-lg shadow-rose-500/20 flex items-center justify-center gap-2 transition"
            >
              <LifeBuoy className="w-4 h-4" />
              <span>Lodge Grievance on SEBI SCORES ↗</span>
            </a>

            <a
              href={investigation.protection_guidance.intermediary_check_url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center justify-center gap-2 transition"
            >
              <span>Verify SEBI Registered Advisors ↗</span>
            </a>
          </div>
        </div>
      )}

      {/* SANGYAN DISCLAIMER & EMPOWERMENT */}
      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 text-[11px] text-slate-400 flex items-start gap-2.5">
        <Lock className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <span className="font-semibold text-slate-300">Investor Empowerment Notice:</span>{' '}
          {investigation.disclaimer}
        </p>
      </div>
    </div>
  );
};
