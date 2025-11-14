import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { YearlyData } from "@/lib/investmentCalculations";

interface GrowthChartProps {
  data: YearlyData[];
}

export function GrowthChart({ data }: GrowthChartProps) {
  const chartData = data.map(d => ({
    year: d.year,
    value: d.growthOf1Cumulative,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Growth of $1 Since Inception</CardTitle>
        <CardDescription>Shows how $1 invested at inception would have grown over time</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="year" 
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis 
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
              tickFormatter={(value) => `$${value.toFixed(2)}`}
            />
            <Tooltip 
              formatter={(value: number) => [`$${value.toFixed(2)}`, 'Value']}
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="hsl(var(--chart-1))" 
              strokeWidth={2}
              dot={{ fill: 'hsl(var(--chart-1))', r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
