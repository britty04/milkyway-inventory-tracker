import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, DollarSign, ArrowUp, ArrowDown, Bell } from "lucide-react";

export function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex items-center space-x-4">
          <Bell className="w-6 h-6 text-yellow-500" />
          <span className="text-sm text-muted-foreground">
            Last updated: Today 6:00 AM
          </span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹45,231.89</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Counter Sales</CardTitle>
            <ArrowUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹23,456.00</div>
            <p className="text-xs text-muted-foreground">
              82 transactions today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Supply Sales</CardTitle>
            <ArrowDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹21,775.89</div>
            <p className="text-xs text-muted-foreground">
              12 bulk deliveries
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <Package className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-destructive">
              Requires immediate attention
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Today's Inventory</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Full Cream Milk", stock: 250, price: "₹68/L" },
                { name: "Toned Milk", stock: 180, price: "₹48/L" },
                { name: "Curd", stock: 45, price: "₹50/kg" },
                { name: "Buttermilk", stock: 15, price: "₹20/L" },
              ].map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Stock: {item.stock} units
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{item.price}</p>
                    <p
                      className={`text-sm ${
                        item.stock < 50 ? "text-destructive" : "text-green-600"
                      }`}
                    >
                      {item.stock < 50 ? "Low Stock" : "In Stock"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  type: "Counter",
                  amount: "₹240.00",
                  time: "10:45 AM",
                  items: "4x Toned Milk",
                },
                {
                  type: "Supply",
                  amount: "₹1,360.00",
                  time: "9:30 AM",
                  items: "20x Full Cream Milk",
                },
                {
                  type: "Counter",
                  amount: "₹100.00",
                  time: "9:15 AM",
                  items: "2x Curd",
                },
              ].map((transaction, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{transaction.type} Sale</p>
                    <p className="text-sm text-muted-foreground">
                      {transaction.items}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{transaction.amount}</p>
                    <p className="text-sm text-muted-foreground">
                      {transaction.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}