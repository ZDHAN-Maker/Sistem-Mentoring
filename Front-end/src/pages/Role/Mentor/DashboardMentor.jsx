// src/pages/Role/Mentor/DashboardMentor.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "../../../components/Sidebar";
import { useAuth } from "../../../context/useAuth";

// Halaman di dashboard mentor
import DashboardHome from "./DashboardHome";
import ListOfMentees from "./ListOfMentees";
import GiveTask from "./GiveTask";
import MentoringSchedule from "./MentoringSchedule";
import ReviewReportsAndFeedback from "./Review Reports & Feedback";
import UploadMaterials from "./UploadMaterials";
import AnnouncementsMentor from "./AnnouncementsMentor";

const DashboardMentor = () => {
  const { role } = useAuth();

  const upcomingSchedule = JSON.parse(localStorage.getItem("mentor-events")) || [];


  const mentees = ["Andi", "Andi", "Andi", "Andi", "Andi"];

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      {/* Sidebar */}
      <Sidebar role={role} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* DashboardHome akan tampil mulai dari sini */}
        <DashboardHome />
        <main className="flex-1 px-8 py-6">
          <div className="space-y-6">

            {/* CARD-KARD DASHBOARD HANYA MUNCUL DI ROUTE "/" */}
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    {/* CARD SCHEDULE & MENTEE */}
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
                          {upcomingSchedule.length > 0 ? (
                            upcomingSchedule.map((item, index) => (
                              <div key={index} className="px-4 py-3 text-sm border-b last:border-b-0">
                                <p className="font-medium">
                                  {item.date} | {item.time}
                                </p>
                                <p className="text-gray-700">{item.title}</p>
                              </div>
                            ))
                          ) : (
                            <p className="text-gray-500 px-4 py-3">Belum ada acara</p>
                          )}
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
                  </>
                }
              />

              {/* ROUTES LAIN */}
              <Route path="/mentees" element={<ListOfMentees />} />
              <Route path="/tasks" element={<GiveTask />} />
              <Route path="/schedules" element={<MentoringSchedule />} />
              <Route path="/reports" element={<ReviewReportsAndFeedback />} />
              <Route path="/materials" element={<UploadMaterials />} />
              <Route path="/announcements" element={<AnnouncementsMentor />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardMentor;
