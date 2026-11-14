import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import {
  LayoutDashboard,
  Users,
  Calendar,
  CheckSquare,
  Award,
  BookOpen,
  Bell,
  GraduationCap,
  UserCheck,
  CreditCard,
  FileText,
  LogOut,
  Sparkles,
  ChevronRight,
  Settings
} from "lucide-react";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { role, user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  // ================= STRUCTURED MENU CONFIG =================
  const menuConfig = {
    admin: [
      {
        section: "Utama",
        items: [
          { name: "Dashboard", path: "/admin-dashboard", icon: LayoutDashboard },
        ],
      },
      {
        section: "Manajemen Pengguna",
        items: [
          { name: "Mentoring Pairings", path: "/admin-dashboard/pairings", icon: UserCheck },
          { name: "User Management", path: "/admin-dashboard/users", icon: Users },
        ],
      },
      {
        section: "Master Data & Akademik",
        items: [
          { name: "Learning Activities", path: "/admin-dashboard/learning-activities", icon: BookOpen },
          { name: "Paket Langganan", path: "/admin-dashboard/plans", icon: CreditCard },
          { name: "Progress Reports", path: "/admin-dashboard/reports", icon: FileText },
          { name: "Tutoring Schedule", path: "/admin-dashboard/schedules", icon: Calendar },
        ],
      },
      {
        section: "Pengaturan",
        items: [
          { name: "Pengaturan Akun", path: "/admin-dashboard/settings", icon: Settings },
        ],
      },
    ],
    mentor: [
      {
        section: "Utama",
        items: [
          { name: "Dashboard", path: "/mentor-dashboard", icon: LayoutDashboard },
          { name: "Daftar Mentee", path: "/mentor-dashboard/mentees", icon: Users },
        ],
      },
      {
        section: "Aktivitas Bimbingan",
        items: [
          { name: "Jadwal Mentoring", path: "/mentor-dashboard/schedules", icon: Calendar },
          { name: "Beri Tugas", path: "/mentor-dashboard/tasks", icon: CheckSquare },
          { name: "Review & Feedback", path: "/mentor-dashboard/reports", icon: Award },
          { name: "Upload Materi", path: "/mentor-dashboard/materials", icon: BookOpen },
        ],
      },
      {
        section: "Komunikasi",
        items: [
          { name: "Pengumuman", path: "/mentor-dashboard/announcements", icon: Bell },
        ],
      },
      {
        section: "Pengaturan",
        items: [
          { name: "Pengaturan Akun", path: "/mentor-dashboard/settings", icon: Settings },
        ],
      },
    ],
    mentee: [
      {
        section: "Utama",
        items: [
          { name: "Dashboard", path: "/mentee-dashboard", icon: LayoutDashboard },
          { name: "Student Portal", path: "/mentee-dashboard/student-portal", icon: GraduationCap },
        ],
      },
      {
        section: "Pembelajaran",
        items: [
          { name: "Materi & Aktivitas", path: "/mentee-dashboard/learning-activities", icon: BookOpen },
          { name: "Tugas Saya", path: "/mentee-dashboard/tasks", icon: CheckSquare },
          { name: "Laporan Perkembangan", path: "/mentee-dashboard/reports", icon: FileText },
        ],
      },
      {
        section: "Bimbingan & Mentor",
        items: [
          { name: "Jadwal Bimbingan", path: "/mentee-dashboard/schedule", icon: Calendar },
          { name: "Mentor Pembimbing", path: "/mentee-dashboard/mentor", icon: UserCheck },
          { name: "Pengumuman", path: "/mentee-dashboard/announcements", icon: Bell },
        ],
      },
      {
        section: "Pengaturan",
        items: [
          { name: "Pengaturan Akun", path: "/mentee-dashboard/settings", icon: Settings },
        ],
      },
    ],
  };

  const sections = menuConfig[role] || [];

  const getRoleDisplayName = (r) => {
    switch (r) {
      case "admin":
        return "Admin Panel";
      case "mentor":
        return "Mentor Panel";
      case "mentee":
        return "Mentee Panel";
      default:
        return "Portal Mentoring";
    }
  };

  const isItemActive = (path) => {
    if (path === "/admin-dashboard" || path === "/mentor-dashboard" || path === "/mentee-dashboard") {
      return location.pathname === path || location.pathname === path + "/";
    }
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  return (
    <aside className="w-68 bg-white border-r border-gray-200 flex flex-col justify-between h-screen sticky top-0 z-20 select-none shadow-xs">
      {/* Top Header / Logo Section */}
      <div>
        <div className="p-6 border-b border-gray-100 flex items-center gap-3.5 group cursor-pointer" onClick={() => navigate(`/${role}-dashboard`)}>
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#b38867]/20 to-[#b38867]/5 flex items-center justify-center p-2 border border-[#b38867]/20 group-hover:scale-105 group-hover:rotate-2 transition-all duration-300 shadow-xs">
            <img
              src="/assets/Logo Sistem Mentoring.png"
              alt="Logo"
              className="w-full h-full object-contain drop-shadow-xs"
            />
          </div>
          <div className="min-w-0">
            <h1 className="font-bold text-gray-900 text-base leading-tight tracking-tight">
              Aeterna
            </h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                {getRoleDisplayName(role)}
              </span>
            </div>
          </div>
        </div>

        {/* Scrollable Navigation Area */}
        <div className="px-4 py-5 overflow-y-auto max-h-[calc(100vh-175px)] space-y-6">
          {sections.map((sec, sIdx) => (
            <div key={sIdx} className="space-y-1.5">
              {/* Section Header */}
              <div className="px-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                {sec.section}
              </div>

              {/* Menu Items */}
              <ul className="space-y-1">
                {sec.items.map((item, iIdx) => {
                  const Icon = item.icon;
                  const active = isItemActive(item.path);

                  return (
                    <li key={iIdx}>
                      <button
                        onClick={() => navigate(item.path)}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold group transition-all duration-200 ease-in-out relative ${
                          active
                            ? "bg-gradient-to-r from-[#b38867] to-[#9c7152] text-white shadow-sm shadow-[#b38867]/30 translate-x-1"
                            : "text-gray-600 hover:text-[#7B5E4A] hover:bg-amber-50/70 hover:translate-x-1.5"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon
                            size={17}
                            className={`transition-all duration-200 ${
                              active
                                ? "text-white scale-110"
                                : "text-gray-400 group-hover:text-[#b38867] group-hover:scale-110 group-hover:rotate-2"
                            }`}
                          />
                          <span className="truncate">{item.name}</span>
                        </div>

                        {/* Animated Arrow / Active Indicator */}
                        {active ? (
                          <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        ) : (
                          <ChevronRight
                            size={14}
                            className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 text-gray-400 group-hover:text-[#b38867]"
                          />
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom User Profile & Logout Section */}
      <div className="p-4 border-t border-gray-100 bg-gray-50/60">
        <div className="p-3 bg-white rounded-2xl border border-gray-200/80 shadow-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#b38867] to-[#7B5E4A] text-white font-bold text-xs flex items-center justify-center shadow-xs shrink-0">
              {user?.name?.charAt(0) || "U"}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-gray-800 truncate leading-none">
                {user?.name || "Pengguna"}
              </p>
              <p className="text-[10px] text-gray-400 capitalize mt-1 truncate">
                {role || "Member"}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            title="Keluar dari akun"
            className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all duration-200 shrink-0 group"
          >
            <LogOut size={16} className="group-hover:rotate-12 transition-transform duration-200" />
          </button>
        </div>
      </div>
    </aside>
  );
}
