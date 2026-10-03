export interface CompanyData {
  id: string;
  ticker: string;
  name: string;
  exchange: string;
  price: number;
  changePercent: number;
  changeAmount: number;
  closeDate: string;
  website: string;
  logoBg: string;
  marketCapCr: number;
  pe: number;
  high52: number;
  low52: number;
  bookValue: number;
  dividendYield: number;
  roce: number;
  roe: number;
  faceValue: number;
  about: string;
  keyPoints: string[];
  chartData: {
    '1M': { x: string; y: number; volume: number }[];
    '6M': { x: string; y: number; volume: number }[];
    '1Yr': { x: string; y: number; volume: number }[];
    '3Yr': { x: string; y: number; volume: number }[];
    '5Yr': { x: string; y: number; volume: number }[];
    'Max': { x: string; y: number; volume: number }[];
  };
  peers: {
    name: string;
    cmp: number;
    pe: number;
    marCapCr: number;
    divYield: number;
    roce: number;
  }[];
  quarters: {
    period: string;
    salesCr: number;
    expensesCr: number;
    operatingProfitCr: number;
    opmPct: number;
    patCr: number;
  }[];
  sampleClaims: {
    label: string;
    claim: string;
    type: 'TRUE' | 'EXAGGERATED' | 'CONTRADICTED' | 'UNSUBSTANTIATED';
  }[];
}

