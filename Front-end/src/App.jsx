import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './Auth/Login';
import Register from './Auth/Register';
import Logout from './Auth/Logout';
import DashboardAdmin from './pages/Role/Admin/DashboardAdmin';
import DashboardMentor from './pages/Role/Mentor/DashboardMentor';
import DashboardMentee from './pages/Role/Mentee/DashboardMentee';


const App = () => {
  const [auth, setAuth] = useState(!!localStorage.getItem('token'));
  const [role, setRole] = useState(localStorage.getItem('role'));  // Menyimpan role pengguna

  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    if (storedRole) {
      setRole(storedRole);
    }
  }, []);

  return (
    <Router>
      <div className="flex min-h-screen">
        {/* Sidebar tetap di kiri */}
        <aside className="w-64 bg-white shadow-md p-6">
          <div className="flex flex-col items-center mb-8">
            <img
              src="/assets/Logo Sistem Mentoring.png"
              alt="Logo"
              className="w-20 h-20 object-contain mb-2"
            />
          </div>
          <div className="text-gray-500 text-xs uppercase mb-2">Learning</div>
          <ul>
            {/* Sidebar berdasarkan role */}
            {role === 'admin' && (
              <>
                <li className="text-gray-700 hover:bg-gray-100 rounded-md px-3 py-2 mb-2 cursor-pointer">
                  Dashboard
                </li>
                <li className="text-gray-700 hover:bg-gray-100 rounded-md px-3 py-2 mb-2 cursor-pointer">
                  Learning Activities
                </li>
                <li className="text-gray-700 hover:bg-gray-100 rounded-md px-3 py-2 mb-2 cursor-pointer">
                  Tutoring Schedule
                </li>
                <li className="text-gray-700 hover:bg-gray-100 rounded-md px-3 py-2 mb-2 cursor-pointer">
                  Progress Report
                </li>
                <li className="text-gray-700 hover:bg-gray-100 rounded-md px-3 py-2 mb-2 cursor-pointer">
                  Student Portal
                </li>
              </>
            )}
            {role === 'mentor' && (
              <>
                <li className="text-gray-700 hover:bg-gray-100 rounded-md px-3 py-2 mb-2 cursor-pointer">
                  Dashboard
                </li>
                <li className="text-gray-700 hover:bg-gray-100 rounded-md px-3 py-2 mb-2 cursor-pointer">
                  Learning Activities
                </li>
                <li className="text-gray-700 hover:bg-gray-100 rounded-md px-3 py-2 mb-2 cursor-pointer">
                  Tutoring Schedule
                </li>
                <li className="text-gray-700 hover:bg-gray-100 rounded-md px-3 py-2 mb-2 cursor-pointer">
                  Progress Report
                </li>
                <li className="text-gray-700 hover:bg-gray-100 rounded-md px-3 py-2 mb-2 cursor-pointer">
                  Student Portal
                </li>
              </>
            )}
            {role === 'mentee' && (
              <>
                <li className="text-gray-700 hover:bg-gray-100 rounded-md px-3 py-2 mb-2 cursor-pointer">
                  Dashboard
                </li>
                <li className="text-gray-700 hover:bg-gray-100 rounded-md px-3 py-2 mb-2 cursor-pointer">
                  Learning Activities
                </li>
                <li className="text-gray-700 hover:bg-gray-100 rounded-md px-3 py-2 mb-2 cursor-pointer">
                  Tutoring Schedule
                </li>
                <li className="text-gray-700 hover:bg-gray-100 rounded-md px-3 py-2 mb-2 cursor-pointer">
                  Progress Report
                </li>
                <li className="text-gray-700 hover:bg-gray-100 rounded-md px-3 py-2 mb-2 cursor-pointer">
                  Student Portal
                </li>
                <li className="text-gray-700 hover:bg-gray-100 rounded-md px-3 py-2 mb-2 cursor-pointer">
                  Announcement
                </li>
              </>
            )}
          </ul>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <Routes>
            <Route
              path="/"
              element={auth ? <Navigate to={`/${role}-dashboard`} /> : <Navigate to="/login" />}
            />
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
            {/* Rute berdasarkan role */}
            <Route path="/learning-activities" element={<LearningActivities />} />
            <Route path="/tutoring-schedule" element={<TutoringSchedule />} />
            <Route path="/progress-report" element={<ProgressReport />} />
            <Route path="/student-portal" element={<StudentPortal />} />
            <Route path="/announcement" element={<Announcement />} />
            <Route path="/login" element={<Login setAuth={setAuth} />} />
            <Route path="/register" element={<Register setAuth={setAuth} />} />
            <Route path="/logout" element={<Logout setAuth={setAuth} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
