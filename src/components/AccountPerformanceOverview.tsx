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
              {accounts.map((account) => (
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
                    ${account.currentMarketValue.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    <div className={`flex items-center justify-end gap-1 ${
                      account.cumulativeTWR >= 0 ? 'text-success' : 'text-destructive'
                    }`}>
                      {account.cumulativeTWR >= 0 ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      {account.cumulativeTWR.toFixed(2)}%
                    </div>
                  </TableCell>
                  <TableCell className={`text-right font-mono ${
                    account.annualizedTWR >= 0 ? 'text-success' : 'text-destructive'
                  }`}>
                    {account.annualizedTWR.toFixed(2)}%
                  </TableCell>
                  <TableCell className={`text-right font-mono ${
                    account.totalNetGain >= 0 ? 'text-success' : 'text-destructive'
                  }`}>
                    ${account.totalNetGain.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    ${account.totalDividends.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">{account.yearsOfHistory.toFixed(1)}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {new Date(account.inceptionDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - {new Date(account.latestDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
