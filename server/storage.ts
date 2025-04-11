import {
  Product, InsertProduct, products,
  Location, InsertLocation, locations,
  Inventory, InsertInventory, inventory,
  Supplier, InsertSupplier, suppliers,
  Order, InsertOrder, orders,
  OrderItem, InsertOrderItem, orderItems,
  Forecast, InsertForecast, forecasts,
  PriceOptimization, InsertPriceOptimization, priceOptimizations,
  AgentCommunication, InsertAgentCommunication, agentCommunications,
  Message, InsertMessage, messages,
  AgentActivity, InsertAgentActivity, agentActivities,
  User, InsertUser, users
} from "@shared/schema";

export interface IStorage {
  // Product operations
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  getProductBySku(sku: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;

  // Location operations
  getLocations(): Promise<Location[]>;
  getLocation(id: number): Promise<Location | undefined>;
  createLocation(location: InsertLocation): Promise<Location>;
  updateLocation(id: number, location: Partial<InsertLocation>): Promise<Location | undefined>;
  deleteLocation(id: number): Promise<boolean>;

  // Inventory operations
  getInventoryItems(): Promise<Inventory[]>;
  getInventoryItem(id: number): Promise<Inventory | undefined>;
  getInventoryByProductAndLocation(productId: number, locationId: number): Promise<Inventory | undefined>;
  getInventoryByLocation(locationId: number): Promise<Inventory[]>;
  getInventoryWithDetails(): Promise<any[]>;
  createInventory(inventory: InsertInventory): Promise<Inventory>;
  updateInventory(id: number, inventory: Partial<InsertInventory>): Promise<Inventory | undefined>;
  deleteInventory(id: number): Promise<boolean>;

  // Supplier operations
  getSuppliers(): Promise<Supplier[]>;
  getSupplier(id: number): Promise<Supplier | undefined>;
  createSupplier(supplier: InsertSupplier): Promise<Supplier>;
  updateSupplier(id: number, supplier: Partial<InsertSupplier>): Promise<Supplier | undefined>;
  deleteSupplier(id: number): Promise<boolean>;

  // Order operations
  getOrders(): Promise<Order[]>;
  getOrder(id: number): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrder(id: number, order: Partial<InsertOrder>): Promise<Order | undefined>;
  deleteOrder(id: number): Promise<boolean>;

  // Order item operations
  getOrderItems(orderId: number): Promise<OrderItem[]>;
  createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem>;
  updateOrderItem(id: number, orderItem: Partial<InsertOrderItem>): Promise<OrderItem | undefined>;
  deleteOrderItem(id: number): Promise<boolean>;

  // Forecast operations
  getForecasts(): Promise<Forecast[]>;
  getForecast(id: number): Promise<Forecast | undefined>;
  getLatestForecasts(): Promise<Forecast[]>;
  createForecast(forecast: InsertForecast): Promise<Forecast>;
  deleteForecast(id: number): Promise<boolean>;

  // Price optimization operations
  getPriceOptimizations(): Promise<PriceOptimization[]>;
  getPriceOptimization(id: number): Promise<PriceOptimization | undefined>;
  getPendingPriceOptimizations(): Promise<PriceOptimization[]>;
  createPriceOptimization(optimization: InsertPriceOptimization): Promise<PriceOptimization>;
  updatePriceOptimization(id: number, optimization: Partial<InsertPriceOptimization>): Promise<PriceOptimization | undefined>;
  deletePriceOptimization(id: number): Promise<boolean>;

  // Agent communication operations
  getAgentCommunications(): Promise<AgentCommunication[]>;
  getAgentCommunication(id: number): Promise<AgentCommunication | undefined>;
  createAgentCommunication(communication: InsertAgentCommunication): Promise<AgentCommunication>;
  updateAgentCommunication(id: number, communication: Partial<InsertAgentCommunication>): Promise<AgentCommunication | undefined>;
  deleteAgentCommunication(id: number): Promise<boolean>;

  // Message operations
  getMessages(communicationId: number): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  deleteMessage(id: number): Promise<boolean>;

  // Agent activities operations
  getAgentActivities(): Promise<AgentActivity[]>;
  getRecentAgentActivities(limit: number): Promise<AgentActivity[]>;
  createAgentActivity(activity: InsertAgentActivity): Promise<AgentActivity>;
  deleteAgentActivity(id: number): Promise<boolean>;

  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
}

export class MemStorage implements IStorage {
  private products: Map<number, Product>;
  private locations: Map<number, Location>;
  private inventory: Map<number, Inventory>;
  private suppliers: Map<number, Supplier>;
  private orders: Map<number, Order>;
  private orderItems: Map<number, OrderItem>;
  private forecasts: Map<number, Forecast>;
  private priceOptimizations: Map<number, PriceOptimization>;
  private agentCommunications: Map<number, AgentCommunication>;
  private messages: Map<number, Message>;
  private agentActivities: Map<number, AgentActivity>;
  private users: Map<number, User>;

