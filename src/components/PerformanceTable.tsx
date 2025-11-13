import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { YearlyData } from "@/lib/investmentCalculations";

interface PerformanceTableProps {
  data: YearlyData[];
  title: string;
  description: string;
}

export function PerformanceTable({ data, title, description }: PerformanceTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Year</TableHead>
              <TableHead className="text-right">Annual Return</TableHead>
              <TableHead className="text-right">Growth of $1</TableHead>
              <TableHead className="text-right">Portfolio Value</TableHead>
              <TableHead className="text-right">Gain/Loss ($)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.year}>
                <TableCell className="font-medium">{row.year}</TableCell>
                <TableCell className={`text-right font-mono ${
                  row.annualReturn >= 0 ? 'text-success' : 'text-destructive'
                }`}>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="cursor-help border-b border-dotted border-muted-foreground/50">
                          {row.annualReturn.toFixed(2)}%
                        </span>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <div className="text-xs space-y-1">
                          <div className="font-semibold">Annual Return:</div>
                          <div>Time-weighted return for {row.year}</div>
                          <div className="text-muted-foreground">= ∏(1 + Net TWR for all months in {row.year}) - 1</div>
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
                          ${row.growthOf1.toFixed(4)}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <div className="text-xs space-y-1">
                          <div className="font-semibold">Growth of $1:</div>
                          <div>Cumulative growth of $1 invested from inception through {row.year}</div>
                          <div className="text-muted-foreground">Rolling forward year by year using annual returns</div>
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
                          ${row.portfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <div className="text-xs space-y-1">
                          <div className="font-semibold">Portfolio Value:</div>
                          <div>Ending market value at end of {row.year}</div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <TableCell className={`text-right font-mono ${
                  row.dollarGainLoss >= 0 ? 'text-success' : 'text-destructive'
                }`}>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="cursor-help border-b border-dotted border-muted-foreground/50">
                          ${row.dollarGainLoss.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <div className="text-xs space-y-1">
                          <div className="font-semibold">Gain/Loss ($):</div>
                          <div>Performance dollars isolated from flows</div>
                          <div className="text-muted-foreground">= (Ending MV - Beginning MV) - Net Flows</div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
