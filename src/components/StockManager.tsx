import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Product } from "@/types/inventory";
import { getProducts, saveProducts } from "@/utils/storage";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function StockManager() {
  const [products, setProducts] = useState<Product[]>([]);
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

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Price (₹)</TableHead>
            <TableHead>Unit</TableHead>
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}