import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Auth/Login';
import DashboardAdmin from './pages/Role/Admin/DashboardAdmin';
import DashboardMentor from './pages/Role/Mentor/DashboardMentor';
import DashboardMentee from './pages/Role/Mentee/DashboardMentee';

const App = () => {
  const [auth, setAuth] = useState(false);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedRole = localStorage.getItem('role');
    if (storedToken && storedRole) {
      setAuth(true);  // Jika token ada, anggap pengguna terautentikasi
      setRole(storedRole);  // Set role berdasarkan yang ada di localStorage
    }
  }, []);

  return (
    <Router>
      <Routes>
        {/* Redirect default ke login jika belum login */}
        <Route path="/" element={auth ? <Navigate to={`/${role}-dashboard`} /> : <Navigate to="/login" />} />
        
        {/* Dashboard berdasarkan role */}
        <Route
          path="/admin-dashboard"
          element={auth && role === 'admin' ? <DashboardAdmin role={role} /> : <Navigate to="/login" />}
        />
        <Route
          path="/mentor-dashboard"
          element={auth && role === 'mentor' ? <DashboardMentor role={role} /> : <Navigate to="/login" />}
        />
        <Route
          path="/mentee-dashboard"
          element={auth && role === 'mentee' ? <DashboardMentee role={role} /> : <Navigate to="/login" />}
        />

        {/* Rute untuk Login */}
        <Route path="/login" element={<Login setAuth={setAuth} />} />
      </Routes>
    </Router>
  );
};

export default App;
