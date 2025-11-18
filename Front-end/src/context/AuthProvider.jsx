import { useState, useEffect } from "react";
import AuthContext from "./AuthContext";
import api, { getCsrfCookie } from "../axiosInstance";

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  const setAuthData = ({ isAuthenticated, user, role }) => {
    setIsAuthenticated(isAuthenticated);
    setUser(user);
    setRole(role);

    if (isAuthenticated && user) {
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("role", role);
      localStorage.setItem("auth_session", "true");
    }
  };

  const clearAuthSession = () => {
    setIsAuthenticated(false);
    setUser(null);
    setRole(null);
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    localStorage.removeItem("auth_session");
    localStorage.removeItem("auth_timestamp");
  };

  const login = async (email, password, remember = false) => {
    await getCsrfCookie();
    const res = await api.post("/login", { email, password, remember });
    const userData = res.data.user;

    setAuthData({
      isAuthenticated: true,
      user: userData,
      role: userData.role,
    });

    return userData;
  };

  const logout = async () => {
    await api.post("/logout");
    clearAuthSession();
  };

  useEffect(() => {
    const checkAuth = async () => {
      const authSession = localStorage.getItem("auth_session");
      const savedUser = localStorage.getItem("user");
      const savedRole = localStorage.getItem("role");

      if (authSession === "true" && savedUser && savedRole) {
        const parsedUser = JSON.parse(savedUser);
        setAuthData({
          isAuthenticated: true,
          user: parsedUser,
          role: savedRole,
        });
      }

      try {
        const res = await api.get("/user");
        const userData = res.data.user;
        const userRole = res.data.role;

        setAuthData({
          isAuthenticated: true,
          user: userData,
          role: userRole,
        });
      } catch {
        clearAuthSession();
      }

      setLoading(false);
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        role,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
