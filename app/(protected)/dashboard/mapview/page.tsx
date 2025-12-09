


"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardNavbar } from "@/components/dashboard/DashboardNavbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SidebarProvider } from "@/components/ui/sidebar";
import { MapPin, Filter, Navigation, Layers, CalendarRange, Download, LocateFixed, RefreshCcw, Search } from "lucide-react";
import useSWR from "swr";
import { useAuth } from "@/contexts/AuthContext";
import {
  Source,
  Layer,
  Popup,
  NavigationControl,
  GeolocateControl,
  ScaleControl,
  FullscreenControl,
} from "react-map-gl";
import MapGL from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { CSVLink } from "react-csv";

import ReportFilter from "@/components/ReportFilter"; // Updated import for ReportFilter
import ReportNotifications from "@/components/ReportNotifications"; // Import for ReportNotifications
import { FiAlertCircle } from "react-icons/fi";
import mapboxgl from "mapbox-gl";
/// <reference types="react-map-gl" />


mapboxgl.workerUrl = new URL(
  "mapbox-gl/dist/mapbox-gl-csp-worker.js",
  import.meta.url
).href;

// Utilities
const fetcher = (url: string): Promise<any> =>
  fetch(url, { credentials: "include" }).then((r) => {
    if (!r.ok) throw new Error(`Request failed ${r.status}`);
    return r.json();
  });

function classNames(...s: (string | boolean | null | undefined)[]) {
  return s.filter(Boolean).join(" ");
}


function toGeoJSON(features: any[]) {
  return {
    type: "FeatureCollection",
    features: features
      .filter((r) => {
        const lat = parseFloat(r.latitude);
        const lon = parseFloat(r.longitude);
        return Number.isFinite(lat) && Number.isFinite(lon);
      })
      .map((r) => ({
        type: "Feature",
        id: r.report_id,
        properties: {
          report_id: r.report_id,
          type: r.report_type,
          subtype: r.damage_type || r.assistance_type || r.srhr_type || "other",
          status: r.status,
          created_at: r.created_at,
          title: r.location,
          description: r.description,
          phone_number: r.phone_number,
          pulseStart: r.created_at,
        },
        geometry: { type: "Point", coordinates: [parseFloat(r.longitude), parseFloat(r.latitude)] },
      })),
  };
}


function debounce<T extends (...args: any[]) => void>(fn: T, wait = 400): T {
  let t: NodeJS.Timeout;
  return ((...args: Parameters<T>) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  }) as T;
}

function toCSVData(reports: any[]) {
  return reports.map((r: any) => ({
    ID: r.report_id,
    Type: r.report_type,
    Subtype: r.damage_type || r.assistance_type || r.srhr_type || "other",
    Status: r.status,
    Description: r.description,
    Location: r.location,
    Phone: r.phone_number,
    Created: r.created_at,
    Latitude: r.latitude,
    Longitude: r.longitude,
  }));
}

// Map Layers
const clusterLayer = {
  id: "clusters",
  type: "circle",
  source: "reports",
  filter: ["has", "point_count"],
  paint: {
    "circle-color": [
      "step",
      ["get", "point_count"],
      "#86efac",
      10,
      "#fde68a",
      50,
      "#fca5a5",
    ],
    "circle-radius": ["step", ["get", "point_count"], 18, 10, 24, 50, 36],
    "circle-stroke-color": "#111827",
    "circle-stroke-width": 2,
    "circle-opacity": 0.8,
  },
};

const clusterCountLayer = {
  id: "cluster-count",
  type: "symbol",
  source: "reports",
  filter: ["has", "point_count"],
  layout: {
    "text-field": ["get", "point_count_abbreviated"],
    "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
    "text-size": 14,
    "text-allow-overlap": true,
  },
  paint: {
    "text-color": "#ffffff",
    "text-halo-color": "#111827",
    "text-halo-width": 1,
  },
};

