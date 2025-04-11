import { cn } from "@/lib/utils";
import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  LineChart, 
  Store, 
  Tag, 
  Users, 
  Truck, 
  Settings,
  Bot
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navigationItems = [
  {
    name: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Forecasting",
    href: "/forecasting",
    icon: LineChart,
  },
  {
    name: "Inventory",
    href: "/inventory",
    icon: Store,
  },
  {
    name: "Pricing",
    href: "/pricing",
    icon: Tag,
  },
  {
    name: "Agents",
    href: "/agents",
    icon: Users,
  },
  {
    name: "Suppliers",
    href: "/suppliers",
    icon: Truck,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <aside className="w-16 md:w-64 bg-white shadow-md z-5 flex flex-col">
      <nav className="flex-1 py-6">
        <ul>
          {navigationItems.map((item) => {
            const isActive = location === item.href;
            return (
              <li key={item.name} className="mb-2">
                <Link href={item.href}>
                  <div
                    className={cn(
                      "flex items-center px-4 py-3 text-[#7F8C8D] hover:bg-[#ECF0F1] hover:text-primary transition-colors cursor-pointer",
                      isActive && "text-primary bg-[#ECF0F1] border-l-4 border-secondary"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="ml-4 hidden md:inline-block font-medium">
                      {item.name}
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="p-4 hidden md:block">
        <div className="bg-[#ECF0F1] rounded-lg p-3 text-sm">
          <div className="font-medium text-primary mb-2">AI Assistant</div>
          <p className="text-[#7F8C8D] text-xs mb-2">Need help optimizing your inventory?</p>
          <Button className="w-full bg-secondary hover:bg-secondary/90 text-white py-1 px-3 rounded text-xs">
            <Bot className="mr-2 h-3 w-3" /> Ask AI Assistant
          </Button>
        </div>
      </div>
    </aside>
  );
}
