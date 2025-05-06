
import { useCallback, useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { MemoryUsageCard } from "@/components/dashboard/MemoryUsageCard";
import { HitRatioChart } from "@/components/dashboard/HitRatioChart";
import { CacheItemsTable } from "@/components/dashboard/CacheItemsTable";
import { ClientsUpTimeCard } from "@/components/dashboard/ClientsUpTimeCard";
import { CacheData, fetchCacheData, formatNumber } from "@/services/cacheApi";
import { Activity, Clock, Database, MemoryStick, RefreshCw } from "lucide-react";

const Index = () => {
  const [cacheData, setCacheData] = useState<CacheData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);
  
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchCacheData();
      setCacheData(data);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch cache data");
      toast.error("Failed to fetch cache data", {
        description: "Check if the backend server is running",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle cache item deletion
  const handleCacheItemDeleted = useCallback(() => {
    fetchData();
  }, [fetchData]);

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auto-refresh every 10 seconds
  useEffect(() => {
    if (!autoRefreshEnabled) return;
    
    const intervalId = setInterval(() => {
      fetchData();
    }, 10000);
    
    return () => clearInterval(intervalId);
  }, [fetchData, autoRefreshEnabled]);

  // Error handling display
  if (error && !cacheData) {
    return (
      <div className="container mx-auto p-4 md:p-6">
        <DashboardHeader 
          isLoading={isLoading} 
          lastUpdated={lastUpdated} 
          uptime={0} 
          onRefresh={fetchData} 
        />
        <div className="mt-6 flex flex-col items-center justify-center p-8">
          <Card className="max-w-lg p-6 text-center">
            <h2 className="text-xl font-semibold text-destructive mb-2">Connection Error</h2>
            <p className="mb-4 text-muted-foreground">Unable to connect to cache server.</p>
            <p className="text-sm mb-6">Make sure your backend server is running at: <br/><code className="bg-secondary p-1 rounded">http://127.0.0.1:8000</code></p>
            <button 
              onClick={fetchData} 
              className="inline-flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry Connection
            </button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <DashboardHeader 
        isLoading={isLoading} 
        lastUpdated={lastUpdated} 
        uptime={cacheData?.uptime_seconds || 0}
        onRefresh={fetchData} 
      />

      {cacheData ? (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Cached Queries"
            value={formatNumber(Object.keys(cacheData.keys_with_details).length)}
            description="Active cache entries"
            icon={<Database className="h-4 w-4" />}
          />
          <StatCard
            title="Evicted Keys"
            value={formatNumber(cacheData.evicted_keys)}
            description="Keys removed due to memory limits"
            icon={<MemoryStick className="h-4 w-4" />}
            trend={cacheData.evicted_keys > 0 ? "up" : "neutral"}
          />
          <StatCard
            title="Expired Keys"
            value={formatNumber(cacheData.expired_keys)}
            description="Keys removed due to TTL expiration"
            icon={<Clock className="h-4 w-4" />}
          />
          <StatCard
            title="Connected Clients"
            value={formatNumber(cacheData.connected_clients)}
            description="Active client connections"
            icon={<Activity className="h-4 w-4" />}
          />

          <div className="md:col-span-2">
            <MemoryUsageCard memoryUsage={cacheData.memory_usage} />
          </div>
          <div className="md:col-span-2">
            <HitRatioChart hitMissRatio={cacheData.hit_miss_ratio} />
          </div>

          <div className="md:col-span-2">
            <ClientsUpTimeCard 
              connectedClients={cacheData.connected_clients}
              uptimeSeconds={cacheData.uptime_seconds}
              totalCommandsProcessed={cacheData.total_commands_processed}
            />
          </div>

          <div className="lg:col-span-4 md:col-span-2">
            <CacheItemsTable 
              keysWithDetails={cacheData.keys_with_details} 
              onItemDeleted={handleCacheItemDeleted} 
            />
          </div>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="p-6">
              <div className="h-[100px] flex items-center justify-center">
                <div className="animate-pulse h-4 bg-muted rounded w-3/4"></div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Index;