const pulseLayer = {
  id: "pulse",
  type: "circle",
  source: "reports",
  filter: ["!", ["has", "point_count"]],
  paint: {
    "circle-radius": [
      "interpolate",
      ["linear"],
      ["get", "pulseFrame"],
      0, 0,
      1, 12,
      2, 16,
      3, 12,
      4, 0,
    ],
    "circle-color": "#ffffff",
    "circle-opacity": [
      "interpolate",
      ["linear"],
      ["get", "pulseFrame"],
      0, 0.7,
      1, 0.5,
      2, 0.3,
      3, 0.1,
      4, 0,
    ],
    "circle-stroke-color": "#ff4444",
    "circle-stroke-width": 1,
  },
};

const unclusteredLayer = {
  id: "unclustered-point",
  type: "circle",
  source: "reports",
  filter: ["!", ["has", "point_count"]],
  paint: {
    "circle-color": [
      "match",
      ["get", "type"],
      "damage",
      "#ef4444",
      "assistance",
      "#22c55e",
      "srhr",
      "#ec4899",
      /* other */ "#6b7280",
    ],
    "circle-radius": [
      "case",
      ["boolean", ["feature-state", "hover"], false],
      12,
      8,
    ],
    "circle-stroke-width": [
      "case",
      ["boolean", ["feature-state", "hover"], false],
      3,
      1.5,
    ],
    "circle-stroke-color": [
      "case",
      ["boolean", ["feature-state", "hover"], false],
      "#ffff00",
      "#111827",
    ],
  },
};

const heatmapLayer = {
  id: "heatmap",
  type: "heatmap",
  source: "reports",
  maxzoom: 15,
  paint: {
    "heatmap-weight": [
      "case",
      ["==", ["get", "status"], "Pending"],
      1.0,
      ["==", ["get", "status"], "Responding"],
      0.6,
      0.3,
    ],
    "heatmap-intensity": ["interpolate", ["linear"], ["zoom"], 0, 0.7, 15, 2.2],
    "heatmap-color": [
      "interpolate",
      ["linear"],
      ["heatmap-density"],
      0,
      "rgba(33,102,172,0)",
      0.2,
      "rgb(103,169,207)",
      0.4,
      "rgb(209,229,240)",
      0.6,
      "rgb(253,219,199)",
      0.8,
      "rgb(239,138,98)",
      1,
      "rgb(178,24,43)",
    ],
    "heatmap-radius": ["interpolate", ["linear"], ["zoom"], 0, 2, 15, 30],
    "heatmap-opacity": 0.7,
  },
};

const userLocationLayer = {
  id: "user-location",
  type: "circle",
  source: "user-location",
  paint: {
    "circle-radius": 10,
    "circle-color": "#3b82f6",
    "circle-stroke-width": 2,
    "circle-stroke-color": "#ffffff",
  },
};

// 
const { user } = useAuth();

