import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AccountSummary } from "@/lib/investmentCalculations";
import { TrendingUp, TrendingDown } from "lucide-react";

interface AccountPerformanceOverviewProps {
  accounts: AccountSummary[];
}

export function AccountPerformanceOverview({ accounts }: AccountPerformanceOverviewProps) {
  const activeCount = accounts.filter(a => a.status === 'active').length;
  const closedCount = accounts.filter(a => a.status === 'closed').length;
  const feesCount = accounts.filter(a => a.hasFees).length;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Performance Overview</CardTitle>
        <CardDescription>
          Detailed performance metrics for all {accounts.length} accounts ({activeCount} active, {closedCount} closed) • {feesCount} accounts with management fees
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Account</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Fees</TableHead>
                <TableHead className="text-right">Market Value</TableHead>
                <TableHead className="text-right">Cumulative TWR</TableHead>
                <TableHead className="text-right">Annualized TWR</TableHead>
                <TableHead className="text-right">Net Gain</TableHead>
                <TableHead className="text-right">Dividends</TableHead>
                <TableHead className="text-right">Years</TableHead>
                <TableHead>Period</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accounts.map((account) => {
                const calc = account.calculationDetails;
                return (
                <TableRow key={account.accountNumber}>
                  <TableCell className="font-medium">{account.accountNumber}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        account.status === 'active' ? 'default' : 
                        account.status === 'closed' ? 'secondary' : 
                        'outline'
                      }
                      className={
                        account.status === 'active' ? 'bg-foreground text-background' : 
                        account.status === 'closed' ? 'bg-muted text-muted-foreground' :
                        'border-muted-foreground/50'
                      }
                    >
                      {account.status === 'active' ? 'Active' : 
                       account.status === 'closed' ? 'Closed' : 
                       'Held Away'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {account.hasFees ? (
                      <Badge variant="destructive" className="bg-destructive text-destructive-foreground">
                        Yes
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">No</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="cursor-help border-b border-dotted border-muted-foreground/50">
                            ${account.currentMarketValue.toLocaleString()}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <div className="text-xs space-y-1">
                            <div className="font-semibold">Market Value Calculation:</div>
                            <div>Latest Ending MV: ${calc?.latestMV.toLocaleString()}</div>
                            <div className="text-muted-foreground">From period ending {account.latestDate}</div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className={`flex items-center justify-end gap-1 cursor-help border-b border-dotted border-muted-foreground/50 ${
                            account.cumulativeTWR >= 0 ? 'text-success' : 'text-destructive'
                          }`}>
                            {account.cumulativeTWR >= 0 ? (
                              <TrendingUp className="h-3 w-3" />
                            ) : (
                              <TrendingDown className="h-3 w-3" />
                            )}
                            {account.cumulativeTWR.toFixed(2)}%
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <div className="text-xs space-y-1">
                            <div className="font-semibold">Cumulative TWR Calculation:</div>
                            <div>{calc?.cumulativeTWRFormula}</div>
                            <div className="mt-2 text-muted-foreground">Period: {account.inceptionDate} to {account.latestDate}</div>
                            <div className="text-muted-foreground">{account.totalRecords} periods</div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell className={`text-right font-mono ${
                    account.annualizedTWR >= 0 ? 'text-success' : 'text-destructive'
                  }`}>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="cursor-help border-b border-dotted border-muted-foreground/50">
                            {account.annualizedTWR.toFixed(2)}%
                          </span>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-sm">
                          <div className="text-xs space-y-1">
                            <div className="font-semibold">Annualized TWR Calculation:</div>
                            <div className="font-mono">{calc?.annualizedTWRFormula}</div>
                            <div className="mt-2 text-muted-foreground">
                              Days: {calc?.daysOfHistory} ({(calc?.daysOfHistory || 0 / 365).toFixed(2)} years using 365-day year)
                            </div>
                            <div className="text-muted-foreground">Cumulative TWR: {account.cumulativeTWR.toFixed(2)}%</div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell className={`text-right font-mono ${
                    account.totalNetGain >= 0 ? 'text-success' : 'text-destructive'
                  }`}>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="cursor-help border-b border-dotted border-muted-foreground/50">
                            ${account.totalNetGain.toLocaleString()}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <div className="text-xs space-y-1">
                            <div className="font-semibold">Net Gain Calculation:</div>
                            <div>Sum of Net Gain across all {account.totalRecords} periods</div>
                            <div className="mt-2 text-muted-foreground">Total: ${calc?.totalNetGain.toLocaleString()}</div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="cursor-help border-b border-dotted border-muted-foreground/50">
                            ${account.totalDividends.toLocaleString()}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <div className="text-xs space-y-1">
                            <div className="font-semibold">Dividends Calculation:</div>
                            <div>Sum of Dividends & Interest across all {account.totalRecords} periods</div>
                            <div className="mt-2 text-muted-foreground">Total: ${calc?.totalDividends.toLocaleString()}</div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell className="text-right">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="cursor-help border-b border-dotted border-muted-foreground/50">
                            {account.yearsOfHistory.toFixed(1)}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <div className="text-xs space-y-1">
                            <div className="font-semibold">Years Calculation:</div>
                            <div>{calc?.daysOfHistory} days ÷ 365 = {account.yearsOfHistory.toFixed(4)} years</div>
                            <div className="mt-2 text-muted-foreground">Using 365-day year</div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {new Date(account.inceptionDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - {new Date(account.latestDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </TableCell>
                </TableRow>
              )})}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
