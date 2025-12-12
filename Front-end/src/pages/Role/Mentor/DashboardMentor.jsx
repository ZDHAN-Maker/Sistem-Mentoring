// src/pages/Role/Mentor/DashboardMentor.jsx
import React from "react";
import Sidebar from "../../../components/Sidebar";
import Navbar from "../../../components/Navbar";
import MentorRoutes from "../../../routes/mentor/Routes";
import { useAuth } from "../../../context/useAuth";

const DashboardMentor = () => {
  const { role } = useAuth();
  const upcomingSchedule =
    JSON.parse(localStorage.getItem("mentor-events")) || [];

  const mentees = ["Andi", "Budi", "Citra"];
  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar role={role} />

      <div className="flex-1 flex flex-col">
        <Navbar />

        <main className="flex-1 p-8">
          <MentorRoutes upcomingSchedule={upcomingSchedule} mentees={mentees} />
        </main>
      </div>
    </div>
  );
};

export default DashboardMentor;
