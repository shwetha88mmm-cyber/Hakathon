import React, { useState, useEffect } from 'react';
import { ShieldCheck, MapPin, Share2, Layers, AlertTriangle, TrendingUp, RefreshCw } from 'lucide-react';
import { fetchAuthorityDashboard } from '../services/api';

export const AuthorityDashboard = ({ onNavigate }) => {
  const [data, setData] = useState(null);
  const [destination, setDestination] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetchAuthorityDashboard(destination);
        setData(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [destination]);

  if (loading || !data) {
    return (
      <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <RefreshCw size={32} className="spin" color="#10b981" style={{ marginBottom: '1rem' }} />
        <p>Loading Smart Tourism Authority Governance Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2.5rem 0', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', fontWeight: 800, fontSize: '0.9rem' }}>
            <ShieldCheck size={18} /> Government & Ministry Governance Intelligence Portal
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', marginTop: '0.25rem' }}>
            Smart Tourism Authority Dashboard
          </h1>
        </div>

        <select className="form-select" value={destination} onChange={(e) => setDestination(e.target.value)} style={{ width: '180px' }}>
          <option value="All">National Overview</option>
          <option value="Goa">Goa Sector</option>
          <option value="Jaipur">Jaipur Sector</option>
          <option value="Kerala">Kerala Sector</option>
        </select>
      </div>

      {/* Macro Stats */}
      <div className="grid-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <div className="card" style={{ borderLeft: '4px solid #10b981' }}>
          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>National Average Trust Score</span>
          <h2 style={{ fontSize: '2rem', color: '#10b981', marginTop: '0.25rem' }}>{data.national_average_trust_score}/100</h2>
          <span style={{ fontSize: '0.78rem', color: '#10b981' }}>✓ Quality Threshold Met</span>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #0ea5e9' }}>
          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Registered Mapped Services</span>
          <h2 style={{ fontSize: '2rem', color: '#0ea5e9', marginTop: '0.25rem' }}>{data.total_registered_services} Providers</h2>
          <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Across {data.active_destinations} Major Destinations</span>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #6366f1' }}>
          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Ecosystem Trust Connections</span>
          <h2 style={{ fontSize: '2rem', color: '#6366f1', marginTop: '0.25rem' }}>{data.trust_network_summary.total_connections} Edges</h2>
          <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Hotel → Taxi → Guide Pathways</span>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #f59e0b' }}>
          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Scam / Overcharge Risk Alerts</span>
          <h2 style={{ fontSize: '2rem', color: '#f59e0b', marginTop: '0.25rem' }}>{data.flagged_scam_warnings} Active Flag</h2>
          <span style={{ fontSize: '0.78rem', color: '#f59e0b' }}>Low Regional Risk Level</span>
        </div>
      </div>

      {/* Regional Trust & Category Distribution Grid */}
      <div className="grid-2">
        <div className="card">
          <h3 style={{ fontSize: '1.15rem', color: '#0f172a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin size={20} color="#0ea5e9" /> Regional Trust Scores by Destination
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {data.regional_trust_scores.map((reg, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontWeight: 700, color: '#0f172a' }}>{reg.destination}</span>
                <div>
                  <span className="badge badge-trust" style={{ fontSize: '0.78rem' }}>{roundVal(reg.avg_trust)}/100 Avg Trust</span>
                  <span style={{ fontSize: '0.78rem', color: '#64748b', marginLeft: '0.5rem' }}>({reg.count} services)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 style={{ fontSize: '1.15rem', color: '#0f172a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Layers size={20} color="#6366f1" /> Service Distribution Breakdown
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {data.service_distribution.map((cat, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontWeight: 700, color: '#0f172a' }}>{cat.category}</span>
                <strong style={{ color: '#6366f1' }}>{cat.count} Registered Providers</strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Discovered Tourism Connection Pathways */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.15rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Share2 size={20} color="#10b981" /> Discovered Tourism Ecosystem Pathways
          </h3>
          <button className="btn btn-secondary" onClick={() => onNavigate('trust-network')}>
            Open Full Trust Network Graph
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {data.trust_network_summary.top_pathways.map((path, idx) => (
            <div key={idx} style={{ padding: '0.85rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a' }}>{path.path}</span>
              <span className="badge badge-normal" style={{ fontSize: '0.75rem' }}>{path.repeat_frequency}x Repeat Telemetry</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

function roundVal(val) {
  return typeof val === 'number' ? val.toFixed(1) : val;
}
