import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useLearningPaths } from "../../../hooks/Admin/useLearningPaths";
import { PlusCircleIcon, BookOpenIcon, TrashIcon } from "@heroicons/react/24/outline";

const LearningPath = () => {
  const {
    learningPaths,
    loading,
    error,
    createLearningPath,
    deleteLearningPath,
  } = useLearningPaths();

  const [form, setForm] = useState({
    title: "",
    description: "",
  });

  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const handleCreate = async () => {
    if (!form.title.trim()) {
      alert("Title wajib diisi");
      return;
    }

    try {
      setCreating(true);
      await createLearningPath(form);
      setForm({ title: "", description: "" });
    } catch {
      alert("Gagal membuat learning path");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus learning path ini?")) return;

    try {
      setDeletingId(id);
      await deleteLearningPath(id);
    } catch {
      alert("Gagal menghapus learning path");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6 bg-[#F7F3EF] min-h-screen">

      {/* Title */}
      <h1 className="text-3xl font-bold text-[#8B6F47] mb-6 flex items-center gap-2">
        <BookOpenIcon className="w-8 h-8 text-[#8B6F47]" />
        Learning Path
      </h1>

      {/* Error */}
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4 border border-red-300">
          {error}
        </div>
      )}

      {/* Create Learning Path Form */}
      <div className="bg-white rounded-2xl shadow-md p-6 mb-8 border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-[#8B6F47]">
          <PlusCircleIcon className="w-6 h-6" />
          Create Learning Path
        </h2>

        <input
          className="border rounded-lg w-full p-3 mb-3 focus:ring focus:ring-[#C2A68C] outline-none"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <textarea
          className="border rounded-lg w-full p-3 mb-4 focus:ring focus:ring-[#C2A68C] outline-none"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <button
          onClick={handleCreate}
          disabled={creating}
          className={`px-5 py-2 rounded-xl text-white font-medium transition ${
            creating
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-[#8B6F47] hover:bg-[#7a603d]"
          }`}
        >
          {creating ? "Saving..." : "Create"}
        </button>
      </div>

      {/* Learning Path List */}
      <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-[#8B6F47]">
          Learning Path List
        </h2>

        {learningPaths.length === 0 ? (
          <p className="text-gray-500">Belum ada learning path.</p>
        ) : (
          <div className="space-y-4">
            {learningPaths.map((lp) => (
              <div
                key={lp.id}
                className="border rounded-xl p-5 flex justify-between items-center bg-[#FAF7F4]"
              >
                <div>
                  <p className="font-semibold text-lg text-[#6B5638]">
                    {lp.title}
                  </p>
                  <p className="text-gray-600 text-sm">{lp.description || "-"}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Mentor: {lp.mentors_count} | Mentee: {lp.mentees_count}
                  </p>
                </div>

                <div className="flex gap-2">
                  {/* Detail Button */}
                  <Link
                    to={`/admin-dashboard/learning-path/${lp.id}`}
                    className="px-4 py-2 rounded-lg text-white bg-[#8B6F47] hover:bg-[#7a603d] transition"
                  >
                    Detail
                  </Link>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDelete(lp.id)}
                    disabled={deletingId === lp.id}
                    className={`flex items-center gap-1 px-4 py-2 rounded-lg text-white transition ${
                      deletingId === lp.id
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-red-600 hover:bg-red-700"
                    }`}
                  >
                    <TrashIcon className="w-5 h-5" />
                    {deletingId === lp.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LearningPath;
