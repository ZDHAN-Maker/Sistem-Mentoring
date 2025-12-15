import React from "react";

function MentorShowcase({ mentors }) {
  return (
    <div className="w-11/12 md:w-4/5 mx-auto mt-20">
      <h2 className="text-center text-3xl md:text-4xl font-bold text-[#3a2f23] mb-10">
        Mentor Kami
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
        {mentors.map((mentor, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-lg p-5 flex flex-col items-center transition hover:-translate-y-2 hover:shadow-xl"
          >
            <img
              src={mentor.image}
              alt={mentor.name}
              className="w-32 h-32 object-cover rounded-full border-[4px] border-[#C2A68C] mb-4"
            />

            <h3 className="text-lg font-semibold text-[#3a2f23]">
              {mentor.name}
            </h3>

            <p className="text-sm text-gray-600 mt-1 text-center">
              {mentor.role}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MentorShowcase;
