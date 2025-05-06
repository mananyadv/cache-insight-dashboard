
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CacheData } from "@/services/cacheApi";

interface MemoryUsageCardProps {
  memoryUsage: CacheData["memory_usage"];
}

export function MemoryUsageCard({ memoryUsage }: MemoryUsageCardProps) {
  const usedPercentage = memoryUsage.maxmemory
    ? (memoryUsage.used_memory / memoryUsage.maxmemory) * 100
    : 0;
  
  // Determine the color based on usage percentage
  let progressColor = "bg-primary";
  if (usedPercentage > 85) progressColor = "bg-destructive";
  else if (usedPercentage > 70) progressColor = "bg-warning";
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-3">
          <div className="space-y-0.5">
            <div className="text-2xl font-bold">
              {memoryUsage.used_memory_human} / {memoryUsage.maxmemory_human}
            </div>
            <div className="text-xs text-muted-foreground">
              {memoryUsage.maxmemory_policy} policy
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Used</span>
              <span>{Math.round(usedPercentage)}%</span>
            </div>
            <Progress value={usedPercentage} className={progressColor} />
          </div>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-muted-foreground">Peak Usage</span>
              <p className="font-medium">{memoryUsage.used_memory_peak_human}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Lua Memory</span>
              <p className="font-medium">{memoryUsage.used_memory_lua_human}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
