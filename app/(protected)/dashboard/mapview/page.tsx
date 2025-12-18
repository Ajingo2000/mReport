"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardNavbar } from "@/components/dashboard/DashboardNavbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { SidebarProvider } from "@/components/ui/sidebar";
import {
  MapPin,
  Navigation,
  LocateFixed,
  Download,
  Search,
  AlertCircle,
} from "lucide-react";
import useSWR from "swr";
import { useAuth } from "@/contexts/AuthContext";
import MapGL, {
  Source,
  Layer,
  Popup,
  NavigationControl,
  GeolocateControl,
  ScaleControl,
  FullscreenControl,
} from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { CSVLink } from "react-csv";
import ReportFilter from "@/components/ReportFilter";
import ReportNotifications from "@/components/ReportNotifications";

// Type definition matching your backend serializer
interface Report {
  id: number;
  report_id: string;
  report_type: "gbv" | "srhr";
  gbv_type?: string;
  srhr_type?: string;
  description: string;
  location: string;
  latitude: string | null;
  longitude: string | null;
  status: "Pending" | "Responding" | "Resolved";
  created_at: string;
  updated_at: string;
  phone_number?: string | null;
  anonymous: boolean;
  organization_id: string;
  organization_name: string | null;
  assigned_to_id?: string | null;
  assigned_to_email?: string | null;
}

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!;

const fetcher = (url: string) =>
  fetch(url, { credentials: "include" }).then((res) => {
    if (!res.ok) throw new Error("Failed to fetch reports");
    return res.json();
  });

