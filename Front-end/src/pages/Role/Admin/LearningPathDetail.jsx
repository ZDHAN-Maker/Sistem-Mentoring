import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useLearningPaths } from "../../../hooks/Admin/useLearningPaths";

// Heroicons
import {
  BookOpenIcon,
  UserGroupIcon,
  UserIcon,
  PlusCircleIcon,
  ArrowPathIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

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

  if (loading || !path) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 bg-[#F7F3EF] min-h-screen">
      {/* TITLE */}
      <h1 className="text-3xl font-bold text-[#8B6F47] mb-3 flex items-center gap-2">
        <BookOpenIcon className="w-9 h-9 text-[#8B6F47]" />
        {path.title}
      </h1>
      <p className="text-gray-700 mb-6 text-lg">{path.description}</p>

      {/* STAT CARDS */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow border border-gray-200 flex items-center gap-4">
          <UserGroupIcon className="w-10 h-10 text-[#8B6F47]" />
          <div>
            <p className="text-lg font-semibold text-gray-700">Total Mentor</p>
            <p className="text-3xl font-bold text-[#8B6F47]">
              {path.mentors_count}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow border border-gray-200 flex items-center gap-4">
          <UserGroupIcon className="w-10 h-10 text-[#C2A68C]" />
          <div>
            <p className="text-lg font-semibold text-gray-700">Total Mentee</p>
            <p className="text-3xl font-bold text-[#8B6F47]">
              {path.mentees_count}
            </p>
          </div>
        </div>
      </div>

      {/* MENTORS LIST */}
      <div className="bg-white p-6 rounded-2xl shadow border border-gray-200 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-[#8B6F47] flex items-center gap-2">
          <UserIcon className="w-6 h-6 text-[#8B6F47]" />
          Mentor List
        </h2>

        {path.mentors.length === 0 ? (
          <p className="text-gray-500">Belum ada mentor.</p>
        ) : (
          path.mentors.map((mentor) => (
            <div
              key={mentor.id}
              className="flex justify-between items-center bg-[#FAF7F4] border border-gray-200 p-4 rounded-xl mb-3"
            >
              <div className="flex items-center gap-2">
                <UserIcon className="w-6 h-6 text-[#8B6F47]" />
                <p className="font-semibold">{mentor.name}</p>
              </div>

              <button
                onClick={async () => {
                  await removeMentor(id, mentor.id);
                  fetch();
                }}
                className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
              >
                <TrashIcon className="w-5 h-5" />
                Remove
              </button>
            </div>
          ))
        )}
      </div>

      {/* ASSIGN MENTOR */}
      <div className="bg-white p-6 rounded-2xl shadow border border-gray-200 mb-8">
        <h3 className="text-lg font-semibold mb-3 text-[#8B6F47] flex items-center gap-2">
          <PlusCircleIcon className="w-6 h-6" />
          Add Mentor
        </h3>

        <input
          placeholder="Masukkan ID Mentor"
          className="border p-3 rounded-lg w-full mb-3 focus:ring focus:ring-[#C2A68C] outline-none"
          value={mentorId}
          onChange={(e) => setMentorId(e.target.value)}
        />

        <button
          onClick={async () => {
            await assignMentor(id, mentorId);
            setMentorId("");
            fetch();
          }}
          className="bg-[#8B6F47] hover:bg-[#7a603d] text-white px-5 py-2 rounded-xl transition"
        >
          Assign Mentor
        </button>
      </div>

      {/* REPLACE MENTOR */}
      <div className="bg-white p-6 rounded-2xl shadow border border-gray-200 mb-6">
        <h3 className="text-lg font-semibold mb-3 text-[#8B6F47] flex items-center gap-2">
          <ArrowPathIcon className="w-6 h-6" />
          Replace Mentor
        </h3>

        <input
          placeholder="Old Mentor ID"
          className="border p-3 rounded-lg w-full mb-3 focus:ring focus:ring-[#C2A68C] outline-none"
          value={oldMentorId}
          onChange={(e) => setOldMentorId(e.target.value)}
        />

        <input
          placeholder="New Mentor ID"
          className="border p-3 rounded-lg w-full mb-4 focus:ring focus:ring-[#C2A68C] outline-none"
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
          className="bg-[#C2A68C] hover:bg-[#b09172] text-white px-5 py-2 rounded-xl transition"
        >
          Replace Mentor
        </button>
      </div>
    </div>
  );
};

export default LearningPathDetail;
