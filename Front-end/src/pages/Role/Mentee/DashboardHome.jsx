// src/pages/Role/Mentee/DashboardHome.jsx
import React, { useMemo } from "react";
import { useAuth } from "../../../context/useAuth";
import useMenteeDashboard from "../../../hooks/mentee/useMenteeDashboard";

const DashboardHome = () => {
  const { user } = useAuth();
  const { tasks, loading } = useMenteeDashboard();

  /**
   * Transform task dari API → format UI
   */
  const assignments = useMemo(() => {
    return tasks.map((task) => ({
      id: task.id,
      title: task.judul,
      status: mapTaskStatus(task.status),
      type: "Task",
    }));
  }, [tasks]);

  /**
   * Hitung progress
   */
  const { percentage, completedCount, totalCount } = useMemo(() => {
    const total = assignments.length;
    const completed = assignments.filter(
      (item) => item.status === "Completed"
    ).length;

    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

    return {
      percentage: percent,
      completedCount: completed,
      totalCount: total,
    };
  }, [assignments]);

  // Helper warna badge
  const getStatusClass = (status) => {
    switch (status) {
      case "Completed":
        return "bg-emerald-100 text-emerald-700";
      case "On Going":
        return "bg-amber-100 text-amber-700";
      case "Not Completed":
      default:
        return "bg-rose-100 text-rose-700";
    }
  };

  if (loading) {
    return <p className="text-slate-500">Loading dashboard...</p>;
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-slate-800">
            Dashboard Mentee
          </h1>
          <p className="text-slate-500 mt-1">
            Selamat datang, {user?.name || "Mentee"}! Pantau progres belajarmu di
            sini.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* === PROGRESS SUMMARY === */}
        <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-slate-800">
              Progress Summary
            </h2>

            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                percentage === 100
                  ? "bg-emerald-100 text-emerald-700"
                  : percentage === 0
                  ? "bg-rose-100 text-rose-700"
                  : "bg-amber-100 text-amber-700"
              }`}
            >
              {percentage === 100
                ? "Completed"
                : percentage === 0
                ? "Not Started"
                : "On Going"}
            </span>
          </div>

          <p className="text-xs text-slate-500 mb-2">
            {completedCount} dari {totalCount} tugas sudah selesai
          </p>

          {/* Progress bar */}
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-emerald-500 transition-all"
              style={{ width: `${percentage}%` }}
            />
          </div>

          <p className="text-sm font-semibold text-emerald-600">
            {percentage}%
          </p>
        </section>

        {/* === ASSIGNMENTS === */}
        <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-slate-800">
              Assignments
            </h2>
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

            {assignments.length === 0 && (
              <p className="text-sm text-slate-500 italic">
                Belum ada tugas.
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

/**
 * Mapper status backend → UI
 */
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

export default DashboardHome;
