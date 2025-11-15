import React, { createContext, useState } from "react";
import { api, getCsrfCookie, sanctumLogout } from "../axiosInstance";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState({
    isAuthenticated: false,
    user: null,
    role: null,
  });

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
    <AuthContext.Provider value={{ ...authData, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
