import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: "up" | "down" | "neutral";
  className?: string;
  auditContent?: React.ReactNode;
}

export function MetricCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon,
  trend,
  className,
  auditContent
}: MetricCardProps) {
  const isPositive = typeof value === 'number' ? value > 0 : value.toString().includes('-') === false;
  
  return (
    <Card className={cn("transition-all hover:shadow-lg", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {Icon && (
          <Icon className={cn(
            "h-4 w-4",
            trend === "up" && "text-success",
            trend === "down" && "text-destructive",
            !trend && "text-muted-foreground"
          )} />
        )}
      </CardHeader>
      <CardContent>
        <TooltipProvider>
          {auditContent ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className={cn(
                  "text-2xl font-bold cursor-help inline-block border-b border-dotted border-muted-foreground/50",
                  typeof value === 'number' && value > 0 && "text-success",
                  typeof value === 'number' && value < 0 && "text-destructive"
                )}>
                  {typeof value === 'number' ? value.toLocaleString() : value}
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-sm">
                <div className="text-xs space-y-1">
                  {auditContent}
                </div>
              </TooltipContent>
            </Tooltip>
          ) : (
            <div className={cn(
              "text-2xl font-bold",
              typeof value === 'number' && value > 0 && "text-success",
              typeof value === 'number' && value < 0 && "text-destructive"
            )}>
              {typeof value === 'number' ? value.toLocaleString() : value}
            </div>
          )}
        </TooltipProvider>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">
            {subtitle}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
