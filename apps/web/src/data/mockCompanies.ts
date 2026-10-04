// ─────────────────────────────────────────────────────────────────────────────
// VERA – Verified Financial Data for TATA POWER & RELIANCE INDUSTRIES
// Source: Screener.in (consolidated), NSE India, BSE India
// All numbers in ₹ Crores unless stated otherwise
// ─────────────────────────────────────────────────────────────────────────────

export interface FinancialTableSection {
  headers: string[];
  rows: { label: string; values: string[] }[];
}

export interface ShareholdingRow {
  category: string;
  quarters: { period: string; pct: number }[];
}

export interface CompanyData {
  id: string;
  ticker: string;
  name: string;
  exchange: string;
  bseCode: string;
  nseSymbol: string;
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
  peers: { name: string; cmp: number; pe: number; marCapCr: number; divYield: number; roce: number }[];
  quarters: {
    period: string; salesCr: number; expensesCr: number; operatingProfitCr: number; opmPct: number;
    otherIncome: number; interest: number; depreciation: number; pbt: number; taxPct: number; patCr: number; epsDiluted: number;
  }[];
  profitAndLoss: FinancialTableSection;
  balanceSheet: FinancialTableSection;
  cashFlow: FinancialTableSection;
  ratios: FinancialTableSection;
  shareholding: ShareholdingRow[];
  sampleClaims: { label: string; claim: string; type: 'TRUE' | 'EXAGGERATED' | 'CONTRADICTED' | 'UNSUBSTANTIATED' }[];
}

