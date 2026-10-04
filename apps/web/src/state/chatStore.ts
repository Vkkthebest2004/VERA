import { create } from 'zustand';
import { useVisualizationStore } from './visualizationStore';
import { parseNaturalLanguageCommand } from '@/lib/visualization/commandParser';
import { GraphToChatContext } from '@/lib/visualization/chartDsl';
import { getAuthHeaders, fetchUserMemories, deleteUserMemory, UserMemoryItem } from '@/lib/supabase';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  graphContext?: GraphToChatContext;
  executedCommandAction?: string;
  suggestedFollowUps?: string[];
  evidenceRef?: {
    title: string;
    filingType: string;
    url?: string;
  };
  citations?: Array<{ title: string; domain: string; url: string; source: string }>;
  marketSnapshot?: Record<string, any>;
}

export interface ChatStoreState {
  conversationId: string | null;
  messages: ChatMessage[];
  isTyping: boolean;
  activeSuggestions: string[];
  userMemories: UserMemoryItem[];
  isMemoryDrawerOpen: boolean;

  // Actions
  sendMessage: (text: string) => Promise<void>;
  addSystemMessage: (text: string) => void;
  clearMessages: () => void;
  startNewConversation: () => void;
  setSuggestions: (suggestions: string[]) => void;
  setMemoryDrawerOpen: (open: boolean) => void;
  loadUserMemories: () => Promise<void>;
  removeUserMemory: (memoryId: string) => Promise<void>;
}

const DEFAULT_WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome-1',
  sender: 'assistant',
  content:
    "Welcome! I am **Artha**, your conversational financial intelligence companion on VERA.\n\nI am connected to Supabase pgvector long-term memory to personalize explanations to your investor profile while anchoring all financial data to verified BSE/NSE filings.\n\nTry asking:\n• *\"Should I invest in this company?\"*\n• *\"Explain ROCE vs ROE like I'm 15\"*\n• *\"Show Profit vs Operating Cash Flow\"*\n• *\"How does this business make money?\"*",
  timestamp: Date.now(),
  suggestedFollowUps: [
    'Should I invest in this company?',
    "Explain ROCE vs ROE like I'm 15",
    'Show Profit vs Cash Flow',
    'What does this company do?',
  ],
};

