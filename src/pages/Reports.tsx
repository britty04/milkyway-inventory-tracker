import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DailySummary } from "@/components/DailySummary";

const Reports = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 p-6">
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Monthly Reports</h1>
            <DailySummary />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Reports;