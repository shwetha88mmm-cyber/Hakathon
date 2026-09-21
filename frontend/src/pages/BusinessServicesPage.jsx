import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Plus, CheckCircle, ShieldCheck } from 'lucide-react';
import { fetchServices, createService } from '../services/api';

export const BusinessServicesPage = ({ onViewDetails }) => {
  const [services, setServices] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Hotel');
  const [destination, setDestination] = useState('Goa');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState(2500);

  const load = async () => {
    try {
      const list = await fetchServices();
      setServices(list);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { load(); }, []);

  const handleAddService = async (e) => {
    e.preventDefault();
    try {
      await createService({
        name,
        category,
        destination,
        location: location || `${destination} Beach Road`,
        lat: 15.2993,
        lng: 74.1240,
        price_per_unit: Number(price),
        unit_type: 'per day',
        description: 'New verified business listing registered on TrustTrip AI platform.'
      });
      setShowAddModal(false);
      setName('');
      load();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container" style={{ padding: '2.5rem 0', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a' }}>My Listed Services & Providers</h1>
          <p style={{ color: '#64748b' }}>Manage your verified services, pricing benchmarks, and ecosystem links.</p>
        </div>

        <button className="btn btn-primary" onClick={() => setShowAddModal(!showAddModal)}>
          <Plus size={18} /> Register New Service
        </button>
      </div>

      {showAddModal && (
        <div className="card" style={{ backgroundColor: '#ffffff', border: '2px solid #0ea5e9' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Add Service to Tourism Trust Ecosystem</h3>
          <form onSubmit={handleAddService} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Service Name</label>
              <input type="text" className="form-input" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="Hotel">Hotel</option>
                <option value="Taxi">Taxi</option>
                <option value="Guide">Guide</option>
                <option value="Activity">Activity</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Destination</label>
              <select className="form-select" value={destination} onChange={(e) => setDestination(e.target.value)}>
                <option value="Goa">Goa</option>
                <option value="Jaipur">Jaipur</option>
                <option value="Kerala">Kerala</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Price Rate (₹ INR)</label>
              <input type="number" className="form-input" value={price} onChange={(e) => setPrice(e.target.value)} required />
            </div>

            <div style={{ gridColumn: 'span 2' }}>
              <button className="btn btn-primary">Submit Service for Verification</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid-3">
        {services.map(s => (
          <div key={s.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <span className="badge badge-trust" style={{ fontSize: '0.75rem', marginBottom: '0.5rem' }}>{s.category}</span>
              <h3 style={{ fontSize: '1.1rem', color: '#0f172a' }}>{s.name}</h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b' }}>{s.destination} • Trust Score: {s.trust_score}/100</p>
            </div>

            <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong style={{ color: '#0ea5e9' }}>₹{s.price_per_unit}</strong>
              <button className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '0.35rem 0.65rem' }} onClick={() => onViewDetails(s.id)}>
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
