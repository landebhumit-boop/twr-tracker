import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MetricCard } from "@/components/MetricCard";
import { GrowthChart } from "@/components/GrowthChart";
import { MarketValueChart } from "@/components/MarketValueChart";
import { PerformanceTable } from "@/components/PerformanceTable";
import { TradeActivityCard } from "@/components/TradeActivityCard";
import { AnalysisSection } from "@/components/AnalysisSection";
import { DollarSign, TrendingUp, Calendar } from "lucide-react";
import { 
  parseCSVData, 
  calculateAccountSummary, 
  calculateYearlyData,
  getLatestPeriodActivity,
  analyzeDataQuality,
  PerformanceRecord,
  AccountSummary 
} from "@/lib/investmentCalculations";

const Index = () => {
  const [allRecords, setAllRecords] = useState<PerformanceRecord[]>([]);
  const [accountSummaries, setAccountSummaries] = useState<AccountSummary[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/data/performance_data.csv")
      .then(response => response.text())
      .then(csvText => {
        const records = parseCSVData(csvText);
        setAllRecords(records);
        const summaries = calculateAccountSummary(records);
        setAccountSummaries(summaries);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error loading data:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Loading Investment Data...</h1>
          <p className="text-muted-foreground">Please wait while we analyze your portfolio</p>
        </div>
      </div>
    );
  }

  const currentRecords = selectedAccount === "all" 
    ? allRecords 
    : allRecords.filter(r => r.accountNumber === selectedAccount);

  const currentSummary = selectedAccount === "all"
    ? {
        accountNumber: "All Accounts",
        isActive: true,
        currentMarketValue: accountSummaries.reduce((sum, a) => sum + a.currentMarketValue, 0),
        cumulativeTWR: accountSummaries.reduce((sum, a) => sum + a.cumulativeTWR, 0) / accountSummaries.length,
        annualizedTWR: accountSummaries.reduce((sum, a) => sum + a.annualizedTWR, 0) / accountSummaries.length,
        totalDividends: accountSummaries.reduce((sum, a) => sum + a.totalDividends, 0),
        totalNetGain: accountSummaries.reduce((sum, a) => sum + a.totalNetGain, 0),
        inceptionDate: accountSummaries.reduce((earliest, a) => 
          new Date(a.inceptionDate) < new Date(earliest) ? a.inceptionDate : earliest, 
          accountSummaries[0]?.inceptionDate || ""
        ),
        latestDate: accountSummaries.reduce((latest, a) => 
          new Date(a.latestDate) > new Date(latest) ? a.latestDate : latest, 
          accountSummaries[0]?.latestDate || ""
        ),
      }
    : accountSummaries.find(a => a.accountNumber === selectedAccount);

  const yearlyData = calculateYearlyData(currentRecords);
  const latestActivity = getLatestPeriodActivity(currentRecords);
  const dataQuality = analyzeDataQuality(allRecords);

  const performancePeriod = currentSummary 
    ? `${currentSummary.inceptionDate} - ${currentSummary.latestDate}`
    : "";

  const yearsOfHistory = currentSummary
    ? ((new Date(currentSummary.latestDate).getTime() - new Date(currentSummary.inceptionDate).getTime()) / (1000 * 60 * 60 * 24 * 365.25)).toFixed(1)
    : "0";

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Investment Portfolio Dashboard</h1>
            <p className="text-muted-foreground">
              Comprehensive analysis of investment performance and cash flows
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium">Select Account:</label>
            <Select value={selectedAccount} onValueChange={setSelectedAccount}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Accounts</SelectItem>
                {accountSummaries.map(account => (
                  <SelectItem key={account.accountNumber} value={account.accountNumber}>
                    <div className="flex items-center gap-2">
                      {account.accountNumber}
                      <Badge variant={account.isActive ? "default" : "secondary"} className="ml-2">
                        {account.isActive ? "Active" : "Closed"}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Account Header */}
        {currentSummary && (
          <div className="bg-card rounded-lg border p-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-bold">
                {selectedAccount === "all" ? "Portfolio Overview" : `Account ${currentSummary.accountNumber}`}
              </h2>
              {selectedAccount !== "all" && (
                <Badge variant={currentSummary.isActive ? "default" : "secondary"}>
                  {currentSummary.isActive ? "Active" : "Closed"}
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Performance period: {performancePeriod} ({yearsOfHistory} years, {currentRecords.length} records)
            </p>
          </div>
        )}

        {/* Key Metrics */}
        {currentSummary && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MetricCard
              title="Current Market Value"
              value={`$${currentSummary.currentMarketValue.toLocaleString()}`}
              icon={DollarSign}
            />
            <MetricCard
              title="Cumulative TWR"
              value={`${currentSummary.cumulativeTWR.toFixed(2)}%`}
              subtitle="Since inception"
              icon={TrendingUp}
              trend="up"
            />
            <MetricCard
              title="Annualized TWR"
              value={`${currentSummary.annualizedTWR.toFixed(2)}%`}
              subtitle="Annual rate"
              icon={Calendar}
              trend="up"
            />
          </div>
        )}

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="details">Account Details</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {latestActivity && (
              <TradeActivityCard
                period={latestActivity.period}
                inflows={latestActivity.inflows}
                outflows={latestActivity.outflows}
                netGain={latestActivity.netGain}
                dividends={latestActivity.dividends}
              />
            )}
            <GrowthChart data={yearlyData} />
            <MarketValueChart data={yearlyData} />
          </TabsContent>

          <TabsContent value="details" className="space-y-6">
            <PerformanceTable
              data={yearlyData}
              title="Yearly Performance Summary"
              description="Detailed breakdown of investment performance by year"
            />
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <GrowthChart data={yearlyData} />
              <MarketValueChart data={yearlyData} />
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            <AnalysisSection
              totalAccounts={dataQuality.totalAccounts}
              activeAccounts={dataQuality.activeAccounts}
              closedAccounts={dataQuality.closedAccounts}
              avgHistory={dataQuality.avgHistory}
              maxHistory={dataQuality.maxHistory}
              minHistory={dataQuality.minHistory}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
