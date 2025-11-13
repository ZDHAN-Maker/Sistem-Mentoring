// src/components/Sidebar.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const Sidebar = () => {
  const navigate = useNavigate();
  const { role } = useAuth();

  const handleNavigation = (path) => navigate(path);

  // ================= MENU CONFIG =================
  const menus = {
    mentor: [
      { name: "Dashboard", path: "/mentor-dashboard", active: true },
      { name: "List of Mentees", path: "/mentors" },
      { name: "Mentoring Schedule", path: "/mentors/schedules" },
      { name: "Give Task", path: "/mentors/tasks" },
      { name: "Review Reports & Feedback", path: "/mentors/reports" },
      { name: "Upload Materials", path: "/mentors/materials" },
      { name: "Announcements", path: "/announcements" },
    ],
    mentee: [
      { name: "Dashboard", path: "/mentee-dashboard", active: true },
      { name: "My Tasks", path: "/mentee/tasks" },
      { name: "My Reports", path: "/mentee/reports" },
      { name: "Tutoring Schedule", path: "/mentee/schedule" },
      { name: "My Mentor", path: "/mentee/mentor" },
      { name: "Announcements", path: "/announcements" },
      {name:"Student Portal", path:"/student-portal"},
      {name:"LearningActivities", path:"/learning-activities"}
    ],
  };

  const currentMenu = menus[role] || [];

  // ================= RENDER =================
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
            {role === "mentor" ? "Mentor Panel" : "Mentee Panel"}
          </h2>
        </div>

        {/* ===== Learning Section ===== */}
        <div className="text-gray-500 text-xs uppercase mb-2">Learning</div>
        <ul>
          {currentMenu.map((item, index) => (
            <li
              key={index}
              className={`${
                item.active
                  ? "bg-[#b38867] text-white"
                  : "text-gray-700 hover:bg-gray-100"
              } rounded-md px-3 py-2 mb-2 cursor-pointer`}
              onClick={() => handleNavigation(item.path)}
            >
              {item.name}
            </li>
          ))}
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
