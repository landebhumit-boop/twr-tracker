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
              <TableHead className="text-right">Ending Market Value</TableHead>
              <TableHead className="text-right">TWR Return</TableHead>
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
                          ${row.endingMarketValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <div className="text-xs space-y-1">
                          <div className="font-semibold">Ending Market Value:</div>
                          <div>Total market value at the end of the year</div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <TableCell className={`text-right font-mono ${
                  row.twrReturn >= 0 ? 'text-success' : 'text-destructive'
                }`}>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="cursor-help border-b border-dotted border-muted-foreground/50">
                          {(row.twrReturn * 100).toFixed(2)}%
                        </span>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <div className="text-xs space-y-1">
                          <div className="font-semibold">Time-Weighted Return:</div>
                          <div>Annualized return for the year, showing investment performance independent of cash flows</div>
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
