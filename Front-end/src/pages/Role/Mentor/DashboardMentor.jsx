import React from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "../../../components/Sidebar";
import Navbar from "../../../components/Navbar";
import { useAuth } from "../../../context/useAuth";

// Halaman di dashboard mentor
import DashboardHome from "./DashboardHome";
import ListOfMentees from "./ListOfMentees";
import GiveTask from "./GiveTask";
import MentoringSchedule from "./MentoringSchedule";
import ReviewReportsAndFeedback from "./Review Reports & Feedback";
import UploadMaterials from "./UploadMaterials";
import AnnouncementsMentor from "./AnnouncementsMentor";
import SettingsMentor from "./SettingsMentor";

const DashboardMentor = () => {
  const { role } = useAuth();

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      {/* Sidebar Khusus Mentor */}
      <Sidebar role={role} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />

        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route path="/mentees" element={<ListOfMentees />} />
            <Route path="/tasks" element={<GiveTask />} />
            <Route path="/schedules" element={<MentoringSchedule />} />
            <Route path="/reports" element={<ReviewReportsAndFeedback />} />
            <Route path="/materials" element={<UploadMaterials />} />
            <Route path="/announcements" element={<AnnouncementsMentor />} />
            <Route path="/settings" element={<SettingsMentor />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default DashboardMentor;
