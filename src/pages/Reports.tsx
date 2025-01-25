import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { getDailySummaries, getSales, getProducts } from "@/utils/storage";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CalendarDays, TrendingUp, DollarSign, ShoppingBag } from "lucide-react";

const Reports = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const summaries = getDailySummaries();
  const sales = getSales();

  const getMonthlyTotal = () => {
    if (!selectedDate) return 0;
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
    return sales.filter(sale => 
      sale.timestamp.startsWith(format(date, 'yyyy-MM-dd'))
    );
  };

  const getTotalTransactions = () => {
    if (!selectedDate) return 0;
    const dailySales = getDailySales(selectedDate);
    return dailySales.length;
  };

  const getAverageTransactionValue = () => {
    if (!selectedDate) return 0;
    const dailySales = getDailySales(selectedDate);
    if (dailySales.length === 0) return 0;
    const total = dailySales.reduce((sum, sale) => sum + sale.amount, 0);
    return total / dailySales.length;
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <main className="flex-1 p-6 space-y-6 overflow-y-auto">
          <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold tracking-tight">Sales Reports</h1>
            <p className="text-muted-foreground">
              View and analyze your sales data
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Monthly Total</CardTitle>
                <TrendingUp className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{getMonthlyTotal()}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {selectedDate && format(selectedDate, 'MMMM yyyy')}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Daily Transactions</CardTitle>
                <ShoppingBag className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{getTotalTransactions()}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {selectedDate && format(selectedDate, 'dd MMM yyyy')}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Average Transaction</CardTitle>
                <DollarSign className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{getAverageTransactionValue().toFixed(2)}</div>
                <p className="text-xs text-muted-foreground mt-1">Per transaction today</p>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Select Date</CardTitle>
                <CalendarDays className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>
          </div>

          {selectedDate && (
            <Card className="bg-white shadow-sm mt-6">
              <CardHeader>
                <CardTitle className="text-xl">
                  Sales for {format(selectedDate, 'dd MMMM yyyy')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="font-semibold">Time</TableHead>
                        <TableHead className="font-semibold">Product</TableHead>
                        <TableHead className="font-semibold">Quantity</TableHead>
                        <TableHead className="font-semibold">Amount</TableHead>
                        <TableHead className="font-semibold">Type</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getDailySales(selectedDate).map((sale) => {
                        const products = getProducts();
                        const product = products.find(p => p.id === sale.productId);
                        return (
                          <TableRow key={sale.id} className="hover:bg-muted/50">
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