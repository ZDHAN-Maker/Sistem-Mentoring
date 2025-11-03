import React from 'react';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ role }) => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <aside className="w-64 bg-white shadow-md p-6 flex flex-col justify-between">
      <div>
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
          <li
            className="bg-[#b38867] text-white rounded-md px-3 py-2 mb-2 cursor-pointer"
            onClick={() => handleNavigation('/dashboard')}
          >
            Dashboard
          </li>

          {/* Menu untuk Mentor */}
          {role === 'mentor' && (
            <>
              <li
                className="text-gray-700 hover:bg-gray-100 rounded-md px-3 py-2 mb-2 cursor-pointer"
                onClick={() => handleNavigation('/learning-activities')}
              >
                Learning Activities
              </li>
              <li
                className="text-gray-700 hover:bg-gray-100 rounded-md px-3 py-2 mb-2 cursor-pointer"
                onClick={() => handleNavigation('/tutoring-schedule')}
              >
                Tutoring Schedule
              </li>
              <li
                className="text-gray-700 hover:bg-gray-100 rounded-md px-3 py-2 mb-2 cursor-pointer"
                onClick={() => handleNavigation('/progress-report')}
              >
                Progress Report
              </li>
            </>
          )}

          {/* Menu untuk Admin */}
          {role === 'admin' && (
            <>
              <li
                className="text-gray-700 hover:bg-gray-100 rounded-md px-3 py-2 mb-2 cursor-pointer"
                onClick={() => handleNavigation('/admin-panel')}
              >
                Admin Panel
              </li>
              <li
                className="text-gray-700 hover:bg-gray-100 rounded-md px-3 py-2 mb-2 cursor-pointer"
                onClick={() => handleNavigation('/student-portal')}
              >
                Student Portal
              </li>
            </>
          )}

          {/* Menu untuk Mentee */}
          {role === 'mentee' && (
            <>
              <li
                className="text-gray-700 hover:bg-gray-100 rounded-md px-3 py-2 mb-2 cursor-pointer"
                onClick={() => handleNavigation('/mentee-dashboard')}
              >
                Mentee Dashboard
              </li>
              <li
                className="text-gray-700 hover:bg-gray-100 rounded-md px-3 py-2 mb-2 cursor-pointer"
                onClick={() => handleNavigation('/announcement')}
              >
                Announcement
              </li>
            </>
          )}
        </ul>

        <div className="text-gray-500 text-xs uppercase mt-4 mb-2">Document</div>
        <ul>
          <li
            className="text-gray-700 hover:bg-gray-100 rounded-md px-3 py-2 mb-2 cursor-pointer"
            onClick={() => handleNavigation('/student-portal')}
          >
            Student Portal
          </li>
          <li
            className="text-gray-700 hover:bg-gray-100 rounded-md px-3 py-2 mb-2 cursor-pointer"
            onClick={() => handleNavigation('/announcement')}
          >
            Announcement
          </li>
          <li
            className="text-gray-700 hover:bg-gray-100 rounded-md px-3 py-2 mb-2 cursor-pointer"
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
