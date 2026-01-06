import React, { useEffect, useState } from "react";

export default function MaterialDetail({ material, onBack }) {
  const noteKey = `mentee_note_${material.id}`;
  const [note, setNote] = useState("");

  // Load note dari localStorage saat komponen dibuka
  useEffect(() => {
    const saved = localStorage.getItem(noteKey);
    if (saved) setNote(saved);
  }, [noteKey]);

  // Save otomatis saat user mengetik
  const handleChange = (e) => {
    const value = e.target.value;
    setNote(value);
    localStorage.setItem(noteKey, value);
  };

  return (
    <div className="space-y-6 bg-[#E9DCC8] p-6 rounded-xl shadow-md border border-[#D6C4AC]">

      <button
        className="text-[#8A6B4F] font-medium hover:underline"
        onClick={onBack}
      >
        ← Kembali
      </button>

      <h1 className="text-3xl font-bold text-[#5A4632]">
        {material.title}
      </h1>

      {material.video_url ? (
        <video
          controls
          className="w-full rounded-lg border border-[#C9B79C]"
          src={material.video_url}
        />
      ) : (
        <p className="text-slate-600">Video tidak tersedia</p>
      )}

      {/* === CATATAN MENTEE === */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold text-[#5A4632] mb-2">
          Catatan Saya
        </h2>

        <textarea
          value={note}
          onChange={handleChange}
          placeholder="Tulis catatan kecil tentang materi ini..."
          className="
            w-full h-32 p-3 rounded-lg border 
            border-[#C9B79C] bg-[#F7EFE3] text-[#5A4632] 
            focus:outline-none focus:ring-2 focus:ring-[#B48A60]
          "
        />

        <p className="text-sm text-[#8A6B4F] mt-1 italic">
          Catatan tersimpan otomatis.
        </p>
      </div>
    </div>
  );
}
