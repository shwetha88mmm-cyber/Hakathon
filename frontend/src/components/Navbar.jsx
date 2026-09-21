import React, { useState } from 'react';
import { Compass, ShieldCheck, MapPin, Share2, Tag, MessageSquare, LayoutDashboard, LogOut, Menu, X, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar = ({ activeTab, setActiveTab }) => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const touristNavs = [
    { id: 'discovery', label: 'Discover Services', icon: Compass },
    { id: 'trust-network', label: 'Trust Network ⭐', icon: Share2 },
    { id: 'planner', label: 'Smart Trip Planner', icon: Sparkles },
    { id: 'price-check', label: 'Fair-Price Check', icon: Tag },
    { id: 'review-intelligence', label: 'Review Intelligence', icon: ShieldCheck },
    { id: 'heatmap', label: 'Tourism Heatmap', icon: MapPin },
    { id: 'feedback', label: 'Feedback', icon: MessageSquare }
  ];

  const businessNavs = [
    { id: 'business-dashboard', label: 'Business Dashboard', icon: LayoutDashboard },
    { id: 'business-insights', label: 'Demand Insights', icon: Sparkles },
    { id: 'trust-network', label: 'Ecosystem Network', icon: Share2 }
  ];

  const authorityNavs = [
    { id: 'authority-dashboard', label: 'Authority Smart Dashboard', icon: LayoutDashboard },
    { id: 'heatmap', label: 'Regional Heatmap', icon: MapPin },
    { id: 'trust-network', label: 'National Trust Network', icon: Share2 }
  ];

  const getNavList = () => {
    if (user?.role === 'BUSINESS') return businessNavs;
    if (user?.role === 'AUTHORITY') return authorityNavs;
    return touristNavs;
  };

  return (
    <nav className="navbar">
      <div className="container nav-container">
        <div className="logo" onClick={() => setActiveTab('landing')} style={{ cursor: 'pointer' }}>
          <ShieldCheck size={28} color="#0ea5e9" />
          <span>TrustTrip <span className="logo-highlight">AI</span></span>
        </div>

        {/* Desktop Links */}
        <ul className="nav-links" style={{ display: 'flex' }}>
          <li className={`nav-link ${activeTab === 'landing' ? 'active' : ''}`} onClick={() => setActiveTab('landing')}>
            Home
          </li>
          {getNavList().map(nav => {
            const Icon = nav.icon;
            return (
              <li
                key={nav.id}
                className={`nav-link ${activeTab === nav.id ? 'active' : ''}`}
                onClick={() => setActiveTab(nav.id)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer' }}
              >
                <Icon size={16} />
                <span>{nav.label}</span>
              </li>
            );
          })}
        </ul>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {user ? (
            <button className="btn btn-secondary" onClick={logout} style={{ fontSize: '0.85rem' }}>
              <LogOut size={16} /> Logout ({user.role})
            </button>
          ) : (
            <button className="btn btn-primary" onClick={() => setActiveTab('login')}>
              Login / Register
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};
