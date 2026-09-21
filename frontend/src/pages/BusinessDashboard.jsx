import React, { useState, useEffect } from 'react';
import { LayoutDashboard, TrendingUp, ShieldCheck, Users, Share2, Tag, ArrowRight, Star } from 'lucide-react';
import { fetchBusinessInsights } from '../services/api';

export const BusinessDashboard = ({ onNavigate }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchBusinessInsights();
        setData(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading || !data) {
    return (
      <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <p>Loading Business Growth Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2.5rem 0', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6366f1', fontWeight: 800, fontSize: '0.9rem' }}>
            <LayoutDashboard size={18} /> Business Growth & Intelligence Portal
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', marginTop: '0.25rem' }}>
            {data.business_name}
          </h1>
        </div>

        <button className="btn btn-primary" onClick={() => onNavigate('business-insights')}>
          View Deep Demand Analytics <ArrowRight size={16} />
        </button>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <div className="card" style={{ borderLeft: '4px solid #10b981' }}>
          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Ecosystem Trust Score</span>
          <h2 style={{ fontSize: '2rem', color: '#10b981', marginTop: '0.25rem' }}>{data.overall_trust_score}/100</h2>
          <span style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 700 }}>✓ Verified Business Partner</span>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #0ea5e9' }}>
          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Tourist Interest Index</span>
          <h2 style={{ fontSize: '2rem', color: '#0ea5e9', marginTop: '0.25rem' }}>{data.tourist_interest_pct}%</h2>
          <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Top 10% in Goa Region</span>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #6366f1' }}>
          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Regional Demand Trend</span>
          <h2 style={{ fontSize: '1.4rem', color: '#6366f1', marginTop: '0.5rem' }}>{data.demand_trend}</h2>
          <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Peak Season Growth</span>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #f59e0b' }}>
          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Connected Network Partners</span>
          <h2 style={{ fontSize: '2rem', color: '#f59e0b', marginTop: '0.25rem' }}>{data.connected_partners_count} Services</h2>
          <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Hotel → Taxi → Guide Links</span>
        </div>
      </div>

      {/* Tourist Interest & Price Competitiveness */}
      <div className="grid-2">
        <div className="card">
          <h3 style={{ fontSize: '1.15rem', color: '#0f172a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Users size={20} color="#0ea5e9" /> Tourist Interest by Category
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {data.tourist_interests_breakdown.map((item, idx) => (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '0.35rem' }}>
                  <span>{item.interest}</span>
                  <strong>{item.percentage}% Interest</strong>
                </div>
                <div style={{ width: '100%', height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${item.percentage}%`, height: '100%', backgroundColor: '#0ea5e9' }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 style={{ fontSize: '1.15rem', color: '#0f172a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Star size={20} color="#f59e0b" /> Recent Customer Reviews & Feedback
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {data.recent_reviews.map(r => (
              <div key={r.id} style={{ padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#0f172a' }}>
                  <span>{r.user_name}</span>
                  <span style={{ color: '#f59e0b' }}>★ {r.rating}</span>
                </div>
                <p style={{ color: '#475569', marginTop: '0.2rem' }}>"{r.comment}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
