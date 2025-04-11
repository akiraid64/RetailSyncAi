import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bot, PenLine, LineChart, Tag } from "lucide-react";

// Forecast Query Schema
const forecastFormSchema = z.object({
  productId: z.coerce.number().positive(),
  locationId: z.coerce.number().positive(),
  period: z.string().min(1, { message: "Please select a forecast period" }),
  notes: z.string().optional(),
});

// Price Optimization Schema
const priceOptimizationFormSchema = z.object({
  productId: z.coerce.number().positive(),
  currentPrice: z.coerce.number().positive(),
  competitorPrice: z.coerce.number().positive().optional(),
  elasticity: z.coerce.number().min(0).max(10).optional(),
  notes: z.string().optional(),
});

// Agent Message Schema
const agentMessageFormSchema = z.object({
  communicationId: z.coerce.number().positive(),
  message: z.string().min(1, { message: "Message cannot be empty" }),
  agentType: z.string().min(1, { message: "Please select an agent type" }),
});

export default function AgentInputForm() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("forecast");
  
  // Forecast Form
  const forecastForm = useForm<z.infer<typeof forecastFormSchema>>({
    resolver: zodResolver(forecastFormSchema),
    defaultValues: {
      productId: 0,
      locationId: 0,
      period: "",
      notes: "",
    },
  });

  // Price Optimization Form
  const priceForm = useForm<z.infer<typeof priceOptimizationFormSchema>>({
    resolver: zodResolver(priceOptimizationFormSchema),
    defaultValues: {
      productId: 0,
      currentPrice: 0,
      competitorPrice: undefined,
      elasticity: undefined,
      notes: "",
    },
  });

  // Agent Message Form
  const messageForm = useForm<z.infer<typeof agentMessageFormSchema>>({
    resolver: zodResolver(agentMessageFormSchema),
    defaultValues: {
      communicationId: 1,
      message: "",
      agentType: "",
    },
  });

  // Handle forecast submission
  function onForecastSubmit(values: z.infer<typeof forecastFormSchema>) {
    // Create a forecast through the AI agent
    toast({
      title: "Generating Forecast",
      description: "Our AI is analyzing your request..."
    });
    
    // Send to backend
    apiRequest("POST", "/api/forecasts/generate", values)
      .then((response) => response.json())
      .then((data) => {
        queryClient.invalidateQueries({ queryKey: ['/api/forecasts'] });
        toast({
          title: "Forecast Generated",
          description: "New demand forecast has been created based on your data.",
        });
        forecastForm.reset();
      })
      .catch((error) => {
        toast({
          title: "Error",
          description: `Failed to generate forecast: ${error.message}`,
          variant: "destructive",
        });
      });
  }

  // Handle price optimization submission
  function onPriceSubmit(values: z.infer<typeof priceOptimizationFormSchema>) {
    // Generate price optimization using AI
    toast({
      title: "Optimizing Price",
      description: "Our AI is calculating optimal price points..."
    });
    
    // Send to backend
    apiRequest("POST", "/api/price-optimizations/generate", values)
      .then((response) => response.json())
      .then((data) => {
        queryClient.invalidateQueries({ queryKey: ['/api/price-optimizations'] });
        toast({
          title: "Price Optimized",
          description: "New price recommendations have been generated.",
        });
        priceForm.reset();
      })
      .catch((error) => {
        toast({
          title: "Error",
          description: `Failed to optimize price: ${error.message}`,
          variant: "destructive",
        });
      });
  }

  // Handle agent message submission
  function onMessageSubmit(values: z.infer<typeof agentMessageFormSchema>) {
    // Submit a message to an agent
    apiRequest("POST", `/api/communications/${values.communicationId}/messages`, {
      agentType: values.agentType,
      content: values.message
    })
      .then((response) => response.json())
      .then((data) => {
        queryClient.invalidateQueries({ queryKey: ['/api/communications', values.communicationId, 'messages'] });
        toast({
          title: "Message Sent",
          description: `Your message has been sent to the ${values.agentType} agent.`,
        });
        messageForm.reset({ ...messageForm.getValues(), message: "" });
      })
      .catch((error) => {
        toast({
          title: "Error",
          description: `Failed to send message: ${error.message}`,
          variant: "destructive",
        });
      });
  }

  return (
    <Card className="shadow-sm transition-all duration-200 hover:translate-y-[-4px] hover:shadow-md mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-primary">
          Interact with AI Agents
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="forecast" className="flex items-center">
              <LineChart className="h-4 w-4 mr-2" />
              <span>Forecast Agent</span>
            </TabsTrigger>
            <TabsTrigger value="price" className="flex items-center">
              <Tag className="h-4 w-4 mr-2" />
              <span>Pricing Agent</span>
            </TabsTrigger>
            <TabsTrigger value="message" className="flex items-center">
              <PenLine className="h-4 w-4 mr-2" />
              <span>Custom Message</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="forecast">
            <Form {...forecastForm}>
              <form onSubmit={forecastForm.handleSubmit(onForecastSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={forecastForm.control}
                    name="productId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product ID</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={forecastForm.control}
                    name="locationId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location ID</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={forecastForm.control}
                    name="period"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Forecast Period</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select period" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="7days">Next 7 Days</SelectItem>
                            <SelectItem value="30days">Next 30 Days</SelectItem>
                            <SelectItem value="90days">Next Quarter</SelectItem>
                            <SelectItem value="365days">Next Year</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={forecastForm.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Notes</FormLabel>
                        <FormControl>
                          <Input placeholder="Any special factors to consider" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <Button type="submit" className="bg-secondary hover:bg-secondary/90">
                  <LineChart className="mr-2 h-4 w-4" />
                  Generate Forecast
                </Button>
              </form>
            </Form>
          </TabsContent>
          
          <TabsContent value="price">
            <Form {...priceForm}>
              <form onSubmit={priceForm.handleSubmit(onPriceSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={priceForm.control}
                    name="productId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product ID</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={priceForm.control}
                    name="currentPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Price (₹)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="1999" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={priceForm.control}
                    name="competitorPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Competitor Price (₹) (Optional)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="1899" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={priceForm.control}
                    name="elasticity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price Elasticity (0-10) (Optional)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="5" min="0" max="10" step="0.1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={priceForm.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Market Considerations (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="E.g. festival season, new competitor entry, etc." 
                          className="resize-none h-20"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="bg-secondary hover:bg-secondary/90">
                  <Tag className="mr-2 h-4 w-4" />
                  Optimize Price
                </Button>
              </form>
            </Form>
          </TabsContent>
          
          <TabsContent value="message">
            <Form {...messageForm}>
              <form onSubmit={messageForm.handleSubmit(onMessageSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={messageForm.control}
                    name="communicationId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Communication ID</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={messageForm.control}
                    name="agentType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Agent Type</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select agent type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="inventory">Inventory Agent</SelectItem>
                            <SelectItem value="forecast">Forecast Agent</SelectItem>
                            <SelectItem value="pricing">Pricing Agent</SelectItem>
                            <SelectItem value="supplier">Supplier Agent</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={messageForm.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter your message to the agent..." 
                          className="resize-none h-24"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="bg-secondary hover:bg-secondary/90">
                  <Bot className="mr-2 h-4 w-4" />
                  Send to Agent
                </Button>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}