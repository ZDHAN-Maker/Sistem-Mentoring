import React from "react";
import Sidebar from "../../../components/Sidebar";   
import Navbar from "../../../components/Navbar";     

const DashboardMentee = ({ role }) => {
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
          <h1 className="text-3xl font-semibold">Dashboard Mentee</h1>
          <div className="mt-6">
            {/* Tempat konten utama */}
            <p>Selamat datang di Dashboard Mentee</p>
            {/* Tambahkan lebih banyak konten sesuai kebutuhan */}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardMentee;
