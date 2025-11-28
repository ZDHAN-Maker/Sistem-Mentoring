// src/pages/Role/Mentee/DashboardMentee.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "../../../components/Sidebar";
import Navbar from "../../../components/Navbar";

// Import komponen halaman
import DashboardHome from "./DashboardHome";
import MyTasks from "./MyTasks";
import MyReports from "./MyReports";
import TutoringSchedule from "./TutoringSchedule";
import MyMentor from "./MyMentor";
import AnnouncementsMentee from "./AnnouncementsMentee";
import StudentPortal from "./StudentPortalMentee";
import LearningActivities from "./LearningActivities";

const DashboardMentee = () => {
  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <Navbar />

        {/* Content Area */}
        <main className="flex-1 p-8">
          <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route path="/tasks" element={<MyTasks />} />
            <Route path="/reports" element={<MyReports />} />
            <Route path="/schedule" element={<TutoringSchedule />} />
            <Route path="/mentor" element={<MyMentor />} />
            <Route path="/announcements" element={<AnnouncementsMentee />} />
            <Route path="/student-portal" element={<StudentPortal />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default DashboardMentee;