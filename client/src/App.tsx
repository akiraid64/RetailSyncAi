import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Forecasting from "@/pages/forecasting";
import Inventory from "@/pages/inventory";
import Pricing from "@/pages/pricing";
import Agents from "@/pages/agents";
import Suppliers from "@/pages/suppliers";
import Settings from "@/pages/settings";
import AppShell from "@/components/layout/app-shell";

function Router() {
  return (
    <AppShell>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/forecasting" component={Forecasting} />
        <Route path="/inventory" component={Inventory} />
        <Route path="/pricing" component={Pricing} />
        <Route path="/agents" component={Agents} />
        <Route path="/suppliers" component={Suppliers} />
        <Route path="/settings" component={Settings} />
        <Route component={NotFound} />
      </Switch>
    </AppShell>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
