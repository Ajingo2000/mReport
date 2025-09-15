import { useState, useEffect } from "react";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardNavbar } from "@/components/dashboard/DashboardNavbar";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { ReportsTable } from "@/components/dashboard/ReportsTable";
import { MapView } from "@/components/dashboard/MapView";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { useDashboardStats, useReports, useMapData } from "@/hooks/useDashboardApi";
import { SidebarProvider } from "@/components/ui/sidebar";
import { BarChart3, Clock, CheckCircle, Users } from "lucide-react";

const Dashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showActivityFeed, setShowActivityFeed] = useState(true);
  
  const { data: stats, loading: statsLoading, error: statsError } = useDashboardStats();
  const { data: reports, loading: reportsLoading, error: reportsError } = useReports();
  const { data: mapData, loading: mapLoading } = useMapData();

  useEffect(() => {
    document.title = "Dashboard - mReport | Citizen Reporting Platform";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'mReport dashboard - Monitor citizen reports, track infrastructure issues, and manage emergency responses in South Sudan.');
    }
  }, []);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <DashboardSidebar />
        
        <div className="flex-1 flex flex-col">
          <DashboardNavbar 
            onToggleActivityFeed={() => setShowActivityFeed(!showActivityFeed)}
            showActivityFeed={showActivityFeed}
          />
          
          <main className="flex-1 p-6 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard
                title="Total Reports"
                value={stats?.total_reports || 0}
                icon={BarChart3}
                loading={statsLoading}
                className="bg-card-gradient border-primary/10"
              />
              <StatsCard
                title="Pending"
                value={stats?.pending || 0}
                icon={Clock}
                loading={statsLoading}
                className="bg-card-gradient border-accent/10"
              />
              <StatsCard
                title="Resolved"
                value={stats?.resolved || 0}
                icon={CheckCircle}
                loading={statsLoading}
                className="bg-card-gradient border-secondary/10"
              />
              <StatsCard
                title="Responders Online"
                value={stats?.responders_online || 0}
                icon={Users}
                loading={statsLoading}
                className="bg-card-gradient border-muted/20"
              />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Reports Table & Map */}
              <div className="xl:col-span-2 space-y-6">
                <ReportsTable 
                  reports={reports || []} 
                  loading={reportsLoading} 
                  error={reportsError}
                />
                <MapView 
                  data={mapData || []} 
                  loading={mapLoading}
                />
              </div>
              
              {/* Activity Feed */}
              {showActivityFeed && (
                <div className="xl:col-span-1">
                  <ActivityFeed />
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;