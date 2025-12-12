import React from "react";

export default function TrustedPartners({ logos }) {
  return (
    <div className="w-full bg-white py-16 mt-20">
      <h2 className="text-center text-3xl font-bold text-gray-800 mb-10">
        Telah Dipercaya Oleh
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 w-11/12 mx-auto">
        {logos.map((logo, i) => (
          <div
            key={i}
            className="border rounded-xl p-4 bg-white shadow-sm flex items-center justify-center hover:shadow-lg transition"
          >
            <img
              src={logo}
              alt={`Partner Logo ${i}`}
              className="max-h-14 object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
