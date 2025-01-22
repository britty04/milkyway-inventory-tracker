import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Product } from "@/types/inventory";
import { getProducts, saveProducts, addProduct, removeProduct } from "@/utils/storage";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2 } from "lucide-react";

export function StockManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState({ name: "", stock: 0, price: 0, unit: "" });
  const { toast } = useToast();

  useEffect(() => {
    setProducts(getProducts());
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

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.unit) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    const product = addProduct(newProduct);
    setProducts([...products, product]);
    setNewProduct({ name: "", stock: 0, price: 0, unit: "" });
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Stock Management</h2>
        <Button onClick={saveChanges}>Save Changes</Button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Add New Product</h3>
        <div className="grid grid-cols-5 gap-4">
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
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Price (₹)</TableHead>
            <TableHead>Unit</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.name}</TableCell>
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
  );
}