'use client';

import { useState, useEffect } from "react";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardNavbar } from "@/components/dashboard/DashboardNavbar";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { ReportsTable } from "@/components/dashboard/ReportsTable";
import { MapView } from "@/components/dashboard/MapView";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useDashboardStats, useReports, useMapData } from "@/hooks/useDashboardApi";

import {
  Baby,
  ShieldAlert,
  Pill,
  TestTube2,
  Activity,
  Users
} from "lucide-react";

export default function Dashboard() {
  const [showActivityFeed, setShowActivityFeed] = useState(true);

  const { data: reports, loading: reportsLoading } = useReports();
  const { data: mapData, loading: mapLoading } = useMapData();
  const { data: stats } = useDashboardStats();

  // ========================
  // FILTER SRHR REPORTS ONLY
  // ========================

  const srhrReports = reports?.filter(
    (r: any) => r.report_type === "srhr"
  ) || [];

  const maternal = srhrReports.filter(r => r.srhr_type === "maternal_health");
  const contraceptive = srhrReports.filter(r => r.srhr_type === "contraceptive");
  const hiv = srhrReports.filter(r => r.srhr_type === "hiv");
  const gbv = srhrReports.filter(r => r.srhr_type === "gbv_support");
  const other = srhrReports.filter(r => r.srhr_type === "other");

  const pending = srhrReports.filter(r => r.status === "Pending");
  const resolved = srhrReports.filter(r => r.status === "Resolved");

  // Filter map data to only SRHR + GBV
  const filteredMap = mapData?.filter(
    (point: any) => point.report_type === "srhr"
  ) || [];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <DashboardSidebar />

        <div className="flex-1 flex flex-col">
          <DashboardNavbar
            onToggleActivityFeed={() => setShowActivityFeed(!showActivityFeed)}
            showActivityFeed={showActivityFeed}
          />

          <main className="flex-1 p-6 space-y-8">

            {/* --------------------- SRHR CARDS --------------------- */}
            <section>
              <h2 className="text-2xl font-bold mb-4 text-foreground">
                SRHR Overview
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                <StatsCard
                  title="Maternal Health"
                  value={maternal.length}
                  icon={Baby}
                  className="bg-pink-50 dark:bg-pink-900/20 border-pink-300"
                />

                <StatsCard
                  title="Contraceptive Access"
                  value={contraceptive.length}
                  icon={Pill}
                  className="bg-purple-50 dark:bg-purple-900/20 border-purple-300"
                />

                <StatsCard
                  title="HIV Services"
                  value={hiv.length}
                  icon={TestTube2}
                  className="bg-red-50 dark:bg-red-900/20 border-red-300"
                />

                <StatsCard
                  title="GBV Support"
                  value={gbv.length}
                  icon={ShieldAlert}
                  className="bg-amber-50 dark:bg-amber-900/20 border-amber-300"
                />
              </div>

              {/* SECOND ROW */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">

                <StatsCard
                  title="Other SRHR Reports"
                  value={other.length}
                  icon={Activity}
                  className="bg-blue-50 dark:bg-blue-900/20 border-blue-300"
                />

                <StatsCard
                  title="Pending Cases"
                  value={pending.length}
                  icon={Activity}
                  className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-300"
                />

                <StatsCard
                  title="Resolved Cases"
                  value={resolved.length}
                  icon={Activity}
                  className="bg-green-50 dark:bg-green-900/20 border-green-300"
                />
              </div>
            </section>

            {/* --------------------- TABLE + MAP --------------------- */}
            <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2 space-y-6">
                <ReportsTable
                  reports={srhrReports}
                  loading={reportsLoading}
                  error={null}
                />

                <MapView
                  data={filteredMap}
                  loading={mapLoading}
                />
              </div>

              {showActivityFeed && (
                <div className="xl:col-span-1">
                  <ActivityFeed />
                </div>
              )}
            </section>

          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