  private currentIds: {
    products: number;
    locations: number;
    inventory: number;
    suppliers: number;
    orders: number;
    orderItems: number;
    forecasts: number;
    priceOptimizations: number;
    agentCommunications: number;
    messages: number;
    agentActivities: number;
    users: number;
  };

  constructor() {
    this.products = new Map();
    this.locations = new Map();
    this.inventory = new Map();
    this.suppliers = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    this.forecasts = new Map();
    this.priceOptimizations = new Map();
    this.agentCommunications = new Map();
    this.messages = new Map();
    this.agentActivities = new Map();
    this.users = new Map();

    this.currentIds = {
      products: 1,
      locations: 1,
      inventory: 1,
      suppliers: 1,
      orders: 1,
      orderItems: 1,
      forecasts: 1,
      priceOptimizations: 1,
      agentCommunications: 1,
      messages: 1,
      agentActivities: 1,
      users: 1,
    };

    // Initialize with sample data
    this.initializeSampleData();
  }

  // Product operations
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductBySku(sku: string): Promise<Product | undefined> {
    return Array.from(this.products.values()).find(product => product.sku === sku);
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const id = this.currentIds.products++;
    const newProduct: Product = { ...product, id };
    this.products.set(id, newProduct);
    return newProduct;
  }

  async updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined> {
    const existingProduct = this.products.get(id);
    if (!existingProduct) return undefined;

    const updatedProduct: Product = { ...existingProduct, ...product };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<boolean> {
    return this.products.delete(id);
  }

  // Location operations
  async getLocations(): Promise<Location[]> {
    return Array.from(this.locations.values());
  }

  async getLocation(id: number): Promise<Location | undefined> {
    return this.locations.get(id);
  }

  async createLocation(location: InsertLocation): Promise<Location> {
    const id = this.currentIds.locations++;
    const newLocation: Location = { ...location, id };
    this.locations.set(id, newLocation);
    return newLocation;
  }

  async updateLocation(id: number, location: Partial<InsertLocation>): Promise<Location | undefined> {
    const existingLocation = this.locations.get(id);
    if (!existingLocation) return undefined;

    const updatedLocation: Location = { ...existingLocation, ...location };
    this.locations.set(id, updatedLocation);
    return updatedLocation;
  }

  async deleteLocation(id: number): Promise<boolean> {
    return this.locations.delete(id);
  }

  // Inventory operations
  async getInventoryItems(): Promise<Inventory[]> {
    return Array.from(this.inventory.values());
  }

  async getInventoryItem(id: number): Promise<Inventory | undefined> {
    return this.inventory.get(id);
  }

  async getInventoryByProductAndLocation(productId: number, locationId: number): Promise<Inventory | undefined> {
    return Array.from(this.inventory.values()).find(
      item => item.productId === productId && item.locationId === locationId
    );
  }

  async getInventoryByLocation(locationId: number): Promise<Inventory[]> {
    return Array.from(this.inventory.values()).filter(
      item => item.locationId === locationId
    );
  }

  async getInventoryWithDetails(): Promise<any[]> {
    const inventoryItems = Array.from(this.inventory.values());
    return Promise.all(
      inventoryItems.map(async (item) => {
        const product = await this.getProduct(item.productId);
        const location = await this.getLocation(item.locationId);
        
        let status = "optimal";
        if (item.quantity <= item.minStockLevel) {
          status = item.quantity === 0 ? "critical" : "low";
        } else if (item.quantity >= item.maxStockLevel) {
          status = "overstock";
        }
        
        return {
          ...item,
          product,
          location,
          status
        };
      })
    );
  }

  async createInventory(inventoryItem: InsertInventory): Promise<Inventory> {
    const id = this.currentIds.inventory++;
    const now = new Date();
    const newInventory: Inventory = { ...inventoryItem, id, updatedAt: now };
    this.inventory.set(id, newInventory);
    return newInventory;
  }

  async updateInventory(id: number, inventoryItem: Partial<InsertInventory>): Promise<Inventory | undefined> {
    const existingInventory = this.inventory.get(id);
    if (!existingInventory) return undefined;

    const now = new Date();
    const updatedInventory: Inventory = { 
      ...existingInventory, 
      ...inventoryItem, 
      updatedAt: now 
    };
    this.inventory.set(id, updatedInventory);
    return updatedInventory;
  }

  async deleteInventory(id: number): Promise<boolean> {
    return this.inventory.delete(id);
  }

  // Supplier operations
  async getSuppliers(): Promise<Supplier[]> {
    return Array.from(this.suppliers.values());
  }

  async getSupplier(id: number): Promise<Supplier | undefined> {
    return this.suppliers.get(id);
  }

  async createSupplier(supplier: InsertSupplier): Promise<Supplier> {
    const id = this.currentIds.suppliers++;
    const newSupplier: Supplier = { ...supplier, id };
    this.suppliers.set(id, newSupplier);
    return newSupplier;
  }

  async updateSupplier(id: number, supplier: Partial<InsertSupplier>): Promise<Supplier | undefined> {
    const existingSupplier = this.suppliers.get(id);
    if (!existingSupplier) return undefined;

    const updatedSupplier: Supplier = { ...existingSupplier, ...supplier };
    this.suppliers.set(id, updatedSupplier);
    return updatedSupplier;
  }

  async deleteSupplier(id: number): Promise<boolean> {
    return this.suppliers.delete(id);
  }

  // Order operations
  async getOrders(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }

  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const id = this.currentIds.orders++;
    const now = new Date();
    const newOrder: Order = { ...order, id, orderDate: now };
    this.orders.set(id, newOrder);
    return newOrder;
  }

