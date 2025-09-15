import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Navigation, Search } from 'lucide-react';
import { Report } from '@/types/api';

interface GoogleMapProps {
  reports: Report[];
  onReportClick?: (report: Report) => void;
  height?: string;
  className?: string;
}

const GoogleMap: React.FC<GoogleMapProps> = ({ 
  reports, 
  onReportClick, 
  height = '500px',
  className = '' 
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchLocation, setSearchLocation] = useState('');

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: process.env.VITE_GOOGLE_MAPS_API_KEY || 'YOUR_GOOGLE_MAPS_API_KEY', // Replace with your API key
        version: 'weekly',
        libraries: ['places'],
      });

      try {
        await loader.load();
        
        if (!mapRef.current) return;

        // Initialize map centered on South Sudan
        const map = new google.maps.Map(mapRef.current, {
          center: { lat: 6.877, lng: 31.307 }, // South Sudan coordinates
          zoom: 6,
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }],
            },
          ],
        });

        mapInstanceRef.current = map;
        setIsLoaded(true);
        
        // Add markers for reports
        addMarkersToMap(map, reports);
        
      } catch (err) {
        console.error('Error loading Google Maps:', err);
        setError('Failed to load Google Maps. Please check your API key.');
      }
    };

    initMap();
  }, []);

  useEffect(() => {
    if (isLoaded && mapInstanceRef.current) {
      addMarkersToMap(mapInstanceRef.current, reports);
    }
  }, [reports, isLoaded]);

  const addMarkersToMap = (map: google.maps.Map, reportsData: Report[]) => {
    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // Add new markers
    reportsData.forEach((report) => {
      const marker = new google.maps.Marker({
        position: { lat: report.latitude, lng: report.longitude },
        map,
        title: report.title,
        icon: {
          url: getMarkerIcon(report.type, report.status),
          scaledSize: new google.maps.Size(32, 32),
        },
      });

      // Create info window
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="max-width: 250px;">
            <h3 style="margin: 0 0 8px 0; font-weight: bold;">${report.title}</h3>
            <p style="margin: 0 0 4px 0; color: #666;">${report.description}</p>
            <div style="display: flex; gap: 8px; align-items: center; margin-top: 8px;">
              <span style="background: ${getStatusColor(report.status)}; color: white; padding: 2px 6px; border-radius: 4px; font-size: 12px;">
                ${report.status.replace('_', ' ').toUpperCase()}
              </span>
              <span style="background: #f0f0f0; padding: 2px 6px; border-radius: 4px; font-size: 12px;">
                ${report.type}
              </span>
            </div>
            <p style="margin: 8px 0 0 0; font-size: 12px; color: #888;">
              ${new Date(report.created_at).toLocaleDateString()}
            </p>
          </div>
        `,
      });

      marker.addListener('click', () => {
        infoWindow.open(map, marker);
        onReportClick?.(report);
      });

      markersRef.current.push(marker);
    });

    // Adjust map bounds to show all markers
    if (reportsData.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      reportsData.forEach((report) => {
        bounds.extend({ lat: report.latitude, lng: report.longitude });
      });
      map.fitBounds(bounds);
    }
  };

  const getMarkerIcon = (type: string, status: string) => {
    const baseUrl = 'https://maps.google.com/mapfiles/ms/icons/';
    const colors: { [key: string]: string } = {
      'Infrastructure': 'blue',
      'Emergency': 'red',
      'Health': 'green',
      'Education': 'yellow',
      'SRHR': 'purple',
    };
    
    const statusSuffix = status === 'resolved' ? '-dot' : '';
    return `${baseUrl}${colors[type] || 'red'}${statusSuffix}.png`;
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      pending: '#f59e0b',
      in_progress: '#3b82f6',
      resolved: '#10b981',
      closed: '#6b7280',
    };
    return colors[status] || '#6b7280';
  };

  const handleLocationSearch = () => {
    if (!mapInstanceRef.current || !searchLocation.trim()) return;

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: searchLocation }, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        const location = results[0].geometry.location;
        mapInstanceRef.current?.setCenter(location);
        mapInstanceRef.current?.setZoom(12);
      }
    });
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        mapInstanceRef.current?.setCenter({ lat: latitude, lng: longitude });
        mapInstanceRef.current?.setZoom(12);
      },
      (error) => {
        console.error('Error getting location:', error);
      }
    );
  };

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center p-8">
          <div className="text-center">
            <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">{error}</p>
            <p className="text-sm text-muted-foreground mt-2">
              Please add your Google Maps API key to display the interactive map.
            </p>
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
            <MapPin className="h-5 w-5" />
            Reports Map
          </CardTitle>
          <Badge variant="secondary">
            {reports.length} Reports
          </Badge>
        </div>
        
        {/* Search controls */}
        <div className="flex gap-2">
          <div className="flex-1 flex gap-2">
            <Input
              placeholder="Search location..."
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLocationSearch()}
            />
            <Button 
              variant="outline" 
              size="icon"
              onClick={handleLocationSearch}
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
          <Button 
            variant="outline" 
            size="icon"
            onClick={getCurrentLocation}
            title="Get current location"
          >
            <Navigation className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div 
          ref={mapRef} 
          style={{ height, width: '100%' }}
          className="rounded-b-lg"
        />
      </CardContent>
    </Card>
  );
};

export default GoogleMap;