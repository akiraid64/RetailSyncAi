import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, RefreshCw } from "lucide-react";
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { formatDateOnly } from "@/lib/utils";

export default function DemandForecast() {
  const [timeRange, setTimeRange] = useState("7");
  
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['/api/forecasts'],
  });

  const handleRefresh = () => {
    refetch();
  };

  if (isLoading) {
    return (
      <Card className="shadow-sm">
        <CardHeader className="pb-0">
          <div className="flex justify-between items-center">
            <Skeleton className="h-6 w-40" />
            <div className="flex space-x-2">
              <Skeleton className="h-9 w-32" />
              <Skeleton className="h-9 w-9" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <Skeleton className="h-64 w-full" />
          <div className="flex justify-between mt-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-24" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Process forecast data for chart
  const chartData = data ? data.map((forecast: any) => ({
    date: formatDateOnly(forecast.startDate),
    actual: Math.round(forecast.predictedDemand * (forecast.confidence - 0.1)),
    forecast: forecast.predictedDemand,
    reorderPoint: Math.round(forecast.predictedDemand * 0.3)
  })) : [];

  return (
    <Card className="shadow-sm transition-all duration-200 hover:translate-y-[-4px] hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold text-primary">Demand Forecast</CardTitle>
          <div className="flex space-x-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="text-sm border-[#ECF0F1] rounded-md py-1 h-9 w-40">
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Next 7 Days</SelectItem>
                <SelectItem value="30">Next 30 Days</SelectItem>
                <SelectItem value="90">Next Quarter</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="ghost" size="icon" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" fontSize={10} tickMargin={5} />
                <YAxis fontSize={10} />
                <Tooltip 
                  formatter={(value) => [`${value} units`, '']}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Legend />
                <Bar dataKey="actual" name="Actual Sales" fill="#27AE60" />
                <Bar dataKey="forecast" name="Forecasted Sales" fill="#2C3E50" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-gray-500">No forecast data available</p>
            </div>
          )}
        </div>

        <div className="flex justify-between mt-4 text-sm">
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-full bg-secondary mr-2"></div>
            <span className="text-[#7F8C8D]">Actual Sales</span>
          </div>
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-full bg-primary mr-2"></div>
            <span className="text-[#7F8C8D]">Forecasted Sales</span>
          </div>
          <div className="flex items-center">
            <div className="h-3 w-3 border border-dashed border-warning rounded-full mr-2"></div>
            <span className="text-[#7F8C8D]">Reorder Point</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
