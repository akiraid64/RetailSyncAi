import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';

type WebSocketContextType = {
  connected: boolean;
  sendMessage: (message: any) => void;
};

const WebSocketContext = createContext<WebSocketContextType>({
  connected: false,
  sendMessage: () => {},
});

export const useWebSocket = () => useContext(WebSocketContext);

type WebSocketProviderProps = {
  children: ReactNode;
};

export function WebSocketProvider({ children }: WebSocketProviderProps) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      setConnected(true);
    };

    ws.onclose = () => {
      setConnected(false);
      // Try to reconnect after a short delay
      setTimeout(() => {
        setSocket(null);
      }, 5000);
    };

    ws.onerror = () => {
      toast({
        title: 'WebSocket Connection Error',
        description: 'Unable to connect to real-time updates. Please refresh the page.',
        variant: 'destructive',
      });
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        // Handle different message types
        switch (data.type) {
          case 'connected':
            // Connection established
            break;
          case 'new_forecast':
            // Handle new forecast data
            toast({
              title: 'New Forecast Available',
              description: 'A new demand forecast has been generated.',
            });
            break;
          case 'new_price_optimization':
            // Handle new price optimization
            toast({
              title: 'Price Optimization',
              description: 'New price recommendation available.',
            });
            break;
          case 'new_message':
            // Handle new message
            // Will be handled by the communication component
            break;
          default:
            break;
        }
      } catch (error) {
        console.error('Failed to parse WebSocket message', error);
      }
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [toast]);

  const sendMessage = (message: any) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
    } else {
      toast({
        title: 'Connection Issue',
        description: 'Unable to send message. Websocket connection is not open.',
        variant: 'destructive',
      });
    }
  };

  return (
    <WebSocketContext.Provider value={{ connected, sendMessage }}>
      {children}
    </WebSocketContext.Provider>
  );
}
