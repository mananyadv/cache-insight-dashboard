
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { CacheData, deleteCacheItem } from "@/services/cacheApi";
import { Search, Trash2 } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/sonner";

interface CacheItemsTableProps {
  keysWithDetails: CacheData["keys_with_details"];
  onItemDeleted?: () => void;
}

export function CacheItemsTable({ keysWithDetails, onItemDeleted }: CacheItemsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [keyToDelete, setKeyToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleDeleteClick = useCallback((key: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setKeyToDelete(key);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!keyToDelete) return;
    
    setIsDeleting(true);
    try {
      const success = await deleteCacheItem(keyToDelete);
      if (success) {
        if (selectedKey === keyToDelete) {
          setSelectedKey(null);
        }
        if (onItemDeleted) {
          onItemDeleted();
        }
      }
    } finally {
      setIsDeleting(false);
      setKeyToDelete(null);
    }
  }, [keyToDelete, onItemDeleted, selectedKey]);

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
                  <div 
                    key={key} 
                    className="grid grid-cols-12 items-center border-b px-4 py-3 animate-fade-in hover:bg-muted/30 cursor-pointer"
                    onClick={() => handleKeyClick(key)}
                  >
                    <div className="col-span-6 truncate text-sm">{key.split(" (")[0]}</div>
                    <div className="col-span-3 text-right text-sm">{details.ttl}</div>
                    <div className="col-span-3 text-right flex items-center justify-end space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleKeyClick(key);
                        }}
                      >
                        View
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={(e) => handleDeleteClick(key, e)}
                      >
                        <Trash2 className="h-4 w-4" />
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
            <div className="flex justify-end">
              <Button 
                variant="destructive" 
                onClick={() => {
                  if (selectedKey) {
                    setKeyToDelete(selectedKey);
                  }
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Cache Item
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!keyToDelete} onOpenChange={(open) => !open && setKeyToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Cache Item</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this cache item? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
