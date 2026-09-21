import React from 'react';
import { ShieldCheck, Compass, Sparkles, Share2, Tag, MapPin, CheckCircle, ArrowRight, TrendingUp, Lock } from 'lucide-react';

export const LandingPage = ({ onNavigate }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem', paddingBottom: '4rem' }}>
      {/* Hero Section */}
      <section style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: 'white', padding: '5rem 0', borderBottom: '1px solid #334155' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '3rem', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'rgba(14, 165, 233, 0.15)', color: '#38bdf8', padding: '0.4rem 1rem', borderRadius: '30px', fontSize: '0.88rem', fontWeight: 700, marginBottom: '1.5rem', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
              <Sparkles size={16} /> SIH 2026 Innovation Platform
            </div>

            <h1 style={{ fontSize: '3.2rem', fontWeight: 800, lineHeight: '1.15', marginBottom: '1.25rem' }}>
              Travel with confidence.<br />
              <span style={{ color: '#0ea5e9' }}>Discover with Trust.</span>
            </h1>

            <p style={{ fontSize: '1.15rem', color: '#94a3b8', lineHeight: '1.6', marginBottom: '2rem', maxWidth: '600px' }}>
              AI-powered tourism ecosystem that connects tourists, hotels, travel providers, guides, and local businesses — solving tourism-specific trust, price gouging, review fraud, and network intelligence.
            </p>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button className="btn btn-primary" style={{ padding: '0.85rem 1.75rem', fontSize: '1.05rem' }} onClick={() => onNavigate('discovery')}>
                <Compass size={20} /> Explore Tourism
              </button>
              <button className="btn btn-accent" style={{ padding: '0.85rem 1.75rem', fontSize: '1.05rem' }} onClick={() => onNavigate('planner')}>
                <Sparkles size={20} /> Plan My Trip
              </button>
            </div>
          </div>

          {/* Quick Hero Widget */}
          <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '1.75rem', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0ea5e9', textTransform: 'uppercase' }}>Live Ecosystem Check</span>
              <span className="badge badge-trust">AI Verification Active</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ padding: '1rem', backgroundColor: '#0f172a', borderRadius: '10px', border: '1px solid #334155' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.35rem' }}>
                  <span>Sample Provider</span>
                  <span style={{ color: '#10b981', fontWeight: 700 }}>94/100 Trust Score</span>
                </div>
                <h4 style={{ color: 'white', fontSize: '1rem' }}>Taj Bay Resort Calangute</h4>
                <p style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '0.2rem' }}>Goa • Hotel • AI Fair Price Checked (₹3,800/night)</p>
              </div>

              <div style={{ padding: '1rem', backgroundColor: '#0f172a', borderRadius: '10px', border: '1px solid #334155' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.35rem' }}>
                  <span>Ecosystem Network Pathway</span>
                  <span style={{ color: '#38bdf8', fontWeight: 700 }}>NetworkX Graph</span>
                </div>
                <p style={{ color: 'white', fontSize: '0.85rem', fontWeight: 600 }}>
                  Taj Resort → Goa Express Taxi → Heritage Guide Rahul → Baga Activity
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why TrustTrip AI Section */}
      <section className="container">
        <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 3rem auto' }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem' }}>
            Why TrustTrip AI over General Search Engines?
          </h2>
          <p style={{ color: '#64748b', fontSize: '1.05rem', lineHeight: '1.6' }}>
            Existing platforms mainly allow users to search and book. Google Maps is great for navigation. TrustTrip AI solves the <strong>tourism-specific intelligence problem</strong> that search engines were never designed to answer.
          </p>
        </div>

        <div className="grid-3">
          <div className="card card-interactive" onClick={() => onNavigate('trust-network')}>
            <Share2 size={32} color="#0ea5e9" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#0f172a' }}>Tourism Trust Network ⭐</h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.5' }}>
              Reveals repeated connections across services (Hotel → Taxi → Guide → Activity) to uncover trustworthy local tourism ecosystems.
            </p>
          </div>

          <div className="card card-interactive" onClick={() => onNavigate('price-check')}>
            <Tag size={32} color="#10b981" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#0f172a' }}>AI Fair-Price Check</h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.5' }}>
              Compares listed prices with real-time regional benchmarks to instantly protect tourists from unexpected overcharging.
            </p>
          </div>

          <div className="card card-interactive" onClick={() => onNavigate('review-intelligence')}>
            <ShieldCheck size={32} color="#6366f1" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#0f172a' }}>Review Intelligence</h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.5' }}>
              Algorithmic review analysis detects duplicate phrasing patterns, spam clusters, and calculates a true Review Reliability Index.
            </p>
          </div>
        </div>
      </section>

      {/* Featured AI Features Grid */}
      <section style={{ backgroundColor: '#f1f5f9', padding: '4rem 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            <div className="card" onClick={() => onNavigate('planner')} style={{ cursor: 'pointer' }}>
              <Sparkles size={28} color="#0ea5e9" style={{ marginBottom: '0.75rem' }} />
              <h4 style={{ fontSize: '1.1rem', marginBottom: '0.35rem' }}>Smart Trip Recommendation</h4>
              <p style={{ color: '#64748b', fontSize: '0.88rem' }}>AI constructs personalized day-wise itineraries matching your exact budget and interests.</p>
            </div>

            <div className="card" onClick={() => onNavigate('heatmap')} style={{ cursor: 'pointer' }}>
              <MapPin size={28} color="#ec4899" style={{ marginBottom: '0.75rem' }} />
              <h4 style={{ fontSize: '1.1rem', marginBottom: '0.35rem' }}>Tourism Intelligence Heatmap</h4>
              <p style={{ color: '#64748b', fontSize: '0.88rem' }}>Interactive Leaflet + OpenStreetMap visualization of regional tourist activity and trust hotspots.</p>
            </div>

            <div className="card" onClick={() => onNavigate('business-dashboard')} style={{ cursor: 'pointer' }}>
              <TrendingUp size={28} color="#f59e0b" style={{ marginBottom: '0.75rem' }} />
              <h4 style={{ fontSize: '1.1rem', marginBottom: '0.35rem' }}>Business Growth Insights</h4>
              <p style={{ color: '#64748b', fontSize: '0.88rem' }}>Allows hotels and travel providers to understand tourist demand trends and local partnerships.</p>
            </div>

            <div className="card" onClick={() => onNavigate('authority-dashboard')} style={{ cursor: 'pointer' }}>
              <Lock size={28} color="#10b981" style={{ marginBottom: '0.75rem' }} />
              <h4 style={{ fontSize: '1.1rem', marginBottom: '0.35rem' }}>Authority Governance Dashboard</h4>
              <p style={{ color: '#64748b', fontSize: '0.88rem' }}>Gives tourism ministries and local authorities macro overview of tourism safety, demand, and quality.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
