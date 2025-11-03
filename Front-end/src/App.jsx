import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './Auth/Login';
import Dashboard from './components/Dashboard';

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
          path="/dashboard"
          element={auth ? <Dashboard role={role} /> : <Navigate to="/login" />}
        />
        <Route path="/login" element={<Login setAuth={setAuth} />} />
      </Routes>
    </Router>
  );
};

export default App;
