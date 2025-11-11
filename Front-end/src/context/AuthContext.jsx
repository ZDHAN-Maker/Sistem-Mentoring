import React, { createContext, useState, useEffect } from 'react';
import { checkUserSession, sanctumLogout } from '../axiosInstance';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(false);
  const [role, setRole] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // untuk menunggu verifyUser

  // Login manual (setelah berhasil dari form)
  const login = (role, userData) => {
    setAuth(true);
    setRole(role);
    setUser(userData);
  };

  // Logout
  const logout = async () => {
    try {
      await sanctumLogout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setAuth(false);
      setRole(null);
      setUser(null);
      localStorage.clear();
    }
  };

  // Cek session saat pertama kali load (auto-login setelah refresh)
  useEffect(() => {
    const verifyUser = async () => {
      try {
        const userData = await checkUserSession();
        if (userData) {
          setAuth(true);
          setUser(userData.user || userData);
          setRole(userData.role || userData.user?.role || 'guest');
        } else {
          setAuth(false);
          setUser(null);
          setRole(null);
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
      value={{
        auth,
        role,
        user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
