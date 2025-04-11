import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Search, RefreshCw, BarChart2, BotOff, Activity, ArrowRight, Bot } from "lucide-react";
import { getColorForAgentType, formatTimeAgo } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Sample data for agent performance metrics
const agentPerformanceData = [
  { name: 'Mon', forecast: 94, inventory: 92, supplier: 97, pricing: 91 },
  { name: 'Tue', forecast: 93, inventory: 90, supplier: 95, pricing: 90 },
  { name: 'Wed', forecast: 95, inventory: 94, supplier: 93, pricing: 92 },
  { name: 'Thu', forecast: 92, inventory: 95, supplier: 92, pricing: 94 },
  { name: 'Fri', forecast: 96, inventory: 91, supplier: 94, pricing: 95 },
  { name: 'Sat', forecast: 97, inventory: 93, supplier: 96, pricing: 93 },
  { name: 'Sun', forecast: 94, inventory: 96, supplier: 98, pricing: 91 },
];

const accuracyData = [
  { name: 'Forecast Agent', value: 93.4 },
  { name: 'Inventory Agent', value: 95.1 },
  { name: 'Supplier Agent', value: 96.5 },
  { name: 'Pricing Agent', value: 91.8 },
];

const COLORS = ['#27AE60', '#F1C40F', '#8E44AD', '#2C3E50'];

