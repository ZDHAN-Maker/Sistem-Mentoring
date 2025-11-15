// File: AuthContext.jsx

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

  useEffect(() => {
    const checkUser = async () => {
      try {
        console.log("🔍 Checking authentication...");
        console.log("🍪 All cookies on mount:", document.cookie);
        
        // ✅ Cek semua cookies yang ada
        const cookies = document.cookie.split('; ');
        const hasLaravelSession = cookies.some(cookie => 
          cookie.startsWith('laravel_session=') || 
          cookie.startsWith('system-mentoring-service_session=') // Sesuaikan dengan APP_NAME
        );
        
        console.log("Has session cookie:", hasLaravelSession);
        
        if (!hasLaravelSession) {
          console.log("⚠️ No session cookie found, skipping user check");
          setLoading(false);
          return;
        }
        
        // ✅ Ada session, coba get user
        await getCsrfCookie();
        await new Promise(resolve => setTimeout(resolve, 200));
        
        const res = await api.get("/user");
        console.log("✅ User authenticated:", res.data);
        
        const userData = res.data.user || res.data;

        setAuthData({
          isAuthenticated: true,
          user: userData,
          role: userData.role,
        });

      } catch (error) {
        console.log("❌ User not authenticated:", error.response?.status);
        console.log("Error details:", error.response?.data);
        
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
    try {
      console.log("🔐 Attempting login...");
      
      // ✅ Get CSRF cookie before login
      await getCsrfCookie();
      
      const res = await api.post("/login", {
        email,
        password,
        remember,
      });

      console.log("✅ Login successful:", res.data);
      
      // ✅ Wait sedikit untuk memastikan cookie ter-set
      await new Promise(resolve => setTimeout(resolve, 300));
      
      console.log("🍪 Cookies after login wait:", document.cookie);

      const user = res.data.user;

      setAuthData({
        isAuthenticated: true,
        user,
        role: user.role,
      });

      return user;
    } catch (error) {
      console.error("❌ Login failed:", error.response?.data);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await sanctumLogout();
      console.log("✅ Logout successful");
      
      setAuthData({
        isAuthenticated: false,
        user: null,
        role: null,
      });
    } catch (error) {
      console.error("❌ Logout error:", error);
      setAuthData({
        isAuthenticated: false,
        user: null,
        role: null,
      });
    }
  };

  return (
    <AuthContext.Provider value={{ ...authData, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;