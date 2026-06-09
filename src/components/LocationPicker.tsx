'use client';

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface LocationPickerProps {
  initialLat: number;
  initialLng: number;
  onChange: (lat: number, lng: number) => void;
}

const pinIcon = L.divIcon({
  html: `
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; width: 34px; height: 42px;">
      <div style="width: 34px; height: 34px; border-radius: 50%; background-color: #004ac6; border: 2.5px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.15); display: flex; align-items: center; justify-content: center; font-size: 15px;">
        📍
      </div>
      <div style="width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 8px solid #004ac6; margin-top: -3px;"></div>
    </div>
  `,
  className: 'custom-picker-icon',
  iconSize: [34, 42],
  iconAnchor: [17, 42],
});

// Component to handle map clicks
const MapClickHandler: React.FC<{ onClick: (lat: number, lng: number) => void }> = ({ onClick }) => {
  useMapEvents({
    click(e) {
      onClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

export const LocationPicker: React.FC<LocationPickerProps> = ({
  initialLat,
  initialLng,
  onChange,
}) => {
  const [position, setPosition] = useState<[number, number]>([initialLat, initialLng]);

  // Fix Leaflet icons
  useEffect(() => {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });
  }, []);

  const handlePositionChange = (lat: number, lng: number) => {
    setPosition([lat, lng]);
    onChange(lat, lng);
  };

  return (
    <MapContainer
      center={position}
      zoom={14}
      className="w-full h-full cursor-crosshair z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapClickHandler onClick={handlePositionChange} />
      <Marker
        position={position}
        icon={pinIcon}
        draggable={true}
        eventHandlers={{
          dragend: (e) => {
            const marker = e.target;
            const newPos = marker.getLatLng();
            handlePositionChange(newPos.lat, newPos.lng);
          },
        }}
      />
    </MapContainer>
  );
};

export default LocationPicker;
