import React, { useState } from "react";
import { useGiveTask } from "../../../hooks/Mentor/useGivetask";

const GiveTask = () => {
  const { pairings, giveTask, loading, error } = useGiveTask();

  const [form, setForm] = useState({
    pairing_id: "",
    judul: "",
    deskripsi: "",
    type: "file",
    file_path: null,
    link_url: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await giveTask(form);
      alert("Tugas berhasil diberikan!");

      setForm({
        pairing_id: "",
        judul: "",
        deskripsi: "",
        type: "file",
        file_path: null,
        link_url: "",
      });
    } catch (err) {
      console.error(err);
      alert("Gagal memberikan tugas");
    }
  };

  return (
    <div className="bg-[#EFE7DD] p-8 rounded-xl shadow-md max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-[#6B4F35] mb-6">
        Berikan Tugas Baru
      </h1>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* PAIRING */}
        <div>
          <label className="text-[#6B4F35] font-medium">
            Pilih Mentee (Pairing)
          </label>
          <select
            className="w-full border p-3 rounded-lg mt-1 bg-white"
            value={form.pairing_id}
            onChange={(e) =>
              setForm({ ...form, pairing_id: e.target.value })
            }
            required
          >
            <option value="">-- Pilih Mentee --</option>
            {pairings.map((p) => (
              <option key={p.id} value={p.id}>
                {p.mentee?.name}
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
            value={form.judul}
            onChange={(e) =>
              setForm({ ...form, judul: e.target.value })
            }
            required
          />
        </div>

        {/* DESKRIPSI */}
        <div>
          <label className="text-[#6B4F35] font-medium">Deskripsi</label>
          <textarea
            className="w-full border p-3 rounded-lg mt-1 h-28"
            value={form.deskripsi}
            onChange={(e) =>
              setForm({ ...form, deskripsi: e.target.value })
            }
          />
        </div>

        {/* TYPE */}
        <div>
          <label className="text-[#6B4F35] font-medium">Jenis Tugas</label>
          <select
            className="w-full border p-3 rounded-lg mt-1 bg-white"
            value={form.type}
            onChange={(e) =>
              setForm({ ...form, type: e.target.value })
            }
          >
            <option value="file">File Upload</option>
            <option value="link">Link</option>
          </select>
        </div>

        {/* FILE */}
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
              value={form.link_url}
              onChange={(e) =>
                setForm({ ...form, link_url: e.target.value })
              }
            />
          </div>
        )}

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
