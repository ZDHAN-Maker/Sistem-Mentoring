// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
const App = () => {
  const { auth, role } = useAuth();

  return (
    <Router>
      <Header />
      <Routes>
         <Route path='/langganan' element={<Langganan />} />
        <Route path='/program' element={<Program />} />
        <Route
          path='/'
          element={
            auth ? (
              <Navigate to={`/${role}-dashboard`} />
            ) : (
              <Navigate to='/login' />
            )
          }
        />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />

        {/* Admin Dashboard */}
        <Route
          path='/admin-dashboard'
          element={
            <ProtectedRoute allowedRole='admin'>
              <DashboardAdmin />
            </ProtectedRoute>
          }
        />

        {/* Mentor Dashboard */}
        <Route
          path='/mentor-dashboard'
          element={
            <ProtectedRoute allowedRole='mentor'>
              <DashboardMentor />
            </ProtectedRoute>
          }
        />

        {/* Mentee Dashboard */}
        <Route
          path='/mentee-dashboard'
          element={
            <ProtectedRoute allowedRole='mentee'>
              <DashboardMentee />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
