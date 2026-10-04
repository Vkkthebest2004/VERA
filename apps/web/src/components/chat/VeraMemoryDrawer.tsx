'use client';

import React, { useState, useEffect } from 'react';
import {
  Brain,
  X,
  Trash2,
  Plus,
  Sparkles,
  ShieldCheck,
  Tag,
  AlertCircle,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { useChatStore } from '@/state/chatStore';
import { getAuthHeaders, UserMemoryItem } from '@/lib/supabase';

interface VeraMemoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VeraMemoryDrawer: React.FC<VeraMemoryDrawerProps> = ({ isOpen, onClose }) => {
  const { userMemories, loadUserMemories, removeUserMemory } = useChatStore();
  const [isAdding, setIsAdding] = useState(false);
  const [newContent, setNewContent] = useState('');
  const [newType, setNewType] = useState('preference');
  const [newImportance, setNewImportance] = useState(0.8);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      loadUserMemories().finally(() => setIsLoading(false));
    }
  }, [isOpen, loadUserMemories]);

  if (!isOpen) return null;

  const handleAddMemory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const authHeaders = await getAuthHeaders();
      const res = await fetch(`${apiBase}/api/v1/memory`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
        },
        body: JSON.stringify({
          content: newContent.trim(),
          memory_type: newType,
          importance: newImportance,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || 'Failed to save memory');
      }

      setNewContent('');
      setIsAdding(false);
      await loadUserMemories();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error saving memory');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'preference':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'project':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'financial_focus':
      case 'focus':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'risk_tolerance':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-neutral-100 text-neutral-700 border-neutral-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md h-full bg-white shadow-2xl flex flex-col border-l border-neutral-200 animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white flex items-center justify-center shadow-xs">
              <Brain className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-neutral-900">VERA Memory Vault</h3>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 font-semibold">
                  pgvector
                </span>
              </div>
              <p className="text-[11px] text-neutral-500">
                Persistent investor preferences stored in Supabase
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                setIsLoading(true);
                loadUserMemories().finally(() => setIsLoading(false));
              }}
              className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-md hover:bg-neutral-100 transition-colors"
              title="Refresh memories"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-md hover:bg-neutral-100 transition-colors"
              title="Close drawer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Informational Callout */}
        <div className="p-3 bg-neutral-50 border-b border-neutral-200 text-[11px] text-neutral-600 flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span>
            <strong>Deterministic Guardrail:</strong> Memories guide conversational tone and analytical focus. They never override or substitute statutory BSE/NSE filings.
          </span>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {errorMsg && (
            <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Quick Add Form */}
          {isAdding ? (
            <form onSubmit={handleAddMemory} className="p-3.5 rounded-xl border border-neutral-300 bg-neutral-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  Teach VERA a New Preference
                </span>
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="text-neutral-400 hover:text-neutral-600 text-xs"
                >
                  Cancel
                </button>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-neutral-600 mb-1">
                  What should VERA remember?
                </label>
                <textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="e.g., I prefer concise answers with practical examples and focus on ROCE > 20%."
                  rows={3}
                  className="w-full text-xs p-2.5 rounded-lg border border-neutral-300 bg-white text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-medium text-neutral-600 mb-1">Category</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-neutral-300 bg-white text-neutral-800"
                  >
                    <option value="preference">Preference</option>
                    <option value="financial_focus">Financial Focus</option>
                    <option value="project">Project / Portfolio</option>
                    <option value="risk_tolerance">Risk Tolerance</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-neutral-600 mb-1">Importance</label>
                  <select
                    value={newImportance}
                    onChange={(e) => setNewImportance(parseFloat(e.target.value))}
                    className="w-full text-xs p-2 rounded-lg border border-neutral-300 bg-white text-neutral-800"
                  >
                    <option value="0.95">Critical (0.95)</option>
                    <option value="0.8">High (0.80)</option>
                    <option value="0.5">Moderate (0.50)</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !newContent.trim()}
                className="w-full py-2 bg-neutral-900 text-white font-medium text-xs rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Embedding & Saving...
                  </>
                ) : (
                  'Save to Supabase'
                )}
              </button>
            </form>
          ) : (
            <button
              onClick={() => setIsAdding(true)}
              className="w-full py-2.5 px-3 border border-dashed border-neutral-300 rounded-xl text-neutral-600 hover:text-neutral-900 hover:border-neutral-400 text-xs font-medium flex items-center justify-center gap-2 bg-neutral-50/50 hover:bg-neutral-100/50 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Custom Memory or Investor Rule
            </button>
          )}

          {/* Memories List */}
          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center text-neutral-400 text-xs gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-neutral-500" />
              <span>Querying pgvector semantic memories...</span>
            </div>
          ) : userMemories.length === 0 ? (
            <div className="py-12 text-center text-neutral-500 space-y-2">
              <Brain className="w-8 h-8 text-neutral-300 mx-auto" />
              <p className="text-xs font-medium text-neutral-700">No stored memories yet</p>
              <p className="text-[11px] text-neutral-400 max-w-xs mx-auto">
                As you chat with VERA, preferences and context will be automatically extracted and indexed here, or you can add them above.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-[11px] text-neutral-500 px-1">
                <span>ACTIVE MEMORIES ({userMemories.length})</span>
                <span>EMBEDDING: 384-D</span>
              </div>
              {userMemories.map((m) => (
                <div
                  key={m.id}
                  className="p-3 rounded-xl border border-neutral-200 bg-white hover:border-neutral-300 shadow-2xs transition-all group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getTypeBadgeColor(m.memory_type)}`}>
                        {m.memory_type.replace('_', ' ').toUpperCase()}
                      </span>
                      <span className="text-[10px] text-neutral-400 font-mono">
                        {(m.importance * 100).toFixed(0)}% weight
                      </span>
                    </div>
                    <button
                      onClick={() => removeUserMemory(m.id)}
                      className="text-neutral-300 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                      title="Delete memory"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-xs text-neutral-800 leading-relaxed font-sans">{m.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-neutral-200 bg-neutral-50 text-[10px] text-neutral-400 flex items-center justify-between">
          <span>Connected to Supabase Cloud</span>
          <span className="font-mono">MiniLM-L12-v2</span>
        </div>
      </div>
    </div>
  );
};
