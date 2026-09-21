import React, { useState, useEffect } from 'react';
import { MessageSquare, CheckCircle2, Share2, Star } from 'lucide-react';
import { fetchServices, submitFeedback } from '../services/api';

export const FeedbackPage = () => {
  const [services, setServices] = useState([]);
  const [serviceId, setServiceId] = useState(1);
  const [connectedServiceId, setConnectedServiceId] = useState('');
  const [userName, setUserName] = useState('Verified Traveler');
  const [rating, setRating] = useState(5);
  const [fairPriceRating, setFairPriceRating] = useState(5);
  const [serviceQuality, setServiceQuality] = useState(5);
  const [comments, setComments] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadServices = async () => {
      try {
        const list = await fetchServices();
        setServices(list);
        if (list.length > 0) setServiceId(list[0].id);
      } catch (err) {
        console.error(err);
      }
    };
    loadServices();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await submitFeedback({
        service_id: Number(serviceId),
        connected_service_id: connectedServiceId ? Number(connectedServiceId) : null,
        user_name: userName,
        rating: Number(rating),
        fair_price_rating: Number(fairPriceRating),
        service_quality: Number(serviceQuality),
        comments
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '2.5rem 0', maxWidth: '680px' }}>
      <div className="card" style={{ padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <MessageSquare size={36} color="#0ea5e9" style={{ marginBottom: '0.5rem' }} />
          <h1 style={{ fontSize: '1.8rem', color: '#0f172a' }}>Submit Tourist Feedback</h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Help strengthen the Tourism Trust Network by rating your service and linking recommended local providers.
          </p>
        </div>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <CheckCircle2 size={48} color="#10b981" style={{ marginBottom: '1rem' }} />
            <h3 style={{ color: '#0f172a', marginBottom: '0.5rem' }}>Feedback & Ecosystem Connection Logged!</h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Your feedback has updated the service's Trust Score and strengthened the network edge graph.
            </p>
            <button className="btn btn-primary" onClick={() => setSubmitted(false)}>
              Submit Another Review
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Primary Service Used</label>
              <select className="form-select" value={serviceId} onChange={(e) => setServiceId(e.target.value)}>
                {services.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.category} • {s.destination})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Connected Partner Service (Optional Ecosystem Link)</label>
              <select className="form-select" value={connectedServiceId} onChange={(e) => setConnectedServiceId(e.target.value)}>
                <option value="">None / Standalone</option>
                {services.filter(s => s.id !== Number(serviceId)).map(s => (
                  <option key={s.id} value={s.id}>
                    Link to: {s.name} ({s.category})
                  </option>
                ))}
              </select>
              <span style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.2rem' }}>
                Example: If your hotel recommended a specific taxi or guide, select them here to build the Trust Network!
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Overall Rating (1 to 5 Stars)</label>
                <select className="form-select" value={rating} onChange={(e) => setRating(e.target.value)}>
                  <option value={5}>5 Stars - Outstanding</option>
                  <option value={4}>4 Stars - Good</option>
                  <option value={3}>3 Stars - Average</option>
                  <option value={2}>2 Stars - Poor</option>
                  <option value={1}>1 Star - Poor</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Fair Price Rating (1 to 5)</label>
                <select className="form-select" value={fairPriceRating} onChange={(e) => setFairPriceRating(e.target.value)}>
                  <option value={5}>5 - Excellent Fair Price</option>
                  <option value={4}>4 - Reasonable Price</option>
                  <option value={3}>3 - Slightly Pricey</option>
                  <option value={2}>2 - Overcharged</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Your Review Comments</label>
              <textarea
                className="form-textarea"
                rows="4"
                placeholder="Share clean details about your experience..."
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                required
              ></textarea>
            </div>

            <button className="btn btn-primary" style={{ width: '100%', padding: '0.85rem' }} disabled={loading}>
              {loading ? 'Submitting to AI Engine...' : 'Submit Feedback & Network Link'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
