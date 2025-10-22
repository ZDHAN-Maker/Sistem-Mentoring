import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './Auth/Login';
import Register from './Auth/Register';
import Logout from './Auth/Logout';

const App = () => {
  const [auth, setAuth] = useState(!!localStorage.getItem('token'));

  return (
    <Router>
      <div>
        <h1>Welcome to Mentee App</h1>

        <Routes>
          {/* Redirect otomatis ke /login saat akses root "/" */}
          <Route path="/" element={<Navigate to="/login" />} />

          <Route path="/login" element={<Login setAuth={setAuth} />} />
          <Route path="/register" element={<Register setAuth={setAuth} />} />
          <Route path="/logout" element={<Logout setAuth={setAuth} />} />

          {/* Jika sudah login, arahkan ke dashboard */}
          <Route
            path="/dashboard"
            element={auth ? <h2>Dashboard</h2> : <Navigate to="/login" />}
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
