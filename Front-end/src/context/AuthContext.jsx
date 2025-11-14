import React, { createContext, useState, useEffect } from 'react';
import { api, getCsrfCookie, checkUserSession, sanctumLogout } from '../axiosInstance';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState({
    isAuthenticated: false,
    user: null,
    role: null,
  });

  const [loading, setLoading] = useState(true);

  // Cek user ketika pertama kali load
  useEffect(() => {
    const verifyUser = async () => {
      try {
        await getCsrfCookie();
        const user = await checkUserSession();

        setAuthData({
          isAuthenticated: !!user,
          user: user,
          role: user?.role ?? null,
        });
      } catch (err) {
        console.error("Auth check failed:", err);
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, []);

  // ===================== LOGIN =====================
  const login = async (email, password, remember = false) => {
    try {
      await getCsrfCookie();

      // Login TANPA X-XSRF-TOKEN manual
      await api.post('/login', { email, password, remember });

      const user = await checkUserSession();

      if (user) {
        setAuthData({
          isAuthenticated: true,
          user,
          role: user.role,
        });
        return { user, role: user.role };
      }

      throw new Error('Login berhasil tetapi gagal mengambil data user');

    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  // ===================== LOGOUT =====================
  const logout = async () => {
    try {
      await getCsrfCookie();
      await sanctumLogout();
    } catch (e) {
      console.warn("Logout error ignored:", e);
    }

    setAuthData({ isAuthenticated: false, user: null, role: null });
    localStorage.clear();
    sessionStorage.clear();
  };

  return (
    <AuthContext.Provider
      value={{
        ...authData,
        setAuthData,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