// ═══════════════════════════════════════════════════════════════════════════
//  RELIANCE INDUSTRIES LTD – BSE: 500325 | NSE: RELIANCE
// ═══════════════════════════════════════════════════════════════════════════
const RELIANCE: CompanyData = {
  id: 'RELIANCE', ticker: 'RELIANCE', name: 'Reliance Industries Ltd',
  exchange: 'NSE: RELIANCE | BSE: 500325', bseCode: '500325', nseSymbol: 'RELIANCE',
  price: 1168, changePercent: -1.63, changeAmount: -19.35, closeDate: '01 Oct - close price',
  website: 'ril.com', logoBg: 'bg-indigo-700',
  marketCapCr: 1580194, pe: 21.2, high52: 1612, low52: 1161, bookValue: 668,
  dividendYield: 0.51, roce: 10.3, roe: 8.91, faceValue: 10.0,
  about: "Reliance was founded by Dhirubhai Ambani and is now promoted and managed by his elder son, Mukesh Dhirubhai Ambani. Ambani's family has about 50% shareholding in the conglomerate.",
  keyPoints: [
    'Architecture: RIL holds 66.43% in Jio Platforms (RJIL), 83.56% each in Reliance Retail Ventures and Reliance Consumer Products, and 59.59% in JioStar.',
    'Digital & Telecom: Jio commands 475M+ subscribers with pan-India standalone 5G network.',
    'Retail Footprint: Reliance Retail operates 18,000+ stores across grocery, electronics, fashion, and lifestyle.',
    'New Energy: Constructing Dhirubhai Ambani Green Energy Giga Complex in Jamnagar for solar PV, energy storage, and green hydrogen.',
  ],
  chartData: {
    '1M': [
      { x: '02 Sep', y: 1195, volume: 182 }, { x: '09 Sep', y: 1210, volume: 224 },
      { x: '16 Sep', y: 1187, volume: 198 }, { x: '23 Sep', y: 1172, volume: 245 },
      { x: '01 Oct', y: 1168, volume: 213 },
    ],
    '6M': [
      { x: 'Apr', y: 1282, volume: 195 }, { x: 'May', y: 1310, volume: 218 },
      { x: 'Jun', y: 1365, volume: 245 }, { x: 'Jul', y: 1420, volume: 268 },
      { x: 'Aug', y: 1248, volume: 232 }, { x: 'Sep', y: 1187, volume: 198 },
      { x: 'Oct', y: 1168, volume: 213 },
    ],
    '1Yr': [
      { x: 'Oct 25', y: 1365, volume: 195 }, { x: 'Dec 25', y: 1420, volume: 235 },
      { x: 'Feb 26', y: 1530, volume: 280 }, { x: 'Apr 26', y: 1282, volume: 195 },
      { x: 'Jun 26', y: 1365, volume: 245 }, { x: 'Jul 26', y: 1420, volume: 268 },
      { x: 'Sep 26', y: 1187, volume: 198 }, { x: 'Oct 26', y: 1168, volume: 213 },
    ],
    '3Yr': [
      { x: 'Dec 23', y: 1310, volume: 220 }, { x: 'Jun 24', y: 1490, volume: 265 },
      { x: 'Dec 24', y: 1234, volume: 240 }, { x: 'Jun 25', y: 1365, volume: 225 },
      { x: 'Dec 25', y: 1592, volume: 290 }, { x: 'Oct 26', y: 1168, volume: 213 },
    ],
    '5Yr': [
      { x: '2021', y: 1119, volume: 310 }, { x: '2022', y: 1201, volume: 285 },
      { x: '2023', y: 1310, volume: 258 }, { x: '2024', y: 1234, volume: 240 },
      { x: '2025', y: 1592, volume: 290 }, { x: '2026', y: 1168, volume: 213 },
    ],
    Max: [
      { x: '2015', y: 250, volume: 145 }, { x: '2016', y: 267, volume: 165 },
      { x: '2017', y: 455, volume: 195 }, { x: '2018', y: 540, volume: 225 },
      { x: '2019', y: 703, volume: 260 }, { x: '2020', y: 935, volume: 310 },
      { x: '2021', y: 1119, volume: 310 }, { x: '2022', y: 1201, volume: 285 },
      { x: '2023', y: 1310, volume: 258 }, { x: '2024', y: 1234, volume: 240 },
      { x: '2025', y: 1592, volume: 290 }, { x: '2026', y: 1168, volume: 213 },
    ],
  },
  peers: [
    { name: 'Reliance Industries', cmp: 1168, pe: 21.2, marCapCr: 1580194, divYield: 0.51, roce: 10.3 },
    { name: 'Indian Oil Corp', cmp: 132, pe: 5.8, marCapCr: 186400, divYield: 6.82, roce: 18.5 },
    { name: 'BPCL', cmp: 301, pe: 8.2, marCapCr: 130600, divYield: 5.65, roce: 22.4 },
    { name: 'HPCL', cmp: 345, pe: 6.9, marCapCr: 73200, divYield: 4.35, roce: 19.8 },
    { name: 'ONGC', cmp: 236, pe: 7.4, marCapCr: 297000, divYield: 4.24, roce: 16.2 },
  ],
  quarters: [
    { period: 'Sep 2025', salesCr: 254623, expensesCr: 208738, operatingProfitCr: 45885, opmPct: 18, otherIncome: 4482, interest: 6827, depreciation: 14416, pbt: 29124, taxPct: 24, patCr: 22092, epsDiluted: 13.42 },
    { period: 'Dec 2025', salesCr: 264905, expensesCr: 218887, operatingProfitCr: 46018, opmPct: 17, otherIncome: 4914, interest: 6613, depreciation: 14622, pbt: 29697, taxPct: 25, patCr: 22290, epsDiluted: 13.78 },
    { period: 'Mar 2026', salesCr: 294059, expensesCr: 249918, operatingProfitCr: 44141, opmPct: 15, otherIncome: 4447, interest: 6585, depreciation: 14808, pbt: 27195, taxPct: 24, patCr: 20589, epsDiluted: 12.54 },
    { period: 'Jun 2026', salesCr: 309468, expensesCr: 261951, operatingProfitCr: 47517, opmPct: 15, otherIncome: 6550, interest: 8337, depreciation: 15100, pbt: 30630, taxPct: 25, patCr: 23196, epsDiluted: 15.48 },
  ],
  profitAndLoss: {
    headers: ['', 'Mar 2016', 'Mar 2017', 'Mar 2018', 'Mar 2019', 'Mar 2020', 'Mar 2021', 'Mar 2022', 'Mar 2023', 'Mar 2024', 'Mar 2025', 'Mar 2026', 'TTM'],
    rows: [
      { label: 'Sales', values: ['272,583', '303,954', '390,823', '568,337', '596,679', '466,307', '694,673', '876,396', '899,041', '962,820', '1,055,780', '1,123,055'] },
      { label: 'Expenses', values: ['230,802', '257,647', '326,508', '484,087', '507,413', '385,517', '586,092', '734,078', '736,543', '797,222', '876,715', '939,494'] },
      { label: 'Operating Profit', values: ['41,781', '46,307', '64,315', '84,250', '89,266', '80,790', '108,581', '142,318', '162,498', '165,598', '179,065', '183,561'] },
      { label: 'OPM %', values: ['15%', '15%', '16%', '15%', '15%', '17%', '16%', '16%', '18%', '17%', '17%', '16%'] },
      { label: 'Other Income', values: ['12,212', '9,222', '9,869', '8,406', '8,570', '22,432', '19,600', '12,020', '15,792', '17,824', '28,846', '20,393'] },
      { label: 'Interest', values: ['3,691', '3,849', '8,052', '16,495', '22,027', '21,189', '14,584', '19,571', '23,118', '24,269', '27,061', '28,362'] },
      { label: 'Depreciation', values: ['11,565', '11,646', '16,706', '20,934', '22,203', '26,572', '29,782', '40,303', '50,832', '53,136', '57,688', '58,946'] },
      { label: 'Profit before tax', values: ['38,737', '40,034', '49,426', '55,227', '53,606', '55,461', '83,815', '94,464', '104,340', '106,017', '123,162', '116,646'] },
      { label: 'Tax %', values: ['23%', '25%', '27%', '28%', '26%', '3%', '19%', '22%', '25%', '24%', '22%', ''] },
      { label: 'Net Profit', values: ['29,861', '29,833', '36,080', '39,837', '39,880', '53,739', '67,845', '74,088', '79,020', '81,309', '95,754', '88,167'] },
      { label: 'EPS in Rs', values: ['21.51', '21.55', '26.69', '29.28', '29.10', '38.75', '44.87', '49.29', '51.45', '51.47', '59.69', '55.22'] },
      { label: 'Dividend Payout %', values: ['10%', '11%', '10%', '10%', '10%', '9%', '9%', '9%', '10%', '11%', '10%', ''] },
    ],
  },
  balanceSheet: {
    headers: ['', 'Mar 2016', 'Mar 2017', 'Mar 2018', 'Mar 2019', 'Mar 2020', 'Mar 2021', 'Mar 2022', 'Mar 2023', 'Mar 2024', 'Mar 2025', 'Mar 2026'],
    rows: [
      { label: 'Equity Capital', values: ['2,948', '2,959', '5,922', '5,926', '6,339', '6,445', '6,765', '6,766', '6,766', '13,532', '13,532'] },
      { label: 'Reserves', values: ['228,608', '260,750', '287,584', '381,186', '442,827', '693,727', '772,720', '709,106', '786,715', '829,668', '890,498'] },
      { label: 'Borrowings', values: ['194,714', '217,475', '239,843', '307,714', '355,133', '278,962', '319,158', '451,664', '350,719', '374,313', '402,962'] },
      { label: 'Other Liabilities', values: ['172,727', '225,618', '277,924', '302,804', '358,716', '340,931', '399,979', '438,346', '610,848', '732,200', '870,554'] },
      { label: 'Total Liabilities', values: ['598,997', '706,802', '811,273', '997,630', '1,163,015', '1,320,065', '1,498,622', '1,605,882', '1,755,048', '1,949,713', '2,177,546'] },
      { label: 'Fixed Assets', values: ['184,910', '198,526', '403,885', '398,374', '532,658', '541,258', '627,798', '724,805', '779,985', '999,393', '1,124,795'] },
      { label: 'CWIP', values: ['228,697', '324,837', '187,022', '179,463', '109,106', '125,953', '172,506', '293,752', '338,855', '262,358', '237,686'] },
      { label: 'Investments', values: ['84,015', '82,899', '82,862', '235,635', '276,767', '364,828', '394,264', '235,560', '225,672', '242,381', '248,332'] },
      { label: 'Other Assets', values: ['101,375', '100,540', '137,504', '184,158', '244,484', '288,026', '304,054', '351,765', '410,536', '445,581', '566,733'] },
      { label: 'Total Assets', values: ['598,997', '706,802', '811,273', '997,630', '1,163,015', '1,320,065', '1,498,622', '1,605,882', '1,755,048', '1,949,713', '2,177,546'] },
    ],
  },
  cashFlow: {
    headers: ['', 'Mar 2016', 'Mar 2017', 'Mar 2018', 'Mar 2019', 'Mar 2020', 'Mar 2021', 'Mar 2022', 'Mar 2023', 'Mar 2024', 'Mar 2025', 'Mar 2026'],
    rows: [
      { label: 'Cash from Operating Activity', values: ['38,134', '49,550', '71,459', '42,346', '94,877', '26,958', '110,654', '115,032', '158,788', '178,703', '192,113'] },
      { label: 'Cash from Investing Activity', values: ['-36,186', '-66,201', '-68,192', '-94,507', '-72,497', '-142,385', '-109,162', '-93,001', '-113,581', '-137,535', '-101,089'] },
      { label: 'Cash from Financing Activity', values: ['-3,210', '8,617', '-2,001', '55,906', '-2,541', '101,904', '17,289', '10,455', '-16,646', '-31,891', '-51,549'] },
      { label: 'Net Cash Flow', values: ['-1,262', '-8,034', '1,266', '3,745', '19,839', '-13,523', '18,781', '32,486', '28,561', '9,277', '39,475'] },
    ],
  },
  ratios: {
    headers: ['', 'Mar 2016', 'Mar 2017', 'Mar 2018', 'Mar 2019', 'Mar 2020', 'Mar 2021', 'Mar 2022', 'Mar 2023', 'Mar 2024', 'Mar 2025', 'Mar 2026'],
    rows: [
      { label: 'Debtor Days', values: ['6', '10', '16', '19', '12', '15', '12', '12', '13', '16', '20'] },
      { label: 'Inventory Days', values: ['90', '84', '83', '63', '67', '102', '83', '87', '95', '85', '88'] },
      { label: 'Days Payable', values: ['117', '132', '146', '100', '87', '136', '123', '91', '111', '108', '84'] },
      { label: 'Cash Conversion Cycle', values: ['-21', '-39', '-47', '-18', '-8', '-19', '-28', '8', '-3', '-7', '24'] },
      { label: 'Working Capital Days', values: ['-30', '-52', '-49', '-24', '-15', '-20', '-40', '-3', '-9', '-9', '17'] },
      { label: 'ROCE %', values: ['10%', '10%', '10%', '9%', '8%', '7%', '9%', '9%', '9%', '8%', '10%'] },
    ],
  },
  shareholding: [
    { category: 'Promoters', quarters: [{ period: 'Sep 2024', pct: 50.24 }, { period: 'Dec 2024', pct: 50.13 }, { period: 'Mar 2025', pct: 50.10 }, { period: 'Jun 2025', pct: 50.33 }, { period: 'Sep 2025', pct: 50.30 }, { period: 'Dec 2025', pct: 50.47 }, { period: 'Mar 2026', pct: 50.49 }, { period: 'Jun 2026', pct: 50.52 }] },
    { category: 'FIIs', quarters: [{ period: 'Sep 2024', pct: 21.30 }, { period: 'Dec 2024', pct: 19.16 }, { period: 'Mar 2025', pct: 19.07 }, { period: 'Jun 2025', pct: 19.90 }, { period: 'Sep 2025', pct: 20.14 }, { period: 'Dec 2025', pct: 20.85 }, { period: 'Mar 2026', pct: 21.42 }, { period: 'Jun 2026', pct: 21.84 }] },
    { category: 'DIIs', quarters: [{ period: 'Sep 2024', pct: 15.46 }, { period: 'Dec 2024', pct: 17.93 }, { period: 'Mar 2025', pct: 18.09 }, { period: 'Jun 2025', pct: 17.68 }, { period: 'Sep 2025', pct: 17.40 }, { period: 'Dec 2025', pct: 16.85 }, { period: 'Mar 2026', pct: 17.10 }, { period: 'Jun 2026', pct: 17.42 }] },
    { category: 'Public', quarters: [{ period: 'Sep 2024', pct: 13.00 }, { period: 'Dec 2024', pct: 12.78 }, { period: 'Mar 2025', pct: 12.74 }, { period: 'Jun 2025', pct: 12.09 }, { period: 'Sep 2025', pct: 12.16 }, { period: 'Dec 2025', pct: 11.83 }, { period: 'Mar 2026', pct: 10.99 }, { period: 'Jun 2026', pct: 10.22 }] },
  ],
  sampleClaims: [
    { label: 'Ed-a-Mamma 51% Stake Acquisition', claim: 'Reliance Retail Ventures acquired a 51% majority stake in Ed-a-Mamma for ₹350 Crore.', type: 'TRUE' },
    { label: 'Fabricated Secret Oil Concession Rumor', claim: 'Reliance Industries signed secret ₹2,50,000 Crore crude oil concession with Saudi Aramco! Guaranteed 25% upper circuit tomorrow!', type: 'UNSUBSTANTIATED' },
    { label: 'Jio 475M+ Subscribers', claim: 'Jio Platforms now serves over 475 million wireless subscribers across India.', type: 'TRUE' },
  ],
};

