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
              <TableHead className="text-right">Growth of $1</TableHead>
              <TableHead className="text-right">Market Value Change</TableHead>
              <TableHead className="text-right">Net Flows</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.year}>
                <TableCell className="font-medium">{row.year}</TableCell>
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
                          <div>Value of $1 invested from inception through {row.year}</div>
                          <div className="text-muted-foreground">= ∏(1 + netTWR) for all months from inception to end of {row.year}</div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <TableCell className={`text-right font-mono ${
                  row.marketValueChange >= 0 ? 'text-success' : 'text-destructive'
                }`}>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="cursor-help border-b border-dotted border-muted-foreground/50">
                          ${row.marketValueChange.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <div className="text-xs space-y-1">
                          <div className="font-semibold">Market Value Change:</div>
                          <div>Ending MV (last row) - Beginning MV (first row) of {row.year}</div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <TableCell className={`text-right font-mono ${
                  row.netFlows >= 0 ? 'text-success' : 'text-destructive'
                }`}>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="cursor-help border-b border-dotted border-muted-foreground/50">
                          ${row.netFlows.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <div className="text-xs space-y-1">
                          <div className="font-semibold">Net Flows:</div>
                          <div>Inflows - Outflows for the year</div>
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
