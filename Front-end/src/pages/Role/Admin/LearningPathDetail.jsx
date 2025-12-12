import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useLearningPaths } from "../../../hooks/useLearningPaths";

const LearningPathDetail = () => {
  const { id } = useParams();
  const { getLearningPathDetail, assignMentor, removeMentor, replaceMentor } =
    useLearningPaths();

  const [path, setPath] = useState(null);
  const [loading, setLoading] = useState(true);

  const [mentorId, setMentorId] = useState("");
  const [oldMentorId, setOldMentorId] = useState("");
  const [newMentorId, setNewMentorId] = useState("");

  const fetch = async () => {
    if (!id) return;
    setLoading(true);

    try {
      const detail = await getLearningPathDetail(id);
      setPath(detail);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetch();
  }, [id]);

  if (!id) return <p className="text-red-500">Invalid ID</p>;
  if (loading || !path) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{path.title}</h1>
      <p className="text-gray-600 mb-6">{path.description}</p>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-lg font-semibold">Total Mentor</p>
          <p className="text-3xl font-bold">{path.mentors_count}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-lg font-semibold">Total Mentee</p>
          <p className="text-3xl font-bold">{path.mentees_count}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h2 className="font-semibold text-xl mb-4">Mentors</h2>

        {path.mentors.length === 0 ? (
          <p className="text-gray-500">Belum ada mentor.</p>
        ) : (
          path.mentors.map((mentor) => (
            <div
              key={mentor.id}
              className="flex justify-between items-center border p-3 rounded-lg mb-2"
            >
              <p>{mentor.name}</p>
              <button
                onClick={async () => {
                  await removeMentor(id, mentor.id);
                  fetch();
                }}
                className="bg-red-500 px-3 py-1 text-white rounded"
              >
                Remove
              </button>
            </div>
          ))
        )}
      </div>

      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h3 className="font-semibold mb-2">Add Mentor</h3>
        <input
          placeholder="Masukkan user_id mentor"
          className="border p-2 rounded w-full mb-2"
          value={mentorId}
          onChange={(e) => setMentorId(e.target.value)}
        />
        <button
          onClick={async () => {
            await assignMentor(id, mentorId);
            setMentorId("");
            fetch();
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Assign Mentor
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="font-semibold mb-2">Replace Mentor</h3>
        <input
          placeholder="Old mentor ID"
          className="border p-2 rounded w-full mb-2"
          value={oldMentorId}
          onChange={(e) => setOldMentorId(e.target.value)}
        />
        <input
          placeholder="New mentor ID"
          className="border p-2 rounded w-full mb-2"
          value={newMentorId}
          onChange={(e) => setNewMentorId(e.target.value)}
        />
        <button
          onClick={async () => {
            await replaceMentor(id, oldMentorId, newMentorId);
            setOldMentorId("");
            setNewMentorId("");
            fetch();
          }}
          className="bg-yellow-600 text-white px-4 py-2 rounded"
        >
          Replace Mentor
        </button>
      </div>
    </div>
  );
};

export default LearningPathDetail;
