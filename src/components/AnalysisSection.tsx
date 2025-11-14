import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Users, UserX, Calendar, Clock } from "lucide-react";
import { AccountSummary } from "@/lib/investmentCalculations";

interface AnalysisSectionProps {
  totalAccounts: number;
  activeAccounts: number;
  closedAccounts: number;
  heldAwayAccounts: number;
  avgHistory: number;
  maxHistory: number;
  minHistory: number;
  accountSummaries: AccountSummary[];
}

export function AnalysisSection({ 
  totalAccounts, 
  activeAccounts, 
  closedAccounts,
  heldAwayAccounts,
  avgHistory, 
  maxHistory, 
  minHistory,
  accountSummaries 
}: AnalysisSectionProps) {
  // Get account details for average calculation
  const activeAccountsList = accountSummaries.filter(a => a.status === 'active');
  const closedAccountsList = accountSummaries.filter(a => a.status === 'closed');
  const heldAwayAccountsList = accountSummaries.filter(a => a.status === 'held-away');
  const minHistoryAccount = accountSummaries.find(a => a.yearsOfHistory === minHistory);
  const maxHistoryAccount = accountSummaries.find(a => a.yearsOfHistory === maxHistory);
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Investment Data Analysis</h2>
        <p className="text-muted-foreground">
          Comprehensive analysis answering key questions about account performance, cash flows, and data quality insights
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Open/Active Accounts
            </CardTitle>
            <Users className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="text-3xl font-bold text-success cursor-help border-b border-dotted border-success/50 inline-block">
                    {activeAccounts}
                  </div>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <div className="text-xs space-y-1">
                    <div className="font-semibold">Active Accounts Calculation:</div>
                    <div>Accounts with latest ending MV &gt; 0</div>
                    <div className="mt-2 text-muted-foreground">
                      Accounts: {activeAccountsList.map(a => a.accountNumber).join(', ')}
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <p className="text-xs text-muted-foreground mt-1">
              {((activeAccounts / totalAccounts) * 100).toFixed(1)}% of total accounts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Closed Accounts
            </CardTitle>
            <UserX className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="text-3xl font-bold cursor-help border-b border-dotted border-muted-foreground/50 inline-block">
                    {closedAccounts}
                  </div>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <div className="text-xs space-y-1">
                    <div className="font-semibold">Closed Accounts Calculation:</div>
                    <div>Accounts with latest ending MV = 0</div>
                    <div className="mt-2 text-muted-foreground">
                      {closedAccountsList.length > 0 ? `Accounts: ${closedAccountsList.map(a => a.accountNumber).join(', ')}` : 'No closed accounts'}
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <p className="text-xs text-muted-foreground mt-1">
              {((closedAccounts / totalAccounts) * 100).toFixed(1)}% of total accounts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Held Away Accounts
            </CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="text-3xl font-bold text-primary cursor-help border-b border-dotted border-primary/50 inline-block">
                    {heldAwayAccounts}
                  </div>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <div className="text-xs space-y-1">
                    <div className="font-semibold">Held Away Accounts:</div>
                    <div>Accounts managed elsewhere or not directly controlled</div>
                    <div className="mt-2 text-muted-foreground">
                      {heldAwayAccountsList.length > 0 ? `Accounts: ${heldAwayAccountsList.map(a => a.accountNumber).join(', ')}` : 'No held away accounts'}
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <p className="text-xs text-muted-foreground mt-1">
              {((heldAwayAccounts / totalAccounts) * 100).toFixed(1)}% of total accounts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average History
            </CardTitle>
            <Calendar className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="text-3xl font-bold text-primary cursor-help border-b border-dotted border-primary/50 inline-block">
                    {avgHistory.toFixed(2)} years
                  </div>
                </TooltipTrigger>
                <TooltipContent className="max-w-sm">
                  <div className="text-xs space-y-1">
                    <div className="font-semibold">Average Account History Calculation:</div>
                    <div>Sum of all account histories ÷ number of accounts</div>
                    <div className="mt-2 text-muted-foreground">
                      {accountSummaries.map(a => `${a.accountNumber}: ${a.yearsOfHistory.toFixed(2)} years`).join(', ')}
                    </div>
                    <div className="mt-2 text-muted-foreground font-mono">
                      ({accountSummaries.map(a => a.yearsOfHistory.toFixed(4)).join(' + ')}) ÷ {accountSummaries.length} = {avgHistory.toFixed(4)} years
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <p className="text-xs text-muted-foreground mt-1">
              Mean account lifespan
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              History Range
            </CardTitle>
            <Clock className="h-4 w-4 text-chart-3" />
          </CardHeader>
          <CardContent>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="text-3xl font-bold text-chart-3 cursor-help border-b border-dotted border-chart-3/50 inline-block">
                    {minHistory.toFixed(2)} - {maxHistory.toFixed(2)} years
                  </div>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <div className="text-xs space-y-1">
                    <div className="font-semibold">History Range Calculation:</div>
                    <div className="mt-2">
                      <div><strong>Min:</strong> {minHistoryAccount?.accountNumber} - {minHistory.toFixed(4)} years ({(minHistory * 365).toFixed(0)} days / 365 = {minHistory.toFixed(2)} years)</div>
                      <div className="mt-1"><strong>Max:</strong> {maxHistoryAccount?.accountNumber} - {maxHistory.toFixed(4)} years ({(maxHistory * 365).toFixed(0)} days / 365 = {maxHistory.toFixed(2)} years)</div>
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <p className="text-xs text-muted-foreground mt-1">
              Min to max account history
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
