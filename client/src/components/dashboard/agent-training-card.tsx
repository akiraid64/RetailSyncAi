import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Bot, Activity, LineChart, Tag } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";

export default function AgentTrainingCard() {
  const { toast } = useToast();
  const [isTraining, setIsTraining] = useState(false);
  
  const handleTrainForecasting = () => {
    setIsTraining(true);
    toast({
      title: "Training Forecast Agent",
      description: "The agent is being trained on historical data...",
    });
    
    // Simulate API call for training
    setTimeout(() => {
      queryClient.invalidateQueries({ queryKey: ['/api/agent-activities'] });
      setIsTraining(false);
      toast({
        title: "Training Complete",
        description: "Forecast agent has been successfully trained.",
      });
    }, 3000);
  };
  
  const handleTrainPricing = () => {
    setIsTraining(true);
    toast({
      title: "Training Pricing Agent",
      description: "The agent is being trained on market data...",
    });
    
    // Simulate API call for training
    setTimeout(() => {
      queryClient.invalidateQueries({ queryKey: ['/api/agent-activities'] });
      setIsTraining(false);
      toast({
        title: "Training Complete",
        description: "Pricing agent has been successfully trained.",
      });
    }, 3000);
  };
  
  const handleTrainInventory = () => {
    setIsTraining(true);
    toast({
      title: "Training Inventory Agent",
      description: "The agent is being trained on inventory patterns...",
    });
    
    // Simulate API call for training
    setTimeout(() => {
      queryClient.invalidateQueries({ queryKey: ['/api/agent-activities'] });
      setIsTraining(false);
      toast({
        title: "Training Complete",
        description: "Inventory agent has been successfully trained.",
      });
    }, 3000);
  };

  return (
    <Card className="shadow-sm transition-all duration-200 hover:translate-y-[-4px] hover:shadow-md mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-primary">
          Train AI Agents
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-[#7F8C8D] mb-4">
          Train your AI agents with your business data to improve their performance in demand forecasting,
          inventory management, and price optimization.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Forecasting Agent */}
          <div className="bg-[#ECF0F1] rounded-lg p-4">
            <div className="flex items-center mb-2">
              <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-white mr-2">
                <LineChart className="h-4 w-4" />
              </div>
              <h3 className="font-medium">Forecasting Agent</h3>
            </div>
            <p className="text-sm text-[#7F8C8D] mb-3">
              Predicts future demand based on historical sales data and market trends.
            </p>
            <Button 
              className="w-full bg-secondary hover:bg-secondary/90"
              onClick={handleTrainForecasting}
              disabled={isTraining}
            >
              {isTraining ? "Training..." : "Train Agent"}
            </Button>
          </div>
          
          {/* Pricing Agent */}
          <div className="bg-[#ECF0F1] rounded-lg p-4">
            <div className="flex items-center mb-2">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white mr-2">
                <Tag className="h-4 w-4" />
              </div>
              <h3 className="font-medium">Pricing Agent</h3>
            </div>
            <p className="text-sm text-[#7F8C8D] mb-3">
              Optimizes prices based on demand elasticity, competitor prices, and profit targets.
            </p>
            <Button 
              className="w-full bg-primary hover:bg-primary/90"
              onClick={handleTrainPricing}
              disabled={isTraining}
            >
              {isTraining ? "Training..." : "Train Agent"}
            </Button>
          </div>
          
          {/* Inventory Agent */}
          <div className="bg-[#ECF0F1] rounded-lg p-4">
            <div className="flex items-center mb-2">
              <div className="h-8 w-8 rounded-full bg-[#F39C12] flex items-center justify-center text-white mr-2">
                <Activity className="h-4 w-4" />
              </div>
              <h3 className="font-medium">Inventory Agent</h3>
            </div>
            <p className="text-sm text-[#7F8C8D] mb-3">
              Manages stock levels, allocations, and reordering strategies across locations.
            </p>
            <Button 
              className="w-full bg-[#F39C12] hover:bg-[#F39C12]/90"
              onClick={handleTrainInventory}
              disabled={isTraining}
            >
              {isTraining ? "Training..." : "Train Agent"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}