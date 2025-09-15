import { HelpCircle, MessageCircle, Phone, Mail, Users, BarChart3, MapPin, Building, Home } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: BarChart3,
  },
  {
    title: "Analytics",
    url: "/dashboard/analytics",
    icon: BarChart3,
  },
  {
    title: "Map View",
    url: "/dashboard/map",
    icon: MapPin,
  },
  {
    title: "Edit Profile",
    url: "/dashboard/profile",
    icon: Users,
  },
  {
    title: "Account Settings",
    url: "/dashboard/settings",
    icon: Building,
  },
  {
    title: "Support",
    url: "/dashboard/support",
    icon: HelpCircle,
  },
  {
    title: "Upgrade Plan",
    url: "/dashboard/upgrade",
    icon: Building,
  },
];

export function DashboardSidebar() {
  const location = useLocation();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return location.pathname === "/dashboard";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <Sidebar className="border-r border-border">
      <SidebarContent className="bg-sidebar">
        {/* Logo Section */}
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Home className="w-5 h-5 text-primary-foreground" />
            </div>
            {!isCollapsed && (
              <h1 className="text-xl font-bold text-sidebar-foreground">
                mReport
              </h1>
            )}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/60 font-medium">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={`transition-smooth ${
                      isActive(item.url)
                        ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                        : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                    }`}
                  >
                    <NavLink to={item.url} className="flex items-center gap-3">
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Back to Main Site */}
        <div className="mt-auto p-6 border-t border-sidebar-border">
          <SidebarMenuButton asChild className="w-full">
            <NavLink 
              to="/" 
              className="flex items-center gap-3 text-sidebar-foreground hover:bg-sidebar-accent/50"
            >
              <Home className="w-5 h-5" />
              {!isCollapsed && <span>Back to Site</span>}
            </NavLink>
          </SidebarMenuButton>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}