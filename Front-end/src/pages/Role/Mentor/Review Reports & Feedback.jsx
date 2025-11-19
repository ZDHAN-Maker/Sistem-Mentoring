import React from "react";
import MentorCard from "../../../components/Card";

export default function ReviewReports() {

  // --- Nanti ini bisa diambil dari API ---
  const data = [
    {
      id: 1,
      title: "Memulai Dasar Pemrograman untuk Menjadi Pengembang Software",
      mentor: "Budi",
      totalMentor: 12,
      mentorCount: 7,
      totalSession: 12,
      sessionCount: 6,
    },
  ];

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      {/* Sidebar */}
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-semibold mb-6">Give Task Mentor</h1>

          {/* === Container Card === */}
          <div className="grid grid-cols-1 gap-6">
            {data.map((item) => (
              <MentorCard
                key={item.id}
                title={item.title}
                mentor={item.mentor}
                totalMentor={item.totalMentor}
                mentorCount={item.mentorCount}
                totalSession={item.totalSession}
                sessionCount={item.sessionCount}
                onDownload={() => console.log("Downloading report:", item.id)}
                onFeedback={() => console.log("Feedback for:", item.id)}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
