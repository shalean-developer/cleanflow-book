import React, { useEffect, useState } from 'react';
import { MapPin, Loader2, AlertCircle } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapPreviewProps {
  address: string;
  className?: string;
}

interface Coordinates {
  lat: number;
  lng: number;
}

export function MapPreview({ address, className = '' }: MapPreviewProps) {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Simple geocoding function using a free service
  const geocodeAddress = async (address: string): Promise<Coordinates | null> => {
    if (!address.trim()) return null;

    try {
      // Using Nominatim (OpenStreetMap's geocoding service) - free and no API key required
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1&countrycodes=za&addressdetails=1`
      );
      
      if (!response.ok) {
        throw new Error('Geocoding service unavailable');
      }

      const data = await response.json();
      
      if (data && data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon)
        };
      }
      
      return null;
    } catch (err) {
      console.error('Geocoding error:', err);
      throw new Error('Unable to find location');
    }
  };

  // Geocode address when it changes
  useEffect(() => {
    if (!address.trim()) {
      setCoordinates(null);
      setError(null);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setLoading(true);
      setError(null);
      
      try {
        const coords = await geocodeAddress(address);
        if (coords) {
          setCoordinates(coords);
        } else {
          setError('Address not found');
          setCoordinates(null);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Geocoding failed');
        setCoordinates(null);
      } finally {
        setLoading(false);
      }
    }, 500); // Debounce for 500ms

    return () => clearTimeout(timeoutId);
  }, [address]);

  // Show loading state
  if (loading) {
    return (
      <div className={`h-32 bg-[#F8FAFC] rounded-xl border border-gray-100 flex items-center justify-center ${className}`}>
        <div className="flex items-center gap-2 text-[#94A3B8]">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm">Finding location...</span>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className={`h-32 bg-[#FEF2F2] rounded-xl border border-red-200 flex items-center justify-center ${className}`}>
        <div className="flex items-center gap-2 text-red-500">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm">{error}</span>
        </div>
      </div>
    );
  }

  // Show placeholder when no address
  if (!address.trim()) {
    return (
      <div className={`h-32 bg-[#F8FAFC] rounded-xl border border-gray-100 flex items-center justify-center ${className}`}>
        <div className="flex items-center gap-2 text-[#94A3B8]">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">Enter address to see map</span>
        </div>
      </div>
    );
  }

  // Show map
  if (coordinates) {
    return (
      <div className={`h-32 bg-[#F8FAFC] rounded-xl border border-gray-100 overflow-hidden ${className}`}>
        <MapContainer
          center={[coordinates.lat, coordinates.lng]}
          zoom={15}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
          attributionControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[coordinates.lat, coordinates.lng]}>
            <Popup>
              <div className="text-sm">
                <strong>Service Location</strong><br />
                {address}
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    );
  }

  // Fallback
  return (
    <div className={`h-32 bg-[#F8FAFC] rounded-xl border border-gray-100 flex items-center justify-center ${className}`}>
      <div className="flex items-center gap-2 text-[#94A3B8]">
        <MapPin className="w-4 h-4" />
        <span className="text-sm">Map preview will appear here</span>
      </div>
    </div>
  );
}
