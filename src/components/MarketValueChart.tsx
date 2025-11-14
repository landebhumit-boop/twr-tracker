import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { YearlyData } from "@/lib/investmentCalculations";

interface MarketValueChartProps {
  data: YearlyData[];
}

export function MarketValueChart({ data }: MarketValueChartProps) {
  const chartData = data.map(d => {
    // Portfolio growth = market value change - net flows
    const portfolioGrowth = d.marketValueChange - d.netFlows;
    
    return {
      year: d.year,
      Inflows: d.netFlows > 0 ? d.netFlows : 0,
      Outflows: d.netFlows < 0 ? Math.abs(d.netFlows) : 0,
      "Portfolio Growth": portfolioGrowth >= 0 ? portfolioGrowth : 0,
      "Portfolio Loss": portfolioGrowth < 0 ? Math.abs(portfolioGrowth) : 0,
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
          <BarChart data={chartData} barGap={2}>
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
              dataKey="Inflows" 
              fill="hsl(142 76% 36%)"
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="Outflows" 
              fill="hsl(0 84% 60%)"
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="Portfolio Growth" 
              fill="hsl(221 83% 53%)"
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="Portfolio Loss" 
              fill="hsl(24 95% 53%)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
