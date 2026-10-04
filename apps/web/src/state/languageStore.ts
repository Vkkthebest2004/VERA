import { create } from 'zustand';
import {
  INDIAN_LANGUAGES,
  TRANSLATIONS,
  LanguageInfo,
  TranslationDictionary,
  getLanguageInfo,
  getTranslations,
} from '@/lib/i18n/languages';

interface LanguageStoreState {
  currentLanguage: string;
  setLanguage: (code: string) => void;
  getLanguageInfo: (code?: string) => LanguageInfo;
  getTranslations: (code?: string) => TranslationDictionary;
  t: <K extends keyof TranslationDictionary>(key: K) => TranslationDictionary[K];
}

const STORAGE_KEY = 'vera_selected_indian_language';

const getInitialLanguage = (): string => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && TRANSLATIONS[saved]) return saved;
  }
  return 'en';
};

export const useLanguageStore = create<LanguageStoreState>((set, get) => ({
  currentLanguage: getInitialLanguage(),

  setLanguage: (code: string) => {
    if (!TRANSLATIONS[code]) return;
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, code);
    }
    set({ currentLanguage: code });
  },

  getLanguageInfo: (code?: string) => {
    return getLanguageInfo(code || get().currentLanguage);
  },

  getTranslations: (code?: string) => {
    return getTranslations(code || get().currentLanguage);
  },

  t: <K extends keyof TranslationDictionary>(key: K): TranslationDictionary[K] => {
    const dict = getTranslations(get().currentLanguage);
    if (dict && dict[key] !== undefined) {
      return dict[key];
    }
    return TRANSLATIONS.en[key];
  },
}));
