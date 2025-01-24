import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { DailySummary as DailySummaryType, Sale, Product } from "@/types/inventory";
import { getProducts, getSales, saveDailySummary, exportToExcel } from "@/utils/storage";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DailySummary() {
  const { toast } = useToast();
  const [summary, setSummary] = useState<DailySummaryType | null>(null);

  const generateSummary = async () => {
    const sales = await getSales();
    const products = await getProducts();
    const today = new Date().toISOString().split('T')[0];
    
    // Filter today's sales
    const todaySales = sales.filter(sale => 
      sale.timestamp.startsWith(today)
    );

    const counterSales = todaySales
      .filter(sale => sale.type === 'counter')
      .reduce((sum, sale) => sum + sale.amount, 0);

    const supplySales = todaySales
      .filter(sale => sale.type === 'supply')
      .reduce((sum, sale) => sum + sale.amount, 0);

    const productSummary = products.map(product => {
      const productSales = todaySales.filter(sale => sale.productId === product.id);
      const quantity = productSales.reduce((sum, sale) => sum + sale.quantity, 0);
      const amount = productSales.reduce((sum, sale) => sum + sale.amount, 0);
      return { name: product.name, quantity, amount };
    });

    const summary: DailySummaryType = {
      date: today,
      totalSales: counterSales + supplySales,
      counterSales,
      supplySales,
      products: productSummary
    };

    await saveDailySummary(summary);
    setSummary(summary);
    
    toast({
      title: "Summary Generated",
      description: "Daily summary has been generated successfully.",
    });
  };

  const handleExport = () => {
    if (summary) {
      exportToExcel(summary);
      toast({
        title: "Export Complete",
        description: "The summary has been exported to Excel.",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Daily Summary</h2>
        <div className="space-x-2">
          <Button onClick={generateSummary}>Generate Summary</Button>
          {summary && <Button onClick={handleExport}>Export to Excel</Button>}
        </div>
      </div>

      {summary && (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Total Sales</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">₹{summary.totalSales}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Counter Sales</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">₹{summary.counterSales}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Supply Sales</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">₹{summary.supplySales}</p>
              </CardContent>
            </Card>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Quantity Sold</TableHead>
                <TableHead>Amount (₹)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {summary.products.map((product) => (
                <TableRow key={product.name}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.quantity}</TableCell>
                  <TableCell>₹{product.amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}