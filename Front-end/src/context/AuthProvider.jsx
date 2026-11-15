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
    localStorage.removeItem("auth_token");
  };

  const login = async (email, password, remember = false) => {
    await getCsrfCookie();
    const res = await api.post("/login", { email, password, remember });

    // ✅ FIX: Backend mengembalikan { status, data: { user, roles, token } }
    const responseData = res.data.data;
    const userData = responseData.user;
    const roles = responseData.roles;    // array, misal: ["Admin"]
    const token = responseData.token;

    // Simpan token untuk dikirim sebagai Bearer di setiap request
    localStorage.setItem("auth_token", token);

    // Ambil role pertama dan ubah ke lowercase agar cocok dengan routing
    const userRole = roles?.[0]?.toLowerCase() ?? null;

    setAuthData({
      isAuthenticated: true,
      user: userData,
      role: userRole,
    });

    // Kembalikan userData DAN role agar Login.jsx bisa langsung redirect
    return { user: userData, role: userRole };
  };

  const logout = async () => {
    try {
      await api.post("/logout");
    } catch {
      // Tetap clear session meskipun request logout gagal
    }
    localStorage.removeItem("auth_token");
    clearAuthSession();
  };

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        clearAuthSession();
        setLoading(false);
        return;
      }

      const authSession = localStorage.getItem("auth_session");
      const savedUser = localStorage.getItem("user");
      const savedRole = localStorage.getItem("role");

      if (authSession === "true" && savedUser && savedRole) {
        try {
          const parsedUser = JSON.parse(savedUser);
          setAuthData({
            isAuthenticated: true,
            user: parsedUser,
            role: savedRole,
          });
        } catch {
          // ignore json parse error
        }
      }

      try {
        const res = await api.get("/user");
        // ✅ FIX: Backend mengembalikan { status, data: { user (dengan relasi roles) } }
        const userData = res.data.data;
        const roles = userData.roles;   // relasi roles sudah di-load (->load('roles'))
        const userRole = roles?.[0]?.name?.toLowerCase() ?? null;

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
