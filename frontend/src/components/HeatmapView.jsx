import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, ShieldCheck, Star } from 'lucide-react';

// Fix Leaflet marker icon issue in Webpack/Vite
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

export const HeatmapView = ({ points, center = [15.2993, 74.1240], zoom = 10, onViewDetails }) => {
  if (!points || points.length === 0) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading Tourism Heatmap...</div>;
  }

  return (
    <div style={{ width: '100%', height: '520px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
      <MapContainer center={center} zoom={zoom} style={{ width: '100%', height: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {points.map((p) => (
          <Marker key={p.id} position={[p.lat, p.lng]} icon={defaultIcon}>
            <Popup>
              <div style={{ padding: '0.2rem', minWidth: '180px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0ea5e9', textTransform: 'uppercase' }}>
                  {p.category} • {p.destination}
                </span>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: '0.25rem 0', color: '#0f172a' }}>{p.name}</h4>
                <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0 0 0.5rem 0' }}>{p.location}</p>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#10b981' }}>
                    Trust Score: {p.trust_score}/100
                  </span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0ea5e9' }}>
                    ₹{p.price}
                  </span>
                </div>

                {onViewDetails && (
                  <button
                    onClick={() => onViewDetails(p.id)}
                    style={{ width: '100%', padding: '0.35rem', backgroundColor: '#0ea5e9', color: 'white', border: 'none', borderRadius: '4px', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
                  >
                    View Service Details
                  </button>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};
