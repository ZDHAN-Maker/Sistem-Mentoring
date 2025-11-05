import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth harus dipakai di dalam <AuthProvider>');
  }
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(false);
  const [role, setRole] = useState(null);
  const [token, setToken] = useState(null);

  const login = (newToken, newRole) => {
    setAuth(true);
    setRole(newRole);
    setToken(newToken);
  };

  const logout = () => {
    setAuth(false);
    setRole(null);
    setToken(null);
  };

  const value = { auth, role, token, login, logout };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};
