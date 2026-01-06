import React from "react";
import { CheckCircle } from "lucide-react";

export default function MaterialItem({ material, progress, onClick }) {
  const completed = progress?.is_completed;
  const watch = progress?.watch_duration || 0;

  return (
    <div
      onClick={onClick}
      className="
        flex flex-col gap-1 py-4 cursor-pointer 
        hover:bg-[#F3E9DB] transition
        border-b border-[#D6C4AC]
      "
    >
      {/* Row title + icon */}
      <div className="flex items-center gap-3">
        <CheckCircle
          size={22}
          className={completed ? "text-[#B48A60]" : "text-gray-400"}
        />

        <span className="text-lg font-medium text-[#5A4632]">
          {material.title}
        </span>
      </div>

      {/* Progress text */}
      <div className="pl-9 text-sm text-[#6B5A45]">
        Progress: {watch}s{" "}
        {completed ? (
          <span className="text-[#B48A60] font-semibold">• Selesai</span>
        ) : (
          <span className="text-blue-600">• Belum selesai</span>
        )}
      </div>
    </div>
  );
}
