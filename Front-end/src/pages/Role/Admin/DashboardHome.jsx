import React from "react";
import Sidebar from "../../../components/Sidebar";
import Navbar from "../../../components/Navbar";
import useAdminDashboard from "../../../hooks/Admin/useAdminDashboard";

const DashboardHome = () => {
  const { stats, loading } = useAdminDashboard();

  if (loading) return <p className="p-10">Loading...</p>;
  if (!stats) return <p className="p-10 text-red-500">Gagal memuat data</p>;

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <div className="flex-1">
        <main className="p-8">
          <h1 className="text-3xl font-semibold mb-6">Dashboard Admin</h1>

          <div className="grid grid-cols-2 gap-6">
            {/* Mentee Card */}
            <div className="bg-white p-5 rounded-xl shadow">
              <h2 className="text-xl font-semibold mb-4">
                Mentee : {stats.total_mentees}
              </h2>

              {stats.mentees.map((m, i) => (
                <div key={i} className="border-b py-2 flex justify-between">
                  <span>{m.name}</span>
                </div>
              ))}
            </div>

            {/* Mentor Card */}
            <div className="bg-white p-5 rounded-xl shadow">
              <h2 className="text-xl font-semibold mb-4">
                Mentor : {stats.total_mentors}
              </h2>

              {stats.mentors.map((m, i) => (
                <div key={i} className="border-b py-2 flex justify-between">
                  <span>{m.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Schedule */}
          <div className="mt-8 bg-white p-5 rounded-xl shadow max-w-xl">
            <h2 className="text-xl font-semibold mb-4">
              Upcoming Schedule ({stats.upcoming_schedules.length})
            </h2>

            {stats.upcoming_schedules.length === 0 ? (
              <p className="text-gray-500">Tidak ada jadwal mendatang</p>
            ) : (
              stats.upcoming_schedules.map((item, i) => (
                <div key={i} className="border-b py-3">
                  <p className="font-medium">
                    {item.mentor.name} → {item.mentee.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {item.date} • {item.time}
                  </p>
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardHome;

