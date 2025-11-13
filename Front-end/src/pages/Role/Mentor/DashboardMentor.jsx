import React from "react";
import { Routes, Route } from "react-router-dom"; // Import Routes dan Route untuk menampilkan konten dinamis
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

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      {/* Sidebar */}
      <Sidebar role={role} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <Navbar />

        {/* Konten Dashboard */}
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-semibold">Dashboard Mentor</h1>
          <div className="mt-6">
            <p>Selamat datang di Dashboard Mentor</p>

            {/* Menampilkan halaman berdasarkan menu yang dipilih */}
            <Routes>
              <Route path="/" element={<p>Pilih halaman dari menu</p>} />
              <Route path="/list-of-mentees" element={<ListOfMentees />} />
              <Route path="/give-task" element={<GiveTask />} />
              <Route path="/mentoring-schedule" element={<MentoringSchedule />} />
              <Route path="/review-reports" element={<ReviewReportsAndFeedback />} />
              <Route path="/upload-materials" element={<UploadMaterials />} />
              <Route path="/announcements" element={<AnnouncementsMentor />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardMentor;