const MapView = () => {
  const mapRef = useRef<any>(null);
  const [hoveredStateId, setHoveredStateId] = useState<string | null>(null);
  const [selectedStateId, setSelectedStateId] = useState<string | null>(null);
  const itemRefs = useRef<Map<string, HTMLElement>>(new Map());
  const [userLocation, setUserLocation] = useState<any>(null);
  const [pulseTimestamps, setPulseTimestamps] = useState<Map<string, Date>>(new Map());
  const [pulseFrame, setPulseFrame] = useState(0);
  const [showPanel, setShowPanel] = useState(true);
  const [typeFilter, setTypeFilter] = useState<string[] | null>(null);
  const [statusFilter, setStatusFilter] = useState<string[] | null>(null);
  const [subtypeFilter, setSubtypeFilter] = useState<string[]>([]);
  const [heatmapOn, setHeatmapOn] = useState(false);
  const [query, setQuery] = useState("");
  const [dateFrom, setDateFrom] = useState<string | null>(null);
  const [dateTo, setDateTo] = useState<string | null>(null);
  const [selected, setSelected] = useState<any>(null);
  const [filterCriteria, setFilterCriteria] = useState({
    reportType: "",
    status: "",
  });


  // Inside your component:
  const { user, loading: authLoading } = useAuth();
  const subscriptions = user?.subscriptions || [];

  // Optional: show loading state
  if (authLoading) {
    return <div>Loading user...</div>;
  }
  const { data: reportsData, error: reportsError, isLoading: isReportsLoading } = useSWR<any[]>(
    "csReports/",
    fetcher,
    { refreshInterval: 15000 }
  );

  useEffect(() => {
    document.title = "Map View - mReport | Geographic Report Visualization";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Interactive map showing citizen reports across South Sudan. Visualize infrastructure issues and emergency reports by location and status.');
    }
  }, []);

  useEffect(() => {
    if (userLocation || !navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      let place_name = "Your Location";
      try {
        const res = await fetch(`user-location/?lat=${lat}&lon=${lng}`);
        if (res.ok) {
          const data = await res.json();
          place_name = data.place_name || place_name;
        }
      } catch { }
      setUserLocation({ lat, lng, place_name });
      mapRef.current?.flyTo({ center: [lng, lat], zoom: 12, duration: 2000 });
    });
  }, [userLocation]);

  useEffect(() => {
    if (!reportsData || !Array.isArray(reportsData)) return;
    const newTimestamps = new Map(pulseTimestamps);
    reportsData.forEach((report) => {
      if (!pulseTimestamps.has(report.report_id)) {
        newTimestamps.set(report.report_id, new Date(report.created_at));
      }
    });
    setPulseTimestamps(newTimestamps);
  }, [reportsData, pulseTimestamps]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulseFrame((prev) => (prev + 1) % 5);
      const map = mapRef.current?.getMap();
      if (map && map.isStyleLoaded()) {
        updatePulseStates();
      }
    }, 500);
    return () => clearInterval(interval);
  }, [pulseTimestamps]);

  // Pre-filter reports by subscriptions (before other filters)
  const subscriptionFilteredReports = useMemo(() => {
    if (!reportsData || !Array.isArray(reportsData)) return [];
    return subscriptions.length === 0
      ? reportsData
      : reportsData.filter(r => subscriptions.includes(r.report_type));
  }, [reportsData, subscriptions]);

  // Then apply other filters to the subscription-filtered data
  const filtered = useMemo(() => {
    let out = subscriptionFilteredReports.slice();

    if (typeFilter && typeFilter.length) {
      out = out.filter((r) => typeFilter.includes(r.report_type));
    }
    if (statusFilter && statusFilter.length) {
      out = out.filter((r) => statusFilter.includes(r.status));
    }
    if (subtypeFilter && subtypeFilter.length) {
      out = out.filter((r) => {
        const sub = r.damage_type || r.assistance_type || r.srhr_type || "other";
        return subtypeFilter.includes(sub);
      });
    }
    if (dateFrom)
      out = out.filter((r) => new Date(r.created_at) >= new Date(dateFrom));
    if (dateTo)
      out = out.filter((r) => new Date(r.created_at) <= new Date(dateTo));

    if (query.trim()) {
      const q = query.toLowerCase();
      out = out.filter(
        (r) =>
          r.description.toLowerCase().includes(q) ||
          r.location.toLowerCase().includes(q) ||
          (r.report_id || "").toLowerCase().includes(q)
      );
    }
    return out;
  }, [
    subscriptionFilteredReports,
    typeFilter,
    statusFilter,
    subtypeFilter,
    dateFrom,
    dateTo,
    query,
  ]);

  const mapped = useMemo(() => filtered.filter((r) => {
    const lat = parseFloat(r.latitude);
    const lon = parseFloat(r.longitude);
    return Number.isFinite(lat) && Number.isFinite(lon);
  }), [filtered]);

  const unmapped = useMemo(() => filtered.filter((r) => {
    const lat = parseFloat(r.latitude);
    const lon = parseFloat(r.longitude);
    return !Number.isFinite(lat) || !Number.isFinite(lon);
  }), [filtered]);

  const geojson = useMemo(() => toGeoJSON(mapped), [mapped]);

  const userGeojson = useMemo(() => {
    if (!userLocation) return null;
    return {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: { type: "Point", coordinates: [userLocation.lng, userLocation.lat] },
          properties: { title: userLocation.place_name },
        },
      ],
    };
  }, [userLocation]);

  const mapboxToken = process.env.NEXT_MAPBOX_ACCESS_TOKEN;
  const initialView = { latitude: 6.877, longitude: 31.307, zoom: 5.1 };

  const debouncedSetQuery = useMemo(() => debounce(setQuery, 350), []);

  useEffect(() => {
    const map = mapRef.current?.getMap();
    if (!map || !selected) return;

    if (selectedStateId) {
      map.setFeatureState({ source: "reports", id: selectedStateId }, { select: false });
    }

    const id = selected.props?.report_id;
    if (id) {
      setSelectedStateId(id);
      map.setFeatureState({ source: "reports", id }, { select: true });

      const node = itemRefs.current.get(id);
      if (node) {
        node.scrollIntoView({ block: "center", behavior: "smooth" });
        node.classList.add("ring", "ring-indigo-300");
        setTimeout(() => node.classList.remove("ring", "ring-indigo-300"), 1600);
      }
    }
  }, [selected, selectedStateId]);

  const updatePulseStates = () => {
    const map = mapRef.current?.getMap();
    if (!map || !map.isStyleLoaded() || !reportsData) return;

    const now = new Date();
    reportsData.forEach((report) => {
      const pulseStart = pulseTimestamps.get(report.report_id);
      if (pulseStart) {
        const timeDiff = pulseStart ? (now.getTime() - pulseStart.getTime()) / 1000 : 999;
        if (timeDiff <= 30) {
          map.setFeatureState(
            { source: "reports", id: report.report_id },
            { pulseFrame }
          );
        } else {
          map.setFeatureState(
            { source: "reports", id: report.report_id },
            { pulseFrame: 0 }
          );
        }
      }
    });
  };

  const onMapLoad = () => {
    const map = mapRef.current?.getMap();
    if (!map) return;

    let currentHoveredStateId: number | null = null;
    map.on("mousemove", "unclustered-point", (e: mapboxgl.MapMouseEvent & { features?: any[] }) => {
      if (e.features && e.features.length > 0) {
        const feature = e.features[0];
        const id = feature.id;

        if (currentHoveredStateId !== null && currentHoveredStateId !== id) {
          map.setFeatureState({ source: "reports", id: currentHoveredStateId }, { hover: false });
        }

        currentHoveredStateId = id;
        map.setFeatureState({ source: "reports", id }, { hover: true });
        map.getCanvas().style.cursor = "pointer";
        setHoveredStateId(id);
      }
    });

    map.on("mouseleave", "unclustered-point", () => {
      if (currentHoveredStateId !== null) {
        map.setFeatureState({ source: "reports", id: currentHoveredStateId }, { hover: false });
      }
      currentHoveredStateId = null;
      map.getCanvas().style.cursor = "";
      setHoveredStateId(null);
    });

    map.on("click", "clusters", (e:any) => {
      const features = map.queryRenderedFeatures(e.point, { layers: ["clusters"] });
      const clusterId = features[0].properties.cluster_id;

      map.getSource("reports").getClusterExpansionZoom(clusterId, (err: any, zoom: number) => {
        if (err) return;
        map.easeTo({
          center: features[0].geometry.coordinates,
          zoom: zoom,
          duration: 500,
        });
      });
    });

    updatePulseStates();
  };

  const onMapClick = (e: mapboxgl.MapMouseEvent & { features?: any[] }) => {
    const map = mapRef.current?.getMap();
    if (!map) return;
    const features = map.queryRenderedFeatures(e.point, { layers: ["clusters", "unclustered-point"] });
    if (!features.length) {
      setSelected(null);
      return;
    }

    const feature = features[0];
    if (feature.properties?.cluster) {
      // Handled above
    } else {
      const p = feature.properties;
      const [lon, lat] = feature.geometry.coordinates;
      setSelected({ lon, lat, props: p });
      map.flyTo({ center: [lon, lat], zoom: 12, duration: 2000 });
    }
  };

  useEffect(() => {
    if (hoveredStateId === null) return;
    const node = itemRefs.current.get(hoveredStateId);
    if (!node) return;
    node.classList.add("bg-gray-100", "dark:bg-neutral-800");
    const t = setTimeout(() => node.classList.remove("bg-gray-100", "dark:bg-neutral-800"), 900);
    return () => clearTimeout(t);
  }, [hoveredStateId]);

  const handleFilterChange = (criteria: { reportType: string; status: string }) => {
    setFilterCriteria(criteria);
    setTypeFilter(criteria.reportType ? [criteria.reportType] : null);
    setStatusFilter(criteria.status ? [criteria.status] : null);
  };

  const handleReportClick = (report: any) => {
    const lat = parseFloat(report.latitude);
    const lon = parseFloat(report.longitude);
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
      alert("This report has no valid coordinates and cannot be centered on the map.");
      return;
    }
    mapRef.current?.flyTo({ center: [lon, lat], zoom: 12, duration: 2000 });
    setSelected({
      lon,
      lat,
      props: {
        report_id: report.report_id,
        type: report.report_type,
        subtype: report.damage_type || report.assistance_type || report.srhr_type || "other",
        status: report.status,
        created_at: report.created_at,
        title: report.location,
        description: report.description,
        phone_number: report.phone_number,
      },
    });
  };

  const getStatusBadgeVariant = (status:string) => {
    switch (status) {
      case "Critical": return "destructive";
      case "Pending": return "default";
      case "In Progress": return "default";
      case "Resolved": return "secondary";
      default: return "default";
    }
  };

  const getBgColor = (report_type:string) => {
    let bgColor;
    if (report_type === "damage") bgColor = "border-red-500";
    else if (report_type === "assistance") bgColor = "border-green-400";
    else if (report_type === "srhr") bgColor = "border-pink-600";
    else bgColor = "border-yellow-400";
    return bgColor;
  };

  

  const capitalizeLabel = (label: string) => {
    return label.replaceAll('_', ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  if (isReportsLoading) {
    return <div className="flex h-screen w-full items-center justify-center">Loading reports...</div>;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <DashboardSidebar />

        <div className="flex-1 flex flex-col">
          <DashboardNavbar
            onToggleActivityFeed={() => setShowPanel(!showPanel)}
            showActivityFeed={showPanel}
          />

          <main className="flex-1 p-6 space-y-6">


            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
              {/* Filter panel left */}
              {showPanel && (
                <Card className="xl:col-span-1 overflow-hidden">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-sm"> {/* Smaller text */}
                      <Filter className="h-4 w-4 text-muted-foreground" /> {/* Smaller, dark icon */}
                      Filters
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="space-y-4 p-4 overflow-y-auto h-[calc(100vh-12rem-4rem)]">
                      <ReportFilter onFilterChange={handleFilterChange} /> {/* Assume updated for dark/smaller */}
                      {subscriptions.length > 0 && (
                        <div className="text-xs text-muted-foreground">
                          Showing data for your subscriptions: {subscriptions.join(", ")}
                        </div>
                      )}
                      <div>
                        <label className="text-xs font-medium text-gray-500">Search</label>
                        <div className="mt-1 relative">
                          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" /> {/* Smaller */}
                          <Input
                            placeholder="description, location, report ID..."
                            className="pl-9 text-sm"
                            onChange={(e) => debouncedSetQuery(e.target.value)}
                          />
                        </div>
                      </div>

                      <section>
                        <p className="text-xs font-medium text-gray-500 mb-2">Subtype</p>
                        <div className="space-y-4 text-sm">
                          <div>
                            <p className="font-semibold mb-1">Damage</p>
                            <div className="grid grid-cols-1 gap-1">
                              {['road', 'bridge', 'health_facility', 'water_sanitation'].map((opt) => (
                                <label key={opt} className="flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    checked={subtypeFilter.includes(opt)}
                                    onChange={(e) =>
                                      setSubtypeFilter((prev) =>
                                        e.target.checked ? [...prev, opt] : prev.filter((x) => x !== opt)
                                      )
                                    }
                                  />
                                  {capitalizeLabel(opt)}
                                </label>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p className="font-semibold mb-1">Assistance</p>
                            <div className="grid grid-cols-1 gap-1">
                              {['food_water', 'medical_help', 'shelter', 'evacuation'].map((opt) => (
                                <label key={opt} className="flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    checked={subtypeFilter.includes(opt)}
                                    onChange={(e) =>
                                      setSubtypeFilter((prev) =>
                                        e.target.checked ? [...prev, opt] : prev.filter((x) => x !== opt)
                                      )
                                    }
                                  />
                                  {capitalizeLabel(opt)}
                                </label>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p className="font-semibold mb-1">SRHR</p>
                            <div className="grid grid-cols-1 gap-1">
                              {['maternal_health', 'contraceptive', 'hiv', 'gbv_support', 'other'].map((opt) => (
                                <label key={opt} className="flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    checked={subtypeFilter.includes(opt)}
                                    onChange={(e) =>
                                      setSubtypeFilter((prev) =>
                                        e.target.checked ? [...prev, opt] : prev.filter((x) => x !== opt)
                                      )
                                    }
                                  />
                                  {capitalizeLabel(opt)}
                                </label>
                              ))}
                            </div>
                          </div>
                        </div>
                      </section>

                      <section>
                        <p className="text-xs font-medium text-gray-500 mb-2 flex items-center gap-2">
                          <CalendarRange className="h-4 w-4" /> Date range
                        </p>
                        <div className="flex items-center gap-2 text-sm"> {/* Smaller */}
                          <Input
                            type="date"
                            value={dateFrom ?? ""}
                            onChange={(e) => setDateFrom(e.target.value || null)}
                            className="text-sm"
                          />
                          <span className="text-gray-400">—</span>
                          <Input
                            type="date"
                            value={dateTo ?? ""}
                            onChange={(e) => setDateTo(e.target.value || null)}
                            className="text-sm"
                          />
                        </div>
                      </section>

                      <section className="flex items-center justify-between text-sm"> {/* Smaller */}
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={heatmapOn}
                            onChange={(e) => setHeatmapOn(e.target.checked)}
                          /> Heatmap
                        </label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  if (!navigator.geolocation) return;
                                  navigator.geolocation.getCurrentPosition(async (pos) => {
                                    const lat = pos.coords.latitude;
                                    const lng = pos.coords.longitude;
                                    let place_name = "Your Location";
                                    try {
                                      const res = await fetch(`user-location/?lat=${lat}&lon=${lng}`);
                                      if (res.ok) {
                                        const data = await res.json();
                                        place_name = data.place_name || place_name;
                                      }
                                    } catch { }
                                    setUserLocation({ lat, lng, place_name });
                                    mapRef.current?.flyTo({ center: [lng, lat], zoom: 12, duration: 2000 });
                                  });
                                }}
                              >
                                <LocateFixed className="h-4 w-4 mr-2" /> My location
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Locate me on the map</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </section>

                      <section className="rounded-2xl border p-3 space-y-2 text-sm"> {/* Smaller */}
                        <p className="text-xs text-gray-500">Visible reports</p>
                        <p className="text-2xl font-semibold">{filtered.length}</p>
                        <p className="text-xs text-gray-500">Mapped: {mapped.length} | Unmapped: {unmapped.length}</p>
                        <CSVLink data={toCSVData(filtered)} filename="reports.csv">
                          <Button variant="outline" size="sm" className="w-full">
                            <Download className="h-4 w-4 mr-2" /> Export CSV
                          </Button>
                        </CSVLink>
                      </section>

                      <div className="flex flex-col gap-2">
                        <h1 className="font-bold text-xl text-center bg-blue-600 text-white p-2 rounded-md">
                          Results
                        </h1>
                        <div>
                          <h1 className="font-bold p-2 border-b-4 border-blue-500 mb-2">
                            Mapped Reports:
                          </h1>
                          <ul className="space-y-2">
                            {mapped.map((report) => (
                              <li
                                key={report.report_id}
                                ref={(el) => { if (el) itemRefs.current.set(report.report_id, el); }}
                                className={classNames(
                                  "p-3 rounded-lg border border-border/50 hover:bg-muted/30 transition-smooth cursor-pointer",
                                  getBgColor(report.report_type),
                                  selected?.props?.report_id === report.report_id ? "bg-indigo-50" : ""
                                )}
                                onClick={() => handleReportClick(report)}
                                onMouseEnter={() => setHoveredStateId(report.report_id)}
                                onMouseLeave={() => setHoveredStateId((cur) => cur === report.report_id ? null : cur)}
                              >
                                <div className="flex justify-between items-start mb-2">
                                  <h4 className="font-medium text-sm">{report.location}</h4>
                                  <Badge variant={getStatusBadgeVariant(report.status)} className="text-xs">
                                    {report.status}
                                  </Badge>
                                </div>
                                <div className="text-xs text-muted-foreground space-y-1">
                                  <p>Type: {report.report_type}</p>
                                  <p>Subtype: {report.damage_type || report.assistance_type || report.srhr_type || "other"}</p>
                                  <p>Updated: {new Date(report.created_at).toLocaleString()}</p>
                                </div>
                              </li>
                            ))}
                            {mapped.length === 0 && (
                              <div className="text-sm text-gray-500 text-center">
                                No matching mapped reports.
                              </div>
                            )}
                          </ul>
                        </div>
                        <div>
                          <h1 className="font-bold p-2 border-b-4 border-blue-500 mb-2 mt-4">
                            Unmapped Reports:
                          </h1>
                          <ul className="space-y-2">
                            {unmapped.map((report) => (
                              <li
                                key={report.report_id}
                                ref={(el) => { if (el) itemRefs.current.set(report.report_id, el); }}
                                className={classNames(
                                  "p-3 rounded-lg border border-border/50 hover:bg-muted/30 transition-smooth cursor-pointer",
                                  getBgColor(report.report_type),
                                  selected?.props?.report_id === report.report_id ? "bg-indigo-50" : ""
                                )}
                                onClick={() => handleReportClick(report)}
                                onMouseEnter={() => setHoveredStateId(report.report_id)}
                                onMouseLeave={() => setHoveredStateId((cur) => cur === report.report_id ? null : cur)}
                              >
                                <div className="flex justify-between items-start mb-2">
                                  <h4 className="font-medium text-sm">{report.location}</h4>
                                  <Badge variant={getStatusBadgeVariant(report.status)} className="text-xs">
                                    {report.status}
                                  </Badge>
                                </div>
                                <div className="text-xs text-muted-foreground space-y-1">
                                  <p>Type: {report.report_type}</p>
                                  <p>Subtype: {report.damage_type || report.assistance_type || report.srhr_type || "other"}</p>
                                  <p>Updated: {new Date(report.created_at).toLocaleString()}</p>
                                </div>
                              </li>
                            ))}
                            {unmapped.length === 0 && (
                              <div className="text-sm text-gray-500 text-center">
                                No unmapped reports.
                              </div>
                            )}
                          </ul>
                        </div>
                        <ReportNotifications />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Map right */}
              <Card className="xl:col-span-3 h-[calc(100vh-12rem)]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Navigation className="h-5 w-5 text-primary" />
                    South Sudan - mReport Locations
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 relative h-full">
                  {reportsError && (
                    <div className="absolute right-4 top-4 z-20 rounded-xl border bg-white/80 p-3 text-sm text-red-600">
                      Failed to load: {String(reportsError)}
                    </div>
                  )}
                  <MapGL
                    ref={mapRef}
                    initialViewState={initialView}
                    mapStyle="mapbox://styles/mapbox/dark-v11"
                    mapboxAccessToken={mapboxToken}
                    onClick={onMapClick}
                    onLoad={onMapLoad}
                    style={{ height: '100%', width: '100%' }}
                  >
                    <NavigationControl position="top-left" />
                    <GeolocateControl position="top-left" />
                    <ScaleControl position="bottom-left" />
                    <FullscreenControl position="top-left" />

                    <Source
                      id="reports"
                      type="geojson"
                      data={geojson}
                      cluster={true}
                      clusterMaxZoom={14}
                      clusterRadius={50}
                    >
                      {heatmapOn && <Layer {...(heatmapLayer as any)} />}
                      <Layer {...(clusterLayer as any)} />
                      <Layer {...(clusterCountLayer as any)} />
                      <Layer {...(pulseLayer as any)} />
                      {!heatmapOn && <Layer {...(unclusteredLayer as any)} />}
                    </Source>

                    {userGeojson && (
                      <Source id="user-location" type="geojson" data={userGeojson}>
                        <Layer {...(userLocationLayer as any)} />

                      </Source>
                    )}

                    {selected && (
                      <Popup
                        anchor="bottom"
                        longitude={selected.lon}
                        latitude={selected.lat}
                        onClose={() => setSelected(null)}
                        closeOnMove={false}
                        closeButton
                        maxWidth="320px"
                      >
                        <div className="space-y-1 text-sm">
                          <div className="text-xs text-gray-500">
                            #{selected.props.report_id}
                          </div>
                          <div className="font-semibold capitalize">
                            {selected.props.type} —{" "}
                            {String(selected.props.subtype).replaceAll("_", " ")}
                          </div>
                          <div className="text-gray-700 dark:text-gray-200">
                            {selected.props.description}
                          </div>
                          <div className="text-xs text-gray-500">
                            {selected.props.title}
                          </div>
                          {selected.props.phone_number && (
                            <div className="text-xs text-gray-500">
                              Phone: {selected.props.phone_number}
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <FiAlertCircle />
                            <Badge variant={getStatusBadgeVariant(selected.props.status)}>
                              {selected.props.status}
                            </Badge>
                          </div>
                          <div className="flex flex-col">
                            <h1 className="font-bold">Coordinates</h1>
                            <div className="flex gap-2">
                              <h1>Latitude:</h1>
                              <p>{selected.lat}</p>
                            </div>
                            <div className="flex gap-2">
                              <h1>Longitude:</h1>
                              <p>{selected.lon}</p>
                            </div>
                          </div>
                          <div className="text-xs text-gray-400">
                            {new Date(selected.props.created_at).toLocaleString()}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              className="mt-2 bg-blue-500 text-white py-1 px-2 rounded"
                              onClick={() => {
                                // Placeholder for update status logic
                              }}
                            >
                              Update Status
                            </Button>
                            <Button
                              className="mt-2 bg-blue-500 text-white py-1 px-2 rounded"
                              onClick={() => {
                                window.open(
                                  `https://www.mapbox.com/directions?from=my-location&to=${selected.lon},${selected.lat}`,
                                  "_blank"
                                );
                              }}
                            >
                              Get Directions
                            </Button>
                          </div>
                        </div>
                      </Popup>
                    )}
                  </MapGL>

                  <div className="pointer-events-none absolute left-4 top-4 z-10 flex items-center gap-2">
                    <div className="pointer-events-auto rounded-2xl border bg-white/80 px-3 py-1.5 text-sm shadow-sm dark:bg-neutral-900/80">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" /> Mapbox — Reports
                      </div>
                    </div>
                  </div>

                  {/* Removed Symbol Descriptions */}
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default MapView;

