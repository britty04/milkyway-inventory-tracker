import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Product, Sale } from "@/types/inventory";
import { getProducts, saveSale } from "@/utils/storage";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function SalesRecorder() {
  const [products, setProducts] = useState<Product[]>([]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [saleType, setSaleType] = useState<'counter' | 'supply'>('counter');
  const { toast } = useToast();

  useEffect(() => {
    const fetchProducts = async () => {
      const fetchedProducts = await getProducts();
      setProducts(fetchedProducts);
    };
    fetchProducts();
  }, []);

  const recordSale = async (productId: string, quantity: number) => {
    const product = products.find(p => p.id === productId);
    if (!product || quantity <= 0) return;

    const sale: Sale = {
      id: crypto.randomUUID(),
      productId,
      quantity,
      amount: quantity * product.price,
      type: saleType,
      timestamp: new Date().toISOString(),
    };

    await saveSale(sale);
    setQuantities(prev => ({ ...prev, [productId]: 0 }));
    
    toast({
      title: "Sale Recorded",
      description: `Recorded sale of ${quantity} ${product.unit} of ${product.name}`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Record Sales</h2>
        <div className="space-x-2">
          <Button
            variant={saleType === 'counter' ? 'default' : 'outline'}
            onClick={() => setSaleType('counter')}
          >
            Counter Sale
          </Button>
          <Button
            variant={saleType === 'supply' ? 'default' : 'outline'}
            onClick={() => setSaleType('supply')}
          >
            Supply Sale
          </Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Price (₹)</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.name}</TableCell>
              <TableCell>₹{product.price}/{product.unit}</TableCell>
              <TableCell>
                <Input
                  type="number"
                  value={quantities[product.id] || 0}
                  onChange={(e) => setQuantities(prev => ({
                    ...prev,
                    [product.id]: Number(e.target.value)
                  }))}
                  className="w-24"
                />
              </TableCell>
              <TableCell>
                <Button
                  onClick={() => recordSale(product.id, quantities[product.id] || 0)}
                  disabled={!quantities[product.id]}
                >
                  Record Sale
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}