import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './Auth/Login';
import DashboardAdmin from './pages/Role/Admin/DashboardAdmin';
import DashboardMentor from './pages/Role/Mentor/DashboardMentor';
import DashboardMentee from './pages/Role/Mentee/DashboardMentee';

const App = () => {
  const [auth, setAuth] = useState(!!localStorage.getItem('token'));
  const [role, setRole] = useState(localStorage.getItem('role'));

  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    if (storedRole) {
      setRole(storedRole);
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={auth ? <Navigate to={`/${role}-dashboard`} /> : <Navigate to="/login" />}
        />
        
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
        
        <Route path="/login" element={<Login setAuth={setAuth} />} />
      </Routes>
    </Router>
  );
};

export default App;
