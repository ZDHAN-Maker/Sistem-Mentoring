// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/useAuth';

import Login from './Auth/Login';
import Register from './Auth/Register';
import DashboardAdmin from './pages/Role/Admin/DashboardAdmin';
import DashboardMentor from './pages/Role/Mentor/DashboardMentor';
import DashboardMentee from './pages/Role/Mentee/DashboardMentee';

const App = () => {
  const { auth, role } = useAuth(); // Sekarang aman, karena AuthProvider akan membungkus App dari luar

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            auth ? (
              <Navigate to={`/${role}-dashboard`} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/admin-dashboard"
          element={auth && role === 'admin' ? <DashboardAdmin /> : <Navigate to="/login" />}
        />
        <Route
          path="/mentor-dashboard"
          element={auth && role === 'mentor' ? <DashboardMentor /> : <Navigate to="/login" />}
        />
        <Route
          path="/mentee-dashboard"
          element={auth && role === 'mentee' ? <DashboardMentee /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
};

export default App;
