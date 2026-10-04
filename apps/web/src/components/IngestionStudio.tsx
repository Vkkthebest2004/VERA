'use client';

import React, { useState, useRef } from 'react';
import { InvestigationDossier } from '@/types/investigation';
import { investigateClaim, investigateFile } from '@/lib/api';
import { VeraChatResponse } from './VeraChatResponse';
import { CrawlerAnimationScreen } from './CrawlerAnimationScreen';
import { Paperclip, ArrowRight, X, FileText, Loader2, Sparkles, HelpCircle } from 'lucide-react';
import { VeraActionToolbar } from '@/components/ui/VeraActionToolbar';

const SAMPLE_RELIANCE_CLAIM = `🔥🚨 VIRAL WHATSAPP FORWARD 🚨🔥
Reliance Retail signed a secret ₹50,000 Crore mega luxury retail buyout agreement with European luxury brands! 
Promoters and big operators aggressively accumulating before market open! 
Guaranteed 20% upper circuit tomorrow! Target ₹1,800 next week 🚀💰💸!`;

const SAMPLE_RELIANCE_VERIFIED = `Reliance Retail Ventures acquired a 51% majority stake in Ed-a-Mamma for ₹350 Crore.`;
const SAMPLE_RELIANCE_CONTRADICTED = `Reliance Industries Q1 net profit collapsed by 45% to ₹5,000 Crore amid massive refining margin crash!`;
const SAMPLE_RELIANCE_ARAMCO = `Reliance Industries signed secret ₹2,50,000 Crore crude oil concession with Saudi Aramco! Guaranteed 25% upper circuit tomorrow!`;

