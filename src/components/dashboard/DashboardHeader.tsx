
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { formatDuration } from "@/services/cacheApi";
import { RefreshCw } from "lucide-react";

interface DashboardHeaderProps {
  isLoading: boolean;
  lastUpdated: Date | null;
  uptime: number;
  onRefresh: () => void;
}

export function DashboardHeader({
  isLoading,
  lastUpdated,
  uptime,
  onRefresh,
}: DashboardHeaderProps) {
  const formattedLastUpdated = lastUpdated
    ? new Intl.DateTimeFormat("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).format(lastUpdated)
    : null;

  const handleRefresh = () => {
    toast.info("Refreshing cache data...");
    onRefresh();
  };

  return (
    <div className="flex items-center justify-between pb-4 border-b">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Cache Monitor</h1>
        <div className="flex items-center gap-2 mt-1">
          <Badge variant="outline" className="text-xs font-normal">
            Uptime: {formatDuration(uptime)}
          </Badge>
          {lastUpdated && (
            <span className="text-xs text-muted-foreground">
              Last updated: {formattedLastUpdated}
            </span>
          )}
          {isLoading && (
            <div className="flex items-center">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
              </span>
            </div>
          )}
        </div>
      </div>
      <Button
        onClick={handleRefresh}
        disabled={isLoading}
        className="flex items-center gap-2"
      >
        <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
        Refresh
      </Button>
    </div>
  );
}
