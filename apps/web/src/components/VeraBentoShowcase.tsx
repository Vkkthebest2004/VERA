'use client';

import React from 'react';
import {
  FileTextIcon,
  InputIcon,
  GlobeIcon,
  CalendarIcon,
  BellIcon,
} from '@radix-ui/react-icons';
import {
  ShieldCheck,
  Sparkles,
  BarChart3,
  FileSpreadsheet,
  Search,
} from 'lucide-react';
import { BentoCard, BentoGrid } from '@/components/ui/bento-grid';

interface VeraBentoShowcaseProps {
  onNavigateToVisualizer?: () => void;
  onOpenChat?: () => void;
  onOpenEvidence?: () => void;
  onOpenIngestion?: () => void;
}

export const VeraBentoShowcase: React.FC<VeraBentoShowcaseProps> = ({
  onNavigateToVisualizer,
  onOpenChat,
  onOpenEvidence,
  onOpenIngestion,
}) => {
  const veraFeatures = [
    {
      Icon: Sparkles,
      name: 'Artha — Financial Copilot',
      description:
        'Custom-trained Qwen 3.4B reasoning engine analyzing balance sheets, valuation multiples, and quarterly trends in natural language.',
      href: '#artha',
      cta: 'Explore Artha',
      background: (
        <img
          src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80"
          alt="AI reasoning abstract"
          className="absolute -right-20 -top-20 opacity-20 grayscale filter contrast-125 object-cover pointer-events-none transition-all duration-300 group-hover:scale-105 group-hover:opacity-30"
        />
      ),
      className: 'lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-3',
      onClick: onOpenChat,
    },
    {
      Icon: ShieldCheck,
      name: 'SEBI Evidence Verification',
      description:
        'Continuous audit engine cross-referencing viral market rumors and social forwards against BSE/NSE Regulation 30 archives.',
      href: '#evidence',
      cta: 'Audit Rumors',
      background: (
        <img
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80"
          alt="Regulatory architecture"
          className="absolute -right-20 -top-20 opacity-20 grayscale filter contrast-125 object-cover pointer-events-none transition-all duration-300 group-hover:scale-105 group-hover:opacity-30"
        />
      ),
      className: 'lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3',
      onClick: onOpenEvidence,
    },
    {
      Icon: FileSpreadsheet,
      name: 'Multimodal Ingestion Studio',
      description:
        'Extract audited tables, annual report disclosures, and exchange notifications with zero-shot tabular OCR.',
      href: '#ingestion',
      cta: 'Ingest Documents',
      background: (
        <img
          src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80"
          alt="Data ingestion analytics"
          className="absolute -right-20 -top-20 opacity-20 grayscale filter contrast-125 object-cover pointer-events-none transition-all duration-300 group-hover:scale-105 group-hover:opacity-30"
        />
      ),
      className: 'lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4',
      onClick: onOpenIngestion,
    },
    {
      Icon: BarChart3,
      name: 'Conversational Visualizer',
      description:
        '12 interactive ECharts (Segment Treemap, DuPont ROE, FCF, Debt Health) controlled by prompt instructions.',
      href: '#visualizer',
      cta: 'Launch Canvas',
      background: (
        <img
          src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80"
          alt="Global network charts"
          className="absolute -right-20 -top-20 opacity-20 grayscale filter contrast-125 object-cover pointer-events-none transition-all duration-300 group-hover:scale-105 group-hover:opacity-30"
        />
      ),
      className: 'lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2',
      onClick: onNavigateToVisualizer,
    },
    {
      Icon: BellIcon,
      name: 'Continuous Regulatory Alerts',
      description:
        'Autonomous monitoring of corporate announcements, insider trades, and statutory board resolutions under SEBI LODR 33.',
      href: '#alerts',
      cta: 'View Pipeline',
      background: (
        <img
          src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80"
          alt="Regulatory alerts"
          className="absolute -right-20 -top-20 opacity-20 grayscale filter contrast-125 object-cover pointer-events-none transition-all duration-300 group-hover:scale-105 group-hover:opacity-30"
        />
      ),
      className: 'lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-4',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="space-y-1 border-b border-neutral-200 pb-5">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-neutral-900" />
          <span className="text-xs font-mono uppercase tracking-widest text-neutral-500 font-semibold">
            Architectural Overview
          </span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-neutral-950">
          VERA Intelligence & Statutory Evidence Engine
        </h2>
        <p className="text-xs text-neutral-500 max-w-2xl leading-relaxed">
          Designed with a monochrome, high-contrast Bento Grid system. Direct access to conversational financial reasoning, exchange verification, and multimodal document intelligence.
        </p>
      </div>

      <BentoGrid className="lg:grid-rows-3">
        {veraFeatures.map((feature) => (
          <BentoCard
            key={feature.name}
            name={feature.name}
            className={feature.className}
            background={feature.background}
            Icon={feature.Icon}
            description={feature.description}
            href={feature.href}
            cta={feature.cta}
          />
        ))}
      </BentoGrid>
    </div>
  );
};
