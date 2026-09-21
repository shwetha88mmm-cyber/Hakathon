import React, { useState, useEffect } from 'react';
import { ShieldCheck, AlertTriangle, CheckCircle2, MessageSquare, RefreshCw } from 'lucide-react';
import { fetchServices, runReviewAnalysis } from '../services/api';

export const ReviewIntelligencePage = () => {
  const [services, setServices] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState(1);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadServices = async () => {
      try {
        const list = await fetchServices();
        setServices(list);
        if (list.length > 0) {
          setSelectedServiceId(list[0].id);
        }
      } catch (err) {
        console.error(err);
      }
    };
    loadServices();
  }, []);

  const handleAnalyze = async (serviceId) => {
    setSelectedServiceId(serviceId);
    setLoading(true);
    try {
      const data = await runReviewAnalysis(serviceId);
      setAnalysis(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedServiceId) {
      handleAnalyze(selectedServiceId);
    }
  }, [selectedServiceId]);

  return (
    <div className="container" style={{ padding: '2.5rem 0', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6366f1', fontWeight: 800, fontSize: '0.9rem' }}>
          <ShieldCheck size={18} /> Algorithmic Review Authenticity & Sentiment Analyzer
        </div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', marginTop: '0.25rem' }}>
          Review Intelligence Inspector
        </h1>
        <p style={{ color: '#64748b', fontSize: '1rem', marginTop: '0.25rem' }}>
          Scans reviews for suspicious copy-pasted phrasing, generic bot clusters, and computes a verified Review Reliability Index.
        </p>
      </div>

      <div className="grid-3">
        {/* Service Selector Panel */}
        <div className="card">
          <h3 style={{ fontSize: '1.1rem', color: '#0f172a', marginBottom: '1rem' }}>Select Service to Inspect</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '420px', overflowY: 'auto' }}>
            {services.map(s => (
              <button
                key={s.id}
                onClick={() => setSelectedServiceId(s.id)}
                style={{
                  textAlign: 'left',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: selectedServiceId === s.id ? '2px solid #6366f1' : '1px solid #e2e8f0',
                  backgroundColor: selectedServiceId === s.id ? '#eef2ff' : 'white',
                  color: '#0f172a'
                }}
              >
                <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>{s.name}</div>
                <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{s.category} • {s.destination}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Results Panel */}
        <div className="card" style={{ gridColumn: 'span 2' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem 0' }}>
              <RefreshCw size={32} className="spin" color="#6366f1" style={{ marginBottom: '1rem' }} />
              <p>Scanning text patterns and evaluating review clusters...</p>
            </div>
          ) : analysis ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #f1f5f9' }}>
                <div>
                  <h2 style={{ fontSize: '1.5rem', color: '#0f172a' }}>
                    Service #{analysis.service_id} Review Scan
                  </h2>
                  <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Total Analyzed Reviews: {analysis.total_reviews}</span>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block' }}>Review Reliability Index</span>
                  <strong style={{ fontSize: '1.8rem', color: analysis.reliability_score_pct >= 80 ? '#10b981' : '#dc2626' }}>
                    {analysis.reliability_score_pct}%
                  </strong>
                </div>
              </div>

              {/* Pattern Warnings */}
              {analysis.flagged_patterns_count > 0 ? (
                <div style={{ backgroundColor: '#fee2e2', border: '1px solid #fca5a5', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#dc2626', fontWeight: 700, marginBottom: '0.35rem' }}>
                    <AlertTriangle size={18} /> Suspicious Pattern Detected
                  </div>
                  <ul style={{ listStylePosition: 'inside', fontSize: '0.88rem', color: '#7f1d1d' }}>
                    {analysis.flagged_reasons.map((reason, idx) => (
                      <li key={idx}>{reason}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div style={{ backgroundColor: '#d1fae5', border: '1px solid #6ee7b7', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#047857', fontWeight: 700 }}>
                    <CheckCircle2 size={18} /> Clean Review Pattern Passed
                  </div>
                  <p style={{ fontSize: '0.88rem', color: '#065f46', marginTop: '0.25rem' }}>
                    No duplicate phrasing clusters or inorganic text patterns identified in current review records.
                  </p>
                </div>
              )}

              {/* Sentiment Breakdown */}
              <h4 style={{ fontSize: '1rem', color: '#0f172a', marginBottom: '0.75rem' }}>Sentiment Distribution</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', textAlign: 'center' }}>
                <div style={{ padding: '1rem', backgroundColor: '#d1fae5', borderRadius: '8px' }}>
                  <span style={{ color: '#047857', fontSize: '0.8rem', fontWeight: 700 }}>POSITIVE</span>
                  <strong style={{ display: 'block', fontSize: '1.5rem', color: '#047857', marginTop: '0.25rem' }}>
                    {analysis.sentiment_breakdown.POSITIVE}%
                  </strong>
                </div>

                <div style={{ padding: '1rem', backgroundColor: '#f1f5f9', borderRadius: '8px' }}>
                  <span style={{ color: '#475569', fontSize: '0.8rem', fontWeight: 700 }}>NEUTRAL</span>
                  <strong style={{ display: 'block', fontSize: '1.5rem', color: '#475569', marginTop: '0.25rem' }}>
                    {analysis.sentiment_breakdown.NEUTRAL}%
                  </strong>
                </div>

                <div style={{ padding: '1rem', backgroundColor: '#fee2e2', borderRadius: '8px' }}>
                  <span style={{ color: '#dc2626', fontSize: '0.8rem', fontWeight: 700 }}>NEGATIVE</span>
                  <strong style={{ display: 'block', fontSize: '1.5rem', color: '#dc2626', marginTop: '0.25rem' }}>
                    {analysis.sentiment_breakdown.NEGATIVE}%
                  </strong>
                </div>
              </div>

              <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '1.5rem', fontStyle: 'italic' }}>
                {analysis.disclaimer}
              </p>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem 0' }}>Select a service on the left</div>
          )}
        </div>
      </div>
    </div>
  );
};
