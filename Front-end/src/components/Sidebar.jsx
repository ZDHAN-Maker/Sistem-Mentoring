import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

const Sidebar = () => {
  const navigate = useNavigate();
  const { role } = useAuth();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <aside className="w-64 bg-white shadow-md p-6 flex flex-col justify-between">
      <div>
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-8">
          <img
            src="/assets/Logo Sistem Mentoring.png"
            alt="Logo"
            className="w-20 h-20 object-contain mb-2"
          />
          <h2 className="text-lg font-semibold text-gray-700">
            {role === 'mentor' ? 'Mentor Panel' : 'Mentee Panel'}
          </h2>
        </div>

        {/* Learning Section */}
        <div className="text-gray-500 text-xs uppercase mb-2">Learning</div>
        <ul>
          {/* Dashboard */}
          <li
            className="bg-[#b38867] text-white rounded-md px-3 py-2 mb-2 cursor-pointer"
            onClick={() =>
              handleNavigation(role === 'mentor' ? '/dashboard' : '/mentee/dashboard')
            }
          >
            Dashboard
          </li>

          {/* ================= Mentor Menu ================= */}
          {role === 'mentor' && (
            <>
              <li
                className="text-gray-700 hover:bg-gray-100 rounded-md px-3 py-2 mb-2 cursor-pointer"
                onClick={() => handleNavigation('/mentors')}
              >
                List of Mentees
              </li>

              <li
                className="text-gray-700 hover:bg-gray-100 rounded-md px-3 py-2 mb-2 cursor-pointer"
                onClick={() => handleNavigation('/mentors/schedules')}
              >
                Mentoring Schedule
              </li>

              <li
                className="text-gray-700 hover:bg-gray-100 rounded-md px-3 py-2 mb-2 cursor-pointer"
                onClick={() => handleNavigation('/mentors/tasks')}
              >
                Give Task
              </li>

              <li
                className="text-gray-700 hover:bg-gray-100 rounded-md px-3 py-2 mb-2 cursor-pointer"
                onClick={() => handleNavigation('/mentors/reports')}
              >
                Review Reports & Feedback
              </li>

              <li
                className="text-gray-700 hover:bg-gray-100 rounded-md px-3 py-2 mb-2 cursor-pointer"
                onClick={() => handleNavigation('/mentors/materials')}
              >
                Upload Materials
              </li>

              <li
                className="text-gray-700 hover:bg-gray-100 rounded-md px-3 py-2 mb-2 cursor-pointer"
                onClick={() => handleNavigation('/announcements')}
              >
                Announcements
              </li>
            </>
          )}

          {/* ================= Mentee Menu ================= */}
          {role === 'mentee' && (
            <>
              <li
                className="text-gray-700 hover:bg-gray-100 rounded-md px-3 py-2 mb-2 cursor-pointer"
                onClick={() => handleNavigation('/mentee/tasks')}
              >
                My Tasks
              </li>

              <li
                className="text-gray-700 hover:bg-gray-100 rounded-md px-3 py-2 mb-2 cursor-pointer"
                onClick={() => handleNavigation('/mentee/reports')}
              >
                My Reports
              </li>

              <li
                className="text-gray-700 hover:bg-gray-100 rounded-md px-3 py-2 mb-2 cursor-pointer"
                onClick={() => handleNavigation('/mentee/schedule')}
              >
                Tutoring Schedule
              </li>

              <li
                className="text-gray-700 hover:bg-gray-100 rounded-md px-3 py-2 mb-2 cursor-pointer"
                onClick={() => handleNavigation('/mentee/mentor')}
              >
                My Mentor
              </li>

              <li
                className="text-gray-700 hover:bg-gray-100 rounded-md px-3 py-2 mb-2 cursor-pointer"
                onClick={() => handleNavigation('/announcements')}
              >
                Announcements
              </li>
            </>
          )}
        </ul>

        {/* Account Section */}
        <div className="text-gray-500 text-xs uppercase mt-4 mb-2">Account</div>
        <ul>
          <li
            className="text-gray-700 hover:bg-red-100 rounded-md px-3 py-2 mb-2 cursor-pointer"
            onClick={() => handleNavigation('/logout')}
          >
            Logout
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
