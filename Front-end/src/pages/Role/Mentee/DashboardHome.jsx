// src/pages/Role/Mentee/DashboardHome.jsx
import React, { useMemo, useState } from "react";
import { useAuth } from "../../../context/useAuth";

const DashboardHome = () => {
  const { user } = useAuth();

  // --- Dummy data: nanti bisa diganti dengan data dari API / context ---
  const [assignments] = useState([
    {
      id: 1,
      title: "Memulai Dasar Pemrograman untuk Menjadi Pengembang Software",
      status: "Completed",
      type: "Module",
    },
    {
      id: 2,
      title: "Latihan 1: Pengenalan Variabel & Tipe Data",
      status: "On Going",
      type: "Task",
    },
    {
      id: 3,
      title: "Latihan 2: Percabangan & Perulangan",
      status: "Not Completed",
      type: "Task",
    },
  ]);

  // Hitung progress otomatis dari assignments
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

  // Helper untuk warna badge status
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

  return (
    <div>
      {/* Header Dashboard */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-slate-800">
            Dashboard Mentee
          </h1>
          <p className="text-slate-500 mt-1">
            Selamat datang, {user?.name || "Mentee"}! Pantau progres belajarmu di sini.
          </p>
        </div>
      </div>

      {/* Grid konten utama */}
      <div className="grid grid-cols-1 gap-6">
        {/* === PROGRESS SUMMARY CARD === */}
        <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-50 border border-emerald-100">
                <span className="text-emerald-500 text-xl">📘</span>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-800">
                  Progress Summary
                </h2>
                <p className="text-sm text-slate-500">
                  Ringkasan progres dari materi & tugas yang kamu kerjakan.
                </p>
              </div>
            </div>

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

          {/* Info modul utama */}
          <div className="mb-4">
            <p className="text-sm font-medium text-slate-700">
              Memulai Dasar Pemrograman untuk Menjadi Pengembang Software
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {completedCount} dari {totalCount} tugas sudah selesai.
            </p>
          </div>

          {/* Progress bar */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                Overall Progress
              </span>
              <span className="text-sm font-semibold text-emerald-600">
                {percentage}%
              </span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full from-emerald-400 to-emerald-500"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>

          {/* Footer progress card */}
          <div className="flex items-center justify-between mt-4 text-xs text-slate-500">
            <button
              type="button"
              className="flex items-center gap-1 hover:text-emerald-600 transition-colors"
            >
              <span>Show All Progress</span>
              <span>▾</span>
            </button>

            <div className="flex gap-4">
              <span>
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 mr-1" />
                Completed: {completedCount}
              </span>
              <span>
                <span className="inline-block w-2 h-2 rounded-full bg-slate-300 mr-1" />
                Total: {totalCount}
              </span>
            </div>
          </div>
        </section>

        {/* === ASSIGNMENTS CARD === */}
        <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-sky-50 border border-sky-100">
                <span className="text-sky-500 text-xl">📄</span>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-800">
                  Assignments
                </h2>
                <p className="text-sm text-slate-500">
                  Daftar tugas yang perlu kamu selesaikan.
                </p>
              </div>
            </div>

            <span className="text-xs text-slate-500">
              {assignments.length} tugas terdaftar
            </span>
          </div>

          {/* List assignments */}
          <div className="space-y-3">
            {assignments.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-lg border border-slate-100 px-4 py-3 hover:bg-slate-50 transition-colors"
              >
                <div>
                  <p className="text-sm font-medium text-slate-800">
                    {item.title}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {item.type === "Module" ? "Materi" : "Tugas"} • ID:{" "}
                    {item.id}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(
                      item.status
                    )}`}
                  >
                    {item.status}
                  </span>
                </div>
              </div>
            ))}

            {assignments.length === 0 && (
              <p className="text-sm text-slate-500 italic">
                Belum ada tugas yang terdaftar.
              </p>
            )}
          </div>

          {/* Footer assignments card */}
          <div className="flex items-center justify-between mt-4 text-xs text-slate-500">
            <button
              type="button"
              className="flex items-center gap-1 hover:text-sky-600 transition-colors"
            >
              <span>Show All Assignments</span>
              <span>▾</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DashboardHome;