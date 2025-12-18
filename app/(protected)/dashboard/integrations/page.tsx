"use client";
import React from 'react';
import { useState } from 'react';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { DashboardNavbar } from '@/components/dashboard/DashboardNavbar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';

const IntegrationsPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    if (isLoading) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          <DashboardSidebar />
          <div className="flex-1 flex flex-col">
            <DashboardNavbar onToggleActivityFeed={() => {}} showActivityFeed={false} />
            <main className="flex-1 p-6 space-y-6">
              <Skeleton className="h-9 w-64" />
              <div className="space-y-6">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="border p-6 rounded-lg space-y-4">
                    <Skeleton className="h-7 w-48" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-10 w-32" />
                  </div>
                ))}
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    );
  }
    return (
        <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          <DashboardSidebar />
          <div className="flex-1 flex flex-col">
            <DashboardNavbar onToggleActivityFeed={() => {}} showActivityFeed={false} />
            <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Integrations</h1>
            <p className="mb-6">
                Connect your account with USSD and other services to enhance your dashboard experience.
            </p>

            <div className="space-y-4">
                {/* USSD Integration */}
                <div className="border p-4 rounded-lg shadow-sm">
                    <h2 className="text-lg font-semibold mb-2">USSD Integration</h2>
                    <p className="mb-4 text-sm">
                        Link your USSD service to manage and monitor transactions directly from your dashboard.
                    </p>
                    <button className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                        Connect USSD
                    </button>
                </div>

                {/* Other Services */}
                <div className="border p-4 rounded-lg shadow-sm">
                    <h2 className="text-xl font-semibold mb-2">Other Services</h2>
                    <p className="mb-4">
                        Explore and integrate other services to expand the functionality of your account.
                    </p>
                    <button className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-indigo-500">
                        Explore Services
                    </button>
                </div>
            </div>
        </div>
          </div>
        </div>
      </SidebarProvider>
        
    );
};

export default IntegrationsPage;