  async updateOrder(id: number, order: Partial<InsertOrder>): Promise<Order | undefined> {
    const existingOrder = this.orders.get(id);
    if (!existingOrder) return undefined;

    const updatedOrder: Order = { ...existingOrder, ...order };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }

  async deleteOrder(id: number): Promise<boolean> {
    return this.orders.delete(id);
  }

  // Order item operations
  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return Array.from(this.orderItems.values()).filter(
      item => item.orderId === orderId
    );
  }

  async createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem> {
    const id = this.currentIds.orderItems++;
    const newOrderItem: OrderItem = { ...orderItem, id };
    this.orderItems.set(id, newOrderItem);
    return newOrderItem;
  }

  async updateOrderItem(id: number, orderItem: Partial<InsertOrderItem>): Promise<OrderItem | undefined> {
    const existingItem = this.orderItems.get(id);
    if (!existingItem) return undefined;

    const updatedItem: OrderItem = { ...existingItem, ...orderItem };
    this.orderItems.set(id, updatedItem);
    return updatedItem;
  }

  async deleteOrderItem(id: number): Promise<boolean> {
    return this.orderItems.delete(id);
  }

  // Forecast operations
  async getForecasts(): Promise<Forecast[]> {
    return Array.from(this.forecasts.values());
  }

  async getForecast(id: number): Promise<Forecast | undefined> {
    return this.forecasts.get(id);
  }

