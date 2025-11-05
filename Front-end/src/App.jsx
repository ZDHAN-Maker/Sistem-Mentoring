import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Auth/Login";
import Register from "./Auth/Register"; // Pastikan Register di-import dengan benar
import DashboardAdmin from "./pages/Role/Admin/DashboardAdmin";
import DashboardMentor from "./pages/Role/Mentor/DashboardMentor";
import DashboardMentee from "./pages/Role/Mentee/DashboardMentee";

const App = () => {
  const [auth, setAuth] = useState(false);
  const [role, setRole] = useState(null);

  useEffect(() => {
    // Mengambil token dan role dari localStorage
    const storedToken = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");

    // Jika token dan role ada, set autentikasi dan role
    if (storedToken && storedRole) {
      setAuth(true);
      setRole(storedRole);
    }
  }, []);

  return (
    <Router>
      <Routes>
        {/* Halaman utama, jika sudah login akan redirect ke dashboard sesuai role */}
        <Route
          path="/"
          element={
            auth ? (
              <Navigate to={`/${role}-dashboard`} /> // Redirect ke dashboard sesuai role
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Rute untuk halaman login dan register */}
        <Route path="/login" element={<Login setAuth={setAuth} />} />
        <Route path="/register" element={<Register setAuth={setAuth} />} />

        {/* Rute dashboard untuk setiap role */}
        <Route
          path="/admin-dashboard"
          element={
            auth && role === "admin" ? (
              <DashboardAdmin role={role} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/mentor-dashboard"
          element={
            auth && role === "mentor" ? (
              <DashboardMentor role={role} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/mentee-dashboard"
          element={
            auth && role === "mentee" ? (
              <DashboardMentee role={role} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
