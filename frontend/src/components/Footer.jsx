import React from 'react';
import { ShieldCheck, Heart, MapPin, Mail, Phone } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem', paddingBottom: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.3rem', fontWeight: 800, color: 'white', marginBottom: '0.75rem' }}>
            <ShieldCheck size={26} color="#0ea5e9" />
            <span>TrustTrip AI</span>
          </div>
          <p style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>
            AI-Powered Tourism Trust & Growth Platform connecting Tourists ↔ Hotels ↔ Taxis ↔ Guides ↔ Local Businesses with trust intelligence and network insights.
          </p>
        </div>

        <div>
          <h4 style={{ color: 'white', marginBottom: '0.75rem' }}>Core Intelligence</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
            <li>Tourism Trust Network ⭐</li>
            <li>AI Fair-Price Benchmark</li>
            <li>Review Pattern Fraud Detection</li>
            <li>Smart Trip Recommendation</li>
            <li>Geographic Tourism Heatmap</li>
          </ul>
        </div>

        <div>
          <h4 style={{ color: 'white', marginBottom: '0.75rem' }}>Supported Destinations</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
            <li>Goa Beaches & Heritage</li>
            <li>Jaipur Forts & Palaces</li>
            <li>Kerala Backwaters & Tea Gardens</li>
            <li>Bengaluru Tech & Garden Hub</li>
            <li>Mysuru Heritage & Silk</li>
            <li>Hyderabad Charminar & Cuisine</li>
          </ul>
        </div>

        <div>
          <h4 style={{ color: 'white', marginBottom: '0.75rem' }}>Contact & SIH Support</h4>
          <p style={{ fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <Mail size={16} color="#0ea5e9" /> support@trusttrip.ai
          </p>
          <p style={{ fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <Phone size={16} color="#0ea5e9" /> +91 1800-TRUST-TRIP
          </p>
          <p style={{ fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin size={16} color="#0ea5e9" /> SIH Hackathon 2026 Submission
          </p>
        </div>
      </div>

      <div style={{ borderTop: '1px solid #334155', textAlign: 'center', paddingTop: '1.25rem', fontSize: '0.85rem' }}>
        <p>© 2026 TrustTrip AI. Built for Smart India Hackathon. Solving Tourism Intelligence with AI & Data Networks.</p>
      </div>
    </footer>
  );
};
