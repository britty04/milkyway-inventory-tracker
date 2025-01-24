import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Trash2, Save, RotateCcw } from "lucide-react";
import { backupData, restoreFromBackup } from "@/utils/storage";

const Settings = () => {
  const { toast } = useToast();

  const clearAllData = () => {
    if (confirm("Are you sure you want to clear all data? This action cannot be undone.")) {
      localStorage.clear();
      toast({
        title: "Data Cleared",
        description: "All application data has been cleared successfully.",
      });
    }
  };

  const handleBackup = async () => {
    const backup = await backupData();
    toast({
      title: "Backup Created",
      description: `Backup created successfully at ${new Date().toLocaleString()}`,
    });
  };

  const handleRestore = async () => {
    if (confirm("Are you sure you want to restore from the last backup? Current data will be overwritten.")) {
      const success = await restoreFromBackup();
      if (success) {
        toast({
          title: "Restore Successful",
          description: "Data has been restored from the last backup.",
        });
      } else {
        toast({
          title: "Restore Failed",
          description: "No backup data found.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 p-6">
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Settings</h1>
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Data Management</CardTitle>
                  <CardDescription>
                    Manage your application data and backups
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    variant="outline" 
                    onClick={handleBackup}
                    className="w-full"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Create Backup
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleRestore}
                    className="w-full"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Restore from Backup
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={clearAllData}
                    className="w-full"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear All Data
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Settings;