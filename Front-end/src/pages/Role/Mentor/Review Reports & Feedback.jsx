import React from "react";
import Sidebar from "../../../components/Sidebar";
import Navbar from "../../../components/Navbar";
import { useAuth } from "../../../context/useAuth";

const ReviewReports = () => {
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
          <h1 className="text-3xl font-semibold">Give task Mentor</h1>
          <div className="mt-6">
            <p>Selamat datang di Dashboard Mentor</p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ReviewReports;
