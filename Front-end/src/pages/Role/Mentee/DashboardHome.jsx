import React, { useMemo } from "react";
import { useAuth } from "../../../context/useAuth";
import useMenteeDashboard from "../../../hooks/mentee/useMenteeDashboard";

// Import Icons
import {
  ChartBarIcon,
  ClipboardDocumentListIcon,
  CalendarDaysIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";

const DashboardHome = () => {
  const { user } = useAuth();

  const { stats, upcomingSchedules, loading } = useMenteeDashboard();

  const tasks =
    stats?.task_list ||
    stats?.tasks?.list ||
    stats?.tasks?.items ||
    [];

  /* ===== MAP TASKS → ASSIGNMENTS ===== */
  const assignments = useMemo(
    () =>
      tasks.map((task) => ({
        id: task.id,
        title: task.judul || task.title || "Untitled Task",
        status: mapTaskStatus(task.status),
        type: "Task",
      })),
    [tasks]
  );

  /* ===== PROGRESS ===== */
  const progress = stats?.tasks ?? {
    total: 0,
    completed: 0,
    progress_percentage: 0,
    status: "Not Started",
  };

  return (
    <div>
      {/* ===== HEADER ===== */}
      <div className="mb-8">
        <p className="text-slate-500 mt-1">
          Selamat datang, {user?.name || "Mentee"}! Pantau progres belajarmu di sini.
        </p>
      </div>

      {loading && (
        <p className="text-slate-500 mb-4">
          Memuat data dashboard...
        </p>
      )}

      <div className="grid grid-cols-1 gap-6">
        {/* ===== PROGRESS SUMMARY ===== */}
        <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ChartBarIcon className="w-6 h-6 text-slate-700" />
              <h2 className="text-xl font-semibold text-slate-800">
                Progress Summary
              </h2>
            </div>

            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                progress.status === "Completed"
                  ? "bg-emerald-100 text-emerald-700"
                  : progress.status === "Not Started"
                  ? "bg-rose-100 text-rose-700"
                  : "bg-amber-100 text-amber-700"
              }`}
            >
              {progress.status}
            </span>
          </div>

          <p className="text-xs text-slate-500 mb-2">
            {progress.completed} dari {progress.total} tugas sudah selesai
          </p>

          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-emerald-500 transition-all"
              style={{ width: `${progress.progress_percentage}%` }}
            />
          </div>

          <p className="text-sm font-semibold text-emerald-600">
            {progress.progress_percentage}%
          </p>
        </section>

        {/* ===== ASSIGNMENTS ===== */}
        <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ClipboardDocumentListIcon className="w-6 h-6 text-slate-700" />
              <h2 className="text-xl font-semibold text-slate-800">
                Assignments
              </h2>
            </div>

            <span className="text-xs text-slate-500">
              {assignments.length} tugas
            </span>
          </div>

          <div className="space-y-3">
            {assignments.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-lg border px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-slate-800">
                    {item.title}
                  </p>
                  <p className="text-xs text-slate-500">
                    {item.type} • ID: {item.id}
                  </p>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(
                    item.status
                  )}`}
                >
                  {item.status}
                </span>
              </div>
            ))}

            {assignments.length === 0 && !loading && (
              <p className="text-sm text-slate-500 italic">
                Belum ada tugas.
              </p>
            )}
          </div>
        </section>

        {/* ===== UPCOMING SCHEDULE ===== */}
        <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CalendarDaysIcon className="w-6 h-6 text-slate-700" />
              <h2 className="text-xl font-semibold text-slate-800">
                Upcoming Schedule
              </h2>
            </div>

            <span className="text-xs text-slate-500">
              {upcomingSchedules.length} jadwal
            </span>
          </div>

          <div className="space-y-3">
            {upcomingSchedules.map((schedule) => (
              <div
                key={schedule.id}
                className="flex items-center justify-between rounded-lg border px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-slate-800">
                    {schedule.title || "Mentoring Session"}
                  </p>
                  <p className="text-xs text-slate-500">
                    Dengan {schedule.pairing?.mentor?.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {formatDateTime(schedule.start_time)} –{" "}
                    {formatTime(schedule.end_time)}
                  </p>

                  {schedule.location && (
                    <p className="text-xs text-slate-400 flex items-center gap-1">
                      <MapPinIcon className="w-4 h-4" />
                      {schedule.location}
                    </p>
                  )}
                </div>

                <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                  Upcoming
                </span>
              </div>
            ))}

            {upcomingSchedules.length === 0 && !loading && (
              <p className="text-sm text-slate-500 italic">
                Tidak ada jadwal mentoring terdekat.
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

/* ===== HELPERS ===== */

const mapTaskStatus = (status) => {
  switch (status) {
    case "approved":
      return "Completed";
    case "submitted":
      return "On Going";
    default:
      return "Not Completed";
  }
};

const getStatusClass = (status) => {
  switch (status) {
    case "Completed":
      return "bg-emerald-100 text-emerald-700";
    case "On Going":
      return "bg-amber-100 text-amber-700";
    default:
      return "bg-rose-100 text-rose-700";
  }
};

const formatDateTime = (dateTime) =>
  new Date(dateTime).toLocaleString("id-ID", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const formatTime = (dateTime) =>
  new Date(dateTime).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });

export default DashboardHome;