export const COMPANIES: Record<string, CompanyData> = {
  ALLETEC: {
    id: 'ALLETEC',
    ticker: 'ALLETEC',
    name: 'All E Technologies Ltd',
    exchange: 'NSE - SME: ALLETEC',
    price: 123,
    changePercent: 0.37,
    changeAmount: 0.45,
    closeDate: '01 Oct - close price',
    website: 'alletec.com',
    logoBg: 'bg-purple-600',
    marketCapCr: 248,
    pe: 9.74,
    high52: 277,
    low52: 116,
    bookValue: 83.6,
    dividendYield: 1.22,
    roce: 22.1,
    roe: 17.0,
    faceValue: 10.0,
    about:
      'Incorporated in 2000, All E Technologies Ltd provides technology based business solutions to various companies across enterprise cloud transformation, Microsoft Dynamics ERP/CRM, and digital supply chain systems.',
    keyPoints: [
      'Business Overview: a) AET streamlines and automates core business processes with Product Based solutions built on Microsoft Cloud platforms.',
      'Global Presence: Serves clients across India, USA, Europe, Australia, and Middle East with offshore delivery centers.',
      'Statutory Compliance: Clean regulatory record under SEBI SME listing requirements with nil promoter pledge.',
    ],
    chartData: {
      '1M': [
        { x: '01 Sep', y: 118, volume: 85 },
        { x: '08 Sep', y: 121, volume: 110 },
        { x: '15 Sep', y: 119, volume: 95 },
        { x: '22 Sep', y: 122, volume: 130 },
        { x: '01 Oct', y: 123, volume: 105 },
      ],
      '6M': [
        { x: 'Apr', y: 145, volume: 120 },
        { x: 'May', y: 138, volume: 90 },
        { x: 'Jun', y: 126, volume: 140 },
        { x: 'Jul', y: 132, volume: 115 },
        { x: 'Aug', y: 119, volume: 160 },
        { x: 'Oct', y: 123, volume: 105 },
      ],
      '1Yr': [
        { x: 'Oct 23', y: 185, volume: 120 },
        { x: 'Nov 23', y: 215, volume: 140 },
        { x: 'Dec 23', y: 195, volume: 98 },
        { x: 'Jan 24', y: 245, volume: 165 },
        { x: 'Feb 24', y: 277, volume: 185 },
        { x: 'Mar 24', y: 220, volume: 135 },
        { x: 'Apr 24', y: 175, volume: 110 },
        { x: 'May 24', y: 145, volume: 95 },
        { x: 'Jun 24', y: 126, volume: 125 },
        { x: 'Jul 24', y: 142, volume: 130 },
        { x: 'Aug 24', y: 116, volume: 155 },
        { x: 'Sep 24', y: 120, volume: 115 },
        { x: 'Oct 24', y: 123, volume: 105 },
      ],
      '3Yr': [
        { x: '2022', y: 92, volume: 75 },
        { x: '2023', y: 165, volume: 140 },
        { x: '2024', y: 123, volume: 115 },
      ],
      '5Yr': [
        { x: '2020', y: 65, volume: 45 },
        { x: '2021', y: 88, volume: 80 },
        { x: '2022', y: 92, volume: 75 },
        { x: '2023', y: 165, volume: 140 },
        { x: '2024', y: 123, volume: 115 },
      ],
      'Max': [
        { x: '2019', y: 55, volume: 30 },
        { x: '2021', y: 88, volume: 80 },
        { x: '2023', y: 165, volume: 140 },
        { x: '2024', y: 123, volume: 115 },
      ],
    },
    peers: [
      { name: 'All E Technologies', cmp: 123, pe: 9.74, marCapCr: 248, divYield: 1.22, roce: 22.1 },
      { name: 'KPIT Technologies', cmp: 1780, pe: 64.2, marCapCr: 48600, divYield: 0.42, roce: 28.5 },
      { name: 'Tata Elxsi', cmp: 7650, pe: 58.1, marCapCr: 47600, divYield: 0.95, roce: 36.8 },
      { name: 'L&T Technology Services', cmp: 5240, pe: 41.3, marCapCr: 55400, divYield: 0.85, roce: 26.4 },
    ],
    quarters: [
      { period: 'Jun 2024', salesCr: 32.4, expensesCr: 24.1, operatingProfitCr: 8.3, opmPct: 25.6, patCr: 6.2 },
      { period: 'Sep 2024', salesCr: 35.8, expensesCr: 26.2, operatingProfitCr: 9.6, opmPct: 26.8, patCr: 7.1 },
      { period: 'Dec 2024', salesCr: 38.1, expensesCr: 27.9, operatingProfitCr: 10.2, opmPct: 26.7, patCr: 7.8 },
      { period: 'Mar 2025', salesCr: 41.5, expensesCr: 30.1, operatingProfitCr: 11.4, opmPct: 27.4, patCr: 8.6 },
    ],
    sampleClaims: [
      {
        label: '₹120 Cr Global Order Rumor',
        claim: 'All E Technologies signed secret ₹120 Crore enterprise ERP modernization deal with European government! Guaranteed 20% upper circuit!',
        type: 'EXAGGERATED',
      },
      {
        label: 'Legitimate Reg 30 Filings',
        claim: 'All E Technologies submitted outcome of Board Meeting and financial disclosures pursuant to Regulation 30.',
        type: 'TRUE',
      },
      {
        label: 'Anonymous WhatsApp Tip',
        claim: '🚀 OPERATOR BUY ALERT: All E Technologies target ₹350 next week, big FII accumulation in progress!',
        type: 'UNSUBSTANTIATED',
      },
    ],
  },
  TATAPOWER: {
    id: 'TATAPOWER',
    ticker: 'TATAPOWER',
    name: 'Tata Power Company Limited',
    exchange: 'NSE: TATAPOWER | BSE: 500400',
    price: 418.5,
    changePercent: 1.85,
    changeAmount: 7.6,
    closeDate: '03 Oct - close price',
    website: 'tatapower.com',
    logoBg: 'bg-blue-600',
    marketCapCr: 133700,
    pe: 33.4,
    high52: 494,
    low52: 248,
    bookValue: 122.4,
    dividendYield: 0.54,
    roce: 12.4,
    roe: 13.1,
    faceValue: 1.0,
    about:
      'Tata Power is India’s largest integrated power company with a growing clean and green energy portfolio of 5,500+ MW. Operates generation, transmission, distribution, and EV charging infrastructure.',
    keyPoints: [
      'Renewable Energy Expansion: TPREL developing major solar and FDRE projects across Rajasthan and Gujarat.',
      'SJVN 200 MW FDRE Contract: Received official LOA valued at ₹1,250 Crore under Reg 30.',
      'Distribution Reach: Serves over 12 million consumer connections across Mumbai, Delhi, and Odisha.',
    ],
    chartData: {
      '1M': [
        { x: '01 Sep', y: 405, volume: 140 },
        { x: '08 Sep', y: 412, volume: 160 },
        { x: '15 Sep', y: 410, volume: 135 },
        { x: '22 Sep', y: 422, volume: 180 },
        { x: '01 Oct', y: 418.5, volume: 150 },
      ],
      '6M': [
        { x: 'Apr', y: 390, volume: 160 },
        { x: 'May', y: 420, volume: 190 },
        { x: 'Jun', y: 435, volume: 210 },
        { x: 'Jul', y: 445, volume: 185 },
        { x: 'Aug', y: 410, volume: 170 },
        { x: 'Oct', y: 418.5, volume: 150 },
      ],
      '1Yr': [
        { x: 'Oct 23', y: 255, volume: 140 },
        { x: 'Dec 23', y: 310, volume: 190 },
        { x: 'Feb 24', y: 380, volume: 240 },
        { x: 'Apr 24', y: 425, volume: 220 },
        { x: 'Jun 24', y: 440, volume: 195 },
        { x: 'Aug 24', y: 410, volume: 160 },
        { x: 'Oct 24', y: 418.5, volume: 150 },
      ],
      '3Yr': [
        { x: '2022', y: 215, volume: 180 },
        { x: '2023', y: 310, volume: 210 },
        { x: '2024', y: 418.5, volume: 190 },
      ],
      '5Yr': [
        { x: '2020', y: 68, volume: 90 },
        { x: '2021', y: 135, volume: 160 },
        { x: '2022', y: 215, volume: 180 },
        { x: '2023', y: 310, volume: 210 },
        { x: '2024', y: 418.5, volume: 190 },
      ],
      'Max': [
        { x: '2015', y: 72, volume: 80 },
        { x: '2018', y: 85, volume: 95 },
        { x: '2021', y: 135, volume: 160 },
        { x: '2024', y: 418.5, volume: 190 },
      ],
    },
    peers: [
      { name: 'Tata Power', cmp: 418.5, pe: 33.4, marCapCr: 133700, divYield: 0.54, roce: 12.4 },
      { name: 'NTPC Ltd', cmp: 425.0, pe: 18.2, marCapCr: 412000, divYield: 2.15, roce: 11.8 },
      { name: 'Adani Power', cmp: 615.0, pe: 12.8, marCapCr: 237000, divYield: 0.0, roce: 22.4 },
      { name: 'JSW Energy', cmp: 680.0, pe: 65.4, marCapCr: 118000, divYield: 0.32, roce: 9.6 },
    ],
    quarters: [
      { period: 'Jun 2024', salesCr: 17290, expensesCr: 14120, operatingProfitCr: 3170, opmPct: 18.3, patCr: 1189 },
      { period: 'Sep 2024', salesCr: 16840, expensesCr: 13750, operatingProfitCr: 3090, opmPct: 18.3, patCr: 1120 },
      { period: 'Dec 2024', salesCr: 16420, expensesCr: 13390, operatingProfitCr: 3030, opmPct: 18.4, patCr: 1076 },
      { period: 'Mar 2025', salesCr: 18100, expensesCr: 14750, operatingProfitCr: 3350, opmPct: 18.5, patCr: 1245 },
    ],
    sampleClaims: [
      {
        label: '10x Solar Contract Exaggeration',
        claim: 'Tata Power signed secret ₹12,500 Crore mega solar contract with Government of India! Guaranteed upper circuit 20%!',
        type: 'EXAGGERATED',
      },
      {
        label: 'Authentic SJVN Letter of Award',
        claim: 'Tata Power subsidiary TPREL received Letter of Award from SJVN for 200 MW FDRE project valued at ₹1,250 Crore.',
        type: 'TRUE',
      },
    ],
  },
  SUZLON: {
    id: 'SUZLON',
    ticker: 'SUZLON',
    name: 'Suzlon Energy Limited',
    exchange: 'NSE: SUZLON | BSE: 532667',
    price: 56.4,
    changePercent: -0.45,
    changeAmount: -0.25,
    closeDate: '03 Oct - close price',
    website: 'suzlon.com',
    logoBg: 'bg-emerald-600',
    marketCapCr: 76800,
    pe: 68.2,
    high52: 86.0,
    low52: 35.0,
    bookValue: 5.2,
    dividendYield: 0.0,
    roce: 24.5,
    roe: 26.2,
    faceValue: 2.0,
    about:
      'Suzlon is India’s pioneering renewable energy solutions provider specializing in wind turbine generators (WTGs), solar hybrid systems, and operations & maintenance services.',
    keyPoints: [
      'Turnaround Story: Achieved net-cash positive status after comprehensive debt restructuring.',
      'Order Book: Cumulative installed wind energy capacity exceeding 20.8 GW globally across 17 countries.',
      'Audited Financials: Q3 FY25 PAT stood at ₹203 Crore (+160% YoY).',
    ],
    chartData: {
      '1M': [
        { x: '01 Sep', y: 58.2, volume: 220 },
        { x: '08 Sep', y: 57.5, volume: 190 },
        { x: '15 Sep', y: 59.1, volume: 240 },
        { x: '22 Sep', y: 57.0, volume: 180 },
        { x: '01 Oct', y: 56.4, volume: 175 },
      ],
      '6M': [
        { x: 'Apr', y: 42.0, volume: 260 },
        { x: 'May', y: 48.5, volume: 310 },
        { x: 'Jun', y: 54.0, volume: 340 },
        { x: 'Jul', y: 72.0, volume: 420 },
        { x: 'Aug', y: 81.5, volume: 380 },
        { x: 'Oct', y: 56.4, volume: 175 },
      ],
      '1Yr': [
        { x: 'Oct 23', y: 31.0, volume: 290 },
        { x: 'Dec 23', y: 38.5, volume: 340 },
        { x: 'Feb 24', y: 46.0, volume: 360 },
        { x: 'May 24', y: 48.5, volume: 310 },
        { x: 'Jul 24', y: 72.0, volume: 420 },
        { x: 'Sep 24', y: 64.0, volume: 280 },
        { x: 'Oct 24', y: 56.4, volume: 175 },
      ],
      '3Yr': [
        { x: '2022', y: 9.5, volume: 150 },
        { x: '2023', y: 38.0, volume: 320 },
        { x: '2024', y: 56.4, volume: 240 },
      ],
      '5Yr': [
        { x: '2020', y: 2.8, volume: 80 },
        { x: '2021', y: 6.4, volume: 120 },
        { x: '2022', y: 9.5, volume: 150 },
        { x: '2023', y: 38.0, volume: 320 },
        { x: '2024', y: 56.4, volume: 240 },
      ],
      'Max': [
        { x: '2015', y: 22.0, volume: 90 },
        { x: '2019', y: 3.5, volume: 70 },
        { x: '2022', y: 9.5, volume: 150 },
        { x: '2024', y: 56.4, volume: 240 },
      ],
    },
    peers: [
      { name: 'Suzlon Energy', cmp: 56.4, pe: 68.2, marCapCr: 76800, divYield: 0.0, roce: 24.5 },
      { name: 'Inox Wind', cmp: 215.0, pe: 42.1, marCapCr: 27800, divYield: 0.0, roce: 16.8 },
      { name: 'Siemens Energy', cmp: 3240, pe: 54.0, marCapCr: 115000, divYield: 0.35, roce: 18.2 },
    ],
    quarters: [
      { period: 'Jun 2024', salesCr: 2016, expensesCr: 1646, operatingProfitCr: 370, opmPct: 18.3, patCr: 302 },
      { period: 'Sep 2024', salesCr: 2093, expensesCr: 1715, operatingProfitCr: 378, opmPct: 18.1, patCr: 201 },
      { period: 'Dec 2024', salesCr: 2145, expensesCr: 1735, operatingProfitCr: 410, opmPct: 19.1, patCr: 203 },
      { period: 'Mar 2025', salesCr: 2340, expensesCr: 1880, operatingProfitCr: 460, opmPct: 19.7, patCr: 265 },
    ],
    sampleClaims: [
      {
        label: 'Fabricated Q3 Earnings & ₹100 Target',
        claim: 'Suzlon Energy Q3 PAT touched ₹850 Crore with target ₹100 by Diwali guaranteed!',
        type: 'CONTRADICTED',
      },
      {
        label: 'Actual Audited Results',
        claim: 'Suzlon Energy reported Q3 PAT of ₹203 Crore, representing 160% YoY growth.',
        type: 'TRUE',
      },
    ],
  },
  ZOMATO: {
    id: 'ZOMATO',
    ticker: 'ZOMATO',
    name: 'Zomato Limited (Eternal)',
    exchange: 'NSE: ZOMATO | BSE: 543320',
    price: 274.15,
    changePercent: 2.4,
    changeAmount: 6.45,
    closeDate: '03 Oct - close price',
    website: 'zomato.com',
    logoBg: 'bg-red-600',
    marketCapCr: 242000,
    pe: 112.5,
    high52: 298.0,
    low52: 115.0,
    bookValue: 34.2,
    dividendYield: 0.0,
    roce: 8.4,
    roe: 6.8,
    faceValue: 1.0,
    about:
      'Zomato (now operating under Eternal Group) is India’s leading food delivery and quick-commerce platform connecting consumers with restaurants and dark stores through Blinkit, Hyperpure, and District.',
    keyPoints: [
      'Blinkit Acquisition: Acquired 100% of Blinkit in an all-stock deal valued at ₹4,447 Crore.',
      'Dark Store Expansion: Operating 1,000+ quick-commerce dark stores across metropolitan and tier-2 hubs.',
      'Profitability: Turned net profitable with operating leverage across food delivery platform fees.',
    ],
    chartData: {
      '1M': [
        { x: '01 Sep', y: 255, volume: 310 },
        { x: '08 Sep', y: 262, volume: 280 },
        { x: '15 Sep', y: 268, volume: 340 },
        { x: '22 Sep', y: 265, volume: 290 },
        { x: '01 Oct', y: 274.15, volume: 320 },
      ],
      '6M': [
        { x: 'Apr', y: 195, volume: 340 },
        { x: 'May', y: 210, volume: 380 },
        { x: 'Jun', y: 235, volume: 410 },
        { x: 'Jul', y: 250, volume: 360 },
        { x: 'Aug', y: 265, volume: 330 },
        { x: 'Oct', y: 274.15, volume: 320 },
      ],
      '1Yr': [
        { x: 'Oct 23', y: 115, volume: 280 },
        { x: 'Jan 24', y: 142, volume: 330 },
        { x: 'Apr 24', y: 195, volume: 340 },
        { x: 'Jul 24', y: 250, volume: 360 },
        { x: 'Oct 24', y: 274.15, volume: 320 },
      ],
      '3Yr': [
        { x: '2022', y: 62, volume: 220 },
        { x: '2023', y: 125, volume: 310 },
        { x: '2024', y: 274.15, volume: 340 },
      ],
      '5Yr': [
        { x: '2021', y: 125, volume: 450 },
        { x: '2022', y: 62, volume: 220 },
        { x: '2023', y: 125, volume: 310 },
        { x: '2024', y: 274.15, volume: 340 },
      ],
      'Max': [
        { x: '2021', y: 125, volume: 450 },
        { x: '2022', y: 62, volume: 220 },
        { x: '2023', y: 125, volume: 310 },
        { x: '2024', y: 274.15, volume: 340 },
      ],
    },
    peers: [
      { name: 'Zomato', cmp: 274.15, pe: 112.5, marCapCr: 242000, divYield: 0.0, roce: 8.4 },
      { name: 'Swiggy', cmp: 420.0, pe: 85.0, marCapCr: 95000, divYield: 0.0, roce: 6.2 },
      { name: 'Info Edge (Naukri)', cmp: 7850, pe: 95.4, marCapCr: 102000, divYield: 0.25, roce: 7.8 },
    ],
    quarters: [
      { period: 'Jun 2024', salesCr: 4206, expensesCr: 3950, operatingProfitCr: 256, opmPct: 6.1, patCr: 253 },
      { period: 'Sep 2024', salesCr: 4799, expensesCr: 4505, operatingProfitCr: 294, opmPct: 6.1, patCr: 176 },
      { period: 'Dec 2024', salesCr: 5410, expensesCr: 5040, operatingProfitCr: 370, opmPct: 6.8, patCr: 285 },
      { period: 'Mar 2025', salesCr: 6150, expensesCr: 5690, operatingProfitCr: 460, opmPct: 7.5, patCr: 350 },
    ],
    sampleClaims: [
      {
        label: 'Authentic Blinkit Acquisition Deal',
        claim: 'Zomato acquired quick-commerce platform Blinkit in an all-stock deal valued at ₹4,447 Crore.',
        type: 'TRUE',
      },
      {
        label: '10x Secret Government Deal Rumor',
        claim: 'Zomato acquired Blinkit for ₹44,470 Crore mega secret deal! Guaranteed 20% upper circuit tomorrow!',
        type: 'UNSUBSTANTIATED',
      },
    ],
  },
  RELIANCE: {
    id: 'RELIANCE',
    ticker: 'RELIANCE',
    name: 'Reliance Industries Ltd',
    exchange: 'NSE: RELIANCE | BSE: 500325',
    price: 1168,
    changePercent: 0.52,
    changeAmount: 6.05,
    closeDate: '03 Oct - close price',
    website: 'ril.com',
    logoBg: 'bg-indigo-700',
    marketCapCr: 1580194,
    pe: 21.2,
    high52: 1612,
    low52: 1161,
    bookValue: 668,
    dividendYield: 0.51,
    roce: 10.3,
    roe: 8.91,
    faceValue: 10.0,
    about:
      'Reliance Industries Ltd is India’s largest private sector conglomerate with diversified market leadership spanning Oil-to-Chemicals (O2C), Retail (Reliance Retail / RRVL), Digital Services & Telecom (Jio Platforms), Media, and New Energy / Green Hydrogen gigafactories.',
    keyPoints: [
      'Digital & Telecom Leadership: Jio commands over 475 million subscribers with pan-India standalone 5G true network.',
      'Retail Footprint: Reliance Retail operates 18,000+ stores across grocery, electronics, fashion, and lifestyle.',
      'Ed-a-Mamma Acquisition: Acquired 51% majority stake in conscious clothing brand Ed-a-Mamma for an aggregate consideration of ₹350 Crore under Reg 30.',
      'Energy Transition: Constructing Dhirubhai Ambani Green Energy Giga Complex in Jamnagar across solar PV, energy storage, and green hydrogen.',
    ],
    chartData: {
      '1M': [
        { x: '01 Sep', y: 1195, volume: 180 },
        { x: '08 Sep', y: 1210, volume: 220 },
        { x: '15 Sep', y: 1180, volume: 195 },
        { x: '22 Sep', y: 1172, volume: 240 },
        { x: '01 Oct', y: 1168, volume: 210 },
      ],
      '6M': [
        { x: 'Apr', y: 1420, volume: 260 },
        { x: 'May', y: 1460, volume: 290 },
        { x: 'Jun', y: 1530, volume: 340 },
        { x: 'Jul', y: 1612, volume: 380 },
        { x: 'Aug', y: 1490, volume: 310 },
        { x: 'Oct', y: 1168, volume: 210 },
      ],
      '1Yr': [
        { x: 'Oct 23', y: 1140, volume: 220 },
        { x: 'Dec 23', y: 1260, volume: 280 },
        { x: 'Feb 24', y: 1470, volume: 360 },
        { x: 'Apr 24', y: 1420, volume: 260 },
        { x: 'Jul 24', y: 1612, volume: 380 },
        { x: 'Sep 24', y: 1380, volume: 290 },
        { x: 'Oct 24', y: 1168, volume: 210 },
      ],
      '3Yr': [
        { x: '2022', y: 1120, volume: 280 },
        { x: '2023', y: 1260, volume: 320 },
        { x: '2024', y: 1168, volume: 290 },
      ],
      '5Yr': [
        { x: '2020', y: 980, volume: 310 },
        { x: '2021', y: 1180, volume: 360 },
        { x: '2022', y: 1120, volume: 280 },
        { x: '2023', y: 1260, volume: 320 },
        { x: '2024', y: 1168, volume: 290 },
      ],
      'Max': [
        { x: '2015', y: 440, volume: 190 },
        { x: '2018', y: 620, volume: 240 },
        { x: '2021', y: 1180, volume: 360 },
        { x: '2024', y: 1168, volume: 290 },
      ],
    },
    peers: [
      { name: 'Reliance Industries', cmp: 1168, pe: 21.2, marCapCr: 1580194, divYield: 0.51, roce: 10.3 },
      { name: 'TCS', cmp: 4250, pe: 31.4, marCapCr: 1540000, divYield: 1.15, roce: 58.2 },
      { name: 'HDFC Bank', cmp: 1680, pe: 18.9, marCapCr: 1280000, divYield: 1.12, roce: 16.4 },
      { name: 'Bharti Airtel', cmp: 1640, pe: 48.6, marCapCr: 980000, divYield: 0.48, roce: 14.8 },
    ],
    quarters: [
      { period: 'Jun 2025', salesCr: 243632, expensesCr: 200727, operatingProfitCr: 42905, opmPct: 18.0, patCr: 30783 },
      { period: 'Sep 2025', salesCr: 254623, expensesCr: 208738, operatingProfitCr: 45885, opmPct: 18.0, patCr: 22092 },
      { period: 'Dec 2025', salesCr: 264905, expensesCr: 218887, operatingProfitCr: 46018, opmPct: 17.0, patCr: 22290 },
      { period: 'Mar 2026', salesCr: 294059, expensesCr: 249918, operatingProfitCr: 44141, opmPct: 15.0, patCr: 20589 },
    ],
    sampleClaims: [
      {
        label: 'Ed-a-Mamma 51% Stake Acquisition',
        claim: 'Reliance Retail Ventures acquired a 51% majority stake in Ed-a-Mamma for ₹350 Crore.',
        type: 'TRUE',
      },
      {
        label: 'Fabricated Secret Oil Concession Rumor',
        claim: 'Reliance Industries signed secret ₹2,50,000 Crore crude oil concession with Saudi Aramco! Guaranteed 25% upper circuit tomorrow!',
        type: 'UNSUBSTANTIATED',
      },
    ],
  },
};
