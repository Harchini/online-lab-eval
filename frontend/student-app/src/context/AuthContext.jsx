import React, { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';

// Advanced React Technique: Context API for global state management
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = useCallback(async (regNo, password) => {
    const { data } = await axios.post('/api/auth/login', { regNo, password, role: 'student' });
    localStorage.setItem('user', JSON.stringify(data));
    setUser(data);
    return data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('user');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook: useAuth
export const useAuth = () => useContext(AuthContext);
