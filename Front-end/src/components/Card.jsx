import React from "react";
import { Download, Users, User, MessageCircle } from "lucide-react";

export default function MentorCard({
  title,
  mentor,
  totalMentor,
  mentorCount,
  totalSession,
  sessionCount,
  onDownload = () => {},
  onFeedback = () => {},
}) {
  const progress = totalSession ? (sessionCount / totalSession) * 100 : 0;

  return (
    <div className="w-72 bg-[#E9D8C5] rounded-xl p-4 shadow-md relative">
      {/* Download Button */}
      <button
        className="absolute top-3 right-3 hover:opacity-70 transition"
        onClick={onDownload}
      >
        <Download size={18} />
      </button>

      {/* Title */}
      <div className="flex items-start gap-2 mb-3">
        <Users size={22} />
        <h2 className="text-sm font-semibold leading-tight">{title}</h2>
      </div>

      {/* Mentor Name */}
      <div className="flex items-center gap-2 text-sm mb-1">
        <User size={16} />
        <span>Mentor: {mentor}</span>
      </div>

      {/* Mentor Count */}
      <div className="flex items-center gap-2 text-sm mb-1">
        <Users size={16} />
        <span>Total Mentor: {mentorCount}/{totalMentor}</span>
      </div>

      {/* Session Count */}
      <div className="flex items-center gap-2 text-sm mb-2">
        <Users size={16} />
        <span>Sesi: {sessionCount}/{totalSession}</span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-3 bg-white rounded-full overflow-hidden mb-3">
        <div
          className="h-full bg-green-500 transition-all"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Feedback Button */}
      <button
        className="flex items-center gap-2 text-green-700 hover:opacity-70 transition text-sm"
        onClick={onFeedback}
      >
        <MessageCircle size={16} />
        Feedback
      </button>
    </div>
  );
}
