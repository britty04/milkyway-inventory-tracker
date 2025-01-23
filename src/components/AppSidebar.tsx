import { Package, DollarSign, BarChart3, LogOut, Settings, FileText, Menu } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

export function AppSidebar() {
  const { role, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();

  const adminMenuItems = [
    { title: "Inventory", icon: Package, path: "/inventory" },
    { title: "Sales", icon: DollarSign, path: "/sales" },
    { title: "Monthly Reports", icon: FileText, path: "/reports" },
    { title: "Settings", icon: Settings, path: "/settings" },
  ];

  const employeeMenuItems = [
    { title: "Sales", icon: DollarSign, path: "/sales" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const menuItems = role === 'admin' ? adminMenuItems : employeeMenuItems;

  return (
    <Sidebar>
      {isMobile && (
        <div className="fixed top-4 left-4 z-50">
          <SidebarTrigger asChild>
            <button className="p-2 rounded-lg bg-background border shadow-sm hover:bg-accent">
              <Menu className="w-6 h-6" />
            </button>
          </SidebarTrigger>
        </div>
      )}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-2 py-4 text-xl font-bold text-center border-b">
            NAYRA MILK AGENCIES
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    onClick={() => handleNavigation(item.path)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                      location.pathname === item.path 
                        ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                        : "hover:bg-sidebar-accent/50"
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-destructive hover:bg-destructive/10"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}