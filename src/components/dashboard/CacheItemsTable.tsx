
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { CacheData } from "@/services/cacheApi";
import { Search } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

interface CacheItemsTableProps {
  keysWithDetails: CacheData["keys_with_details"];
}

export function CacheItemsTable({ keysWithDetails }: CacheItemsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  const filteredKeys = useMemo(() => {
    return Object.entries(keysWithDetails).filter(([key]) => 
      key.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [keysWithDetails, searchTerm]);

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleKeyClick = useCallback((key: string) => {
    setSelectedKey(key);
  }, []);

  const selectedData = selectedKey ? keysWithDetails[selectedKey] : null;

  return (
    <>
      <Card className="h-full overflow-hidden">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-medium">Cache Items</CardTitle>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search queries..."
              className="pl-8 w-[200px] md:w-[300px]"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="border-t">
            <div className="grid grid-cols-12 border-b bg-muted/50 px-4 py-2 text-xs font-medium">
              <div className="col-span-6">Search Query</div>
              <div className="col-span-3 text-right">TTL</div>
              <div className="col-span-3 text-right">Actions</div>
            </div>
            <div className="max-h-[500px] overflow-auto">
              {filteredKeys.length > 0 ? (
                filteredKeys.map(([key, details]) => (
                  <div key={key} className="grid grid-cols-12 items-center border-b px-4 py-3 animate-fade-in">
                    <div className="col-span-6 truncate text-sm">{key.split(" (")[0]}</div>
                    <div className="col-span-3 text-right text-sm">{details.ttl}</div>
                    <div className="col-span-3 text-right">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleKeyClick(key)}
                      >
                        View Data
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-4 py-8 text-center text-muted-foreground">
                  No cache items found matching your search.
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedKey} onOpenChange={(open) => !open && setSelectedKey(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Cache Item Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-1">Search Query</h4>
              <p className="text-sm bg-secondary p-2 rounded">{selectedKey?.split(" (")[0]}</p>
            </div>
            <div>
              <h4 className="font-medium mb-1">Cache Key</h4>
              <p className="text-sm bg-secondary p-2 rounded">{selectedKey?.match(/\((.*)\)/)?.[1]}</p>
            </div>
            <div>
              <h4 className="font-medium mb-1">Time To Live (TTL)</h4>
              <p className="text-sm bg-secondary p-2 rounded">{selectedData?.ttl}</p>
            </div>
            <div>
              <h4 className="font-medium mb-1">Cached Data</h4>
              <pre className="text-xs bg-secondary p-2 rounded overflow-auto max-h-[400px]">
                {JSON.stringify(selectedData?.data, null, 2)}
              </pre>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
