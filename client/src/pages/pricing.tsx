import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Search, Filter, Check, X, ArrowUp, ArrowDown, RefreshCw, BarChart2, LightbulbIcon } from "lucide-react";
import { formatCurrency, formatPercentage } from "@/lib/utils";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function Pricing() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("percentageChange");
  const [view, setView] = useState("pending");
  
  // Fetch price optimizations
  const { data: optimizations, isLoading } = useQuery({
    queryKey: ['/api/price-optimizations'],
  });
  
  // Filter optimizations based on search and status
  const filteredOptimizations = optimizations ? optimizations.filter((opt: any) => {
    const matchesSearch = searchTerm === "" || 
      opt.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opt.product.sku.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = statusFilter === "all" || opt.status === statusFilter;
    const matchesView = view === "all" || (view === "pending" && opt.status === "pending");
    
    return matchesSearch && matchesStatus && matchesView;
  }) : [];
  
  // Sort optimizations
  const sortedOptimizations = [...(filteredOptimizations || [])].sort((a, b) => {
    switch (sortBy) {
      case "percentageChange":
        return Math.abs(b.percentageChange) - Math.abs(a.percentageChange);
      case "suggestedPrice":
        return b.suggestedPrice - a.suggestedPrice;
      case "currentPrice":
        return b.currentPrice - a.currentPrice;
      case "product":
        return a.product.name.localeCompare(b.product.name);
      default:
        return 0;
    }
  });
  
  // Update price optimization mutation
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
  
  // Handle applying a price optimization
  const handleApply = (id: number) => {
    updateOptimizationMutation.mutate({ id, status: "applied" });
  };

  // Handle dismissing a price optimization
  const handleDismiss = (id: number) => {
    updateOptimizationMutation.mutate({ id, status: "dismissed" });
  };
  
  // Generate data for the overview charts
  const overviewData = {
    pending: optimizations ? optimizations.filter((opt: any) => opt.status === "pending").length : 0,
    applied: optimizations ? optimizations.filter((opt: any) => opt.status === "applied").length : 0,
    dismissed: optimizations ? optimizations.filter((opt: any) => opt.status === "dismissed").length : 0,
    increases: optimizations ? optimizations.filter((opt: any) => opt.percentageChange > 0).length : 0,
    decreases: optimizations ? optimizations.filter((opt: any) => opt.percentageChange < 0).length : 0,
  };
  
  const statusChartData = [
    { name: 'Pending', value: overviewData.pending },
    { name: 'Applied', value: overviewData.applied },
    { name: 'Dismissed', value: overviewData.dismissed },
  ];
  
  const reasonChartData = optimizations ? [
    { name: 'Overstock', value: optimizations.filter((opt: any) => opt.reason === "overstock").length },
    { name: 'Low Stock', value: optimizations.filter((opt: any) => opt.reason === "lowstock").length },
    { name: 'Seasonal', value: optimizations.filter((opt: any) => opt.reason === "seasonal").length },
    { name: 'Competitive', value: optimizations.filter((opt: any) => opt.reason === "competitive").length },
  ] : [];
  
  const COLORS = ['#F1C40F', '#27AE60', '#7F8C8D', '#E74C3C', '#2C3E50'];
  
  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-primary">Price Optimization</h1>
          <p className="text-[#7F8C8D]">AI-driven pricing recommendations based on inventory levels and market demand</p>
        </div>
        
        <div className="flex space-x-3 mt-4 md:mt-0">
          <Button 
            className="bg-secondary hover:bg-secondary/90 flex items-center"
            onClick={() => {
              toast({
                title: "Generating optimizations",
                description: "Analyzing inventory to generate new price recommendations...",
              });
              
              // Simulate a delay for the optimization process
              setTimeout(() => {
                queryClient.invalidateQueries({ queryKey: ['/api/price-optimizations'] });
                toast({
                  title: "Price optimizations updated",
                  description: "New price recommendations are now available.",
                });
              }, 2000);
            }}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            <span>Update Recommendations</span>
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card className="shadow-sm transition-all duration-200 hover:translate-y-[-4px] hover:shadow-md">
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-[#7F8C8D] font-medium text-sm">Total Recommendations</h3>
                <p className="text-2xl font-bold text-primary">{optimizations ? optimizations.length : 0}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <BarChart2 className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <span className="text-secondary text-sm font-medium">Active</span>
              <div className="flex-1 mx-2">
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div className="bg-secondary h-1.5 rounded-full" style={{ width: `${(overviewData.pending / (optimizations?.length || 1)) * 100}%` }}></div>
                </div>
              </div>
              <span className="text-[#7F8C8D] text-xs">{overviewData.pending} pending</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm transition-all duration-200 hover:translate-y-[-4px] hover:shadow-md">
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-[#7F8C8D] font-medium text-sm">Price Increases</h3>
                <p className="text-2xl font-bold text-primary">{overviewData.increases}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                <ArrowUp className="h-5 w-5 text-secondary" />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <span className="text-[#7F8C8D] text-sm">Ratio</span>
              <div className="flex-1 mx-2">
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${(overviewData.increases / (optimizations?.length || 1)) * 100}%` }}></div>
                </div>
              </div>
              <span className="text-[#7F8C8D] text-xs">{Math.round((overviewData.increases / (optimizations?.length || 1)) * 100)}%</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm transition-all duration-200 hover:translate-y-[-4px] hover:shadow-md">
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-[#7F8C8D] font-medium text-sm">Price Decreases</h3>
                <p className="text-2xl font-bold text-primary">{overviewData.decreases}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                <ArrowDown className="h-5 w-5 text-danger" />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <span className="text-[#7F8C8D] text-sm">Ratio</span>
              <div className="flex-1 mx-2">
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div className="bg-red-500 h-1.5 rounded-full" style={{ width: `${(overviewData.decreases / (optimizations?.length || 1)) * 100}%` }}></div>
                </div>
              </div>
              <span className="text-[#7F8C8D] text-xs">{Math.round((overviewData.decreases / (optimizations?.length || 1)) * 100)}%</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm transition-all duration-200 hover:translate-y-[-4px] hover:shadow-md">
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-[#7F8C8D] font-medium text-sm">Applied Changes</h3>
                <p className="text-2xl font-bold text-primary">{overviewData.applied}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                <Check className="h-5 w-5 text-warning" />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <span className="text-[#7F8C8D] text-sm">Rate</span>
              <div className="flex-1 mx-2">
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div className="bg-warning h-1.5 rounded-full" style={{ width: `${(overviewData.applied / ((overviewData.applied + overviewData.dismissed) || 1)) * 100}%` }}></div>
                </div>
              </div>
              <span className="text-[#7F8C8D] text-xs">{Math.round((overviewData.applied / ((overviewData.applied + overviewData.dismissed) || 1)) * 100)}%</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Overview Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-primary">Price Change Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusChartData}
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {statusChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} recommendations`, 'Count']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-primary">Price Change Reasons</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={reasonChartData}
                  layout="vertical"
                  margin={{ top: 20, right: 30, left: 60, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={80} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" name="Recommendations" fill="#2C3E50" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Insight Card */}
      <Card className="shadow-sm mb-6">
        <CardContent className="p-5">
          <div className="flex items-start">
            <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center text-warning mr-4 flex-shrink-0">
              <LightbulbIcon className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-primary mb-2">AI Price Optimization Insight</h3>
              <p className="text-[#7F8C8D]">
                Based on current inventory levels and sales data, we've identified an opportunity to increase revenue by applying 
                these pricing recommendations. Products with low stock levels can be priced higher to capitalize on demand, while 
                overstocked items can be discounted to accelerate turnover. Our AI analysis suggests these changes could improve 
                overall profit margins by approximately 8.7% and reduce inventory holding costs by 22%.
              </p>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <p className="text-xs text-[#7F8C8D] mb-1">Projected Revenue Impact</p>
                  <p className="text-xl font-bold text-secondary">+12.4%</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <p className="text-xs text-[#7F8C8D] mb-1">Inventory Turnover</p>
                  <p className="text-xl font-bold text-primary">+18.9%</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <p className="text-xs text-[#7F8C8D] mb-1">Margin Optimization</p>
                  <p className="text-xl font-bold text-warning">+8.7%</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Price Optimization Filter Controls */}
      <Card className="shadow-sm mb-6">
        <CardContent className="p-5">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#7F8C8D]" />
              <Input 
                type="text" 
                placeholder="Search by product name or SKU..." 
                className="pl-9 border-[#ECF0F1]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Tabs value={view} onValueChange={setView} className="w-[240px]">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="all">All</TabsTrigger>
                </TabsList>
              </Tabs>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px] border-[#ECF0F1]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="applied">Applied</SelectItem>
                  <SelectItem value="dismissed">Dismissed</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[150px] border-[#ECF0F1]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentageChange">% Change</SelectItem>
                  <SelectItem value="currentPrice">Current Price</SelectItem>
                  <SelectItem value="suggestedPrice">Suggested Price</SelectItem>
                  <SelectItem value="product">Product Name</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" className="border-[#ECF0F1]" onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
                setSortBy("percentageChange");
              }}>
                <RefreshCw className="h-4 w-4 mr-2" /> Reset
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Price Recommendations List */}
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold text-primary">Price Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
          ) : sortedOptimizations.length === 0 ? (
            <div className="text-center py-12">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-[#7F8C8D] text-lg">No price recommendations found matching your filters</p>
              <Button 
                variant="outline" 
                className="mt-4 border-[#ECF0F1]"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                }}
              >
                <RefreshCw className="h-4 w-4 mr-2" /> Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedOptimizations.map((optimization: any) => {
                const isIncrease = optimization.percentageChange > 0;
                const bgClass = optimization.reason === "overstock" 
                  ? "bg-red-50" 
                  : optimization.reason === "lowstock" 
                    ? "bg-green-50" 
                    : "bg-yellow-50";
                    
                const statusClass = optimization.reason === "overstock" 
                  ? "bg-blue-100 text-primary" 
                  : "bg-yellow-100 text-warning";
                  
                return (
                  <div key={optimization.id} className={`p-4 ${bgClass} rounded-lg`}>
                    <div className="flex justify-between items-center mb-2">
                      <p className="font-medium text-primary">{optimization.product.name}</p>
                      <span className={`${statusClass} px-2 py-1 rounded-full text-xs`}>
                        {optimization.reason === "overstock" ? "Overstock" : "Low Stock"}
                      </span>
                    </div>
                    <p className="text-xs text-[#7F8C8D] mb-3">SKU: {optimization.product.sku}</p>
                    
                    <div className="flex justify-between items-center text-sm mb-4">
                      <div>
                        <p className="text-[#7F8C8D]">
                          Current: <span className="font-medium">{formatCurrency(optimization.currentPrice)}</span>
                        </p>
                        <p className="text-secondary">
                          Suggested: <span className="font-medium">{formatCurrency(optimization.suggestedPrice)}</span>
                        </p>
                      </div>
                      <div>
                        <span className={`${isIncrease ? 'text-secondary' : 'text-danger'} font-medium text-lg`}>
                          {formatPercentage(optimization.percentageChange)}
                        </span>
                      </div>
                    </div>
                    
                    {optimization.status === "pending" ? (
                      <div className="flex space-x-2">
                        <Button 
                          className="flex-1 bg-secondary hover:bg-secondary/90 text-white"
                          onClick={() => handleApply(optimization.id)}
                          disabled={updateOptimizationMutation.isPending}
                        >
                          <Check className="mr-2 h-4 w-4" /> Apply
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1 border-[#ECF0F1] text-[#7F8C8D]"
                          onClick={() => handleDismiss(optimization.id)}
                          disabled={updateOptimizationMutation.isPending}
                        >
                          <X className="mr-2 h-4 w-4" /> Dismiss
                        </Button>
                      </div>
                    ) : (
                      <div className="bg-gray-100 p-2 rounded text-center">
                        <p className={`text-sm ${optimization.status === "applied" ? "text-secondary" : "text-[#7F8C8D]"}`}>
                          {optimization.status === "applied" ? (
                            <><Check className="inline-block h-4 w-4 mr-1" /> Applied</>
                          ) : (
                            <><X className="inline-block h-4 w-4 mr-1" /> Dismissed</>
                          )}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
