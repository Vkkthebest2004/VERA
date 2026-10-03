'use client';

import React, { useState } from 'react';
import {
  FactCheckDossier,
  RedFlagSeverity,
} from '@/types/ingestion';
import {
  AlertTriangle,
  Flame,
  CheckCircle2,
  FileSearch,
  Building2,
  Coins,
  ArrowRight,
  Copy,
  Check,
  ShieldAlert,
  Layers,
  FileCode,
  HelpCircle,
  BookOpen,
} from 'lucide-react';

interface DossierViewProps {
  dossier: FactCheckDossier;
  onReset?: () => void;
}

export const DossierView: React.FC<DossierViewProps> = ({ dossier, onReset }) => {
  const [copied, setCopied] = useState(false);
  const [copiedRaw, setCopiedRaw] = useState(false);
  const [selectedAssertions, setSelectedAssertions] = useState<Record<string, boolean>>(() => {
    const map: Record<string, boolean> = {};
    dossier.assertions.forEach((a) => {
      map[a.assertion_id] = true;
    });
    return map;
  });

  const toggleAssertion = (id: string) => {
    setSelectedAssertions((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(dossier, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyRaw = () => {
    navigator.clipboard.writeText(dossier.raw_verbatim_text || dossier.original_content);
    setCopiedRaw(true);
    setTimeout(() => setCopiedRaw(false), 2000);
  };

  const getSeverityBadge = (severity: RedFlagSeverity | string) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-rose-950/80 text-rose-400 border-rose-800/60';
      case 'HIGH':
        return 'bg-amber-950/80 text-amber-400 border-amber-800/60';
      case 'MEDIUM':
        return 'bg-yellow-950/80 text-yellow-400 border-yellow-800/60';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const getHypeColor = (score: number) => {
    if (score >= 0.7) return 'text-rose-400 border-rose-500/50 bg-rose-950/20';
    if (score >= 0.4) return 'text-amber-400 border-amber-500/50 bg-amber-950/20';
    return 'text-emerald-400 border-emerald-500/50 bg-emerald-950/20';
  };

  const getHypeBarGradient = (score: number) => {
    if (score >= 0.7) return 'from-amber-500 to-rose-500';
    if (score >= 0.4) return 'from-yellow-400 to-amber-500';
    return 'from-emerald-400 to-cyan-500';
  };

  const hypePercentage = Math.round(dossier.hype_score * 100);
  const verbatimText = dossier.raw_verbatim_text || dossier.original_content;
  const verbatimLines = verbatimText.split('\n');
  const explanation = dossier.human_readable_explanation;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner / Dossier Header */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                {dossier.dossier_id}
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-indigo-950/80 text-indigo-300 border border-indigo-800/60">
                Channel: {dossier.channel}
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-800/90 text-slate-300">
                Sentiment: {dossier.sentiment}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Fact-Check Preparation Dossier
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Verbatim extraction, plain-English interpretation, and atomic claims staged for verification.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 border border-slate-700 transition cursor-pointer"
              title="Copy JSON Dossier"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied JSON' : 'Export JSON'}
            </button>
            {onReset && (
              <button
                onClick={onReset}
                className="px-3.5 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-xs font-medium border border-cyan-500/30 transition cursor-pointer"
              >
                Analyze Another
              </button>
            )}
          </div>
        </div>

        {/* Metrics Barometer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-6">
          {/* Hype Barometer */}
          <div className={`p-4 rounded-xl border ${getHypeColor(dossier.hype_score)}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5" /> Hype Barometer
              </span>
              <span className="text-xs font-bold font-mono">{hypePercentage}%</span>
            </div>
            <div className="w-full bg-slate-800/80 rounded-full h-2 overflow-hidden mb-2">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${getHypeBarGradient(dossier.hype_score)}`}
                style={{ width: `${Math.max(hypePercentage, 5)}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-300">
              {dossier.hype_score >= 0.7
                ? 'High manipulation / FOMO risk detected.'
                : dossier.hype_score >= 0.4
                ? 'Moderate promotional language present.'
                : 'Objective / low-sensationalism content.'}
            </p>
          </div>

          {/* Red Flags Count */}
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/40">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" /> Red Flags Found
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-white">{dossier.red_flags.length}</span>
              <span className="text-xs text-slate-400">behavioral signals</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              {dossier.red_flags.some((r) => r.severity === 'CRITICAL')
                ? 'Critical manipulation patterns present.'
                : 'Standard risk profile.'}
            </p>
          </div>

          {/* Assertions Count */}
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/40">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-400" /> Atomic Assertions
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-white">{dossier.assertions.length}</span>
              <span className="text-xs text-slate-400">testable claims</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Decomposed for independent verification.
            </p>
          </div>

          {/* Entities & Metrics */}
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/40">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Coins className="w-3.5 h-3.5 text-emerald-400" /> Financial Anchors
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-white">
                {dossier.entities.length + dossier.metrics.length}
              </span>
              <span className="text-xs text-slate-400">entities & metrics</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Anchors tagged with tickers & currencies.
            </p>
          </div>
        </div>
      </div>

      {/* 🌟 HUMAN-READABLE INTERPRETATION LAYER (Plain English Translation) */}
      <div className="rounded-2xl border border-indigo-800/50 bg-slate-900/80 p-6 backdrop-blur-xl shadow-xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Human-Readable Financial Translation
              </h3>
              <p className="text-xs text-slate-400">
                Gemma 3 & VERA Interpretation Layer: Raw financial jargon and metrics decoded into plain English.
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/60 font-semibold">
            Plain English Layer
          </span>
        </div>

        {/* Executive Summary */}
        <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 text-sm text-slate-200 leading-relaxed font-sans">
          <p className="font-semibold text-indigo-400 text-xs uppercase tracking-wider mb-1">
            Executive Summary:
          </p>
          {explanation?.plain_summary || dossier.dehyped_summary}
        </div>

        {/* Decoded Financial Figures & Metrics */}
        {explanation?.decoded_metrics && explanation.decoded_metrics.length > 0 && (
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Decoded Financial Figures & Real-World Meaning:
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {explanation.decoded_metrics.map((dm, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-mono font-bold text-emerald-400">{dm.raw_text}</span>
                    <span className="text-[10px] uppercase font-semibold text-slate-500">
                      {dm.metric_type}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-normal">{dm.plain_meaning}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Key Verification Questions for Stage 2 */}
        {explanation?.verification_questions && explanation.verification_questions.length > 0 && (
          <div className="pt-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-2">
              <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
              Critical Questions for Fact-Checking (Stage 2 Targets):
            </span>
            <div className="space-y-1.5">
              {explanation.verification_questions.map((q, idx) => (
                <div
                  key={idx}
                  className="p-2.5 px-3 rounded-lg bg-slate-950/50 border border-slate-800/70 text-xs text-slate-300 flex items-start gap-2"
                >
                  <span className="text-cyan-400 font-bold font-mono">Q{idx + 1}.</span>
                  <span>{q}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 📄 EXACT VERBATIM DOCUMENT TEXT (Pixel-accurate transcript) */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-cyan-400">
            <FileCode className="w-4 h-4" />
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-200">
              Exact Verbatim Document Content
            </h3>
          </div>
          <button
            onClick={handleCopyRaw}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium flex items-center gap-1 border border-slate-700 transition cursor-pointer"
          >
            {copiedRaw ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            {copiedRaw ? 'Copied' : 'Copy Verbatim Text'}
          </button>
        </div>

        <p className="text-xs text-slate-400 mb-3">
          Exact, character-for-character text extracted directly from the uploaded image pixels, document, or audio.
        </p>

        {/* Verbatim Code Block with Line Numbers */}
        <div className="rounded-xl bg-slate-950 border border-slate-800 overflow-hidden font-mono text-xs">
          <div className="max-h-64 overflow-y-auto p-4 space-y-1 select-text">
            {verbatimLines.map((line, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <span className="text-slate-600 select-none text-[11px] w-6 text-right font-mono">
                  {idx + 1}
                </span>
                <span className="text-slate-200 whitespace-pre-wrap leading-relaxed">{line || ' '}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Side-by-side: De-hyped Core vs Red Flags */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* De-Hyped Objective Substance */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-xl">
          <div className="flex items-center gap-2 mb-4 text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-200">
              De-Hyped Factual Substance
            </h3>
          </div>
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 text-sm text-slate-200 leading-relaxed font-sans whitespace-pre-line">
            {dossier.dehyped_summary}
          </div>
        </div>

        {/* Detected Red Flags & Manipulation Signals */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-amber-400">
              <AlertTriangle className="w-4 h-4" />
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-200">
                Pump & Dump / Hype Indicators
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              {dossier.red_flags.length} flag(s)
            </span>
          </div>

          {dossier.red_flags.length === 0 ? (
            <div className="p-8 rounded-xl bg-slate-950/40 border border-slate-800/60 text-center">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-80" />
              <p className="text-sm font-medium text-slate-300">No Viral Red Flags Detected</p>
              <p className="text-xs text-slate-500 mt-1">
                Content is free of aggressive FOMO keywords, guaranteed profit claims, or pump signals.
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
              {dossier.red_flags.map((flag) => (
                <div
                  key={flag.flag_id}
                  className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition"
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-xs font-semibold text-white">{flag.flag_name}</span>
                    <span
                      className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${getSeverityBadge(
                        flag.severity
                      )}`}
                    >
                      {flag.severity}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mb-2">{flag.description}</p>
                  <div className="p-1.5 px-2.5 rounded bg-slate-900 border border-slate-800/80 font-mono text-[11px] text-amber-300/90 truncate">
                    Snippet: {flag.matched_snippet}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Atomic Assertions Board */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <FileSearch className="w-4 h-4 text-cyan-400" />
              <h3 className="text-base font-bold text-white tracking-tight">
                Atomic Assertions (Ready for Stage 2 Fact Checking)
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Each assertion is individually verifiable against official filings, disclosures, and exchange archives.
            </p>
          </div>
          <div className="text-xs text-slate-400">
            Selected for verification:{' '}
            <span className="font-bold text-cyan-400">
              {Object.values(selectedAssertions).filter(Boolean).length} / {dossier.assertions.length}
            </span>
          </div>
        </div>

        {dossier.assertions.length === 0 ? (
          <p className="text-xs text-slate-400">No discrete assertions found.</p>
        ) : (
          <div className="space-y-3">
            {dossier.assertions.map((assertion, idx) => (
              <div
                key={assertion.assertion_id}
                onClick={() => toggleAssertion(assertion.assertion_id)}
                className={`p-4 rounded-xl border transition cursor-pointer select-none ${
                  selectedAssertions[assertion.assertion_id]
                    ? 'bg-slate-950/90 border-cyan-500/40 shadow-lg shadow-cyan-500/5'
                    : 'bg-slate-950/40 border-slate-800 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      <input
                        type="checkbox"
                        checked={!!selectedAssertions[assertion.assertion_id]}
                        onChange={() => {}}
                        className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-500/20"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                          Assertion #{idx + 1}
                        </span>
                        <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800/50">
                          {assertion.category}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          Confidence: {Math.round(assertion.confidence_score * 100)}%
                        </span>
                      </div>
                      <p className="text-sm font-medium text-slate-100">{assertion.statement}</p>
                      <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
                        <span className="text-slate-500">Verification Source:</span>
                        <span className="text-slate-300 font-medium">
                          {assertion.verification_target}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Financial Anchors: Tickers & Numbers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Identified Entities */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-xl">
          <div className="flex items-center gap-2 mb-4 text-cyan-400">
            <Building2 className="w-4 h-4" />
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-200">
              Identified Entities & Tickers
            </h3>
          </div>
          {dossier.entities.length === 0 ? (
            <p className="text-xs text-slate-500">No specific corporate tickers found.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {dossier.entities.map((e, idx) => (
                <div
                  key={idx}
                  className="px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center gap-2"
                >
                  <div>
                    <span className="text-xs font-semibold text-white">{e.name}</span>
                    {e.ticker && (
                      <span className="ml-1.5 text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/50">
                        {e.ticker}
                      </span>
                    )}
                    <span className="ml-2 text-[10px] text-slate-400">({e.entity_type})</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Extracted Metrics */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-xl">
          <div className="flex items-center gap-2 mb-4 text-emerald-400">
            <Coins className="w-4 h-4" />
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-200">
              Financial Figures & Deal Metrics
            </h3>
          </div>
          {dossier.metrics.length === 0 ? (
            <p className="text-xs text-slate-500">No explicit financial values detected.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {dossier.metrics.map((m, idx) => (
                <div
                  key={idx}
                  className="px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center gap-2"
                >
                  <span className="text-xs font-mono font-bold text-emerald-400">{m.raw_text}</span>
                  <span className="text-[10px] uppercase font-semibold text-slate-400">
                    [{m.metric_type}]
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Stage 2 Hand-off Footer */}
      <div className="rounded-2xl border border-cyan-800/40 bg-gradient-to-r from-slate-900 via-cyan-950/30 to-slate-900 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            Ready for Stage 2: Evidence Retrieval & Source Discovery
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            The extracted assertions and ticker anchors are now structured and primed for cross-checking against official BSE/NSE corporate disclosures.
          </p>
        </div>

        <button
          onClick={() => {
            alert('Feature #1 Ingestion & Dossier Preparation complete! Stage 2 (Evidence Retrieval) will be built next.');
          }}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-cyan-500/20 flex items-center gap-2 whitespace-nowrap transition cursor-pointer"
        >
          <span>Stage 2: Retrieve Evidence</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
