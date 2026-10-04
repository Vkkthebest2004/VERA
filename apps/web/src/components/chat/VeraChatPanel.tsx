'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useChatStore } from '@/state/chatStore';
import { useVisualizationStore } from '@/state/visualizationStore';
import {
  Send,
  ShieldCheck,
  User,
  ChevronRight,
  Activity,
} from 'lucide-react';
import { VeraMessageRenderer } from './VeraMessageRenderer';
import { VeraActionToolbar } from '@/components/ui/VeraActionToolbar';

export const VeraChatPanel: React.FC = () => {
  const { messages, isTyping, activeSuggestions, sendMessage, clearMessages } = useChatStore();
  const {
    activeChartId,
    timeRange,
    selectedPoint,
    isSimplified,
    getCurrentCompanyRecord,
  } = useVisualizationStore();

  const record = getCurrentCompanyRecord();
  const [inputText, setInputText] = useState('');
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;
    const txt = inputText;
    setInputText('');
    await sendMessage(txt);
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl border border-neutral-200 shadow-2xs overflow-hidden">
      {/* ─────────────────────────────────────────────────────────────
          1. Header with Active Synchronized Graph Context Indicator
      ────────────────────────────────────────────────────────────── */}
      <div className="p-3 border-b border-neutral-200 bg-neutral-50/80 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-neutral-900 text-white flex items-center justify-center font-bold text-[11px] font-mono shadow-xs">
            V
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-xs text-neutral-900">Artha</span>
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-900 ml-0.5" />
            </div>
            <p className="text-[10px] text-neutral-500">
              Controlling <strong className="text-neutral-700">{record.name}</strong> visualizer
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <VeraActionToolbar
            size="sm"
            onUploadClick={() => {
              sendMessage(`Analyze uploaded financial statements for ${record.name}`);
            }}
            onArchiveClick={() => {
              sendMessage(`Show regulatory filings and board resolutions for ${record.name}`);
            }}
            onScanClick={() => {
              sendMessage(`Run an audit verification on ${record.name} ratios and debt structure`);
            }}
          />
          <button
            onClick={clearMessages}
            className="text-neutral-400 hover:text-neutral-700 text-[10px] font-medium transition-colors cursor-pointer"
            title="Clear chat history"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Live Graph Context Snapshot Pill */}
      <div className="px-3.5 py-1.5 bg-neutral-50 border-b border-neutral-200 flex items-center justify-between text-[11px] text-neutral-700 shrink-0 font-medium">
        <div className="flex items-center gap-1.5 truncate">
          <Activity className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
          <span className="truncate">
            Focus: <strong className="font-mono text-neutral-900">{activeChartId.replace('-', ' ')}</strong> ({timeRange[0]}–{timeRange[1]})
            {selectedPoint && (
              <span className="text-neutral-900 font-semibold ml-1">
                • {selectedPoint.period} {selectedPoint.metric} (₹{selectedPoint.value.toLocaleString('en-IN')} Cr)
              </span>
            )}
          </span>
        </div>
        <span className="text-[10px] px-1.5 py-0.2 rounded bg-neutral-200 text-neutral-700 font-mono font-medium shrink-0 ml-1">
          {isSimplified ? 'SIMPLIFIED' : 'FULL'}
        </span>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. Messages Conversation Stream
      ────────────────────────────────────────────────────────────── */}
      <div
        ref={chatScrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 text-xs scrollbar-thin scrollbar-thumb-neutral-200"
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
                className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 text-[11px] font-bold ${
                  isUser
                    ? 'bg-neutral-900 text-white'
                    : 'bg-neutral-900 text-white font-mono'
                }`}
              >
                {isUser ? <User className="w-3.5 h-3.5" /> : <span>V</span>}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[85%] rounded-xl p-3 leading-relaxed shadow-2xs transition-all ${
                  isUser
                    ? 'bg-neutral-900 text-white rounded-tr-none'
                    : 'bg-white text-neutral-800 border border-neutral-200 rounded-tl-none'
                }`}
              >
                {/* Executed Action Badge */}
                {msg.executedCommandAction && (
                  <div className="mb-2 flex items-center gap-1.5 text-[10px] text-neutral-700 font-mono font-semibold bg-neutral-100 px-2 py-0.5 rounded w-fit border border-neutral-200">
                    <span>ACTION: {msg.executedCommandAction.toUpperCase()}</span>
                  </div>
                )}

                <VeraMessageRenderer
                  content={msg.content}
                  isUser={isUser}
                />

                {/* Evidence Card if present */}
                {msg.evidenceRef && !isUser && (
                  <div className="mt-2.5 pt-2 border-t border-neutral-100 flex items-center justify-between text-[10px] text-neutral-500 font-medium">
                    <span className="flex items-center gap-1 text-emerald-700">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{msg.evidenceRef.filingType}</span>
                    </span>
                    <span className="font-mono text-[9px] px-1.5 py-0.2 rounded bg-neutral-100 text-neutral-600">
                      SEBI LODR 30
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-neutral-400 pl-8">
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-500 animate-bounce" />
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-500 animate-bounce [animation-delay:0.2s]" />
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-500 animate-bounce [animation-delay:0.4s]" />
            <span className="text-[11px] font-medium text-neutral-500">Updating visual graph...</span>
          </div>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. Contextual Suggestion Chips (Max 3, clean styling)
      ────────────────────────────────────────────────────────────── */}
      <div className="p-2.5 bg-neutral-50/70 border-t border-neutral-200 space-y-1 shrink-0">
        <div className="flex flex-wrap items-center gap-1.5">
          {activeSuggestions.slice(0, 3).map((sug, i) => (
            <button
              key={i}
              onClick={() => sendMessage(sug)}
              className="text-[11px] px-2.5 py-1 rounded-md bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-200 font-medium transition-colors cursor-pointer flex items-center gap-1"
            >
              <span>{sug}</span>
              <ChevronRight className="w-3 h-3 text-neutral-400" />
            </button>
          ))}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          4. Input Composer
      ────────────────────────────────────────────────────────────── */}
      <form
        onSubmit={handleSend}
        className="p-3 border-t border-neutral-200 bg-white flex items-center gap-2 shrink-0"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`Ask or command chart (e.g. "Show PAT vs Cash Flow")...`}
          className="flex-1 px-3.5 py-2 rounded-lg border border-neutral-300 text-xs placeholder:text-neutral-400 focus:outline-hidden focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 font-normal"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isTyping}
          className="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 disabled:opacity-40 text-white transition-all shadow-xs cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
