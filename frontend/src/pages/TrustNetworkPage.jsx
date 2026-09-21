import React, { useState, useEffect } from 'react';
import { Share2, Filter, RefreshCw } from 'lucide-react';
import { NetworkGraph } from '../components/NetworkGraph';
import { fetchTrustNetwork } from '../services/api';

export const TrustNetworkPage = ({ onViewDetails }) => {
  const [destination, setDestination] = useState('All');
  const [networkData, setNetworkData] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadNetwork = async () => {
    setLoading(true);
    try {
      const data = await fetchTrustNetwork(destination);
      setNetworkData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNetwork();
  }, [destination]);

  return (
    <div className="container" style={{ padding: '2.5rem 0', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0ea5e9', fontWeight: 800, fontSize: '0.9rem' }}>
            <Share2 size={18} /> Signature Feature: Tourism Trust Network
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', marginTop: '0.25rem' }}>
            Ecosystem Connection Graph (Hotel → Taxi → Guide → Activity)
          </h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>Filter Destination:</label>
          <select
            className="form-select"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            style={{ width: '180px' }}
          >
            <option value="All">All Destinations</option>
            <option value="Goa">Goa</option>
            <option value="Jaipur">Jaipur</option>
            <option value="Kerala">Kerala</option>
            <option value="Bengaluru">Bengaluru</option>
            <option value="Mysuru">Mysuru</option>
            <option value="Hyderabad">Hyderabad</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <RefreshCw size={32} className="spin" color="#0ea5e9" style={{ marginBottom: '1rem' }} />
          <p>Constructing NetworkX Directed Graph for {destination}...</p>
        </div>
      ) : (
        <NetworkGraph networkData={networkData} onSelectService={onViewDetails} />
      )}
    </div>
  );
};
