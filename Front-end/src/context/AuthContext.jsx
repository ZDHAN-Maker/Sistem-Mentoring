// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import { api } from '../axiosInstance'; // Ensure this is configured with withCredentials

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(false);
  const [role, setRole] = useState(null);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Login function: store user, role, and token in context
  const login = (token, role) => {
    setAuth(true);
    setRole(role);
    setToken(token);
  };

  // Logout function: clear the context and token
  const logout = () => {
    setAuth(false);
    setRole(null);
    setToken(null);
    setUser(null);
    // You may want to clear cookies or session storage here as well
  };

  // Register function: assign default role and user data
  const registerUser = (userData) => {
    setUser(userData);
    setAuth(false); // Automatically not logged in after registration
    setRole('mentee'); // Default role
  };

  // Checking authentication status by calling /users endpoint
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get('/users'); // API call to check authentication
        if (response.data.auth) {
          setAuth(true);
          setRole(response.data.role);
          setUser(response.data.user);
        } else {
          setAuth(false);
          setRole(null);
          setUser(null);
        }
      } catch (error) {
        console.error("Authentication error:", error);
        setAuth(false);
        setRole(null);
        setUser(null);
        setErrorMessage("An error occurred while verifying authentication.");
      }
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ auth, role, token, user, login, logout, registerUser, errorMessage }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
