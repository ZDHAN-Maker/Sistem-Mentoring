// src/components/Sidebar.jsx
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { role } = useAuth();

  const handleNavigation = (path) => navigate(path);

  // ================= MENU CONFIG =================
  const menus = {
    mentor: [
      { name: "Dashboard", path: "/mentor-dashboard" },
      { name: "List of Mentees", path: "/mentor-dashboard/mentees" },
      { name: "Mentoring Schedule", path: "/mentor-dashboard/schedules" },
      { name: "Give Task", path: "/mentor-dashboard/tasks" },
      { name: "Review Reports & Feedback", path: "/mentor-dashboard/reports" },
      { name: "Upload Materials", path: "/mentor-dashboard/materials" },
      { name: "Announcements", path: "/mentor-dashboard/announcements" },
    ],
    mentee: [
      { name: "Dashboard", path: "/mentee-dashboard" },
      {
        name: "Learning Activities",
        path: "/mentee-dashboard/learning-activities",
      },
      { name: "My Tasks", path: "/mentee-dashboard/tasks" },
      { name: "My Reports", path: "/mentee-dashboard/reports" },
      { name: "Tutoring Schedule", path: "/mentee-dashboard/schedule" },
      { name: "My Mentor", path: "/mentee-dashboard/mentor" },
      { name: "Announcements", path: "/mentee-dashboard/announcements" },
      { name: "Student Portal", path: "/mentee-dashboard/student-portal" },
    ],
    admin: [
      { name: "Dashboard", path: "/admin-dashboard" },
      { name: "User Management", path: "/admin-dashboard/user-management" },
      { name: "Learning Activities",path: "/admin-dashboard/learning-activities",},
      { name: "Learning Path", path: "/admin-dashboard/learning-path" },
      { name: "Mentor-Mentee Pairing", path: "/admin-dashboard/pairings" },
      { name: "Progress Report", path: "/admin-dashboard/progress-report" },
      { name: "Student Portal", path: "/admin-dashboard/student-portal" },
      { name: "Tutoring Schedule", path: "/admin-dashboard/tutoring-schedule" },
    ],
  };

  const currentMenu = menus[role] || [];

  return (
    <aside className="w-64 bg-white shadow-md p-6 flex flex-col justify-between">
      <div>
        {/* ===== Logo Section ===== */}
        <div className="flex flex-col items-center mb-8">
          <img
            src="/assets/Logo Sistem Mentoring.png"
            alt="Logo"
            className="w-20 h-20 object-contain mb-2"
          />
          <h2 className="text-lg font-semibold text-gray-700">
            {role === "mentor"
              ? "Mentor Panel"
              : role === "admin"
              ? "Admin Panel"
              : "Mentee Panel"}
          </h2>
        </div>

        {/* ===== Learning Section ===== */}
        <div className="text-gray-500 text-xs uppercase mb-2">Learning</div>
        <ul>
          {currentMenu.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <li
                key={index}
                className={`${
                  isActive
                    ? "bg-[#b38867] text-white"
                    : "text-gray-700 hover:bg-gray-100"
                } rounded-md px-3 py-2 mb-2 cursor-pointer transition-colors`}
                onClick={() => handleNavigation(item.path)}
              >
                {item.name}
              </li>
            );
          })}
        </ul>

        {/* ===== Account Section ===== */}
        <div className="text-gray-500 text-xs uppercase mt-4 mb-2">Account</div>
        <ul>
          <li
            className="text-gray-700 hover:bg-red-100 rounded-md px-3 py-2 mb-2 cursor-pointer"
            onClick={() => handleNavigation("/logout")}
          >
            Logout
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
