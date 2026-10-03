'use client';

import React, { useState, useEffect } from 'react';
import {
  Building2,
  Landmark,
  Scale,
  FileCheck2,
  Globe,
  Newspaper,
  FileText,
  ShieldCheck,
} from 'lucide-react';

interface SourceNode {
  id: string;
  name: string;
  shortName: string;
  domain: string;
  icon: React.ComponentType<{ className?: string }>;
}

const SOURCES: SourceNode[] = [
  {
    id: 'nse',
    name: 'National Stock Exchange (NEAPS & Reg 30)',
    shortName: 'NSE India',
    domain: 'nseindia.com',
    icon: Building2,
  },
  {
    id: 'bse',
    name: 'Bombay Stock Exchange (Corporate Filings)',
    shortName: 'BSE India',
    domain: 'bseindia.com',
    icon: Landmark,
  },
  {
    id: 'sebi',
    name: 'Securities and Exchange Board of India',
    shortName: 'SEBI Gazette',
    domain: 'sebi.gov.in',
    icon: Scale,
  },
  {
    id: 'sec',
    name: 'US SEC EDGAR (10-K / 8-K Regulatory Filings)',
    shortName: 'SEC EDGAR',
    domain: 'sec.gov',
    icon: ShieldCheck,
  },
  {
    id: 'mca',
    name: 'Ministry of Corporate Affairs (Statutory Registry)',
    shortName: 'MCA Filings',
    domain: 'mca.gov.in',
    icon: FileCheck2,
  },
  {
    id: 'reuters',
    name: 'Reuters Financial News Wire',
    shortName: 'Reuters Wire',
    domain: 'reuters.com',
    icon: Globe,
  },
  {
    id: 'bloomberg',
    name: 'Bloomberg Institutional Financial Reporting',
    shortName: 'Bloomberg Markets',
    domain: 'bloomberg.com',
    icon: Newspaper,
  },
  {
    id: 'livemint',
    name: 'Mint Corporate Filings & Regulatory Reporting',
    shortName: 'Mint / ET Wire',
    domain: 'livemint.com',
    icon: FileText,
  },
];

export const CrawlerAnimationScreen: React.FC = () => {
  const [activeSourceIndex, setActiveSourceIndex] = useState<number>(0);

  // Smoothly cycle through sources to show dynamic surfing
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSourceIndex((prev) => (prev + 1) % SOURCES.length);
    }, 1100);
    return () => clearInterval(interval);
  }, []);

  const activeSource = SOURCES[activeSourceIndex];
  const ActiveIcon = activeSource.icon;

  return (
    <div className="relative rounded-3xl border border-neutral-200 bg-white p-8 sm:p-14 overflow-hidden shadow-sm flex flex-col items-center justify-center min-h-[460px] animate-in fade-in duration-500">
      {/* Ambient background daylight glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-neutral-100 rounded-full blur-[80px] pointer-events-none" />

      {/* 📡 Central Radar / Web Surfing Nexus */}
      <div className="relative w-64 h-64 flex items-center justify-center mb-8">
        {/* Concentric radar rings */}
        <div className="absolute inset-0 rounded-full border border-neutral-200" />
        <div className="absolute inset-8 rounded-full border border-neutral-200" />
        <div className="absolute inset-16 rounded-full border border-neutral-200" />

        {/* Pulsing ripple wave */}
        <div className="absolute inset-4 rounded-full border-2 border-neutral-400/30 animate-ripple pointer-events-none" />
        <div className="absolute inset-10 rounded-full border border-neutral-400/20 animate-ripple pointer-events-none" style={{ animationDelay: '1.2s' }} />

        {/* Rotating radar sweep gradient */}
        <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none animate-radar-sweep opacity-40">
          <div
            className="w-full h-full"
            style={{
              background: 'conic-gradient(from 0deg, transparent 0deg, transparent 270deg, rgba(0, 0, 0, 0.12) 360deg)',
            }}
          />
        </div>

        {/* Central Core with Current Source Active Icon */}
        <div className="relative z-10 p-5 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-md flex flex-col items-center justify-center transition-all duration-300 transform scale-105 animate-float-gentle text-white">
          <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 shadow-inner">
            <ActiveIcon className="w-8 h-8 text-white transition-all duration-300" />
          </div>
        </div>

        {/* Orbiting Source Node Badges */}
        {SOURCES.map((source, index) => {
          const total = SOURCES.length;
          // Calculate angle for circular distribution
          const angle = (index * (360 / total) - 90) * (Math.PI / 180);
          const radius = 115; // px from center
          const x = Math.round(radius * Math.cos(angle));
          const y = Math.round(radius * Math.sin(angle));
          const isCurrent = index === activeSourceIndex;
          const NodeIcon = source.icon;

          return (
            <div
              key={source.id}
              className={`absolute flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-500 cursor-default ${
                isCurrent
                  ? 'bg-neutral-950 border border-neutral-900 shadow-md scale-125 z-20 text-white'
                  : 'bg-white border border-neutral-200 text-neutral-400 opacity-60 scale-95 shadow-2xs'
              }`}
              style={{
                transform: `translate(${x}px, ${y}px)`,
              }}
              title={source.name}
            >
              <NodeIcon className={`w-4 h-4 ${isCurrent ? 'text-white' : 'text-neutral-500'}`} />
            </div>
          );
        })}
      </div>

      {/* Minimalist Status Footer */}
      <div className="text-center space-y-3 z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-xs text-neutral-700">
          <span className="w-2 h-2 rounded-full bg-neutral-900 animate-ping" />
          <span className="font-semibold text-neutral-900 tracking-wide">SearXNG & Crawl4AI Scraper</span>
        </div>

        {/* Source Switcher Badge */}
        <div className="flex items-center justify-center gap-2 transition-all duration-300">
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-neutral-50 border border-neutral-200 shadow-2xs">
            <ActiveIcon className="w-4 h-4 text-neutral-900" />
            <span className="text-xs font-bold text-neutral-900">{activeSource.shortName}</span>
            <span className="text-[10px] font-mono text-neutral-500">({activeSource.domain})</span>
          </div>
        </div>

        <p className="text-xs text-neutral-500 font-sans max-w-md mx-auto pt-1">
          SearXNG multi-engine retrieval → Crawl4AI asynchronous scraper → normalized evidence & credibility grading.
        </p>
      </div>
    </div>
  );
};
