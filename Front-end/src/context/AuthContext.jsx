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

  useEffect(() => {
    const verifyUser = async () => {
      try {
        // 🔹 Pastikan cookie CSRF diambil dulu sebelum /user
        await getCsrfCookie()
        const userResponse = await checkUserSession();

        if (userResponse && (userResponse.id || userResponse.user)) {
          const user = userResponse.user || userResponse;
          setAuthData({
            isAuthenticated: true,
            user,
            role: user.role || 'guest',
          });
        } else {await getCsrfCookie();
          setAuthData({ isAuthenticated: false, user: null, role: null });
        }
      } catch {
        setAuthData({ isAuthenticated: false, user: null, role: null });
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, []);


  // Fungsi login
  const login = async (email, password, rememberMe = false) => {
    await getCsrfCookie(); // wajib sebelum POST /login
    await api.post(
      '/login',
      { email, password, remember: rememberMe },
      { withCredentials: true }
    );

    const userResponse = await api.get('/api/user', { withCredentials: true });
    const user = userResponse.data.user || userResponse.data;
    const role = user.role;

    setAuthData({ isAuthenticated: true, user, role });
    return { user, role };
  };

  // Fungsi logout
  const logout = async () => {
    try {
      await getCsrfCookie();
      await sanctumLogout();

      // Hapus state & storage
      setAuthData({ isAuthenticated: false, user: null, role: null });
      localStorage.clear();
      sessionStorage.clear();

      // Hapus header XSRF jika ada
      delete api.defaults.headers.common['X-XSRF-TOKEN'];
    } catch (error) {
      console.error('Logout error:', error);
      // tetap bersihkan state agar UI tidak menampilkan user
      setAuthData({ isAuthenticated: false, user: null, role: null });
      localStorage.clear();
      sessionStorage.clear();
    }
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
