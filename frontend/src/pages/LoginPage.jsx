import React, { useState } from 'react';
import { ShieldCheck, UserCheck, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../services/api';

export const LoginPage = ({ onNavigate }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('tourist@trusttrip.ai');
  const [password, setPassword] = useState('demo123');
  const [role, setRole] = useState('TOURIST');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await loginUser({ email, password });
      login(data.user, data.token);

      if (data.user.role === 'BUSINESS') onNavigate('business-dashboard');
      else if (data.user.role === 'AUTHORITY') onNavigate('authority-dashboard');
      else onNavigate('discovery');
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '4rem 0', maxWidth: '480px' }}>
      <div className="card" style={{ padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <ShieldCheck size={40} color="#0ea5e9" style={{ marginBottom: '0.5rem' }} />
          <h2 style={{ fontSize: '1.6rem', color: '#0f172a' }}>Sign in to TrustTrip AI</h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.25rem' }}>Access your personalized tourism intelligence suite</p>
        </div>

        {error && (
          <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '0.75rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Role Selection</label>
            <select
              className="form-select"
              value={role}
              onChange={(e) => {
                const selectedRole = e.target.value;
                setRole(selectedRole);
                if (selectedRole === 'BUSINESS') setEmail('hotel@trusttrip.ai');
                else if (selectedRole === 'AUTHORITY') setEmail('authority@trusttrip.ai');
                else setEmail('tourist@trusttrip.ai');
              }}
            >
              <option value="TOURIST">Tourist / Traveler</option>
              <option value="BUSINESS">Tourism Business (Hotel, Taxi, Guide)</option>
              <option value="AUTHORITY">Tourism Authority / Ministry Officer</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="btn btn-primary" style={{ width: '100%', padding: '0.85rem' }} disabled={loading}>
            {loading ? 'Authenticating...' : 'Sign In'} <ArrowRight size={16} />
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.88rem', color: '#64748b' }}>
          Don't have an account?{' '}
          <span style={{ color: '#0ea5e9', fontWeight: 700, cursor: 'pointer' }} onClick={() => onNavigate('register')}>
            Register here
          </span>
        </div>
      </div>
    </div>
  );
};
