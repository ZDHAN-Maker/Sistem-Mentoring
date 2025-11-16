import React from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "../../../components/Sidebar";
import Navbar from "../../../components/Navbar";
import { useAuth } from "../../../context/useAuth";

// Halaman yang ada di dashboard mentor
import ListOfMentees from "./ListOfMentees";
import GiveTask from "./GiveTask";
import MentoringSchedule from "./MentoringSchedule";
import ReviewReportsAndFeedback from "./Review Reports & Feedback";
import UploadMaterials from "./UploadMaterials";
import AnnouncementsMentor from "./AnnouncementsMentor";

const DashboardMentor = () => {
  const { role } = useAuth(); // Ambil langsung dari context

  // Dummy data agar tampilan mirip desain (bisa nanti diganti dari API)
  const upcomingSchedule = [
    {
      date: "5 Okt 2025",
      time: "19:00 – 20:30",
      title: "Frontend Dev",
      mode: "Online (Zoom)",
    },
  ];

  const mentees = ["Andi", "Andi", "Andi", "Andi", "Andi"];

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      {/* Sidebar */}
      <Sidebar role={role} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar tetap dipakai */}
        <Navbar />

        {/* Konten Dashboard */}
        <main className="flex-1 px-8 py-6">
          <div className="space-y-6">
            {/* KONTEN UTAMA: CARD SCHEDULE & MENTEE */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* CARD UPCOMING SCHEDULE */}
              <div className="bg-white rounded-2xl shadow p-6 flex flex-col">
                <div className="flex items-center gap-2 mb-4">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#f6e2c4]">
                    📅
                  </span>
                  <h2 className="text-lg font-semibold">Upcoming Schedule</h2>
                </div>

                <div className="border rounded-xl overflow-hidden flex-1">
                  {upcomingSchedule.map((item, index) => (
                    <div
                      key={index}
                      className="px-4 py-3 text-sm border-b last:border-b-0"
                    >
                      <p className="font-medium">
                        {item.date} | {item.time}
                      </p>
                      <p className="text-gray-700">
                        {item.title} | {item.mode}
                      </p>
                    </div>
                  ))}
                </div>

                <button className="mt-4 self-center text-xs md:text-sm text-gray-700 border border-gray-200 rounded-full px-4 py-2 hover:bg-gray-50 flex items-center gap-1">
                  Show All Schedule
                  <span>▾</span>
                </button>
              </div>

              {/* CARD MENTEE */}
              <div className="bg-white rounded-2xl shadow p-6 flex flex-col">
                <div className="flex items-center gap-2 mb-4">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#f6e2c4]">
                    👥
                  </span>
                  <h2 className="text-lg font-semibold">
                    Mentee : {mentees.length}
                  </h2>
                </div>

                <div className="border rounded-xl overflow-hidden flex-1">
                  {mentees.map((name, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 px-4 py-3 border-b last:border-b-0 text-sm"
                    >
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#f6e2c4]">
                        👤
                      </span>
                      <span>{name}</span>
                    </div>
                  ))}
                </div>

                <button className="mt-4 self-center text-xs md:text-sm text-gray-700 border border-gray-200 rounded-full px-4 py-2 hover:bg-gray-50 flex items-center gap-1">
                  Show All Mentee
                  <span>▾</span>
                </button>
              </div>
            </div>

            {/* BAGIAN ROUTES (struktur & fungsi tetap sama) */}
            <section className="mt-4">
              <Routes>
                <Route path="/" element={<p>Pilih halaman dari menu</p>} />
                <Route path="/mentors" element={<ListOfMentees />} />
                <Route path="/mentors/tasks" element={<GiveTask />} />
                <Route path="/mentors/schedules" element={<MentoringSchedule />} />
                <Route
                  path="/mentors/reports"
                  element={<ReviewReportsAndFeedback />}
                />
                <Route path="/mentors/materials" element={<UploadMaterials />} />
                <Route path="/announcements" element={<AnnouncementsMentor />} />
              </Routes>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardMentor;
