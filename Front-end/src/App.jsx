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
import ELearning from './pages/E-Learning';

const AppContent = () => {
  const { isAuthenticated, role, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500 font-medium">
        Memuat aplikasi...
      </div>
    );
  }

  // Halaman publik (tidak perlu login)
  const publicPaths = ['/login', '/register', '/program', '/langganan', '/e-learning', '/elearning'];

  // Hanya tampilkan Header di halaman publik (case-insensitive)
  const showHeader = publicPaths.includes(location.pathname.toLowerCase()) && !isAuthenticated;

  return (
    <>
      {showHeader && <Header />}
      <Routes>
        {/* Halaman Publik */}
        <Route path='/program' element={<Program />} />
        
        <Route path='/langganan' element={<Langganan />} />
        <Route path='/Langganan' element={<Navigate to='/langganan' replace />} />
        
        <Route path='/e-learning' element={<ELearning />} />
        <Route path='/E-Learning' element={<Navigate to='/e-learning' replace />} />
        <Route path='/elearning' element={<Navigate to='/e-learning' replace />} />

        {/* Jika user sudah login, arahkan ke dashboard sesuai role */}
        <Route
          path='/'
          element={
            isAuthenticated ? (
              <Navigate to={`/${role}-dashboard`} />
            ) : (
              <Navigate to='/login' />
            )
          }
        />

        {/* Auth Routes */}
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />

        {/* Admin Dashboard */}
        <Route
          path='/admin-dashboard/*'
          element={
            <ProtectedRoute allowedRole='admin'>
              <DashboardAdmin />
            </ProtectedRoute>
          }
        />

        {/* Mentor Dashboard - SEMUA route mentor di-handle di sini */}
        <Route
          path="/mentor-dashboard/*"
          element={
            <ProtectedRoute allowedRole="mentor">
              <DashboardMentor />
            </ProtectedRoute>
          }
        />

        {/* Mentee Dashboard - SEMUA route mentee di-handle di sini */}
        <Route
          path="/mentee-dashboard/*"
          element={
            <ProtectedRoute allowedRole="mentee">
              <DashboardMentee />
            </ProtectedRoute>
          }
        />

        {/* Fallback 404 Route */}
        <Route path="*" element={<Navigate to="/program" replace />} />
      </Routes>
    </>
  );
};

const App = () => (
  <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
    <AppContent />
  </Router>
);

export default App;
