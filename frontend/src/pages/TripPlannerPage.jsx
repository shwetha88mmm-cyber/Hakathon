import React, { useState } from 'react';
import { Sparkles, MapPin, Calendar, DollarSign, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';
import { generateTrip } from '../services/api';

export const TripPlannerPage = ({ onViewDetails }) => {
  const [destination, setDestination] = useState('Goa');
  const [budget, setBudget] = useState(10000);
  const [days, setDays] = useState(3);
  const [interests, setInterests] = useState(['Beaches', 'Food', 'Sightseeing']);
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await generateTrip({ destination, budget, days, interests });
      setItinerary(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleInterest = (item) => {
    if (interests.includes(item)) {
      setInterests(interests.filter(i => i !== item));
    } else {
      setInterests([...interests, item]);
    }
  };

  return (
    <div className="container" style={{ padding: '2.5rem 0', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6366f1', fontWeight: 800, fontSize: '0.9rem' }}>
          <Sparkles size={18} /> AI Smart Trip Recommendation Engine
        </div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', marginTop: '0.25rem' }}>
          Custom Budget & Day-Wise Itinerary Planner
        </h1>
        <p style={{ color: '#64748b', fontSize: '1rem', marginTop: '0.25rem' }}>
          Enter your destination, budget, and travel preferences. Our AI selects top-rated verified service providers (Trust Score ≥ 80).
        </p>
      </div>

      <div className="grid-2">
        {/* Input Form */}
        <div className="card">
          <h3 style={{ fontSize: '1.2rem', color: '#0f172a', marginBottom: '1.25rem' }}>Trip Preferences</h3>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Destination</label>
              <select className="form-select" value={destination} onChange={(e) => setDestination(e.target.value)}>
                <option value="Goa">Goa (Beaches & Nightlife)</option>
                <option value="Jaipur">Jaipur (Palaces & Royal Heritage)</option>
                <option value="Kerala">Kerala (Backwaters & Ayurveda)</option>
                <option value="Bengaluru">Bengaluru (Tech & Garden Parks)</option>
                <option value="Mysuru">Mysuru (Royal Palace & Silk)</option>
                <option value="Hyderabad">Hyderabad (Charminar & Cuisine)</option>
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Total Budget (₹ INR)</label>
                <input
                  type="number"
                  className="form-input"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  min="2000"
                  step="500"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Number of Days</label>
                <input
                  type="number"
                  className="form-input"
                  value={days}
                  onChange={(e) => setDays(Number(e.target.value))}
                  min="1"
                  max="7"
                  required
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label">Travel Interests</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.35rem' }}>
                {['Beaches', 'Sightseeing', 'Food & Dining', 'Water Sports', 'Heritage Walk', 'Craft Shopping'].map(item => (
                  <button
                    type="button"
                    key={item}
                    onClick={() => toggleInterest(item)}
                    style={{
                      padding: '0.4rem 0.85rem',
                      borderRadius: '20px',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      backgroundColor: interests.includes(item) ? '#0ea5e9' : '#f1f5f9',
                      color: interests.includes(item) ? 'white' : '#475569',
                      border: '1px solid #cbd5e1'
                    }}
                  >
                    {item} {interests.includes(item) ? '✓' : '+'}
                  </button>
                ))}
              </div>
            </div>

            <button className="btn btn-primary" style={{ width: '100%', padding: '0.85rem' }} disabled={loading}>
              {loading ? 'AI Generating Day-wise Itinerary...' : 'Generate AI Trip Recommendation'}
            </button>
          </form>
        </div>

        {/* Output Itinerary Display */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {itinerary ? (
            <div>
              <div className="card" style={{ backgroundColor: '#0f172a', color: 'white', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span className="badge badge-trust">AI Optimized Itinerary</span>
                  <span style={{ fontSize: '0.82rem', color: itinerary.budget_status === 'WITHIN_BUDGET' ? '#10b981' : '#f59e0b' }}>
                    {itinerary.budget_status === 'WITHIN_BUDGET' ? '✓ Within Budget' : '⚠ Exceeds Budget'}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '0.25rem' }}>{days}-Day {destination} Trip Plan</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.88rem' }}>{itinerary.summary}</p>

                <div style={{ display: 'flex', gap: '2rem', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #334155' }}>
                  <div>
                    <span style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block' }}>Allocated Budget</span>
                    <strong style={{ fontSize: '1.2rem', color: 'white' }}>₹{itinerary.allocated_budget}</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block' }}>Estimated Cost</span>
                    <strong style={{ fontSize: '1.2rem', color: '#0ea5e9' }}>₹{itinerary.estimated_total_cost}</strong>
                  </div>
                </div>
              </div>

              {/* Day-by-Day Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {itinerary.itinerary.map(day => (
                  <div key={day.day} className="card">
                    <h4 style={{ fontSize: '1.1rem', color: '#0f172a', marginBottom: '0.5rem' }}>{day.title}</h4>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.88rem', color: '#475569' }}>
                      <div style={{ padding: '0.4rem 0.6rem', backgroundColor: '#f8fafc', borderRadius: '6px' }}>
                        <strong>🏨 Hotel Stay:</strong> {day.hotel}
                      </div>
                      <div style={{ padding: '0.4rem 0.6rem', backgroundColor: '#f8fafc', borderRadius: '6px' }}>
                        <strong>🚖 Transport:</strong> {day.transport}
                      </div>
                      <div style={{ padding: '0.4rem 0.6rem', backgroundColor: '#f8fafc', borderRadius: '6px' }}>
                        <strong>🚩 Local Guide:</strong> {day.guide}
                      </div>
                    </div>

                    <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0ea5e9', display: 'block', marginBottom: '0.4rem' }}>Scheduled Activities:</span>
                      {day.activities.map((act, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', padding: '0.25rem 0' }}>
                          <span>{act.time} — <strong>{act.title}</strong> ({act.location})</span>
                          <strong style={{ color: '#0ea5e9' }}>₹{act.cost}</strong>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem', color: '#64748b' }}>
              <Sparkles size={40} color="#0ea5e9" style={{ marginBottom: '1rem' }} />
              <h3>Your AI Itinerary will appear here</h3>
              <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>Configure your destination and budget on the left to generate customized day-wise recommendations.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
