import React from "react";
import { DashboardNavbar } from "@/components/dashboard/DashboardNavbar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export function DashboardPageSkeleton({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col">
          <DashboardNavbar onToggleActivityFeed={() => {}} showActivityFeed={false} />
          <main className="flex-1 p-6 space-y-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}