import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2, BarChart2, LineChart as LineChartIcon, RefreshCw, Download } from "lucide-react";
import { formatDateOnly, formatTimeAgo } from "@/lib/utils";

// Mock historical sales data for the forecasting demo
const demoHistoricalData = [
  { date: '2023-01-01', sales: 250 },
  { date: '2023-01-02', sales: 320 },
  { date: '2023-01-03', sales: 290 },
  { date: '2023-01-04', sales: 380 },
  { date: '2023-01-05', sales: 350 },
  { date: '2023-01-06', sales: 410 },
  { date: '2023-01-07', sales: 490 },
  { date: '2023-01-08', sales: 520 },
  { date: '2023-01-09', sales: 480 },
  { date: '2023-01-10', sales: 390 },
  { date: '2023-01-11', sales: 430 },
  { date: '2023-01-12', sales: 450 },
  { date: '2023-01-13', sales: 470 },
  { date: '2023-01-14', sales: 510 },
];

export default function Forecasting() {
  const { toast } = useToast();
  const [selectedProduct, setSelectedProduct] = useState("1");
  const [selectedLocation, setSelectedLocation] = useState("1");
  const [selectedView, setSelectedView] = useState("bar");
  const [showForecastDetails, setShowForecastDetails] = useState(false);
  
  // Fetch products
  const { data: products } = useQuery({
    queryKey: ['/api/products'],
  });
  
  // Fetch locations
  const { data: locations } = useQuery({
    queryKey: ['/api/locations'],
  });
  
  // Fetch forecasts
  const { data: forecasts, isLoading: forecastsLoading } = useQuery({
    queryKey: ['/api/forecasts'],
  });
  
  // Generate forecast mutation
  const generateForecastMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", `/api/forecasts`, {
        productId: parseInt(selectedProduct),
        locationId: parseInt(selectedLocation),
        historicalData: demoHistoricalData
      });
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/forecasts'] });
      toast({
        title: "Forecast Generated",
        description: "A new demand forecast has been created successfully.",
      });
      setShowForecastDetails(true);
    },
    onError: (error) => {
      toast({
        title: "Failed to generate forecast",
        description: `Error: ${error.message}`,
        variant: "destructive",
      });
    }
  });
  
  // Filter forecasts by selected product and location
  const filteredForecasts = forecasts && forecasts.filter((forecast: any) => 
    forecast.productId === parseInt(selectedProduct) && 
    forecast.locationId === parseInt(selectedLocation)
  );
  
  // Format data for charts
  const chartData = filteredForecasts ? filteredForecasts.map((forecast: any) => ({
    date: formatDateOnly(forecast.startDate),
    demand: forecast.predictedDemand,
    confidence: forecast.confidence * 100
  })) : [];
  
  // Handle generating new forecast
  const handleGenerateForecast = () => {
    generateForecastMutation.mutate();
  };
  
  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-primary">AI Demand Forecasting</h1>
          <p className="text-[#7F8C8D]">Predict future demand based on historical data and market trends</p>
        </div>
        
        <div className="flex space-x-3 mt-4 md:mt-0">
          <Button 
            variant="outline" 
            className="flex items-center border-[#ECF0F1]"
          >
            <Download className="mr-2 h-4 w-4" />
            <span>Export Data</span>
          </Button>
          
          <Button 
            className="bg-secondary hover:bg-secondary/90 flex items-center"
            onClick={handleGenerateForecast}
            disabled={generateForecastMutation.isPending}
          >
            {generateForecastMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
            <span>Generate Forecast</span>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-primary">Forecast Parameters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-[#7F8C8D] mb-1 block">Product</label>
                <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                  <SelectTrigger className="w-full border-[#ECF0F1]">
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products ? (
                      products.map((product: any) => (
                        <SelectItem key={product.id} value={product.id.toString()}>
                          {product.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="1">Loading products...</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium text-[#7F8C8D] mb-1 block">Location</label>
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger className="w-full border-[#ECF0F1]">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations ? (
                      locations.map((location: any) => (
                        <SelectItem key={location.id} value={location.id.toString()}>
                          {location.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="1">Loading locations...</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium text-[#7F8C8D] mb-1 block">Forecast Period</label>
                <Select defaultValue="7">
                  <SelectTrigger className="w-full border-[#ECF0F1]">
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">Next 7 Days</SelectItem>
                    <SelectItem value="14">Next 14 Days</SelectItem>
                    <SelectItem value="30">Next 30 Days</SelectItem>
                    <SelectItem value="90">Next Quarter</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium text-[#7F8C8D] mb-1 block">Seasonality</label>
                <Select defaultValue="auto">
                  <SelectTrigger className="w-full border-[#ECF0F1]">
                    <SelectValue placeholder="Select seasonality" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Auto-detect</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium text-[#7F8C8D] mb-1 block">External Factors</label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="weather" className="rounded text-secondary border-[#ECF0F1]" />
                    <label htmlFor="weather" className="text-sm">Weather Patterns</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="events" className="rounded text-secondary border-[#ECF0F1]" />
                    <label htmlFor="events" className="text-sm">Local Events</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="holidays" className="rounded text-secondary border-[#ECF0F1]" />
                    <label htmlFor="holidays" className="text-sm">Holidays</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="marketing" className="rounded text-secondary border-[#ECF0F1]" />
                    <label htmlFor="marketing" className="text-sm">Marketing Campaigns</label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-primary">Historical Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-[#7F8C8D]">Forecast Accuracy (Last 30 Days)</p>
                  <p className="text-2xl font-bold text-primary">93.4%</p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                    <div className="bg-secondary h-2.5 rounded-full" style={{ width: '93.4%' }}></div>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-[#7F8C8D]">MAPE (Mean Absolute Percentage Error)</p>
                  <p className="text-2xl font-bold text-primary">6.7%</p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                    <div className="bg-secondary h-2.5 rounded-full" style={{ width: '6.7%' }}></div>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-[#7F8C8D]">Bias</p>
                  <p className="text-2xl font-bold text-primary">+1.2%</p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                    <div className="bg-warning h-2.5 rounded-full" style={{ width: '51.2%' }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-3 space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-semibold text-primary">Demand Forecast Visualization</CardTitle>
                <div className="flex items-center space-x-2">
                  <Tabs 
                    value={selectedView} 
                    onValueChange={setSelectedView}
                    className="w-[200px]"
                  >
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="bar" className="flex items-center">
                        <BarChart2 className="h-4 w-4 mr-1" />
                        <span>Bar</span>
                      </TabsTrigger>
                      <TabsTrigger value="line" className="flex items-center">
                        <LineChartIcon className="h-4 w-4 mr-1" />
                        <span>Line</span>
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full">
                {forecastsLoading ? (
                  <div className="h-full flex items-center justify-center">
                    <Loader2 className="h-10 w-10 text-[#7F8C8D] animate-spin" />
                  </div>
                ) : chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    {selectedView === 'bar' ? (
                      <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="date" />
                        <YAxis yAxisId="left" orientation="left" stroke="#2C3E50" />
                        <YAxis yAxisId="right" orientation="right" stroke="#F1C40F" domain={[0, 100]} />
                        <Tooltip />
                        <Legend verticalAlign="top" height={36} />
                        <Bar yAxisId="left" dataKey="demand" name="Predicted Demand" fill="#2C3E50" />
                        <Bar yAxisId="right" dataKey="confidence" name="Confidence (%)" fill="#F1C40F" />
                      </BarChart>
                    ) : (
                      <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="date" />
                        <YAxis yAxisId="left" orientation="left" stroke="#2C3E50" />
                        <YAxis yAxisId="right" orientation="right" stroke="#F1C40F" domain={[0, 100]} />
                        <Tooltip />
                        <Legend verticalAlign="top" height={36} />
                        <Line yAxisId="left" type="monotone" dataKey="demand" name="Predicted Demand" stroke="#2C3E50" strokeWidth={2} activeDot={{ r: 8 }} />
                        <Line yAxisId="right" type="monotone" dataKey="confidence" name="Confidence (%)" stroke="#F1C40F" strokeWidth={2} />
                      </LineChart>
                    )}
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center flex-col">
                    <p className="text-[#7F8C8D] mb-4">No forecast data available for the selected parameters</p>
                    <Button 
                      className="bg-secondary hover:bg-secondary/90"
                      onClick={handleGenerateForecast}
                      disabled={generateForecastMutation.isPending}
                    >
                      {generateForecastMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                      <span>Generate Forecast</span>
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          {showForecastDetails && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-primary">Forecast Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium text-primary">Key Factors Influencing Demand</h3>
                      <ul className="mt-2 space-y-2 text-sm">
                        <li className="flex items-start">
                          <span className="h-5 w-5 rounded-full bg-secondary text-white flex items-center justify-center text-xs mr-2 mt-0.5">1</span>
                          <div>
                            <p className="font-medium">Seasonal Patterns</p>
                            <p className="text-[#7F8C8D]">20% increase in demand due to seasonal trends</p>
                          </div>
                        </li>
                        <li className="flex items-start">
                          <span className="h-5 w-5 rounded-full bg-secondary text-white flex items-center justify-center text-xs mr-2 mt-0.5">2</span>
                          <div>
                            <p className="font-medium">Marketing Campaign</p>
                            <p className="text-[#7F8C8D]">15% lift from ongoing promotional activities</p>
                          </div>
                        </li>
                        <li className="flex items-start">
                          <span className="h-5 w-5 rounded-full bg-secondary text-white flex items-center justify-center text-xs mr-2 mt-0.5">3</span>
                          <div>
                            <p className="font-medium">Weather Forecast</p>
                            <p className="text-[#7F8C8D]">5% increase due to predicted favorable weather</p>
                          </div>
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-primary">Recommendations</h3>
                      <ul className="mt-2 space-y-2 text-sm">
                        <li className="flex items-start">
                          <div className="h-5 w-5 rounded-full bg-warning text-white flex items-center justify-center mr-2 mt-0.5">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M12 22V8M5 12l7-4 7 4"/>
                            </svg>
                          </div>
                          <p>Increase inventory by 15% to meet expected demand</p>
                        </li>
                        <li className="flex items-start">
                          <div className="h-5 w-5 rounded-full bg-warning text-white flex items-center justify-center mr-2 mt-0.5">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M18 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h9"/>
                              <circle cx="19" cy="19" r="2"/>
                              <circle cx="12" cy="19" r="2"/>
                              <line x1="14" y1="19" x2="17" y2="19"/>
                            </svg>
                          </div>
                          <p>Schedule delivery for next Wednesday to avoid stockout</p>
                        </li>
                        <li className="flex items-start">
                          <div className="h-5 w-5 rounded-full bg-warning text-white flex items-center justify-center mr-2 mt-0.5">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M15 5h1a2 2 0 0 1 2 2v1"/>
                              <path d="M9 5H8a2 2 0 0 0-2 2v3"/>
                              <path d="M15 19h1a2 2 0 0 0 2-2v-1"/>
                              <path d="M9 19H8a2 2 0 0 1-2-2v-1"/>
                              <path d="M5 9h14"/>
                              <path d="M5 15h14"/>
                            </svg>
                          </div>
                          <p>Consider 5% price increase during peak demand period</p>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-primary">Historical vs. Forecast</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={demoHistoricalData.concat(
                        chartData.map((item: any, index: number) => ({
                          date: item.date,
                          sales: undefined,
                          forecast: item.demand
                        }))
                      )} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis 
                          dataKey="date" 
                          tick={{fontSize: 10}}
                          tickFormatter={(value) => {
                            const date = new Date(value);
                            return `${date.getMonth() + 1}/${date.getDate()}`;
                          }}
                        />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="sales" name="Historical Sales" stroke="#2C3E50" dot={{ r: 1 }} activeDot={{ r: 5 }} />
                        <Line type="monotone" dataKey="forecast" name="Forecasted Demand" stroke="#27AE60" strokeDasharray="5 5" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="mt-4">
                    <h3 className="font-medium text-primary mb-2">Forecast Accuracy Metrics</h3>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-xs text-[#7F8C8D]">MAPE</p>
                        <p className="font-bold text-primary">6.7%</p>
                      </div>
                      <div>
                        <p className="text-xs text-[#7F8C8D]">MAE</p>
                        <p className="font-bold text-primary">23 units</p>
                      </div>
                      <div>
                        <p className="text-xs text-[#7F8C8D]">RMSE</p>
                        <p className="font-bold text-primary">27 units</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
