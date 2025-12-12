// src/pages/Role/Mentor/DashboardHome.jsx
import React from "react";
import Navbar from "../../../components/Navbar";

const DashboardHome = ({ upcomingSchedule = [], mentees = [] }) => {
  return (
    <div className="p-6">

      {/* === NAVBAR === */}
      <Navbar />

      {/* === CARDS SECTION === */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">

        {/* UPCOMING SCHEDULE */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Upcoming Schedule</h2>
          <div className="border rounded-xl overflow-hidden">
            {upcomingSchedule.length > 0 ? (
              upcomingSchedule.map((item, index) => (
                <div key={index} className="px-4 py-3 border-b last:border-b-0">
                  {item.title}
                </div>
              ))
            ) : (
              <p className="px-4 py-3 text-gray-500">Belum ada acara</p>
            )}
          </div>
        </div>

        {/* MENTEE LIST */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Mentees: {mentees.length}</h2>
          <div className="border rounded-xl overflow-hidden">
            {mentees.map((name, i) => (
              <div key={i} className="px-4 py-3 border-b last:border-b-0">
                {name}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardHome;
