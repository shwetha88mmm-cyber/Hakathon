import React, { useState, useEffect } from 'react';
import { ShieldCheck, MapPin, Tag, Star, ArrowLeft, Phone, Share2, AlertTriangle, CheckCircle2, MessageSquare } from 'lucide-react';
import { fetchServiceDetails, submitFeedback } from '../services/api';
import { TrustBadge } from '../components/TrustBadge';

export const ServiceDetailsPage = ({ serviceId, onBack, onViewDetails }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRating, setUserRating] = useState(5);
  const [userComment, setUserComment] = useState('');
  const [feedbackSuccess, setFeedbackSuccess] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const result = await fetchServiceDetails(serviceId);
      setData(result);
    } catch (err) {
      console.error("Error fetching service details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (serviceId) loadData();
  }, [serviceId]);

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitFeedback({
        service_id: serviceId,
        user_name: 'Verified Traveler',
        rating: userRating,
        fair_price_rating: 5,
        service_quality: 5,
        comments: userComment
      });
      setFeedbackSuccess('Feedback & Ecosystem Link submitted successfully!');
      setUserComment('');
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading || !data) {
    return (
      <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <p>Loading AI Service Intelligence...</p>
      </div>
    );
  }

  const { service, trust_score, price_check, review_analysis, reviews, connected_services } = data;

  return (
    <div className="container" style={{ padding: '2.5rem 0', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <button className="btn btn-secondary" onClick={onBack} style={{ width: 'fit-content' }}>
        <ArrowLeft size={16} /> Back to Discovery
      </button>

      {/* Header Overview Card */}
      <div className="card" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <span className="badge badge-verified">{service.category}</span>
              <span style={{ fontSize: '0.88rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <MapPin size={16} color="#0ea5e9" /> {service.destination} ({service.location})
              </span>
            </div>

            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem' }}>{service.name}</h1>
            <p style={{ color: '#475569', fontSize: '0.98rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>{service.description}</p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block' }}>Listed Price Rate</span>
              <span style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0ea5e9' }}>₹{service.price_per_unit}</span>
              <span style={{ fontSize: '0.8rem', color: '#64748b', marginLeft: '0.25rem' }}>/ {service.unit_type}</span>
            </div>

            <div>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block' }}>User Rating</span>
              <span style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Star size={18} fill="#f59e0b" /> {service.rating} / 5.0
              </span>
            </div>

            <div>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block' }}>Verified Phone</span>
              <span style={{ fontSize: '0.95rem', fontWeight: 600, color: '#0f172a' }}>{service.contact_phone}</span>
            </div>
          </div>
        </div>

        {/* Right Hero Image & Trust Box */}
        <div style={{ backgroundColor: '#0f172a', color: 'white', padding: '1.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative' }}>
          <img
            src={service.image_url}
            alt={service.name}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.2 }}
          />
          <div style={{ position: 'relative', zIndex: 2 }}>
            <TrustBadge score={trust_score.trust_score} verified={trust_score.verification_status} />
            <h3 style={{ marginTop: '1rem', fontSize: '1.4rem' }}>Verified AI Intelligence</h3>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '0.35rem' }}>{trust_score.disclaimer}</p>
          </div>

          <div style={{ position: 'relative', zIndex: 2, backgroundColor: 'rgba(30, 41, 59, 0.85)', padding: '1rem', borderRadius: '8px', border: '1px solid #334155' }}>
            <span style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block' }}>Fair-Price Classifier</span>
            <strong style={{ color: price_check.status === 'NORMAL' ? '#10b981' : '#f59e0b', fontSize: '1.1rem' }}>
              {price_check.status} MARKET RATE
            </strong>
          </div>
        </div>
      </div>

      {/* 3 AI Intelligence Columns */}
      <div className="grid-3">
        {/* Trust Score Breakdown */}
        <div className="card">
          <h3 style={{ fontSize: '1.15rem', color: '#0f172a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={20} color="#10b981" />
            Trust Score Factors ({trust_score.trust_score}/100)
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {trust_score.factors.map((f, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem', backgroundColor: '#f8fafc', borderRadius: '6px', fontSize: '0.88rem' }}>
                <span style={{ color: '#475569' }}>{f.name}</span>
                <strong style={{ color: '#0f172a' }}>{f.score}</strong>
              </div>
            ))}
          </div>
        </div>

        {/* AI Fair-Price Benchmark */}
        <div className="card">
          <h3 style={{ fontSize: '1.15rem', color: '#0f172a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Tag size={20} color="#0ea5e9" />
            AI Fair-Price Intelligence
          </h3>
          <p style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: '1rem' }}>{price_check.explanation}</p>
          <div style={{ backgroundColor: '#f1f5f9', padding: '0.85rem', borderRadius: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <span>Expected Regional Range:</span>
              <strong>₹{price_check.min_normal} - ₹{price_check.max_normal}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Average Regional Rate:</span>
              <strong>₹{price_check.avg_price}</strong>
            </div>
          </div>
        </div>

        {/* Review Pattern Fraud Analysis */}
        <div className="card">
          <h3 style={{ fontSize: '1.15rem', color: '#0f172a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertTriangle size={20} color={review_analysis.flagged_patterns_count > 0 ? '#f59e0b' : '#10b981'} />
            Review Intelligence ({review_analysis.reliability_score_pct}% Verified)
          </h3>
          {review_analysis.flagged_patterns_count > 0 ? (
            <div style={{ backgroundColor: '#fef3c7', color: '#b45309', padding: '0.75rem', borderRadius: '8px', fontSize: '0.82rem', marginBottom: '0.75rem' }}>
              <strong>Pattern Alert:</strong> {review_analysis.flagged_reasons.join(' ')}
            </div>
          ) : (
            <div style={{ backgroundColor: '#d1fae5', color: '#047857', padding: '0.75rem', borderRadius: '8px', fontSize: '0.82rem', marginBottom: '0.75rem' }}>
              ✓ No duplicate or suspicious review phrasing patterns detected.
            </div>
          )}
          <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.8rem', color: '#64748b' }}>
            <span>Positive: {review_analysis.sentiment_breakdown.POSITIVE}%</span> • 
            <span>Neutral: {review_analysis.sentiment_breakdown.NEUTRAL}%</span> • 
            <span>Negative: {review_analysis.sentiment_breakdown.NEGATIVE}%</span>
          </div>
        </div>
      </div>

      {/* Connected Services in Tourism Trust Network */}
      {connected_services && connected_services.length > 0 && (
        <div className="card">
          <h3 style={{ fontSize: '1.2rem', color: '#0f172a', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Share2 size={20} color="#0ea5e9" /> Connected Ecosystem Partners (Hotel → Taxi → Guide Pathway)
          </h3>
          <div className="grid-3">
            {connected_services.map(cs => (
              <div key={cs.id} style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <span className="badge badge-trust" style={{ fontSize: '0.75rem', marginBottom: '0.5rem' }}>{cs.connection_type}</span>
                <h4 style={{ fontSize: '1rem', color: '#0f172a' }}>{cs.name}</h4>
                <p style={{ fontSize: '0.8rem', color: '#64748b' }}>{cs.category} • Trust Score: {cs.trust_score}</p>
                <button
                  className="btn btn-secondary"
                  style={{ marginTop: '0.75rem', padding: '0.35rem 0.65rem', fontSize: '0.78rem', width: '100%' }}
                  onClick={() => onViewDetails(cs.id)}
                >
                  Inspect Partner Intelligence
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reviews & Feedback Form */}
      <div className="grid-2">
        <div className="card">
          <h3 style={{ fontSize: '1.15rem', color: '#0f172a', marginBottom: '1rem' }}>User Reviews</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {reviews.map(r => (
              <div key={r.id} style={{ padding: '0.85rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                  <strong style={{ fontSize: '0.9rem', color: '#0f172a' }}>{r.user_name}</strong>
                  <span style={{ fontSize: '0.8rem', color: '#f59e0b', fontWeight: 700 }}>★ {r.rating}</span>
                </div>
                <p style={{ fontSize: '0.85rem', color: '#475569' }}>"{r.comment}"</p>
                {r.flagged_duplicate === 1 && (
                  <span style={{ fontSize: '0.72rem', color: '#dc2626', fontWeight: 700, marginTop: '0.25rem', display: 'block' }}>
                    ⚠ Flagged by AI pattern scanner (Duplicate phrasing)
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Tourist Feedback Form */}
        <div className="card">
          <h3 style={{ fontSize: '1.15rem', color: '#0f172a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MessageSquare size={20} color="#0ea5e9" /> Leave Verified Tourist Feedback
          </h3>

          {feedbackSuccess && (
            <div style={{ backgroundColor: '#d1fae5', color: '#047857', padding: '0.75rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1rem' }}>
              {feedbackSuccess}
            </div>
          )}

          <form onSubmit={handleFeedbackSubmit}>
            <div className="form-group">
              <label className="form-label">Rating (1 to 5 Stars)</label>
              <select className="form-select" value={userRating} onChange={(e) => setUserRating(Number(e.target.value))}>
                <option value={5}>5 Stars - Outstanding</option>
                <option value={4}>4 Stars - Good</option>
                <option value={3}>3 Stars - Average</option>
                <option value={2}>2 Stars - Poor</option>
                <option value={1}>1 Star - Terrible</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Feedback & Connection Phrasing</label>
              <textarea
                className="form-textarea"
                rows="4"
                placeholder="Share your honest experience and recommended taxis or guides..."
                value={userComment}
                onChange={(e) => setUserComment(e.target.value)}
                required
              ></textarea>
            </div>

            <button className="btn btn-primary" style={{ width: '100%' }}>
              Submit Feedback to Trust Network
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
