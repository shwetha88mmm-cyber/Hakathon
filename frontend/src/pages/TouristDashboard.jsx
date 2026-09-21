import React, { useState, useEffect } from 'react';
import { Compass, Sparkles, Tag, ShieldCheck, Share2, MapPin, ArrowRight } from 'lucide-react';
import { fetchServices } from '../services/api';
import { ServiceCard } from '../components/ServiceCard';

export const TouristDashboard = ({ onNavigate, onViewDetails }) => {
  const [topServices, setTopServices] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const list = await fetchServices({ min_trust_score: 90 });
        setTopServices(list.slice(0, 3));
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, []);

  return (
    <div className="container" style={{ padding: '2.5rem 0', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      {/* Welcome Banner */}
      <div className="card" style={{ background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)', color: 'white', padding: '2.5rem' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          Welcome back to TrustTrip AI! 👋
        </h1>
        <p style={{ fontSize: '1.05rem', color: '#e0f2fe', maxWidth: '600px' }}>
          Your AI Tourism Portal for verified accommodations, transparent cab pricing, honest guides, and ecosystem network recommendations.
        </p>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
          <button className="btn btn-accent" onClick={() => onNavigate('planner')}>
            <Sparkles size={18} /> Plan Custom Trip
          </button>
          <button className="btn btn-secondary" onClick={() => onNavigate('trust-network')}>
            <Share2 size={18} /> Explore Tourism Trust Network ⭐
          </button>
        </div>
      </div>

      {/* Quick AI Tools Grid */}
      <div>
        <h2 style={{ fontSize: '1.5rem', color: '#0f172a', marginBottom: '1rem' }}>AI Intelligence Tools</h2>
        <div className="grid-3">
          <div className="card card-interactive" onClick={() => onNavigate('price-check')}>
            <Tag size={28} color="#10b981" style={{ marginBottom: '0.75rem' }} />
            <h3 style={{ fontSize: '1.1rem', color: '#0f172a' }}>Fair-Price Check</h3>
            <p style={{ fontSize: '0.88rem', color: '#64748b', marginTop: '0.25rem' }}>
              Verify whether a quoted hotel or taxi price is normal or unusually inflated.
            </p>
          </div>

          <div className="card card-interactive" onClick={() => onNavigate('review-intelligence')}>
            <ShieldCheck size={28} color="#6366f1" style={{ marginBottom: '0.75rem' }} />
            <h3 style={{ fontSize: '1.1rem', color: '#0f172a' }}>Review Intelligence</h3>
            <p style={{ fontSize: '0.88rem', color: '#64748b', marginTop: '0.25rem' }}>
              Scan reviews for duplicate copy-pasted wording and fake review patterns.
            </p>
          </div>

          <div className="card card-interactive" onClick={() => onNavigate('heatmap')}>
            <MapPin size={28} color="#ec4899" style={{ marginBottom: '0.75rem' }} />
            <h3 style={{ fontSize: '1.1rem', color: '#0f172a' }}>Geographic Heatmap</h3>
            <p style={{ fontSize: '0.88rem', color: '#64748b', marginTop: '0.25rem' }}>
              Explore Leaflet + OpenStreetMap tourism demand clusters and verified pins.
            </p>
          </div>
        </div>
      </div>

      {/* Top High-Trust Services */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.5rem', color: '#0f172a' }}>Featured Verified Providers</h2>
          <button className="btn btn-secondary" onClick={() => onNavigate('discovery')}>
            View All Services <ArrowRight size={16} />
          </button>
        </div>

        <div className="grid-3">
          {topServices.map(s => (
            <ServiceCard key={s.id} service={s} onViewDetails={onViewDetails} />
          ))}
        </div>
      </div>
    </div>
  );
};
