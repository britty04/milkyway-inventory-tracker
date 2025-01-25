import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";
import { Product } from "@/types/inventory";

interface ProductTableProps {
  products: Product[];
  updateProduct: (id: string, field: keyof Product, value: string | number) => void;
  handleRemoveProduct: (id: string) => void;
  categories: { id: string; name: string }[];
}

export function ProductTable({ products, updateProduct, handleRemoveProduct, categories }: ProductTableProps) {
  return (
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
        {products.map((product) => (
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
  );
}