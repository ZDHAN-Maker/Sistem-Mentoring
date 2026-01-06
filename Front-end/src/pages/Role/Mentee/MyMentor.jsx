import React from "react";
import {
  UserCircleIcon,
  EnvelopeIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/solid";
import useMyMentor from "../../../hooks/mentee/useMyMentor";

const MyMentor = () => {
  const { mentor, loading } = useMyMentor();

  if (loading) {
    return (
      <div className="bg-white/60 backdrop-blur-md rounded-xl shadow p-6">
        <p className="text-gray-500">Loading mentor...</p>
      </div>
    );
  }

  if (!mentor) {
    return (
      <div className="bg-white/60 backdrop-blur-md rounded-2xl shadow p-6 text-center">
        <UserCircleIcon className="w-16 h-16 mx-auto text-gray-400 mb-3" />
        <p className="text-gray-500 text-lg">Anda belum memiliki mentor aktif</p>
      </div>
    );
  }

  return (
    <div className="p-6">

      <div className="bg-white/60 backdrop-blur-md rounded-2xl shadow border border-gray-200 p-6 flex items-center gap-6">
        
        {/* Avatar Icon */}
        <div className="w-20 h-20 rounded-full bg-[#8B5E34]/20 flex items-center justify-center shadow-inner">
          <UserCircleIcon className="w-14 h-14 text-[#8B5E34]" />
        </div>

        {/* Info Section */}
        <div className="flex-1">
          <p className="text-xl font-semibold text-gray-800">{mentor.name}</p>

          <p className="text-gray-600 flex items-center gap-2 mt-1">
            <EnvelopeIcon className="w-5 h-5 text-[#8B5E34]" />
            {mentor.email}
          </p>

          <span className="inline-flex items-center mt-3 px-3 py-1 text-sm rounded-full bg-green-100 text-green-700 font-medium gap-1">
            <CheckCircleIcon className="w-4 h-4" />
            Mentor Aktif
          </span>
        </div>
      </div>
    </div>
  );
};

export default MyMentor;