// ═══════════════════════════════════════════════════════════════════════════
//  TATA POWER COMPANY LTD – BSE: 500400 | NSE: TATAPOWER
// ═══════════════════════════════════════════════════════════════════════════
const TATAPOWER: CompanyData = {
  id: 'TATAPOWER', ticker: 'TATAPOWER', name: 'Tata Power Company Ltd',
  exchange: 'NSE: TATAPOWER | BSE: 500400', bseCode: '500400', nseSymbol: 'TATAPOWER',
  price: 350, changePercent: -0.87, changeAmount: -3.05, closeDate: '01 Oct - close price',
  website: 'tatapower.com', logoBg: 'bg-blue-600',
  marketCapCr: 111885, pe: 28.6, high52: 465, low52: 342, bookValue: 124,
  dividendYield: 0.71, roce: 10.5, roe: 10.2, faceValue: 1.0,
  about: "Tata Power Company Ltd is primarily involved in the business of the generation, transmission and distribution of electricity. It aims to produce electricity completely through renewable sources. It also manufactures solar roofs and plans to build 1 lakh ev charging stations by 2025. The company is India's largest vertically-integrated power company.",
  keyPoints: [
    'Renewable Energy: TPREL developing major solar and FDRE projects across Rajasthan and Gujarat with 5,500+ MW portfolio.',
    'SJVN 200 MW FDRE Contract: Received official Letter of Award valued at ₹1,250 Crore under Reg 30.',
    'Distribution Reach: Serves over 12 million consumer connections across Mumbai, Delhi, and Odisha.',
    'EV Charging: Operating 100,000+ EV charging points across India making it the largest network.',
  ],
  chartData: {
    '1M': [
      { x: '02 Sep', y: 368, volume: 155 }, { x: '09 Sep', y: 362, volume: 142 },
      { x: '16 Sep', y: 355, volume: 168 }, { x: '23 Sep', y: 348, volume: 175 },
      { x: '01 Oct', y: 350, volume: 163 },
    ],
    '6M': [
      { x: 'Apr', y: 388, volume: 178 }, { x: 'May', y: 398, volume: 195 },
      { x: 'Jun', y: 412, volume: 210 }, { x: 'Jul', y: 405, volume: 188 },
      { x: 'Aug', y: 375, volume: 165 }, { x: 'Sep', y: 355, volume: 168 },
      { x: 'Oct', y: 350, volume: 163 },
    ],
    '1Yr': [
      { x: 'Oct 25', y: 392, volume: 180 }, { x: 'Dec 25', y: 405, volume: 198 },
      { x: 'Feb 26', y: 435, volume: 225 }, { x: 'Apr 26', y: 388, volume: 178 },
      { x: 'Jun 26', y: 412, volume: 210 }, { x: 'Aug 26', y: 375, volume: 165 },
      { x: 'Oct 26', y: 350, volume: 163 },
    ],
    '3Yr': [
      { x: 'Dec 23', y: 332, volume: 195 }, { x: 'Jun 24', y: 440, volume: 245 },
      { x: 'Dec 24', y: 392, volume: 210 }, { x: 'Jun 25', y: 380, volume: 195 },
      { x: 'Dec 25', y: 405, volume: 198 }, { x: 'Oct 26', y: 350, volume: 163 },
    ],
    '5Yr': [
      { x: '2021', y: 221, volume: 285 }, { x: '2022', y: 208, volume: 260 },
      { x: '2023', y: 332, volume: 235 }, { x: '2024', y: 392, volume: 210 },
      { x: '2025', y: 380, volume: 195 }, { x: '2026', y: 350, volume: 163 },
    ],
    Max: [
      { x: '2015', y: 68, volume: 95 }, { x: '2016', y: 76, volume: 110 },
      { x: '2017', y: 94, volume: 125 }, { x: '2018', y: 77, volume: 105 },
      { x: '2019', y: 57, volume: 85 }, { x: '2020', y: 76, volume: 135 },
      { x: '2021', y: 221, volume: 285 }, { x: '2022', y: 208, volume: 260 },
      { x: '2023', y: 332, volume: 235 }, { x: '2024', y: 392, volume: 210 },
      { x: '2025', y: 380, volume: 195 }, { x: '2026', y: 350, volume: 163 },
    ],
  },
  peers: [
    { name: 'Tata Power', cmp: 350, pe: 28.6, marCapCr: 111885, divYield: 0.71, roce: 10.5 },
    { name: 'NTPC Ltd', cmp: 323, pe: 10.9, marCapCr: 313000, divYield: 2.48, roce: 11.8 },
    { name: 'Adani Power', cmp: 508, pe: 27.5, marCapCr: 195700, divYield: 0.0, roce: 22.4 },
    { name: 'JSW Energy', cmp: 530, pe: 39.2, marCapCr: 92400, divYield: 0.38, roce: 9.6 },
    { name: 'Adani Green Energy', cmp: 1058, pe: 112, marCapCr: 167800, divYield: 0.0, roce: 8.2 },
  ],
  quarters: [
    { period: 'Sep 2025', salesCr: 15545, expensesCr: 12243, operatingProfitCr: 3302, opmPct: 21, otherIncome: 859, interest: 1319, depreciation: 1162, pbt: 1680, taxPct: 26, patCr: 1245, epsDiluted: 2.88 },
    { period: 'Dec 2025', salesCr: 13948, expensesCr: 10894, operatingProfitCr: 3055, opmPct: 22, otherIncome: 1056, interest: 1364, depreciation: 1208, pbt: 1540, taxPct: 22, patCr: 1194, epsDiluted: 2.42 },
    { period: 'Mar 2026', salesCr: 14900, expensesCr: 12301, operatingProfitCr: 2599, opmPct: 17, otherIncome: 1773, interest: 1295, depreciation: 1280, pbt: 1797, taxPct: 21, patCr: 1416, epsDiluted: 3.12 },
    { period: 'Jun 2026', salesCr: 19051, expensesCr: 15191, operatingProfitCr: 3860, opmPct: 20, otherIncome: 630, interest: 1407, depreciation: 1260, pbt: 1823, taxPct: 23, patCr: 1401, epsDiluted: 3.68 },
  ],
  profitAndLoss: {
    headers: ['', 'Mar 2016', 'Mar 2017', 'Mar 2018', 'Mar 2019', 'Mar 2020', 'Mar 2021', 'Mar 2022', 'Mar 2023', 'Mar 2024', 'Mar 2025', 'Mar 2026', 'TTM'],
    rows: [
      { label: 'Sales', values: ['29,494', '27,588', '26,840', '29,881', '29,136', '32,703', '42,816', '55,109', '61,449', '65,478', '62,429', '63,445'] },
      { label: 'Expenses', values: ['27,389', '22,114', '21,833', '23,449', '22,331', '25,782', '35,785', '47,381', '50,714', '53,029', '49,157', '50,629'] },
      { label: 'Operating Profit', values: ['2,105', '5,473', '5,007', '6,432', '6,805', '6,921', '7,031', '7,728', '10,735', '12,450', '13,271', '12,816'] },
      { label: 'OPM %', values: ['7%', '20%', '19%', '22%', '23%', '21%', '16%', '14%', '17%', '19%', '21%', '20%'] },
      { label: 'Other Income', values: ['4,060', '1,297', '3,873', '3,824', '2,280', '1,775', '2,486', '5,540', '3,416', '2,689', '3,433', '4,318'] },
      { label: 'Interest', values: ['3,236', '3,365', '3,761', '4,170', '4,494', '4,010', '3,859', '4,372', '4,633', '4,702', '5,257', '5,384'] },
      { label: 'Depreciation', values: ['1,649', '1,956', '2,346', '2,393', '2,634', '2,745', '3,122', '3,439', '3,786', '4,117', '4,811', '4,910'] },
      { label: 'Profit before tax', values: ['1,281', '1,450', '2,773', '3,693', '1,958', '1,941', '2,535', '5,457', '5,732', '6,320', '6,636', '6,840'] },
      { label: 'Tax %', values: ['53%', '24%', '6%', '29%', '33%', '26%', '15%', '30%', '25%', '24%', '23%', ''] },
      { label: 'Net Profit', values: ['786', '1,100', '2,611', '2,606', '1,316', '1,439', '2,156', '3,810', '4,280', '4,775', '5,118', '5,256'] },
      { label: 'EPS in Rs', values: ['2.45', '3.31', '8.90', '8.71', '3.76', '3.53', '5.45', '10.44', '11.57', '12.43', '11.73', '12.10'] },
      { label: 'Dividend Payout %', values: ['53%', '39%', '15%', '15%', '41%', '44%', '32%', '19%', '17%', '18%', '21%', ''] },
    ],
  },
  balanceSheet: {
    headers: ['', 'Mar 2016', 'Mar 2017', 'Mar 2018', 'Mar 2019', 'Mar 2020', 'Mar 2021', 'Mar 2022', 'Mar 2023', 'Mar 2024', 'Mar 2025', 'Mar 2026'],
    rows: [
      { label: 'Equity Capital', values: ['270', '270', '270', '270', '270', '320', '320', '320', '320', '320', '320'] },
      { label: 'Reserves', values: ['11,363', '12,944', '16,129', '18,035', '19,296', '22,003', '22,122', '28,468', '32,036', '35,521', '39,148'] },
      { label: 'Borrowings', values: ['38,849', '48,815', '48,589', '48,506', '51,936', '46,708', '51,195', '52,923', '53,689', '62,866', '76,141'] },
      { label: 'Other Liabilities', values: ['19,575', '20,799', '16,903', '17,262', '18,172', '29,625', '38,913', '46,386', '53,010', '57,487', '58,956'] },
      { label: 'Total Liabilities', values: ['70,057', '82,829', '81,892', '84,073', '89,674', '98,655', '112,550', '128,096', '139,054', '156,193', '174,564'] },
      { label: 'Fixed Assets', values: ['36,414', '46,595', '44,656', '44,305', '47,666', '52,179', '57,389', '61,747', '67,210', '78,374', '87,293'] },
      { label: 'CWIP', values: ['1,345', '2,178', '1,653', '2,576', '1,612', '3,270', '4,635', '5,376', '11,561', '12,679', '14,595'] },
      { label: 'Investments', values: ['11,785', '11,873', '12,429', '13,542', '14,535', '13,149', '14,160', '16,670', '16,316', '16,316', '16,575'] },
      { label: 'Other Assets', values: ['20,513', '22,184', '23,154', '23,651', '25,861', '30,056', '36,365', '44,303', '43,968', '48,824', '56,102'] },
      { label: 'Total Assets', values: ['70,057', '82,829', '81,892', '84,073', '89,674', '98,655', '112,550', '128,096', '139,054', '156,193', '174,564'] },
    ],
  },
  cashFlow: {
    headers: ['', 'Mar 2016', 'Mar 2017', 'Mar 2018', 'Mar 2019', 'Mar 2020', 'Mar 2021', 'Mar 2022', 'Mar 2023', 'Mar 2024', 'Mar 2025', 'Mar 2026'],
    rows: [
      { label: 'Cash from Operating Activity', values: ['7,415', '7,014', '6,364', '4,574', '7,375', '8,345', '6,693', '7,166', '12,504', '12,680', '5,993'] },
      { label: 'Cash from Investing Activity', values: ['-1,805', '-7,373', '-1,512', '-272', '-493', '993', '-6,250', '-7,263', '-8,935', '-15,436', '-14,129'] },
      { label: 'Cash from Financing Activity', values: ['-6,183', '937', '-4,726', '-5,184', '-5,110', '-7,603', '-1,183', '1,341', '-4,497', '4,292', '7,783'] },
      { label: 'Net Cash Flow', values: ['-574', '579', '126', '-883', '1,773', '1,736', '-741', '1,243', '-928', '1,536', '-353'] },
    ],
  },
  ratios: {
    headers: ['', 'Mar 2016', 'Mar 2017', 'Mar 2018', 'Mar 2019', 'Mar 2020', 'Mar 2021', 'Mar 2022', 'Mar 2023', 'Mar 2024', 'Mar 2025', 'Mar 2026'],
    rows: [
      { label: 'Debtor Days', values: ['44', '51', '38', '54', '55', '58', '51', '46', '44', '32', '26'] },
      { label: 'Inventory Days', values: ['', '', '', '', '', '', '', '', '', '', ''] },
      { label: 'Days Payable', values: ['', '', '', '', '', '', '', '', '', '', ''] },
      { label: 'Cash Conversion Cycle', values: ['', '', '', '', '', '', '', '', '', '', ''] },
      { label: 'Working Capital Days', values: ['-30', '-56', '-14', '-4', '-17', '-14', '33', '43', '33', '21', '43'] },
      { label: 'ROCE %', values: ['6%', '6%', '7%', '10%', '6%', '7%', '7%', '9%', '10%', '10%', '10%'] },
    ],
  },
  shareholding: [
    { category: 'Promoters', quarters: [{ period: 'Sep 2024', pct: 46.86 }, { period: 'Dec 2024', pct: 46.86 }, { period: 'Mar 2025', pct: 46.86 }, { period: 'Jun 2025', pct: 46.86 }, { period: 'Sep 2025', pct: 46.86 }, { period: 'Dec 2025', pct: 46.86 }, { period: 'Mar 2026', pct: 46.86 }, { period: 'Jun 2026', pct: 46.86 }] },
    { category: 'FIIs', quarters: [{ period: 'Sep 2024', pct: 9.15 }, { period: 'Dec 2024', pct: 9.45 }, { period: 'Mar 2025', pct: 9.38 }, { period: 'Jun 2025', pct: 9.82 }, { period: 'Sep 2025', pct: 10.15 }, { period: 'Dec 2025', pct: 10.68 }, { period: 'Mar 2026', pct: 10.92 }, { period: 'Jun 2026', pct: 11.24 }] },
    { category: 'DIIs', quarters: [{ period: 'Sep 2024', pct: 16.98 }, { period: 'Dec 2024', pct: 17.42 }, { period: 'Mar 2025', pct: 17.25 }, { period: 'Jun 2025', pct: 16.85 }, { period: 'Sep 2025', pct: 16.45 }, { period: 'Dec 2025', pct: 15.92 }, { period: 'Mar 2026', pct: 15.80 }, { period: 'Jun 2026', pct: 15.68 }] },
    { category: 'Public', quarters: [{ period: 'Sep 2024', pct: 27.01 }, { period: 'Dec 2024', pct: 26.27 }, { period: 'Mar 2025', pct: 26.51 }, { period: 'Jun 2025', pct: 26.47 }, { period: 'Sep 2025', pct: 26.54 }, { period: 'Dec 2025', pct: 26.54 }, { period: 'Mar 2026', pct: 26.42 }, { period: 'Jun 2026', pct: 26.22 }] },
  ],
  sampleClaims: [
    { label: 'Authentic SJVN Letter of Award', claim: 'Tata Power subsidiary TPREL received Letter of Award from SJVN for 200 MW FDRE project valued at ₹1,250 Crore.', type: 'TRUE' },
    { label: '10x Solar Contract Exaggeration', claim: 'Tata Power signed secret ₹12,500 Crore mega solar contract with Government of India! Guaranteed upper circuit 20%!', type: 'EXAGGERATED' },
    { label: 'EV Charging Leadership', claim: 'Tata Power operates over 100,000 EV charging points across India, the largest network in the country.', type: 'TRUE' },
  ],
};

