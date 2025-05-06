
import { toast } from "@/components/ui/sonner";

export interface CacheData {
  keys_with_details: {
    [key: string]: {
      ttl: string;
      data: any;
    };
  };
  memory_usage: {
    used_memory: number;
    used_memory_human: string;
    used_memory_peak: number;
    used_memory_peak_human: string;
    used_memory_lua: number;
    used_memory_lua_human: string;
    maxmemory: number;
    maxmemory_human: string;
    maxmemory_policy: string;
  };
  all_cache_items: {
    [key: string]: any;
  };
  hit_miss_ratio: {
    hits: number;
    misses: number;
    hit_rate: number;
  };
  evicted_keys: number;
  expired_keys: number;
  connected_clients: number;
  uptime_seconds: number;
  total_commands_processed: number;
}

export const fetchCacheData = async (): Promise<CacheData> => {
  try {
    const response = await fetch("'https://ml-apps-dev.siemens-healthineers.com/tax-websocket-bot/retrievers/tax-rag/cache-items", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching cache data:", error);
    toast.error("Failed to fetch cache data. Check server connection.");
    throw error;
  }
};

// New function to delete a cache item
export const deleteCacheItem = async (key: string): Promise<boolean> => {
  try {
    const actualKey = key.match(/\((.*?)\)/)?.[1];
    
    if (!actualKey) {
      toast.error("Invalid cache key format");
      return false;
    }
    
    const response = await fetch(`http://127.0.0.1:8000/retrievers/tax-rag/cache-items/${encodeURIComponent(actualKey)}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    toast.success("Cache item deleted successfully");
    return true;
  } catch (error) {
    console.error("Error deleting cache item:", error);
    toast.error("Failed to delete cache item");
    return false;
  }
};

// Helper function to format seconds into human-readable duration
export const formatDuration = (seconds: number): string => {
  if (!seconds || isNaN(seconds)) return "N/A";
  
  const days = Math.floor(seconds / (24 * 60 * 60));
  const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((seconds % (60 * 60)) / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  let result = "";

  if (days > 0) result += `${days}d `;
  if (hours > 0) result += `${hours}h `;
  if (minutes > 0) result += `${minutes}m `;
  if (remainingSeconds > 0 || result === "") result += `${remainingSeconds}s`;

  return result.trim();
};

// Helper function to format numbers with commas for readability
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat().format(num);
};
