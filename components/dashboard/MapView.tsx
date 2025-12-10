"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { MapPin, Navigation } from "lucide-react";
import { useLiveReports } from "@/contexts/LiveReportsContext";


interface MapDataPoint {
  id: number;
  latitude: number;
  longitude: number;
  report_type: string;
  location: string;
  status: string;
}


interface MapViewProps {
  data: MapDataPoint[];
  loading?: boolean;
}

export function MapView({ loading }: MapViewProps) {
  // Mock map implementation - in a real app you'd use Google Maps, Mapbox, etc.
  const { reports } = useLiveReports();

  return (
    <Card className="h-96">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Report Locations
          </CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Navigation className="h-4 w-4" />
            South Sudan
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-64 w-full rounded-md" />
        ) : (
          <div className="relative h-64 bg-muted/30 rounded-md overflow-hidden">
            {/* Mock Map Background */}
            <div
              className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5"
              style={{
                backgroundImage: `
                  radial-gradient(circle at 20% 80%, hsl(var(--primary)) 0%, transparent 50%),
                  radial-gradient(circle at 80% 20%, hsl(var(--accent)) 0%, transparent 50%),
                  radial-gradient(circle at 40% 40%, hsl(var(--secondary)) 0%, transparent 50%)
                `
              }}
            />

            {/* Live Location Markers */}
            <div className="absolute inset-0 p-4">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                  style={{
                    left: `${50 + (report.longitude - 31.5) * 10}%`,
                    top: `${50 - (report.latitude - 4.8) * 10}%`,
                  }}
                >
                  <div className="relative">
                    <div className="w-4 h-4 bg-destructive rounded-full border-2 border-white shadow-lg animate-pulse" />
                    <Badge
                      variant="secondary"
                      className="absolute -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                    >
                      {report.location} — {report?.report_type}
                    </Badge>
                  </div>
                </div>
              ))}

            </div>

            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-sm rounded-md p-3 shadow-sm">
              <div className="text-xs font-medium mb-2">Report Status</div>
              <div className="flex flex-col gap-1 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-destructive rounded-full" />
                  <span>Pending/Critical</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-accent rounded-full" />
                  <span>In Progress</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-secondary rounded-full" />
                  <span>Resolved</span>
                </div>
              </div>
            </div>

            {/* Center overlay message */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Interactive Map</p>
                <p className="text-xs">Click markers for details</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}