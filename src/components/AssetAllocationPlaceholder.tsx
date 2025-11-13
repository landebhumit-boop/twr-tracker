import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { AlertCircle } from "lucide-react";

export function AssetAllocationPlaceholder() {
  // Sample data to illustrate the feature
  const sampleAllocations = [
    { assetClass: "US Equities", current: 45, target: 50, variance: -5 },
    { assetClass: "International Equities", current: 25, target: 20, variance: 5 },
    { assetClass: "Fixed Income", current: 20, target: 20, variance: 0 },
    { assetClass: "Alternatives", current: 7, target: 7, variance: 0 },
    { assetClass: "Cash", current: 3, target: 3, variance: 0 },
  ];

  return (
    <Card className="border-dashed border-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              Asset Allocation (Current vs Target)
              <Badge variant="outline" className="font-normal">
                <AlertCircle className="h-3 w-3 mr-1" />
                Requires Position Data
              </Badge>
            </CardTitle>
            <CardDescription>
              Compare current portfolio allocation against target allocation (requires granular position data with ISIN)
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-muted/50 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground mb-2">
              <strong>Data Requirements:</strong> Position-level data with ISIN, asset class classifications, and target allocation percentages
            </p>
            <p className="text-sm text-muted-foreground">
              This view will help identify allocation drift and potential rebalancing opportunities by comparing actual holdings against target allocations.
            </p>
          </div>

          <div className="opacity-60 space-y-6">
            {sampleAllocations.map((allocation) => (
              <div key={allocation.assetClass} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="font-medium">{allocation.assetClass}</div>
                  <div className="flex items-center gap-4">
                    <span className="text-muted-foreground">
                      Current: <span className="font-mono font-semibold text-foreground">{allocation.current}%</span>
                    </span>
                    <span className="text-muted-foreground">
                      Target: <span className="font-mono font-semibold text-foreground">{allocation.target}%</span>
                    </span>
                    <Badge 
                      variant={allocation.variance === 0 ? "outline" : allocation.variance > 0 ? "default" : "secondary"}
                      className={
                        allocation.variance === 0 
                          ? "" 
                          : allocation.variance > 0 
                            ? "bg-chart-2 text-chart-2-foreground" 
                            : "bg-chart-1 text-chart-1-foreground"
                      }
                    >
                      {allocation.variance > 0 ? "+" : ""}{allocation.variance}%
                    </Badge>
                  </div>
                </div>
                <div className="relative">
                  <Progress value={allocation.current} className="h-3" />
                  {/* Target marker */}
                  <div 
                    className="absolute top-0 h-3 w-1 bg-destructive rounded"
                    style={{ left: `${allocation.target}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="bg-muted/50 p-3 rounded-lg mt-4">
            <p className="text-xs text-muted-foreground">
              <strong>Legend:</strong> Green badge indicates overweight position, blue badge indicates underweight position. Red marker on progress bar indicates target allocation.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
