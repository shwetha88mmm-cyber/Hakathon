import React, { useState, useEffect } from 'react';
import { Search, Filter, Compass, ShieldCheck, RefreshCw } from 'lucide-react';
import { ServiceCard } from '../components/ServiceCard';
import { fetchServices } from '../services/api';

export const DiscoveryPage = ({ onViewDetails }) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [destination, setDestination] = useState('All');
  const [minTrustScore, setMinTrustScore] = useState(0);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchServices({
        search,
        category: category !== 'All' ? category : undefined,
        destination: destination !== 'All' ? destination : undefined,
        min_trust_score: minTrustScore > 0 ? minTrustScore : undefined
      });
      setServices(data);
    } catch (err) {
      console.error("Failed to load services:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [category, destination, minTrustScore]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadData();
  };

  return (
    <div className="container" style={{ padding: '2.5rem 0', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Title Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0ea5e9', fontWeight: 800, fontSize: '0.9rem', uppercase: 'true' }}>
          <Compass size={18} /> Smart Tourism Discovery Engine
        </div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', marginTop: '0.25rem' }}>
          Discover AI-Verified Tourism Services
        </h1>
        <p style={{ color: '#64748b', fontSize: '1rem', marginTop: '0.25rem' }}>
          Filter hotels, taxis, guides, activities and local businesses backed by verified Trust Scores and Fair-Price intelligence.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="card" style={{ backgroundColor: '#ffffff', padding: '1.25rem' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr auto', gap: '1rem', alignItems: 'end' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Search Query</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Search resort, guide name, water sports..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
              />
              <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Category</label>
            <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="All">All Categories</option>
              <option value="Hotel">Hotel & Stay</option>
              <option value="Taxi">Taxi & Transport</option>
              <option value="Guide">Tour Guide</option>
              <option value="Activity">Adventure & Activity</option>
              <option value="Local Business">Local Craft / Dining</option>
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Destination</label>
            <select className="form-select" value={destination} onChange={(e) => setDestination(e.target.value)}>
              <option value="All">All Destinations</option>
              <option value="Goa">Goa</option>
              <option value="Jaipur">Jaipur</option>
              <option value="Kerala">Kerala</option>
              <option value="Bengaluru">Bengaluru</option>
              <option value="Mysuru">Mysuru</option>
              <option value="Hyderabad">Hyderabad</option>
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Min Trust Score</label>
            <select className="form-select" value={minTrustScore} onChange={(e) => setMinTrustScore(Number(e.target.value))}>
              <option value={0}>Any Trust Score</option>
              <option value={80}>80+ Verified High Trust</option>
              <option value={90}>90+ Premium AI Verified</option>
            </select>
          </div>

          <button className="btn btn-primary" style={{ padding: '0.75rem 1.25rem' }}>
            <Search size={18} /> Search
          </button>
        </form>
      </div>

      {/* Services Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: '#64748b' }}>
          <RefreshCw size={32} className="spin" style={{ marginBottom: '1rem', color: '#0ea5e9' }} />
          <p>Querying SQLite Database and Computing AI Trust Indexes...</p>
        </div>
      ) : services.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem 0', color: '#64748b' }}>
          <h3>No matching services found</h3>
          <p style={{ marginTop: '0.5rem' }}>Try clearing filters or searching for another location.</p>
        </div>
      ) : (
        <div className="grid-3">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} onViewDetails={onViewDetails} />
          ))}
        </div>
      )}
    </div>
  );
};
