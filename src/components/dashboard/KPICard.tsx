import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
}

export function KPICard({ title, value, description, icon: Icon, trend, trendValue }: KPICardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {(description || trendValue) && (
            <p className="text-xs text-muted-foreground mt-1">
                {trend === 'up' && <span className="text-green-500 mr-1">↑ {trendValue}</span>}
                {trend === 'down' && <span className="text-red-500 mr-1">↓ {trendValue}</span>}
                {description}
            </p>
        )}
      </CardContent>
    </Card>
  );
}
