import React, { useState, useEffect, createContext } from 'react';
import { api } from '../api/index.js'; 

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  useEffect(() => {
    if (token) {
      try {

        const payload = JSON.parse(atob(token.split('.')[1]));
        
     
        if (payload.exp * 1000 < Date.now()) {
          logout(); 
        } else {
          setUser(payload.user);
          setIsAuthenticated(true);

          if (api?.defaults?.headers?.common) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          }
        }
      } catch (error) {
        console.error('Failed to decode token:', error);
        logout(); 
      }
    }
    setLoading(false);
  }, [token]);

  const login = (newToken) => {
    localStorage.setItem('token', newToken);

    if (api?.defaults?.headers?.common) {
      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    }
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('token');

    if (api?.defaults?.headers?.common) {
      delete api.defaults.headers.common['Authorization'];
    }
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };


  const useCan = () => (module, action) => {
    return user?.permissions?.[module]?.[action] || false;
  };

  const value = {
    token,
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    useCan, 
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background text-foreground">
        <svg className="w-8 h-8 mr-3 -ml-1 text-primary animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span className="text-lg">Loading...</span>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};