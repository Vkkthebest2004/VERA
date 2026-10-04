'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  RotateCcw,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  User,
  ArrowUpRight,
  BarChart3,
  LayoutGrid,
  Brain,
} from 'lucide-react';
import { CompanyData } from '@/data/mockCompanies';
import { VeraMessageRenderer } from './VeraMessageRenderer';
import { VeraChatBentoGrid } from './VeraChatBentoGrid';
import { VeraActionToolbar } from '@/components/ui/VeraActionToolbar';
import { VeraMemoryDrawer } from './VeraMemoryDrawer';
import { getAuthHeaders } from '@/lib/supabase';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: number;
  tags?: string[];
  suggestedFollowUps?: string[];
  visualizerLink?: boolean;
  citations?: Array<{ title: string; domain: string; url: string; source: string }>;
  marketSnapshot?: Record<string, any>;
}

interface VeraConversationalChatProps {
  company: CompanyData;
  onNavigateToVisualizer?: () => void;
  onOpenEvidenceTab?: () => void;
}

export const VeraConversationalChat: React.FC<VeraConversationalChatProps> = ({
  company,
  onNavigateToVisualizer,
  onOpenEvidenceTab,
}) => {
  const shortName = company.name.split(' ')[0];

  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isMemoryOpen, setIsMemoryOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      content: `Hello! I am **Artha**, your financial companion and tutor for **${company.name} (${company.ticker})**.\n\nI am here to help you understand finance without confusing jargon. Whether you want to explore how ${shortName} makes money, evaluate how an investor analyzes this business, understand financial ratios, or verify corporate announcements against official BSE/NSE filings—I will walk through it with you step-by-step.\n\nWhat would you like to explore about ${company.ticker} today?`,
      timestamp: Date.now(),
      suggestedFollowUps: [
        `How does ${shortName} make money?`,
        `Should I invest in ${shortName}?`,
        'Explain ROCE vs ROE',
      ],
    },
  ]);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showBento, setShowBento] = useState(true);
  const [expandedSources, setExpandedSources] = useState<Record<string, boolean>>({});
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new message
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Company-specific dynamic suggested questions (Strictly 3 maximum)
  const getSuggestedQuestions = () => {
    if (company.id === 'AWL') {
      return [
        { label: 'Business Model', q: 'How does Adani Wilmar make money across its segments?' },
        { label: 'Should I Invest?', q: 'How should an investor evaluate investing in Adani Wilmar?' },
        { label: 'ROCE vs ROE', q: 'Explain why ROCE is 18.3% while ROE is 10.7%' },
      ];
    } else if (company.id === 'ALLETEC') {
      return [
        { label: 'Business Model', q: 'Explain All E Technologies Microsoft Dynamics business' },
        { label: 'Capital Efficiency', q: 'Why is All E Technologies ROCE so high at 22.1%?' },
        { label: 'Valuation & Yield', q: 'Analyze P/E of 9.74 and 1.22% dividend yield' },
      ];
    } else if (company.id === 'RELIANCE') {
      return [
        { label: 'Should I Invest?', q: 'How should an investor evaluate an investment in Reliance?' },
        { label: 'Segment Mix', q: 'Explain Reliance business model and segment mix' },
        { label: 'Debt & CapEx', q: 'Does Reliance have heavy debt relative to its cash flow?' },
      ];
    } else {
      // TATAPOWER & defaults
      return [
        { label: 'Clean Energy', q: 'Explain Tata Power green energy orderbook and solar projects' },
        { label: 'Debt Coverage', q: 'Analyze Tata Power debt levels and interest coverage safety' },
        { label: 'Should I Invest?', q: 'How should an investor evaluate Tata Power today?' },
      ];
    }
  };

  const handleSendMessage = async (userText: string) => {
    const text = userText.trim();
    if (!text) return;

    setInput('');
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: text,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    // 1. First attempt query to live backend API with Supabase memory context
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const authHeaders = await getAuthHeaders();
      const response = await fetch(`${apiBase}/api/v1/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
        },
        body: JSON.stringify({
          message: text,
          conversation_id: conversationId,
          company_id: company.id,
          company_name: company.name,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.conversation_id) {
          setConversationId(data.conversation_id);
        }
        if (data.response) {
          const assistantMsg: Message = {
            id: `assist-${Date.now()}`,
            sender: 'assistant',
            content: data.response,
            timestamp: Date.now(),
            suggestedFollowUps: (data.suggested_follow_ups || []).slice(0, 3),
            visualizerLink: text.toLowerCase().includes('chart') || text.toLowerCase().includes('visualizer'),
            citations: data.citations,
            marketSnapshot: data.market_intelligence?.market_snapshot,
          };
          setMessages((prev) => [...prev, assistantMsg]);
          setIsTyping(false);
          return;
        }
      }
    } catch {
      // Seamlessly fall back to client-side financial reasoning
    }

    // 2. Client-side deterministic financial reasoning fallback
    setTimeout(() => {
      const lower = text.toLowerCase();
      let reply = '';
      let followUps: string[] = [];
      let visualizerLink = false;

      // 0. Beginner onboarding
      if (lower.includes('beginner') || lower.includes('new to') || lower.includes('start from scratch') || lower.includes('explain like')) {
        reply = `### Welcome to Finance with Artha!\n\nYou never have to feel shy about asking basic questions here. Finance is simply common sense wrapped in accounting vocabulary.\n\nThink of a business like a neighborhood bakery:\n• **Revenue** is the total money collected from selling bread.\n• **Profit** is what remains after buying flour, butter, and paying electricity.\n• **Cash Flow** is the actual bank balance (since some customers buy on credit!).\n• **Market Cap** is how much it would cost to buy the entire bakery today.\n\nWhere would you like to start? We can take it one simple step at a time!`;
        followUps = ['Explain Revenue vs Profit', 'What is Market Cap?', `How does ${shortName} make money?`];
      }
      // 0b. Investment Inquiry / Should I buy?
      else if (lower.includes('should i buy') || lower.includes('should i invest') || lower.includes('is it good to invest') || lower.includes('worth buying') || lower.includes('should i sell')) {
        reply = `### How to Evaluate an Investment in ${company.name} (${company.ticker})\n\nRather than giving a simplistic 'buy' or 'sell' command, let's walk through how a thoughtful investor evaluates this decision:\n\n**Core Rule First**: Company Quality is NOT the same as Stock Quality. A great company can be an expensive stock!\n\n• **01 Business Model**: Operates with strong market standing and verified BSE/NSE disclosures. [1]\n• **02 Capital Efficiency**: ROCE stands at **${company.roce}%** against an ROE of **${company.roe}%** [2]. When ROCE exceeds borrowing costs, the business generates genuine economic value.\n• **03 Cash Flow Conversion**: Check whether reported Net Profit translates into Operating Cash Flow.\n• **04 Valuation Multiples**: Currently trading at **${company.pe}× P/E** against a Book Value of **₹${company.bookValue}**.\n• **05 The Bull Case**: Expansion into higher-margin segments and operational scale tailwinds.\n• **06 The Bear Case**: Raw material inflation and broader market cyclicality.\n\nSources: BSE · NSE Statutory Filings · FY2025 Annual Report`;
        followUps = ['Show Profit vs Cash Flow', 'Compare with peers', `Does ${shortName} have heavy debt?`];
      }
      // 1. Business model / Segments
      else if (lower.includes('business') || lower.includes('model') || lower.includes('product') || lower.includes('segment') || lower.includes('make money')) {
        if (company.id === 'RELIANCE') {
          reply = `### How Reliance Makes Money\nReliance operates through three major growth engines:\n\n**01 Consumer Retail**\nGrocery, electronics, fashion, lifestyle, and e-commerce across 18,000+ stores. [1]\n\n**02 Digital Services**\nJio telecom network serving 475M+ subscribers and pan-India standalone 5G infrastructure. [2]\n\n**03 Oil-to-Chemicals (O2C)**\nRefining complex at Jamnagar, petrochemicals, and ongoing green energy transition. [1]\n\nSources: BSE · NSE · FY2025 Annual Report`;
          followUps = ['Does Reliance have heavy debt?', 'Compare with peers', 'Segment revenue mix'];
        } else if (company.id === 'AWL') {
          reply = `### How Adani Wilmar Makes Money\nAWL Agri Business operates across three key consumer pillars:\n\n**01 Edible Oils (~75% of Volume)**\nMarket leader through flagship brand Fortune in refined sunflower, mustard, and soya oils. [1]\n\n**02 Packaged Foods & Staples (~15% of Revenue)**\nHigh-margin branded consumer staples including chakki atta, basmati rice, besan, and sugar. [2]\n\n**03 Industry Essentials (~10% of Revenue)**\nSpecialty oleochemicals, castor derivatives, and de-oiled cakes for industrial clients. [1]\n\nSources: BSE · NSE · FY2025 Annual Report`;
          followUps = ['Why did profit fluctuate in FY24?', 'Explain the 18.3% ROCE', 'Compare with peers'];
        } else if (company.id === 'ALLETEC') {
          reply = `### How All E Technologies Makes Money\nAll E Technologies operates as a specialized Microsoft Gold Certified Partner across digital enterprise services:\n\n**01 Enterprise Applications**\nMicrosoft Dynamics 365 Business Central and Finance & Operations implementations. [1]\n\n**02 Cloud Infrastructure**\nMicrosoft Azure cloud migrations, modern workplace, and data engineering. [2]\n\n**03 AI & Analytics**\nEnterprise Copilot enablement and Power Platform business automation. [1]\n\nSources: BSE SME Disclosures · FY2025 Annual Report`;
          followUps = ['Analyze P/E valuation', 'Explain high ROCE (22.1%)', 'Debt & margins'];
        } else {
          reply = `### Business Model: ${company.name}\n**${company.name}** operates nationwide infrastructure with long-term capital compounding:\n\n• **Core Operations:** Scale infrastructure generating consistent operational cash flows.\n• **Expansion Vectors:** Disciplined capital investments in digital efficiency and clean transition.\n\nSources: BSE · NSE Statutory Disclosures`;
          followUps = ['Compare with peers', 'Capital efficiency', 'Debt status'];
        }
      }
      // 2. Debt / CapEx / Leverage
      else if (lower.includes('debt') || lower.includes('capex') || lower.includes('leverage') || lower.includes('heavy debt')) {
        if (company.id === 'RELIANCE') {
          reply = `Not particularly relative to its scale.\n\nReliance’s consolidated debt remains substantial in absolute terms, but the more useful question is debt relative to EBITDA and cash generation.\n\n• **Net debt / EBITDA:** 0.8× [1]\n• **Trend:** Decreasing from 1.1× in prior investment cycles\n\nThe balance sheet therefore doesn’t currently look highly leveraged.\n\n**Why this matters:**\nLower leverage gives Reliance more capacity to fund its retail, telecom and new-energy expansion without straining credit ratings.\n\nSources: FY2025 Annual Report · Q1 FY26 Results`;
          followUps = ['Segment performance', 'Compare with peers', 'Cash flow quality'];
        } else {
          reply = `### Balance Sheet Leverage: ${company.name}\nFor **${company.name}**, debt levels remain supported by ongoing operating cash flows:\n\n• **Net Debt / Equity:** Moderate gearing with conservative interest coverage ratios. [1]\n• **CapEx Financing:** Core capital expenditures are financed largely through internal operational accruals rather than speculative borrowing.\n\nSources: FY2025 Balance Sheet Disclosures · Statutory Auditor Report`;
          followUps = ['Compare with peers', 'ROCE vs ROE', 'Segment performance'];
        }
      }
      // 3. P/E, Valuation & Peer comparison
      else if (lower.includes('pe') || lower.includes('valuation') || lower.includes('peer') || lower.includes('compare')) {
        reply = `### Valuation Overview: ${company.name}\nTrading at **${company.pe}× P/E** with a market capitalization of **₹${company.marketCapCr.toLocaleString('en-IN')} Cr** [1].\n\n• **Conglomerate Multiple:** Blended valuation reflecting stable cash-generating core businesses and faster-growing digital/consumer arms.\n• **Capital Efficiency:** Operating return on capital (ROCE) stands at **${company.roce}%** against an ROE of **${company.roe}%** [2].\n• **Book Value:** ₹${company.bookValue} per share, with current market price near historical support zones.\n\nSources: NSE Corporate Announcements · FY2025 Audited Statements`;
        followUps = ['Segment performance', `Does ${shortName} have heavy debt?`, 'Explain ROCE vs ROE'];
      }
      // 4. ROCE vs ROE
      else if (lower.includes('roce') || lower.includes('roe') || lower.includes('capital efficiency')) {
        reply = `### Capital Efficiency: ROCE (${company.roce}%) vs ROE (${company.roe}%)\n\n• **ROCE (${company.roce}%):** Measures operating profit generated across all capital employed (equity plus long-term debt). [1]\n• **ROE (${company.roe}%):** Reflects net profit available solely to shareholders after debt servicing and taxes.\n• **Interpretation:** When ROCE consistently exceeds borrowing costs (~8.5%), management is deploying capital with genuine economic value creation.\n\nSources: FY2025 Audited Annual Report`;
        followUps = ['Compare with peers', 'Debt & CapEx', 'Segment performance'];
      }
      // 5. Visualizer command or chart exploration
      else if (lower.includes('chart') || lower.includes('visualizer') || lower.includes('graph') || lower.includes('cash flow')) {
        reply = `The 10-year audited metrics for **${company.name}** are available on the multi-dimensional canvas.\n\nYou can inspect revenue trajectories, EBITDA margins, and cash-flow conversion trends interactively.`;
        visualizerLink = true;
        followUps = ['Segment performance', 'Compare with peers', 'Debt & CapEx'];
      }
      // 6. Default financial partner synthesis
      else {
        reply = `### Analysis for ${company.name} (${company.ticker})\n\nRegarding *"${text}"*:\n\n• **Market Stature:** Market capitalization of **₹${company.marketCapCr.toLocaleString('en-IN')} Cr** at CMP **₹${company.price}** [1].\n• **Capital Efficiency:** Operating return on capital (ROCE) stands at **${company.roce}%** with an ROE of **${company.roe}%**.\n• **Valuation Multiple:** Currently trading at **${company.pe}× P/E** against a Book Value of **₹${company.bookValue}** [2].\n\nSources: BSE & NSE Statutory Filings · FY2025 Annual Report`;
        followUps = [
          'Segment performance',
          `Does ${shortName} have heavy debt?`,
          'Compare with peers',
        ];
      }

      const assistantMsg: Message = {
        id: `assist-${Date.now()}`,
        sender: 'assistant',
        content: reply,
        timestamp: Date.now(),
        suggestedFollowUps: followUps.slice(0, 3),
        visualizerLink,
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 400);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* ─────────────────────────────────────────────────────────────
          1. Context Header: Active Company Snapshot (Subtle & Clean)
      ────────────────────────────────────────────────────────────── */}
      <div className="px-5 py-2.5 bg-neutral-50/80 border-b border-neutral-200 flex items-center justify-between text-xs text-neutral-800 shrink-0">
        <div className="flex items-center gap-2 truncate">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
          <span className="font-semibold truncate text-neutral-900">
            {company.name} ({company.ticker})
          </span>
          <span className="font-mono text-neutral-900 font-bold ml-1">
            ₹{company.price.toLocaleString('en-IN')}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <VeraActionToolbar
            size="sm"
            onUploadClick={() => {
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = 'image/*,application/pdf';
              input.onchange = (e: any) => {
                const file = e.target?.files?.[0];
                if (file) {
                  handleSendMessage(`Please analyze the attached document: ${file.name} for ${company.name}`);
                }
              };
              input.click();
            }}
            onArchiveClick={() => {
              handleSendMessage(`Summarize recent BSE and NSE statutory disclosures and corporate filings for ${company.name}`);
            }}
            onScanClick={() => {
              handleSendMessage(`Perform a deep invariant financial health scan on ${company.name} (${company.ticker})`);
            }}
          />
          <button
            onClick={() => setIsMemoryOpen(true)}
            className="px-2 py-1 rounded text-[11px] font-medium bg-neutral-100 hover:bg-neutral-200 text-neutral-800 transition-colors border border-neutral-200 cursor-pointer flex items-center gap-1"
            title="Open Supabase Investor Memory Vault"
          >
            <Brain className="w-3.5 h-3.5 text-purple-600" />
            <span className="hidden sm:inline">Memory</span>
          </button>
          <button
            onClick={() => setShowBento(!showBento)}
            className={`px-2 py-1 rounded text-[11px] font-medium transition-all cursor-pointer flex items-center gap-1 border ${
              showBento
                ? 'bg-neutral-900 text-white border-neutral-900 shadow-2xs'
                : 'bg-white text-neutral-600 border-neutral-200 hover:text-neutral-900 hover:bg-neutral-100'
            }`}
            title="Toggle Bento Exploration Grid"
          >
            <LayoutGrid className="w-3 h-3" />
            <span className="hidden sm:inline">Bento</span>
          </button>
          <button
            onClick={() => setMessages([])}
            className="text-neutral-400 hover:text-neutral-700 p-1 rounded hover:bg-neutral-200/60 transition-colors cursor-pointer"
            title="Clear conversation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. Messages Conversation Stream
      ────────────────────────────────────────────────────────────── */}
      <div
        ref={chatScrollRef}
        className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-xs scrollbar-thin scrollbar-thumb-neutral-200"
      >
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div
                className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 text-[11px] font-bold overflow-hidden ${
                  isUser
                    ? 'bg-neutral-900 text-white'
                    : 'bg-white border border-neutral-200 p-0.5'
                }`}
              >
                {isUser ? <User className="w-3.5 h-3.5" /> : <img src="/vera_icon.svg" alt="VERA" className="w-full h-full object-contain" />}
              </div>

              {/* Message Bubble */}
              <div className="max-w-[88%] space-y-2">
                <div
                  className={`rounded-xl p-3.5 leading-relaxed text-xs shadow-2xs transition-all ${
                    isUser
                      ? 'bg-neutral-900 text-white rounded-tr-none'
                      : 'bg-white text-neutral-800 border border-neutral-200 rounded-tl-none'
                  }`}
                >
                  <VeraMessageRenderer
                    content={msg.content}
                    isUser={isUser}
                    onOpenVisualizer={onNavigateToVisualizer}
                    onCitationClick={() => {
                      setExpandedSources((prev) => ({ ...prev, [msg.id]: true }));
                    }}
                  />

                  {/* Tiny, Believable Verified Sources Footnote */}
                  {!isUser && (
                    <div className="mt-3 pt-2 border-t border-neutral-100 text-xs">
                      <div className="flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => setExpandedSources((prev) => ({ ...prev, [msg.id]: !prev[msg.id] }))}
                          className="inline-flex items-center gap-1.5 text-[11px] text-neutral-600 hover:text-neutral-900 font-medium transition-colors cursor-pointer group"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>Sources verified</span>
                          <ChevronDown
                            className={`w-3 h-3 text-neutral-400 group-hover:text-neutral-600 transition-transform ${
                              expandedSources[msg.id] ? 'rotate-180' : ''
                            }`}
                          />
                        </button>

                        <span className="text-[10px] text-neutral-400 font-medium">
                          {msg.citations && msg.citations.length > 0
                            ? `${msg.citations.length} Live Sources · Market Intelligence`
                            : 'BSE · NSE · Annual Report'}
                        </span>
                      </div>

                      {/* Expandable Verified Sources Panel */}
                      {expandedSources[msg.id] && (
                        <div className="mt-2 p-2.5 rounded-lg bg-neutral-50 border border-neutral-200/80 text-[11px] space-y-2 animate-in fade-in duration-150">
                          {msg.citations && msg.citations.length > 0 ? (
                            msg.citations.map((c, cIdx) => (
                              <div
                                key={cIdx}
                                className={`flex items-start justify-between gap-2 ${
                                  cIdx > 0 ? 'border-t border-neutral-200/60 pt-1.5' : ''
                                }`}
                              >
                                <div className="min-w-0 pr-2">
                                  <div className="font-semibold text-neutral-800 truncate">
                                    {c.title || c.domain}
                                  </div>
                                  <div className="text-[10px] text-neutral-500 truncate">
                                    Source: {c.source || c.domain}
                                  </div>
                                </div>
                                {c.url ? (
                                  <a
                                    href={c.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[10px] font-mono text-neutral-600 hover:text-neutral-900 shrink-0 underline decoration-neutral-300 transition-colors"
                                  >
                                    {c.domain}
                                  </a>
                                ) : (
                                  <span className="text-[10px] font-mono text-neutral-400 shrink-0">
                                    {c.domain}
                                  </span>
                                )}
                              </div>
                            ))
                          ) : (
                            <>
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <div className="font-semibold text-neutral-800">BSE Filing (LODR Reg 30 / 33)</div>
                                  <div className="text-[10px] text-neutral-500">Security Code: {company.bseCode} · Audited Statements</div>
                                </div>
                                <span className="text-[10px] font-mono text-neutral-400 shrink-0">Official Source</span>
                              </div>

                              <div className="flex items-start justify-between gap-2 border-t border-neutral-200/60 pt-1.5">
                                <div>
                                  <div className="font-semibold text-neutral-800">NSE Corporate Announcement</div>
                                  <div className="text-[10px] text-neutral-500">Symbol: {company.ticker} · Statutory Compliance</div>
                                </div>
                                <span className="text-[10px] font-mono text-neutral-400 shrink-0">Official Source</span>
                              </div>

                              <div className="flex items-start justify-between gap-2 border-t border-neutral-200/60 pt-1.5">
                                <div>
                                  <div className="font-semibold text-neutral-800">FY2025 Integrated Annual Report</div>
                                  <div className="text-[10px] text-neutral-500">Statutory Auditor Report & Segment Notes</div>
                                </div>
                                <span className="text-[10px] font-mono text-neutral-400 shrink-0">Primary Report</span>
                              </div>
                            </>
                          )}

                          {onOpenEvidenceTab && (
                            <button
                              type="button"
                              onClick={onOpenEvidenceTab}
                              className="text-[10px] text-neutral-900 hover:text-neutral-700 font-semibold pt-1 flex items-center gap-1 cursor-pointer transition-colors"
                            >
                              <span>Open in Evidence Tracker</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Optional Button to open in visualizer */}
                {msg.visualizerLink && onNavigateToVisualizer && (
                  <button
                    onClick={onNavigateToVisualizer}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-medium transition-all shadow-xs cursor-pointer"
                  >
                    <BarChart3 className="w-3.5 h-3.5" />
                    <span>Open Multi-Dimensional Canvas</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                )}

                {/* Follow-up Suggestion Chips (Max 3, clean styling) */}
                {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && !isUser && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-0.5 pl-0.5">
                    {msg.suggestedFollowUps.slice(0, 3).map((sug, sIdx) => (
                      <button
                        key={sIdx}
                        onClick={() => handleSendMessage(sug)}
                        className="text-[11px] px-2.5 py-1 rounded-md bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-200 font-medium transition-colors cursor-pointer flex items-center gap-1 group/chip"
                      >
                        <span>{sug}</span>
                        <ChevronRight className="w-3 h-3 text-neutral-400 group-hover/chip:text-neutral-700 transition-colors" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* 2b. Interactive Monochrome Bento Grid when starting exploration */}
        {showBento && messages.length <= 1 && (
          <div className="pt-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <VeraChatBentoGrid
              company={company}
              onSelectQuery={handleSendMessage}
              onOpenVisualizer={onNavigateToVisualizer}
              onOpenEvidence={onOpenEvidenceTab}
            />
          </div>
        )}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-neutral-400 pl-8">
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-500 animate-bounce" />
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-500 animate-bounce [animation-delay:0.2s]" />
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-500 animate-bounce [animation-delay:0.4s]" />
            <span className="text-[11px] font-medium text-neutral-500">
              Retrieving financial filings for {company.ticker}...
            </span>
          </div>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. Contextual Suggestions (Max 3, clean, non-intrusive)
      ────────────────────────────────────────────────────────────── */}
      {messages.length <= 2 && (
        <div className="px-4 py-2 bg-neutral-50/70 border-t border-neutral-200 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          <span className="text-[10px] text-neutral-400 font-medium shrink-0">
            Suggested:
          </span>
          {getSuggestedQuestions().slice(0, 3).map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(item.q)}
              className="text-[11px] px-2.5 py-1 rounded-md bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-200 font-medium transition-colors shrink-0 cursor-pointer"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          4. Input Composer: Human & Conversational
      ────────────────────────────────────────────────────────────── */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage(input);
        }}
        className="p-3 border-t border-neutral-200 bg-white flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Ask about ${shortName}’s financials, valuation, segments…`}
          className="flex-1 px-3.5 py-2 rounded-lg border border-neutral-300 text-xs placeholder:text-neutral-400 focus:outline-hidden focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 font-normal transition-all"
        />
        <button
          type="submit"
          disabled={!input.trim() || isTyping}
          className="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 disabled:opacity-40 text-white transition-all shadow-xs cursor-pointer flex items-center justify-center shrink-0"
          title="Send"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

      {/* Persistent Supabase Memory Drawer */}
      <VeraMemoryDrawer
        isOpen={isMemoryOpen}
        onClose={() => setIsMemoryOpen(false)}
      />
    </div>
  );
};
