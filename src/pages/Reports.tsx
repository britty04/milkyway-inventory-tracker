import { useState, useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { getDailySummaries, getSales, getProducts } from "@/utils/storage";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sale, Product } from "@/types/inventory";

const Reports = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [sales, setSales] = useState<Sale[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [salesData, productsData] = await Promise.all([
          getSales(),
          getProducts()
        ]);
        setSales(salesData);
        setProducts(productsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const getMonthlyTotal = () => {
    if (!selectedDate || !sales) return 0;
    const currentMonth = selectedDate.getMonth();
    const currentYear = selectedDate.getFullYear();
    
    return sales
      .filter(sale => {
        const saleDate = new Date(sale.timestamp);
        return saleDate.getMonth() === currentMonth && 
               saleDate.getFullYear() === currentYear;
      })
      .reduce((sum, sale) => sum + sale.amount, 0);
  };

  const getDailySales = (date: Date) => {
    if (!sales) return [];
    return sales.filter(sale => 
      sale.timestamp.startsWith(format(date, 'yyyy-MM-dd'))
    );
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 p-4 md:p-6 space-y-6 overflow-x-hidden">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-full md:col-span-1">
              <CardHeader>
                <CardTitle>Monthly Total</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">₹{getMonthlyTotal()}</p>
                <p className="text-sm text-muted-foreground">
                  {selectedDate && format(selectedDate, 'MMMM yyyy')}
                </p>
              </CardContent>
            </Card>

            <Card className={`${isMobile ? 'col-span-full' : 'md:col-span-1'}`}>
              <CardHeader>
                <CardTitle>Calendar View</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border w-full"
                />
              </CardContent>
            </Card>
          </div>

          {selectedDate && (
            <Card>
              <CardHeader>
                <CardTitle>
                  Sales for {format(selectedDate, 'dd MMMM yyyy')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto -mx-4 md:mx-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Time</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Type</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getDailySales(selectedDate).map((sale) => {
                        const product = products.find(p => p.id === sale.productId);
                        return (
                          <TableRow key={sale.id}>
                            <TableCell>{format(new Date(sale.timestamp), 'HH:mm')}</TableCell>
                            <TableCell>{product?.name || 'Unknown'}</TableCell>
                            <TableCell>{sale.quantity}</TableCell>
                            <TableCell>₹{sale.amount}</TableCell>
                            <TableCell className="capitalize">{sale.type}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Reports;