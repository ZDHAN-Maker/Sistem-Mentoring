// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { checkUserSession, sanctumLogout } from '../axiosInstance';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(false);
  const [role, setRole] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = (role, userData) => {
    setAuth(true);
    setRole(role);
    setUser(userData);
  };

  const logout = async () => {
    try {
      await sanctumLogout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setAuth(false);
      setRole(null);
      setUser(null);
    }
  };

  const setAuthData = ({ isAuthenticated, user, role }) => {
    setAuth(isAuthenticated);
    setUser(user);
    setRole(role);
  };

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const userData = await checkUserSession();
        if (userData) {
          setAuth(true);
          setUser(userData.user || userData);
          setRole(userData.role);
        } else {
          setAuth(false);
        }
      } catch (error) {
        console.error('Gagal cek session:', error);
        setAuth(false);
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{ auth, role, user, login, logout, setAuthData, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
