import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import L from 'leaflet';
import TrustBadge from './TrustBadge';
import { MapPin, Navigation } from 'lucide-react';

// Custom Leaflet marker icons using standard CDN icons
const createCustomIcon = (color) => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `<div style="
      background-color: ${color};
      width: 18px;
      height: 18px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 0 10px ${color};
    "></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9]
  });
};

const categoryMapColors = {
  Hotel: '#0284c7',
  Taxi: '#eab308',
  Guide: '#a855f7',
  Activity: '#10b981',
  Restaurant: '#f43f5e'
};

export default function HeatmapMap({ points = [], center = [15.4989, 73.8278], zoom = 7 }) {
  // Default fallback points if empty
  const defaultPoints = [
    { id: 1, name: "Baga Bay Heritage Resort", category: "Hotel", location: "Goa", lat: 15.5524, lng: 73.7517, trust_score: 93.5, price_inr: 3500 },
    { id: 2, name: "Goa Express Coastal Cabs", category: "Taxi", location: "Goa", lat: 15.4989, lng: 73.8278, trust_score: 91.0, price_inr: 1200 },
    { id: 3, name: "The Pavilion Heritage Hotel", category: "Hotel", location: "Bengaluru", lat: 12.9716, lng: 77.5946, trust_score: 92.0, price_inr: 4200 },
    { id: 4, name: "Royal Mysore Palace Grand Hotel", category: "Hotel", location: "Mysuru", lat: 12.3052, lng: 76.6552, trust_score: 94.0, price_inr: 2900 },
    { id: 5, name: "Alleppey Emerald Houseboat", category: "Hotel", location: "Kerala", lat: 9.4981, lng: 76.3388, trust_score: 96.5, price_inr: 4500 },
    { id: 6, name: "Pink City Palace Haveli", category: "Hotel", location: "Rajasthan", lat: 26.9124, lng: 75.7873, trust_score: 95.0, price_inr: 4800 },
    { id: 7, name: "Pearl City Nizam Stay", category: "Hotel", location: "Hyderabad", lat: 17.3850, lng: 78.4867, trust_score: 91.0, price_inr: 3800 }
  ];

  const mapPoints = points.length > 0 ? points : defaultPoints;

  return (
    <div className="w-full h-[500px] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl relative">
      
      {/* Map Legend Overlay */}
      <div className="absolute top-3 right-3 bg-slate-950/90 backdrop-blur border border-slate-800 p-3 rounded-xl z-[400] text-xs space-y-1.5 shadow-xl">
        <span className="font-bold text-slate-300 block mb-1">Service Categories</span>
        <div className="flex items-center gap-2 text-slate-300">
          <span className="w-3 h-3 rounded-full bg-cyan-500 inline-block"></span> Hotels
        </div>
        <div className="flex items-center gap-2 text-slate-300">
          <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span> Taxis
        </div>
        <div className="flex items-center gap-2 text-slate-300">
          <span className="w-3 h-3 rounded-full bg-purple-500 inline-block"></span> Guides
        </div>
        <div className="flex items-center gap-2 text-slate-300">
          <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span> Activities
        </div>
      </div>

      <MapContainer center={center} zoom={zoom} scrollWheelZoom={true} className="w-full h-full">
        {/* OpenStreetMap Dark / Standard Tiles */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Heatmap Activity Circle Pulsers & Service Markers */}
        {mapPoints.map((pt) => {
          const color = categoryMapColors[pt.category] || '#0284c7';
          return (
            <React.Fragment key={`map-pt-${pt.id}`}>
              {/* Heatmap Activity Concentration Circle */}
              <CircleMarker
                center={[pt.lat, pt.lng]}
                radius={25}
                pathOptions={{
                  fillColor: color,
                  fillOpacity: 0.2,
                  color: color,
                  weight: 1
                }}
              />

              {/* Service Marker */}
              <Marker
                position={[pt.lat, pt.lng]}
                icon={createCustomIcon(color)}
              >
                <Popup>
                  <div className="p-1 space-y-2 min-w-[200px]">
                    <div className="flex items-start justify-between">
                      <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">{pt.category}</span>
                      <span className="text-xs font-bold text-emerald-400">₹{pt.price_inr?.toLocaleString('en-IN')}</span>
                    </div>
                    <h4 className="text-sm font-bold text-white leading-tight">{pt.name}</h4>
                    <div className="flex items-center gap-1.5 text-xs text-slate-300">
                      <MapPin className="w-3.5 h-3.5 text-amber-400" />
                      <span>{pt.location}</span>
                    </div>
                    <div className="pt-1">
                      <TrustBadge score={pt.trust_score} size="sm" />
                    </div>
                  </div>
                </Popup>
              </Marker>
            </React.Fragment>
          );
        })}
      </MapContainer>
    </div>
  );
}