export const IngestionStudio: React.FC = () => {
  const [inputText, setInputText] = useState<string>('');
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [submittedPrompt, setSubmittedPrompt] = useState<string>('');
  const [submittedFileName, setSubmittedFileName] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [investigation, setInvestigation] = useState<InvestigationDossier | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachedFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setAttachedFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleAnalyze = async (customText?: string) => {
    const query = typeof customText === 'string' ? customText : inputText;
    if (!query.trim() && !attachedFile) return;

    setSubmittedPrompt(query.trim());
    setSubmittedFileName(attachedFile ? attachedFile.name : '');
    setIsProcessing(true);
    setInvestigation(null);

    try {
      let result: InvestigationDossier;
      if (attachedFile) {
        result = await investigateFile(attachedFile);
      } else {
        const trimmed = query.trim();
        const isUrl = /^https?:\/\//i.test(trimmed);
        result = await investigateClaim(trimmed, isUrl ? 'URL' : 'TEXT');
      }
      setInvestigation(result);
    } catch (err) {
      console.error('Investigation failed', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const loadExample = (text: string) => {
    setInputText(text);
    setAttachedFile(null);
    handleAnalyze(text);
  };

  const handleReset = () => {
    setInvestigation(null);
    setInputText('');
    setAttachedFile(null);
    setSubmittedPrompt('');
    setSubmittedFileName('');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Platform Title & User's Action Segment Toolbar */}
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="flex flex-wrap items-center justify-center gap-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-300 text-neutral-800 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-neutral-700" />
            <span>Unified Web Crawler & AI Verification</span>
          </div>
          <VeraActionToolbar
            size="sm"
            onUpload={() => fileInputRef.current?.click()}
            onArchive={() => handleAnalyze('List latest Reliance Industries BSE & NSE Regulation 30 filings')}
            onScan={() => handleAnalyze(SAMPLE_RELIANCE_CLAIM)}
          />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-950 tracking-tight">
          Verify What&apos;s True Across Every Source
        </h1>
        <p className="text-sm text-neutral-600 max-w-2xl mx-auto">
          Submit any rumor, viral tip, or screenshot. VERA crawls official regulatory filings (BSE/NSE/SEC), 
          corporate disclosure archives, and accredited financial news wires to verify the truth.
        </p>
      </div>

      {/* Input Box Card */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`rounded-2xl border transition-all duration-200 bg-white shadow-sm relative ${
          isDragging
            ? 'border-neutral-900 bg-neutral-50 ring-2 ring-neutral-900/10'
            : 'border-neutral-200 hover:border-neutral-300'
        }`}
      >
        {/* Main Textarea */}
        <textarea
          rows={4}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask a question, paste a rumor or link, or drop a screenshot here..."
          className="w-full p-5 bg-transparent text-neutral-950 font-sans text-sm focus:outline-none placeholder-neutral-400 resize-y leading-relaxed"
        />

        {/* Attached File Preview Chip */}
        {attachedFile && (
          <div className="px-5 pb-3 flex items-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-100 border border-neutral-200 text-xs text-neutral-800">
              <FileText className="w-3.5 h-3.5 text-neutral-700" />
              <span className="font-medium truncate max-w-xs">{attachedFile.name}</span>
              <span className="text-[10px] text-neutral-500">
                ({(attachedFile.size / 1024).toFixed(0)} KB)
              </span>
              <button
                type="button"
                onClick={() => setAttachedFile(null)}
                className="text-neutral-400 hover:text-neutral-900 transition ml-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Bottom Toolbar: Attach Button (Left) & Submit Button (Right) */}
        <div className="px-5 py-3.5 border-t border-neutral-100 flex items-center justify-between gap-3 bg-neutral-50/50 rounded-b-2xl">
          {/* File Input & Hidden Native Input */}
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.png,.jpg,.jpeg,.mp3,.wav,.m4a"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 text-xs font-medium text-neutral-600 hover:text-neutral-950 py-1.5 px-2.5 rounded-lg hover:bg-neutral-100 transition cursor-pointer"
            >
              <Paperclip className="w-3.5 h-3.5 text-neutral-500" />
              <span>Attach Image / Screenshot / Audio</span>
            </button>
          </div>

          {/* Action Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleAnalyze()}
              disabled={isProcessing || (!inputText.trim() && !attachedFile)}
              className={`px-5 py-2.5 rounded-xl font-semibold text-xs tracking-wide transition flex items-center gap-2 cursor-pointer ${
                isProcessing || (!inputText.trim() && !attachedFile)
                  ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed border border-neutral-200'
                  : 'bg-neutral-950 hover:bg-neutral-800 text-white font-bold shadow-sm active:scale-[0.98]'
              }`}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Crawling & Verifying...</span>
                </>
              ) : (
                <>
                  <span>Verify Across All Sources</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Quick Prompts / Examples */}
      {!investigation && !isProcessing && (
        <div className="space-y-2">
          <div className="text-xs font-medium text-neutral-500 flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-neutral-400" />
            <span>Or try one of these test cases:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => loadExample(SAMPLE_RELIANCE_CLAIM)}
              className="text-xs px-3 py-1.5 rounded-lg bg-white border border-neutral-200 hover:border-neutral-900 text-neutral-800 hover:text-neutral-950 transition cursor-pointer text-left shadow-2xs font-medium"
            >
              ⚠️ Reliance ₹50,000 Cr Luxury Deal (Exaggerated)
            </button>
            <button
              onClick={() => loadExample(SAMPLE_RELIANCE_VERIFIED)}
              className="text-xs px-3 py-1.5 rounded-lg bg-white border border-neutral-200 hover:border-neutral-900 text-neutral-800 hover:text-neutral-950 transition cursor-pointer text-left shadow-2xs font-medium"
            >
              🏛️ Reliance Ed-a-Mamma 51% Stake (Verified True)
            </button>
            <button
              onClick={() => loadExample(SAMPLE_RELIANCE_CONTRADICTED)}
              className="text-xs px-3 py-1.5 rounded-lg bg-white border border-neutral-200 hover:border-neutral-900 text-neutral-800 hover:text-neutral-950 transition cursor-pointer text-left shadow-2xs font-medium"
            >
              📉 Reliance Q1 Profit Crash to ₹5,000 Cr (Contradicted)
            </button>
            <button
              onClick={() => loadExample(SAMPLE_RELIANCE_ARAMCO)}
              className="text-xs px-3 py-1.5 rounded-lg bg-white border border-neutral-200 hover:border-neutral-900 text-neutral-800 hover:text-neutral-950 transition cursor-pointer text-left shadow-2xs font-medium"
            >
              🚨 Reliance Secret ₹2.5L Cr Aramco Deal (Unsubstantiated)
            </button>
          </div>
        </div>
      )}

      {/* 📡 Animated Crawler Surfing Screen while Crawling */}
      {isProcessing && (
        <div className="pt-4 animate-in fade-in duration-300">
          <CrawlerAnimationScreen />
        </div>
      )}

      {/* 💬 Render Unified Single ChatGPT-Style Response */}
      {!isProcessing && investigation && (
        <div id="investigation-section" className="pt-2">
          <VeraChatResponse
            investigation={investigation}
            userPrompt={submittedPrompt}
            attachedFileName={submittedFileName}
            onReset={handleReset}
          />
        </div>
      )}
    </div>
  );
};
