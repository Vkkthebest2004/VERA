import { FactCheckDossier, PresetExample } from '@/types/ingestion';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const FALLBACK_PRESETS: PresetExample[] = [
  {
    id: 'whatsapp_viral_tip',
    title: 'WhatsApp Viral Stock Tip',
    channel: 'WHATSAPP',
    badge: 'High Risk / Viral Forward',
    preview: 'Tata Power secret ₹12,500 Cr deal, 20% Upper Circuit tomorrow at 9:15 AM...',
    full_text: `🔥🚨 FORWARDED MANY TIMES 🚨🔥
BREAKING INSIDER NEWS!! Tata Power signed secret ₹12,500 Crore mega solar contract with Government of India! Big operators loading heavily before 9:15 AM tomorrow!!
Guaranteed upper circuit 20%!! Target price ₹550 in 1 week!! Don't miss this multibagger rocket jackpot load heavily 🚀💰💸!!`,
  },
  {
    id: 'instagram_finfluencer_reel',
    title: 'Instagram Finfluencer Reel Post',
    channel: 'INSTAGRAM',
    badge: 'Finfluencer Hype',
    preview: 'Suzlon Energy FIIs bought 15% stake, Q3 EBITDA jumped 300% YoY to ₹850 Cr...',
    full_text: `Why I just put ₹5 Lakhs into SUZLON ENERGY! 📈🔥
FIIs bought a massive 15% stake this quarter. Q3 EBITDA jumped 300% YoY to ₹850 Crore! Debt reduced by 80%. This stock is heading straight to ₹120 by Diwali!
Don't miss this 10x multibagger gem! (Not SEBI registered, for educational purpose only) 💎🎯`,
  },
  {
    id: 'telegram_penny_pump',
    title: 'Telegram Penny Stock Pump',
    channel: 'TELEGRAM',
    badge: 'Pump & Dump Alert',
    preview: 'Confidential operator leak: ₹300 Cr UAE export order, 100% risk free guaranteed return...',
    full_text: `⚠️ CONFIDENTIAL OPERATOR LEAK: Penny stock under ₹15!
Company bagged ₹300 Crore export order from UAE. 100% risk-free guaranteed return. 5 consecutive upper circuits starting Monday! Hurry, buy today before it blasts off and news hits CNBC! 🚀💣`,
  },
  {
    id: 'official_disclosure',
    title: 'Official BSE/NSE Disclosure',
    channel: 'PDF',
    badge: 'Authoritative Source',
    preview: 'Reliance Industries enters into definitive agreement to acquire 51% stake for ₹350 Crore...',
    full_text: `RELIANCE INDUSTRIES LIMITED — DISCLOSURE UNDER REGULATION 30 OF SEBI (LODR) REGULATIONS, 2015.
We wish to inform you that Reliance Retail Ventures Limited has executed definitive agreements to acquire a 51% equity stake in Ed-a-Mamma for an aggregate cash consideration of ₹350 Crore.
The proposed acquisition has received customary regulatory approvals and is expected to close within 30 days.`,
  },
];

export async function fetchPresets(): Promise<PresetExample[]> {
  try {
    const res = await fetch(`${API_BASE}/api/v1/ingestion/presets`, { cache: 'no-store' });
    if (!res.ok) throw new Error('API unavailable');
    return await res.json();
  } catch (err) {
    return FALLBACK_PRESETS;
  }
}

export async function analyzeText(text: string, channel: string): Promise<FactCheckDossier> {
  const res = await fetch(`${API_BASE}/api/v1/ingestion/analyze-text`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, channel }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || `Server returned ${res.status}`);
  }
  return await res.json();
}

export async function analyzeFile(file: File): Promise<FactCheckDossier> {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${API_BASE}/api/v1/ingestion/analyze-file`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || `Server returned ${res.status}`);
  }
  return await res.json();
}

export async function investigateClaim(text: string, channel: string) {
  const res = await fetch(`${API_BASE}/api/v1/investigation/verify-claim`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, channel }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || `Server returned ${res.status}`);
  }
  return await res.json();
}

export async function investigateFile(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${API_BASE}/api/v1/investigation/verify-file`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || `Server returned ${res.status}`);
  }
  return await res.json();
}

