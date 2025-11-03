import React from "react";
import { FaBook, FaTasks } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const Dashboard = () => {
  const navigate = useNavigate(); // Gunakan navigate yang benar

  const handleGoToLearningActivities = () => {
    navigate('/learning-activities'); // Arahkan ke Learning Activities
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-6 flex flex-col justify-between">
        <div>
          <div className="flex flex-col items-center mb-8">
            <img
              src="/assets/Logo Sistem Mentoring.png"
              alt="Logo"
              className="w-20 h-20 object-contain mb-2"
            />
          </div>

          <div className="text-gray-500 text-xs uppercase mb-2">Learning</div>
          <ul>
            <li className="bg-[#b38867] text-white rounded-md px-3 py-2 mb-2 cursor-pointer">
              Dashboard
            </li>
            {/* Perbaiki event click untuk Learning Activities */}
            <li
              className="text-gray-700 hover:bg-gray-100 rounded-md px-3 py-2 mb-2 cursor-pointer"
              onClick={handleGoToLearningActivities} // Menambahkan event handler
            >
              Learning Activities
            </li>
            <li className="text-gray-700 hover:bg-gray-100 rounded-md px-3 py-2 mb-2 cursor-pointer">
              Tutoring Schedule
            </li>
            <li className="text-gray-700 hover:bg-gray-100 rounded-md px-3 py-2 mb-2 cursor-pointer">
              Progress Report
            </li>
          </ul>

          <div className="text-gray-500 text-xs uppercase mt-4 mb-2">Document</div>
          <ul>
            <li className="text-gray-700 hover:bg-gray-100 rounded-md px-3 py-2 mb-2 cursor-pointer">
              Student Portal
            </li>
            <li className="text-gray-700 hover:bg-gray-100 rounded-md px-3 py-2 mb-2 cursor-pointer">
              Announcement
            </li>
            <li className="text-gray-700 hover:bg-gray-100 rounded-md px-3 py-2 mb-2 cursor-pointer">
              Logout
            </li>
          </ul>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Sistem Mentoring</h1>
          <div className="flex items-center gap-4">
            <button className="text-gray-600">
              <i className="fas fa-bell"></i>
            </button>
            <div className="flex items-center gap-2">
              <span className="text-gray-800 font-medium">Nama</span>
              <div className="w-10 h-10 bg-[#b38867] rounded-full"></div>
            </div>
          </div>
        </header>

        {/* Progress Summary Card */}
        <section className="bg-white shadow-md rounded-lg mb-6">
          <div className="flex items-center gap-2 border-b p-4">
            <FaBook className="text-xl text-gray-700" />
            <h2 className="text-lg font-semibold">Progress Summary</h2>
          </div>
          <div className="p-4">
            <p className="mb-2">
              Memulai Dasar Pemrograman untuk Menjadi Pengembang Software
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
              <div
                className="bg-green-500 h-2.5 rounded-full"
                style={{ width: "100%" }}
              ></div>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span>100%</span>
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-md">
                Completed
              </span>
            </div>
          </div>
          <div className="border-t p-3 text-center text-gray-600 text-sm cursor-pointer hover:bg-gray-50">
            Show All Progress ▼
          </div>
        </section>

        {/* Assignments Card */}
        <section className="bg-white shadow-md rounded-lg">
          <div className="flex items-center gap-2 border-b p-4">
            <FaTasks className="text-xl text-gray-700" />
            <h2 className="text-lg font-semibold">Assignments</h2>
          </div>
          <div className="p-4">
            <p className="mb-2">
              Memulai Dasar Pemrograman untuk Menjadi Pengembang Software
            </p>
            <div className="flex justify-between items-center text-sm">
              <span></span>
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-md">
                Completed
              </span>
            </div>
          </div>
          <div className="border-t p-3 text-center text-gray-600 text-sm cursor-pointer hover:bg-gray-50">
            Show All Progress ▼
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
