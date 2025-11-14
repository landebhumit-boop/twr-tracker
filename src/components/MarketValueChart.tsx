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
      inflows: d.netFlows > 0 ? d.netFlows : 0,
      outflows: d.netFlows < 0 ? Math.abs(d.netFlows) : 0,
      portfolioGrowth: portfolioGrowth,
    };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Market Value Components by Year</CardTitle>
        <CardDescription>Breakdown of inflows, outflows, and portfolio growth/loss</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
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
              dataKey="inflows" 
              name="Inflows"
              stackId="a"
              fill="hsl(var(--success))"
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="portfolioGrowth" 
              name="Portfolio Growth/Loss"
              stackId="a"
              fill="hsl(var(--primary))"
            />
            <Bar 
              dataKey="outflows" 
              name="Outflows"
              stackId="b"
              fill="hsl(var(--destructive))"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
