import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('trusttrip_user');
    return saved ? JSON.parse(saved) : { id: 1, name: 'Demo Tourist', email: 'tourist@trusttrip.ai', role: 'TOURIST' };
  });

  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem('trusttrip_user', JSON.stringify(userData));
    localStorage.setItem('trusttrip_token', token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('trusttrip_user');
    localStorage.removeItem('trusttrip_token');
  };

  const switchRole = (newRole) => {
    const updatedUser = {
      ...user,
      role: newRole,
      name: newRole === 'BUSINESS' ? 'Sunset Hospitality Owner' : newRole === 'AUTHORITY' ? 'Tourism Ministry Officer' : 'Demo Tourist',
      email: `${newRole.toLowerCase()}@trusttrip.ai`
    };
    setUser(updatedUser);
    localStorage.setItem('trusttrip_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
