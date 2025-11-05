// src/context/AuthContext.js
import React, { createContext, useState } from 'react';

// Membuat context
const AuthContext = createContext();

// Komponen provider untuk AuthContext
export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(false);
  const [role, setRole] = useState(null);

  // Fungsi untuk mengubah status auth dan role
  const login = (role) => {
    setAuth(true);
    setRole(role);
  };

  const logout = () => {
    setAuth(false);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ auth, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
