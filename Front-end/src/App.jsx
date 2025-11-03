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
            <li className="bg-[#b38867] text-white rounded-md px-3 py-2 mb-2 cursor-pointer">
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
          </ul>

          <div className="text-gray-500 text-xs uppercase mt-4 mb-2">Document</div>
          <ul>
            <li className="text-gray-700 hover:bg-gray-100 rounded-md px-3 py-2 mb-2 cursor-pointer">
              Student Portal
            </li>
            <li className="text-gray-700 hover:bg-gray-100 rounded-md px-3 py-2 mb-2 cursor-pointer">
              Announcement
            </li>
            <li className="text-gray-700 hover:bg-gray-100 rounded-md px-3 py-2 mb-2 cursor-pointer">
              Logout
            </li>
          </ul>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <Routes>
            <Route
              path="/"
              element={auth ? <Navigate to="/dashboard" /> : <Navigate to="/login" />}
            />
            <Route
              path="/dashboard"
              element={auth ? <Dashboard /> : <Navigate to="/login" />}
            />
            <Route
              path="/learning-activities"
              element={auth ? <LearningActivities /> : <Navigate to="/login" />}
            />
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
