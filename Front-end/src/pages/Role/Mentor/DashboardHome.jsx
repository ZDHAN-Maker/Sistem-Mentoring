// src/pages/Role/Mentor/DashboardHome.jsx
import React from "react";
import { useAuth } from "../../../context/useAuth";

const DashboardHome = () => {
  const { user } = useAuth();

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-gray-500">
          Selamat datang, {user?.name || "Mentor"}!
        </p>
      </div>

      {/* Dashboard Content - Stats, Schedule, Mentees, dll */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Schedule Card */}
        <div className="bg-white rounded-2xl shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              📅
            </div>
            <h2 className="text-lg font-semibold">Upcoming Schedule</h2>
          </div>
          
          <div className="space-y-3">
            <div className="border-l-4 border-blue-500 pl-4 py-2">
              <p className="font-medium">5 Okt 2025 | 19:00 - 20:30</p>
              <p className="text-sm text-gray-600">Frontend Dev | Online (Zoom)</p>
            </div>
          </div>

          <button className="mt-4 text-blue-600 text-sm font-medium hover:underline">
            Show All Schedule →
          </button>
        </div>

        {/* Mentee Card */}
        <div className="bg-white rounded-2xl shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              👥
            </div>
            <h2 className="text-lg font-semibold">Mentee: 5</h2>
          </div>

          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-3 py-2">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  👤
                </div>
                <span className="text-sm">Andi</span>
              </div>
            ))}
          </div>

          <button className="mt-4 text-purple-600 text-sm font-medium hover:underline">
            Show All Mentee →
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;