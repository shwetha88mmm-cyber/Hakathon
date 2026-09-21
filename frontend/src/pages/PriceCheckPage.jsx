import React, { useState } from 'react';
import { Tag, ShieldCheck, AlertCircle, CheckCircle2, Search } from 'lucide-react';
import { runPriceCheck } from '../services/api';

export const PriceCheckPage = () => {
  const [destination, setDestination] = useState('Goa');
  const [category, setCategory] = useState('Hotel');
  const [price, setPrice] = useState(3500);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await runPriceCheck({ destination, category, price });
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '2.5rem 0', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', fontWeight: 800, fontSize: '0.9rem' }}>
          <Tag size={18} /> AI Fair-Price Benchmark & Anomaly Classifier
        </div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', marginTop: '0.25rem' }}>
          Check Price Integrity Before You Pay
        </h1>
        <p style={{ color: '#64748b', fontSize: '1rem', marginTop: '0.25rem' }}>
          Instantly verify whether a quoted hotel, taxi, guide or activity rate is normal or unusually inflated for that region.
        </p>
      </div>

      <div className="grid-2">
        {/* Form Card */}
        <div className="card">
          <h3 style={{ fontSize: '1.2rem', color: '#0f172a', marginBottom: '1.25rem' }}>Price Lookup Form</h3>

          <form onSubmit={handleCheck}>
            <div className="form-group">
              <label className="form-label">Destination</label>
              <select className="form-select" value={destination} onChange={(e) => setDestination(e.target.value)}>
                <option value="Goa">Goa</option>
                <option value="Jaipur">Jaipur</option>
                <option value="Kerala">Kerala</option>
                <option value="Bengaluru">Bengaluru</option>
                <option value="Mysuru">Mysuru</option>
                <option value="Hyderabad">Hyderabad</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Service Category</label>
              <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="Hotel">Hotel & Accommodation</option>
                <option value="Taxi">Taxi & Cab Transfer</option>
                <option value="Guide">Tour Guide Service</option>
                <option value="Activity">Adventure / Water Sports</option>
                <option value="Local Business">Local Craft / Emporium</option>
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label">Quoted Price (₹ INR)</label>
              <input
                type="number"
                className="form-input"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                min="100"
                step="50"
                required
              />
            </div>

            <button className="btn btn-primary" style={{ width: '100%', padding: '0.85rem' }} disabled={loading}>
              {loading ? 'Evaluating Regional Benchmarks...' : 'Run AI Price Verification'}
            </button>
          </form>
        </div>

        {/* Results Card */}
        <div className="card">
          {result ? (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Verification Result</span>
                <span className={`badge ${result.status === 'NORMAL' ? 'badge-normal' : result.status === 'SLIGHTLY HIGH' ? 'badge-warning' : 'badge-danger'}`}>
                  {result.status}
                </span>
              </div>

              <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0ea5e9', marginBottom: '0.25rem' }}>
                ₹{result.entered_price}
              </h2>
              <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                For {result.category} in {result.destination}
              </p>

              <div style={{ backgroundColor: '#f8fafc', padding: '1.25rem', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '0.95rem', color: '#0f172a', marginBottom: '0.5rem' }}>AI Decision Explanation</h4>
                <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: '1.5' }}>{result.explanation}</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.88rem' }}>
                <div style={{ padding: '0.75rem', backgroundColor: '#f1f5f9', borderRadius: '6px' }}>
                  <span style={{ color: '#64748b', display: 'block' }}>Expected Market Range</span>
                  <strong style={{ color: '#0f172a' }}>₹{result.min_normal} - ₹{result.max_normal}</strong>
                </div>
                <div style={{ padding: '0.75rem', backgroundColor: '#f1f5f9', borderRadius: '6px' }}>
                  <span style={{ color: '#64748b', display: 'block' }}>Variance from Avg Rate</span>
                  <strong style={{ color: result.difference_pct > 20 ? '#dc2626' : '#10b981' }}>
                    {result.difference_pct > 0 ? `+${result.difference_pct}%` : `${result.difference_pct}%`}
                  </strong>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#64748b' }}>
              <Tag size={40} color="#10b981" style={{ marginBottom: '1rem' }} />
              <h3>Enter a price quote on the left</h3>
              <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>Our backend price classifier will check regional database statistics and output instant fair-price decisioning.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