export const useChatStore = create<ChatStoreState>((set, get) => ({
  conversationId: null,
  messages: [DEFAULT_WELCOME_MESSAGE],
  isTyping: false,
  activeSuggestions: [
    'Should I invest in this company?',
    "Explain ROCE vs ROE like I'm 15",
    'Show Profit vs Cash Flow',
    'What does this company do?',
    "I'm a beginner — where should I start?",
  ],
  userMemories: [],
  isMemoryDrawerOpen: false,

  setMemoryDrawerOpen: (open: boolean) => set({ isMemoryDrawerOpen: open }),

  loadUserMemories: async () => {
    const memories = await fetchUserMemories();
    set({ userMemories: memories });
  },

  removeUserMemory: async (memoryId: string) => {
    const ok = await deleteUserMemory(memoryId);
    if (ok) {
      set((s) => ({
        userMemories: s.userMemories.filter((m) => m.id !== memoryId),
      }));
    }
  },

  startNewConversation: () => {
    set({
      conversationId: null,
      messages: [{ ...DEFAULT_WELCOME_MESSAGE, timestamp: Date.now() }],
      isTyping: false,
    });
  },

  sendMessage: async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const vizStore = useVisualizationStore.getState();
    const currentRecord = vizStore.getCurrentCompanyRecord();
    const currentConvId = get().conversationId;

    // Snapshot graph context at the exact moment user sent message
    const graphContext: GraphToChatContext = {
      activeChartId: vizStore.activeChartId,
      chartTitle: vizStore.activeChartId.replace('-', ' ').toUpperCase(),
      selectedEntity: vizStore.selectedCompany,
      selectedPeriod: vizStore.timeRange,
      activeSeries: vizStore.activeSeries,
      selectedPoint: vizStore.selectedPoint,
      selectedSegment: vizStore.selectedSegment,
      selectedPeers: vizStore.selectedPeers,
      isSimplified: vizStore.isSimplified,
      displayMode: vizStore.displayMode,
      comparisonMode: vizStore.comparisonMode,
      comparisonPeriods: vizStore.comparisonYears,
      recentInteraction: vizStore.selectedPoint
        ? `Clicked ${vizStore.selectedPoint.metric} at ${vizStore.selectedPoint.period}`
        : 'Viewing chart overview',
    };

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      sender: 'user',
      content: trimmed,
      timestamp: Date.now(),
      graphContext,
    };

    // Append user message immediately
    set((s) => ({
      messages: [...s.messages, userMsg],
      isTyping: true,
    }));

    // Parse natural language command into safe typed DSL
    const parseResult = parseNaturalLanguageCommand(trimmed, vizStore);

    // Execute chart command if recognized
    if (parseResult.command) {
      vizStore.executeCommand(parseResult.command);
    }

    let finalResponse = parseResult.assistantResponse;
    let followUps = parseResult.suggestedFollowUps;
    let citations: Array<{ title: string; domain: string; url: string; source: string }> | undefined;
    let marketSnapshot: Record<string, any> | undefined;

    // For general financial questions or conversational fallback, query live VERA API
    if (!parseResult.command || parseResult.matchedIntent === 'CONVERSATIONAL_FALLBACK') {
      try {
        const authHeaders = await getAuthHeaders();
        const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const res = await fetch(`${apiBase}/api/v1/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...authHeaders,
          },
          body: JSON.stringify({
            message: trimmed,
            conversation_id: currentConvId,
            company_id: currentRecord.ticker,
            company_name: currentRecord.name,
            graph_context: graphContext,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data) {
            if (data.conversation_id) {
              set({ conversationId: data.conversation_id });
            }
            if (data.response) {
              finalResponse = data.response;
            }
            if (data.executed_command && !parseResult.command) {
              vizStore.executeCommand(data.executed_command);
            }
            if (data.suggested_follow_ups && data.suggested_follow_ups.length > 0) {
              followUps = data.suggested_follow_ups;
            }
            if (data.citations && data.citations.length > 0) {
              citations = data.citations;
            }
            if (data.market_intelligence && data.market_intelligence.market_snapshot) {
              marketSnapshot = data.market_intelligence.market_snapshot;
            }
          }
        }
      } catch {
        // Fall back gracefully to local deterministic VERA engine
      }
    } else {
      // Simulate slight natural latency for chart control response
      await new Promise((resolve) => setTimeout(resolve, 300));
    }

    const assistantMsg: ChatMessage = {
      id: `msg-${Date.now()}-assistant`,
      sender: 'assistant',
      content: finalResponse,
      timestamp: Date.now(),
      executedCommandAction: parseResult.command?.action,
      suggestedFollowUps: followUps,
      evidenceRef: {
        title: `${currentRecord.name} Annual Report & SEBI LODR Filings`,
        filingType: 'BSE / NSE Verified Disclosures',
      },
      citations,
      marketSnapshot,
    };

    set((s) => ({
      messages: [...s.messages, assistantMsg],
      isTyping: false,
      activeSuggestions: followUps,
    }));

    // Trigger a light refresh of user memories in background
    get().loadUserMemories().catch(() => {});
  },

  addSystemMessage: (text: string) => {
    set((s) => ({
      messages: [
        ...s.messages,
        {
          id: `sys-${Date.now()}`,
          sender: 'system',
          content: text,
          timestamp: Date.now(),
        },
      ],
    }));
  },

  clearMessages: () => {
    set({ messages: [] });
  },

  setSuggestions: (activeSuggestions) => {
    set({ activeSuggestions });
  },
}));
