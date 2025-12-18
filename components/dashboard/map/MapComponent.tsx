// src/components/dashboard/map/MapComponent.tsx
import MapGL, { Source, Layer, Popup, NavigationControl, GeolocateControl, ScaleControl, FullscreenControl } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const layers = {
  cluster: /* ... same as before */,
  clusterCount: /* ... */,
  unclustered: /* ... */,
  pulse: /* ... */,
  heatmap: /* ... */,
  userLocation: /* ... */,
};

type Props = {
  geojson: any;
  userGeojson: any | null;
  heatmapOn: boolean;
  selected: any;
  onSelect: (feat: any) => void;
  onMapLoad: () => void;
};

export function MapComponent({ geojson, userGeojson, heatmapOn, selected, onSelect, onMapLoad }: Props) {
  return (
    <MapGL
      initialViewState={{ latitude: 6.877, longitude: 31.307, zoom: 5.5 }}
      mapStyle="mapbox://styles/mapbox/dark-v11"
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
      onClick={onSelect}
      onLoad={onMapLoad}
      style={{ width: "100%", height: "100%" }}
    >
      <NavigationControl position="top-left" />
      <GeolocateControl position="top-left" />
      <ScaleControl position="bottom-left" />
      <FullscreenControl position="top-left" />

      <Source id="reports" type="geojson" data={geojson} cluster clusterMaxZoom={14} clusterRadius={50}>
        {heatmapOn && <Layer {...layers.heatmap} />}
        <Layer {...layers.cluster} />
        <Layer {...layers.clusterCount} />
        <Layer {...layers.pulse} />
        {!heatmapOn && <Layer {...layers.unclustered} />}
      </Source>

      {userGeojson && (
        <Source id="user-location" type="geojson" data={userGeojson}>
          <Layer {...layers.userLocation} />
        </Source>
      )}

      {selected && (
        <Popup
          longitude={selected.lon}
          latitude={selected.lat}
          onClose={() => onSelect(null)}
          closeButton
          anchor="bottom"
          maxWidth="320px"
        >
          {/* Same popup content as before */}
        </Popup>
      )}
    </MapGL>
  );
}