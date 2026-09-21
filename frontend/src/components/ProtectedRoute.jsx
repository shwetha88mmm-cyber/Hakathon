import React from 'react';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <h2>Authentication Required</h2>
        <p>Please log in to access this page.</p>
      </div>
    );
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <h2>Access Restricted</h2>
        <p>Your current role ({user.role}) does not have permission to view this view.</p>
        <p>Use the demo banner role switcher above to switch to {allowedRoles.join(' or ')}.</p>
      </div>
    );
  }

  return children;
};
