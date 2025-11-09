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
    localStorage.setItem('token', token);
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

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await api.get('/sanctum/csrf-cookie'); // tambahkan ini
        const response = await api.get('/api/users');
        if (response.data.auth) {
          setAuth(true);
          setRole(response.data.role);
          setUser(response.data.user);
        } else {
          setAuth(false);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      }
    };

    // Hanya panggil checkAuth jika token ada
    if (token) checkAuth();
  }, [token]);

  return (
    <AuthContext.Provider
      value={{ auth, role, token, user, login, logout, registerUser, errorMessage }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
