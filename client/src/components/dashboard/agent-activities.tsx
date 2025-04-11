import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { RefreshCw, ChevronRight, Bot } from "lucide-react";
import { formatTimeAgo } from "@/lib/utils";
import { getColorForAgentType } from "@/lib/utils";

export default function AgentActivities() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['/api/agent-activities'],
  });

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
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-start">
                <Skeleton className="h-8 w-8 rounded-full mr-3 flex-shrink-0" />
                <div className="w-full">
                  <Skeleton className="h-4 w-24 mb-1" />
                  <Skeleton className="h-3 w-full mb-1" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-center">
            <Skeleton className="h-4 w-32" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleRefresh = () => {
    refetch();
  };

  return (
    <Card className="shadow-sm transition-all duration-200 hover:translate-y-[-4px] hover:shadow-md h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold text-primary">Agent Activities</CardTitle>
          <Button variant="ghost" size="icon" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data && data.slice(0, 4).map((activity: any) => {
            const colors = getColorForAgentType(activity.agentType);
            
            return (
              <div 
                key={activity.id}
                className={`flex items-start p-3 ${colors.bg} rounded-lg border-l-4 ${colors.border}`}
              >
                <div className={`h-8 w-8 rounded-full ${colors.icon} flex items-center justify-center text-white mr-3 flex-shrink-0`}>
                  <Bot className="h-4 w-4" />
                </div>
                <div className="text-sm">
                  <p className="font-medium text-primary">{activity.title}</p>
                  <p className="text-[#7F8C8D] text-xs">{activity.description}</p>
                  <p className="text-xs text-[#7F8C8D] mt-1">{formatTimeAgo(activity.timestamp)}</p>
                </div>
              </div>
            );
          })}
        </div>
        
        <Button 
          variant="ghost" 
          className="w-full mt-4 text-sm text-primary hover:text-secondary flex items-center justify-center"
        >
          <span>View all activities</span>
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
