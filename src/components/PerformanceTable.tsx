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
                        <div className="text-xs space-y-2 font-mono">
                          <div className="font-semibold">Calculation Components:</div>
                          <div className="space-y-0.5">
                            <div>Beginning Value: ${row.beginningMarketValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                            <div className="text-success">+ Inflows: ${row.inflows.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                            <div className="text-destructive">- Outflows: ${row.outflows.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                            <div className={row.marketValueChange >= 0 ? 'text-success' : 'text-destructive'}>
                              {row.marketValueChange >= 0 ? '+' : ''} Investment Gain/Loss: ${row.marketValueChange.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </div>
                            <div className="border-t pt-0.5 mt-0.5">= Ending Value: ${row.endingMarketValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                          </div>
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
                        <div className="text-xs space-y-2 font-mono">
                          <div className="font-semibold">TWR Calculation:</div>
                          <div className="space-y-0.5">
                            <div>Growth Factor: {row.growthOf1.toFixed(6)}</div>
                            <div>Return: {(row.twrReturn * 100).toFixed(2)}%</div>
                            <div className="text-muted-foreground text-[10px] mt-1">
                              (Compounds all period returns for {row.year})
                            </div>
                          </div>
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
                        <div className="text-xs space-y-2 font-mono">
                          <div className="font-semibold">Net Flows Calculation:</div>
                          <div className="space-y-0.5">
                            <div className="text-success">Inflows: ${row.inflows.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                            <div className="text-destructive">Outflows: ${row.outflows.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                            <div className="border-t pt-0.5 mt-0.5">Net: ${row.netFlows.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                          </div>
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
