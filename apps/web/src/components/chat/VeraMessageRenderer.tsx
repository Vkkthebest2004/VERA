'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Copy,
  Check,
  FileText,
  AlertOctagon,
  ExternalLink,
} from 'lucide-react';

interface VeraMessageRendererProps {
  content: string;
  isUser: boolean;
  className?: string;
  onOpenVisualizer?: () => void;
  onCitationClick?: (citationId: string) => void;
}

/**
 * Clean institutional message renderer for VERA.
 * Formats headings, financial citations [1], statutory cards,
 * tables, formulas, and analyst notes with high signal-to-noise ratio.
 */
export const VeraMessageRenderer: React.FC<VeraMessageRendererProps> = ({
  content,
  isUser,
  className = '',
  onOpenVisualizer,
  onCitationClick,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isUser) {
    return (
      <div className={`text-xs leading-relaxed text-white whitespace-pre-wrap font-normal ${className}`}>
        {content}
      </div>
    );
  }

  // Parse structured blocks from content
  const blocks = parseContentBlocks(content);

  return (
    <div className={`space-y-3 text-xs text-neutral-800 leading-relaxed group/renderer relative ${className}`}>
      {/* Subtle Top Copy Toolbar on Hover */}
      <div className="absolute right-0 -top-1 opacity-0 group-hover/renderer:opacity-100 transition-opacity">
        <button
          onClick={handleCopy}
          className="p-1 rounded bg-neutral-100 hover:bg-neutral-200 text-neutral-500 hover:text-neutral-800 flex items-center gap-1 text-[10px] transition-colors"
          title="Copy response"
        >
          {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>

      {/* Render Parsed Blocks */}
      {blocks.map((block, idx) => (
        <BlockRenderer
          key={idx}
          block={block}
          onOpenVisualizer={onOpenVisualizer}
          onCitationClick={onCitationClick}
        />
      ))}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Block Types & Parser
// ─────────────────────────────────────────────────────────────────────────────

type BlockType =
  | 'verdict_banner'
  | 'heading_1'
  | 'heading_2'
  | 'heading_3'
  | 'table'
  | 'formula_box'
  | 'insight_callout'
  | 'warning_callout'
  | 'statutory_card'
  | 'sources_block'
  | 'numbered_list'
  | 'bullet_list'
  | 'paragraph';

interface ContentBlock {
  type: BlockType;
  title?: string;
  content: string;
  data?: any;
}

function parseContentBlocks(raw: string): ContentBlock[] {
  const blocks: ContentBlock[] = [];
  const lines = raw.split('\n');
  let i = 0;

  while (i < lines.length) {
    const line = lines[i].trim();

    if (!line) {
      i++;
      continue;
    }

    // 1. Verdict Banner: **VERDICT:** [VERDICT] - [Headline]
    if (line.startsWith('**VERDICT:**') || line.startsWith('VERDICT:')) {
      const match = line.replace(/^\*\*VERDICT:\*\*\s*|^VERDICT:\s*/i, '');
      const parts = match.split(' - ');
      const verdict = parts[0]?.trim() || 'UNSUBSTANTIATED_SPECULATION';
      const headline = parts.slice(1).join(' - ').replace(/\*\*/g, '').trim() || '';

      blocks.push({
        type: 'verdict_banner',
        title: verdict,
        content: headline,
      });
      i++;
      continue;
    }

    // 2. Heading 3: ### Heading
    if (line.startsWith('### ')) {
      blocks.push({
        type: 'heading_3',
        content: line.replace('### ', '').trim(),
      });
      i++;
      continue;
    }

    // 3. Heading 2: ## Heading
    if (line.startsWith('## ')) {
      blocks.push({
        type: 'heading_2',
        content: line.replace('## ', '').trim(),
      });
      i++;
      continue;
    }

    // 4. Sources Line: Starts with Sources: or Sources
    if (/^sources:?/i.test(line)) {
      blocks.push({
        type: 'sources_block',
        content: line.replace(/^sources:?\s*/i, '').trim(),
      });
      i++;
      continue;
    }

    // 5. Markdown Table: Starts with | ... |
    if (line.startsWith('|') && line.endsWith('|')) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('|') && lines[i].trim().endsWith('|')) {
        tableLines.push(lines[i].trim());
        i++;
      }
      blocks.push({
        type: 'table',
        content: tableLines.join('\n'),
      });
      continue;
    }

    // 6. Formula Block: $$ ... $$
    if (line.startsWith('$$') && line.endsWith('$$') && line.length > 4) {
      blocks.push({
        type: 'formula_box',
        content: line.slice(2, -2).trim(),
      });
      i++;
      continue;
    }

    // 7. Section Cards for Statutory Claims
    if (line.startsWith('**THE REALITY:**')) {
      const cardLines = [line.replace('**THE REALITY:**', '').trim()];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('**') && !lines[i].trim().startsWith('###')) {
        if (lines[i].trim()) cardLines.push(lines[i].trim());
        i++;
      }
      blocks.push({
        type: 'statutory_card',
        title: 'Verified Factual Reality',
        content: cardLines.filter(Boolean).join('\n'),
        data: { variant: 'reality' },
      });
      continue;
    }

    if (line.startsWith('**BASIS OF STATUTORY REGULATION:**') || line.startsWith('**BASIS OF DENIAL:**')) {
      const cardLines = [line.replace(/\*\*BASIS OF.*?\*\*/, '').trim()];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('**') && !lines[i].trim().startsWith('###')) {
        if (lines[i].trim()) cardLines.push(lines[i].trim());
        i++;
      }
      blocks.push({
        type: 'statutory_card',
        title: 'Statutory Authority',
        content: cardLines.filter(Boolean).join('\n'),
        data: { variant: 'regulation' },
      });
      continue;
    }

    if (line.startsWith('**INVESTOR PROTECTION & REDRESSAL:**') || line.startsWith('**INVESTOR PROTECTION GUIDANCE:**')) {
      const cardLines = [line.replace(/\*\*INVESTOR PROTECTION.*?\*\*/, '').trim()];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('**') && !lines[i].trim().startsWith('###')) {
        if (lines[i].trim()) cardLines.push(lines[i].trim());
        i++;
      }
      blocks.push({
        type: 'statutory_card',
        title: 'Investor Redressal',
        content: cardLines.filter(Boolean).join('\n'),
        data: { variant: 'protection' },
      });
      continue;
    }

    // 8. Key Analytical Takeaway Callout Boxes
    if (
      line.startsWith('**Crucial Insight') ||
      line.startsWith('**Golden Rule') ||
      line.startsWith('**Why Retail Investors Must Watch') ||
      line.startsWith('**Strategic Takeaway') ||
      line.startsWith('**Key Insight') ||
      line.startsWith('**Why this matters')
    ) {
      const calloutLines = [line];
      i++;
      while (i < lines.length && lines[i].trim() && !lines[i].trim().startsWith('###') && !lines[i].trim().startsWith('**')) {
        calloutLines.push(lines[i].trim());
        i++;
      }
      blocks.push({
        type: 'insight_callout',
        content: calloutLines.join('\n'),
      });
      continue;
    }

    // 9. Warning / Risk Callout Boxes
    if (
      line.startsWith('**Caution') ||
      line.startsWith('**Warning') ||
      line.startsWith('**The Divergence Warning Sign') ||
      line.startsWith('**Key Fundamental Risks')
    ) {
      const calloutLines = [line];
      i++;
      while (i < lines.length && lines[i].trim() && !lines[i].trim().startsWith('###')) {
        calloutLines.push(lines[i].trim());
        i++;
      }
      blocks.push({
        type: 'warning_callout',
        content: calloutLines.join('\n'),
      });
      continue;
    }

    // 10. Standard Paragraph or Multi-line text
    const paraLines = [line];
    i++;
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].trim().startsWith('###') &&
      !lines[i].trim().startsWith('|') &&
      !lines[i].trim().startsWith('$$') &&
      !/^sources:?/i.test(lines[i].trim())
    ) {
      paraLines.push(lines[i].trim());
      i++;
    }
    blocks.push({
      type: 'paragraph',
      content: paraLines.join('\n'),
    });
  }

  return blocks;
}

