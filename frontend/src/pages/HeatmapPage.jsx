import React, { useState, useEffect } from 'react';
import { MapPin, RefreshCw, Layers } from 'lucide-react';
import { HeatmapView } from '../components/HeatmapView';
import { fetchHeatmapData } from '../services/api';

export const HeatmapPage = ({ onViewDetails }) => {
  const [destination, setDestination] = useState('Goa');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const destinationCenters = {
    'Goa': { center: [15.2993, 74.1240], zoom: 10 },
    'Jaipur': { center: [26.9124, 75.7873], zoom: 11 },
    'Kerala': { center: [9.9312, 76.2673], zoom: 9 },
    'Bengaluru': { center: [12.9716, 77.5946], zoom: 11 },
    'Mysuru': { center: [12.2958, 76.6394], zoom: 12 },
    'Hyderabad': { center: [17.3850, 78.4867], zoom: 11 },
    'All': { center: [15.2993, 74.1240], zoom: 6 }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetchHeatmapData(destination);
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [destination]);

  const mapConfig = destinationCenters[destination] || destinationCenters['Goa'];

  return (
    <div className="container" style={{ padding: '2.5rem 0', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ec4899', fontWeight: 800, fontSize: '0.9rem' }}>
            <MapPin size={18} /> OpenStreetMap & Leaflet Integration
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', marginTop: '0.25rem' }}>
            Tourism Intelligence Heatmap
          </h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>Region Focus:</label>
          <select
            className="form-select"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            style={{ width: '180px' }}
          >
            <option value="Goa">Goa Corridor</option>
            <option value="Jaipur">Jaipur Pink City</option>
            <option value="Kerala">Kerala Backwaters</option>
            <option value="Bengaluru">Bengaluru Hub</option>
            <option value="Mysuru">Mysuru Royal Belt</option>
            <option value="Hyderabad">Hyderabad Monument Zone</option>
            <option value="All">All Regions</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <RefreshCw size={32} className="spin" color="#ec4899" style={{ marginBottom: '1rem' }} />
          <p>Fetching geospatial markers for {destination}...</p>
        </div>
      ) : data ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <HeatmapView
            points={data.points}
            center={mapConfig.center}
            zoom={mapConfig.zoom}
            onViewDetails={onViewDetails}
          />

          {/* Map Summary Bar */}
          <div className="grid-3">
            <div className="card">
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Mapped Locations</span>
              <h3 style={{ fontSize: '1.5rem', color: '#0f172a' }}>{data.total_locations} Active Pins</h3>
            </div>

            <div className="card">
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Map Provider</span>
              <h3 style={{ fontSize: '1.5rem', color: '#0ea5e9' }}>Leaflet + OpenStreetMap</h3>
            </div>

            <div className="card">
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Cost / API Key Dependency</span>
              <h3 style={{ fontSize: '1.5rem', color: '#10b981' }}>0 INR (Open Source)</h3>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
