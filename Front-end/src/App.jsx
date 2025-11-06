// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/useAuth";

import Login from "./Auth/Login";
import Register from "./Auth/Register";
import DashboardAdmin from "./pages/Role/Admin/DashboardAdmin";
import DashboardMentor from "./pages/Role/Mentor/DashboardMentor";
import DashboardMentee from "./pages/Role/Mentee/DashboardMentee";

const ProtectedRoute = ({ children, allowedRole }) => {
  const { auth, role } = useAuth();

  if (!auth) {
    return <Navigate to="/login" />;
  }

  if (allowedRole && role !== allowedRole) {
    return <Navigate to="/login" />;
  }

  return children;
};

const App = () => {
  const { auth, role } = useAuth();

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
          element={
            <ProtectedRoute allowedRole="admin">
              <DashboardAdmin />
            </ProtectedRoute>
          }
        />

        <Route
          path="/mentor-dashboard"
          element={
            <ProtectedRoute allowedRole="mentor">
              <DashboardMentor />
            </ProtectedRoute>
          }
        />

        <Route
          path="/mentee-dashboard"
          element={
            <ProtectedRoute allowedRole="mentee">
              <DashboardMentee />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