// ─────────────────────────────────────────────────────────────────────────────
// Individual Block Renderers (Institutional Financial Style)
// ─────────────────────────────────────────────────────────────────────────────

const BlockRenderer: React.FC<{
  block: ContentBlock;
  onOpenVisualizer?: () => void;
  onCitationClick?: (citationId: string) => void;
}> = ({ block, onOpenVisualizer, onCitationClick }) => {
  switch (block.type) {
    case 'verdict_banner': {
      const v = block.title || '';
      const isConfirmed = v.includes('CONFIRMED');
      const isExaggerated = v.includes('MISLEADING') || v.includes('EXAGGERATED');
      const isFake = v.includes('DEBUNKED') || v.includes('FAKE');

      let badgeBg = 'bg-neutral-100 text-neutral-800 border-neutral-300';
      let icon = <HelpCircle className="w-3.5 h-3.5 text-neutral-500 shrink-0" />;
      let borderStyle = 'border-neutral-200 bg-neutral-50/70';

      if (isConfirmed) {
        badgeBg = 'bg-emerald-50 text-emerald-800 border-emerald-300';
        icon = <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />;
        borderStyle = 'border-emerald-200 bg-emerald-50/40';
      } else if (isExaggerated) {
        badgeBg = 'bg-amber-50 text-amber-800 border-amber-300';
        icon = <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />;
        borderStyle = 'border-amber-200 bg-amber-50/40';
      } else if (isFake) {
        badgeBg = 'bg-rose-50 text-rose-800 border-rose-300';
        icon = <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />;
        borderStyle = 'border-rose-200 bg-rose-50/40';
      }

      return (
        <div className={`p-3 rounded-lg border ${borderStyle} space-y-1`}>
          <div className="flex items-center gap-2">
            {icon}
            <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold border uppercase tracking-wider ${badgeBg}`}>
              {v.replace(/_/g, ' ')}
            </span>
          </div>
          {block.content && (
            <h4 className="font-semibold text-xs text-neutral-900 leading-snug pl-5.5">
              {block.content}
            </h4>
          )}
        </div>
      );
    }

    case 'heading_2':
    case 'heading_3': {
      return (
        <div className="pt-2 pb-0.5 mb-1">
          <h3 className="font-bold text-sm text-neutral-950 tracking-tight">
            {block.content}
          </h3>
        </div>
      );
    }

    case 'sources_block': {
      return (
        <div className="mt-2.5 pt-2 border-t border-neutral-100 flex items-baseline gap-1.5 text-[11px] text-neutral-500">
          <span className="font-semibold text-neutral-700 shrink-0">Sources:</span>
          <span className="text-neutral-600">{block.content}</span>
        </div>
      );
    }

    case 'table': {
      return <FinancialTable content={block.content} onCitationClick={onCitationClick} />;
    }

    case 'formula_box': {
      return (
        <div className="p-2.5 rounded-lg bg-neutral-900 text-emerald-400 border border-neutral-800 font-mono my-2 text-xs">
          <div className="text-[10px] text-neutral-400 uppercase tracking-wider mb-1">
            Mathematical Calculation
          </div>
          <div className="whitespace-pre-wrap leading-relaxed">
            {block.content.replace(/\\text\{/g, '').replace(/\}/g, '').replace(/\\times/g, '×').replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1) / ($2)')}
          </div>
        </div>
      );
    }

    case 'insight_callout': {
      return (
        <div className="p-2.5 rounded-lg bg-neutral-50 border-l-2 border-l-neutral-900 border border-neutral-200/80 my-2 space-y-0.5">
          <div className="text-xs text-neutral-800 leading-relaxed whitespace-pre-line">
            <FormattedText text={block.content} onCitationClick={onCitationClick} />
          </div>
        </div>
      );
    }

    case 'warning_callout': {
      return (
        <div className="p-2.5 rounded-lg bg-amber-50/50 border-l-2 border-l-amber-600 border border-amber-200/80 my-2 space-y-0.5">
          <div className="text-xs text-amber-950 leading-relaxed whitespace-pre-line">
            <FormattedText text={block.content} onCitationClick={onCitationClick} />
          </div>
        </div>
      );
    }

    case 'statutory_card': {
      const variant = block.data?.variant || 'reality';
      let icon = <FileText className="w-3.5 h-3.5 text-neutral-600" />;
      let cardBg = 'bg-neutral-50 border-neutral-200 text-neutral-900';

      if (variant === 'regulation') {
        icon = <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />;
        cardBg = 'bg-emerald-50/50 border-emerald-200 text-emerald-950';
      } else if (variant === 'protection') {
        icon = <AlertOctagon className="w-3.5 h-3.5 text-neutral-600" />;
        cardBg = 'bg-neutral-50 border-neutral-200 text-neutral-950';
      }

      return (
        <div className={`p-2.5 rounded-lg border ${cardBg} my-2 space-y-1`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-semibold text-[11px]">
              {icon}
              <span>{block.title}</span>
            </div>
            <span className="text-[9px] font-mono text-neutral-400">Statutory Record</span>
          </div>
          <div className="text-xs leading-relaxed text-neutral-700 whitespace-pre-line">
            <FormattedText text={block.content} onCitationClick={onCitationClick} />
          </div>
          {variant === 'protection' && (
            <div className="pt-1 flex items-center justify-between border-t border-neutral-200/60">
              <a
                href="https://scores.sebi.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[10px] font-medium text-neutral-700 hover:text-neutral-950 transition-colors"
              >
                <span>SEBI SCORES Grievance Redressal</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
              <span className="text-[10px] font-mono text-neutral-400">Independent Research</span>
            </div>
          )}
        </div>
      );
    }

    case 'paragraph':
    default: {
      return (
        <div className="leading-relaxed whitespace-pre-line">
          <FormattedText text={block.content} onCitationClick={onCitationClick} />
        </div>
      );
    }
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Financial Markdown Table Renderer
// ─────────────────────────────────────────────────────────────────────────────

const FinancialTable: React.FC<{ content: string; onCitationClick?: (citationId: string) => void }> = ({
  content,
  onCitationClick,
}) => {
  const lines = content.trim().split('\n').filter(Boolean);
  if (lines.length < 2) return null;

  const parseRow = (line: string) =>
    line
      .split('|')
      .slice(1, -1)
      .map((cell) => cell.trim());

  const headers = parseRow(lines[0]);
  const rows = lines.slice(2).map(parseRow);

  return (
    <div className="my-2.5 overflow-x-auto rounded-lg border border-neutral-200 bg-white">
      <table className="w-full text-left text-xs border-collapse">
        <thead>
          <tr className="bg-neutral-50 border-b border-neutral-200">
            {headers.map((h, hIdx) => (
              <th
                key={hIdx}
                className="py-1.5 px-3 font-semibold text-neutral-900 tracking-tight first:pl-3 last:pr-3"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100">
          {rows.map((row, rIdx) => (
            <tr key={rIdx} className="hover:bg-neutral-50/70 transition-colors">
              {row.map((cell, cIdx) => {
                const isNumeric = /^[₹$]?\d+([.,]\d+)?%?x?/.test(cell.replace(/\*\*/g, '').trim());
                return (
                  <td
                    key={cIdx}
                    className={`py-1.5 px-3 text-neutral-800 first:pl-3 last:pr-3 ${
                      isNumeric ? 'font-mono font-medium' : ''
                    }`}
                  >
                    <FormattedText text={cell} onCitationClick={onCitationClick} />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Formatted Text: Plain Bold & Discrete [1] Citation Tags
// ─────────────────────────────────────────────────────────────────────────────

const FormattedText: React.FC<{
  text: string;
  onCitationClick?: (citationId: string) => void;
}> = ({ text, onCitationClick }) => {
  // Tokenize on bold markdown (**...**) and citation marks ([1], [2], etc.)
  const tokens = text.split(/(\*\*[^*]+\*\*|\[\d+\])/g);

  return (
    <>
      {tokens.map((token, idx) => {
        // 1. Bold tag: **something**
        if (token.startsWith('**') && token.endsWith('**')) {
          const inner = token.slice(2, -2);
          return (
            <strong key={idx} className="font-semibold text-neutral-950">
              {inner}
            </strong>
          );
        }

        // 2. Citation reference: [1], [2], etc.
        const citationMatch = token.match(/^\[(\d+)\]$/);
        if (citationMatch) {
          const num = citationMatch[1];
          return (
            <button
              key={idx}
              type="button"
              onClick={() => onCitationClick?.(num)}
              className="inline-flex items-center text-[10px] font-mono font-medium text-neutral-500 hover:text-neutral-950 mx-0.5 px-1 py-0.2 rounded bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 transition-colors align-baseline cursor-pointer"
              title={`Source citation [${num}] · Verified Statutory Filing`}
            >
              [{num}]
            </button>
          );
        }

        // 3. Bullet indicators
        if (token.startsWith('• ') || token.startsWith('* ')) {
          return (
            <span key={idx} className="block pl-3 relative my-0.5">
              <span className="absolute left-0 top-1.5 w-1 h-1 rounded-full bg-neutral-400" />
              {token.slice(2)}
            </span>
          );
        }

        return <span key={idx}>{token}</span>;
      })}
    </>
  );
};
