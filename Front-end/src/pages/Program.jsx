import React from "react";
import TrustedPartners from "../components/TrustedPartners";
import MentorShowcase from "../components/MentorShowcase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faMedal,
  faChalkboardTeacher,
  faRocket,
} from "@fortawesome/free-solid-svg-icons";

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

  const reasons = [
    {
      icon: faChalkboardTeacher,
      title: "Mentor Berpengalaman",
      desc: "Belajar langsung dari para profesional di bidangnya.",
    },
    {
      icon: faUsers,
      title: "Komunitas Besar",
      desc: "Terhubung dengan lebih dari 1.5 juta pelajar di seluruh Indonesia.",
    },
    {
      icon: faMedal,
      title: "Pembelajaran Berkualitas",
      desc: "Kurikulum yang dirancang untuk kebutuhan industri saat ini.",
    },
    {
      icon: faRocket,
      title: "Akselerasi Karier",
      desc: "Program intensif untuk membantumu mencapai tujuan karier.",
    },
  ];

  return (
    <div className="bg-[#C9B29A] min-h-screen flex flex-col items-center overflow-hidden">
      {/* ---------------- HEADER SECTION ---------------- */}
      <div className="w-11/12 md:w-4/5 flex flex-col md:flex-row items-center gap-14 py-16">
        <img
          src="/assets/Gemini_Generated_Image_6pk6d96pk6d96pk6.png"
          alt="Main"
          className="w-full md:w-[450px] rounded-3xl shadow-xl border-[6px] border-[#5a4635] hover:scale-[1.02] transition-transform"
        />

        <div className="max-w-xl text-center md:text-left">
          <h1 className="text-[#3a2f23] text-5xl font-extrabold mb-6 leading-snug">
            Tingkatkan Skillmu Bersama Aeterna Mentoring
          </h1>

          <p className="text-[#3a2f23] text-lg leading-relaxed opacity-90">
            Bergabung dengan lebih dari{" "}
            <span className="font-semibold">1.5 juta anggota</span> yang telah
            berkembang bersama di Aeterna. Dapatkan mentoring eksklusif,
            pembelajaran terstruktur, dan dukungan komunitas yang solid.
          </p>

          <button className="mt-6 px-8 py-3 bg-[#5a4635] text-white rounded-xl shadow-lg hover:bg-[#463627] transition-all">
            Mulai Belajar Sekarang
          </button>
        </div>
      </div>

      {/* ---------------- SUPPORTING IMAGES ---------------- */}
      <div className="w-11/12 md:w-4/5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[
          "/assets/Gemini_Generated_Image_304x57304x57304x.png",
          "/assets/Gemini_Generated_Image_b201v4b201v4b201.png",
          "/assets/Gemini_Generated_Image_304x57304x57304x.png",
          "/assets/Gemini_Generated_Image_b201v4b201v4b201.png",
        ].map((src, i) => (
          <img
            key={i}
            src={src}
            className="w-full rounded-xl shadow-xl border-[5px] border-[#5a4635] hover:scale-[1.03] transition-transform"
          />
        ))}
      </div>

      {/* ---------------- WHY CHOOSE US SECTION ---------------- */}
      <section className="w-11/12 md:w-4/5 mt-20 text-center">
        <h2 className="text-[#3a2f23] text-4xl font-bold mb-4">
          Kenapa Memilih Kami?
        </h2>
        <p className="text-[#3a2f23] opacity-90 mb-10 max-w-2xl mx-auto">
          Kami menyediakan pengalaman belajar terbaik yang dirancang untuk
          membantumu berkembang lebih cepat dan lebih efektif.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {reasons.map((item, i) => (
            <div
              key={i}
              className="bg-[#e8d9c7] px-6 py-10 rounded-2xl shadow-md flex flex-col items-center hover:scale-[1.05] transition-transform cursor-pointer border border-[#b4987c]"
            >
              <div className="bg-[#5a4635] text-white w-16 h-16 flex items-center justify-center rounded-full shadow-md mb-4">
                <FontAwesomeIcon icon={item.icon} size="lg" />
              </div>
              <h3 className="text-xl font-semibold text-[#3a2f23] mb-2">
                {item.title}
              </h3>
              <p className="text-[#3a2f23] opacity-90">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- PARTNERS ---------------- */}
      <TrustedPartners logos={partnerLogos} />

      {/* ---------------- MENTORS ---------------- */}
      <MentorShowcase mentors={mentors} />

      {/* ---------------- FOOTER ---------------- */}
      {/* ---------------- FOOTER ---------------- */}
      <footer className="w-full bg-[#E9DCC8] mt-20 py-16 border-t border-[#b4987c]">
        <div className="w-11/12 md:w-4/5 mx-auto grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-12">
          {/* Alamat */}
          <div>
            <img
              src="/assets/Logo Sistem Mentoring.png"
              className="w-32 mb-4"
              alt="Logo"
            />
            <p className="text-[#3a2f23] leading-relaxed">
              Aeterna Space <br />
              Jl. Contoh No. 123, Jakarta <br />
              Indonesia
            </p>

            <div className="flex gap-5 mt-5 text-2xl text-[#5a4635]">
              <i className="fab fa-instagram hover:text-[#3a2f23] transition cursor-pointer"></i>
              <i className="fab fa-youtube hover:text-[#3a2f23] transition cursor-pointer"></i>
              <i className="fab fa-twitter hover:text-[#3a2f23] transition cursor-pointer"></i>
              <i className="fab fa-facebook hover:text-[#3a2f23] transition cursor-pointer"></i>
            </div>
          </div>

          {/* Menu */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-[#3a2f23]">Program</h3>
            <ul className="text-[#3a2f23] opacity-90 space-y-2">
              <li className="hover:opacity-70 cursor-pointer">Mentor</li>
              <li className="hover:opacity-70 cursor-pointer">Mentee</li>
              <li className="hover:opacity-70 cursor-pointer">
                Kelas Intensif
              </li>
              <li className="hover:opacity-70 cursor-pointer">
                Career Bootcamp
              </li>
            </ul>
          </div>

          {/* Perusahaan */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-[#3a2f23]">
              Perusahaan
            </h3>
            <ul className="text-[#3a2f23] opacity-90 space-y-2">
              <li className="hover:opacity-70 cursor-pointer">Tentang Kami</li>
              <li className="hover:opacity-70 cursor-pointer">Blog</li>
              <li className="hover:opacity-70 cursor-pointer">Hubungi</li>
              <li className="hover:opacity-70 cursor-pointer">FAQ</li>
            </ul>
          </div>

          {/* Penghargaan */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-[#3a2f23]">
              Penghargaan
            </h3>
            <div className="bg-[#f8f5f1] border border-[#bba28a] p-5 rounded-xl shadow-md hover:shadow-xl transition">
              <img
                src="/assets/Logo Sistem Mentoring.png"
                className="w-40 mx-auto"
                alt="Award"
              />
            </div>
          </div>
        </div>

        <div className="text-center text-[#3a2f23] text-sm mt-12 opacity-70">
          © 2025 Aeterna | Sistem Mentoring Indonesia
        </div>
      </footer>
    </div>
  );
}

export default Program;
