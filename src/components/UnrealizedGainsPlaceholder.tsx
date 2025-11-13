import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, AlertCircle } from "lucide-react";

export function UnrealizedGainsPlaceholder() {
  // Sample data to illustrate the feature
  const sampleHoldings = [
    { isin: "US0378331005", name: "Apple Inc.", quantity: 100, costBasis: 15000, marketValue: 18500, unrealizedGain: 3500, percentGain: 23.33 },
    { isin: "US5949181045", name: "Microsoft Corp.", quantity: 50, costBasis: 12000, marketValue: 13200, unrealizedGain: 1200, percentGain: 10.00 },
    { isin: "US02079K3059", name: "Alphabet Inc.", quantity: 75, costBasis: 8500, marketValue: 7800, unrealizedGain: -700, percentGain: -8.24 },
  ];

  return (
    <Card className="border-dashed border-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              Unrealized Gains/Losses
              <Badge variant="outline" className="font-normal">
                <AlertCircle className="h-3 w-3 mr-1" />
                Requires Tax Lot Data
              </Badge>
            </CardTitle>
            <CardDescription>
              Position-level unrealized gains/losses breakdown (requires ISIN and tax lot data)
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-muted/50 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground mb-2">
              <strong>Data Requirements:</strong> Tax lot data with ISIN identifiers, purchase dates, and cost basis
            </p>
            <p className="text-sm text-muted-foreground">
              This view will show unrealized gains/losses at the position level, helping identify which holdings are above or below their purchase price.
            </p>
          </div>

          <div className="opacity-60">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ISIN</TableHead>
                  <TableHead>Security</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Cost Basis</TableHead>
                  <TableHead className="text-right">Market Value</TableHead>
                  <TableHead className="text-right">Unrealized Gain/Loss</TableHead>
                  <TableHead className="text-right">% Gain/Loss</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sampleHoldings.map((holding) => (
                  <TableRow key={holding.isin}>
                    <TableCell className="font-mono text-sm">{holding.isin}</TableCell>
                    <TableCell className="font-medium">{holding.name}</TableCell>
                    <TableCell className="text-right">{holding.quantity}</TableCell>
                    <TableCell className="text-right font-mono">
                      ${holding.costBasis.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      ${holding.marketValue.toLocaleString()}
                    </TableCell>
                    <TableCell className={`text-right font-mono ${
                      holding.unrealizedGain >= 0 ? 'text-success' : 'text-destructive'
                    }`}>
                      <div className="flex items-center justify-end gap-1">
                        {holding.unrealizedGain >= 0 ? (
                          <TrendingUp className="h-3 w-3" />
                        ) : (
                          <TrendingDown className="h-3 w-3" />
                        )}
                        ${Math.abs(holding.unrealizedGain).toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell className={`text-right font-mono ${
                      holding.percentGain >= 0 ? 'text-success' : 'text-destructive'
                    }`}>
                      {holding.percentGain.toFixed(2)}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
