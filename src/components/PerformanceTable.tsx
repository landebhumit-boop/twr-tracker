import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
                  ${row.growthOf1.toFixed(4)}
                </TableCell>
                <TableCell className={`text-right font-mono ${
                  row.marketValueChange >= 0 ? 'text-success' : 'text-destructive'
                }`}>
                  ${row.marketValueChange.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </TableCell>
                <TableCell className={`text-right font-mono ${
                  row.netFlows >= 0 ? 'text-success' : 'text-destructive'
                }`}>
                  ${row.netFlows.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
