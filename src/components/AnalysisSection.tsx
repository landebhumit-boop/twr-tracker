import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserX, Calendar, Clock } from "lucide-react";

interface AnalysisSectionProps {
  totalAccounts: number;
  activeAccounts: number;
  closedAccounts: number;
  avgHistory: number;
  maxHistory: number;
  minHistory: number;
}

export function AnalysisSection({ 
  totalAccounts, 
  activeAccounts, 
  closedAccounts, 
  avgHistory, 
  maxHistory, 
  minHistory 
}: AnalysisSectionProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Investment Data Analysis</h2>
        <p className="text-muted-foreground">
          Comprehensive analysis answering key questions about account performance, cash flows, and data quality insights
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Open/Active Accounts
            </CardTitle>
            <Users className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-success">{activeAccounts}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {((activeAccounts / totalAccounts) * 100).toFixed(1)}% of total accounts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Closed Accounts
            </CardTitle>
            <UserX className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{closedAccounts}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {((closedAccounts / totalAccounts) * 100).toFixed(1)}% of total accounts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average History
            </CardTitle>
            <Calendar className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{avgHistory.toFixed(2)} years</div>
            <p className="text-xs text-muted-foreground mt-1">
              Mean account lifespan
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              History Range
            </CardTitle>
            <Clock className="h-4 w-4 text-chart-3" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-chart-3">
              {minHistory.toFixed(2)} - {maxHistory.toFixed(2)} years
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Min to max account history
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