export default function MapView() {
  const { user, loading: authLoading } = useAuth();
  const mapRef = useRef<any>(null);

  const [viewport, setViewport] = useState({
    latitude: 6.877,
    longitude: 31.307,
    zoom: 5.5,
  });

  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [heatmapEnabled, setHeatmapEnabled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string[]>([]); // "gbv" | "srhr"
  const [statusFilter, setStatusFilter] = useState<string[]>([]);

  // ==================== SWR DATA FETCHING ====================
  const {
    data: fetchedReports,
    error,
    isLoading,
  } = useSWR<Report[]>("/api/reports/list/", fetcher, {
    refreshInterval: 30000, // Fallback polling every 30s
    revalidateOnFocus: false,
  });

  useEffect(() => {
    if (fetchedReports) {
      setReports(fetchedReports);
    }
  }, [fetchedReports]);

  // ==================== LIVE WEBSOCKET UPDATES ====================
  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    const ws = new WebSocket(`${protocol}://${window.location.host}/ws/reports/`);

    ws.onopen = () => console.log("WebSocket connected – live sensitive reports");
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "report.created" || data.type === "report.updated") {
        const newReport: Report = data.report;

        // Only process GBV or SRHR reports
        if (newReport.report_type === "gbv" || newReport.report_type === "srhr") {
          setReports((prev) => {
            const existingIndex = prev.findIndex((r) => r.report_id === newReport.report_id);
            if (existingIndex !== -1) {
              // Update existing
              const updated = [...prev];
              updated[existingIndex] = newReport;
              return updated;
            }
            // Add new
            return [...prev, newReport];
          });
        }
      }
    };

    ws.onerror = (err) => console.error("WebSocket error:", err);
    ws.onclose = () => console.log("WebSocket closed");

    return () => ws.close();
  }, []);

  // ==================== FILTERING ====================
  const filteredReports = useMemo(() => {
    let result = reports;

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (r) =>
          r.description.toLowerCase().includes(q) ||
          r.location.toLowerCase().includes(q) ||
          r.report_id.toLowerCase().includes(q) ||
          (r.phone_number && r.phone_number.includes(q))
      );
    }

    // Type filter (gbv / srhr)
    if (typeFilter.length > 0) {
      result = result.filter((r) => typeFilter.includes(r.report_type));
    }

    // Status filter
    if (statusFilter.length > 0) {
      result = result.filter((r) => statusFilter.includes(r.status));
    }

    return result;
  }, [reports, searchQuery, typeFilter, statusFilter]);

  // Mapped vs Unmapped
  const mappedReports = useMemo(
    () =>
      filteredReports.filter(
        (r) =>
          r.latitude &&
          r.longitude &&
          !isNaN(parseFloat(r.latitude)) &&
          !isNaN(parseFloat(r.longitude))
      ),
    [filteredReports]
  );

  const unmappedReports = useMemo(
    () =>
      filteredReports.filter(
        (r) =>
          !r.latitude ||
          !r.longitude ||
          isNaN(parseFloat(r.latitude)) ||
          isNaN(parseFloat(r.longitude))
      ),
    [filteredReports]
  );

  // GeoJSON for Map
  const geoJson = useMemo(
    () => ({
      type: "FeatureCollection" as const,
      features: mappedReports.map((r) => ({
        type: "Feature" as const,
        geometry: {
          type: "Point" as const,
          coordinates: [parseFloat(r.longitude!), parseFloat(r.latitude!)],
        },
        properties: { ...r },
      })),
    }),
    [mappedReports]
  );

  // ==================== MAP LAYERS ====================
  const clusterLayer = {
    id: "clusters",
    type: "circle" as const,
    source: "reports",
    filter: ["has", "point_count"],
    paint: {
      "circle-color": ["step", ["get", "point_count"], "#c084fc", 10, "#a78bfa", 30, "#7c3aed"],
      "circle-radius": ["step", ["get", "point_count"], 22, 10, 32, 30, 42],
      "circle-opacity": 0.8,
    },
  };

  const clusterCountLayer = {
    id: "cluster-count",
    type: "symbol" as const,
    source: "reports",
    filter: ["has", "point_count"],
    layout: {
      "text-field": "{point_count_abbreviated}",
      "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
      "text-size": 14,
    },
    paint: { "text-color": "#ffffff" },
  };

  const unclusteredLayer = {
    id: "unclustered",
    type: "circle" as const,
    source: "reports",
    filter: ["!", ["has", "point_count"]],
    paint: {
      "circle-color": [
        "match",
        ["get", "report_type"],
        "gbv",
        "#a855f7", // Purple for GBV
        "srhr",
        "#ec4899", // Pink for SRHR
        "#6b7280",
      ],
      "circle-radius": ["case", ["boolean", ["feature-state", "hover"], false], 16, 12],
      "circle-stroke-width": 3,
      "circle-stroke-color": "#ffffff",
    },
  };

  const heatmapLayer = {
    id: "heatmap",
    type: "heatmap" as const,
    source: "reports",
    paint: {
      "heatmap-weight": [
        "case",
        ["==", ["get", "status"], "Pending"],
        2.0,
        ["==", ["get", "status"], "Responding"],
        1.2,
        0.6,
      ],
      "heatmap-intensity": ["interpolate", ["linear"], ["zoom"], 0, 1, 9, 3],
      "heatmap-color": [
        "interpolate",
        ["linear"],
        ["heatmap-density"],
        0,
        "rgba(128, 0, 128, 0)",
        0.2,
        "#e879f9",
        0.4,
        "#c084fc",
        0.6,
        "#a78bfa",
        0.8,
        "#9333ea",
        1,
        "#7c3aed",
      ],
      "heatmap-radius": ["interpolate", ["linear"], ["zoom"], 0, 8, 9, 30],
      "heatmap-opacity": 0.85,
    },
  };

  // ==================== INTERACTIONS ====================
  const handleMapClick = useCallback(
    (event: any) => {
      const features = mapRef.current?.queryRenderedFeatures(event.point, {
        layers: ["unclustered", "clusters"],
      });

      if (!features || features.length === 0) {
        setSelectedReport(null);
        return;
      }

      const feature = features[0];
      if (feature.properties?.report_id) {
        const report = mappedReports.find((r) => r.report_id === feature.properties.report_id);
        if (report) {
          setSelectedReport(report);
          mapRef.current?.flyTo({
            center: [parseFloat(report.longitude!), parseFloat(report.latitude!)],
            zoom: 14,
            duration: 1200,
          });
        }
      }
    },
    [mappedReports]
  );

  const locateUser = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported in your browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        mapRef.current?.flyTo({
          center: [longitude, latitude],
          zoom: 12,
          duration: 2000,
        });
      },
      (err) => alert("Unable to retrieve your location.")
    );
  };

  // CSV Export
  const csvData = filteredReports.map((r) => ({
    "Report ID": r.report_id,
    Type: r.report_type.toUpperCase(),
    Subtype: r.gbv_type || r.srhr_type || "General",
    Status: r.status,
    Location: r.location,
    Description: r.description,
    Anonymous: r.anonymous ? "Yes" : "No",
    Phone: r.phone_number || "N/A",
    Organization: r.organization_name || "N/A",
    "Created At": new Date(r.created_at).toLocaleString(),
  }));

  // ==================== RENDER ====================
  if (authLoading || isLoading) {
    return (
      <div className="flex h-screen items-center justify-center text-lg font-medium">
        Loading sensitive reports map...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center text-red-600">
        Failed to load reports: {error.message}
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-background">
        <DashboardSidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <DashboardNavbar />
          <main className="flex-1 overflow-hidden p-4">
            <div className="grid h-full grid-cols-1 gap-4 lg:grid-cols-4">
              {/* Left Panel */}
              <Card className="lg:col-span-1 flex flex-col overflow-hidden">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-700">
                    <AlertCircle className="h-6 w-6" />
                    Sensitive Reports Map (GBV & SRHR)
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto space-y-5 pb-24">
                  {/* Search */}
                  <div className="space-y-2">
                    <Label htmlFor="search">Search</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="search"
                        placeholder="Description, location, ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Filters */}
                  <ReportFilter
                    onFilterChange={(filters: any) => {
                      if (filters.typeFilter !== undefined) setTypeFilter(filters.typeFilter);
                      if (filters.statusFilter !== undefined) setStatusFilter(filters.statusFilter);
                    }}
                  />

                  {/* Heatmap Toggle */}
                  <div className="flex items-center justify-between">
                    <Label htmlFor="heatmap">Show Density Heatmap</Label>
                    <Switch
                      id="heatmap"
                      checked={heatmapEnabled}
                      onCheckedChange={setHeatmapEnabled}
                    />
                  </div>

                  {/* Stats & Actions */}
                  <div className="space-y-3 rounded-lg border bg-muted/40 p-4">
                    <div className="text-sm">
                      <span className="font-medium">Total Reports:</span> {filteredReports.length}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Mapped:</span> {mappedReports.length} |{" "}
                      <span className="font-medium">Unmapped:</span> {unmappedReports.length}
                    </div>

                    <CSVLink data={csvData} filename="sensitive-reports-gbv-srhr.csv">
                      <Button variant="outline" size="sm" className="w-full mt-3">
                        <Download className="h-4 w-4 mr-2" />
                        Export CSV
                      </Button>
                    </CSVLink>

                    <Button variant="outline" size="sm" className="w-full" onClick={locateUser}>
                      <LocateFixed className="h-4 w-4 mr-2" />
                      My Location
                    </Button>
                  </div>

                  <ReportNotifications />

                  {/* Unmapped Reports List */}
                  {unmappedReports.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-sm mb-3">Unmapped Reports</h3>
                      <div className="space-y-3 max-h-72 overflow-y-auto">
                        {unmappedReports.map((r) => (
                          <div
                            key={r.report_id}
                            className="p-3 rounded-lg border bg-background cursor-pointer hover:shadow-md transition-shadow"
                            onClick={() => setSelectedReport(r)}
                          >
                            <div className="flex justify-between items-start">
                              <div className="font-medium text-sm">{r.location}</div>
                              <Badge
                                variant={r.status === "Pending" ? "destructive" : "secondary"}
                              >
                                {r.status}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              {r.report_type.toUpperCase()} – {r.gbv_type || r.srhr_type || "General"}
                            </p>
                            <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                              {r.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Map */}
              <Card className="lg:col-span-3 overflow-hidden flex flex-col">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Navigation className="h-5 w-5" />
                    Live Sensitive Reports – South Sudan
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 p-0 relative">
                  <MapGL
                    ref={mapRef}
                    mapboxAccessToken={MAPBOX_TOKEN}
                    initialViewState={viewport}
                    onMove={(evt) => setViewport(evt.viewState)}
                    mapStyle="mapbox://styles/mapbox/dark-v11"
                    onClick={handleMapClick}
                    interactiveLayerIds={["clusters", "unclustered"]}
                    cursor={hoveredId ? "pointer" : "grab"}
                  >
                    <NavigationControl position="top-left" />
                    <GeolocateControl position="top-left" />
                    <ScaleControl />
                    <FullscreenControl />

                    <Source
                      id="reports"
                      type="geojson"
                      data={geoJson}
                      cluster
                      clusterMaxZoom={14}
                      clusterRadius={50}
                    >
                      {heatmapEnabled && <Layer {...(heatmapLayer as any)} />}
                      <Layer {...(clusterLayer as any)} />
                      <Layer {...(clusterCountLayer as any)} />
                      <Layer
                        {...(unclusteredLayer as any)}
                        beforeId="cluster-count"
                        onMouseEnter={(e: any) =>
                          e.features[0]?.properties?.report_id &&
                          setHoveredId(e.features[0].properties.report_id)
                        }
                        onMouseLeave={() => setHoveredId(null)}
                      />
                    </Source>

                    {/* Selected Report Popup */}
                    {selectedReport && selectedReport.latitude && selectedReport.longitude && (
                      <Popup
                        longitude={parseFloat(selectedReport.longitude)}
                        latitude={parseFloat(selectedReport.latitude)}
                        onClose={() => setSelectedReport(null)}
                        closeButton
                        anchor="bottom"
                        offset={25}
                        maxWidth="320px"
                      >
                        <div className="p-4 space-y-3 text-sm">
                          <div className="font-bold text-lg">#{selectedReport.report_id}</div>

                          <div className="font-semibold capitalize flex items-center gap-2">
                            {selectedReport.report_type === "gbv" ? (
                              <span className="text-purple-600">GBV Report</span>
                            ) : (
                              <span className="text-pink-600">SRHR Report</span>
                            )}
                          </div>

                          <div className="text-muted-foreground">
                            <strong>Subtype:</strong>{" "}
                            {selectedReport.gbv_type || selectedReport.srhr_type || "General"}
                          </div>

                          <p className="text-sm leading-relaxed">{selectedReport.description}</p>

                          <div className="flex flex-wrap gap-2">
                            <Badge
                              variant={
                                selectedReport.status === "Pending"
                                  ? "destructive"
                                  : selectedReport.status === "Responding"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {selectedReport.status}
                            </Badge>
                            {selectedReport.anonymous && (
                              <Badge variant="outline">Anonymous</Badge>
                            )}
                          </div>

                          <div className="text-xs text-muted-foreground space-y-1">
                            <div>
                              <strong>Location:</strong> {selectedReport.location}
                            </div>
                            <div>
                              <strong>Reported:</strong>{" "}
                              {new Date(selectedReport.created_at).toLocaleString()}
                            </div>
                            {selectedReport.organization_name && (
                              <div>
                                <strong>Organization:</strong> {selectedReport.organization_name}
                              </div>
                            )}
                          </div>
                        </div>
                      </Popup>
                    )}
                  </MapGL>

                  {/* Map Legend / Stats Overlay */}
                  <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm rounded-lg p-4 shadow-lg pointer-events-none">
                    <div className="flex items-center gap-3 text-sm font-medium">
                      <MapPin className="h-5 w-5 text-purple-600" />
                      <span>
                        {mappedReports.length} sensitive reports displayed on map
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}