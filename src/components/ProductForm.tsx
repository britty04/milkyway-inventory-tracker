import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Milk, IceCream, Package } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProductFormProps {
  newProduct: {
    name: string;
    stock: number;
    price: number;
    unit: string;
    category: string;
  };
  setNewProduct: (product: any) => void;
  handleAddProduct: () => void;
}

export function ProductForm({ newProduct, setNewProduct, handleAddProduct }: ProductFormProps) {
  const categories = [
    { id: "milk", name: "Milk Products", icon: <Milk className="w-5 h-5" /> },
    { id: "curd", name: "Curd Products", icon: <Package className="w-5 h-5" /> },
    { id: "ice-cream", name: "Ice Cream", icon: <IceCream className="w-5 h-5" /> },
    { id: "dairy", name: "Other Dairy Products", icon: <Package className="w-5 h-5" /> },
  ];

  return (
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
  );
}