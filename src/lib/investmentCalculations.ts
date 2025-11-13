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
  marketValueChange: number;
  netFlows: number;
  growthOf1: number;
  endingValue: number;
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
    
    // Calculate monthly TWR using flow-adjusted formula:
    // monthlyTWR = (endingMV - beginningMV - netFlows) / beginningMV
    const monthlyTWRs: number[] = [];
    accountRecords.forEach(record => {
      const netFlows = record.inflows - record.outflows;
      if (record.beginningMarketValue > 0) {
        const monthlyTWR = (record.endingMarketValue - record.beginningMarketValue - netFlows) / record.beginningMarketValue;
        monthlyTWRs.push(monthlyTWR);
      }
    });
    
    // Calculate cumulative TWR by chain-linking monthly returns
    // cumulativeTWR = product(1 + monthlyTWR) - 1
    let cumulativeTWRFactor = 1;
    monthlyTWRs.forEach(twr => {
      cumulativeTWRFactor *= (1 + twr);
    });
    const cumulativeTWR = (cumulativeTWRFactor - 1) * 100; // Convert to percentage
    
    // Calculate annualized TWR using 365 days
    const startDate = new Date(inceptionRecord.startDate);
    const endDate = new Date(latestRecord.endDate);
    const daysOfHistory = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const years = daysOfHistory / 365;
    const annualizedTWR = (Math.pow(cumulativeTWRFactor, 1 / years) - 1) * 100;
    
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
        daysOfHistory,
        cumulativeTWRFormula: `Chain-linked monthly TWR: ∏(1 + (endingMV - beginningMV - netFlows)/beginningMV) across ${accountRecords.length} periods - 1`,
        annualizedTWRFormula: `(${cumulativeTWRFactor.toFixed(6)})^(1/${years.toFixed(4)}) - 1) × 100 = ${annualizedTWR.toFixed(2)}%`,
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
    
    // Calculate yearly TWR by chain-linking monthly TWRs
    // yearlyTWR = product(1 + monthlyTWR) for all months in year
    let yearTWRProduct = 1;
    data.monthlyRecords.forEach(record => {
      const netFlows = record.inflows - record.outflows;
      if (record.beginningMarketValue > 0) {
        const monthlyTWR = (record.endingMarketValue - record.beginningMarketValue - netFlows) / record.beginningMarketValue;
        yearTWRProduct *= (1 + monthlyTWR);
      }
    });
    
    // Update cumulative growth of $1
    growthOf1 *= yearTWRProduct;
    
    // Market Value Change: endingMV(last) - beginningMV(first)
    const marketValueChange = data.lastRecord.endingMarketValue - data.firstRecord.beginningMarketValue;
    
    // Net Flows: sum(inflows - outflows) for the year
    const netFlows = data.monthlyRecords.reduce((sum, r) => sum + (r.inflows - r.outflows), 0);
    
    yearlyData.push({
      year,
      marketValueChange,
      netFlows,
      growthOf1,
      endingValue: data.lastRecord.endingMarketValue,
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
