import React from "react";
import { sanctumLogout } from "../axiosInstance";
import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const { setAuthData } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await sanctumLogout(); // panggil API logout Laravel
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Reset state & redirect
      setAuthData({ isAuthenticated: false, user: null, role: null });
      navigate("/login");
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
    >
      Logout
    </button>
  );
};

export default Logout;
