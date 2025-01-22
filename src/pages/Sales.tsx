import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { SalesRecorder } from "@/components/SalesRecorder";

const Sales = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 p-6">
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Sales Management</h1>
            <SalesRecorder />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Sales;