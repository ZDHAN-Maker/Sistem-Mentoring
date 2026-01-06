import React from "react";
import { UsersIcon, UserGroupIcon, CalendarDaysIcon } from "@heroicons/react/24/outline";
import useAdminDashboard from "../../../hooks/Admin/useAdminDashboard";

const DashboardHome = () => {
  const { stats, loading } = useAdminDashboard();

  if (loading) return <p className="p-10">Loading...</p>;
  if (!stats) return <p className="p-10 text-red-500">Gagal memuat data</p>;

  /* NORMALISASI DATA */
  const mentees = Array.isArray(stats.mentees) ? stats.mentees : [];
  const mentors = Array.isArray(stats.mentors) ? stats.mentors : [];
  const upcomingSchedules = Array.isArray(stats.upcoming_schedules)
    ? stats.upcoming_schedules
    : [];

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      {/* MAIN CONTENT */}
      <div className="flex-1">
        <main className="p-8">
          {/* TOP CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* MENTEE CARD */}
            <div className="bg-white p-6 rounded-xl shadow border border-slate-200">
              <div className="flex items-center gap-3 mb-4">
                <UsersIcon className="w-7 h-7 text-[#b38867]" />
                <h2 className="text-xl font-semibold text-slate-800">
                  Total Mentee
                </h2>
              </div>

              <p className="text-3xl font-bold text-[#b38867] mb-4">
                {stats.total_mentees}
              </p>

              <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                {mentees.map((m, i) => (
                  <div
                    key={i}
                    className="border-b py-2 text-sm flex justify-between"
                  >
                    <span className="text-slate-700">{m.name}</span>
                  </div>
                ))}

                {mentees.length === 0 && (
                  <p className="text-sm text-slate-500 italic">
                    Tidak ada data mentee
                  </p>
                )}
              </div>
            </div>

            {/* MENTOR CARD */}
            <div className="bg-white p-6 rounded-xl shadow border border-slate-200">
              <div className="flex items-center gap-3 mb-4">
                <UserGroupIcon className="w-7 h-7 text-[#b38867]" />
                <h2 className="text-xl font-semibold text-slate-800">
                  Total Mentor
                </h2>
              </div>

              <p className="text-3xl font-bold text-[#b38867] mb-4">
                {stats.total_mentors}
              </p>

              <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                {mentors.map((m, i) => (
                  <div
                    key={i}
                    className="border-b py-2 text-sm flex justify-between"
                  >
                    <span className="text-slate-700">{m.name}</span>
                  </div>
                ))}

                {mentors.length === 0 && (
                  <p className="text-sm text-slate-500 italic">
                    Tidak ada data mentor
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* UPCOMING SCHEDULE */}
          <div className="mt-10 bg-white p-6 rounded-xl shadow border border-slate-200 max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <CalendarDaysIcon className="w-7 h-7 text-[#b38867]" />
              <h2 className="text-xl font-semibold text-slate-800">
                Upcoming Schedule ({upcomingSchedules.length})
              </h2>
            </div>

            {upcomingSchedules.length === 0 ? (
              <p className="text-slate-500">Tidak ada jadwal mendatang</p>
            ) : (
              <div className="space-y-3">
                {upcomingSchedules.map((item, i) => (
                  <div key={i} className="border p-4 rounded-lg">
                    <p className="font-medium text-slate-800">
                      {item.mentor?.name || "Mentor"} →{" "}
                      {item.mentee?.name || "Mentee"}
                    </p>
                    <p className="text-sm text-slate-500">
                      {item.date || "-"} • {item.time || "-"}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardHome;
