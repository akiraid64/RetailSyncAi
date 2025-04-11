import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Download } from "lucide-react";
import StatusOverview from "@/components/dashboard/status-overview";
import DemandForecast from "@/components/dashboard/demand-forecast";
import AgentActivities from "@/components/dashboard/agent-activities";
import StockLevels from "@/components/dashboard/stock-levels";
import PriceOptimization from "@/components/dashboard/price-optimization";
import AgentCommunication from "@/components/dashboard/agent-communication";
import AgentTrainingCard from "@/components/dashboard/agent-training-card";
export default function Dashboard() {
  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-primary">Sukanya Patnaik's Inventory Dashboard</h1>
          <p className="text-[#7F8C8D]">Real-time collaboration between stores, warehouses, and suppliers</p>
        </div>
        
        <div className="flex space-x-3 mt-4 md:mt-0">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#7F8C8D]" />
            <Input 
              type="text" 
              placeholder="Search inventory..." 
              className="pl-9 border-[#ECF0F1] focus:ring-2 focus:ring-secondary focus:border-transparent"
            />
          </div>
          
          <Button className="bg-secondary hover:bg-secondary/90 flex items-center">
            <Download className="mr-2 h-4 w-4" />
            <span>Export</span>
          </Button>
        </div>
      </div>

      {/* Agent Training Card */}
      <AgentTrainingCard />

      {/* Status Overview Section */}
      <StatusOverview />

      {/* Charts and Agent Activities Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <DemandForecast />
        </div>
        <div className="lg:col-span-1">
          <AgentActivities />
        </div>
      </div>

      {/* Inventory and Price Optimization Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <StockLevels />
        </div>
        <div className="lg:col-span-1">
          <PriceOptimization />
        </div>
      </div>

      {/* Agent Communication Section */}
      <AgentCommunication />
    </div>
  );
}
