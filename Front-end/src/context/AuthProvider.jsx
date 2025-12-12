import { useState, useEffect } from "react";
import api, { getCsrfCookie } from "../axiosInstance";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const [loading, setLoading] = useState(true);

  const saveUser = (user) => {
    setAuthData(user);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("role", user.role);
  };

  const clearUser = () => {
    setAuthData(null);
    localStorage.removeItem("user");
    localStorage.removeItem("role");
  };

  const login = async (email, password, remember = false) => {
    try {
      console.log("🚀 Starting login process...");
      
      // 1. Get CSRF cookie
      await getCsrfCookie();
      
      // 2. Tunggu sebentar untuk cookie siap
      await new Promise(resolve => setTimeout(resolve, 100));
      
      console.log("📤 Sending login request...");

      // 3. Login request
      const loginResponse = await api.post("/login", { 
        email, 
        password, 
        remember 
      });
      
      console.log("✅ Login successful:", loginResponse.data);

      // 4. Get user data
      const { data: user } = await api.get("/user");

      saveUser(user);

      return user;
    } catch (error) {
      console.error("❌ Login error:", error.response?.data || error.message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.post("/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      clearUser();
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        await getCsrfCookie();
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const { data: user } = await api.get("/user");
        saveUser(user);
      } catch {
        clearUser();
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        authData,
        loading,
        login,
        logout,
        isAuthenticated: !!authData,
        role: authData?.role ?? null,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};