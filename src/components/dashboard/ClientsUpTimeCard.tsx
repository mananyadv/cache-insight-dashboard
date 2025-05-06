
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDuration } from "@/services/cacheApi";
import { Clock, Database, Server } from "lucide-react";

interface ClientsUpTimeCardProps {
  connectedClients: number;
  uptimeSeconds: number;
  totalCommandsProcessed: number;
}

export function ClientsUpTimeCard({
  connectedClients,
  uptimeSeconds,
  totalCommandsProcessed,
}: ClientsUpTimeCardProps) {
  const formattedUptime = formatDuration(uptimeSeconds);
  const formattedCommands = new Intl.NumberFormat().format(totalCommandsProcessed);

  const commandsPerSecond = uptimeSeconds > 0 
    ? Math.round(totalCommandsProcessed / uptimeSeconds) 
    : 0;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Server Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Server className="h-4 w-4 text-muted-foreground" />
            <div className="space-y-0.5">
              <p className="text-sm font-medium">Connected Clients</p>
              <p className="text-xl font-bold">{connectedClients}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <div className="space-y-0.5">
              <p className="text-sm font-medium">Uptime</p>
              <p className="text-xl font-bold">{formattedUptime}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Database className="h-4 w-4 text-muted-foreground" />
            <div className="space-y-0.5">
              <p className="text-sm font-medium">Commands Processed</p>
              <div className="flex items-baseline gap-2">
                <p className="text-xl font-bold">{formattedCommands}</p>
                <span className="text-xs text-muted-foreground">
                  (~{commandsPerSecond}/sec)
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