// ═══════════════════════════════════════════════════════════════════════════
//  AWL AGRI BUSINESS LTD (ADANI WILMAR) – BSE: 543458 | NSE: AWL
// ═══════════════════════════════════════════════════════════════════════════
const AWL: CompanyData = {
  id: 'AWL', ticker: 'AWL', name: 'AWL Agri Business Ltd',
  exchange: 'NSE: AWL | BSE: 543458', bseCode: '543458', nseSymbol: 'AWL',
  price: 175, changePercent: -1.27, changeAmount: -2.25, closeDate: '01 Oct - close price',
  website: 'adaniwilmar.com', logoBg: 'bg-emerald-700',
  marketCapCr: 22800, pe: 19.4, high52: 283, low52: 171, bookValue: 80.3,
  dividendYield: 0.57, roce: 18.3, roe: 10.7, faceValue: 1.0,
  about: "Incorporated in 1999, Adani Wilmar Ltd deals in edible oil and food and other FMCG products. Adani has exited the joint venture in FY24 to focus on other segments. AWL Agri Business is the new identity continuing market leadership in edible oils and packaged staples.",
  keyPoints: [
    "Business Segments: 1) Edible Oil [1] Offers sunflower oil, mustard oil, soya oil under Fortune brand.",
    "Packaged Food Growth: Expanding wheat flour (atta), basmati rice, pulses, and ready-to-cook food products.",
    "Distribution Reach: Direct coverage of 1.7+ million retail outlets across India.",
  ],
  chartData: {
    '1M': [
      { x: '02 Sep', y: 195, volume: 95 }, { x: '09 Sep', y: 190, volume: 110 },
      { x: '16 Sep', y: 184, volume: 125 }, { x: '23 Sep', y: 179, volume: 140 },
      { x: '01 Oct', y: 175, volume: 115 },
    ],
    '6M': [
      { x: 'Apr', y: 245, volume: 120 }, { x: 'May', y: 232, volume: 115 },
      { x: 'Jun', y: 218, volume: 135 }, { x: 'Jul', y: 205, volume: 145 },
      { x: 'Aug', y: 192, volume: 160 }, { x: 'Sep', y: 182, volume: 130 },
      { x: 'Oct', y: 175, volume: 115 },
    ],
    '1Yr': [
      { x: 'Oct 25', y: 268, volume: 95 }, { x: 'Nov 25', y: 283, volume: 110 },
      { x: 'Dec 25', y: 275, volume: 85 }, { x: 'Jan 26', y: 252, volume: 125 },
      { x: 'Mar 26', y: 235, volume: 118 }, { x: 'May 26', y: 218, volume: 140 },
      { x: 'Jul 26', y: 198, volume: 135 }, { x: 'Sep 26', y: 182, volume: 110 },
      { x: 'Oct 26', y: 175, volume: 115 },
    ],
    '3Yr': [
      { x: 'Dec 23', y: 395, volume: 180 }, { x: 'Jun 24', y: 340, volume: 160 },
      { x: 'Dec 24', y: 310, volume: 140 }, { x: 'Jun 25', y: 283, volume: 110 },
      { x: 'Dec 25', y: 235, volume: 125 }, { x: 'Oct 26', y: 175, volume: 115 },
    ],
    '5Yr': [
      { x: '2022', y: 380, volume: 220 }, { x: '2023', y: 410, volume: 195 },
      { x: '2024', y: 340, volume: 160 }, { x: '2025', y: 283, volume: 120 },
      { x: '2026', y: 175, volume: 115 },
    ],
    Max: [
      { x: '2022', y: 227, volume: 280 }, { x: '2022 H2', y: 840, volume: 350 },
      { x: '2023', y: 410, volume: 195 }, { x: '2024', y: 340, volume: 160 },
      { x: '2025', y: 283, volume: 120 }, { x: '2026', y: 175, volume: 115 },
    ],
  },
  peers: [
    { name: 'Marico', cmp: 781.35, pe: 53.81, marCapCr: 101591, divYield: 0.51, roce: 47.05 },
    { name: 'Patanjali Foods', cmp: 355.15, pe: 17.81, marCapCr: 38644, divYield: 1.41, roce: 12.07 },
    { name: 'AWL Agri Busine.', cmp: 175.43, pe: 19.41, marCapCr: 22800, divYield: 0.57, roce: 18.28 },
    { name: 'Gokul Agro', cmp: 210.10, pe: 14.75, marCapCr: 6200, divYield: 0.00, roce: 36.69 },
    { name: 'CIAN Agro', cmp: 1015.75, pe: 8.82, marCapCr: 2843, divYield: 0.00, roce: 12.27 },
    { name: 'Shri Venkatesh', cmp: 679.00, pe: 39.32, marCapCr: 1502, divYield: 0.15, roce: 19.78 },
    { name: 'KN Agri Resource', cmp: 200.50, pe: 14.06, marCapCr: 501, divYield: 0.00, roce: 13.64 },
  ],
  quarters: [
    { period: 'Jun 2025', salesCr: 14169, expensesCr: 13745, operatingProfitCr: 424, opmPct: 3, otherIncome: 35, interest: 182, depreciation: 98, pbt: 179, taxPct: 27, patCr: 131, epsDiluted: 1.01 },
    { period: 'Sep 2025', salesCr: 14460, expensesCr: 14032, operatingProfitCr: 428, opmPct: 3, otherIncome: 42, interest: 186, depreciation: 101, pbt: 183, taxPct: 26, patCr: 135, epsDiluted: 1.04 },
    { period: 'Dec 2025', salesCr: 15138, expensesCr: 14618, operatingProfitCr: 520, opmPct: 3, otherIncome: 65, interest: 178, depreciation: 105, pbt: 302, taxPct: 28, patCr: 217, epsDiluted: 1.67 },
    { period: 'Mar 2026', salesCr: 20048, expensesCr: 19320, operatingProfitCr: 728, opmPct: 4, otherIncome: 88, interest: 161, depreciation: 111, pbt: 544, taxPct: 27, patCr: 397, epsDiluted: 3.05 },
  ],
  profitAndLoss: {
    headers: ['', 'Mar 2019', 'Mar 2020', 'Mar 2021', 'Mar 2022', 'Mar 2023', 'Mar 2024', 'Mar 2025', 'Mar 2026', 'TTM'],
    rows: [
      { label: 'Sales', values: ['28,797', '29,657', '37,090', '54,155', '58,185', '51,225', '63,672', '74,731', '77,720'] },
      { label: 'Expenses', values: ['27,666', '28,348', '35,765', '52,418', '57,223', '50,090', '61,186', '72,600', '75,262'] },
      { label: 'Operating Profit', values: ['1,131', '1,310', '1,326', '1,736', '962', '1,135', '2,486', '2,131', '2,458'] },
      { label: 'OPM %', values: ['3.9%', '4.4%', '3.6%', '3.2%', '1.6%', '2.2%', '3.9%', '2.9%', '3.2%'] },
      { label: 'Other Income', values: ['122', '110', '104', '172', '961', '240', '233', '392', '298'] },
      { label: 'Interest', values: ['487', '569', '407', '541', '775', '749', '724', '707', '734'] },
      { label: 'Depreciation', values: ['199', '241', '268', '309', '358', '364', '395', '449', '463'] },
      { label: 'Profit before tax', values: ['567', '609', '755', '1,059', '789', '262', '1,601', '1,367', '1,559'] },
      { label: 'Tax %', values: ['37%', '34%', '14%', '27%', '30%', '35%', '27%', '28%', ''] },
      { label: 'Net Profit', values: ['376', '461', '729', '804', '582', '148', '1,226', '1,045', '1,158'] },
      { label: 'EPS in Rs', values: ['32.86', '40.32', '63.74', '6.18', '4.48', '1.14', '9.43', '8.04', '8.90'] },
      { label: 'Dividend Payout %', values: ['0%', '0%', '0%', '0%', '0%', '0%', '0%', '12%', ''] },
    ],
  },
  balanceSheet: {
    headers: ['', 'Mar 2021', 'Mar 2022', 'Mar 2023', 'Mar 2024', 'Mar 2025', 'Mar 2026'],
    rows: [
      { label: 'Equity Capital', values: ['114', '130', '130', '130', '130', '130'] },
      { label: 'Reserves', values: ['3,212', '7,488', '7,987', '8,124', '9,348', '10,314'] },
      { label: 'Borrowings', values: ['2,145', '2,890', '3,124', '2,654', '2,410', '2,180'] },
      { label: 'Other Liabilities', values: ['3,450', '4,120', '4,890', '5,120', '5,640', '6,100'] },
      { label: 'Total Liabilities', values: ['8,921', '14,628', '16,131', '16,028', '17,528', '18,724'] },
      { label: 'Fixed Assets', values: ['3,410', '4,120', '4,650', '5,120', '5,890', '6,450'] },
      { label: 'CWIP', values: ['450', '680', '890', '620', '410', '350'] },
      { label: 'Investments', values: ['210', '240', '250', '290', '310', '340'] },
      { label: 'Other Assets', values: ['4,851', '9,588', '10,341', '9,998', '10,918', '11,584'] },
      { label: 'Total Assets', values: ['8,921', '14,628', '16,131', '16,028', '17,528', '18,724'] },
    ],
  },
  cashFlow: {
    headers: ['', 'Mar 2021', 'Mar 2022', 'Mar 2023', 'Mar 2024', 'Mar 2025', 'Mar 2026'],
    rows: [
      { label: 'Cash from Operating Activity', values: ['1,124', '1,450', '-540', '1,890', '2,140', '2,450'] },
      { label: 'Cash from Investing Activity', values: ['-650', '-1,120', '-980', '-850', '-920', '-1,050'] },
      { label: 'Cash from Financing Activity', values: ['-410', '2,850', '-420', '-890', '-940', '-980'] },
      { label: 'Net Cash Flow', values: ['64', '3,180', '-1,940', '150', '280', '420'] },
    ],
  },
  ratios: {
    headers: ['', 'Mar 2021', 'Mar 2022', 'Mar 2023', 'Mar 2024', 'Mar 2025', 'Mar 2026'],
    rows: [
      { label: 'Debtor Days', values: ['21', '24', '26', '22', '20', '19'] },
      { label: 'Inventory Days', values: ['65', '71', '68', '62', '58', '54'] },
      { label: 'Days Payable', values: ['45', '48', '51', '46', '44', '42'] },
      { label: 'Cash Conversion Cycle', values: ['41', '47', '43', '38', '34', '31'] },
      { label: 'Working Capital Days', values: ['35', '41', '38', '32', '29', '26'] },
      { label: 'ROCE %', values: ['19%', '21%', '14%', '15%', '18%', '18%'] },
    ],
  },
  shareholding: [
    { category: 'Promoters', quarters: [{ period: 'Sep 2025', pct: 87.87 }, { period: 'Dec 2025', pct: 87.87 }, { period: 'Mar 2026', pct: 87.87 }, { period: 'Jun 2026', pct: 87.87 }] },
    { category: 'FIIs', quarters: [{ period: 'Sep 2025', pct: 0.65 }, { period: 'Dec 2025', pct: 0.72 }, { period: 'Mar 2026', pct: 0.81 }, { period: 'Jun 2026', pct: 0.94 }] },
    { category: 'DIIs', quarters: [{ period: 'Sep 2025', pct: 0.12 }, { period: 'Dec 2025', pct: 0.14 }, { period: 'Mar 2026', pct: 0.16 }, { period: 'Jun 2026', pct: 0.18 }] },
    { category: 'Public', quarters: [{ period: 'Sep 2025', pct: 11.36 }, { period: 'Dec 2025', pct: 11.27 }, { period: 'Mar 2026', pct: 11.16 }, { period: 'Jun 2026', pct: 11.01 }] },
  ],
  sampleClaims: [
    { label: 'Joint Venture Exit', claim: 'Adani group completed exit from Wilmar joint venture in FY24 to streamline focus on core infrastructure.', type: 'TRUE' },
    { label: 'Edible Oil Market Leadership', claim: 'AWL commands over 19% domestic market share in branded edible oils with Fortune brand.', type: 'TRUE' },
  ],
};

