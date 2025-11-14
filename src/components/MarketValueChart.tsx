import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { YearlyData } from "@/lib/investmentCalculations";

interface MarketValueChartProps {
  data: YearlyData[];
}

export function MarketValueChart({ data }: MarketValueChartProps) {
  const chartData = data.map(d => {
    // Portfolio performance = market value change - net flows
    const portfolioPerformance = d.marketValueChange - d.netFlows;
    const netFlows = d.netFlows;
    
    // For stacking: separate positive and negative components
    return {
      year: d.year,
      inflowsPositive: netFlows > 0 ? netFlows : 0,
      performancePositive: portfolioPerformance > 0 ? portfolioPerformance : 0,
      outflowsNegative: netFlows < 0 ? netFlows : 0,
      performanceNegative: portfolioPerformance < 0 ? portfolioPerformance : 0,
    };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Market Value Components by Year</CardTitle>
        <CardDescription>Breakdown of inflows, outflows, and portfolio growth/loss</CardDescription>
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
              dataKey="inflowsPositive" 
              name="Inflows"
              stackId="a"
              fill="hsl(142 76% 36%)"
            />
            <Bar 
              dataKey="performancePositive" 
              name="Portfolio Returns"
              stackId="a"
              fill="hsl(221 83% 53%)"
            />
            <Bar 
              dataKey="outflowsNegative" 
              name="Outflows"
              stackId="a"
              fill="hsl(0 84% 60%)"
            />
            <Bar 
              dataKey="performanceNegative" 
              name="Portfolio Losses"
              stackId="a"
              fill="hsl(24 95% 53%)"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