  async getLatestForecasts(): Promise<Forecast[]> {
    return Array.from(this.forecasts.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createForecast(forecast: InsertForecast): Promise<Forecast> {
    const id = this.currentIds.forecasts++;
    const now = new Date();
    const newForecast: Forecast = { ...forecast, id, createdAt: now };
    this.forecasts.set(id, newForecast);
    return newForecast;
  }

  async deleteForecast(id: number): Promise<boolean> {
    return this.forecasts.delete(id);
  }

  // Price optimization operations
  async getPriceOptimizations(): Promise<PriceOptimization[]> {
    return Array.from(this.priceOptimizations.values());
  }

  async getPriceOptimization(id: number): Promise<PriceOptimization | undefined> {
    return this.priceOptimizations.get(id);
  }

  async getPendingPriceOptimizations(): Promise<PriceOptimization[]> {
    return Array.from(this.priceOptimizations.values())
      .filter(opt => opt.status === "pending");
  }

  async createPriceOptimization(optimization: InsertPriceOptimization): Promise<PriceOptimization> {
    const id = this.currentIds.priceOptimizations++;
    const now = new Date();
    const newOptimization: PriceOptimization = { ...optimization, id, createdAt: now };
    this.priceOptimizations.set(id, newOptimization);
    return newOptimization;
  }

  async updatePriceOptimization(id: number, optimization: Partial<InsertPriceOptimization>): Promise<PriceOptimization | undefined> {
    const existingOptimization = this.priceOptimizations.get(id);
    if (!existingOptimization) return undefined;

    const updatedOptimization: PriceOptimization = { ...existingOptimization, ...optimization };
    this.priceOptimizations.set(id, updatedOptimization);
    return updatedOptimization;
  }

  async deletePriceOptimization(id: number): Promise<boolean> {
    return this.priceOptimizations.delete(id);
  }

  // Agent communication operations
  async getAgentCommunications(): Promise<AgentCommunication[]> {
    return Array.from(this.agentCommunications.values());
  }

  async getAgentCommunication(id: number): Promise<AgentCommunication | undefined> {
    return this.agentCommunications.get(id);
  }

  async createAgentCommunication(communication: InsertAgentCommunication): Promise<AgentCommunication> {
    const id = this.currentIds.agentCommunications++;
    const now = new Date();
    const newCommunication: AgentCommunication = { ...communication, id, lastActivityAt: now };
    this.agentCommunications.set(id, newCommunication);
    return newCommunication;
  }

  async updateAgentCommunication(id: number, communication: Partial<InsertAgentCommunication>): Promise<AgentCommunication | undefined> {
    const existingCommunication = this.agentCommunications.get(id);
    if (!existingCommunication) return undefined;

    const now = new Date();
    const updatedCommunication: AgentCommunication = { 
      ...existingCommunication, 
      ...communication,
      lastActivityAt: now
    };
    this.agentCommunications.set(id, updatedCommunication);
    return updatedCommunication;
  }

  async deleteAgentCommunication(id: number): Promise<boolean> {
    return this.agentCommunications.delete(id);
  }

  // Message operations
  async getMessages(communicationId: number): Promise<Message[]> {
    return Array.from(this.messages.values())
      .filter(msg => msg.communicationId === communicationId)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const id = this.currentIds.messages++;
    const now = new Date();
    const newMessage: Message = { ...message, id, timestamp: now };
    this.messages.set(id, newMessage);
    
    // Update the last activity time of the communication
    const commId = message.communicationId;
    const comm = await this.getAgentCommunication(commId);
    if (comm) {
      await this.updateAgentCommunication(commId, {});
    }
    
    return newMessage;
  }

  async deleteMessage(id: number): Promise<boolean> {
    return this.messages.delete(id);
  }

  // Agent activities operations
  async getAgentActivities(): Promise<AgentActivity[]> {
    return Array.from(this.agentActivities.values())
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  async getRecentAgentActivities(limit: number): Promise<AgentActivity[]> {
    return (await this.getAgentActivities()).slice(0, limit);
  }

  async createAgentActivity(activity: InsertAgentActivity): Promise<AgentActivity> {
    const id = this.currentIds.agentActivities++;
    const now = new Date();
    const newActivity: AgentActivity = { ...activity, id, timestamp: now };
    this.agentActivities.set(id, newActivity);
    return newActivity;
  }

  async deleteAgentActivity(id: number): Promise<boolean> {
    return this.agentActivities.delete(id);
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.currentIds.users++;
    const newUser: User = { ...user, id };
    this.users.set(id, newUser);
    return newUser;
  }

  // Initialize sample data
  private async initializeSampleData() {
    // Sample products
    await this.createProduct({ name: "Premium Cotton T-shirt (Black)", sku: "TCT-BLK-M", description: "High-quality cotton t-shirt in black", price: 24.99, category: "Apparel" });
    await this.createProduct({ name: "Premium Cotton T-shirt (White)", sku: "TCT-WHT-L", description: "High-quality cotton t-shirt in white", price: 24.99, category: "Apparel" });
    await this.createProduct({ name: "Designer Jeans (Slim Fit)", sku: "DJN-SLM-32", description: "Slim fit designer jeans", price: 79.99, category: "Apparel" });
    await this.createProduct({ name: "Summer Dress (Floral)", sku: "SDR-FLR-S", description: "Floral summer dress", price: 49.99, category: "Apparel" });
    await this.createProduct({ name: "Winter Jacket (Insulated)", sku: "WJK-INS-L", description: "Insulated winter jacket", price: 129.99, category: "Outerwear" });
    await this.createProduct({ name: "Winter Accessories Bundle", sku: "WAB-001", description: "Bundle of winter accessories", price: 45.99, category: "Accessories" });

    // Sample locations
    await this.createLocation({ name: "Main Warehouse", type: "warehouse", address: "123 Main St, Warehouse District" });
    await this.createLocation({ name: "Store #103", type: "store", address: "456 Market St, Downtown" });
    await this.createLocation({ name: "Store #105", type: "store", address: "789 Commerce Ave, Mall Complex" });

    // Sample inventory
    await this.createInventory({ productId: 1, locationId: 1, quantity: 1245, minStockLevel: 100, maxStockLevel: 2000 });
    await this.createInventory({ productId: 2, locationId: 2, quantity: 56, minStockLevel: 100, maxStockLevel: 500 });
    await this.createInventory({ productId: 3, locationId: 1, quantity: 843, minStockLevel: 200, maxStockLevel: 600 });
    await this.createInventory({ productId: 4, locationId: 3, quantity: 12, minStockLevel: 50, maxStockLevel: 300 });
    await this.createInventory({ productId: 5, locationId: 1, quantity: 378, minStockLevel: 100, maxStockLevel: 500 });
    await this.createInventory({ productId: 6, locationId: 1, quantity: 523, minStockLevel: 100, maxStockLevel: 400 });

    // Sample suppliers
    await this.createSupplier({ name: "GlobalSupply Inc.", contactPerson: "John Brown", email: "john@globalsupply.com", phone: "+1-555-123-4567" });
    await this.createSupplier({ name: "FashionFabrics Ltd.", contactPerson: "Sarah Lee", email: "sarah@fashionfabrics.com", phone: "+1-555-987-6543" });
    await this.createSupplier({ name: "TextileTech", contactPerson: "Mike Chen", email: "mike@textiletech.com", phone: "+1-555-456-7890" });

    // Sample orders
    const order1 = await this.createOrder({ supplierId: 1, locationId: 1, status: "delivered", deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) });
    await this.createOrderItem({ orderId: order1.id, productId: 1, quantity: 500, unitPrice: 15.99 });
    await this.createOrderItem({ orderId: order1.id, productId: 2, quantity: 300, unitPrice: 15.99 });

    const order2 = await this.createOrder({ supplierId: 2, locationId: 2, status: "pending", deliveryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) });
    await this.createOrderItem({ orderId: order2.id, productId: 4, quantity: 100, unitPrice: 29.99 });

    // Sample forecasts
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);

    await this.createForecast({
      productId: 1,
      locationId: 1,
      predictedDemand: 350,
      confidence: 0.92,
      startDate: tomorrow,
      endDate: nextWeek
    });

    await this.createForecast({
      productId: 2,
      locationId: 2,
      predictedDemand: 120,
      confidence: 0.85,
      startDate: tomorrow,
      endDate: nextWeek
    });

    // Sample price optimizations
    await this.createPriceOptimization({
      productId: 3,
      currentPrice: 79.99,
      suggestedPrice: 67.99,
      percentageChange: -15,
      reason: "overstock",
      status: "pending"
    });

    await this.createPriceOptimization({
      productId: 6,
      currentPrice: 45.99,
      suggestedPrice: 39.99,
      percentageChange: -13,
      reason: "overstock",
      status: "pending"
    });

    await this.createPriceOptimization({
      productId: 2,
      currentPrice: 24.99,
      suggestedPrice: 29.99,
      percentageChange: 20,
      reason: "lowstock",
      status: "pending"
    });

    // Sample agent communications
    const comm1 = await this.createAgentCommunication({ topic: "Restock Coordination" });
    const comm2 = await this.createAgentCommunication({ topic: "Supplier Negotiation" });
    const comm3 = await this.createAgentCommunication({ topic: "Stockout Prevention" });

    // Sample messages
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
    const threeMinutesLater = new Date(tenMinutesAgo.getTime() + 3 * 60 * 1000);
    const sevenMinutesLater = new Date(tenMinutesAgo.getTime() + 7 * 60 * 1000);
    const twelveminutesLater = new Date(tenMinutesAgo.getTime() + 12 * 60 * 1000);

    const msg1 = await this.createMessage({
      communicationId: comm1.id,
      agentType: "forecast",
      content: "Latest demand analysis shows we need to increase Summer Collection inventory by 15% to meet projected demand over the next 30 days."
    });
    this.messages.get(msg1.id)!.timestamp = tenMinutesAgo;

    const msg2 = await this.createMessage({
      communicationId: comm1.id,
      agentType: "inventory",
      content: "Current Summer Collection stock is at 65% of optimal level. Do we have supplier capacity to fulfill the 15% increase?"
    });
    this.messages.get(msg2.id)!.timestamp = threeMinutesLater;

    const msg3 = await this.createMessage({
      communicationId: comm1.id,
      agentType: "supplier",
      content: "I've checked with our primary supplier GlobalSupply Inc. They can accommodate a 20% increase with standard lead time of 14 days."
    });
    this.messages.get(msg3.id)!.timestamp = sevenMinutesLater;

    const msg4 = await this.createMessage({
      communicationId: comm1.id,
      agentType: "pricing",
      content: "Based on current demand elasticity, we could increase prices by 7-10% during peak season without significant impact on sales volume."
    });
    this.messages.get(msg4.id)!.timestamp = twelveminutesLater;

    // Sample agent activities
    const tenMinsAgo = new Date(Date.now() - 10 * 60 * 1000);
    const twentyFiveMinsAgo = new Date(Date.now() - 25 * 60 * 1000);
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const threeHoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000);

    const act1 = await this.createAgentActivity({
      agentType: "forecast",
      title: "Forecast Agent",
      description: "Updated demand prediction for 'Summer Collection' products."
    });
    this.agentActivities.get(act1.id)!.timestamp = tenMinsAgo;

    const act2 = await this.createAgentActivity({
      agentType: "inventory",
      title: "Inventory Agent",
      description: "Detected potential stockout risk for 'Organic Cotton T-shirts'."
    });
    this.agentActivities.get(act2.id)!.timestamp = twentyFiveMinsAgo;

    const act3 = await this.createAgentActivity({
      agentType: "pricing",
      title: "Pricing Agent",
      description: "Suggested 15% discount for overstock items in 'Winter Accessories'."
    });
    this.agentActivities.get(act3.id)!.timestamp = oneHourAgo;

    const act4 = await this.createAgentActivity({
      agentType: "supplier",
      title: "Supplier Agent",
      description: "Initiated PO #45892 with 'GlobalSupply Inc.' for 2,500 units."
    });
    this.agentActivities.get(act4.id)!.timestamp = threeHoursAgo;

    // Sample user
    await this.createUser({ username: "admin", password: "password" });
  }
}

export const storage = new MemStorage();
