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
      { name: "My Mentor", path: "/mentee-dashboard/mentor" },
      { name: "My Tasks", path: "/mentee-dashboard/tasks" },
      { name: "My Reports", path: "/mentee-dashboard/reports" },
      { name: "Tutoring Schedule", path: "/mentee-dashboard/schedule" },
      { name: "Announcements", path: "/mentee-dashboard/announcements" },
      { name: "Student Portal", path: "/mentee-dashboard/student-portal" },
    ],
    admin: [
      { name: "Dashboard", path: "/admin-dashboard" },
      { name: "User Management", path: "/admin-dashboard/user-management" },
      { name: "Learning Path", path: "/admin-dashboard/learning-path" },
      { name: "Mentor-Mentee Pairing", path: "/admin-dashboard/pairings" },
      { name: "Progress Report", path: "/admin-dashboard/progress-report" },
      { name: "Student Portal", path: "/admin-dashboard/student-portal" },
      { name: "Tutoring Schedule", path: "/admin-dashboard/tutoring-schedule" },
    ],
  };

  const currentMenu = menus[role] || [];

  return (
    <aside className="w-64 h-screen bg-[#f7f1e9]/80 backdrop-blur-lg shadow-xl border-r border-[#d3c7b8]/50 px-6 py-6 flex flex-col justify-between">
      <div>
        {/* ===== Logo Section ===== */}
        <div className="flex flex-col items-center mb-10">
          <img
            src="/assets/Logo Sistem Mentoring.png"
            alt="Logo"
            className="w-20 h-20 object-contain mb-3 drop-shadow-sm"
          />
          <h2 className="text-lg font-bold tracking-wide text-[#5a4635]">
            {role === "mentor"
              ? "Mentor Panel"
              : role === "admin"
              ? "Admin Panel"
              : "Mentee Panel"}
          </h2>
        </div>

        {/* ===== Learning Section ===== */}
        <div className="text-[#8b7762] text-xs uppercase tracking-widest mb-3">
          Learning
        </div>

        <ul>
          {currentMenu.map((item, index) => {
            const isActive = location.pathname === item.path;

            return (
              <li
                key={index}
                onClick={() => handleNavigation(item.path)}
                className={`px-4 py-2 mb-2 rounded-xl cursor-pointer transition-all duration-200 font-medium tracking-wide
              ${
                isActive
                  ? "bg-[#b38867] text-white shadow-md"
                  : "text-[#5a4635] hover:bg-[#f0e7dd]"
              }
            `}
              >
                {item.name}
              </li>
            );
          })}
        </ul>

        {/* ===== Account Section ===== */}
        <div className="text-[#8b7762] text-xs uppercase tracking-widest mt-6 mb-3">
          Account
        </div>

        <ul>
          <li
            onClick={() => handleNavigation("/logout")}
            className="px-4 py-2 rounded-xl text-red-600 font-semibold cursor-pointer hover:bg-red-100 transition"
          >
            Logout
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
