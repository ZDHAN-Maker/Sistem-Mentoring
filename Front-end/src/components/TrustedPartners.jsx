import React from "react";

export default function TrustedPartners({ logos }) {
  return (
    <div className="w-full bg-[#E9DCC8] py-16 mt-20 border-t border-[#b4987c]">
      <h2 className="text-center text-3xl font-bold text-[#3a2f23] mb-6">
        Telah Dipercaya Oleh
      </h2>

      <p className="text-center text-[#3a2f23] opacity-80 mb-10">
        Kami berkolaborasi dengan berbagai perusahaan dan institusi ternama.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 w-11/12 mx-auto">
        {logos.map((logo, i) => (
          <div
            key={i}
            className="p-5 bg-[#f8f5f1] border border-[#bba28a] rounded-xl shadow-md flex items-center justify-center
                       hover:shadow-xl hover:scale-[1.05] transition-all"
          >
            <img
              src={logo}
              alt={`Partner Logo ${i}`}
              className="max-h-14 object-contain opacity-90 hover:opacity-100 transition"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
