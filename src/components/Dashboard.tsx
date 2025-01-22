import { useState } from "react";
import { Button } from "@/components/ui/button";
import { StockManager } from "./StockManager";
import { SalesRecorder } from "./SalesRecorder";
import { DailySummary } from "./DailySummary";

export function Dashboard() {
  const [activeView, setActiveView] = useState<'stock' | 'sales' | 'summary'>('stock');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">AROKYA MILK Dealer</h1>
        <div className="flex items-center space-x-4">
          <Button
            variant={activeView === 'stock' ? 'default' : 'outline'}
            onClick={() => setActiveView('stock')}
          >
            Stock Management
          </Button>
          <Button
            variant={activeView === 'sales' ? 'default' : 'outline'}
            onClick={() => setActiveView('sales')}
          >
            Record Sales
          </Button>
          <Button
            variant={activeView === 'summary' ? 'default' : 'outline'}
            onClick={() => setActiveView('summary')}
          >
            Daily Summary
          </Button>
        </div>
      </div>

      {activeView === 'stock' && <StockManager />}
      {activeView === 'sales' && <SalesRecorder />}
      {activeView === 'summary' && <DailySummary />}
    </div>
  );
}