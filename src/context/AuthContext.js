// =============================================
//  RHYTHMIX — Auth Context
// =============================================
import React, { createContext, useContext, useState } from 'react';
import { USERS } from '../data/songs';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('rhythmix_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (username, password) => {
    const found = USERS.find(
      u => u.username === username && u.password === password
    );
    if (found) {
      const userData = { username: found.username, name: found.name, avatar: found.avatar };
      setUser(userData);
      localStorage.setItem('rhythmix_user', JSON.stringify(userData));
      return { success: true };
    }
    return { success: false, error: 'Invalid username or password' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('rhythmix_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
