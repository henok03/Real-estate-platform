
'use client';

import { useState } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from 'react-leaflet';
import { ExternalLink } from 'lucide-react';
import L from 'leaflet';
interface PropertyDetailsMapProps {
  latitude: number | string | null;
  longitude: number | string | null;
  title: string;
  address?: string | null;
}

export default function PropertyDetailsMap({
  latitude,
  longitude,
  title,
  address,
}: PropertyDetailsMapProps) {
  const [mapType, setMapType] = useState<'streets' | 'satellite'>('streets');

  const lat = Number(latitude);
  const lng = Number(longitude);
const propertyIcon = L.divIcon({
  className: '',
  html: `
    <div style="
      width: 24px;
      height: 24px;
      background: #dc2626;
      border: 4px solid white;
      border-radius: 50%;
      box-shadow: 0 2px 8px rgba(0,0,0,0.5);
    "></div>
  `,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});
  const valid =
    latitude !== null &&
    longitude !== null &&
    latitude !== '' &&
    longitude !== '' &&
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    Math.abs(lat) <= 90 &&
    Math.abs(lng) <= 180;

  if (!valid) {
    return (
      <div className="rounded-xl border p-6 text-sm text-zinc-500">
        No valid map coordinates are available for this property.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200">
      <div className="flex items-center justify-between gap-3 p-4">
        <div>
          <h3 className="font-semibold">{title}</h3>
          {address && (
            <p className="mt-1 text-sm text-zinc-500">{address}</p>
          )}
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setMapType('streets')}
            className={`rounded-lg px-3 py-2 text-sm ${
              mapType === 'streets'
                ? 'bg-zinc-900 text-white'
                : 'border'
            }`}
          >
            Streets
          </button>

          <button
            type="button"
            onClick={() => setMapType('satellite')}
            className={`rounded-lg px-3 py-2 text-sm ${
              mapType === 'satellite'
                ? 'bg-zinc-900 text-white'
                : 'border'
            }`}
          >
            Satellite
          </button>
        </div>
      </div>

      <MapContainer
        key={`${lat}-${lng}`}
        center={[lat, lng]}
        zoom={17}
        scrollWheelZoom
        className="z-0 h-[400px] w-full"
      >
        {mapType === 'streets' ? (
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        ) : (
          <TileLayer
            attribution="Tiles &copy; Esri"
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          />
        )}

<Marker position={[lat, lng]} icon={propertyIcon}>
  <Popup>
    <strong>{title}</strong>
    {address && <p>{address}</p>}
  </Popup>
</Marker>

      </MapContainer>

      <div className="flex flex-wrap items-center justify-between gap-3 p-4">
        <p className="text-xs text-zinc-500">
          {lat.toFixed(7)}, {lng.toFixed(7)}
        </p>

        <a
          href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white"
        >
          Open Google Maps
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
