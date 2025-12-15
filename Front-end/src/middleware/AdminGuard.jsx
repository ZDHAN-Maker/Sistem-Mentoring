// src/middleware/AdminGuard.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const AdminGuard = () => {
  const role = localStorage.getItem("role");

  if (role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminGuard;
