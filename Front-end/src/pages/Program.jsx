import React from "react";
import TrustedPartners from "../components/TrustedPartners";
import MentorShowcase from "../components/MentorShowcase";

function Program() {
  const partnerLogos = [
    "/assets/google.png",
    "/assets/ibm.png",
    "/assets/kampus merdeka.png",
    "/assets/microsoft.jpg",
  ];
  const mentors = [
    {
      name: "John Doe",
      role: "Senior Backend Developer",
      image: "/assets/mentor1.jpg",
    },
    {
      name: "Jane Smith",
      role: "AI Engineer",
      image: "/assets/mentor2.jpg",
    },
    {
      name: "Michael Andrew",
      role: "Software Architect",
      image: "/assets/mentor3.jpg",
    },
    {
      name: "Alicia Gomez",
      role: "UI/UX Specialist",
      image: "/assets/mentor4.jpg",
    },
  ];

  return (
    <div className="bg-[#C2A68C] min-h-screen flex flex-col items-center py-10">
      {/* Bagian Atas: Gambar & Deskripsi */}
      <div className="w-11/12 md:w-4/5 flex flex-col md:flex-row items-center md:items-start gap-10 py-12">
        {/* Gambar Utama */}
        <img
          src="/assets/Gemini_Generated_Image_6pk6d96pk6d96pk6.png"
          alt="Main Program Image"
          className="w-full md:w-[480px] rounded-2xl shadow-xl border-[6px] border-[#5a4635]"
        />

        {/* Deskripsi */}
        <div className="max-w-xl text-center md:text-left">
          <h1 className="text-[#3a2f23] text-4xl font-bold mb-4 leading-snug">
            Tingkatkan Skillmu Bersama Mentoring Aeterna
          </h1>

          <p className="text-[#3a2f23] text-lg leading-relaxed">
            Bergabung dengan lebih dari{" "}
            <span className="font-semibold">1.5 juta anggota</span> yang telah
            belajar bersama di Aeterna. Kembangkan keterampilanmu dan raih karir
            impianmu melalui mentoring, kelas intensif, dan program pembelajaran
            terstruktur.
          </p>
        </div>
      </div>

      {/* Gambar Pendukung */}
      <div className="w-11/12 md:w-4/5 mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <img
          src="/assets/Gemini_Generated_Image_304x57304x57304x.png"
          className="w-full rounded-xl shadow-lg border-[5px] border-[#5a4635]"
        />

        <img
          src="/assets/Gemini_Generated_Image_b201v4b201v4b201.png"
          className="w-full rounded-xl shadow-lg border-[5px] border-[#5a4635]"
        />

        <img
          src="/assets/Gemini_Generated_Image_304x57304x57304x.png"
          className="w-full rounded-xl shadow-lg border-[5px] border-[#5a4635]"
        />

        <img
          src="/assets/Gemini_Generated_Image_b201v4b201v4b201.png"
          className="w-full rounded-xl shadow-lg border-[5px] border-[#5a4635]"
        />
      </div>

      {/* Section Partner */}
      <TrustedPartners logos={partnerLogos} />

      {/* Section Mentor */}
      <MentorShowcase mentors={mentors} />

      {/* Footer */}
      <footer className="w-full bg-[#f8f8f8] mt-20 py-14 border-t">
        <div className="w-11/12 md:w-4/5 mx-auto grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-10">
          {/* Alamat */}
          <div>
            <img
              src="/assets/Logo Sistem Mentoring.png"
              className="w-32 mb-4"
              alt="Aeterna Logo"
            />
            <p className="text-gray-700 leading-relaxed">
              Aeterna Space <br />
              Jl. Contoh No. 123, Jakarta <br />
              Indonesia
            </p>

            {/* Sosial Media */}
            <div className="flex gap-4 mt-4 text-xl">
              <i className="fab fa-instagram cursor-pointer"></i>
              <i className="fab fa-youtube cursor-pointer"></i>
              <i className="fab fa-twitter cursor-pointer"></i>
              <i className="fab fa-facebook cursor-pointer"></i>
            </div>
          </div>

          {/* Menu */}
          <div>
            <h3 className="font-bold text-lg mb-3 text-gray-800">Program</h3>
            <ul className="text-gray-600 space-y-2">
              <li>Mentor</li>
              <li>Mentee</li>
              <li>Kelas Intensif</li>
              <li>Career Bootcamp</li>
            </ul>
          </div>

          {/* Perusahaan */}
          <div>
            <h3 className="font-bold text-lg mb-3 text-gray-800">Perusahaan</h3>
            <ul className="text-gray-600 space-y-2">
              <li>Tentang Kami</li>
              <li>Blog</li>
              <li>Hubungi</li>
              <li>FAQ</li>
            </ul>
          </div>

          {/* Penghargaan */}
          <div>
            <h3 className="font-bold text-lg mb-3 text-gray-800">
              Penghargaan
            </h3>
            <img
              src="/assets/Logo Sistem Mentoring.png"
              className="w-40"
              alt="Award"
            />
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-gray-500 text-sm mt-10">
          © 2025 Aeterna | Sistem Mentoring Indonesia
        </div>
      </footer>
    </div>
  );
}

export default Program;