export async function investigateWebResearch(claim: string, entityHint?: string) {
  const res = await fetch(`${API_BASE}/api/v1/research/investigate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ claim, entity_hint: entityHint || null }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || `Server returned ${res.status}`);
  }
  return await res.json();
}

export async function fetchResearchPresets() {
  const res = await fetch(`${API_BASE}/api/v1/research/presets`, { cache: 'no-store' });
  if (!res.ok) throw new Error('API unavailable');
  return await res.json();
}

export async function fetchResearchSources() {
  const res = await fetch(`${API_BASE}/api/v1/research/sources`, { cache: 'no-store' });
  if (!res.ok) throw new Error('API unavailable');
  return await res.json();
}

function clientSideAnalyze(text: string, channel: string): FactCheckDossier {
  const isHype = text.includes('🚀') || text.includes('🔥') || text.includes('Guaranteed') || text.includes('jackpot');
  const lower = text.toLowerCase();
  
  const entities = [];
  if (lower.includes('tata power')) entities.push({ name: 'Tata Power', ticker: 'TATAPOWER', entity_type: 'COMPANY', role: 'SUBJECT' });
  if (lower.includes('suzlon')) entities.push({ name: 'Suzlon Energy', ticker: 'SUZLON', entity_type: 'COMPANY', role: 'SUBJECT' });
  if (lower.includes('reliance')) entities.push({ name: 'Reliance Industries', ticker: 'RELIANCE', entity_type: 'COMPANY', role: 'SUBJECT' });

  const metrics = [];
  if (text.includes('12,500')) metrics.push({ metric_type: 'CONTRACT_VALUE', raw_text: '₹12,500 Crore', unit_or_currency: 'INR' });
  if (text.includes('300%')) metrics.push({ metric_type: 'PERCENTAGE_CLAIM', raw_text: '300% YoY', unit_or_currency: '%' });
  if (text.includes('350')) metrics.push({ metric_type: 'DEAL_CONSIDERATION', raw_text: '₹350 Crore', unit_or_currency: 'INR' });

  const red_flags = [];
  if (text.includes('100%') || lower.includes('guaranteed')) {
    red_flags.push({
      flag_id: 'rf_1',
      flag_name: 'Guaranteed Return Claim',
      severity: 'CRITICAL' as const,
      description: 'Returns can never be guaranteed. Indicative of deceptive stock tip schemes.',
      matched_snippet: '...guaranteed return / 100%...',
    });
  }
  if (lower.includes('upper circuit') || lower.includes('uc')) {
    red_flags.push({
      flag_id: 'rf_2',
      flag_name: 'Upper Circuit Pump Signal',
      severity: 'HIGH' as const,
      description: 'Claims of imminent upper circuit triggers to artificially create panic-buying.',
      matched_snippet: '...upper circuit 20%...',
    });
  }
  if (lower.includes('forwarded many times') || lower.includes('forwarded as received')) {
    red_flags.push({
      flag_id: 'rf_3',
      flag_name: 'Viral Forward Propagation',
      severity: 'MEDIUM' as const,
      description: 'Anonymous chain forward with no verifiable primary provenance.',
      matched_snippet: '...FORWARDED MANY TIMES...',
    });
  }

  const assertions = [
    {
      assertion_id: 'ast_1',
      statement: entities.length > 0 ? `Target company ${entities[0].name} reported significant corporate or financial development` : 'Primary factual assertion extracted from text',
      category: 'CONTRACT_DEAL',
      verifiable: true,
      confidence_score: 0.92,
      verification_target: 'BSE/NSE Reg 30 Corporate Disclosures',
    },
  ];

  return {
    dossier_id: `dos_${Math.random().toString(36).substring(2, 10)}`,
    channel,
    original_content: text,
    dehyped_summary: `Subject entity: ${entities.map(e => e.name).join(', ') || 'Disclosed entity'}. Isolates verifiable claims from emotional hyperbole for stage 2 evidence retrieval.`,
    hype_score: isHype ? 0.85 : 0.15,
    sentiment: isHype ? 'HYPER_BULLISH' : 'NEUTRAL',
    entities,
    metrics,
    red_flags,
    assertions,
    metadata: { processed_by: 'sutra_hybrid_engine' },
    created_at: new Date().toISOString(),
  };
}
