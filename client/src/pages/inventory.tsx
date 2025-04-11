import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Search, Filter, Download, Plus, RefreshCw, ArrowUpRight, MoreHorizontal } from "lucide-react";
import { getColorForStatus } from "@/lib/utils";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Inventory() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [view, setView] = useState("list");
  
  // Fetch inventory data
  const { data: inventory, isLoading } = useQuery({
    queryKey: ['/api/inventory'],
  });
  
  // Fetch locations
  const { data: locations } = useQuery({
    queryKey: ['/api/locations'],
  });
  
  // Filter inventory based on filters
  const filteredInventory = inventory ? inventory.filter((item: any) => {
    const matchesSearch = searchTerm === "" || 
      item.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.product.sku.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesCategory = categoryFilter === "all" || item.product.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    const matchesLocation = locationFilter === "all" || item.location.id.toString() === locationFilter;
    
    return matchesSearch && matchesCategory && matchesStatus && matchesLocation;
  }) : [];
  
  // Sort inventory
  const sortedInventory = [...filteredInventory].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.product.name.localeCompare(b.product.name);
      case "sku":
        return a.product.sku.localeCompare(b.product.sku);
      case "quantity":
        return b.quantity - a.quantity;
      case "status":
        return a.status.localeCompare(b.status);
      default:
        return 0;
    }
  });
  
  // Get unique categories from products
  const categories = inventory 
    ? Array.from(new Set(inventory.map((item: any) => item.product.category)))
    : [];
  
  // Prepare data for the overview charts
  const statusChartData = inventory ? [
    { name: 'Optimal', value: inventory.filter((item: any) => item.status === 'optimal').length },
    { name: 'Low Stock', value: inventory.filter((item: any) => item.status === 'low').length },
    { name: 'Overstock', value: inventory.filter((item: any) => item.status === 'overstock').length },
    { name: 'Critical', value: inventory.filter((item: any) => item.status === 'critical').length },
  ] : [];
  
  const locationChartData = inventory && locations ? locations.map((location: any) => {
    const itemsInLocation = inventory.filter((item: any) => item.location.id === location.id);
    return {
      name: location.name,
      value: itemsInLocation.length,
      optimal: itemsInLocation.filter((item: any) => item.status === 'optimal').length,
      low: itemsInLocation.filter((item: any) => item.status === 'low').length,
      overstock: itemsInLocation.filter((item: any) => item.status === 'overstock').length,
      critical: itemsInLocation.filter((item: any) => item.status === 'critical').length,
    };
  }) : [];
  
  const COLORS = ['#27AE60', '#F1C40F', '#2C3E50', '#E74C3C'];
  
  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-primary">Inventory Management</h1>
          <p className="text-[#7F8C8D]">Monitor and manage stock levels across all locations</p>
        </div>
        
        <div className="flex space-x-3 mt-4 md:mt-0">
          <Button 
            variant="outline" 
            className="flex items-center border-[#ECF0F1]"
          >
            <Download className="mr-2 h-4 w-4" />
            <span>Export</span>
          </Button>
          
          <Button className="bg-secondary hover:bg-secondary/90 flex items-center">
            <Plus className="mr-2 h-4 w-4" />
            <span>Add Product</span>
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card className="shadow-sm transition-all duration-200 hover:translate-y-[-4px] hover:shadow-md">
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-[#7F8C8D] font-medium text-sm">Total Products</h3>
                <p className="text-2xl font-bold text-primary">{inventory ? inventory.length : 0}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                  <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/>
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div className="bg-primary h-1.5 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm transition-all duration-200 hover:translate-y-[-4px] hover:shadow-md">
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-[#7F8C8D] font-medium text-sm">Low Stock Items</h3>
                <p className="text-2xl font-bold text-primary">
                  {inventory ? inventory.filter((item: any) => item.status === 'low').length : 0}
                </p>
              </div>
              <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-warning" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div className="bg-warning h-1.5 rounded-full" style={{ width: inventory ? `${(inventory.filter((item: any) => item.status === 'low').length / inventory.length) * 100}%` : '0%' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm transition-all duration-200 hover:translate-y-[-4px] hover:shadow-md">
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-[#7F8C8D] font-medium text-sm">Overstock Items</h3>
                <p className="text-2xl font-bold text-primary">
                  {inventory ? inventory.filter((item: any) => item.status === 'overstock').length : 0}
                </p>
              </div>
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/>
                  <line x1="7" y1="7" x2="7.01" y2="7"/>
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div className="bg-primary h-1.5 rounded-full" style={{ width: inventory ? `${(inventory.filter((item: any) => item.status === 'overstock').length / inventory.length) * 100}%` : '0%' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm transition-all duration-200 hover:translate-y-[-4px] hover:shadow-md">
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-[#7F8C8D] font-medium text-sm">Critical Items</h3>
                <p className="text-2xl font-bold text-primary">
                  {inventory ? inventory.filter((item: any) => item.status === 'critical').length : 0}
                </p>
              </div>
              <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-danger" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div className="bg-danger h-1.5 rounded-full" style={{ width: inventory ? `${(inventory.filter((item: any) => item.status === 'critical').length / inventory.length) * 100}%` : '0%' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Inventory Overview Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-primary">Inventory Status Distribution</CardTitle>
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
                  <Tooltip formatter={(value) => [`${value} items`, 'Count']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-primary">Inventory by Location</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={locationChartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="optimal" name="Optimal" stackId="a" fill="#27AE60" />
                  <Bar dataKey="low" name="Low Stock" stackId="a" fill="#F1C40F" />
                  <Bar dataKey="overstock" name="Overstock" stackId="a" fill="#2C3E50" />
                  <Bar dataKey="critical" name="Critical" stackId="a" fill="#E74C3C" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Inventory Filter Controls */}
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
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[150px] border-[#ECF0F1]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category: string) => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px] border-[#ECF0F1]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="optimal">Optimal</SelectItem>
                  <SelectItem value="low">Low Stock</SelectItem>
                  <SelectItem value="overstock">Overstock</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="w-[150px] border-[#ECF0F1]">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {locations && locations.map((location: any) => (
                    <SelectItem key={location.id} value={location.id.toString()}>{location.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[150px] border-[#ECF0F1]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="sku">SKU</SelectItem>
                  <SelectItem value="quantity">Quantity</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" className="border-[#ECF0F1]" onClick={() => {
                setSearchTerm("");
                setCategoryFilter("all");
                setStatusFilter("all");
                setLocationFilter("all");
                setSortBy("name");
              }}>
                <RefreshCw className="h-4 w-4 mr-2" /> Reset
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Inventory List View */}
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-semibold text-primary">Inventory Items</CardTitle>
            <Tabs value={view} onValueChange={setView} className="w-[200px]">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="list">List</TabsTrigger>
                <TabsTrigger value="grid">Grid</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : sortedInventory.length === 0 ? (
            <div className="text-center py-12">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="text-[#7F8C8D] text-lg">No inventory items found matching your filters</p>
              <Button 
                variant="outline" 
                className="mt-4 border-[#ECF0F1]"
                onClick={() => {
                  setSearchTerm("");
                  setCategoryFilter("all");
                  setStatusFilter("all");
                  setLocationFilter("all");
                }}
              >
                <RefreshCw className="h-4 w-4 mr-2" /> Clear Filters
              </Button>
            </div>
          ) : view === "list" ? (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-[#ECF0F1] text-[#7F8C8D]">
                    <th className="px-4 py-3 text-left font-medium rounded-l-lg">Product Name</th>
                    <th className="px-4 py-3 text-left font-medium">SKU</th>
                    <th className="px-4 py-3 text-left font-medium">Category</th>
                    <th className="px-4 py-3 text-left font-medium">Location</th>
                    <th className="px-4 py-3 text-left font-medium">Quantity</th>
                    <th className="px-4 py-3 text-left font-medium">Min/Max</th>
                    <th className="px-4 py-3 text-left font-medium">Status</th>
                    <th className="px-4 py-3 text-left font-medium rounded-r-lg">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ECF0F1]">
                  {sortedInventory.map((item: any) => {
                    const { bg, text } = getColorForStatus(item.status);
                    
                    return (
                      <tr key={item.id} className="hover:bg-[#ECF0F1]">
                        <td className="px-4 py-3 font-medium">{item.product.name}</td>
                        <td className="px-4 py-3 text-[#7F8C8D]">{item.product.sku}</td>
                        <td className="px-4 py-3">{item.product.category}</td>
                        <td className="px-4 py-3">{item.location.name}</td>
                        <td className="px-4 py-3 font-medium">{item.quantity}</td>
                        <td className="px-4 py-3 text-[#7F8C8D]">{item.minStockLevel}/{item.maxStockLevel}</td>
                        <td className="px-4 py-3">
                          <span className={`${bg} ${text} px-2 py-1 rounded-full text-xs`}>
                            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <Button variant="ghost" size="icon" className="text-primary hover:text-secondary">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedInventory.map((item: any) => {
                const { bg, text } = getColorForStatus(item.status);
                
                return (
                  <Card key={item.id} className="overflow-hidden hover:shadow-md transition-shadow duration-200">
                    <CardContent className="p-0">
                      <div className="p-4">
                        <div className="flex justify-between mb-2">
                          <span className={`${bg} ${text} px-2 py-1 rounded-full text-xs`}>
                            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                          </span>
                          <span className="text-xs text-[#7F8C8D]">{item.product.category}</span>
                        </div>
                        <h3 className="font-medium text-primary mb-1">{item.product.name}</h3>
                        <p className="text-xs text-[#7F8C8D] mb-3">SKU: {item.product.sku}</p>
                        
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <p className="text-[#7F8C8D] text-xs">Location</p>
                            <p>{item.location.name}</p>
                          </div>
                          <div>
                            <p className="text-[#7F8C8D] text-xs">Quantity</p>
                            <p className="font-medium">{item.quantity}</p>
                          </div>
                          <div>
                            <p className="text-[#7F8C8D] text-xs">Min Level</p>
                            <p>{item.minStockLevel}</p>
                          </div>
                          <div>
                            <p className="text-[#7F8C8D] text-xs">Max Level</p>
                            <p>{item.maxStockLevel}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border-t border-[#ECF0F1] p-3 flex justify-between items-center bg-gray-50">
                        <p className="text-sm text-primary font-medium">${item.product.price.toFixed(2)}</p>
                        <Button variant="ghost" size="sm" className="text-primary hover:text-secondary flex items-center text-xs">
                          <span>View Details</span>
                          <ArrowUpRight className="ml-1 h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
