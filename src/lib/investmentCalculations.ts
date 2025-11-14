export interface PerformanceRecord {
  accountNumber: string;
  startDate: string;
  endDate: string;
  beginningMarketValue: number;
  endingMarketValue: number;
  inflows: number;
  outflows: number;
  netIRR: number;
  netTWR: number;
  grossInflows: number;
  grossOutflows: number;
  grossIRR: number;
  grossTWR: number;
  dividendsInterest: number;
  netGain: number;
}

export interface AccountSummary {
  accountNumber: string;
  status: 'active' | 'closed' | 'held-away';
  hasFees: boolean;
  currentMarketValue: number;
  inceptionDate: string;
  latestDate: string;
  yearsOfHistory: number;
  totalRecords: number;
  cumulativeTWR: number;
  annualizedTWR: number;
  totalInflows: number;
  totalOutflows: number;
  totalDividends: number;
  totalNetGain: number;
  initialInvestment: number;
  // Calculation breakdown for auditing
  calculationDetails?: {
    inceptionMV: number;
    latestMV: number;
    totalInflows: number;
    totalOutflows: number;
    totalDividends: number;
    totalNetGain: number;
    daysOfHistory: number;
    cumulativeTWRFormula: string;
    annualizedTWRFormula: string;
  };
}

export interface YearlyData {
  year: number;
  annualReturn: number; // percentage
  growthOf1: number; // cumulative growth of $1 from inception
  portfolioValue: number; // ending MV for the year
  dollarGainLoss: number; // (mvEnd - mvStart) - netFlows
  marketValueChange: number; // mvEnd - mvStart (for chart)
}

export function parseCSVData(csvText: string): PerformanceRecord[] {
  const lines = csvText.trim().split('\n');
  const records: PerformanceRecord[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const values = line.split(',');
    
    if (values.length < 15) continue;
    
    records.push({
      accountNumber: values[0],
      startDate: values[1],
      endDate: values[2],
      beginningMarketValue: parseFloat(values[3]) || 0,
      endingMarketValue: parseFloat(values[4]) || 0,
      inflows: parseFloat(values[5]) || 0,
      outflows: parseFloat(values[6]) || 0,
      netIRR: parseFloat(values[7]) || 0,
      netTWR: parseFloat(values[8]) || 0,
      grossInflows: parseFloat(values[9]) || 0,
      grossOutflows: parseFloat(values[10]) || 0,
      grossIRR: parseFloat(values[11]) || 0,
      grossTWR: parseFloat(values[12]) || 0,
      dividendsInterest: parseFloat(values[13]) || 0,
      netGain: parseFloat(values[14]) || 0,
    });
  }
  
  return records;
}

export function calculateAccountSummary(records: PerformanceRecord[]): AccountSummary[] {
  const accountMap = new Map<string, PerformanceRecord[]>();
  
  // Group records by account
  records.forEach(record => {
    if (!accountMap.has(record.accountNumber)) {
      accountMap.set(record.accountNumber, []);
    }
    accountMap.get(record.accountNumber)!.push(record);
  });
  
  const summaries: AccountSummary[] = [];
  
  accountMap.forEach((accountRecords, accountNumber) => {
    // Sort by date
    accountRecords.sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime());
    
    // Find first record with beginning MV > 0
    const inceptionRecord = accountRecords.find(r => r.beginningMarketValue > 0) || accountRecords[0];
    const latestRecord = accountRecords[accountRecords.length - 1];
    const startIndex = accountRecords.indexOf(inceptionRecord);
    
    // Determine account status
    const transitionDate = new Date('2023-03-31');
    const latestDate = new Date(latestRecord.endDate);
    let status: 'active' | 'closed' | 'held-away';
    
    if (latestRecord.endingMarketValue === 0) {
      status = 'closed';
    } else if (latestDate.getTime() === transitionDate.getTime()) {
      status = 'active';
    } else {
      status = 'held-away';
    }
    
    // Check if account has fees (net IRR != gross IRR)
    const hasFees = accountRecords.some(r => 
      !isNaN(r.netIRR) && !isNaN(r.grossIRR) && r.netIRR !== r.grossIRR
    );
    
    // Use Net TWR values directly from CSV (already computed by Addepar)
    // monthlyReturn = netTWR (as decimal)
    const monthlyReturns: number[] = accountRecords
      .slice(startIndex)
      .map(r => r.netTWR);
    
    // Calculate cumulative TWR by chain-linking monthly returns
    // cumulativeTWR = product(1 + monthlyReturn) - 1
    let cumulativeTWRFactor = 1;
    monthlyReturns.forEach(monthlyReturn => {
      cumulativeTWRFactor *= (1 + monthlyReturn);
    });
    const cumulativeTWRDecimal = cumulativeTWRFactor - 1; // Keep as decimal
    const cumulativeTWR = cumulativeTWRDecimal * 100; // Also store as percentage for display
    
    // Calculate annualized TWR: (1 + cumulativeTWR)^(1/years) - 1
    const parseDateUTC = (s: string) => {
      const [y, m, d] = s.split('-').map(Number);
      return Date.UTC(y, m - 1, d);
    };
    const firstTs = parseDateUTC(inceptionRecord.endDate);
    const lastTs = parseDateUTC(latestRecord.endDate);
    const days = (lastTs - firstTs) / (1000 * 60 * 60 * 24);
    const years = days / 365;
    const annualizedTWRDecimal = years > 0 ? Math.pow(1 + cumulativeTWRDecimal, 1 / years) - 1 : cumulativeTWRDecimal;
    const annualizedTWR = annualizedTWRDecimal * 100; // Convert to percentage
    
    // Sum up flows and income
    const totalInflows = accountRecords.reduce((sum, r) => sum + r.inflows, 0);
    const totalOutflows = accountRecords.reduce((sum, r) => sum + r.outflows, 0);
    const totalDividends = accountRecords.reduce((sum, r) => sum + r.dividendsInterest, 0);
    const totalNetGain = accountRecords.reduce((sum, r) => sum + r.netGain, 0);
    
    summaries.push({
      accountNumber,
      status,
      hasFees,
      currentMarketValue: latestRecord.endingMarketValue,
      inceptionDate: inceptionRecord.startDate,
      latestDate: latestRecord.endDate,
      yearsOfHistory: years,
      totalRecords: accountRecords.length,
      cumulativeTWR,
      annualizedTWR,
      totalInflows,
      totalOutflows,
      totalDividends,
      totalNetGain,
      initialInvestment: inceptionRecord.beginningMarketValue > 0 ? inceptionRecord.beginningMarketValue : inceptionRecord.inflows,
      calculationDetails: {
        inceptionMV: inceptionRecord.beginningMarketValue,
        latestMV: latestRecord.endingMarketValue,
        totalInflows,
        totalOutflows,
        totalDividends,
        totalNetGain,
        daysOfHistory: days,
        cumulativeTWRFormula: `Chain-linked Net TWR from CSV: ∏(1 + netTWR) across ${accountRecords.length} periods - 1 = ${cumulativeTWRFactor.toFixed(6)} - 1 = ${cumulativeTWRDecimal.toFixed(6)}`,
        annualizedTWRFormula: `((1 + ${cumulativeTWRDecimal.toFixed(4)})^(1/${years.toFixed(4)}) - 1) × 100 = ${annualizedTWR.toFixed(2)}%`,
      },
    });
  });
  
  return summaries;
}

