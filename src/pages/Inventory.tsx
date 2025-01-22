import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { StockManager } from "@/components/StockManager";

const Inventory = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 p-6">
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Inventory Management</h1>
            <StockManager />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Inventory;