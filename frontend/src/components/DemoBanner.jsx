import React from 'react';
import { ShieldCheck, Sparkles, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const DemoBanner = () => {
  const { user, switchRole } = useAuth();

  return (
    <div style={{ background: 'linear-gradient(90deg, #0f172a 0%, #1e293b 100%)', color: 'white', padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={16} color="#0ea5e9" />
          <span><strong>SIH Hackathon Live Demo Mode</strong> — Local Python FastAPI + NetworkX AI Engine Connected</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ color: '#94a3b8' }}><UserCheck size={14} inline="true" /> Active Role: <strong>{user?.role || 'GUEST'}</strong></span>
          <div style={{ display: 'flex', gap: '0.25rem' }}>
            <button
              onClick={() => switchRole('TOURIST')}
              style={{ padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', background: user?.role === 'TOURIST' ? '#0ea5e9' : '#334155', color: 'white' }}
            >
              Tourist View
            </button>
            <button
              onClick={() => switchRole('BUSINESS')}
              style={{ padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', background: user?.role === 'BUSINESS' ? '#6366f1' : '#334155', color: 'white' }}
            >
              Business View
            </button>
            <button
              onClick={() => switchRole('AUTHORITY')}
              style={{ padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', background: user?.role === 'AUTHORITY' ? '#10b981' : '#334155', color: 'white' }}
            >
              Authority View
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
