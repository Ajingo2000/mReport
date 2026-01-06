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

  const customClassName = `text-xs p-1 rounded-sm  ${
    user?.role === 'admin' || user?.org_role === 'admin'
      ? 'bg-red-600 text-white'
      : user?.role === 'responder' || user?.org_role === 'responder'
      ? 'bg-blue-600 text-white'
      : 'bg-gray-200 text-gray-800'
  }`;

  const isActive = (path: string) => {
    if (path === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(path);
  };

  return (
    <Sidebar className="border-r border-border">
      <SidebarContent className="bg-sidebar">
        {/* Logo Section */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex">
            <p className="text-xl font-bold">mReport</p>
          </div>

          <div className="mt-1 py-0.5 text-sm">
            <div className="flex items-center gap-2"
              
              title={user?.role ?? user?.org_role ?? 'Member'}
            >
              {/* Role label */}
              {(user?.role === 'admin' || user?.org_role === 'admin') ? ( <>  <span>{user?.first_name || 'Member'}</span> ~ <span className={customClassName}> Administrator</span> </>)
                : (user?.role === 'responder' || user?.org_role === 'responder') ?  ( <>
                 <span>{user?.first_name || 'Member'}</span> ~ <span className={customClassName}>Responder </span>
                </> )
                  : (<span>Member</span>)}
            </div>
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
                    className={`transition-smooth ${isActive(item.url)
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