// src/pages/Role/Admin/DashboardAdmin.jsx
import React from "react";
import Sidebar from "../../../components/Sidebar";
import Navbar from "../../../components/Navbar";
import AdminRoutes from "../../../routes/admin/Routes";

const DashboardAdmin = () => {
  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      {/* Sidebar */}
      <Sidebar role="admin" />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <Navbar />

        {/* Content Area */}
        <main className="flex-1 p-8">
          <AdminRoutes />
        </main>
      </div>
    </div>
  );
};

export default DashboardAdmin;