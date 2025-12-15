// src/pages/Role/Mentee/DashboardMentee.jsx
import React from "react";
import Sidebar from "../../../components/Sidebar";
import Navbar from "../../../components/Navbar";

import MenteeRoutes from "../../../routes/mentee/Routes";

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
          <MenteeRoutes />
        </main>
      </div>
    </div>
  );
};

export default DashboardMentee;
