import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Report, SubscriptionType} from '@/types/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MapPin, Layers, ZoomIn, ZoomOut } from 'lucide-react';


interface MapboxMapProps {
  reports: Report[];
  loading?: boolean;
  className?: string;
  subscriptionFilter?: SubscriptionType;
}

const MAPBOX_TOKEN = 'pk.your-mapbox-token'; // User needs to add their token

const MapboxMap = ({ reports, loading, className, subscriptionFilter = 'All' }: MapboxMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [showTokenInput, setShowTokenInput] = useState(!MAPBOX_TOKEN || MAPBOX_TOKEN === 'pk.your-mapbox-token');
  const [tokenInput, setTokenInput] = useState('');

  // Filter reports based on subscription
  const filteredReports = reports.filter(report => {
    if (subscriptionFilter === 'All') return true;
    if (subscriptionFilter === 'Emergency' && report.type === 'Emergency') return true;
    if (subscriptionFilter === 'SRHR' && report.type === 'SRHR') return true;
    if (subscriptionFilter === 'Disaster' && (report.type === 'Infrastructure' || report.priority === 'critical')) return true;
    return false;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#F59E0B';
      case 'in_progress': return '#3B82F6';
      case 'resolved': return '#10B981';
      case 'closed': return '#6B7280';
      default: return '#8B5CF6';
    }
  };

  const initializeMap = (token: string) => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = token;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [31.582, 4.859], // South Sudan center
      zoom: 6,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    map.current.addControl(new mapboxgl.FullscreenControl(), 'top-right');

    map.current.on('load', () => {
      setMapLoaded(true);
    });

    // Add dark mode support
    const isDark = document.documentElement.classList.contains('dark');
    if (isDark) {
      map.current.setStyle('mapbox://styles/mapbox/dark-v11');
    }
  };

  const addMarkersToMap = () => {
    if (!map.current || !mapLoaded) return;

    // Remove existing markers
    const markers = document.querySelectorAll('.mapboxgl-marker');
    markers.forEach(marker => marker.remove());

    filteredReports.forEach(report => {
      const el = document.createElement('div');
      el.className = 'marker';
      el.style.cssText = `
        background-color: ${getStatusColor(report.status)};
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        cursor: pointer;
      `;

      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div style="padding: 8px;">
          <h3 style="margin: 0 0 4px 0; font-weight: 600;">${report.title}</h3>
          <p style="margin: 0 0 4px 0; font-size: 14px; color: #666;">${report.type}</p>
          <p style="margin: 0 0 8px 0; font-size: 12px;">${report.location}</p>
          <span style="background: ${getStatusColor(report.status)}; color: white; padding: 2px 8px; border-radius: 12px; font-size: 11px; text-transform: uppercase;">
            ${report.status}
          </span>
        </div>
      `);

      new mapboxgl.Marker(el)
        .setLngLat([report.longitude, report.latitude])
        .setPopup(popup)
        .addTo(map.current!);
    });
  };

  useEffect(() => {
    if (MAPBOX_TOKEN && MAPBOX_TOKEN !== 'pk.your-mapbox-token') {
      initializeMap(MAPBOX_TOKEN);
    }
  }, []);

  useEffect(() => {
    addMarkersToMap();
  }, [filteredReports, mapLoaded]);

  const handleTokenSubmit = () => {
    if (tokenInput.trim()) {
      initializeMap(tokenInput.trim());
      setShowTokenInput(false);
    }
  };

  if (showTokenInput) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Interactive Map - Setup Required
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            To display the interactive map, please enter your Mapbox public token. 
            You can get one for free at{' '}
            <a 
              href="https://mapbox.com/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-primary hover:underline"
            >
              mapbox.com
            </a>
          </p>
          <div className="flex gap-2">
            <Input
              placeholder="pk.ey..."
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleTokenSubmit}>
              Connect Map
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Interactive Map
            {subscriptionFilter !== 'All' && (
              <Badge variant="outline">{subscriptionFilter} Reports</Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Layers className="h-4 w-4" />
            {filteredReports.length} reports
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative">
          <div 
            ref={mapContainer} 
            className="w-full h-[400px] rounded-b-lg"
            style={{ minHeight: '400px' }}
          />
          {loading && (
            <div className="absolute inset-0 bg-background/80 flex items-center justify-center rounded-b-lg">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                <p className="text-sm text-muted-foreground">Loading map data...</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MapboxMap;