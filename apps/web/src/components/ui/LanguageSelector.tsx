'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Globe, Check, Search, X } from 'lucide-react';
import { useLanguageStore } from '@/state/languageStore';
import { INDIAN_LANGUAGES } from '@/lib/i18n/languages';

interface LanguageSelectorProps {
  variant?: 'pill' | 'navbar' | 'compact';
  className?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  variant = 'pill',
  className = '',
}) => {
  const { currentLanguage, setLanguage, getLanguageInfo, t } = useLanguageStore();
  const [isOpen, setIsOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeLang = getLanguageInfo();

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Filter languages by search query
  const filteredLanguages = useMemo(() => {
    const q = searchFilter.trim().toLowerCase();
    if (!q) return INDIAN_LANGUAGES;
    return INDIAN_LANGUAGES.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.nativeName.toLowerCase().includes(q) ||
        l.region.toLowerCase().includes(q)
    );
  }, [searchFilter]);

  const handleSelectLanguage = (code: string) => {
    setLanguage(code);
    setIsOpen(false);
    setSearchFilter('');
  };

  return (
    <div ref={dropdownRef} className={`relative inline-block text-left ${className}`}>
      {/* Trigger Button */}
      {variant === 'navbar' ? (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-neutral-200 hover:border-neutral-400 bg-white hover:bg-neutral-50 text-neutral-800 text-xs font-semibold transition-all cursor-pointer shadow-2xs"
          title={t('changeLanguage')}
        >
          <Globe className="w-3.5 h-3.5 text-neutral-600" />
          <span className="font-sans font-bold text-neutral-900">{activeLang.nativeName}</span>
          <span className="text-[10px] text-neutral-400 uppercase font-mono hidden sm:inline">
            ({activeLang.code})
          </span>
        </button>
      ) : variant === 'compact' ? (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold border border-neutral-200 bg-white hover:bg-neutral-100 text-neutral-800 cursor-pointer shadow-2xs"
          title={t('changeLanguage')}
        >
          <Globe className="w-3 h-3 text-neutral-500" />
          <span>{activeLang.nativeName}</span>
        </button>
      ) : (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-neutral-300 hover:border-neutral-900 bg-white hover:bg-neutral-50 text-neutral-800 text-xs font-semibold transition-all cursor-pointer shadow-2xs group"
          title={t('changeLanguage')}
        >
          <Globe className="w-3.5 h-3.5 text-neutral-600 group-hover:rotate-12 transition-transform" />
          <span className="font-sans font-bold text-neutral-900">{activeLang.nativeName}</span>
          <span className="text-neutral-400 font-normal">|</span>
          <span className="text-neutral-500 text-[11px] font-medium">{activeLang.name}</span>
          <span className="px-1.5 py-0.2 rounded-full bg-neutral-100 text-[10px] text-neutral-600 font-mono">
            20+ Indian
          </span>
        </button>
      )}

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-72 sm:w-84 max-h-[460px] bg-white rounded-2xl border border-neutral-200 shadow-2xl z-50 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-100">
          {/* Header & Search */}
          <div className="p-3 border-b border-neutral-100 bg-neutral-50/90 space-y-2 shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-neutral-700" />
                <span className="text-xs font-bold text-neutral-900 font-sans">
                  {t('languageSelectTitle')}
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-md text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200/50 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Language Search Input */}
            <div className="relative flex items-center bg-white rounded-xl border border-neutral-200 px-2.5 py-1.5 shadow-2xs">
              <Search className="w-3.5 h-3.5 text-neutral-400 shrink-0 mr-1.5" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder={t('searchLanguages')}
                className="w-full text-xs text-neutral-900 placeholder-neutral-400 focus:outline-hidden bg-transparent"
                autoFocus
              />
              {searchFilter && (
                <button
                  onClick={() => setSearchFilter('')}
                  className="text-neutral-400 hover:text-neutral-600 text-xs p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Languages List */}
          <div className="overflow-y-auto divide-y divide-neutral-100 p-1 flex-1 max-h-[340px]">
            {filteredLanguages.length > 0 ? (
              filteredLanguages.map((lang) => {
                const isSelected = lang.code === currentLanguage;
                return (
                  <button
                    key={lang.code}
                    onClick={() => handleSelectLanguage(lang.code)}
                    className={`w-full text-left p-2.5 rounded-xl flex items-center justify-between gap-3 transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-neutral-900 text-white shadow-2xs font-semibold'
                        : 'hover:bg-neutral-100/80 text-neutral-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`text-sm font-bold font-sans ${
                          isSelected ? 'text-white' : 'text-neutral-950'
                        }`}
                      >
                        {lang.nativeName}
                      </span>
                      <span
                        className={`text-xs ${
                          isSelected ? 'text-neutral-300' : 'text-neutral-500'
                        }`}
                      >
                        {lang.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                          isSelected
                            ? 'bg-neutral-800 text-neutral-300'
                            : 'bg-neutral-100 text-neutral-500'
                        }`}
                      >
                        {lang.region.split(',')[0]}
                      </span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="p-4 text-center text-xs text-neutral-400">
                No languages match &ldquo;{searchFilter}&rdquo;
              </div>
            )}
          </div>

          {/* Footer Note */}
          <div className="p-2 border-t border-neutral-100 bg-neutral-50 text-[10px] text-neutral-500 text-center font-mono shrink-0">
            20 Official Indian Languages • Real-time UI &amp; Chatbot
          </div>
        </div>
      )}
    </div>
  );
};
