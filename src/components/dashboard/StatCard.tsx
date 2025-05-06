
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: ReactNode;
  className?: string;
  trend?: "up" | "down" | "neutral";
  valueClassName?: string;
}

export function StatCard({
  title,
  value,
  description,
  icon,
  className,
  trend,
  valueClassName,
}: StatCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-5 w-5 text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-1.5">
          <div className={cn("text-2xl font-bold", valueClassName)}>{value}</div>
          {description && (
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              {trend === "up" && (
                <span className="text-success text-xs">↑</span>
              )}
              {trend === "down" && (
                <span className="text-destructive text-xs">↓</span>
              )}
              {description}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
