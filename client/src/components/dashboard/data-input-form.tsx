import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Product Form Schema
const productFormSchema = z.object({
  name: z.string().min(2, {
    message: "Product name must be at least 2 characters.",
  }),
  sku: z.string().min(4, {
    message: "SKU must be at least 4 characters.",
  }),
  category: z.string().min(1, {
    message: "Please select a category.",
  }),
  price: z.coerce.number().positive({
    message: "Price must be a positive number.",
  }),
});

// Inventory Form Schema
const inventoryFormSchema = z.object({
  productId: z.coerce.number().positive(),
  locationId: z.coerce.number().positive(),
  quantity: z.coerce.number().nonnegative(),
  minStockLevel: z.coerce.number().nonnegative(),
  maxStockLevel: z.coerce.number().positive(),
});

// User Name Form Schema
const userNameFormSchema = z.object({
  fullName: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
});

export default function DataInputForm() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("user");
  const [userName, setUserName] = useState("Sukanya Patnaik");
  const [nameSet, setNameSet] = useState(false);
  
  // User Name Form
  const userNameForm = useForm<z.infer<typeof userNameFormSchema>>({
    resolver: zodResolver(userNameFormSchema),
    defaultValues: {
      fullName: "",
    },
  });

  // Product Form
  const productForm = useForm<z.infer<typeof productFormSchema>>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      sku: "",
      category: "",
      price: 0,
    },
  });

  // Inventory Form
  const inventoryForm = useForm<z.infer<typeof inventoryFormSchema>>({
    resolver: zodResolver(inventoryFormSchema),
    defaultValues: {
      productId: 0,
      locationId: 0,
      quantity: 0,
      minStockLevel: 0,
      maxStockLevel: 0,
    },
  });

  // Handle user name submission
  function onUserNameSubmit(values: z.infer<typeof userNameFormSchema>) {
    setUserName(values.fullName);
    setNameSet(true);
    toast({
      title: "Welcome",
      description: `Hello, ${values.fullName}! Your name has been set.`,
    });
  }

  // Handle product submission
  function onProductSubmit(values: z.infer<typeof productFormSchema>) {
    // Submit product data to backend
    apiRequest("POST", "/api/products", values)
      .then((response) => response.json())
      .then((data) => {
        queryClient.invalidateQueries({ queryKey: ['/api/products'] });
        toast({
          title: "Product Added",
          description: `Successfully added ${values.name} to your inventory.`,
        });
        productForm.reset();
      })
      .catch((error) => {
        toast({
          title: "Error",
          description: `Failed to add product: ${error.message}`,
          variant: "destructive",
        });
      });
  }

  // Handle inventory submission
  function onInventorySubmit(values: z.infer<typeof inventoryFormSchema>) {
    // Submit inventory data to backend
    apiRequest("POST", "/api/inventory", values)
      .then((response) => response.json())
      .then((data) => {
        queryClient.invalidateQueries({ queryKey: ['/api/inventory'] });
        toast({
          title: "Inventory Updated",
          description: "Successfully updated inventory levels.",
        });
        inventoryForm.reset();
      })
      .catch((error) => {
        toast({
          title: "Error",
          description: `Failed to update inventory: ${error.message}`,
          variant: "destructive",
        });
      });
  }

  return (
    <Card className="shadow-sm transition-all duration-200 hover:translate-y-[-4px] hover:shadow-md mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-primary flex justify-between items-center">
          <span>Data Management</span>
          {nameSet && <span className="text-sm text-secondary">Welcome, {userName}</span>}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="user">User Info</TabsTrigger>
            <TabsTrigger value="product">Add Product</TabsTrigger>
            <TabsTrigger value="inventory">Update Inventory</TabsTrigger>
          </TabsList>
          
          <TabsContent value="user">
            <Form {...userNameForm}>
              <form onSubmit={userNameForm.handleSubmit(onUserNameSubmit)} className="space-y-4">
                <FormField
                  control={userNameForm.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Sukanya Patnaik" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="bg-secondary hover:bg-secondary/90">
                  Save Name
                </Button>
              </form>
            </Form>
          </TabsContent>
          
          <TabsContent value="product">
            <Form {...productForm}>
              <form onSubmit={productForm.handleSubmit(onProductSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={productForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Cotton Saree" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={productForm.control}
                    name="sku"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SKU</FormLabel>
                        <FormControl>
                          <Input placeholder="SAR-001" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={productForm.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="clothing">Clothing</SelectItem>
                            <SelectItem value="electronics">Electronics</SelectItem>
                            <SelectItem value="grocery">Grocery</SelectItem>
                            <SelectItem value="homegoods">Home Goods</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={productForm.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price (₹)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="1999" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <Button type="submit" className="bg-secondary hover:bg-secondary/90">
                  Add Product
                </Button>
              </form>
            </Form>
          </TabsContent>
          
          <TabsContent value="inventory">
            <Form {...inventoryForm}>
              <form onSubmit={inventoryForm.handleSubmit(onInventorySubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={inventoryForm.control}
                    name="productId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product ID</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={inventoryForm.control}
                    name="locationId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location ID</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={inventoryForm.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={inventoryForm.control}
                    name="minStockLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Minimum Stock</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={inventoryForm.control}
                    name="maxStockLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Maximum Stock</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <Button type="submit" className="bg-secondary hover:bg-secondary/90">
                  Update Inventory
                </Button>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}