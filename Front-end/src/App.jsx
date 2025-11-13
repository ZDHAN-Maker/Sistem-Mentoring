import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/useAuth';

// Halaman Umum
import Program from './pages/Program';
import Login from './Auth/Login';
import Register from './Auth/Register';
import Langganan from './pages/Langganan';
import Header from './components/Header';

// Proteksi
import ProtectedRoute from './components/PrivateRoute';

// ADMIN
import DashboardAdmin from './pages/Role/Admin/DashboardAdmin';

// MENTOR
import DashboardMentor from './pages/Role/Mentor/DashboardMentor';
import ListOfMentees from './pages/Role/Mentor/ListOfMentees';
import MentoringSchedule from './pages/Role/Mentor/MentoringSchedule';
import GiveTask from './pages/Role/Mentor/GiveTask';
import ReviewReports from './pages/Role/Mentor/ReviewReports';
import UploadMaterials from './pages/Role/Mentor/UploadMaterials';
import AnnouncementsMentor from './pages/Role/Mentor/AnnouncementsMentor';

// MENTEE
import DashboardMentee from './pages/Role/Mentee/DashboardMentee';
import MyTasks from './pages/Role/Mentee/MyTasks';
import MyReports from './pages/Role/Mentee/MyReports';
import TutoringSchedule from './pages/Role/Mentee/TutoringSchedule';
import MyMentor from './pages/Role/Mentee/MyMentor';
import AnnouncementsMentee from './pages/Role/Mentee/AnnouncementsMentee';

const AppContent = () => {
  const { isAuthenticated, role, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div>Loading...</div>;

  const publicPaths = ['/login', '/register', '/program', '/langganan', '/elearning'];
  const showHeader = publicPaths.includes(location.pathname) && !isAuthenticated;

  // ====== ROUTE CONFIGURATION ======
  const routesConfig = {
    admin: [
      { path: '/admin-dashboard', element: <DashboardAdmin /> },
    ],
    mentor: [
      { path: '/mentor-dashboard', element: <DashboardMentor /> },
      { path: '/mentors', element: <ListOfMentees /> },
      { path: '/mentors/schedules', element: <MentoringSchedule /> },
      { path: '/mentors/tasks', element: <GiveTask /> },
      { path: '/mentors/reports', element: <ReviewReports /> },
      { path: '/mentors/materials', element: <UploadMaterials /> },
      { path: '/announcements', element: <AnnouncementsMentor /> },
    ],
    mentee: [
      { path: '/mentee-dashboard', element: <DashboardMentee /> },
      { path: '/mentee/tasks', element: <MyTasks /> },
      { path: '/mentee/reports', element: <MyReports /> },
      { path: '/mentee/schedule', element: <TutoringSchedule /> },
      { path: '/mentee/mentor', element: <MyMentor /> },
      { path: '/announcements', element: <AnnouncementsMentee /> },
    ],
  };

  return (
    <>
      {showHeader && <Header />}
      <Routes>
        {/* ======= HALAMAN PUBLIK ======= */}
        <Route path="/program" element={<Program />} />
        <Route path="/langganan" element={<Langganan />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ======= REDIRECT BERDASARKAN ROLE ======= */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to={`/${role}-dashboard`} replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* ======= ROUTES BERDASARKAN ROLE ======= */}
        {Object.entries(routesConfig).map(([roleName, roleRoutes]) =>
          roleRoutes.map(({ path, element }) => (
            <Route
              key={path}
              path={path}
              element={<ProtectedRoute allowedRole={roleName}>{element}</ProtectedRoute>}
            />
          ))
        )}

        {/* ======= CATCH ALL ======= */}
        <Route path="*" element={<div style={{ padding: 40 }}>404 - Page Not Found</div>} />
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
