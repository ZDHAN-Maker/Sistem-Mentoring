// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth'; // Import useAuth

const ProtectedRoute = ({ children, allowedRole }) => {
  const { auth, role } = useAuth(); // Ambil status login dan role dari context

  // Jika pengguna belum login, arahkan ke halaman login
  if (!auth) {
    return <Navigate to="/login" />;
  }

  // Jika pengguna tidak memiliki role yang sesuai, arahkan ke halaman login
  if (allowedRole && role !== allowedRole) {
    return <Navigate to="/login" />;
  }

  return children; // Jika user sudah login dan role sesuai, tampilkan children
};

export default ProtectedRoute;
