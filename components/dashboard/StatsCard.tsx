import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  loading?: boolean;
  className?: string;
  change?: {
    value: number;
    type: "increase" | "decrease";
  };
}

export function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  loading, 
  className,
  change 
}: StatsCardProps) {
  if (loading) {
    return (
      <Card className={cn("transition-smooth hover:shadow-soft", className)}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-5 w-5 rounded" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-16 mb-2" />
          <Skeleton className="h-3 w-24" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("transition-smooth hover:shadow-soft hover:scale-[1.02]", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <h3 className="text-sm font-medium text-muted-foreground">
          {title}
        </h3>
        <Icon className="h-5 w-5 text-primary" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-foreground mb-1">
          {value.toLocaleString()}
        </div>
        {change && (
          <p className="text-xs text-muted-foreground">
            <span 
              className={cn(
                "font-medium",
                change.type === "increase" ? "text-secondary" : "text-destructive"
              )}
            >
              {change.type === "increase" ? "+" : "-"}{Math.abs(change.value)}%
            </span>
            {" "}from last month
          </p>
        )}
      </CardContent>
    </Card>
  );
}