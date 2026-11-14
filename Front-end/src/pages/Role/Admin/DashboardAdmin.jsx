import React from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "../../../components/Sidebar";   
import Navbar from "../../../components/Navbar";     
import { useAuth } from "../../../context/useAuth";

// Sub-halaman Admin
import DashboardHomeAdmin from "./DashboardHomeAdmin";
import PairingAdmin from "./PairingAdmin";
import ListOfMentees from "./ListOfMentees";
import LearningActivities from "./LearningActivities";
import SubscriptionPlansAdmin from "./SubscriptionPlansAdmin";
import ProgressReportAdmin from "./ProgressReportAdmin";
import TutoringScheduleAdmin from "./TutoringScheduleAdmin";
import SettingsAdmin from "./SettingsAdmin";

const DashboardAdmin = () => {
  const { role } = useAuth();

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      {/* Sidebar khusus Admin */}
      <Sidebar role={role} />

      {/* Konten Utama */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Navbar */}
        <Navbar />

        {/* Dynamic Sub-page Container */}
        <main className="flex-1 p-6 md:p-8 w-full min-w-0">
          <Routes>
            <Route path="/" element={<DashboardHomeAdmin />} />
            <Route path="/pairings" element={<PairingAdmin />} />
            <Route path="/users" element={<ListOfMentees />} />
            <Route path="/mentees" element={<ListOfMentees />} />
            <Route path="/learning-activities" element={<LearningActivities />} />
            <Route path="/plans" element={<SubscriptionPlansAdmin />} />
            <Route path="/reports" element={<ProgressReportAdmin />} />
            <Route path="/schedules" element={<TutoringScheduleAdmin />} />
            <Route path="/settings" element={<SettingsAdmin />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default DashboardAdmin;
