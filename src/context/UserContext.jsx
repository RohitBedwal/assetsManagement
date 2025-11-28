import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize user from localStorage on app start
  useEffect(() => {
    const initializeUser = () => {
      try {
        const token = localStorage.getItem('authToken');
        const userInfo = localStorage.getItem('userInfo');
        
        if (token && userInfo) {
          const parsedUser = JSON.parse(userInfo);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error('Error parsing user info:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('userInfo');
      } finally {
        setLoading(false);
      }
    };

    initializeUser();
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('authToken', userData.token);
    localStorage.setItem('userInfo', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('userInfo');
  };

  const updateUser = (updatedData) => {
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    localStorage.setItem('userInfo', JSON.stringify(updatedUser));
  };

  // Helper functions for role checking
  const isAdmin = () => {
    if (!user) return false;
    return user?.role === 'admin' || user?.roles?.includes('admin') || user?.isAdmin === true;
  };

  const isUser = () => {
    return user?.role === 'user' || user?.roles?.includes('user');
  };

  const hasRole = (role) => {
    if (Array.isArray(user?.roles)) {
      return user.roles.includes(role);
    }
    return user?.role === role;
  };

  const hasAnyRole = (roles) => {
    if (!Array.isArray(roles)) return false;
    if (Array.isArray(user?.roles)) {
      return roles.some(role => user.roles.includes(role));
    }
    return roles.includes(user?.role);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    updateUser,
    isAdmin,
    isUser,
    hasRole,
    hasAnyRole,
    isAuthenticated: !!user && !!localStorage.getItem('authToken')
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};