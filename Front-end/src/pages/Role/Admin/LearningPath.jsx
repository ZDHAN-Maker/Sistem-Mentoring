import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useLearningPaths } from "../../../hooks/Admin/useLearningPaths";

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
    <div>
      <h1 className="text-2xl font-semibold mb-4">Learning Path</h1>

      {/* Error */}
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Form Create */}
      <div className="bg-white rounded-2xl shadow p-6 mb-6">
        <h2 className="text-lg font-medium mb-3">Create Learning Path</h2>

        <input
          className="border p-2 rounded w-full mb-2"
          placeholder="Title"
          value={form.title}
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
        />

        <textarea
          className="border p-2 rounded w-full mb-3"
          placeholder="Description"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        <button
          onClick={handleCreate}
          disabled={creating}
          className={`px-4 py-2 rounded-lg text-white ${
            creating ? "bg-gray-500" : "bg-blue-600"
          }`}
        >
          {creating ? "Saving..." : "Create"}
        </button>
      </div>

      {/* List Learning Paths */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-lg font-medium mb-4">
          Learning Path List
        </h2>

        {learningPaths.length === 0 ? (
          <p className="text-gray-500">Belum ada learning path.</p>
        ) : (
          <div className="space-y-4">
            {learningPaths.map((lp) => (
              <div
                key={lp.id}
                className="border rounded-xl p-4 flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">{lp.title}</p>
                  <p className="text-gray-500 text-sm">
                    {lp.description || "-"}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Mentor: {lp.mentors_count} | Mentee:{" "}
                    {lp.mentees_count}
                  </p>
                </div>

                <div className="flex gap-2">
                  {/* ✅ FIXED ROUTE */}
                  <Link
                    to={`/admin-dashboard/learning-path/${lp.id}`}
                    className="bg-green-600 text-white px-3 py-1 rounded-lg"
                  >
                    Detail
                  </Link>

                  <button
                    onClick={() => handleDelete(lp.id)}
                    disabled={deletingId === lp.id}
                    className={`px-3 py-1 rounded-lg text-white ${
                      deletingId === lp.id
                        ? "bg-gray-400"
                        : "bg-red-500"
                    }`}
                  >
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
