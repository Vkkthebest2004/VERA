import { create } from 'zustand';
import { useVisualizationStore } from './visualizationStore';
import { parseNaturalLanguageCommand } from '@/lib/visualization/commandParser';
import { GraphToChatContext } from '@/lib/visualization/chartDsl';

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
}

export interface ChatStoreState {
  messages: ChatMessage[];
  isTyping: boolean;
  activeSuggestions: string[];

  // Actions
  sendMessage: (text: string) => Promise<void>;
  addSystemMessage: (text: string) => void;
  clearMessages: () => void;
  setSuggestions: (suggestions: string[]) => void;
}

export const useChatStore = create<ChatStoreState>((set, get) => ({
  messages: [
    {
      id: 'welcome-1',
      sender: 'assistant',
      content:
        "Welcome! I am **Artha**, your financial companion on VERA.\n\nI can analyze financial statements, explain corporate actions, evaluate peer fundamentals, and control the visualization canvas. You can ask questions or give me natural-language instructions like:\n• *\"Show revenue and PAT\"*\n• *\"Compare PAT with Operating Cash Flow\"*\n• *\"Why is ROCE higher than ROE?\"*\n• *\"What changed between FY25 and FY26?\"*\n• *\"Make this easier to understand\"*",
      timestamp: Date.now(),
      suggestedFollowUps: [
        'Show Revenue + EBITDA + PAT trend',
        'Show Profit vs Operating Cash Flow',
        'What changed recently?',
        'Compare with peers',
      ],
    },
  ],
  isTyping: false,
  activeSuggestions: [
    'Show Profit vs Cash Flow',
    'What changed recently?',
    'Show Margins',
    'Compare with peers',
    'Make this easier',
  ],

  sendMessage: async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const vizStore = useVisualizationStore.getState();
    const currentRecord = vizStore.getCurrentCompanyRecord();

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

    // For general financial questions or conversational fallback, query live VERA API
    if (!parseResult.command || parseResult.matchedIntent === 'CONVERSATIONAL_FALLBACK') {
      try {
        const res = await fetch('http://127.0.0.1:8000/api/v1/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: trimmed,
            company_id: currentRecord.ticker,
            company_name: currentRecord.name,
            graph_context: graphContext,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data && data.response) {
            finalResponse = data.response;
            if (data.executed_command && !parseResult.command) {
              vizStore.executeCommand(data.executed_command);
            }
            if (data.suggested_follow_ups && data.suggested_follow_ups.length > 0) {
              followUps = data.suggested_follow_ups;
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
    };

    set((s) => ({
      messages: [...s.messages, assistantMsg],
      isTyping: false,
      activeSuggestions: followUps,
    }));
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
