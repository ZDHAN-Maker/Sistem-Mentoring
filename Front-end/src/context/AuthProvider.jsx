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
    await getCsrfCookie();

    const res = await api.post("/login", {
      email,
      password,
      remember,
    });

    const user = res.data.user;
    saveUser(user);

    return user;
  };

  const logout = async () => {
    try {
      await api.post("/logout");
    } finally {
      clearUser();
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        await getCsrfCookie();
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
        user: authData,
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
