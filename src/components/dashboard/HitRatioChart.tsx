
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CacheData } from "@/services/cacheApi";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface HitRatioChartProps {
  hitMissRatio: CacheData["hit_miss_ratio"];
}

export function HitRatioChart({ hitMissRatio }: HitRatioChartProps) {
  const data = [
    { name: "Hits", value: hitMissRatio.hits },
    { name: "Misses", value: hitMissRatio.misses },
  ];

  const COLORS = ["#10b981", "#f43f5e"];

  const hitRate = hitMissRatio.hit_rate * 100;
  const formattedHitRate = hitRate.toFixed(1);

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Cache Hit/Miss Ratio</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          <div className="text-2xl font-bold mb-2">{formattedHitRate}% Hit Rate</div>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                  label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}`, "Count"]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="text-xs text-muted-foreground mt-2">
            Total Operations: {hitMissRatio.hits + hitMissRatio.misses}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
