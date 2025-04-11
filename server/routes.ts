import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { generateDemandForecast, generatePriceOptimization, generateAgentResponse, generateInventoryInsights } from "./openai";
import { z } from "zod";

// Map to store connected WebSocket clients
const clients = new Map<string, WebSocket>();

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  
  // Setup WebSocket server
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  wss.on('connection', (ws) => {
    const clientId = Math.random().toString(36).substring(2, 15);
    clients.set(clientId, ws);
    
    ws.on('message', async (message) => {
      try {
        const data = JSON.parse(message.toString());
        
        if (data.type === 'agent_message') {
          // Handle agent messages
          const response = await generateAgentResponse(
            data.agentType,
            data.content,
            data.context || []
          );
          
          // Save message to database
          const newMessage = await storage.createMessage({
            communicationId: data.communicationId,
            agentType: data.agentType,
            content: data.content
          });
          
          // Save AI response
          const aiResponse = await storage.createMessage({
            communicationId: data.communicationId,
            agentType: data.respondingAgentType || 'system',
            content: response
          });
          
          // Broadcast message to all clients
          broadcastMessage({
            type: 'new_message',
            message: {
              id: aiResponse.id,
              communicationId: aiResponse.communicationId,
              agentType: aiResponse.agentType,
              content: aiResponse.content,
              timestamp: aiResponse.timestamp
            }
          });
        }
      } catch (error) {
        console.error("WebSocket message error:", error);
      }
    });
    
    ws.on('close', () => {
      clients.delete(clientId);
    });
    
    // Send initial connection confirmation
    ws.send(JSON.stringify({ type: 'connected', clientId }));
  });
  
  // Broadcast message to all connected clients
  function broadcastMessage(data: any) {
    const message = JSON.stringify(data);
    clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }
  
  // API routes
  
  // Products
  app.get('/api/products', async (req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve products" });
    }
  });
  
  // Locations
  app.get('/api/locations', async (req, res) => {
    try {
      const locations = await storage.getLocations();
      res.json(locations);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve locations" });
    }
  });
  
  // Inventory
  app.get('/api/inventory', async (req, res) => {
    try {
      const inventory = await storage.getInventoryWithDetails();
      res.json(inventory);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve inventory" });
    }
  });
  
  // Dashboard overview
  app.get('/api/dashboard/overview', async (req, res) => {
    try {
      const inventory = await storage.getInventoryWithDetails();
      const forecasts = await storage.getLatestForecasts();
      
      // Calculate stock health
      const totalItems = inventory.length;
      const optimalItems = inventory.filter(item => item.status === 'optimal').length;
      const stockHealth = Math.round((optimalItems / totalItems) * 100);
      
      // Calculate stockout risk
      const lowStockItems = inventory.filter(item => item.status === 'low').length;
      const criticalItems = inventory.filter(item => item.status === 'critical').length;
      const stockoutRisk = lowStockItems + criticalItems;
      
      // Calculate overstock items
      const overstockItems = inventory.filter(item => item.status === 'overstock').length;
      
      // Calculate forecast accuracy (placeholder for real calculation)
      const forecastAccuracy = 93.4;
      
      res.json({
        stockHealth,
        stockoutRisk,
        overstockItems,
        forecastAccuracy
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve dashboard overview" });
    }
  });
  
  // Agent activities
  app.get('/api/agent-activities', async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const activities = await storage.getRecentAgentActivities(limit);
      res.json(activities);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve agent activities" });
    }
  });
  
  // Demand forecast
  app.get('/api/forecasts', async (req, res) => {
    try {
      const forecasts = await storage.getLatestForecasts();
      res.json(forecasts);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve forecasts" });
    }
  });
  
  // Generate new forecast
  app.post('/api/forecasts', async (req, res) => {
    try {
      const forecastSchema = z.object({
        productId: z.number(),
        locationId: z.number(),
        historicalData: z.array(z.any())
      });
      
      const validatedData = forecastSchema.parse(req.body);
      
      // Generate forecast using OpenAI
      const result = await generateDemandForecast(
        validatedData.productId,
        validatedData.locationId,
        validatedData.historicalData
      );
      
      // Save forecast to database
      const now = new Date();
      const nextWeek = new Date();
      nextWeek.setDate(now.getDate() + 7);
      
      const forecast = await storage.createForecast({
        productId: validatedData.productId,
        locationId: validatedData.locationId,
        predictedDemand: result.predictedDemand,
        confidence: result.confidence,
        startDate: now,
        endDate: nextWeek
      });
      
      // Create agent activity
      await storage.createAgentActivity({
        agentType: 'forecast',
        title: 'Forecast Agent',
        description: `Updated demand prediction for product ID ${validatedData.productId}.`
      });
      
      // Broadcast update
      broadcastMessage({
        type: 'new_forecast',
        forecast
      });
      
      res.json({
        forecast,
        insights: result.insights
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to generate forecast" });
    }
  });
  
  // Price optimizations
  app.get('/api/price-optimizations', async (req, res) => {
    try {
      const optimizations = await storage.getPriceOptimizations();
      
      // Enrich with product details
      const enrichedOptimizations = await Promise.all(
        optimizations.map(async (opt) => {
          const product = await storage.getProduct(opt.productId);
          return {
            ...opt,
            product
          };
        })
      );
      
      res.json(enrichedOptimizations);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve price optimizations" });
    }
  });
  
  // Generate price optimization
  app.post('/api/price-optimizations', async (req, res) => {
    try {
      const optimizationSchema = z.object({
        productId: z.number(),
        currentPrice: z.number(),
        stockLevel: z.number(),
        optimalStockLevel: z.number(),
        historicalSales: z.array(z.any()).optional()
      });
      
      const validatedData = optimizationSchema.parse(req.body);
      
      // Generate optimization using OpenAI
      const result = await generatePriceOptimization(
        validatedData.productId,
        validatedData.currentPrice,
        validatedData.stockLevel,
        validatedData.optimalStockLevel,
        validatedData.historicalSales || []
      );
      
      // Save optimization to database
      const optimization = await storage.createPriceOptimization({
        productId: validatedData.productId,
        currentPrice: validatedData.currentPrice,
        suggestedPrice: result.suggestedPrice,
        percentageChange: result.percentageChange,
        reason: result.reason,
        status: 'pending'
      });
      
      // Create agent activity
      await storage.createAgentActivity({
        agentType: 'pricing',
        title: 'Pricing Agent',
        description: `Suggested ${Math.abs(result.percentageChange)}% ${result.percentageChange >= 0 ? 'increase' : 'discount'} for product ID ${validatedData.productId}.`
      });
      
      // Broadcast update
      broadcastMessage({
        type: 'new_price_optimization',
        optimization
      });
      
      res.json(optimization);
    } catch (error) {
      res.status(500).json({ message: "Failed to generate price optimization" });
    }
  });
  
  // Update price optimization status
  app.patch('/api/price-optimizations/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const statusSchema = z.object({
        status: z.enum(['pending', 'applied', 'dismissed'])
      });
      
      const validatedData = statusSchema.parse(req.body);
      
      const updatedOptimization = await storage.updatePriceOptimization(id, {
        status: validatedData.status
      });
      
      if (!updatedOptimization) {
        return res.status(404).json({ message: "Price optimization not found" });
      }
      
      // If applied, update product price
      if (validatedData.status === 'applied') {
        const product = await storage.getProduct(updatedOptimization.productId);
        if (product) {
          await storage.updateProduct(product.id, {
            price: updatedOptimization.suggestedPrice
          });
          
          // Create agent activity
          await storage.createAgentActivity({
            agentType: 'pricing',
            title: 'Pricing Agent',
            description: `Applied ${Math.abs(updatedOptimization.percentageChange)}% ${updatedOptimization.percentageChange >= 0 ? 'increase' : 'discount'} to ${product.name}.`
          });
        }
      }
      
      // Broadcast update
      broadcastMessage({
        type: 'update_price_optimization',
        optimization: updatedOptimization
      });
      
      res.json(updatedOptimization);
    } catch (error) {
      res.status(500).json({ message: "Failed to update price optimization" });
    }
  });
  
  // Agent communications
  app.get('/api/communications', async (req, res) => {
    try {
      const communications = await storage.getAgentCommunications();
      res.json(communications);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve communications" });
    }
  });
  
  // Create new communication thread
  app.post('/api/communications', async (req, res) => {
    try {
      const communicationSchema = z.object({
        topic: z.string()
      });
      
      const validatedData = communicationSchema.parse(req.body);
      const communication = await storage.createAgentCommunication(validatedData);
      
      res.json(communication);
    } catch (error) {
      res.status(500).json({ message: "Failed to create communication thread" });
    }
  });
  
  // Get messages for a communication thread
  app.get('/api/communications/:id/messages', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const messages = await storage.getMessages(id);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve messages" });
    }
  });
  
  // Add message to communication thread
  app.post('/api/communications/:id/messages', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const messageSchema = z.object({
        agentType: z.string(),
        content: z.string()
      });
      
      const validatedData = messageSchema.parse(req.body);
      const message = await storage.createMessage({
        communicationId: id,
        ...validatedData
      });
      
      // Use OpenAI to generate a response
      const messages = await storage.getMessages(id);
      const context = messages.map(msg => ({
        agentType: msg.agentType,
        content: msg.content,
        timestamp: msg.timestamp
      }));
      
      // Determine which agent should respond
      let respondingAgentType: string;
      
      if (validatedData.agentType === 'forecast') {
        respondingAgentType = context.length % 2 === 0 ? 'inventory' : 'supplier';
      } else if (validatedData.agentType === 'inventory') {
        respondingAgentType = context.length % 2 === 0 ? 'supplier' : 'pricing';
      } else if (validatedData.agentType === 'supplier') {
        respondingAgentType = context.length % 2 === 0 ? 'pricing' : 'forecast';
      } else {
        respondingAgentType = context.length % 2 === 0 ? 'forecast' : 'inventory';
      }
      
      const response = await generateAgentResponse(
        respondingAgentType,
        validatedData.content,
        context
      );
      
      // Save AI response
      const aiMessage = await storage.createMessage({
        communicationId: id,
        agentType: respondingAgentType,
        content: response
      });
      
      // Broadcast messages
      broadcastMessage({
        type: 'new_message',
        message: {
          id: message.id,
          communicationId: message.communicationId,
          agentType: message.agentType,
          content: message.content,
          timestamp: message.timestamp
        }
      });
      
      broadcastMessage({
        type: 'new_message',
        message: {
          id: aiMessage.id,
          communicationId: aiMessage.communicationId,
          agentType: aiMessage.agentType,
          content: aiMessage.content,
          timestamp: aiMessage.timestamp
        }
      });
      
      res.json([message, aiMessage]);
    } catch (error) {
      res.status(500).json({ message: "Failed to add message" });
    }
  });
  
  // Get inventory insights
  app.get('/api/insights/inventory', async (req, res) => {
    try {
      const inventoryData = await storage.getInventoryWithDetails();
      const insight = await generateInventoryInsights(inventoryData);
      
      res.json({ insight });
    } catch (error) {
      res.status(500).json({ message: "Failed to generate inventory insights" });
    }
  });

  return httpServer;
}
