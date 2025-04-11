import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Info, LightbulbIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency, formatPercentage } from "@/lib/utils";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";

export default function PriceOptimization() {
  const { toast } = useToast();
  
  const { data: optimizations, isLoading } = useQuery({
    queryKey: ['/api/price-optimizations'],
  });

  const { data: insightData, isLoading: insightLoading } = useQuery({
    queryKey: ['/api/insights/inventory'],
  });

  const updateOptimizationMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number, status: string }) => {
      const response = await apiRequest("PATCH", `/api/price-optimizations/${id}`, { status });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/price-optimizations'] });
      toast({
        title: "Price optimization updated",
        description: "The price optimization status has been updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to update",
        description: `Error: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const handleApply = (id: number) => {
    updateOptimizationMutation.mutate({ id, status: "applied" });
  };

  const handleDismiss = (id: number) => {
    updateOptimizationMutation.mutate({ id, status: "dismissed" });
  };

  if (isLoading) {
    return (
      <Card className="shadow-sm h-full">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-9 w-9" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
          <Skeleton className="h-24 w-full mt-4" />
        </CardContent>
      </Card>
    );
  }

  // Filter pending optimizations
  const pendingOptimizations = optimizations
    ? optimizations
        .filter((opt: any) => opt.status === "pending")
        .slice(0, 3)
    : [];

  return (
    <Card className="shadow-sm transition-all duration-200 hover:translate-y-[-4px] hover:shadow-md h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold text-primary">Price Optimization</CardTitle>
          <Button variant="ghost" size="icon">
            <Info className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {pendingOptimizations.length > 0 ? (
            pendingOptimizations.map((optimization: any) => {
              const bgClass = optimization.reason === "overstock" 
                ? "bg-red-50" 
                : optimization.reason === "lowstock" 
                  ? "bg-green-50" 
                  : "bg-yellow-50";
                  
              const statusClass = optimization.reason === "overstock" 
                ? "bg-blue-100 text-primary" 
                : "bg-yellow-100 text-warning";

              return (
                <div key={optimization.id} className={`p-3 ${bgClass} rounded-lg`}>
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-medium text-primary text-sm">{optimization.product.name}</p>
                    <span className={`${statusClass} px-2 py-1 rounded-full text-xs`}>
                      {optimization.reason === "overstock" ? "Overstock" : "Low Stock"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <div>
                      <p className="text-[#7F8C8D]">
                        Current: <span className="font-medium">{formatCurrency(optimization.currentPrice)}</span>
                      </p>
                      <p className="text-secondary">
                        Suggested: <span className="font-medium">{formatCurrency(optimization.suggestedPrice)}</span>
                      </p>
                    </div>
                    <div>
                      <span className={`${optimization.percentageChange < 0 ? 'text-danger' : 'text-secondary'} font-medium`}>
                        {formatPercentage(optimization.percentageChange)}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 flex space-x-2">
                    <Button 
                      size="sm"
                      className="bg-secondary hover:bg-secondary/90 text-white text-xs px-3 py-1"
                      onClick={() => handleApply(optimization.id)}
                      disabled={updateOptimizationMutation.isPending}
                    >
                      Apply
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border border-[#ECF0F1] text-[#7F8C8D] text-xs px-3 py-1"
                      onClick={() => handleDismiss(optimization.id)}
                      disabled={updateOptimizationMutation.isPending}
                    >
                      Dismiss
                    </Button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-6 text-center">
              <p className="text-[#7F8C8D]">No pending price optimizations</p>
            </div>
          )}
        </div>
        
        <div className="mt-4 p-3 bg-[#ECF0F1] rounded-lg text-sm">
          <div className="flex items-start">
            <LightbulbIcon className="text-warning mt-0.5 mr-2 h-4 w-4" />
            <div>
              <p className="font-medium text-primary">AI Insight</p>
              <p className="text-[#7F8C8D] text-xs">
                {insightLoading ? "Loading insights..." : insightData?.insight || "No insights available."}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