export function calculateYearlyData(records: PerformanceRecord[]): YearlyData[] {
  // Sort records by date first
  const sortedRecords = [...records].sort((a, b) => 
    new Date(a.endDate).getTime() - new Date(b.endDate).getTime()
  );
  
  const yearlyMap = new Map<number, { 
    firstRecord: PerformanceRecord;
    lastRecord: PerformanceRecord;
    monthlyRecords: PerformanceRecord[];
  }>();
  
  // Group records by year
  sortedRecords.forEach(record => {
    const year = new Date(record.endDate).getFullYear();
    
    if (!yearlyMap.has(year)) {
      yearlyMap.set(year, { 
        firstRecord: record,
        lastRecord: record,
        monthlyRecords: []
      });
    }
    
    const yearData = yearlyMap.get(year)!;
    yearData.lastRecord = record; // Always update to latest
    yearData.monthlyRecords.push(record);
  });
  
  const yearlyData: YearlyData[] = [];
  let growthOf1 = 1; // Cumulative growth of $1 from inception
  
  Array.from(yearlyMap.keys()).sort().forEach(year => {
    const data = yearlyMap.get(year)!;
    
    // Annual Return: product(1 + Net TWR for all rows in year y) - 1
    let annualReturnFactor = 1;
    data.monthlyRecords.forEach(record => {
      annualReturnFactor *= (1 + record.netTWR);
    });
    const annualReturn = (annualReturnFactor - 1) * 100; // Convert to percentage
    
    // Update cumulative growth of $1 from inception
    growthOf1 *= annualReturnFactor;
    
    // Portfolio Value: Ending MV of last row in year
    const portfolioValue = data.lastRecord.endingMarketValue;
    
    // Market Value Change and Dollar Gain/Loss
    const mvStart = data.firstRecord.beginningMarketValue;
    const mvEnd = data.lastRecord.endingMarketValue;
    const marketValueChange = mvEnd - mvStart; // For chart
    const netFlows = data.monthlyRecords.reduce((sum, r) => sum + (r.inflows - r.outflows), 0);
    const dollarGainLoss = marketValueChange - netFlows; // Performance dollars
    
    yearlyData.push({
      year,
      annualReturn,
      growthOf1,
      portfolioValue,
      dollarGainLoss,
      marketValueChange,
    });
  });
  
  return yearlyData;
}

export function getLatestPeriodActivity(records: PerformanceRecord[]) {
  if (records.length === 0) return null;
  
  const latest = records[records.length - 1];
  
  return {
    period: `${latest.startDate} - ${latest.endDate}`,
    inflows: latest.inflows,
    outflows: latest.outflows,
    netGain: latest.netGain,
    dividends: latest.dividendsInterest,
  };
}

export function analyzeDataQuality(records: PerformanceRecord[]) {
  const accounts = new Set(records.map(r => r.accountNumber));
  const accountSummaries = calculateAccountSummary(records);
  
  const activeAccounts = accountSummaries.filter(a => a.status === 'active').length;
  const closedAccounts = accountSummaries.filter(a => a.status === 'closed').length;
  
  const historyLengths = accountSummaries.map(a => a.yearsOfHistory);
  const avgHistory = historyLengths.reduce((sum, h) => sum + h, 0) / historyLengths.length;
  const maxHistory = Math.max(...historyLengths);
  const minHistory = Math.min(...historyLengths);
  
  // Find periods with fees (net IRR != gross IRR)
  const periodsWithFees = records.filter(r => 
    r.netIRR !== r.grossIRR && !isNaN(r.netIRR) && !isNaN(r.grossIRR)
  );
  
  return {
    totalAccounts: accounts.size,
    activeAccounts,
    closedAccounts,
    avgHistory,
    maxHistory,
    minHistory,
    periodsWithFees: periodsWithFees.length,
    totalRecords: records.length,
  };
}
