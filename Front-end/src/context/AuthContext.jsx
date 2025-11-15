import React, { createContext, useState, useEffect } from "react";
import { api, getCsrfCookie, sanctumLogout } from "../axiosInstance";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState({
    isAuthenticated: false,
    user: null,
    role: null,
  });

  const [loading, setLoading] = useState(true);

  // ⬇⬇ Tambahkan ini untuk cek login saat refresh
  useEffect(() => {
    const checkUser = async () => {
      try {
        await getCsrfCookie();
        const res = await api.get("/user");
        const user = res.data;

        setAuthData({
          isAuthenticated: true,
          user,
          role: user.role,
        });

      } catch {
        setAuthData({
          isAuthenticated: false,
          user: null,
          role: null,
        });
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);
  const login = async (email, password, remember = false) => {
    await getCsrfCookie();

    const res = await api.post("/login", {
      email,
      password,
      remember,
    });

    const user = res.data.user;

    setAuthData({
      isAuthenticated: true,
      user,
      role: user.role,
    });

    return user;
  };

  const logout = async () => {
    await sanctumLogout();
    setAuthData({
      isAuthenticated: false,
      user: null,
      role: null,
    });
  };

  return (
    <AuthContext.Provider value={{ ...authData, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
