// src/components/dashboard/MapView.tsx
import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl"; // yarn add mapbox-gl
import "mapbox-gl/dist/mapbox-gl.css";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Navigation } from "lucide-react";
import { cn } from "@/lib/utils";

interface MapDataPoint {
  id: number;
  latitude: number;
  longitude: number;
  type: string;
  status: "pending" | "in_progress" | "resolved" | "closed";
  location: string;
}

interface MapViewProps {
  data: MapDataPoint[];
  loading?: boolean;
}

export function MapView({ data, loading }: MapViewProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  // Set your Mapbox access token
  mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN as string;

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [31.5713, 4.8594], // Default center: Juba
      zoom: 5,
    });

    // Add navigation controls
    mapRef.current.addControl(new mapboxgl.NavigationControl());
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    // Clear existing markers
    document.querySelectorAll(".marker").forEach((el) => el.remove());

    data.forEach((point) => {
      const el = document.createElement("div");
      el.className = cn(
        "marker w-4 h-4 rounded-full border-2 border-white shadow-lg",
        getStatusColor(point.status)
      );

      // Add marker
      new mapboxgl.Marker(el)
        .setLngLat([point.longitude, point.latitude])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(`
            <div class="text-sm">
              <strong>${point.location}</strong><br/>
              Type: ${point.type}<br/>
              Status: ${mapStatusForDisplay(point.status)}
            </div>
          `)
        )
        .addTo(mapRef.current!);
    });
  }, [data]);

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
          <div ref={mapContainerRef} className="h-64 w-full rounded-md" />
        )}
      </CardContent>
    </Card>
  );
}

// ---------------------
// Helpers
// ---------------------
const getStatusColor = (status: MapDataPoint["status"]) => {
  switch (status) {
    case "pending":
      return "bg-red-500";
    case "in_progress":
      return "bg-yellow-500";
    case "resolved":
      return "bg-green-500";
    case "closed":
      return "bg-gray-500";
    default:
      return "bg-gray-300";
  }
};

const mapStatusForDisplay = (status: MapDataPoint["status"]): string => {
  switch (status) {
    case "pending":
      return "Pending";
    case "in_progress":
      return "In Progress";
    case "resolved":
      return "Resolved";
    case "closed":
      return "Closed";
    default:
      return "Pending";
  }
};
