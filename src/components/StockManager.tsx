import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Product } from "@/types/inventory";
import { getProducts, saveProducts, addProduct, removeProduct } from "@/utils/storage/products";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2, Package } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function StockManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState({ name: "", stock: 0, price: 0, unit: "" });
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const { toast } = useToast();

  useEffect(() => {
    const fetchProducts = async () => {
      const fetchedProducts = await getProducts();
      setProducts(fetchedProducts);
    };
    fetchProducts();
  }, []);

  const updateProduct = (id: string, field: keyof Product, value: string | number) => {
    const updated = products.map(product => {
      if (product.id === id) {
        return { ...product, [field]: typeof value === 'string' ? value : Number(value) };
      }
      return product;
    });
    setProducts(updated);
  };

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.unit) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    const product = await addProduct(newProduct);
    setProducts([...products, product]);
    setNewProduct({ name: "", stock: 0, price: 0, unit: "" });
    toast({
      title: "Product Added",
      description: "New product has been added successfully.",
    });
  };

  const handleRemoveProduct = async (id: string) => {
    await removeProduct(id);
    setProducts(products.filter(p => p.id !== id));
    toast({
      title: "Product Removed",
      description: "The product has been removed successfully.",
    });
  };

  const saveChanges = async () => {
    await saveProducts(products);
    toast({
      title: "Stock Updated",
      description: "The stock levels have been successfully updated.",
    });
  };

  const getCategory = (name: string): string => {
    if (name.startsWith('FCM')) return 'Milk';
    if (name.includes('CURD') || name.includes('LASSI') || name.includes('YOGURT')) return 'Curd & Dairy';
    if (name.startsWith('ICE STICK')) return 'Ice Sticks';
    if (name.startsWith('ICE CUP')) return 'Ice Cups';
    if (name.startsWith('ICE CONE') || name.includes('BALL') || name.includes('SLICE')) return 'Special Ice Cream';
    if (name.startsWith('BITES')) return 'Ice Cream Bites';
    if (name.startsWith('FAMILY PACK')) return 'Family Packs';
    if (name.includes('CHEESE') || name.includes('BUTTER') || name.includes('PANNEER')) return 'Cheese & Butter';
    return 'Other';
  };

  const categories = ['all', 'Milk', 'Curd & Dairy', 'Ice Sticks', 'Ice Cups', 'Special Ice Cream', 
    'Ice Cream Bites', 'Family Packs', 'Cheese & Butter', 'Other'];

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => getCategory(p.name) === selectedCategory);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Stock Management</h2>
        <Button onClick={saveChanges}>Save Changes</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add New Product</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Input
              placeholder="Product Name"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
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
            <Input
              placeholder="Unit (e.g., packet, bottle)"
              value={newProduct.unit}
              onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })}
            />
            <Button onClick={handleAddProduct} className="w-full">
              <Plus className="w-4 h-4 mr-2" /> Add Product
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            onClick={() => setSelectedCategory(category)}
            className="whitespace-nowrap"
          >
            <Package className="w-4 h-4 mr-2" />
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </Button>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
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
                  <TableCell>{getCategory(product.name)}</TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={product.stock}
                      onChange={(e) => updateProduct(product.id, 'stock', e.target.value)}
                      className="w-24"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={product.price}
                      onChange={(e) => updateProduct(product.id, 'price', e.target.value)}
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
        </div>
      </div>
    </div>
  );
}