// src/context/AuthContext.js
import React, { createContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(false);
  const [role, setRole] = useState(null);
  const [token, setToken] = useState(null);

  // Fungsi login menerima token & role
  const login = (token, role) => {
    setAuth(true);
    setRole(role);
    setToken(token);
  };

  const logout = () => {
    setAuth(false);
    setRole(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ auth, role, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