// ═══════════════════════════════════════════════════════════════════════════
//  ALL E TECHNOLOGIES LTD – NSE - SME: ALLETEC
// ═══════════════════════════════════════════════════════════════════════════
const ALLETEC: CompanyData = {
  id: 'ALLETEC', ticker: 'ALLETEC', name: 'All E Technologies Ltd',
  exchange: 'NSE - SME: ALLETEC', bseCode: '—', nseSymbol: 'ALLETEC',
  price: 123, changePercent: 0.37, changeAmount: 0.45, closeDate: '01 Oct - close price',
  website: 'alletec.com', logoBg: 'bg-purple-600',
  marketCapCr: 248, pe: 9.74, high52: 277, low52: 116, bookValue: 83.6,
  dividendYield: 1.22, roce: 22.1, roe: 17.0, faceValue: 10.0,
  about: "Incorporated in 2000, All E Technologies Ltd provides technology based business solutions to various companies[1]",
  keyPoints: [
    "Business Overview:[1][2][3] AET streamlines and automates core business processes with Product Based solutions built on Microsoft Dynamics ERP, CRM and Power Platform.",
    "Global Client Base: Serves clients in USA, Europe, Africa, and Middle East with offshore development centers in India.",
  ],
  chartData: {
    '1M': [
      { x: '02 Sep', y: 128, volume: 15 }, { x: '09 Sep', y: 125, volume: 18 },
      { x: '16 Sep', y: 122, volume: 22 }, { x: '23 Sep', y: 121, volume: 19 },
      { x: '01 Oct', y: 123, volume: 17 },
    ],
    '6M': [
      { x: 'Apr', y: 165, volume: 28 }, { x: 'May', y: 155, volume: 24 },
      { x: 'Jun', y: 145, volume: 20 }, { x: 'Jul', y: 138, volume: 22 },
      { x: 'Aug', y: 130, volume: 19 }, { x: 'Sep', y: 124, volume: 18 },
      { x: 'Oct', y: 123, volume: 17 },
    ],
    '1Yr': [
      { x: 'Oct 25', y: 240, volume: 35 }, { x: 'Dec 25', y: 277, volume: 48 },
      { x: 'Feb 26', y: 225, volume: 32 }, { x: 'Apr 26', y: 165, volume: 28 },
      { x: 'Jun 26', y: 145, volume: 20 }, { x: 'Aug 26', y: 130, volume: 19 },
      { x: 'Oct 26', y: 123, volume: 17 },
    ],
    '3Yr': [
      { x: 'Dec 23', y: 88, volume: 15 }, { x: 'Jun 24', y: 135, volume: 25 },
      { x: 'Dec 24', y: 195, volume: 38 }, { x: 'Jun 25', y: 240, volume: 35 },
      { x: 'Dec 25', y: 277, volume: 48 }, { x: 'Oct 26', y: 123, volume: 17 },
    ],
    '5Yr': [
      { x: '2022', y: 55, volume: 12 }, { x: '2023', y: 88, volume: 15 },
      { x: '2024', y: 195, volume: 38 }, { x: '2025', y: 277, volume: 48 },
      { x: '2026', y: 123, volume: 17 },
    ],
    Max: [
      { x: '2022', y: 55, volume: 12 }, { x: '2023', y: 88, volume: 15 },
      { x: '2024', y: 195, volume: 38 }, { x: '2025', y: 277, volume: 48 },
      { x: '2026', y: 123, volume: 17 },
    ],
  },
  peers: [
    { name: 'All E Technologies', cmp: 123.00, pe: 9.74, marCapCr: 248, divYield: 1.22, roce: 22.1 },
    { name: 'KPIT Tech', cmp: 1420.00, pe: 58.2, marCapCr: 38900, divYield: 0.35, roce: 28.5 },
    { name: 'Tata Elxsi', cmp: 6850.00, pe: 52.1, marCapCr: 42600, divYield: 1.02, roce: 36.2 },
    { name: 'Coforge', cmp: 6420.00, pe: 46.8, marCapCr: 39500, divYield: 0.85, roce: 24.8 },
  ],
  quarters: [
    { period: 'Sep 2025', salesCr: 32.4, expensesCr: 24.8, operatingProfitCr: 7.6, opmPct: 23, otherIncome: 0.8, interest: 0.2, depreciation: 0.6, pbt: 7.6, taxPct: 24, patCr: 5.8, epsDiluted: 2.8 },
    { period: 'Dec 2025', salesCr: 34.8, expensesCr: 26.2, operatingProfitCr: 8.6, opmPct: 25, otherIncome: 0.9, interest: 0.2, depreciation: 0.7, pbt: 8.6, taxPct: 24, patCr: 6.5, epsDiluted: 3.1 },
    { period: 'Mar 2026', salesCr: 38.2, expensesCr: 28.9, operatingProfitCr: 9.3, opmPct: 24, otherIncome: 1.1, interest: 0.2, depreciation: 0.7, pbt: 9.5, taxPct: 25, patCr: 7.1, epsDiluted: 3.4 },
    { period: 'Jun 2026', salesCr: 41.5, expensesCr: 31.2, operatingProfitCr: 10.3, opmPct: 25, otherIncome: 1.2, interest: 0.3, depreciation: 0.8, pbt: 10.4, taxPct: 25, patCr: 7.8, epsDiluted: 3.7 },
  ],
  profitAndLoss: {
    headers: ['', 'Mar 2021', 'Mar 2022', 'Mar 2023', 'Mar 2024', 'Mar 2025', 'Mar 2026', 'TTM'],
    rows: [
      { label: 'Sales', values: ['58.2', '74.5', '98.4', '124.6', '146.9', '178.5', '192.4'] },
      { label: 'Expenses', values: ['46.8', '58.2', '76.1', '94.2', '111.4', '134.8', '145.2'] },
      { label: 'Operating Profit', values: ['11.4', '16.3', '22.3', '30.4', '35.5', '43.7', '47.2'] },
      { label: 'OPM %', values: ['20%', '22%', '23%', '24%', '24%', '24%', '25%'] },
      { label: 'Other Income', values: ['1.2', '1.5', '2.1', '2.8', '3.4', '4.2', '4.5'] },
      { label: 'Interest', values: ['0.4', '0.5', '0.6', '0.7', '0.8', '0.9', '1.0'] },
      { label: 'Depreciation', values: ['1.8', '2.1', '2.4', '2.7', '3.1', '3.5', '3.8'] },
      { label: 'Profit before tax', values: ['10.4', '15.2', '21.4', '29.8', '35.0', '43.5', '46.9'] },
      { label: 'Tax %', values: ['24%', '24%', '25%', '25%', '24%', '25%', ''] },
      { label: 'Net Profit', values: ['7.9', '11.5', '16.1', '22.4', '26.6', '32.6', '35.2'] },
      { label: 'EPS in Rs', values: ['3.8', '5.5', '7.7', '10.8', '12.8', '15.7', '16.9'] },
      { label: 'Dividend Payout %', values: ['12%', '14%', '15%', '15%', '16%', '15%', ''] },
    ],
  },
  balanceSheet: {
    headers: ['', 'Mar 2021', 'Mar 2022', 'Mar 2023', 'Mar 2024', 'Mar 2025', 'Mar 2026'],
    rows: [
      { label: 'Equity Capital', values: ['15.2', '15.2', '20.8', '20.8', '20.8', '20.8'] },
      { label: 'Reserves', values: ['38.4', '48.9', '84.5', '104.2', '128.6', '153.2'] },
      { label: 'Borrowings', values: ['3.2', '4.1', '2.5', '1.8', '1.2', '0.8'] },
      { label: 'Other Liabilities', values: ['12.5', '15.4', '18.9', '22.4', '26.8', '31.2'] },
      { label: 'Total Liabilities', values: ['69.3', '83.6', '126.7', '149.2', '177.4', '206.0'] },
      { label: 'Fixed Assets', values: ['14.2', '16.8', '22.4', '26.5', '32.1', '38.4'] },
      { label: 'CWIP', values: ['0.8', '1.2', '1.5', '0.9', '0.4', '0.2'] },
      { label: 'Investments', values: ['8.4', '12.1', '24.5', '32.8', '42.1', '52.6'] },
      { label: 'Other Assets', values: ['45.9', '53.5', '78.3', '89.0', '102.8', '114.8'] },
      { label: 'Total Assets', values: ['69.3', '83.6', '126.7', '149.2', '177.4', '206.0'] },
    ],
  },
  cashFlow: {
    headers: ['', 'Mar 2021', 'Mar 2022', 'Mar 2023', 'Mar 2024', 'Mar 2025', 'Mar 2026'],
    rows: [
      { label: 'Cash from Operating Activity', values: ['8.4', '12.8', '17.5', '24.1', '28.6', '34.2'] },
      { label: 'Cash from Investing Activity', values: ['-4.2', '-6.5', '-14.2', '-12.8', '-15.4', '-18.2'] },
      { label: 'Cash from Financing Activity', values: ['-1.8', '-2.4', '12.5', '-3.8', '-4.5', '-5.2'] },
      { label: 'Net Cash Flow', values: ['2.4', '3.9', '15.8', '7.5', '8.7', '10.8'] },
    ],
  },
  ratios: {
    headers: ['', 'Mar 2021', 'Mar 2022', 'Mar 2023', 'Mar 2024', 'Mar 2025', 'Mar 2026'],
    rows: [
      { label: 'Debtor Days', values: ['52', '48', '45', '42', '40', '38'] },
      { label: 'Inventory Days', values: ['—', '—', '—', '—', '—', '—'] },
      { label: 'Days Payable', values: ['28', '26', '24', '22', '20', '19'] },
      { label: 'Cash Conversion Cycle', values: ['24', '22', '21', '20', '20', '19'] },
      { label: 'Working Capital Days', values: ['35', '32', '29', '28', '26', '24'] },
      { label: 'ROCE %', values: ['24%', '26%', '25%', '24%', '23%', '22%'] },
    ],
  },
  shareholding: [
    { category: 'Promoters', quarters: [{ period: 'Sep 2025', pct: 64.50 }, { period: 'Dec 2025', pct: 64.50 }, { period: 'Mar 2026', pct: 64.50 }, { period: 'Jun 2026', pct: 64.50 }] },
    { category: 'FIIs', quarters: [{ period: 'Sep 2025', pct: 2.10 }, { period: 'Dec 2025', pct: 2.30 }, { period: 'Mar 2026', pct: 2.45 }, { period: 'Jun 2026', pct: 2.60 }] },
    { category: 'DIIs', quarters: [{ period: 'Sep 2025', pct: 3.20 }, { period: 'Dec 2025', pct: 3.40 }, { period: 'Mar 2026', pct: 3.55 }, { period: 'Jun 2026', pct: 3.70 }] },
    { category: 'Public', quarters: [{ period: 'Sep 2025', pct: 30.20 }, { period: 'Dec 2025', pct: 29.80 }, { period: 'Mar 2026', pct: 29.50 }, { period: 'Jun 2026', pct: 29.20 }] },
  ],
  sampleClaims: [
    { label: 'Microsoft Solutions Partner', claim: 'All E Technologies is a designated Microsoft Solutions Partner for Business Applications and Digital Innovation.', type: 'TRUE' },
  ],
};

export const COMPANIES: Record<string, CompanyData> = {
  AWL,
  ALLETEC,
  RELIANCE,
  TATAPOWER,
};

