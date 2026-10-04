'use client';

import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="border-b border-neutral-200 bg-white/90 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="h-9 w-9 rounded-xl bg-neutral-900 flex items-center justify-center shadow-sm">
            <ShieldCheck className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-neutral-950">VERA</span>
              <span className="px-1.5 py-0.5 rounded bg-neutral-100 border border-neutral-300 text-neutral-800 text-[10px] font-mono uppercase tracking-wider font-semibold">
                AI Platform
              </span>
            </div>
            <p className="text-[11px] text-neutral-500 hidden sm:block">
              Autonomous Web Crawler & Fact Verification
            </p>
          </div>
        </div>

        {/* Live Multi-Source Crawler Status Indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-neutral-200 text-xs text-neutral-700 shadow-xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neutral-900 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-neutral-900" />
          </span>
          <span className="text-[11px] font-medium text-neutral-800 hidden md:inline">
            Crawling BSE • NSE • SEBI • Reddit • Media
          </span>
          <span className="text-[11px] font-medium text-neutral-800 md:hidden">
            Crawler Active
          </span>
        </div>
      </div>
    </header>
  );
};
