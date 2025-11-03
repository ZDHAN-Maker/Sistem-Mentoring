import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './Auth/Login';
import Register from './Auth/Register';
import Logout from './Auth/Logout';
import Dashboard from './components/Dashboard';
import LearningActivities from './pages/Role/Mentor/LearningActivities';

const App = () => {
  const [auth, setAuth] = useState(!!localStorage.getItem('token'));

  return (
    <Router>
      <div>
        <Routes>
          {/* Redirect otomatis ke /dashboard saat akses root "/" jika sudah login */}
          <Route
            path="/"
            element={auth ? <Navigate to="/dashboard" /> : <Navigate to="/login" />}
          />

          {/* Rute untuk Dashboard, hanya bisa diakses jika sudah login */}
          <Route
            path="/dashboard"
            element={auth ? <Dashboard /> : <Navigate to="/login" />}
          />

          {/* Rute untuk Learning Activities, hanya bisa diakses jika sudah login */}
          <Route
            path="/learning-activities"
            element={auth ? <LearningActivities /> : <Navigate to="/login" />}
          />

          {/* Rute untuk login dan register */}
          <Route path="/login" element={<Login setAuth={setAuth} />} />
          <Route path="/register" element={<Register setAuth={setAuth} />} />

          {/* Rute untuk logout */}
          <Route path="/logout" element={<Logout setAuth={setAuth} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
