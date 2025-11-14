import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { YearlyData } from "@/lib/investmentCalculations";

interface MarketValueChartProps {
  data: YearlyData[];
}

export function MarketValueChart({ data }: MarketValueChartProps) {
  const chartData = data.map(d => {
    const netFlows = d.netFlows;
    const portfolioReturn = d.marketValueChange - netFlows; // Ending MV - Beginning MV - Net Flows
    
    return {
      year: d.year,
      netFlowsPositive: netFlows > 0 ? netFlows : 0,
      netFlowsNegative: netFlows < 0 ? netFlows : 0,
      portfolioReturnPositive: portfolioReturn > 0 ? portfolioReturn : 0,
      portfolioReturnNegative: portfolioReturn < 0 ? portfolioReturn : 0,
    };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Market Value Changes by Year</CardTitle>
        <CardDescription>Net flows and portfolio returns stacked to show total annual change</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="year" 
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis 
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
            />
            <Tooltip 
              formatter={(value: number) => `$${value.toLocaleString()}`}
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="rect"
            />
            <Bar 
              dataKey="netFlowsPositive" 
              name="Net Flows (Positive)"
              stackId="a"
              fill="hsl(142 76% 36%)"
            />
            <Bar 
              dataKey="portfolioReturnPositive" 
              name="Portfolio Return (Positive)"
              stackId="a"
              fill="hsl(221 83% 53%)"
            />
            <Bar 
              dataKey="netFlowsNegative" 
              name="Net Flows (Negative)"
              stackId="a"
              fill="hsl(0 84% 60%)"
            />
            <Bar 
              dataKey="portfolioReturnNegative" 
              name="Portfolio Return (Negative)"
              stackId="a"
              fill="hsl(24 95% 53%)"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
