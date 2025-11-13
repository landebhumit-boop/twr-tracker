import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AnalysisMethodology() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Analysis Methodology</CardTitle>
        <p className="text-sm text-muted-foreground">How the data was analyzed to answer these questions</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold text-sm mb-2">Account Status Determination:</h3>
          <p className="text-sm text-muted-foreground">
            Accounts are classified as "closed" if the latest ending market value equals zero. All other accounts are considered "active" regardless of recent activity.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-sm mb-2">History Length Calculation:</h3>
          <p className="text-sm text-muted-foreground">
            Account history is measured from the earliest record with a positive beginning market value to the latest ending market value date, converted to years using precise date arithmetic.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-sm mb-2">Return Calculations:</h3>
          <p className="text-sm text-muted-foreground">
            Cumulative and annualized returns are calculated using the earliest positive beginning market value as the initial investment and the latest ending market value as the final value. Formula: Annualized TWR = (1 + Cumulative TWR)^(1/years) - 1
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-sm mb-2">Net Cash Flow Calculation:</h3>
          <p className="text-sm text-muted-foreground">
            For each period, net cash flow = inflows - outflows. Positive values indicate net contributions, negative values indicate net withdrawals. Data is aggregated by period end date.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-sm mb-2">Management Fee Detection:</h3>
          <p className="text-sm text-muted-foreground">
            Management fees are identified by comparing Net IRR to Gross IRR for each period. When Net IRR ≠ Gross IRR, it indicates fees were deducted from returns. The difference represents the fee impact on performance.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-sm mb-2">Years Calculation:</h3>
          <p className="text-sm text-muted-foreground">
            All time periods use a 365-day year convention. Days between dates ÷ 365 = years. This ensures consistency across all calculations and annualization formulas.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
