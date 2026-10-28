
'use client';

import { useState, useEffect } from 'react';
import {
  CircleMarker,
  MapContainer,
  TileLayer,
  useMap,
  useMapEvents,
} from 'react-leaflet';
import { Search, MapPin, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type PropertyLocationPickerProps = {
  latitude: string;
  longitude: string;
  onLocationChange: (latitude: string, longitude: string) => void;
};

const ETHIOPIA_CENTER: [number, number] = [9.03, 38.74];

function MapClickHandler({
  onSelect,
}: {
  onSelect: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(event) {
      onSelect(event.latlng.lat, event.latlng.lng);
    },
  });

  return null;
}

function MapCenterUpdater({
  center,
}: {
  center: [number, number];
}) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);

  return null;
}

export function PropertyLocationPicker({
  latitude,
  longitude,
  onLocationChange,
}: PropertyLocationPickerProps) {
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState('');

  const hasCoordinates =
    latitude.trim() !== '' &&
    longitude.trim() !== '' &&
    Number.isFinite(Number(latitude)) &&
    Number.isFinite(Number(longitude)) &&
    Math.abs(Number(latitude)) <= 90 &&
    Math.abs(Number(longitude)) <= 180;

  const selectedPosition: [number, number] | null = hasCoordinates
    ? [Number(latitude), Number(longitude)]
    : null;

  const center = selectedPosition ?? ETHIOPIA_CENTER;

  const selectLocation = (lat: number, lng: number) => {
    onLocationChange(lat.toFixed(7), lng.toFixed(7));
    setSearchError('');
  };

  async function searchLocation(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!query.trim()) return;

    setSearching(true);
    setSearchError('');

    try {
      const params = new URLSearchParams({
        q: query.trim(),
        format: 'jsonv2',
        limit: '1',
        countrycodes: 'et',
      });

      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error('Location search is temporarily unavailable.');
      }

      const results: Array<{ lat: string; lon: string }> =
        await response.json();

      if (!results.length) {
        setSearchError(
          'Location not found. Try a city, sub-city, landmark, or address in Ethiopia.'
        );
        return;
      }

      selectLocation(Number(results[0].lat), Number(results[0].lon));
    } catch (error) {
      setSearchError(
        error instanceof Error
          ? error.message
          : 'Could not search for this location.'
      );
    } finally {
      setSearching(false);
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-zinc-900">
          Pin Property Location
        </h3>
    
      </div>
      <div className="relative z-0 overflow-hidden rounded-xl border border-zinc-200">
        <MapContainer
          center={center}
          zoom={selectedPosition ? 16 : 7}
          scrollWheelZoom
          className="h-[380px] w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapCenterUpdater center={center} />

          <MapClickHandler onSelect={selectLocation} />

          {selectedPosition && (
            <CircleMarker
              center={selectedPosition}
              radius={9}
              pathOptions={{
                color: '#ffffff',
                weight: 3,
                fillColor: '#d97706',
                fillOpacity: 1,
              }}
            />
          )}
        </MapContainer>
      </div>

      <p className="text-xs text-zinc-500">
        <MapPin className="mr-1 inline h-3.5 w-3.5" />
        Click the map to select the exact property location. Click again to
        adjust the coordinates.
      </p>

      {selectedPosition ? (
        <div className="grid grid-cols-1 gap-3 rounded-xl bg-zinc-50 p-4 sm:grid-cols-2">
          <div>
            <p className="text-xs font-medium text-zinc-500">Latitude</p>
            <p className="mt-1 font-mono text-sm text-zinc-900">
              {Number(latitude).toFixed(7)}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium text-zinc-500">Longitude</p>
            <p className="mt-1 font-mono text-sm text-zinc-900">
              {Number(longitude).toFixed(7)}
            </p>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="sm:col-span-2"
            onClick={() => onLocationChange('', '')}
          >
            Clear selected location
          </Button>
        </div>
      ) : (
        <p className="text-sm text-amber-700">
          No location selected yet. Click the map to set the coordinates.
        </p>
      )}
    </div>
  );
}
