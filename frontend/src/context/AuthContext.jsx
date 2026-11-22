import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Sync session on initial page load
  useEffect(() => {
    const verifySession = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const res = await api.get('/auth/me');
          if (res.data?.data?.user) {
            setUser(res.data.data.user);
            localStorage.setItem('user', JSON.stringify(res.data.data.user));
          }
        } catch (error) {
          console.error('Session verification failed:', error.formattedMessage);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
          setToken(null);
        }
      }
      setLoading(false);
    };

    verifySession();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      const { user: userData, token: jwtToken } = res.data.data;

      localStorage.setItem('token', jwtToken);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      setToken(jwtToken);
      toast.success(res.data.message || 'Login successful!');
      return userData;
    } catch (error) {
      toast.error(error.formattedMessage || 'Login failed');
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const res = await api.post('/auth/register', userData);
      const { user: newUser, token: jwtToken } = res.data.data;

      localStorage.setItem('token', jwtToken);
      localStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
      setToken(jwtToken);
      toast.success(res.data.message || 'Registration successful!');
      return newUser;
    } catch (error) {
      toast.error(error.formattedMessage || 'Registration failed');
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
    toast.success('Logged out successfully');
  };

  const updateUser = (updatedUserData) => {
    setUser(updatedUserData);
    localStorage.setItem('user', JSON.stringify(updatedUserData));
  };

  const value = {
    user,
    token,
    role: user?.role || null,
    isAuthenticated: !!token && !!user,
    loading,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
