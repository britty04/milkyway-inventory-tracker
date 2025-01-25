import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Product } from "@/types/inventory";
import { getProducts, saveProducts, addProduct, removeProduct } from "@/utils/storage";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2, Milk, IceCream, Package, ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function StockManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState({ name: "", stock: 0, price: 0, unit: "", category: "" });
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const { toast } = useToast();

  useEffect(() => {
    setProducts(getProducts());
  }, []);

  const categories = [
    { id: "milk", name: "Milk Products", icon: <Milk className="w-5 h-5" /> },
    { id: "curd", name: "Curd Products", icon: <Package className="w-5 h-5" /> },
    { id: "ice-cream", name: "Ice Cream", icon: <IceCream className="w-5 h-5" /> },
    { id: "dairy", name: "Other Dairy Products", icon: <Package className="w-5 h-5" /> },
  ];

  const updateProduct = (id: string, field: keyof Product, value: string | number) => {
    const updated = products.map(product => {
      if (product.id === id) {
        return { ...product, [field]: value };
      }
      return product;
    });
    setProducts(updated);
  };

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.unit || !newProduct.category) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    const product = addProduct(newProduct);
    setProducts([...products, product]);
    setNewProduct({ name: "", stock: 0, price: 0, unit: "", category: "" });
    toast({
      title: "Product Added",
      description: "New product has been added successfully.",
    });
  };

  const handleRemoveProduct = (id: string) => {
    removeProduct(id);
    setProducts(products.filter(p => p.id !== id));
    toast({
      title: "Product Removed",
      description: "The product has been removed successfully.",
    });
  };

  const saveChanges = () => {
    saveProducts(products);
    toast({
      title: "Stock Updated",
      description: "The stock levels have been successfully updated.",
    });
  };

  const filteredProducts = selectedCategory === "all" 
    ? products 
    : products.filter(p => p.category.toLowerCase() === selectedCategory);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold">Stock Management</h2>
        <Button onClick={saveChanges}>Save Changes</Button>
      </div>

      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Add New Product</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <Input
              placeholder="Product Name"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              className="md:col-span-2"
            />
            <Input
              type="number"
              placeholder="Stock"
              value={newProduct.stock}
              onChange={(e) => setNewProduct({ ...newProduct, stock: Number(e.target.value) })}
            />
            <Input
              type="number"
              placeholder="Price"
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
            />
            <Select
              value={newProduct.category}
              onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    <div className="flex items-center gap-2">
                      {category.icon}
                      {category.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleAddProduct} className="w-full">
              <Plus className="w-4 h-4 mr-2" /> Add Product
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-2 mb-4">
        <Button
          variant={selectedCategory === "all" ? "default" : "outline"}
          onClick={() => setSelectedCategory("all")}
        >
          All Products
        </Button>
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            onClick={() => setSelectedCategory(category.id)}
            className="flex items-center gap-2"
          >
            {category.icon}
            {category.name}
          </Button>
        ))}
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Price (₹)</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>
                    {categories.find(c => c.id === product.category)?.name || product.category}
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={product.stock}
                      onChange={(e) => updateProduct(product.id, 'stock', Number(e.target.value))}
                      className="w-24"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={product.price}
                      onChange={(e) => updateProduct(product.id, 'price', Number(e.target.value))}
                      className="w-24"
                    />
                  </TableCell>
                  <TableCell>{product.unit}</TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleRemoveProduct(product.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}