import React, { useState, useEffect } from 'react';
import { ShieldCheck, AlertTriangle, Star } from 'lucide-react';
import { fetchBusinessInsights } from '../services/api';

export const BusinessReviewsPage = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchBusinessInsights();
        setReviews(res.recent_reviews || []);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, []);

  return (
    <div className="container" style={{ padding: '2.5rem 0', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a' }}>Review Monitoring & Fraud Risk Alerts</h1>
        <p style={{ color: '#64748b' }}>Monitor customer feedback and review pattern security scans.</p>
      </div>

      <div className="card">
        <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Customer Review Log</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {reviews.map(r => (
            <div key={r.id} style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <strong style={{ fontSize: '0.95rem', color: '#0f172a' }}>{r.user_name}</strong>
                <span style={{ color: '#f59e0b', fontWeight: 700 }}>★ {r.rating} / 5</span>
              </div>
              <p style={{ fontSize: '0.9rem', color: '#475569' }}>"{r.comment}"</p>
              {r.flagged_duplicate === 1 && (
                <span className="badge badge-danger" style={{ marginTop: '0.5rem', fontSize: '0.75rem' }}>
                  ⚠ AI Scanner Flag: Duplicate Wording Pattern Detected
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
