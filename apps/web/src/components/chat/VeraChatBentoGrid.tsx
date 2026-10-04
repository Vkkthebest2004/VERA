'use client';

import React from 'react';
import {
  FileTextIcon,
  GlobeIcon,
  CalendarIcon,
  BellIcon,
  InputIcon,
} from '@radix-ui/react-icons';
import {
  ShieldCheck,
  TrendingUp,
  Scale,
  Sparkles,
  BarChart3,
  Layers,
} from 'lucide-react';
import { BentoCard, BentoGrid } from '@/components/ui/bento-grid';
import { CompanyData } from '@/data/mockCompanies';

interface VeraChatBentoGridProps {
  company: CompanyData;
  onSelectQuery: (query: string) => void;
  onOpenVisualizer?: () => void;
  onOpenEvidence?: () => void;
}

export const VeraChatBentoGrid: React.FC<VeraChatBentoGridProps> = ({
  company,
  onSelectQuery,
  onOpenVisualizer,
  onOpenEvidence,
}) => {
  const shortName = company.name.split(' ')[0];

  const chatBentoFeatures = [
    {
      Icon: Scale,
      name: 'Financial Health & Debt',
      description: `Analyze ${shortName}'s debt leverage, working capital cycle, and ROCE (${company.roce}%) vs ROE (${company.roe}%).`,
      cta: 'Analyze Balance Sheet',
      background: (
        <img
          src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80"
          alt="Financial health"
          className="absolute -right-16 -top-16 opacity-20 grayscale filter contrast-125 object-cover pointer-events-none transition-all duration-300 group-hover:scale-105 group-hover:opacity-30"
        />
      ),
      className: 'col-span-3 sm:col-span-2 row-span-1',
      query: `Does ${company.name} have heavy debt? Breakdown interest coverage and debt-to-equity ratio.`,
    },
    {
      Icon: ShieldCheck,
      name: 'SEBI LODR 30 Audit',
      description: `Cross-examine corporate actions, social forwards, and viral rumors against official BSE/NSE archives.`,
      cta: 'Audit Filings',
      background: (
        <img
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80"
          alt="Regulatory filings"
          className="absolute -right-16 -top-16 opacity-20 grayscale filter contrast-125 object-cover pointer-events-none transition-all duration-300 group-hover:scale-105 group-hover:opacity-30"
        />
      ),
      className: 'col-span-3 sm:col-span-1 row-span-1',
      query: `Verify official statutory filings and LODR Regulation 30 announcements for ${company.name}.`,
    },
    {
      Icon: GlobeIcon,
      name: 'Peer Benchmark',
      description: `Evaluate ${shortName}'s valuation (P/E ${company.pe}) against sector peers and industry multiples.`,
      cta: 'Compare Peers',
      background: (
        <img
          src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80"
          alt="Peer comparison"
          className="absolute -right-16 -top-16 opacity-20 grayscale filter contrast-125 object-cover pointer-events-none transition-all duration-300 group-hover:scale-105 group-hover:opacity-30"
        />
      ),
      className: 'col-span-3 sm:col-span-1 row-span-1',
      query: `Compare ${company.ticker} valuation, P/E multiples, and operating margins with top sector peers.`,
    },
    {
      Icon: Layers,
      name: 'Business Mix & Segments',
      description: `Breakdown core business lines, revenue drivers, and profit contributions across operating divisions.`,
      cta: 'Inspect Segments',
      background: (
        <img
          src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80"
          alt="Business mix"
          className="absolute -right-16 -top-16 opacity-20 grayscale filter contrast-125 object-cover pointer-events-none transition-all duration-300 group-hover:scale-105 group-hover:opacity-30"
        />
      ),
      className: 'col-span-3 sm:col-span-2 row-span-1',
      query: `Explain ${company.name}'s business model, revenue segment contributions, and growth outlook.`,
    },
  ];

  return (
    <div className="space-y-3 pt-2">
      <div className="flex items-center justify-between text-[11px] text-neutral-400 font-medium">
        <span className="flex items-center gap-1.5 uppercase tracking-wider text-[10px] font-semibold text-neutral-500">
          <span className="w-1.5 h-1.5 rounded-full bg-neutral-900" />
          Reasoning Explorations
        </span>
        <span className="font-mono text-[10px] text-neutral-400">Click card to launch prompt</span>
      </div>

      <div className="grid grid-cols-3 gap-3 auto-rows-[11.5rem]">
        {chatBentoFeatures.map((feat) => (
          <BentoCard
            key={feat.name}
            name={feat.name}
            className={feat.className}
            background={feat.background}
            Icon={feat.Icon}
            description={feat.description}
            cta={feat.cta}
            onClick={() => onSelectQuery(feat.query)}
          />
        ))}
      </div>
    </div>
  );
};
