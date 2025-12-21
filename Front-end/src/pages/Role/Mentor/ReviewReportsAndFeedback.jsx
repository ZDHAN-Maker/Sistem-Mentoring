import React from "react";
import MentorCard from "../../../components/Card";
import { useMentorDashboard } from "../../../hooks/Mentor/useReviewReportMentor";

export default function ReviewReports() {
  const mentorId = 1; // nanti bisa diganti dari auth context
  const { data, loading } = useMentorDashboard(mentorId);

  if (loading) return <p className="p-8">Loading...</p>;
  if (!data)
    return (
      <div className="bg-white rounded-2xl shadow p-6">
        <p className="text-gray-500">
          Data Mentee Tidak Ditemukan.
        </p>
      </div>
    );

  // backend structure:
  // {
  //   mentor: {},
  //   program: "",
  //   totalMentee,
  //   totalSession,
  //   completedSession,
  //   progress
  // }

  const cardData = {
    id: mentorId,
    title: data.program,
    mentor: data.mentor.name,
    totalMentor: data.totalMentee,
    mentorCount: data.totalMentee,
    totalSession: data.totalSession,
    sessionCount: data.completedSession,
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-semibold mb-6">Review Mentee</h1>

          {/* === Container Card === */}
          <div className="grid grid-cols-1 gap-6">
            <MentorCard
              key={cardData.id}
              title={cardData.title}
              mentor={cardData.mentor}
              totalMentor={cardData.totalMentor}
              mentorCount={cardData.mentorCount}
              totalSession={cardData.totalSession}
              sessionCount={cardData.sessionCount}
              onDownload={() => console.log("Downloading report:", cardData.id)}
              onFeedback={() => console.log("Feedback for:", cardData.id)}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
