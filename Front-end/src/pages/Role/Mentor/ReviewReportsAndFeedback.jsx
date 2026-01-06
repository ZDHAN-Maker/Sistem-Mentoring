import React, { useState } from "react";
import MentorCard from "../../../components/Card";
import useReviewReportMentor  from "../../../hooks/Mentor/useReviewReportMentor";

export default function ReviewReports() {
  const {
    reports,
    loading,
    error,
    submitFeedback,
  } = useReviewReportMentor();

  const [feedbackText, setFeedbackText] = useState({});

  if (loading) return <p className="p-8">Loading...</p>;

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow p-6">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!reports.length) {
    return (
      <div className="bg-white rounded-2xl shadow p-6">
        <p className="text-gray-500">
          Tidak ada progress report mentee.
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-semibold mb-6">
            Review Progress Mentee
          </h1>

          <div className="grid grid-cols-1 gap-6">
            {reports.map((report) => (
              <MentorCard
                key={report.id}
                title={report.mentee.name}
                mentor={report.mentee.email}
                totalMentor="-"
                mentorCount="-"
                totalSession={report.tanggal}
                sessionCount={report.feedback ? "Sudah direview" : "Belum direview"}
                onFeedback={() =>
                  submitFeedback(report.id, feedbackText[report.id])
                }
              >
                {/* Isi Card */}
                <p className="text-gray-700 mb-3">
                  {report.catatan}
                </p>

                <textarea
                  className="w-full border rounded-lg p-2"
                  placeholder="Tulis feedback..."
                  value={feedbackText[report.id] || ""}
                  onChange={(e) =>
                    setFeedbackText({
                      ...feedbackText,
                      [report.id]: e.target.value,
                    })
                  }
                />

                {report.feedback && (
                  <p className="mt-2 text-green-600">
                    Feedback: {report.feedback}
                  </p>
                )}
              </MentorCard>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