export default function Agents() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [agentTypeFilter, setAgentTypeFilter] = useState("all");
  const [currentTab, setCurrentTab] = useState("overview");
  
  // Fetch agent activities
  const { data: activities, isLoading, refetch } = useQuery({
    queryKey: ['/api/agent-activities'],
  });
  
  // Filter activities based on filters
  const filteredActivities = activities ? activities.filter((activity: any) => {
    const matchesSearch = searchTerm === "" || 
      activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.description.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesType = agentTypeFilter === "all" || activity.agentType === agentTypeFilter;
    
    return matchesSearch && matchesType;
  }) : [];
  
  // Handle refreshing the activities
  const handleRefresh = () => {
    refetch();
    toast({
      title: "Refreshed",
      description: "Agent activities have been refreshed.",
    });
  };
  
  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-primary">AI Agents Management</h1>
          <p className="text-[#7F8C8D]">Monitor and configure the multi-agent AI system</p>
        </div>
        
        <div className="flex space-x-3 mt-4 md:mt-0">
          <Button 
            variant="outline" 
            className="flex items-center border-[#ECF0F1]"
            onClick={handleRefresh}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            <span>Refresh</span>
          </Button>
          
          <Button className="bg-secondary hover:bg-secondary/90 flex items-center">
            <BotOff className="mr-2 h-4 w-4" />
            <span>Train Agents</span>
          </Button>
        </div>
      </div>
      
      <Tabs value={currentTab} onValueChange={setCurrentTab} className="mb-6">
        <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-flex">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
          <TabsTrigger value="settings">Agent Settings</TabsTrigger>
        </TabsList>
      </Tabs>

      {currentTab === "overview" && (
        <div className="space-y-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="shadow-sm transition-all duration-200 hover:translate-y-[-4px] hover:shadow-md">
              <CardContent className="p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-[#7F8C8D] font-medium text-sm">Forecast Agent</h3>
                    <p className="text-2xl font-bold text-primary">93.4%</p>
                    <p className="text-xs text-[#7F8C8D]">Accuracy Rate</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 3v18h18"/>
                      <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/>
                    </svg>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className="bg-secondary h-1.5 rounded-full" style={{ width: '93.4%' }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm transition-all duration-200 hover:translate-y-[-4px] hover:shadow-md">
              <CardContent className="p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-[#7F8C8D] font-medium text-sm">Inventory Agent</h3>
                    <p className="text-2xl font-bold text-primary">95.1%</p>
                    <p className="text-xs text-[#7F8C8D]">Accuracy Rate</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-warning" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 7V4h16v3"/>
                      <path d="M9 20h6"/>
                      <path d="M12 4v16"/>
                    </svg>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className="bg-warning h-1.5 rounded-full" style={{ width: '95.1%' }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm transition-all duration-200 hover:translate-y-[-4px] hover:shadow-md">
              <CardContent className="p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-[#7F8C8D] font-medium text-sm">Supplier Agent</h3>
                    <p className="text-2xl font-bold text-primary">96.5%</p>
                    <p className="text-xs text-[#7F8C8D]">Accuracy Rate</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="1" y="3" width="15" height="13" />
                      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                      <circle cx="5.5" cy="18.5" r="2.5" />
                      <circle cx="18.5" cy="18.5" r="2.5" />
                    </svg>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className="bg-purple-600 h-1.5 rounded-full" style={{ width: '96.5%' }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm transition-all duration-200 hover:translate-y-[-4px] hover:shadow-md">
              <CardContent className="p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-[#7F8C8D] font-medium text-sm">Pricing Agent</h3>
                    <p className="text-2xl font-bold text-primary">91.8%</p>
                    <p className="text-xs text-[#7F8C8D]">Accuracy Rate</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="1" x2="12" y2="23"/>
                      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                    </svg>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className="bg-primary h-1.5 rounded-full" style={{ width: '91.8%' }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Agent Performance Chart */}
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold text-primary">Agent Performance Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={agentPerformanceData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis domain={[80, 100]} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="forecast" name="Forecast Agent" stroke="#27AE60" strokeWidth={2} activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="inventory" name="Inventory Agent" stroke="#F1C40F" strokeWidth={2} />
                    <Line type="monotone" dataKey="supplier" name="Supplier Agent" stroke="#8E44AD" strokeWidth={2} />
                    <Line type="monotone" dataKey="pricing" name="Pricing Agent" stroke="#2C3E50" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          {/* Agent Statistics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold text-primary">Accuracy Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={accuracyData}
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {accuracyData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, 'Accuracy']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold text-primary">Agent Interaction Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-primary">Decision Accuracy</span>
                      <span className="text-sm text-secondary font-semibold">94.2%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-secondary h-2 rounded-full" style={{ width: '94.2%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-primary">Response Time</span>
                      <span className="text-sm text-warning font-semibold">2.4s</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-warning h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-primary">Agent Collaboration Rate</span>
                      <span className="text-sm text-purple-600 font-semibold">89.7%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: '89.7%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-primary">Task Completion Rate</span>
                      <span className="text-sm text-primary font-semibold">97.3%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '97.3%' }}></div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-[#7F8C8D] mb-1">Total Decisions</h4>
                      <p className="text-2xl font-bold text-primary">28,456</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-[#7F8C8D] mb-1">Cost Savings</h4>
                      <p className="text-2xl font-bold text-secondary">$47,829</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {currentTab === "activities" && (
        <div className="space-y-6">
          {/* Activity Filter Controls */}
          <Card className="shadow-sm">
            <CardContent className="p-5">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#7F8C8D]" />
                  <Input 
                    type="text" 
                    placeholder="Search activities..." 
                    className="pl-9 border-[#ECF0F1]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <Select value={agentTypeFilter} onValueChange={setAgentTypeFilter}>
                    <SelectTrigger className="w-[180px] border-[#ECF0F1]">
                      <SelectValue placeholder="Agent Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Agents</SelectItem>
                      <SelectItem value="forecast">Forecast Agent</SelectItem>
                      <SelectItem value="inventory">Inventory Agent</SelectItem>
                      <SelectItem value="supplier">Supplier Agent</SelectItem>
                      <SelectItem value="pricing">Pricing Agent</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button variant="outline" className="border-[#ECF0F1]" onClick={() => {
                    setSearchTerm("");
                    setAgentTypeFilter("all");
                  }}>
                    <RefreshCw className="h-4 w-4 mr-2" /> Reset
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activities List */}
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold text-primary">Agent Activities</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              ) : filteredActivities.length === 0 ? (
                <div className="text-center py-12">
                  <Bot className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-[#7F8C8D] text-lg">No agent activities found matching your filters</p>
                  <Button 
                    variant="outline" 
                    className="mt-4 border-[#ECF0F1]"
                    onClick={() => {
                      setSearchTerm("");
                      setAgentTypeFilter("all");
                    }}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" /> Clear Filters
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredActivities.map((activity: any) => {
                    const colors = getColorForAgentType(activity.agentType);
                    
                    return (
                      <div 
                        key={activity.id}
                        className={`flex items-start p-4 ${colors.bg} rounded-lg border-l-4 ${colors.border}`}
                      >
                        <div className={`h-10 w-10 rounded-full ${colors.icon} flex items-center justify-center text-white mr-3 flex-shrink-0`}>
                          <Bot className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-2">
                            <h3 className="font-medium text-primary text-md">{activity.title}</h3>
                            <p className="text-xs text-[#7F8C8D]">{formatTimeAgo(activity.timestamp)}</p>
                          </div>
                          <p className="text-sm text-[#7F8C8D]">{activity.description}</p>
                          
                          <div className="mt-3 flex flex-wrap gap-2">
                            <Badge className="bg-gray-200 text-[#7F8C8D] hover:bg-gray-300">
                              {activity.agentType.charAt(0).toUpperCase() + activity.agentType.slice(1)}
                            </Badge>
                            
                            <Badge className="bg-gray-200 text-[#7F8C8D] hover:bg-gray-300">
                              {activity.id > 3 ? "High Priority" : "Medium Priority"}
                            </Badge>
                            
                            <Badge className="bg-gray-200 text-[#7F8C8D] hover:bg-gray-300">
                              {activity.agentType === "forecast" ? "Prediction" : 
                               activity.agentType === "inventory" ? "Monitoring" :
                               activity.agentType === "supplier" ? "Ordering" : "Optimization"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {currentTab === "settings" && (
        <div className="space-y-6">
          {/* Agent Configuration */}
          <Card className="shadow-sm">
            <CardHeader className="pb-0">
              <CardTitle className="text-lg font-semibold text-primary">Forecast Agent Configuration</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between py-3 border-b border-gray-100">
                  <div>
                    <h3 className="font-medium text-primary">Enable Forecast Agent</h3>
                    <p className="text-sm text-[#7F8C8D]">Allow the agent to predict future demand and generate forecasts</p>
                  </div>
                  <Switch id="enable-forecast" defaultChecked />
                </div>
                
                <div className="flex flex-col md:flex-row md:items-center justify-between py-3 border-b border-gray-100">
                  <div>
                    <h3 className="font-medium text-primary">Model Confidence Threshold</h3>
                    <p className="text-sm text-[#7F8C8D]">Minimum confidence level required to consider a forecast valid</p>
                  </div>
                  <Select defaultValue="0.75">
                    <SelectTrigger className="w-[100px] border-[#ECF0F1]">
                      <SelectValue placeholder="0.75" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0.65">65%</SelectItem>
                      <SelectItem value="0.70">70%</SelectItem>
                      <SelectItem value="0.75">75%</SelectItem>
                      <SelectItem value="0.80">80%</SelectItem>
                      <SelectItem value="0.85">85%</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex flex-col md:flex-row md:items-center justify-between py-3 border-b border-gray-100">
                  <div>
                    <h3 className="font-medium text-primary">Automatic Forecasts</h3>
                    <p className="text-sm text-[#7F8C8D]">Automatically generate new forecasts on a scheduled basis</p>
                  </div>
                  <Switch id="auto-forecasts" defaultChecked />
                </div>
                
                <div className="flex flex-col md:flex-row md:items-center justify-between py-3 border-b border-gray-100">
                  <div>
                    <h3 className="font-medium text-primary">Forecast Frequency</h3>
                    <p className="text-sm text-[#7F8C8D]">How often to update forecasts automatically</p>
                  </div>
                  <Select defaultValue="daily">
                    <SelectTrigger className="w-[120px] border-[#ECF0F1]">
                      <SelectValue placeholder="Daily" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm">
            <CardHeader className="pb-0">
              <CardTitle className="text-lg font-semibold text-primary">Inventory Agent Configuration</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between py-3 border-b border-gray-100">
                  <div>
                    <h3 className="font-medium text-primary">Enable Inventory Agent</h3>
                    <p className="text-sm text-[#7F8C8D]">Allow the agent to monitor stock levels and detect issues</p>
                  </div>
                  <Switch id="enable-inventory" defaultChecked />
                </div>
                
                <div className="flex flex-col md:flex-row md:items-center justify-between py-3 border-b border-gray-100">
                  <div>
                    <h3 className="font-medium text-primary">Low Stock Alert Threshold</h3>
                    <p className="text-sm text-[#7F8C8D]">Percentage of minimum stock level to trigger low stock alerts</p>
                  </div>
                  <Select defaultValue="20">
                    <SelectTrigger className="w-[100px] border-[#ECF0F1]">
                      <SelectValue placeholder="20%" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10%</SelectItem>
                      <SelectItem value="15">15%</SelectItem>
                      <SelectItem value="20">20%</SelectItem>
                      <SelectItem value="25">25%</SelectItem>
                      <SelectItem value="30">30%</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex flex-col md:flex-row md:items-center justify-between py-3 border-b border-gray-100">
                  <div>
                    <h3 className="font-medium text-primary">Automatic Stock Transfers</h3>
                    <p className="text-sm text-[#7F8C8D]">Allow agent to recommend transfers between locations</p>
                  </div>
                  <Switch id="auto-transfers" defaultChecked />
                </div>
                
                <div className="flex flex-col md:flex-row md:items-center justify-between py-3 border-b border-gray-100">
                  <div>
                    <h3 className="font-medium text-primary">Monitoring Frequency</h3>
                    <p className="text-sm text-[#7F8C8D]">How often to check inventory levels</p>
                  </div>
                  <Select defaultValue="hourly">
                    <SelectTrigger className="w-[120px] border-[#ECF0F1]">
                      <SelectValue placeholder="Hourly" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15min">15 minutes</SelectItem>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm">
            <CardHeader className="pb-0">
              <CardTitle className="text-lg font-semibold text-primary">Pricing Agent Configuration</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between py-3 border-b border-gray-100">
                  <div>
                    <h3 className="font-medium text-primary">Enable Pricing Agent</h3>
                    <p className="text-sm text-[#7F8C8D]">Allow the agent to suggest price optimizations</p>
                  </div>
                  <Switch id="enable-pricing" defaultChecked />
                </div>
                
                <div className="flex flex-col md:flex-row md:items-center justify-between py-3 border-b border-gray-100">
                  <div>
                    <h3 className="font-medium text-primary">Maximum Price Change</h3>
                    <p className="text-sm text-[#7F8C8D]">Maximum percentage that prices can be adjusted up or down</p>
                  </div>
                  <Select defaultValue="20">
                    <SelectTrigger className="w-[100px] border-[#ECF0F1]">
                      <SelectValue placeholder="20%" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10%</SelectItem>
                      <SelectItem value="15">15%</SelectItem>
                      <SelectItem value="20">20%</SelectItem>
                      <SelectItem value="25">25%</SelectItem>
                      <SelectItem value="30">30%</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex flex-col md:flex-row md:items-center justify-between py-3 border-b border-gray-100">
                  <div>
                    <h3 className="font-medium text-primary">Automatic Price Application</h3>
                    <p className="text-sm text-[#7F8C8D]">Automatically apply price changes without manual approval</p>
                  </div>
                  <Switch id="auto-pricing" />
                </div>
                
                <div className="flex flex-col md:flex-row md:items-center justify-between py-3 border-b border-gray-100">
                  <div>
                    <h3 className="font-medium text-primary">Optimization Frequency</h3>
                    <p className="text-sm text-[#7F8C8D]">How often to calculate price optimizations</p>
                  </div>
                  <Select defaultValue="daily">
                    <SelectTrigger className="w-[120px] border-[#ECF0F1]">
                      <SelectValue placeholder="Daily" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm">
            <CardHeader className="pb-0">
              <CardTitle className="text-lg font-semibold text-primary">Supplier Agent Configuration</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between py-3 border-b border-gray-100">
                  <div>
                    <h3 className="font-medium text-primary">Enable Supplier Agent</h3>
                    <p className="text-sm text-[#7F8C8D]">Allow the agent to manage supplier relationships and orders</p>
                  </div>
                  <Switch id="enable-supplier" defaultChecked />
                </div>
                
                <div className="flex flex-col md:flex-row md:items-center justify-between py-3 border-b border-gray-100">
                  <div>
                    <h3 className="font-medium text-primary">Automatic Order Generation</h3>
                    <p className="text-sm text-[#7F8C8D]">Automatically create purchase orders based on inventory levels</p>
                  </div>
                  <Switch id="auto-orders" defaultChecked />
                </div>
                
                <div className="flex flex-col md:flex-row md:items-center justify-between py-3 border-b border-gray-100">
                  <div>
                    <h3 className="font-medium text-primary">Order Approval Threshold</h3>
                    <p className="text-sm text-[#7F8C8D]">Order value above which manual approval is required</p>
                  </div>
                  <Select defaultValue="5000">
                    <SelectTrigger className="w-[120px] border-[#ECF0F1]">
                      <SelectValue placeholder="$5,000" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1000">$1,000</SelectItem>
                      <SelectItem value="2500">$2,500</SelectItem>
                      <SelectItem value="5000">$5,000</SelectItem>
                      <SelectItem value="10000">$10,000</SelectItem>
                      <SelectItem value="25000">$25,000</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex flex-col md:flex-row md:items-center justify-between py-3 border-b border-gray-100">
                  <div>
                    <h3 className="font-medium text-primary">Lead Time Buffer</h3>
                    <p className="text-sm text-[#7F8C8D]">Additional days to add to supplier lead time for safety</p>
                  </div>
                  <Select defaultValue="3">
                    <SelectTrigger className="w-[120px] border-[#ECF0F1]">
                      <SelectValue placeholder="3 days" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 day</SelectItem>
                      <SelectItem value="2">2 days</SelectItem>
                      <SelectItem value="3">3 days</SelectItem>
                      <SelectItem value="5">5 days</SelectItem>
                      <SelectItem value="7">7 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-end">
            <Button className="bg-secondary hover:bg-secondary/90">
              Save Configuration
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
