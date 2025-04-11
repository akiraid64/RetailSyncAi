import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, Filter, RefreshCw, FileText, ExternalLink, Phone, Mail, MapPin, Clock } from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDateOnly } from "@/lib/utils";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#27AE60', '#F1C40F', '#E74C3C', '#2C3E50'];

export default function Suppliers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentTab, setCurrentTab] = useState("suppliers");
  
  // Fetch suppliers
  const { data: suppliers, isLoading: suppliersLoading } = useQuery({
    queryKey: ['/api/suppliers'],
  });
  
  // Fetch orders
  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ['/api/orders'],
  });
  
  // Filter suppliers based on search
  const filteredSuppliers = suppliers ? suppliers.filter((supplier: any) => {
    return searchTerm === "" || 
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (supplier.contactPerson && supplier.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (supplier.email && supplier.email.toLowerCase().includes(searchTerm.toLowerCase()));
  }) : [];
  
  // Performance data for charts
  const supplierPerformanceData = suppliers ? suppliers.map((supplier: any, index: number) => {
    // Generate sample performance data
    return {
      name: supplier.name,
      reliability: 85 + Math.floor(Math.random() * 15),
      leadTime: 70 + Math.floor(Math.random() * 25),
      qualityScore: 80 + Math.floor(Math.random() * 20),
      costEfficiency: 75 + Math.floor(Math.random() * 20)
    };
  }) : [];
  
  // Order status distribution for pie chart
  const orderStatusData = [
    { name: 'Pending', value: orders ? orders.filter((order: any) => order.status === 'pending').length : 0 },
    { name: 'Confirmed', value: orders ? orders.filter((order: any) => order.status === 'confirmed').length : 0 },
    { name: 'Shipped', value: orders ? orders.filter((order: any) => order.status === 'shipped').length : 0 },
    { name: 'Delivered', value: orders ? orders.filter((order: any) => order.status === 'delivered').length : 0 },
  ];
  
  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-primary">Supplier Management</h1>
          <p className="text-[#7F8C8D]">Manage supplier relationships and purchase orders</p>
        </div>
        
        <div className="flex space-x-3 mt-4 md:mt-0">
          <Button 
            variant="outline" 
            className="flex items-center border-[#ECF0F1]"
          >
            <FileText className="mr-2 h-4 w-4" />
            <span>Export</span>
          </Button>
          
          <Button className="bg-secondary hover:bg-secondary/90 flex items-center">
            <Plus className="mr-2 h-4 w-4" />
            <span>Add Supplier</span>
          </Button>
        </div>
      </div>
      
      <Tabs value={currentTab} onValueChange={setCurrentTab} className="mb-6">
        <TabsList className="grid w-full grid-cols-4 md:w-auto md:inline-flex">
          <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
          <TabsTrigger value="orders">Purchase Orders</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="forecasts">Order Forecasts</TabsTrigger>
        </TabsList>
      </Tabs>

      {currentTab === "suppliers" && (
        <div className="space-y-6">
          {/* Supplier Filter Controls */}
          <Card className="shadow-sm">
            <CardContent className="p-5">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#7F8C8D]" />
                  <Input 
                    type="text" 
                    placeholder="Search by supplier name, contact person or email..." 
                    className="pl-9 border-[#ECF0F1]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <Button variant="outline" className="border-[#ECF0F1]">
                    <Filter className="h-4 w-4 mr-2" /> Filters
                  </Button>
                  
                  <Button variant="outline" className="border-[#ECF0F1]" onClick={() => setSearchTerm("")}>
                    <RefreshCw className="h-4 w-4 mr-2" /> Reset
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Suppliers List */}
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold text-primary">Suppliers Directory</CardTitle>
            </CardHeader>
            <CardContent>
              {suppliersLoading ? (
                <div className="flex justify-center items-center h-64">
                  <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              ) : filteredSuppliers.length === 0 ? (
                <div className="text-center py-12">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <p className="text-[#7F8C8D] text-lg">No suppliers found matching your search</p>
                  <Button 
                    variant="outline" 
                    className="mt-4 border-[#ECF0F1]"
                    onClick={() => setSearchTerm("")}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" /> Clear Search
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredSuppliers.map((supplier: any) => (
                    <Card key={supplier.id} className="overflow-hidden hover:shadow-md transition-shadow duration-200">
                      <CardContent className="p-0">
                        <div className="p-4">
                          <div className="flex justify-between items-start mb-3">
                            <h3 className="font-medium text-primary text-lg">{supplier.name}</h3>
                            <Badge className="bg-green-100 text-secondary hover:bg-green-200">Active</Badge>
                          </div>
                          
                          {supplier.contactPerson && (
                            <div className="flex items-center text-sm mb-2">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#7F8C8D] mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                              </svg>
                              <span>{supplier.contactPerson}</span>
                            </div>
                          )}
                          
                          {supplier.email && (
                            <div className="flex items-center text-sm mb-2">
                              <Mail className="h-4 w-4 text-[#7F8C8D] mr-2" />
                              <span>{supplier.email}</span>
                            </div>
                          )}
                          
                          {supplier.phone && (
                            <div className="flex items-center text-sm mb-2">
                              <Phone className="h-4 w-4 text-[#7F8C8D] mr-2" />
                              <span>{supplier.phone}</span>
                            </div>
                          )}
                          
                          {supplier.address && (
                            <div className="flex items-start text-sm mb-2">
                              <MapPin className="h-4 w-4 text-[#7F8C8D] mr-2 mt-0.5" />
                              <span>{supplier.address}</span>
                            </div>
                          )}
                          
                          <div className="mt-4 grid grid-cols-2 gap-2">
                            <div className="bg-gray-50 p-2 rounded">
                              <p className="text-xs text-[#7F8C8D]">Avg. Lead Time</p>
                              <p className="font-medium">14 days</p>
                            </div>
                            <div className="bg-gray-50 p-2 rounded">
                              <p className="text-xs text-[#7F8C8D]">Reliability</p>
                              <p className="font-medium">96%</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="border-t border-[#ECF0F1] p-3 flex justify-between items-center bg-gray-50">
                          <p className="text-sm text-[#7F8C8D] flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>Active since Jan 2023</span>
                          </p>
                          <Button variant="ghost" size="sm" className="text-primary hover:text-secondary flex items-center text-xs">
                            <span>View Details</span>
                            <ExternalLink className="ml-1 h-3 w-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {currentTab === "orders" && (
        <div className="space-y-6">
          {/* Orders Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <Card className="shadow-sm transition-all duration-200 hover:translate-y-[-4px] hover:shadow-md">
              <CardContent className="p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-[#7F8C8D] font-medium text-sm">Open Orders</h3>
                    <p className="text-2xl font-bold text-primary">
                      {orders ? orders.filter((order: any) => order.status === 'pending' || order.status === 'confirmed').length : 0}
                    </p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                      <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                    </svg>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className="bg-primary h-1.5 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm transition-all duration-200 hover:translate-y-[-4px] hover:shadow-md">
              <CardContent className="p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-[#7F8C8D] font-medium text-sm">In Transit</h3>
                    <p className="text-2xl font-bold text-primary">
                      {orders ? orders.filter((order: any) => order.status === 'shipped').length : 0}
                    </p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-warning" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="1" y="3" width="15" height="13" />
                      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                      <circle cx="5.5" cy="18.5" r="2.5" />
                      <circle cx="18.5" cy="18.5" r="2.5" />
                    </svg>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className="bg-warning h-1.5 rounded-full" style={{ width: '40%' }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm transition-all duration-200 hover:translate-y-[-4px] hover:shadow-md">
              <CardContent className="p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-[#7F8C8D] font-medium text-sm">Delivered</h3>
                    <p className="text-2xl font-bold text-primary">
                      {orders ? orders.filter((order: any) => order.status === 'delivered').length : 0}
                    </p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className="bg-secondary h-1.5 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm transition-all duration-200 hover:translate-y-[-4px] hover:shadow-md">
              <CardContent className="p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-[#7F8C8D] font-medium text-sm">Delayed</h3>
                    <p className="text-2xl font-bold text-primary">2</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-danger" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="12"></line>
                      <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className="bg-danger h-1.5 rounded-full" style={{ width: '10%' }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Orders Table */}
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-semibold text-primary">Purchase Orders</CardTitle>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#7F8C8D]" />
                    <Input 
                      type="text" 
                      placeholder="Search orders..." 
                      className="pl-9 border-[#ECF0F1] w-[200px]"
                    />
                  </div>
                  <Button className="bg-secondary hover:bg-secondary/90 flex items-center">
                    <Plus className="mr-2 h-4 w-4" />
                    <span>New Order</span>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {ordersLoading ? (
                <div className="flex justify-center items-center h-64">
                  <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              ) : orders && orders.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Supplier</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Order Date</TableHead>
                      <TableHead>Delivery Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order: any) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">PO-{order.id.toString().padStart(5, '0')}</TableCell>
                        <TableCell>{suppliers ? suppliers.find((s: any) => s.id === order.supplierId)?.name : 'Loading...'}</TableCell>
                        <TableCell>{order.locationId}</TableCell>
                        <TableCell>{formatDateOnly(order.orderDate)}</TableCell>
                        <TableCell>{order.deliveryDate ? formatDateOnly(order.deliveryDate) : '-'}</TableCell>
                        <TableCell>
                          <Badge className={
                            order.status === 'pending' ? 'bg-blue-100 text-primary hover:bg-blue-200' : 
                            order.status === 'confirmed' ? 'bg-yellow-100 text-warning hover:bg-yellow-200' :
                            order.status === 'shipped' ? 'bg-purple-100 text-purple-600 hover:bg-purple-200' :
                            'bg-green-100 text-secondary hover:bg-green-200'
                          }>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="12" r="1" />
                              <circle cx="19" cy="12" r="1" />
                              <circle cx="5" cy="12" r="1" />
                            </svg>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-12">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <p className="text-[#7F8C8D] text-lg">No purchase orders found</p>
                  <Button 
                    className="mt-4 bg-secondary hover:bg-secondary/90"
                  >
                    <Plus className="h-4 w-4 mr-2" /> Create New Order
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {currentTab === "performance" && (
        <div className="space-y-6">
          {/* Performance Overview Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold text-primary">Order Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={orderStatusData}
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {orderStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} orders`, 'Count']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold text-primary">Supplier Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={supplierPerformanceData.slice(0, 3)}
                      layout="vertical"
                      margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                      <XAxis type="number" domain={[0, 100]} />
                      <YAxis dataKey="name" type="category" width={100} />
                      <Tooltip formatter={(value) => [`${value}%`, '']} />
                      <Legend />
                      <Bar dataKey="reliability" name="Reliability" fill="#27AE60" />
                      <Bar dataKey="leadTime" name="Lead Time" fill="#F1C40F" />
                      <Bar dataKey="qualityScore" name="Quality" fill="#2C3E50" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Detailed Performance Metrics */}
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold text-primary">Supplier Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Supplier</TableHead>
                    <TableHead>On-Time Delivery</TableHead>
                    <TableHead>Order Accuracy</TableHead>
                    <TableHead>Product Quality</TableHead>
                    <TableHead>Responsiveness</TableHead>
                    <TableHead>Cost Competitiveness</TableHead>
                    <TableHead className="text-right">Overall Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {suppliers && suppliers.map((supplier: any, index: number) => {
                    // Generate sample performance metrics
                    const otd = 85 + Math.floor(Math.random() * 15);
                    const accuracy = 90 + Math.floor(Math.random() * 10);
                    const quality = 80 + Math.floor(Math.random() * 20);
                    const responsiveness = 75 + Math.floor(Math.random() * 20);
                    const cost = 70 + Math.floor(Math.random() * 25);
                    const overall = Math.floor((otd + accuracy + quality + responsiveness + cost) / 5);
                    
                    return (
                      <TableRow key={supplier.id}>
                        <TableCell className="font-medium">{supplier.name}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <span className="w-9 text-xs">{otd}%</span>
                            <div className="w-24 bg-gray-200 rounded-full h-2 ml-2">
                              <div className={`h-2 rounded-full ${otd >= 90 ? 'bg-secondary' : otd >= 75 ? 'bg-warning' : 'bg-danger'}`} style={{ width: `${otd}%` }}></div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <span className="w-9 text-xs">{accuracy}%</span>
                            <div className="w-24 bg-gray-200 rounded-full h-2 ml-2">
                              <div className={`h-2 rounded-full ${accuracy >= 90 ? 'bg-secondary' : accuracy >= 75 ? 'bg-warning' : 'bg-danger'}`} style={{ width: `${accuracy}%` }}></div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <span className="w-9 text-xs">{quality}%</span>
                            <div className="w-24 bg-gray-200 rounded-full h-2 ml-2">
                              <div className={`h-2 rounded-full ${quality >= 90 ? 'bg-secondary' : quality >= 75 ? 'bg-warning' : 'bg-danger'}`} style={{ width: `${quality}%` }}></div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <span className="w-9 text-xs">{responsiveness}%</span>
                            <div className="w-24 bg-gray-200 rounded-full h-2 ml-2">
                              <div className={`h-2 rounded-full ${responsiveness >= 90 ? 'bg-secondary' : responsiveness >= 75 ? 'bg-warning' : 'bg-danger'}`} style={{ width: `${responsiveness}%` }}></div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <span className="w-9 text-xs">{cost}%</span>
                            <div className="w-24 bg-gray-200 rounded-full h-2 ml-2">
                              <div className={`h-2 rounded-full ${cost >= 90 ? 'bg-secondary' : cost >= 75 ? 'bg-warning' : 'bg-danger'}`} style={{ width: `${cost}%` }}></div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge className={
                            overall >= 90 ? 'bg-green-100 text-secondary' :
                            overall >= 80 ? 'bg-blue-100 text-primary' :
                            overall >= 70 ? 'bg-yellow-100 text-warning' :
                            'bg-red-100 text-danger'
                          }>
                            {overall}%
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          {/* Lead Time Analysis */}
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold text-primary">Lead Time Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={supplierPerformanceData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis unit=" days" />
                    <Tooltip formatter={(value, name) => [name === 'leadTime' ? `${Math.round(value / 10)} days` : `${value}%`, name === 'leadTime' ? 'Average Lead Time' : name]} />
                    <Legend />
                    <Bar name="Actual Lead Time" dataKey="leadTime" fill="#2C3E50" />
                    <Bar name="Promised Lead Time" dataKey="reliability" fill="#27AE60" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {currentTab === "forecasts" && (
        <div className="space-y-6">
          {/* Order Forecast Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="shadow-sm transition-all duration-200 hover:translate-y-[-4px] hover:shadow-md">
              <CardContent className="p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-[#7F8C8D] font-medium text-sm">Forecasted Orders</h3>
                    <p className="text-2xl font-bold text-primary">17</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M7 12a5 5 0 0 1 5-5 5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5Z"></path>
                      <path d="M12 19c4.438 0 8-3.562 8-8 0-4.437-3.562-8-8-8-4.437 0-8 3.563-8 8 0 4.438 3.563 8 8 8Z"></path>
                      <path d="M12 19c4.438 0 8-3.562 8-8 0-4.437-3.562-8-8-8-4.437 0-8 3.563-8 8 0 4.438 3.563 8 8 8Z"></path>
                      <path d="M12 15V9"></path>
                      <path d="M9 12h6"></path>
                    </svg>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-xs text-[#7F8C8D]">Next 30 days</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm transition-all duration-200 hover:translate-y-[-4px] hover:shadow-md">
              <CardContent className="p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-[#7F8C8D] font-medium text-sm">Estimated Value</h3>
                    <p className="text-2xl font-bold text-primary">$127,543</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="1" x2="12" y2="23"></line>
                      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                    </svg>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-xs text-secondary">↑ 12.3% from last month</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm transition-all duration-200 hover:translate-y-[-4px] hover:shadow-md">
              <CardContent className="p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-[#7F8C8D] font-medium text-sm">Forecast Accuracy</h3>
                    <p className="text-2xl font-bold text-primary">94.2%</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-warning" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2v5"></path>
                      <path d="M12 13v9"></path>
                      <path d="M5 8l4 4"></path>
                      <path d="M15 8l-4 4"></path>
                      <path d="M19.5 12H22"></path>
                      <path d="M2 12h2.5"></path>
                    </svg>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-xs text-secondary">↑ 1.8% improvement</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm transition-all duration-200 hover:translate-y-[-4px] hover:shadow-md">
              <CardContent className="p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-[#7F8C8D] font-medium text-sm">Suppliers Involved</h3>
                    <p className="text-2xl font-bold text-primary">5</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-xs text-[#7F8C8D]">Top supplier: GlobalSupply Inc.</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Upcoming Orders */}
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold text-primary">Upcoming Order Forecast</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Estimated Cost</TableHead>
                    <TableHead>Suggested Order Date</TableHead>
                    <TableHead>Expected Delivery</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* Sample forecast data */}
                  <TableRow>
                    <TableCell className="font-medium">Premium Cotton T-shirt (Black)</TableCell>
                    <TableCell>500 units</TableCell>
                    <TableCell>GlobalSupply Inc.</TableCell>
                    <TableCell>$7,995</TableCell>
                    <TableCell>Oct 15, 2023</TableCell>
                    <TableCell>Oct 29, 2023</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" className="h-8 border-[#ECF0F1]">
                        Create Order
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Premium Cotton T-shirt (White)</TableCell>
                    <TableCell>350 units</TableCell>
                    <TableCell>GlobalSupply Inc.</TableCell>
                    <TableCell>$5,596</TableCell>
                    <TableCell>Oct 15, 2023</TableCell>
                    <TableCell>Oct 29, 2023</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" className="h-8 border-[#ECF0F1]">
                        Create Order
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Designer Jeans (Slim Fit)</TableCell>
                    <TableCell>200 units</TableCell>
                    <TableCell>FashionFabrics Ltd.</TableCell>
                    <TableCell>$15,998</TableCell>
                    <TableCell>Oct 18, 2023</TableCell>
                    <TableCell>Nov 2, 2023</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" className="h-8 border-[#ECF0F1]">
                        Create Order
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Summer Dress (Floral)</TableCell>
                    <TableCell>150 units</TableCell>
                    <TableCell>FashionFabrics Ltd.</TableCell>
                    <TableCell>$7,498</TableCell>
                    <TableCell>Oct 20, 2023</TableCell>
                    <TableCell>Nov 4, 2023</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" className="h-8 border-[#ECF0F1]">
                        Create Order
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Winter Jacket (Insulated)</TableCell>
                    <TableCell>100 units</TableCell>
                    <TableCell>TextileTech</TableCell>
                    <TableCell>$12,999</TableCell>
                    <TableCell>Oct 22, 2023</TableCell>
                    <TableCell>Nov 8, 2023</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" className="h-8 border-[#ECF0F1]">
                        Create Order
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          {/* AI-Generated Insights */}
          <Card className="shadow-sm">
            <CardHeader className="pb-0">
              <CardTitle className="text-lg font-semibold text-primary">AI Supply Chain Insights</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-start p-4 bg-blue-50 rounded-lg border-l-4 border-primary">
                  <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white mr-3 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 3 19 10 12 17 5 10 12 3"></polygon>
                      <path d="M15 21H9"></path>
                      <line x1="12" y1="17" x2="12" y2="21"></line>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-primary">Order Consolidation Opportunity</h3>
                    <p className="text-sm text-[#7F8C8D] mt-1">Consolidating the Premium Cotton T-shirt orders into a single purchase order could reduce shipping costs by approximately 15% and may qualify for an additional 3% bulk discount from GlobalSupply Inc.</p>
                  </div>
                </div>
                
                <div className="flex items-start p-4 bg-green-50 rounded-lg border-l-4 border-secondary">
                  <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center text-white mr-3 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2v20"/>
                      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-primary">Cost Saving Prediction</h3>
                    <p className="text-sm text-[#7F8C8D] mt-1">Based on historical data, placing these orders 3 days earlier than suggested could save approximately $3,240 due to avoiding supplier price increases scheduled for mid-month.</p>
                  </div>
                </div>
                
                <div className="flex items-start p-4 bg-yellow-50 rounded-lg border-l-4 border-warning">
                  <div className="h-10 w-10 rounded-full bg-warning flex items-center justify-center text-white mr-3 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                      <line x1="12" y1="9" x2="12" y2="13"></line>
                      <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-primary">Supply Chain Risk Alert</h3>
                    <p className="text-sm text-[#7F8C8D] mt-1">There is a 65% probability of shipping delays from TextileTech due to ongoing port congestion. Consider ordering Winter Jackets 7 days earlier than suggested to mitigate potential stockout risk.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
