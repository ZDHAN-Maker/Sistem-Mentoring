import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const Logout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
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
