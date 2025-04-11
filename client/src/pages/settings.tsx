import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Settings as SettingsIcon, Bell, Save, Moon, Sun, Globe } from "lucide-react";

export default function Settings() {
  const { toast } = useToast();
  
  const handleSaveChanges = () => {
    toast({
      title: "Settings saved",
      description: "Your settings have been saved successfully.",
    });
  };
  
  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-primary">Settings</h1>
          <p className="text-[#7F8C8D]">Configure your application preferences</p>
        </div>
        
        <div className="flex space-x-3 mt-4 md:mt-0">
          <Button 
            className="bg-secondary hover:bg-secondary/90 flex items-center"
            onClick={handleSaveChanges}
          >
            <Save className="mr-2 h-4 w-4" />
            <span>Save Changes</span>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general" className="mb-6">
        <TabsList className="grid w-full grid-cols-4 md:w-auto md:inline-flex">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="api">API Integration</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="space-y-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-primary">General Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="company-name">Company Name</Label>
                <Input id="company-name" defaultValue="Retail AI Solutions Inc." />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="admin-email">Admin Email</Label>
                <Input id="admin-email" defaultValue="admin@retailai.com" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <div className="flex items-center space-x-2">
                  <Globe className="h-4 w-4 text-[#7F8C8D]" />
                  <select 
                    id="timezone" 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    defaultValue="UTC-8"
                  >
                    <option value="UTC-12">UTC-12 (Baker Island, Howland Island)</option>
                    <option value="UTC-11">UTC-11 (American Samoa, Niue)</option>
                    <option value="UTC-10">UTC-10 (Hawaii, Cook Islands)</option>
                    <option value="UTC-9">UTC-9 (Alaska, French Polynesia)</option>
                    <option value="UTC-8">UTC-8 (Pacific Time)</option>
                    <option value="UTC-7">UTC-7 (Mountain Time)</option>
                    <option value="UTC-6">UTC-6 (Central Time)</option>
                    <option value="UTC-5">UTC-5 (Eastern Time)</option>
                    <option value="UTC-4">UTC-4 (Atlantic Time)</option>
                    <option value="UTC-3">UTC-3 (Argentina, Brazil)</option>
                    <option value="UTC-2">UTC-2 (South Georgia)</option>
                    <option value="UTC-1">UTC-1 (Azores, Cape Verde)</option>
                    <option value="UTC+0">UTC+0 (London, Dublin)</option>
                    <option value="UTC+1">UTC+1 (Berlin, Paris, Rome)</option>
                    <option value="UTC+2">UTC+2 (Athens, Cairo)</option>
                    <option value="UTC+3">UTC+3 (Moscow, Istanbul)</option>
                    <option value="UTC+4">UTC+4 (Dubai, Baku)</option>
                    <option value="UTC+5">UTC+5 (Karachi, Tashkent)</option>
                    <option value="UTC+6">UTC+6 (Dhaka, Almaty)</option>
                    <option value="UTC+7">UTC+7 (Bangkok, Jakarta)</option>
                    <option value="UTC+8">UTC+8 (Shanghai, Singapore)</option>
                    <option value="UTC+9">UTC+9 (Tokyo, Seoul)</option>
                    <option value="UTC+10">UTC+10 (Sydney, Melbourne)</option>
                    <option value="UTC+11">UTC+11 (Solomon Islands)</option>
                    <option value="UTC+12">UTC+12 (Auckland, Fiji)</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <select 
                  id="currency" 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  defaultValue="USD"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="JPY">JPY (¥)</option>
                  <option value="CAD">CAD (C$)</option>
                  <option value="AUD">AUD (A$)</option>
                  <option value="CNY">CNY (¥)</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-update" className="flex flex-col space-y-1">
                  <span>Auto-update inventory data</span>
                  <span className="font-normal text-sm text-[#7F8C8D]">Automatically fetch the latest data every 5 minutes</span>
                </Label>
                <Switch id="auto-update" defaultChecked />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="ai-predictions" className="flex flex-col space-y-1">
                  <span>Enable AI predictions</span>
                  <span className="font-normal text-sm text-[#7F8C8D]">Allow the system to make AI-powered forecasts and optimizations</span>
                </Label>
                <Switch id="ai-predictions" defaultChecked />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-primary">OpenAI API Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="api-model">OpenAI Model</Label>
              <select 
                id="api-model" 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                defaultValue="gpt-4o"
              >
                <option value="gpt-4o">GPT-4o (Recommended)</option>
                <option value="gpt-4-turbo">GPT-4 Turbo</option>
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
              </select>
              <p className="text-xs text-[#7F8C8D] mt-1">
                GPT-4o provides the most accurate predictions for inventory management
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="api-key">OpenAI API Key</Label>
              <Input id="api-key" type="password" defaultValue="••••••••••••••••••••••••••••••" />
              <p className="text-xs text-[#7F8C8D] mt-1">
                Your API key is stored securely and used for AI-powered features
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="advanced-features" className="flex flex-col space-y-1">
                  <span>Enable advanced AI features</span>
                  <span className="font-normal text-sm text-[#7F8C8D]">Activates machine learning models for complex optimization tasks</span>
                </Label>
                <Switch id="advanced-features" defaultChecked />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-primary">Theme Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Theme Mode</Label>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <input 
                      type="radio" 
                      id="light-mode" 
                      name="theme-mode" 
                      className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                      defaultChecked 
                    />
                    <Label htmlFor="light-mode" className="flex items-center space-x-2 cursor-pointer">
                      <Sun className="h-4 w-4" />
                      <span>Light</span>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input 
                      type="radio" 
                      id="dark-mode" 
                      name="theme-mode" 
                      className="h-4 w-4 text-primary border-gray-300 focus:ring-primary" 
                    />
                    <Label htmlFor="dark-mode" className="flex items-center space-x-2 cursor-pointer">
                      <Moon className="h-4 w-4" />
                      <span>Dark</span>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input 
                      type="radio" 
                      id="system-mode" 
                      name="theme-mode" 
                      className="h-4 w-4 text-primary border-gray-300 focus:ring-primary" 
                    />
                    <Label htmlFor="system-mode" className="flex items-center space-x-2 cursor-pointer">
                      <SettingsIcon className="h-4 w-4" />
                      <span>System</span>
                    </Label>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Color Scheme</Label>
                <div className="grid grid-cols-3 gap-2">
                  <div className="flex flex-col items-center space-y-2">
                    <div className="h-10 w-10 rounded-full bg-primary cursor-pointer ring-2 ring-primary ring-offset-2"></div>
                    <span className="text-xs">Corporate</span>
                  </div>
                  <div className="flex flex-col items-center space-y-2">
                    <div className="h-10 w-10 rounded-full bg-[#3498DB] cursor-pointer"></div>
                    <span className="text-xs">Blue</span>
                  </div>
                  <div className="flex flex-col items-center space-y-2">
                    <div className="h-10 w-10 rounded-full bg-[#8E44AD] cursor-pointer"></div>
                    <span className="text-xs">Purple</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}