import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { getColorForStatus } from "@/lib/utils";

export default function StockLevels() {
  const [locationFilter, setLocationFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  const { data, isLoading } = useQuery({
    queryKey: ['/api/inventory'],
  });

  if (isLoading) {
    return (
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <Skeleton className="h-6 w-64" />
            <div className="flex space-x-2">
              <Skeleton className="h-9 w-36" />
              <Skeleton className="h-9 w-9" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Skeleton className="h-[300px] w-full" />
          </div>
          <div className="flex justify-between items-center mt-4">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-9 w-32" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Filter inventory by location if needed
  const filteredInventory = locationFilter === "all" 
    ? data 
    : data.filter((item: any) => item.location.id.toString() === locationFilter);

  // Paginate the inventory
  const totalPages = Math.ceil(filteredInventory.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedInventory = filteredInventory.slice(startIndex, startIndex + itemsPerPage);

  // Extract unique locations for the filter
  const locations = data 
    ? Array.from(new Set(data.map((item: any) => item.location)))
      .filter((location: any) => location !== undefined)
    : [];

  return (
    <Card className="shadow-sm transition-all duration-200 hover:translate-y-[-4px] hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold text-primary">Inventory Stock Levels</CardTitle>
          <div className="flex space-x-2">
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger className="text-sm border-[#ECF0F1] rounded-md py-1 h-9 w-40">
                <SelectValue placeholder="All Locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {locations.map((location: any) => (
                  <SelectItem key={location.id} value={location.id.toString()}>
                    {location.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="ghost" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-[#ECF0F1] text-[#7F8C8D]">
                <th className="px-4 py-3 text-left font-medium rounded-l-lg">Product Name</th>
                <th className="px-4 py-3 text-left font-medium">SKU</th>
                <th className="px-4 py-3 text-left font-medium">Location</th>
                <th className="px-4 py-3 text-left font-medium">Current Stock</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-left font-medium rounded-r-lg">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ECF0F1]">
              {paginatedInventory.map((item: any) => {
                const { bg, text } = getColorForStatus(item.status);
                
                return (
                  <tr key={item.id} className="hover:bg-[#ECF0F1]">
                    <td className="px-4 py-3">{item.product.name}</td>
                    <td className="px-4 py-3 text-[#7F8C8D]">{item.product.sku}</td>
                    <td className="px-4 py-3 text-[#7F8C8D]">{item.location.name}</td>
                    <td className="px-4 py-3 font-medium">{item.quantity}</td>
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
        
        <div className="flex justify-between items-center mt-4 text-sm">
          <div className="text-[#7F8C8D]">
            Showing {paginatedInventory.length} of {filteredInventory.length} products
          </div>
          {totalPages > 1 && (
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8 p-0"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              {[...Array(totalPages)].map((_, i) => (
                <Button 
                  key={i} 
                  variant={currentPage === i + 1 ? "default" : "outline"}
                  className={`h-8 w-8 p-0 ${currentPage === i + 1 ? 'bg-primary text-white' : ''}`}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </Button>
              ))}
              
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8 p-0"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
