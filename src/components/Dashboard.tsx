import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { StockManager } from "./StockManager";
import { SalesRecorder } from "./SalesRecorder";
import { DailySummary } from "./DailySummary";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";

export function Dashboard() {
  const [activeView, setActiveView] = useState<'stock' | 'sales' | 'summary'>('stock');
  const { role } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">NAYRA MILK AGENCIES</h1>
          <p className="text-muted-foreground">
            {format(currentTime, 'EEEE, dd MMMM yyyy HH:mm:ss')}
          </p>
        </div>
        {role === 'admin' && (
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant={activeView === 'stock' ? 'default' : 'outline'}
              onClick={() => setActiveView('stock')}
              className="w-full md:w-auto"
            >
              Stock Management
            </Button>
            <Button
              variant={activeView === 'sales' ? 'default' : 'outline'}
              onClick={() => setActiveView('sales')}
              className="w-full md:w-auto"
            >
              Record Sales
            </Button>
            <Button
              variant={activeView === 'summary' ? 'default' : 'outline'}
              onClick={() => setActiveView('summary')}
              className="w-full md:w-auto"
            >
              Daily Summary
            </Button>
          </div>
        )}
      </div>

      <Card className="w-full">
        <CardContent className="p-6">
          {role === 'admin' ? (
            <>
              {activeView === 'stock' && <StockManager />}
              {activeView === 'sales' && <SalesRecorder />}
              {activeView === 'summary' && <DailySummary />}
            </>
          ) : (
            <SalesRecorder />
          )}
        </CardContent>
      </Card>
    </div>
  );
}