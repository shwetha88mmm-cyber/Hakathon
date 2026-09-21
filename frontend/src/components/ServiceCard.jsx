import React from 'react';
import { MapPin, Star, Phone, ArrowRight, Tag, ShieldCheck } from 'lucide-react';
import { TrustBadge } from './TrustBadge';

export const ServiceCard = ({ service, onViewDetails }) => {
  return (
    <div className="card card-interactive" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '0', overflow: 'hidden' }}>
      <div style={{ position: 'relative', height: '180px', width: '100%', backgroundColor: '#e2e8f0' }}>
        <img
          src={service.image_url || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800"}
          alt={service.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
          <span style={{ backgroundColor: 'rgba(15, 23, 42, 0.85)', color: 'white', padding: '0.25rem 0.65rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, backdropFilter: 'blur(4px)' }}>
            {service.category}
          </span>
        </div>
        <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
          <TrustBadge score={service.trust_score} verified={service.verified} />
        </div>
      </div>

      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <MapPin size={14} color="#0ea5e9" /> {service.destination} ({service.location.split(',')[0]})
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.85rem', fontWeight: 700, color: '#f59e0b' }}>
              <Star size={14} fill="#f59e0b" /> {service.rating} <span style={{ color: '#94a3b8', fontWeight: 400 }}>({service.review_count || 12})</span>
            </span>
          </div>

          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem', lineHeight: '1.3' }}>
            {service.name}
          </h3>

          <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: '1.4', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {service.description}
          </p>
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9', marginBottom: '1rem' }}>
            <div>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0ea5e9' }}>₹{service.price_per_unit}</span>
              <span style={{ fontSize: '0.78rem', color: '#94a3b8', marginLeft: '0.25rem' }}>/ {service.unit_type || 'unit'}</span>
            </div>
            <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700, backgroundColor: '#d1fae5', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>
              AI Verified Fair Price
            </span>
          </div>

          <button
            className="btn btn-primary"
            onClick={() => onViewDetails(service.id)}
            style={{ width: '100%', fontSize: '0.88rem' }}
          >
            <span>View Intelligence & Details</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
