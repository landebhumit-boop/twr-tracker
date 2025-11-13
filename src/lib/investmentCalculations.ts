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
  isActive: boolean;
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
    
    const isActive = latestRecord.endingMarketValue > 0;
    
    // Calculate cumulative TWR (compound the returns)
    let cumulativeTWR = 1;
    accountRecords.forEach(record => {
      if (record.netTWR) {
        cumulativeTWR *= (1 + record.netTWR);
      }
    });
    cumulativeTWR = (cumulativeTWR - 1) * 100; // Convert to percentage
    
    // Calculate annualized TWR
    const startDate = new Date(inceptionRecord.startDate);
    const endDate = new Date(latestRecord.endDate);
    const years = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
    const annualizedTWR = (Math.pow(1 + cumulativeTWR / 100, 1 / years) - 1) * 100;
    
    // Sum up flows and income
    const totalInflows = accountRecords.reduce((sum, r) => sum + r.inflows, 0);
    const totalOutflows = accountRecords.reduce((sum, r) => sum + r.outflows, 0);
    const totalDividends = accountRecords.reduce((sum, r) => sum + r.dividendsInterest, 0);
    const totalNetGain = accountRecords.reduce((sum, r) => sum + r.netGain, 0);
    
    summaries.push({
      accountNumber,
      isActive,
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
    });
  });
  
  return summaries;
}

export function calculateYearlyData(records: PerformanceRecord[]): YearlyData[] {
  const yearlyMap = new Map<number, { 
    marketValueChange: number; 
    netFlows: number;
    endingValue: number;
    twrProduct: number;
  }>();
  
  records.forEach(record => {
    const year = new Date(record.endDate).getFullYear();
    
    if (!yearlyMap.has(year)) {
      yearlyMap.set(year, { 
        marketValueChange: 0, 
        netFlows: 0,
        endingValue: 0,
        twrProduct: 1
      });
    }
    
    const yearData = yearlyMap.get(year)!;
    yearData.marketValueChange += (record.endingMarketValue - record.beginningMarketValue);
    yearData.netFlows += (record.inflows - record.outflows);
    yearData.endingValue = record.endingMarketValue;
    
    if (record.netTWR) {
      yearData.twrProduct *= (1 + record.netTWR);
    }
  });
  
  const yearlyData: YearlyData[] = [];
  let growthOf1 = 1;
  
  Array.from(yearlyMap.keys()).sort().forEach(year => {
    const data = yearlyMap.get(year)!;
    growthOf1 *= data.twrProduct;
    
    yearlyData.push({
      year,
      marketValueChange: data.marketValueChange - data.netFlows,
      netFlows: data.netFlows,
      growthOf1,
      endingValue: data.endingValue,
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
  
  const activeAccounts = accountSummaries.filter(a => a.isActive).length;
  const closedAccounts = accountSummaries.filter(a => !a.isActive).length;
  
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
