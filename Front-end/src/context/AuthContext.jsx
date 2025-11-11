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

  // 🧠 Auto login jika cookie masih aktif
  useEffect(() => {
    const verifyUser = async () => {
      try {
        const userResponse = await checkUserSession();
        if (userResponse) {
          const user = userResponse.user || userResponse;
          setAuthData({
            isAuthenticated: true,
            user,
            role: user.role || 'guest',
          });
        } else {
          setAuthData({ isAuthenticated: false, user: null, role: null });
        }
      } catch (error) {
        console.error('Gagal verifikasi session:', error);
        setAuthData({ isAuthenticated: false, user: null, role: null });
      } finally {
        setLoading(false);
      }
    };
    verifyUser();
  }, []);

  // 🧩 Fungsi login (bisa dipakai di Login.jsx)
  const login = async (email, password, rememberMe = false) => {
    await getCsrfCookie();
    await api.post(
      '/login',
      { email, password, remember: rememberMe },
      { withCredentials: true }
    );

    const userResponse = await api.get('/api/user', { withCredentials: true });
    const user = userResponse.data.user || userResponse.data;
    const role = user.role;

    setAuthData({
      isAuthenticated: true,
      user,
      role,
    });

    return { user, role };
  };

  // 🚪 Fungsi logout
  const logout = async () => {
    try {
      await sanctumLogout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setAuthData({ isAuthenticated: false, user: null, role: null });
      localStorage.clear();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        authData,
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
