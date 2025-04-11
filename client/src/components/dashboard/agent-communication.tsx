import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useWebSocket } from "@/components/ui/websocket-provider";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { Search, Bell, MessageSquare, Send, Bot } from "lucide-react";
import { formatTimeAgo, getColorForAgentType } from "@/lib/utils";

export default function AgentCommunication() {
  const { toast } = useToast();
  const { sendMessage } = useWebSocket();
  const [selectedCommunication, setSelectedCommunication] = useState<number | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Query communications
  const { data: communications, isLoading: communicationsLoading } = useQuery({
    queryKey: ['/api/communications'],
  });
  
  // Query messages for selected communication
  const { data: messages, isLoading: messagesLoading } = useQuery({
    queryKey: ['/api/communications', selectedCommunication, 'messages'],
    enabled: !!selectedCommunication,
  });
  
  // Create new message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      const response = await apiRequest("POST", `/api/communications/${selectedCommunication}/messages`, {
        agentType: "user", // The user is sending the message
        content
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/communications', selectedCommunication, 'messages'] });
      setMessageInput("");
    },
    onError: (error) => {
      toast({
        title: "Failed to send message",
        description: `Error: ${error.message}`,
        variant: "destructive",
      });
    }
  });
  
  // Set up WebSocket listener for real-time messages
  useEffect(() => {
    // Setup a message handler to be used with the WebSocket
    const handleMessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'new_message' && data.message && data.message.communicationId === selectedCommunication) {
          queryClient.invalidateQueries({ queryKey: ['/api/communications', selectedCommunication, 'messages'] });
        }
      } catch (error) {
        console.error("WebSocket message parse error:", error);
      }
    };
    
    // Add event listener to window for WebSocket messages
    window.addEventListener('message', handleMessage);
    
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [selectedCommunication]);
  
  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  // Handle send message
  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedCommunication) return;
    
    sendMessageMutation.mutate(messageInput);
  };
  
  // Handle key press for sending message
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  // Select first communication by default if none selected
  useEffect(() => {
    if (!selectedCommunication && communications && Array.isArray(communications) && communications.length > 0) {
      setSelectedCommunication(communications[0].id);
    }
  }, [communications, selectedCommunication]);
  
  // Create a new communication thread
  const createCommunicationMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", `/api/communications`, {
        topic: "New Discussion"
      });
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/communications'] });
      setSelectedCommunication(data.id);
      toast({
        title: "New communication channel created",
        description: "You can now start a new conversation.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to create communication",
        description: `Error: ${error.message}`,
        variant: "destructive",
      });
    }
  });
  
  // Handle creating a new communication
  const handleNewCommunication = () => {
    createCommunicationMutation.mutate();
  };
  
  // Get selected communication details
  const selectedCommunicationDetails = selectedCommunication && communications && Array.isArray(communications)
    ? communications.find((comm: any) => comm.id === selectedCommunication) 
    : null;
  
  if (communicationsLoading) {
    return (
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <Skeleton className="h-6 w-64" />
            <div className="flex space-x-2">
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-24" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <Skeleton className="h-10 w-full mb-4" />
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            </div>
            <Skeleton className="lg:col-span-3 h-[400px] rounded-xl" />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="shadow-sm transition-all duration-200 hover:translate-y-[-4px] hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold text-primary">Multi-Agent Communication Hub</CardTitle>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center text-[#7F8C8D]"
            >
              <Bell className="h-4 w-4 mr-1" />
              <span>Alerts</span>
            </Button>
            <Button 
              size="sm" 
              className="flex items-center bg-secondary hover:bg-secondary/90"
              onClick={handleNewCommunication}
              disabled={createCommunicationMutation.isPending}
            >
              <MessageSquare className="h-4 w-4 mr-1" />
              <span>New Message</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Communications List */}
          <div className="lg:col-span-1">
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search communications..." 
                  className="pl-9 border-[#ECF0F1]"
                />
              </div>
            </div>
            
            <div className="space-y-3">
              {communications && Array.isArray(communications) && communications.length > 0 ? (
                communications.map((comm: any) => {
                  const isSelected = selectedCommunication === comm.id;
                  return (
                    <div 
                      key={comm.id}
                      className={`flex items-center p-3 rounded-lg cursor-pointer ${
                        isSelected ? 'bg-[#ECF0F1]' : 'hover:bg-[#ECF0F1]'
                      }`}
                      onClick={() => setSelectedCommunication(comm.id)}
                    >
                      <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center text-white mr-3 flex-shrink-0">
                        <Bot className="h-5 w-5" />
                      </div>
                      <div className="text-sm flex-1">
                        <p className="font-medium text-primary">{comm.topic}</p>
                        <p className="text-[#7F8C8D] text-xs truncate">
                          Latest communication...
                        </p>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-xs text-[#7F8C8D]">
                          {formatTimeAgo(comm.lastActivityAt)}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-6 text-center">
                  <p className="text-[#7F8C8D]">No communications yet</p>
                  <Button 
                    size="sm" 
                    className="mt-2 bg-secondary hover:bg-secondary/90"
                    onClick={handleNewCommunication}
                    disabled={createCommunicationMutation.isPending}
                  >
                    <MessageSquare className="h-4 w-4 mr-1" />
                    <span>Start New</span>
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          {/* Messages Panel */}
          <div className="lg:col-span-3 border rounded-xl overflow-hidden">
            {selectedCommunication ? (
              <>
                {/* Communication Header */}
                <div className="bg-[#ECF0F1] p-3 border-b">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-white mr-3">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-primary">
                        {selectedCommunicationDetails?.topic || "Loading..."}
                      </p>
                      <p className="text-xs text-[#7F8C8D]">
                        Multiple agents • Last active {selectedCommunicationDetails ? formatTimeAgo(selectedCommunicationDetails.lastActivityAt) : "recently"}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Messages */}
                <div className="p-4 h-72 overflow-y-auto bg-white">
                  {messagesLoading ? (
                    <div className="space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex">
                          <Skeleton className="h-8 w-8 rounded-full mr-2" />
                          <Skeleton className="h-20 w-64 rounded-lg" />
                        </div>
                      ))}
                    </div>
                  ) : messages && Array.isArray(messages) && messages.length > 0 ? (
                    <div className="space-y-4">
                      {messages.map((message: any, index: number) => {
                        // Align user messages to the right, agent messages to the left
                        const isUserMessage = message.agentType === "user";
                        
                        const colors = message.agentType ? getColorForAgentType(message.agentType) : {
                          bg: 'bg-gray-100',
                          border: 'border-gray-300',
                          icon: 'bg-gray-500'
                        };

                        return (
                          <div 
                            key={message.id} 
                            className={`flex ${isUserMessage ? 'justify-end' : ''}`}
                          >
                            {!isUserMessage && (
                              <div className={`h-8 w-8 rounded-full ${colors.icon} flex items-center justify-center text-white mr-2 flex-shrink-0`}>
                                <Bot className="h-4 w-4" />
                              </div>
                            )}
                            
                            <div className={`${isUserMessage ? 'bg-primary bg-opacity-10' : colors.bg} rounded-lg p-3 max-w-xs text-sm`}>
                              <p className="font-medium text-primary">
                                {isUserMessage ? "You" : (message.agentType ? `${message.agentType.charAt(0).toUpperCase()}${message.agentType.slice(1)} Agent` : "System Agent")}
                              </p>
                              <p className="text-[#7F8C8D]">{message.content}</p>
                              <p className="text-xs text-[#7F8C8D] mt-1">{formatTimeAgo(message.timestamp)}</p>
                            </div>
                            
                            {isUserMessage && (
                              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white ml-2 flex-shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                                  <circle cx="12" cy="7" r="4" />
                                </svg>
                              </div>
                            )}
                          </div>
                        );
                      })}
                      <div ref={messagesEndRef} />
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <div className="text-center">
                        <Bot className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                        <p className="text-[#7F8C8D]">No messages yet. Start a conversation!</p>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Message Input */}
                <div className="p-3 border-t bg-white">
                  <div className="flex items-center">
                    <Input 
                      placeholder="Type a message..." 
                      className="flex-1 border-[#ECF0F1]"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyDown={handleKeyPress}
                      disabled={sendMessageMutation.isPending}
                    />
                    <Button 
                      className="ml-2 bg-secondary hover:bg-secondary/90 h-10 w-10 p-0"
                      onClick={handleSendMessage}
                      disabled={!messageInput.trim() || sendMessageMutation.isPending}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="h-[400px] flex items-center justify-center">
                <div className="text-center p-6">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-lg font-medium text-primary mb-2">No conversation selected</p>
                  <p className="text-[#7F8C8D] mb-4">Select a conversation from the list or start a new one</p>
                  <Button 
                    className="bg-secondary hover:bg-secondary/90"
                    onClick={handleNewCommunication}
                    disabled={createCommunicationMutation.isPending}
                  >
                    <MessageSquare className="h-4 w-4 mr-1" />
                    <span>New Conversation</span>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
