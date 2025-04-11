import { useQuery } from "@tanstack/react-query";
import {
  Activity,
  AlertTriangle,
  Package,
  TrendingUp
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPercentage } from "@/lib/utils";

export default function StatusOverview() {
  const { data, isLoading } = useQuery({
    queryKey: ['/api/dashboard/overview'],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="shadow-sm">
            <CardContent className="p-5">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-8 w-16" />
                </div>
                <Skeleton className="h-10 w-10 rounded-full" />
              </div>
              <div className="flex items-center">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-3 w-24 ml-2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const metrics = [
    {
      title: "Stock Health",
      value: data?.stockHealth || 0,
      unit: "%",
      change: 3.2,
      period: "from last week",
      icon: Activity,
      iconBg: "bg-green-100",
      iconColor: "text-secondary",
      changeColor: "text-secondary"
    },
    {
      title: "Stockout Risk",
      value: data?.stockoutRisk || 0,
      unit: "",
      change: 5.7,
      period: "from last week",
      icon: AlertTriangle,
      iconBg: "bg-yellow-100",
      iconColor: "text-warning",
      changeColor: "text-danger"
    },
    {
      title: "Overstock Items",
      value: data?.overstockItems || 0,
      unit: "",
      change: -2.3,
      period: "from last week",
      icon: Package,
      iconBg: "bg-blue-100",
      iconColor: "text-primary",
      changeColor: "text-secondary"
    },
    {
      title: "Forecast Accuracy",
      value: data?.forecastAccuracy || 0,
      unit: "%",
      change: 1.8,
      period: "from last month",
      icon: TrendingUp,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      changeColor: "text-secondary"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {metrics.map((metric, index) => (
        <Card 
          key={index} 
          className="shadow-sm transition-all duration-200 hover:translate-y-[-4px] hover:shadow-md"
        >
          <CardContent className="p-5">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-[#7F8C8D] font-medium text-sm">{metric.title}</h3>
                <p className="text-2xl font-bold text-primary">
                  {metric.value}{metric.unit}
                </p>
              </div>
              <div className={`h-10 w-10 rounded-full ${metric.iconBg} flex items-center justify-center`}>
                <metric.icon className={`${metric.iconColor} h-5 w-5`} />
              </div>
            </div>
            <div className="flex items-center">
              <span className={`${metric.changeColor} text-sm font-medium`}>
                {metric.change > 0 ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 inline" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="18 15 12 9 6 15" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 inline" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                )}
                {" "}{formatPercentage(Math.abs(metric.change))}
              </span>
              <span className="text-[#7F8C8D] text-xs ml-2">{metric.period}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
