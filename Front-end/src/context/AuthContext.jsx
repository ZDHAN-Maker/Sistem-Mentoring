import React, { createContext, useState, useEffect } from 'react';
import { api } from '../axiosInstance';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(false);
  const [role, setRole] = useState(localStorage.getItem('role') || null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [user, setUser] = useState(null);
  const [errorMessage] = useState('');

  const login = (token, role) => {
    setAuth(true);
    setRole(role);
    setToken(token);
    localStorage.setItem('role', role);
    if (token) localStorage.setItem('token', token);
  };

  const logout = () => {
    setAuth(false);
    setRole(null);
    setToken(null);
    setUser(null);
    localStorage.clear();
  };

  const registerUser = (userData) => {
    setUser(userData);
    setAuth(false);
    setRole('mentee');
  };

  const setAuthData = ({ isAuthenticated, user, role }) => {
    setAuth(isAuthenticated);
    setUser(user);
    setRole(role);
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await api.get('/sanctum/csrf-cookie');
        const response = await api.get('/api/user'); // ✅ fix disini
        if (response.data) {
          setAuth(true);
          setRole(response.data.role);
          setUser(response.data);
        } else {
          setAuth(false);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      }
    };

    if (token) checkAuth();
  }, [token]);

  return (
    <AuthContext.Provider
      value={{ auth, role, token, user, login, logout, registerUser, errorMessage, setAuthData }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
