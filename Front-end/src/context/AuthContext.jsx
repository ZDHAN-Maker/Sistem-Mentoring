// File: AuthContext.jsx

import React, { createContext, useState, useEffect } from "react";
import { api, getCsrfCookie, sanctumLogout } from "../axiosInstance";

const AuthContext = createContext();

// ✅ Security: Check if auth session is valid (not expired)
const isAuthSessionValid = () => {
  try {
    const authFlag = localStorage.getItem('auth_session');
    const timestamp = localStorage.getItem('auth_timestamp');
    
    if (!authFlag || authFlag !== 'true') {
      return false;
    }
    
    // ✅ Security: Session expires after 2 hours (7200000 ms)
    const SESSION_LIFETIME = 2 * 60 * 60 * 1000; // 2 hours
    const now = Date.now();
    const sessionTime = parseInt(timestamp || '0');
    
    if (now - sessionTime > SESSION_LIFETIME) {
      console.warn("⚠️ Auth session expired");
      localStorage.removeItem('auth_session');
      localStorage.removeItem('auth_timestamp');
      return false;
    }
    
    return true;
  } catch {
    return false;
  }
};

// ✅ Security: Clear auth session
const clearAuthSession = () => {
  localStorage.removeItem('auth_session');
  localStorage.removeItem('auth_timestamp');
};

// ✅ Security: Refresh auth timestamp (untuk extend session)
const refreshAuthSession = () => {
  if (localStorage.getItem('auth_session') === 'true') {
    localStorage.setItem('auth_timestamp', Date.now().toString());
  }
};

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
        
        // ✅ Step 1: Check localStorage auth flag
        if (!isAuthSessionValid()) {
          console.log("⚠️ No valid auth session in localStorage");
          setLoading(false);
          return;
        }
        
        console.log("✅ Valid auth session found, verifying with server...");
        
        // ✅ Step 2: Verify dengan server (security check)
        await getCsrfCookie();
        await new Promise(resolve => setTimeout(resolve, 200));
        
        const res = await api.get("/user");
        console.log("✅ User authenticated:", res.data);
        
        const userData = res.data.user || res.data;

        // ✅ Step 3: Refresh timestamp jika valid
        refreshAuthSession();

        setAuthData({
          isAuthenticated: true,
          user: userData,
          role: userData.role,
        });

      } catch (error) {
        console.log("❌ User verification failed:", error.response?.status);
        
        // ✅ Security: Clear invalid session
        clearAuthSession();
        
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
      
      // ✅ Get CSRF cookie
      await getCsrfCookie();
      
      // ✅ Login request
      const res = await api.post("/login", {
        email,
        password,
        remember,
      });

      console.log("✅ Login successful:", res.data);

      const user = res.data.user;

      // ✅ Set auth session (interceptor sudah handle localStorage)
      setAuthData({
        isAuthenticated: true,
        user,
        role: user.role,
      });

      return user;
    } catch (error) {
      console.error("❌ Login failed:", error.response?.data);
      clearAuthSession();
      throw error;
    }
  };

  const logout = async () => {
    try {
      await sanctumLogout();
      console.log("✅ Logout successful");
    } catch (error) {
      console.error("❌ Logout error:", error);
    } finally {
      // ✅ Always clear session
      clearAuthSession();
      
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