'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HelpCircle,
  MessageCircle,
  Phone,
  Mail,
  Users,
  BarChart3,
  MapPin,
  Building,
  Home,
  Settings,
  LayoutDashboard,
  UploadIcon
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from "@/components/ui/sidebar";
import Image from "next/image";

const menuItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Analytics", url: "/dashboard/analytics", icon: BarChart3 },
  { title: "Map View", url: "/dashboard/mapview", icon: MapPin },
  { title: "Edit Profile", url: "/dashboard/edit-profile", icon: Users },
  { title: "Account Settings", url: "/dashboard/account-settings", icon: Building },
  { title: "Support", url: "/dashboard/support", icon: HelpCircle },
  { title: "Upgrade Plan", url: "/dashboard/upgrade-plan", icon: UploadIcon },
  { title: "Integrations", url: "/dashboard/integrations", icon: Mail },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(path);
  };

  return (
    <Sidebar className="border-r border-border">
      <SidebarContent className="bg-sidebar">
        {/* Logo Section */}
        <div className="p-2 border-b border-sidebar-border">
          <div className="flex items-center justify-center">
            
            {!isCollapsed && (
              <Image
                src="/images/favicon.png"
                alt="mReport Logo"
                width={98}
                height={98}
                priority
                className="w-20 h-10 lg:w-32 lg:h-20"
              />
            )}
          </div>
        </div>

        {/* Navigation */}
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
                    <Link href={item.url} className="flex items-center gap-3">
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Back to Main Site */}
        <div className="mt-auto p-6 border-t border-sidebar-border">
          <SidebarMenuButton asChild className="w-full">
            <Link
              href="/"
              className="flex items-center gap-3 text-sidebar-foreground hover:bg-sidebar-accent/50"
            >
              <Settings className="w-5 h-5" />
              {!isCollapsed && <span>Back to Site</span>}
            </Link>
          </SidebarMenuButton>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
