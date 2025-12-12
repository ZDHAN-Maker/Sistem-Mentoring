import React, { useState, useEffect } from "react";
import axios from "../../../axiosInstance";

const GiveTask = () => {
  const mentorId = localStorage.getItem("id");

  const [mentees, setMentees] = useState([]);
  const [pairings, setPairings] = useState([]);

  const [form, setForm] = useState({
    mentee_id: "",
    pairing_id: "",
    judul: "",
    deskripsi: "",
    type: "file",
    file_path: null,
    link_url: "",
  });

  // AMBIL MENTEE & PAIRING
  useEffect(() => {
    const fetchData = async () => {
      try {
        const menteeRes = await axios.get(`/mentors/${mentorId}/mentees`);
        const pairingRes = await axios.get(`/mentors/${mentorId}/schedules`);

        setMentees(menteeRes.data);
        setPairings(pairingRes.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [mentorId]);

  // SUBMIT TUGAS
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("mentee_id", form.mentee_id);
    data.append("pairing_id", form.pairing_id);
    data.append("judul", form.judul);
    data.append("deskripsi", form.deskripsi);
    data.append("type", form.type);

    if (form.type === "file" && form.file_path) {
      data.append("file", form.file_path);
    }

    if (form.type === "link") {
      data.append("file_path", form.link_url);
    }

    try {
      await axios.post(`/mentors/${mentorId}/tasks`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Tugas berhasil diberikan!");
    } catch (err) {
      console.error(err);
      alert("Gagal memberikan tugas.");
    }
  };

  return (
    <div className="bg-[#EFE7DD] p-8 rounded-xl shadow-md max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-[#6B4F35] mb-6">
        Berikan Tugas Baru
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* MENTEE */}
        <div>
          <label className="text-[#6B4F35] font-medium">Pilih Mentee</label>
          <select
            className="w-full border p-3 rounded-lg mt-1 bg-white"
            onChange={(e) => setForm({ ...form, mentee_id: e.target.value })}
          >
            <option value="">-- Pilih Mentee --</option>
            {mentees.map((m) => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>

        {/* PAIRING */}
        <div>
          <label className="text-[#6B4F35] font-medium">
            Pilih Pairing / Jadwal
          </label>
          <select
            className="w-full border p-3 rounded-lg mt-1 bg-white"
            onChange={(e) => setForm({ ...form, pairing_id: e.target.value })}
          >
            <option value="">-- Pilih Pairing --</option>
            {pairings.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title} - {p.date}
              </option>
            ))}
          </select>
        </div>

        {/* JUDUL */}
        <div>
          <label className="text-[#6B4F35] font-medium">Judul Tugas</label>
          <input
            type="text"
            className="w-full border p-3 rounded-lg mt-1"
            placeholder="Contoh: Buat Laporan Mingguan"
            onChange={(e) => setForm({ ...form, judul: e.target.value })}
          />
        </div>

        {/* DESKRIPSI */}
        <div>
          <label className="text-[#6B4F35] font-medium">Deskripsi</label>
          <textarea
            className="w-full border p-3 rounded-lg mt-1 h-28"
            placeholder="Instruksi tugas..."
            onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
          ></textarea>
        </div>

        {/* TYPE */}
        <div>
          <label className="text-[#6B4F35] font-medium">Jenis Tugas</label>
          <select
            className="w-full border p-3 rounded-lg mt-1 bg-white"
            onChange={(e) => setForm({ ...form, type: e.target.value })}
          >
            <option value="file">File Upload</option>
            <option value="video">Video</option>
            <option value="link">Link (URL)</option>
          </select>
        </div>

        {/* INPUT FILE */}
        {form.type === "file" && (
          <div>
            <label className="text-[#6B4F35] font-medium">Upload File</label>
            <input
              type="file"
              className="w-full mt-2"
              onChange={(e) =>
                setForm({ ...form, file_path: e.target.files[0] })
              }
            />
          </div>
        )}

        {/* LINK */}
        {form.type === "link" && (
          <div>
            <label className="text-[#6B4F35] font-medium">URL Tugas</label>
            <input
              type="text"
              className="w-full border p-3 rounded-lg mt-1"
              placeholder="https://contoh-link.com"
              onChange={(e) => setForm({ ...form, link_url: e.target.value })}
            />
          </div>
        )}

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          className="w-full bg-[#6B4F35] hover:bg-[#5A3F29] text-white py-3 rounded-lg font-bold"
        >
          Berikan Tugas
        </button>
      </form>
    </div>
  );
};

export default GiveTask;
