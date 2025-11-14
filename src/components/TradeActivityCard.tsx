import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface TradeActivityCardProps {
  period: string;
  inflows: number;
  outflows: number;
  netGain: number;
  dividends: number;
}

export function TradeActivityCard({ period, inflows, outflows, netGain, dividends }: TradeActivityCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Period Trade Activity</CardTitle>
        <CardDescription>Most recent period: {period}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="text-sm text-muted-foreground mb-1">Inflows</div>
            <div className="text-xl font-bold text-success">
              ${inflows.toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground mb-1">Outflows</div>
            <div className="text-xl font-bold text-destructive">
              ${outflows.toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground mb-1">Net Gain</div>
            <div className={`text-xl font-bold ${netGain >= 0 ? 'text-success' : 'text-destructive'}`}>
              ${netGain.toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground mb-1">Dividends</div>
            <div className="text-xl font-bold text-primary">
              ${dividends.toLocaleString()}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
