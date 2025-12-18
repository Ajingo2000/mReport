'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HelpCircle,
  Settings,
  Users,
  BarChart3,
  MapPin,
  LucideWorkflow,
  LayoutDashboard,
  ClipboardList,
  UploadIcon,
  UserPlus, // ← New icon for inviting
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
  useSidebar,
} from "@/components/ui/sidebar";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext"; // Adjust path if needed
import { useState } from "react";
import { InviteMemberModal } from "@/components/organization/InviteMemberModal"; // Adjust path

const menuItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Reports Lists", url: "/dashboard/reports-lists", icon: ClipboardList },
  { title: "Analytics", url: "/dashboard/analytics", icon: BarChart3 },
  { title: "Map View", url: "/dashboard/mapview", icon: MapPin },
  { title: "Integrations", url: "/dashboard/integrations", icon: LucideWorkflow },
  // { title: "Edit Profile", url: "/dashboard/edit-profile", icon: Users },
  // { title: "Account Settings", url: "/dashboard/account-settings", icon: Settings },
  { title: "Support", url: "/dashboard/support", icon: HelpCircle },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const { state } = useSidebar();
  const { user } = useAuth(); // Get current user to check role
  const [inviteOpen, setInviteOpen] = useState(false);

  const isCollapsed = state === "collapsed";
  const isAdmin = user?.role === "admin"; // Adjust based on your User type
  
  console.log("User role:", user?.org_role);

  const isActive = (path: string) => {
    if (path === "/dashboard") return pathname === "/dashboard";
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

        {/* Main Navigation */}
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

        {/* Admin Actions — Only shown to admins */}
        {isAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-sidebar-foreground/60 font-medium">
              Admin Actions
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => setInviteOpen(true)}
                    className="text-sidebar-foreground hover:bg-sidebar-accent/50 cursor-pointer"
                  >
                    <UserPlus className="w-5 h-5 flex-shrink-0" />
                    {!isCollapsed && <span>Invite Team Member</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Bottom: Upgrade Account */}
        <div className="mt-auto p-6 border-t border-sidebar-border">
          <SidebarMenuButton asChild className="w-full">
            <Link
              href="/dashboard/upgrade-plan"
              className="flex items-center gap-3 text-sidebar-foreground hover:bg-sidebar-accent/50"
            >
              <UploadIcon className="w-5 h-5" />
              {!isCollapsed && <span>Upgrade Account</span>}
            </Link>
          </SidebarMenuButton>
        </div>
      </SidebarContent>

      {/* Invite Modal — rendered here so it's always available when sidebar is mounted */}
      <InviteMemberModal
        open={inviteOpen}
        onOpenChange={setInviteOpen}
        onSuccess={() => {
          // Optional: show toast, refetch team members, etc.
        }}
      />
    </Sidebar>
  );
}