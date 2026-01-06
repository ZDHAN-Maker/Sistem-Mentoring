import React from "react";
import Navbar from "../../../components/Navbar";
import useMentorDashboard from "../../../hooks/Mentor/useMentorDashboard";
import { CalendarDaysIcon, UserGroupIcon } from "@heroicons/react/24/outline";

const DashboardHome = () => {
  const { loading, error, upcomingSchedule, mentees } = useMentorDashboard();

  if (loading) return <p className="p-6">Loading...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* ATTENDANCE CARD */}
      <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-sm border p-0 mb-6">
        {/* Card Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b">
          <div className="flex items-center gap-3">
            <CalendarDaysIcon className="w-6 h-6 text-gray-700" />
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Attendances</h2>
              <p className="text-gray-500 text-sm">
                Your attendance activity throughout the program.
              </p>
            </div>
          </div>

          <p className="text-gray-500 text-sm">
            Last updated:{" "}
            {new Date().toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>

        {/* Content */}
        <div>
          {upcomingSchedule.length > 0 ? (
            upcomingSchedule.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between px-6 py-4 border-b last:border-b-0 hover:bg-gray-50 transition"
              >
                <div>
                  <p className="font-medium text-gray-800">
                    Mentoring dengan {item.menteeName}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(item.start_time).toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "2-digit",
                    })}
                  </p>
                </div>

                <span className="px-4 py-1 rounded-lg bg-green-100 text-green-700 text-sm font-medium">
                  Attending
                </span>
              </div>
            ))
          ) : (
            <p className="px-6 py-8 text-gray-500 text-center">
              Belum ada jadwal mentoring
            </p>
          )}
        </div>

        {/* Show All */}
        <button className="w-full text-center py-4 text-gray-700 hover:bg-gray-100 text-sm font-semibold">
          Show all attendances
        </button>
      </div>

      {/* MENTEE LIST */}
      <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-sm border p-0">
        {/* Card Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b">
          <div className="flex items-center gap-3">
            <UserGroupIcon className="w-6 h-6 text-gray-700" />
            <h2 className="text-xl font-semibold text-gray-800">
              Daftar Mentee ({mentees.length})
            </h2>
          </div>
        </div>

        {/* List */}
        <div>
          {mentees.length > 0 ? (
            mentees.map((name, i) => (
              <div
                key={i}
                className="px-6 py-4 border-b last:border-b-0 hover:bg-gray-50 transition font-medium text-gray-800"
              >
                {name}
              </div>
            ))
          ) : (
            <p className="px-6 py-8 text-gray-500 text-center">
              Belum memiliki mentee
            </p>
          )}
        </div>

        {/* Show All Mentees */}
        <button className="w-full text-center py-4 text-gray-700 hover:bg-gray-100 text-sm font-semibold">
          Show all mentees
        </button>
      </div>
    </div>
  );
};

export default DashboardHome;
