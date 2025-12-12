import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useLearningPaths } from "../../../hooks/useLearningPaths";

const LearningPath = () => {
  const {
    learningPaths,
    loading,
    createLearningPath,
    deleteLearningPath,
  } = useLearningPaths();

  const [form, setForm] = useState({
    title: "",
    description: "",
  });

  const [creating, setCreating] = useState(false);

  const handleCreate = async () => {
    if (!form.title.trim()) return alert("Title wajib diisi");

    try {
      setCreating(true);
      await createLearningPath(form);
      setForm({ title: "", description: "" });
    } catch  {
      alert("Gagal membuat learning path");
    } finally {
      setCreating(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Learning Path</h1>

      {/* Form Create */}
      <div className="bg-white rounded-2xl shadow p-6 mb-6">
        <h2 className="text-lg font-medium mb-3">Create Learning Path</h2>

        <input
          className="border p-2 rounded w-full mb-2"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <textarea
          className="border p-2 rounded w-full mb-2"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
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
        <h2 className="text-lg font-medium mb-4">Learning Path List</h2>

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
                  <p className="text-gray-500 text-sm">{lp.description}</p>
                </div>

                <div className="flex gap-2">
                  {/* 👉 BUTTON MENUJU DETAIL */}
                  <Link
                    to={`/admin/learning-path/${lp.id}`}
                    className="bg-green-600 text-white px-3 py-1 rounded-lg"
                  >
                    Detail
                  </Link>

                  <button
                    onClick={() => deleteLearningPath(lp.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-lg"
                  >
                    Delete
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
