import React from 'react';
import Sidebar from '../components/Sidebar';  // Import Sidebar
import Navbar from '../components/Navbar';    // Import Navbar

const Dashboard = ({ role }) => {
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
          <h1 className="text-3xl font-semibold">Dashboard</h1>
          <div className="mt-6">
            {/* Tempat konten utama */}
            <p>Selamat datang di Dashboard</p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
