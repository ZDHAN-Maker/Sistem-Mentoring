// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/useAuth';

import Program from './pages/Program';
import Login from './Auth/Login';
import Register from './Auth/Register';
import DashboardAdmin from './pages/Role/Admin/DashboardAdmin';
import DashboardMentor from './pages/Role/Mentor/DashboardMentor';
import DashboardMentee from './pages/Role/Mentee/DashboardMentee';

import ProtectedRoute from './components/PrivateRoute';
import Header from './components/Header';
import Langganan from './pages/Langganan';

const PUBLIC_PREFIX = [
  '/login',
  '/register',
  '/program',
  '/langganan',
  '/elearning'
];

const AppContent = () => {
  const { isAuthenticated, role, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>;
  }

  const isPublicRoute = PUBLIC_PREFIX.some((path) =>
    location.pathname.startsWith(path)
  );

  const showHeader = isPublicRoute && !isAuthenticated;

  return (
    <>
      {showHeader && <Header />}

      <Routes>

        {/* PUBLIC ROUTES */}
        <Route path="/program" element={<Program />} />
        <Route path="/langganan" element={<Langganan />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ROOT REDIRECT */}
        <Route
          path="/"
          element={
            isAuthenticated
              ? <Navigate to={`/${role}-dashboard`} />
              : <Navigate to="/login" />
          }
        />

        {/* PROTECTED ROUTES */}

        <Route
          path="/admin-dashboard/*"
          element={
            <ProtectedRoute allowedRole="admin">
              <DashboardAdmin />
            </ProtectedRoute>
          }
        />

        <Route
          path="/mentor-dashboard/*"
          element={
            <ProtectedRoute allowedRole="mentor">
              <DashboardMentor />
            </ProtectedRoute>
          }
        />

        <Route
          path="/mentee-dashboard/*"
          element={
            <ProtectedRoute allowedRole="mentee">
              <DashboardMentee />
            </ProtectedRoute>
          }
        />

      </Routes>
    </>
  );
};

const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
