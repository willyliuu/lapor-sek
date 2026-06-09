'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { ThumbsUp, Calendar } from 'lucide-react';
import { Issue } from '@/context/AppContext';

import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet when using web bundlers
// (We still use custom icons for categories, but this handles any fallback markers)
const setupDefaultMarkerIcon = () => {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  });
};

interface MapProps {
  issues: Issue[];
  center?: [number, number];
  zoom?: number;
  interactive?: boolean;
}

const CATEGORY_COLORS: Record<string, string> = {
  road_damage: '#EF4444',
  flooding: '#3B82F6',
  waste: '#84CC16',
  lighting: '#F59E0B',
  facility: '#8B5CF6',
  other: '#94A3B8',
};

const CATEGORY_EMOJIS: Record<string, string> = {
  road_damage: '🚧',
  flooding: '💧',
  waste: '🗑️',
  lighting: '💡',
  facility: '🏢',
  other: '📍',
};

export const createCustomIcon = (category: string, active: boolean = false) => {
  const color = CATEGORY_COLORS[category] || '#94A3B8';
  const emoji = CATEGORY_EMOJIS[category] || '📍';
  const size = active ? 40 : 34;
  const radius = size / 2;

  return L.divIcon({
    html: `
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; width: ${size}px; height: ${size + 8}px;">
        <div style="width: ${size}px; height: ${size}px; border-radius: 50%; background-color: ${color}; border: 2.5px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.15); display: flex; align-items: center; justify-content: center; font-size: ${active ? '18px' : '15px'}; transition: all 0.2s ease;">
          ${emoji}
        </div>
        <div style="width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 8px solid ${color}; margin-top: -3px; filter: drop-shadow(0 2px 2px rgba(0,0,0,0.1));"></div>
      </div>
    `,
    className: 'custom-div-icon',
    iconSize: [size, size + 8],
    iconAnchor: [size / 2, size + 8],
    popupAnchor: [0, -size],
  });
};

// Component to dynamically fly/pan map to center
const ChangeView: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
};

export const Map: React.FC<MapProps> = ({
  issues,
  center = [-6.2088, 106.8456], // Default Jakarta
  zoom = 13,
  interactive = true,
}) => {
  useEffect(() => {
    setupDefaultMarkerIcon();
  }, []);

  return (
    <div className="w-full h-full relative" style={{ minHeight: '300px' }}>
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={interactive}
        zoomControl={interactive}
        attributionControl={interactive}
        className="w-full h-full z-0"
      >
        <ChangeView center={center} zoom={zoom} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {issues.map((issue) => (
          <Marker
            key={issue.id}
            position={[issue.latitude, issue.longitude]}
            icon={createCustomIcon(issue.category)}
          >
            {interactive && (
              <Popup className="custom-leaflet-popup">
                <div className="w-64 overflow-hidden rounded-xl bg-white text-on-surface">
                  {issue.photo_url && (
                    <img
                      src={issue.photo_url}
                      alt={issue.title}
                      className="w-full h-24 object-cover"
                    />
                  )}
                  <div className="p-4 flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <span
                        className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase"
                        style={{
                          backgroundColor: `${CATEGORY_COLORS[issue.category]}15`,
                          color: CATEGORY_COLORS[issue.category],
                        }}
                      >
                        {issue.category.replace('_', ' ')}
                      </span>
                      <div className="flex items-center gap-1 text-xs text-on-surface-variant font-medium">
                        <ThumbsUp className="w-3.5 h-3.5 text-primary" />
                        <span>{issue.upvote_count}</span>
                      </div>
                    </div>
                    <h3 className="font-semibold text-sm line-clamp-2 mt-1 leading-snug">
                      {issue.title}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-on-surface-variant mt-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>
                        {new Date(issue.created_at).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    <Link
                      href={`/issues/${issue.id}`}
                      className="mt-3 text-primary text-xs font-semibold hover:underline w-full text-center py-2 border-t border-outline-variant/30 block"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </Popup>
            )}
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default Map;
